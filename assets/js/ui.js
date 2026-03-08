(() => {
  const createTopButton = () => {
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    const pageLang = ['en', 'ja'].includes(pathParts[0]) ? pathParts[0] : 'ko';
    const topLabel = pageLang === 'en' ? 'Back to top' : (pageLang === 'ja' ? 'ページ上部へ移動' : '맨 위로 이동');

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'to-top-btn';
    btn.setAttribute('aria-label', topLabel);
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
