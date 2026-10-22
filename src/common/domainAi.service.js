// Domain AI Analysis API client (แยกอิสระ ไม่แตะ Vue.axios.defaults ของระบบเดิม)
// เปลี่ยน URL ได้ผ่าน .env: VUE_APP_DOMAIN_AI_API_URL=https://api2.cognizata.com/api
import axios from "axios";

export const DOMAIN_AI_API_URL =
  process.env.VUE_APP_DOMAIN_AI_API_URL || "https://api2.cognizata.com/api";

const client = axios.create({
  baseURL: DOMAIN_AI_API_URL,
  timeout: 60000,
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = "Bearer " + token;
  config.headers["Content-Type"] = "application/json";
  return config;
});

export function errorMessage(err) {
  const d = err && err.response && err.response.data;
  if (d && d.error && d.error.message) return d.error.message;
  if (d && d.message) return d.message;
  if (err && err.code === "ECONNABORTED") return "หมดเวลาเชื่อมต่อเซิร์ฟเวอร์";
  if (err && !err.response) return "เชื่อมต่อ AI service ไม่ได้ (" + DOMAIN_AI_API_URL + ")";
  return (err && err.message) || "เกิดข้อผิดพลาด";
}

const DomainAiService = {
  submit(payload) {
    return client.post("/v2/domain-ai/analyze", payload).then((r) => r.data);
  },
  getJob(jobId) {
    return client.get("/v2/domain-ai/job/" + encodeURIComponent(jobId)).then((r) => r.data);
  },
  health() {
    return client.get("/v2/domain-ai/health").then((r) => r.data);
  },
};

export default DomainAiService;
