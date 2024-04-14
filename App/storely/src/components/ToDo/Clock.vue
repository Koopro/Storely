<template>
  <h1 class="Timer">{{ time }}</h1>
</template>

<script>
export default {
  data() {
  return {
    time: this.getTime(),
  };
},
  mounted() {
    setInterval(() => {
      this.time = this.getTime();
    }, 1000);
  },
  methods: {
    getTime() {
      const now = new Date();
      const hours = this.padZero(now.getHours());
      const minutes = this.padZero(now.getMinutes());
      const seconds = this.padZero(now.getSeconds());
      return `${hours}:${minutes}:${seconds}`;
    },
    padZero(value) {
      return value < 10 ? '0' + value : value;
    }, 

  }
};
</script>
  
  
  <style scoped>
  .Timer {
    width: auto;
    height: auto;
    position: absolute;
    display: flex;
    justify-content: center;
    align-content: center;
    flex-wrap: nowrap;
    right: 20px;
    top: 50%;
    transform: translate(0, -50%);
    z-index: 999;
  }


  </style>
  