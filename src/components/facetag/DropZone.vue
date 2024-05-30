<template>
  <div class="mb-5" >
    <div class="text-left mb-3"           style="color: #4c412d; "
>
      <span class="h5">  <i class="fas fa-plus" style="color: #69a722;"></i>  เพิ่มภาพใบหน้า </span>
      <span class="float-right">
        <i
          class="fas fa-close fa-2x "
          @click="close()"
          style="color: #4c412d;cursor:pointer"
        ></i>
      </span>
      <hr class="mb-4"/>
    </div>

    <div class="mb-2">
      <b-row>
        <b-col sm>
          <b-form-input
            v-model="name"
            placeholder="ชื่อ"
            class="my-1"
          ></b-form-input>
        </b-col>
        <b-col sm>
          <b-form-input
            v-model="surname"
            placeholder="นามสกุล"
            class="my-1"
          ></b-form-input>
        </b-col>
      </b-row>
    </div>
    <b-row align-v="center">
      <b-col class="text-left" cols="12" md="auto">
        <i class="fa fa-images fa-2x" aria-hidden="true"></i>
        <span style="font-size:18px"> {{ count }} files</span>
        <!-- <b-badge pill variant="success" v-if="sucCount > 0" class="mx-2">
            success  {{ sucCount }}</b-badge
          > -->
        <b-badge pill variant="danger" v-if="errCount > 0" class="mx-2">
          error {{ errCount }}</b-badge
        >
      </b-col>
      <b-col cols="12" md="">
        <div class="text-md-right">
          <StepDetect class="my-3 mx-1 " />
          <b-button class="my-3 mx-1 " @click="clear" variant="danger">
            <b-icon icon="trash" aria-hidden="true"></b-icon> clear</b-button
          >
          <b-button
            class="my-3  mx-1"
            @click="update"
            variant="secondary"
            :disabled="errCount == 0"
          >
            <i class="fa fa-ban" aria-hidden="true"></i>
            error
            <b-badge pill variant="danger" v-if="errCount > 0">
              {{ errCount }}</b-badge
            >
          </b-button>
          <b-button
            class="my-3  mx-1"
            @click="submit"
            variant="warning"
            :disabled="
              name == '' ||
                surname == '' ||
                count == 0 ||
                errCount > 0 ||
                qCount < 100 ||
                statusDetect
            "
          >
            <b-spinner small v-show="load"></b-spinner>
            <b-icon icon="cloud-arrow-up-fill" aria-hidden="true"></b-icon>
            upload
          </b-button>
        </div>
      </b-col>
    </b-row>
    <!-- {{ faceLoad }}{{ qCount }}{{ statusDetect }} -->

    <!-- {{ qCount }} -->
    <div class="text-right">ประมวลผลใบหน้า {{ detectCount }} / {{ count }}</div>
    <b-progress
      :value="qCount"
      variant="info"
      :animated="false"
      height="10px"
    ></b-progress>
    <div>
      <vue-element-loading
        :active="statusDetect"
        spinner="bar-fade-scale"
        color="#4c412d"
        background-color="rgba(255, 255, 255, .4)"
        text="กำลังประมวลผลใบหน้า"
        id="load-dz"
      />
      <vue-dropzone
        v-model="files"
        ref="myVueDropzone"
        id="dropzone"
        :options="dropzoneOptions"
        @vdropzone-success="DropZoneSuccess"
        @vdropzone-removed-file="updateCount"
        @vdropzone-total-upload-progress="updateQ"
        @vdropzone-file-added="updateFace"
        :duplicateCheck="true"
      >
      </vue-dropzone>
    </div>
  </div>
</template>
<script>
import vue2Dropzone from "vue2-dropzone";
import StepDetect from "@/components/facetag/StepDetect.vue";
import "vue2-dropzone/dist/vue2Dropzone.min.css";
import * as faceapi from "face-api.js";
export default {
  components: {
    vueDropzone: vue2Dropzone,
    StepDetect,
  },
  watch: {
    count(val) {
      if (val == 0) {
        this.qCount = 0;
      }
    },
    fileData: {
      handler(val) {
        let files = [...val];

        let ret = this.$refs.myVueDropzone.getUploadingFiles();
        console.log("valfileData", val, ret);
        let err = files.filter((x) => x.status == "error");
        console.log("errop", err.length);
        let filteredFiles = files.filter((x) => {
          console.log("x.previewElement.classList", x.previewElement.classList);
          // ตรวจสอบว่าไฟล์มีคลาส "detect" หรือไม่
          return Array.from(x.previewElement.classList).reduce(
            (acc, className) => {
              if (className === "detect") {
                acc = true;
              }
              return acc;
            },
            false
          );
        });
        this.detectCount = filteredFiles.length + err.length;
        console.log("filteredFiles", filteredFiles, this.detectCount);
      },
      deep: true,
    },
  },
  computed: {
    statusDetect() {
      let status = true;
      if (
        this.detectCount == this.count ||
        (this.detectCount == 0 && this.count == 0)
      ) {
        status = false;
      } else {
        status = true;
      }
      return status;
    },
    // fileErr() {
    //   if (this.isMounted) {
    //     return this.updateErr();
    //   }
    // },
  },
  data() {
    return {
      detectCount: 0,
      fileData: [],
      faceLoad: false,
      qCount: 0,
      errCount: 0,
      isMounted: false,
      count: 0,
      load: false,
      name: "",
      surname: "",
      files: [],
      dropzoneOptions: {
        url: "https://httpbin.org/post",
        thumbnailWidth: 150,
        maxFilesize: 200,
        addRemoveLinks: true,
        acceptedFiles: "image/*",
        dictDefaultMessage: "<i class='fa fa-cloud-upload'></i> UPLOAD",
        headers: { "Access-Control-Allow-Origin": "*" },
      },
    };
  },
  methods: {
    close() {
      this.$emitter.emit("closeAddFace", false);
      this.$emitter.emit("showBack", true);
    },
    updateFace() {
      this.faceLoad = true;
      // console.log("FACE");
    },
    updateQ(totaluploadprogress, totalBytes, totalBytesSent) {
      this.qCount = totaluploadprogress;
      // console.log("QQQQQ", totaluploadprogress, totalBytes, totalBytesSent);
      //  let qfile = this.$refs.myVueDropzone.getQueuedFiles()
      if (totaluploadprogress < 100) {
        this.faceLoad = true;
      }
    },
    updateErr() {
      let files = this.$refs.myVueDropzone.getAcceptedFiles();

      let err = [...files].filter((x) => x.status == "error");
      // กรองไฟล์ที่ผ่านเงื่อนไข
      let filteredFiles = [...files].filter((x) => {
        // ตรวจสอบว่าไฟล์มีคลาส "border-red" หรือไม่
        return (
          x.previewElement.classList[5] &&
          x.previewElement.classList[5].includes("border-red")
        );
      });
      // }
      console.log("filteredFiles", filteredFiles);
      this.errCount = filteredFiles.length + err.length;
      this.sucCount = Number(files.length) - filteredFiles.length;
      this.fileData = this.$refs.myVueDropzone.getAcceptedFiles();
    },
    updateCount() {
      this.count = this.$refs.myVueDropzone.getAcceptedFiles().length;
      this.updateErr();
    },
    submit() {
      this.load = true;
      let files = this.$refs.myVueDropzone.getAcceptedFiles();
      const axios = require("axios");
      const FormData = require("form-data");
      let data = new FormData();
      data.append("name", this.name);
      data.append("surname", this.surname);
      files.map((file) => {
        console.log('file',file)
        data.append("files", file);
      });

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://newsite.cognizata.com/upload/",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "multipart/form-data",
        },
        data:data,
      };

      axios
        .request(config)
        .then((response) => {
          this.load = false;
          this.clear()
          this.name=""
          this.surname=""
          this.$fire({
            title: "upload รูปภาพสำเร็จ",
            type: "success",
            showConfirmButton: false,
            timer: 2000,
          });
          console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
          this.load = false;
          this.$fire({
            text: "บันทึกข้อมูลไม่สำเร็จ กรุณาลองอีกครั้ง",
            type: "error",
            showConfirmButton: false,
            timer: 2000,
          });
          console.log(error);
        });
    },
    update() {
      let files = this.$refs.myVueDropzone.getAcceptedFiles();
      let filesx = this.$refs.myVueDropzone.getRejectedFiles();
      //  let err = [...files].filter((x) => x.status=='error')
      files.map((x) => {
        if (x.status == "error") {
          this.$refs.myVueDropzone.removeFile(x);
        }
        if (
          x.previewElement.classList[5] &&
          x.previewElement.classList[5].includes("border-red")
        ) {
          this.$refs.myVueDropzone.removeFile(x);
        }
      });
      console.log("filesx", filesx);
      if (filesx.length) {
        filesx.map((x) => {
          this.$refs.myVueDropzone.removeFile(x);
        });
      }
      this.count = this.$refs.myVueDropzone.getAcceptedFiles().length;
      this.updateErr();
      this.fileData = this.$refs.myVueDropzone.getAcceptedFiles();
    },
    clear() {
      this.$refs.myVueDropzone.removeAllFiles();
      this.fileData = this.$refs.myVueDropzone.getAcceptedFiles();
      this.count = this.$refs.myVueDropzone.getAcceptedFiles().length;
    },
    DropZoneSuccess(file) {
      this.faceLoad = true;
      // console.log(file, file.previewElement);
      if (file) {
        Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri("./models"),
          faceapi.nets.ssdMobilenetv1.loadFromUri("./models"),
          faceapi.nets.faceLandmark68Net.loadFromUri("./models"),
          faceapi.nets.faceRecognitionNet.loadFromUri("./models"),
          faceapi.nets.faceExpressionNet.loadFromUri("./models"),
        ]).then(() => {
          this.start(file.dataURL, file.previewElement);
        });
      }
    },
    async start(imageUrl, classa) {
      // this.faceLoad = true
      const img = await faceapi.fetchImage(imageUrl);
      // ตรวจจับใบหน้าในรูปภาพ
      const detections = await faceapi.detectAllFaces(
        img,
        new faceapi.SsdMobilenetv1Options()
      );

      // นับจำนวนใบหน้า

      if (detections.length > 1) {
        this.faceLoad = true;
        let txt = "พบมากกว่า 1 " + "ใบหน้า";
        let root = classa;
        root.className += " border-red";
        var newDiv = document.createElement("div");
        var newContent = document.createTextNode("");
        newDiv.appendChild(newContent);
        newDiv.className = "txt-overlay";
        root.appendChild(newDiv);
        var newDiv2 = document.createElement("div");
        var newContent2 = document.createTextNode(txt);
        newDiv2.appendChild(newContent2);
        newDiv2.className = "txt-err";
        root.appendChild(newDiv2);
        // alert("มีใบหน้ามากกว่า 1 " + "มี" + detections.length + "ใบหน้า");
      }
      if (detections.length == 0) {
        this.faceLoad = true;
        let txt = "ไม่พบใบหน้า";
        let root = classa;
        root.className += " border-red";
        var newDiv = document.createElement("div");
        var newContent = document.createTextNode("");
        newDiv.appendChild(newContent);
        newDiv.className = "txt-overlay";
        root.appendChild(newDiv);
        var newDiv2 = document.createElement("div");
        var newContent2 = document.createTextNode(txt);
        newDiv2.appendChild(newContent2);
        newDiv2.className = "txt-err";
        root.appendChild(newDiv2);
      }
      let root = classa;
      root.className += " detect";

      this.count = this.$refs.myVueDropzone.getAcceptedFiles().length;
      this.updateErr();
      this.faceLoad = false;
      console.log("detections", detections);
      this.fileData = this.$refs.myVueDropzone.getAcceptedFiles();
    },
  },
  mounted() {
    this.$emitter.emit("showBack", false);
    this.isMounted = true;
  },
};
</script>
<style>
.velmld-overlay#load-dz {
  position: absolute;
  z-index: 99;
  margin: 0;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  transition: opacity 0.3s;
}
.border-red:hover .txt-overlay {
  display: none;
}
.border-red:hover .txt-err {
  display: none;
  z-index: 0;
}
.txt-err {
  z-index: 99;
  position: absolute;
  top: 50%;
  width: 100%;
  text-align: center;
  background-color: #970808;
  color: #ffffff;
  font-size: 14px;
}
.txt-overlay {
  box-shadow: 0 8px 6px -6px black;
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(70, 57, 57, 0.5);
  z-index: 99;
  cursor: pointer;
  top: 0;
}
.border-red {
  color: #fff;
  border: 2px solid #970808;
}
.rect {
  border: 2px solid #a64ceb;
  left: -1000px;
  position: absolute;
  top: -1000px;
}

.vue-dropzone {
  box-shadow: rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em,
    rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em,
    rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset;
  border-radius: 15px;
  border: 0px solid #e5e5e5;
  font-family: Arial, sans-serif;
  letter-spacing: 0.2px;
  color: #777;
  transition: 0.2s linear;
  min-height: 300px;
}
.vue-dropzone > .dz-preview .dz-details {
  bottom: 0;
  top: 0;
  color: #fff;
  background-color: #f1cf6a82;
  transition: opacity 0.2s linear;
  text-align: left;
}
</style>
<style scoped>
.btn-danger {
  background: #ede7dd;
  border-color: #ede7dd;
  color: #4c412b;
  box-shadow: 1px 1px 3px #666666;
}
.btn-secondary {
  background: #ede7dd;
  border-color: #ede7dd;
  color: #4c412b;
  box-shadow: 1px 1px 3px #666666;
}
.btn-warning {
  color: #fff;
  background-color: #4c412d;
  border-color: #4c412d;
  box-shadow: 1px 1px 3px #666666;
}
.spinner-border {
  position: absolute;
  left: unset;
  top: unset;
  z-index: 1;
  width: 20px;
  height: 20px;

  margin: 0px 20px;
  width: 20px;
  height: 20px;
  pointer-events: none;
  overflow: hidden;
  color: rgb(255, 255, 255);
}
</style>
