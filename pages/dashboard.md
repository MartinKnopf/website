---
layout: index.html
---
<div class="main">
<div>Boolitaire installations:&nbsp;<span id="boolitaire-installation"></span></div>
<div>Swipp! installations:&nbsp;<span id="swipp!-installation"></span></div>
</div>

<script>
  const request = (app) => {
    const req = new XMLHttpRequest()
    req.open("GET", `https://flatbutton.co/uids?app=${app}`)
    req.send()
    req.onreadystatechange = (e) => {
      document.getElementById(app).innerText = req.responseText
    }
  }
  request('boolitaire-installation')
  request('swipp!-installation')
</script>
