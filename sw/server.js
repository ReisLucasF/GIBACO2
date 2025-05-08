const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { Buffer } = require('buffer');

// Configurar o Express
const app = express();
const port = 3000;

// Habilitar CORS para permitir requisições do frontend
app.use(cors());

// Configurar o middleware para JSON (com limite maior para imagens base64)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Configurar o multer para upload de arquivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Cria diretório para uploads se não existir
    const uploadDir = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Adiciona timestamp para evitar nomes duplicados
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Listar todos os POSTs recebidos
let receivedRequests = [];

// Rota para servir arquivos estáticos (HTML, CSS, JS)
app.use(express.static("public"));

// Função para salvar imagem base64 em arquivo
function saveBase64Image(base64String, uploadDir) {
  // Verificar se é uma string base64 válida
  if (!base64String) return null;
  
  // Se a string incluir o prefixo "data:image/..."
  let base64Data = base64String;
  let fileExtension = 'jpg'; // padrão
  
  if (base64String.includes(';base64,')) {
    // Extrair o tipo de imagem do prefixo
    const matches = base64String.match(/^data:image\/([a-zA-Z0-9]+);base64,/);
    if (matches && matches.length > 1) {
      fileExtension = matches[1];
    }
    
    // Remover o prefixo para obter apenas os dados
    base64Data = base64String.replace(/^data:image\/[a-zA-Z0-9]+;base64,/, '');
  }
  
  // Criar nome de arquivo único
  const fileName = `${Date.now()}.${fileExtension}`;
  const filePath = path.join(uploadDir, fileName);
  
  // Salvar o arquivo
  fs.writeFileSync(filePath, base64Data, { encoding: 'base64' });
  
  return {
    filename: fileName,
    path: filePath,
    mimetype: `image/${fileExtension}`,
    size: Buffer.from(base64Data, 'base64').length
  };
}

// Endpoint para popup-creator (aceita multipart/form-data)
app.post("/popup-creator", upload.single("imagem"), (req, res) => {
  console.log("🔵 POST recebido em /popup-creator");

  // Extrair informações do arquivo
  const fileInfo = req.file
    ? {
        filename: req.file.filename,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: req.file.path,
      }
    : null;

  // Registrar dados recebidos
  const requestData = {
    timestamp: new Date().toISOString(),
    body: req.body,
    file: fileInfo,
  };

  // Adicionar à lista e limitar a 10 itens
  receivedRequests.unshift(requestData);
  if (receivedRequests.length > 10) {
    receivedRequests = receivedRequests.slice(0, 10);
  }

  // Log detalhado no console
  console.log("📄 Dados do formulário:");
  console.table(req.body);

  if (fileInfo) {
    console.log("🖼️  Arquivo recebido:");
    console.table(fileInfo);
  }

  // Responder ao cliente
  res.status(200).json({
    success: true,
    message: "Popup criado com sucesso!",
    requestId: Date.now(),
  });
});

// Endpoint para card-creator (aceita JSON com imagem base64)
app.post("/card-creator", (req, res) => {
  console.log("🔵 POST recebido em /card-creator");
  
  try {
    // Verificar se há body
    if (!req.body) {
      console.log("❌ Corpo da requisição vazio");
      return res.status(400).json({
        success: false,
        message: "Corpo da requisição vazio"
      });
    }
    
    // Extrair dados do corpo
    const { imagemBase64, ...bodyData } = req.body;
    
    // Log para verificação de dados recebidos
    console.log("🔍 Verificando dados recebidos:");
    console.log(`📋 Chaves no objeto: ${Object.keys(req.body).join(", ")}`);
    
    // Verificar se a imagem base64 foi recebida
    if (imagemBase64) {
      console.log("✅ Imagem base64 recebida!");
      
      // Log do tamanho da string base64
      const base64Size = imagemBase64.length;
      console.log(`📏 Tamanho da string base64: ${base64Size} caracteres`);
      
      // Log de uma amostra da string base64 (primeiros 100 caracteres)
      console.log(`🔤 Amostra da string base64: ${imagemBase64.substring(0, 100)}...`);
      
      // Verificar formato da string base64
      const isDataUrl = imagemBase64.startsWith('data:');
      console.log(`🏷️ Formato: ${isDataUrl ? 'DataURL (com prefixo)' : 'String base64 pura'}`);
      
      if (isDataUrl) {
        const matches = imagemBase64.match(/^data:([^;]+);base64,/);
        if (matches && matches.length > 1) {
          console.log(`🖼️ Tipo de mídia: ${matches[1]}`);
        }
      }
    } else {
      console.log("❌ Imagem base64 não encontrada na requisição");
    }
    
    // Criar diretório para uploads se não existir
    const uploadDir = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    // Salvar a imagem base64 se existir
    let fileInfo = null;
    if (imagemBase64) {
      fileInfo = saveBase64Image(imagemBase64, uploadDir);
      console.log("🖼️ Imagem base64 processada:");
      if (fileInfo) {
        console.table(fileInfo);
      } else {
        console.log("❌ Erro ao processar a imagem base64");
      }
    }
    
    // Registrar dados recebidos (sem incluir a imagem base64 completa)
    const requestData = {
      timestamp: new Date().toISOString(),
      body: {
        ...bodyData,
        // Adicionar uma indicação de que a imagem base64 foi recebida, sem incluir o valor completo
        imagemBase64: imagemBase64 ? `[Base64 String: ${imagemBase64.substring(0, 30)}...]` : null
      },
      file: fileInfo,
    };
    
    // Adicionar à lista e limitar a 10 itens
    receivedRequests.unshift(requestData);
    if (receivedRequests.length > 10) {
      receivedRequests = receivedRequests.slice(0, 10);
    }
    
    // Log detalhado no console
    console.log("📄 Dados do formulário (excluindo a imagem base64):");
    console.table(bodyData);
    
    // Responder ao cliente
    res.status(200).json({
      success: true,
      message: "Card criado com sucesso!",
      requestId: Date.now(),
      imageReceived: !!imagemBase64,
      imageInfo: fileInfo
    });
  } catch (error) {
    console.error("❌ Erro ao processar requisição:", error);
    res.status(500).json({
      success: false,
      message: `Erro ao processar a requisição: ${error.message}`,
    });
  }
});

// Endpoint para visualizar todos os requests recebidos
app.get("/requests", (req, res) => {
  res.json(receivedRequests);
});

// Rota de status da API
app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Mock API - Card e Popup Creator</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
          }
          h1 { color: #0047FF; }
          h2 { color: #333; margin-top: 30px; }
          pre {
            background: #f5f5f5;
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
          }
          .request-card {
            background: #fff;
            border: 1px solid #ddd;
            border-radius: 5px;
            padding: 15px;
            margin: 15px 0;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .timestamp {
            color: #777;
            font-size: 0.9em;
          }
          .empty-list {
            background: #f8f8f8;
            padding: 20px;
            text-align: center;
            border-radius: 5px;
            color: #777;
          }
          .file-info {
            background: #e9f7ff;
            padding: 10px;
            border-radius: 5px;
            margin-top: 10px;
          }
          button {
            background: #0047FF;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 5px;
            cursor: pointer;
            font-weight: 500;
          }
          button:hover {
            background: #0035c9;
          }
          .code {
            font-family: monospace;
            background: #f0f0f0;
            padding: 2px 4px;
            border-radius: 3px;
          }
          .endpoint {
            background: #f3f8ff;
            border-left: 3px solid #0047FF;
            padding: 10px 15px;
            margin: 15px 0;
          }
        </style>
      </head>
      <body>
        <h1>API Mock - Formulários de Criação</h1>
        <p>Status: <strong style="color: green;">Online</strong></p>
        <p>Esta API mock está configurada para receber dados do formulário Popup Creator e Card Creator.</p>
        
        <h2>Endpoints disponíveis:</h2>
        <div class="endpoint">
          <h3><span class="code">POST /popup-creator</span></h3>
          <p>Recebe os dados do formulário Popup Creator via multipart/form-data</p>
        </div>
        
        <div class="endpoint">
          <h3><span class="code">POST /card-creator</span></h3>
          <p>Recebe os dados do formulário Card Creator via JSON com imagem em base64</p>
        </div>
        
        <div class="endpoint">
          <h3><span class="code">GET /requests</span></h3>
          <p>Lista todos os requests recebidos (formato JSON)</p>
        </div>
        
        <div class="endpoint">
          <h3><span class="code">GET /</span></h3>
          <p>Esta página</p>
        </div>
        
        <h2>Requisições recebidas</h2>
        <button id="refreshBtn">Atualizar lista</button>
        
        <div id="requestsList"></div>
        
        <script>
          // Função para buscar e exibir as requisições
          async function fetchRequests() {
            try {
              const response = await fetch('/requests');
              const data = await response.json();
              
              const requestsList = document.getElementById('requestsList');
              requestsList.innerHTML = '';
              
              if (data.length === 0) {
                requestsList.innerHTML = '<div class="empty-list">Nenhuma requisição recebida ainda</div>';
                return;
              }
              
              data.forEach(function(req, index) {
                const card = document.createElement('div');
                card.className = 'request-card';
                
                // Extrair dados do formulário
                const formData = req.body;
                const fileInfo = req.file;
                
                let formDataHtml = '';
                for (const key in formData) {
                  if (formData.hasOwnProperty(key) && formData[key] && formData[key].length > 0) {
                    formDataHtml += '<li><strong>' + key + ':</strong> ' + formData[key] + '</li>';
                  }
                }
                
                let fileHtml = '';
                if (fileInfo) {
                  fileHtml = 
                    '<div class="file-info">' +
                      '<h4>Arquivo:</h4>' +
                      '<ul>' +
                        '<li><strong>Nome:</strong> ' + fileInfo.filename + '</li>' +
                        '<li><strong>Tipo:</strong> ' + fileInfo.mimetype + '</li>' +
                        '<li><strong>Tamanho:</strong> ' + Math.round(fileInfo.size / 1024) + ' KB</li>' +
                      '</ul>' +
                    '</div>';
                }
                
                card.innerHTML = 
                  '<h3>Requisição #' + (index + 1) + '</h3>' +
                  '<p class="timestamp"><strong>Recebida em:</strong> ' + new Date(req.timestamp).toLocaleString() + '</p>' +
                  
                  '<h4>Dados do formulário:</h4>' +
                  '<ul>' + formDataHtml + '</ul>' +
                  
                  fileHtml;
                
                requestsList.appendChild(card);
              });
              
            } catch (error) {
              console.error('Erro ao buscar requisições:', error);
            }
          }
          
          // Buscar requisições na inicialização
          fetchRequests();
          
          // Configurar evento de refresh
          document.getElementById('refreshBtn').addEventListener('click', fetchRequests);
        </script>
      </body>
    </html>
  `);
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`✅ API mock rodando em http://localhost:${port}`);
  console.log(`📊 Visualize as requisições em http://localhost:${port}`);
  console.log(`📝 Envie dados para:`);
  console.log(`http://localhost:${port}/popup-creator`);
  console.log(`http://localhost:${port}/card-creator`);
  console.log(`http://localhost:${port}/requests`); // Added endpoint for requests
});