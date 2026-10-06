window.OBE_DATA = {
  operacao: {
    nome: "OBE — Operação Batalhão Escola",
    ano: 2026,
    sistema: "SGE — Sistema de Gestão Estratégica",
    status: "Em execução",
  },

  modulos: [
    {
      id: "resultado",
      titulo: "Resultado Quantitativo",
      descricao: "Questionário quantitativo operacional",
      sigla: "RQ",
      icon: "orgchart",
    },
    {
      id: "ponto-apoio",
      titulo: "Ponto Apoio",
      descricao: "Bases e pontos de apoio com localização",
      sigla: "PA",
      icon: "base",
    },
    {
      id: "abastecimento",
      titulo: "Auxílio ao Público",
      descricao: "Postos, hospital, metrô, shopping, parques, espaços e delegacias",
      sigla: "AP",
      icon: "auxilio",
    },
    {
      id: "escala",
      titulo: "Escala de Serviço",
      descricao: "Turnos e equipes do dia",
      sigla: "ES",
      icon: "calendarcheck",
      url: "https://docs.google.com/spreadsheets/d/1dGBMB1Ai6kU2BRO3LNY_4Ac7EJFZrHRs/edit?usp=drivesdk&ouid=102061352846729587790&rtpof=true&sd=true",
    },
    {
      id: "cpp",
      titulo: "Área Policial",
      descricao: "Cartão de Prioridade de Patrulhamento",
      sigla: "AP",
      icon: "booklaw",
    },
    {
      id: "eventos",
      titulo: "Eventos",
      descricao: "Agenda e programação da operação",
      sigla: "EVT",
      icon: "calendarstar",
    },
  ],

  cppOpcoes: [
    {
      id: "vtr",
      titulo: "CPP VTR",
      descricao: "CPP das viaturas",
      sigla: "VTR",
      icon: "vtr",
      url: "https://docs.google.com/spreadsheets/d/1Lg-OlkJjwCa3NdhzwTv_E77ikvEnCEC_/edit?gid=1678212823#gid=1678212823",
    },
    {
      id: "cpp-mapa",
      titulo: "CPP Mapa",
      descricao: "Mapa de prioridade de patrulhamento",
      sigla: "MAP",
      icon: "pin",
      url: "https://www.google.com/maps/d/edit?mid=1NTLGXMljSuRwja2TrJcGKlpBCVWL5j8",
    },
    {
      id: "cpp-doc",
      titulo: "CPP - POP",
      descricao: "Local e RSO das áreas CPP",
      sigla: "CPP",
      icon: "pin",
    },
    {
      id: "abordados",
      titulo: "Abordados",
      descricao: "Pessoas e veículos abordados OBE",
      sigla: "AB",
      icon: "users",
      url: "https://docs.google.com/forms/d/e/1FAIpQLSdckd9cz0f-XYfiOMeGolq0rwEoMuWy_E4a3DcCDThg1AkWeg/viewform?usp=publish-editor",
    },
    {
      id: "painel-supervisor",
      titulo: "Painel do Supervisor",
      descricao: "Acesso restrito à lista autorizada",
      sigla: "SUP",
      icon: "shield",
    },
  ],

  cppPopOpcoes: [
    {
      id: "cpp-pop-local",
      titulo: "Local",
      descricao: "Endereços e QR das áreas CPP 01 a 15",
      sigla: "LOC",
      icon: "pin",
    },
    {
      id: "cpp-pop-rso",
      titulo: "RSO",
      descricao: "Relatórios de serviço operacional",
      sigla: "RSO",
      icon: "sheet",
    },
  ],

  popOpcoes: Array.from({ length: 15 }, (_, i) => {
    const n = String(i + 1).padStart(2, "0");
    return {
      id: "pop-" + n,
      titulo: "CPP " + n,
      descricao: "Área policial CPP " + n,
      sigla: n,
      icon: "pin",
    };
  }),

  rsoOpcoes: (() => {
    const sheetId = "1naa7tx6o5tPzJ7xaVISq-dz55hMY-x98";
    // gid de cada aba "RSO POP XX" na planilha (cole o link da aba para completar)
    const gids = {
      "01": "1633603721",
      "02": "884383562",
      "03": "1892205958",
      "04": "203063964",
      "05": "1708563610",
      "06": "53387421",
      "07": "411128561",
      "08": "1142434674",
      "09": "1542823028",
      "10": "1027463295",
      "11": "411208293",
      "12": "1296744888",
      "13": "813957668",
      "14": "910485153",
      "15": "1627903963",
    };
    return Array.from({ length: 15 }, (_, i) => {
      const n = String(i + 1).padStart(2, "0");
      const gid = String(gids[n] || "").trim();
      const url = gid
        ? `https://docs.google.com/spreadsheets/d/${sheetId}/edit?gid=${gid}#gid=${gid}`
        : `https://docs.google.com/spreadsheets/d/${sheetId}/edit`;
      return {
        id: "rso-" + n,
        titulo: "RSO " + n,
        descricao: "Planilha RSO POP " + n,
        sigla: n,
        icon: "sheet",
        url,
      };
    });
  })(),

  popDestinos: {
    "pop-01": {
      nome: "CPP 01",
      destino: "Rua Dr. Alfredo Castro x Av. Mário de Andrade, São Paulo - SP",
      detalhes: "Cruzamento: Rua Dr. Alfredo Castro × Av. Mário de Andrade",
      travelmode: "driving",
    },
    "pop-02": {
      nome: "CPP 02 — Museu da Inclusão",
      destino: "Av. Mário de Andrade, 564 - São Paulo - SP",
      detalhes: "Museu da Inclusão",
      travelmode: "driving",
    },
    "pop-03": {
      nome: "CPP 03 — Lado Universidade",
      destino: "Av. Mário de Andrade, 784 - São Paulo - SP",
      detalhes: "Lado Universidade",
      travelmode: "driving",
    },
    "pop-04": {
      nome: "CPP 04 — Porto",
      destino: "Rua Faud Naufel, 165 - São Paulo - SP",
      detalhes: "Porto",
      travelmode: "driving",
    },
    "pop-05": {
      nome: "CPP 05",
      destino: "Rua Faud Naufel x Rua Tagipuru, São Paulo - SP",
      detalhes: "Cruzamento: Rua Faud Naufel × Tagipuru",
      travelmode: "driving",
    },
    "pop-06": {
      nome: "CPP 06 — Portão 09",
      destino: "Av. Mário de Andrade - Portão 09, Memorial da América Latina, São Paulo - SP",
      detalhes: "Portão 09 — Memorial da América Latina",
      travelmode: "driving",
    },
    "pop-07": {
      nome: "CPP 07 — Portão 07",
      destino: "Av. Mário de Andrade - Portão 07, Memorial da América Latina, São Paulo - SP",
      detalhes: "Portão 07 — Memorial da América Latina",
      travelmode: "driving",
    },
    "pop-08": {
      nome: "CPP 08 — Ponto de ônibus",
      destino: "Av. Mário de Andrade - ponto de ônibus, São Paulo - SP",
      detalhes: "Ponto de ônibus — Av. Mário de Andrade",
      travelmode: "driving",
    },
    "pop-09": {
      nome: "CPP 09 — Lado Terminal",
      destino: "Av. Mário de Andrade, 817 - São Paulo - SP",
      detalhes: "Lado Terminal",
      travelmode: "driving",
    },
    "pop-10": {
      nome: "CPP 10 — Faixa de pedestres",
      destino: "Av. Mário de Andrade, 956 - São Paulo - SP",
      detalhes: "Faixa de pedestres",
      travelmode: "driving",
    },
    "pop-11": {
      nome: "CPP 11",
      destino: "Rua Deputado Salvador Julianelli x Av. Mário de Andrade, São Paulo - SP",
      detalhes: "Cruzamento: Rua Deputado Salvador Julianelli × Av. Mário de Andrade",
      travelmode: "driving",
    },
    "pop-12": {
      nome: "CPP 12 — Sob passarela",
      destino: "Av. Mário de Andrade - sob passarela de pedestres, lado terminal, São Paulo - SP",
      detalhes: "Sob passarela de pedestres, lado terminal",
      travelmode: "driving",
    },
    "pop-13": {
      nome: "CPP 13",
      destino: "Av. Mário de Andrade x Rua Faud Naufel, São Paulo - SP",
      detalhes: "Cruzamento: Av. Mário de Andrade × Rua Faud Naufel",
      travelmode: "driving",
    },
    "pop-14": {
      nome: "CPP 14",
      destino: "Av. Mário de Andrade x Rua Professor Wilfrides Alves de Lima, São Paulo - SP",
      detalhes: "Cruzamento: Av. Mário de Andrade × Rua Professor Wilfrides Alves de Lima",
      travelmode: "driving",
    },
    "pop-15": {
      nome: "CPP 15",
      destino: "Praça Dr. Osmar de Oliveira x Rua Tagipuru, São Paulo - SP",
      detalhes: "Cruzamento: Praça Dr. Osmar de Oliveira × Rua Tagipuru",
      travelmode: "driving",
    },
  },

  vtrOpcoes: [],

  vtrRsoOpcoes: [
    {
      id: "vtr-rso-cmt-cia",
      titulo: "Cmt de Cia",
      descricao: "RSO VTR Cmt de Cia",
      sigla: "CMT",
      icon: "sheet",
      url: "https://docs.google.com/spreadsheets/d/1naa7tx6o5tPzJ7xaVISq-dz55hMY-x98/edit?gid=1944622959#gid=1944622959",
    },
    {
      id: "vtr-rso-scmt-cia",
      titulo: "SCmt de Cia",
      descricao: "RSO VTR SCmt de Cia",
      sigla: "SCM",
      icon: "sheet",
      url: "https://docs.google.com/spreadsheets/d/1naa7tx6o5tPzJ7xaVISq-dz55hMY-x98/edit?gid=1924236897#gid=1924236897",
    },
    {
      id: "vtr-rso-cmt-obe",
      titulo: "Cmt da OBE",
      descricao: "RSO VTR Cmt da OBE",
      sigla: "OBE",
      icon: "sheet",
      url: "https://docs.google.com/spreadsheets/d/1naa7tx6o5tPzJ7xaVISq-dz55hMY-x98/edit?gid=844058780#gid=844058780",
    },
    {
      id: "vtr-rso-scmt-obe",
      titulo: "SCmt da OBE",
      descricao: "RSO VTR SCmt da OBE",
      sigla: "SCM",
      icon: "sheet",
      url: "https://docs.google.com/spreadsheets/d/1naa7tx6o5tPzJ7xaVISq-dz55hMY-x98/edit?gid=895860818#gid=895860818",
    },
    {
      id: "vtr-rso-cgp-i",
      titulo: "CGP I",
      descricao: "RSO VTR CGP I",
      sigla: "CGP",
      icon: "sheet",
      url: "https://docs.google.com/spreadsheets/d/1naa7tx6o5tPzJ7xaVISq-dz55hMY-x98/edit?gid=1358595620#gid=1358595620",
    },
    {
      id: "vtr-rso-cgp-ii",
      titulo: "CGP II",
      descricao: "RSO VTR CGP II",
      sigla: "CGP",
      icon: "sheet",
      url: "https://docs.google.com/spreadsheets/d/1naa7tx6o5tPzJ7xaVISq-dz55hMY-x98/edit?gid=2140855512#gid=2140855512",
    },
    {
      id: "vtr-rso-cgp-iii",
      titulo: "CGP III",
      descricao: "RSO VTR CGP III",
      sigla: "CGP",
      icon: "sheet",
      url: "https://docs.google.com/spreadsheets/d/1naa7tx6o5tPzJ7xaVISq-dz55hMY-x98/edit?gid=943511111#gid=943511111",
    },
    {
      id: "vtr-rso-rp-01",
      titulo: "RP 01",
      descricao: "RSO VTR Radiopatrulhamento 01",
      sigla: "RP",
      icon: "sheet",
      url: "https://docs.google.com/spreadsheets/d/1naa7tx6o5tPzJ7xaVISq-dz55hMY-x98/edit?gid=1322875542#gid=1322875542",
    },
    {
      id: "vtr-rso-rp-02",
      titulo: "RP 02",
      descricao: "RSO VTR Radiopatrulhamento 02",
      sigla: "RP",
      icon: "sheet",
      url: "https://docs.google.com/spreadsheets/d/1naa7tx6o5tPzJ7xaVISq-dz55hMY-x98/edit?gid=1674450667#gid=1674450667",
    },
    {
      id: "vtr-rso-rp-03",
      titulo: "RP 03",
      descricao: "RSO VTR Radiopatrulhamento 03",
      sigla: "RP",
      icon: "sheet",
      url: "https://docs.google.com/spreadsheets/d/1naa7tx6o5tPzJ7xaVISq-dz55hMY-x98/edit?gid=896228136#gid=896228136",
    },
    {
      id: "vtr-rso-rp-04",
      titulo: "RP 04",
      descricao: "RSO VTR Radiopatrulhamento 04",
      sigla: "RP",
      icon: "sheet",
      url: "https://docs.google.com/spreadsheets/d/1naa7tx6o5tPzJ7xaVISq-dz55hMY-x98/edit?gid=655050157#gid=655050157",
    },
    {
      id: "vtr-rso-p4",
      titulo: "VTR P4",
      descricao: "RSO VTR Apoio P4",
      sigla: "P4",
      icon: "sheet",
      url: "https://docs.google.com/spreadsheets/d/1naa7tx6o5tPzJ7xaVISq-dz55hMY-x98/edit?gid=750106562#gid=750106562",
    },
  ],

  pontosInteresseOpcoes: [
    {
      id: "pi-hospital",
      titulo: "Hospital",
      descricao: "Unidades hospitalares de apoio",
      sigla: "HOSP",
      icon: "hospital",
    },
    {
      id: "pi-metro",
      titulo: "Metro",
      descricao: "Estações de metrô",
      sigla: "METRO",
      icon: "metro",
    },
    {
      id: "pi-shopping",
      titulo: "Shopping",
      descricao: "Centros comerciais",
      sigla: "SHOP",
      icon: "shopping",
    },
    {
      id: "pi-parques",
      titulo: "Parques",
      descricao: "Parques e áreas verdes",
      sigla: "PARQ",
      icon: "park",
    },
    {
      id: "pi-espacos",
      titulo: "Espaços",
      descricao: "Espaços públicos e pontos de apoio",
      sigla: "ESP",
      icon: "base",
    },
    {
      id: "pi-delegacias",
      titulo: "Delegacias",
      descricao: "23º DP Perdizes e 7º DP Lapa",
      sigla: "DEL",
      icon: "shield",
    },
  ],

  // Destino do QR Code Metro → Google Maps (rota da localização atual até o metrô)
  metroDestino: {
    nome: "Metrô Barra Funda",
    destino: "R. Dr. Bento Teobaldo Ferraz, 119 - Barra Funda, São Paulo - SP, 01140-070",
    travelmode: "transit",
  },

  shoppingOpcoes: [
    {
      id: "shopping-west-plaza",
      titulo: "Shopping West Plaza",
      descricao: "Av. Francisco Matarazzo, s/n",
      sigla: "SWP",
      icon: "shopping",
    },
    {
      id: "shopping-bourbon",
      titulo: "Bourbon Shopping",
      descricao: "R. Palestra Itália, 500",
      sigla: "BOU",
      icon: "shopping",
    },
  ],

  shoppingDestinos: {
    "shopping-west-plaza": {
      nome: "Shopping West Plaza",
      destino: "Av. Francisco Matarazzo, s/n - Água Branca, São Paulo - SP",
      horario: "Seg–sáb 10h–22h · Dom 12h–22h (praça de alimentação)",
      telefone: "(11) 3677-4000",
      detalhes:
        "Mais próximo do Metrô Barra Funda (~11–14 min a pé). Lojas, praça de alimentação, Villa Bowling e Mané Mercado. Estacionamento: R$ 28,00 nas primeiras 2 horas.",
      travelmode: "driving",
    },
    "shopping-bourbon": {
      nome: "Bourbon Shopping São Paulo",
      destino: "R. Palestra Itália, 500 - Perdizes, São Paulo - SP",
      horario: "Seg–sáb 10h–22h · Dom 14h–20h (lojas)",
      telefone: "",
      detalhes:
        "Ao lado do Allianz Parque, próximo à Barra Funda. Teatro Bradesco, cinemas e hipermercado Zaffari.",
      travelmode: "driving",
    },
  },

  hospitalOpcoes: [
    {
      id: "hosp-ps-barra-funda",
      titulo: "PS Barra Funda",
      descricao: "R. Vitorino Carmilo, 717",
      sigla: "PS",
      icon: "hospital",
    },
    {
      id: "hosp-hapvida-barra-funda",
      titulo: "Centro Clínico Hapvida",
      descricao: "Av. Francisco Matarazzo, 612",
      sigla: "HAP",
      icon: "hospital",
    },
    {
      id: "hosp-novamed-barra-funda",
      titulo: "Meu Doutor Novamed",
      descricao: "Av. Marquês de S. Vicente, 77",
      sigla: "NOV",
      icon: "hospital",
    },
    {
      id: "hosp-clinicas",
      titulo: "Hospital das Clínicas",
      descricao: "Av. Dr. Enéas Carvalho Aguiar, 255",
      sigla: "HC",
      icon: "hospital",
    },
    {
      id: "hosp-einstein-perdizes",
      titulo: "Einstein Perdizes",
      descricao: "Rua Apiacás, 85",
      sigla: "EIN",
      icon: "hospital",
    },
  ],

  hospitalDestinos: {
    "hosp-ps-barra-funda": {
      nome: "PS Barra Funda",
      destino: "R. Vitorino Carmilo, 717 - Barra Funda, São Paulo - SP",
      enderecoAlt: "Pronto Socorro Municipal Dr. Álvaro de Dino Almeida",
      horario: "Funcionamento: 24 horas",
      telefone: "(11) 4210-5425",
      detalhes: "Atendimento Público / SUS — urgência e emergência",
      travelmode: "driving",
    },
    "hosp-hapvida-barra-funda": {
      nome: "Centro Clínico Barra Funda | Hapvida NotreDame Intermédica",
      destino: "Av. Francisco Matarazzo, 612 - Água Branca, São Paulo - SP",
      horario: "Funcionamento: 24 horas (Pronto Atendimento)",
      telefone: "(11) 4090-1740",
      detalhes: "Particular / Convênios — consultas, exames e pronto atendimento",
      travelmode: "driving",
    },
    "hosp-novamed-barra-funda": {
      nome: "Meu Doutor Novamed - Unidade Barra Funda",
      destino: "Av. Marquês de S. Vicente, 77 - Várzea da Barra Funda, São Paulo - SP",
      horario: "Seg–sex 6h30–20h · Sáb 6h30–14h · Fechado aos domingos",
      telefone: "",
      detalhes: "Particular / Convênios",
      travelmode: "driving",
    },
    "hosp-clinicas": {
      nome: "Hospital das Clínicas",
      destino: "Av. Dr. Enéas de Carvalho Aguiar, 255 - Cerqueira César, São Paulo - SP",
      telefone: "",
      detalhes: "Hospital das Clínicas — Cerqueira César",
      travelmode: "driving",
    },
    "hosp-einstein-perdizes": {
      nome: "Einstein Perdizes",
      destino: "Rua Apiacás, 85 - Perdizes, São Paulo - SP",
      telefone: "",
      detalhes: "Hospital Einstein — Unidade Perdizes",
      travelmode: "driving",
    },
  },

  parquesOpcoes: [
    {
      id: "parque-agua-branca",
      titulo: "Parque da Água Branca",
      descricao: "Av. Francisco Matarazzo, 455",
      sigla: "PAB",
      icon: "park",
    },
    {
      id: "parque-jardim-perdizes",
      titulo: "Parque Jardim das Perdizes",
      descricao: "Passagem Quatro, S/N",
      sigla: "PJP",
      icon: "park",
    },
  ],

  parquesDestinos: {
    "parque-agua-branca": {
      nome: "Parque da Água Branca (Parque Fernando Costa)",
      destino: "Av. Francisco Matarazzo, 455 - Água Branca, São Paulo - SP",
      horario: "Todos os dias, das 6h às 20h",
      telefone: "",
      detalhes: "Entrada gratuita. Próximo ao Metrô Barra Funda.",
      travelmode: "driving",
    },
    "parque-jardim-perdizes": {
      nome: "Parque Jardim das Perdizes",
      destino: "Passagem Quatro, S/N - Água Branca, São Paulo - SP",
      horario: "Todos os dias, das 6h às 10h",
      telefone: "",
      detalhes: "Entrada gratuita.",
      travelmode: "driving",
    },
  },

  espacosOpcoes: [
    {
      id: "espaco-expo-barra-funda",
      titulo: "Expo Barra Funda",
      descricao: "R. Tagipuru, 1001",
      sigla: "EXP",
      icon: "base",
    },
    {
      id: "espaco-memorial",
      titulo: "Memorial América Latina",
      descricao: "Av. Mário de Andrade, 664",
      sigla: "MAL",
      icon: "base",
    },
    {
      id: "espaco-usine",
      titulo: "Espaço Usine",
      descricao: "R. Barra Funda, 973",
      sigla: "USI",
      icon: "base",
    },
    {
      id: "espaco-nubank",
      titulo: "Espaço Nubank",
      descricao: "Av. Francisco Matarazzo, 1705",
      sigla: "NUB",
      icon: "base",
    },
  ],

  espacosDestinos: {
    "espaco-expo-barra-funda": {
      nome: "Expo Barra Funda",
      destino: "R. Tagipuru, 1001 - Barra Funda, São Paulo - SP",
      telefone: "",
      detalhes:
        "Área de ~3.980 m², até 6.400 pessoas. Feiras, congressos, convenções e shows. Buffet integrado, climatização e acessibilidade. Curta caminhada da Estação Palmeiras-Barra Funda.",
      travelmode: "driving",
    },
    "espaco-memorial": {
      nome: "Memorial da América Latina (Auditório Simón Bolívar)",
      destino: "Av. Mário de Andrade, 664 - Barra Funda, São Paulo - SP",
      telefone: "",
      detalhes:
        "Complexo cultural e de eventos — feiras, festivais gastronômicos e convenções. Praticamente ao lado da saída do terminal e metrô Barra Funda.",
      travelmode: "driving",
    },
    "espaco-usine": {
      nome: "Espaço Usine",
      destino: "R. Barra Funda, 973 - Barra Funda, São Paulo - SP",
      telefone: "",
      detalhes:
        "Galpão amplo e multifuncional — feiras, palestras e festas. Cerca de 6 minutos a pé da estação.",
      travelmode: "driving",
    },
    "espaco-nubank": {
      nome: "Espaço Nubank",
      destino: "Av. Francisco Matarazzo, 1705 - Água Branca, São Paulo - SP",
      telefone: "",
      detalhes:
        "Cerca de 800 m da Estação Palmeiras-Barra Funda. Tempo a pé: 10 a 15 minutos de caminhada.",
      travelmode: "driving",
    },
  },

  delegaciasOpcoes: [
    {
      id: "del-23dp-perdizes",
      titulo: "23º DP Perdizes",
      descricao: "Rua Itapicuru, 80",
      sigla: "23º",
      icon: "shield",
    },
    {
      id: "del-7dp-lapa",
      titulo: "7º DP Lapa",
      descricao: "Rua Camilo, 317",
      sigla: "7º",
      icon: "shield",
    },
  ],

  delegaciasDestinos: {
    "del-23dp-perdizes": {
      nome: "23º Distrito Policial (Perdizes)",
      destino: "Rua Itapicuru, 80 - Perdizes, São Paulo - SP",
      telefone: "(11) 3864-5265",
      detalhes:
        "Cerca de 10 a 15 minutos de carro ou transporte público da Estação Palmeiras-Barra Funda.",
      travelmode: "driving",
    },
    "del-7dp-lapa": {
      nome: "7º Distrito Policial (Lapa / Vila Romana)",
      destino: "Rua Camilo, 317 - Lapa, São Paulo - SP",
      telefone: "(11) 3864-7445",
      detalhes:
        "Região da Vila Romana/Lapa — cerca de 15 a 20 minutos de carro da Estação Barra Funda.",
      travelmode: "driving",
    },
  },

  pontoApoioOpcoes: [
    {
      id: "pa-terminal-barra-funda",
      titulo: "Terminal Barra Funda",
      descricao: "Terminal Rodoviário Barra Funda - Barra Funda",
      sigla: "TBF",
      icon: "base",
    },
    {
      id: "pa-memorial-america-latina",
      titulo: "Memorial da América Latina",
      descricao: "Av. Mário de Andrade, 664",
      sigla: "MAL",
      icon: "base",
    },
    {
      id: "pa-museu-inclusao",
      titulo: "Museu da Inclusão",
      descricao: "Memorial da América Latina - Av. Mário de Andrade, 564 - Portão 10",
      sigla: "MI",
      icon: "base",
    },
    {
      id: "pa-uninove-memorial",
      titulo: "UNINOVE - Campus Memorial",
      descricao: "Prédio D - Rua Deputado Salvador Julianelli, s/n - Barra Funda",
      sigla: "UNI",
      icon: "base",
    },
    {
      id: "pa-acs-barra-funda",
      titulo: "Associação dos Cabos e Soldados",
      descricao: "Av. Marquês de S. Vicente, 531 - Barra Funda",
      sigla: "ACS",
      icon: "base",
    },
    {
      id: "pa-bcsm-4bpmm",
      titulo: "BCSM - 4º BPM/M",
      descricao: "Praça Dr. Osmar de Oliveira x Rua Professor Wilfrides Alves de Lima",
      sigla: "BCSM",
      icon: "vtr",
    },
  ],

  pontoApoioDestinos: {
    "pa-terminal-barra-funda": {
      nome: "Terminal Barra Funda",
      destino: "Terminal Rodoviário Barra Funda - Barra Funda, São Paulo - SP",
      detalhes: "Terminal Rodoviário Barra Funda - Barra Funda",
      travelmode: "driving",
    },
    "pa-memorial-america-latina": {
      nome: "Memorial da América Latina",
      destino: "Av. Mário de Andrade, 664 - Barra Funda, São Paulo - SP",
      detalhes: "Av. Mário de Andrade, 664",
      travelmode: "driving",
    },
    "pa-museu-inclusao": {
      nome: "Museu da Inclusão",
      destino: "Av. Mário de Andrade, 564 - Portão 10, Memorial da América Latina, São Paulo - SP",
      detalhes: "Memorial da América Latina - Av. Mário de Andrade, 564 - Portão 10",
      travelmode: "driving",
    },
    "pa-uninove-memorial": {
      nome: "UNINOVE - Campus Memorial (Prédio D)",
      destino: "Rua Deputado Salvador Julianelli, s/n - Barra Funda, São Paulo - SP",
      detalhes: "Campus Memorial - Prédio D",
      travelmode: "driving",
    },
    "pa-acs-barra-funda": {
      nome: "Associação dos Cabos e Soldados",
      destino: "Av. Marquês de São Vicente, 531 - Barra Funda, São Paulo - SP",
      detalhes: "Av. Marquês de S. Vicente, 531 - Barra Funda",
      travelmode: "driving",
    },
    "pa-bcsm-4bpmm": {
      nome: "BCSM - 4º BPM/M",
      destino: "Praça Dr. Osmar de Oliveira x Rua Professor Wilfrides Alves de Lima, São Paulo - SP",
      detalhes: "Cruzamento: Praça Dr. Osmar de Oliveira × Rua Professor Wilfrides Alves de Lima",
      travelmode: "driving",
    },
  },

  locaisInteresse: [
    { nome: "EMEF Dom Pedro II", tipo: "Escola", endereco: "Rua das Palmeiras, 120", prioridade: "alta" },
    { nome: "EE Professora Ana Lima", tipo: "Escola", endereco: "Av. Central, 890", prioridade: "media" },
    { nome: "Praça da Juventude", tipo: "Entorno", endereco: "Praça XV, s/n", prioridade: "alta" },
    { nome: "Terminal Urbano Norte", tipo: "Fluxo", endereco: "Av. Norte, 45", prioridade: "media" },
    { nome: "EMEF Tiradentes", tipo: "Escola", endereco: "Rua Tiradentes, 310", prioridade: "critica" },
  ],

  pontosApoio: [
    { nome: "Base Operacional Centro", contato: "3221-4500", endereco: "Rua da Polícia, 10", status: "ativo" },
    { nome: "Posto de Apoio Norte", contato: "3221-4512", endereco: "Av. Norte, 200", status: "ativo" },
    { nome: "Sala de Situação OBE", contato: "3221-4599", endereco: "QCG / COPOM", status: "ativo" },
    { nome: "Apoio Móvel 01", contato: "Via rádio", endereco: "Itinerante", status: "standby" },
  ],

  pops: [
    { codigo: "POP-01", titulo: "Entrada e saída escolar", versao: "2.1", atualizado: "10/02/2026" },
    { codigo: "POP-02", titulo: "Abordagem educativa no entorno", versao: "1.4", atualizado: "28/01/2026" },
    { codigo: "POP-03", titulo: "Resposta a ocorrência em unidade", versao: "3.0", atualizado: "05/03/2026" },
    { codigo: "POP-04", titulo: "Escolta / reforço emergencial", versao: "1.2", atualizado: "15/02/2026" },
    { codigo: "POP-05", titulo: "Registro e comunicação ao COPOM", versao: "2.0", atualizado: "01/03/2026" },
  ],

  rso: [
    { id: "RSO-2401", equipe: "Alfa-01", data: "10/08/2026", turno: "Manhã", status: "enviado" },
    { id: "RSO-2402", equipe: "Bravo-02", data: "10/08/2026", turno: "Manhã", status: "rascunho" },
    { id: "RSO-2403", equipe: "Charlie-03", data: "10/08/2026", turno: "Tarde", status: "pendente" },
    { id: "RSO-2398", equipe: "Delta-04", data: "09/08/2026", turno: "Noite", status: "enviado" },
  ],

  abastecimento: [
    { nome: "Posto Conveniado Sul", tipo: "Combustível", endereco: "Av. Sul, 1500", horario: "24h" },
    { nome: "Posto Conveniado Norte", tipo: "Combustível", endereco: "Rua das Acácias, 88", horario: "06–22h" },
    { nome: "Almoxarifado Operacional", tipo: "Material", endereco: "QCG — Bloco C", horario: "08–17h" },
    { nome: "Ponto de Hidratação Campo", tipo: "Apoio", endereco: "Base Norte", horario: "Durante operação" },
  ],

  escala: [
    { equipe: "Alfa-01", turno: "06:00–14:00", funcao: "Patrulhamento escolar", responsavel: "Sgt. Mendes" },
    { equipe: "Bravo-02", turno: "06:00–14:00", funcao: "Entorno / LI", responsavel: "Cb. Souza" },
    { equipe: "Charlie-03", turno: "14:00–22:00", funcao: "Patrulhamento escolar", responsavel: "Sgt. Rocha" },
    { equipe: "Delta-04", turno: "14:00–22:00", funcao: "Apoio / reforço", responsavel: "Cb. Lima" },
    { equipe: "Echo-05", turno: "22:00–06:00", funcao: "Reserva operacional", responsavel: "Sgt. Alves" },
  ],

  eventos: [
    {
      titulo: "Palmeiras-Barra Funda",
      data: "09/10/2026",
      local: "Eixos de entretenimento junto ao Metrô Palmeiras-Barra Funda",
      status: "Informativo",
      descricao:
        "Não há grandes megashows ou festivais de grande porte agendados para os principais eixos de entretenimento colados à estação de metrô Palmeiras-Barra Funda especificamente na sexta-feira, 9 de outubro de 2026.",
    },
  ],

  cpp: [
    {
      setor: "Setor Centro",
      prioridade: 1,
      locais: "EMEF Dom Pedro II · Praça da Juventude",
      frequencia: "A cada 30 min",
      cor: "critica",
    },
    {
      setor: "Setor Vila Nova",
      prioridade: 2,
      locais: "EMEF Tiradentes · Terminal Norte",
      frequencia: "A cada 45 min",
      cor: "alta",
    },
    {
      setor: "Setor Boa Vista",
      prioridade: 3,
      locais: "EE Marechal Rondon",
      frequencia: "A cada 60 min",
      cor: "media",
    },
    {
      setor: "Setor Industrial",
      prioridade: 4,
      locais: "Colégio Estadual Horizonte",
      frequencia: "A cada 90 min",
      cor: "baixa",
    },
  ],
};
