(() => {
  const grid = document.getElementById('toolGrid');
  const chips = Array.from(document.querySelectorAll('#chipBar .chip'));
  const search = document.getElementById('toolSearch');
  const empty = document.getElementById('emptyState');
  const pager = document.getElementById('toolPagination');
  const prevBtn = document.getElementById('pgPrev');
  const nextBtn = document.getElementById('pgNext');
  const info = document.getElementById('pgInfo');
  if (!grid) return;

  const cards = Array.from(grid.querySelectorAll('.tool-card'));

  // 최신 툴(New 배지)을 앞쪽에 우선 배치
  const getPriority = (card) => {
    const badge = card.querySelector('.tool-badge');
    const label = (badge?.textContent || '').trim().toLowerCase();
    if (label === 'new') return 0;
    return 1;
  };

  cards.sort((a, b) => getPriority(a) - getPriority(b));
  cards.forEach((card) => grid.appendChild(card));

  const PAGE_SIZE = 15;
  let category = 'all';
  let currentPage = 1;

  const normalize = (s) => (s || '').toLowerCase().trim();

  const getFilteredCards = () => {
    const q = normalize(search?.value);
    return cards.filter((card) => {
      const byCategory = category === 'all' || card.dataset.category === category;
      const hay = `${card.dataset.title} ${card.dataset.description}`;
      const byQuery = !q || hay.includes(q);
      return byCategory && byQuery;
    });
  };

  const render = () => {
    const filtered = getFilteredCards();
    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    if (currentPage > totalPages) currentPage = totalPages;

    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const pageSet = new Set(filtered.slice(start, end));

    cards.forEach((card) => {
      card.hidden = !pageSet.has(card);
    });

    if (empty) empty.hidden = total > 0;

    if (pager) {
      pager.hidden = total <= PAGE_SIZE || total === 0;
      if (info) info.textContent = `${currentPage} / ${totalPages}`;
      if (prevBtn) prevBtn.disabled = currentPage <= 1;
      if (nextBtn) nextBtn.disabled = currentPage >= totalPages;
    }
  };

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      chips.forEach((x) => x.classList.remove('is-active'));
      chip.classList.add('is-active');
      category = chip.dataset.filter || 'all';
      currentPage = 1;
      render();
    });
  });

  search?.addEventListener('input', () => {
    currentPage = 1;
    render();
  });

  prevBtn?.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage -= 1;
      render();
    }
  });

  nextBtn?.addEventListener('click', () => {
    const totalPages = Math.max(1, Math.ceil(getFilteredCards().length / PAGE_SIZE));
    if (currentPage < totalPages) {
      currentPage += 1;
      render();
    }
  });

  render();
})();
