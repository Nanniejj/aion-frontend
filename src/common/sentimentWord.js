// ดึงคำ highlight จาก API check_sentiment_word แบบใช้ domain_id
//
// API ใหม่ต้องส่ง domain_id (ส่งชื่อ domain อย่างเดียวจะได้ "Missing domain_id")
// แต่หลาย component ยังเก็บแค่ "ชื่อ" domain/subdomain (เช่น ตัวกรองในหน้า Feed, Wordcloud, Report, Ranking)
// helper นี้จะแปลงชื่อ → id จากรายการ domain (getDomainlist) ให้ แล้วยิง API ด้วย domain_id
//
// การใช้งาน:
//   this.arrword = await fetchSentimentWord({ domainId, subdomainId, objectId });
//   this.arrword = await fetchSentimentWord({ domain: "การเมือง", subdomain: "พรรคการเมือง" });
//   this.arrword = await fetchSentimentWord({ domain: "การเมือง,เศรษฐกิจ" }); // หลาย domain → ยิงทีละ id แล้วรวมคำ
//
// คืนค่ารูปแบบเดียวกับ response.data[0] เดิมเสมอ: { Keywords: [...], and_keywords: [...] }
// - ถ้าหา id ของชื่อไหนไม่เจอ จะ fallback ไปยิงแบบชื่อเดิม (?domain=) สำหรับชื่อนั้น เพื่อไม่ให้ highlight หายไปจากเดิม
import axios from "axios";

const API = "https://api2.cognizata.com/api/v2";
const CHECK_URL = `${API}/object/check_sentiment_word`;

let domainListPromise = null;

function authHeaders() {
  return {
    Authorization: "Bearer " + localStorage.getItem("token"),
    "Content-Type": "application/json",
  };
}

const norm = (v) => String(v == null ? "" : v).trim();
const itemId = (it) => (it ? it.id ?? it.domain_id ?? it._id : undefined);
const itemName = (it) => (it ? it.name ?? it.domain_name ?? it.domain : undefined);

function emptyResult() {
  return { Keywords: [], and_keywords: [] };
}

function splitNames(value) {
  if (Array.isArray(value)) return value.map(norm).filter(Boolean);
  return norm(value)
    .split(",")
    .map(norm)
    .filter(Boolean);
}

// รายการ domain (มี id + name) — โหลดครั้งเดียวแล้ว cache ไว้ทั้งแอป
function loadDomainList() {
  if (!domainListPromise) {
    domainListPromise = axios
      .get(`${API}/domain/getDomainlist`, { headers: authHeaders() })
      .then((res) => {
        const d = res && res.data;
        const list = (d && (d.data || d.results)) || d || [];
        return Array.isArray(list) ? list : [];
      })
      .catch((error) => {
        domainListPromise = null; // ให้ลองใหม่ได้ครั้งหน้า
        console.error("[check_sentiment_word] โหลดรายการ domain ไม่สำเร็จ:", error);
        return [];
      });
  }
  return domainListPromise;
}

// หา subdomain_id จากชื่อ ถ้ารายการ domain มี subdomain ซ้อนมาด้วย (ถ้าไม่มีจะคืน null)
function findSubdomainId(item, subName) {
  const name = norm(subName);
  if (!item || !name) return null;
  const subs = item.subdomain || item.subdomains || item.sub_domain || item.subdomain_list || [];
  if (!Array.isArray(subs)) return null;
  const sub = subs.find((s) => norm(s && (s.name ?? s.subdomain_name ?? s.subdomain)) === name);
  return sub ? sub.id ?? sub.subdomain_id ?? null : null;
}

function requestOne(params) {
  const query = new URLSearchParams();
  Object.keys(params).forEach((key) => {
    const value = params[key];
    if (value !== undefined && value !== null && value !== "") query.append(key, value);
  });
  return axios
    .get(`${CHECK_URL}?${query.toString()}`, { headers: authHeaders() })
    .then((res) => (res && Array.isArray(res.data) ? res.data[0] : res && res.data) || null)
    .catch((error) => {
      console.error("[check_sentiment_word] เรียก API ไม่สำเร็จ:", params, error);
      return null;
    });
}

function mergeResults(results) {
  const keywords = [];
  const andKeywords = [];
  results.forEach((r) => {
    if (!r) return;
    (Array.isArray(r.Keywords) ? r.Keywords : []).forEach((k) => {
      if (!keywords.includes(k)) keywords.push(k);
    });
    (Array.isArray(r.and_keywords) ? r.and_keywords : []).forEach((k) => {
      if (!andKeywords.includes(k)) andKeywords.push(k);
    });
  });
  return { Keywords: keywords, and_keywords: andKeywords };
}

export async function fetchSentimentWord({ domainId, subdomainId, objectId, domain, subdomain } = {}) {
  const requests = [];

  if (norm(domainId)) {
    // มี id อยู่แล้ว (เช่น domain_id จาก URL / store แบบเดียวกับหน้า All Posts)
    requests.push({ domain_id: norm(domainId), subdomain_id: subdomainId, object_id: objectId });
  } else {
    const names = splitNames(domain);
    if (!names.length) return emptyResult();
    const list = await loadDomainList();

    names.forEach((name) => {
      const item = list.find((it) => norm(itemName(it)) === name);
      const id = itemId(item);
      if (id !== undefined && id !== null && id !== "") {
        const req = { domain_id: id, object_id: objectId };
        // subdomain ใช้ได้เฉพาะตอนเลือก domain เดียว
        if (names.length === 1 && subdomain) {
          const subId = findSubdomainId(item, subdomain);
          if (subId) req.subdomain_id = subId;
        }
        requests.push(req);
      } else {
        // หา id ไม่เจอ → ยิงแบบชื่อเดิม (ไม่ให้ highlight หายไปจากพฤติกรรมเดิม)
        console.warn("[check_sentiment_word] ไม่พบ domain_id ของ", name, "→ ใช้ชื่อแทน");
        const req = { domain: name };
        if (names.length === 1 && subdomain) req.subdomain = norm(subdomain);
        requests.push(req);
      }
    });
  }

  if (!requests.length) return emptyResult();
  const results = await Promise.all(requests.map(requestOne));
  return mergeResults(results);
}

export default fetchSentimentWord;
