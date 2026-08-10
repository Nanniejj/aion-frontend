<template>
  <div class="avatar-stack">
    <div
      v-for="(u, i) in visibleUsers"
      :key="u.id || i"
      class="mini-avatar"
      :style="avatarStyle(i)"
      v-b-tooltip.hover.top="{ boundary: 'viewport' }"
      :title="u.name || u.initial || u.username"
    >
      {{ avatarLetter(u) }}
    </div>
    
    <div v-if="extraCount > 0" class="mini-avatar extra" :style="sizeStyle">
      +{{ extraCount }}
    </div>

    <span v-if="users.length === 0 && emptyText" class="empty-note">{{ emptyText }}</span>
  </div>
</template>

<script>
// Same palette used everywhere avatars show up. 8 colors so bigger teams
// still mostly get distinct colors before the palette has to repeat.
const AVATAR_COLORS = [
  "#5B8DEF",
  "#8B7FE0",
  "#E0A458",
  "#5FB0A6",
  "#D97C9C",
  "#6FBF73",
  "#E06B6B",
  "#4A6FA5",
];

export default {
  name: "AvatarStack",
  props: {
    // Array of { id, initial, name? }
    users: {
      type: Array,
      default: () => [],
    },
    // How many avatars to show before collapsing the rest into a "+N" badge
    max: {
      type: Number,
      default: 15,
    },
    large: {
      type: Boolean,
      default: false,
    },
    // Text shown when `users` is empty. Leave blank to render nothing.
    emptyText: {
      type: String,
      default: "",
    },
    // Color offset for the first avatar in `users`. Pass the user's index
    // in the FULL outer list here when calling this component once per
    // user (e.g. one row per person) — otherwise every call restarts at
    // index 0 and every avatar ends up the same color. When `users`
    // already contains the whole group in one call (e.g. a card's avatar
    // stack), the default of 0 is correct as-is.
    startIndex: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    visibleUsers() {
      return this.users.slice(0, this.max);
    },
    extraCount() {
      return Math.max(0, this.users.length - this.max);
    },
    sizeStyle() {
      return this.large
        ? { width: "30px", height: "30px", fontSize: "12.5px" }
        : { width: "26px", height: "26px", fontSize: "10.5px" };
    },
  },
  methods: {
    avatarColor(i) {
      return AVATAR_COLORS[(this.startIndex + i) % AVATAR_COLORS.length];
    },
    avatarLetter(u) {
      if (u.name) return u.name.charAt(0).toUpperCase();
      if (u.initial) return u.initial;
      if (u.username) return u.username.charAt(0).toUpperCase();
      return "?";
    },
    avatarStyle(i) {
      return {
        background: this.avatarColor(i),
        zIndex: this.visibleUsers.length + i,
        ...this.sizeStyle,
      };
    },
  },
};
</script>

<style scoped>
.avatar-stack {
  display: flex;
  align-items: center;
}

.mini-avatar {
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: #ffffff;
  border: 2px solid #ffffff;
  flex-shrink: 0;
}
.mini-avatar:not(:first-child) {
  margin-left: -8px;
}
.mini-avatar.extra {
  background: rgba(28, 30, 36, 0.55);
  /* Less overlap than the real avatars (-8px) so the count doesn't sit
     crushed on top of the last avatar's initial, and a higher z-index so
     it never ends up hidden behind a neighboring avatar. */
  margin-left: -4px !important;
  position: relative;
  z-index: 20;
}

.empty-note {
  font-size: 16px;
  font-style: italic;
  color: rgba(28, 30, 36, 0.45);
}
</style>