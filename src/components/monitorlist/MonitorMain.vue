<template>
    <div>
        <div class="px-3">
            <b-button-toolbar key-nav aria-label="Toolbar with button groups my-2">
                <b-button-group class="mx-1" size="lg">
                    <b-button :variant="activeButton === 'profile' ? 'info' : 'outline-info'"
                        @click="selectButton('profile')">
                        <b-icon icon="people" font-scale="1.5"></b-icon> Profile
                    </b-button>

                    <b-button :variant="activeButton === 'hashtag' ? 'info' : 'outline-info'"
                        @click="selectButton('hashtag')">
                        <b-icon icon="hash" font-scale="1.5"></b-icon> Hashtag
                    </b-button>
                </b-button-group>
            </b-button-toolbar>
        </div>
        <MonitorStat v-if="activeButton == 'profile'" :type="'targetlist'" />
        <MonitorStat v-if="activeButton == 'hashtag'" :type="'hashtaglist'" />

        <MonitorTable v-if="activeButton == 'profile'" :type="'targetlist'" />
        <MonitorTable v-if="activeButton == 'hashtag'" :type="'hashtaglist'" />
    </div>
</template>

<script>
import MonitorStat from "@/components/monitorlist/MonitorStat.vue";
import MonitorTable from "@/components/monitorlist/MonitorTable.vue";
export default {
    components: {
        MonitorStat,MonitorTable
    },
    data() {
        return {
            activeButton: "profile" // ค่าเริ่มต้น
        };
    },
    methods: {
        selectButton(type) {

            this.activeButton = type;
        }
    }
};
</script>
<style>
.btn-info {
    color: #fff;
    background-color: #17a3b8ce;
    border-color: #17a3b896;
}
</style>