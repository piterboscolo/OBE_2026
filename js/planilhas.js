/**
 * Planilhas por card: sheetId + gid da aba.
 * Abertura via irParaAba() → edit#gid= em nova aba.
 */
window.OBE_PLANILHAS = {
  /* CPP VTR */
  "vtr-cpp-cgp-i": { titulo: "ESSgt-031 - CGP I", sheetId: "1Lg-OlkJjwCa3NdhzwTv_E77ikvEnCEC_", gid: "1678212823" },
  "vtr-cpp-cgp-ii": { titulo: "ESSgt-032 - CGP II", sheetId: "1Lg-OlkJjwCa3NdhzwTv_E77ikvEnCEC_", gid: "709359279" },
  "vtr-cpp-cgp-iii": { titulo: "ESSgt-033 - CGP III", sheetId: "1Lg-OlkJjwCa3NdhzwTv_E77ikvEnCEC_", gid: "556307463" },
  "vtr-cpp-essgt-034": { titulo: "ESSgt-034", sheetId: "1Lg-OlkJjwCa3NdhzwTv_E77ikvEnCEC_", gid: "1198846853" },
  "vtr-cpp-essgt-035": { titulo: "ESSgt-035", sheetId: "1Lg-OlkJjwCa3NdhzwTv_E77ikvEnCEC_", gid: "486743165" },
  "vtr-cpp-essgt-036": { titulo: "ESSgt-036", sheetId: "1Lg-OlkJjwCa3NdhzwTv_E77ikvEnCEC_", gid: "1409115155" },
  "vtr-cpp-essgt-037": { titulo: "ESSgt-037", sheetId: "1Lg-OlkJjwCa3NdhzwTv_E77ikvEnCEC_", gid: "2055675044" },
  "vtr-cpp-bcm-4bpmm": { titulo: "BCM-4ºBPM/M", sheetId: "1Lg-OlkJjwCa3NdhzwTv_E77ikvEnCEC_", gid: "1132577963" },

  /* RSO VTR */
  "vtr-rso-cmt-cia": { titulo: "Cmt de Cia", sheetId: "186S-iSP5Ruvlour4TjEkNnb2DHRi5DeH", gid: "1070881425" },
  "vtr-rso-scmt-cia": { titulo: "SCmt de Cia", sheetId: "186S-iSP5Ruvlour4TjEkNnb2DHRi5DeH", gid: "354675535" },
  "vtr-rso-cmt-obe": { titulo: "Cmt da OBE", sheetId: "186S-iSP5Ruvlour4TjEkNnb2DHRi5DeH", gid: "831444685" },
  "vtr-rso-scmt-obe": { titulo: "SCmt da OBE", sheetId: "186S-iSP5Ruvlour4TjEkNnb2DHRi5DeH", gid: "1820831758" },
  "vtr-rso-cgp-i": { titulo: "CGP I", sheetId: "186S-iSP5Ruvlour4TjEkNnb2DHRi5DeH", gid: "1244188079" },
  "vtr-rso-cgp-ii": { titulo: "CGP II", sheetId: "186S-iSP5Ruvlour4TjEkNnb2DHRi5DeH", gid: "1416735913" },
  "vtr-rso-cgp-iii": { titulo: "CGP III", sheetId: "186S-iSP5Ruvlour4TjEkNnb2DHRi5DeH", gid: "843436965" },
  "vtr-rso-rp-01": { titulo: "RP 01", sheetId: "186S-iSP5Ruvlour4TjEkNnb2DHRi5DeH", gid: "1047353912" },
  "vtr-rso-rp-02": { titulo: "RP 02", sheetId: "186S-iSP5Ruvlour4TjEkNnb2DHRi5DeH", gid: "1407758504" },
  "vtr-rso-rp-03": { titulo: "RP 03", sheetId: "186S-iSP5Ruvlour4TjEkNnb2DHRi5DeH", gid: "1905992788" },
  "vtr-rso-rp-04": { titulo: "RP 04", sheetId: "186S-iSP5Ruvlour4TjEkNnb2DHRi5DeH", gid: "1259352403" },
  "vtr-rso-p4": { titulo: "VTR P4", sheetId: "186S-iSP5Ruvlour4TjEkNnb2DHRi5DeH", gid: "670730022" },

  /* RSO POP */
  "rso-01": { titulo: "POP 01", sheetId: "186S-iSP5Ruvlour4TjEkNnb2DHRi5DeH", gid: "1245416641" },
  "rso-02": { titulo: "POP 02", sheetId: "186S-iSP5Ruvlour4TjEkNnb2DHRi5DeH", gid: "1553214801" },
  "rso-03": { titulo: "POP 03", sheetId: "186S-iSP5Ruvlour4TjEkNnb2DHRi5DeH", gid: "1261469995" },
  "rso-04": { titulo: "POP 04", sheetId: "186S-iSP5Ruvlour4TjEkNnb2DHRi5DeH", gid: "1012821437" },
  "rso-05": { titulo: "POP 05", sheetId: "186S-iSP5Ruvlour4TjEkNnb2DHRi5DeH", gid: "1476075140" },
  "rso-06": { titulo: "POP 06", sheetId: "186S-iSP5Ruvlour4TjEkNnb2DHRi5DeH", gid: "2087688309" },
  "rso-07": { titulo: "POP 07", sheetId: "186S-iSP5Ruvlour4TjEkNnb2DHRi5DeH", gid: "426496318" },
  "rso-08": { titulo: "POP 08", sheetId: "186S-iSP5Ruvlour4TjEkNnb2DHRi5DeH", gid: "1471493126" },
  "rso-09": { titulo: "POP 09", sheetId: "186S-iSP5Ruvlour4TjEkNnb2DHRi5DeH", gid: "676496147" },
  "rso-10": { titulo: "POP 10", sheetId: "186S-iSP5Ruvlour4TjEkNnb2DHRi5DeH", gid: "442122667" },
  "rso-11": { titulo: "POP 11", sheetId: "186S-iSP5Ruvlour4TjEkNnb2DHRi5DeH", gid: "1575911325" },
  "rso-12": { titulo: "POP 12", sheetId: "186S-iSP5Ruvlour4TjEkNnb2DHRi5DeH", gid: "1532135751" },
  "rso-13": { titulo: "POP 13", sheetId: "186S-iSP5Ruvlour4TjEkNnb2DHRi5DeH", gid: "1774547749" },
  "rso-14": { titulo: "POP 14", sheetId: "186S-iSP5Ruvlour4TjEkNnb2DHRi5DeH", gid: "1078570435" },
  "rso-15": { titulo: "POP 15", sheetId: "186S-iSP5Ruvlour4TjEkNnb2DHRi5DeH", gid: "2084776539" },
};

/**
 * Abre a aba da planilha em nova janela/aba do navegador.
 * Formato: /edit#gid= — o Sheets lê o hash do zero na nova aba.
 */
window.OBE_irParaAba = function (planilhaId, gidId) {
  const id = String(planilhaId || "").trim();
  const gid = String(gidId || "").trim();
  if (!id || !gid) return false;
  const urlCompleta =
    "https://docs.google.com/spreadsheets/d/" + id + "/edit#gid=" + gid;
  window.open(urlCompleta, "_blank");
  return true;
};

window.OBE_abrirPlanilhaPorChave = function (key) {
  const entry = window.OBE_PLANILHAS && window.OBE_PLANILHAS[key];
  if (!entry) return false;
  return window.OBE_irParaAba(entry.sheetId, entry.gid);
};
