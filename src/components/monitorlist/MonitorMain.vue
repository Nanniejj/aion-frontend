<template>
    <div class="w-custom">
        <div class="">
            <b-button-toolbar key-nav aria-label="Toolbar with button groups my-2">
                <b-button-group class="" size="lg">
                    <b-button style="border-bottom-left-radius: 0;"  :variant="activeButton === 'profile' ? 'custom' : 'outline-custom'"
                        @click="selectButton('profile')">
                        <div class="d-flex">
                            <b-icon icon="person-fill" font-scale="1.5"></b-icon>
                            <span class="d-none d-lg-block pl-2">
                                Profile
                            </span>
                        </div>
                        <!-- <b-icon icon="person-fill" font-scale="1.5"></b-icon> Profile -->
                    </b-button>

                    <b-button style="border-bottom-right-radius: 0;" :variant="activeButton === 'hashtag' ? 'custom' : 'outline-custom'"
                        @click="selectButton('hashtag')">
                        <!-- <b-icon icon="hash" font-scale="1.5"></b-icon> Hashtag -->
                        <div class="d-flex">
                            <b-icon icon="hash" font-scale="1.5"></b-icon> 
                            <span class="d-none d-lg-block pl-2">
                                Hashtag
                            </span>
                        </div>
                    </b-button>
                    <b-button style="border-bottom-right-radius: 0;" :variant="activeButton === 'group' ? 'custom' : 'outline-custom'"
                        @click="selectButton('group')">
                        <div class="d-flex">
                            <b-icon icon="diagram2-fill" font-scale="1.5"></b-icon> 
                            <span class="d-none d-lg-block pl-2">
                                Groups
                            </span>
                        </div>
                    </b-button>
                    <!-- <b-button style="border-bottom-right-radius: 0;" :variant="activeButton === 'community' ? 'custom' : 'outline-custom'"
                        @click="selectButton('community')">
                        <div class="d-flex">
                            <b-icon icon="people-fill" font-scale="1.5"></b-icon> 
                            <span class="d-none d-lg-block pl-2">
                                Community
                            </span>
                        </div>
                    </b-button> -->
                </b-button-group>
            </b-button-toolbar>
        </div>
        <MonitorStat v-if="activeButton == 'profile'" :type="'targetlist'" :reface="refaceStat"  @setReface="handleReface"/>
        <!-- <MonitorStat v-if="activeButton == 'hashtag'" :type="'hashtaglist'" :reface="refaceStat" :total="total" @setReface="handleReface"/> -->

        <MonitorTable v-if="activeButton == 'profile'" :type="'targetlist'"  @setReface="handleReface"/>
        <MonitorTable v-if="activeButton == 'hashtag'" :type="'hashtaglist'"  @setReface="handleReface" @total="(data) => total = data"/>
        <MonitorGroupTable v-if="activeButton == 'group'" :type="'grouplist'"  @setReface="handleReface" @total="(data) => total = data"/>
        <MonitorCommunity v-if="activeButton == 'community'" :type="'communitylist'"/>
    </div>
</template>

<script>
import MonitorStat from "@/components/monitorlist/MonitorStat.vue";
import MonitorTable from "@/components/monitorlist/MonitorTable.vue";
import MonitorGroupTable from "@/components/monitorlist/MonitorGroupTable.vue";
import MonitorCommunity from "./MonitorCommunity.vue";
export default {
    components: {
        MonitorStat,MonitorTable,MonitorGroupTable, MonitorCommunity
    },
    data() {
        return {
            activeButton: "profile", // ค่าเริ่มต้น
            refaceStat: false,
            total: 0
        };
    },
    methods: {
        selectButton(type) {
            this.activeButton = type;
        },
        handleReface() {
            console.log('setReface emitted!');
            this.refaceStat = !this.refaceStat
            console.log("reface stat ==== ", this.refaceStat);
        }
    }
};
</script>
<style scoped>
.btn-custom {
    /* color: #fff; */
    color: #4c412d;
    background-color: #ffe6e6;
    border-color: #ffe6e6;
    /* background-color: #17a3b8ce;
    border-color: #17a3b896; */
}
.btn-outline-custom{
    color: #afa89d;
    border-color: #ffe6e6;
}
.w-custom {
    width: 85%;
    margin: auto;
}
@media only screen and (min-width: 0px) and (max-width: 1280px){
    .w-custom {
        width: 96%;
        margin: auto;
    }

}

</style>