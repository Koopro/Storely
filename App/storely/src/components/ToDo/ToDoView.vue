  <template>
  <Sidebar @click="handleDarkMode" />
  <div class="top" :class="{ 'dark-top': isDarkMode }">
    <Clock class="clock" :class="{ 'clock-dark': isDarkMode }"/>
  </div>
  <div class="menu" :class="{ 'dark-menu': isDarkMode }">
    <div class="inner-menu">
      <ul>
        <!-- Automatisch Listenpunkte generieren basierend auf verfügbaren Listen -->
        <li v-for="list in lists" :key="list._id" :style="{ backgroundColor: list.color }" :class="{ 'dark-list': isDarkMode }">
          {{ list.name }}
          <i class="fas fa-trash" @click="promptDelete(list._id, list.password)"></i>
        </li>
      </ul>
    </div>
    <button class="add-list-button" :class="{ 'add-list-button-dark': isDarkMode }" @click="openPopup">Liste Hinzufügen</button>
  </div>
  <div class="background-white" :class="{ 'background-dark': isDarkMode }"></div>
  <div class="popup-list-wrap">
    <div class="popup-add-list" :class="{ 'popup-add-list-DARK': isDarkMode }">
      <h1 class="popup-add-list-header">Wie soll die neue Liste heißen?</h1>
      <input type="text" class="popup-add-list-input" placeholder="Listenname" ref="listNameInput" :class="{ 'popup-add-list-input-DARK': isDarkMode }">
      <input type="text" class="popup-add-list-password" placeholder="Passwort" v-model="listPassword" ref="listPasswordInput" :class="{ 'popup-add-list-input-DARK': isDarkMode }">
      <input type="color" class="popup-add-list-color" v-model="listColor">
    <button class="popup-add-list-button" :class="{ 'popup-add-list-button-DARK': isDarkMode }" @click="addList">Hinzufügen</button>
    </div>
  </div>
  <div class="popup-background" :class="{ 'popup-background-DARK': isDarkMode }"></div>
</template>

<script>
import axios from 'axios';
import Sidebar from '../sidebar/Sidebar.vue';
import Clock from './Clock.vue';

export default {
  components: {
    Sidebar, 
    Clock
  },
  data() {
  return {
    isDarkMode: false,
    lists: [],
    listPassword: '',  // Speichern des Passworts für die Liste
    listColor: '#ffffff',  // Standardfarbe, falls keine gewählt wird
    authToken: `Bearer ${localStorage.getItem('authToken')}`,
    apiUrl: `${process.env.VUE_APP_API_URL}/api`

  };
},

  created() {
    this.handleDarkMode();
    this.fetchLists();
  },
  methods: {
    // Dark Mode
    handleDarkMode() {
      const storedDarkMode = localStorage.getItem('darkMode');
      this.isDarkMode = storedDarkMode === 'true';
    },
    // List
    openPopup() {
      document.querySelector('.popup-list-wrap').style.display = 'block';
      this.$refs.listNameInput.focus();
      document.querySelector('.popup-background').style.display = 'block';
    },
    handleError(error) {
      console.error("Ein Fehler ist aufgetreten:", error);
    },
    async addList() {
      const listName = this.$refs.listNameInput.value.trim();
      const listPassword = this.listPassword.trim();
      const listColor = this.listColor;
      if (listName === "" || listPassword === "") {
        alert("Bitte gib einen Listennamen und Passwort ein.");
      } else {
        try {
          const response = await axios.post(`${this.apiUrl}/todo/lists`, {
            method: 'POST',
            headers: { 'Authorization': this.authToken },
          },
          {
            name: listName,
            password: listPassword,
            color: listColor
          });
          this.lists.push(response.data);
          this.$refs.listNameInput.value = "";
          this.listPassword = "";  // Reset
          this.listColor = "#ffffff";  // Reset auf Standardfarbe
          this.closePopup();
        } catch (error) {
          this.handleError(error.message);
        }
      }
    },

    async fetchLists() {
      try {
        const response = await axios.get(`${this.apiUrl}/todo/lists` ,{
          method: 'GET',
          headers: {'Authorization': this.authToken},
        });
        this.lists = response.data;
      } catch (error) {
        this.handleError(error.message);
      }
    },

    promptDelete(listId, expectedPassword) {
      const password = prompt("Bitte geben Sie das Passwort für diese Liste ein:");
      if (password === expectedPassword) {
        this.deleteList(listId);
      } else {
        alert("Falsches Passwort, Liste wurde nicht gelöscht.");
      }
    },

    async deleteList(listId) {
      try {
        await axios.delete(`${this.apiUrl}/todo/lists/${listId}`,{
          method: 'DELETE',
          headers: {'Authorization': this.authToken},
        });
        this.lists = this.lists.filter(list => list._id !== listId);
      } catch (error) {
        this.handleError(error.message);
      }
    },
    closePopup() {
      document.querySelector('.popup-list-wrap').style.display = 'none';
      document.querySelector('.popup-background').style.display = 'none';
    },
    // Clock
  }
};
</script>
  
  
  <style scoped>
  * {
    margin: 0;
    padding: 0;
  }

  .background-white {
    background-color: white;
    position: absolute; 
    z-index: 0;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
  }

  .background-dark {
    background-color: #9f9f9f;
  }
  
  .top {
    position: fixed;
    top: 0;
    left: 0;
    height: 104px;
    width: 100%;
    background-color: #3a3a3a; /* Standard color */
    z-index: 999;
    transition: background-color 0.3s; /* Smooth transition for background color */
  }
  

  .dark-top {
    background-color: #000000; /* Dark mode color for top bar */
  }
  
  .menu {
    position: fixed;
    display: flex;
    justify-content: center;
    z-index: 1;
    height: 100%;
    width: 425px;
    background-color: #aeaeae; /* Standard color */
    transition: background-color 0.3s; /* Smooth transition for background color */
  }


  .inner-menu {
    width: 100%;
    height: 100%;
    margin-top: 110px;
    margin: 110px 20% 0 20%;
  }

  
  /* Styles for dark mode */
  .dark-menu {
    background-color: #414141; /* Dark mode color for menu */
  }
  
  .add-list-button {
    position: fixed;
    width: 200px;
    height: 40px;
    bottom: 30px;
    z-index: 3;
    border-radius: 10px;
    background-color: #ffffff;
    color: rgb(0, 0, 0);
  }

  .add-list-button-dark {
    background: #000000;
    color: #ffffff;
  }

  .popup-background {
    position: absolute;
    display: none;
    z-index: 998;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.4);
  }

  .popup-background-DARK {
    background-color: rgba(43, 43, 43, 0.4);
  }

  .popup-list-wrap {
    display: none;
    z-index: 999;
    transition: margin-right 2s;
  }

  .popup-add-list {
    position: absolute;
    display: flex;
    flex-wrap: nowrap;
    justify-content: center;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    height: 30%;
    width: 30%;
    background-color: #aeaeae;
    border-radius: 10px;
    z-index: 999;
  }

  .popup-add-list-DARK {
    background-color: #414141;
  }

  .popup-add-list-header {
    position: absolute;
    display: flex;
    width: 100%;
    justify-content: center;
    top: 10px;
  }

  .popup-add-list-button {
    position: absolute;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-content: center;
    bottom: 20px;
    height: 35px;
    width: 200px;
    z-index: 999;
    border-radius: 10px;
    background-color: #ffffff;
    color: rgb(0, 0, 0);
  }

  .popup-add-list-button-DARK {
    background: #000000;
    color: #ffffff;
  }
  
  .popup-add-list-input {
    position: absolute;
    top: 40%;
    /* Den Input Text nach rechts verschieben */
    padding-left: 10px;
    margin-right: 10%;
    width: 80%;
    height: 30px;
    border-radius: 7px;
    border: 3px solid rgb(0, 0, 0);
    background-color: rgba(255, 255, 255, 0.4);
  }

  .popup-add-list-password {
    position: absolute;
    top: 60%;
    /* Den Input Text nach rechts verschieben */
    padding-left: 10px;
    width: 90%;
    height: 30px;
    border-radius: 7px;
    border: 3px solid rgb(0, 0, 0);
    background-color: rgba(255, 255, 255, 0.4);
  }


  .popup-add-list-input-DARK {
    border: 2px solid #ffffff;
    color: white;
    background-color: rgba(126, 126, 126, 0.4);
  }

  .popup-add-list-color {
    position: absolute;
    margin: 0;
    top: 40%;
    right: 10px;
    height: 30px;
    width: 10%;
  }


  ul {
    list-style-type: none;
    display: flex;
    flex-direction: column;
  }

  li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.4); /* Hintergrundfarbe des li-Elements */
  color: black; /* Textfarbe */
  padding: 5px 5px;
  margin-bottom: 10px; /* Distance between li elements */
  }

  li i.fas.fa-trash {
    color: red; /* Farbe des Mülleimer-Icons */
    cursor: pointer;
  }
  
  .clock {
    color: rgb(255, 255, 255);
  }

  .clock-dark {
    color: rgb(157, 157, 157)
  }

</style>