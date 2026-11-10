// Launch loader: counts to 100 while fonts + hero photo load (max ~2.4s), then wipes away
// with a green blade and fires `site:ready` so the hero can animate in.
;(function () {
  var ld = document.getElementById('ld'), pct = document.getElementById('ld-pct'), bar = document.getElementById('ld-bar')
  if (!ld) return
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
  document.documentElement.classList.add('ld-on')
  var MIN = reduce ? 200 : 1000, MAX = 2400, t0 = performance.now(), loaded = false, gone = false
  function ready() { window.__siteReady = true; window.dispatchEvent(new Event('site:ready')) }
  function lift() {
    if (gone) return
    gone = true
    pct.textContent = '100%'
    bar.style.transform = 'none'
    document.documentElement.classList.remove('ld-on')
    if (reduce) { ld.classList.add('done'); ready(); return }
    ld.classList.add('lift')
    setTimeout(ready, 180)
    setTimeout(function () { ld.classList.add('done') }, 650)
  }
  function tick(now) {
    if (gone) return
    var e = now - t0, p = Math.min(1, e / MIN)
    if (!loaded) p = Math.min(p, 0.92)
    var eased = 1 - Math.pow(1 - p, 3)
    pct.textContent = Math.round(eased * 100) + '%'
    bar.style.transform = 'scaleX(' + eased + ')'
    if ((p >= 1 && loaded) || e > MAX) return lift()
    requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
  var img = new Image()
  img.src = '/images/hero-living-room.webp'
  Promise.all([
    document.fonts ? document.fonts.ready : Promise.resolve(),
    new Promise(function (r) { img.onload = img.onerror = r }),
  ]).then(function () { loaded = true })
  document.getElementById('ld-skip').onclick = lift
})()
