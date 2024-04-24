<template>
  <div class="calendar">
    <div class="header">
      <button @click="previousMonth">&lt;</button>
      <span>{{ currentMonth }}</span>
      <button @click="nextMonth">&gt;</button>
    </div>
    <div class="weekdays">
      <div v-for="day in weekdays" :key="day" class="weekday">{{ day }}</div>
    </div>
    <div class="days">
      <div v-for="(day, index) in visibleDays" :key="index" class="day" :class="{ 'has-event': hasEvent(day) }" @click="showEventPopup(day)">
        <span>{{ day }}</span>
        <div v-if="hasEvent(day)" class="event" v-for="event in eventsOnDay(day)" :key="event.name">{{ formatEventName(event.name) }}</div>
      </div>
    </div>
    <form @submit.prevent="addEvent" class="add-event-form">
      <label for="eventDate">Datum:</label>
      <input type="date" id="eventDate" v-model="newEvent.date" required>
      <label for="eventName">Name des Ereignisses:</label>
      <input type="text" id="eventName" v-model="newEvent.name" required>
      <input type="checkbox" id="hasTime" v-model="newEvent.hasTime">
      <label for="hasTime">Zeit hinzufügen</label>
      <input v-if="newEvent.hasTime" type="time" id="eventTime" v-model="newEvent.time" required>
      <input type="checkbox" id="hasLocation" v-model="newEvent.hasLocation">
      <label for="hasLocation">Ort hinzufügen</label>
      <input v-if="newEvent.hasLocation" type="text" id="eventLocation" v-model="newEvent.location" required>
      <button type="submit">Ereignis hinzufügen</button>
    </form>
    <div v-if="selectedEvent" class="popup-overlay" @click="closeEventPopupOutside">
      <div class="popup" ref="popup">
        <template v-for="event in selectedEvent">
          <p><strong>Datum:</strong> {{ event.date }}</p>
          <p><strong>Ereignis:</strong> {{ event.name }}</p>
          <p v-if="event.time"><strong>Zeit:</strong> {{ event.time }}</p>
          <p v-if="event.location"><strong>Ort:</strong> {{ event.location }}</p>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Calendar',
  data() {
    return {
      currentDate: new Date(), // Aktuelles Datum initialisieren
      weekdays: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'], // Tage der Woche
      events: [],
      newEvent: {
        date: '',
        name: '',
        hasTime: false,
        time: '',
        hasLocation: false,
        location: ''
      },
      selectedEvent: null,
    };
  },
  computed: {
    currentMonth() {
      return this.currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    },
    daysInMonth() {
      const firstDayOfMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
      const lastDayOfMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
      return lastDayOfMonth.getDate();
    },
    startDayOfWeek() {
      const firstDayOfMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
      return firstDayOfMonth.getDay();
    },
    visibleDays() {
      const days = [];

      // Füge leere Zellen für Tage vor dem ersten Tag des Monats hinzu
      for (let i = 0; i < this.startDayOfWeek; i++) {
        days.push('');
      }

      // Füge Tage des Monats hinzu
      for (let i = 1; i <= this.daysInMonth; i++) {
        days.push(i);
      }

      return days;
    },
  },
  methods: {
    previousMonth() {
      const prevMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
      this.currentDate = prevMonth;
    },
    nextMonth() {
      const nextMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
      this.currentDate = nextMonth;
    },
    hasEvent(day) {
      const eventDate = this.formatDate(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);
      return this.events.some(event => event.date === eventDate);
    },
    eventsOnDay(day) {
      const eventDate = this.formatDate(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);
      return this.events.filter(event => event.date === eventDate);
    },
    addEvent() {
      if (this.newEvent.date && this.newEvent.name) {
        const event = {
          date: this.newEvent.date,
          name: this.newEvent.name
        };
        if (this.newEvent.hasTime) {
          event.time = this.newEvent.time;
        }
        if (this.newEvent.hasLocation) {
          event.location = this.newEvent.location;
        }
        this.events.push(event);
        this.resetForm();
      }
    },
    resetForm() {
      this.newEvent.date = '';
      this.newEvent.name = '';
      this.newEvent.hasTime = false;
      this.newEvent.time = '';
      this.newEvent.hasLocation = false;
      this.newEvent.location = '';
    },
    formatDate(year, month, day) {
      const paddedMonth = month < 9 ? `0${month + 1}` : `${month + 1}`;
      const paddedDay = day < 10 ? `0${day}` : `${day}`;
      return `${year}-${paddedMonth}-${paddedDay}`;
    },
    showEventPopup(day) {
      const eventDate = this.formatDate(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);
      const events = this.events.filter(event => event.date === eventDate);
      if (events.length > 0) {
        this.selectedEvent = events;
      } else {
        this.selectedEvent = null;
      }
    },
    closeEventPopup() {
      this.selectedEvent = null;
    },
    closeEventPopupOutside(event) {
      // Überprüfen, ob das geklickte Element nicht das Popup oder dessen Inhalt ist
      if (!this.$refs.popup.contains(event.target)) {
        this.selectedEvent = null;
      }
    },
    formatEventName(name) {
      return name.length > 4 ? name.substring(0, 4) + '...' : name;
    }
  },
};
</script>

<style scoped>
/* Stildefinitionen hier einfügen */
</style>


<style scoped>
.calendar {
  width: auto;
  max-width: 600px;
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 5px;
  background-color: #f9f9f9;
  color: black;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-gap: 5px;
  margin-bottom: 10px;
  color: black;
}

.weekday {
  padding: 10px;
  text-align: center;
  background-color: #e0e0e0;
}

.days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-gap: 5px;
}

.day {
  position: relative;
  padding: 10px;
  border: 1px solid #ccc;
  text-align: center;
  background-color: #fff;
  cursor: pointer;
  color: black;
}

.has-event {
  background-color: #f0f0f0;
}

.event {
  padding: 5px;
  margin-bottom: 5px;
  background-color: #ffc107;
  color: black;
}

.add-event-form {
  margin-top: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
  color: #333;
}

input {
  margin-bottom: 10px;
  padding: 5px;
  width: 100%;
}

button {
  display: block;
  padding: 8px 15px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

button:active {
  background-color: #004499;
}

.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.popup {
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  max-width: 80%;
}

.close-button {
  position: absolute;
  top: 5px;
  right: 5px;
  font-size: 20px;
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
  color: #333;
}
</style>
