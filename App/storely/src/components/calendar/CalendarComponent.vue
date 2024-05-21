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
          <form @submit.prevent="addEvent" @submit="closeAddEventPopup">
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
            <input v-if="newEvent.hasLocation" type="text" id="eventLocation" v-model="newEvent.location" required>
            <button type="submit">Add Event</button>
          </form>
        </div>
      </div>
      <div v-if="selectedEvent" class="popup-overlay" @click="closeEventPopupOutside">
        <div class="popup" ref="eventPopup">
          <h2>Events on {{ selectedEvent[0].date }}</h2>
          <br>
          <ul>
            <li v-for="event in selectedEvent" :key="event.name">
              <strong>{{ event.name }}</strong>
              <br v-if="event.formattedTime || event.formattedLocation">
              <span v-if="event.formattedTime"><strong>Time: </strong>{{ event.formattedTime }}</span>
              <br><span v-if="event.formattedLocation"><strong>Location: </strong>{{ event.formattedLocation }}</span><br>
              <!-- Button für den Event Delete -->
              <span @click="deleteEvent(event)" class="mdi mdi-trash-can-outline" style="cursor: pointer"></span>
            </li>
          </ul>
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
  
        // Get the first day of the month
        const firstDayOfMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
  
        // Get the day of the week for the first day of the month (0 = Sunday, 1 = Monday,..., 6 = Saturday)
        let startDayOfWeek = firstDayOfMonth.getDay();
  
        // Adjust the start day of the week if necessary (Sunday should be 6, Monday should be 0,..., Saturday should be 5)
        startDayOfWeek = startDayOfWeek === 0? 6 : startDayOfWeek - 1;
  
        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startDayOfWeek; i++) {
          days.push('');
        }
  
        // Add days of the month
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
          this.selectedEvent = events;
          this.selectedEvent.forEach(event => {
            event.formattedTime = this.formatTime(event.time);
            event.formattedLocation = this.formatLocation(event.location);
          });
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
      showAddEventPopup() {
        this.addEventPopupVisible = true;
      },
      closeAddEventPopup() {
        this.addEventPopupVisible = false;
      },
      closeAddEventPopupOutside(event) {
        if (!this.$refs.addEventPopup.contains(event.target)) {
          this.addEventPopupVisible = false;
        }
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
          this.closeAddEventPopup();
        }
      },
      deleteEvent(eventToDelete) {
        console.log('Deleting event:', eventToDelete);
        console.log('Events before deletion:', this.events);

        this.events = this.events.filter(event => event !== eventToDelete);

        console.log('Events after deletion:', this.events);

        this.selectedEvent = null; // Schließen Sie das Popup nach dem Löschen des Ereignisses
      },
      resetForm() {
        this.newEvent.date = '';
        this.newEvent.name = '';
        this.newEvent.hasTime = false;
        this.newEvent.time = '';
        this.newEvent.hasLocation = false;
        this.newEvent.location = '';
      },
      formatEventName(name) {
        return name.length > 4 ? name.substring(0, 4) + '...' : name;
      },
    },
  };
  </script>
    <style scoped>
    /* Stildefinitionen hier einfügen */
    </style>
    
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
    
    .add-event-popup{
        margin-top: 20px;
    }
    
    input {
        margin-bottom: 10px;
        padding: 5px;
        width: 100%;
        border: 1px solid #ccc; 
        border-radius: 4px; /* Optional: Add border radius for rounded corners */
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
    
    .checkbox-wrapper {
        display: flex;
        align-items: center;
        margin-bottom: 5px; /* Abstand zwischen den Kontrollkästchen und dem Text */
    }
    
    .checkbox-wrapper input[type="checkbox"] {
        margin-right: 5px; /* Abstand zwischen dem Kontrollkästchen und dem Text */
    }

    .mdi{
      font-size: 24px;
      color: red;
    }
    </style> 