<template>
  <div ref="graphContainer" style="height: 600px;"></div>
</template>

<script>
import { Network } from "vis-network"

export default {
  mounted() {
    fetch("/neo4j_tree_export.json") // วางไว้ใน public/
      .then((res) => res.json())
      .then((rawData) => {
        const nodes = []
        const edges = []

        const getId = (id) => `n_${(id || "").slice(-6)}`
        const safeLabel = (text) =>
          typeof text === "string" ? text.slice(0, 60) : "(ไม่มีชื่อ)"

        const makeColoredNode = (id, label, color) => ({
          id,
          label: safeLabel(label),
          shape: "dot",
          color: {
            background: color,
            border: "#333",
            highlight: { background: color, border: "#000" }
          },
          font: { color: "#fff", size: 14 }
        })

        // 🔴 Core Node (สีแดง)
        const core = rawData.property
        const coreId = getId(core._id)
        nodes.push(makeColoredNode(coreId, core.title || core.full_text, "#e74c3c"))

        // 🟣 Amplify Nodes (ถ้ามี)
        // for (const amplify of rawData.amplify || []) {
        //   const a = amplify.property
        //   const amplifyId = getId(a._id)
        //   nodes.push(makeColoredNode(amplifyId, a.title || a.full_text, "#9b59b6"))
        //   edges.push({ from: coreId, to: amplifyId })



        //   // 🔵 Echo Nodes
        //   for (const echo of amplify.echo || []) {
        //     const echoId = getId(echo._id)
        //     nodes.push(makeColoredNode(echoId, echo.title || echo.full_text, "#3498db"))
        //     edges.push({ from: amplifyId, to: echoId })


        //   }
        // }

        // 🟠 Support Nodes
        for (const support of rawData.support || []) {
          const s = support.property
          const supportId = getId(s._id)
          nodes.push(makeColoredNode(supportId, s.title || s.full_text, "#f39c12"))
          edges.push({ from: coreId, to: supportId })



          // 🔵 Echo Nodes
          for (const echo of support.echo || []) {
            const echoId = getId(echo._id)
            nodes.push(makeColoredNode(echoId, echo.title || echo.full_text, "#3498db"))
            edges.push({ from: supportId, to: echoId })


          }
        }

        // ✅ สร้างกราฟ
        const container = this.$refs.graphContainer
        const data = { nodes, edges }
        const options = {
          nodes: {
            borderWidth: 2,
            size: 20
          },
          edges: {
            arrows: "to",
            smooth: true,
            color: { color: "#aaa" }
          },
          physics: {
            stabilization: true
          }
        }

        new Network(container, data, options)
      })
      .catch((err) => {
        console.error("โหลดข้อมูลกราฟล้มเหลว:", err)
      })
  }
}
</script>
