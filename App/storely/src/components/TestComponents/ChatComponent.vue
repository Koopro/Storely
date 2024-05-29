<template>
  <v-container fluid>
    <v-row>
      <v-col cols="3">
        <v-card>
          <v-card-title class="subtitle-1">Users</v-card-title>
          <v-divider></v-divider>
          <v-list dense>
            <v-list-item
                v-for="(friend, index) in friends"
                :key="index"
                @click="selectUser(friend)"
                :class="{ active: friend === selectedUser }"
            >
              <v-list-item-content>
                <v-list-item-title class="subtitle-2">{{ displayFriendName(friend) }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
      <v-col cols="9">
        <v-card>
          <v-card-title class="subtitle-1" v-if="!selectedUser">Please select a user to chat.</v-card-title>
          <v-card-title class="subtitle-1" v-else>{{ displayFriendName(selectedUser) }}</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <div v-if="selectedUser" class="chat-messages" ref="chatMessages">
              <div
                  v-for="(message, index) in selectedUser.messages"
                  :key="index"
                  :class="['message', { 'my-message': message.sender === 'You', 'other-message': message.sender !== 'You' }]"
              >
                <div class="message-sender subtitle-2">{{ message.sender === 'You' ? 'You' : message.sender }}</div>
                <div class="message-text body-2">{{ message.text }}</div>
              </div>
            </div>
          </v-card-text>
          <v-card-actions v-if="selectedUser">
            <v-text-field
                v-model="newMessage"
                @keyup.enter="sendMessage"
                placeholder="Type a message..."
                outlined
                dense
                class="chat-input"
            ></v-text-field>
            <v-btn @click="sendMessage" icon>
              <v-icon>mdi-send</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-snackbar v-model="latestMessage" top right>
      <span>{{ latestMessage.sender }}: {{ latestMessage.text }}</span>
    </v-snackbar>
  </v-container>
</template>

<script>
import axios from 'axios';
import { ref, onMounted, nextTick, watch } from 'vue';
import io from 'socket.io-client';

export default {
  setup() {
    const selectedUser = ref(null);
    const newMessage = ref('');
    const friends = ref([]);
    const getUser = ref(null);
    const authToken = `Bearer ${localStorage.getItem('authToken')}`;
    const socket = ref(null);
    const chatMessagesRef = ref(null);
    const latestMessage = ref(null); // Ref to store the latest message

    const fetchFriends = async () => {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/api/friends/list`, {
          headers: {
            Authorization: authToken,
          },
        });
        friends.value = response.data;
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    };

    const getUserInfo = async () => {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/api/user/profile`, {
          headers: {
            Authorization: authToken,
          },
        });
        getUser.value = response.data;
      } catch (error) {
        console.error('Failed to fetch user info:', error);
      }
    };

    const selectUser = async (user) => {
      selectedUser.value = {...user, messages: []};
      console.log('Selected user:', selectedUser.value); // Log selected user
      await fetchChatMessages();
      nextTick(scrollToBottom);
      joinChat();
    };

    const fetchChatMessages = async () => {
      if (!selectedUser.value) return;
      const chatId = getChatId();
      if (!chatId) {
        console.error('Chat ID is invalid.');
        return;
      }
      console.log(`Fetching chat messages for chat ID: ${chatId}`); // Log chat ID
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/api/chats/${chatId}`, {
          headers: {
            Authorization: authToken,
          },
        });
        selectedUser.value.messages = response.data.messages.map((msg) => ({
          sender: msg.userId === getUser.value._id ? 'You' : msg.username,
          text: msg.text,
        }));
        console.log('Fetched messages:', selectedUser.value.messages); // Log fetched messages
        nextTick(scrollToBottom);
      } catch (error) {
        console.error('Error fetching chat messages:', error);
        if (error.response && error.response.status === 404) {
          selectedUser.value.messages = [];
        }
      }
    };

    const sendMessage = () => {
      if (!selectedUser.value || !newMessage.value.trim()) return;
      const message = {
        chatId: getChatId(),
        userId: getUser.value._id,
        text: newMessage.value,
        mediaUrl: null,
        mediaType: null,
      };
      console.log('Sending message:', message); // Log the message being sent
      socket.value.emit('sendMessage', message);
      selectedUser.value.messages.push({
        sender: 'You',
        text: newMessage.value,
      });
      newMessage.value = '';
      nextTick(scrollToBottom);
    };

    const initializeSocket = () => {
      const websocketUrl = process.env.VUE_APP_API_URL;
      socket.value = io(websocketUrl, {
        query: {
          token: localStorage.getItem('authToken'),
        },
      });

      socket.value.on('connect', () => {
        console.log('Socket connected'); // Log socket connection

        socket.value.on('loadOldMessages', (messages) => {
          console.log('Loading old messages:', messages); // Log old messages
          if (selectedUser.value) {
            selectedUser.value.messages = messages.map((msg) => ({
              sender: msg.userId === getUser.value._id ? 'You' : msg.username,
              text: msg.text,
            }));
            nextTick(scrollToBottom);
          }
        });

        socket.value.on('message', (message) => {
          console.log('Received message:', message); // Log received message
          const currentChatId = getChatId();
          console.log('Current chat ID:', currentChatId); // Log current chat ID
          console.log('Message chat ID:', message.chatId); // Log message chat ID
          if (selectedUser.value && currentChatId === message.chatId) {
            console.log('Adding message to selectedUser:', message); // Log message being added
            selectedUser.value.messages.push({
              sender: message.userId === getUser.value._id ? 'You' : message.username,
              text: message.text,
            });
            latestMessage.value = {
              sender: message.userId === getUser.value._id ? 'You' : message.username,
              text: message.text,
            }; // Update the latest message
            console.log('Updated latest message:', latestMessage.value); // Log the latest message
            nextTick(scrollToBottom);
          } else {
            console.log('Message received for a different chat or no selected user');
          }
        });
      });

      socket.value.on('disconnect', () => {
        console.log('Socket disconnected');
      });
    };

    const scrollToBottom = () => {
      nextTick(() => {
        if (chatMessagesRef.value) {
          chatMessagesRef.value.scrollTop = chatMessagesRef.value.scrollHeight;
        }
      });
    };

    const joinChat = () => {
      if (selectedUser.value && socket.value) {
        const chatId = getChatId();
        console.log('Joining chat with ID:', chatId); // Log chat ID being joined
        socket.value.emit('joinChat', {
          chatId,
          userId: getUser.value._id,
        });
      }
    };

    const getChatId = () => {
      if (!selectedUser.value || !getUser.value) return '';
      const requesterId = selectedUser.value.requester._id;
      const recipientId = selectedUser.value.recipient._id;
      const userId = getUser.value._id;

      const otherUserId = requesterId === userId ? recipientId : requesterId;
      const userIds = [userId, otherUserId].sort();
      return `${userIds[0]}-${userIds[1]}`;
    };

    const displayFriendName = (friend) => {
      if (!getUser.value) return '';
      return friend.requester._id === getUser.value._id ? friend.recipient.name : friend.requester.name;
    };

    onMounted(async () => {
      await fetchFriends();
      await getUserInfo();
      initializeSocket();
    });

    watch(selectedUser, async (newValue, oldValue) => {
      if (newValue !== oldValue) {
        await fetchChatMessages();
      }
    });

    return {
      selectedUser,
      newMessage,
      friends,
      chatMessagesRef,
      latestMessage, // Include latest message in the return
      selectUser,
      sendMessage,
      displayFriendName,
    };
  },
};
</script>

<style scoped>
.v-card {
  margin-bottom: 16px;
}

.chat-messages {
  height: 400px;
  overflow-y: auto;
  padding: 10px;
}

.message {
  display: flex;
  flex-direction: column;
  max-width: 70%;
  margin-bottom: 10px;
}

.my-message {
  margin-left: auto;
  align-self: flex-end;
  background-color: #dda7f3;
  border-radius: 10px 10px 0 10px;
  padding: 10px;
  width: fit-content;
  max-width: 80%;
  word-wrap: break-word;
}

.other-message {
  align-self: flex-start;
  background-color: #f1f0f0;
  border-radius: 10px 10px 10px 0;
  padding: 10px;
  width: fit-content;
  max-width: 80%;
  word-wrap: break-word;
}

.message-sender {
  font-size: 12px;
  font-weight: bold;
  margin-bottom: 3px;
}

.message-text {
  font-size: 14px;
}

.chat-input {
  flex: 1;
  padding: 10px;
  border-radius: 5px;
}

.active {
  background-color: #ddd;
}

.subtitle-1 {
  font-size: 16px;
}

.subtitle-2 {
  font-size: 14px;
}

.body-2 {
  font-size: 12px;
}
</style>
