<!--<template>
  <Sidebar />
  <UserCard />
  <v-app :class="{'dark-mode': darkMode}">
    <div class="app-container">
      <sidebar class="app-sidebar" @dark-mode-changed="darkMode = $event"></sidebar>
      <div class="app-content">
        <h1>Profile Page</h1>
        <p>Welcome to your profile. Here you can view and edit your personal information.</p>
        <user-profile-card></user-profile-card>
      </div>
    </div>
  </v-app>

</template>

<script>
import Sidebar from '../components/sidebar/Sidebar.vue';
import UserCard from '../components/User/UserCard.vue';

export default {
  components: {
    UserCard,
    Sidebar
  },
}
</script>

<style scoped>
.app-container {
  display: grid;
  grid-template-columns: 250px 1fr;
  /* Sidebar width is 250px and the rest is for content */
  min-height: 100vh;
}

.app-sidebar {
  /* Sidebar specific styles here */
  /* You can set a min-width if necessary to avoid squishing on smaller screens */
}

.app-content {
  /* Content specific styles here */
  padding: 60px;
  /* Adjust padding as needed */
}

/* Dark mode styles */
.dark-mode {
  background-color: #121212;
  color: #e0e0e0;
}

.dark-mode .app-content h1 {
  color: #ffffff;
}

.dark-mode .app-content p {
  color: #cccccc;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .app-container {
    grid-template-columns: 1fr;
    /* Stack sidebar and content on smaller screens */
  }

  .app-sidebar {
    /* Adjustments for sidebar on smaller screens */
  }

  .app-content {
    padding: 10px;
    /* Adjust padding as needed for smaller screens */
  }
}

/* Additional dark mode or specific styles can go here */

</style>
-->

<template>
    <Sidebar></Sidebar>
    <UserCard />
</template>

<script>
import Sidebar from '../components/sidebar/Sidebar.vue';
import UserCard from '../components/User/UserCard.vue';

export default {
  components: {
    UserCard,
    Sidebar
  },
}
</script>

<style>
  template {
    background-color: pink;
  }
</style>

