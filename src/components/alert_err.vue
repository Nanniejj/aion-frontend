<template>
<b-modal id="notice" hide-footer title="แจ้งเตือน" class="md-font">
    <div class="d-block text-center">
      <p class="md-font">กรุณาติดต่อเจ้าหน้าที่</p>
    </div>
    <b-button class="mt-3 md-font" variant="outline-danger" block @click="$bvModal.hide('notice')" style="width: 40%;margin: auto;">Close Me</b-button>
  </b-modal>
</template>