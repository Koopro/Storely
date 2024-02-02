<template>
  <v-container class="login-container" fluid>
    <v-row align="center" justify="center" class="fill-height">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="rounded-card pa-5" :class="{ 'dark-mode': darkMode }">
          <v-card-title class="text-h5 text-center mb-4">Login</v-card-title>
          <v-card-text>
            <v-form ref="form" class="mx-3" @submit.prevent="submitForm">
              <v-text-field
                label="Email Address"
                v-model="email"
                :rules="emailRules"
                variant="outlined"
                dense
                clearable
                class="rounded-input mb-3"
                aria-describedby="email-description"
              ></v-text-field>
              <v-text-field
                label="Password"
                v-model="password"
                :rules="passwordRules"
                :type="showPassword ? 'text' : 'password'"
                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append-inner="toggleShowPassword"
                clearable
                variant="outlined"
                dense
                class="rounded-input mb-3"
                aria-describedby="password-description"
              ></v-text-field>
              <v-alert
                v-if="loginError"
                type="error"
                dismissible
                @input="loginError = false"
              >
                {{ errorMessage }}
              </v-alert>
              <v-btn
                class="rounded-btn my-2"
                block
                large
                type="submit"
              >
                Login
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

import axios from 'axios';
import { useRouter } from 'vue-router';

export default {
  props: {
    darkMode: Boolean
  },
  data() {
    return {
      email: '',
      password: '',
      showPassword: false,
      loginError: false,
      errorMessage: '',
      emailRules: [
        v => !!v || 'Email is required',
        v => /.+@.+\..+/.test(v) || 'Email must be valid'
      ],
      passwordRules: [
        v => !!v || 'Password is required',
        v => v.length >= 6 || 'Password must be at least 6 characters',
        v => /.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-].*/.test(v) || 'Password must contain at least one special character',
        v => /\d/.test(v) || 'Password must contain at least one digit'      ],
    };
  },
  methods: {
    toggleShowPassword() {
      this.showPassword = !this.showPassword;
    },
  }
};
</script>
<style scoped>
/* Card styling */
.rounded-card {
  border-radius: 25px; /* Card border radius */
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5); /* Card shadow */
  /* Default light mode styles for the card */
  background-color: #ffffffc3; /* Light mode card background */
  color: #000000; /* Light mode text color */
}

/* Light mode text field styling */

/* Light mode button styling */
.rounded-btn {
  border-radius: 25px; /* Button border radius */
  /* Light mode button styles */
  background-color: #aa4ae2; /* Light mode button color */
  color: #FFFFFF; /*rgb(160, 74, 226)mode button text color */
}

/* Dark mode specific styles */
.dark-mode .rounded-card {
  background-color: #3c3c4ec3; /* Dark mode card background */
  color: #FFFFFF; /* Dark mode text color */
}

/* Additional styles or overrides can be added here */
</style>

