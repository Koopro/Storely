<template>
  <div :class="{ dark: darkMode }">
    <!-- Ihr Template-Code -->
    <p>Dark Mode ist {{ darkMode ? 'aktiv' : 'inaktiv' }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      darkMode: JSON.parse(localStorage.getItem('darkMode')) || false
    };
  },
  created() {
    // Initial setzen des Local Storage-Werts und Event auslösen
    localStorage.setItem('darkMode', JSON.stringify(this.darkMode));
    window.dispatchEvent(new CustomEvent('darkMode-localstorage-changed', {
      detail: {
        storage: localStorage.getItem('darkMode')
      }
    }));
  },
  mounted() {
    // Fügen Sie einen benutzerdefinierten Event-Listener hinzu
    window.addEventListener('darkMode-localstorage-changed', (event) => {
      this.darkMode = JSON.parse(event.detail.storage);
    });
  },
  beforeDestroy() {
    // Entfernen Sie Event-Listener um Speicherlecks zu vermeiden
    window.removeEventListener('darkMode-localstorage-changed', this.onCustomStorageChange);
  },
  methods: {
    onCustomStorageChange(event) {
      if (event.key === 'darkMode') {
        console.log('Custom Storage-Event ausgelöst:', event);
        this.darkMode = JSON.parse(event.newValue);
      }
    },
    toggleDarkMode() {
      // Dark Mode umschalten und im localStorage speichern
      this.darkMode = !this.darkMode;
      localStorage.setItem('darkMode', JSON.stringify(this.darkMode));
      window.dispatchEvent(new CustomEvent('darkMode-localstorage-changed', {
        detail: {
          storage: localStorage.getItem('darkMode')
        }
      }));
    }
  }
};
</script>

<style scoped>
.dark {
  background-color: #333;
  color: #fff;
}
</style>
