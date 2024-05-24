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
    <div class="add-event-popup">
      <button @click="showAddEventPopup">Add Event</button>
    </div>
    <div v-if="addEventPopupVisible" class="popup-overlay" @click="closeAddEventPopupOutside">
      <div class="popup" ref="addEventPopup">
        <h2>Add Event</h2>
        <form @submit.prevent="addEvent">
          <label for="eventDate">Date:</label>
          <input type="date" id="eventDate" v-model="newEvent.date" required>
          <label for="eventName">Name of the Event:</label>
          <input type="text" id="eventName" v-model="newEvent.name" required>
          <div class="checkbox-wrapper">
            <label for="hasTime">Time</label>
            <input type="checkbox" id="hasTime" v-model="newEvent.hasTime">
          </div>
          <input v-if="newEvent.hasTime" type="time" id="eventTime" v-model="newEvent.time" required>
          <div class="checkbox-wrapper">
            <label for="hasLocation">Location</label>
            <input type="checkbox" id="hasLocation" v-model="newEvent.hasLocation">
          </div>
          <input v-if="newEvent.hasLocation" type="text" id="eventLocation" v-model="newEvent.location" @input="searchPlaces(newEvent.location)" required>
          <ul v-if="places.length > 0" class="places-list">
            <li v-for="place in places" :key="place.place_id" @click="selectPlace(place)">{{ place.display_name }}</li>
          </ul>
          <button type="submit">Add Event</button>
        </form>
      </div>
    </div>

    <div v-if="selectedEvent" class="popup-overlay" @click="closeEventPopupOutside">
      <div class="popup" ref="eventPopup">
        <h2>Events on {{ selectedEvent[0].date }}</h2>
        <ul>
          <li v-for="event in selectedEvent" :key="event.name">
            <strong>{{ event.name }}</strong>
            <br v-if="event.time || event.location">
            <span v-if="event.time"><strong>Time: </strong>{{ event.time }}</span>
            <br>
            <span v-if="event.location"><strong>Location: </strong>{{ event.location }}</span>
            <br>
            <span @click="deleteEvent(event)" class="mdi mdi-trash-can-outline" style="cursor: pointer"></span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Calendar',
  data() {
    return {
      currentDate: new Date(),
      weekdays: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'],
      events: [],
      addEventPopupVisible: false,
      newEvent: {
        date: '',
        name: '',
        hasTime: false,
        time: '',
        hasLocation: false,
        location: ''
      },
      selectedEvent: null,
      places: []
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
      const firstDayOfMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
      let startDayOfWeek = firstDayOfMonth.getDay();
      startDayOfWeek = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;
      for (let i = 0; i < startDayOfWeek; i++) {
        days.push('');
      }
      const daysInMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0).getDate();
      for (let i = 1; i <= daysInMonth; i++) {
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
    showEventPopup(day) {
      const eventDate = this.formatDate(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);
      const events = this.events.filter(event => event.date === eventDate);
      if (events.length > 0) {
        this.selectedEvent = events.map(event => ({
          ...event,
          formattedTime: this.formatTime(event.time),
          formattedLocation: this.formatLocation(event.location)
        }));
      } else {
        this.selectedEvent = null;
      }
    },
    closeEventPopup() {
      this.selectedEvent = null;
    },
    closeEventPopupOutside(event) {
      if (this.selectedEvent && this.$refs.eventPopup && !this.$refs.eventPopup.contains(event.target)) {
        this.selectedEvent = null;
      }
    },
    formatDate(year, month, day) {
      const paddedMonth = month < 9 ? `0${month + 1}` : `${month + 1}`;
      const paddedDay = day < 10 ? `0${day}` : `${day}`;
      return `${year}-${paddedMonth}-${paddedDay}`;
    },
    formatTime(time) {
      if (!time) return '';
      const [hours, minutes] = time.split(':');
      return `${hours}:${minutes}`;
    },
    formatLocation(location) {
      if (!location) return '';
      return location;
    },
    formatEventName(name) {
      return name.length > 10 ? `${name.slice(0, 10)}...` : name;
    },
    showAddEventPopup() {
      this.addEventPopupVisible = true;
      this.resetForm();  // Formular zurücksetzen, wenn Popup angezeigt wird
    },
    closeAddEventPopup() {
      this.addEventPopupVisible = false;
    },
    closeAddEventPopupOutside(event) {
      // Überprüfen, ob der Klick innerhalb der places-list oder des addEventPopup Elements aufgetreten ist
      if (this.$refs.addEventPopup && !this.$refs.addEventPopup.contains(event.target) && !event.target.closest('.places-list')) {
        this.addEventPopupVisible = false;
      }
    },
    async addEvent() {
      if (this.newEvent.date && this.newEvent.name) {
        const event = {
          date: this.newEvent.date,
          name: this.newEvent.name
        };
        if (this.newEvent.hasTime) {
          event.time = this.newEvent.time;
        }
        if (this.newEvent.hasLocation) {
          const locationData = this.places.find(place => place.display_name === this.newEvent.location);
          event.location = locationData ? locationData.display_name : this.newEvent.location;
        }
        this.events.push(event);
        this.resetForm();
        this.addEventPopupVisible = false;
        this.places = [];
      }
    },
    resetForm() {
      this.newEvent = {
        date: '',
        name: '',
        hasTime: false,
        time: '',
        hasLocation: false,
        location: ''
      };
      this.places = [];
    },
    async searchPlaces(query) {
      try {
        const response = await axios.get(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=5`);
        this.places = response.data;
      } catch (error) {
        console.error('Error searching for places:', error);
        this.places = [];
      }
    },
    selectPlace(place) {
      this.newEvent.location = place.display_name;
      this.places = [];
    },
    deleteEvent(eventToDelete) {
      this.events = this.events.filter(event => event !== eventToDelete);
      this.closeEventPopup();
    }
  }
};
</script>

<style scoped>
.calendar {
  width: auto;
  border: 1px solid #ccc;
  padding: 10px;
  margin: 10px auto;
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
  background-color: #ccc;
  color: black;
  border-radius: 10px;
}

.add-event-popup {
  margin-top: 20px;
  width: auto;
}

input {
  margin-bottom: 10px;
  padding: 5px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 4px;
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
  background-color: #41474c;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #778390;
}

button:active {
  background-color: #778390;
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
  width: 200%;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.checkbox-wrapper input[type="checkbox"] {
  margin-right: 5px;
}

.places-list {
  background: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  max-height: 150px;
  overflow-y: auto;
  position: absolute;
  width: 77.5%;
  z-index: 1;
  list-style: none;
  padding: 0;
  margin: 0;
}

.places-list li {
  cursor: pointer;
  padding: 8px;
}

.places-list li:hover {
  background: #eee;
}

.mdi {
  font-size: 24px;
  color: red;
}


</style>