<template>
  <div v-if="user">
    <v-card class="mx-auto my-5" outlined elevation="5">
      <div class="profile-header">
        <v-hover>
          <div class="image-container" @click="editMode ? triggerFileInput() : null">
            <img :src="user.profileImageUrl" alt="Profile Image" class="profile-image">
            <div v-if="editMode" class="overlay">
              <v-icon color="white" size="48" @click.stop="triggerFileInput">mdi-pencil-outline</v-icon>
            </div>
          </div>
        </v-hover>
        <!-- UserStatus is responsible for displaying and editing the status -->
        <UserStatus :user="user" :editMode="editMode" @statusUpdated="handleStatusUpdate" />
      </div>

      <v-card-text>
        <h2>{{ user.username }}</h2>
        <v-btn color="primary" @click="toggleEditMode">Edit Profile</v-btn>
        <div v-if="editMode" key="edit">
          <v-text-field label="Username" v-model="editableUsername" outlined dense></v-text-field>
          <v-text-field label="Name" v-model="editableName" outlined dense></v-text-field>
          <v-text-field label="Lastname" v-model="editableLastname" outlined dense></v-text-field>
          <v-btn color="success" @click="saveProfile" :disabled="isSaving">Save</v-btn>
          <v-btn color="grey" @click="cancelEdit">Cancel</v-btn>
        </div>
      </v-card-text>

      <input type="file" ref="fileInput" @change="previewImage" hidden>

      <v-snackbar v-model="alert.show" :color="alert.type" timeout="3000">
        {{ alert.message }}
        <v-btn color="white" text @click="alert.show = false">Close</v-btn>
      </v-snackbar>
    </v-card>

    <!-- Status Change Dialog -->
    <v-dialog v-model="statusDialog" persistent max-width="290px">
      <v-card>
        <v-card-title class="text-h5">Change Status</v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" v-for="status in statuses" :key="status.icon">
                <v-btn icon @click="changeStatus(status.icon)">
                  <v-icon large>{{ status.icon }}</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="statusDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.mx-auto {
  max-width: 400px;
}

.image-container {
  position: relative;
  width: 150px;
  height: 150px;
  margin: 20px auto;
  cursor: pointer;
}

.profile-image {
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
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.3s;
}

.image-container:hover .overlay {
  opacity: 1;
}

.v-icon {
  cursor: pointer;
}

.v-btn {
  border-radius: 25px;
}

.v-snackbar {
  border-radius: 10px;
}

h2 {
  text-align: center;
  font-size: 24px;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
}

.user-status {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.user-status v-icon {
  margin-right: 8px;
}
</style>

<script>
import axios from 'axios';
import UserStatus from '../components/User/UserStatus.vue';

export default {
  components: {
    UserStatus,
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
      userStatusIcon: 'mdi-account-circle',
      statusDialog: false, // Controls the visibility of the status change dialog
      statuses: [ // Example statuses and their corresponding icons
        { icon: 'mdi-account-circle', name: 'Available' },
        { icon: 'mdi-do-not-disturb', name: 'Busy' },
        { icon: 'mdi-clock-time-four-outline', name: 'Away' }
      ],
    };
  },  created() {
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
    handleStatusUpdate(newStatus) {
    this.user.status = newStatus;
    // Optionally: Update the status on the backend
    console.log('New status:', newStatus);
  },
  toggleEditMode() {
    this.editMode = !this.editMode;
  },
  },
};
</script>

