<template >
    <div class="full-size" style="background-color: #fed06ed8 ;">
        <div class="e-albania" >

    <svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 100 100" id=orbit>
      <circle fill=none stroke="#fff" stroke-width="5" cx=50 cy=50 r="40"/>
      <!-- <circle fill=#f8c553 cx=50 cy=50 r="25"/> -->
      <text x="50%" y="50%" dominant-baseline="middle" width="32" text-anchor="middle" fill="#fff" style="font-size:180%">Aion</text>
      <text x="50%" y="68%" dominant-baseline="middle" width="32" text-anchor="middle" fill="#fff" style="font-size:40%">cognizata</text>
    </svg>
    <svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 100 100" id=electron>
      <circle fill=#ffffff cx=10 cy=90 r="7"/>
    </svg>
  </div>

  <!-- <h1 class="logo-title">System Monitoring Tools</h1> -->
    </div>
</template>
<script>
export default {
    
}
</script>
<style lang="scss" scoped>
.imgab2 {
  margin: auto;
  width: 130px;
  height: auto;
  margin-top: 0;
  margin-bottom: 0;
}
.full-size{
    height: 100vh;
    width: 100vw;
    left: 0;
    top: 0;
    overflow: hidden;
    position: fixed;
    z-index: 999999999;
}
    html,body {height: 100%;}body{display: flex;flex-direction:column;align-items: center;justify-content:center;width:100%;background:#000;}
svg{max-width:100%;}
html,body {height: 100%;}body{display: flex;flex-direction:column;align-items: center;justify-content:center;width:100%;background:#000;}
svg{max-width:100%;}
$electrons: 3;
$atom-size: 300px;
$logo_config: (
  name: logo_kinetics,
  duration: 2.5s,
  timing: linear,
  iteration: infinite,
  direction: normal,
  fill-mode: forwards
);

@function sh-setup($config) {
  @return zip(map-values($config)...);
}

@keyframes logo_kinetics {
  to {
    transform: rotate(360deg);
  }
}
.e-albania {
    position: fixed; /* or absolute */
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
    height: $atom-size;

    width: $atom-size;

    svg:not(#orbit) {
      animation: sh-setup($logo_config);
      position: absolute;
      top: -50%;
      left: 0;
      transform-origin: bottom center;
    }
}

  .logo-title {
    font-family: 'Helvetica Neue', Helvetica, sans-serif;
    font-weight: normal;
    color:#fff;
    font-size: 32px;
    margin-top: 4px;
    margin-bottom: 4px;
  }
</style>