<template>
    <div>
        <b-row>
            <b-col>
                <!-- <div style="height: 50px;background-color: aqua;"></div> -->
                <b-card class="text-center boxlist-card">

                    <b-row v-if="profile">
                        <b-col>
                            <!-- {{ profile }} -->
                            <span>
                                <span v-if="profile.profile_image">
                                    <b-avatar @error="setAltImg" size="70px" :src="profile.profile_image" loading="lazy"
                                        class="imgpro shadow-sm rounded badge-light rounded-circle"></b-avatar>
                                </span>
                                <span v-else>
                                    <b-avatar class="imgpro shadow-sm rounded badge-light rounded-circle"
                                        size="70px"></b-avatar>
                                </span>

                                <span class="left">
                                    <img v-if="profile.source == 'twitter'" src="@/assets/Twitter.png"
                                        class="social-img" />
                                    <img v-else-if="profile.source == 'facebook'" src="@/assets/Facebook.png"
                                        class="social-img" />
                                    <img v-if="profile.source == 'news'" src="@/assets/News.png" class="social-img" />
                                    <img v-if="profile.source == 'pantip'" src="@/assets/Pantip.png"
                                        class="social-img" />
                                    <img v-if="profile.source == 'instagram'" src="@/assets/Instagram.png"
                                        class="social-img" />
                                    <img v-if="profile.source == 'youtube'" src="@/assets/Youtube.png"
                                        class="social-img" />
                                    <img v-if="profile.source == 'blockdit'" src="@/assets/Blockdit.png"
                                        class="social-img" />
                                    <img v-if="profile.source == 'tiktok'" src="@/assets/Tiktok.png"
                                        class="social-img" />
                                    <img v-if="profile.source == 'threads'" src="@/assets/Threads.png"
                                        class="social-img" />
                                </span>
                            </span>

                            <div class="h5 m2-1">
                              <a v-bind:href="profile.link_original" target="_blank"
                                    style="color: #2c3e50"> {{ profile.name || profile.uid }}</a> 
                            </div>
                            <div class="small"> <a v-bind:href="profile.link_original" target="_blank"
                                    style="color: #2c3e50"> <b-icon icon="link45deg"></b-icon>({{ profile.uid }})</a></div>
                        </b-col>

                    </b-row>
                </b-card>
            </b-col>
        </b-row>
    </div>
</template>
<script>
export default {
    data() {
        return {
            data: [],
            profile: null
        }
    },
    methods: {
        apiMonitorProfile() {
            this.load = true;
            const config = {
                method: "get",
                url: "https://api2.cognizata.com/api/v2/monitor/getProfile",
                params: {
                    type: this.$route.query.type,
                    source: this.$route.query.source,
                    uid: this.$route.query.uid,
                },
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                    "Content-Type": "application/json",
                },
            };

            this.axios(config)
                .then((response) => {
                    this.data = response.data || [];
                    console.log('this.data ', this.data);

                    this.profile = response.data?.profile[0]
                    console.log('this.profile ', this.profile);
                    this.load = false;
                })
                .catch((error) => {
                    this.load = false;
                    console.error(error);
                });
        },
    },
    mounted() {
        this.apiMonitorProfile()
    },
}
</script>
<style scoped>
.user-img {
    width: 70px;
    border-radius: 50%;
    z-index: 2;
    position: relative;
}

.imgp {
    z-index: 2;
    position: relative;
}

.social-img {
    width: 50px;
    margin-left: -12px;
    margin-top: 19px;
    z-index: 0;
    position: relative;
}

.social-img {
    width: 40px;
}

.boxlist-card {
    border: 0px;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;
    border-radius: 15px;
    /* height: 100px; */
}
</style>