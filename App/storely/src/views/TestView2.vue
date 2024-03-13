<template>
  <div>
    <div class="sidebar" :class="{ expanded: isExpanded }" @mouseover="expandSidebar" @mouseleave="collapseSidebar">
      <div class="sidebar-content">
        <!-- Top Links -->
        <div class="top-links">
          <router-link to="/home" class="sidebar-link" :style="{ color: darkMode ? '#fff' : '#000' }">
            <v-icon :class="'mdi mdi-home-outline'"></v-icon>
            <span class="link-name" v-show="isExpanded">Home</span>
          </router-link>
          <router-link to="/calendar" class="sidebar-link" :style="{ color: darkMode ? '#fff' : '#000' }">
            <v-icon :class="'mdi mdi-calendar-text'"></v-icon>
            <span class="link-name" v-show="isExpanded">Calendar</span>
          </router-link>
          <router-link to="/todo" class="sidebar-link" :style="{ color: darkMode ? '#fff' : '#000' }">
            <v-icon :class="'mdi mdi-format-list-checks'"></v-icon>
            <span class="link-name" v-show="isExpanded">TODO</span>
          </router-link>
          <router-link to="/profile" class="sidebar-link" :style="{ color: darkMode ? '#fff' : '#000' }">
            <v-icon :class="'mdi mdi-account-outline'"></v-icon>
            <span class="link-name" v-show="isExpanded">Profile</span>
          </router-link>
        </div>
        <!-- Dark Mode Toggle Button -->
        <div class="dark-mode-toggle-container">
          <dark-mode-toggle :value="darkMode" @change="toggleDarkMode" :style="{ color: darkMode ? '#fff' : '#000', backgroundColor: darkMode ? '#333' : '#ccc' }" />
        </div>
        <!-- Spacer -->
        <div class="spacer"></div>
      </div>
    </div>
  </div>
</template>

<script>
import DarkModeToggle from '../components/sidebar/DarkModeToggle.vue';

export default {
  name: 'Sidebar',
  components: {
    DarkModeToggle
  },
  data() {
    return {
      darkMode: false,
      isExpanded: false
    };
  },
  methods: {
    toggleDarkMode(value) {
      this.darkMode = value;
      document.documentElement.style.backgroundColor = this.darkMode ? '#333' : '#ccc'; // Ändert den Hintergrund des html-Elements
    },
    expandSidebar() {
      this.isExpanded = true;
    },
    collapseSidebar() {
      this.isExpanded = false;
    }
  }
};
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 50px;
  padding: 20px;
  overflow-y: hidden; /* Verhindert Scrollen */
  z-index: 1000;
  transition: width 0.3s;
  background-color: #666; /* Dunklerer Grauton für die Sidebar */
}

.expanded {
  width: 150px;
}

.sidebar-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh; /* 100% Höhe des Viewports */
}

.top-links {
  display: flex;
  flex-direction: column;
}

.bottom-links {
  margin-top: auto;
}

.sidebar-link {
  text-decoration: none;
  padding: 10px 0;
  border-bottom: 1px solid #555;
}

.sidebar-link:hover .link-name {
  display: inline-block;
}

.dark-mode-toggle-container {
  position: absolute;
  bottom: 20px; /* Anpassen der unteren Position */
  left: 50%; /* Zentrieren des Buttons */
  transform: translateX(-50%);
}
</style>