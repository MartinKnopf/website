---
layout: index.html
---
<div class="main">
  <span>Boolitaire installations:</span>&nbsp;<span id="boolitaire-installation" />
  <span>Swipp! installations:</span>&nbsp;<span id="swipp-installation" />
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
  request('swipp-installation')
</script>
