(function () {
  var figs = document.querySelectorAll('.tr figure[data-gallery]');
  if (!figs.length) return;

  // build lightbox once
  var lb = document.createElement('div');
  lb.className = 'lb';
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-modal', 'true');
  lb.innerHTML =
    '<button class="lb-close" aria-label="Close">&#10005;</button>' +
    '<div class="lb-head"><span class="lb-title"></span><span class="lb-count"></span></div>' +
    '<div class="lb-stage">' +
      '<button class="lb-nav lb-prev" aria-label="Previous">&#8592;</button>' +
      '<img alt="">' +
      '<button class="lb-nav lb-next" aria-label="Next">&#8594;</button>' +
    '</div>' +
    '<div class="lb-thumbs"></div>';
  document.body.appendChild(lb);

  var img = lb.querySelector('.lb-stage img');
  var title = lb.querySelector('.lb-title');
  var count = lb.querySelector('.lb-count');
  var thumbs = lb.querySelector('.lb-thumbs');
  var list = [], idx = 0, label = '', lastFocus = null;

  function show(i) {
    idx = (i + list.length) % list.length;
    img.classList.add('out');
    setTimeout(function () {
      img.src = list[idx];
      img.alt = label + ' photo ' + (idx + 1);
      img.onload = function () { img.classList.remove('out'); };
    }, 180);
    count.textContent = (idx + 1) + ' / ' + list.length;
    Array.prototype.forEach.call(thumbs.children, function (t, n) {
      t.classList.toggle('on', n === idx);
    });
  }

  function open(fig) {
    list = fig.dataset.gallery.split('|').map(function (s) { return s.trim(); });
    label = fig.querySelector('figcaption').textContent;
    title.textContent = label;
    thumbs.innerHTML = '';
    list.forEach(function (src, n) {
      var b = document.createElement('button');
      b.style.backgroundImage = 'url(' + src + ')';
      b.setAttribute('aria-label', 'Show photo ' + (n + 1));
      b.onclick = function () { show(n); };
      thumbs.appendChild(b);
    });
    lastFocus = document.activeElement;
    lb.classList.add('open');
    requestAnimationFrame(function () { lb.classList.add('show'); });
    document.body.style.overflow = 'hidden';
    img.src = list[0]; idx = 0;
    show(0);
    lb.querySelector('.lb-close').focus();
  }

  function close() {
    lb.classList.remove('show');
    setTimeout(function () { lb.classList.remove('open'); }, 300);
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }

  figs.forEach(function (fig) {
    fig.dataset.count = fig.dataset.gallery.split('|').length;
    fig.tabIndex = 0;
    fig.setAttribute('role', 'button');
    fig.addEventListener('click', function () { open(fig); });
    fig.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(fig); }
    });
  });

  lb.querySelector('.lb-close').onclick = close;
  lb.querySelector('.lb-prev').onclick = function () { show(idx - 1); };
  lb.querySelector('.lb-next').onclick = function () { show(idx + 1); };
  lb.addEventListener('click', function (e) { if (e.target === lb) close(); });

  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(idx - 1);
    if (e.key === 'ArrowRight') show(idx + 1);
  });

  // swipe on mobile
  var x0 = null;
  lb.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1));
    x0 = null;
  });
})();