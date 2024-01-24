<template>
  <v-container>
    <!-- User Profile Section -->
    <user-profile v-if="currentUser" :user-profile="currentUser"></user-profile>

    <!-- Add User Form -->
    <v-row justify="center">
      <v-col cols="12" sm="6" md="4">
        <v-card>
          <v-card-title class="text-h5">Add User</v-card-title>
          <v-card-text>
            <v-form ref="form" @submit.prevent="addUser">
              <v-text-field
                label="Email"
                v-model="user.email"
                :rules="emailRules"
                required
              ></v-text-field>
              <v-text-field
                label="Password"
                v-model="user.password"
                :rules="passwordRules"
                required
                type="password"
              ></v-text-field>
              <v-text-field
                label="Username"
                v-model="user.username"
                required
              ></v-text-field>
              <v-file-input
                label="Profile Image"
                v-model="imageFile"
                prepend-icon="mdi-camera"
                accept="image/*"
              ></v-file-input>
              <v-btn :disabled="loading" color="primary" type="submit">
                <v-progress-circular indeterminate v-if="loading" color="white" size="20"></v-progress-circular>
                Add User
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Snackbar for Notifications -->
    <v-snackbar
      v-model="snackbar"
      :timeout="5000"
      :color="snackbarColor"
    >
      {{ message }}
      <v-btn color="white" text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
import axios from 'axios';
import UserProfile from '../components/Profile/UserProfileCard.vue';

export default {
  components: {
    UserProfile
  },
  data() {
    return {
      user: {
        email: '',
        password: '',
        username: ''
      },
      imageFile: null,
      emailRules: [
        v => !!v || 'Email is required',
        v => /.+@.+\..+/.test(v) || 'Email must be valid',
      ],
      passwordRules: [
        v => !!v || 'Password is required',
        // Additional password rules here
      ],
      loading: false,
      snackbar: false,
      message: '',
      snackbarColor: 'success',
      currentUser: null,
    };
  },
  created() {
    this.fetchCurrentUser();
  },
  methods: {
    async addUser() {
      if (this.$refs.form.validate()) {
        this.loading = true;
        try {
          if (this.imageFile) {
            const formData = new FormData();
            formData.append('image', this.imageFile);
            const imageResponse = await axios.post('http://localhost:3000/upload', formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            });
            this.user.imageURL = imageResponse.data.filePath;
          }
          await axios.post('http://localhost:3000/add-user', this.user);
          this.message = 'User added successfully';
          this.snackbarColor = 'success';
          this.resetForm();
        } catch (error) {
          this.message = error.response?.data?.message || 'Error adding user';
          this.snackbarColor = 'error';
        } finally {
          this.loading = false;
          this.snackbar = true;
        }
      }
    },
    resetForm() {
      this.user.email = '';
      this.user.password = '';
      this.user.username = '';
      this.imageFile = null;
    },
    async fetchCurrentUser() {
      try {
        const response = await axios.get('http://localhost:3000/profile');
        this.currentUser = response.data;
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    }
  }
};
</script>

<style scoped>
/* Add your styles here */
</style>
