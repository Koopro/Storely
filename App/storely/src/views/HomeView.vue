<template>
  <div id="content">
    <v-container>
      <!-- Sidebar -->
      <Sidebar />

      <!-- Main Content Row -->
      <v-row>

        <!-- Left Column for Todo and Calendar Cards stacked -->
        <v-col cols="12" md="7">
          <!-- Todo Card -->

          <v-card class="todo-card">
            <a href="/todo" class="link">
            <v-card-title class="text-h5">To-Do</v-card-title>
            <v-card-text>
              <p>Hier Klicken um auf die ToDo zu gelangen.</p>
            </v-card-text></a>
          </v-card>
          <!-- Calendar Card -->
          <v-card class="calendar-card">
            <a href="/calendar" class="link">
            <v-card-title class="text-h5">Calendar</v-card-title>
            </a>
            <v-card-text>
              <Calendar />
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Right Column for Chat Card -->
        <v-col cols="12" md="5">
          <v-card class="chat-card">
            <a href="/chat" class="link">
            <v-card-title class="text-h5">Chat</v-card-title>
            </a>
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
import Calendar from '../components/calendar/CalendarComponent.vue';

export default {
  components: {
    Sidebar,
    Chat,
    Calendar,
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

/* Hide vertical scrollbar */
.chat-card {
  height: auto; /* Adjust height as needed */
  max-height: none;
}

.todo-card,
.calendar-card {
  height: auto; /* Adjust height as needed */
  max-height: none;
}

.link{
  text-decoration: none;
  color: black;
}

/* Media query for devices with a maximum width of 960px (e.g., tablets and smaller laptops) */
@media (max-width: 960px) {
  .todo-card,
  .calendar-card,
  .chat-card {
    height: auto; /* Auto height for smaller devices */
    margin-left: 60px;
  }
}
</style>
