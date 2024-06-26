<template>
  <v-container fluid class="container">
    <v-card class="mx-auto card" shaped elevation="12" max-width="800">
      <v-tabs v-model="tab" background-color="deep-purple accent-4" dark centered>
        <v-tab value="users">Users</v-tab>
        <v-tab value="friends">Friends</v-tab>
        <v-tab value="requests">Friend Requests</v-tab>
        <v-tab value="sent">Pending Sent Requests</v-tab>
      </v-tabs>

      <v-window v-model="tab">
        <!-- Users Tab -->
        <v-window-item value="users">
          <v-list dense subheader>
            <v-list-subheader class="text-h5 pa-2">All Users</v-list-subheader>
            <v-divider></v-divider>
            <template v-if="users && users.length > 0">
              <v-list-item v-for="user in users" :key="user._id" two-line>
                <v-avatar>
                  <img :src="'https://api.storely.at' + user.profileImageUrl" alt="User's Profile Picture">
                </v-avatar>
                <v-list-item-content id="nameUser">
                  <v-list-item-title class="headline">{{ user.name }}</v-list-item-title>
                  <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action id="addFriend">
                  <v-btn icon @click="addFriend(user._id)">
                    <v-icon color="green">mdi-account-plus</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </template>
            <v-list-item v-else>
              <v-list-item-content class="text-center">
                No users found.
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-window-item>
        <v-window-item value="friends">
          <v-list dense>
            <v-list-subheader class="text-h5 pa-2">My Friends</v-list-subheader>
            <v-divider></v-divider>
            <template v-if="friends && friends.length > 0">
              <v-list-item v-for="friend in friends" :key="friend._id" two-line>
                <v-avatar tile size="56">
                  <img :src="getFriendPfp(friend)" alt="Friend's Profile Picture">
                </v-avatar>
                <v-list-item-content id="nameFriend">
                  <v-list-item-title class="headline">
                    {{ friend.requester._id === getUser._id ? friend.recipient.name : friend.requester.name }}
                  </v-list-item-title>
                </v-list-item-content>
                <v-list-item-action id="removeFriend">
                  <v-btn icon @click="removeFriend(friend._id)">
                    <v-icon color="red">mdi-account-remove</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </template>
            <v-list-item v-else>
              <v-list-item-content class="text-center">
                No friends found.
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-window-item>

        <!-- Friend Requests Tab -->
        <v-window-item value="requests">
          <v-list dense>
            <v-list-subheader class="text-h5 pa-2">Friend Requests</v-list-subheader>
            <v-divider></v-divider>
            <template v-if="friendRequests && friendRequests.length > 0">
              <v-list-item v-for="request in friendRequests" :key="request._id" class="user-item">
                <v-avatar tile size="56">
                  <img :src="'https://api.storely.at' + request.requester.profileImageUrl" alt="Requester's Profile Picture">
                </v-avatar>
                <v-list-item-content>
                  <v-list-item-title class="headline">{{ request.requester.name }} wants to connect</v-list-item-title>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn icon @click="acceptFriend(request._id)">
                    <v-icon color="blue">mdi-account-check</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </template>
            <v-list-item v-else>
              <v-list-item-content class="text-center">
                No friend requests.
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-window-item>

        <!-- Sent Friend Requests Tab -->
        <v-window-item value="sent">
          <v-list dense>
            <v-list-subheader class="text-h5 pa-2">Sent Friend Requests</v-list-subheader>
            <v-divider></v-divider>
            <template v-if="sentRequests && sentRequests.length > 0">
              <v-list-item v-for="request in sentRequests" :key="request._id" class="user-item">
                <v-avatar tile size="56">
                  <img :src="'https://api.storely.at' + request.recipient.profileImageUrl" alt="Recipient's Profile Picture">
                </v-avatar>
                <v-list-item-content id="namePending">
                  <v-list-item-title class="headline">{{ request.recipient.name }} <v-icon color="orange">mdi-account-clock</v-icon></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
            <v-list-item v-else>
              <v-list-item-content class="text-center">
                No sent friend requests.
              </v-list-item-content>
            </v-list-item>
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
    tab: 'users',
    users: [],
    friends: [],
    friendRequests: [],  // Ensure this is initialized as an empty array
    sentRequests: [],
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
          credentials: 'include',
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

    getFriendPfp(friend) {
      const friendProfile = friend.requester._id === this.getUser._id ? friend.recipient : friend.requester;
      return friendProfile.profileImageUrl ? `${process.env.VUE_APP_API_URL}${friendProfile.profileImageUrl}` : null;
    },

    async fetchUsers() {
      try {
        const response = await fetch(`${this.apiUrl}/users`, {
          method: 'GET',
          headers: { 'Authorization': this.authToken }
        });
        const data = await response.json();
        console.log("Fetched users:", data); // This should show the array of users
        this.users = data;
      } catch (error) {
        this.showAlertWithMessage('Failed to fetch users', 'error');
        console.error('Error fetching users:', error);
      }
    },

    async fetchSentRequests() {
      try {
        const response = await fetch(`${this.apiUrl}/friends/sentrequests`, {
          method: 'GET',
          headers: { 'Authorization': this.authToken }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch sent friend requests');
        }
        const result = await response.json();  // Get the full JSON response
        this.sentRequests = result.data;       // Assign the data part to your state
        console.log("Fetched sent requests:", this.sentRequests);
      } catch (error) {
        console.error('Error fetching sent friend requests:', error);
        this.showAlertWithMessage('Failed to fetch sent friend requests', 'error');
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
        this.showAlertWithMessage(result.message, 'success');
        this.fetchFriends();
      } catch (error) {
        this.showAlertWithMessage(error.message, 'error');
      }
    },
    async fetchFriends() {
      try {
        const response = await fetch(`${this.apiUrl}/friends/list`, {
          method: 'GET',
          headers: { 'Authorization': this.authToken }
        });
        const result = await response.json();
        console.log("Fetched friends data:", result); // Log the entire result for debugging

        if (!response.ok) {
          throw new Error(result.message);
        }

        // Ensure that 'data' exists in the result
        if (result) {
          this.friends = result; // Assign data to this.friends
          console.log("Assigned friends:", this.friends); // Log the assigned data
        } else {
          console.error("No data found in response:", result);
        }

      } catch (error) {
        this.showAlertWithMessage('Failed to fetch friends', 'error');
        console.error('Error fetching friends:', error);
      }
    },

    async fetchFriendRequests() {
      try {
        const response = await fetch(`${this.apiUrl}/friends/pending`, {
          method: 'GET',
          headers: { 'Authorization': this.authToken }
        });
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message);
        }
        this.friendRequests = result.data;  // Assign the data part of the response
        console.log("Fetched friend requests:", this.friendRequests);  // Log the fetched data
      } catch (error) {
        console.error('Error fetching friend requests:', error);
        this.showAlertWithMessage('Failed to fetch friend requests', 'error');
      }
    },

    async acceptFriend(friendshipId) {
      try {
        const response = await fetch(`${this.apiUrl}/friends/accept`, {
          method: 'POST',
          headers: {
            'Authorization': this.authToken,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ friendshipId })
        });
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message);
        }
        this.showAlertWithMessage('Friend request accepted!', 'success');
        await this.fetchFriendRequests();
        await this.fetchFriends();
      } catch (error) {
        this.showAlertWithMessage('Failed to accept friend request', 'error');
      }
    },

    async removeFriend(friendshipId) {
      try {
        const response = await fetch(`${this.apiUrl}/friends/remove`, {
          method: 'POST',
          headers: {
            'Authorization': this.authToken,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ friendshipId })
        });
        if (!response.ok) {
          throw new Error((await response.json()).message);
        }
        this.showAlertWithMessage('Friendship removed!', 'success');
        this.fetchFriends();
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
    this.fetchSentRequests();
    this.getUserInfo();
  }
}
</script>

<style scoped>
.container {
  max-width: 1000px; /* Limiting the width for better focus */
  height: 50vh;
  margin: auto; /* Centering the card in the container */
}

.card {
  border-radius: 12px; /* Rounded corners for the card */
  overflow: hidden; /* Ensures nothing bleeds outside the border */
}

.v-tab {
  font-size: 1.2rem; /* Larger font size for tabs */
  padding: 12px 24px; /* More padding for a better touch target */
}

.v-window-item {
  padding: 20px; /* Padding inside tab content for spacing */
  background-color: #f9f9f9; /* Light background for the content area */
}

.v-list-item {
  border-bottom: 1px solid #eee; /* Subtle separators for list items */
  transition: background-color 0.3s; /* Smooth transition for hover effects */
}

.v-list-item:hover {
  background-color: #f0f0f0; /* Highlight list items on hover */
}

.v-list-item-action .v-btn {
  transition: transform 0.2s ease-in-out; /* Smooth transformation on button press */
}

.v-list-item-action .v-btn:hover {
  transform: scale(1.1); /* Slightly enlarge buttons on hover */
}

.v-avatar img, .v-list-item-avatar img {
  max-width: 100%;  /* Ensures the image does not exceed the container's width */
  max-height: 100%; /* Ensures the image does not exceed the container's height */
  border-radius: 50%; /* Makes the avatar image round */
}

.v-avatar .v-icon {
  color: #666; /* Muted icon colors for less visual noise */
}

.v-snackbar {
  border-radius: 5px; /* Rounded corners for the snackbar */
}

#nameUser {
  margin-left: 50px;
  margin-top: -40px;
  max-width: 500px;
}

#nameFriend {
  margin-left: 80px;
  margin-top: -40px;
  max-width: 200px;
}

#addFriend {
  margin-left: 400px;
  margin-top: -40px;
}

#removeFriend {
  margin-left: 300px;
  margin-top: -40px;
}

#namePending {
  margin-left: 80px;
  margin-top: -50px;
}
</style>
