(function () {
  const STORAGE_KEY = "obe_sge_user_2026";
  const auth = window.OBE_AUTH;

  const main = document.getElementById("main");
  const userInitials = document.getElementById("user-initials");
  const navItems = document.querySelectorAll(".nav-item");

  let currentUser = null;
  let currentRoute = "inicio";

  function acceptUser(re) {
    const user = auth.findByRe(re);
    if (!user) return false;
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
    const icon = (window.obeIcon && window.obeIcon(m.icon)) || "";
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

  function renderMapaForca() {
    return `
      <div class="page">
        ${pageHeader("Mapa Força", "Distribuição do efetivo em campo")}
        <div class="list">
          ${window.OBE_DATA.mapaForca
            .map(
              (e) => `
            <article class="row">
              <div>
                <h3>${e.equipe}</h3>
                <p>${e.viatura} · ${e.efetivo} PMs · Setor ${e.setor}</p>
              </div>
              ${badge(e.status)}
            </article>`
            )
            .join("")}
        </div>
        ${pageBack()}
      </div>
    `;
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
    return `
      <div class="page">
        ${pageHeader("POP's", "Procedimentos operacionais padrão")}
        <div class="list">
          ${window.OBE_DATA.pops
            .map(
              (p) => `
            <article class="row">
              <div>
                <h3>${p.codigo} — ${p.titulo}</h3>
                <p>Versão ${p.versao} · Atualizado em ${p.atualizado}</p>
              </div>
              <span class="badge">Abrir</span>
            </article>`
            )
            .join("")}
        </div>
        ${pageBack()}
      </div>
    `;
  }

  function renderRso() {
    return `
      <div class="page">
        ${pageHeader("RSO", "Relatórios de serviço operacional")}
        <div class="list">
          ${window.OBE_DATA.rso
            .map(
              (r) => `
            <article class="row">
              <div>
                <h3>${r.id}</h3>
                <p>${r.equipe} · ${r.data} · Turno ${r.turno}</p>
              </div>
              ${badge(r.status)}
            </article>`
            )
            .join("")}
        </div>
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
            <article class="row">
              <div>
                <h3>${e.titulo}</h3>
                <p>${e.data || ""}${e.hora ? ` · ${e.hora}` : ""}${e.local ? ` · ${e.local}` : ""}</p>
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
        ${pageHeader("Ponto de Interesse", "Escolha o tipo de ponto")}
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
    const endereco = cfg?.destino
      ? `<p class="qr-box__addr">${cfg.destino}</p>`
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
        ${pageHeader("CPP", "Escolha o acesso desejado")}
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
        ${pageHeader("VTR", "Mapa e documentação do CPP")}
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
    "mapa-forca": renderMapaForca,
    "locais-interesse": renderLocaisInteresse,
    "pontos-apoio": renderPontosApoio,
    pops: renderPops,
    rso: renderRso,
    eventos: renderEventos,
    abastecimento: renderAbastecimento,
    "pi-metro": renderMetroQr,
    "pi-shopping": renderShopping,
    "pi-hospital": renderHospital,
    "shopping-metro-tatuape": () => renderShoppingQr("shopping-metro-tatuape"),
    "shopping-boulevard": () => renderShoppingQr("shopping-boulevard"),
    "hosp-upa-tatuape": () => renderHospitalQr("hosp-upa-tatuape"),
    "hosp-silvio-romero": () => renderHospitalQr("hosp-silvio-romero"),
    "hosp-central-tatuape": () => renderHospitalQr("hosp-central-tatuape"),
    "hosp-santa-virginia": () => renderHospitalQr("hosp-santa-virginia"),
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
    const modulo = fromModulos || fromCpp || fromVtr || fromPi || fromShop || fromHosp;
    if (!modulo) return false;
    if (modulo.url) {
      window.open(modulo.url, "_blank", "noopener,noreferrer");
      return true;
    }
    // card de submenu sem link e sem rota interna — permanece na tela
    if ((fromCpp || fromVtr || fromPi || fromShop || fromHosp) && !routes[route]) return true;
    return false;
  }

  function navigate(route, fromNav) {
    if (openModuleLink(route)) return;
    if (!main) return;
    if (!routes[route]) route = "inicio";
    currentRoute = route;
    setActiveNav(route);

    if (route === "escala") main.innerHTML = renderEscala(!!fromNav);
    else main.innerHTML = routes[route]();

    main.scrollTop = 0;
    window.scrollTo(0, 0);

    try {
      main.focus({ preventScroll: true });
    } catch (_) {
      /* ignore */
    }
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY);
    window.location.replace("index.html");
  }

  document.getElementById("btn-sair")?.addEventListener("click", logout);

  // Cards: clique/Enter abre o módulo
  if (main) {
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
        if (currentRoute === "vtr") {
          navigate("cpp");
        } else if (
          currentRoute === "pi-metro" ||
          currentRoute === "pi-shopping" ||
          currentRoute === "pi-hospital"
        ) {
          navigate("abastecimento");
        } else if (
          currentRoute === "shopping-metro-tatuape" ||
          currentRoute === "shopping-boulevard"
        ) {
          navigate("pi-shopping");
        } else if (
          currentRoute === "hosp-upa-tatuape" ||
          currentRoute === "hosp-silvio-romero" ||
          currentRoute === "hosp-central-tatuape" ||
          currentRoute === "hosp-santa-virginia"
        ) {
          navigate("pi-hospital");
        } else {
          navigate("inicio");
        }
        return;
      }

      const card = e.target.closest(".access-card[data-route]");
      if (card && main.contains(card)) {
        const route = card.dataset.route;
        if (!route) return;
        e.preventDefault();
        navigate(route);
      }
    });

    main.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      const card = e.target.closest(".access-card[data-route]");
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
