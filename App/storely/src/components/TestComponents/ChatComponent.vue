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
          <div class="message-sender">{{ message.sender?.name || 'Unknown' }}</div>
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
import io from 'socket.io-client';

export default {
  data() {
    return {
      socket: null,
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
    this.initializeSocket();
  },
  beforeUnmount() {
    if (this.socket) {
      this.socket.disconnect();
    }
  },
  methods: {
    initializeSocket() {
      // Initialize Socket connection
      this.socket = io('http://localhost:3000', { // Ensure this is your server address
        query: {token: localStorage.getItem('authToken')}
      });

      this.socket.on('chatMessage', (message) => {
        if (this.selectedUser && message.conversationId === this.selectedUser.conversationId) {
          this.selectedUser.messages.push(message);
          this.$nextTick(this.scrollToBottom);
        }
      });

      this.socket.on('connect', () => console.log('Connected to WebSocket server'));
      this.socket.on('disconnect', () => console.log('Disconnected from WebSocket server'));
    },
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
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    },
    selectUser(user) {
      if (!user.conversationId) {
        user.conversationId = this.generateConversationId(this.getUser._id, user._id);
      }
      this.selectedUser = {...user, messages: []};
      this.fetchMessages(user.conversationId);
    },
    generateConversationId(userId1, userId2) {
      return [userId1, userId2].sort().join('-');
    },
    sendMessage() {
      if (!this.selectedUser || !this.newMessage.trim()) return;
      const messageData = {
        conversationId: this.generateConversationId(this.getUser._id, this.selectedUser._id),
        sender: this.getUser._id,
        recipient: this.selectedUser._id,
        text: this.newMessage,
        timestamp: new Date()
      };
      this.socket.emit('chatMessage', messageData);
      this.addMessageToChat({...messageData, sender: {_id: this.getUser._id, name: 'You'}});
      this.newMessage = '';
    },
    addMessageToChat(message) {
      if (!this.selectedUser.messages) {
        this.selectedUser.messages = [];
      }
      this.selectedUser.messages.push(message);
      this.$nextTick(this.scrollToBottom);
    },
    scrollToBottom() {
      const chatMessages = this.$refs.chatMessages;
      if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }
    },
    fetchMessages(conversationId) {
      axios.get(`http://localhost:3000/api/chat/history/${conversationId}`, {
        headers: {'Authorization': this.authToken}
      }).then(response => {
        this.selectedUser.messages = response.data;
      }).catch(error => {
        console.error('Error fetching messages:', error);
      });
    },
  }
};
</script>

<style scoped>
/* Styles for the user list */
.no-friends {
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
