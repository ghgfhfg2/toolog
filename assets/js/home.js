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

  // 게시일 기준 최신순 정렬
  // 1) data-published-at(YYYY-MM-DD 등) 존재 시 해당 날짜 내림차순
  // 2) 날짜가 없으면 데이터 작성 순서(아래에 추가된 항목) 우선
  const toTime = (v) => {
    const t = Date.parse(v || '');
    return Number.isFinite(t) ? t : NaN;
  };

  cards.forEach((card, idx) => {
    card.dataset.orderIndex = String(idx);
  });

  cards.sort((a, b) => {
    const aTime = toTime(a.dataset.publishedAt);
    const bTime = toTime(b.dataset.publishedAt);

    const aHas = Number.isFinite(aTime);
    const bHas = Number.isFinite(bTime);

    if (aHas && bHas && aTime !== bTime) return bTime - aTime;
    if (aHas !== bHas) return aHas ? -1 : 1;

    // 날짜 없을 때: 기존 목록의 뒤쪽(최근 추가)을 앞으로
    return Number(b.dataset.orderIndex) - Number(a.dataset.orderIndex);
  });

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
