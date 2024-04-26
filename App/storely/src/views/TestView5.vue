<template>
  <div>
      <v-container>
        <!-- Sidebar -->
        <Sidebar />
  
        <!-- Main Content Row -->
        <!-- Right Column for Chat Card -->
        <v-col>
          <v-card class="chat-card">
            <v-card-title class="text-h5">Calendar</v-card-title>
            <v-card-text>
              <Calendar />
            </v-card-text>
          </v-card>
        </v-col>
      </v-container>
      
  </div>

</template>

<script>
import Sidebar from '../components/sidebar/Sidebar.vue';
import Calendar from '../components/TestComponents/CalendarComponent.vue';

export default {
  components: {
    Sidebar,
    Calendar,
  },
};
</script>

<style scoped>
.suptitle1 {
font-weight: bold;
}
</style>