(function () {
  function ready(fn){ if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn); else fn(); }

  ready(function () {
    const btn = document.querySelector('.drawer-hamburger');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.querySelector('.drawer-overlay');
    if (!btn || !sidebar || !overlay) return;

    // 사이드바 자체도 포커스 가능
    if (!sidebar.hasAttribute('tabindex')) sidebar.setAttribute('tabindex','-1');

    const closeBtn = sidebar.querySelector('.drawer-close');

    function getFocusables(){
      return sidebar.querySelectorAll(
        'a[href], area[href], button:not([disabled]), input:not([disabled]), ' +
        'select:not([disabled]), textarea:not([disabled]), ' +
        '[tabindex]:not([tabindex="-1"])'
      );
    }

    let lastFocused = null;

    function openDrawer(){
      lastFocused = document.activeElement;
      document.body.classList.add('drawer-open');
      btn.setAttribute('aria-expanded', 'true');
      sidebar.setAttribute('aria-hidden', 'false');
      overlay.hidden = false;

      const f = getFocusables();
      (f[0] || sidebar).focus();

      // 사이드바 밖으로 포커스가 나가면 즉시 되돌림
      document.addEventListener('focusin', keepFocusInside);
    }

    function closeDrawer(){
      document.body.classList.remove('drawer-open');
      btn.setAttribute('aria-expanded', 'false');
      sidebar.setAttribute('aria-hidden', 'true');
      overlay.hidden = true;

      document.removeEventListener('focusin', keepFocusInside);
      (lastFocused || btn).focus();
    }

    function keepFocusInside(e){
      if (!document.body.classList.contains('drawer-open')) return;
      if (!sidebar.contains(e.target)){
        const f = getFocusables();
        (f[0] || sidebar).focus();
      }
    }

    btn.addEventListener('click', () => {
      if (document.body.classList.contains('drawer-open')) closeDrawer();
      else openDrawer();
    });

    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    overlay.addEventListener('click', closeDrawer);

    document.addEventListener('keydown', function(e){
      if (!document.body.classList.contains('drawer-open')) return;

      if (e.key === 'Escape'){ e.preventDefault(); closeDrawer(); return; }
      if (e.key !== 'Tab') return;

      const f = Array.from(getFocusables());
      if (f.length === 0){ e.preventDefault(); sidebar.focus(); return; }

      const first = f[0], last = f[f.length - 1];

      // 처음/마지막에서 순환
      if (e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
      // 그 외: 사이드바 밖으로 나가려 하면 끌어오기
      else if (!sidebar.contains(document.activeElement)){
        e.preventDefault(); (first || sidebar).focus();
      }
    });

    // 데스크톱 전환 시 자동 닫기
    const mql = window.matchMedia('(min-width: 64em)');
    const sync = e => { if (e.matches) closeDrawer(); };
    if (mql.addEventListener) mql.addEventListener('change', sync);
    else mql.addListener(sync);
  });
})();
