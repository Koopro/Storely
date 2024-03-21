<template>
  <v-container class="fill-height" fluid>
    <!-- Use 'align-center' and 'justify-center' on v-row for vertical and horizontal centering -->
    <v-row align="center" justify="center" class="fill-height">
      <v-col cols="12" sm="8" md="6" lg="4" class="text-center">
        <v-alert v-model="alert.show" :type="alert.type" dismissible>
          {{ alert.message }}
        </v-alert>
        <v-progress-circular v-if="loading" indeterminate color="primary"></v-progress-circular>
        <!-- Button to go back to login -->
        <v-btn color="purple" class="mt-5" @click="goToLogin" large block>Back to Login</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>



<script>
import axios from 'axios';
export default {
  data() {
    return {
      loading: true,
      alert: {
        show: false,
        type: '',
        message: '',
      },
    };
  },
  created() {
    this.verifyEmail();
  },
  methods: {
      async verifyEmail() {
          try {
              const token = this.$route.query.token;
              if (!token) {
              throw new Error('Verification token is missing.');
              }
              await axios.get(`${process.env.VUE_APP_API_URL}/api/verify-email?token=${token}`);
              
              this.alert.show = true;
              this.alert.type = 'success';
              this.alert.message = 'Your email has been successfully verified. You can now log in.';
          } catch (error) {
              let message = 'Failed to verify email. Please try again or contact support.';
              if (error.response && error.response.data && error.response.data.error) {
                  message = error.response.data.error;
              }
              this.alert.show = true;
              this.alert.type = 'error';
              this.alert.message = message;
          } finally {
                          this.loading = false;
                      }
      },
      goToLogin() {
          this.$router.push({ name: 'login' }); // Replace 'login' with the correct name/path of your login route
      }
  },
};
</script>

<style scoped>
.custom-purple {
  background-color: #8e44ad; /* Purple shade */
  color: white;
}

/* Additional styles to center and beautify the alert and progress indicator */
.v-alert,
.v-progress-circular {
  margin: 20px 0;
}
</style>

