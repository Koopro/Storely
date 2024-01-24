<template>
  <v-card>
    <!-- Conditional rendering for user image -->
    <v-img v-if="userProfile.imageURL" :src="userProfile.imageURL" height="200px" class="mb-3"></v-img>
    <v-card-title class="text-h5">{{ userProfile.username }}</v-card-title> <!-- Display username -->
    <v-card-text>
      <div><strong>Email:</strong> {{ userProfile.email }}</div>
      <!-- Add more user details here as needed -->
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    userProfile: {
      type: Object,
      required: true
    }
  }
};
</script>

<style scoped>
/* Styling for the user profile card */
.v-card {
  max-width: 400px;
  margin: auto;
}

/* Add more styling as needed */
</style>
