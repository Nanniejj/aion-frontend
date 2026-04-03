<template>
  <div class="btn-group" role="group" aria-label="Sentiment">
    <button
      type="button"
      class="btn py-1 px-2"
      :class="sentiment === 1 ? 'btn-success' : 'btn-unactive'"
      @click="getTheSelected(1)"
    >
      Positive
    </button>
    <button
      type="button"
      class="btn py-1 px-2"
      :class="sentiment === 0 ? 'btn-neutral' : 'btn-unactive'"
      @click="getTheSelected( 0)"

    >
      Neutral
    </button>
    <button
      type="button"
      class="btn py-1 px-2"
      :class="sentiment === -1 ? 'btn-danger' : 'btn-unactive'"
      @click="getTheSelected(-1)"
    >
      Negative
    </button>
  </div>
</template>

<script>


export default {
    props: {
        sentiment: {
          type: Number,
          required: true,
        },
        uId: {
          type: String,
          required: true,
        },
    },
    data() {
        return {
        //   sentiment: 0, // 0 = neutral, 1 = positive, -1 = negative
        };
    },
    methods: {
        // You can add methods here if you want to change the sentiment on button click
        getTheSelected(v) {
      var err;
      if (v == 1) {
        err = "Positive";
      } else if (v == 0) {
        err = "Neutral";
      } else {
        err = "Negative";
      }
      this.$confirm("คุณต้องการเปลี่ยน Sentiment เป็น " + err + " ?")
        .then(
          () => {
            // const encoded = encodeURIComponent(uid);
            // var _this = this;
            var config = {
              method: "put",
              url: "https://api2.cognizata.com/api/v2/userposts/update_sentiment_word",
              data: {
                uid: this.uId,
                sentiment: v
              },
              headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
                "Content-Type": "application/json",
              },
            };
            //   var config = {
            //     method: "get",
            //     url:
            //       "https://api2.cognizata.com/api/v2/userposts/change_sentiment_word?uid=" +
            //       encoded +
            //       "&sentiment=" +
            //       v,
            //     headers: {
            //       Authorization: "Bearer " + localStorage.getItem("token"),
            //       "Content-Type": "application/json",
            //     },
            //   };
            this.axios(config)
              .then((response) => {
                this.$emit("sentiment-changed", {
                uid: this.uId,
                sentiment: v
              });
                // console.log("change sentiment response:",response);
                // this.$emit("sentiment-changed", { uid: this.uId, sentiment: v });
              })
              .catch((e) => {
                console.error("axios error:", e);
                // alert("เกิดข้อผิดพลาดในการเปลี่ยน Sentiment");
              });
          }

        ).catch(function () {
          //   console.log("errrrrrr", response.message);
        });
    },
    },
};
</script>
<style scoped>
.btn-unactive{
    color: #636465;
    background-color: #ddd;
    border-color: #ddd;
}

.btn-neutral{
    color: white;
    background-color: #368ab6;
    border-color: #368ab6;
}
</style>