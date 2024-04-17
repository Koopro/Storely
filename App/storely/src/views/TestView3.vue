<template>
  <v-container fluid class="container">
    <v-card class="mx-auto card" shaped elevation="12" max-width="800">
      <v-tabs v-model="tab" background-color="deep-purple accent-4" dark centered>
        <v-tab key="users">Users</v-tab>
        <v-tab key="friends">Friends</v-tab>
        <v-tab key="requests">Friend Requests</v-tab>
      </v-tabs>

      <v-window v-model="tab">
        <!-- Users Tab -->
        <v-window-item value="users">
          <v-list dense subheader>
            <v-subheader class="text-h5 pa-2">All Users</v-subheader>
            <v-divider></v-divider>
            <v-list-item-group>
              <v-list-item v-for="user in users" :key="user._id" two-line>
                <v-list-item-avatar tile size="56">
                  <v-icon large>mdi-account-circle</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title class="headline">{{ user.name }}</v-list-item-title>
                  <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn icon @click="addFriend(user._id)">
                    <v-icon color="green">mdi-account-plus</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-window-item>

        <!-- Friends Tab -->
        <v-window-item value="friends">
          <v-list dense subheader>
            <v-subheader class="text-h5 pa-2">My Friends</v-subheader>
            <v-divider></v-divider>
            <v-list-item-group>
              <v-list-item v-for="friend in friends" :key="friend._id" two-line>
                <v-list-item-avatar tile size="56">
                  <v-icon large>mdi-account-check</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title class="headline">
                    {{ friend.requester._id === getUser._id ? friend.recipient.name : friend.requester.name }}
                  </v-list-item-title>

                  <div>
                    Requester ID: {{ friend.requester._id }}, Current User ID: {{ getUser._id }}
                    <br>
                    Resulting name: {{ friend.requester._id === getUser._id ? friend.recipient.name : friend.requester.name }}
                  </div>

                </v-list-item-content>
                <v-list-item-action>
                  <v-btn icon @click="removeFriend(friend._id)">
                    <v-icon color="red">mdi-account-remove</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-window-item>

        <!-- Friend Requests Tab -->
        <v-window-item value="requests">
          <v-list dense subheader>
            <v-subheader class="text-h5 pa-2">Friend Requests</v-subheader>
            <v-divider></v-divider>
            <v-list-item-group>
              <v-list-item v-for="request in friendRequests" :key="request._id" two-line>
                <v-list-item-avatar tile size="56">
                  <v-icon large>mdi-account-question</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title class="headline">{{ request.requester.name }} wants to connect</v-list-item-title>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn icon @click="acceptFriend(request._id)">
                    <v-icon color="blue">mdi-account-check</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-window-item>
      </v-window>
    </v-card>

    <!-- Snackbar Notification -->
    <v-snackbar v-model="showAlert" :color="alertColor" :timeout="4000" bottom right>
      {{ alertText }}
    </v-snackbar>
  </v-container>
</template>



<script>
export default {
  data: () => ({
    tab: null,
    users: [],
    friends: [],
    friendRequests: [],
    apiUrl: `${process.env.VUE_APP_API_URL}/api`,
    authToken: `Bearer ${localStorage.getItem('authToken')}`,
    showAlert: false,
    alertText: '',
    alertColor: 'success',
    getUser: null,
  }),
  methods: {
    async getUserInfo() {
      try {
        const response = await fetch(`${this.apiUrl}/user/profile`, {
          method: 'GET',
          headers: {
            'Authorization': this.authToken
          }
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        this.getUser = data;

      } catch (error) {
        console.error('Failed to fetch user info:', error);
      }
    },

    async fetchUsers() {
      try {
        const response = await fetch(`${this.apiUrl}/users`, {
          method: 'GET',
          headers: { 'Authorization': this.authToken }
        });
        this.users = await response.json();
      } catch (error) {
        this.showAlertWithMessage('Failed to fetch users', 'error');
      }
    },
    async addFriend(friendId) {
      try {
        const response = await fetch(`${this.apiUrl}/friends/request`, {
          method: 'POST',
          headers: {
            'Authorization': this.authToken,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ recipientId: friendId })
        });
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message);
        }
        this.alertText = result.message;
        this.alertColor = 'success';
        this.showAlert = true;
        this.fetchFriends();
      } catch (error) {
        this.alertText = error.message;
        this.alertColor = 'error';
        this.showAlert = true;
      }
    },
    async fetchFriends() {
      try {
        const response = await fetch(`${this.apiUrl}/friends/list`, {
          method: 'GET',
          headers: { 'Authorization': this.authToken }
        });
        this.friends = await response.json();
      } catch (error) {
        this.showAlertWithMessage('Failed to fetch friends', 'error');
      }
    },
    async fetchFriendRequests() {
      try {
        const response = await fetch(`${this.apiUrl}/friends/pending`, {
          method: 'GET',
          headers: { 'Authorization': this.authToken }
        });
        this.friendRequests = await response.json();
      } catch (error) {
        this.showAlertWithMessage('Failed to fetch friend requests', 'error');
      }
    },
    async acceptFriend(friendshipId) {
      try {
        const response = await fetch(`${this.apiUrl}/friends/accept`, {
          method: 'POST',
          headers: { 'Authorization': this.authToken, 'Content-Type': 'application/json' },
          body: JSON.stringify({ friendshipId })
        });
        const result = await response.json();
        this.showAlertWithMessage('Friend request accepted!', 'success');
        this.fetchFriendRequests();
        this.fetchFriends();
      } catch (error) {
        this.showAlertWithMessage('Failed to accept friend request', 'error');
      }
    },
    async removeFriend(friendshipId) {
      try {
        const response = await fetch(`${this.apiUrl}/friends/remove`, {
          method: 'POST',
          headers: { 'Authorization': this.authToken, 'Content-Type': 'application/json' },
          body: JSON.stringify({ friendshipId })
        });
        if (response.ok) {
          this.showAlertWithMessage('Friendship removed!', 'success');
          this.fetchFriends();
        } else {
          throw new Error((await response.json()).message);
        }
      } catch (error) {
        this.showAlertWithMessage('Failed to remove friend', 'error');
      }
    },
    showAlertWithMessage(message, type) {
      this.alertText = message;
      this.alertColor = type;
      this.showAlert = true;
    }
  },
  created() {
    this.fetchUsers();
    this.fetchFriends();
    this.fetchFriendRequests();
    this.getUserInfo()
  },
  mounted() {
    this.getUserInfo();
  }
}
</script>

<style scoped>
.container {
  max-width: 1000px; /* Limiting the width for better focus */
  margin: auto; /* Centering the card in the container */
}

.card {
  border-radius: 12px; /* Rounded corners for the card */
  overflow: hidden; /* Ensures nothing bleeds outside the border */
}

v-tab {
  font-size: 1.2rem; /* Larger font size for tabs */
  padding: 12px 24px; /* More padding for a better touch target */
}

v-window-item {
  padding: 20px; /* Padding inside tab content for spacing */
  background-color: #f9f9f9; /* Light background for the content area */
}

v-list-item {
  border-bottom: 1px solid #eee; /* Subtle separators for list items */
  transition: background-color 0.3s; /* Smooth transition for hover effects */
}

v-list-item:hover {
  background-color: #f0f0f0; /* Highlight list items on hover */
}

.v-list-item-action .v-btn {
  transition: transform 0.2s ease-in-out; /* Smooth transformation on button press */
}

.v-list-item-action .v-btn:hover {
  transform: scale(1.1); /* Slightly enlarge buttons on hover */
}

.v-avatar .v-icon {
  color: #666; /* Muted icon colors for less visual noise */
}

v-snackbar {
  border-radius: 5px; /* Rounded corners for the snackbar */
}
</style>