<template>
  <!-- ============================================================
   MOCKUP: Target Relationship Network (Link Analysis)
   TOR คฉ.0513 ข้อ 1.2.10.3 / 1.2.10.4 / 1.2.11.14-17
   *** ข้อมูลในหน้านี้เป็นข้อมูลตัวอย่าง (mock) สำหรับรีวิว UI/UX เท่านั้น ***
  ============================================================ -->
  <div id="overflow-page">
    <HomeNav id="navHome" />

    <div class="tn-wrap">
      <!-- Header -->
      <div class="tn-breadcrumb">เครื่องมือวิเคราะห์ <span>/</span> {{ analysisMode === 'target' ? 'เครือข่ายเป้าหมาย' : 'เครือข่ายแฮชแท็ก' }}</div>
      <div class="tn-header">
        <div class="tn-title-block">
          <div class="tn-eyebrow">NETWORK INTELLIGENCE</div>
          <h1 class="tn-title">
            <span class="tn-icn"><i class="fa fa-share-alt"></i></span>
            {{ analysisMode === 'target' ? 'แผนผังความสัมพันธ์เป้าหมาย' : 'สำรวจเครือข่ายแฮชแท็ก' }}
          </h1>
          <div class="tn-sub">{{ analysisMode === 'target' ? 'สำรวจความเชื่อมโยง ค้นหาบัญชี และติดตามปฏิสัมพันธ์ในเครือข่าย' : 'จากประเด็นที่สนใจ สู่บัญชีที่ร่วมพูดถึงและสร้าง Impact ในบทสนทนา' }}</div>
        </div>
        <div class="tn-header-right">
          <router-link to="/target-network/targets" class="tn-manage-targets"><i class="fa fa-crosshairs" aria-hidden="true"></i> จัดการเป้าหมาย</router-link>
          <span class="tn-mock-badge"><i class="fa fa-flask"></i> MOCKUP · ข้อมูลตัวอย่าง</span>
          <div v-if="analysisMode === 'target'" class="tn-target-pick">
            <label for="tn-target">กำลังวิเคราะห์เป้าหมาย</label>
            <select id="tn-target" class="tn-select" v-model="selectedTarget">
              <option v-for="t in targets" :key="t.id" :value="t.id" :disabled="t.id !== 't1'">{{ t.label }}{{ t.id !== 't1' ? ' · ยังไม่มีข้อมูลตัวอย่าง' : '' }}</option>
            </select>
          </div>
        </div>
      </div>

      <div class="tn-mode-switch" role="group" aria-label="รูปแบบการวิเคราะห์">
        <button :class="{ active: analysisMode === 'target' }" :aria-pressed="analysisMode === 'target'" @click="analysisMode = 'target'"><i class="fa fa-crosshairs" aria-hidden="true"></i><span>Monitor Target<small>เริ่มจากบัญชีเป้าหมาย</small></span></button>
        <button :class="{ active: analysisMode === 'hashtag' }" :aria-pressed="analysisMode === 'hashtag'" @click="analysisMode = 'hashtag'"><span class="tn-hash-icon" aria-hidden="true">#</span><span>Hashtag<small>เริ่มจากประเด็นที่สนใจ</small></span></button>
      </div>
      <HashtagNetworkExplorer v-if="analysisMode === 'hashtag'" />
      <template v-else>
      <!-- KPI strip -->
      <div class="tn-kpis">
        <div class="tn-kpi">
          <div class="tn-kpi-ic" style="background:#fdecec;color:#eb5757"><i class="fa fa-crosshairs"></i></div>
          <div><div class="tn-kpi-num">1</div><div class="tn-kpi-lbl">เป้าหมาย</div></div>
        </div>
        <div class="tn-kpi">
          <div class="tn-kpi-ic" style="background:#eaf1fd;color:#2f80ed"><i class="fa fa-users"></i></div>
          <div><div class="tn-kpi-num">{{ countByType('friend') }}</div><div class="tn-kpi-lbl">เพื่อน</div></div>
        </div>
        <div class="tn-kpi">
          <div class="tn-kpi-ic" style="background:#e8f6ed;color:#27ae60"><i class="fa fa-user-plus"></i></div>
          <div><div class="tn-kpi-num">{{ countByType('follower') }}</div><div class="tn-kpi-lbl">ผู้ติดตาม</div></div>
        </div>
        <div class="tn-kpi">
          <div class="tn-kpi-ic" style="background:#f3edfd;color:#8b5cf6"><i class="fa fa-link"></i></div>
          <div><div class="tn-kpi-num">{{ filteredLinks.length }}</div><div class="tn-kpi-lbl">เส้นเชื่อม</div></div>
        </div>
      </div>

      <div class="tn-body">
        <!-- Left control panel -->
        <details class="tn-controls">
          <summary><span><i class="fa fa-sliders" aria-hidden="true"></i> ตัวกรองเครือข่าย</span><span class="tn-filter-summary">{{ depth }} ชั้น · {{ activePlatforms.length }} แพลตฟอร์ม <button class="tn-text-btn" @click.stop.prevent="resetFilters">รีเซ็ต</button><span class="tn-filter-action">ปรับตัวกรอง</span></span></summary>
          <div class="tn-filter-fields">
          <div class="tn-ctl-group">
            <label class="tn-ctl-label" for="tn-search">ค้นหาบัญชี</label>
            <div class="tn-search">
              <i class="fa fa-search"></i>
              <input id="tn-search" v-model="search" type="search" placeholder="ชื่อบัญชี / @username" />
            </div>
          </div>

          <div class="tn-ctl-group">
            <label class="tn-ctl-label">ระดับความลึก (degree)</label>
            <div class="tn-seg">
              <button v-for="d in [1,2,3]" :key="d"
                :class="['tn-seg-btn', {active: depth===d}]" :aria-pressed="depth===d" @click="depth=d">{{ d }} ชั้น</button>
            </div>
          </div>

          <div class="tn-ctl-group">
            <label class="tn-ctl-label">ประเภทความสัมพันธ์</label>
            <label v-for="r in relationTypes" :key="r.key" class="tn-toggle">
              <span class="tn-toggle-left"><span class="tn-dot" :style="{background:r.color}"></span>{{ r.label }}</span>
              <span class="tn-switch"><input type="checkbox" v-model="r.on" /><span class="tn-slider"></span></span>
            </label>
          </div>

          <div class="tn-ctl-group">
            <label class="tn-ctl-label">แพลตฟอร์ม</label>
            <label v-for="p in platforms" :key="p.key" class="tn-toggle">
              <span class="tn-toggle-left"><i :class="p.icon" :style="{color:p.color,width:'18px',textAlign:'center'}"></i>{{ p.label }}</span>
              <span class="tn-switch"><input type="checkbox" v-model="p.on" /><span class="tn-slider"></span></span>
            </label>
          </div>

          <div class="tn-ctl-group">
            <label class="tn-ctl-label" for="tn-force">ระยะกระจายกราฟ · {{ force }}</label>
            <input id="tn-force" class="tn-range" type="range" min="200" max="4000" step="100" v-model.number="force" />
            <div class="tn-range-labels"><span>กระชับ</span><span>กระจาย</span></div>
          </div>
          </div>
        </details>

        <!-- Graph canvas -->
        <main class="tn-canvas">
          <div class="tn-graph-heading"><div><div class="tn-eyebrow">RELATIONSHIP MAP</div><h2>แผนผังเครือข่าย</h2></div><span class="tn-count">{{ filteredNodes.length }} บัญชี · {{ filteredLinks.length }} เส้นเชื่อม</span></div>
          <div class="tn-canvas-toolbar">
            <div class="tn-legend-inline">
              <span><span class="tn-node-ex target"></span>เป้าหมาย</span>
              <span><span class="tn-node-ex friend"></span>เพื่อน</span>
              <span><span class="tn-node-ex follower"></span>ผู้ติดตาม</span>
            </div>
            <span class="tn-hint-right"><i class="fa fa-hand-pointer"></i> คลิก Node เพื่อดูรายละเอียด</span>
          </div>
          <div class="tn-graph">
            <d3-network
              v-if="filteredNodes.length"
              :net-nodes="filteredNodes"
              :net-links="filteredLinks"
              :options="netOptions"
              :selection="{ nodes: activeNode ? { [activeNode.id]: true } : {}, links: {} }"
              @node-click="onNodeClick"
            />
            <div v-else class="tn-graph-empty" role="status"><i class="fa fa-search"></i><strong>ไม่พบบัญชีที่ค้นหา</strong><span>ลองเปลี่ยนคำค้นหรือปรับตัวกรองเครือข่าย</span><button class="tn-reset-btn" @click="resetFilters">ล้างตัวกรองทั้งหมด</button></div>
            <div class="tn-graph-scale">ขนาด = จำนวนเพื่อนร่วม (เป้าหมายใหญ่พิเศษ) · ความหนาเส้น = น้ำหนัก</div>
          </div>
        </main>

        <!-- Right detail panel -->
        <aside class="tn-detail">
          <div class="tn-panel-heading">รายละเอียดบัญชี</div>
          <template v-if="activeNode">
            <button class="tn-detail-close" aria-label="ปิดรายละเอียดบัญชี" @click="activeNode=null">&times;</button>
            <div class="tn-detail-head">
              <div class="tn-avatar-ring" :class="activeNode.type">
                <div class="tn-avatar" :class="activeNode.type">{{ initials(activeNode.name) }}</div>
              </div>
              <div class="tn-detail-id">
                <div class="tn-detail-name">{{ activeNode.name }}</div>
                <div class="tn-detail-handle">{{ activeNode.handle }}</div>
                <div><span class="tn-chip" :class="activeNode.type">{{ typeLabel(activeNode.type) }}</span>
                <span class="tn-chip plat">{{ activeNode.platform }}</span></div>
              </div>
            </div>

            <div class="tn-detail-stats">
              <div class="tn-ds"><div class="tn-ds-num">{{ activeNode.followers }}</div><div class="tn-ds-lbl">ผู้ติดตาม</div></div>
              <div class="tn-ds"><div class="tn-ds-num">{{ activeNode.posts }}</div><div class="tn-ds-lbl">โพสต์</div></div>
              <div class="tn-ds"><div class="tn-ds-num">{{ activeNode.mutual }}</div><div class="tn-ds-lbl">เพื่อนร่วม</div></div>
            </div>

            <div class="tn-detail-section">
              <div class="tn-sec-title">ข้อมูลบัญชี</div>
              <div class="tn-kv"><span>Domain</span><b>{{ activeNode.domain }}</b></div>
              <div class="tn-kv"><span>พบครั้งแรก</span><b>{{ activeNode.firstSeen }}</b></div>
              <div class="tn-kv"><span>ปฏิสัมพันธ์ล่าสุด</span><b>{{ activeNode.lastSeen }}</b></div>
            </div>

            <div class="tn-detail-section">
              <div class="tn-sec-title">ประวัติปฏิสัมพันธ์</div>
              <ul class="tn-timeline">
                <li v-for="(ev,i) in activeNode.timeline" :key="i">
                  <span class="tn-tl-date">{{ ev.date }}</span>
                  <span class="tn-tl-text">{{ ev.text }}</span>
                </li>
              </ul>
            </div>

            <div class="tn-detail-note"><i class="fa fa-flask"></i> โปรไฟล์ตัวอย่างสำหรับแสดงเครือข่าย</div>
          </template>
          <template v-else>
            <div class="tn-detail-empty">
              <div class="tn-empty-ic"><i class="fa fa-hand-pointer"></i></div>
              <h3>สำรวจทีละความเชื่อมโยง</h3><p>เลือกบัญชีบนกราฟหรือตารางด้านล่าง<br/>เพื่อดูข้อมูล สถิติ และประวัติปฏิสัมพันธ์</p><button class="tn-reset-btn" @click="selectById(1)">ดูบัญชีเป้าหมาย <i class="fa fa-arrow-right"></i></button>
            </div>
          </template>
        </aside>
      </div>

      <!-- Relations table -->
      <div class="tn-table-wrap">
        <div class="tn-table-head">
          <div><h2>รายการความสัมพันธ์</h2><span class="tn-muted">เลือกบัญชีเพื่อดูรายละเอียดในแผงด้านข้าง</span></div>
          <span class="tn-muted">{{ filteredLinkRows.length }} รายการ</span>
        </div>
        <div class="tn-table-scroll"><table class="tn-table">
          <thead>
            <tr><th>บัญชี</th><th>แพลตฟอร์ม</th><th>ความสัมพันธ์</th><th style="width:140px">น้ำหนัก</th><th>ปฏิสัมพันธ์ล่าสุด</th></tr>
          </thead>
          <tbody>
            <tr v-for="l in filteredLinkRows" :key="l.id" @click="selectById(l.tid)"
                :class="{sel: activeNode && activeNode.id===l.tid}">
              <td><button class="tn-account-btn" @click.stop="selectById(l.tid)"><span class="tn-table-avatar" :class="l.rtype">{{ initials(l.name) }}</span><span><b>{{ l.name }}</b><span class="tn-account-handle">{{ l.handle }}</span></span></button></td>
              <td>{{ l.platform }}</td>
              <td><span class="tn-chip" :class="l.rtype">{{ relLabel(l.rtype) }}</span></td>
              <td>
                <div class="tn-weight-cell"><div class="tn-weight"><div class="tn-weight-fill" :style="{width:(l.weight*10)+'%'}"></div></div><span>{{ l.weight }}/10</span></div>
              </td>
              <td>{{ l.lastSeen }}</td>
            </tr>
            <tr v-if="!filteredLinkRows.length"><td colspan="5" class="tn-table-empty">ไม่พบความสัมพันธ์ที่ตรงกับตัวกรอง <button class="tn-text-btn" @click="resetFilters">ล้างตัวกรอง</button></td></tr>
          </tbody>
        </table></div>
      </div>
      </template>
    </div>
  </div>
</template>

<script>
import HomeNav from "@/components/HomeNavMion.vue";
import D3Network from "vue-d3-network";
import HashtagNetworkExplorer from "@/components/target-network/HashtagNetworkExplorer.vue";

export default {
  name: "TargetNetwork",
  components: { HomeNav, D3Network, HashtagNetworkExplorer },
  data() {
    return {
      analysisMode: "target",
      selectedTarget: "t1",
      search: "",
      depth: 2,
      force: 1800,
      activeNode: null,
      targets: [
        { id: "t1", label: "สมชาย ก. (เป้าหมาย #001)" },
        { id: "t2", label: "วิภา ส. (เป้าหมาย #002)" },
      ],
      relationTypes: [
        { key: "friend", label: "เพื่อน", color: "#2f80ed", on: true },
        { key: "follower", label: "ผู้ติดตาม", color: "#27ae60", on: true },
        { key: "interact", label: "ปฏิสัมพันธ์", color: "#e2a03f", on: true },
      ],
      platforms: [
        { key: "Facebook", label: "Facebook", color: "#1877f2", icon: "fa fa-facebook", on: true },
        { key: "X", label: "Twitter (X)", color: "#111", icon: "fa fa-twitter", on: true },
        { key: "Instagram", label: "Instagram", color: "#c13584", icon: "fa fa-instagram", on: true },
      ],
      // ---- MOCK DATA ----
      rawNodes: [
        { id: 1, name: "สมชาย ก.", handle: "@somchai_k", type: "target", platform: "Facebook", domain: "Facebook", followers: "12,400", posts: 318, mutual: "-", degree: 0,
          firstSeen: "2025-02-11", lastSeen: "2026-10-18",
          timeline: [ {date:"2026-10-18", text:"โพสต์ภาพกลุ่ม 4 คน"}, {date:"2026-10-02", text:"แท็กบัญชี @nattapong"}, {date:"2026-09-20", text:"เข้าร่วมกลุ่มใหม่"} ] },
        { id: 2, name: "ณัฐพงษ์ ต.", handle: "@nattapong", type: "friend", platform: "Facebook", domain: "Facebook", followers: "3,120", posts: 92, mutual: 18, degree: 1, firstSeen:"2025-03-01", lastSeen:"2026-10-17", timeline:[{date:"2026-10-17",text:"คอมเมนต์โพสต์เป้าหมาย"}] },
        { id: 3, name: "ปรีชา ว.", handle: "@preecha_w", type: "friend", platform: "X", domain: "X", followers: "980", posts: 240, mutual: 9, degree: 1, firstSeen:"2025-05-12", lastSeen:"2026-10-10", timeline:[{date:"2026-10-10",text:"รีโพสต์เป้าหมาย"}] },
        { id: 4, name: "มานี จ.", handle: "@manee.j", type: "friend", platform: "Instagram", domain: "Instagram", followers: "5,600", posts: 410, mutual: 22, degree: 1, firstSeen:"2025-01-20", lastSeen:"2026-10-15", timeline:[{date:"2026-10-15",text:"แท็กร่วมในภาพ"}] },
        { id: 5, name: "user_8842", handle: "@user_8842", type: "follower", platform: "Facebook", domain: "Facebook", followers: "42", posts: 5, mutual: 1, degree: 1, firstSeen:"2026-06-02", lastSeen:"2026-10-01", timeline:[{date:"2026-10-01",text:"ติดตามเป้าหมาย"}] },
        { id: 6, name: "bkk_night", handle: "@bkk_night", type: "follower", platform: "X", domain: "X", followers: "210", posts: 88, mutual: 0, degree: 1, firstSeen:"2026-07-19", lastSeen:"2026-09-28", timeline:[{date:"2026-09-28",text:"ไลก์ 3 โพสต์"}] },
        { id: 7, name: "ploy_ss", handle: "@ploy_ss", type: "follower", platform: "Instagram", domain: "Instagram", followers: "1,050", posts: 120, mutual: 2, degree: 1, firstSeen:"2026-04-11", lastSeen:"2026-10-05", timeline:[{date:"2026-10-05",text:"คอมเมนต์ภาพ"}] },
        { id: 8, name: "เอกชัย ร.", handle: "@ekkachai_r", type: "friend", platform: "Facebook", domain: "Facebook", followers: "760", posts: 55, mutual: 4, degree: 2, firstSeen:"2025-08-01", lastSeen:"2026-09-30", timeline:[{date:"2026-09-30",text:"เพื่อนของณัฐพงษ์"}] },
        { id: 9, name: "account_x19", handle: "@account_x19", type: "follower", platform: "X", domain: "X", followers: "15", posts: 2, mutual: 0, degree: 2, firstSeen:"2026-08-22", lastSeen:"2026-09-15", timeline:[{date:"2026-09-15",text:"ติดตามปรีชา"}] },
        { id: 10, name: "sunee_art", handle: "@sunee_art", type: "friend", platform: "Instagram", domain: "Instagram", followers: "2,300", posts: 300, mutual: 6, degree: 2, firstSeen:"2025-11-05", lastSeen:"2026-10-08", timeline:[{date:"2026-10-08",text:"เพื่อนของมานี"}] },
      ],
      rawLinks: [
        { sid: 1, tid: 2, rtype: "friend", weight: 9 },
        { sid: 1, tid: 3, rtype: "friend", weight: 6 },
        { sid: 1, tid: 4, rtype: "friend", weight: 8 },
        { sid: 1, tid: 5, rtype: "follower", weight: 3 },
        { sid: 1, tid: 6, rtype: "follower", weight: 2 },
        { sid: 1, tid: 7, rtype: "follower", weight: 4 },
        { sid: 2, tid: 8, rtype: "friend", weight: 5 },
        { sid: 3, tid: 9, rtype: "follower", weight: 2 },
        { sid: 4, tid: 10, rtype: "friend", weight: 6 },
        { sid: 2, tid: 4, rtype: "interact", weight: 3 },
      ],
      colorMap: { target: "#eb5757", friend: "#2f80ed", follower: "#27ae60" },
    };
  },
  computed: {
    activePlatforms() { return this.platforms.filter(p => p.on).map(p => p.key); },
    activeRelations() { return this.relationTypes.filter(r => r.on).map(r => r.key); },
    visibleNodeIds() {
      const ok = this.rawNodes.filter(n =>
        n.degree <= this.depth &&
        (n.type === "target" || this.activePlatforms.includes(n.platform)) &&
        (!this.search || (n.name + n.handle).toLowerCase().includes(this.search.toLowerCase()))
      );
      return new Set(ok.map(n => n.id));
    },
    filteredNodes() {
      return this.rawNodes
        .filter(n => this.visibleNodeIds.has(n.id))
        .map(n => ({
          id: n.id,
          name: n.name,
          _color: this.colorMap[n.type],
          _size: n.type === "target" ? 46 : 20 + (n.mutual === "-" ? 0 : Math.min(Number(n.mutual) || 0, 20)),
        }));
    },
    filteredLinks() {
      return this.rawLinks
        .filter(l => this.activeRelations.includes(l.rtype) &&
          this.visibleNodeIds.has(l.sid) && this.visibleNodeIds.has(l.tid))
        .map((l, i) => ({ id: i + 1, sid: l.sid, tid: l.tid, _color: this.relationTypes.find(r=>r.key===l.rtype).color, _svgAttrs: { "stroke-width": l.weight } }));
    },
    filteredLinkRows() {
      return this.rawLinks
        .filter(l => this.activeRelations.includes(l.rtype) &&
          this.visibleNodeIds.has(l.sid) && this.visibleNodeIds.has(l.tid))
        .map((l, i) => {
          const n = this.rawNodes.find(x => x.id === l.tid);
          return { id: i + 1, tid: l.tid, name: n.name, handle: n.handle, platform: n.platform, rtype: l.rtype, weight: l.weight, lastSeen: n.lastSeen };
        });
    },
    netOptions() {
      return { force: this.force, nodeSize: 24, nodeLabels: true, linkWidth: 2, linkLabels: false, fontSize: 13, strLinks: true };
    },
  },
  watch: {
    visibleNodeIds(ids) {
      if (this.activeNode && !ids.has(this.activeNode.id)) this.activeNode = null;
    },
  },
  methods: {
    resetFilters() {
      this.search = "";
      this.depth = 2;
      this.force = 1800;
      this.relationTypes.forEach(r => { r.on = true; });
      this.platforms.forEach(p => { p.on = true; });
    },
    onNodeClick(e, node) { this.activeNode = this.rawNodes.find(n => n.id === node.id) || null; },
    selectById(id) { this.activeNode = this.rawNodes.find(n => n.id === id) || null; },
    countByType(t) { return this.rawNodes.filter(n => this.visibleNodeIds.has(n.id) && n.type === t).length; },
    typeLabel(t) { return { target: "เป้าหมาย", friend: "เพื่อน", follower: "ผู้ติดตาม" }[t] || t; },
    relLabel(t) { return { friend: "เพื่อน", follower: "ผู้ติดตาม", interact: "ปฏิสัมพันธ์" }[t] || t; },
    initials(name) { return (name || "?").trim().charAt(0); },
  },
};
</script>

<style scoped>
.tn-wrap { padding: 20px 22px 32px; background:#eef1f6; min-height: calc(100vh - 60px); }
/* Header */
.tn-header { display:flex; justify-content:space-between; align-items:center; border-radius:16px; padding:20px 24px; margin-bottom:16px;
  background:linear-gradient(120deg,#0f766e 0%,#115e59 45%,#1e3a5f 100%); color:#fff; box-shadow:0 8px 24px rgba(17,94,89,.25); }
.tn-title { font-size:21px; font-weight:800; display:flex; align-items:center; gap:12px; letter-spacing:.2px; }
.tn-icn { width:38px; height:38px; border-radius:11px; background:rgba(255,255,255,.16); display:flex; align-items:center; justify-content:center; font-size:17px; }
.tn-sub { font-size:15px; color:#7d9592; margin-top:6px; margin-left:50px; }
.tn-header-right { display:flex; align-items:center; gap:16px; }
.tn-mock-badge { background:rgba(255,255,255,.15); color:#fff; font-size:13px; font-weight:700; padding:6px 12px; border-radius:20px; letter-spacing:.3px; white-space:nowrap; }
.tn-target-pick label { display:block; font-size:13px; text-transform:uppercase; letter-spacing:.6px; color:#78908c; margin-bottom:4px; }
.tn-select { border:none; border-radius:10px; padding:9px 14px; font-size:16px; color:#1f2d3d; background:#fff; font-weight:600; min-width:220px; cursor:pointer; }
/* KPI */
.tn-kpis { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:16px; }
.tn-kpi { background:#fff; border-radius:14px; padding:16px 18px; display:flex; align-items:center; gap:14px; box-shadow:0 2px 10px rgba(16,24,40,.05); }
.tn-kpi-ic { width:46px; height:46px; border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:19px; }
.tn-kpi-num { font-size:24px; font-weight:800; color:#101828; line-height:1; }
.tn-kpi-lbl { font-size:14px; color:#575d69; margin-top:4px; }
/* Body grid */
.tn-body { display:grid; grid-template-columns:248px 1fr 312px; gap:16px; align-items:start; }
.tn-controls { background:#fff; border-radius:16px; padding:20px; box-shadow:0 2px 10px rgba(16,24,40,.05); }
.tn-ctl-group { margin-bottom:22px; } .tn-ctl-group:last-child { margin-bottom:0; }
.tn-ctl-label { display:block; font-size:13px; font-weight:800; color:#606671; text-transform:uppercase; letter-spacing:.6px; margin-bottom:11px; }
.tn-search { position:relative; } .tn-search i { position:absolute; left:13px; top:50%; transform:translateY(-50%); color:#71777f; font-size:15px; }
.tn-search input { width:100%; border:1px solid #e3e8ef; border-radius:10px; padding:10px 12px 10px 34px; font-size:16px; outline:none; transition:.15s; }
.tn-search input:focus { border-color:#5da294; box-shadow:0 0 0 3px rgba(93,162,148,.15); }
.tn-seg { display:flex; gap:6px; background:#f1f4f8; padding:4px; border-radius:11px; }
.tn-seg-btn { flex:1; border:none; background:transparent; border-radius:8px; padding:8px 0; font-weight:700; color:#667085; cursor:pointer; transition:.15s; }
.tn-seg-btn.active { background:#fff; color:#0f766e; box-shadow:0 1px 4px rgba(16,24,40,.12); }
.tn-toggle { display:flex; align-items:center; justify-content:space-between; font-size:16px; color:#344054; margin-bottom:12px; cursor:pointer; }
.tn-toggle-left { display:flex; align-items:center; gap:9px; }
.tn-dot { width:11px; height:11px; border-radius:50%; display:inline-block; }
.tn-switch { position:relative; width:38px; height:21px; flex-shrink:0; }
.tn-switch input { opacity:0; width:0; height:0; }
.tn-slider { position:absolute; inset:0; background:#d0d5dd; border-radius:20px; transition:.2s; }
.tn-slider:before { content:''; position:absolute; height:15px; width:15px; left:3px; top:3px; background:#fff; border-radius:50%; transition:.2s; }
.tn-switch input:checked + .tn-slider { background:#5da294; }
.tn-switch input:checked + .tn-slider:before { transform:translateX(17px); }
.tn-range { width:100%; accent-color:#5da294; }
/* Canvas */
.tn-canvas { background:#fff; border-radius:16px; box-shadow:0 2px 10px rgba(16,24,40,.05); overflow:hidden; }
.tn-canvas-toolbar { display:flex; align-items:center; justify-content:space-between; padding:14px 18px; border-bottom:1px solid #eef1f5; }
.tn-legend-inline { display:flex; gap:18px; }
.tn-legend-inline span { display:flex; align-items:center; gap:7px; font-size:15px; color:#475467; }
.tn-node-ex { width:13px; height:13px; border-radius:50%; display:inline-block; }
.tn-node-ex.target { background:#eb5757; } .tn-node-ex.friend { background:#2f80ed; } .tn-node-ex.follower { background:#27ae60; }
.tn-hint-right { font-size:14px; color:#606671; display:flex; align-items:center; gap:6px; }
.tn-graph { position:relative; height:580px;
  background:#f8fafc;
  background-image:radial-gradient(circle at 1px 1px, rgba(100,116,139,.12) 1px, transparent 0);
  background-size:22px 22px; }
.tn-graph-scale { position:absolute; left:14px; bottom:12px; font-size:13px; color:#506068; background:rgba(11,31,42,.6); padding:5px 10px; border-radius:7px; }
.tn-graph >>> .net { height:580px !important; }
.tn-graph >>> .node { cursor:pointer; }
.tn-graph >>> .node circle { stroke:#f8fafc; stroke-width:3px; filter:drop-shadow(0 2px 4px rgba(0,0,0,.4)); }
.tn-graph >>> .node:hover circle { stroke:#fff; }
.tn-graph >>> .node-label { fill:#344054 !important; font-size:14px; font-weight:600; paint-order:stroke; stroke:#f8fafc; stroke-width:3px; }
.tn-graph >>> .link { stroke-opacity:.65; stroke-linecap:round; }
/* Detail */
.tn-detail { background:#fff; border-radius:16px; box-shadow:0 2px 10px rgba(16,24,40,.05); padding:20px; min-height:580px; position:relative; }
.tn-detail-close { position:absolute; top:12px; right:14px; border:none; background:none; font-size:24px; color:#797e84; cursor:pointer; line-height:1; }
.tn-detail-empty { color:#6b717a; text-align:center; padding-top:150px; }
.tn-empty-ic { width:68px; height:68px; margin:0 auto 18px; border-radius:50%; background:#f1f4f8; display:flex; align-items:center; justify-content:center; font-size:26px; color:#7b8189; }
.tn-detail-empty p { font-size:15px; line-height:1.7; }
.tn-detail-head { display:flex; gap:14px; margin-bottom:18px; padding-right:18px; }
.tn-avatar-ring { padding:3px; border-radius:50%; flex-shrink:0; }
.tn-avatar-ring.target { background:#fdecec; } .tn-avatar-ring.friend { background:#eaf1fd; } .tn-avatar-ring.follower { background:#e8f6ed; }
.tn-avatar { width:54px; height:54px; border-radius:50%; color:#fff; font-size:23px; font-weight:800; display:flex; align-items:center; justify-content:center; }
.tn-avatar.target { background:#eb5757; } .tn-avatar.friend { background:#2f80ed; } .tn-avatar.follower { background:#27ae60; }
.tn-detail-name { font-size:18px; font-weight:800; color:#101828; }
.tn-detail-handle { font-size:15px; color:#606671; margin-bottom:8px; }
.tn-chip { display:inline-block; font-size:13px; font-weight:700; padding:4px 10px; border-radius:20px; margin-right:6px; }
.tn-chip.target { background:#fdecec; color:#943737; } .tn-chip.friend { background:#eaf1fd; color:#1e5195; }
.tn-chip.follower { background:#e8f6ed; color:#196e3c; } .tn-chip.interact { background:#fcf3e3; color:#7f5712; } .tn-chip.plat { background:#eef1f5; color:#667085; }
.tn-detail-stats { display:flex; gap:10px; margin-bottom:18px; }
.tn-ds { flex:1; background:#f7f9fb; border-radius:11px; padding:12px 6px; text-align:center; }
.tn-ds-num { font-size:18px; font-weight:800; color:#101828; } .tn-ds-lbl { font-size:13px; color:#606671; margin-top:2px; }
.tn-detail-section { border-top:1px solid #eef1f5; padding-top:14px; margin-bottom:14px; }
.tn-sec-title { font-size:13px; font-weight:800; color:#606671; text-transform:uppercase; letter-spacing:.6px; margin-bottom:12px; display:flex; align-items:center; gap:8px; }
.tn-ref { background:#eef6f4; color:#0f766e; font-weight:700; padding:2px 7px; border-radius:6px; letter-spacing:0; text-transform:none; }
.tn-kv { display:flex; justify-content:space-between; font-size:15px; color:#55606f; margin-bottom:9px; } .tn-kv b { color:#101828; }
.tn-timeline { list-style:none; padding:0; margin:0 0 0 4px; border-left:2px solid #e3e8ef; }
.tn-timeline li { position:relative; padding:0 0 14px 18px; }
.tn-timeline li:before { content:''; position:absolute; left:-6px; top:3px; width:9px; height:9px; border-radius:50%; background:#5da294; box-shadow:0 0 0 3px #eef6f4; }
.tn-tl-date { display:block; font-size:13px; color:#606671; margin-bottom:2px; } .tn-tl-text { font-size:15px; color:#344054; }
.tn-detail-btn { width:100%; background:#0f766e; color:#fff; border:none; border-radius:11px; padding:12px; font-weight:700; cursor:pointer; margin-top:6px; transition:.15s; display:flex; align-items:center; justify-content:center; gap:8px; }
.tn-detail-btn:hover { background:#0c5f58; }
/* Table */
.tn-table-wrap { background:#fff; border-radius:16px; box-shadow:0 2px 10px rgba(16,24,40,.05); margin-top:16px; overflow:hidden; }
.tn-table-head { display:flex; align-items:center; justify-content:space-between; padding:16px 18px 12px; }
.tn-table { width:100%; border-collapse:collapse; }
.tn-table th { text-align:left; font-size:13px; color:#606671; text-transform:uppercase; letter-spacing:.5px; padding:11px 18px; border-top:1px solid #eef1f5; border-bottom:1px solid #eef1f5; background:#fafbfc; }
.tn-table td { padding:13px 18px; font-size:16px; color:#344054; border-bottom:1px solid #f2f4f7; }
.tn-table tbody tr { cursor:pointer; transition:.12s; }
.tn-table tbody tr:hover td { background:#f7fbfa; }
.tn-table tbody tr.sel td { background:#eef6f4; }
.tn-muted { color:#606671; font-size:14px; }
.tn-weight { width:100px; height:8px; background:#eef1f5; border-radius:5px; overflow:hidden; }
.tn-weight-fill { height:100%; background:linear-gradient(90deg,#0f766e,#5fcdb9); border-radius:5px; }
.tn-wrap { background:#f5f7fa; padding:24px 28px 40px; color:#263447; }
.tn-mode-switch { display:flex; gap:8px; padding:6px; background:#e9eef2; border:1px solid #dfe6ec; border-radius:13px; width:fit-content; max-width:100%; margin-bottom:24px; }
.tn-mode-switch button { display:flex; gap:12px; align-items:center; border:1px solid transparent; border-radius:9px; padding:10px 22px; background:transparent; color:#718092; text-align:left; cursor:pointer; font-size:15px; font-weight:700; }
.tn-mode-switch button.active { background:#fff; border-color:#dce6e1; color:#246c5c; box-shadow:0 2px 6px #233d4b0a; }
.tn-mode-switch small { display:block; font-size:13px; font-weight:400; margin-top:3px; }
.tn-hash-icon { font-size:24px; line-height:1; }
@media (max-width:480px) { .tn-mode-switch { width:100%; } .tn-mode-switch button { flex:1; padding:10px; gap:8px; } }
.tn-breadcrumb { font-size:14px; color:#4d555f; margin-bottom:22px; }
.tn-breadcrumb span { margin:0 10px; color:#7a7f86; }
.tn-header { background:transparent; color:#182c3d; padding:0; box-shadow:none; border-radius:0; margin-bottom:24px; gap:24px; }
.tn-eyebrow { font-size:13px; letter-spacing:1.8px; font-weight:800; color:#608981; margin-bottom:8px; }
.tn-title { font-size:26px; letter-spacing:-.5px; margin:0; line-height:1.5; }
.tn-icn { background:#e4efeb; color:#247a68; width:42px; height:42px; }
.tn-sub { color:#4e5660; font-size:15px; margin:8px 0 0; }
.tn-header-right { gap:12px; align-items:flex-end; flex-direction:column; }
.tn-mock-badge { background:#fff5df; color:#926a22; font-size:13px; padding:5px 10px; border:1px solid #f0e4c7; }
.tn-target-pick label { color:#708092; font-size:13px; letter-spacing:0; }
.tn-select { border:1px solid #dce4e9; min-width:270px; font-size:15px; border-radius:9px; }
.tn-kpis { gap:16px; margin-bottom:24px; }
.tn-kpi { border:1px solid #e4e9ef; box-shadow:0 2px 3px #182c3d03; border-radius:12px; padding:18px 22px; }
.tn-kpi-num { font-size:28px; font-variant-numeric:tabular-nums; }
.tn-kpi-lbl { color:#738195; font-size:14px; margin-top:7px; }
.tn-body { grid-template-columns:224px minmax(0,1fr) 284px; gap:16px; align-items:stretch; }
.tn-controls,.tn-canvas,.tn-detail,.tn-table-wrap { border:1px solid #e3e9ee; border-radius:12px; box-shadow:0 3px 12px #253b5304; min-width:0; }
.tn-controls { padding:18px 16px; }
.tn-panel-heading { display:flex; align-items:center; justify-content:space-between; font-size:15px; font-weight:700; color:#293e4d; padding-bottom:17px; margin-bottom:20px; border-bottom:1px solid #eef1f4; gap:8px; }
.tn-panel-heading i { margin-right:5px; color:#455856; }
.tn-text-btn { border:0; background:transparent; padding:3px; color:#247a68; font-size:14px; cursor:pointer; }
.tn-ctl-label { color:#637487; font-size:14px; text-transform:none; letter-spacing:0; }
.tn-ctl-group { margin-bottom:24px; }
.tn-toggle { font-size:14px; margin-bottom:14px; }
.tn-search input { font-size:14px; background:#fafbfd; padding-left:32px; }
.tn-dot { width:8px; height:8px; }
.tn-switch { width:32px; height:18px; }
.tn-slider:before { width:12px; height:12px; }
.tn-switch input:checked + .tn-slider:before { transform:translateX(14px); }
.tn-switch input:focus-visible + .tn-slider { outline:3px solid #a6c6ff; outline-offset:3px; }
.tn-range-labels { display:flex; justify-content:space-between; color:#575f69; font-size:13px; }
.tn-graph-heading { display:flex; justify-content:space-between; align-items:center; padding:18px 20px 12px; gap:12px; }
.tn-graph-heading h2,.tn-table-head h2 { font-size:16px; margin:0; font-weight:700; color:#233b4b; }
.tn-graph-heading .tn-eyebrow { font-size:13px; margin-bottom:5px; }
.tn-count { font-size:13px; color:#68847c; background:#edf5f1; border:1px solid #dfece6; padding:5px 9px; border-radius:6px; white-space:nowrap; }
.tn-canvas-toolbar { padding:10px 20px 14px; gap:12px; flex-wrap:wrap; }
.tn-legend-inline { gap:13px; }
.tn-legend-inline span { font-size:13px; }
.tn-node-ex { width:8px; height:8px; }
.tn-hint-right { font-size:13px; color:#47545f; }
.tn-graph { height:540px; background-color:#f8fafc; background-image:radial-gradient(circle at 50% 45%,#e7f3ed85,transparent 65%),radial-gradient(circle at 1px 1px,#94a3b82e 1px,transparent 0); background-size:100% 100%,24px 24px; }
.tn-graph >>> .net { height:540px !important; }
.tn-graph >>> .node { stroke:#fff; stroke-width:3px; filter:drop-shadow(0 3px 6px #33415520); }
.tn-graph >>> .node:hover { stroke:#526b80; }
.tn-graph-scale { color:#63778a; background:#ffffffeb; border:1px solid #e2e8f0; font-size:13px; left:16px; bottom:16px; }
.tn-detail { padding:18px; min-height:0; }
.tn-detail-close { top:66px; color:#48535f; }
.tn-detail-empty { padding:100px 0 55px; }
.tn-empty-ic { background:#eef5f2; color:#436258; border-radius:20px; width:64px; height:64px; font-size:23px; }
.tn-detail-empty h3 { font-size:16px; color:#3c5363; margin-bottom:10px; font-weight:700; }
.tn-detail-empty p { font-size:14px; color:#535c66; line-height:1.9; }
.tn-reset-btn { border:1px solid #d6e6de; background:#f0f7f3; color:#327b67; padding:9px 14px; border-radius:8px; font-size:14px; cursor:pointer; }
.tn-reset-btn:hover { background:#e2efe7; }
.tn-detail-head { flex-direction:column; gap:12px; }
.tn-avatar-ring { align-self:flex-start; }
.tn-detail-name { font-size:18px; }
.tn-ds-num { font-size:16px; }
.tn-ds-lbl { color:#728194; }
.tn-sec-title { font-size:14px; color:#506678; letter-spacing:0; }
.tn-kv { font-size:13px; gap:12px; }
.tn-kv b { overflow-wrap:anywhere; }
.tn-detail-note { font-size:13px; color:#565f67; padding:12px 0; border-top:1px solid #eef1f5; }
.tn-table-wrap { margin-top:24px; }
.tn-table-head { padding:20px 22px; }
.tn-table-head h2 { margin-bottom:5px; }
.tn-table-scroll { overflow-x:auto; }
.tn-table { min-width:720px; }
.tn-table th { color:#48535f; font-size:13px; background:#f8fafb; letter-spacing:0; padding:12px 22px; }
.tn-table td { padding:12px 22px; font-size:14px; }
.tn-account-btn { display:flex; gap:12px; align-items:center; border:0; background:transparent; padding:0; text-align:left; cursor:pointer; color:inherit; }
.tn-table-avatar { display:flex; align-items:center; justify-content:center; width:34px; height:34px; border-radius:11px; background:#edf3fc; color:#4275b2; font-size:16px; }
.tn-table-avatar.follower { background:#ebf5ef; color:#398868; }
.tn-account-handle { display:block; font-size:13px; color:#555f69; margin-top:3px; }
.tn-weight-cell { display:flex; gap:10px; align-items:center; color:#515b65; font-size:13px; white-space:nowrap; }
.tn-weight { width:75px; height:5px; }
.tn-graph-empty { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:14px; height:100%; color:#718096; font-size:14px; text-align:center; padding:24px; }
.tn-graph-empty > i { font-size:28px; color:#4a6962; }
.tn-graph-empty strong { font-size:17px; color:#344054; }
.tn-table-empty { text-align:center; padding:32px !important; color:#525b65; }
.tn-wrap button:focus-visible,.tn-wrap select:focus-visible,.tn-wrap input:focus-visible { outline:3px solid #8ebcaf; outline-offset:3px; }
@media (min-width:1600px) { .tn-wrap { padding-left:40px; padding-right:40px; } .tn-body { grid-template-columns:248px minmax(0,1fr) 312px; } }
@media (max-width:1250px) { .tn-body { grid-template-columns:210px minmax(0,1fr); } .tn-detail { grid-column:1 / -1; } .tn-detail-empty { padding:20px; } .tn-detail-head { flex-direction:row; } .tn-detail-stats { max-width:480px; } .tn-detail-close { top:18px; } }
@media (max-width:760px) { .tn-wrap { padding:18px 14px 28px; } .tn-header { align-items:flex-start; flex-direction:column; gap:18px; } .tn-title { font-size:21px; } .tn-header-right { width:100%; align-items:flex-start; } .tn-target-pick,.tn-select { width:100%; min-width:0; } .tn-kpis { grid-template-columns:repeat(2,minmax(0,1fr)); gap:10px; } .tn-kpi { padding:14px 12px; gap:10px; } .tn-kpi-ic { width:34px; height:34px; font-size:15px; } .tn-kpi-num { font-size:23px; } .tn-body { grid-template-columns:minmax(0,1fr); } .tn-controls { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:0 20px; } .tn-controls .tn-panel-heading { grid-column:1 / -1; } .tn-ctl-group { min-width:0; } .tn-graph-heading { flex-wrap:wrap; } .tn-graph,.tn-graph >>> .net { height:440px !important; } .tn-table-head { padding:16px; } }
@media (prefers-reduced-motion:reduce) { .tn-wrap * { transition:none !important; } }
/* Compact workspace: keep analysis near the top; expand filters on demand. */
.tn-wrap { padding:14px 20px 24px; }
.tn-manage-targets { display:inline-flex; align-items:center; gap:6px; padding:7px 10px; font-size:13px; color:#357a67; border:1px solid #d8e6df; border-radius:7px; background:#fff; white-space:nowrap; }
.tn-manage-targets:hover { color:#245846; background:#edf5f1; text-decoration:none; }
.tn-breadcrumb,.tn-header .tn-eyebrow,.tn-sub,.tn-mode-switch small { display:none; }
.tn-header { margin-bottom:10px; gap:12px; }
.tn-title { font-size:20px; line-height:1.4; gap:9px; }
.tn-icn { width:30px; height:30px; border-radius:8px; font-size:16px; }
.tn-header-right { flex-direction:row; align-items:center; gap:12px; }
.tn-target-pick label { display:none; }
.tn-select { padding:7px 10px; font-size:14px; min-width:220px; }
.tn-mock-badge { font-size:13px; padding:4px 8px; }
.tn-mode-switch { margin-bottom:12px; padding:3px; gap:3px; border-radius:9px; }
.tn-mode-switch button { padding:7px 16px; gap:8px; font-size:14px; border-radius:6px; }
.tn-hash-icon { font-size:18px; }
.tn-kpis { gap:8px; margin-bottom:12px; grid-template-columns:repeat(4,minmax(0,1fr)); }
.tn-kpi { padding:10px 14px; gap:10px; border-radius:9px; }
.tn-kpi-ic { width:30px; height:30px; border-radius:8px; font-size:15px; }
.tn-kpi > div:last-child { display:flex; align-items:baseline; gap:9px; }
.tn-kpi-num { font-size:21px; }.tn-kpi-lbl { margin:0; font-size:13px; }
.tn-body { grid-template-columns:minmax(0,1fr) 280px; gap:10px; align-items:start; }
.tn-controls { grid-column:1/-1; padding:0; display:block; }
.tn-controls summary { display:flex; align-items:center; justify-content:space-between; gap:12px; padding:10px 14px; cursor:pointer; list-style:none; font-size:14px; color:#516779; }
.tn-controls summary::-webkit-details-marker { display:none; }
.tn-controls summary:focus-visible { outline:3px solid #8ebcaf; outline-offset:2px; }
.tn-controls summary i { margin-right:6px; }
.tn-filter-summary { font-size:13px; color:#576069; }
.tn-filter-action { color:#357c6a; margin-left:14px; }
.tn-filter-action:after { content:' ＋'; }.tn-controls[open] .tn-filter-action:after { content:' −'; }
.tn-filter-fields { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:14px 24px; padding:14px; border-top:1px solid #edf1f4; }
.tn-filter-fields .tn-panel-heading { grid-column:1/-1; margin:0; padding:0; border:0; }
.tn-filter-fields .tn-ctl-group { margin:0; }.tn-filter-fields .tn-ctl-label { margin-bottom:8px; }
.tn-graph-heading { padding:12px 16px 7px; }.tn-graph-heading .tn-eyebrow { display:none; }
.tn-canvas-toolbar { padding:6px 16px 10px; }
.tn-graph,.tn-graph >>> .net { height:clamp(340px,52vh,520px) !important; }
.tn-detail { min-height:0; padding:14px; max-height:640px; overflow-y:auto; }
.tn-detail-empty { padding:45px 0; }.tn-detail .tn-panel-heading { padding-bottom:10px; margin-bottom:12px; }
.tn-table-wrap { margin-top:12px; }.tn-table-head { padding:12px 16px; }
.tn-table-scroll { max-height:360px; overflow:auto; }.tn-table th { position:sticky; top:0; z-index:1; }
@media (max-width:960px) {
  .tn-wrap { padding:10px 12px 20px; }.tn-header { flex-direction:row; align-items:center; flex-wrap:wrap; margin-bottom:8px; }.tn-title { font-size:17px; }.tn-header-right { width:auto; margin-left:auto; flex-direction:row; gap:8px; }.tn-select { width:auto; min-width:190px; max-width:100%; }.tn-target-pick { width:auto; }.tn-mock-badge { font-size:13px; }
  .tn-body { grid-template-columns:minmax(0,1fr); }.tn-detail { grid-column:auto; max-height:none; }.tn-detail-empty { padding:14px; }.tn-detail-empty .tn-empty-ic { display:none; }.tn-kpi { padding:9px 10px; gap:7px; }.tn-kpi-num { font-size:19px; }.tn-kpi-lbl { font-size:13px; }.tn-kpi-ic { width:25px; height:25px; font-size:13px; }.tn-filter-fields { grid-template-columns:repeat(2,minmax(0,1fr)); }
}
@media (max-width:480px) { .tn-header-right { width:100%; justify-content:space-between; }.tn-title { font-size:16px; }.tn-kpi-ic { display:none; }.tn-kpi > div:last-child { flex-direction:column; gap:2px; }.tn-kpi { padding:8px; }.tn-controls summary { padding:10px; font-size:13px; }.tn-filter-action { margin-left:5px; }.tn-filter-summary { font-size:13px; } }
@media (max-width:800px) {
  #navHome { display:grid; grid-template-columns:minmax(0,1fr) auto; align-items:center; background:#fff; }
  #navHome >>> .row.colorbg:first-child { grid-column:1; grid-row:1; padding:6px 12px !important; }
  #navHome >>> .row.colorbg:nth-child(2) { grid-column:2; grid-row:1; }
  #navHome >>> .imgab2 { width:85px; height:auto; margin:0; }
  #navHome >>> #nav-phone { grid-column:1/-1; padding:3px 10px; }
  #navHome >>> #nav-phone .navbar-toggler { padding:3px 8px; font-size:16px; }
}
.tn-wrap { font-size:14px; font-weight:400; line-height:1.65; color:#273c50; }
.tn-wrap input::placeholder { color:#65758a; opacity:1; }
.tn-table th { color:#45586c; font-weight:600; background:#edf2f7; }.tn-table td { color:#34485d; }
.tn-chip.friend { color:#235fa6; }.tn-chip.follower { color:#256b45; }.tn-chip.target { color:#b43838; }.tn-chip.interact { color:#875b12; }
.tn-graph >>> .node-label { font-size:14px; font-weight:600; fill:#253c50 !important; }
.tn-panel-heading,.tn-table-head h2,.tn-graph-heading h2 { font-size:16px; }
@media (max-width:540px) { .tn-kpis { grid-template-columns:repeat(2,minmax(0,1fr)); }.tn-header-right { flex-wrap:wrap; }.tn-filter-summary { white-space:normal; }.tn-title { font-size:18px; } }
.tn-filter-fields { grid-template-columns:minmax(180px,1fr) 150px minmax(170px,1fr); grid-template-areas:'search depth force' 'relations platforms platforms'; padding:12px 14px; gap:12px 16px; align-items:start; text-align:left; }
.tn-filter-fields > .tn-ctl-group:nth-child(1) { grid-area:search; }.tn-filter-fields > .tn-ctl-group:nth-child(2) { grid-area:depth; }.tn-filter-fields > .tn-ctl-group:nth-child(3) { grid-area:relations; }.tn-filter-fields > .tn-ctl-group:nth-child(4) { grid-area:platforms; }.tn-filter-fields > .tn-ctl-group:nth-child(5) { grid-area:force; }
.tn-filter-fields .tn-ctl-label { font-size:13px; margin:0 0 7px; color:#45586c; text-align:left; }
.tn-filter-fields .tn-toggle { display:inline-flex; justify-content:flex-start; gap:8px; margin:0 6px 5px 0; padding:6px 8px; border:1px solid #e2e8ef; background:#f8fafc; border-radius:7px; font-size:13px; }
.tn-filter-fields .tn-toggle-left { gap:6px; }.tn-filter-fields .tn-search input { padding-top:8px; padding-bottom:8px; }.tn-filter-fields .tn-seg-btn { padding:6px 0; }.tn-filter-fields .tn-range { display:block; height:25px; margin:0; }.tn-filter-fields .tn-range-labels { font-size:12px; }.tn-filter-summary .tn-text-btn { margin-left:14px; font-size:13px; }
.tn-filter-fields .tn-toggle { gap:5px; padding:5px 4px; margin-right:4px; }.tn-filter-fields .tn-switch { width:26px; height:16px; }.tn-filter-fields .tn-slider:before { width:10px; height:10px; }.tn-filter-fields .tn-switch input:checked + .tn-slider:before { transform:translateX(10px); }
@media (min-width:1400px) { .tn-filter-fields { grid-template-columns:minmax(180px,1fr) 140px minmax(330px,1.4fr) minmax(355px,1.6fr) minmax(160px,.9fr); grid-template-areas:'search depth relations platforms force'; gap:14px; } }
@media (max-width:700px) { .tn-filter-fields { grid-template-columns:minmax(0,1fr) minmax(0,1fr); grid-template-areas:'search search' 'depth force' 'relations relations' 'platforms platforms'; gap:10px 12px; }.tn-filter-summary { display:flex; align-items:center; flex-wrap:wrap; justify-content:flex-end; gap:4px; }.tn-filter-summary .tn-text-btn,.tn-filter-action { margin-left:5px; } }
</style>
