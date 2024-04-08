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
      inactivityTime: 5 * 60 * 1000, // 5 minutes
      currentUserStatus: 'offline', // Track the current status of the user
    };
  },

  mounted() {
    this.initializeSocket();
    this.setupInactivityDetection();
  },

  methods: {
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
/* Your styles */
</style>
