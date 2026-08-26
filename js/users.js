(function () {
  const users = [
    { re: "171204", senha: "soriano", nome: "SORIANO", graduacao: "Al Sgt PM", setor: "CMT", setorCurto: "Cmt da OBE" },
    { re: "200183", senha: "alyson", nome: "ALYSON", graduacao: "Al Sgt PM", setor: "SUBCMT", setorCurto: "Subcmt da OBE" },
    { re: "102525", senha: "murilo", nome: "MURILO", graduacao: "Al Sgt PM", setor: "TELEMATICA", setorCurto: "Telemática" },
    { re: "104032", senha: "roberto brito", nome: "ROBERTO BRITO", graduacao: "Al Sgt PM", setor: "SALA DE SITUAÇÕES", setorCurto: "Sala Sit" },
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
    { re: "152709", senha: "marcella", nome: "MARCELLA", graduacao: "1º Ten PM", setor: "COMANDANTE DE CIA", setorCurto: "Cmt de Cia" },
    { re: "136802", senha: "bezerra", nome: "BEZERRA", graduacao: "1º Ten PM", setor: "COMANDANTE DE PELOTÕES", setorCurto: "Cmt de Pel" },
    { re: "129361", senha: "braga", nome: "BRAGA", graduacao: "1º Sgt PM", setor: "SUPERVISOR OP", setorCurto: "Sup Op" },
    { re: "149756", senha: "russo", nome: "RUSSO", graduacao: "2º Sgt PM", setor: "SUPERVISOR OP", setorCurto: "Sup Op" },
    { re: "910345", senha: "asaka", nome: "ASAKA", graduacao: "Cel PM", setor: "CMT DA ESSGT", setorCurto: "Cmt da ESSgt" },
    { re: "981001", senha: "alex", nome: "ALEX", graduacao: "Ten Cel PM", setor: "SUBCMT DA ESSGT", setorCurto: "Subcmt da ESSgt" },
    { re: "100295", senha: "flavia", nome: "FLAVIA", graduacao: "Maj PM", setor: "CMT DA ESSFAG", setorCurto: "Cmt da ESSFAG" },
    { re: "118455", senha: "tania", nome: "TANIA", graduacao: "Cap PM", setor: "CMT DA 1ª CIA", setorCurto: "Cmt da 1ª Cia" },
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
    const titulo = user.setorCurto || user.setor || "";
    const nome = formatNome(user.nome);
    const nomeHtml = `<span class="home-greeting__name">${nome}</span>`;
    const prefixo = graduacao ? `${graduacao} ${nomeHtml}` : nomeHtml;

    if (!titulo) {
      return `Olá, ${prefixo}!`;
    }
    return `Olá, ${prefixo}! ${titulo}.`;
  }

  function findByRe(re) {
    const key = String(re).trim();
    return users.find((u) => u.re === key) || null;
  }

  function validateCredentials(re, senha) {
    const user = findByRe(re);
    if (!user) return null;
    if (normalize(senha) !== normalize(user.senha)) return null;
    return user;
  }

  window.OBE_AUTH = {
    users,
    findByRe,
    validateCredentials,
    normalize,
    formatNome,
    greeting,
  };
})();
