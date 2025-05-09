const apiUrl = "http://localhost:3000/card-creator";

document.addEventListener("DOMContentLoaded", function () {
  let imagemPreview = "";
  let imagemFile = null;

  // Form
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

  // layout
  const linkSection = document.getElementById("linkSection");
  const pushSection = document.getElementById("pushSection");
  const tituloSection = document.getElementById("tituloSection");
  const subtituloSection = document.getElementById("subtituloSection");
  const ctaSection = document.getElementById("ctaSection");
  const coresCTASection = document.getElementById("coresCTASection");

  // preview
  const cardPreview = document.getElementById("cardPreview");
  const cardPreviewIMG = document.getElementById("cardPreviewIMG");
  const cardPreviewContent = document.getElementById("cardPreviewContent");
  const tituloPreview = document.getElementById("tituloPreview");
  const subtituloPreview = document.getElementById("subtituloPreview");
  const textoCTAPreview = document.getElementById("textoCTAPreview");
  const phoneTime = document.getElementById("phoneTime");
  const statusModal = document.getElementById("statusModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalMessage = document.getElementById("modalMessage");
  const modalButton = document.getElementById("modalButton");

  // mostrar o modal
  function showModal(title, message, buttonText = "OK") {
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modalButton.textContent = buttonText;
    statusModal.style.display = "flex";
  }

  modalButton.addEventListener("click", function () {
    statusModal.style.display = "none";
  });

  function updatePhoneTime() {
    const now = new Date();
    phoneTime.textContent = now.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  updatePhoneTime();
  setInterval(updatePhoneTime, 60000);

  // accordion
  const toggleAccordion = (section) => {
    const accordionContents = document.querySelectorAll(".accordionContent");
    const accordionIcons = document.querySelectorAll(".accordionIcon");
    const accordionHeaders = document.querySelectorAll(".accordionHeader");

    const content = document.getElementById(section);
    const header = document.querySelector(`[data-section="${section}"]`);
    const icon = header.querySelector(".accordionIcon");
    const isActive = header.classList.contains("active");

    if (isActive) {
      content.style.display = "none";
      icon.classList.remove("rotated");
      header.classList.remove("active");
    } else {
      accordionContents.forEach((item) => {
        item.style.display = "none";
      });

      accordionIcons.forEach((item) => {
        item.classList.remove("rotated");
      });

      accordionHeaders.forEach((item) => {
        item.classList.remove("active");
      });

      content.style.display = "block";
      icon.classList.add("rotated");
      header.classList.add("active");
    }
  };

  document.querySelectorAll(".accordionHeader").forEach((header) => {
    header.addEventListener("click", function () {
      const section = this.getAttribute("data-section");
      toggleAccordion(section);
    });
  });

  // upload da imagem
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

  function updatePreview() {
    // Atualizar estilos
    cardPreview.style.backgroundImage = `linear-gradient(45deg, ${corInicioInput.value}, ${corFimInput.value})`;

    tituloPreview.textContent = tituloInput.value;
    tituloPreview.style.color = corTituloInput.value;

    subtituloPreview.textContent = subtituloInput.value;
    subtituloPreview.style.color = corSubtituloInput.value;

    textoCTAPreview.textContent = textoCTAInput.value;
    textoCTAPreview.style.color = corTextoCTAInput.value;
    textoCTAPreview.style.backgroundColor = corFundoCTAInput.value;
    textoCTAPreview.style.border = `2px solid ${corBordaCTAInput.value}`;
  }

  // atualizar layout
  function updateLayoutVisibility() {
    const tipoLayout = selecionarLayoutSelect.value;
    const isLayoutDireita = ["322", "323", "324", "275"].includes(tipoLayout);
    const mostrarTitulo = !["321", "324"].includes(tipoLayout);
    const mostrarSubtitulo = !["320", "323"].includes(tipoLayout);
    const mostrarCTA = !["271", "275"].includes(tipoLayout);

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

    tituloPreview.style.display = mostrarTitulo ? "block" : "none";
    subtituloPreview.style.display = mostrarSubtitulo ? "block" : "none";
    textoCTAPreview.style.display = mostrarCTA ? "block" : "none";

    tituloSection.style.display = mostrarTitulo ? "grid" : "none";
    subtituloSection.style.display = mostrarSubtitulo ? "grid" : "none";
    ctaSection.style.display = mostrarCTA ? "grid" : "none";
    coresCTASection.style.display = mostrarCTA ? "grid" : "none";
  }

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

  function updateManualInputsVisibility() {
    codigoManualContainer.style.display =
      codigoSelect.value === "manual" ? "block" : "none";
    IDManualContainer.style.display =
      idSelect.value === "manual" ? "block" : "none";
  }

  function validarFormatoHex(cor) {
    if (!cor || cor === "") return true;
    if (!cor.startsWith("#") || cor.length !== 7) return false;
    const hexRegex = /^#[0-9A-Fa-f]{6}$/;
    return hexRegex.test(cor);
  }

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

  // verificar contraste entre cores
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

  // validar o formulário antes de enviar
  function validarFormulario() {
    if (!imagemFile) {
      showModal("Erro", "É necessário selecionar uma imagem.");
      return false;
    }

    if (!numeroAcaoInput.value) {
      showModal("Erro", "É necessário informar o número de ação.");
      return false;
    }

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

  function convertImageToBase64(file) {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error("Nenhum arquivo de imagem fornecido"));
        return;
      }

      const reader = new FileReader();

      reader.onload = function (e) {
        const dataUrl = e.target.result;
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

  async function prepararDadosAPI() {
    const tipoLayout = selecionarLayoutSelect.value;

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

    //link e ID
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

    function removerCaracteresIndesejados(texto) {
      if (!texto) return "";
      texto = texto.replace(/R\$(?=[\[\]'"`]\S)/g, "");
      return texto.replace(/[\[\]'"`]/g, "");
    }

    tituloFinal = removerCaracteresIndesejados(tituloFinal);
    subtituloFinal = removerCaracteresIndesejados(subtituloFinal);

    // Convertendo para base64
    let imagem = "";
    try {
      imagem = await convertImageToBase64(imagemFile);
      console.log("Imagem convertida para base64 com sucesso.");
      console.log("Tamanho da string base64:", imagem.length);
      console.log("Amostra da string base64:", imagem.substring(0, 50) + "...");
    } catch (error) {
      console.error("Erro ao converter imagem para base64:", error);
      showModal("Erro", `Falha ao converter imagem: ${error.message}`);
      return null;
    }

    const dadosJSON = {
      numeroAcao: numeroAcaoInput.value,
      imagem: imagem,
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

  const enviarParaAPI = window.apiService({
    validarFormulario: validarFormulario,
    prepararDadosAPI: prepararDadosAPI,
    showModal: showModal,
    btnEnviarAPI: btnEnviarAPI,
    apiUrl: apiUrl,
  });

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

  tituloInput.addEventListener("input", updatePreview);
  subtituloInput.addEventListener("input", updatePreview);
  textoCTAInput.addEventListener("input", updatePreview);

  selecionarLayoutSelect.addEventListener("change", function () {
    updateLayoutVisibility();
    updatePreview();
  });

  tipoLinkSelect.addEventListener("change", updateLinkTypesVisibility);

  codigoSelect.addEventListener("change", updateManualInputsVisibility);
  idSelect.addEventListener("change", updateManualInputsVisibility);

  btnEnviarAPI.addEventListener("click", enviarParaAPI);

  updateLayoutVisibility();
  updateLinkTypesVisibility();
  updateManualInputsVisibility();
  updatePreview();
});
