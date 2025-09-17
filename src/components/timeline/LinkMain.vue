<template>
  <div id="cy" style="width: 100%; height: 600px;"></div>
</template>

<script>
import cytoscape from "cytoscape"

export default {
  mounted() {
    cytoscape({
      container: document.getElementById("cy"),
      elements: [
        { data: { id: "a", label: "ทักษิณ" } },
        { data: { id: "b", label: "Voice TV" } },
        { data: { id: "c", label: "Echo" } },
        { data: { source: "a", target: "b" } },
        { data: { source: "b", target: "c" } }
      ],
      style: [
        {
          selector: "node",
          style: {
            "label": "data(label)",
            "background-color": "#0074D9"
          }
        },
        {
          selector: "edge",
          style: {
            "width": 2,
            "line-color": "#ccc",
            "target-arrow-color": "#ccc",
            "target-arrow-shape": "triangle"
          }
        }
      ],
      layout: {
        name: "cose"
      }
    })
  }
}
</script>
