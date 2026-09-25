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

  async function salvarResultadoQuantitativo(payload) {
    const data = await rpc("salvar_resultado_quantitativo", {
      p_login: payload.login,
      p_nome: payload.nome || null,
      p_pessoas_abordadas: Number(payload.pessoas_abordadas) || 0,
      p_veiculos_fiscalizados: Number(payload.veiculos_fiscalizados) || 0,
      p_apoio_ao_publico: Number(payload.apoio_ao_publico) || 0,
      p_bopm: Number(payload.bopm) || 0,
      p_conducao_ao_dp: Number(payload.conducao_ao_dp) || 0,
      p_flagrante_delito: Number(payload.flagrante_delito) || 0,
      p_armas_apreendidas: Number(payload.armas_apreendidas) || 0,
      p_drogas_kg: Number(payload.drogas_kg) || 0,
    });
    const id = typeof data === "string" ? data.replace(/^"|"$/g, "") : data;
    if (!isUuid(id)) {
      throw new Error(
        "O banco não confirmou o envio. Execute resultados_quantitativos.sql no Supabase."
      );
    }
    return id;
  }

  async function listarResultadosQuantitativos(login, limite) {
    const data = await rpc("listar_resultados_quantitativos", {
      p_login: login || null,
      p_limite: limite || 10,
    });
    if (!data) return [];
    return Array.isArray(data) ? data : [data];
  }

  window.OBE_DB = {
    isConfigured,
    getConfig,
    criarUsuario,
    loginUsuario,
    salvarResultadoQuantitativo,
    listarResultadosQuantitativos,
  };
})();
