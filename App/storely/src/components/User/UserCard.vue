<template>
  <div v-if="user" class="profile-container">
    <v-card class="profile-card" elevation="2">
      <!-- Profile Image and Edit Icon -->
<!-- Profile Image and Status Icon -->
      <div class="profile-image-section">
        <img :src="user.profileImageUrl" alt="Profile Image" class="profile-image">
        <v-btn icon class="edit-image-btn" v-if="editMode" @click="triggerFileInput">
          <v-icon color="primary">mdi-pencil</v-icon>
        </v-btn>
      </div>

      <v-card-text class="text-center">
        <h2 class="profile-name">{{ user.username }}</h2>
        <div v-if="editMode" class="edit-fields">
          <v-text-field solo v-model="editableUsername" placeholder="Username"></v-text-field>
          <v-text-field solo v-model="editableName" placeholder="Name"></v-text-field>
          <v-text-field solo v-model="editableLastname" placeholder="Last Name"></v-text-field>
        </div>
        <v-btn text v-if="!editMode" @click="toggleEditMode">Edit Profile</v-btn>
        <div v-if="editMode" class="action-buttons">
          <v-btn color="success" @click="saveProfile" :disabled="isSaving">Save</v-btn>
          <v-btn text @click="cancelEdit">Cancel</v-btn>
        </div>
      </v-card-text>

      <input type="file" ref="fileInput" @change="previewImage" hidden>
    </v-card>
    <v-snackbar v-model="alert.show" :color="alert.type" timeout="3000">
      {{ alert.message }}
      <v-btn color="white" text @click="alert.show = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>


<style scoped>
.profile-container {
  display: flex;
  justify-content: center;
  padding: 2vh 0;
}

.profile-card {
  max-width: 90vw;
  min-width: 280px; /* Ensure minimum readability and usability */
  background: rgb(76, 76, 76);
  padding: 5vh;
  border-radius: 8px; /* Soft rounded corners for a modern look */
}

.profile-image-section {
  position: relative;
  text-align: center;
  margin-bottom: 2vh;
}

.profile-image {
  width: 30vw;
  height: 30vw;
  max-width: 120px; /* Limit the size on larger screens */
  max-height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #eee;
}

.profile-name, h2 {
  margin-bottom: 2vh;
  font-size: 2rem;
  max-size: 22px; /* Prevent the font from becoming too large on big screens */
  font-weight: bold;
}

.edit-image-btn {
  position: absolute;
  right: 50%;
  bottom: 10%;
  transform: translateX(50%);
  background-color: rgba(255, 255, 255, 0.8);
  box-shadow: 0 2px 4px rgba(0,0,0,0.2); /* Subtle shadow for depth */
}

.text-center {
  text-align: center;
}

.edit-fields .v-text-field {
  margin-bottom: 2vh;
  width: 80%; /* Ensure fields are not too wide on large screens */
}

.action-buttons {
  display: flex;
  flex-direction: column; /* Stack buttons vertically on smaller screens */
  align-items: center;
  gap: 10px; /* Space between buttons */
  margin-top: 2vh;
}

@media (min-width: 600px) {
  .action-buttons {
    flex-direction: row; /* Align buttons horizontally on larger screens */
    justify-content: space-around;
  }
}

.v-btn {
  border-radius: 25px;
}
</style>



<script>
import axios from 'axios';
import UserStatus from './UserStatus.vue';


export default {
  components: {
    UserStatus
  },
  data() {
    return {
      user: null,
      editMode: false,
      selectedFile: null,
      isSaving: false,
      editableName: '',
      editableLastname: '',
      editableUsername: '',
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
  },
};
</script>

