<template>
  <div class="cards-grid">
    <!--
      @open="$emit('open', $event)" relays the click event from each
      ProjectCard up to whoever uses <ProjectGrid> — without this line,
      clicking a card does nothing.
    -->
    <ProjectCard
      v-for="project in projects"
      :key="project._id.$oid"
      :project="project"
      @open="$emit('open', $event)"
    />

    <div v-if="projects.length === 0" class="empty-note">
      ไม่พบโปรเจกต์ที่ตรงกับ "{{ query }}"
    </div>
  </div>
</template>

<script>
import ProjectCard from "./project/ProjectCard.vue";

export default {
  name: "ProjectGrid",
  components: { ProjectCard },
  props: {
    projects: { type: Array, required: true },
    query: { type: String, default: "" },
  },
};
</script>

<style scoped>

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
}

.empty-note {
  color: var(--muted, #6b7280);
  font-size: 13px;
  padding: 24px 4px;
}
</style>