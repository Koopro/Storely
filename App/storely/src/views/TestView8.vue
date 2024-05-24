<template>
  <div id="app">
    <h1>Datum und Zeit Eingabe</h1>
    <div class="input-container">
      <label for="date">Datum:</label>
      <input type="date" v-model="date" id="date">
    </div>
    <div class="input-container">
      <label for="time">Zeit:</label>
      <input type="time" v-model="time" id="time">
    </div>
    <button @click="checkDateTime">Prüfen</button>
    <div v-if="result !== null" class="result">
      <p v-if="result">Die angegebene Datum und Zeit liegt in der Vergangenheit.</p>
      <p v-else>Die angegebene Datum und Zeit liegt in der Zukunft oder ist aktuell.</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      date: '',
      time: '',
      result: null
    };
  },
  methods: {
    checkDateTime() {
      if (this.date && this.time) {
        console.log('Date:', this.date, ' and Time:', this.time);
        const inputDateTime = new Date(`${this.date}T${this.time}`);
        const now = new Date();
        this.result = inputDateTime < now;
      } else {
        alert('Bitte Datum und Zeit eingeben');
      }
    }
  }
};
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  margin-top: 60px;
  background-color: white;
}

.input-container {
  margin-bottom: 20px;
}

label {
  margin-right: 10px;
}

button {
  padding: 10px 20px;
  background-color: #42b983;
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
}

button:hover {
  background-color: #389e6f;
}

.result {
  margin-top: 20px;
  font-size: 1.2em;
}
</style>
