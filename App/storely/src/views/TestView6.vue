<template>
    <Sidebar @click="handleDarkMode" />
    <div class="top" :class="{ 'dark-top': isDarkMode }"></div>
    <div class="menu" :class="{ 'dark-menu': isDarkMode }"></div>
    

    
    <div class="background-white" :class="{ 'background-dark': isDarkMode }"></div>

</template>
  
  <script>
  import Sidebar from '../components/sidebar/Sidebar.vue';
  
  export default {
    components: {
      Sidebar
    },
    data() {
      return {
        isDarkMode: false // This will track the dark mode state
      };
    },
    created() {
      // Überprüfe den LocalStorage, wenn die Komponente erstellt wird
      this.checkDarkMode();
    },
    methods: {
      handleDarkMode() {
        // Hier kannst du deine Logik für das Umschalten des Dunkelmodus einfügen
        // Du kannst auch diesen Methodenaufruf in anderen Event-Handlern wie 'click' platzieren
        this.isDarkMode = !this.isDarkMode;
        // Speichere den aktuellen Modus im LocalStorage
        localStorage.setItem('darkMode', this.isDarkMode.toString());
      },
      checkDarkMode() {
        // Überprüfe den LocalStorage auf den Dunkelmodus-Status
        const darkMode = localStorage.getItem('darkMode');
        // Aktualisiere den isDarkMode-Wert basierend auf dem Wert im LocalStorage
        this.isDarkMode = darkMode === 'true';
      }
    }
  };
  </script>
  
  
  <style scoped>
  body {
    margin: 0;
    padding: 0;
  }

  .background-white {
    background-color: white;
    position: absolute; 
    z-index: 0;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
  }

  .background-dark {
    background-color: #9f9f9f;
  }
  
  .top {
    position: fixed;
    top: 0;
    left: 0;
    height: 104px;
    width: 100%;
    background-color: #3a3a3a; /* Standard color */
    z-index: 999;
    transition: background-color 0.3s; /* Smooth transition for background color */
  }

  .dark-top {
    background-color: #000000; /* Dark mode color for top bar */
  }
  
  .menu {
    position: fixed;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 1;
    height: 100%;
    width: 425px;
    background-color: #aeaeae; /* Standard color */
    transition: background-color 0.3s; /* Smooth transition for background color */
  }
  
  /* Styles for dark mode */
  .dark-menu {
    background-color: #414141; /* Dark mode color for menu */
  }
  

  </style>
  