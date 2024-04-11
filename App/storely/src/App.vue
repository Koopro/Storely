<template>
  <v-app :class="{'dark-mode': darkMode}">
    <div id="app">
      <router-view />
    </div>
  </v-app>
</template>

<script>
import { io } from "socket.io-client";

export default {
  name: 'App',
  data() {
    return {
      socket: null, // Initialize the socket
      inactivityTimer: null,
      inactivityTime: 5 * 60 * 1000, // 5 minutes
      currentUserStatus: 'offline', // Track the current status of the user
      darkMode: false,
      darkModeCheckInterval: null,
    };
  },

  mounted() {
    this.initializeSocket();
    this.setupInactivityDetection();
    this.checkDarkMode();
    this.darkModeCheckInterval = setInterval(this.checkDarkMode, 1);
  },
  beforeUnmount() {
    // Clean up the event listener when the component is destroyed
    clearInterval(this.darkModeCheckInterval);
  },
  methods: {
    checkDarkMode() {
    const storedDarkMode = localStorage.getItem('darkMode');
    const currentDarkMode = storedDarkMode ? JSON.parse(storedDarkMode) : false;
    if (this.darkMode !== currentDarkMode) {
      this.darkMode = currentDarkMode;
    }
  },
    setupInactivityDetection() {
      const resetTimer = () => {
        clearTimeout(this.inactivityTimer);
        this.inactivityTimer = setTimeout(() => {
          // Update status to 'away' after inactivity
          this.updateUserStatus('away');
        }, this.inactivityTime);
      };

      document.addEventListener('mousemove', () => {
        if (this.currentUserStatus !== 'online') {
          this.updateUserStatus('online');
        }
        resetTimer();
      });

      document.addEventListener('keypress', () => {
        if (this.currentUserStatus !== 'online') {
          this.updateUserStatus('online');
        }
        resetTimer();
      });

      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && this.currentUserStatus !== 'online') {
          this.updateUserStatus('online');
        } else if (document.visibilityState === 'hidden') {
          resetTimer(); // May eventually set the status to 'away'
        }
      });

      resetTimer(); // Initialize the timer
    },

    updateUserStatus(status) {
      if (this.socket && this.currentUserStatus !== status) {
        this.socket.emit('updateStatus', status);
        console.log(`Status updated to ${status}`);
        this.currentUserStatus = status; // Update the current status
      }
    },

    initializeSocket() {
      this.socket = io(process.env.VUE_APP_API_URL, {
        query: {
          token: localStorage.getItem('authToken'),
        },
      });

      this.socket.on("connect", () => {
        console.log(`Connected to server with socket ID: ${this.socket.id}`);
        // Ensure the user is marked online upon connecting
        this.updateUserStatus('online');
      });
    },
  },

  beforeUnmount() {
    if (this.socket) {
      this.socket.disconnect();
    }
    clearTimeout(this.inactivityTimer); // Clean up the timer when component unmounts
  },
};
</script>

<style>
/* Light mode background */
#app {
  background-color: #f5f5f5; /* Light grey for light mode */
  color: #212121; /* Dark grey for text in light mode */
  transition: background-color 0.3s ease, color 0.3s ease; /* Smooth transition */
  height: 100%;
  width: 100%;
}

/* Dark mode background */
.dark-mode #app {
  background-color: #212121; /* Dark grey for dark mode */
  color: #e0e0e0; /* Light grey for text in dark mode */
  height: 100%;
  width: 100%;
}
</style>

