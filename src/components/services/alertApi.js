// services/alertApi.js
//
// เชื่อม frontend (KeywordBagsView.vue / KeywordBagForm.vue) เข้ากับ
// backend router ของ AlertKeywordBag (routes/alertKeywordBag.js)
//
// *** ปรับ BASE PATH ด้านล่างให้ตรงกับที่ backend mount จริง ***
// เช่นถ้า server.js มี: app.use('/api/alert/keywordBag', require('./routes/alertKeywordBag'))
// ค่า KEYWORD_BAG_BASE นี้ก็ถูกต้องแล้ว ถ้า mount path ต่างจากนี้ให้แก้ตรงนี้ที่เดียว

const DEFAULT_KEYWORD_BAG_BASE = '/api/alert/keywordBag'

// ⚠️ ยังไม่มี backend route ให้สำหรับ events/telegram ในโค้ดที่ส่งมา
// ค่า base ด้านล่างเป็นการเดา pattern ไว้ก่อน ต้องสร้าง route จริงฝั่ง backend
// (เช่น routes/alertEvent.js, routes/alertTelegram.js) แล้วปรับ path ให้ตรงกัน
const DEFAULT_EVENTS_BASE = '/api/alert/event'
const DEFAULT_TELEGRAM_BASE = '/api/alert/telegram'

/**
 * รองรับทั้ง axios instance ปกติ (this.$axios จาก @nuxtjs/axios แบบ raw)
 * และ helper แบบ $get/$post/$put/$delete (นิยมใน nuxt-axios)
 */
function makeHttp(client) {
  return {
    async get(url, params) {
      if (client.$get) return client.$get(url, { params })
      const res = await client.get(url, { params })
      return res.data
    },
    async post(url, data) {
      if (client.$post) return client.$post(url, data)
      const res = await client.post(url, data)
      return res.data
    },
    async put(url, data) {
      if (client.$put) return client.$put(url, data)
      const res = await client.put(url, data)
      return res.data
    },
    async delete(url, params) {
      if (client.$delete) return client.$delete(url, { params })
      const res = await client.delete(url, { params })
      return res.data
    },
  }
}

export function createAlertApi(
  httpClient,
  {
    keywordBagBase = DEFAULT_KEYWORD_BAG_BASE,
    eventsBase = DEFAULT_EVENTS_BASE,
    telegramBase = DEFAULT_TELEGRAM_BASE,
  } = {}
) {
  if (!httpClient) {
    throw new Error('createAlertApi ต้องการ http client (this.$axios) เป็น argument แรก')
  }

  const http = makeHttp(httpClient)

  return {
    // ---------------------------------------------------------------
    // Keyword Bag CRUD — ตรงกับ routes/alertKeywordBag.js
    // ---------------------------------------------------------------

    /**
     * GET /getKeywordBagList
     * options: { name, offset, limit, includeInactive }
     */
    async listBags(options = {}) {
      const res = await http.get(`${keywordBagBase}/getKeywordBagList`, options)
      // backend คืน { data, totalCount } — ฟอร์มปัจจุบัน (KeywordBagsView) ใช้แค่ array
      return res.data
    },

    /**
     * เผื่อกรณีต้องใช้ totalCount ด้วย (pagination)
     */
    async listBagsWithCount(options = {}) {
      const res = await http.get(`${keywordBagBase}/getKeywordBagList`, options)
      return res // { data, totalCount }
    },

    /** GET /getKeywordBag?id=... */
    async getBag(id) {
      const res = await http.get(`${keywordBagBase}/getKeywordBag`, { id })
      return res.data
    },

    /** POST /addKeywordBag */
    async createBag(payload) {
      const res = await http.post(`${keywordBagBase}/addKeywordBag`, payload)
      return res.data
    },

    /**
     * PUT /updateKeywordBag  (body ต้องมี id)
     * updateBag(id, payload) — เข้ากันได้กับที่ KeywordBagForm.vue เรียกใช้
     */
    async updateBag(id, payload) {
      const res = await http.put(`${keywordBagBase}/updateKeywordBag`, {
        id,
        ...payload,
      })
      return res.data
    },

    /**
     * PUT /deleteKeywordBag?id=...  (soft delete — set is_active: false)
     */
    async deleteBag(id) {
      return http.delete(`${keywordBagBase}/deleteKeywordBag`, { id })
      // หมายเหตุ: backend เป็น PUT ไม่ใช่ DELETE จริงๆ ถ้า axios.delete ไม่ยอมส่ง
      // ให้เปลี่ยนเป็น http.put(`${keywordBagBase}/deleteKeywordBag?id=${id}`) แทน
    },

    /** PUT /toggleAlert  body: { id, enable_alert } */
    async toggleAlert(id, enable_alert) {
      const res = await http.put(`${keywordBagBase}/toggleAlert`, {
        id,
        enable_alert,
      })
      return res.data
    },

    // ---------------------------------------------------------------
    // Spike Events — ⚠️ ยังไม่มี backend route ให้มา ต้องสร้างเพิ่ม
    // ---------------------------------------------------------------

    /**
     * คาดหวัง endpoint เช่น GET /api/alert/event/list
     * ที่คืนรายการ spike event พร้อม bag_id เพื่อให้ SpikeEventList.vue ใช้งานได้
     */
    async listEvents(options = {}) {
      const res = await http.get(`${eventsBase}/list`, options)
      return res.data || res
    },

    // ---------------------------------------------------------------
    // Telegram linking — ⚠️ ยังไม่มี backend route ให้มา ต้องสร้างเพิ่ม
    // KeywordBagForm.vue เรียก endpoint เหล่านี้ตรงๆ ผ่าน telegramApiBase
    // แนบไว้ตรงนี้เพื่อให้เห็น contract ที่ต้อง implement ฝั่ง backend:
    // ---------------------------------------------------------------

    /** GET /status -> { connected: boolean, telegram_user } */
    async getTelegramStatus() {
      return http.get(`${telegramBase}/status`)
    },

    /** POST /link-session -> { session_id, start_token, expires_at } */
    async createTelegramLinkSession() {
      return http.post(`${telegramBase}/link-session`, {})
    },

    /** GET /link-session/:id -> { status: 'pending'|'linked'|'expired'|'revoked', telegram_user } */
    async getTelegramLinkSession(sessionId) {
      return http.get(`${telegramBase}/link-session/${encodeURIComponent(sessionId)}`)
    },

    /** DELETE /connection */
    async disconnectTelegram() {
      return http.delete(`${telegramBase}/connection`)
    },
  }
}

export default createAlertApi