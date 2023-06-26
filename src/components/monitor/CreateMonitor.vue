<template>
  <div>
    <!-- {{getListMonitorProfile.targetlist.length}} -->
    <button class="btn btn-add" @click="open = true">
      <i class="fa fa-plus" />
      <span style="font-size: 16px" v-if="tabsMonitor == 'tabProfile'">
        เพิ่มบัญชี
      </span>
      <span style="font-size: 16px" v-else-if="tabsMonitor == 'tabHashtag'">
        เพิ่มแฮชแท็ก
      </span>
      <span style="font-size: 16px" v-else> เพิ่มบัญชี Avatar</span>
    </button>

    <vue-modaltor
      :visible="open"
      @hide="hideModal"
      :animation-panel="'modal-slide-top'"
      :resize-width="{ 3000: '40%', 1350: '70%', 768: '90%' }"
    >
      <div v-if="tabsMonitor == 'tabProfile'">
        <h5><b>เพิ่มบัญชี</b></h5>
        <hr />
      </div>
      <div v-else-if="tabsMonitor == 'tabHashtag'">
        <h5><b>เพิ่มแฮชแท็ก</b></h5>
        <hr />
      </div>
      <div v-else>
        <h5><b>เพิ่มบัญชี Avatar</b></h5>
        <hr />
      </div>
      <b-row class="my-1">
        <b-col sm="12">
          <span v-if="tabsMonitor == 'tabHashtag'">
            คำแนะนำ : กรุณาเลือกแหล่งข้อมูลออนไลน์และใส่แฮชแท็กที่ต้องการ</span
          >
          <span v-else>
            คำแนะนำ : กรุณาเลือกแหล่งข้อมูลออนไลน์และใส่บัญชีที่ต้องการ</span
          >
        </b-col>
        <b-col sm="12">
          <br />
          <div v-if="tabsMonitor == 'tabHashtag'">
            <b-alert show
              >ตัวอย่างการใส่ข้อมูล <br />ใส่คำที่ต้องการโดย<b> ไม่ต้องใส่ #</b>
              เช่น #การเมือง ให้ใส่ <b>การเมือง</b></b-alert
            >
            <b-form-select
              v-model="selectSourceHash"
              :options="optionsHash"
            ></b-form-select>
          </div>
          <div v-else>
            <b-alert v-if="selectSource == 'twitter'" show
              >ตัวอย่างการใส่ข้อมูล <br />
              https://twitter.com/username</b-alert
            >
            <b-alert v-else-if="selectSource == 'facebook'" show
              >ตัวอย่างการใส่ข้อมูล <br />
              https://facebook.com/username</b-alert
            >
            <b-alert v-else-if="selectSource == 'instagram'" show
              >ตัวอย่างการใส่ข้อมูล <br />
              https://instagram.com/username</b-alert
            >
            <b-alert v-else-if="selectSource == 'youtube'" show
              >ตัวอย่างการใส่ข้อมูล <br />
              https://youtube.com/username</b-alert
            >
            <b-alert v-else-if="selectSource == 'pantip'" show
              >ตัวอย่างการใส่ข้อมูล <br />
              https://pantip.com/profile/2116489 (หมายเลขสมาชิก)</b-alert
            >
            <b-alert v-else-if="selectSource == 'news'" show
              >ตัวอย่างการใส่ข้อมูล <br />
              ใส่ URL ของ Digital News เช่น https://dailynews.co.th/</b-alert
            >
            <b-alert v-else-if="selectSource == 'blockdit'" show
              >ตัวอย่างการใส่ข้อมูล <br />
              เช่น https://www.blockdit.com/username <br />
              หรือ https://www.blockdit.com/users/id</b-alert
            >
            <b-alert v-else-if="selectSource == 'tiktok'" show
              >ตัวอย่างการใส่ข้อมูล <br />
              เช่น https://www.tiktok.com/@username
            </b-alert>
            <b-form-select
              v-model="selectSource"
              :options="options"
            ></b-form-select>
          </div>
        </b-col>
        <!--------------------------------------------------profile --------------------------------------------------------------->
        <b-col sm="12" v-if="tabsMonitor == 'tabProfile'">
          <label class="mt-4" for="textarea-default"><b>ชื่อบัญชี</b></label>
          <b-form-tags
            :disabled="!selectSource"
            input-id="tags-pills"
            v-model="addTarget"
            tag-variant="light"
            tag-pills
            size="md"
            placeholder="Enter เพื่อเพิ่มบัญชี"
            :tag-validator="validator"
            @tag-state="onTagState"
            separator=" ,;"
            remove-on-delete
          ></b-form-tags>
        </b-col>
        <!--------------------------------------------------hashtag --------------------------------------------------------------->
        <b-col sm="12" v-else-if="tabsMonitor == 'tabHashtag'">
          <label class="mt-4" for="textarea-default"><b>ชื่อแฮชแท็ก</b></label>
          <b-form-tags
            input-id="tags-pills"
            v-model="addHashtag"
            tag-variant="light"
            tag-pills
            size="md"
            placeholder="Enter เพื่อเพิ่มแฮชแท็ก"
            remove-on-delete
          ></b-form-tags>
        </b-col>
        <!--------------------------------------------------avatar --------------------------------------------------------------->
        <b-col sm="12" v-else>
          <label class="mt-4" for="textarea-default"><b>ชื่อทีม</b></label>
          <b-form-input
            id="input-default"
            v-model="selectTeam"
            :disabled="!selectSource"
            placeholder="กรุณาใส่ชื่อทีม"
          ></b-form-input>
          <!-- <b-form-select v-model="selectTeam" :disabled='!selectSource' :options="optionsTeam" ></b-form-select> -->
          <label class="mt-4" for="textarea-default"><b>ชื่อบัญชี</b></label>
          <b-form-tags
            input-id="tags-pills"
            :disabled="!selectTeam"
            v-model="addAvatar"
            tag-variant="light"
            tag-pills
            size="md"
            remove-on-delete
            placeholder="Enter เพื่อเพิ่มบัญชี"
            :tag-validator="validator"
            @tag-state="onTagState"
            separator=" ,;"
          ></b-form-tags>
        </b-col>
      </b-row>
      <b-row class="my-1">
        <b-col sm="12" style="text-align: right">
          <br />
          <b-button class="btn btn-close" size="sm" @click="hideModal()"
            >ปิดหน้าต่าง</b-button
          >
          <b-button class="btn btn-save" size="sm" @click="addRowTarget()"
            >บันทึก</b-button
          >
        </b-col>
      </b-row>
    </vue-modaltor>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: {
    tabsMonitor: {
      type: String,
    },
  },
  computed: {
    ...mapGetters(["getAddDomain", "getListMonitorProfile", "getUpdateTable"]),
  },
  data() {
    return {
      selectSourceHash: "twitter",
      addHashtag: [],
      addTarget: [],
      addAvatar: [],
      selectTeam: null,
      selectSource: null,
      open: false,
      addDomain: "",
      optionsTeam: [
        { value: null, text: "กรุณาเลือกทีม", disabled: true },
        { value: "teamtest", text: "teamtest" },
        { value: true, text: "เพิ่มทีมใหม่" },
      ],
      options: [
        { value: null, text: "กรุณาเลือก source", disabled: true },
        { value: "facebook", text: "Facebook" },
        { value: "twitter", text: "Twitter" },
        { value: "youtube", text: "Youtube" },
        { value: "instagram", text: "Instagram" },
        { value: "news", text: "News" },
        { value: "pantip", text: "Pantip" },
        { value: "blockdit", text: "Blockdit" },
        { value: "tiktok", text: "Tiktok" },
      ],
      optionsHash: [
        { value: null, text: "กรุณาเลือก source", disabled: true },
        { value: "twitter", text: "Twitter" },
        { value: "tiktok", text: "Tiktok" },
      ],
    };
  },
  methods: {
    validator(tag) {
      if (this.selectSource == "twitter") {
        return tag.includes("https://twitter.com/");
      } else if (this.selectSource == "facebook") {
        return tag.includes("https://facebook.com/");
      } else if (this.selectSource == "instagram") {
        return tag.includes("https://instagram.com/");
      } else if (this.selectSource == "youtube") {
        return tag.includes("https://youtube.com/");
      } else if (this.selectSource == "tiktok") {
        return tag.includes("https://www.tiktok.com/@");
      } else {
        return tag;
      }
    },
    onTagState(valid, invalid, duplicate) {
      this.validTags = valid;
      this.invalidTags = invalid;
      this.duplicateTags = duplicate;
    },
    async addRowTarget() {
      if (this.tabsMonitor == "tabProfile") {
        await this.$store.dispatch("CreateMonitor", {
          source: this.selectSource,
          account: this.addTarget,
        });
      } else if (this.tabsMonitor == "tabHashtag") {
        await this.$store.dispatch("CreateMonitor", {
          source: this.selectSourceHash,
          hashtag: this.addHashtag,
        });
      } else {
        await this.$store.dispatch("CreateAvatar", {
          source: this.selectSource,
          account: this.addAvatar,
          team: this.selectTeam,
          avatar: true,
        });
      }
      this.addHashtag = [];
      this.addTarget = [];
      this.addAvatar = [];
      this.open = false;
       await this.$store.dispatch("fatchListMonitorUpdate", "test");
    },
    hideModal() {
      this.open = false;
    },
  },
};
</script>

<style  scoped>
.btn-close {
  color: #f8f9fa;
  background-color: #4c412b;
  border-color: #4c412b;
  box-shadow: 1px 1px 3px #666666;
}
.btn-save:hover {
  background: #fed16e;
  border-color: #fed16e;
}
.btn-save {
  background: #ede7dd;
  border-color: #ede7dd;
  color: #4c412b;
  box-shadow: 1px 1px 3px #666666;
}
td {
  vertical-align: middle;
}
.btn-add:hover {
  background-color: #504b3c;
  color: white;
}
.btn-add:hover .fa-plus {
  background-color: #504b3c;
}
.btn-add {
  background-color: #ede7dd;
  color: #504b3c;
  padding: 8px;
  padding-top: 5px;
  padding-bottom: 5px;
  border-radius: 25px;
  box-shadow: 1px 1px 3px #666666;
}

@media only screen and (min-width: 0px) and (max-width: 600px) {
  .btn-add {
    margin: auto;
    display: block;
    margin-top: 20px;
  }
}
</style>