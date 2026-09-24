(function () {
  function getConfig() {
    const cfg = window.OBE_SUPABASE || {};
    return {
      url: String(cfg.url || "").trim().replace(/\/$/, ""),
      anonKey: String(cfg.anonKey || "").trim(),
    };
  }

  function isConfigured() {
    const { url, anonKey } = getConfig();
    return Boolean(url && anonKey);
  }

  function isUuid(value) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      String(value || "")
    );
  }

  async function rpc(fnName, params) {
    const { url, anonKey } = getConfig();
    if (!url || !anonKey) {
      throw new Error("Configure a URL e a chave do Supabase em js/config.js");
    }

    const endpoint = `${url}/rest/v1/rpc/${fnName}`;
    let response;
    try {
      response = await fetch(endpoint, {
        method: "POST",
        headers: {
          apikey: anonKey,
          Authorization: `Bearer ${anonKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });
    } catch (_) {
      throw new Error(
        "Não foi possível conectar ao Supabase. Verifique a internet e a URL do projeto."
      );
    }

    const text = await response.text();
    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch (_) {
      data = text;
    }

    if (!response.ok) {
      const msg =
        (data && (data.message || data.error || data.hint)) ||
        text ||
        `Erro HTTP ${response.status}`;
      throw new Error(msg);
    }

    return data;
  }

  async function criarUsuario(login, senha, nome) {
    const data = await rpc("criar_usuario", {
      p_login: login,
      p_senha: senha,
      p_nome: nome,
    });

    // PostgREST pode devolver o uuid puro (string) ou entre aspas já parseado
    const id = typeof data === "string" ? data.replace(/^"|"$/g, "") : data;
    if (!isUuid(id)) {
      throw new Error(
        "O banco não confirmou o cadastro (sem ID). Execute o SQL fix_gravacao.sql no Supabase."
      );
    }
    return id;
  }

  async function loginUsuario(login, senha) {
    const data = await rpc("login_usuario", {
      p_login: login,
      p_senha: senha,
    });
    if (!data || (Array.isArray(data) && !data.length)) return null;
    return Array.isArray(data) ? data[0] : data;
  }

  window.OBE_DB = {
    isConfigured,
    getConfig,
    criarUsuario,
    loginUsuario,
  };
})();
