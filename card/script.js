const apiUrl = "http://localhost:3000/card-creator";

document.addEventListener("DOMContentLoaded", function () {
  // Variáveis para gerenciar o estado da aplicação
  let imagemPreview = "";
  let imagemFile = null;

  // Elementos do formulário
  const numeroAcaoInput = document.getElementById("numeroAcao");
  const imagemInput = document.getElementById("imagem");
  const selecionarLayoutSelect = document.getElementById("selecionarLayout");
  const tituloInput = document.getElementById("titulo");
  const corTituloInput = document.getElementById("corTitulo");
  const corTituloColorInput = document.getElementById("corTituloColor");
  const subtituloInput = document.getElementById("subtitulo");
  const corSubtituloInput = document.getElementById("corSubtitulo");
  const corSubtituloColorInput = document.getElementById("corSubtituloColor");
  const textoCTAInput = document.getElementById("textoCTA");
  const corTextoCTAInput = document.getElementById("corTextoCTA");
  const corTextoCTAColorInput = document.getElementById("corTextoCTAColor");
  const corInicioInput = document.getElementById("corInicio");
  const corInicioColorInput = document.getElementById("corInicioColor");
  const corFimInput = document.getElementById("corFim");
  const corFimColorInput = document.getElementById("corFimColor");
  const corFundoCTAInput = document.getElementById("corFundoCTA");
  const corFundoCTAColorInput = document.getElementById("corFundoCTAColor");
  const corBordaCTAInput = document.getElementById("corBordaCTA");
  const corBordaCTAColorInput = document.getElementById("corBordaCTAColor");
  const tipoLinkSelect = document.getElementById("tipoLink");
  const linkInput = document.getElementById("link");
  const codigoSelect = document.getElementById("codigo");
  const codigoManualInput = document.getElementById("codigoManual");
  const codigoManualContainer = document.getElementById(
    "codigoManualContainer"
  );
  const idSelect = document.getElementById("ID");
  const idManualInput = document.getElementById("IDManual");
  const idManualContainer = document.getElementById("IDManualContainer");
  const statusArquivo = document.getElementById("statusArquivo");
  const btnEnviarAPI = document.getElementById("btnEnviarAPI");

  // Elementos de layout
  const linkSection = document.getElementById("linkSection");
  const pushSection = document.getElementById("pushSection");
  const tituloSection = document.getElementById("tituloSection");
  const subtituloSection = document.getElementById("subtituloSection");
  const ctaSection = document.getElementById("ctaSection");
  const coresCTASection = document.getElementById("coresCTASection");

  // Elementos de preview
  const cardPreview = document.getElementById("cardPreview");
  const cardPreviewIMG = document.getElementById("cardPreviewIMG");
  const cardPreviewContent = document.getElementById("cardPreviewContent");
  const tituloPreview = document.getElementById("tituloPreview");
  const subtituloPreview = document.getElementById("subtituloPreview");
  const textoCTAPreview = document.getElementById("textoCTAPreview");
  const phoneTime = document.getElementById("phoneTime");

  // Elementos do modal
  const statusModal = document.getElementById("statusModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalMessage = document.getElementById("modalMessage");
  const modalButton = document.getElementById("modalButton");

  // Função para mostrar o modal
  function showModal(title, message, buttonText = "OK") {
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modalButton.textContent = buttonText;
    statusModal.style.display = "flex";
  }

  // Fechar o modal ao clicar no botão
  modalButton.addEventListener("click", function () {
    statusModal.style.display = "none";
  });

  // Atualizar horário do telefone
  function updatePhoneTime() {
    const now = new Date();
    phoneTime.textContent = now.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // Atualizar o horário inicialmente e a cada minuto
  updatePhoneTime();
  setInterval(updatePhoneTime, 60000);

  // Funções para manipular o accordion
  const toggleAccordion = (section) => {
    const accordionContents = document.querySelectorAll(".accordionContent");
    const accordionIcons = document.querySelectorAll(".accordionIcon");
    const accordionHeaders = document.querySelectorAll(".accordionHeader");

    // Verificar se a seção clicada já está aberta
    const content = document.getElementById(section);
    const header = document.querySelector(`[data-section="${section}"]`);
    const icon = header.querySelector(".accordionIcon");
    const isActive = header.classList.contains("active");

    if (isActive) {
      // Se já está ativa, apenas fechamos
      content.style.display = "none";
      icon.classList.remove("rotated");
      header.classList.remove("active");
    } else {
      // Se não está ativa, fechamos todas e abrimos esta
      accordionContents.forEach((item) => {
        item.style.display = "none";
      });

      accordionIcons.forEach((item) => {
        item.classList.remove("rotated");
      });

      accordionHeaders.forEach((item) => {
        item.classList.remove("active");
      });

      // Abrir a seção clicada
      content.style.display = "block";
      icon.classList.add("rotated");
      header.classList.add("active");
    }
  };

  // Adicionar event listeners para os headers do accordion
  document.querySelectorAll(".accordionHeader").forEach((header) => {
    header.addEventListener("click", function () {
      const section = this.getAttribute("data-section");
      toggleAccordion(section);
    });
  });

  // Função para lidar com upload de imagem
  imagemInput.addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (file) {
      imagemFile = file;
      const reader = new FileReader();

      reader.onload = function (e) {
        imagemPreview = e.target.result;
        cardPreviewIMG.style.backgroundImage = `url(${imagemPreview})`;
        statusArquivo.textContent = `Arquivo selecionado: ${file.name}`;
        statusArquivo.style.color = "green";
      };

      reader.readAsDataURL(file);
    } else {
      imagemFile = null;
      imagemPreview = "";
      cardPreviewIMG.style.backgroundImage = "none";
      statusArquivo.textContent = "Nenhum arquivo selecionado";
      statusArquivo.style.color = "red";
    }
  });

  // Função para atualizar o preview em tempo real
  function updatePreview() {
    // Atualizar background do card
    cardPreview.style.backgroundImage = `linear-gradient(45deg, ${corInicioInput.value}, ${corFimInput.value})`;

    // Atualizar título
    tituloPreview.textContent = tituloInput.value;
    tituloPreview.style.color = corTituloInput.value;

    // Atualizar subtítulo
    subtituloPreview.textContent = subtituloInput.value;
    subtituloPreview.style.color = corSubtituloInput.value;

    // Atualizar CTA
    textoCTAPreview.textContent = textoCTAInput.value;
    textoCTAPreview.style.color = corTextoCTAInput.value;
    textoCTAPreview.style.backgroundColor = corFundoCTAInput.value;
    textoCTAPreview.style.border = `2px solid ${corBordaCTAInput.value}`;
  }

  // Função para atualizar visibilidade com base no layout
  function updateLayoutVisibility() {
    const tipoLayout = selecionarLayoutSelect.value;
    const isLayoutDireita = ["322", "323", "324", "275"].includes(tipoLayout);
    const mostrarTitulo = !["321", "324"].includes(tipoLayout);
    const mostrarSubtitulo = !["320", "323"].includes(tipoLayout);
    const mostrarCTA = !["271", "275"].includes(tipoLayout);

    // Atualizar a direção do layout
    if (isLayoutDireita) {
      cardPreview.classList.remove("layoutEsquerda");
      cardPreview.classList.add("layoutDireita");
      cardPreviewIMG.style.order = "2";
      cardPreviewContent.style.order = "1";
    } else {
      cardPreview.classList.remove("layoutDireita");
      cardPreview.classList.add("layoutEsquerda");
      cardPreviewIMG.style.order = "1";
      cardPreviewContent.style.order = "2";
    }

    // Atualizar visibilidade de elementos do preview
    tituloPreview.style.display = mostrarTitulo ? "block" : "none";
    subtituloPreview.style.display = mostrarSubtitulo ? "block" : "none";
    textoCTAPreview.style.display = mostrarCTA ? "block" : "none";

    // Atualizar visibilidade de campos do formulário
    tituloSection.style.display = mostrarTitulo ? "grid" : "none";
    subtituloSection.style.display = mostrarSubtitulo ? "grid" : "none";
    ctaSection.style.display = mostrarCTA ? "grid" : "none";
    coresCTASection.style.display = mostrarCTA ? "grid" : "none";
  }

  // Função para atualizar a visibilidade dos tipos de link
  function updateLinkTypesVisibility() {
    const tipoLink = tipoLinkSelect.value;

    if (tipoLink === "2") {
      // Link
      linkSection.style.display = "block";
      pushSection.style.display = "none";
    } else if (tipoLink === "3") {
      // Push Deep Link
      linkSection.style.display = "none";
      pushSection.style.display = "block";
    } else {
      // Sem redirecionamento
      linkSection.style.display = "none";
      pushSection.style.display = "none";
    }
  }

  // Função para mostrar/esconder campo de entrada manual
  function updateManualInputsVisibility() {
    codigoManualContainer.style.display =
      codigoSelect.value === "manual" ? "block" : "none";
    IDManualContainer.style.display =
      idSelect.value === "manual" ? "block" : "none";
  }

  // Função para validar formato hexadecimal de cores
  function validarFormatoHex(cor) {
    if (!cor || cor === "") return true; // Permitir vazio
    if (!cor.startsWith("#") || cor.length !== 7) return false;
    const hexRegex = /^#[0-9A-Fa-f]{6}$/;
    return hexRegex.test(cor);
  }

  // Função para obter nome amigável dos campos
  function obterNomeAmigavel(idCampo) {
    const mapeamento = {
      corTitulo: "cor do título",
      corSubtitulo: "cor do subtítulo",
      corTextoCTA: "cor do texto da CTA",
      corInicio: "cor de início",
      corFim: "cor de fim",
      corFundoCTA: "cor de fundo da CTA",
      corBordaCTA: "cor da borda da CTA",
    };
    return mapeamento[idCampo] || idCampo;
  }

  // Função para verificar o comprimento e formato da cor
  function verificarComprimentoCor(cor, nomeCampo) {
    if (cor.length === 0) return true;
    if (!validarFormatoHex(cor)) {
      showModal(
        "Erro",
        `A cor do campo ${nomeCampo} deve ser um valor hexadecimal válido (ex: #FF0000). Por favor, corrija!`
      );
      return false;
    }
    return true;
  }

  // Função para verificar contraste entre cores
  function verificarContrasteCores(corFundo, corTexto, tipoTexto) {
    if (!corFundo || !corTexto) return true;
    if (corFundo.toLowerCase() === corTexto.toLowerCase()) {
      showModal(
        "Erro",
        `A cor de fundo e a cor do ${tipoTexto} não podem ser iguais, pois o texto ficará invisível.`
      );
      return false;
    }
    return true;
  }

  // Função para validar o formulário antes de enviar para a API
  function validarFormulario() {
    // Validar se tem imagem
    if (!imagemFile) {
      showModal("Erro", "É necessário selecionar uma imagem.");
      return false;
    }

    // Validar número de ação
    if (!numeroAcaoInput.value) {
      showModal("Erro", "É necessário informar o número de ação.");
      return false;
    }

    // Validar tamanho dos textos
    const tipoLayout = selecionarLayoutSelect.value;
    const mostrarTitulo = !["321", "324"].includes(tipoLayout);
    const mostrarSubtitulo = !["320", "323"].includes(tipoLayout);

    if (mostrarTitulo && tituloInput.value.length > 25) {
      showModal("Erro", "O título não pode ultrapassar 25 caracteres!");
      return false;
    }

    if (mostrarSubtitulo && subtituloInput.value.length > 90) {
      showModal("Erro", "O subtítulo não pode ultrapassar 90 caracteres!");
      return false;
    }

    // Validar formato de cores
    const cores = [
      { valor: corTituloInput.value, nome: "corTitulo" },
      { valor: corSubtituloInput.value, nome: "corSubtitulo" },
      { valor: corTextoCTAInput.value, nome: "corTextoCTA" },
      { valor: corInicioInput.value, nome: "corInicio" },
      { valor: corFimInput.value, nome: "corFim" },
      { valor: corFundoCTAInput.value, nome: "corFundoCTA" },
      { valor: corBordaCTAInput.value, nome: "corBordaCTA" },
    ];

    for (const cor of cores) {
      if (!verificarComprimentoCor(cor.valor, obterNomeAmigavel(cor.nome))) {
        return false;
      }
    }

    // Validar contraste entre cores
    if (
      !verificarContrasteCores(
        corInicioInput.value,
        corTituloInput.value,
        "título"
      )
    )
      return false;
    if (
      !verificarContrasteCores(
        corFimInput.value,
        corTituloInput.value,
        "título"
      )
    )
      return false;
    if (
      !verificarContrasteCores(
        corInicioInput.value,
        corSubtituloInput.value,
        "subtítulo"
      )
    )
      return false;
    if (
      !verificarContrasteCores(
        corFimInput.value,
        corSubtituloInput.value,
        "subtítulo"
      )
    )
      return false;
    if (
      !verificarContrasteCores(
        corFundoCTAInput.value,
        corTextoCTAInput.value,
        "texto CTA"
      )
    )
      return false;

    // Validação específica do tipo de link
    const tipoLink = tipoLinkSelect.value;

    if (tipoLink === "2") {
      // Link
      if (!linkInput.value) {
        showModal("Erro", "É necessário informar um link de redirecionamento.");
        return false;
      }
    } else if (tipoLink === "3") {
      // Push deep link
      let idCAT = idSelect.value;

      if (idCAT === "manual") {
        idCAT = idManualInput.value;
      }

      if (!idCAT) {
        showModal("Erro", "É necessário informar um ID de redirecionamento.");
        return false;
      }
    }

    return true;
  }

  // Função para converter imagem para Base64
  function convertImageToBase64(file) {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error("Nenhum arquivo de imagem fornecido"));
        return;
      }

      const reader = new FileReader();

      reader.onload = function (e) {
        // e.target.result já contém a imagem como DataURL
        const dataUrl = e.target.result;

        // Você pode escolher enviar a string base64 com ou sem o prefixo data:image
        // Opção 1: Extrair apenas a parte base64 (sem o prefixo)
        // const base64String = dataUrl.split(',')[1];

        // Opção 2: Usar a dataURL completa (com o prefixo)
        const base64String = dataUrl;

        resolve(base64String);
      };

      reader.onerror = function (e) {
        reject(new Error("Erro ao converter imagem para base64"));
      };

      reader.readAsDataURL(file);
    });
  }

  // Modificação da função prepararDadosAPI para garantir que a imagem seja enviada como base64
  async function prepararDadosAPI() {
    const tipoLayout = selecionarLayoutSelect.value;

    // Determinar o que mostrar com base no layout
    const mostrarTitulo = !["321", "324"].includes(tipoLayout);
    const mostrarSubtitulo = !["320", "323"].includes(tipoLayout);
    const mostrarCTA = !["271", "275"].includes(tipoLayout);

    let tituloFinal = mostrarTitulo ? tituloInput.value : "";
    let subtituloFinal = mostrarSubtitulo ? subtituloInput.value : "";
    let textoCTAFinal = mostrarCTA ? textoCTAInput.value : "";
    let corTituloFinal = mostrarTitulo ? corTituloInput.value : "";
    let corSubtituloFinal = mostrarSubtitulo ? corSubtituloInput.value : "";
    let corTextoCTAFinal = mostrarCTA ? corTextoCTAInput.value : "";
    let corFundoCTAFinal = mostrarCTA ? corFundoCTAInput.value : "";
    let corBordaCTAFinal = mostrarCTA ? corBordaCTAInput.value : "";

    // Preparar dados do link e ID
    const tipoLink = tipoLinkSelect.value;
    let idCATFinal = "";
    let codigoFinal = "";
    let metodo = "";
    let linkValue = "";

    if (tipoLink === "1") {
      // Sem redirecionamento
      codigoFinal = "";
      idCATFinal = "0";
      metodo = "";
    } else if (tipoLink === "2") {
      // Link
      idCATFinal = "0";
      metodo = "Link";
      linkValue = linkInput.value || "";

      if (codigoSelect.value === "manual") {
        codigoFinal = codigoManualInput.value;
      } else {
        codigoFinal = codigoSelect.value;
      }
    } else if (tipoLink === "3") {
      // Push deep link
      codigoFinal = "";
      metodo = "PshDpLink";

      if (idSelect.value === "manual") {
        idCATFinal = idManualInput.value;
      } else {
        idCATFinal = idSelect.value;
      }
    }

    // Remover caracteres indesejados do texto
    function removerCaracteresIndesejados(texto) {
      if (!texto) return "";
      texto = texto.replace(/R\$(?=[\[\]'"`]\S)/g, "");
      return texto.replace(/[\[\]'"`]/g, "");
    }

    tituloFinal = removerCaracteresIndesejados(tituloFinal);
    subtituloFinal = removerCaracteresIndesejados(subtituloFinal);

    // Converter a imagem para base64
    let imagemBase64 = "";
    try {
      imagemBase64 = await convertImageToBase64(imagemFile);
      console.log("Imagem convertida para base64 com sucesso.");
      console.log("Tamanho da string base64:", imagemBase64.length);
      console.log(
        "Amostra da string base64:",
        imagemBase64.substring(0, 50) + "..."
      );
    } catch (error) {
      console.error("Erro ao converter imagem para base64:", error);
      showModal("Erro", `Falha ao converter imagem: ${error.message}`);
      return null;
    }

    // Preparar objeto JSON para envio
    const dadosJSON = {
      numeroAcao: numeroAcaoInput.value,
      imagemBase64: imagemBase64, // Enviando a string base64 explicitamente
      tipoLayout: tipoLayout,
      titulo: tituloFinal,
      subtitulo: subtituloFinal,
      textoCTA: textoCTAFinal,
      corTitulo: corTituloFinal,
      corSubtitulo: corSubtituloFinal,
      corTextoCTA: corTextoCTAFinal,
      corFundoCTA: corFundoCTAFinal,
      corBordaCTA: corBordaCTAFinal,
      corInicio: corInicioInput.value,
      corFim: corFimInput.value,
      metodo: metodo,
      link: linkValue,
      codigo: codigoFinal,
      idCAT: idCATFinal,
    };

    return dadosJSON;
  }


  // Modificação da função enviarParaAPI para validar o objeto JSON antes de enviar
  async function enviarParaAPI() {
    if (!validarFormulario()) {
      return;
    }

    // Alterar o botão para estado de loading
    btnEnviarAPI.innerHTML = '<div class="loadingSpinner"></div> Enviando...';
    btnEnviarAPI.disabled = true;
    btnEnviarAPI.classList.add("btnLoading");

    try {
      // Preparar dados para o envio como JSON com imagem em base64
      const dadosJSON = await prepararDadosAPI();

      // Verificar se a preparação de dados foi bem-sucedida
      if (!dadosJSON) {
        throw new Error("Falha na preparação dos dados");
      }

      // Validar se a imagem base64 está presente
      if (!dadosJSON.imagemBase64) {
        throw new Error("Imagem base64 não foi gerada corretamente");
      }

      console.log("Dados preparados com sucesso. Enviando para API...");
      console.log(
        "Objeto JSON tem as seguintes chaves:",
        Object.keys(dadosJSON).join(", ")
      );

      // Enviar dados para a API como JSON
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dadosJSON),
      });

      // Verificar o tipo de conteúdo da resposta
      const contentType = response.headers.get("content-type");

      if (response.ok) {
        // Tratar a resposta baseada no tipo de conteúdo
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          console.log("Resposta do servidor:", data);
          showModal(
            "Sucesso",
            "Card criado com sucesso! O script foi gerado e executado no servidor."
          );
        } else {
          // Resposta não é JSON, mas ainda é um sucesso
          showModal(
            "Sucesso",
            "Card criado com sucesso! O servidor respondeu com êxito."
          );
        }
      } else {
        // Tratar erro baseado no tipo de conteúdo
        if (contentType && contentType.includes("application/json")) {
          try {
            const errorData = await response.json();
            showModal(
              "Erro",
              `Falha ao criar o card: ${
                errorData.message || "Erro desconhecido"
              }`
            );
          } catch (e) {
            // Falhou ao parsear JSON
            const errorText = await response.text();
            showModal(
              "Erro",
              `Falha ao criar o card. Resposta do servidor: ${
                errorText.substring(0, 100) || "Erro desconhecido"
              }`
            );
          }
        } else {
          // Resposta de erro não é JSON
          const errorText = await response.text();
          showModal(
            "Erro",
            `Falha ao criar o card. Código: ${response.status}. Resposta: ${
              errorText.substring(0, 100) || "Erro desconhecido"
            }`
          );
        }
      }
    } catch (error) {
      showModal("Erro", `Falha ao enviar dados: ${error.message}`);
      console.error("Erro detalhado:", error);
    } finally {
      // Restaurar o botão ao estado normal
      btnEnviarAPI.innerHTML = "Enviar para API";
      btnEnviarAPI.disabled = false;
      btnEnviarAPI.classList.remove("btnLoading");
    }
  }

  // Event Listeners para os campos de cores
  corTituloColorInput.addEventListener("input", function () {
    corTituloInput.value = this.value;
    updatePreview();
  });

  corTituloInput.addEventListener("input", function () {
    if (validarFormatoHex(this.value)) {
      corTituloColorInput.value = this.value;
      updatePreview();
    }
  });

  corSubtituloColorInput.addEventListener("input", function () {
    corSubtituloInput.value = this.value;
    updatePreview();
  });

  corSubtituloInput.addEventListener("input", function () {
    if (validarFormatoHex(this.value)) {
      corSubtituloColorInput.value = this.value;
      updatePreview();
    }
  });

  corTextoCTAColorInput.addEventListener("input", function () {
    corTextoCTAInput.value = this.value;
    updatePreview();
  });

  corTextoCTAInput.addEventListener("input", function () {
    if (validarFormatoHex(this.value)) {
      corTextoCTAColorInput.value = this.value;
      updatePreview();
    }
  });

  corInicioColorInput.addEventListener("input", function () {
    corInicioInput.value = this.value;
    updatePreview();
  });

  corInicioInput.addEventListener("input", function () {
    if (validarFormatoHex(this.value)) {
      corInicioColorInput.value = this.value;
      updatePreview();
    }
  });

  corFimColorInput.addEventListener("input", function () {
    corFimInput.value = this.value;
    updatePreview();
  });

  corFimInput.addEventListener("input", function () {
    if (validarFormatoHex(this.value)) {
      corFimColorInput.value = this.value;
      updatePreview();
    }
  });

  corFundoCTAColorInput.addEventListener("input", function () {
    corFundoCTAInput.value = this.value;
    updatePreview();
  });

  corFundoCTAInput.addEventListener("input", function () {
    if (validarFormatoHex(this.value)) {
      corFundoCTAColorInput.value = this.value;
      updatePreview();
    }
  });

  corBordaCTAColorInput.addEventListener("input", function () {
    corBordaCTAInput.value = this.value;
    updatePreview();
  });

  corBordaCTAInput.addEventListener("input", function () {
    if (validarFormatoHex(this.value)) {
      corBordaCTAColorInput.value = this.value;
      updatePreview();
    }
  });

  // Event Listeners para os inputs de texto
  tituloInput.addEventListener("input", updatePreview);
  subtituloInput.addEventListener("input", updatePreview);
  textoCTAInput.addEventListener("input", updatePreview);

  // Event Listener para o select de layout
  selecionarLayoutSelect.addEventListener("change", function () {
    updateLayoutVisibility();
    updatePreview();
  });

  // Event Listener para tipo de link
  tipoLinkSelect.addEventListener("change", updateLinkTypesVisibility);

  // Event Listeners para opções manuais
  codigoSelect.addEventListener("change", updateManualInputsVisibility);
  idSelect.addEventListener("change", updateManualInputsVisibility);

  // Event Listener para botão de enviar para API
  btnEnviarAPI.addEventListener("click", enviarParaAPI);

  // Inicialização
  updateLayoutVisibility();
  updateLinkTypesVisibility();
  updateManualInputsVisibility();
  updatePreview();
});
