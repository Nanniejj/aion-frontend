<template>
    <div>
      <div
        :style="{ height: showFull ? 'auto' : maxHeight, overflow: 'hidden' }"
        ref="textBox"
        class="mb-1"
      >
        {{ item.title }}
      </div>
  
      <div v-if="isOverflowing" class="text-right">
        <button @click="toggleShow" class="btn btn-link p-0 text-right">
          <span class="small" style="color: #3d6fa1;">
            {{ showFull ? 'ย่อข้อความ' : 'อ่านเพิ่ม' }}
          </span>
        </button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ReadMore',
    props: {
      item: {
        type: Object,
        required: true
      },
      maxHeight: {
        type: String,
        default: '55px'
      }
    },
    data() {
      return {
        showFull: false,
        isOverflowing: false
      };
    },
    mounted() {
      this.checkOverflow();
    },
    methods: {
      toggleShow() {
        this.showFull = !this.showFull;
      },
      checkOverflow() {
        this.$nextTick(() => {
          const el = this.$refs.textBox;
          if (el && el.scrollHeight > el.offsetHeight) {
            this.isOverflowing = true;
          } else {
            this.isOverflowing = false;
          }
        });
      }
    },
    watch: {
      item: {
        handler() {
          this.showFull = false;
          this.$nextTick(() => this.checkOverflow());
        },
        deep: true
      }
    }
  };
  </script>
  
  <style scoped>
  /* เพิ่มได้หากต้องการแต่งปุ่มเพิ่มเติม */
  </style>
  