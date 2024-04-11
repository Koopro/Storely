<template>
  <Sidebar></Sidebar>
  <UserCard />
</template>

<script>
import Sidebar from '../components/sidebar/Sidebar.vue';
import UserCard from '../components/User/UserCard.vue';

export default {
  components: {
    UserCard,
    Sidebar
  },
}
</script>

