<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'App',
  data() {
    return {
      lastVisibilityState: document.visibilityState, // Track visibility state
      lastOnlineStatus: navigator.onLine, // Track online status
    };
  },
  mounted() {
    this.handleVisibilityAndOnlineStatusChange();
    this.handleWindowClose();
    this.periodicStatusUpdate();
    this.callUrl();
    this.logVisibilityAndOnlineStatusPeriodically();
  },
  methods: {
    handleVisibilityAndOnlineStatusChange() {
      // Handle both visibility and online status changes
      document.addEventListener('visibilitychange', this.updateBasedOnVisibilityAndOnlineStatus);
      window.addEventListener('online', this.updateBasedOnVisibilityAndOnlineStatus);
      window.addEventListener('offline', this.updateBasedOnVisibilityAndOnlineStatus);
    },
    updateBasedOnVisibilityAndOnlineStatus() {
      // Determine and update the user status based on current visibility and online status
      if (!navigator.onLine) {
        this.updateUserStatus('offline');
      } else if (document.visibilityState === 'hidden') {
        this.updateUserStatus('away');
      } else {
        this.updateUserStatus('online');
      }
      this.logCurrentStatus(); // Log the current status for debugging
    },
    logCurrentStatus() {
      // Log the current online and visibility status
      console.log(`Online status: ${navigator.onLine ? 'Online' : 'Offline'}, Visibility: ${document.visibilityState}`);
    },
    logVisibilityAndOnlineStatusPeriodically() {
      setInterval(() => {
        const currentVisibilityState = document.visibilityState;
        const currentOnlineStatus = navigator.onLine;

        // Check for changes in visibility state
        if (this.lastVisibilityState !== currentVisibilityState) {
          console.log(`Visibility changed to: ${currentVisibilityState}`);
          this.lastVisibilityState = currentVisibilityState;
        }

        // Check for changes in online status
        if (this.lastOnlineStatus !== currentOnlineStatus) {
          console.log(`Online status changed: ${currentOnlineStatus ? 'Online' : 'Offline'}`);
          this.lastOnlineStatus = currentOnlineStatus;
        }
      }, 1000); // Check every 1000ms
    },
    handleWindowClose() {
      window.addEventListener('beforeunload', () => {
        // Assume user goes offline when the window is closed
        const data = { status: 'offline' };
        const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
        navigator.sendBeacon(`${process.env.VUE_APP_API_URL}/api/updateStatus`, blob);
      });
    },
    periodicStatusUpdate() {
      setInterval(() => {
        if (navigator.onLine && document.visibilityState === 'visible') {
          this.updateUserStatus('online');
        }
      }, 300000); // Every 5 minutes
    },
    updateUserStatus(status) {
      const token = localStorage.getItem('authToken');
      axios.post(`${process.env.VUE_APP_API_URL}/api/updateStatus`, { status }, {
        headers: { 'Authorization': `Bearer ${token}` },
      }).then(() => console.log(`Status updated to ${status}`))
        .catch(error => console.error('Error updating status:', error));
    },
    callUrl() {
      console.log(`Calling URL... ${process.env.VUE_APP_API_URL}`);
    },
  },
};
</script>

<style>
/* Your styles */
</style>
