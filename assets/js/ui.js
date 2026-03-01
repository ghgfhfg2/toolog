(() => {
  const createTopButton = () => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'to-top-btn';
    btn.setAttribute('aria-label', '맨 위로 이동');
    btn.textContent = '↑';

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    const onScroll = () => {
      if (window.scrollY > 120) btn.classList.add('show');
      else btn.classList.remove('show');
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    document.body.appendChild(btn);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createTopButton);
  } else {
    createTopButton();
  }
})();
