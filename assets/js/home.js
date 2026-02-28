(function () {
  const chipsWrap = document.getElementById('categoryChips');
  const grid = document.getElementById('toolGrid');
  const empty = document.getElementById('emptyState');

  if (!chipsWrap || !grid) return;

  const chips = Array.from(chipsWrap.querySelectorAll('.chip'));
  const cards = Array.from(grid.querySelectorAll('.tool-card'));

  const setActive = (target) => {
    chips.forEach((chip) => chip.classList.toggle('is-active', chip === target));
  };

  const applyFilter = (filter) => {
    let visibleCount = 0;

    cards.forEach((card) => {
      const cats = card.dataset.categories || '';
      const show = filter === 'all' || cats.includes(filter);
      card.hidden = !show;
      if (show) visibleCount += 1;
    });

    if (empty) empty.hidden = visibleCount > 0;
  };

  chipsWrap.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (!chip) return;

    setActive(chip);
    applyFilter(chip.dataset.filter || 'all');
  });
})();
