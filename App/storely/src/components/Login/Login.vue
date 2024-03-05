<template>
  <v-container fluid>
    <v-row align="center" justify="center" class="fill-height">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="rounded-card pa-5" :class="{ 'dark-mode': darkMode }">
          <!-- Dynamic Title Based on Form Type -->
          <v-card-title class="text-h5 text-center mb-4">{{ isLogin ? 'Login' : 'Register' }}</v-card-title>
          <v-card-text>
            <v-form ref="form" class="mx-3" @submit.prevent="isLogin ? submitLoginForm() : submitRegisterForm()">
              <!-- Login Form -->
              <template v-if="isLogin">
                <v-text-field label="Email Address" v-model="email" :rules="emailRules" variant="outlined" dense clearable class="rounded-input mb-3"></v-text-field>
                <v-text-field style="margin-top: -0.5rem;" label="Password" v-model="password" :rules="passwordRules" :type="showPassword ? 'text' : 'password'" :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" @click:append-inner="toggleShowPassword" clearable variant="outlined" dense class="rounded-input mb-3"></v-text-field>
                <v-alert v-if="loginError" type="error" dismissible @input="loginError = false">{{ errorMessage }}</v-alert>
                <v-btn class="rounded-btn my-2" block large type="submit">Login</v-btn>
              </template>
              
              <!-- Register Form -->
              <template v-else class="Register">
                <v-row>
                  <v-col cols="6">
                    <v-text-field label="First Name" v-model="name" :rules="nameRules" variant="outlined" dense clearable class="rounded-input mb-2"></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field label="Last Name" v-model="lastname" :rules="nameRules" variant="outlined" dense clearable class="rounded-input mb-2"></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="6" style="margin-top: -1.8rem;">
                    <v-text-field label="Username" v-model="username" :rules="usernameRules" variant="outlined" dense clearable class="rounded-input mb-2"></v-text-field>
                  </v-col>
                  <v-col cols="6" style="margin-top: -1.8rem;">
                    <v-text-field label="Email" v-model="email" :rules="emailRules" variant="outlined" dense clearable class="rounded-input mb-2"></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" style="margin-top: -1.8rem;">
                    <v-text-field label="Password" v-model="password" :rules="passwordRules" :type="showPassword ? 'text' : 'password'" :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" @click:append-inner="toggleShowPassword" clearable variant="outlined" dense class="rounded-input mb-2"></v-text-field>
                  </v-col>
                  <v-col cols="12" style="margin-top: -1.8rem;">
                    <v-text-field
                      label="Confirm Password"
                      v-model="confirmPassword"
                      :rules="confirmPasswordRules"
                      :type="showConfirmPassword ? 'text' : 'password'"
                      :append-inner-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                      @click:append-inner="toggleShowConfirmPassword"
                      clearable
                      variant="outlined"
                      dense
                      class="rounded-input mb-2"></v-text-field>
                  </v-col>
                </v-row>
                <v-alert v-if="registerError" type="error" dismissible @input="registerError = false">{{ errorMessage }}</v-alert>
                <v-btn class="rounded-btn my-2" block large type="submit">Register</v-btn>
              </template>
              
              <!-- Toggle Form Button -->
              <div class="text-center">
                <btn text small class="switch-btn my-2" @click="toggleForm">
                  {{ isLogin ? 'Register now' : 'Login now' }}
                </btn>
              </div>

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
      // Shared fields
      email: '',
      password: '',
      showPassword: false,
      // Login specific fields
      loginError: false,
      // Register specific fields
      name: '',
      lastname: '',
      username: '',
      confirmPassword: '',
      showConfirmPassword: false,
      registerError: false,
      // Shared rules
      emailRules: [
        v => !!v || 'Email is required',
        v => /.+@.+\..+/.test(v) || 'Email must be valid'
      ],
      passwordRules: [
        v => !!v || 'Password is required',
        v => v.length >= 6 || 'Password must be at least 6 characters'
      ],
      // Register rules
      nameRules: [
        v => !!v || 'Field is required',
      ],
      usernameRules: [
        v => !!v || 'Username is required',
      ],
      confirmPasswordRules: [
      v => !!v || 'Confirm Password is required',
      v => this.confirmPasswordMatchRule()
     ],
      errorMessage: '',
      isLogin: true // Toggle between login and register form
    };
  },
  methods: {
    toggleForm() {
      this.isLogin = !this.isLogin;
    },
    toggleShowPassword() {
      this.showPassword = !this.showPassword;
    },
    toggleShowConfirmPassword() {
      this.showConfirmPassword = !this.showConfirmPassword;
    },
    confirmPasswordMatchRule() {
    return this.confirmPassword === this.password || 'Passwords do not match';
    },
    async submitLoginForm() {
      try {
        const response = await axios.post('http://localhost:3000/api/login', {
          email: this.email,
          password: this.password,
        });

        // Assuming the response includes a token you want to store
        localStorage.setItem('authToken', response.data.token);

        // Redirect the user to the home page after successful login
        this.$router.push({ name: 'home' });

        // Reset the form and any error messages
        this.loginError = false;
        this.errorMessage = '';
      } catch (error) {
        // Handle errors, such as showing a message to the user
        this.loginError = true;
        this.errorMessage = 'Failed to login. Please check your credentials.';
      }
    },

    async submitRegisterForm() {
      try {
        const response = await axios.post('http://localhost:3000/api/register', {
          name: this.name,
          lastname: this.lastname,
          username: this.username,
          email: this.email,
          password: this.password,
          role: 'user',
          }, {
            headers: {
              'Content-Type': 'application/json'
            }
          }).then(response => {
            console.log('Success: ' , response.data);
            this.$router.push({ name: 'home' });
          }).catch(error => {
            console.log('Error: ' , error.response.data);
          })

        // Handle response, e.g., redirecting the user, storing the token, etc.
        console.log(response.data);
        // Optionally, handle the response, such as automatically logging the user in
        // For now, let's just redirect to the login page for them to log in manually
        this.$router.push({ name: 'login' });

        // Reset the form and any error messages
        this.registerError = false;
        this.errorMessage = '';
      } catch (error) {
        // Handle errors, such as showing an error message
        this.registerError = true;
        this.errorMessage = 'Registration failed. Please try again.';
      }
    }

  }
};
</script>

<style scoped>
* {
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */
}
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

.switch-btn {
  color: #45225a; /* Adjust the color to match your design */
  font-size: 0.875rem; /* Example font size, adjust as needed */
  background: none;
  box-shadow: none;
  text-align: center;
}

.text-center {
  display: flex;
  justify-content: center;
}

/* Adjust the switch button styles as needed */
.switch-btn {
  color: #272727; /* Adjust the color to match your design */
  font-size: 0.875rem; /* Example font size, adjust as needed */
  padding: 0; /* Remove padding to make it look more like plain text */
}
.dark-mode .switch-btn{
  color: rgb(219, 219, 219);
}

/* Reduced margin between input fields in the register form */
.Register .rounded-input {
  margin-bottom: 0.5rem;
}

/* Increased padding for the card */
.Register .rounded-card {
  padding: 1.5rem;
}

</style>