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
    const login = String(user.login || "").trim();
    const supervisor = Boolean(auth.isNaListaSupervisor?.(login) || auth.findByRe?.(login));
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        login,
        name: user.nome || login,
        setor: "",
        setorCurto: "",
        graduacao: "",
        fromDb: true,
        supervisor,
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
          "home.html?auth=" + encodeURIComponent(saved.login)
        );
        return;
      }
    }
  } catch (_) {
    /* segue no login */
  }

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideError();

    const login = document.getElementById("login-user").value.trim();
    const senha = document.getElementById("login-pass").value;

    const localUser = auth.validateCredentials(login, senha);
    if (localUser) {
      goHomeLocal(localUser);
      return;
    }

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
      const dbUser = await window.OBE_DB.loginUsuario(login, senha);
      if (dbUser) {
        goHomeDb(dbUser);
        return;
      }
      showError("Login ou senha inválidos");
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
