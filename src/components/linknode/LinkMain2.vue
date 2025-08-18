<template>
  <div class="ml-lg-5 mr-lg-5 ml-md-3 mr-md-3 ml-sm-3 mr-sm-3 p-3">
    <div>
      <div class="text-left mb-2 legend">
        <span class="mr-3"><b-icon variant="danger" style="color:#e74c3c" icon="circle-fill"></b-icon> Core</span>
        <span class="mr-3"><b-icon style="color:#9b59b6" icon="circle-fill"></b-icon> Amplify</span>
        <span class="mr-3"><b-icon style="color:#f39c12" icon="circle-fill"></b-icon> Support</span>
        <span class="mr-3"><b-icon style="color:#3498db" icon="circle-fill"></b-icon> Echo</span>
      </div>
      <div v-if="dataraw" class="text-left">{{ dataraw.full_text }}</div>
      <div ref="graphContainer" style="height:120vh;"></div>
    </div>
  </div>
</template>

<script>
import { Network } from "vis-network";
import "vis-network/styles/vis-network.css";

export default {
  data() {
    return { dataraw: "" };
  },
  mounted() {
    fetch("/neo4j_tree_export.json")
      .then((res) => res.json())
      .then((rawData) => {
        const nodes = [];
        const edges = [];
        const nodeIds = new Set();
        const edgeKeys = new Set();
        const meta = new Map();

        // -------- scale ----------
        const SIZE_MIN = 12;
        const SIZE_MAX = 500;
        const SCALE_K = 2;
        const CAP_E = 10000;

        // ใช้ความยาวเส้นบอก "ห่างเวลากันแค่ไหน"
        const EDGE_LEN_MIN = 90;      // สั้นสุด
        const EDGE_LEN_MAX = 150;     // ยาวสุด
        const EDGE_REF_HOURS = 24 * 7;  // อ้างอิง 7 วัน (ปรับได้)

        // -------- helpers ----------
        const safe = (v, d = "") => (v === undefined || v === null ? d : v);
        const trim = (s, n = 80) =>
          typeof s === "string" ? (s.length > n ? s.slice(0, n) + "…" : s) : "";
        const getId = (id) => `n_${safe(id, Math.random().toString(36).slice(2))}`;

        const makeLabel = (prop) => {
          const name = safe(prop.account_name, "").trim();
          const src = safe(prop.source, "").trim();
          if (name) return trim(name, 28);
          if (src) return `[${src}]`;
          return trim(safe(prop.title, prop.full_text)) || "(ไม่มีชื่อ)";
        };

        const sizeFromEng = (n) => {
          const e = Math.max(0, Math.min(Number(n) || 0, CAP_E));
          const sz = SIZE_MIN + Math.sqrt(e) * SCALE_K;
          return Math.max(SIZE_MIN, Math.min(SIZE_MAX, Math.round(sz)));
        };

        const parseDate = (s) => {
          if (!s) return null;
          const iso = s.includes("T") ? s : s.replace(" ", "T");
          const d = new Date(iso);
          return isNaN(d.getTime()) ? null : d;
        };

        // → คืน edge.length ตามส่วนต่างเวลา (ชั่วโมง)
        const edgeLengthByDate = (parentDate, childDate) => {
          const p = parseDate(parentDate);
          const c = parseDate(childDate);
          if (!p || !c) return Math.round((EDGE_LEN_MIN + EDGE_LEN_MAX) / 2);
          const diffHours = Math.abs(c - p) / 36e5;
          // ใช้ sqrt scale เพื่อตัด outlier
          const ratio = Math.min(1, Math.sqrt(diffHours / EDGE_REF_HOURS));
          return Math.round(EDGE_LEN_MIN + ratio * (EDGE_LEN_MAX - EDGE_LEN_MIN));
        };

        const makeTitleEl = (prop) => {
          const wrap = document.createElement("div");
          wrap.className = "tt";
          wrap.innerHTML = `
            <div><strong>วันที่:</strong> ${safe(prop.date, "-")}</div>
            <div><strong>แพลตฟอร์ม:</strong> ${safe(prop.source, "-")}</div>
            <div><strong>บัญชี:</strong> ${safe(prop.account_name, "-")}</div>
            <div><strong>Engagement:</strong> ${Number(prop.engagement) || 0}</div>
            ${prop.full_text ? `<div class="tt-body">${safe(prop.full_text, "")}</div>` : ""}
          `;
          return wrap;
        };

        const pushNode = (id, n, m) => {
          if (nodeIds.has(id)) return;
          nodeIds.add(id);
          nodes.push(n);
          if (m) meta.set(id, m);
        };

        const pushEdge = (from, to, length) => {
          const key = `${from}→${to}`;
          if (edgeKeys.has(key)) return;
          edgeKeys.add(key);
          edges.push({ from, to, length });
        };

        const makeColoredNode = (prop, colorHex) => {
          const id = getId(prop._id);
          const label = makeLabel(prop);
          const size = sizeFromEng(prop.engagement);
          const title = makeTitleEl(prop);
          return {
            id,
            label,
            title,
            shape: "dot",
            color: {
              background: colorHex,
              border: "#2c2c2c",
              highlight: { background: colorHex, border: "#000" }
            },
            font: { color: "#2c2c2c", size: 14 },
            size
          };
        };

        // ---------- build graph ----------
        const core = rawData.property || {};
        this.dataraw = rawData.property || null;
        const coreNode = makeColoredNode(core, "#a21841bd");
        pushNode(coreNode.id, coreNode, {
          url: safe(core.account_url, null),
          date: safe(core.date, null)
        });
          for (const echo of core.echo || []) {
            const eNode = makeColoredNode(echo, "#2c9b98bd");
            pushNode(eNode.id, eNode, {
              url: safe(echo.account_url, null),
              date: safe(echo.date, null)
            });
            pushEdge(sNode.id, eNode.id, edgeLengthByDate(s.date, echo.date));
          }

        // Amplify
        for (const amplify of rawData.amplify || []) {
          const a = amplify.property || {};
          const aNode = makeColoredNode(a, "#8659b6b3");
          pushNode(aNode.id, aNode, {
            url: safe(a.account_url, null),
            date: safe(a.date, null)
          });
          pushEdge(coreNode.id, aNode.id, edgeLengthByDate(core.date, a.date));

          // Echo of Amplify
          for (const echo of amplify.echo || []) {
            const eNode = makeColoredNode(echo, "#2c9b98bd");
            pushNode(eNode.id, eNode, {
              url: safe(echo.account_url, null),
              date: safe(echo.date, null)
            });
            pushEdge(aNode.id, eNode.id, edgeLengthByDate(a.date, echo.date));
          }
        }

        // Support
        for (const support of rawData.support || []) {
          const s = support.property || {};
          const sNode = makeColoredNode(s, "#ff9c00b3");
          pushNode(sNode.id, sNode, {
            url: safe(s.account_url, null),
            date: safe(s.date, null)
          });
          pushEdge(coreNode.id, sNode.id, edgeLengthByDate(core.date, s.date));

          for (const echo of support.echo || []) {
            const eNode = makeColoredNode(echo, "#2c9b98bd");
            pushNode(eNode.id, eNode, {
              url: safe(echo.account_url, null),
              date: safe(echo.date, null)
            });
            pushEdge(sNode.id, eNode.id, edgeLengthByDate(s.date, echo.date));
          }
        }

        // ---------- render ----------
        const container = this.$refs.graphContainer;
        const data = { nodes, edges };

        const options = {
          interaction: {
            hover: true,
            tooltipDelay: 120,
            multiselect: true,
            zoomView: true,
            dragView: true
          },
          nodes: {
            borderWidth: 2
          },
          edges: {
            arrows: "to",
            smooth: { enabled: true, type: "dynamic" },
            color: { color: "#9aa0a6", highlight: "#5f6368" },
            width: 1.25,
            selectionWidth: 2
            // ✅ เราใส่ length รายเส้นไว้แล้วใน edges[]
          },
          physics: {
            enabled: true,
            // ทำให้ "length ของแต่ละเส้น" มีผลจริงจัง
            solver: "forceAtlas2Based",
            stabilization: { iterations: 400, updateInterval: 50 },
            forceAtlas2Based: {
              gravitationalConstant: -75,   // ผลักกันมากขึ้น
              centralGravity: 0.015,        // ดึงเข้าศูนย์น้อยลง (กระจายกว่าเดิม)
              springLength: 10,             // ค่าพื้นฐาน (แต่ละเส้นมี length ของตัวเอง)
              springConstant: 0.12,         // สปริงแข็งขึ้น = เคารพ length มากขึ้น
              damping: 0.42,
              avoidOverlap: 0.9             // กันชนทับซ้อน
            },
            minVelocity: 0.6
          },
          layout: { improvedLayout: true, randomSeed: 5 }
        };

        const network = new Network(container, data, options);

        // เปิดลิงก์เมื่อคลิก
        network.on("click", (params) => {
          if (!params.nodes || params.nodes.length === 0) return;
          const nodeId = params.nodes[0];
          const m = meta.get(nodeId);
          if (m && m.url) { try { window.open(m.url, "_blank", "noopener,noreferrer"); } catch { } }
        });

        // โฟกัสเมื่อดับเบิลคลิก
        network.on("doubleClick", (params) => {
          if (!params.nodes || params.nodes.length === 0) return;
          const nodeId = params.nodes[0];
          network.focus(nodeId, {
            scale: 1.25,
            animation: { duration: 500, easingFunction: "easeInOutQuad" }
          });
        });

        // ปิด physics หลังนิ่ง (คงตำแหน่ง)
        network.once("stabilizationIterationsDone", () => {
          network.setOptions({ physics: { enabled: false } });
        });
      })
      .catch((err) => console.error("โหลดข้อมูลกราฟล้มเหลว:", err));
  }
};
</script>

<style>
.legend span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 2px 8px;
  border-radius: 999px;
  background: #f7f7f7;
  box-shadow: 0 0 0 1px #e6e6e6 inset;
}

.vis-tooltip {
  max-width: 420px;
  padding: 8px 10px;
  background: #222;
  color: #fff;
  border: 1px solid #444;
  border-radius: 8px;
  line-height: 1.35;
  white-space: normal;
  word-break: break-word;
  z-index: 9999;
}

.vis-tooltip .tt-body {
  margin-top: 6px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
