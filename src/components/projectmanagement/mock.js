// ---------- Lookup tables (referenced by $oid) ----------
// Stand in for the other collections that userlist / domainlist /
// hashtaglist / targetlist / hotissue_list / group_list point to.

export const USER_LOOKUP = {
  "6650a1f2b3c4d5e6f7a80001": { name: "ณัฐพล เจริญสุข", role: "admin", initial: "ณ" },
  "6650a1f2b3c4d5e6f7a80002": { name: "กมลชนก ใสสะอาด", role: "admin", initial: "ก" },
  "6650a1f2b3c4d5e6f7a80003": { name: "สรวิศ พงษ์ไพบูลย์", role: "superadmin", initial: "ส" },
  "6650a1f2b3c4d5e6f7a80004": { name: "ปรียาภัทร วงศ์ทอง", role: "user", initial: "ป" },
  "6650a1f2b3c4d5e6f7a80005": { name: "วิศรุต ธนาวุฒิ", role: "user", initial: "ว" },
  "6650a1f2b3c4d5e6f7a80006": { name: "ธีรดา แสงอรุณ", role: "superadmin", initial: "ธ" },
  "6650a1f2b3c4d5e6f7a80007": { name: "มนัสนันท์ อยู่ดี", role: "admin", initial: "ม" },
  "6650a1f2b3c4d5e6f7a80008": { name: "ลภัสรดา ชัยมงคล", role: "user", initial: "ล" },
};

export const DOMAIN_LOOKUP = {
  "6650b200aa11bb22cc330001": "afsc2-portal.go.th",
  "6650b200aa11bb22cc330002": "news.example.com",
  "6650b200aa11bb22cc330003": "forum.pantip.com",
  "6650b200aa11bb22cc330004": "x.com",
  "6650b200aa11bb22cc330005": "facebook.com",
  "6650b200aa11bb22cc330006": "tiktok.com",
};

export const HASHTAG_LOOKUP = {
  "6650c300bb22cc33dd440001": "#AFSC2",
  "6650c300bb22cc33dd440002": "#ความมั่นคงไซเบอร์",
  "6650c300bb22cc33dd440003": "#ข่าวปลอม",
  "6650c300bb22cc33dd440004": "#ภัยพิบัติ",
  "6650c300bb22cc33dd440005": "#เลือกตั้ง69",
};

export const TARGET_LOOKUP = {
  "6650d400cc33dd44ee550001": "กลุ่มบัญชีเผยแพร่ข่าวลวง",
  "6650d400cc33dd44ee550002": "เพจข่าวสายด่วน",
  "6650d400cc33dd44ee550003": "อินฟลูเอนเซอร์สายการเมือง",
  "6650d400cc33dd44ee550004": "บัญชีต้องสงสัยกลุ่ม B",
};

export const HOTISSUE_LOOKUP = {
  "6650e500dd44ee55ff660001": "กระแสข่าวลือแผ่นดินไหวภาคเหนือ",
  "6650e500dd44ee55ff660002": "ดราม่าคลิปหลุดนักการเมือง",
  "6650e500dd44ee55ff660003": "แคมเปญปลุกระดมออนไลน์",
};

export const GROUP_LOOKUP = {
  "6650f600ee55ff66aa770001": "ทีมเฝ้าระวังภาคเหนือ",
  "6650f600ee55ff66aa770002": "ทีมวิเคราะห์ข่าวปลอม",
};

const oid = (id) => ({ $oid: id });

// ---------- Mock documents, matching the given schema exactly ----------

export const PROJECTS = [
  {
    _id: oid("664a000000000000000a0001"),
    projectname: "AFSC2",
    userlist: [oid("6650a1f2b3c4d5e6f7a80001"), oid("6650a1f2b3c4d5e6f7a80003"), oid("6650a1f2b3c4d5e6f7a80005"),oid("6650a1f2b3c4d5e6f7a80002"), oid("6650a1f2b3c4d5e6f7a80006")],
    avatarlist: [],
    domainlist: [oid("6650b200aa11bb22cc330001"), oid("6650b200aa11bb22cc330004")],
    mion: true,
    hashtaglist: [oid("6650c300bb22cc33dd440001"), oid("6650c300bb22cc33dd440002")],
    targetlist: [oid("6650d400cc33dd44ee550001")],
    updatedAt: { $date: "2026-06-11T11:10:05.887Z" },
    hotissue_list: [],
    group_list: [],
  },
  {
    _id: oid("664a000000000000000a0002"),
    projectname: "เฝ้าระวังข่าวปลอมเลือกตั้ง",
    userlist: [oid("6650a1f2b3c4d5e6f7a80002"), oid("6650a1f2b3c4d5e6f7a80006")],
    avatarlist: [oid("664a100000000000000b0001"), oid("664a100000000000000b0002")],
    domainlist: [oid("6650b200aa11bb22cc330002"), oid("6650b200aa11bb22cc330003"), oid("6650b200aa11bb22cc330005")],
    mion: true,
    hashtaglist: [oid("6650c300bb22cc33dd440003"), oid("6650c300bb22cc33dd440005")],
    targetlist: [oid("6650d400cc33dd44ee550002"), oid("6650d400cc33dd44ee550003")],
    updatedAt: { $date: "2026-07-02T04:45:12.120Z" },
    hotissue_list: [oid("6650e500dd44ee55ff660002")],
    group_list: [oid("6650f600ee55ff66aa770002")],
  },
  {
    _id: oid("664a000000000000000a0003"),
    projectname: "ภัยพิบัติภาคเหนือ",
    userlist: [oid("6650a1f2b3c4d5e6f7a80004")],
    avatarlist: [],
    domainlist: [oid("6650b200aa11bb22cc330006")],
    mion: false,
    hashtaglist: [oid("6650c300bb22cc33dd440004")],
    targetlist: [],
    updatedAt: { $date: "2026-05-28T09:02:40.500Z" },
    hotissue_list: [oid("6650e500dd44ee55ff660001")],
    group_list: [oid("6650f600ee55ff66aa770001")],
  },
  {
    _id: oid("664a000000000000000a0004"),
    projectname: "คลังสินค้า Warehouse365",
    userlist: [oid("6650a1f2b3c4d5e6f7a80003"), oid("6650a1f2b3c4d5e6f7a80007"), oid("6650a1f2b3c4d5e6f7a80008")],
    avatarlist: [],
    domainlist: [],
    mion: false,
    hashtaglist: [],
    targetlist: [],
    updatedAt: { $date: "2026-04-15T02:20:00.000Z" },
    hotissue_list: [],
    group_list: [],
  },
];

const USER_META = {
  "6650a1f2b3c4d5e6f7a80001": { email: "nattapon@studio.dev", joined: "12 ม.ค. 2568" },
  "6650a1f2b3c4d5e6f7a80002": { email: "kamonchanok@studio.dev", joined: "03 มี.ค. 2568" },
  "6650a1f2b3c4d5e6f7a80003": { email: "sorawit@studio.dev", joined: "22 พ.ย. 2567" },
  "6650a1f2b3c4d5e6f7a80004": { email: "preeyapat@studio.dev", joined: "09 ก.ย. 2567" },
  "6650a1f2b3c4d5e6f7a80005": { email: "wisarut@studio.dev", joined: "17 ก.พ. 2569" },
  "6650a1f2b3c4d5e6f7a80006": { email: "teerada@studio.dev", joined: "30 ต.ค. 2567" },
  "6650a1f2b3c4d5e6f7a80007": { email: "manatsanan@studio.dev", joined: "14 เม.ย. 2569" },
  "6650a1f2b3c4d5e6f7a80008": { email: "lapasrada@studio.dev", joined: "05 ส.ค. 2567" },
};

const INACTIVE_IDS = ["6650a1f2b3c4d5e6f7a80004", "6650a1f2b3c4d5e6f7a80008"];

export const USERS = Object.entries(USER_LOOKUP).map(([id, u]) => ({
  _id: id,
  name: u.name,
  role: u.role,
  initial: u.initial,
  ...USER_META[id],
  status: INACTIVE_IDS.includes(id) ? "ระงับการใช้งาน" : "ใช้งานอยู่",
}));

// ---------- Shared helpers ----------

export const oids = (list) => list.map((o) => o.$oid);

export const shortId = (id) => `${id.slice(0, 6)}…${id.slice(-4)}`;

export function formatDate(iso) {
  const d = new Date(iso);
  const months = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
  const buddhistYear = d.getFullYear() + 543;
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${d.getDate()} ${months[d.getMonth()]} ${buddhistYear} · ${hh}:${mm} น.`;
}

export function resolveUsers(userlist) {
  return oids(userlist)
    .map((id) => ({ id, ...USER_LOOKUP[id] }))
    .filter((u) => u.name);
}
