window.OBE_DATA = {
  operacao: {
    nome: "OBE — Operação Batalhão Escola",
    ano: 2026,
    sistema: "SGE — Sistema de Gestão Estratégica",
    status: "Em execução",
  },

  modulos: [
    {
      id: "mapa-forca",
      titulo: "Mapa Força",
      descricao: "Distribuição do efetivo em campo",
      sigla: "MF",
      icon: "users",
    },
    {
      id: "locais-interesse",
      titulo: "Locais de Interesse",
      descricao: "Escolas e pontos sensíveis",
      sigla: "LI",
      icon: "pin",
    },
    {
      id: "pontos-apoio",
      titulo: "Pontos de Apoio",
      descricao: "Bases e estruturas de apoio",
      sigla: "PA",
      icon: "base",
    },
    {
      id: "pops",
      titulo: "POP's",
      descricao: "Procedimentos operacionais padrão",
      sigla: "POP",
      icon: "doc",
    },
    {
      id: "rso",
      titulo: "RSO",
      descricao: "Relatórios de serviço operacional",
      sigla: "RSO",
      icon: "report",
    },
    {
      id: "abastecimento",
      titulo: "Pontos de Abastecimento",
      descricao: "Combustível e logística",
      sigla: "PAb",
      icon: "fuel",
    },
    {
      id: "escala",
      titulo: "Escala de Serviço",
      descricao: "Turnos e equipes do dia",
      sigla: "ES",
      icon: "calendar",
    },
    {
      id: "cpp",
      titulo: "CPP",
      descricao: "Cartão de Prioridade de Patrulhamento",
      sigla: "CPP",
      icon: "shield",
    },
  ],

  mapaForca: [
    { equipe: "Alfa-01", efetivo: 4, viatura: "PM-214", setor: "Centro", status: "em_campo" },
    { equipe: "Bravo-02", efetivo: 3, viatura: "PM-331", setor: "Vila Nova", status: "em_campo" },
    { equipe: "Charlie-03", efetivo: 4, viatura: "PM-118", setor: "Boa Vista", status: "deslocamento" },
    { equipe: "Delta-04", efetivo: 2, viatura: "PM-402", setor: "Industrial", status: "base" },
    { equipe: "Echo-05", efetivo: 5, viatura: "PM-055", setor: "São José", status: "em_campo" },
  ],

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
