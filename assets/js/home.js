(() => {
  const nav = document.getElementById('sideNav');
  const searchInput = document.getElementById('toolSearch');
  const cards = Array.from(document.querySelectorAll('#toolGrid .tool-card'));
  const emptyState = document.getElementById('emptyState');
  const themeToggle = document.getElementById('themeToggle');

  if (!cards.length) return;

  let activeCategory = 'all';

  const normalize = (v) => (v || '').toLowerCase().trim();

  const applyFilter = () => {
    const q = normalize(searchInput?.value);
    let shown = 0;

    cards.forEach((card) => {
      const cat = card.dataset.category;
      const hay = `${card.dataset.title} ${card.dataset.description}`;
      const byCategory = activeCategory === 'all' || cat === activeCategory;
      const bySearch = !q || hay.includes(q);
      const visible = byCategory && bySearch;
      card.hidden = !visible;
      if (visible) shown += 1;
    });

    if (emptyState) emptyState.hidden = shown > 0;
  };

  nav?.addEventListener('click', (e) => {
    const btn = e.target.closest('.nav-item');
    if (!btn) return;
    activeCategory = btn.dataset.filter || 'all';
    nav.querySelectorAll('.nav-item').forEach((x) => x.classList.remove('is-active'));
    btn.classList.add('is-active');
    applyFilter();
  });

  searchInput?.addEventListener('input', applyFilter);

  themeToggle?.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    localStorage.setItem('toolog-theme', document.body.classList.contains('light-theme') ? 'light' : 'dark');
  });

  if (localStorage.getItem('toolog-theme') === 'light') {
    document.body.classList.add('light-theme');
  }

  applyFilter();
})();
