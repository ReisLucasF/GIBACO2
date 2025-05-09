const apiUrl = "http://localhost:3000/popup-creator";

document.addEventListener("DOMContentLoaded", function () {
  let imagemPreview = "";
  let imagemFile = null;

  const numeroAcaoInput = document.getElementById("numeroAcao");
  const imagemInput = document.getElementById("imagem");
  const selecionarLayoutSelect = document.getElementById("selecionarLayout");
  const tituloInput = document.getElementById("titulo");
  const corTituloInput = document.getElementById("corTitulo");
  const corTituloColorInput = document.getElementById("corTituloColor");
  const tamanhoTituloSelect = document.getElementById("tamanhoTitulo");
  const subtituloInput = document.getElementById("subtitulo");
  const corSubtituloInput = document.getElementById("corSubtitulo");
  const corSubtituloColorInput = document.getElementById("corSubtituloColor");
  const tamanhoSubtituloSelect = document.getElementById("tamanhoSubtitulo");
  const textoCTAInput = document.getElementById("textoCTA");
  const corTextoCTAInput = document.getElementById("corTextoCTA");
  const corTextoCTAColorInput = document.getElementById("corTextoCTAColor");
  const corFundoCTAInput = document.getElementById("corFundoCTA");
  const corFundoCTAColorInput = document.getElementById("corFundoCTAColor");
  const corBordaCTAInput = document.getElementById("corBordaCTA");
  const corBordaCTAColorInput = document.getElementById("corBordaCTAColor");
  const corInicioInput = document.getElementById("corInicio");
  const corInicioColorInput = document.getElementById("corInicioColor");
  const corFimInput = document.getElementById("corFim");
  const corFimColorInput = document.getElementById("corFimColor");
  const textoBtnFecharInput = document.getElementById("textoBtnFechar");
  const corBtnFecharInput = document.getElementById("corBtnFechar");
  const corBtnFecharColorInput = document.getElementById("corBtnFecharColor");
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

  const tituloSection = document.getElementById("tituloSection");
  const subtituloSection = document.getElementById("subtituloSection");
  const ctaSection = document.getElementById("ctaSection");
  const fundoSection = document.getElementById("fundoSection");
  const linkSection = document.getElementById("linkSection");
  const pushSection = document.getElementById("pushSection");

  // preview
  const popupPreviewFull = document.getElementById("popupPreviewFull");
  const popupImageFull = document.getElementById("popupImageFull");
  const btnFecharFull = document.getElementById("btnFecharFull");
  const btnFecharTextoFull = document.getElementById("btnFecharTextoFull");

  const popupPreview333 = document.getElementById("popupPreview333");
  const popupImageTop = document.getElementById("popupImageTop");
  const btnFechar333 = document.getElementById("btnFechar333");
  const btnFecharTexto333 = document.getElementById("btnFecharTexto333");
  const popupTitle333 = document.getElementById("popupTitle333");
  const popupSubtitle333 = document.getElementById("popupSubtitle333");
  const popupCTA333 = document.getElementById("popupCTA333");

  const popupPreview334 = document.getElementById("popupPreview334");
  const popupImageMiddle = document.getElementById("popupImageMiddle");
  const btnFechar334 = document.getElementById("btnFechar334");
  const btnFecharTexto334 = document.getElementById("btnFecharTexto334");
  const popupTitle334 = document.getElementById("popupTitle334");
  const popupSubtitle334 = document.getElementById("popupSubtitle334");
  const popupCTA334 = document.getElementById("popupCTA334");

  // modal
  const statusModal = document.getElementById("statusModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalMessage = document.getElementById("modalMessage");
  const modalButton = document.getElementById("modalButton");

  function showModal(title, message, buttonText = "OK") {
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modalButton.textContent = buttonText;
    statusModal.style.display = "flex";
  }

  modalButton.addEventListener("click", function () {
    statusModal.style.display = "none";
  });

  const toggleAccordion = (section) => {
    const accordionContents = document.querySelectorAll(".accordionContent");
    const accordionIcons = document.querySelectorAll(".accordionIcon");
    const accordionHeaders = document.querySelectorAll(".accordionHeader");

    const content = document.getElementById(section);
    const header = document.querySelector(`[data-section="${section}"]`);
    const icon = header.querySelector(".accordionIcon");
    const isActive = header.classList.contains("active");

    accordionContents.forEach((content) => {
      content.style.display = "none";
    });

    accordionIcons.forEach((icon) => {
      icon.classList.remove("rotated");
    });

    accordionHeaders.forEach((header) => {
      header.classList.remove("active");
    });

    if (isActive) {
      return;
    }

    content.style.display = "block";
    icon.classList.add("rotated");
    header.classList.add("active");
  };

  document.querySelectorAll(".accordionHeader").forEach((header) => {
    header.addEventListener("click", function () {
      const section = this.getAttribute("data-section");
      toggleAccordion(section);
    });
  });

  imagemInput.addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (file) {
      imagemFile = file;
      const reader = new FileReader();

      reader.onload = function (e) {
        imagemPreview = e.target.result;
        atualizarImagemPreview();
        statusArquivo.textContent = `Arquivo selecionado: ${file.name}`;
        statusArquivo.style.color = "green";
      };

      reader.readAsDataURL(file);
    } else {
      imagemFile = null;
      imagemPreview = "";
      atualizarImagemPreview();
      statusArquivo.textContent = "Nenhum arquivo selecionado";
      statusArquivo.style.color = "red";
    }
  });

  function updatePreview() {
    const tipoLayout = selecionarLayoutSelect.value;

    popupPreviewFull.style.display = tipoLayout === "335" ? "block" : "none";
    popupPreview333.style.display = tipoLayout === "333" ? "block" : "none";
    popupPreview334.style.display = tipoLayout === "334" ? "block" : "none";

    if (tipoLayout !== "335") {
      popupPreview333.style.backgroundImage = `linear-gradient(45deg, ${corInicioInput.value}, ${corFimInput.value})`;
      popupPreview334.style.backgroundImage = `linear-gradient(45deg, ${corInicioInput.value}, ${corFimInput.value})`;
    }

    btnFecharTextoFull.textContent = textoBtnFecharInput.value;
    btnFecharTexto333.textContent = textoBtnFecharInput.value;
    btnFecharTexto334.textContent = textoBtnFecharInput.value;

    btnFecharFull.style.color = corBtnFecharInput.value;
    btnFechar333.style.color = corBtnFecharInput.value;
    btnFechar334.style.color = corBtnFecharInput.value;

    const fontSizeTitle =
      tamanhoTituloSelect.value === "65"
        ? "20pt"
        : tamanhoTituloSelect.value === "50"
        ? "18pt"
        : "15pt";
    const fontSizeSubtitle =
      tamanhoSubtituloSelect.value === "32"
        ? "15pt"
        : tamanhoSubtituloSelect.value === "28"
        ? "14pt"
        : "13pt";

    // layout 333
    popupTitle333.textContent = tituloInput.value;
    popupTitle333.style.color = corTituloInput.value;
    popupTitle333.style.fontSize = fontSizeTitle;

    popupSubtitle333.textContent = subtituloInput.value;
    popupSubtitle333.style.color = corSubtituloInput.value;
    popupSubtitle333.style.fontSize = fontSizeSubtitle;

    popupCTA333.textContent = textoCTAInput.value;
    popupCTA333.style.color = corTextoCTAInput.value;
    popupCTA333.style.backgroundColor = corFundoCTAInput.value;
    popupCTA333.style.border = `2px solid ${corBordaCTAInput.value}`;

    // layout 334
    popupTitle334.textContent = tituloInput.value;
    popupTitle334.style.color = corTituloInput.value;
    popupTitle334.style.fontSize = fontSizeTitle;

    popupSubtitle334.textContent = subtituloInput.value;
    popupSubtitle334.style.color = corSubtituloInput.value;
    popupSubtitle334.style.fontSize = fontSizeSubtitle;

    popupCTA334.textContent = textoCTAInput.value;
    popupCTA334.style.color = corTextoCTAInput.value;
    popupCTA334.style.backgroundColor = corFundoCTAInput.value;
    popupCTA334.style.border = `2px solid ${corBordaCTAInput.value}`;
  }

  function atualizarImagemPreview() {
    if (imagemPreview) {
      popupImageFull.style.backgroundImage = `url(${imagemPreview})`;
      popupImageTop.style.backgroundImage = `url(${imagemPreview})`;
      popupImageMiddle.style.backgroundImage = `url(${imagemPreview})`;
    } else {
      popupImageFull.style.backgroundImage = "none";
      popupImageTop.style.backgroundImage = "none";
      popupImageMiddle.style.backgroundImage = "none";
    }
  }

  function updateLayoutVisibility() {
    const tipoLayout = selecionarLayoutSelect.value;

    if (tipoLayout === "335") {
      tituloSection.style.display = "none";
      subtituloSection.style.display = "none";
      ctaSection.style.display = "none";
      fundoSection.style.display = "none";
    } else {
      tituloSection.style.display = "block";
      subtituloSection.style.display = "block";
      ctaSection.style.display = "block";
      fundoSection.style.display = "block";
    }

    updatePreview();
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
    idManualContainer.style.display =
      idSelect.value === "manual" ? "block" : "none";
  }

  function validarFormatoHex(cor) {
    if (!cor || cor === "") return true;
    if (!cor.startsWith("#") || cor.length !== 7) return false;
    const hexRegex = /^#[0-9A-Fa-f]{6}$/;
    return hexRegex.test(cor);
  }

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

  function verificarResolucaoImagem(imagem) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const tipoLayout = selecionarLayoutSelect.value;

      img.onload = () => {
        if (tipoLayout === "335" && (img.width > 660 || img.height > 1267)) {
          showModal(
            "Erro",
            "A resolução da imagem para esse tipo de layout não pode ultrapassar 660x1267 pixels."
          );
          statusArquivo.textContent =
            "Erro: resolução da imagem muito alta para o layout 335";
          statusArquivo.style.color = "red";
          reject(new Error("Resolução da imagem muito alta para o layout 335"));
        } else if (
          (tipoLayout === "334" || tipoLayout === "333") &&
          (img.width > 500 || img.height > 500)
        ) {
          showModal(
            "Erro",
            "A resolução da imagem para esse tipo de layout não pode ultrapassar 500x500 pixels."
          );
          statusArquivo.textContent = `Erro: resolução da imagem muito alta para o layout ${tipoLayout}`;
          statusArquivo.style.color = "red";
          reject(
            new Error(
              `Resolução da imagem muito alta para o layout ${tipoLayout}`
            )
          );
        } else {
          const limiteTamanhoBytes = 100 * 1024;
          if (imagem.size > limiteTamanhoBytes) {
            showModal(
              "Erro",
              "O tamanho da imagem não pode ultrapassar 100KB."
            );
            statusArquivo.textContent =
              "Erro: tamanho da imagem excede o limite de 100KB";
            statusArquivo.style.color = "red";
            reject(new Error("Tamanho da imagem excede o limite de 100KB."));
          } else {
            resolve();
          }
        }
      };

      img.onerror = () => {
        showModal("Erro", "Erro ao carregar a imagem.");
        statusArquivo.textContent = "Erro ao carregar a imagem";
        statusArquivo.style.color = "red";
        reject(new Error("Erro ao carregar a imagem."));
      };

      img.src = URL.createObjectURL(imagem);
    });
  }

  function validarFormulario() {
    const camposComEspaco = {
      corBordaCTA: corBordaCTAInput,
      corFundoCTA: corFundoCTAInput,
      corFim: corFimInput,
      corInicio: corInicioInput,
      corTextoCTA: corTextoCTAInput,
      corSubtitulo: corSubtituloInput,
      corTitulo: corTituloInput,
      corBtnFechar: corBtnFecharInput,
    };

    for (const [campoId, elemento] of Object.entries(camposComEspaco)) {
      const valorCampo = elemento.value.trim();
      if (valorCampo && valorCampo.includes(" ")) {
        showModal(
          "Erro",
          `O campo ${campoId} não pode conter espaços em branco.`
        );
        return false;
      }
    }

    if (selecionarLayoutSelect.value !== "335") {
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
    }

    if (!imagemFile) {
      showModal("Erro", "É necessário selecionar uma imagem.");
      return false;
    }

    if (!numeroAcaoInput.value) {
      showModal("Erro", "É necessário informar o número de ação.");
      return false;
    }

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

  async function prepararDadosAPI() {
    const tipoLayout = selecionarLayoutSelect.value;

    let tituloFinal = tipoLayout === "335" ? "" : tituloInput.value;
    let subtituloFinal = tipoLayout === "335" ? "" : subtituloInput.value;
    let textoCTAFinal = tipoLayout === "335" ? "" : textoCTAInput.value;
    let corTituloFinal = tipoLayout === "335" ? "" : corTituloInput.value;
    let corSubtituloFinal = tipoLayout === "335" ? "" : corSubtituloInput.value;
    let corTextoCTAFinal = tipoLayout === "335" ? "" : corTextoCTAInput.value;
    let corFundoCTAFinal = tipoLayout === "335" ? "" : corFundoCTAInput.value;
    let corBordaCTAFinal = tipoLayout === "335" ? "" : corBordaCTAInput.value;

    let setTamanhoTitulo = "1";
    if (tamanhoTituloSelect.value === "50") setTamanhoTitulo = "2";
    else if (tamanhoTituloSelect.value === "65") setTamanhoTitulo = "3";

    let setTamanhoSubtitulo = "1";
    if (tamanhoSubtituloSelect.value === "28") setTamanhoSubtitulo = "2";
    else if (tamanhoSubtituloSelect.value === "32") setTamanhoSubtitulo = "3";

    // link e ID
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

    const imagemBase64 = await convertImageToBase64(imagemFile);

    const formData = new FormData();
    formData.append("numeroAcao", numeroAcaoInput.value);
    formData.append("imagem", imagemBase64);
    formData.append("tipoLayout", tipoLayout);
    formData.append("titulo", tituloFinal);
    formData.append("subtitulo", subtituloFinal);
    formData.append("textoCTA", textoCTAFinal);
    formData.append("corTitulo", corTituloFinal);
    formData.append("corSubtitulo", corSubtituloFinal);
    formData.append("corTextoCTA", corTextoCTAFinal);
    formData.append("corFundoCTA", corFundoCTAFinal);
    formData.append("corBordaCTA", corBordaCTAFinal);
    formData.append("corInicio", corInicioInput.value);
    formData.append("corFim", corFimInput.value);
    formData.append("metodo", metodo);
    formData.append("link", linkValue);
    formData.append("codigo", codigoFinal);
    formData.append("idCAT", idCATFinal);
    formData.append("tamanhoTitulo", setTamanhoTitulo);
    formData.append("tamanhoSubtitulo", setTamanhoSubtitulo);
    formData.append("textoBotaoFechar", textoBtnFecharInput.value);
    formData.append("corBotaoFechar", corBtnFecharInput.value);

    return formData;
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

  const enviarParaAPI = window.apiService.createApiSender({
    verificarResolucaoImagem: verificarResolucaoImagem,
    validarFormulario: validarFormulario,
    prepararDadosAPI: prepararDadosAPI,
    showModal: showModal,
    btnEnviarAPI: btnEnviarAPI,
    apiUrl: apiUrl,
    imagemFile: () => imagemFile,
  });

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

  corBtnFecharColorInput.addEventListener("input", function () {
    corBtnFecharInput.value = this.value;
    updatePreview();
  });

  corBtnFecharInput.addEventListener("input", function () {
    if (validarFormatoHex(this.value)) {
      corBtnFecharColorInput.value = this.value;
      updatePreview();
    }
  });

  tituloInput.addEventListener("input", updatePreview);
  subtituloInput.addEventListener("input", updatePreview);
  textoCTAInput.addEventListener("input", updatePreview);
  textoBtnFecharInput.addEventListener("input", updatePreview);

  tamanhoTituloSelect.addEventListener("change", updatePreview);
  tamanhoSubtituloSelect.addEventListener("change", updatePreview);

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
