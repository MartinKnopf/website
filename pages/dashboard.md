---
layout: index.html
---
<div class="main">
<div>Boolitaire installations:&nbsp;<span id="boolitaire-installation"></span></div>
<div>Swipp! installations:&nbsp;<span id="swipp!-installation"></span></div>
<div>Triple Slice installations:&nbsp;<span id="triple-slice-installation"></span></div>
<div>2048 Stacks installations:&nbsp;<span id="2048-stacks-installation"></span></div>
</div>

<script>
  const request = (app) => {
    const req = new XMLHttpRequest()
    req.open("GET", `https://flatbutton.co/uids?app=${app}`)
    req.send()
    document.getElementById(app).innerText = '...'
    req.onreadystatechange = e => document.getElementById(app).innerText = req.responseText
  }
  const repeat = fn => {
    try { fn() } catch(ignore) { }
    setInterval(() => {
      try { fn() } catch(ignore) { }
    }, 30000)
  }
  repeat(() => request('boolitaire-installation'))
  repeat(() => request('swipp!-installation'))
  repeat(() => request('triple-slice-installation'))
  repeat(() => request('2048-stacks-installation'))
</script>
