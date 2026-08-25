(function () {
  const users = [
    { re: "171204", senha: "soriano", nome: "SORIANO", setor: "CMT" },
    { re: "200183", senha: "alyson", nome: "ALYSON", setor: "SUBCMT" },
    { re: "102525", senha: "murilo", nome: "MURILO", setor: "TELEMATICA" },
    { re: "104032", senha: "roberto brito", nome: "ROBERTO BRITO", setor: "SALA DE SITUAÇÕES" },
    { re: "150912", senha: "reis", nome: "REIS", setor: "P1" },
    { re: "146472", senha: "castro", nome: "CASTRO", setor: "P1" },
    { re: "103971", senha: "terin", nome: "TERIN", setor: "P2" },
    { re: "105921", senha: "capaz", nome: "CAPAZ", setor: "P2" },
    { re: "181028", senha: "rejane", nome: "REJANE", setor: "P3" },
    { re: "201451", senha: "guilherme", nome: "GUILHERME", setor: "P3" },
    { re: "104143", senha: "marcos", nome: "MARCOS", setor: "P4" },
    { re: "130404", senha: "custodio", nome: "CUSTÓDIO", setor: "P4" },
    { re: "104221", senha: "passos", nome: "PASSOS", setor: "P4" },
    { re: "191906", senha: "jessica", nome: "JESSICA", setor: "P5" },
    { re: "191042", senha: "rayane", nome: "RAYANE", setor: "P5" },
    { re: "152709", senha: "marcella", nome: "MARCELLA", setor: "COMANDANTE DE CIA" },
    { re: "136802", senha: "bezerra", nome: "BEZERRA", setor: "COMANDANTE DE PELOTÕES" },
    { re: "129361", senha: "braga", nome: "BRAGA", setor: "SUPERVISOR OP" },
    { re: "149756", senha: "russo", nome: "RUSSO", setor: "SUPERVISOR OP" },
  ];

  function normalize(value) {
    return String(value)
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
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
  };
})();
