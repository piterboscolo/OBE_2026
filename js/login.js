(function () {
  const STORAGE_KEY = "obe_sge_user_2026";
  const auth = window.OBE_AUTH;

  const loginForm = document.getElementById("login-form");
  const loginError = document.getElementById("login-error");
  const submitBtn = loginForm?.querySelector('button[type="submit"]');

  function showError(msg) {
    if (!loginError) return;
    loginError.textContent = msg || "Login ou senha inválidos";
    loginError.hidden = false;
  }

  function hideError() {
    if (loginError) loginError.hidden = true;
  }

  function onlyRe(value) {
    return String(value || "").trim().replace(/\D/g, "");
  }

  function goHomeLocal(user) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        login: user.re,
        name: user.nome,
        setor: user.setor,
        setorCurto: user.setorCurto,
        graduacao: user.graduacao,
        supervisor: true,
      })
    );
    window.location.replace(
      "home.html?auth=" + encodeURIComponent(user.re)
    );
  }

  function goHomeDb(user) {
    const login = onlyRe(user.login);
    const efetivo = auth.findByRe?.(login);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        login,
        name: efetivo?.nome || user.nome || login,
        setor: efetivo?.setor || "",
        setorCurto: efetivo?.setorCurto || "",
        graduacao: efetivo?.graduacao || "",
        fromDb: true,
        supervisor: Boolean(efetivo),
      })
    );
    window.location.replace(
      "home.html?auth=" + encodeURIComponent(login)
    );
  }

  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (saved?.login) {
      const localUser = auth.findByRe(saved.login);
      if (localUser) {
        goHomeLocal(localUser);
        return;
      }
      if (saved.fromDb) {
        window.location.replace(
          "home.html?auth=" + encodeURIComponent(onlyRe(saved.login))
        );
        return;
      }
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch (_) {
    /* segue no login */
  }

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideError();

    const re = onlyRe(document.getElementById("login-user").value);
    const senha = document.getElementById("login-pass").value;

    if (!re || re.length < 3) {
      showError("Informe o RE (sem dígito).");
      return;
    }
    if (!senha) {
      showError("Informe a senha.");
      return;
    }

    // 1) Autorizado em users.js (EM / lista local)
    const localUser = auth.validateCredentials(re, senha);
    if (localUser) {
      goHomeLocal(localUser);
      return;
    }

    // 2) Autorizado na tabela usuarios (cadastro no banco)
    if (!window.OBE_DB?.loginUsuario) {
      showError(
        "Site desatualizado: falta supabase-api.js. Publique de novo a pasta OBE_2026."
      );
      return;
    }

    if (!window.OBE_DB.isConfigured()) {
      showError(
        "Configuração do Supabase ausente no servidor. Confira js/config.js no site publicado."
      );
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Entrando…";
    }

    try {
      const dbUser = await window.OBE_DB.loginUsuario(re, senha);
      if (dbUser) {
        goHomeDb(dbUser);
        return;
      }
      showError(
        "Acesso negado. RE não cadastrado no sistema!"
      );
    } catch (err) {
      const msg = String(err?.message || err || "");
      if (/Failed to fetch|conectar|NetworkError|Load failed/i.test(msg)) {
        showError(
          "Sem conexão com o Supabase neste endereço. Verifique a internet ou o bloqueio do navegador."
        );
      } else if (/Could not find the function|schema cache|404/i.test(msg)) {
        showError(
          "Função login_usuario não encontrada. Execute fix_gravacao.sql no Supabase."
        );
      } else {
        showError(msg || "Login ou senha inválidos");
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Entrar";
      }
    }
  });
})();
