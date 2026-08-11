(function () {
  const STORAGE_KEY = "obe_sge_user_2026";
  const AUTH = {
    login: "admin",
    senha: "admin",
  };

  const loginForm = document.getElementById("login-form");
  const loginError = document.getElementById("login-error");

  function goHome(login) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ name: login, login: login })
    );
    // auth na URL garante o acesso mesmo em file://
    window.location.replace(
      "home.html?auth=" + encodeURIComponent(login)
    );
  }

  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (saved?.login === AUTH.login) {
      goHome(AUTH.login);
      return;
    }
  } catch (_) {
    /* segue no login */
  }

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const login = document.getElementById("login-user").value.trim();
    const senha = document.getElementById("login-pass").value;

    if (login === AUTH.login && senha === AUTH.senha) {
      if (loginError) loginError.hidden = true;
      goHome(login);
      return;
    }

    if (loginError) loginError.hidden = false;
  });
})();
