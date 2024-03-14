<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'App',
  mounted() {
    this.handleVisibilityChange();
    this.handleWindowClose();
    this.periodicStatusUpdate();
  },
  methods: {
    handleVisibilityChange() {
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "hidden") {
          // Consider the user as away when the tab is not active
          this.updateUserStatus("away");
        } else {
          // Consider the user as online when the tab is active
          this.updateUserStatus("online");
        }
      });
    },
    handleWindowClose() {
      window.addEventListener("beforeunload", () => {
        const data = { status: 'offline' };
        const blob = new Blob([JSON.stringify(data)], {type : 'application/json'});
        navigator.sendBeacon('http://localhost:3000/api/updateStatus', blob);
      });
    },

    periodicStatusUpdate() {
      // Update status periodically while the app is focused
      setInterval(() => {
        if (document.visibilityState === "visible") {
          this.updateUserStatus("online");
        }
      }, 300000); // Update status every 5 minutes
    },
    updateUserStatus(status) {
      // Implement logic to retrieve the current user's auth token
      const token = localStorage.getItem('authToken');
      axios.post('http://localhost:3000/api/updateStatus', { status }, {
        headers: { 'Authorization': `Bearer ${token}` },
      }).then(() => {
        console.log(`Status updated to ${status}`);
      }).catch(error => {
        console.error('Error updating status:', error);
      });
    },
    updateUserStatusSync(status) {
      // Use navigator.sendBeacon for synchronous request when unloading
      const token = localStorage.getItem('authToken');
      const blob = new Blob([JSON.stringify({ status, token })], { type: 'application/json' });
      navigator.sendBeacon('http://localhost:3000/api/updateStatus', blob);
    }
  }
};
</script>

<style>
/* Your styles */
</style>
