<template lang="">
    <b-card 
        :img-src="influencer.profile_image" 
        img-alt="Image" img-top
        body-class="rounded-bottom text-left"
        img-top-class="rounded-top"
        overlay
        class="overflow-hidden h-100"
    >
        <div class="py-3">
            <h5 class="font-weight-bold ">
                {{ influencer.name || influencer.uid  }}
            </h5>
            <div class="d-flex">
                <i class="fa fa-map-marker mr-2" style="color: #fed06ea4;"/>
                กรุงเทพ
            </div>
        </div>
        <b-card-text>
            <b-row cols="2" class="">
                <b-col class="text-center">
                    <div class="bold" style="font-size:18px;">{{ formatNumber(influencer.followers) }}</div>
                    <div style="font-size:14px;">Followers</div>
                </b-col>
                <b-col class="text-center">
                    <div class="bold" style="font-size:18px;">{{ formatNumber(influencer.followings) }}</div>
                    <div style="font-size:14px;">Following</div>
                </b-col>
            </b-row>
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
    methods: {
        formatNumber(num) {
            if (num >= 1000000) {
                return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
            }
            if (num >= 1000) {
                return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
            }
            return num.toString();
        },
        
    }
}
</script>
<style scoped>
.card-img, .card-img-bottom, .card-img-top {
    flex-shrink: 0;
    width: 100%;
    height: 210px;
    object-fit: cover;
    
}

.card-body {
    backdrop-filter: blur(12px);
    position: relative;
    margin-top: -30px;
    box-shadow: none !important;
    text-shadow: none !important;
    background: linear-gradient(
        180deg,
        rgba(255, 255, 255, 0) 0%,      /* โปร่งใสด้านบน */
        rgba(255, 255, 255, 0.4) 40%,   /* เริ่มขาวขึ้น */
        rgba(255, 255, 255, 0.8) 60%,  /* ขาวเกือบทึบ */
        rgba(255, 255, 255, 1) 90%     /* ขาวทึบด้านล่าง */
    );
    padding-top:30px;
    z-index: 1;
   
}
</style>