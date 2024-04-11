<template>
  <div class="chat-container">
    <div class="users-container">
      <div v-for="(user, index) in friends" :key="index" class="chat-user" :class="{ 'active': user === selectedUser }" @click="selectUser(user)">
        {{ user.name }}
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
        users: [
        { id: 1, name: 'User 1', messages: [] }, // Beispielbenutzer
        { id: 2, name: 'User 2', messages: [] }  // Beispielbenutzer
      ],
        selectedUser: null,
        newMessage: '',
        searchQuery: '',
        searchResults: [],
        friendRequestsSent: [], // Array zum Speichern der gesendeten Freundschaftsanfragen
        friends: [{ id: 2, name: 'User 2', messages: [] }, {id: 1, name: 'User 1', messages: [] }] 
      };
    },
    mounted() {
      this.fetchUserProfile();
    },
    methods: {
      async fetchUserProfile() {
        try {
          const { data } = await axios.get('https://api.storely.at/api/user/profile', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            },
          });
          this.user = data;
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      },
      selectUser(user) {
        this.selectedUser = user;
        this.$nextTick(() => {
          this.scrollToBottom
        });
      },
      sendMessage() {
        if (!this.selectedUser) return; // Überprüfe, ob ein Benutzer ausgewählt ist
        if (this.newMessage.trim() === '') return; // Keine leeren Nachrichten senden
        this.selectedUser.messages.push({
          sender: 'You', // Hier kannst du den Absender setzen, zum Beispiel den Benutzernamen
          text: this.newMessage
        });
        this.newMessage = ''; // Leere das Eingabefeld nach dem Senden der Nachricht
        this.scrollToBottom(); // Scrolle zum Ende des Chatfensters
      },
      scrollToBottom() {
        this.$refs.chatMessages.scrollTop = this.$refs.chatMessages.scrollHeight;
      },
      searchUsers() {
        if (this.searchQuery === '') {
          this.searchResults = [];
          return;
        }
        // Hier könntest du die Benutzerdaten aus einer API oder einer Datenbank abrufen und filtern
        // Hier ist ein Beispiel mit statischen Benutzerdaten
        this.searchResults = this.users.filter(user =>
          user.name.toLowerCase().includes(this.searchQuery.toLowerCase()) && !this.isFriend(user)
        );
      },
      sendFriendRequest(user) {
        this.friendRequestsSent.push(user.id); // Füge den Benutzer zur Liste der gesendeten Freundschaftsanfragen hinzu
        // Hier könntest du die Logik implementieren, um eine Freundschaftsanfrage an den ausgewählten Benutzer zu senden
        console.log('Freundschaftsanfrage an ' + user.name + ' gesendet.');
      },
      isFriendRequestSent(user) {
        return this.friendRequestsSent.includes(user.id); // Überprüfe, ob eine Freundschaftsanfrage an den Benutzer gesendet wurde
      },
      isFriend(user) {
        return this.friends.some(friend => friend.id === user.id); // Überprüfe, ob der Benutzer bereits ein Freund ist
      }
    }
  };
  </script>
  
  <style scoped>

  .chat-container {
    height: 35rem;
  }
  /* Styles for the user list */
  .users-container {
    width: auto; /* Adjust width of the user list */
    overflow-y: auto;
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
    background-color: #ddd; /* Change background color when user is selected */
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
    border-left: 1px solid #ccc; /* Left border for chat messages */
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
</style>