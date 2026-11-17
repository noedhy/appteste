(() => {
  const key = 'doseps-theme';
  const root = document.documentElement;
  const system = window.matchMedia('(prefers-color-scheme: dark)');
  let preference;
  try { preference = localStorage.getItem(key); } catch (_) {}
  if (preference !== 'light' && preference !== 'dark') preference = null;
  function apply(theme) {
    root.dataset.theme = theme;
    const button = document.getElementById('theme-toggle');
    if (!button) return;
    const dark = theme === 'dark';
    const label = dark ? 'Ativar modo claro' : 'Ativar modo escuro';
    button.title = label;
    button.setAttribute('aria-label', label);
    button.setAttribute('aria-pressed', String(dark));
    button.firstElementChild.textContent = dark ? '☀' : '☾';
    button.lastElementChild.textContent = dark ? 'Modo claro' : 'Modo escuro';
  }
  const current = () => preference || (system.matches ? 'dark' : 'light');
  apply(current());
  document.addEventListener('DOMContentLoaded', () => {
    apply(current());
    document.getElementById('theme-toggle').addEventListener('click', () => {
      preference = root.dataset.theme === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem(key, preference); } catch (_) {}
      apply(preference);
    });
  });
  system.addEventListener('change', () => { if (!preference) apply(current()); });
  window.addEventListener('storage', event => {
    if (event.key !== key && event.key !== null) return;
    preference = event.newValue === 'dark' || event.newValue === 'light' ? event.newValue : null;
    apply(current());
  });
})();
