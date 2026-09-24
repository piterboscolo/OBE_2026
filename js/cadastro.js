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

  function showOk(msg) {
    if (errEl) errEl.hidden = true;
    if (!okEl) return;
    okEl.textContent = msg || "Usuário criado com sucesso.";
    okEl.hidden = false;
  }

  function clearMessages() {
    if (errEl) errEl.hidden = true;
    if (okEl) okEl.hidden = true;
  }

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearMessages();

    const re = document.getElementById("cad-login").value.trim().replace(/\D/g, "");
    const senha = document.getElementById("cad-senha").value;
    const senha2 = document.getElementById("cad-senha2").value;

    if (!re || re.length < 3) {
      showError("Informe o RE (sem dígito).");
      return;
    }
    if (senha.length < 4) {
      showError("A senha deve ter no mínimo 4 caracteres.");
      return;
    }
    if (senha !== senha2) {
      showError("As senhas não coincidem.");
      return;
    }

    const cfg = window.OBE_DB?.getConfig?.() || {};
    if (!cfg.url || !cfg.anonKey) {
      showError("Configuração do Supabase não carregou. Atualize a página (Ctrl+F5).");
      return;
    }

    if (btn) {
      btn.disabled = true;
      btn.textContent = "Cadastrando…";
    }

    try {
      const id = await window.OBE_DB.criarUsuario(re, senha, re);
      if (!id) {
        showError("Cadastro não confirmado pelo banco. Verifique o Supabase.");
        return;
      }
      showOk("Usuário criado com sucesso. Redirecionando…");
      form.reset();
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1200);
    } catch (err) {
      const msg = String(err?.message || err || "Erro ao cadastrar");
      if (/Já existe|duplicate|unique/i.test(msg)) {
        showError("Já existe um usuário com este RE.");
      } else if (/Could not find the function|schema cache|404/i.test(msg)) {
        showError("Função criar_usuario não encontrada. Execute o SQL usuarios.sql no Supabase.");
      } else {
        showError(msg);
      }
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = "Cadastrar";
      }
    }
  });
})();
