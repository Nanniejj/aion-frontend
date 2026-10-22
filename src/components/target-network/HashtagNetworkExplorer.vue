<template>
  <section class="hn" aria-label="สำรวจเครือข่ายแฮชแท็ก">
    <div class="hn-query-card">
      <div class="hn-query-intro"><span class="hn-eyebrow">HASHTAG EXPLORER</span><h2>ใครกำลังขับเคลื่อนบทสนทนานี้?</h2><p>ค้นหาแฮชแท็กเพื่อดูบัญชีที่ใช้ ความเชื่อมโยง และ Impact จากโพสต์ที่พบ</p></div>
      <form class="hn-query-form" @submit.prevent="applyHashtag">
        <div class="hn-query-input"><label for="hn-hashtag">แฮชแท็กที่ต้องการวิเคราะห์</label><div><span aria-hidden="true">#</span><input id="hn-hashtag" v-model="hashtagInput" placeholder="เช่น เมืองน่าอยู่" required autocomplete="off" :aria-invalid="Boolean(inputError)" :aria-describedby="inputError ? 'hn-input-error' : null" /></div></div>
        <div class="hn-period"><label for="hn-period">ช่วงข้อมูลตัวอย่าง</label><select id="hn-period" v-model.number="period"><option :value="7">7 วันล่าสุด</option><option :value="30">30 วันล่าสุด</option></select></div>
        <button class="hn-primary" type="submit"><i class="fa fa-search" aria-hidden="true"></i> วิเคราะห์เครือข่าย</button>
      </form>
      <p v-if="inputError" id="hn-input-error" class="hn-input-error" role="alert">{{ inputError }}</p>
      <div class="hn-suggestions"><span>ลองสำรวจ</span><button v-for="tag in suggestedTags" :key="tag" :class="{ active: selectedHashtag === tag }" @click="chooseHashtag(tag)">#{{ tag }}</button><span class="hn-demo-period">ข้อมูลจำลอง ณ 19 ต.ค. 2026 · {{ period === 7 ? '13–19' : '20 ก.ย.–19' }} ต.ค. 2026</span></div>
    </div>

    <div class="hn-metrics" aria-live="polite">
      <div class="hn-metric"><span class="hn-metric-icon purple">#</span><div><span>บัญชีที่ใช้แฮชแท็ก</span><strong>{{ number(accounts.length) }} <small>บัญชี</small></strong></div></div>
      <div class="hn-metric"><span class="hn-metric-icon blue"><i class="fa fa-file-text-o" aria-hidden="true"></i></span><div><span>โพสต์ที่พบ</span><strong>{{ number(totalPosts) }} <small>โพสต์</small></strong></div></div>
      <div class="hn-metric"><span class="hn-metric-icon green"><i class="fa fa-comments" aria-hidden="true"></i></span><div><span>Engagement รวม</span><strong>{{ number(totalEngagement) }}</strong></div></div>
      <div class="hn-metric hn-metric-leader"><span class="hn-metric-icon amber"><i class="fa fa-bolt" aria-hidden="true"></i></span><div><span>Impact สูงสุดในผลลัพธ์</span><strong>{{ leader ? leader.name : '—' }}</strong><small>{{ leader ? number(leader.impact) + ' คะแนน' : 'ยังไม่มีข้อมูล' }}</small></div></div>
    </div>

    <div class="hn-workspace">
      <details class="hn-card hn-filters">
        <summary><span><i class="fa fa-sliders" aria-hidden="true"></i> ตัวกรองเครือข่าย</span><span class="hn-filter-summary">{{ platforms.filter(platform => platform.on).length }} แพลตฟอร์ม · {{ minImpact ? 'Impact ≥ ' + number(minImpact) : 'ทุกระดับ Impact' }}<button class="hn-text-button" @click.stop.prevent="resetFilters">รีเซ็ต</button><span class="hn-filter-action">ปรับตัวกรอง</span></span></summary>
        <div class="hn-filter-fields">
        <div class="hn-filter-control hn-filter-search"><label class="hn-field-label" for="hn-account-search">ค้นหาในบัญชีที่พบ</label><div class="hn-account-search"><i class="fa fa-search" aria-hidden="true"></i><input id="hn-account-search" v-model="accountSearch" type="search" placeholder="ชื่อ / @username" /></div></div>
        <fieldset><legend>แพลตฟอร์ม</legend><label v-for="platform in platforms" :key="platform.key" class="hn-check-row"><span><span class="hn-platform-dot" :style="{ background: platform.color }"></span>{{ platform.label }}</span><input v-model="platform.on" type="checkbox" /></label></fieldset>
        <div class="hn-filter-control hn-filter-impact"><label class="hn-field-label" for="hn-min-impact">Impact ขั้นต่ำ</label><select id="hn-min-impact" v-model.number="minImpact"><option :value="0">แสดงทุกบัญชี</option><option :value="500">500 คะแนนขึ้นไป</option><option :value="2000">2,000 คะแนนขึ้นไป</option></select></div>
        <fieldset><legend>เส้นเชื่อมในกราฟ</legend><div class="hn-connection-label"><span class="hn-line"></span>บัญชีที่ใช้แฮชแท็กนี้</div><label class="hn-check-row"><span>แฮชแท็กที่ใช้ร่วมกัน</span><input v-model="showRelated" type="checkbox" /></label></fieldset>
        <div class="hn-reading-guide"><i class="fa fa-info-circle" aria-hidden="true"></i><p>เส้นเชื่อมบอกว่าบัญชีใช้แฮชแท็กในโพสต์ ไม่ได้หมายความว่าบัญชีเหล่านี้รู้จักกัน</p></div>
        </div>
      </details>

      <main class="hn-card hn-map">
        <div class="hn-map-header"><div><span class="hn-eyebrow">CONVERSATION NETWORK</span><h3>#{{ selectedHashtag }}</h3></div><span class="hn-result-count">{{ accounts.length }} บัญชี · {{ graphLinks.length }} เส้นเชื่อม</span></div>
        <div class="hn-map-legend"><span><b class="hn-dot purple"></b>แฮชแท็กหลัก</span><span><b class="hn-dot amber"></b>Impact สูงสุด 3 อันดับ</span><span><b class="hn-dot blue"></b>บัญชีอื่น</span><span v-if="showRelated"><b class="hn-dot muted"></b>แฮชแท็กร่วม</span></div>
        <div class="hn-graph">
          <d3-network v-if="accounts.length" :key="selectedHashtag" :net-nodes="graphNodes" :net-links="graphLinks" :options="graphOptions" :custom-forces="{ Collide: [52] }" :selection="graphSelection" @node-click="onNodeClick" />
          <div v-else class="hn-empty" role="status"><span class="hn-empty-hash">#</span><h3>ยังไม่พบเครือข่ายนี้</h3><p>ลองเลือกแฮชแท็กตัวอย่าง หรือปรับตัวกรองบัญชี</p><button class="hn-primary" @click="showSample">ดูตัวอย่าง #เมืองน่าอยู่</button></div>
          <div v-if="accounts.length" class="hn-graph-caption"><span>ขนาดบัญชี = Impact · เส้นหนา = จำนวนโพสต์</span><span>คลิกบัญชีเพื่อดูที่มาของคะแนน</span></div>
        </div>
        <div class="hn-map-footer"><i class="fa fa-mouse-pointer" aria-hidden="true"></i> คลิกแฮชแท็กร่วมเพื่อเปลี่ยนประเด็นที่วิเคราะห์ <span>ลากจุดเพื่อจัดตำแหน่ง</span></div>
      </main>

      <aside class="hn-card hn-insights">
        <div class="hn-panel-title"><div><span class="hn-eyebrow">TOP VOICES</span><h3>ใครสร้าง Impact สูง?</h3></div><i class="fa fa-bolt hn-amber-text" aria-hidden="true"></i></div>
        <p class="hn-ranking-note">จัดอันดับจากโพสต์ที่ใช้ #{{ selectedHashtag }} ภายใต้ตัวกรองปัจจุบัน</p>
        <ol class="hn-leaderboard"><li v-for="(account, index) in rankedAccounts.slice(0, 5)" :key="account.id"><button :class="{ selected: selectedAccountId === account.id }" @click="selectedAccountId = account.id"><span class="hn-rank" :class="{ first: index === 0 }">{{ index + 1 }}</span><span class="hn-leader-name"><strong>{{ account.name }}</strong><small>{{ account.platform }} · {{ account.postCount }} โพสต์</small><span class="hn-mini-track"><span :style="{ width: (account.impact / leader.impact * 100) + '%' }"></span></span></span><span class="hn-leader-score">{{ number(account.impact) }}<small>Impact</small></span></button></li></ol>
        <p v-if="!accounts.length" class="hn-no-ranking">ไม่มีบัญชีสำหรับจัดอันดับ</p>
        <div v-if="selectedAccount" class="hn-account-detail" aria-live="polite">
          <div class="hn-panel-title"><h3>บัญชีที่เลือก</h3><button class="hn-text-button" aria-label="ปิดรายละเอียดบัญชี" @click="selectedAccountId = null">ปิด</button></div>
          <div class="hn-selected-person"><span class="hn-avatar">{{ selectedAccount.name.charAt(0) }}</span><div><strong>{{ selectedAccount.name }}</strong><span>{{ selectedAccount.handle }} · {{ selectedAccount.platform }}</span></div></div>
          <div class="hn-breakdown"><div><span>ถูกใจ</span><b>{{ number(selectedAccount.likes) }}</b></div><div><span>ความคิดเห็น</span><b>{{ number(selectedAccount.comments) }}</b></div><div><span>แชร์ / รีโพสต์</span><b>{{ number(selectedAccount.shares) }}</b></div></div>
          <p class="hn-score-equation">{{ number(selectedAccount.likes) }} + (2 × {{ number(selectedAccount.comments) }}) + (3 × {{ number(selectedAccount.shares) }}) = <strong>{{ number(selectedAccount.impact) }}</strong></p>
          <h4>ตัวอย่างโพสต์ที่ใช้แฮชแท็ก</h4><article v-for="post in selectedAccount.samplePosts.slice(0, 2)" :key="post.id" class="hn-post"><time>{{ post.date }}</time><p>{{ post.text }}</p><span>{{ post.tags.map(tag => '#' + tag).join(' ') }}</span><small>{{ number(post.likes + post.comments + post.shares) }} Engagement</small></article>
        </div>
        <div v-else-if="accounts.length" class="hn-select-prompt"><i class="fa fa-hand-pointer-o" aria-hidden="true"></i><span>เลือกบัญชีเพื่อดูโพสต์และที่มาของ Impact</span></div>
        <details class="hn-impact-explainer"><summary>Impact คิดอย่างไร?</summary><p>ถูกใจ + (ความคิดเห็น × 2) + (แชร์ / รีโพสต์ × 3) จากโพสต์ที่ใช้แฮชแท็กในช่วงที่เลือก</p><p>สูตรจำลองสำหรับออกแบบ UI ไม่ใช่ยอดเข้าถึง และไม่ใช้จำนวนผู้ติดตามเป็นคะแนน</p></details>
      </aside>
    </div>

    <div class="hn-card hn-table-card">
      <div class="hn-table-header"><div><span class="hn-eyebrow">PARTICIPATING ACCOUNTS</span><h3>บัญชีที่ร่วมใช้ #{{ selectedHashtag }}</h3><p>ยอดรวมในส่วนนี้เปลี่ยนตามแฮชแท็ก ช่วงเวลา และตัวกรองทั้งหมด</p></div><div><label for="hn-sort">เรียงตาม</label><select id="hn-sort" v-model="sortBy"><option value="impact">Impact สูงสุด</option><option value="posts">จำนวนโพสต์</option><option value="engagement">Engagement สูงสุด</option></select></div></div>
      <div class="hn-table-scroll"><table><thead><tr><th scope="col">บัญชี / แพลตฟอร์ม</th><th scope="col">โพสต์ที่ใช้</th><th scope="col">Engagement</th><th scope="col">Impact <span class="hn-muted">คะแนน</span></th><th scope="col">แฮชแท็กที่ใช้ร่วม</th><th scope="col">ใช้ล่าสุด</th></tr></thead><tbody><tr v-for="account in sortedAccounts" :key="account.id" :class="{ selected: selectedAccountId === account.id }"><td><button class="hn-table-person" @click="inspectAccount(account.id)"><span class="hn-avatar" :class="{ gold: topAccountIds.includes(account.id) }">{{ account.name.charAt(0) }}</span><span><strong>{{ account.name }} <i v-if="topAccountIds.includes(account.id)" class="fa fa-bolt hn-amber-text" aria-label="Impact สูงสุด 3 อันดับ"></i></strong><small>{{ account.handle }} · {{ account.platform }}</small></span></button></td><td>{{ account.postCount }}</td><td>{{ number(account.engagement) }}</td><td><span class="hn-impact-cell"><b>{{ number(account.impact) }}</b><span><span :style="{ width: (account.impact / leader.impact * 100) + '%' }"></span></span></span></td><td><div class="hn-related-chips"><button v-for="tag in account.relatedTags" :key="tag" @click="chooseHashtag(tag)">#{{ tag }}</button><span v-if="!account.relatedTags.length" class="hn-muted">—</span></div></td><td class="hn-date-cell">{{ account.lastUsed }}</td></tr><tr v-if="!accounts.length"><td colspan="6" class="hn-empty-table">ไม่พบบัญชีที่ตรงกับเงื่อนไข</td></tr></tbody></table></div>
      <div class="hn-table-footer"><span>{{ accounts.length }} บัญชี · {{ totalPosts }} โพสต์ในผลลัพธ์</span><span><i class="fa fa-flask" aria-hidden="true"></i> ข้อมูลตัวอย่างสำหรับรีวิว UI ยังไม่เชื่อม API</span></div>
    </div>
  </section>
</template>

<script>
import D3Network from "vue-d3-network";

const ACCOUNTS = [
  { id: "a1", name: "เมืองดีดี", handle: "@muangdeedee", platform: "Facebook" },
  { id: "a2", name: "มานี จ.", handle: "@manee.j", platform: "Instagram" },
  { id: "a3", name: "Urban Voice", handle: "@urbanvoice", platform: "X" },
  { id: "a4", name: "ณัฐพงษ์ ต.", handle: "@nattapong", platform: "Facebook" },
  { id: "a5", name: "เดินเมืองกัน", handle: "@walkthecity", platform: "Instagram" },
  { id: "a6", name: "bkk_night", handle: "@bkk_night", platform: "X" },
  { id: "a7", name: "สมชาย ก.", handle: "@somchai_k", platform: "Facebook" },
  { id: "a8", name: "ploy_ss", handle: "@ploy_ss", platform: "Instagram" },
];
const TAGS = ["เมืองน่าอยู่", "ขนส่งสาธารณะ", "พื้นที่สีเขียว"];
// Deterministic fixtures: every total, edge and score is derived from these posts.
const POSTS = ACCOUNTS.flatMap((account, index) => [0, 1, 2].map(slot => {
  const age = (index + slot * 3) % 15;
  const date = new Date(Date.UTC(2026, 9, 19 - age)).toISOString().slice(0, 10);
  return {
    id: `${account.id}-p${slot}`, accountId: account.id, date,
    tags: slot === 0 ? [TAGS[index % 3], TAGS[(index + 1) % 3]] : [TAGS[slot - 1]],
    likes: (8 - index) * (slot + 1) * 57,
    comments: (8 - index) * (slot + 2) * 9,
    shares: (8 - index) * (3 - slot) * 7,
    text: ["ชวนคุยเรื่องเมืองที่เดินทางสะดวกและใช้ชีวิตได้ดีขึ้น มีจุดไหนที่อยากให้ปรับปรุงบ้าง?", "หนึ่งพื้นที่เล็ก ๆ ที่ช่วยให้เมืองน่าอยู่ขึ้น แบ่งปันไอเดียจากย่านของคุณกัน", "รวมมุมมองและข้อเสนอจากคนในชุมชน เพื่อพัฒนาเมืองไปด้วยกัน"][slot],
  };
}));

export default {
  name: "HashtagNetworkExplorer",
  components: { D3Network },
  data() {
    return {
      hashtagInput: "เมืองน่าอยู่", selectedHashtag: "เมืองน่าอยู่", suggestedTags: TAGS, inputError: "",
      period: 30, accountSearch: "", minImpact: 0, showRelated: true,
      sortBy: "impact", selectedAccountId: null,
      platforms: [
        { key: "Facebook", label: "Facebook", color: "#3b82f6", on: true },
        { key: "X", label: "X (Twitter)", color: "#334155", on: true },
        { key: "Instagram", label: "Instagram", color: "#cf67a4", on: true },
      ],
    };
  },
  computed: {
    matchingPosts() {
      const from = new Date(Date.UTC(2026, 9, 20 - this.period)).toISOString().slice(0, 10);
      return POSTS.filter(post => post.tags.includes(this.selectedHashtag) && post.date >= from && post.date <= "2026-10-19");
    },
    accounts() {
      const platforms = this.platforms.filter(item => item.on).map(item => item.key);
      const query = this.accountSearch.trim().toLocaleLowerCase();
      return ACCOUNTS.filter(account => platforms.includes(account.platform) && (!query || `${account.name} ${account.handle}`.toLocaleLowerCase().includes(query))).map(account => {
        const posts = this.matchingPosts.filter(post => post.accountId === account.id);
        const totals = posts.reduce((total, post) => ({ likes: total.likes + post.likes, comments: total.comments + post.comments, shares: total.shares + post.shares }), { likes: 0, comments: 0, shares: 0 });
        return { ...account, ...totals, postCount: posts.length,
          engagement: totals.likes + totals.comments + totals.shares,
          impact: totals.likes + 2 * totals.comments + 3 * totals.shares,
          relatedTags: [...new Set(posts.flatMap(post => post.tags))].filter(tag => tag !== this.selectedHashtag),
          samplePosts: posts.slice().sort((a, b) => b.date.localeCompare(a.date)),
          lastUsed: posts.length ? posts.map(post => post.date).sort().reverse()[0] : "",
        };
      }).filter(account => account.postCount > 0 && account.impact >= this.minImpact);
    },
    rankedAccounts() { return this.accounts.slice().sort((a, b) => b.impact - a.impact || a.id.localeCompare(b.id)); },
    sortedAccounts() {
      const key = { impact: "impact", posts: "postCount", engagement: "engagement" }[this.sortBy];
      return this.accounts.slice().sort((a, b) => b[key] - a[key] || b.impact - a.impact || a.id.localeCompare(b.id));
    },
    leader() { return this.rankedAccounts[0] || null; },
    topAccountIds() { return this.rankedAccounts.slice(0, 3).map(account => account.id); },
    totalPosts() { return this.accounts.reduce((total, account) => total + account.postCount, 0); },
    totalEngagement() { return this.accounts.reduce((total, account) => total + account.engagement, 0); },
    selectedAccount() { return this.accounts.find(account => account.id === this.selectedAccountId) || null; },
    relatedTags() { return this.showRelated ? [...new Set(this.accounts.flatMap(account => account.relatedTags))] : []; },
    graphNodes() {
      if (!this.accounts.length) return [];
      return [
        { id: "hashtag-root", name: `#${this.selectedHashtag}`, _color: "#b9a0ff", _size: 62 },
        ...this.accounts.map(account => ({ id: account.id, name: account.name, _color: this.topAccountIds.includes(account.id) ? "#f4c16b" : "#70b7ec", _size: 23 + Math.sqrt(account.impact / this.leader.impact) * 30 })),
        ...this.relatedTags.map(tag => ({ id: `tag:${tag}`, name: `#${tag}`, _color: "#89a9ae", _size: 28 })),
      ];
    },
    graphLinks() {
      return this.accounts.flatMap(account => [
        { id: `uses:${account.id}`, sid: account.id, tid: "hashtag-root", _color: this.topAccountIds.includes(account.id) ? "#e9b565" : "#6b9bc4", _svgAttrs: { "stroke-width": 1 + account.postCount * 1.5 } },
        ...account.relatedTags.filter(tag => this.relatedTags.includes(tag)).map(tag => ({ id: `co:${account.id}:${tag}`, sid: account.id, tid: `tag:${tag}`, _color: "#76979e", _svgAttrs: { "stroke-width": 1 + account.samplePosts.filter(post => post.tags.includes(tag)).length * 1.5, "stroke-dasharray": "5 5" } })),
      ]);
    },
    graphSelection() { return { nodes: this.selectedAccountId ? { [this.selectedAccountId]: true } : {}, links: {} }; },
    graphOptions() { return { force: 1800, forces: { X: 0.18, Y: 0.22, ManyBody: true, Link: true }, nodeSize: 28, nodeLabels: true, fontSize: 12, linkWidth: 2, strLinks: true }; },
  },
  watch: {
    accounts(accounts) { if (!accounts.some(account => account.id === this.selectedAccountId)) this.selectedAccountId = null; },
  },
  methods: {
    number(value) { return new Intl.NumberFormat("en-US").format(value); },
    applyHashtag() {
      const tag = this.hashtagInput.normalize("NFKC").trim().replace(/^#+/, "").toLocaleLowerCase();
      if (!tag || /\s|#/.test(tag)) { this.inputError = "กรอกแฮชแท็กหนึ่งคำ โดยไม่เว้นวรรค เช่น #เมืองน่าอยู่"; return; }
      this.inputError = "";
      this.selectedHashtag = tag; this.hashtagInput = tag; this.selectedAccountId = null;
    },
    chooseHashtag(tag) { this.hashtagInput = tag; this.applyHashtag(); },
    resetFilters() { this.accountSearch = ""; this.minImpact = 0; this.platforms.forEach(item => { item.on = true; }); this.showRelated = true; },
    showSample() { this.resetFilters(); this.chooseHashtag(TAGS[0]); },
    onNodeClick(event, node) {
      if (node.id === "hashtag-root") this.selectedAccountId = null;
      else if (String(node.id).startsWith("tag:")) this.chooseHashtag(String(node.id).slice(4));
      else this.selectedAccountId = node.id;
    },
    inspectAccount(id) {
      this.selectedAccountId = id;
      this.$nextTick(() => { const panel = this.$el.querySelector(".hn-account-detail"); if (panel) panel.scrollIntoView({ behavior: "auto", block: "nearest" }); });
    },
  },
};
</script>

<style scoped>
.hn { --hn-ink:#263c4c; --hn-muted:#7d8c9c; --hn-purple:#8064b6; color:var(--hn-ink); }
.hn button,.hn input,.hn select { font:inherit; }
.hn button { cursor:pointer; }
.hn input,.hn select { min-width:0; color:var(--hn-ink); border:1px solid #dfe5ed; border-radius:8px; background:#fff; padding:10px 12px; font-size:14px; }
.hn input:focus,.hn select:focus { border-color:#9986c2; }
.hn button:focus-visible,.hn input:focus-visible,.hn select:focus-visible,.hn summary:focus-visible { outline:3px solid #bca7e7; outline-offset:3px; }
.hn-query-card { border:1px solid #e2dfed; background:linear-gradient(115deg,#fff 25%,#f2eef9); padding:24px 26px 18px; border-radius:14px; margin-bottom:18px; }
.hn-eyebrow { display:block; font-size:13px; letter-spacing:1.7px; font-weight:800; color:#584d68; margin-bottom:7px; }
.hn-query-intro h2 { font-size:20px; font-weight:700; margin:0 0 8px; color:#342c46; }
.hn-query-intro p { font-size:14px; color:var(--hn-muted); margin:0 0 22px; }
.hn-query-form { display:grid; grid-template-columns:minmax(160px,1fr) 180px auto; gap:12px; align-items:end; }
.hn-query-form label,.hn-field-label { display:block; font-size:13px; color:#66768a; margin:0 0 8px; font-weight:600; }
.hn-query-input > div { display:flex; align-items:center; background:#fff; border:1px solid #dcd4e9; border-radius:8px; overflow:hidden; }
.hn-query-input > div > span { padding-left:14px; color:#5f5176; font-size:21px; }
.hn-query-input input { border:none; width:100%; background:transparent; font-weight:600; font-size:16px; padding:11px; }
.hn-query-input input:focus-visible { outline-offset:-3px; }
.hn-period select { width:100%; height:45px; }
.hn-primary { border:1px solid #78609e; background:#78609e; color:#fff; padding:12px 18px; border-radius:8px; font-size:14px !important; min-height:45px; font-weight:600 !important; }
.hn-primary:hover { background:#644c8b; }
.hn-primary i { margin-right:7px; }
.hn-input-error { font-size:13px; color:#a74960; margin:10px 0 0; }
.hn-suggestions { display:flex; flex-wrap:wrap; gap:8px; align-items:center; margin-top:16px; font-size:13px; color:#585064; }
.hn-suggestions button { color:#7a6797; border:1px solid #e5deee; padding:4px 9px; background:#ffffff9c; border-radius:20px; font-size:13px; }
.hn-suggestions button.active { background:#e9e0f6; border-color:#d8c8ec; color:#6a4b96; }
.hn-demo-period { margin-left:auto; color:#595360; }
.hn-metrics { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:14px; margin-bottom:22px; }
.hn-metric { border:1px solid #e3e8ee; border-radius:12px; background:white; padding:17px; display:flex; gap:13px; align-items:center; min-width:0; }
.hn-metric-icon { width:42px; height:42px; border-radius:12px; display:flex; align-items:center; justify-content:center; flex-shrink:0; font-size:20px; }
.purple { background:#f0eafa; color:#5d487d; }.blue { background:#eaf2fc; color:#3a5d7f; }.green { background:#e9f5ef; color:#39614f; }.amber { background:#fff3df; color:#876733; }.muted { background:#e4eef0; color:#55696e; }
.hn-metric > div { min-width:0; }.hn-metric div > span { display:block; font-size:13px; color:var(--hn-muted); margin-bottom:5px; }
.hn-metric strong { display:block; font-size:25px; font-weight:800; line-height:1.3; font-variant-numeric:tabular-nums; }.hn-metric strong small { font-size:13px; color:#535b65; font-weight:400; }
.hn-metric-leader strong { font-size:16px; overflow-wrap:anywhere; }.hn-metric-leader div > small { font-size:13px; color:#71582d; }
.hn-workspace { display:grid; grid-template-columns:210px minmax(0,1fr) 300px; gap:16px; align-items:start; }
.hn-card { background:white; border:1px solid #e2e8ee; border-radius:12px; min-width:0; overflow:hidden; }
.hn-filters,.hn-insights { padding:18px 16px; }
.hn-panel-title { display:flex; align-items:center; justify-content:space-between; gap:10px; margin-bottom:15px; }
.hn h3 { font-size:15px; font-weight:700; margin:0; line-height:1.6; }
.hn-text-button { background:none; border:0; font-size:13px !important; color:#8c70ad; padding:2px; }
.hn-account-search { position:relative; margin-bottom:22px; }.hn-account-search i { position:absolute; top:12px; left:10px; color:#666d75; font-size:13px; }.hn-account-search input { width:100%; padding-left:29px; font-size:13px; background:#fafbfd; }
.hn fieldset { min-width:0; border:0; padding:0; margin:22px 0; }.hn legend { font-size:13px; color:#66768a; font-weight:600; margin-bottom:12px; width:auto; }
.hn-check-row { display:flex; justify-content:space-between; align-items:center; gap:8px; font-size:14px; margin-bottom:13px; color:#536478; cursor:pointer; }.hn-check-row > span { display:flex; align-items:center; gap:8px; }.hn-check-row input { accent-color:#9275b4; width:15px; height:15px; cursor:pointer; }
.hn-platform-dot { width:7px; height:7px; border-radius:50%; }.hn-filters > select { width:100%; font-size:13px; }
.hn-connection-label { display:flex; align-items:center; gap:8px; font-size:13px; color:#4a5560; margin-bottom:14px; }.hn-line { width:18px; height:2px; background:#9f8bbc; }
.hn-reading-guide { border-top:1px solid #edf0f5; padding-top:17px; color:#565f69; font-size:13px; display:flex; gap:8px; line-height:1.8; }.hn-reading-guide i { margin-top:4px; }.hn-reading-guide p { margin:0; }
.hn-map-header { display:flex; align-items:center; justify-content:space-between; gap:10px; padding:18px 20px 12px; flex-wrap:wrap; }.hn-map-header h3 { font-size:19px; color:#655080; overflow-wrap:anywhere; }
.hn-result-count { font-size:13px; color:#8a78a1; background:#f4f0f9; padding:5px 8px; border-radius:6px; white-space:nowrap; }
.hn-map-legend { display:flex; flex-wrap:wrap; gap:12px; padding:0 20px 16px; }.hn-map-legend > span { display:flex; align-items:center; gap:5px; font-size:13px; color:#4f5862; }.hn-dot { width:7px; height:7px; border-radius:50%; display:inline-block; }.hn-dot.purple { background:#b9a0ff; }.hn-dot.amber { background:#eabd6b; }.hn-dot.blue { background:#70b7ec; }.hn-dot.muted { background:#89a9ae; }
.hn-graph { height:530px; position:relative; background-color:#fbfaff; background-image:radial-gradient(ellipse at 50% 45%,#ede7f77a,transparent 70%),radial-gradient(circle at 1px 1px,#a69bbd30 1px,transparent 0); background-size:100% 100%,24px 24px; overflow:hidden; }
.hn-graph >>> .net { height:530px !important; }.hn-graph >>> .node { cursor:pointer; stroke:#fff; stroke-width:3px; filter:drop-shadow(0 3px 6px #65508020); }.hn-graph >>> .node:hover,.hn-graph >>> .node.selected { stroke:#796293; stroke-width:4px; }.hn-graph >>> .node-label { fill:#4a405c !important; font-size:14px; paint-order:stroke; stroke:#fbfaff; stroke-width:3px; font-weight:500; text-anchor:middle; transform:translate(-32px,30px); pointer-events:none; }.hn-graph >>> .link { stroke-opacity:.7; stroke-linecap:round; }
.hn-graph-caption { position:absolute; bottom:13px; left:16px; right:16px; display:flex; justify-content:space-between; gap:10px; flex-wrap:wrap; color:#7d6c92; font-size:13px; pointer-events:none; }.hn-graph-caption span { background:#ffffffeb; border:1px solid #e9e2f2; padding:5px 7px; border-radius:5px; }
.hn-map-footer { padding:12px 16px; font-size:13px; color:#575f69; display:flex; gap:7px; align-items:center; flex-wrap:wrap; }.hn-map-footer > span { margin-left:auto; color:#686e75; }
.hn-ranking-note { font-size:13px; color:#59606a; line-height:1.8; margin-bottom:12px; overflow-wrap:anywhere; }.hn-amber-text { color:#82622b; }
.hn-leaderboard { list-style:none; padding:0; margin:0; }.hn-leaderboard li { margin-bottom:3px; }.hn-leaderboard button { width:100%; display:flex; align-items:center; gap:10px; background:transparent; border:1px solid transparent; border-radius:9px; padding:10px 6px; text-align:left; color:inherit; }.hn-leaderboard button:hover,.hn-leaderboard button.selected { background:#f7f4fb; border-color:#e9e1f2; }
.hn-rank { font-size:13px; color:#626972; width:20px; height:25px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }.hn-rank.first { color:#72572a; background:#fff2dc; border-radius:6px; }
.hn-leader-name { flex:1; min-width:0; }.hn-leader-name strong { display:block; font-size:14px; overflow-wrap:anywhere; }.hn-leader-name > small { display:block; color:#5c636c; font-size:13px; margin:4px 0 7px; }.hn-mini-track { height:3px; background:#f0edf5; border-radius:3px; display:block; }.hn-mini-track > span { display:block; height:100%; background:#b7a1cf; border-radius:3px; }.hn-leaderboard li:first-child .hn-mini-track > span { background:#d6af70; }
.hn-leader-score { font-size:14px; font-weight:700; color:#8c6ba9; text-align:right; }.hn-leader-score small { display:block; font-size:13px; color:#62646b; font-weight:400; margin-top:3px; }
.hn-account-detail { border-top:1px solid #ece8f2; margin-top:17px; padding-top:17px; }.hn-selected-person { display:flex; gap:10px; align-items:center; }.hn-selected-person strong { display:block; font-size:15px; }.hn-selected-person div > span { display:block; font-size:13px; color:#5f656e; margin-top:4px; }
.hn-avatar { width:35px; height:35px; border-radius:10px; display:flex; align-items:center; justify-content:center; background:#eee8f6; color:#8a6aa6; flex-shrink:0; font-size:15px; }.hn-avatar.gold { background:#fff1da; color:#71562b; }
.hn-breakdown { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:5px; margin:16px 0 9px; }.hn-breakdown div { background:#f8f9fb; border-radius:7px; padding:9px 4px; text-align:center; }.hn-breakdown span { display:block; font-size:13px; color:#5d656e; margin-bottom:5px; }.hn-breakdown b { font-size:14px; }
.hn-score-equation { font-size:13px; color:#61556e; line-height:1.8; }.hn-account-detail h4 { font-size:13px; margin:15px 0 10px; font-weight:600; }
.hn-post { border:1px solid #eaeef2; border-radius:8px; padding:11px; margin-bottom:9px; }.hn-post time { font-size:13px; color:#616971; }.hn-post p { font-size:13px; line-height:1.8; margin:7px 0; color:#66788b; }.hn-post > span { color:#5f4a74; font-size:13px; display:block; }.hn-post > small { display:block; font-size:13px; color:#60676f; margin-top:8px; }
.hn-impact-explainer { border-top:1px solid #eceff3; margin-top:16px; padding-top:14px; }.hn-impact-explainer summary { color:#8b789f; font-size:13px; cursor:pointer; }.hn-impact-explainer p { font-size:13px; color:#525b65; line-height:1.8; margin:10px 0 0; }
.hn-select-prompt { display:flex; gap:10px; color:#616c75; font-size:13px; line-height:1.8; margin:20px 3px; }.hn-select-prompt i { margin-top:4px; }
.hn-table-card { margin-top:22px; }.hn-table-header { display:flex; justify-content:space-between; align-items:center; gap:16px; padding:20px 22px; }.hn-table-header h3 { font-size:15px; overflow-wrap:anywhere; }.hn-table-header p { font-size:13px; color:#59626c; margin:6px 0 0; }.hn-table-header > div:last-child { display:flex; align-items:center; gap:10px; flex-shrink:0; }.hn-table-header label { font-size:13px; color:#60676f; margin:0; }.hn-table-header select { font-size:13px; }
.hn-table-scroll { overflow-x:auto; }.hn table { width:100%; min-width:850px; border-collapse:collapse; }.hn th { font-size:13px; color:#565f6a; background:#f8fafc; border-top:1px solid #eaf0f4; border-bottom:1px solid #eaf0f4; padding:12px 20px; font-weight:600; text-align:left; }.hn td { padding:14px 20px; font-size:14px; border-bottom:1px solid #f0f3f6; }.hn tr.selected td { background:#f8f5fc; }.hn tbody tr:hover td { background:#faf8fd; }
.hn-table-person { display:flex; align-items:center; gap:12px; border:none; background:transparent; padding:0; text-align:left; color:inherit; }.hn-table-person strong { display:block; font-size:14px; }.hn-table-person small { display:block; font-size:13px; color:#5d656e; margin-top:5px; }.hn-table-person i { margin-left:5px; font-size:13px; }
.hn-impact-cell { display:flex; align-items:center; gap:10px; }.hn-impact-cell b { font-size:14px; color:#604973; min-width:38px; }.hn-impact-cell > span { height:4px; width:60px; background:#f1ecf7; border-radius:3px; }.hn-impact-cell > span > span { display:block; height:100%; background:#bea5d4; border-radius:3px; }
.hn-related-chips { display:flex; flex-wrap:wrap; gap:5px; }.hn-related-chips button { border:1px solid #e8e3f0; color:#9076aa; border-radius:5px; background:#fbf9ff; font-size:13px; padding:4px 7px; }.hn-related-chips button:hover { background:#eee6f7; }.hn-date-cell { font-size:13px !important; color:#5d656e; white-space:nowrap; }.hn-muted { color:#656c75; font-size:13px; }
.hn-table-footer { display:flex; justify-content:space-between; gap:10px; flex-wrap:wrap; padding:14px 20px; color:#626971; font-size:13px; }
.hn-empty { height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; color:#82738f; padding:24px; }.hn-empty-hash { font-size:48px; color:#665876; }.hn-empty h3 { font-size:17px; color:#544365; }.hn-empty p { font-size:14px; margin:12px 0 20px; }.hn-empty-table { text-align:center; color:#656c75; padding:35px !important; }.hn-no-ranking { font-size:14px; color:#616870; text-align:center; padding:24px 0; }
@media (min-width:1600px) { .hn-workspace { grid-template-columns:235px minmax(0,1fr) 320px; } }
@media (max-width:1200px) { .hn-workspace { grid-template-columns:195px minmax(0,1fr); }.hn-insights { grid-column:1/-1; }.hn-leaderboard { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:6px; }.hn-account-detail { max-width:650px; }.hn-metric { padding:14px 12px; gap:9px; }.hn-metric strong { font-size:22px; }.hn-metric-leader strong { font-size:16px; }.hn-metric-icon { width:34px; height:34px; font-size:17px; } }
@media (max-width:760px) { .hn-query-card { padding:19px 16px; }.hn-query-intro h2 { font-size:18px; }.hn-query-form { grid-template-columns:minmax(0,1fr) 130px; }.hn-query-form > button { grid-column:1/-1; }.hn-demo-period { margin-left:0; width:100%; margin-top:5px; }.hn-metrics { grid-template-columns:repeat(2,minmax(0,1fr)); gap:10px; }.hn-metric strong { font-size:23px; }.hn-metric-leader strong { font-size:16px; }.hn-workspace { grid-template-columns:minmax(0,1fr); }.hn-filters { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:0 18px; }.hn-filters .hn-panel-title,.hn-filters .hn-reading-guide { grid-column:1/-1; }.hn-filters > .hn-field-label,.hn-filters > .hn-account-search,.hn-filters > select { grid-column:1/-1; }.hn-filters fieldset { margin:12px 0; }.hn-filters fieldset:first-of-type { grid-row:6/8; }.hn-leaderboard { grid-template-columns:minmax(0,1fr); }.hn-graph,.hn-graph >>> .net { height:440px !important; }.hn-table-header { align-items:flex-start; flex-direction:column; padding:18px 16px; }.hn-query-intro p { line-height:1.8; }.hn-map-legend { gap:10px; } }
/* Keep the graph visible without traversing a stack of introductory cards. */
.hn-query-card { padding:12px 14px 9px; margin-bottom:10px; border-radius:10px; }
.hn-query-intro { display:none; }
.hn-query-form { grid-template-columns:minmax(120px,1fr) 145px auto; gap:9px; }
.hn-query-form label { margin-bottom:5px; font-size:13px; }
.hn-query-input input { font-size:15px; padding:8px 10px; }.hn-query-input > div > span { font-size:18px; }
.hn-period select { height:37px; padding:7px 9px; }.hn-query-form .hn-primary { min-height:37px; padding:8px 12px; }
.hn-suggestions { margin-top:8px; gap:6px; }.hn-suggestions button { font-size:13px; padding:3px 8px; }.hn-demo-period { font-size:13px; }
.hn-metrics { gap:8px; margin-bottom:10px; grid-template-columns:repeat(4,minmax(0,1fr)); }
.hn-metric { padding:9px 12px; gap:8px; border-radius:9px; }.hn-metric-icon { width:29px; height:29px; border-radius:8px; font-size:15px; }
.hn-metric div > span { font-size:13px; margin-bottom:2px; }.hn-metric strong { font-size:21px; }.hn-metric strong small { font-size:13px; }.hn-metric-leader strong { font-size:15px; }.hn-metric-leader div > small { font-size:13px; }
.hn-workspace { grid-template-columns:minmax(0,1fr) 280px; gap:10px; }
.hn-filters { display:block; grid-column:1/-1; padding:0; }
.hn-filters summary { display:flex; justify-content:space-between; align-items:center; gap:10px; padding:10px 14px; cursor:pointer; list-style:none; font-size:14px; color:#66718a; }
.hn-filters summary::-webkit-details-marker { display:none; }.hn-filters summary i { margin-right:6px; }
.hn-filter-summary { font-size:13px; color:#585260; }.hn-filter-action { color:#8c70ad; margin-left:14px; }.hn-filter-action:after { content:' ＋'; }.hn-filters[open] .hn-filter-action:after { content:' −'; }
.hn-filter-fields { display:grid; grid-template-columns:minmax(140px,1fr) minmax(140px,1fr) minmax(140px,1fr); gap:10px 24px; border-top:1px solid #eee9f4; padding:14px; align-items:start; }
.hn-filter-fields .hn-panel-title { grid-column:1/-1; margin:0; }.hn-filter-fields > .hn-field-label { grid-column:1; margin:0; }.hn-filter-fields .hn-account-search { grid-column:1; margin:0; }.hn-filter-fields > select { grid-column:1; width:100%; }
.hn-filter-fields fieldset { margin:0; }.hn-filter-fields fieldset:first-of-type { grid-column:2; grid-row:2/6; }.hn-filter-fields fieldset:last-of-type { grid-column:3; grid-row:2/6; }.hn-filter-fields .hn-reading-guide { grid-column:1/-1; padding-top:8px; }.hn-check-row { margin-bottom:10px; }
.hn-map-header { padding:11px 14px 5px; }.hn-map-header .hn-eyebrow { display:none; }.hn-map-header h3 { font-size:17px; }.hn-map-legend { padding:3px 14px 9px; gap:10px; }
.hn-graph,.hn-graph >>> .net { height:clamp(340px,52vh,520px) !important; }.hn-map-footer { padding:8px 12px; font-size:13px; }
.hn-insights { grid-column:auto; max-height:650px; overflow-y:auto; padding:13px; }.hn-insights .hn-panel-title { margin-bottom:7px; }.hn-insights .hn-eyebrow { display:none; }.hn-ranking-note { font-size:13px; margin-bottom:7px; }
.hn-leaderboard { display:block; }.hn-leaderboard button { padding:7px 4px; }.hn-select-prompt { margin:12px 3px; }.hn-impact-explainer { margin-top:10px; padding-top:10px; }
.hn-table-card { margin-top:10px; }.hn-table-header { padding:12px 16px; }.hn-table-header .hn-eyebrow { display:none; }.hn-table-header p { margin-top:3px; }.hn-table-scroll { max-height:340px; overflow:auto; }.hn th { position:sticky; top:0; z-index:1; }.hn td { padding:10px 16px; }.hn-table-footer { padding:10px 16px; }
@media (max-width:960px) {
  .hn-workspace { grid-template-columns:minmax(0,1fr); }.hn-insights { grid-column:auto; max-height:none; }.hn-leaderboard { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:5px; }.hn-query-form { grid-template-columns:minmax(120px,1fr) 125px auto; }.hn-query-form > button { grid-column:auto; }.hn-demo-period { width:auto; margin-left:auto; margin-top:0; }.hn-metric { padding:8px 10px; }.hn-metric-icon { display:none; }.hn-metric strong { font-size:19px; }.hn-metric-leader strong { font-size:14px; }.hn-table-header { flex-direction:row; align-items:center; }
}
@media (max-width:540px) {
  .hn-query-form { grid-template-columns:minmax(0,1fr) 105px; }.hn-query-form > button { grid-column:1/-1; min-height:32px; padding:6px 10px; }.hn-query-card { padding:10px; }.hn-suggestions > span:first-child,.hn-demo-period { display:none; }.hn-suggestions { gap:4px; }.hn-suggestions button { font-size:13px; padding:3px 6px; }.hn-metrics { gap:5px; }.hn-metric { padding:7px; }.hn-metric div > span { font-size:13px; }.hn-metric strong { font-size:17px; }.hn-metric-leader strong { font-size:13px; }.hn-metric-leader div > small { font-size:13px; }.hn-filters summary { padding:10px; font-size:13px; }.hn-filter-summary { font-size:13px; }.hn-filter-action { margin-left:6px; }.hn-filter-fields { grid-template-columns:repeat(2,minmax(0,1fr)); gap:10px 16px; }.hn-filter-fields .hn-panel-title,.hn-filter-fields > .hn-field-label,.hn-filter-fields .hn-account-search,.hn-filter-fields > select { grid-column:1/-1; }.hn-filter-fields fieldset:first-of-type { grid-column:1; grid-row:auto; }.hn-filter-fields fieldset:last-of-type { grid-column:2; grid-row:auto; }.hn-leaderboard { grid-template-columns:minmax(0,1fr); }.hn-table-header { align-items:flex-start; flex-direction:column; gap:8px; }.hn-map-legend { gap:7px; }.hn-map-legend > span { font-size:13px; }
}
.hn { --hn-ink:#26384e; --hn-muted:#52667c; --hn-purple:#6c428c; font-size:14px; font-weight:400; line-height:1.65; }
.hn input::placeholder { color:#65758a; opacity:1; }
.hn th { color:#45586c; font-weight:600; background:#edf2f7; }.hn td { color:#34485d; }
.hn-graph >>> .node-label { font-size:14px; font-weight:600; fill:#3e2c55 !important; }
.hn-result-count { color:#66478a; background:#eee6f8; }.hn-leader-score,.hn-impact-cell b { color:#704697; }
.hn-panel-title h3,.hn-table-header h3 { font-size:16px; }.hn-leader-name strong,.hn-table-person strong { font-size:15px; }
@media (max-width:600px) { .hn-metrics { grid-template-columns:repeat(2,minmax(0,1fr)); }.hn-query-form { grid-template-columns:minmax(0,1fr) 130px; }.hn-query-form > button { grid-column:1/-1; }.hn-filter-summary { white-space:normal; }.hn-leaderboard { grid-template-columns:minmax(0,1fr); } }
.hn-filter-fields { grid-template-columns:minmax(180px,1fr) minmax(280px,1.5fr) minmax(160px,.9fr) minmax(230px,1.2fr); gap:10px 16px; padding:12px 14px; text-align:left; }
.hn-filter-fields .hn-filter-control { min-width:0; }.hn-filter-fields .hn-account-search { margin:0; }.hn-filter-fields .hn-filter-control select { width:100%; padding:8px 10px; }
.hn-filter-fields .hn-field-label,.hn-filter-fields legend { font-size:13px; margin:0 0 7px; color:#45586c; text-align:left; }
.hn-filter-fields fieldset:first-of-type,.hn-filter-fields fieldset:last-of-type { grid-column:auto; grid-row:auto; margin:0; }
.hn-filter-fields .hn-check-row { display:inline-flex; gap:8px; padding:6px 8px; margin:0 5px 5px 0; background:#f8fafc; border:1px solid #e2e8ef; border-radius:7px; font-size:13px; }
.hn-filter-fields .hn-reading-guide { padding-top:7px; font-size:12px; }.hn-filter-fields .hn-reading-guide p { margin:0; }.hn-filter-fields .hn-connection-label { display:none; }.hn-filter-summary .hn-text-button { margin-left:14px; font-size:13px !important; }
@media (max-width:1200px) { .hn-filter-fields { grid-template-columns:minmax(0,1fr) minmax(0,1fr); }.hn-filter-fields .hn-filter-search { grid-column:1; grid-row:1; }.hn-filter-fields .hn-filter-impact { grid-column:2; grid-row:1; }.hn-filter-fields fieldset:first-of-type { grid-column:1; grid-row:2; }.hn-filter-fields fieldset:last-of-type { grid-column:2; grid-row:2; } }
@media (max-width:540px) { .hn-filter-fields { gap:10px; }.hn-filter-fields .hn-filter-search { grid-column:1/-1; }.hn-filter-fields .hn-filter-impact { grid-column:1/-1; grid-row:2; }.hn-filter-fields fieldset:first-of-type { grid-column:1/-1; grid-row:3; }.hn-filter-fields fieldset:last-of-type { grid-column:1/-1; grid-row:4; }.hn-filter-summary { display:flex; flex-wrap:wrap; justify-content:flex-end; align-items:center; gap:4px; }.hn-filter-summary .hn-text-button,.hn-filter-action { margin-left:5px; } }
</style>
