(function () {
  const users = [
    { re: "171204", senha: "soriano", nome: "SORIANO", graduacao: "Al Sgt PM", setor: "CMT", setorCurto: "Cmt da OBE" },
    { re: "200183", senha: "alyson", nome: "ALYSON", graduacao: "Al Sgt PM", setor: "SUBCMT", setorCurto: "Subcmt da OBE" },
    { re: "102525", senha: "murilo", nome: "MURILO", graduacao: "Al Sgt PM", setor: "TELEMATICA", setorCurto: "Telemática" },
    { re: "104032", senha: "roberto", nome: "ROBERTO", graduacao: "Al Sgt PM", setor: "SALA DE SITUAÇÕES", setorCurto: "Sala Sit" },
    { re: "150912", senha: "reis", nome: "REIS", graduacao: "Al Sgt PM", setor: "P1", setorCurto: "P1" },
    { re: "146472", senha: "castro", nome: "CASTRO", graduacao: "Al Sgt PM", setor: "P1", setorCurto: "P1" },
    { re: "103971", senha: "terin", nome: "TERIN", graduacao: "Al Sgt PM", setor: "P2", setorCurto: "P2" },
    { re: "105921", senha: "capaz", nome: "CAPAZ", graduacao: "Al Sgt PM", setor: "P2", setorCurto: "P2" },
    { re: "181028", senha: "rejane", nome: "REJANE", graduacao: "Al Sgt PM", setor: "P3", setorCurto: "P3" },
    { re: "201451", senha: "guilherme", nome: "GUILHERME", graduacao: "Al Sgt PM", setor: "P3", setorCurto: "P3" },
    { re: "104143", senha: "marcos", nome: "MARCOS", graduacao: "Al Sgt PM", setor: "P4", setorCurto: "P4" },
    { re: "130404", senha: "custodio", nome: "CUSTÓDIO", graduacao: "Al Sgt PM", setor: "P4", setorCurto: "P4" },
    { re: "104221", senha: "passos", nome: "PASSOS", graduacao: "Al Sgt PM", setor: "P4", setorCurto: "P4" },
    { re: "191906", senha: "jessica", nome: "JESSICA", graduacao: "Al Sgt PM", setor: "P5", setorCurto: "P5" },
    { re: "191042", senha: "rayane", nome: "RAYANE", graduacao: "Al Sgt PM", setor: "P5", setorCurto: "P5" },
    { re: "122507", senha: "henriques", nome: "HENRIQUES", graduacao: "Subten PM", setor: "SUPERVISOR OP", setorCurto: "Sup Op" },
    { re: "136802", senha: "bezerra", nome: "BEZERRA", graduacao: "1º Ten PM", setor: "COMANDANTE DE PELOTÕES", setorCurto: "Cmt de Pel" },
    { re: "129361", senha: "braga", nome: "BRAGA", graduacao: "1º Sgt PM", setor: "SUPERVISOR OP", setorCurto: "Sup Op" },
    { re: "982648", senha: "gonsaga", nome: "GONSAGA", graduacao: "Subten PM", setor: "SUPERVISOR OP", setorCurto: "Sup Op" },
    { re: "910345", senha: "asaka", nome: "ASAKA", graduacao: "Cel PM", setor: "CMT DA ESSGT", setorCurto: "Cmt da ESSgt" },
    { re: "100295", senha: "flavia", nome: "FLAVIA", graduacao: "Maj PM", setor: "CMT DA ESSFAG", setorCurto: "Cmt da ESSFAG" },
    { re: "118455", senha: "tania", nome: "TANIA", graduacao: "Cap PM", setor: "CMT DA 1ª CIA", setorCurto: "Cmt da 1ª Cia Es" },
    { re: "980874", senha: "granero", nome: "GRANERO", graduacao: "Ten Cel PM", setor: "SUBCMT DA ESSGT", setorCurto: "" },
    { re: "930633", senha: "helder", nome: "HELDER", graduacao: "TenCel PM", setor: "", setorCurto: "Cmt do 4º BPM/M" },
    { re: "118426", senha: "jose", nome: "JOSE ANTONIO", graduacao: "Cap PM", setor: "OBE", setorCurto: "Cmt da 3ª Cia" },
    { re: "116134", senha: "sanches", nome: "Sanches", graduacao: "Cap PM", setor: "OBE", setorCurto: "Cmt da 2ª Cia Es" },
    { re: "973654", senha: "soares", nome: "SOARES", graduacao: "Maj PM", setor: "CH DIV DA ESSGT", setorCurto: "Ch Div da ESSgt" },
    { re: "127845", senha: "dene", nome: "DENE", graduacao: "Cap PM", setor: "OBE", setorCurto: "Cmt da 3ª Cia Es" },
    { re: "108437", senha: "bordim", nome: "BORDIM", graduacao: "Maj PM", setor: "OBE", setorCurto: "SCmt do 4º BPM/M" },
    { re: "152709", senha: "marcella", nome: "MARCELLA", graduacao: "1º Ten PM", setor: "OBE", setorCurto: "Ch St Comunic" },
    ];

  function normalize(value) {
    return String(value)
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function formatNome(nome) {
    return String(nome || "")
      .trim()
      .toLowerCase()
      .replace(/\b\p{L}/gu, (c) => c.toUpperCase());
  }

  function greeting(user) {
    if (!user) return "Olá.";
    const graduacao = user.graduacao || "";
    let titulo = user.setorCurto || user.setor || "";
    // Não exibe "OBE" genérico após o nome
    if (String(titulo).trim().toUpperCase() === "OBE") titulo = "";
    const nome = formatNome(user.nome);
    const nomeHtml = `<span class="home-greeting__name">${nome}</span>`;
    const prefixo = graduacao ? `${graduacao} ${nomeHtml}` : nomeHtml;

    if (!titulo) {
      return `Olá, ${prefixo}!`;
    }
    return `Olá, ${prefixo}! ${titulo}.`;
  }

  function findByRe(re) {
    const key = String(re || "").trim().replace(/\D/g, "");
    if (!key) return null;
    return users.find((u) => String(u.re).replace(/\D/g, "") === key) || null;
  }

  function validateCredentials(re, senha) {
    const user = findByRe(re);
    if (!user) return null;
    if (normalize(senha) !== normalize(user.senha)) return null;
    return user;
  }

  function isNaListaSupervisor(re) {
    return Boolean(findByRe(re));
  }

  window.OBE_AUTH = {
    users,
    findByRe,
    validateCredentials,
    isNaListaSupervisor,
    normalize,
    formatNome,
    greeting,
  };
})();
