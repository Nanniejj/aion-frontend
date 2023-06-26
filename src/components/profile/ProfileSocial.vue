
<template>
  <div>
    <b-form-select
      v-model="selected"
      :options="options"
      class="mb-3"
      value-field="item"
      text-field="name"
      
    >Please select an option</b-form-select>

    <!-- <div class="mt-3">Selected: <strong>{{ selected }}</strong></div> -->
  </div>
</template>

<script>
  export default {
    data() {
      return {
        selected: 'twitter',
        options: [
          { item: 'facebook', name: 'Facebook' },
          { item: 'twitter', name: 'Twitter' },
          { item: 'pantip', name: 'Pantip'},
        ]
      }
    }
  }
</script>