<template>
  <v-container>
    <v-row class="my-5">
      <!-- Search and Filter -->
      <v-col cols="12">
        <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            class="mb-4"
            clearable
        ></v-text-field>
        <v-select
            v-model="filterRole"
            :items="roles"
            label="Filter by Role"
            class="mb-4"
            clearable
        ></v-select>
        <v-btn small color="red" @click="bulkDelete()">Delete Selected</v-btn>
      </v-col>

      <!-- User Cards -->
      <v-col
          cols="12"
          sm="6"
          md="4"
          lg="3"
          v-for="user in paginatedUsers"
          :key="user._id"
      >
        <v-card class="pa-3 d-flex flex-column user-card" elevation="2" outlined>
          <div class="d-flex justify-space-between align-center">
            <v-avatar
                :image="`https://api.storely.at${user.profileImageUrl}`"
                size="80"
            ></v-avatar>
            <v-chip small :color="roleColor(user.role)" class="ml-3">{{
                user.role
              }}</v-chip>
            <v-checkbox v-model="selectedUsers" :value="user._id"></v-checkbox>
          </div>

          <v-list-item three-line class="flex-grow-1">
            <v-list-item>
              <v-list-item-title class="headline mb-1">{{
                  user.username
                }}</v-list-item-title>
              <v-list-item-subtitle>
                Name: {{ user.name }} {{ user.lastname }}
              </v-list-item-subtitle>
              <v-list-item-subtitle>Email: {{ user.email }}</v-list-item-subtitle>

              <!-- Status with Icon -->
              <v-list-item-subtitle>
                Status: {{ user.status }}
                <v-icon
                    small
                    v-if="user.status === 'online'"
                    color="green"
                >mdi-check-circle</v-icon
                >
                <v-icon
                    small
                    v-else-if="user.status === 'offline'"
                    color="red"
                >mdi-close-circle</v-icon
                >
                <v-icon small v-else color="orange"
                >mdi-clock-outline</v-icon
                >
                <!-- Assuming 'away' status -->
              </v-list-item-subtitle>
            </v-list-item>
          </v-list-item>

          <v-card-actions class="justify-end">
            <v-icon v-if="user.isVerified" color="green">mdi-check-circle</v-icon>
            <v-icon v-else color="red">mdi-close-circle</v-icon>
            <v-btn small color="blue" @click="editUser(user)">Edit</v-btn>
            <v-btn
                v-if="isAdmin()"
                small
                color="red"
                @click="deleteUser(user._id)"
                class="ml-2"
            >
              Delete
            </v-btn>
            <v-btn small color="primary" @click="viewActivity(user)"
            >View Activity</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-col>

      <!-- Pagination -->
      <v-col cols="12" class="d-flex justify-center">
        <v-pagination v-model="page" :length="pageCount"></v-pagination>
      </v-col>
    </v-row>

    <!-- Edit User Dialog -->
    <v-dialog v-model="editDialog" max-width="500px">
      <v-card>
        <v-card-title>Edit User</v-card-title>
        <v-card-text>
          <v-text-field v-model="editedUser.name" label="Name"></v-text-field>
          <v-text-field
              v-model="editedUser.lastname"
              label="Last Name"
          ></v-text-field>
          <v-text-field v-model="editedUser.email" label="Email"></v-text-field>
          <v-select v-model="editedUser.role" :items="roles" label="Role"></v-select>
        </v-card-text>
        <v-card-actions>
          <v-btn color="blue darken-1" text @click="saveUser()">Save</v-btn>
          <v-btn color="blue darken-1" text @click="editDialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- User Activity Log Dialog -->
    <v-dialog v-model="activityDialog" max-width="600px">
      <v-card>
        <v-card-title>Activity Log</v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item v-for="activity in userActivity" :key="activity.id">
              <v-list-item-content>{{ activity.description }}</v-list-item-content>
              <v-list-item-subtitle>{{ activity.timestamp }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-btn color="blue darken-1" text @click="activityDialog = false"
          >Close</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      users: [],
      currentUser: null,
      search: '',
      filterRole: '',
      roles: ['admin', 'owner', 'user'],
      editDialog: false,
      editedUser: {},
      activityDialog: false,
      userActivity: [],
      selectedUsers: [],
      page: 1,
      itemsPerPage: 10,
    };
  },
  computed: {
    filteredUsers() {
      return this.users.filter((user) => {
        return (
            user.username.toLowerCase().includes(this.search.toLowerCase()) &&
            (this.filterRole ? user.role === this.filterRole : true)
        );
      });
    },
    pageCount() {
      return Math.ceil(this.filteredUsers.length / this.itemsPerPage);
    },
    paginatedUsers() {
      const start = (this.page - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredUsers.slice(start, end);
    },
  },
  async created() {
    const token = localStorage.getItem('authToken');
    try {
      // Fetch all users
      const usersResponse = await axios.get(
          `${process.env.VUE_APP_API_URL}/api/admin/data`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
      );
      this.users = usersResponse.data;

      // Fetch current user profile
      const profileResponse = await axios.get(
          `${process.env.VUE_APP_API_URL}/api/user/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
      );
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
            Authorization: `Bearer ${token}`,
          },
        });
        // Refresh the user list after deletion
        this.users = this.users.filter((user) => user._id !== userId);
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    },
    async bulkDelete() {
      const token = localStorage.getItem('authToken');
      try {
        await axios.post(
            `${process.env.VUE_APP_API_URL}/api/users/bulk-delete`,
            { ids: this.selectedUsers },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
        );
        // Refresh the user list after deletion
        this.users = this.users.filter(
            (user) => !this.selectedUsers.includes(user._id)
        );
        this.selectedUsers = [];
      } catch (error) {
        console.error('Error deleting users:', error);
      }
    },
    editUser(user) {
      this.editedUser = { ...user };
      this.editDialog = true;
    },
    async saveUser() {
      const token = localStorage.getItem('authToken');
      try {
        await axios.put(
            `${process.env.VUE_APP_API_URL}/api/user/${this.editedUser._id}`,
            this.editedUser,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
        );
        this.editDialog = false;
        // Refresh the user list after editing
        const usersResponse = await axios.get(
            `${process.env.VUE_APP_API_URL}/api/admin/data`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
        );
        this.users = usersResponse.data;
      } catch (error) {
        console.error('Error updating user:', error);
      }
    },
    async viewActivity(user) {
      const token = localStorage.getItem('authToken');
      try {
        const response = await axios.get(
            `${process.env.VUE_APP_API_URL}/api/user/${user._id}/activity`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
        );
        this.userActivity = response.data;
        this.activityDialog = true;
      } catch (error) {
        console.error('Error fetching activity log:', error);
      }
    },
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
