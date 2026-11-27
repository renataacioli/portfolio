(function () {
  var pt = (document.documentElement.lang || '').toLowerCase().indexOf('pt') === 0;
  var T = pt
    ? { open: 'Abrir menu', close: 'Fechar menu', menu: 'Menu' }
    : { open: 'Open menu', close: 'Close menu', menu: 'Menu' };

  /* ---------- hidden menu ---------- */
  var header = document.querySelector('header');
  var nav = header && header.querySelector('nav');
  if (nav) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'm-menu-btn';
    btn.setAttribute('aria-label', T.open);
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', 'm-sheet');
    btn.innerHTML = '<span></span><span></span><span></span>';
    header.appendChild(btn);

    var sheet = document.createElement('div');
    sheet.className = 'm-sheet';
    sheet.id = 'm-sheet';
    sheet.setAttribute('role', 'dialog');
    sheet.setAttribute('aria-modal', 'true');
    sheet.setAttribute('aria-label', T.menu);

    var top = document.createElement('div');
    top.className = 'm-sheet-top';
    var brand = header.querySelector('a');
    if (brand) {
      var b = brand.cloneNode(true);
      b.removeAttribute('style');
      top.appendChild(b);
    }
    var close = document.createElement('button');
    close.type = 'button';
    close.className = 'm-close';
    close.setAttribute('aria-label', T.close);
    close.innerHTML = '&times;';
    top.appendChild(close);

    var list = document.createElement('nav');
    list.className = 'm-sheet-nav';
    Array.prototype.forEach.call(nav.children, function (el) {
      var c = el.cloneNode(true);
      if (c.tagName === 'A') {
        if ((el.getAttribute('style') || '').indexOf('background: #1b1b1f') > -1) c.className = 'm-cta';
        c.removeAttribute('style');
      }
      list.appendChild(c);
    });

    sheet.appendChild(top);
    sheet.appendChild(list);
    document.body.appendChild(sheet);

    var setOpen = function (open) {
      sheet.setAttribute('data-open', open ? 'true' : 'false');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.classList.toggle('m-lock', open);
      if (open) { var f = list.querySelector('a'); if (f) f.focus(); }
      else { btn.focus(); }
    };
    btn.addEventListener('click', function () { setOpen(true); });
    close.addEventListener('click', function () { setOpen(false); });
    list.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && sheet.getAttribute('data-open') === 'true') setOpen(false);
    });
  }

  /* ---------- rails: position dots ---------- */
  var mq = window.matchMedia('(max-width: 720px)');
  Array.prototype.forEach.call(document.querySelectorAll('.m-rail'), function (rail) {
    var items = rail.children.length;
    if (items < 2) return;
    var dots = document.createElement('div');
    dots.className = 'm-dots';
    dots.setAttribute('aria-hidden', 'true');
    for (var i = 0; i < items; i++) dots.appendChild(document.createElement('i'));
    rail.parentNode.insertBefore(dots, rail.nextSibling);
    var update = function () {
      if (!mq.matches) return;
      var first = rail.children[0];
      var step = first ? first.getBoundingClientRect().width + 14 : 1;
      var idx = Math.round(rail.scrollLeft / step);
      if (rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 4) idx = items - 1;
      Array.prototype.forEach.call(dots.children, function (d, k) { d.className = k === idx ? 'on' : ''; });
    };
    rail.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  });
})();
