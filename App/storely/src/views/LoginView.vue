<template>
  <v-app :class="{'dark-mode': darkMode}">
    <!-- Flex container for vertical centering -->
    <div class="flex-container">
      <login :darkMode="darkMode" />

      <!-- Dark Mode Toggle Fixed at Bottom-Left -->
      <div class="dark-mode-toggle-container">
        <dark-mode-toggle :value="darkMode" @change="updateDarkMode" />
      </div>
    </div>
  </v-app>
</template>

<script>
import Login from '../components/Login/Login.vue';
import DarkModeToggle from '../components/sidebar/DarkModeToggle.vue';

export default {
  components: {
    Login,
    DarkModeToggle
  },
  data() {
    return {
      darkMode: localStorage.getItem('darkMode') === 'true'
    };
  },
  methods: {
    updateDarkMode(value) {
      this.darkMode = value;
      localStorage.setItem('darkMode', value);
    }
  }
};
</script>
<style scoped>
.rounded-btn {
  border-radius: 50%;
  width: 60px; /* Adjust the size of the button if needed */
  height: 60px; /* Adjust the size of the button if needed */
  margin: 10px 0; /* Spacing above and below the button */
  display: inline-flex; /* Using inline-flex to center content */
  justify-content: center;
  align-items: center;
  background-color: #FFFFFF; /* Button background color */
  color: #000000; /* Icon color */
  box-shadow: 0px 3px 6px #00000029; /* Shadow for depth (optional) */
}

.v-icon {
  font-size: 24px; /* Icon font size, adjust if needed */
  padding: 0;
  margin: 0;
  line-height: 1; /* Ensures the icon is aligned without extra space */
}

.dark-mode .rounded-btn {
  background-color: #333;
  color: rgb(219, 219, 219);
}
.flex-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh; /* Full viewport height */
  padding: 20px; /* Padding to prevent content touching the edges */
  background-image: url('../assets/Loginback.svg'); /* Update the path as needed */
  background-size: cover; /* Cover the entire container */
  background-position: center; /* Center the background image */
  background-repeat: no-repeat; /* Prevent repeating the background */
}
.dark-mode .flex-container{
  background-image: url('../assets/Loginback-dark.svg');
}

/* Dark mode background color */
.dark-mode {
  background-color: #333;
  color: #fff;
}

/* Container for the dark mode toggle button */
.dark-mode-toggle-container {
  position: fixed;
  bottom: 20px;
  left: 20px;
  z-index: 1000;
}

/* Styles specifically for the button inside the container */
.dark-mode-toggle-container button {
  background-color: #4A90E2; /* Button background color */
  color: white; /* Button text color */
  border: none; /* Removes the default border */
  border-radius: 4px; /* Rounded corners */
  padding: 10px 15px; /* Padding inside the button */
  cursor: pointer; /* Changes cursor to indicate button */
  transition: background-color 0.3s; /* Smooth transition for hover effect */
}

/* Button hover effect */
.dark-mode-toggle-container button:hover {
  background-color: #3A7BD5; /* Slightly darker color on hover */
}

/* Dark mode specific styles for the button */
.dark-mode .dark-mode-toggle-container button {
  background-color: #555; /* Darker background for dark mode */
  color: #fff; /* Light text color for dark mode */
}

/* Responsive adjustments for smaller screens */
@media (max-width: 768px) {
  .dark-mode-toggle-container {
    bottom: 10px;
    left: 10px;
  }

  .dark-mode-toggle-container button {
    padding: 8px 12px; /* Slightly smaller padding on smaller screens */
  }
}

/* Additional media queries for other breakpoints can be added here */
</style>
