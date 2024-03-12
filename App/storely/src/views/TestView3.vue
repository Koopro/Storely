<template>
    

    <div v-if="user" class="profile-container">
    <div class="image-container">
      <img :src="user.profileImageUrl" alt="Profile Image" class="profile-image">
      <!-- Conditional rendering based on editMode -->
      <v-overlay v-if="editMode" :value="true" @click.stop="triggerFileInput">
        <v-icon color="white" size="48">mdi-pencil-outline</v-icon>
      </v-overlay>
    </div>
    <!-- Toggle between display and edit mode -->
    <div v-if="!editMode">
      <h2>{{ user.name }} {{ user.lastname }}</h2>
      <v-btn color="primary" @click="enableEditMode">Edit Profile</v-btn>
    </div>
    <div v-else>
      <v-text-field label="Name" v-model="editableName"></v-text-field>
      <v-text-field label="Lastname" v-model="editableLastname"></v-text-field>
      <v-btn color="success" @click="saveProfile">Save</v-btn>
      <v-btn color="grey" @click="cancelEdit">Cancel</v-btn>
    </div>

    <!-- Edit Profile Picture Modal -->
    <v-dialog v-model="showModal" persistent max-width="500px">
      <v-card>
        <v-card-title>Edit Profile Picture</v-card-title>
        <v-card-text>
          <v-file-input v-model="selectedFile" label="Select your profile picture" filled prepend-icon="mdi-camera" @change="previewImage"></v-file-input>
          <!-- Image preview -->
          <v-img :src="previewUrl" aspect-ratio="1" class="mt-3"></v-img>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" @click="showModal = false">Cancel</v-btn>
          <v-btn color="primary" :loading="isSaving" @click="saveImage">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar for feedback messages -->
    <v-snackbar v-model="alert.show" :color="alert.type" timeout="3000" :right="true">
      {{ alert.message }}
      <v-btn color="white" text @click="alert.show = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      user: null,
      showModal: false,
      selectedFile: null,
      previewUrl: '',
      isSaving: false,
      editMode: false,
      editableName: '',
      editableLastname: '',
      alert: {
        show: false,
        type: '', // 'success', 'error'
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
        const response = await axios.get('http://localhost:3000/api/user/profile', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` },
        });
        this.user = response.data;
        this.user.profileImageUrl = `http://localhost:3000${this.user.profileImageUrl}`;
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    },

    

    previewImage(event) {
      this.selectedFile = event.target.files[0];
      if (this.selectedFile) {
        this.previewUrl = URL.createObjectURL(this.selectedFile);
      }
    },

    async saveImage() {
      const formData = new FormData();
      formData.append('profileImage', this.selectedFile);

      try {
        await axios.post('http://localhost:3000/api/uploadProfileImage', formData, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        this.alert = { show: true, type: 'success', message: 'Image uploaded successfully!' };
        this.showModal = false;
        this.fetchUserProfile(); // Refresh user data
      } catch (error) {
        console.error('Error uploading new image:', error);
        this.alert = { show: true, type: 'error', message: 'Failed to upload image.' };
      }
    },
    enableEditMode() {
      this.editMode = true;
      this.editableName = this.user.name;
      this.editableLastname = this.user.lastname;
    },
    async saveProfile() {
      // Save the updated profile information
      // Include logic for saving the new name, lastname, and possibly the updated image
    },
    cancelEdit() {
      // Cancel editing and revert any unsaved changes
      this.editMode = false;
      this.fetchUserProfile(); // Optionally, refresh the profile to revert changes
    },
  },
};
</script>

<style scoped>
.profile-container .image-container {
  position: relative;
  width: 150px;
  height: 150px;
  margin: auto;
  cursor: pointer;
}

.profile-container .image-container .profile-image {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}
</style>