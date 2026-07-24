import Vue from 'vue'

// ข้อมูลจำลองทั้งหมด เก็บแบบ reactive ด้วย Vue.observable
// เพื่อให้ทุก component/view ที่ import เข้ามาเห็นข้อมูลชุดเดียวกัน
const state = Vue.observable({
  bags: [
    {
      _id: 'bag_1',
      name: 'ถุงคำแบรนด์ A',
      description: 'ติดตามการพูดถึงแบรนด์หลัก',
      search_query: 'แบรนด์เอ, brand a',
      exclude_query: 'สแปม',
      is_active: true,
      config_mode: 'custom',
      domain_id: null,
      subdomain_ids: [],
      object_ids: [],
    },
    {
      _id: 'bag_2',
      name: 'ถุงคำแคมเปญ B',
      description: 'แคมเปญโปรโมชั่นไตรมาส 3',
      search_query: 'แคมเปญบี + ลดราคา',
      exclude_query: 'ร้านปิด',
      is_active: true,
      config_mode: 'custom',
      domain_id: null,
      subdomain_ids: [],
      object_ids: [],
    },
    {
      _id: 'bag_3',
      name: 'ถุงคำคู่แข่ง C',
      description: '',
      search_query: 'คู่แข่งซี',
      exclude_query: '',
      is_active: false,
      config_mode: 'custom',
      domain_id: null,
      subdomain_ids: [],
      object_ids: [],
    },
  ],

  alertSettings: {
    bag_1: {
      metric: 'frequency',
      window_minutes: 30,
      threshold_percent: 150,
      min_volume: 10,
      cooldown_minutes: 120,
      severity_thresholds: { medium: 150, high: 300 },
      notify_channels: ['in_app', 'email'],
    },
    bag_2: {
      metric: 'engagement',
      window_minutes: 15,
      threshold_percent: 200,
      min_volume: 5,
      cooldown_minutes: 60,
      severity_thresholds: { medium: 180, high: 350 },
      notify_channels: ['in_app'],
    },
    bag_3: {
      metric: 'frequency',
      window_minutes: 60,
      threshold_percent: 150,
      min_volume: 10,
      cooldown_minutes: 120,
      severity_thresholds: { medium: 150, high: 300 },
      notify_channels: ['in_app'],
    },
  },

  events: [
    {
      _id: 'evt_1',
      bag_id: 'bag_1',
      bag_name: 'ถุงคำแบรนด์ A',
      change_percent: 340,
      severity: 'high',
      status: 'new',
      window_start: new Date(Date.now() - 45 * 60000).toISOString(),
      window_end: new Date(Date.now() - 15 * 60000).toISOString(),
      created_at: new Date(Date.now() - 15 * 60000).toISOString(),
    },
    {
      _id: 'evt_2',
      bag_id: 'bag_2',
      bag_name: 'ถุงคำแคมเปญ B',
      change_percent: 180,
      severity: 'medium',
      status: 'new',
      window_start: new Date(Date.now() - 3 * 3600000).toISOString(),
      window_end: new Date(Date.now() - 2.5 * 3600000).toISOString(),
      created_at: new Date(Date.now() - 2.5 * 3600000).toISOString(),
    },
    {
      _id: 'evt_3',
      bag_id: 'bag_3',
      bag_name: 'ถุงคำคู่แข่ง C',
      change_percent: 210,
      severity: 'medium',
      status: 'resolved',
      window_start: new Date(Date.now() - 26 * 3600000).toISOString(),
      window_end: new Date(Date.now() - 25.5 * 3600000).toISOString(),
      created_at: new Date(Date.now() - 25.5 * 3600000).toISOString(),
    },
  ],

  // อนุกรมข้อมูล Domain -> Subdomain -> Object จำลอง สำหรับโหมด "ดึงจาก Domain"
  domains: [
    { id: 'dom_1', name: 'เครื่องดื่ม' },
    { id: 'dom_2', name: 'ยานยนต์' },
    { id: 'dom_3', name: 'การเมือง' },
  ],
  subdomains: [
    { subdomain_id: 'sub_1', domain_id: 'dom_1', subdomain_name: 'น้ำอัดลม' },
    { subdomain_id: 'sub_2', domain_id: 'dom_1', subdomain_name: 'กาแฟและชา' },
    { subdomain_id: 'sub_3', domain_id: 'dom_2', subdomain_name: 'รถยนต์ไฟฟ้า' },
    { subdomain_id: 'sub_4', domain_id: 'dom_2', subdomain_name: 'รถยนต์สันดาป' },
    { subdomain_id: 'sub_5', domain_id: 'dom_3', subdomain_name: 'นโยบายเศรษฐกิจ' },
  ],
  objects: [
    { object_id: 'obj_1', subdomain_id: 'sub_1', object_name: 'แบรนด์เอ' },
    { object_id: 'obj_2', subdomain_id: 'sub_1', object_name: 'แบรนด์บี' },
    { object_id: 'obj_3', subdomain_id: 'sub_2', object_name: 'คาเฟ่เอ็กซ์' },
    { object_id: 'obj_4', subdomain_id: 'sub_2', object_name: 'ชาเขียววาย' },
    { object_id: 'obj_5', subdomain_id: 'sub_3', object_name: 'อีวีแบรนด์ซี' },
    { object_id: 'obj_6', subdomain_id: 'sub_4', object_name: 'ปิคอัพแบรนด์ดี' },
    { object_id: 'obj_7', subdomain_id: 'sub_5', object_name: 'มาตรการกระตุ้นเศรษฐกิจ' },
  ],
})

let nextBagId = 4

function delay(ms = 200) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// mockApi มี signature หน้าตาคล้าย fetch เดิม เพื่อให้สลับกลับไปต่อ backend จริงทีหลังได้ง่าย
export const mockApi = {
  async listBags() {
    await delay()
    return JSON.parse(JSON.stringify(state.bags))
  },

  async createBag(payload) {
    await delay()
    const bag = { _id: `bag_${nextBagId++}`, is_active: true, ...payload }
    state.bags.push(bag)
    state.alertSettings[bag._id] = {
      metric: 'frequency',
      window_minutes: 30,
      threshold_percent: 150,
      min_volume: 10,
      cooldown_minutes: 120,
      severity_thresholds: { medium: 150, high: 300 },
      notify_channels: ['in_app'],
    }
    return JSON.parse(JSON.stringify(bag))
  },

  async updateBag(id, payload) {
    await delay()
    const bag = state.bags.find((b) => b._id === id)
    if (bag) Object.assign(bag, payload)
    return JSON.parse(JSON.stringify(bag))
  },

  async deleteBag(id) {
    await delay()
    state.bags = state.bags.filter((b) => b._id !== id)
    delete state.alertSettings[id]
  },

  async getAlertSettings(bagId) {
    await delay()
    return JSON.parse(JSON.stringify(state.alertSettings[bagId]))
  },

  async updateAlertSettings(bagId, payload) {
    await delay()
    state.alertSettings[bagId] = { ...state.alertSettings[bagId], ...payload }
    return JSON.parse(JSON.stringify(state.alertSettings[bagId]))
  },

  async listEvents() {
    await delay()
    return JSON.parse(JSON.stringify(state.events)).sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    )
  },

  // จำลอง spike event ใหม่เข้ามาแบบสุ่ม ใช้แทน realtime socket.io ตอนยังไม่มี backend
  simulateNewEvent() {
    const bag = state.bags[Math.floor(Math.random() * state.bags.length)]
    const changePercent = 150 + Math.floor(Math.random() * 300)
    const event = {
      _id: `evt_${Date.now()}`,
      bag_id: bag._id,
      bag_name: bag.name,
      change_percent: changePercent,
      severity: changePercent >= 300 ? 'high' : 'medium',
      status: 'new',
      window_start: new Date(Date.now() - 30 * 60000).toISOString(),
      window_end: new Date().toISOString(),
      created_at: new Date().toISOString(),
    }
    state.events.unshift(event)
    return event
  },

  // ----- Domain / Subdomain / Object (สำหรับโหมด "ดึงจาก Domain") -----
  async listDomains() {
    await delay(150)
    return JSON.parse(JSON.stringify(state.domains))
  },

  async listSubdomains(domainId) {
    await delay(150)
    return JSON.parse(
      JSON.stringify(state.subdomains.filter((s) => s.domain_id === domainId))
    )
  },

  async listObjects(subdomainIds) {
    await delay(150)
    const ids = subdomainIds || []
    return JSON.parse(
      JSON.stringify(state.objects.filter((o) => ids.includes(o.subdomain_id)))
    )
  },
}

export default state