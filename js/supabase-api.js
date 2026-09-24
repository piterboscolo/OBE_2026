(function () {
  const cfg = window.OBE_SUPABASE || {};

  function isConfigured() {
    return Boolean(cfg.url && cfg.anonKey);
  }

  function getClient() {
    if (!isConfigured()) return null;
    if (!window.supabase || typeof window.supabase.createClient !== "function") {
      return null;
    }
    if (!window.__obeSupabaseClient) {
      window.__obeSupabaseClient = window.supabase.createClient(cfg.url, cfg.anonKey);
    }
    return window.__obeSupabaseClient;
  }

  async function criarUsuario(login, senha, nome) {
    const client = getClient();
    if (!client) {
      throw new Error("Configure a URL e a chave do Supabase em js/config.js");
    }
    const { data, error } = await client.rpc("criar_usuario", {
      p_login: login,
      p_senha: senha,
      p_nome: nome,
    });
    if (error) throw new Error(error.message || "Não foi possível criar o usuário");
    return data;
  }

  async function loginUsuario(login, senha) {
    const client = getClient();
    if (!client) {
      throw new Error("Configure a URL e a chave do Supabase em js/config.js");
    }
    const { data, error } = await client.rpc("login_usuario", {
      p_login: login,
      p_senha: senha,
    });
    if (error) throw new Error(error.message || "Falha no login");
    if (!data || !data.length) return null;
    return data[0];
  }

  window.OBE_DB = {
    isConfigured,
    getClient,
    criarUsuario,
    loginUsuario,
  };
})();
