---
layout: index.html
---
<style>
</style>
<div class="main">
<div>boolitaire-installations:&nbsp;<span id="boolitaire-installation"></span></div>
<div>swipp!-installations:&nbsp;<span id="swipp!-installation"></span></div>
<div>triple-slice-installations:&nbsp;<span id="triple-slice-installation"></span></div>
<div>numsol-installations:&nbsp;<span id="numsol-installation"></span></div>
<div><input name="to-delete" type="text"><button id="delete-button" onclick="window.deleteUids()">delete</button>
</div>

<script>
  window.deleteUids = () => {
    const app = document.getElementById('to-delete').value
    console.log(`delete uids of app ${app}`)
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
