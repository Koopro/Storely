<template>
    <div>
      <img :src="getStatusIcon(user.status)" :alt="user.status" />
      <v-select v-if="editMode" :items="statuses" v-model="selectedStatus" @change="updateStatus"></v-select>
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
        statuses: ['online', 'offline', 'disturb', 'away'],
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
            await axios.post('http://localhost:3000/api/updateStatus', { status: this.selectedStatus }, {
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
  