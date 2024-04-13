<template>
    <Sidebar @click="handleDarkMode" />
    <div class="top" :class="{ 'dark-top': isDarkMode }"></div>
    <div class="menu" :class="{ 'dark-menu': isDarkMode }">
      <!--Liste in der die Menupunkte eingefügt werden-->
      <div class="inner-menu">
        <ul>
        </ul>
      </div>
      <button class="add-list-button" :class="{ 'add-list-button-dark': isDarkMode }" @click="openPopup">Liste Hinzufügen</button>

    </div>

    <div class="background-white" :class="{ 'background-dark': isDarkMode }"></div>
    
    <!-- Popup Add List -->
  <div class="popup-list-wrap">
    <div class="popup-add-list" :class="{ 'popup-add-list-DARK': isDarkMode }">
      <h1 class="popup-add-list-header">Wie soll die neue Liste heißen?</h1>
      <input type="text" class="popup-add-list-input" placeholder="Listenname" ref="listNameInput" :class="{ 'popup-add-list-input-DARK': isDarkMode }">
      <button class="popup-add-list-button" :class="{ 'popup-add-list-button-DARK': isDarkMode }" @click="addList">Hinzufügen</button>

    </div>
  </div>
  <div class="popup-background" :class="{ 'popup-background-DARK': isDarkMode }"></div>
</template>
  
  <script>
  import Sidebar from '../components/sidebar/Sidebar.vue';
  
  export default {
    components: {
      Sidebar
    },
    data() {
      return {
        isDarkMode: false // This will track the dark mode state
      };
    },
    created() {
      this.handleDarkMode();
    },
    methods: {
      handleDarkMode() {
        // Retrieve the dark mode state from localStorage
        const storedDarkMode = localStorage.getItem('darkMode');
        
        // Update isDarkMode based on the stored value
        this.isDarkMode = storedDarkMode === 'true'; // Convert the string to a boolean
      }, 
      openPopup() {
        document.querySelector('.popup-list-wrap').style.display = 'block';
        document.querySelector('.popup-add-list-input').focus();
        document.querySelector('.popup-background').style.display = 'block';
      },

// Method to add a new list
      addList() {
        const listName = this.$refs.listNameInput.value.trim();
        console.log(listName);

        if (listName === "") {
          alert("Bitte gib einen Listennamen ein.");
        } else {
          const list = {
            name: listName
          };

          // Emit the 'add-list' event with the list object
          this.$emit('add-list', list);

          // Clear the input field
          this.$refs.listNameInput.value = "";

          // Hide the popup
          document.querySelector('.popup-list-wrap').style.display = 'none';
          document.querySelector('.popup-background').style.display = 'none';

          // Add the list name to the 'inner-menu'
          this.addToListMenu(listName);
        }
      },

      addToListMenu(listName) {
        // Assuming 'inner-menu' is a list or some sort of container
        const innerMenu = document.querySelector('.inner-menu');

        // Create a new list item element
        const listItem = document.createElement('li');
        listItem.textContent = listName;

        // Append the new list item to the 'inner-menu'
        innerMenu.appendChild(listItem);
      },


      // Handle errors in a user-friendly way
      handleError(message) {
        // Replace with user-friendly error handling logic
        console.error(message);
      },

  // Method to close the popup
      closePopup() {
        document.querySelector('.popup-list-wrap').style.display = 'none';
      }
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
  }

  .popup-add-list {
    position: absolute;
    display: flex;
    flex-wrap: nowrap;
    justify-content: center;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    height: 20%;
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
    top: 50%;
    transform: translate(0,-50%);
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


  </style>
  