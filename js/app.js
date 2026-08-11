(function () {
  const STORAGE_KEY = "obe_sge_user_2026";
  const AUTH_LOGIN = "102525";

  const main = document.getElementById("main");
  const userInitials = document.getElementById("user-initials");
  const navItems = document.querySelectorAll(".nav-item");

  let currentUser = null;
  let currentRoute = "inicio";

  function acceptUser(login) {
    currentUser = { name: login, login: login };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser));
  }

  // Autenticação flexível: URL, localStorage ou permite ver a home
  const authFromUrl = new URLSearchParams(window.location.search).get("auth");
  if (authFromUrl === AUTH_LOGIN) {
    acceptUser(authFromUrl);
    history.replaceState({}, "", "home.html");
  } else {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (saved?.login === AUTH_LOGIN) {
        currentUser = saved;
      } else {
        // Mantém a home visível; marca visitante até logar de novo
        currentUser = { name: "Operador", login: "guest" };
      }
    } catch (_) {
      currentUser = { name: "Operador", login: "guest" };
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

  function pageHeader(titulo, subtitulo, showBack) {
    if (!showBack) {
      return `
        <header class="page-head">
          <h2>${titulo}</h2>
          <p>${subtitulo}</p>
        </header>`;
    }
    return `
      <div class="page-toolbar">
        <button type="button" class="back-btn" data-action="back">← Voltar</button>
        <header class="page-head">
          <h2>${titulo}</h2>
          <p>${subtitulo}</p>
        </header>
      </div>`;
  }

  function cardHtml(m) {
    const icon = (window.obeIcon && window.obeIcon(m.icon)) || "";
    return `
      <div class="access-card" data-route="${m.id}" role="button" tabindex="0" aria-label="${m.titulo}">
        <div class="access-card__inner">
          <div class="access-card__face access-card__face--front">
            <span class="access-card__icon">${icon}</span>
            <h3 class="access-card__title">${m.titulo}</h3>
          </div>
          <div class="access-card__face access-card__face--back">
            <p class="access-card__desc">${m.descricao}</p>
          </div>
        </div>
      </div>`;
  }

  function renderInicio() {
    const { modulos } = window.OBE_DATA;
    return `
      <div class="page page--cards-only">
        <button type="button" class="btn-sair" id="btn-sair" title="Sair">Sair</button>
        <div class="access-grid">
          ${modulos.map(cardHtml).join("")}
        </div>
      </div>
    `;
  }

  function renderMapaForca() {
    return `
      <div class="page">
        ${pageHeader("Mapa Força", "Distribuição do efetivo em campo", true)}
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
      </div>
    `;
  }

  function renderLocaisInteresse() {
    return `
      <div class="page">
        ${pageHeader("Locais de Interesse", "Escolas e pontos sensíveis", true)}
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
      </div>
    `;
  }

  function renderPontosApoio() {
    return `
      <div class="page">
        ${pageHeader("Pontos de Apoio", "Bases e estruturas de apoio", true)}
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
      </div>
    `;
  }

  function renderPops() {
    return `
      <div class="page">
        ${pageHeader("POP's", "Procedimentos operacionais padrão", true)}
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
      </div>
    `;
  }

  function renderRso() {
    return `
      <div class="page">
        ${pageHeader("RSO", "Relatórios de serviço operacional", true)}
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
      </div>
    `;
  }

  function renderAbastecimento() {
    return `
      <div class="page">
        ${pageHeader("Pontos de Abastecimento", "Combustível e logística", true)}
        <div class="list">
          ${window.OBE_DATA.abastecimento
            .map(
              (a) => `
            <article class="row">
              <div>
                <h3>${a.nome}</h3>
                <p>${a.tipo} · ${a.endereco}</p>
                <p>Horário: ${a.horario}</p>
              </div>
              <span class="badge">${a.tipo}</span>
            </article>`
            )
            .join("")}
        </div>
      </div>
    `;
  }

  function renderEscala(fromNav) {
    return `
      <div class="page">
        ${pageHeader("Escala de Serviço", "Turnos e equipes do dia", !fromNav)}
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
      </div>
    `;
  }

  function renderCpp(fromNav) {
    return `
      <div class="page">
        ${pageHeader("CPP", "Cartão de Prioridade de Patrulhamento", !fromNav)}
        <div class="list">
          ${window.OBE_DATA.cpp
            .map(
              (c) => `
            <article class="row">
              <div>
                <h3>
                  <span class="prio-dot prio-dot--${c.cor}"></span>
                  P${c.prioridade} · ${c.setor}
                </h3>
                <p>${c.locais}</p>
                <p>Frequência: ${c.frequencia}</p>
              </div>
              <span class="badge ${
                c.cor === "critica"
                  ? "badge--danger"
                  : c.cor === "alta"
                    ? "badge--warn"
                    : "badge--idle"
              }">P${c.prioridade}</span>
            </article>`
            )
            .join("")}
        </div>
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
    abastecimento: renderAbastecimento,
    escala: () => renderEscala(false),
    cpp: () => renderCpp(false),
    mais: renderMais,
  };

  function wirePage() {
    /* cliques tratados por delegação no #main */
  }

  function navigate(route, fromNav) {
    if (!main) return;
    if (!routes[route]) route = "inicio";
    currentRoute = route;
    setActiveNav(route);

    if (route === "escala") main.innerHTML = renderEscala(!!fromNav);
    else if (route === "cpp") main.innerHTML = renderCpp(!!fromNav);
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

  // Cards: hover/focus via CSS; toque vira; clique/Enter abre
  if (main) {
    main.addEventListener("mouseover", (e) => {
      const card = e.target.closest(".access-card");
      if (!card || !main.contains(card)) return;
      if (window.matchMedia("(hover: hover)").matches) {
        card.classList.add("is-flipped");
      }
    });

    main.addEventListener("mouseout", (e) => {
      const card = e.target.closest(".access-card");
      if (!card || !main.contains(card)) return;
      const to = e.relatedTarget;
      if (to && card.contains(to)) return;
      if (window.matchMedia("(hover: hover)").matches) {
        card.classList.remove("is-flipped");
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
        navigate("inicio");
        return;
      }

      const card = e.target.closest(".access-card[data-route]");
      if (card && main.contains(card)) {
        const route = card.dataset.route;
        if (!route) return;
        e.preventDefault();

        const canHover = window.matchMedia("(hover: hover)").matches;
        if (!canHover && !card.classList.contains("is-flipped")) {
          main.querySelectorAll(".access-card.is-flipped").forEach((c) => {
            c.classList.remove("is-flipped");
          });
          card.classList.add("is-flipped");
          return;
        }

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
      return;
    }
    // se a home veio vazia, renderiza a página inteira
    if (main && !main.querySelector(".access-card") && window.OBE_DATA?.modulos) {
      main.innerHTML = renderInicio();
    }
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
