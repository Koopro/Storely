<template>
  <v-navigation-drawer app permanent :class="{ 'dark-mode': darkMode }" class="sidebar">
    <v-list dense class="sidebar-list">
      <!-- Top Buttons -->
      <div class="button-group">
        <!-- Home Button -->
        <v-list-item link class="rounded-btn" :class="{ 'active-button': isHomeActive }" to="/home">
          <v-list-item-icon>
            <v-icon class="fa fa-home"></v-icon>
          </v-list-item-icon>
        </v-list-item>

        <!-- Calendar Button -->
        <v-list-item link class="rounded-btn">
          <v-list-item-icon>
            <v-icon class="fa fa-calendar"></v-icon>
          </v-list-item-icon>
        </v-list-item>

        <!-- Tasks Button -->
        <v-list-item link class="rounded-btn">
          <v-list-item-icon>
            <v-icon class="fa fa-tasks"></v-icon>
          </v-list-item-icon>
        </v-list-item>
      </div>

      <!-- Spacer -->
      <div class="spacer"></div>

      <!-- Bottom Buttons -->
      <div class="button-group">
        <!-- Profile Button -->
        <v-list-item link class="rounded-btn" :class="{ 'active-button': isProfileActive }" to="/profile">
          <v-list-item-icon>
            <v-icon class="fa fa-user-circle"></v-icon>
          </v-list-item-icon>
        </v-list-item>

        <dark-mode-toggle :value="darkMode" @change="updateDarkMode" />
      </div>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import DarkModeToggle from './DarkModeToggle.vue';

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
  computed: {
    isHomeActive() {
      return this.$route.path === '/home';
    },
    isProfileActive() {
      return this.$route.path === '/profile';
    }
  },
  methods: {
    updateDarkMode(value) {
      this.darkMode = value;
      this.$emit('dark-mode-changed', value);
    }
  }
}
</script>

<style scoped>
.sidebar {
  max-width: 80px; /* Adjust the width as needed */
  display: flex;
  flex-direction: column;
  height: 100vh; /* Use the full height of the viewport */
  background-color: #F5F5F5; /* Light gray background, adjust as needed */
}

.sidebar-list {
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* Distribute space between top and bottom buttons */
  height: 100%;
  padding: 16px 0; /* Add padding on top and bottom for spacing */
}

.button-group {
  display: flex;
  flex-direction: column;
  align-items: center;
}

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

/* Additional button-specific adjustments */
.v-icon.fa-home {
  /* Adjust for home icon if needed */
}

.v-icon.fa-calendar {
  /* Adjust for calendar icon if needed */
}

.v-icon.fa-tasks {
  /* Adjust for tasks icon if needed */
}

.v-icon.fa-user-circle {
  /* Adjust for user icon if needed */
}

.v-icon.fa-moon {
  /* Adjust for moon icon if needed */
}

/* Ensure there's no extra padding or margins affecting the alignment */
.v-list-item {
  padding: 0;
  min-height: 0;
}

.v-list-item-icon {
  margin: 0;
}

/* Hover and active states for visual feedback */
.rounded-btn:hover {
  background-color: #E0E0E0; /* Darker on hover */
}

.rounded-btn:active {
  background-color: #CCCCCC; /* Even darker on active */
}
.dark-mode {
  background-color: #4e4e4e; /* Example dark background color */
  color: #ecf0f1; /* Example light text color */
}

/* Style adjustments for list items in dark mode */
.dark-mode .rounded-btn {
  background-color: #3f3f3f; /* Darker button background for dark mode */
  color: #ecf0f1; /* Text color for icons in dark mode */
}

/* Style adjustments for icons in dark mode */
.dark-mode .v-icon {
  color: #ecf0f1; /* Text color for icons in dark mode */
}


.active-button {
  background-color: #a0a0a0; /* Adjust color for active button */
}
.dark-mode .active-button {
  background-color: #747474; /* Adjust color for active button */
}
</style>