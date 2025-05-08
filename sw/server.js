const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { Buffer } = require("buffer");

// Configurar o Express
const app = express();
const port = 3000;

// Habilitar CORS para permitir requisições do frontend
app.use(cors());

// Configurar o middleware para JSON (com limite maior para imagens base64)
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Listar todos os POSTs recebidos
let receivedRequests = [];

// Rota para servir arquivos estáticos (HTML, CSS, JS)
app.use(express.static("public"));

// Endpoint para popup-creator (aceita multipart/form-data)
app.post("/popup-creator", upload.single("imagem"), (req, res) => {
  console.log("🔵 POST recebido em /popup-creator");

  const requestData = {
    timestamp: new Date().toISOString(),
    body: req.body,
  };

  receivedRequests.unshift(requestData);
  if (receivedRequests.length > 10) {
    receivedRequests = receivedRequests.slice(0, 10);
  }

  console.log("📄 Dados do formulário:");
  console.table(req.body);

  res.status(200).json({
    success: true,
    message: "Popup criado com sucesso!",
    requestId: Date.now(),
  });
});

// Endpoint para card-creator (aceita JSON com imagem base64)
app.post("/card-creator", (req, res) => {
  console.log("🔵 POST recebido em /card-creator");

  const requestData = {
    timestamp: new Date().toISOString(),
    body: req.body,
  };

  receivedRequests.unshift(requestData);
  if (receivedRequests.length > 10) {
    receivedRequests = receivedRequests.slice(0, 10);
  }

  console.log("📄 Dados do formulário:");
  console.table(req.body);

  res.status(200).json({
    success: true,
    message: "Card criado com sucesso!",
    requestId: Date.now(),
  });
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
                
                let formDataHtml = '';
                for (const key in formData) {
                  if (formData.hasOwnProperty(key) && formData[key] && formData[key].length > 0) {
                    formDataHtml += '<li><strong>' + key + ':</strong> ' + formData[key] + '</li>';
                  }
                }
                
                let fileHtml = '';

                
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
