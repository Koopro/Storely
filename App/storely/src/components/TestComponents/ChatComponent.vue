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
        <v-avatar :src="getFriendPfp(friend)"></v-avatar>
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
      </div>
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

    const fetchFriends = async () => {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/api/friends/list`, {
          headers: {
            Authorization: authToken,
          },
        });
        friends.value = response.data;
        console.log('Friends list fetched:', friends.value);
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
        console.log('User info fetched:', getUser.value);
      } catch (error) {
        console.error('Failed to fetch user info:', error);
      }
    };

    const selectUser = async (user) => {
      console.log('User selected:', user);
      selectedUser.value = reactive({ ...user, messages: [] });
      console.log('Selected user after setting reactive:', selectedUser.value);
      await fetchChatMessages();
      nextTick(scrollToBottom);
      joinChat();
    };

    const fetchChatMessages = async () => {
      if (!selectedUser.value) return;
      const chatId = getChatId();
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
        console.log('Chat messages fetched:', selectedUser.value.messages);
      } catch (error) {
        console.error('Error fetching chat messages:', error);
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
      console.log('Sending message:', message);
      socket.value.emit('sendMessage', message);
      selectedUser.value.messages.push({
        sender: 'You',
        text: newMessage.value,
      });
      console.log('Message pushed locally:', selectedUser.value.messages);
      newMessage.value = '';
      nextTick(scrollToBottom);
    };

    const scrollToBottom = () => {
      if (chatMessagesRef.value) {
        chatMessagesRef.value.scrollTop = chatMessagesRef.value.scrollHeight;
      }
    };

    const setupSocket = () => {
      socket.value = io(`${process.env.VUE_APP_API_URL}`, {
        query: {
          token: localStorage.getItem('authToken'),
        },
      });
      console.log('Socket initialized:', socket.value);

      socket.value.on('loadOldMessages', (messages) => {
        console.log('Loaded old messages:', messages);
        if (selectedUser.value) {
          selectedUser.value.messages = messages.map((msg) => ({
            sender: msg.userId === getUser.value._id ? 'You' : msg.username,
            text: msg.text,
          }));
          console.log('Old messages set for selected user:', selectedUser.value.messages);
          nextTick(scrollToBottom);
        }
      });

      socket.value.on('message', (message) => {
        console.log('Received message:', message);
        const messageChatId = generateChatIdFromMessage(message);
        const currentChatId = getChatId();
        console.log(`Generated chat ID for comparison: ${currentChatId}`);
        console.log('Message chat ID:', messageChatId);
        if (selectedUser.value && currentChatId === messageChatId) {
          selectedUser.value.messages.push({
            sender: message.userId === getUser.value._id ? 'You' : message.username,
            text: message.text,
          });
          console.log('Message pushed to selected user messages:', selectedUser.value.messages);
          nextTick(scrollToBottom);
        } else {
          console.log('Message received for a different chat or no selected user');
          console.log('Current selected user:', selectedUser.value);
        }
      });
    };

    const joinChat = () => {
      if (selectedUser.value) {
        const chatId = getChatId();
        console.log('Joining chat:', chatId);
        socket.value.emit('joinChat', {
          chatId,
          userId: getUser.value._id,
        });
      }
    };

    const getChatId = () => {
      if (!selectedUser.value || !getUser.value) return '';
      const userIds = [
        getUser.value._id,
        selectedUser.value.requester._id === getUser.value._id
            ? selectedUser.value.recipient._id
            : selectedUser.value.requester._id
      ].sort();
      const chatId = `${userIds[0]}-${userIds[1]}`;
      console.log('Generated chat ID:', chatId);
      return chatId;
    };

    const generateChatIdFromMessage = (message) => {
      const userIds = [
        message.userId,
        getUser.value._id === message.userId ? selectedUser.value.recipient._id : getUser.value._id
      ].sort();
      const chatId = `${userIds[0]}-${userIds[1]}`;
      return chatId;
    };

    const getFriendPfp = (friend) => {
      if (!getUser.value) return null;
      const friendProfile =
          friend.requester._id === getUser.value._id ? friend.recipient : friend.requester;
      return friendProfile.profileImageUrl
          ? `${process.env.VUE_APP_API_URL}${friendProfile.profileImageUrl}`
          : null;
    };

    const displayFriendName = (friend) => {
      return (
          getUser.value &&
          (friend.requester._id === getUser.value._id ? friend.recipient.name : friend.requester.name)
      );
    };

    onMounted(async () => {
      await fetchFriends();
      await getUserInfo();
      setupSocket();
    });

    watch(selectedUser, (newVal, oldVal) => {
      console.log('selectedUser updated:', newVal);
    });

    watch(
        () => selectedUser.value?.messages,
        (newVal, oldVal) => {
          console.log('selectedUser.messages updated:', newVal);
        },
        { deep: true }
    );

    return {
      selectedUser,
      newMessage,
      friends,
      getUser,
      selectUser,
      sendMessage,
      getFriendPfp,
      displayFriendName,
      chatMessagesRef,
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
  align-self: flex-end;
  background-color: #dcf8c6;
  border-radius: 10px 10px 0 10px;
  padding: 10px;
}
.other-message {
  align-self: flex-start;
  background-color: #f1f0f0;
  border-radius: 10px 10px 10px 0;
  padding: 10px;
}
.message-sender {
  font-weight: bold;
  margin-bottom: 5px;
}
.message-text {
  word-wrap: break-word;
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
  height: 30rem;
  overflow-y: auto;
  padding: 10px;
}
.chat-input-container {
  display: flex;
  align-items: center;
  padding: 10px;
  border-top: 1px solid #ccc;
  border-left: 1px solid #ccc;
}
.chat-input {
  flex: 1;
  padding: 10px;
  border: none;
  outline: none;
}
@media (max-width: 450px) {
  .no-friends {
    max-width: 100px;
  }
  .chat-input-container {
    flex-direction: column;
  }
}
</style>




