<template>
  <div>
    <div class="sidebar" :class="{ expanded: isExpanded, dark: darkMode }" @mouseover="expandSidebar" @mouseleave="collapseSidebar">
      <div class="sidebar-content">
        <!-- Top Links -->
        <div class="top-links" :style="{ justifyContent: isExpanded ? 'flex-start' : 'center' }">
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
          <router-link to="/testing2" class="sidebar-link" :style="{ color: darkMode ? '#fff' : '#000' }">
            <v-icon :class="'mdi mdi-account-outline'"></v-icon>
            <span class="link-name" v-show="isExpanded">Profile</span>
          </router-link>
        </div>
        <!-- Dark Mode Toggle Button -->
        <div v-if="isExpanded === false" class="dark-mode-toggle-container">
          <dark-mode-toggle :value="darkMode" @change="toggleDarkMode" />
        </div>
        <div v-else class="dark-mode-toggle-container2">
          <dark-mode-toggle :value="darkMode" @change="toggleDarkMode" />
        </div>
        <!-- Spacer -->
        <div class="spacer"></div>
      </div>
    </div>
  </div>
</template>

<script>
import DarkModeToggle from './DarkModeToggle.vue';

export default {
  name: 'Sidebar',
  components: {
    DarkModeToggle
  },
  provide() {
    return {
      darkMode: this.darkMode
    };
  },
  data() {
    return {
      darkMode: localStorage.getItem('darkMode') === 'true',
      isExpanded: false
    };
  },
  methods: {
    toggleDarkMode(value) {
      this.darkMode = value;
      localStorage.setItem('darkMode', this.darkMode);
    },
    expandSidebar() {
      if (window.innerWidth > 500) {
        this.isExpanded = true;
      }
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
  width: 62px;
  padding: 20px;
  overflow: hidden;
  z-index: 1000;
  transition: width 0.3s;
  border-right: #555 1px solid;
  border-radius: 0% 2rem 2rem 0%;
  background-color: #fff; /* Standard-Hintergrundfarbe */
}

.dark {
  background-color: #323232; /* Hintergrundfarbe im Dark Mode */
}

.sidebar-content {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.top-links {
  display: flex;
  flex-direction: column;
}

.sidebar-link {
  text-decoration: none;
  padding: 10px 0;
  border-bottom: 1px solid #555;
  display: flex;
  align-items: center;
}

.sidebar-link:hover .link-name {
  visibility: visible;
  margin-left: 20px;
}

.sidebar:hover, .sidebar.expanded {
  width: 155px;
  transition: width 0.5s ease;
}

.link-name {
  margin-left: 10px;
}

.dark-mode-toggle-container {
  position: absolute;
  bottom: 20px;
  display: flex;
  left: 5%;
  z-index: 999;
  transition: ease-in 2s;
}

.dark-mode-toggle-container2 {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translate(-50%);
  z-index: 999;
  transition: ease-out 2s;
}

</style>
