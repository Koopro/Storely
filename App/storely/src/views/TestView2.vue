//Sidebar component testing
<template>
  <div>
    <div class="sidebar" :class="{ expanded: isExpanded }" @mouseover="expandSidebar" @mouseleave="collapseSidebar">
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
          <router-link to="/profile" class="sidebar-link" :style="{ color: darkMode ? '#fff' : '#000' }">
            <v-icon :class="'mdi mdi-account-outline'"></v-icon>
            <span class="link-name" v-show="isExpanded">Profile</span>
          </router-link>
        </div>
        <!-- Dark Mode Toggle Button -->
        <div class="dark-mode-toggle-container">
          <dark-mode-toggle :value="darkMode" @change="toggleDarkMode" :style="{ color: darkMode ? '#fff' : '#000', backgroundColor: darkMode ? '#323232' : '#BBBBBB', display: 'block' }" />
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
  created() {
    this.darkMode = localStorage.getItem('darkMode') === 'true'; // Initialisieren mit dem Wert aus dem Local Storage
    this.updateBackgroundColor(); // Hintergrundfarbe aktualisieren
  },
  methods: {
    toggleDarkMode(value) {
      this.darkMode = value;
      localStorage.setItem('darkMode', value); // Speichern des Dark Mode-Werts im Local Storage
      this.updateBackgroundColor(); // Hintergrundfarbe aktualisieren
    },

    //Expands the sidebar
    expandSidebar() {
      // Überprüfen, ob die Breite der Sidebar größer als die Einschränkung ist
      if (window.innerWidth > 850) {
        this.isExpanded = true;
  }
    },

    // Collapse the sidebar by setting isExpanded to false.
    collapseSidebar() {
      this.isExpanded = false;
    },

    // Hintergrundfarbe der Sidebar aktualisieren basierend auf dem Dark-Mode-Zustand
    updateBackgroundColor() {
      document.documentElement.style.backgroundColor = this.darkMode ? '#323232' : '#BBBBBB';
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
  overflow: hidden; /* Verhindert Scrollen */
  z-index: 1000;
  transition: width 0.3s;
  border-right: #555 1px solid;
  border-radius: 5rem;
}

.expanded {
  width: 150px;
}

.sidebar-content {
  display: flex;
  flex-direction: column;
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
  margin-left: 10px;
}

.dark-mode-toggle-container {
  position: absolute;
  bottom: 20px; /* Anpassen der unteren Position */
  left: 50%; /* Zentrieren des Buttons */
  transform: translateX(-50%);
  z-index: 1; /* sicherstellen, dass der Dark-Mode-Toggle über der Sidebar liegt */
}
</style>