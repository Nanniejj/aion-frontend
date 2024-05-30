<template>
  <span class="mb-2 d-inline-block">
    <span>
      <b-button variant="secondary" @click="open = true">
        <i class="fa fa-info-circle" /> ตัวอย่างการ upload
      </b-button>
    </span>

    <vue-modaltor
      :visible="open"
      @hide="open = false"
      :animation-panel="'modal-slide-top'"
      :resize-width="{ 3000: '80%', 1350: '80%', 768: '90%' }"
      class="face-modal"
    >
      <b-alert show class="mt-3">
        <div>
            <b>
          <i
            class="fa fa-info-circle"
            aria-hidden="true"
            style="color:rgb(15 71 86)"
          ></i> วิธีใช้งาน </b> <br/>
            1. กรอกช่อง ชื่อ - นามสกุล ให้ครบ <br/>
            2. upload รูปใบหน้าบุคคล <br/>

        </div>
        <b>
          <i
            class="fa fa-info-circle"
            aria-hidden="true"
            style="color:rgb(15 71 86)"
          ></i>
          ตัวอย่างการ upload ไฟล์
        </b>
        <div>
          <i
            class="fa fa-check-circle-o "
            aria-hidden="true"
            style="color:#00a651"
          ></i>
          ในรูปภาพ 1 รูป ต้องเป็นรูปบุคคล มี 1 ใบหน้า / เห็นใบหน้าชัดเจน
        </div>
        <div>
          <i
            class="fa fa-times-circle-o "
            aria-hidden="true"
            style="color:#ed1c24"
          ></i>
          ในรูปภาพ 1 รูป มีใบหน้าหลายใบหน้า หรือ เป็นรูปอื่นๆเช่น วิว / สัตว์ /
          สิ่งของ
        </div>
        <div>
            3. กดปุ่ม upload (ถ้ามี error ให้กดปุ่ม error เพื่อลบไฟล์ error ทั้งหมด หรือกดลบที่ dropzone ก็ได้เช่นกัน)
        </div>
      </b-alert>
      <b-row>
        <b-col sm>
          <img src="@/assets/Ex01-01.png" alt="" style="width:100%" />
          <div class="text-center my-2">
            <i
              class="fa fa-check-circle-o fa-2x"
              aria-hidden="true"
              style="color:#00a651"
            ></i>
            ตัวอย่างรูปภาพที่ถูกต้อง
          </div>
        </b-col>
        <b-col sm>
          <img src="@/assets/Ex02-01.png" alt="" style="width:100%" />
          <div class="text-center my-2">
            <i
              class="fa fa-times-circle-o fa-2x"
              aria-hidden="true"
              style="color:#ed1c24"
            ></i>
            ตัวอย่างรูปภาพที่ผิด
          </div>
        </b-col>
      </b-row>
    </vue-modaltor>
  </span>
</template>
<script>
export default {
  data() {
    return {
      open: false,
    };
  },
};
</script>
<style>
.face-modal .modal-vue-wrapper-show.modal-fade{
  z-index: 999 !important;
}
</style>
<style scoped>
.btn-secondary {
  background: #ede7dd;
  border-color: #ede7dd;
  color: #4c412b;
  box-shadow: 1px 1px 3px #666666;
}
</style>
