!<template>
  <div><b-row id="input-btn">
      <b-col lg="6" class="my-1">
        <b-form-group
          label-for="filter-input"
          label-cols-sm="0"
          label-align-sm="right"
          label-size="md"
          class="mb-0"
        >
          <b-input-group size="md">
            <b-form-input
              id="filter-input"
              v-model="filter"
              type="search"
              placeholder="ค้นหา"
            ></b-form-input>
          </b-input-group>
        </b-form-group>
      </b-col>
      <b-col lg="6" class="my-1">
        <TemplateAddDomain/>
        <!-- <button class="btn btn-add" ><i class="fa fa-plus"/><span  style="font-size:16px;"> เพิ่ม Domain </span></button> -->
      </b-col>
    </b-row>
<br></div>
</template>

<script>
export default {

}
</script>

<style>

</style>