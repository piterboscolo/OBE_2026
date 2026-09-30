(function () {
  const form = document.getElementById("cadastro-form");
  const errEl = document.getElementById("cadastro-error");
  const okEl = document.getElementById("cadastro-ok");
  const btn = document.getElementById("cad-submit");

  function showError(msg) {
    if (okEl) okEl.hidden = true;
    if (!errEl) return;
    errEl.textContent = msg;
    errEl.hidden = false;
  }

  function clearMessages() {
    if (errEl) errEl.hidden = true;
    if (okEl) okEl.hidden = true;
  }

  // Cadastro bloqueado — somente administrador libera novos usuários
  if (btn) {
    btn.disabled = true;
    btn.textContent = "Cadastro bloqueado";
  }
  showError(
    "Não está autorizado o cadastro do usuário. Procure o administrador do sistema."
  );

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    clearMessages();
    showError(
      "Não está autorizado o cadastro do usuário. Procure o administrador do sistema."
    );
  });

  document.getElementById("link-entrar")?.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.replace("index.html");
  });
})();
