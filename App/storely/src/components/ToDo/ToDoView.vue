  <template>
  <Sidebar @click="handleDarkMode" />
  <div class="top" :class="{ 'dark-top': isDarkMode }">
    <Clock class="clock" :class="{ 'clock-dark': isDarkMode }"/>
  </div>
  <div class="menu" :class="{ 'dark-menu': isDarkMode }">
    <div class="inner-menu">
      <ul>
        <!-- Automatisch Listenpunkte generieren basierend auf verfügbaren Listen -->
        <li v-for="list in lists" :key="list._id" :style="{ backgroundColor: list.color }">
          {{ list.name }}
          <i class="fas fa-trash" :class="{ 'fas fa-trash-dark': isDarkMode }" @click="promptDelete(list._id, list.password)"></i>
        </li>
      </ul>
    </div>
    <button class="add-list-button" :class="{ 'add-list-button-dark': isDarkMode }" @click="openPopup">Liste Hinzufügen</button>
  </div>
  <div class="background-white" :class="{ 'background-dark': isDarkMode }"></div>
  
  <!--List Popup-->
  <div class="popup-list-wrap">
    <div class="popup-add-list" :class="{ 'popup-add-list-DARK': isDarkMode }">
      <h1 class="popup-add-list-header">Wie soll die neue Liste heißen?</h1>
      <input type="text" class="popup-add-list-input" placeholder="Listenname" ref="listNameInput" :class="{ 'popup-add-list-input-DARK': isDarkMode }">
      <input type="color" class="popup-add-list-color" v-model="listColor">
      <button class="popup-add-list-button" :class="{ 'popup-add-list-button-DARK': isDarkMode }" @click="addList">Hinzufügen</button>
    </div>
  </div>
  <div class="popup-background" :class="{ 'popup-background-DARK': isDarkMode }"></div>


  <!--ToDo-->
  <div class="ToDo" :class="{ 'ToDo-Dark': isDarkMode }">
    <ToDo />
    <button class="add-todo-button" :class="{ 'add-todo-button-DARK': isDarkMode }">ToDo Hinzufügen</button>
  </div>

</template>

<script>
import axios from 'axios';
import Sidebar from '../sidebar/Sidebar.vue';
import Clock from './Clock.vue';
import ToDo from './ToDos.vue';

export default {
  components: {
    Sidebar, 
    Clock, 
    ToDo
  },
  data() {
  return {
    isDarkMode: false,
    lists: [],
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
      const listColor = this.listColor;
      if (listName === "") {
        alert("Bitte gib einen Listennamen ein.");
      } else {
        try {
          const response = await axios.post(`${this.apiUrl}/todo/lists`, {
            name: listName,
            color: listColor
          }, {
            method:'POST',
            credentials: 'include',
            headers: { 'Authorization': this.authToken }
          });

          this.lists.push(response.data);
          this.$refs.listNameInput.value = "";
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
          credentials: 'include',
          headers: {'Authorization': this.authToken},
        });
        this.lists = response.data;
      } catch (error) {
        this.handleError(error.message);
      }
    },

    promptDelete(listId) {
        this.deleteList(listId);
    },

    async deleteList(listId) {
      try {
        await axios.delete(`${this.apiUrl}/todo/lists/${listId}`,{
          headers: {'Authorization': this.authToken},
          credentials: 'include',
        });
        this.lists = this.lists.filter(list => list._id !== listId);
      } catch (error) {
        this.handleError(error.message);
        console.log(error)
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
  
  .top {
    position: fixed;
    top: 0;
    left: 0;
    height: 10%;
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
    width: 25%;
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
  font-weight: bolder;
  text-transform: uppercase;
  color: black; /* Textfarbe */
  padding: 5px 5px;
  margin-bottom: 10px; /* Distance between li elements */
  padding-left: 15px;
  }

  li i.fas.fa-trash {
    color: red; /* Farbe des Mülleimer-Icons */
    cursor: pointer;
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #aeaeae;
    border-radius: 20px;
  }

  li i.fas.fa-trash-dark {
    background-color: #414141;
  }
  
  .clock {
    color: rgb(255, 255, 255);
  }

  .clock-dark {
    color: rgb(157, 157, 157)
  }

  .ToDo {
    position: fixed;
    display: flex;
    justify-content: center;
    top: 10%;
    left: 25%;
    right: 0;
    bottom: 0;
    background-color: white;
  }

  .ToDo-Dark {
    background-color: #9f9f9f;
  }

  .add-todo-button {
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
    background-color: #707070;
    color: rgb(0, 0, 0);
  }

</style>