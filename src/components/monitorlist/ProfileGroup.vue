<template>
    <div>
         <!-- avatar  -->
        <b-row class="mx-0 mb-5">
            <b-col lg="4" class="px-0 pr-lg-3 mb-2">
                <div class="gradient-bg h-100 p-2" style="">
                    <b-avatar class="shadow-sm rounded badge-light rounded-circle"
                        size="90px">
                        <i class="fa fa-group" style="font-size:36px; color: #776167;"></i>
                    </b-avatar>
                    <b-col v-if="groupDetails" class="text-center px-0">
                        <h4 class="mt-2 mb-0" style="color: #776167;">{{ groupDetails.group_name || 'N/A' }}</h4>
                        <p v-if="groupDetails.targetlist" class="mb-1 text-muted" style="font-size: 0.9rem;">
                            <!-- ประเภท: {{ groupDetails.category || 'N/A' }} <br>
                            แพลตฟอร์ม: {{ groupDetails.source || 'N/A' }} <br> -->
                            จำนวนสมาชิก: {{ groupDetails.targetlist.length || 'N/A' }} บัญชี
                        </p>
                    </b-col>
                </div>
            </b-col>
            <b-col lg="8" class="text-left px-0">
                <h5 class="font-weight-bold text-info p-0 mb-3">รายการสมาชิก</h5>
                <b-row v-if="groupDetails.targetlist" cols="2" cols-sm="3" cols-lg="4" cols-xl="6" class="h-75 align-items-center">
                    <b-col v-for="target in groupDetails.targetlist.slice(0, 5)" :key="target.id" class="px-0 mb-3">
                        <b-row class="m-0 text-center align-items-center">
                            <b-col style="cursor: pointer;" @click="linkToProfile(target)"  cols="12" class="px-1 mb-2">
                               <b-avatar :src="target.profile_image">
                            </b-avatar>
                            <img @click="openLink(target.link_original)" v-if="target.source == 'facebook'" src="@/assets/Facebook.png" class="social-img" />
                            <img @click="openLink(target.link_original)" v-if="target.source == 'twitter'" src="@/assets/Twitter.png" class="social-img" />
                            <img @click="openLink(target.link_original)" v-if="target.source == 'pantip'" src="@/assets/board.png" class="social-img" />
                            <img @click="openLink(target.link_original)" v-if="target.source == 'blockdit'" src="@/assets/Blockdit.png" class="social-img" />
                            <img @click="openLink(target.link_original)" v-if="target.source == 'instagram'" src="@/assets/Instagram.png" class="social-img" />
                            <img @click="openLink(target.link_original)" v-if="target.source == 'youtube'" src="@/assets/Youtube.png" class="social-img" />
                            <img @click="openLink(target.link_original)" v-if="target.source == 'news'" src="@/assets/News.png" class="social-img" />
                            <img @click="openLink(target.link_original)" v-if="target.source == 'tiktok'" src="@/assets/Tiktok.png" class="social-img" />
                            <img @click="openLink(target.link_original)" v-if="target.source == 'threads'" src="@/assets/Threads.png" class="social-img" />
                                <!-- <b-avatar
                                    v-if="groupDetails.targetlist.length > 5"
                                    :text="'+' + (groupDetails.targetlist.length - 5)"
                                    variant="secondary"
                                ></b-avatar> -->
                            </b-col>
                            <b-col class="text-truncate">
                                {{ target.name || target.uid || 'N/A' }}
                            </b-col>
                        </b-row>
                    </b-col>
                    <b-col v-if="groupDetails.targetlist.length > 5" class="px-0 mb-3">
                        <b-row  class="m-0 text-center align-items-center">
                            <b-col @click="openGroupMembers"
                                    style="cursor: pointer;" cols="12" class="px-1 mb-2">
                                <b-avatar
                                    
                                    :text="'+' + (groupDetails.targetlist.length - 5)"
                                    variant="secondary"
                                ></b-avatar>
                            </b-col>
                            <b-col>
                                สมาชิกอื่น ๆ
                            </b-col>
                        </b-row>
                    </b-col>
                </b-row>
            </b-col>
        </b-row>     

        <!-- time line -->
        <b-row id="timeline-container" class="m-0">
            <b-col id="chart" cols="12" class="px-0">
                <!-- <b-row id="timeline-container" class="align-items-center mb-3 mx-0">
                    <b-col cols="12" xl="auto" class="px-0 text-md-left">
                        <h4 class="mb-0">Posts Timeline</h4>
                    </b-col>
                    <b-col cols="12" lg="6" xl="auto" class="px-1">
                        <b-form-group label-for="search-input" class="mt-3 mt-xl-0 col-12 col-sm px-0 mb-0">
                            <b-input-group-append>
                                <b-form-input id="search-input" @input="checkSearch" v-model="search" placeholder="ค้นหา"
                                    class="w-100 mr-2"></b-form-input>
                                <b-button size="sm" variant="info" pill :pressed="false" @click="onSearch()" class="shadow-r px-4">ค้นหา</b-button>
                            </b-input-group-append>
                        </b-form-group>
                    </b-col>
                    <b-col cols="12" lg="6" xl="" class="px-0 ml-xl-auto">
                        <b-row class="m-0 justify-content-end flex-lg-nowrap mt-3 mt-xl-0">
                            <b-col cols="auto" class="px-0 mb-3 mb-sm-0">
                                <date-picker
                                    v-model="valueDate"
                                    type="date"
                                    range
                                    placeholder="เลือกช่วงเวลา"
                                    size="sm"
                                    :disabled-date="(date) => date >= new Date()"
                                    value-type="format"
                                    format="YYYY-MM-DD"
                                    @change="checkDateRange()"
                                    id="date-domain"
                                    class="">
                                    {{ valueDate }}
                                </date-picker>
                            </b-col>
                            <b-col cols="auto" class="px-0 pl-2">
                                <div class="text-center">
                                    เรียงจาก :
                                    <b-button class="sort-btn" @click="toggleSort" pill size="sm">
                                         {{ selectedSort === 'desc' ? 'ใหม่ → เก่า' : 'เก่า → ใหม่' }}
                                    </b-button>
                                </div>
                            </b-col>
                        </b-row>
                    </b-col>
                </b-row> -->
                <div class="position-relative text-right filter-btn">
                    <b-button size="sm" :variant="showFilters ? 'info' : 'outline-info'" @click="showFilters = !showFilters" pill
                    class="d-inline-flex align-items-center ">
                    <i class="fas fa-sliders mr-2"></i>
                    <!-- <b-icon icon="sliders" class="mr-1 small"></b-icon> -->
                    <span v-if="showFilters" class="small">Hide</span>
                    <span v-else class="small">Show</span>
                    <!-- <b-badge v-if="activeFilterCount" variant="light" class="ml-2">{{ activeFilterCount }}</b-badge> -->
                    </b-button>
                </div>
               
                <b-card v-if="showFilters" class="mb-3 shadow-sm" style="border-radius: 20px;">
                    <b-alert show variant="info">
                    <!-- <b-icon icon="info-circle" id="info-date-note" variant="info" class="float-right"></b-icon>
                    <b-tooltip target="info-date-note" placement="bottom">
                        ถ้าเลือกมากกว่า 2 วัน ระบบจะตั้งค่าเริ่มต้นเป็น "รายวัน" และเรียงตาม "Engagement"
                    </b-tooltip> -->
                    <div class="text-left"> <b-icon icon="info-circle" class="" variant="info"></b-icon> <small>คำค้นหา (AND
                        ใช้ช่องว่างหรือ +, OR
                        ใช้ ,)
                        <span class="text-muted"> ตัวอย่าง: <code>คาเฟ่ บรรยากาศดี, มัทฉะ อร่อย</code> = (คาเฟ่
                            AND บรรยากาศดี) OR (มัทฉะ AND อร่อย)</span>
                        </small></div>
                    </b-alert>
                    <b-form @submit.prevent="handleSearch">
                        <b-row>
                            <b-col cols="12" md="8" class="pr-md-0">
                            <b-form-group label="" label-for="kw" class="pr-md-3 flex-grow-1">
                                <b-form-input :disabled="loadingTimeline" id="kw" v-model.trim="formFilters.keyword"
                                placeholder="เช่น คาเฟ่ บรรยากาศดี,มัทฉะ อร่อย" />
                            </b-form-group>
                            </b-col>

                            <b-col cols="12" md="4">
                            <!-- Sentiment -->
                            <b-form-group class="pr-md-3 checkbox-v">
                                <b-form-checkbox-group v-model="formFilters.sentiment" :options="sentimentOptions" />
                            </b-form-group>
                            </b-col>
                            <!-- <b-col cols="12" md="6" class="d-none">
                            <b-form-group label="" label-for="accounts" class="pr-md-3">
                                <b-form-tags id="accounts"  v-model="formFilters.HashtagsInput" tag-variant="light" tag-pills size="md"
                                separator=" ,;" placeholder="ค้นหา hashtag" no-add-on-enter add-on-change remove-on-delete />
                            </b-form-group>
                            </b-col> -->
                            <b-col cols="12" md="8"  class="pr-md-0">
                                <b-form-group label="" label-for="accounts" class="pr-md-3">
                                    <b-form-tags :disabled="loadingTimeline" id="accounts" v-model="formFilters.accountsInput" tag-variant="light" tag-pills size="md"
                                    separator=",;" placeholder="ค้นหาบัญชี (ใส่ uid หรือ url หลายบัญชีคั่นด้วย ,)" no-add-on-enter
                                    add-on-change remove-on-delete />
                                </b-form-group>
                            </b-col>

                            <b-col cols="12" md="4">
                                <b-form-select :disabled="loadingTimeline" v-model="formFilters.source" class="mb-2" :options="sourceOptions" />
                            </b-col>

                            <b-col cols="12" md="4">

                            <b-form-select 
                                v-model="formFilters.sort_by" class="mb-2" 
                                :disabled="loadingTimeline"
                                :options="[
                                { value: 'asc', text: 'โพสต์เก่าสุด' },
                                { value: 'desc', text: 'โพสต์ล่าสุด' },
                                { value: 'engagement', text: 'Engagement' },
                            ]" />

                            </b-col>
                            <b-col cols="12" md="4" class="">
                            <section id="date-picker">
                                <date-picker v-model="valueDate" type="date" range placeholder="เลือกช่วงเวลา" class="w-100" size="sm"
                                :disabled-date="(date) => date >= new Date()"
                                :disabled="loadingTimeline" value-type="format" format="YYYY-MM-DD"
                                id="date-domain">{{ valueDate }}</date-picker>
                            </section>
                            </b-col> 
                            <b-col cols="12" md="4">
                                <b-row align-h="end" class=" mt-2 mt-md-0 mx-0" justify="center">
                                    <b-col cols="auto" md="auto" class="px-0">
                                        <div class="align-self-end">
                                        <b-button type="submit"
                                        size="sm" 
                                        variant="info" class="mr-2 px-4" :disabled="loadingTimeline">
                                            ค้นหา
                                        </b-button>
                                        <b-button size="sm" variant="outline-secondary" @click="resetFilters" :disabled="loadingTimeline">
                                            ล้างค่า
                                        </b-button>
                                        </div>
                                    </b-col>
                                </b-row>
                            </b-col>                                                                                                                     
                        </b-row>
                    </b-form>
                </b-card>
                <div  v-if="!showFilters" class="py-2 px-2  shadow-sm card-hide" style="border-radius: 20px;">
                    <!-- {{ pretty }} -->
                    <div class="d-flex flex-wrap align-items-center">
                    <!-- คีย์เวิร์ด -->
                    <div v-if="pretty.keyword" class="mr-2 my-1 bold">
                        <b-icon icon="search" class="mr-1"></b-icon> {{ pretty.keyword }}
                    </div>

                    <!-- <div v-if="formFilters.keyword && formFilters.hashtags && formFilters.hashtags.length" class="mr-2 my-1"> / </div> -->

                    <!-- เซนทิเมนต์ -->
                    <span v-if="pretty.sentiments.length !== 3" class="">
                        <b-badge pill variant="light" class="mr-2 py-2 my-1">
                        <span v-for="(s, i) in pretty.sentiments" :key="s.value">
                            <b-icon :icon="s.icon" class="mr-1"></b-icon>{{ s.text }} <span v-if="i > 1"> / </span>
                        </span>

                        </b-badge>
                    </span>
                    <!-- แพลตฟอร์ม -->
                    <b-badge pill variant="light" class="mr-2  py-2 my-1">
                        <b-icon icon="collection" class="mr-1"></b-icon>{{ formFilters.source || 'All Platforms' }}
                    </b-badge>

                    <!-- จัดเรียง -->
                    <b-badge v-if="pretty.sortBy" pill variant="light" class="mr-2  py-2 my-1">
                        <b-icon icon="sort-down" class="mr-1"></b-icon>{{ pretty.sortBy }}
                    </b-badge>

                    <!-- ช่วงเวลา -->
                    <b-badge v-if="pretty.dateRange" pill variant="light" class="mr-2 py-2 my-1">
                        <b-icon icon="calendar-date" class="mr-1"></b-icon>{{ pretty.dateRange }}
                    </b-badge>
                    </div>
                </div>
            </b-col>
            <b-col cols="12" class="text-center mt-10 py-4 pb-0" v-if="loadingChart">
                <vue-element-loading :active="loadingChart" size="30" background-color="rgba(255, 255, 255, 0.5)" color="#17a2b891"
                spinner="bar-fade-scale" />
            </b-col>
            <b-col v-else cols="12" class="px-0">
                <StaticTimeline :datachart="datachart" />
                <b-col cols="12" class="px-0">
                    <div class="text-left px-4">
                    <span class="">สถิติรายชั่วโมง </span>
                    <b-icon icon="info-circle" variant="info" role="button" id="popover-button-variant" tabindex="0"
                        class="flaot-right ml-2" />
                    </div>
    
                    <b-popover target="popover-button-variant" variant="info" triggers="focus">
                    <template #title>
                        <i class="fa fa-lightbulb-o" aria-hidden="true"></i> <b>Tip</b>
                    </template>
                    <div> <i class="fa fa-plus-circle" aria-hidden="true"></i> ขยายข้อมูลกราฟ</div>
                    <div> <i class="fa fa-minus-circle" aria-hidden="true"></i> ลดขนาดข้อมูลกราฟ</div>
                    <div>
                        <img width="15" height="15" src="https://img.icons8.com/ios/50/select-none.png" alt="select-none" />
                        เลือกช่วงเวลาดูโพสต์ด้านล่าง
                    </div>
                    <div><b>double click</b> เพื่อเลือกช่วงเวลาที่จะดู</div>
                    <div><i class="fa fa-hand" aria-hidden="true"></i> ใช้เลื่อนดูกราฟ</div>
                    <div><i class="fa fa-home" aria-hidden="true"></i> reset กราฟ</div>
                    </b-popover>
    
                    <apexchart ref="chart" type="line" height="350" :options="chartOptions" :series="series" />
                </b-col>
                <b-col>
                    <SentimentUsers :filters="submittedFilters" 
                    @filterAccount="updateAccount"/>
                </b-col>
            </b-col>
            <b-col cols="12" class="px-0">
                <!-- <ExportExcelButton class="mt-md-0 " :posts="posts" :filters="formFilters"
                :disabled="loadingTimeline || (Array.isArray(posts) && posts.length === 0)" inline-comments="json"
                :comments-limit="20" style="right: 5px;" v-if="!loadingTimeline" /> -->
                <div  v-if="!loadingTimeline && !loadingChart">
                    <ExportExcelButton  :posts="postForExport" :filters="formFilters"
                        :disabled="loadAllPost || (Array.isArray(postForExport) && postForExport.length === 0)" :full-export="true"
                        :prefer-single-shot="true"  inline-comments="json" :comments-limit="20" v-if="!loadAllPost" />
                        
                </div>
                <div v-if="!loadingTimeline && !loadingChart" data-v-633a0eda="" class="text-right allpost"> 
                    ทั้งหมด <b data-v-633a0eda="">{{total_posts || 0 | numFormat}}</b> โพสต์
                </div>
                <vue-element-loading 
                    :active="loadingTimeline" class="h-100" size="80" 
                    background-color="rgba(255, 255, 255, 0.3)"
                    color="#b6ac9a"
                />
                <Timeline :timelineItems="posts" :keyword="formFilters.keyword"/>
                <b-col v-if="totalPage > 1 && !loadingTimeline && !loadingChart" class="p-0 mb-5">
                    <b-row v-if="page !== totalPage && (totalPage > page)" class="justify-content-md-center align-items-center my-3 mx-0">
                        <div class="text-center">
                            <b-button @click="onPageChange" class="sort-btn" pill size="sm">
                                ดูเพิ่มเติม
                            </b-button>
                        </div>
                    </b-row>
                    <b-row v-else class="justify-content-center align-items-center my-3 mx-0">
                        <div class="text-center">
                            <b-button @click="resetPage" class="sort-btn" pill size="sm">
                                ย่อ timeline
                            </b-button>
                        </div>
                    </b-row>
                </b-col>
            </b-col>
        </b-row>
        <GroupMembers :groupName="groupDetails.group_name" :openModal="openModal" :targetlist="groupDetails.targetlist" @close="openModal = false"/>
    </div>
    
</template>
<script>
// import Swal from 'sweetalert2'
import 'vue-multiselect/dist/vue-multiselect.min.css';
import moment from "moment";
import Timeline from "./_Timeline.vue";
import GroupMembers from './modals/_GroupMembersModal.vue';
import ExportExcelButton from "@/components/timeline/ExportExcelButton.vue";
import StaticTimeline from '@/components/timeline/StaticTimeline.vue';
import SentimentUsers from './_SentimentUsers.vue';
export default {
    components: {
        Timeline,
        GroupMembers,
        ExportExcelButton,
        StaticTimeline,
        SentimentUsers,
    },
    data() {
        const today = moment();
        const past7Days = moment().subtract(0, 'days'); // รวมวันนี้ = 7 วัน
        return {
            valueDate: [past7Days.format('YYYY-MM-DD'), today.format('YYYY-MM-DD')],
            selectedSource: null,
            sentiment: null,
            selectedSort: "desc",
            totalPage: null,
            total_posts: 0,
            limit: 50,
            page: 1,
            posts: [],
            postForExport:[],
            lastParamsSnapshot: null, // เก็บ params ล่าสุด
            loading: false,
            loadingTimeline: false,
            loadingChart: false,
            loadAllPost: false,
            groupDetails: {},
            openModal: false,
            showFilters: true,
            search: '',
            sentimentOptions: [
                { text: "Positive", value: "1" },
                { text: "Neutral", value: "0" },
                { text: "Negative", value: "-1" }
            ],
            sourceOptions: [
                { value: null, text: "All Platform" },
                { value: "facebook", text: "Facebook" },
                { value: "twitter", text: "X" },
                { value: "pantip", text: "Board" },
                { value: "news", text: "News" },
                { value: "youtube", text: "YouTube" },
                { value: "instagram", text: "Instagram"},
                { value: "blockdit", text: "Blockdit"},
                { value: "tiktok", text: "Tiktok" },
                { value: "threads", text: "Threads" }
            ],
            formFilters: {
                group_id: this.$route.query.id,
                sentiment: ["1", "0", "-1"],
                keyword: "",
                view_mode: "posts",
                source: null,
                sort_by: 'desc',
                page: 1,
                hashtags: [],
                accountsInput: [],
            },
            submittedFilters: {},
            datachart: null,
            series: [],
            chartOptions: {
                colors: ['#ff962e', '#17a2b8', '#e75aa1'],
                chart: {
                type: 'line',
                fontFamily: 'Prompt, FontAwesome, sans-serif',
                toolbar: {
                    show: true,
                    tools: { download: true, selection: true, zoom: true, pan: true, reset: true }
                }
                },
                stroke: { curve: 'smooth', width: 3 },
                markers: { size: 5 },
                legend: { position: 'top' },
                xaxis: {
                type: 'datetime',
                labels: {
                    datetimeUTC: false,
                    formatter: (v) => {
                    const ts = Number(v)
                    if (!Number.isFinite(ts)) return ''
                    return new Intl.DateTimeFormat('th-TH', {
                        timeZone: 'Asia/Bangkok',
                        hourCycle: 'h23',
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                    }).format(ts)
                    }
                }
                },
                tooltip: {
                shared: true,
                x: {
                    formatter: (v) => {
                    const ts = Number(v)
                    if (!Number.isFinite(ts)) return ''
                    return new Intl.DateTimeFormat('th-TH', {
                        timeZone: 'Asia/Bangkok',
                        hourCycle: 'h23',
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    }).format(ts)
                    }
                }
                },
                yaxis: [
                    { seriesName: 'Posts', title: { text: 'Posts' }, min: 0, labels: { formatter: v => Math.round(v).toLocaleString() || 0 } },
                    { seriesName: 'Messages', title: { text: 'Messages' }, min: 0, labels: { formatter: v => Math.round(v).toLocaleString() || 0 } },
                    { seriesName: 'Engagement', title: { text: 'Engagement' }, min: 0, opposite: true, labels: { formatter: v => Math.round(v).toLocaleString() || 0 } }
                ],
                noData: { text: 'กำลังโหลดข้อมูล...' }
            },
        }
    },
    computed: {
        pretty() {
      const f = this.filters || this.formFilters || {};

      // sentiment mapping
      const sentimentsMap = {
        '1': { text: 'บวก', variant: 'success', icon: 'emoji-smile' },
        '0': { text: 'กลาง', variant: 'secondary', icon: 'emoji-neutral' },
        '-1': { text: 'ลบ', variant: 'danger', icon: 'emoji-frown' }
      };

      const sentiments = Array.isArray(f.sentiment)
        ? f.sentiment
          .filter(v => v !== null && v !== '' && typeof v !== 'undefined')
          .map(v => ({ ...sentimentsMap[String(v)] || { text: v, variant: 'secondary', icon: 'emoji-neutral' }, value: v }))
        : [];

      const keyword = f.keyword && String(f.keyword).trim()
        ? String(f.keyword).trim()
        : '';

      // รองรับทั้ง hashtags และ HashtagsInput
      const hashtags = (f.hashtags || f.HashtagsInput || []).filter(Boolean);

      // source: กรอง null ออก แล้ว join
      const sourceList = Array.isArray(f.source) ? f.source.filter(s => s) : [];
      const sourceText = sourceList.join(', ');

      const viewModeMap = { posts: 'ตามเวลา', daily: 'รายวัน' };
      const viewMode = viewModeMap[f.view_mode] || '';

      const sortMap = {
        descend: 'โพสต์เก่าสุด',
        recent: 'โพสต์ล่าสุด',
        engagement: 'Engagement'
      };
      const sortBy = sortMap[f.sort_by] || 'โพสต์ล่าสุด';

      // วันที่: ใช้ startLocal/endLocal ถ้ามี ไม่งั้นลองดู valueDate
      let dateRange = '';
      if (f.startLocal && f.endLocal) {
        dateRange = this.formatRange(f.startLocal, f.endLocal);
      } else if (Array.isArray(this.valueDate) && this.valueDate.length === 2) {
        dateRange = `${this.valueDate[0]} → ${this.valueDate[1]}`;
      }

      return { keyword, sentiments, hashtags, sourceText, viewMode, sortBy, dateRange };
    },
    },
    methods: {
        async updateAccount(val) {
            // console.log("filterAccount ==== ", val);
            this.formFilters.accountsInput = val;
            this.showFilters = false;
            if (this.formFilters.accountsInput) {
                await this.handleSearch();
            }else {
                this.resetFilters();
            }
        },
        linkToProfile(item) {
            const routeData = this.$router.resolve({
                name: "MonitorProfile",
                query: {
                    id: item._id,
                    uid: item.uid?.replace('#', ''),  // ลบ '#' ออกถ้ามี
                    source: item.source,
                    type: 'targetlist'
                },
            });
            window.open(routeData.href, "_blank"); // เปิดลิงก์ในหน้าต่างใหม่
        },
        openGroupMembers() {
            this.openModal = true;
            // console.log("Group Members Modal Opened");
        },
        checkSearch() {
            if (!this.search) {
                this.page = 1; // รีเซ็ตกลับหน้าแรก
                this.posts = []
                this.apiGetPost();
            }
        },
        resetFilters() {
            this.formFilters = {
                sentiment: ["1", "0", "-1"],
                keyword: "",
                view_mode: "posts",
                source: null,
                sort_by: 'desc',
                // limit: 50,
                page: 1,
                hashtags: [],
                accountsInput: [],
            }
            this.page = 1; // รีเซ็ตกลับหน้าแรก
            this.posts = []
            // this.apiGetPost();
            this.handleSearch();
        },
        async checkSubmittedFilters() {
            return {
                ...this.formFilters,
                from: this.valueDate?.[0] ?? null,
                to: this.valueDate?.[1] ?? null,
                sentiment: Array.isArray(this.formFilters?.sentiment)
                    ? this.formFilters.sentiment.join(',')
                    : this.formFilters?.sentiment ?? ''
            };
        },
        async handleSearch() {
                this.submittedFilters = await this.checkSubmittedFilters();
            // this.formFilters = { ...this.formFilters };
            // this.valueDate = [...this.valueDate];
            // clearTimeout(this.debounceTimeout);
            // this.debounceTimeout = setTimeout(() => {
            //     this.page = 1; // รีเซ็ตกลับหน้าแรก
            //     // this.limit = 10
            // }, 500);
            this.posts = []
            await this.fetchDataGroupChart();
            await this.apiGetPost();
        },
        onPageChange() {
            this.page = this.page + 1;
            // console.log("current page : ", this.page);
            // this.limit = (this.page - 1) * 10
            this.apiGetPost()

            // Scroll ไปที่ element id="total-post"
            this.$nextTick(() => {
                const el = document.getElementById('total-post');
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                }
            });
        },
        resetPage() {
            this.page = 1;
            // this.limit = 10;
            this.posts = [];
            this.apiGetPost();
        },
        checkDateRange() {
            if (!this.valueDate || this.valueDate.length < 2) return;

            const start = new Date(this.valueDate[0]);
            const end = new Date(this.valueDate[1]);

            // คำนวณจำนวนวันต่างกัน
            const diffTime = Math.abs(end - start);
            const diffDays = diffTime / (1000 * 60 * 60 * 24) + 1 ;
            // console.log("diff === ", diffDays);
            
            if (diffDays > 7) {
                alert("เลือกช่วงเวลาได้ไม่เกิน 7 วัน");
                this.valueDate = []; // reset ค่า
            }else {
                // console.log('check');
                this.page = 1; // reset page
                this.apiGetPost();
            }
        },
        toggleSort() {
            this.selectedSort = this.selectedSort === "asc" ? "desc" : "asc";
            this.apiGetPost();
        },
        handleSource(source) {
            this.selectedSource = source;
        },
        parseOffsetToMs(tzStr) {
        const m = String(tzStr || '').trim().match(/^([+-])(\d{2}):?(\d{2})$/)
        if (!m) return 0
        const sign = m[1] === '+' ? 1 : -1
        const hh = parseInt(m[2], 10) || 0
        const mm = parseInt(m[3], 10) || 0
        return sign * (hh * 60 + mm) * 60 * 1000
        },
        setNoDataText(text) {
            const patch = { noData: { text } }
            if (this.$refs.chart && this.$refs.chart.updateOptions) {
                this.$refs.chart.updateOptions(patch, false, true)
            } else if (this.$refs.chart && this.$refs.chart.chart && this.$refs.chart.chart.updateOptions) {
                this.$refs.chart.chart.updateOptions(patch, false, true)
            } else {
                this.chartOptions = Object.assign({}, this.chartOptions, patch)
            }
        },
        isAllZero(rows) {
            return rows.length > 0 && rows.every(r =>
                Number(r.post_count || 0) === 0 &&
                Number(r.engagement_sum || 0) === 0 &&
                Number(r.message_sum || 0) === 0
            )
        },
        buildSummaryFromSeries({ rows, tz, posts, messages, engagements }) {
            // --- ปรับค่าคอนฟิกเงื่อนไขพีคแรกที่นี่ ---
            const FIRST_PEAK_MIN = 10;       // พีคแรกต้องไม่น้อยกว่า 100
            const USE_POSITIVE_MEDIAN = true; // true = คิด median จากค่า > 0, false = รวมศูนย์ด้วย
            const REQUIRE_LOCAL_MAX = true;   // true = ต้องเป็น local maxima (≥ เพื่อนบ้าน)
            // --- เกณฑ์สรุปหลังพีค ---
            const PRE_HOURS = 3, POST_HOURS = 3;
            const FOLLOW_MIN_PCT = 15, STRONG_THRESHOLD = 25;

            // รวมยอด
            const totals = rows.reduce((acc, r) => {
                acc.post += Number(r.post_count || 0);
                acc.msg += Number(r.message_sum || 0);
                acc.eng += Number(r.engagement_sum || 0);
                return acc;
            }, { post: 0, msg: 0, eng: 0 });

            const fmtLocal = (ms) => new Intl.DateTimeFormat('th-TH', {
                timeZone: 'Asia/Bangkok', hourCycle: 'h23',
                day: '2-digit', month: 'short', year: 'numeric',
                hour: '2-digit', minute: '2-digit'
            }).format(ms);

            // ยูทิลคำนวณเฉลี่ยช่วง
            const avgRange = (arr, s, e) => {
                const slice = arr.slice(Math.max(0, s), Math.min(arr.length, e));
                if (!slice.length) return 0;
                const sum = slice.reduce((acc, it) => acc + Number(it[1] || 0), 0);
                return sum / slice.length;
            };

            // ยูทิล median
            const median = (nums) => {
                if (!nums.length) return 0;
                const a = nums.slice().sort((x, y) => x - y);
                const mid = Math.floor(a.length / 2);
                return a.length % 2 ? a[mid] : (a[mid - 1] + a[mid]) / 2;
            };

            // ---------- หา "พีคสูงสุด" ----------
            let peakEngIdx = -1, peakEngVal = -Infinity;
            for (let i = 0; i < engagements.length; i++) {
                const v = Number(engagements[i][1] || 0);
                if (v > peakEngVal) { peakEngVal = v; peakEngIdx = i; }
            }
            const peakEngTs = peakEngIdx >= 0 ? engagements[peakEngIdx][0] : null;

            // ---------- หา "พีคแรก" ด้วยเงื่อนไข ≥100 และ > median ----------
            const engValsAll = engagements.map(p => Number(p?.[1] || 0));
            const engValsPos = engValsAll.filter(v => v > 0);
            const med = median(USE_POSITIVE_MEDIAN ? engValsPos : engValsAll);

            let startPeakIdx = -1;
            for (let i = 0; i < engagements.length; i++) {
                const cur = Number(engagements[i][1] || 0);
                if (cur < FIRST_PEAK_MIN) continue;       // ต้อง ≥ 100
                if (!(cur > med)) continue;               // ต้อง > median

                if (REQUIRE_LOCAL_MAX) {
                const prev = i > 0 ? Number(engagements[i - 1][1] || 0) : -Infinity;
                const next = i + 1 < engagements.length ? Number(engagements[i + 1][1] || 0) : -Infinity;
                if (cur < prev || cur < next) continue; // ไม่ใช่ local maxima
                }
                startPeakIdx = i;                          // เจอตัวแรกตามเกณฑ์
                break;
            }

            // ถ้าไม่พบเลย ให้ fallback เป็น “ชั่วโมงแรกที่ ≥100” หรือ “ชั่วโมงแรกที่ >0”
            if (startPeakIdx === -1) {
                const idxGE100 = engagements.findIndex(p => Number(p?.[1] || 0) >= FIRST_PEAK_MIN);
                if (idxGE100 !== -1) startPeakIdx = idxGE100;
                else {
                const idxGT0 = engagements.findIndex(p => Number(p?.[1] || 0) > 0);
                if (idxGT0 !== -1) startPeakIdx = idxGT0;
                }
            }

            const startPeakTs = startPeakIdx >= 0 ? engagements[startPeakIdx][0] : null;

            // ---------- สรุปหลัก: เปรียบเทียบ “หลังพีคสูงสุด” ----------
            let text, surgeDetail = null;
            if (peakEngIdx >= 0 && posts.length === engagements.length) {
                const preStart = Math.max(0, peakEngIdx - PRE_HOURS);
                const preEndEx = peakEngIdx;
                const postStart = peakEngIdx + 1;
                const postEndEx = Math.min(posts.length, postStart + POST_HOURS);

                const postAvgBefore = avgRange(posts, preStart, preEndEx);
                const postAvgAfter = avgRange(posts, postStart, postEndEx);
                const postLiftPct = postAvgBefore === 0 ? (postAvgAfter > 0 ? 100 : 0)
                : ((postAvgAfter - postAvgBefore) / postAvgBefore) * 100;

                const enoughWindow = (preEndEx > preStart) && (postEndEx > postStart);
                this.totals_count = totals;

                if (enoughWindow) {
                const intensity = postLiftPct >= STRONG_THRESHOLD ? 'เพิ่มสูงมากขึ้น'
                    : (postLiftPct >= FOLLOW_MIN_PCT ? 'เพิ่มขึ้น' : 'ไม่ได้พุ่งตามอย่างมีนัยสำคัญ');
                if (postLiftPct >= FOLLOW_MIN_PCT) {
                    text = `Engagement มียอดสูงที่สุดช่วง ${fmtLocal(peakEngTs)} และหลังจากนั้นโพสต์${intensity} (${postLiftPct.toFixed(0)}%) เมื่อเทียบกับช่วงก่อนพีค`;
                } else {
                    text = `แม้ Engagement จะมียอดสูงสุดช่วง ${fmtLocal(peakEngTs)} แต่โพสต์${intensity} (${postLiftPct.toFixed(0)}%)`;
                }
                surgeDetail = { peakEngTs, postAvgBefore, postAvgAfter, postLiftPct };
                } else {
                text = `พบ Engagement เริ่มพุ่งสูงขึ้นวันที่ ${fmtLocal(peakEngTs)} แต่ข้อมูลก่อน/หลังไม่เพียงพอสำหรับสรุปการดีดตัวของโพสต์`;
                }
            } else {
                // fallback แนวโน้มรวม
                const takeAvg = (arr, n, fromEnd = false) => {
                if (!arr.length) return 0;
                let slice = fromEnd ? arr.slice(-n) : arr.slice(0, n);
                if (!slice.length) slice = arr;
                const sum = slice.reduce((s, it) => s + Number(it[1] || 0), 0);
                return sum / slice.length;
                };
                const headN = 6, tailN = 6;
                const postAvgHead = takeAvg(posts, headN, false);
                const postAvgTail = takeAvg(posts, tailN, true);
                const postChange = postAvgHead === 0 ? (postAvgTail > 0 ? 100 : 0)
                : ((postAvgTail - postAvgHead) / postAvgHead) * 100;
                const trend = postChange > 10 ? `เพิ่มขึ้น ${postChange.toFixed(0)}%`
                : postChange < -10 ? `ลดลง ${Math.abs(postChange).toFixed(0)}%` : 'ทรงตัว';
                text = `ภาพรวมชั่วโมงล่าสุดที่แสดง: โพสต์รวม ${this.fmtNum(totals.post)} ข้อความรวม ${this.fmtNum(totals.msg)} และการมีส่วนร่วมรวม ${this.fmtNum(totals.eng)} โดยแนวโน้มโพสต์โดยรวม${trend}`;
            }

            // ---------- สรุป “รอบแรก” หลังเริ่มพีคครั้งแรก ----------
            // กันซ้ำถ้าจุดพีคเริ่ม = จุดพีคสูงสุด (เวลาเดียวกัน)
            const samePeak = (startPeakIdx >= 0 && peakEngIdx >= 0 && startPeakIdx === peakEngIdx);

            if (startPeakIdx >= 0 && posts.length === engagements.length) {
                const preStart2 = Math.max(0, startPeakIdx - PRE_HOURS);
                const preEndEx2 = startPeakIdx;
                const aftStart2 = startPeakIdx + 1;
                const aftEndEx2 = Math.min(posts.length, aftStart2 + POST_HOURS);
                if (preEndEx2 > preStart2 && aftEndEx2 > aftStart2) {
                const preAvg2 = avgRange(posts, preStart2, preEndEx2);
                const aftAvg2 = avgRange(posts, aftStart2, aftEndEx2);
                const pct2 = preAvg2 === 0 ? (aftAvg2 > 0 ? 100 : 0) : ((aftAvg2 - preAvg2) / preAvg2) * 100;
                const intensity2 = pct2 >= STRONG_THRESHOLD ? 'เพิ่มสูงมากขึ้น'
                    : (pct2 >= FOLLOW_MIN_PCT ? 'เพิ่มขึ้น' : 'ไม่ได้พุ่งตามอย่างมีนัยสำคัญ');
                const firstRoundText = pct2 >= FOLLOW_MIN_PCT
                    ? `Engagement เริ่มพุ่งสูงขึ้นตั้งแต่ประมาณ ${fmtLocal(startPeakTs)} โพสต์${intensity2} (${pct2.toFixed(0)}%) เมื่อเทียบกับช่วงก่อนหน้า`
                    : `Engagement เริ่มพุ่งสูงขึ้นตั้งแต่ประมาณ ${fmtLocal(startPeakTs)} โพสต์${intensity2} (${pct2.toFixed(0)}%)`;

                // ถ้าเวลาเดียวกัน ให้แสดงแค่ข้อความเดียว ไม่พรีเพนด์ซ้ำ
                if (!samePeak) {
                    text = text ? `${firstRoundText}\n${text}` : firstRoundText;
                } else if (!text) {
                    // เผื่อกรณีข้อความหลักไม่ถูกตั้งค่า
                    text = firstRoundText;
                }
                }
            }

            // ---------- bullets ----------
            const bullets = [];
            if (startPeakTs != null) {
                bullets.push(`Engagement เริ่มพุ่งสูงขึ้นช่วง ${fmtLocal(startPeakTs)} `);//(เกณฑ์: ≥${FIRST_PEAK_MIN} และ > ค่ากลาง ≈ ${this.fmtNum(Math.round(med))})
            }
            if (peakEngTs != null && Number.isFinite(peakEngVal)) {
                // ถ้าเวลาเดียวกัน ไม่ต้องเพิ่มบูลเล็ตซ้ำ
                if (!samePeak) {
                bullets.push(`Engagement พุ่งสูงสุดช่วง ${fmtLocal(peakEngTs)} (≈ ${this.fmtNum(peakEngVal)})`);
                }
            }

            // พีคของโพสต์
            let peakPostIdx = -1, peakPostVal = -Infinity;
            for (let i = 0; i < posts.length; i++) {
                const v = Number(posts[i][1] || 0);
                if (v > peakPostVal) { peakPostVal = v; peakPostIdx = i; }
            }
            if (peakPostIdx >= 0) {
                bullets.push(`ความถี่ในการโพสต์สูงสุดช่วง ${fmtLocal(posts[peakPostIdx][0])} (${this.fmtNum(peakPostVal)} โพสต์)`);
            }

            // เฉลี่ย/ช่วงเวลา
            const hourCount = posts.length || 1;
            bullets.push(`เฉลี่ยต่อชั่วโมง: โพสต์ ${this.fmtNum(Math.round(totals.post / hourCount))} | ข้อความ ${this.fmtNum(Math.round(totals.msg / hourCount))} | Engagement ${this.fmtNum(Math.round(totals.eng / hourCount))}`);
            if (posts.length > 1) {
                const start = posts[0][0], end = posts[posts.length - 1][0];
                this.dates = `ช่วงเวลา ${fmtLocal(start)} – ${fmtLocal(end)}`;
            }

            return {
                text,
                bullets,
                stats: {
                totals,
                startPeak: { index: startPeakIdx, ts: startPeakTs, medianUsed: med },
                peakEng: { index: peakEngIdx, ts: peakEngTs, value: peakEngVal },
                followFromPeak: surgeDetail
                }
            };
        },
        fmtNum(n) {
            const v = Number(n || 0)
            return Number.isFinite(v) ? v.toLocaleString('th-TH') : '0'
        },
        applyData(payload) {
            // console.log(
            //     "%c CALL → applyData from:",
            //     "color: yellow; background: red;",
            //     new Error().stack.split("\n")[2] // บรรทัดที่เรียก
            // );
            this.lastPayload = payload
            const tz = (payload && payload.range && payload.range.timezone) ? payload.range.timezone : '+07:00'
            const rows = (payload && Array.isArray(payload.seriesHourly)) ? payload.seriesHourly : []

            if (!rows.length || this.isAllZero(rows)) {
                this.series = []
                this.setNoDataText('ไม่พบข้อมูล')
                this.summary = { text: 'ไม่พบข้อมูลในช่วงที่เลือก', bullets: [], stats: null }
                this.peakOnlyWindow = null
                return
            }

            this.setNoDataText('')

            const offsetMs = this.parseOffsetToMs(tz)
            const keyOf = (d, t) => d + ' ' + String(t).padStart(5, '0')
            const dataMap = new Map()

            rows.forEach(r => {
                const key = keyOf(r.date, r.time)
                dataMap.set(key, {
                post: Number(r.post_count || 0),
                engagement: Number(r.engagement_sum || 0),
                msg: Number(r.message_sum || 0)
                })
            })

            const toUtcMs = (d, t) => Date.parse(d + 'T' + t + ':00' + tz)
            const localMsFromUtc = (utc) => utc + offsetMs

            let minLocal = Infinity, maxLocal = -Infinity
            rows.forEach(r => {
                const utc = toUtcMs(r.date, r.time)
                const local = localMsFromUtc(utc)
                if (local < minLocal) minLocal = local
                if (local > maxLocal) maxLocal = local
            })

            const HOUR = 3600000
            const gridStartLocal = Math.floor(minLocal / HOUR) * HOUR
            const gridEndLocal = Math.floor(maxLocal / HOUR) * HOUR

            const posts = []
            const engagements = []
            const messages = []

            for (let lt = gridStartLocal; lt <= gridEndLocal; lt += HOUR) {
                const iso = new Date(lt).toISOString()
                const d = iso.slice(0, 10)
                const t = iso.slice(11, 16)
                const key = keyOf(d, t)
                const val = dataMap.get(key) || { post: 0, engagement: 0, msg: 0 }
                const tsUTC = lt - offsetMs

                posts.push([tsUTC, val.post])
                messages.push([tsUTC, val.msg])
                engagements.push([tsUTC, val.engagement])
            }

            this.series = [
                { name: 'Posts', data: posts, yAxisIndex: 0 },
                { name: 'Messages', data: messages, yAxisIndex: 1 },
                { name: 'Engagement', data: engagements, yAxisIndex: 2 }
            ]

            // ✅ สร้างสรุปแนวโน้ม (เพิ่ม "เริ่มพีคแรก" + "เริ่มพีคก่อนพีคสุด" + "พีคสุด")
            this.summary = this.buildSummaryFromSeries({ rows, tz, posts, messages, engagements })

            // ✅ คำนวณ “ช่วงพีคสูงสุด” (เฉพาะ 1 ชั่วโมงของพีค)
            //   const peak = this.findPeak(engagements) // {ts, value}
            //   if (peak && peak.ts != null) {
            //     const peakHourStartUtc = peak.ts
            //     const peakHourEndUtc = peakHourStartUtc + (59 * 60 * 1000) + (59 * 1000)
            //     const tzStr = tz || '+07:00'
            //     const startLocalStr = this.toLocalISOStringNoTZ(peakHourStartUtc, tzStr)
            //     const endLocalStr = this.toLocalISOStringNoTZ(peakHourEndUtc, tzStr)
            //     this.peakOnlyWindow = {
            //       startUtcMs: peakHourStartUtc,
            //       endUtcMs: peakHourEndUtc,
            //       startLocalStr,
            //       endLocalStr
            //     }
            //   } else {
            //     this.peakOnlyWindow = null
            //   }

            // 🔥 โหลดโพสต์เฉพาะช่วงพีคทันที
            this.topPage = 1
            //   this.fetchTopPosts()
        },
        async apiGetPost() {
            // try {
            this.loadingTimeline = true
            // สร้าง params ใหม่
            const params = {
                group_id: this.$route.query.id,
                // ...(this.selectedSource ? { source: this.selectedSource } : {}),
                keyword:this.formFilters.keyword,
                source: this.formFilters.source,
                sort_by: this.formFilters.sort_by,
                sentiment: this.formFilters.sentiment,
                from: this.valueDate[0],
                to: this.valueDate[1],
                account: this.formFilters.accountsInput,
                // limit:this.limit
            };
            // console.log("params === ",params);
            
            // เก็บ snapshot ของ params ล่าสุด (ยกเว้น page, limit)
            // this.lastParamsSnapshot = { ...params };

            // ตรวจสอบว่า params เปลี่ยนหรือไม่ (ไม่รวม page และ limit)
            const paramsChanged = JSON.stringify(params) !== JSON.stringify(this.lastParamsSnapshot);
            // console.log("paramsChanged === ",paramsChanged);
            // console.log("lastParamsSnapshot === ",this.lastParamsSnapshot);
            
            if (paramsChanged) {
                this.posts = []; // ลบสมาชิกเดิม
                this.page = 1;   // reset page
                this.lastParamsSnapshot = { ...params };
            }

            

            const config = {
                method: "get",
                url: "https://api2.cognizata.com/api/v2/monitor/getGroupPost",
                params: {
                    ...params,
                    page: this.page,
                    limit: this.limit,
                    querySearch: this.search || undefined, // ส่ง search ถ้ามีค่า
                },
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                    "Content-Type": "application/json",
                },
            };
            // console.log('config ==== ', config);
            
            this.axios(config).then(response => {
                // console.log('Posts fetched successfully:', response.data);
            const newPosts =  response.data.posts.map(post => ({
                ...post,
                showAll: false,
            }));
                this.posts = [ ...this.posts, ...newPosts];
                this.page = response.data.current_page;
                // this.limit = response.data.limit;
                this.total_posts = response.data.total_posts;
                this.totalPage = response.data.total_pages
                this.loadingTimeline = false;
                
            }).catch(error => {
                // console.error('Error fetching posts:', error);
                this.loadingTimeline = false;
            });
        },
        async apiGetAllPost() {
            // console.log("get all post");
            
            // try {
            this.loadAllPost = true
           
            const config = {
                method: "get",
                url: "https://api2.cognizata.com/api/v2/monitor/getGroupPost",
                params: {
                    group_id: this.$route.query.id,
                    keyword:this.formFilters.keyword,
                    source: this.formFilters.source,
                    sort_by: this.formFilters.sort_by,
                    sentiment: this.formFilters.sentiment,
                    from: this.valueDate[0],
                    to: this.valueDate[1],
                    page: this.page,
                    limit: Math.min(this.total_posts, 2000),
                    account: this.formFilters.accountsInput,
                    //limit: this.total_posts,
                    querySearch: this.search || undefined, // ส่ง search ถ้ามีค่า
                },
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                    "Content-Type": "application/json",
                },
            };
            // console.log('config ==== ', config);
            
            this.axios(config).then(response => {
                // console.log('Posts fetched successfully:', response.data);
                // const newPosts =  response.data.posts.map(post => ({
                //     ...post,
                //     showAll: false,
                // }));
                this.postForExport = response.data.posts
                this.loadAllPost = false
               
            }).catch(error => {
                // console.error('Error fetching posts:', error);
                this.loadAllPost = false;
            });
        },
        async getGroupDetail() {
            this.loading = true;
            // console.log('apiMonitorGroupList ===',this.currentPage);

            const config = {
                method: "get",
                url: "https://api2.cognizata.com/api/v2/monitor/monitorGroupName",
                params: {
                    search: this.$route.query.name,
                },
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                    "Content-Type": "application/json",
                },
            };

            this.axios(config)
                .then((response) => {
                    const resData = response.data;
                    // console.log(resData);
                    this.groupDetails = resData.data[0] || {};
                    this.loading = false;
                })
                .catch((error) => {
                    this.loading = false;
                    // this.data = [];
                    console.error(error);
                });
        },
        async fetchDataGroupChart() {
            this.loadingChart = true
            this.series = []
            this.setNoDataText('กำลังโหลดข้อมูล...')

            const API_URL = 'https://api2.cognizata.com/api/v2/monitor/getGroupPostCharts'

            try {
                const { data } = await this.axios.get(API_URL, {
                params: {
                    group_id: this.$route.query.id,
                    keyword: this.formFilters.keyword,
                    source: this.formFilters.source,
                    sort_by: this.formFilters.sort_by,
                    sentiment: Array.isArray(this.formFilters?.sentiment)
                    ? this.formFilters.sentiment.join(',')
                    : this.formFilters?.sentiment ?? '',
                    from: this.valueDate?.[0] ?? null,
                    to: this.valueDate?.[1] ?? null,
                    page: this.page,
                    limit: this.limit,
                    querySearch: this.search || undefined,
                    account: this.formFilters.accountsInput || '',
                },
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                    "Content-Type": "application/json"
                }
                })

                this.datachart = data
                // console.log("data chart === ", data);
                
                // // แปลง seriesHourly เป็น series ของ ApexCharts
                // const parseSeries = data.seriesHourly || []
                // console.log("parseSeries === ",parseSeries);
                
                // this.series = [
                // {
                //     name: 'Posts',
                //     data: parseSeries.map(d => ({
                //     x: new Date(`${d.date}T${d.time}:00+07:00`).getTime(),
                //     y: d.post_count
                //     })),
                //     yAxisIndex: 0
                // },
                // {
                //     name: 'Messages',
                //     data: parseSeries.map(d => ({
                //     x: new Date(`${d.date}T${d.time}:00+07:00`).getTime(),
                //     y: d.message_sum
                //     })),
                //     yAxisIndex: 1
                // },
                // {
                //     name: 'Engagement',
                //     data: parseSeries.map(d => ({
                //     x: new Date(`${d.date}T${d.time}:00+07:00`).getTime(),
                //     y: d.engagement_sum
                //     })),
                //     yAxisIndex: 2
                // }
                // ]
                // console.log("series === ",this.series);
                
                this.applyData(data) // สรุปพีค หรือคำนวณอื่นๆ

            } catch (err) {
                console.error(err)
                this.series = []
                this.setNoDataText('โหลดข้อมูลไม่สำเร็จ')
            } finally {
                this.loadingChart = false
            }
        },
    },
    async mounted() {
        this.submittedFilters = await this.checkSubmittedFilters();
        await this.getGroupDetail();
        await this.fetchDataGroupChart();
        await this.apiGetPost();
        // console.log(this.$route.query.name);
    },
    watch: {
        total_posts: {
            handler(newVal, oldVal) {
                this.apiGetAllPost();
            },
            // immediate: true
        }
    },
    

}
</script>

<style scoped>
    #chart {
    max-width: 100%;
    margin: 24px auto;
    }

    #chart {
    margin-bottom: 0px;
    }
    .mx-datepicker-range {
  width: 100% !important;
}
    .mx-input {
        display: inline-block;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        width: 100%;
        height: 38.5px !important;
        ;
        padding: 6px 30px;
        padding-left: 10px;
        font-size: 14px;
        line-height: 1.4;
        color: #555;
        background-color: #fff;
        border: 1px solid #ccc;
        border-radius: 4px;
        -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);
        box-shadow: inset 0 1px 1px rgba(0, 0, 0, .0);
        }
    @media only screen and (min-width: 0px) and (max-width: 800px) {
    #chart>div>div:nth-child(2) {
        padding-left: 0px;
        padding-right: 0px;
    }
    }
    .badge-light {
        color: #35393b;
        background-color: #ffffffa9 !important;
    }
    .card-hide {
        background-image: linear-gradient(to right, #e2f2f5, #d1ecf1);
        /* background-image: linear-gradient(to right, #fed06ea4, #f0cfda); */
    }
    .filter-btn {
        top: 38px;
        right: 15px;
        z-index: 2;
    }

    .filter-btn .btn {
        box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
    }
    .social-img {
        width: 25px;
    }
    .gradient-bg {
        background: linear-gradient(90deg, #fed06ea4, #ffe6e6);
    }
    .sort-btn{
        background: linear-gradient(90deg,#FDD071 0%, #ffbcbc 100%);
        border: none;
        color: #2c3e50; /* ให้ตัวอักษรอ่านง่าย */
        font-weight: bold;
    }
    #chart {
        max-width: 100%;
        margin: 24px auto;
    }

    #chart {
        margin-bottom: 0px;
    }

    /* @media only screen and (min-width: 0px) and (max-width: 800px) {
        #chart>div>div:nth-child(2) {
            padding-left: 0px;
            padding-right: 0px;
        }
    } */
</style>