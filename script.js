// Designkonzept: alle Knöpfe, CTAs und Formulare sind bewusst ohne Funktion.
(function () {
  var toast = document.getElementById('toast'), t;
  function hint() {
    toast.classList.add('show');
    clearTimeout(t);
    t = setTimeout(function () { toast.classList.remove('show'); }, 2200);
  }
  document.addEventListener('click', function (e) {
    var el = e.target.closest('.noop, a[href="#"], button');
    if (!el) return;
    e.preventDefault();
    hint();
  });
  document.querySelectorAll('form').forEach(function (f) {
    f.addEventListener('submit', function (e) { e.preventDefault(); hint(); });
  });
})();
