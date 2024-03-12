<template>
    <div v-if="user" class="profile-container">
      <v-hover>
        <div class="image-container" @click="editMode ? triggerFileInput() : null">
          <img :src="user.profileImageUrl" alt="Profile Image" class="profile-image">
          <div v-if="editMode" class="overlay">
            <v-icon color="white" size="48" @click.stop="triggerFileInput">mdi-pencil-outline</v-icon>
          </div>
        </div>
      </v-hover>
      
      <!-- Conditional rendering for viewing or editing profile -->
      <div v-if="!editMode">
        <h2>{{ user.name }} {{ user.lastname }}</h2>
        <v-btn color="primary" @click="enableEditMode">Edit Profile</v-btn>
      </div>
      <div v-else>
        <v-text-field label="Name" v-model="editableName" outlined dense></v-text-field>
        <v-text-field label="Lastname" v-model="editableLastname" outlined dense></v-text-field>
        <v-btn color="success" @click="saveProfile" :disabled="isSaving">Save</v-btn>
        <v-btn color="grey" @click="cancelEdit">Cancel</v-btn>
      </div>
  
      <!-- File input for selecting new image, hidden -->
      <input type="file" ref="fileInput" @change="previewImage" hidden>
  
      <!-- Snackbar for feedback messages -->
      <v-snackbar v-model="alert.show" :color="alert.type" timeout="3000">
        {{ alert.message }}
        <v-btn color="white" text @click="alert.show = false">Close</v-btn>
      </v-snackbar>
    </div>
  </template>

  
  <style scoped>
  .profile-container .image-container {
    position: relative;
    width: 150px;
    height: 150px;
    margin: auto;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .profile-container .image-container .profile-image {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0,0,0,0.5); /* Darken the image */
    border-radius: 50%;
    display: none;
  }
  .image-container:hover .overlay {
    display: flex;
  }
  
  .v-icon {
    cursor: pointer; /* Change cursor to pointer to indicate clickable */
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
          this.editableName = this.user.name;
          this.editableLastname = this.user.lastname;
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
  
        try {
          await axios.post('http://localhost:3000/api/updateProfile', formData, {
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
      enableEditMode() {
        this.editMode = true;
      },
    },
  };
  </script>
  
  