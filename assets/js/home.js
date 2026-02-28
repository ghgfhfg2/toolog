(() => {
  const grid = document.getElementById('toolGrid');
  const chips = Array.from(document.querySelectorAll('#chipBar .chip'));
  const search = document.getElementById('toolSearch');
  const empty = document.getElementById('emptyState');
  if (!grid) return;

  const cards = Array.from(grid.querySelectorAll('.tool-card'));
  let category = 'all';

  const normalize = (s) => (s || '').toLowerCase().trim();

  const render = () => {
    const q = normalize(search?.value);
    let visible = 0;

    cards.forEach((card) => {
      const byCategory = category === 'all' || card.dataset.category === category;
      const hay = `${card.dataset.title} ${card.dataset.description}`;
      const byQuery = !q || hay.includes(q);
      const show = byCategory && byQuery;
      card.hidden = !show;
      if (show) visible += 1;
    });

    if (empty) empty.hidden = visible > 0;
  };

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      chips.forEach((x) => x.classList.remove('is-active'));
      chip.classList.add('is-active');
      category = chip.dataset.filter || 'all';
      render();
    });
  });

  search?.addEventListener('input', render);
  render();
})();
