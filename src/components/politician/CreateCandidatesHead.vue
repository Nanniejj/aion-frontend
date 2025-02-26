<template>
  <div id="content">
    <div class="d-flex">
      <h1 class="title ">Politician</h1>
    </div>
  </div>
</template>

<script>

export default {
  name: "CreateCandidatesHead",

  data() {
    return {
      search1: "",
      items: {},
    };
  },
  methods: {
  }
};
</script>

<style scoped>
* {
  font-family: "Prompt", "FontAwesome", sans-serif;
}

#navHome {
  z-index: 1;
}
@media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: portrait) {
  #overflow-page {
    overflow: hidden;
  }
}
@media only screen and (min-width: 950px) and (max-width: 1150px) {
  .date {
    margin-top: 20pt;
    margin-left: 11.5rem;
    margin-bottom: 10pt;
  }
}
@media only screen and (min-width: 0px) and (max-width: 700px) {
  .b-icon.bi {
    font-size: 140% !important;
  }
  .box-menu-monitor {
    position: relative !important;
    right: 0px !important;
  }
  .icon-monitor1,
  .icon-monitor2 {
    cursor: pointer;
    padding: 3px 5px !important;
    border-radius: 10px;
  }
}
</style>
