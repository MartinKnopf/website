---
layout: index.html
---
<style>
.delete-link {
margin-right: 10px
}
</style>
<div class="main">
<div><span class="delete-link" onclick="window.deleteUids('boolitaire-installation')">x</span>Boolitaire installations:&nbsp;<span id="boolitaire-installation"></span></div>
<div><span class="delete-link" onclick="window.deleteUids('swipp!-installation')">x</span>Swipp! installations:&nbsp;<span id="swipp!-installation"></span></div>
<div><span class="delete-link" onclick="window.deleteUids('triple-installation')">x</span>Triple Slice installations:&nbsp;<span id="triple-slice-installation"></span></div>
<div><span class="delete-link" onclick="window.deleteUids('numsol-installation')">x</span>Numsol installations:&nbsp;<span id="numsol-installation"></span></div>
</div>

<script>
  window.deleteUids = (app) => {
    const req = new XMLHttpRequest()
    req.open("GET", `https://flatbutton.co/deleteuids?app=${app}`)
    req.send()
    req.onreadystatechange = e => request(app)
  }
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
  repeat(() => request('numsol-installation'))
</script>
