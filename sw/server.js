const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { Buffer } = require("buffer");

const app = express();
const port = 3000;

app.use(cors());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

let receivedRequests = [];

app.use(express.static("public"));

function processRequest(req, endpoint, file = null) {
  const bodyData = { ...req.body };

  if (file) {
    bodyData.imagem = `[UPLOADED_FILE: ${file.originalname}]`;
  }

  if (
    bodyData.imagem &&
    typeof bodyData.imagem === "string" &&
    bodyData.imagem.length > 100
  ) {
    const originalLength = bodyData.imagem.length;

    bodyData.imagem = `${bodyData.imagem.substring(
      0,
      100
    )}... (${originalLength} caracteres)`;
  }

  if (
    bodyData.imagem &&
    typeof bodyData.imagem === "string" &&
    bodyData.imagem.length > 100
  ) {
    const originalLength = bodyData.imagem.length;

    bodyData.imagem = `${bodyData.imagem.substring(
      0,
      100
    )}... (${originalLength} caracteres)`;
  }

  const cleanData = { ...req.body };

  if (file) {
    cleanData.imagem = "[UPLOADED_FILE]";
  }

  if (
    cleanData.imagem &&
    typeof cleanData.imagem === "string" &&
    cleanData.imagem.length > 100
  ) {
    cleanData.imagem = "[BASE64_IMAGE_STRING]";
  }

  if (
    cleanData.imagem &&
    typeof cleanData.imagem === "string" &&
    cleanData.imagem.length > 100
  ) {
    cleanData.imagem = "[BASE64_IMAGE_STRING]";
  }

  const requestData = {
    id: Date.now().toString(),
    endpoint: endpoint,
    timestamp: new Date().toISOString(),
    contentType: req.headers["content-type"] || "unknown",
    body: bodyData,
    cleanBody: JSON.stringify(cleanData, null, 2),
    originalBody: JSON.stringify(req.body, null, 2),
    headers: req.headers,
    file: file
      ? {
          filename: file.filename,
          originalname: file.originalname,
          mimetype: file.mimetype,
          path: file.path,
          size: file.size,
        }
      : null,
  };

  receivedRequests.unshift(requestData);

  if (receivedRequests.length > 10) {
    receivedRequests = receivedRequests.slice(0, 10);
  }

  return requestData;
}

app.post("/popup-creator", upload.single("imagem"), (req, res) => {
  console.log("🔵 POST recebido em /popup-creator");

  const requestData = processRequest(req, "popup-creator", req.file);

  console.log("📄 Dados do formulário:");
  console.table(requestData.body);

  if (req.file) {
    console.log("🖼️ Arquivo recebido:");
    console.table(requestData.file);
  }

  res.status(200).json({
    success: true,
    message: "Popup criado com sucesso!",
    requestId: requestData.id,
  });
});

app.post("/card-creator", (req, res) => {
  console.log("🔵 POST recebido em /card-creator");

  const requestData = processRequest(req, "card-creator");

  console.log("📄 Dados do formulário:");
  console.table(requestData.body);

  res.status(200).json({
    success: true,
    message: "Card criado com sucesso!",
    requestId: requestData.id,
  });
});

app.get("/requests", (req, res) => {
  res.json(receivedRequests);
});

app.get("/request/:id", (req, res) => {
  const requestId = req.params.id;
  const request = receivedRequests.find((r) => r.id === requestId);

  if (!request) {
    return res.status(404).json({
      error: "Requisição não encontrada",
    });
  }

  const format = req.query.format || "clean";

  if (format === "original") {
    res.json({
      requestData: request.originalBody,
    });
  } else {
    res.json({
      requestData: request.cleanBody,
    });
  }
});

app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
            max-height: 400px;
            white-space: pre-wrap;
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
          .json-container {
            display: none;
            margin-top: 15px;
          }
          button {
            background: #0047FF;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 5px;
            cursor: pointer;
            font-weight: 500;
            margin-right: 10px;
            margin-bottom: 10px;
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
          .badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
            margin-right: 8px;
          }
          .badge-popup {
            background-color: #e3f2fd;
            color: #0d47a1;
          }
          .badge-card {
            background-color: #e8f5e9;
            color: #1b5e20;
          }
          .file-info {
            background-color: #f1f8e9;
            border-radius: 4px;
            padding: 10px;
            margin-top: 10px;
          }
          .copy-success {
            background-color: #4caf50;
            color: white;
            padding: 5px 10px;
            border-radius: 4px;
            margin-left: 10px;
            display: none;
          }
          .actions {
            margin-top: 10px;
          }
          .toggle-group {
            margin-top: 10px;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
          }
          .toggle-label {
            margin-right: 10px;
            font-weight: bold;
          }
          .toggle-switch {
            position: relative;
            display: inline-block;
            width: 60px;
            height: 30px;
            margin-right: 10px;
          }
          .toggle-switch input {
            opacity: 0;
            width: 0;
            height: 0;
          }
          .toggle-slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            transition: .4s;
            border-radius: 34px;
          }
          .toggle-slider:before {
            position: absolute;
            content: "";
            height: 22px;
            width: 22px;
            left: 4px;
            bottom: 4px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
          }
          input:checked + .toggle-slider {
            background-color: #0047FF;
          }
          input:checked + .toggle-slider:before {
            transform: translateX(30px);
          }
          .toggle-text {
            font-size: 14px;
          }
          @media (max-width: 768px) {
            pre {
              max-width: 100%;
              overflow-x: auto;
            }
          }
        </style>
      </head>
      <body>
        <h1>API Mock - Formulários de Criação</h1>
        <p>Status: <strong style="color: green;">Online</strong></p>
        <p>Esta API mock está configurada para receber dados dos formulários Popup Creator e Card Creator.</p>
        
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
          <h3><span class="code">GET /request/:id</span></h3>
          <p>Obtém os dados de uma requisição específica (formato JSON)</p>
        </div>
        
        <h2>Requisições recebidas</h2>
        <button id="refreshBtn">Atualizar lista</button>
        
        <div class="toggle-group">
          <span class="toggle-label">Modo de exibição:</span>
          <label class="toggle-switch">
            <input type="checkbox" id="jsonModeToggle">
            <span class="toggle-slider"></span>
          </label>
          <span class="toggle-text" id="jsonModeText">JSON para Documentação</span>
        </div>
        
        <div id="requestsList"></div>
        
        <script>
          // Variável para rastrear o modo de exibição de JSON
          let useOriginalJson = false;
          
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
                
                // Obter badge com base no endpoint
                const badgeClass = req.endpoint === 'popup-creator' ? 'badge-popup' : 'badge-card';
                const badgeText = req.endpoint === 'popup-creator' ? 'Popup' : 'Card';
                
                // Extrair dados do formulário
                const formData = req.body;
                
                let formDataHtml = '';
                for (const key in formData) {
                  if (formData.hasOwnProperty(key)) {
                    // Tratar valores undefined ou null
                    let displayValue = formData[key];
                    if (displayValue === undefined) displayValue = 'undefined';
                    if (displayValue === null) displayValue = 'null';
                    
                    // Truncar strings muito longas
                    if (typeof displayValue === 'string' && displayValue.length > 100) {
                      displayValue = displayValue.substring(0, 100) + '...';
                    }
                    
                    formDataHtml += '<li><strong>' + key + ':</strong> ' + displayValue + '</li>';
                  }
                }
                
                // Informações do arquivo, se houver
                let fileHtml = '';
                if (req.file) {
                  fileHtml = 
                    '<div class="file-info">' +
                      '<h4>Arquivo:</h4>' +
                      '<ul>' +
                        '<li><strong>Nome:</strong> ' + req.file.originalname + '</li>' +
                        '<li><strong>Tipo:</strong> ' + req.file.mimetype + '</li>' +
                        '<li><strong>Tamanho:</strong> ' + Math.round(req.file.size / 1024) + ' KB</li>' +
                      '</ul>' +
                    '</div>';
                }
                
                // Criar container para JSON
                const jsonContainerId = 'json-' + req.id;
                
                card.innerHTML = 
                  '<h3>' +
                    '<span class="badge ' + badgeClass + '">' + badgeText + '</span>' +
                    'Requisição #' + (index + 1) + 
                  '</h3>' +
                  '<p class="timestamp"><strong>Recebida em:</strong> ' + new Date(req.timestamp).toLocaleString() + '</p>' +
                  '<p><strong>Content-Type:</strong> ' + req.contentType + '</p>' +
                  
                  '<h4>Dados do formulário:</h4>' +
                  '<ul>' + formDataHtml + '</ul>' +
                  
                  fileHtml +
                  
                  '<div class="actions">' +
                    '<button class="viewJsonBtn" data-id="' + req.id + '">Ver JSON</button>' +
                    '<button class="copyJsonBtn" data-id="' + req.id + '">Copiar JSON</button>' +
                    '<span id="copy-success-' + req.id + '" class="copy-success">Copiado!</span>' +
                  '</div>' +
                  '<div id="' + jsonContainerId + '" class="json-container">' +
                    '<pre id="json-content-' + req.id + '">Carregando...</pre>' +
                  '</div>';
                
                requestsList.appendChild(card);
              });
              
              // Adicionar event listeners para os botões
              document.querySelectorAll('.viewJsonBtn').forEach(button => {
                button.addEventListener('click', function() {
                  const requestId = this.getAttribute('data-id');
                  const jsonContainer = document.getElementById('json-' + requestId);
                  
                  // Toggle container
                  if (jsonContainer.style.display === 'block') {
                    jsonContainer.style.display = 'none';
                    this.textContent = 'Ver JSON';
                  } else {
                    jsonContainer.style.display = 'block';
                    this.textContent = 'Ocultar JSON';
                    
                    // Carregar o JSON se ainda não foi carregado
                    const jsonContent = document.getElementById('json-content-' + requestId);
                    if (jsonContent.textContent === 'Carregando...') {
                      fetchRequestJson(requestId);
                    }
                  }
                });
              });
              
              document.querySelectorAll('.copyJsonBtn').forEach(button => {
                button.addEventListener('click', function() {
                  const requestId = this.getAttribute('data-id');
                  copyRequestJson(requestId);
                });
              });
              
            } catch (error) {
              console.error('Erro ao buscar requisições:', error);
            }
          }
          
          // Função para buscar JSON de uma requisição específica
          async function fetchRequestJson(requestId) {
            try {
              // Usar o formato com base na configuração atual
              const format = useOriginalJson ? 'original' : 'clean';
              const response = await fetch('/request/' + requestId + '?format=' + format);
              const data = await response.json();
              
              const jsonContent = document.getElementById('json-content-' + requestId);
              jsonContent.textContent = data.requestData;
            } catch (error) {
              console.error('Erro ao buscar JSON:', error);
              const jsonContent = document.getElementById('json-content-' + requestId);
              jsonContent.textContent = 'Erro ao carregar JSON: ' + error.message;
            }
          }
          
          // Função para copiar JSON para a área de transferência
          async function copyRequestJson(requestId) {
            try {
              // Primeiro, garantir que o JSON foi carregado
              const jsonContent = document.getElementById('json-content-' + requestId);
              if (jsonContent.textContent === 'Carregando...') {
                // Carregar o JSON com base na configuração atual
                const format = useOriginalJson ? 'original' : 'clean';
                const response = await fetch('/request/' + requestId + '?format=' + format);
                const data = await response.json();
                jsonContent.textContent = data.requestData;
              }
              
              // Copiar para a área de transferência
              navigator.clipboard.writeText(jsonContent.textContent)
                .then(() => {
                  // Mostrar mensagem de sucesso
                  const copySuccess = document.getElementById('copy-success-' + requestId);
                  copySuccess.style.display = 'inline';
                  
                  // Esconder após 2 segundos
                  setTimeout(() => {
                    copySuccess.style.display = 'none';
                  }, 2000);
                })
                .catch(err => {
                  console.error('Erro ao copiar: ', err);
                  alert('Erro ao copiar JSON: ' + err.message);
                });
            } catch (error) {
              console.error('Erro ao copiar JSON:', error);
              alert('Erro ao copiar JSON: ' + error.message);
            }
          }
          
          // Configurar toggle para alternar entre JSON completo e simplificado
          document.getElementById('jsonModeToggle').addEventListener('change', function() {
            useOriginalJson = this.checked;
            document.getElementById('jsonModeText').textContent = 
              useOriginalJson ? 'JSON Completo (Original)' : 'JSON para Documentação';
              
            // Limpar todos os JSONs carregados para que sejam recarregados no novo formato
            document.querySelectorAll('.json-container').forEach(container => {
              const jsonContent = container.querySelector('pre');
              if (jsonContent) {
                jsonContent.textContent = 'Carregando...';
              }
              // Se o container estiver visível, recarregar o JSON
              if (container.style.display === 'block') {
                const requestId = container.id.replace('json-', '');
                fetchRequestJson(requestId);
              }
            });
          });
          
          // Buscar requisições na inicialização
          fetchRequests();
          
          // Configurar evento de refresh
          document.getElementById('refreshBtn').addEventListener('click', fetchRequests);
        </script>
      </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`✅ API mock rodando em http://localhost:${port}`);
  console.log(`📊 Visualize as requisições em http://localhost:${port}`);
  console.log(`📝 Envie dados para:`);
  console.log(`   - http://localhost:${port}/popup-creator`);
  console.log(`   - http://localhost:${port}/card-creator`);
});
