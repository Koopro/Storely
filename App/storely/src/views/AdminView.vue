<template>
  <v-container>
    <v-row class="my-5">
      <v-col
          cols="12"
          sm="6"
          md="4"
          lg="3"
          v-for="user in users"
          :key="user._id"
      >
        <v-card class="pa-3 d-flex flex-column user-card" elevation="2" outlined>
          <div class="d-flex justify-space-between align-center">
            <v-avatar :image="`https://api.storely.at${user.profileImageUrl}`" size="80"></v-avatar>
            <v-chip small :color="roleColor(user.role)" class="ml-3">{{ user.role }}</v-chip>
          </div>

          <v-list-item three-line class="flex-grow-1">
            <v-list-item>
              <v-list-item-title class="headline mb-1">{{ user.username }}</v-list-item-title>
              <v-list-item-subtitle>Name: {{ user.name }} {{ user.lastname }}</v-list-item-subtitle>
              <v-list-item-subtitle>Email: {{ user.email }}</v-list-item-subtitle>

              <!-- Status with Icon -->
              <v-list-item-subtitle>
                Status: {{ user.status }}
                <v-icon small v-if="user.status === 'online'" color="green">mdi-check-circle</v-icon>
                <v-icon small v-else-if="user.status === 'offline'" color="red">mdi-close-circle</v-icon>
                <v-icon small v-else color="orange">mdi-clock-outline</v-icon> <!-- Assuming 'away' status -->
              </v-list-item-subtitle>

            </v-list-item>
          </v-list-item>

          <v-card-actions class="justify-end">
            <v-icon v-if="user.isVerified" color="green">mdi-check-circle</v-icon>
            <v-icon v-else color="red">mdi-close-circle</v-icon>
            <v-btn
                v-if="isAdmin()"
                small
                color="red"
                @click="deleteUser(user._id)"
                class="ml-2"
            >
              Delete
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      users: [],
      currentUser: null,
    };
  },
  async created() {
    const token = localStorage.getItem('authToken');
    try {
      // Fetch all users
      const usersResponse = await axios.get(`${process.env.VUE_APP_API_URL}/api/admin/data`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      this.users = usersResponse.data;

      // Fetch current user profile
      const profileResponse = await axios.get(`${process.env.VUE_APP_API_URL}/api/user/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      this.currentUser = profileResponse.data;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  },
  methods: {
    roleColor(role) {
      switch (role) {
        case 'admin':
          return 'red';
        case 'owner':
          return 'blue';
        case 'user':
          return 'green';
        default:
          return 'grey';
      }
    },
    isAdmin() {
      return this.currentUser && this.currentUser.role === 'admin';
    },
    async deleteUser(userId) {
      const token = localStorage.getItem('authToken');
      try {
        await axios.delete(`${process.env.VUE_APP_API_URL}/api/user/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        // Refresh the user list after deletion
        this.users = this.users.filter(user => user._id !== userId);
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  },
};
</script>


<style scoped>
.user-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 350px; /* Uniform minimum height for all cards */
}

.v-avatar img {
  object-fit: cover; /* Ensure avatars are nicely fit */
}
</style>
