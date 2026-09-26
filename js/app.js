(function () {
  const STORAGE_KEY = "obe_sge_user_2026";
  const auth = window.OBE_AUTH;

  const main = document.getElementById("main");
  const userInitials = document.getElementById("user-initials");
  const navItems = document.querySelectorAll(".nav-item");

  let currentUser = null;
  let currentRoute = "inicio";

  function acceptUser(re) {
    const key = String(re || "").trim();
    const user = auth.findByRe(key);
    if (user) {
      currentUser = {
        login: user.re,
        name: user.nome,
        setor: user.setor,
        setorCurto: user.setorCurto,
        graduacao: user.graduacao,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser));
      return true;
    }

    // Usuário cadastrado no Supabase (sessão gravada no login)
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (saved?.login && String(saved.login) === key) {
        currentUser = saved;
        return true;
      }
    } catch (_) {
      /* ignora */
    }
    return false;
  }

  function userGreeting() {
    const full = auth.findByRe(currentUser?.login);
    if (full) return auth.greeting(full);
    return auth.greeting({
      nome: currentUser?.name,
      setor: currentUser?.setor,
      setorCurto: currentUser?.setorCurto,
      graduacao: currentUser?.graduacao,
    });
  }

  function fillGreeting() {
    const el = document.getElementById("home-greeting");
    if (el) el.innerHTML = userGreeting();
  }

  const authFromUrl = new URLSearchParams(window.location.search).get("auth");
  if (authFromUrl && acceptUser(authFromUrl)) {
    history.replaceState({}, "", "home.html");
  } else {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (saved?.login && acceptUser(saved.login)) {
        /* sessão válida */
      } else {
        window.location.replace("index.html");
        return;
      }
    } catch (_) {
      window.location.replace("index.html");
      return;
    }
  }

  const statusMap = {
    em_campo: { label: "Em campo", className: "" },
    deslocamento: { label: "Deslocamento", className: "badge--warn" },
    base: { label: "Na base", className: "badge--idle" },
    ativo: { label: "Ativo", className: "" },
    standby: { label: "Stand-by", className: "badge--idle" },
    enviado: { label: "Enviado", className: "" },
    rascunho: { label: "Rascunho", className: "badge--warn" },
    pendente: { label: "Pendente", className: "badge--idle" },
    critica: { label: "Crítica", className: "badge--danger" },
    alta: { label: "Alta", className: "badge--warn" },
    media: { label: "Média", className: "badge--idle" },
    baixa: { label: "Baixa", className: "badge--idle" },
  };

  const navRoutes = new Set(["inicio", "escala", "cpp", "mais"]);

  function initials(name) {
    return String(name || "")
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p[0])
      .join("")
      .toUpperCase();
  }

  function badge(status) {
    const info = statusMap[status] || { label: status, className: "badge--idle" };
    return `<span class="badge ${info.className}">${info.label}</span>`;
  }

  function setActiveNav(route) {
    const highlight = navRoutes.has(route) ? route : "inicio";
    navItems.forEach((btn) => {
      const active = btn.dataset.route === highlight;
      btn.classList.toggle("is-active", active);
      if (active) btn.setAttribute("aria-current", "page");
      else btn.removeAttribute("aria-current");
    });
  }

  function pageHeader(titulo, subtitulo) {
    return `
      <header class="page-head">
        <h2>${titulo}</h2>
        <p>${subtitulo}</p>
      </header>`;
  }

  function pageBack() {
    return `
      <div class="page-back">
        <button type="button" class="back-btn" data-action="back">← Voltar</button>
      </div>`;
  }

  function cardHtml(m) {
    let icon = (window.obeIcon && window.obeIcon(m.icon)) || "";
    if (icon) {
      icon = icon.replace(
        /<svg\b/,
        '<svg width="32" height="32"'
      );
    }
    return `
      <div class="access-card" data-route="${m.id}" role="button" tabindex="0" aria-label="${m.titulo}">
        <div class="access-card__face">
          <span class="access-card__icon">${icon}</span>
          <h3 class="access-card__title">${m.titulo}</h3>
        </div>
      </div>`;
  }

  function renderInicio() {
    const { modulos } = window.OBE_DATA;
    return `
      <div class="page page--cards-only">
        <div class="home-top">
          <p class="home-greeting" id="home-greeting">${userGreeting()}</p>
          <button type="button" class="btn-sair" id="btn-sair" title="Sair">Sair</button>
        </div>
        <div class="access-grid">
          ${modulos.map(cardHtml).join("")}
        </div>
      </div>
    `;
  }

  function renderPontoApoio() {
    const opcoes = window.OBE_DATA.pontoApoioOpcoes || [];
    return `
      <div class="page page--subcards">
        ${pageHeader("Ponto Apoio", "Policial, abaixo seus pontos de apoio")}
        <div class="access-grid access-grid--sub">
          ${opcoes.map(cardHtml).join("")}
        </div>
        ${pageBack()}
      </div>
    `;
  }

  function renderPontoApoioQr(id) {
    const cfg = window.OBE_DATA?.pontoApoioDestinos?.[id];
    return renderDestinoQr(cfg?.nome || "Ponto Apoio", cfg);
  }

  function renderCppPopQr(id) {
    const cfg = window.OBE_DATA?.popDestinos?.[id];
    return renderDestinoQr(cfg?.nome || "CPP", cfg);
  }

  function renderLocaisInteresse() {
    return `
      <div class="page">
        ${pageHeader("Locais de Interesse", "Escolas e pontos sensíveis")}
        <div class="list">
          ${window.OBE_DATA.locaisInteresse
            .map(
              (l) => `
            <article class="row">
              <div>
                <h3>${l.nome}</h3>
                <p>${l.tipo} · ${l.endereco}</p>
              </div>
              ${badge(l.prioridade)}
            </article>`
            )
            .join("")}
        </div>
        ${pageBack()}
      </div>
    `;
  }

  function renderPontosApoio() {
    return `
      <div class="page">
        ${pageHeader("Pontos de Apoio", "Bases e estruturas de apoio")}
        <div class="list">
          ${window.OBE_DATA.pontosApoio
            .map(
              (p) => `
            <article class="row">
              <div>
                <h3>${p.nome}</h3>
                <p>${p.endereco} · ${p.contato}</p>
              </div>
              ${badge(p.status)}
            </article>`
            )
            .join("")}
        </div>
        ${pageBack()}
      </div>
    `;
  }

  function renderPops() {
    const opcoes = window.OBE_DATA.popOpcoes || [];
    const pin = (window.obeIcon && window.obeIcon("pin")) || "";
    const rows = opcoes
      .map(
        (m) => `
      <div class="pop-chip" data-route="${m.id}" role="button" tabindex="0" aria-label="${m.titulo}">
        <span class="pop-chip__icon">${pin}</span>
        <span class="pop-chip__text">${m.titulo}</span>
      </div>`
      )
      .join("");
    return `
      <div class="page page--pops">
        ${pageHeader("CPP - POP", "Áreas de prioridade de patrulhamento")}
        <div class="pop-list">
          ${rows}
        </div>
        ${pageBack()}
      </div>
    `;
  }

  function renderResultadoQuantitativo() {
    const campos = [
      { id: "pessoas_abordadas", label: "Pessoas Abordadas", step: "1" },
      { id: "veiculos_fiscalizados", label: "Veículos Fiscalizados", step: "1" },
      { id: "apoio_ao_publico", label: "Apoio ao Público", step: "1" },
      { id: "bopm", label: "BOPM", step: "1" },
      { id: "conducao_ao_dp", label: "Condução ao DP", step: "1" },
      { id: "flagrante_delito", label: "Flagrante Delito", step: "1" },
      { id: "armas_apreendidas", label: "Armas Apreendidas", step: "1" },
      { id: "drogas_kg", label: "Drogas (qtd em Kg)", step: "0.001" },
    ];

    const fields = campos
      .map(
        (c) => `
      <label class="rq-row" for="rq-${c.id}">
        <span class="rq-row__label">${c.label}</span>
        <input
          type="number"
          class="rq-row__input"
          id="rq-${c.id}"
          name="${c.id}"
          min="0"
          step="${c.step}"
          value="0"
          inputmode="decimal"
          required
        />
      </label>`
      )
      .join("");

    return `
      <div class="page page--rq">
        ${pageHeader("Resultado Quantitativo", "Preencha os dados do serviço")}
        <form id="rq-form" class="rq-form" autocomplete="off">
          <div class="rq-lista">
            ${fields}
          </div>
          <p id="rq-error" class="login-error" hidden></p>
          <p id="rq-ok" class="rq-ok" hidden>Resultado enviado com sucesso.</p>
          <button type="submit" class="btn btn--primary" id="rq-submit">Enviar</button>
        </form>
        ${pageBack()}
      </div>
    `;
  }

  function renderEventos() {
    const lista = window.OBE_DATA.eventos || [];
    const corpo =
      lista.length > 0
        ? `<div class="list">
          ${lista
            .map(
              (e) => `
            <article class="row row--evento">
              <div>
                <h3>${e.titulo}</h3>
                <p class="row__meta">${e.data || ""}${e.hora ? ` · ${e.hora}` : ""}${e.local ? ` · ${e.local}` : ""}</p>
                ${e.descricao ? `<p class="row__desc">${e.descricao}</p>` : ""}
              </div>
              <span class="badge">${e.status || "Agenda"}</span>
            </article>`
            )
            .join("")}
        </div>`
        : `<p class="empty">Nenhum evento cadastrado no momento.</p>`;

    return `
      <div class="page">
        ${pageHeader("Eventos", "Agenda e programação da operação")}
        ${corpo}
        ${pageBack()}
      </div>
    `;
  }

  function renderAbastecimento() {
    const opcoes = window.OBE_DATA.pontosInteresseOpcoes || [];
    return `
      <div class="page page--subcards">
        ${pageHeader("Auxílio ao Público", "Escolha o tipo de apoio")}
        <div class="access-grid access-grid--sub">
          ${opcoes.map(cardHtml).join("")}
        </div>
        ${pageBack()}
      </div>
    `;
  }

  function mapsDirectionsUrl(destino, travelmode) {
    const params = new URLSearchParams({
      api: "1",
      destination: destino || "",
      travelmode: travelmode || "driving",
      dir_action: "navigate",
    });
    return `https://www.google.com/maps/dir/?${params.toString()}`;
  }

  function qrImageUrl(data) {
    return (
      "https://api.qrserver.com/v1/create-qr-code/?size=260x260&ecc=M&margin=8&data=" +
      encodeURIComponent(data)
    );
  }

  function renderDestinoQr(titulo, cfg) {
    const nome = cfg?.nome || titulo;
    const mapsUrl = mapsDirectionsUrl(cfg?.destino, cfg?.travelmode);
    const qrSrc = qrImageUrl(mapsUrl);
    const telefone = cfg?.telefone
      ? `<p class="qr-box__phone">${cfg.telefone}</p>`
      : "";
    const horario = cfg?.horario
      ? `<p class="qr-box__hours">${cfg.horario}</p>`
      : "";
    const detalhes = cfg?.detalhes
      ? `<p class="qr-box__details">${cfg.detalhes}</p>`
      : "";
    const endereco = cfg?.destino
      ? `<p class="qr-box__addr">${cfg.destino}</p>`
      : "";
    const enderecoAlt = cfg?.enderecoAlt
      ? `<p class="qr-box__addr">${cfg.enderecoAlt}</p>`
      : "";
    return `
      <div class="page page--qr">
        ${pageHeader(titulo, "Escaneie para abrir a rota no Maps")}
        <div class="qr-box">
          <img
            class="qr-box__img"
            src="${qrSrc}"
            alt="QR Code rota até ${nome}"
          />
        </div>
        <p class="qr-box__hint">Ao escanear, o Maps abre a rota da sua localização até <strong>${nome}</strong>.</p>
        ${endereco}
        ${enderecoAlt}
        ${detalhes}
        ${horario}
        ${telefone}
        <a class="qr-box__open" href="${mapsUrl}" target="_blank" rel="noopener noreferrer">Abrir no Maps</a>
        ${pageBack()}
      </div>
    `;
  }

  function renderMetroQr() {
    return renderDestinoQr("Metro", window.OBE_DATA?.metroDestino);
  }

  function renderShopping() {
    const opcoes = window.OBE_DATA.shoppingOpcoes || [];
    return `
      <div class="page page--subcards">
        ${pageHeader("Shopping", "Escolha o shopping")}
        <div class="access-grid access-grid--sub">
          ${opcoes.map(cardHtml).join("")}
        </div>
        ${pageBack()}
      </div>
    `;
  }

  function renderShoppingQr(id) {
    const cfg = window.OBE_DATA?.shoppingDestinos?.[id];
    return renderDestinoQr(cfg?.nome || "Shopping", cfg);
  }

  function renderHospital() {
    const opcoes = window.OBE_DATA.hospitalOpcoes || [];
    return `
      <div class="page page--subcards">
        ${pageHeader("Hospital", "Escolha a unidade")}
        <div class="access-grid access-grid--sub">
          ${opcoes.map(cardHtml).join("")}
        </div>
        ${pageBack()}
      </div>
    `;
  }

  function renderHospitalQr(id) {
    const cfg = window.OBE_DATA?.hospitalDestinos?.[id];
    return renderDestinoQr(cfg?.nome || "Hospital", cfg);
  }

  function renderParques() {
    const opcoes = window.OBE_DATA.parquesOpcoes || [];
    const corpo =
      opcoes.length > 0
        ? `<div class="access-grid access-grid--sub">${opcoes.map(cardHtml).join("")}</div>`
        : `<p class="empty">Nenhum parque cadastrado no momento.</p>`;
    return `
      <div class="page page--subcards">
        ${pageHeader("Parques", "Escolha o parque")}
        ${corpo}
        ${pageBack()}
      </div>
    `;
  }

  function renderParqueQr(id) {
    const cfg = window.OBE_DATA?.parquesDestinos?.[id];
    return renderDestinoQr(cfg?.nome || "Parque", cfg);
  }

  function renderEspacos() {
    const opcoes = window.OBE_DATA.espacosOpcoes || [];
    const corpo =
      opcoes.length > 0
        ? `<div class="access-grid access-grid--sub">${opcoes.map(cardHtml).join("")}</div>`
        : `<p class="empty">Nenhum espaço cadastrado no momento.</p>`;
    return `
      <div class="page page--subcards">
        ${pageHeader("Espaços", "Escolha o espaço")}
        ${corpo}
        ${pageBack()}
      </div>
    `;
  }

  function renderEspacoQr(id) {
    const cfg = window.OBE_DATA?.espacosDestinos?.[id];
    return renderDestinoQr(cfg?.nome || "Espaço", cfg);
  }

  function renderDelegacias() {
    const opcoes = window.OBE_DATA.delegaciasOpcoes || [];
    const corpo =
      opcoes.length > 0
        ? `<div class="access-grid access-grid--sub">${opcoes.map(cardHtml).join("")}</div>`
        : `<p class="empty">Nenhuma delegacia cadastrada no momento.</p>`;
    return `
      <div class="page page--subcards">
        ${pageHeader("Delegacias", "Escolha o Distrito Policial")}
        ${corpo}
        ${pageBack()}
      </div>
    `;
  }

  function renderDelegaciaQr(id) {
    const cfg = window.OBE_DATA?.delegaciasDestinos?.[id];
    return renderDestinoQr(cfg?.nome || "Delegacia", cfg);
  }

  function renderEscala(fromNav) {
    return `
      <div class="page">
        ${pageHeader("Escala de Serviço", "Turnos e equipes do dia")}
        <div class="list">
          ${window.OBE_DATA.escala
            .map(
              (e) => `
            <article class="row">
              <div>
                <h3>${e.equipe}</h3>
                <p>${e.turno} · ${e.funcao}</p>
                <p>Resp.: ${e.responsavel}</p>
              </div>
              <span class="badge">Plantão</span>
            </article>`
            )
            .join("")}
        </div>
        ${!fromNav ? pageBack() : ""}
      </div>
    `;
  }

  function renderCpp() {
    const opcoes = window.OBE_DATA.cppOpcoes || [];
    return `
      <div class="page page--subcards">
        ${pageHeader("Área Policial", "Escolha o acesso desejado")}
        <div class="access-grid access-grid--sub">
          ${opcoes.map(cardHtml).join("")}
        </div>
        ${pageBack()}
      </div>
    `;
  }

  function renderVtr() {
    const opcoes = window.OBE_DATA.vtrOpcoes || [];
    return `
      <div class="page page--subcards">
        ${pageHeader("CPP VTR", "Mapa e documentação do CPP")}
        <div class="access-grid access-grid--sub">
          ${opcoes.map(cardHtml).join("")}
        </div>
        ${pageBack()}
      </div>
    `;
  }

  function renderMais() {
    const nome = currentUser?.name || "Operador";
    const atalhos = window.OBE_DATA.modulos;
    return `
      <div class="page">
        <header class="page-head">
          <h2>Mais opções</h2>
          <p>Conectado como ${nome}</p>
        </header>
        <h3 class="section-title">Atalhos dos módulos</h3>
        <div class="menu-list" style="margin-bottom:12px">
          ${atalhos
            .map(
              (m) => `
            <button type="button" class="menu-item" data-route="${m.id}">
              <div>
                <span>${m.titulo}</span>
                <small>${m.descricao}</small>
              </div>
              <em>${m.sigla}</em>
            </button>`
            )
            .join("")}
        </div>
        <div class="menu-list">
          <button type="button" class="menu-item" data-action="logout">
            <div>
              <span>Sair</span>
              <small>Encerrar sessão neste aparelho</small>
            </div>
            <em>→</em>
          </button>
        </div>
      </div>
    `;
  }

  const routes = {
    inicio: renderInicio,
    "ponto-apoio": renderPontoApoio,
    "mapa-forca": renderPontoApoio,
    "locais-interesse": renderLocaisInteresse,
    "pontos-apoio": renderPontosApoio,
    pops: renderPops,
    "cpp-doc": renderPops,
    rso: renderResultadoQuantitativo,
    resultado: renderResultadoQuantitativo,
    eventos: renderEventos,
    abastecimento: renderAbastecimento,
    "pi-metro": renderMetroQr,
    "pi-shopping": renderShopping,
    "pi-hospital": renderHospital,
    "pi-parques": renderParques,
    "pi-espacos": renderEspacos,
    "pi-delegacias": renderDelegacias,
    escala: () => renderEscala(false),
    cpp: renderCpp,
    vtr: renderVtr,
    mais: renderMais,
  };

  function wirePage() {
    /* cliques tratados por delegação no #main */
  }

  function openModuleLink(route) {
    const fromModulos = window.OBE_DATA?.modulos?.find((m) => m.id === route);
    const fromCpp = window.OBE_DATA?.cppOpcoes?.find((m) => m.id === route);
    const fromVtr = window.OBE_DATA?.vtrOpcoes?.find((m) => m.id === route);
    const fromPi = window.OBE_DATA?.pontosInteresseOpcoes?.find((m) => m.id === route);
    const fromShop = window.OBE_DATA?.shoppingOpcoes?.find((m) => m.id === route);
    const fromHosp = window.OBE_DATA?.hospitalOpcoes?.find((m) => m.id === route);
    const fromParq = window.OBE_DATA?.parquesOpcoes?.find((m) => m.id === route);
    const fromEsp = window.OBE_DATA?.espacosOpcoes?.find((m) => m.id === route);
    const fromDel = window.OBE_DATA?.delegaciasOpcoes?.find((m) => m.id === route);
    const fromPa = window.OBE_DATA?.pontoApoioOpcoes?.find((m) => m.id === route);
    const fromPop = window.OBE_DATA?.popOpcoes?.find((m) => m.id === route);
    const modulo =
      fromModulos ||
      fromCpp ||
      fromVtr ||
      fromPi ||
      fromShop ||
      fromHosp ||
      fromParq ||
      fromEsp ||
      fromDel ||
      fromPa ||
      fromPop;
    if (!modulo) return false;
    if (modulo.url) {
      window.open(modulo.url, "_blank", "noopener,noreferrer");
      return true;
    }
    // card de submenu sem link e sem rota/destino interno — permanece na tela
    const hasInternal =
      !!routes[route] ||
      !!window.OBE_DATA?.parquesDestinos?.[route] ||
      !!window.OBE_DATA?.espacosDestinos?.[route] ||
      !!window.OBE_DATA?.shoppingDestinos?.[route] ||
      !!window.OBE_DATA?.hospitalDestinos?.[route] ||
      !!window.OBE_DATA?.delegaciasDestinos?.[route] ||
      !!window.OBE_DATA?.pontoApoioDestinos?.[route] ||
      !!window.OBE_DATA?.popDestinos?.[route];
    if (
      (fromCpp || fromVtr || fromPi || fromShop || fromHosp || fromParq || fromEsp || fromDel || fromPa || fromPop) &&
      !hasInternal
    )
      return true;
    return false;
  }

  function getRouteRenderer(route) {
    if (routes[route]) return routes[route];
    if (window.OBE_DATA?.parquesDestinos?.[route]) return () => renderParqueQr(route);
    if (window.OBE_DATA?.espacosDestinos?.[route]) return () => renderEspacoQr(route);
    if (window.OBE_DATA?.shoppingDestinos?.[route]) return () => renderShoppingQr(route);
    if (window.OBE_DATA?.hospitalDestinos?.[route]) return () => renderHospitalQr(route);
    if (window.OBE_DATA?.delegaciasDestinos?.[route]) return () => renderDelegaciaQr(route);
    if (window.OBE_DATA?.pontoApoioDestinos?.[route]) return () => renderPontoApoioQr(route);
    if (window.OBE_DATA?.popDestinos?.[route]) return () => renderCppPopQr(route);
    return null;
  }

  function parentRouteOf(route) {
    if (route === "inicio" || !route) return null;
    if (route === "vtr") return "cpp";
    if (route === "cpp-doc" || route === "pops") return "cpp";
    if ((window.OBE_DATA?.popOpcoes || []).some((o) => o.id === route)) {
      return "cpp-doc";
    }
    if (
      route === "pi-metro" ||
      route === "pi-shopping" ||
      route === "pi-hospital" ||
      route === "pi-parques" ||
      route === "pi-espacos" ||
      route === "pi-delegacias"
    ) {
      return "abastecimento";
    }
    if ((window.OBE_DATA?.pontoApoioOpcoes || []).some((o) => o.id === route)) {
      return "ponto-apoio";
    }
    if ((window.OBE_DATA?.shoppingOpcoes || []).some((o) => o.id === route)) {
      return "pi-shopping";
    }
    if ((window.OBE_DATA?.hospitalOpcoes || []).some((o) => o.id === route)) {
      return "pi-hospital";
    }
    if ((window.OBE_DATA?.parquesOpcoes || []).some((o) => o.id === route)) {
      return "pi-parques";
    }
    if ((window.OBE_DATA?.espacosOpcoes || []).some((o) => o.id === route)) {
      return "pi-espacos";
    }
    if ((window.OBE_DATA?.delegaciasOpcoes || []).some((o) => o.id === route)) {
      return "pi-delegacias";
    }
    return "inicio";
  }

  function applyRoute(route, fromNav) {
    if (!main) return;
    const render = getRouteRenderer(route);
    if (!render) route = "inicio";
    currentRoute = route;
    setActiveNav(route);

    if (route === "escala") main.innerHTML = renderEscala(!!fromNav);
    else main.innerHTML = (getRouteRenderer(route) || routes.inicio)();

    main.scrollTop = 0;
    window.scrollTo(0, 0);
    fillGreeting();

    try {
      main.focus({ preventScroll: true });
    } catch (_) {
      /* ignore */
    }
  }

  function navigate(route, fromNav, fromHistory) {
    if (openModuleLink(route)) return;
    if (!main) return;
    if (!getRouteRenderer(route)) route = "inicio";

    applyRoute(route, fromNav);

    if (fromHistory) return;

    const url = route === "inicio" ? "home.html" : "home.html#" + encodeURIComponent(route);
    const state = { obe: 1, route };
    try {
      if (route === "inicio") {
        history.replaceState(state, "", url);
      } else {
        history.pushState(state, "", url);
      }
    } catch (_) {
      /* ignore */
    }
  }

  function goBackInApp() {
    if (currentRoute === "inicio") return;
    if (history.state?.obe) {
      history.back();
      return;
    }
    navigate(parentRouteOf(currentRoute) || "inicio");
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY);
    window.location.replace("index.html");
  }

  document.getElementById("btn-sair")?.addEventListener("click", logout);

  // Cards: clique/Enter abre o módulo
  if (main) {
    main.addEventListener("submit", async (e) => {
      const form = e.target.closest("#rq-form");
      if (!form || !main.contains(form)) return;
      e.preventDefault();

      const errEl = document.getElementById("rq-error");
      const okEl = document.getElementById("rq-ok");
      const btn = document.getElementById("rq-submit");
      if (errEl) errEl.hidden = true;
      if (okEl) okEl.hidden = true;

      if (!currentUser?.login) {
        if (errEl) {
          errEl.textContent = "Sessão inválida. Faça login novamente.";
          errEl.hidden = false;
        }
        return;
      }

      if (!window.OBE_DB?.isConfigured?.()) {
        if (errEl) {
          errEl.textContent = "Supabase não configurado.";
          errEl.hidden = false;
        }
        return;
      }

      const num = (id) => {
        const v = Number(document.getElementById("rq-" + id)?.value);
        return Number.isFinite(v) && v >= 0 ? v : 0;
      };

      const payload = {
        login: currentUser.login,
        nome: currentUser.name || currentUser.login,
        pessoas_abordadas: num("pessoas_abordadas"),
        veiculos_fiscalizados: num("veiculos_fiscalizados"),
        apoio_ao_publico: num("apoio_ao_publico"),
        bopm: num("bopm"),
        conducao_ao_dp: num("conducao_ao_dp"),
        flagrante_delito: num("flagrante_delito"),
        armas_apreendidas: num("armas_apreendidas"),
        drogas_kg: num("drogas_kg"),
      };

      if (btn) {
        btn.disabled = true;
        btn.textContent = "Enviando…";
      }

      try {
        await window.OBE_DB.salvarResultadoQuantitativo(payload);
        if (okEl) okEl.hidden = false;
        form.reset();
        ["pessoas_abordadas","veiculos_fiscalizados","apoio_ao_publico","bopm","conducao_ao_dp","flagrante_delito","armas_apreendidas","drogas_kg"].forEach((id) => {
          const input = document.getElementById("rq-" + id);
          if (input) input.value = "0";
        });
      } catch (err) {
        if (errEl) {
          errEl.textContent = String(err?.message || err || "Erro ao enviar");
          errEl.hidden = false;
        }
      } finally {
        if (btn) {
          btn.disabled = false;
          btn.textContent = "Enviar";
        }
      }
    });

    main.addEventListener("click", (e) => {
      const sair = e.target.closest("#btn-sair, [data-action='logout']");
      if (sair) {
        e.preventDefault();
        logout();
        return;
      }

      const back = e.target.closest("[data-action='back']");
      if (back) {
        e.preventDefault();
        goBackInApp();
        return;
      }

      const card = e.target.closest(".access-card[data-route], .pop-chip[data-route]");
      if (card && main.contains(card)) {
        const route = card.dataset.route;
        if (!route) return;
        e.preventDefault();
        navigate(route);
      }
    });

    main.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      const card = e.target.closest(".access-card[data-route], .pop-chip[data-route]");
      if (!card) return;
      e.preventDefault();
      navigate(card.dataset.route);
    });
  }

  function mountHomeCards() {
    const grid = document.getElementById("access-grid");
    if (grid && window.OBE_DATA?.modulos) {
      grid.innerHTML = window.OBE_DATA.modulos.map(cardHtml).join("");
      fillGreeting();
      return;
    }
    // se a home veio vazia, renderiza a página inteira
    if (main && !main.querySelector(".access-card") && window.OBE_DATA?.modulos) {
      main.innerHTML = renderInicio();
    }
    fillGreeting();
  }

  mountHomeCards();

  // Home é a base após login: histórico interno + bloqueia voltar para cadastro/login
  try {
    const hashRoute = (location.hash || "").replace(/^#/, "");
    const startRoute =
      hashRoute && getRouteRenderer(hashRoute) ? hashRoute : "inicio";
    history.replaceState({ obe: 1, route: startRoute }, "", startRoute === "inicio" ? "home.html" : "home.html#" + startRoute);
    if (startRoute !== "inicio") applyRoute(startRoute, false);
  } catch (_) {
    /* ignore */
  }

  window.addEventListener("popstate", (e) => {
    const state = e.state;
    if (state?.obe && state.route) {
      applyRoute(state.route, false);
      return;
    }
    // Saiu do app logado (ex.: cadastro/login): permanece na home
    if (currentUser) {
      try {
        history.pushState({ obe: 1, route: "inicio" }, "", "home.html");
      } catch (_) {
        /* ignore */
      }
      applyRoute("inicio", false);
    }
  });

  if (userInitials) {
    userInitials.textContent = initials(currentUser.name || currentUser.login);
  }
  navItems.forEach((btn) => {
    btn.addEventListener("click", () => navigate(btn.dataset.route, true));
  });
  document.getElementById("btn-profile")?.addEventListener("click", () => {
    navigate("mais", true);
  });
})();
