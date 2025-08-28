<template>
  <div class="ml-lg-5 mr-lg-5 ml-md-3 mr-md-3 ml-sm-3 mr-sm-3 p-3">
    <div>
      
      <div class="text-left mb-2 legend">
        <span class="mr-3"><b-icon variant="danger" style="color:#e74c3c" icon="circle-fill"></b-icon> Core</span>
        <span class="mr-3"><b-icon style="color:#9b59b6" icon="circle-fill"></b-icon> Amplify</span>
        <span class="mr-3"><b-icon style="color:#f39c12" icon="circle-fill"></b-icon> Support</span>
        <span class="mr-3"><b-icon style="color:#3498db" icon="circle-fill"></b-icon> Echo</span>
      </div>
      <div v-if="dataraw && dataraw.full_text" class="text-left">
        <!-- โหมดย่อ -->
        <p v-if="!showFull" class="mb-1">
          {{ shortText }}<span v-if="needsTrim">…</span>
        </p>

        <!-- โหมดเต็ม -->
        <b-collapse v-model="showFull" class="mt-1">
          <p class="mb-1">{{ dataraw.full_text }}</p>
        </b-collapse>

        <!-- ปุ่มสลับ -->
        <b-button v-if="needsTrim" size="sm" variant="link" class="p-0 mt-1" @click="showFull = !showFull">
          {{ showFull ? 'ย่อ' : 'อ่านเพิ่มเติม' }}
          <b-icon :icon="showFull ? 'chevron-up' : 'chevron-down'" class="ml-1"></b-icon>
        </b-button>
      </div>

      <!-- <div ref="graphContainer" style="height:120vh;"></div> -->
    </div>
  </div>
</template>

<script>
import { Network } from "vis-network";
import "vis-network/styles/vis-network.css";

export default {
  computed: {
    needsTrim() {
      const t = (this.dataraw && this.dataraw.full_text) || "";
      return t.length > this.maxChars;
    },
    shortText() {
      const t = (this.dataraw && this.dataraw.full_text) || "";
      return this.needsTrim ? t.slice(0, this.maxChars) : t;
    },
  },
  data() {
    return {
      dataraw: "", showFull: false,
      maxChars: 500,
    };
  },
  mounted() {

  }
  