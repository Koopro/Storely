<template>
    <div class="sidebar" :style="{ backgroundColor: darkMode ? '#333' : '#ccc', color: darkMode ? '#fff' : '#000' }">
      <div class="sidebar-content">
        <!-- Top Links -->
        <div class="top-links">
          <router-link to="/home" class="sidebar-link" :style="{ color: darkMode ? '#fff' : '#000' }"><v-icon :class="'mdi mdi-home-outline'"></v-icon>&nbsp;Home</router-link>
          <router-link to="/calendar" class="sidebar-link" :style="{ color: darkMode ? '#fff' : '#000' }"><v-icon :class="'mdi mdi-calendar-text'"></v-icon>&nbsp;Calendar</router-link>
          <router-link to="/todo" class="sidebar-link" :style="{ color: darkMode ? '#fff' : '#000' }"><v-icon :class="'mdi mdi-format-list-checks'"></v-icon>&nbsp;TODO</router-link>
          <router-link to="/profile" class="sidebar-link" :style="{ color: darkMode ? '#fff' : '#000' }"><v-icon :class="'mdi mdi-account-outline'"></v-icon>&nbsp;Profile</router-link>
        </div>
        <!-- Spacer -->
        <div class="spacer"></div>
        <!-- Bottom Links -->
        <div class="bottom-links">
          <dark-mode-toggle :value="darkMode" @change="toggleDarkMode" :style="{ color: darkMode ? 'white' : 'black', backgroundColor: darkMode ? '#333' : '#ccc' }" />
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
        darkMode: false
      };
    },
    methods: {
      toggleDarkMode(value) {
        this.darkMode = value;
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
    width: 150px;
    padding: 20px;
    overflow-y: auto;
    z-index: 1000;
  }
  
  .sidebar-content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
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
  

  
  .dark-mode-toggle {
    margin-top: 20px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 2px solid #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
  </style>
  