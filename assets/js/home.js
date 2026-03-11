(() => {
  const grid = document.getElementById('toolGrid');
  const chips = Array.from(document.querySelectorAll('#chipBar .chip'));
  const search = document.getElementById('toolSearch');
  const empty = document.getElementById('emptyState');
  const pager = document.getElementById('toolPagination');
  const latestStrip = document.getElementById('latestStrip');
  const latestStripList = document.getElementById('latestStripList');
  const prevBtn = document.getElementById('pgPrev');
  const nextBtn = document.getElementById('pgNext');
  const info = document.getElementById('pgInfo');
  const postList = document.getElementById('publishedPostsList');
  const postPager = document.getElementById('postPagination');
  const postPrevBtn = document.getElementById('postPrev');
  const postNextBtn = document.getElementById('postNext');
  const postInfo = document.getElementById('postInfo');
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

  // 최신 업데이트 스트립(상위 6개)
  if (latestStrip && latestStripList) {
    const top = cards.slice(0, 6);
    latestStripList.innerHTML = top.map((card) => {
      const title = card.querySelector('.tool-title')?.textContent?.trim() || '';
      const href = card.querySelector('.tool-title')?.getAttribute('href') || '#';
      return `<a class="latest-pill" href="${href}">${title}</a>`;
    }).join('');
    latestStrip.hidden = top.length === 0;
  }

  const PAGE_SIZE = 15;
  const POST_PAGE_SIZE = 10;
  let category = 'all';
  let currentPage = 1;
  let postCurrentPage = 1;

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

  const renderPostPagination = () => {
    if (!postList) return;

    const postItems = Array.from(postList.querySelectorAll('li'));
    const total = postItems.length;
    const totalPages = Math.max(1, Math.ceil(total / POST_PAGE_SIZE));
    if (postCurrentPage > totalPages) postCurrentPage = totalPages;

    const start = (postCurrentPage - 1) * POST_PAGE_SIZE;
    const end = start + POST_PAGE_SIZE;

    postItems.forEach((item, idx) => {
      item.hidden = idx < start || idx >= end;
    });

    if (postPager) {
      postPager.hidden = total <= POST_PAGE_SIZE || total === 0;
    }
    if (postInfo) {
      postInfo.textContent = `${postCurrentPage} / ${totalPages}`;
    }
    if (postPrevBtn) {
      postPrevBtn.disabled = postCurrentPage <= 1;
    }
    if (postNextBtn) {
      postNextBtn.disabled = postCurrentPage >= totalPages;
    }
  };

  postPrevBtn?.addEventListener('click', () => {
    if (postCurrentPage > 1) {
      postCurrentPage -= 1;
      renderPostPagination();
    }
  });

  postNextBtn?.addEventListener('click', () => {
    const totalPosts = postList ? postList.querySelectorAll('li').length : 0;
    const totalPages = Math.max(1, Math.ceil(totalPosts / POST_PAGE_SIZE));
    if (postCurrentPage < totalPages) {
      postCurrentPage += 1;
      renderPostPagination();
    }
  });

  render();
  renderPostPagination();
})();
