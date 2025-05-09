const apiService = (function () {
  return function createApiSender(config) {
    const {
      validarFormulario,
      prepararDadosAPI,
      showModal,
      btnEnviarAPI,
      apiUrl,
    } = config;

    return async function enviarParaAPI() {
      if (!validarFormulario()) {
        return;
      }

      btnEnviarAPI.innerHTML = '<div class="loadingSpinner"></div> Enviando...';
      btnEnviarAPI.disabled = true;
      btnEnviarAPI.classList.add("btnLoading");

      try {
        const dadosJSON = await prepararDadosAPI();

        if (!dadosJSON) {
          throw new Error("Falha na preparação dos dados");
        }

        if (!dadosJSON.imagem) {
          throw new Error("Imagem base64 não foi gerada corretamente");
        }

        console.log("Dados preparados com sucesso. Enviando para API...");
        console.log(
          "Objeto JSON tem as seguintes chaves:",
          Object.keys(dadosJSON).join(", ")
        );

        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dadosJSON),
        });

        const contentType = response.headers.get("content-type");

        if (response.ok) {
          if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
            console.log("Resposta do servidor:", data);
            showModal(
              "Sucesso",
              "Card criado com sucesso! O script foi gerado e executado no servidor."
            );
          } else {
            showModal(
              "Sucesso",
              "Card criado com sucesso! O servidor respondeu com êxito."
            );
          }
        } else {
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
              const errorText = await response.text();
              showModal(
                "Erro",
                `Falha ao criar o card. Resposta do servidor: ${
                  errorText.substring(0, 100) || "Erro desconhecido"
                }`
              );
            }
          } else {
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
        btnEnviarAPI.innerHTML = "Enviar para API";
        btnEnviarAPI.disabled = false;
        btnEnviarAPI.classList.remove("btnLoading");
      }
    };
  };
})();

if (typeof module !== "undefined" && module.exports) {
  module.exports = apiService;
} else {
  window.apiService = apiService;
}
