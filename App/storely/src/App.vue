<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { io } from "socket.io-client";

export default {
  name: 'App',
  data() {
    return {
      socket: null, // Initialize the socket
      inactivityTimer: null,
      inactivityTime:  5 * 60 *1000, // 5 minutes
    };
  },

  mounted() {
    this.initializeSocket();
    this.setupInactivityDetection();
  },

  methods: {
    setupInactivityDetection() {
      // Resets the inactivity timer
      const resetTimer = () => {
        clearTimeout(this.inactivityTimer);
        this.inactivityTimer = setTimeout(() => {
          this.updateUserStatus('away');
        }, this.inactivityTime);
        // Assuming the user returns and is active, update status back to online
        this.updateUserStatus('online');
      };

      // Event listeners to reset the timer on user activity
      document.addEventListener('mousemove', resetTimer);
      document.addEventListener('keypress', resetTimer);
      document.addEventListener('visibilitychange', resetTimer);

      resetTimer(); // Initialize the timer
    },

    initializeSocket() {
      this.socket = io(process.env.VUE_APP_API_URL, {
        query: {
          token: localStorage.getItem('authToken'),
        },
      }); // Initialize Socket.IO client

      this.socket.on("connect", () => {
        console.log(`Connected to server with socket ID: ${this.socket.id}`);
      });

      // Additional logic...
    },

    updateUserStatus(status) {
      if (this.socket) {
        this.socket.emit('updateStatus', status);
        console.log(`Status updated to ${status}`);
      }
    },

    // Additional methods...
  },

  beforeUnmount() {
    if (this.socket) {
      this.socket.disconnect();
    }
    clearTimeout(this.inactivityTimer); // Clean up the timer when component unmounts
  },
}

</script>

<style>
/* Your styles */
</style>
