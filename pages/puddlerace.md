---
layout: ctrtest.html
mainClass: game-page
---

<style>
.trailer {
  position: relative;
  padding-bottom: 56.25%;
  padding-top: 0;
  height: 0;
  overflow: hidden;
  width: 100% !important;
  max-width: 100%;
}
.trailer iframe, .trailer object, .trailer embed {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.features {
  width: 288px;
  max-width: 100%;
  text-align: left;
}
.inverted {
  background-color: #292929;
  color: white;
}
.appstore {
  width: 180px;
  max-width: 100%;
}
</style>

# Puddle Race

<div class="trailer">
<iframe src="https://www.youtube.com/embed/9ZGpdtt_TII?wmode=opaque" frameborder="0" allowfullscreen></iframe>
</div>

<div>
Coming soon!
</div>

<script>
  const req = new XMLHttpRequest()
  req.open("GET", `https://flatbutton.co/uid?app=puddleracead&uid=${Math.floor(Math.random() * 10000000)}`)
  req.send()
</script>
