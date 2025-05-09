const createApiSender = function (config) {
  const {
    verificarResolucaoImagem,
    validarFormulario,
    prepararDadosAPI,
    showModal,
    btnEnviarAPI,
    apiUrl,
    imagemFile,
  } = config;

  return async function enviarParaAPI() {
    try {
      await verificarResolucaoImagem(imagemFile());

      if (!validarFormulario()) {
        return;
      }

      btnEnviarAPI.innerHTML = '<div class="loadingSpinner"></div> Enviando...';
      btnEnviarAPI.disabled = true;
      btnEnviarAPI.classList.add("btnLoading");

      try {
        const formData = await prepararDadosAPI();

        const response = await fetch(apiUrl, {
          method: "POST",
          body: formData,
        });

        const contentType = response.headers.get("content-type");

        if (response.ok) {
          if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
            showModal(
              "Sucesso",
              "Popup criado com sucesso! O script foi gerado e executado no servidor."
            );
          } else {
            showModal(
              "Sucesso",
              "Popup criado com sucesso! O servidor respondeu com êxito."
            );
          }
        } else {
          if (contentType && contentType.includes("application/json")) {
            try {
              const errorData = await response.json();
              showModal(
                "Erro",
                `Falha ao criar o popup: ${
                  errorData.message || "Erro desconhecido"
                }`
              );
            } catch (e) {
              const errorText = await response.text();
              showModal(
                "Erro",
                `Falha ao criar o popup. Resposta do servidor: ${
                  errorText.substring(0, 100) || "Erro desconhecido"
                }`
              );
            }
          } else {
            const errorText = await response.text();
            showModal(
              "Erro",
              `Falha ao criar o popup. Código: ${response.status}. Resposta: ${
                errorText.substring(0, 100) || "Erro desconhecido"
              }`
            );
          }
        }
      } catch (error) {
        showModal("Erro", `Falha ao enviar dados: ${error.message}`);
      } finally {
        btnEnviarAPI.innerHTML = "Enviar para API";
        btnEnviarAPI.disabled = false;
        btnEnviarAPI.classList.remove("btnLoading");
      }
    } catch (error) {
      console.error("Erro na validação:", error);
    }
  };
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = { createApiSender };
} else {
  window.apiService = { createApiSender };
}
