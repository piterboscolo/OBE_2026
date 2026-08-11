window.OBE_ICONS = {
  users:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 11a3 3 0 1 0-3-3 3 3 0 0 0 3 3zM8 11a3 3 0 1 0-3-3 3 3 0 0 0 3 3zm0 2c-2.67 0-8 1.34-8 4v2h10v-2c0-1.5.67-2.7 1.76-3.55C10.6 13.16 9.3 13 8 13zm8 0c-.29 0-.62.02-.97.05A5.22 5.22 0 0 1 17 18v2h7v-2c0-2.66-5.33-4-8-4z"/></svg>',
  pin:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 14.5 9 2.5 2.5 0 0 1 12 11.5z"/></svg>',
  base:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 3 9v12h6v-6h6v6h6V9l-9-6zm0 3.2L18 10v2h-3v-2h-2v2H9v-2H6v-1.8L12 6.2z"/></svg>',
  doc:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm1 7V3.5L19.5 9H15zM8 13h8v2H8v-2zm0 4h8v2H8v-2zm0-8h4v2H8V9z"/></svg>',
  report:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h10a2 2 0 0 1 2 2v16l-7-3-7 3V5a2 2 0 0 1 2-2zm2 5v2h6V8H9zm0 4v2h6v-2H9zm0 4v2h4v-2H9z"/></svg>',
  fuel:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 3h10a1 1 0 0 1 1 1v14h2a2 2 0 0 0 2-2V9.83l-2-2V10h-1V6.83l3.71 3.7a1 1 0 0 1 .29.71V16a4 4 0 0 1-4 4h-2v1H3V4a1 1 0 0 1 1-1zm1 2v12h8V5H5zm2 2h4v4H7V7z"/></svg>',
  calendar:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 2h2v2h6V2h2v2h3v16H4V4h3V2zm11 6H6v10h12V8zM8 11h3v3H8v-3z"/></svg>',
  shield:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2 4 5v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V5l-8-3zm0 4.2 4.5 1.7v3.6c0 3.4-2.2 6.6-4.5 7.8-2.3-1.2-4.5-4.4-4.5-7.8V8l4.5-1.8z"/></svg>',
};

window.obeIcon = function (name) {
  return window.OBE_ICONS[name] || window.OBE_ICONS.doc;
};
