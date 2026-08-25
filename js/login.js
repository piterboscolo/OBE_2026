(function () {
  const STORAGE_KEY = "obe_sge_user_2026";
  const auth = window.OBE_AUTH;

  const loginForm = document.getElementById("login-form");
  const loginError = document.getElementById("login-error");

  function goHome(user) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        login: user.re,
        name: user.nome,
        setor: user.setor,
      })
    );
    window.location.replace(
      "home.html?auth=" + encodeURIComponent(user.re)
    );
  }

  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    const savedUser = saved?.login ? auth.findByRe(saved.login) : null;
    if (savedUser) {
      goHome(savedUser);
      return;
    }
  } catch (_) {
    /* segue no login */
  }

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const login = document.getElementById("login-user").value.trim();
    const senha = document.getElementById("login-pass").value;
    const user = auth.validateCredentials(login, senha);

    if (user) {
      if (loginError) loginError.hidden = true;
      goHome(user);
      return;
    }

    if (loginError) loginError.hidden = false;
  });
})();
