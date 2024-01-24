<template>
  <v-list-item link class="rounded-btn" @click="toggleDarkMode">
    <v-list-item-icon>
      <v-icon :class="`fa ${darkMode ? 'fa-sun' : 'fa-moon'}`"></v-icon>
    </v-list-item-icon>
  </v-list-item>
</template>

<script>
export default {
  name: 'DarkModeToggle',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: Boolean
  },
  data() {
    // Initialize darkMode from local storage or prop
    return {
      darkMode: localStorage.getItem('darkMode') === null ? this.value : localStorage.getItem('darkMode') === 'true'
    };
  },
  methods: {
    toggleDarkMode() {
      this.darkMode = !this.darkMode;
      this.$emit('change', this.darkMode);
      // Save the state to local storage
      localStorage.setItem('darkMode', this.darkMode);
    }
  },
  mounted() {
    // Check local storage when the component mounts
    const darkModePreference = localStorage.getItem('darkMode');
    if (darkModePreference) {
      this.darkMode = darkModePreference === 'true';
      this.$emit('change', this.darkMode);
    }
  }
}
</script>

<style scoped>
.dark-mode-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px; /* Button size */
  height: 50px;
  background-color: #4A90E2; /* Button background color */
  border-radius: 50%; /* Circular shape */
  color: white; /* Button text/icon color */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3); /* Subtle shadow for depth */
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s; /* Smooth transitions for hover effects */
  position: fixed;
  bottom: 20px;
  left: 20px;
  z-index: 10;
}

.dark-mode-toggle:hover {
  background-color: #357DBA; /* Darker background on hover */
}

.toggle-icon {
  font-size: 24px; /* Icon size */
}

/* Dark mode styles for the button */
.dark-mode .dark-mode-toggle {
  background-color: #333; /* Darker background for dark mode */
}

/* Adjustments for smaller screens */
@media (max-width: 768px) {
  .dark-mode-toggle {
    width: 40px; /* Slightly smaller button size for tablets */
    height: 40px;
  }
  .toggle-icon {
    font-size: 20px; /* Smaller icon size for tablets */
  }
}

@media (max-width: 480px) {
  .dark-mode-toggle {
    width: 30px; /* Even smaller button size for mobile devices */
    height: 30px;
  }
  .toggle-icon {
    font-size: 16px; /* Smaller icon size for mobile devices */
  }
}
</style>