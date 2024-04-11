<template>
    <div>
      <v-container>
        <!-- Sidebar -->
        <Sidebar />
  
        <!-- Main Content Row -->
        <v-row>
  
          <!-- Left Column for Todo and Calendar Cards stacked -->
          <v-col cols="12" md="7">
            <!-- Todo Card -->
            <v-card class="todo-card">
              <v-card-title class="text-h5">To-Do</v-card-title>
              <v-card-text>
                <!-- Todo content here -->
              </v-card-text>
            </v-card>
            <!-- Calendar Card -->
            <v-card class="calendar-card">
              <v-card-title class="text-h5">Calendar</v-card-title>
              <v-card-text>
                <!-- Calendar content here -->
              </v-card-text>
            </v-card>
          </v-col>
  
          <!-- Right Column for Chat Card -->
          <v-col cols="12" md="5">
            <v-card class="chat-card">
              <v-card-title class="text-h5">Chat</v-card-title>
              <v-card-text>
                <Chat />
              </v-card-text>
            </v-card>
          </v-col>
  
        </v-row>
      </v-container>
    </div>
  </template>
  
  <script>
  import Sidebar from '../components/sidebar/Sidebar.vue';
  import Chat from '../components/TestComponents/ChatComponent.vue';
  
  export default {
    components: {
      Sidebar,
      Chat,
    },
  };
  </script>
  
  <style scoped>
  /* Styles for Todo, Chat, and Calendar Cards */
  .todo-card,
  .calendar-card,
  .chat-card {
    margin-bottom: 20px;
    border-radius: 8px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  }
  
  .chat-card {
    height: calc(100vh - 40px); /* Adjust height as needed */
    max-height: none;
  }

  .todo-card,
  .calendar-card {
    height: 47.2%; /* Adjust height as needed */
    max-height: none;
  }

  @media (max-width: 960px) { /* Vuetify breakpoint for MD and smaller */
    .todo-card,
    .calendar-card,
    .chat-card {
      height: auto; /* Auto height for smaller devices */
      margin-left: 60px;
    }
  }
  
  </style>