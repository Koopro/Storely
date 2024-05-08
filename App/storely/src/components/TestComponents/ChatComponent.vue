<template>
  <div class="chat-container">
    <div v-if="friends.length === 0" class="no-friends">
      <p>You don't have any friends yet. Please add friends in your profile.</p>
    </div>
    <div v-else class="users-container">
      <div v-for="(friend, index) in friends" :key="index" class="chat-user" :class="{ 'active': friend === selectedUser }" @click="selectUser(friend)">
        {{ displayFriendName(friend) }}
      </div>
    </div>
    <div class="chat-content">
      <div v-if="selectedUser" class="chat-messages" ref="chatMessages">
        <div v-for="(message, index) in selectedUser.messages" :key="index" class="message">
          <div class="message-sender">{{ message.sender }}</div>
          <div class="message-text">{{ message.text }}</div>
        </div>
      </div>
      <input v-if="selectedUser" v-model="newMessage" @keyup.enter="sendMessage" placeholder="Type a message..." class="chat-input" />
      <div v-else class="no-user-selected">Please select a user to chat.</div>
    </div>
  </div>


</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      selectedUser: null,
      newMessage: '',
      friends: [],
      getUser: null,
      authToken: `Bearer ${localStorage.getItem('authToken')}`,
    };
  },
  async beforeMount() {
    await this.fetchFriends();
    await this.getUserInfo();
    // Removed the call to this.getFriendPfp(); it should only be called with a valid friend object
  },
methods:{
    displayFriendName(friend) {
      return this.getUser && (friend.requester._id === this.getUser._id ? friend.recipient.name : friend.requester.name);
    },
    async getUserInfo() {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/api/user/profile`, {
          headers: {
            'Authorization': this.authToken
          }
        });
        this.getUser = response.data;
      } catch (error) {
        console.error('Failed to fetch user info:', error);
      }
    },
    async fetchFriends() {
      try {
        const response = await axios.get('https://api.storely.at/api/friends/list', {
          headers: {
            'Authorization': this.authToken,
          },
        });
        this.friends = response.data;
        console.log(this.friends)
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    },
    selectUser(user) {
      this.selectedUser = user;
      this.$nextTick(this.scrollToBottom);
    },
    sendMessage() {
      if (!this.selectedUser || !this.newMessage.trim()) return;
      this.selectedUser.messages.push({
        sender: 'You',
        text: this.newMessage
      });
      this.newMessage = '';
      this.scrollToBottom();
    },
    scrollToBottom() {
      this.$refs.chatMessages.scrollTop = this.$refs.chatMessages.scrollHeight;
    },
  }
};
</script>

<style scoped>
/* Styles for the user list */
.no-friends{
  width: auto;
  max-width: 250px;
  padding-left: 10px;
  border-right: 1px solid #ccc;
}
.users-container {
  width: auto;
  overflow-y: auto;
  max-width: 100px;
}

.chat-user {
  padding: 10px;
  cursor: pointer;
  border-bottom: 1px solid #ccc;
}

.chat-user:hover {
  background-color: #f0f0f0;
}

.active {
  background-color: #ddd;
}

/* Styles for the chat content */
.chat-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.chat-messages {
  overflow-y: auto;
  padding: 10px;
  border-left: 1px solid #ccc;
}

.message {
  margin-bottom: 10px;
}

.message-sender {
  font-weight: bold;
  margin-bottom: 5px;
}

.no-user-selected {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
}

.no-friends {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
}

.chat-container {
  display: flex;
  border: 1px solid #ccc;
  border-radius: 5px;
  overflow: hidden;
  height: 35rem;
}

.users-container {
  width: 150px;
  overflow-y: auto;
}

.chat-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.chat-messages {
  height: 33rem;
  overflow-y: auto;
  padding: 10px;
}

.chat-input {
  padding: 10px;
  border: none;
  outline: none;
  border-top: 1px solid #ccc;
  border-left: 1px solid #ccc;
}

.active {
  background-color: #f0f0f0;
}

@media (max-width: 450px) {
  .no-friends {
    max-width: 100px;
  }
}

</style>
