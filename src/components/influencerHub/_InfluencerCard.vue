<template lang="">
    <b-card 
        img-src="https://picsum.photos/300/300/?image=41" 
        img-alt="Image" img-top
        body-class="text-left"
    >
        <b-card-title class="font-weight-bold">
            Influencer Name
        </b-card-title>
        <b-card-text>
            This is a wider card with supporting text below as a natural lead-in to additional content.
            This content is a little bit longer.
        </b-card-text>
    </b-card>
</template>
<script>
export default {
    props: {
        influencer: {
            type: Object,
            // required: true
        }
    },
}
</script>
<style scoped>
.card-img, .card-img-bottom, .card-img-top {
    flex-shrink: 0;
    width: 100%;
    height: 180px;
}
</style>