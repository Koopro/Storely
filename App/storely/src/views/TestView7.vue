<template>
    <div>
        <v-container>
          <!-- Sidebar -->
          <Sidebar />
    
          <!-- Main Content Row -->
          <!-- Right Column for Chat Card -->
          <v-col>
            <v-card class="chat-card">
              <v-card-title class="text-h5">Chat</v-card-title>
              <v-card-text>
                <Chat />
              </v-card-text>
            </v-card>
          </v-col>
          <Friends />
        </v-container>
        
    </div>

</template>

<script>
  import Sidebar from '../components/sidebar/Sidebar.vue';
  import Chat from '../components/TestComponents/ChatComponent.vue';
  import Friends from '../components/friends/FriendsCard.vue';
  
  export default {
    components: {
      Sidebar,
      Chat,
      Friends,
    },
  };
</script>

<style scoped>
.suptitle1 {
  font-weight: bold;
}
</style>