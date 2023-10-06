<template>
  <div>
    <b-table striped hover :items="items" :fields="fields">
      <template #cell(message)="data">
        <b class="text-info">{{ data.value.toUpperCase() }}</b>
      </template>
    </b-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // Note `isActive` is left out and will not appear in the rendered table
      fields: ["posted_by", "message", "last_name", "age"],
      items: [
        {
          posted_by: "user",
          isActive: true,
          age: 40,
          message: "Dickerson",
          last_name: "Macdonald",
          Posted_on: "",
          Retweet: "",
          Like: "",
          Engagement: "",
          Follower: "",
          Reply:"",
          Quote:"",
          Sentiment:""

        },
        {
          posted_by: "user",
          isActive: false,
          age: 21,
          message: "Larsen",
          last_name: "Shaw",
        },
        {
          posted_by: "user",
          isActive: false,
          age: 89,
          message: "Geneva",
          last_name: "Wilson",
        },
        {
          posted_by: "user",
          isActive: true,
          age: 38,
          message: "Jami",
          last_name: "Carney",
        },
      ],
    };
  },
};
</script>
