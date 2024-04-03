<template>
  <div>
    <img v-if="!editMode" :src="getStatusIcon(user.status)" :alt="user.status" />
    <v-select v-if="editMode" :items="statuses" v-model="selectedStatus" @change="updateStatus" item-text="name" item-value="status"></v-select>
  </div>
</template>
  
  <script>
  import axios from 'axios';
  import OnlineIcon from '../../assets/icons/online.svg';
  import OfflineIcon from '../../assets/icons/offline.svg';
  import DoNotDisturbIcon from '../../assets/icons/disturb.svg';
  import AwayIcon from '../../assets/icons/away.svg';
  
  export default {
  props: ['user', 'editMode'],
  data() {
    return {
      selectedStatus: this.user.status,
      statuses: [
        { status: 'online', name: 'Online' },
        { status: 'offline', name: 'Offline' },
        { status: 'disturb', name: 'Do Not Disturb' },
        { status: 'away', name: 'Away' }
      ],
    };
  },
  methods: {
    getStatusIcon(status) {
        switch (status) {
          case 'online': return OnlineIcon;
          case 'offline': return OfflineIcon;
          case 'disturb': return DoNotDisturbIcon;
          case 'away': return AwayIcon;
          default: return OfflineIcon;
        }
      },
      async updateStatus() {
        try {
            await axios.post(`${process.env.VUE_APP_API_URL}/api/updateStatus`, { status: this.selectedStatus }, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` },
            });
            // Emit an event to notify parent component of the status update
            this.$emit('statusUpdated', this.selectedStatus);
        } catch (error) {
            console.error('Error updating status:', error);
        }
      }
    }
  };
  </script>
  