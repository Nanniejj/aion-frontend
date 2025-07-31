<template>
  <div class="btn-group" role="group" aria-label="Sentiment">
    <button
      type="button"
      class="btn py-1 px-2"
      :class="sentiment === 1 ? 'btn-success' : 'btn-unactive'"
    >
      Positive
    </button>
    <button
      type="button"
      class="btn py-1 px-2"
      :class="sentiment === 0 ? 'btn-neutral' : 'btn-unactive'"
    >
      Neutral
    </button>
    <button
      type="button"
      class="btn py-1 px-2"
      :class="sentiment === -1 ? 'btn-danger' : 'btn-unactive'"
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
    },
    data() {
        return {
        //   sentiment: 0, // 0 = neutral, 1 = positive, -1 = negative
        };
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