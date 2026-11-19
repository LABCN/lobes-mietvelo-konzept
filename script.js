// Demo-Vorschau: alles läuft nur im Browser. Es wird nichts gesendet und nichts gebucht.
(function () {
  'use strict';

  var INSURANCE = 2.9;
  var HOUR_RATE = 12;
  var DAY_RATE = 55;
  var DEPOSIT_HOUR = 200;
  var MAX_HOURS = 8;
  var LS_KEY = 'lobesDemoLoggedIn';
  var MONTHS = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
  var WEEKDAYS = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

  var toastEl = document.getElementById('toast');
  var modalEl = document.getElementById('demo-modal');
  var modalTitle = document.getElementById('demo-modal-title');
  var modalText = document.getElementById('demo-modal-text');
  var toastTimer;

  function qs(sel, root) { return (root || document).querySelector(sel); }
  function qsa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function chf(n) {
    return 'CHF ' + Number(n).toLocaleString('de-CH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function pad(n) { return n < 10 ? '0' + n : String(n); }

  function isoDate(d) {
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }

  function parseISO(s) {
    var p = s.split('-');
    return new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
  }

  function startOfDay(d) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  function formatDateCH(d) {
    return pad(d.getDate()) + '.' + pad(d.getMonth() + 1) + '.' + d.getFullYear();
  }

  function formatDateLong(d) {
    return WEEKDAYS[d.getDay()] + ' ' + formatDateCH(d);
  }

  function today() {
    return startOfDay(new Date());
  }

  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg || 'Demo – keine echte Buchung. Es wird nichts gesendet.';
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 2800);
  }

  function openModal(title, text) {
    if (!modalEl) { toast(title); return; }
    modalTitle.textContent = title || 'Demo – keine echte Buchung';
    modalText.textContent = text || 'In dieser Vorschau wird nichts reserviert, nichts berechnet und nichts gesendet.';
    modalEl.hidden = false;
    document.body.classList.add('modal-open');
    var closeBtn = document.getElementById('demo-modal-close');
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    if (!modalEl) return;
    modalEl.hidden = true;
    document.body.classList.remove('modal-open');
  }

  /* ---------- Banner height for scroll padding ---------- */
  function setChromePad() {
    var chrome = qs('.chrome');
    if (!chrome) return;
    document.documentElement.style.scrollPaddingTop = (chrome.offsetHeight + 12) + 'px';
  }

  /* ---------- Mobile nav & smooth anchors ---------- */
  function initNav() {
    var toggle = qs('.menu-toggle');
    var nav = qs('.main-nav');
    if (toggle && nav) {
      toggle.classList.remove('noop');
      toggle.addEventListener('click', function () {
        var open = !nav.classList.contains('is-open');
        nav.classList.toggle('is-open', open);
        toggle.classList.toggle('is-open', open);
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        document.body.classList.toggle('nav-open', open);
      });
      qsa('a', nav).forEach(function (a) {
        a.addEventListener('click', function () {
          nav.classList.remove('is-open');
          toggle.classList.remove('is-open');
          toggle.setAttribute('aria-expanded', 'false');
          document.body.classList.remove('nav-open');
        });
      });
    }

    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a) return;
      var href = a.getAttribute('href');
      if (!href || href === '#') return;
      var target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (history.replaceState) history.replaceState(null, '', href);
    });
  }

  /* ---------- Demo CTAs that stay non-functional ---------- */
  function initDemoCtas() {
    document.addEventListener('click', function (e) {
      var el = e.target.closest('.noop, .demo-cta');
      if (!el) return;
      if (el.closest('#abo-wizard, #kurz-miete, #konto, #mietvelos, .rv-filters, .size-finder, .flow-wizard')) return;
      e.preventDefault();
      var label = (el.getAttribute('aria-label') || el.textContent || '').replace(/\s+/g, ' ').trim();
      if (/Warenkorb/i.test(label)) {
        toast('Demo – der Warenkorb ist nicht aktiv. Es wird nichts reserviert.');
      } else if (/Impressum|Datenschutz|AGB|Abo-Bedingungen/i.test(label)) {
        toast('Demo – diese Seite folgt später.');
      } else if (/Nachricht senden/i.test(label)) {
        toast('Demo – das Formular verschickt nichts.');
      } else {
        toast('Demo – keine echte Buchung. Es wird nichts gesendet.');
      }
    });

    qsa('form').forEach(function (f) {
      f.addEventListener('submit', function (e) {
        if (f.id === 'login-form' || f.id === 'size-finder-form' || f.classList.contains('js-live')) return;
        e.preventDefault();
        toast('Demo – das Formular verschickt nichts.');
      });
    });
  }

  /* ---------- Size advisor ---------- */
  var SIZE_GUIDE = [
    { name: 'Laufrad', minAge: 2, maxAge: 4, minIn: 30, maxIn: 40, price: 8.9, open: true, img: 'assets/kids/laufrad-woom-go1.svg', model: 'z. B. woom GO 1' },
    { name: '14 Zoll', minAge: 3, maxAge: 5, minIn: 38, maxIn: 48, price: 3.13, img: 'assets/kids/14-woom-go2.svg', model: 'z. B. woom GO 2' },
    { name: '16 Zoll', minAge: 4, maxAge: 6, minIn: 44, maxIn: 54, price: 4.17, img: 'assets/kids/16-woom-go3.svg', model: 'z. B. woom GO 3' },
    { name: '20 Zoll', minAge: 6, maxAge: 8, minIn: 52, maxIn: 62, price: 5.21, img: 'assets/kids/20-scott-roxter-200.svg', model: 'z. B. SCOTT Roxter 200' },
    { name: '24 Zoll', minAge: 8, maxAge: 11, minIn: 60, maxIn: 72, price: 7.29, img: 'assets/kids/24-scott-roxter-400.svg', model: 'z. B. SCOTT Roxter 400' },
    { name: '26 Zoll', minAge: 10, maxAge: 13, minIn: 68, maxIn: 80, price: 8.33, img: 'assets/kids/26-woom-explore-6.svg', model: 'z. B. woom EXPLORE 6' }
  ];

  function suggestSize(age, inseam) {
    var best = null, bestScore = -1;
    SIZE_GUIDE.forEach(function (s) {
      var score = 0;
      if (inseam) {
        if (inseam >= s.minIn && inseam <= s.maxIn) score += 3;
        else if (inseam >= s.minIn - 4 && inseam <= s.maxIn + 4) score += 1;
      }
      if (age) {
        if (age >= s.minAge && age <= s.maxAge) score += 2;
        else if (age >= s.minAge - 1 && age <= s.maxAge + 1) score += 1;
      }
      if (score > bestScore) { bestScore = score; best = s; }
    });
    return bestScore > 0 ? best : SIZE_GUIDE[2];
  }

  function initSizeFinder() {
    var form = qs('.size-finder');
    if (!form) return;
    form.id = 'size-finder-form';
    var sel = qs('select', form);
    var input = qs('input', form);
    var btn = qs('button', form);
    if (sel) {
      sel.disabled = false;
      sel.innerHTML = '';
      for (var a = 2; a <= 13; a++) {
        var opt = document.createElement('option');
        opt.value = String(a);
        opt.textContent = a + ' Jahre';
        if (a === 5) opt.selected = true;
        sel.appendChild(opt);
      }
    }
    if (input) {
      input.removeAttribute('readonly');
      input.removeAttribute('disabled');
    }
    if (btn) btn.classList.remove('noop');
    var result = document.createElement('p');
    result.className = 'sf-result';
    result.id = 'sf-result';
    result.setAttribute('role', 'status');
    form.appendChild(result);

    function run(e) {
      if (e) e.preventDefault();
      var age = sel ? Number(sel.value) : 5;
      var raw = input ? input.value.replace(/[^\d.,]/g, '').replace(',', '.') : '';
      var inseam = raw ? Number(raw) : 0;
      var suggestion = suggestSize(age, inseam);
      result.innerHTML = 'Passende Grösse: <b>' + suggestion.name + '</b> · ' + suggestion.model + ' · ' + chf(suggestion.price) + ' / Monat. Am besten probierst du es im Showroom.';
      qsa('.size-card').forEach(function (card) {
        var h = qs('h3', card);
        card.classList.toggle('is-suggested', !!(h && h.textContent.trim() === suggestion.name));
      });
      var match = qsa('.size-card').filter(function (card) {
        var h = qs('h3', card);
        return h && h.textContent.trim() === suggestion.name;
      })[0];
      if (match) match.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    form.addEventListener('submit', run);
    if (btn) btn.addEventListener('click', run);
  }

  /* ---------- Catalogue ---------- */
  function parsePrice(text) {
    var m = String(text || '').replace(/\s+/g, ' ').match(/CHF\s+([0-9]+(?:[.,][0-9]+)?)/i);
    return m ? parseFloat(m[1].replace(',', '.')) : 0;
  }

  function bikeFromCard(card) {
    var brand = (qs('.rv-brand', card) || {}).textContent || '';
    var model = (qs('h4', card) || {}).textContent || '';
    var metas = qsa('.rv-meta li', card).map(function (li) { return li.textContent.trim(); });
    var img = qs('.rv-img img', card);
    return {
      id: (card.getAttribute('data-id') || (brand + ' ' + model + ' ' + (metas[0] || ''))).trim(),
      brand: brand.trim(),
      model: model.trim(),
      name: (brand + ' ' + model).trim(),
      size: metas[0] || '',
      group: card.getAttribute('data-group') || '',
      power: card.getAttribute('data-power') || '',
      cat: card.getAttribute('data-cat') || (metas[1] || ''),
      price: parsePrice((qs('.rv-price', card) || {}).textContent),
      priceOpen: !!qs('.rv-check.open', card),
      img: img ? img.getAttribute('src') : '',
      alt: img ? img.getAttribute('alt') : '',
      stock: (qs('.rv-stock', card) || {}).textContent || ''
    };
  }

  var LAUFRAD = {
    id: 'laufrad-woom-go1',
    brand: 'woom',
    model: 'GO 1',
    name: 'woom GO 1',
    size: 'Laufrad',
    group: 'Kinder',
    power: 'Velo',
    cat: 'Child Bike',
    price: 8.9,
    priceOpen: true,
    img: 'assets/kids/laufrad-woom-go1.svg',
    alt: 'Laufrad woom GO 1'
  };

  var catalogue = [];

  function initCatalogue() {
    catalogue = qsa('.rv-card').map(function (card, i) {
      var bike = bikeFromCard(card);
      if (!bike.id) bike.id = 'bike-' + i;
      card.setAttribute('data-id', bike.id);
      var btn = qs('button', card);
      if (btn) btn.classList.remove('noop');
      card.addEventListener('click', function (e) {
        e.preventDefault();
        startAbo(bike);
      });
      return bike;
    });

    var empty = document.createElement('p');
    empty.className = 'rv-empty';
    empty.id = 'rv-empty';
    empty.textContent = 'Keine Velos für diese Auswahl. Versuche einen anderen Filter.';
    var filters = qs('.rv-filters');
    if (filters && filters.parentNode) {
      filters.parentNode.insertBefore(empty, filters.nextSibling);
    }

    qsa('.rv-frow').forEach(function (row) {
      var label = (qs('.rv-flabel', row) || {}).textContent || '';
      var key = /Für/i.test(label) ? 'group' : /Antrieb/i.test(label) ? 'power' : /Kategorie/i.test(label) ? 'cat' : '';
      if (key) row.setAttribute('data-filter', key);
      qsa('.chip-btn', row).forEach(function (btn) {
        btn.classList.remove('noop');
        var val = btn.textContent.trim();
        btn.setAttribute('data-value', val === 'Alle' ? '' : val);
        btn.addEventListener('click', function () {
          qsa('.chip-btn', row).forEach(function (b) {
            b.classList.remove('active');
            b.setAttribute('aria-selected', 'false');
          });
          btn.classList.add('active');
          btn.setAttribute('aria-selected', 'true');
          applyFilters();
        });
      });
    });
    applyFilters();
  }

  function applyFilters() {
    var selected = { group: '', power: '', cat: '' };
    qsa('.rv-frow[data-filter]').forEach(function (row) {
      var key = row.getAttribute('data-filter');
      var active = qs('.chip-btn.active', row);
      selected[key] = active ? (active.getAttribute('data-value') || '') : '';
    });
    var visible = 0;
    qsa('.rv-group').forEach(function (group) {
      var any = false;
      qsa('.rv-card', group).forEach(function (card) {
        var ok = true;
        if (selected.group && card.getAttribute('data-group') !== selected.group) ok = false;
        if (selected.power && card.getAttribute('data-power') !== selected.power) ok = false;
        if (selected.cat && card.getAttribute('data-cat') !== selected.cat) ok = false;
        card.classList.toggle('is-hidden', !ok);
        if (ok) { any = true; visible += 1; }
      });
      group.classList.toggle('is-hidden', !any);
    });
    var empty = document.getElementById('rv-empty');
    if (empty) empty.classList.toggle('is-visible', visible === 0);
  }

  /* ---------- Abo wizard ---------- */
  var aboState = {
    bike: null,
    start: isoDate(today()),
    insurance: false,
    step: 1
  };

  function defaultKidsBike(sizeName) {
    if (sizeName === 'Laufrad') return LAUFRAD;
    var hit = catalogue.filter(function (b) {
      return b.group === 'Kinder' && b.size === sizeName;
    })[0];
    return hit || null;
  }

  function findBikeById(id) {
    if (id === LAUFRAD.id) return LAUFRAD;
    for (var i = 0; i < catalogue.length; i++) if (catalogue[i].id === id) return catalogue[i];
    return null;
  }

  function populateBikeSelect() {
    var sel = document.getElementById('abo-bike-select');
    if (!sel) return;
    sel.innerHTML = '';
    var groups = ['Kinder', 'Jugend', 'Erwachsene'];
    var opt0 = document.createElement('option');
    opt0.value = LAUFRAD.id;
    opt0.textContent = 'woom GO 1 · Laufrad · ' + chf(LAUFRAD.price) + ' / Monat';
    var gKinder = document.createElement('optgroup');
    gKinder.label = 'Kinder';
    gKinder.appendChild(opt0);
    sel.appendChild(gKinder);
    groups.forEach(function (g) {
      var og = g === 'Kinder' ? gKinder : document.createElement('optgroup');
      if (g !== 'Kinder') { og.label = g; sel.appendChild(og); }
      catalogue.filter(function (b) { return b.group === g; }).forEach(function (b) {
        var o = document.createElement('option');
        o.value = b.id;
        o.textContent = b.name + ' · ' + b.size + ' · ' + chf(b.price) + ' / Monat';
        og.appendChild(o);
      });
    });
  }

  function aboMonthly() {
    if (!aboState.bike) return 0;
    return aboState.bike.price + (aboState.insurance ? INSURANCE : 0);
  }

  function isKidsBike(bike) {
    return bike && (bike.group === 'Kinder' || bike.size === 'Laufrad');
  }

  function updateAboUI() {
    var bike = aboState.bike;
    if (!bike) return;
    var img = document.getElementById('abo-pick-img');
    var name = document.getElementById('abo-pick-name');
    var meta = document.getElementById('abo-pick-meta');
    if (img) { img.src = bike.img; img.alt = bike.alt || bike.name; }
    if (name) name.textContent = bike.name + (bike.size ? ' · ' + bike.size : '');
    if (meta) {
      meta.innerHTML = chf(bike.price) + ' / Monat' + (bike.priceOpen ? ' <span class="rv-check open">Preis offen</span>' : '') +
        (bike.group ? ' · ' + bike.group : '');
    }
    var sel = document.getElementById('abo-bike-select');
    if (sel && sel.value !== bike.id) sel.value = bike.id;
    qsa('#abo-size-chips .chip-btn').forEach(function (btn) {
      var val = btn.getAttribute('data-size');
      btn.classList.toggle('active', bike.size === val);
    });

    var startInput = document.getElementById('abo-start');
    if (startInput) startInput.value = aboState.start;

    var ins = document.getElementById('abo-insurance');
    if (ins) ins.checked = !!aboState.insurance;

    var live = document.getElementById('abo-ins-live');
    if (live) {
      live.textContent = aboState.insurance
        ? 'Monatspreis inkl. Versicherung: ' + chf(aboMonthly())
        : 'Monatspreis ohne Versicherung: ' + chf(aboMonthly());
    }

    var sumVelo = document.getElementById('abo-sum-velo');
    var sumStart = document.getElementById('abo-sum-start');
    var sumRent = document.getElementById('abo-sum-rent');
    var sumIns = document.getElementById('abo-sum-ins');
    var sumTerm = document.getElementById('abo-sum-term');
    var sumDep = document.getElementById('abo-sum-dep');
    var total = document.getElementById('abo-total');
    var startDate = parseISO(aboState.start);
    if (sumVelo) sumVelo.textContent = bike.name + ' · ' + bike.size;
    if (sumStart) sumStart.textContent = formatDateCH(startDate);
    if (sumRent) sumRent.textContent = chf(bike.price);
    if (sumIns) sumIns.textContent = aboState.insurance ? ('+ ' + chf(INSURANCE)) : 'ohne';
    if (sumTerm) {
      sumTerm.innerHTML = isKidsBike(bike)
        ? '12 Monate'
        : 'noch offen <span class="bsp">offen</span>';
    }
    if (sumDep) {
      sumDep.innerHTML = isKidsBike(bike)
        ? 'CHF 80.00 <span class="bsp">Beispiel</span>'
        : 'noch offen <span class="bsp">offen</span>';
    }
    if (total) {
      total.textContent = chf(aboMonthly()) + ' / Monat' + (aboState.insurance ? ' inkl. Versicherung' : '');
    }

    qsa('.flow-progress li').forEach(function (li) {
      var s = Number(li.getAttribute('data-goto'));
      li.classList.toggle('is-active', s === aboState.step);
      li.classList.toggle('is-done', s < aboState.step);
    });
    qsa('.flow-pane').forEach(function (pane) {
      var s = Number(pane.getAttribute('data-step'));
      pane.hidden = s !== aboState.step;
    });
  }

  function setAboStep(step) {
    aboState.step = step;
    updateAboUI();
  }

  function startAbo(bike) {
    aboState.bike = bike;
    if (!aboState.start) aboState.start = isoDate(today());
    setAboStep(1);
    var section = document.getElementById('abo-ablauf');
    if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function initAbo() {
    var startInput = document.getElementById('abo-start');
    if (startInput) {
      startInput.min = isoDate(today());
      if (!startInput.value) startInput.value = isoDate(today());
      aboState.start = startInput.value;
      startInput.addEventListener('change', function () {
        var v = startInput.value;
        if (!v || parseISO(v) < today()) {
          startInput.value = isoDate(today());
        }
        aboState.start = startInput.value;
        updateAboUI();
      });
    }

    populateBikeSelect();
    aboState.bike = defaultKidsBike('16 Zoll') || catalogue[1] || LAUFRAD;
    var sel = document.getElementById('abo-bike-select');
    if (sel) {
      sel.addEventListener('change', function () {
        var bike = findBikeById(sel.value);
        if (bike) { aboState.bike = bike; updateAboUI(); }
      });
    }
    qsa('#abo-size-chips .chip-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var bike = defaultKidsBike(btn.getAttribute('data-size'));
        if (bike) { aboState.bike = bike; updateAboUI(); }
      });
    });
    var ins = document.getElementById('abo-insurance');
    if (ins) {
      ins.addEventListener('change', function () {
        aboState.insurance = !!ins.checked;
        updateAboUI();
      });
    }
    qsa('.flow-progress li').forEach(function (li) {
      function go() {
        var step = Number(li.getAttribute('data-goto'));
        if (step <= aboState.step || step === aboState.step + 1) setAboStep(step);
      }
      li.addEventListener('click', go);
      li.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); }
      });
    });
    qsa('[data-abo-next]').forEach(function (btn) {
      btn.addEventListener('click', function () { setAboStep(Math.min(4, aboState.step + 1)); });
    });
    qsa('[data-abo-back]').forEach(function (btn) {
      btn.addEventListener('click', function () { setAboStep(Math.max(1, aboState.step - 1)); });
    });
    var confirm = document.getElementById('abo-confirm');
    if (confirm) {
      confirm.addEventListener('click', function () {
        openModal(
          'Demo – keine echte Buchung',
          'Dein Abo für ' + aboState.bike.name + ' wäre ' + chf(aboMonthly()) + ' pro Monat. In dieser Vorschau wird nichts abgeschlossen und nichts gesendet.'
        );
      });
    }

    // Size cards / price table / hero shortcuts
    qsa('.size-card').forEach(function (card) {
      var link = qs('.link-arrow, .noop, a', card);
      var h = qs('h3', card);
      var sizeName = h ? h.textContent.trim() : '';
      function go(e) {
        if (e) e.preventDefault();
        var bike = defaultKidsBike(sizeName);
        if (bike) startAbo(bike);
      }
      if (link) {
        link.classList.remove('noop');
        link.addEventListener('click', go);
      }
    });
    qsa('#preise .pt-row').forEach(function (row) {
      var btn = qs('button', row);
      var nameEl = qs('b', row);
      if (!btn || !nameEl) return;
      btn.classList.remove('noop');
      btn.addEventListener('click', function () {
        var bike = defaultKidsBike(nameEl.textContent.trim());
        if (bike) startAbo(bike);
      });
    });
    var preiseStart = qs('#preise .price-side .btn');
    var preiseIns = qs('#preise .toggle input');
    if (preiseIns) preiseIns.disabled = false;
    if (preiseStart) {
      preiseStart.classList.remove('noop');
      preiseStart.addEventListener('click', function () {
        if (!aboState.bike) aboState.bike = defaultKidsBike('16 Zoll');
        aboState.insurance = !!(preiseIns && preiseIns.checked);
        setAboStep(1);
        var section = document.getElementById('abo-ablauf');
        if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
    updateAboUI();
  }

  /* ---------- Stunden- & Tagesmiete ---------- */
  var BUSY = { '2026-11-21': 1, '2026-11-27': 1, '2026-12-05': 1, '2026-12-12': 1, '2026-12-18': 1, '2027-01-08': 1, '2027-01-16': 1 };
  var HOURS = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
  var rentState = {
    mode: 'hours',
    year: 2026,
    month: 10, // 0-based, November
    start: '2026-11-28',
    end: '2026-11-28',
    pickHour: 10,
    retHour: 16
  };

  function dayState(date) {
    var t = today();
    var d0 = startOfDay(date);
    if (d0 < t) return 'past';
    if (date.getDay() === 0) return 'closed';
    if (BUSY[isoDate(date)]) return 'busy';
    return 'free';
  }

  function hourLabel(h) { return pad(h) + ':00'; }

  function rentHours() {
    return Math.max(0, rentState.retHour - rentState.pickHour);
  }

  function rentDays() {
    if (!rentState.start || !rentState.end) return 0;
    var a = parseISO(rentState.start);
    var b = parseISO(rentState.end);
    return Math.round((b - a) / 86400000) + 1;
  }


  function spanBlocked(startISO, endISO) {
    var a = parseISO(startISO), b = parseISO(endISO);
    if (b < a) { var t = a; a = b; b = t; }
    for (var d = new Date(a.getTime()); d <= b; d.setDate(d.getDate() + 1)) {
      var st = dayState(d);
      if (st === 'busy' || st === 'closed' || st === 'past') return true;
    }
    return false;
  }

  function renderCalendar() {
    var grid = document.getElementById('cal-grid');
    var label = document.getElementById('cal-month');
    if (!grid) return;
    if (label) label.textContent = MONTHS[rentState.month] + ' ' + rentState.year;
    var first = new Date(rentState.year, rentState.month, 1);
    var startWeekday = (first.getDay() + 6) % 7; // Monday=0
    var lastDate = new Date(rentState.year, rentState.month + 1, 0).getDate();
    var html = '<span class="cal-h">Mo</span><span class="cal-h">Di</span><span class="cal-h">Mi</span><span class="cal-h">Do</span><span class="cal-h">Fr</span><span class="cal-h">Sa</span><span class="cal-h">So</span>';
    for (var i = 0; i < startWeekday; i++) html += '<span class="cal-e"></span>';
    var tIso = isoDate(today());
    for (var day = 1; day <= lastDate; day++) {
      var date = new Date(rentState.year, rentState.month, day);
      var iso = isoDate(date);
      var st = dayState(date);
      var cls = 'cal-d';
      if (iso === tIso) cls += ' today';
      var inSel = false;
      if (rentState.start && rentState.end) {
        if (iso >= rentState.start && iso <= rentState.end) inSel = true;
      } else if (rentState.start && iso === rentState.start) inSel = true;
      if (inSel && (iso === rentState.start || iso === rentState.end)) cls += ' sel';
      else if (inSel) cls += ' in-range';
      var disabled = st !== 'free' ? ' disabled' : '';
      html += '<button type="button" class="' + cls + '" data-state="' + st + '" data-date="' + iso + '"' + disabled + '>' + day + '</button>';
    }
    grid.innerHTML = html;
  }

  function renderSlots() {
    var wrap = document.getElementById('vr-times');
    if (!wrap) return;
    if (rentState.mode === 'days') {
      wrap.hidden = true;
      return;
    }
    wrap.hidden = false;
    if (!rentState.start) {
      wrap.innerHTML = '<p class="vr-label">Bitte zuerst einen Tag wählen.</p>';
      return;
    }
    var d = parseISO(rentState.start);
    var dateLabel = formatDateLong(d);
    function slotsHtml(which, selected, minH, maxH) {
      return HOURS.map(function (h) {
        if (which === 'pick' && h >= 18) return '';
        if (which === 'ret' && h <= 9) return '';
        var off = false;
        if (h < minH || h > maxH) off = true;
        if (which === 'pick' && (h + 1) > 18) off = true;
        var cls = 'slot' + (h === selected && !off ? ' active' : '') + (off ? ' off' : '');
        return '<button type="button" class="' + cls + '" data-which="' + which + '" data-hour="' + h + '"' + (off ? ' disabled' : '') + '>' + hourLabel(h) + '</button>';
      }).join('');
    }
    var pickMax = 17;
    var retMin = rentState.pickHour + 1;
    var retMax = Math.min(18, rentState.pickHour + MAX_HOURS);
    wrap.innerHTML =
      '<div><span class="vr-label">Abholung · ' + dateLabel + '</span><div class="slots">' + slotsHtml('pick', rentState.pickHour, 9, pickMax) + '</div></div>' +
      '<div><span class="vr-label">Rückgabe · ' + dateLabel + '</span><div class="slots">' + slotsHtml('ret', rentState.retHour, retMin, retMax) + '</div></div>';
  }

  function updateRentPrice() {
    var line = document.getElementById('vr-line');
    var total = document.getElementById('vr-total');
    var status = qs('.vr-status');
    var confirm = document.getElementById('vr-confirm');
    var ok = false, text = '', amount = 0;
    if (rentState.mode === 'hours') {
      var hrs = rentHours();
      if (!rentState.start) {
        text = 'Bitte einen Tag und die Zeiten wählen';
      } else if (hrs < 1) {
        text = 'Bitte Rückgabe nach der Abholung wählen';
      } else if (hrs > MAX_HOURS) {
        text = 'Stundenweise bis max. 8 Stunden';
      } else {
        ok = true;
        amount = hrs * HOUR_RATE;
        text = hrs + ' Stunde' + (hrs === 1 ? '' : 'n') + ' × ' + chf(HOUR_RATE);
      }
    } else {
      var days = rentDays();
      if (!rentState.start || !rentState.end) {
        text = 'Bitte Start- und Endtag wählen';
      } else if (spanBlocked(rentState.start, rentState.end)) {
        text = 'In diesem Zeitraum ist mindestens ein Tag belegt oder geschlossen';
      } else {
        ok = true;
        amount = days * DAY_RATE;
        text = days + ' Tag' + (days === 1 ? '' : 'e') + ' × ' + chf(DAY_RATE);
      }
    }
    if (line) line.textContent = text;
    if (total) total.textContent = ok ? chf(amount) : '—';
    if (status) {
      status.innerHTML = ok
        ? '<span class="ok-dot"></span>Verfügbar'
        : '<span class="ok-dot" style="background:var(--terra)"></span>Bitte Auswahl ergänzen';
      status.style.color = ok ? '' : 'var(--terra-2)';
    }
    if (confirm) confirm.disabled = !ok;
    rentState.ok = ok;
    rentState.amount = amount;
  }

  function refreshRent() {
    renderCalendar();
    renderSlots();
    updateRentPrice();
  }

  function initRent() {
    var root = document.getElementById('kurz-miete') || qs('.velo-rental');
    if (!root) return;
    root.id = 'kurz-miete';

    // If today is already past the default demo date, pick the next free day
    var def = parseISO('2026-11-28');
    if (dayState(def) !== 'free') {
      var d = today();
      for (var i = 0; i < 60; i++) {
        if (dayState(d) === 'free') {
          rentState.start = rentState.end = isoDate(d);
          rentState.year = d.getFullYear();
          rentState.month = d.getMonth();
          break;
        }
        d.setDate(d.getDate() + 1);
      }
    } else {
      rentState.year = 2026;
      rentState.month = 10;
    }

    qsa('.vr-mode button', root).forEach(function (btn) {
      btn.classList.remove('noop');
      btn.addEventListener('click', function () {
        qsa('.vr-mode button', root).forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        rentState.mode = /Tage/i.test(btn.textContent) ? 'days' : 'hours';
        if (rentState.mode === 'hours') rentState.end = rentState.start;
        refreshRent();
      });
    });

    var prev = qs('.vr-nav[aria-label="Vorheriger Monat"]', root) || document.getElementById('cal-prev');
    var next = qs('.vr-nav[aria-label="Nächster Monat"]', root) || document.getElementById('cal-next');
    if (prev) {
      prev.classList.remove('noop');
      prev.id = 'cal-prev';
      prev.addEventListener('click', function () {
        var min = today();
        var probe = new Date(rentState.year, rentState.month - 1, 1);
        if (probe.getFullYear() < min.getFullYear() || (probe.getFullYear() === min.getFullYear() && probe.getMonth() < min.getMonth())) return;
        rentState.month -= 1;
        if (rentState.month < 0) { rentState.month = 11; rentState.year -= 1; }
        refreshRent();
      });
    }
    if (next) {
      next.classList.remove('noop');
      next.id = 'cal-next';
      next.addEventListener('click', function () {
        var max = new Date(today().getFullYear(), today().getMonth() + 3, 1);
        var probe = new Date(rentState.year, rentState.month + 1, 1);
        if (probe > max) return;
        rentState.month += 1;
        if (rentState.month > 11) { rentState.month = 0; rentState.year += 1; }
        refreshRent();
      });
    }

    var monthEl = qs('.velo-rental__nav strong', root);
    if (monthEl) monthEl.id = 'cal-month';
    var grid = qs('.velo-rental__calendar', root);
    if (grid) grid.id = 'cal-grid';
    var times = qs('.vr-times', root);
    if (times) times.id = 'vr-times';
    var rows = qsa('.vr-row', root);
    if (rows[0]) {
      var span = qs('span', rows[0]);
      var b = qs('b', rows[0]);
      if (span) span.id = 'vr-line';
      if (b) b.id = 'vr-total';
    }
    var confirm = qs('.velo-rental .btn-block, .velo-rental .btn-primary');
    if (confirm) {
      confirm.id = 'vr-confirm';
      confirm.classList.remove('noop');
      confirm.addEventListener('click', function () {
        if (!rentState.ok) return;
        var when = rentState.mode === 'hours'
          ? formatDateCH(parseISO(rentState.start)) + ', ' + hourLabel(rentState.pickHour) + '–' + hourLabel(rentState.retHour)
          : formatDateCH(parseISO(rentState.start)) + '–' + formatDateCH(parseISO(rentState.end));
        openModal(
          'Demo – keine echte Buchung',
          'Die Kurzmiete für das BU02 Mid-Step (' + when + ', ' + chf(rentState.amount) + ') wird in dieser Vorschau nicht reserviert und nicht gesendet.'
        );
      });
    }

    root.addEventListener('click', function (e) {
      var dayBtn = e.target.closest('.cal-d');
      if (dayBtn && !dayBtn.disabled) {
        var iso = dayBtn.getAttribute('data-date');
        if (rentState.mode === 'hours') {
          rentState.start = rentState.end = iso;
          rentState._picking = false;
        } else if (!rentState._picking) {
          rentState.start = rentState.end = iso;
          rentState._picking = true;
        } else {
          var a = iso < rentState.start ? iso : rentState.start;
          var b = iso < rentState.start ? rentState.start : iso;
          if (spanBlocked(a, b)) {
            toast('Dieser Zeitraum enthält belegte oder geschlossene Tage.');
            return;
          }
          rentState.start = a;
          rentState.end = b;
          rentState._picking = false;
        }
        refreshRent();
        return;
      }
      var slot = e.target.closest('.slot');
      if (slot && !slot.disabled) {
        var which = slot.getAttribute('data-which');
        var hour = Number(slot.getAttribute('data-hour'));
        if (which === 'pick') {
          rentState.pickHour = hour;
          if (rentState.retHour <= hour || rentState.retHour > hour + MAX_HOURS) {
            rentState.retHour = Math.min(18, hour + Math.max(1, Math.min(MAX_HOURS, 6)));
            if (rentState.retHour <= hour) rentState.retHour = hour + 1;
          }
        } else {
          rentState.retHour = hour;
        }
        refreshRent();
      }
    });

    refreshRent();
  }

  /* ---------- Konto / Portal ---------- */
  function showPortal(email) {
    var login = document.getElementById('konto-login');
    var portal = document.getElementById('konto-portal');
    if (login) login.hidden = true;
    if (portal) portal.hidden = false;
    var who = document.getElementById('konto-who');
    if (who) who.textContent = email || 'Beispielkonto';
  }

  function showLogin() {
    var login = document.getElementById('konto-login');
    var portal = document.getElementById('konto-portal');
    if (login) login.hidden = false;
    if (portal) portal.hidden = true;
    try { localStorage.removeItem(LS_KEY); } catch (err) {}
  }

  function initKonto() {
    var form = document.getElementById('login-form');
    var notice = document.getElementById('konto-notice') || qs('#konto .notice');
    if (notice) {
      notice.id = 'konto-notice';
      notice.hidden = true;
    }

    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var email = (document.getElementById('login-email') || {}).value || '';
        var pass = (document.getElementById('login-pass') || {}).value || '';
        if (!String(email).trim() && !String(pass).trim()) {
          toast('Bitte gib irgendetwas ein – in der Demo reicht das.');
          return;
        }
        var name = String(email).trim() || 'Beispielkonto';
        try { localStorage.setItem(LS_KEY, JSON.stringify({ email: name })); } catch (err) {}
        showPortal(name);
        toast('Angemeldet (Demo). Es wurde nichts gesendet.');
      });
    }

    var logout = document.getElementById('konto-logout');
    if (logout) {
      logout.classList.remove('noop');
      logout.addEventListener('click', function () {
        showLogin();
        toast('Abgemeldet (Demo).');
      });
    }

    qsa('.portal-tabs button').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var tab = btn.getAttribute('data-tab');
        qsa('.portal-tabs button').forEach(function (b) {
          b.classList.toggle('active', b === btn);
          b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
        });
        qsa('#konto-portal .portal-col').forEach(function (col) {
          col.hidden = col.getAttribute('data-panel') !== tab;
        });
      });
    });

    var swap = document.getElementById('konto-swap') || qsa('#konto .abo-actions .btn-primary')[0];
    if (swap) {
      swap.id = 'konto-swap';
      swap.classList.remove('noop');
      swap.addEventListener('click', function () {
        if (notice) notice.hidden = false;
        openModal(
          'Demo – keine echte Anfrage',
          'Die Anfrage für eine grössere Grösse wird in dieser Vorschau nicht gesendet. Im echten Portal würden wir uns melden, sobald das nächste Velo bereitsteht.'
        );
      });
    }
    var pause = document.getElementById('konto-pause') || qsa('#konto .abo-actions .btn-outline')[0];
    if (pause) {
      pause.id = 'konto-pause';
      pause.classList.remove('noop');
      pause.addEventListener('click', function () {
        openModal('Demo – keine echte Änderung', 'Das Abo wird in dieser Vorschau nicht pausiert. Es wird nichts gesendet.');
      });
    }
    var cancel = document.getElementById('konto-cancel') || qsa('#konto .abo-actions .btn-ghost-danger')[0];
    if (cancel) {
      cancel.id = 'konto-cancel';
      cancel.classList.remove('noop');
      cancel.classList.add('is-demo');
      cancel.removeAttribute('aria-disabled');
      cancel.addEventListener('click', function () {
        openModal(
          'Demo – keine echte Kündigung',
          'Die Mindestlaufzeit ist noch nicht vorbei. In dieser Vorschau wird nichts gekündigt und nichts gesendet.'
        );
      });
    }

    try {
      var saved = localStorage.getItem(LS_KEY);
      if (saved) {
        var data = JSON.parse(saved);
        showPortal(data.email);
      }
    } catch (err) {}
  }

  /* ---------- Other small UI ---------- */
  function initExtras() {
    qsa('.swatches .sw').forEach(function (sw) {
      sw.classList.remove('noop');
      sw.addEventListener('click', function () {
        var group = sw.parentNode;
        qsa('.sw', group).forEach(function (s) { s.classList.remove('active'); });
        sw.classList.add('active');
      });
    });

    var heroFit = qs('.hero-ctas .btn-primary');
    var heroPrices = qs('.hero-ctas .btn-outline');
    if (heroFit) {
      heroFit.classList.remove('noop');
      heroFit.setAttribute('href', '#groessen');
    }
    if (heroPrices) {
      heroPrices.classList.remove('noop');
      heroPrices.setAttribute('href', '#preise');
    }
    var hdrAbo = qs('.header-actions .btn-primary');
    if (hdrAbo) {
      hdrAbo.classList.remove('noop');
      if (hdrAbo.tagName === 'BUTTON') {
        hdrAbo.addEventListener('click', function () {
          var t = document.getElementById('mietvelos');
          if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      }
    }

    if (modalEl) {
      modalEl.addEventListener('click', function (e) {
        if (e.target === modalEl || e.target.closest('[data-close-modal]')) closeModal();
      });
    }
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        closeModal();
        var nav = qs('.main-nav');
        var toggle = qs('.menu-toggle');
        if (nav) nav.classList.remove('is-open');
        if (toggle) {
          toggle.classList.remove('is-open');
          toggle.setAttribute('aria-expanded', 'false');
        }
        document.body.classList.remove('nav-open');
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    setChromePad();
    window.addEventListener('resize', setChromePad);
    initNav();
    initDemoCtas();
    initSizeFinder();
    initCatalogue();
    initAbo();
    initRent();
    initKonto();
    initExtras();
  });
})();
