<template>
  <div class="chat-container">
    <div v-if="friends.length === 0" class="no-friends">
      <p>You don't have any friends yet. Please add friends in your profile.</p>
    </div>
    <div v-else class="users-container">
      <div
          v-for="(friend, index) in friends"
          :key="index"
          class="chat-user"
          :class="{ active: friend === selectedUser }"
          @click="selectUser(friend)"
      >
        {{ displayFriendName(friend) }}
      </div>
    </div>
    <div class="chat-content">
      <div v-if="selectedUser" class="chat-messages" ref="chatMessages">
        <div
            v-for="(message, index) in selectedUser.messages"
            :key="index"
            :class="['message', { 'my-message': message.sender === 'You', 'other-message': message.sender !== 'You' }]"
        >
          <div class="message-sender">{{ message.sender === 'You' ? 'You' : message.sender }}</div>
          <div class="message-text">{{ message.text }}</div>
        </div>
      </div>
      <div v-else class="no-user-selected">Please select a user to chat.</div>
      <div v-if="selectedUser" class="chat-input-container">
        <input
            v-model="newMessage"
            @keyup.enter="sendMessage"
            placeholder="Type a message..."
            class="chat-input"
        />
        <button @click="sendMessage"><v-icon>mdi-send</v-icon></button>
      </div>
    </div>
    <div v-if="latestMessage">
      <h1>{{ latestMessage.sender }}: {{ latestMessage.text }}</h1>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { ref, reactive, onMounted, nextTick, watch } from 'vue';
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

.chat-input-container {
  display: flex;
  padding: 10px;
  border-left: 1px solid #ccc;
}

.chat-input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-right: 10px;
}
</style>
