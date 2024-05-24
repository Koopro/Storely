<template>
  <div v-if="user" class="profile-container">
    <v-card class="profile-card" elevation="3">
      <v-card-text class="text-center">
        <div class="profile-image-section">
          <img :src="user.profileImageUrl" alt="Profile Image" class="profile-image">
          <v-btn icon class="edit-image-btn" v-if="editMode" @click="triggerFileInput">
            <v-icon color="primary">mdi-pencil</v-icon>
          </v-btn>
        </div>
        <h2 class="profile-name">{{ user.username }}</h2>
        <div v-if="editMode" class="edit-fields">
          <v-text-field class="input" variant="outlined" v-model="editableUsername" placeholder="Username"></v-text-field>
          <v-text-field class="input" variant="outlined" v-model="editableName" placeholder="Name"></v-text-field>
          <v-text-field class="input" variant="outlined" v-model="editableLastname" placeholder="Last Name"></v-text-field>
        </div>
        <v-btn text v-if="!editMode" @click="toggleEditMode">Edit Profile</v-btn>
        <div v-if="editMode" class="action-buttons">
          <v-btn color="success" @click="saveProfile" :disabled="isSaving">Save</v-btn>
          <v-btn text @click="cancelEdit">Cancel</v-btn>
        </div>
        <v-btn color="red" @click="confirmDeleteAccount" class="delete-btn mt-4">Delete Account</v-btn>
      </v-card-text>

      <input type="file" ref="fileInput" @change="previewImage" hidden>
    </v-card>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" persistent max-width="400">
      <v-card>
        <v-card-title class="headline">Confirm Account Deletion</v-card-title>
        <v-card-text>Are you sure you want to delete your account? This action cannot be undone.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="purple darken-1" text @click="deleteDialog = false">Cancel</v-btn>
          <v-btn color="red darken-1" text @click="deleteAccount">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="alert.show" :color="alert.type" timeout="3000">
      {{ alert.message }}
      <v-btn color="white" text @click="alert.show = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>

<style scoped>

.input{
  color: white;
}

.profile-container {
  display: flex;
  justify-content: center;
  align-items: center; /* Center the card vertically */
  padding: 2vh 0;
}

.profile-card {
  width: 100%;
  max-width: 400px; /* Restrict maximum width for better readability */
  background-color: #424242; /* Dark background for modern look */
  color: #000000; /* White text for contrast */
  padding: 20px;
  border-radius: 12px; /* Smooth rounded corners */
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); /* Subtle shadow for depth */
}

.profile-image-section {
  position: relative;
  text-align: center;
  margin-bottom: 16px;
}

.profile-image {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #fff; /* White border for better visibility */
}

.profile-name, h2 {
  margin-bottom: 16px;
  font-size: 1.5rem;
  font-weight: 500;
  color: white;
}

.edit-image-btn {
  position: absolute;
  right: 50%;
  bottom: 0;
  transform: translateX(50%);
  background-color: rgba(255, 255, 255, 0.8);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* Subtle shadow for depth */
}

.text-center {
  text-align: center;
}

.edit-fields .v-text-field {
  margin-bottom: 16px;
  width: 100%; /* Ensure fields take full width */
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 10px; /* Space between buttons */
  margin-top: 16px;
}

.delete-btn .v-btn{
  background-color: red;
  color: white;
  padding: 10px 16px;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 500;
}

.v-btn {
  border-radius: 25px;
}

.v-btn.mt-4 {
  margin-top: 16px;
}
</style>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      user: null,
      editMode: false,
      selectedFile: null,
      isSaving: false,
      editableName: '',
      editableLastname: '',
      editableUsername: '',
      deleteDialog: false,
      alert: {
        show: false,
        type: '',
        message: '',
      },
    };
  },
  created() {
    this.fetchUserProfile();
  },
  methods: {
    async fetchUserProfile() {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/api/user/profile`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` },
        });
        this.user = response.data;
        this.user.profileImageUrl = `${process.env.VUE_APP_API_URL}${this.user.profileImageUrl}`;
        this.editableName = this.user.name;
        this.editableLastname = this.user.lastname;
        this.editableUsername = this.user.username;
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    previewImage(event) {
      this.selectedFile = event.target.files[0];
      if (this.selectedFile) {
        this.user.profileImageUrl = URL.createObjectURL(this.selectedFile);
      }
    },
    async saveProfile() {
      this.isSaving = true;
      const formData = new FormData();
      if (this.selectedFile) {
        formData.append('profileImage', this.selectedFile);
      }
      formData.append('name', this.editableName);
      formData.append('lastname', this.editableLastname);
      formData.append('username', this.editableUsername);

      try {
        await axios.post(`${process.env.VUE_APP_API_URL}/api/updateProfile`, formData, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        this.alert = { show: true, type: 'success', message: 'Profile updated successfully!' };
        this.editMode = false;
        this.fetchUserProfile(); // Refresh user data
      } catch (error) {
        console.error('Error updating profile:', error);
        this.alert = { show: true, type: 'error', message: 'Failed to update profile.' };
      } finally {
        this.isSaving = false;
      }
    },
    cancelEdit() {
      this.editMode = false;
      this.fetchUserProfile(); // Reset to original data
    },
    toggleEditMode() {
      this.editMode = !this.editMode;
    },
    confirmDeleteAccount() {
      this.deleteDialog = true;
    },
    async deleteAccount() {
      this.deleteDialog = false;
      try {
        await axios.delete(`${process.env.VUE_APP_API_URL}/api/user/${this.user._id}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` },
        });
        this.alert = { show: true, type: 'success', message: 'Account deleted successfully!' };
        // Redirect or perform necessary actions after account deletion
      } catch (error) {
        console.error('Error deleting account:', error);
        this.alert = { show: true, type: 'error', message: 'Failed to delete account.' };
      }
    },
  },
};
</script>
