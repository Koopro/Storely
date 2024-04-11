<!--  <template>
    <div>

      <Sidebar />
      <v-container>
        <v-row justify="center">
          <v-col cols="12" sm="8" md="6">
            <v-card :class="{ 'dark-mode-card': darkMode }">
              <v-card-title class="text-h5">Profil</v-card-title>
              <v-divider></v-divider>
              <v-card-text>

                <div class="profile-picture-container">
                  <img :src="tempUser.profileImageUrl || user.profileImageUrl || defaultProfileImage" class="profile-picture" alt="Profilbild">
                  <label for="profile-image-input" class="change-profile-button">
                    <p>Profilbild ändern</p>
                  </label>
                  <input id="profile-image-input" type="file" @change="onFileChange" accept="image/*" style="display: none;">
                </div>
                <div>
                  <label>Benutzername:&nbsp</label>
                  <span v-if="!editing">{{ user.username }}</span>
                  <input v-else type="text" v-model="tempUser.username" :class="{ 'edit-mode-input': editing }" required>
                </div>
                <div class="button-container">
                  <button @click="toggleEditing" class="edit-mode-button">{{ editing ? 'Speichern' : 'Bearbeiten' }}</button>
                  <button v-if="editing" @click="cancelEdit" class="edit-mode-button">Abbrechen</button>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </template>

  <script>
  import axios from 'axios';
  import Sidebar from '../components/sidebar/Sidebar.vue';
  import ProfilePicture from '../assets/profile.png';

  export default {
    components: {
      Sidebar
    },
    data() {
      return {
        user: {},
        tempUser: {},
        editing: false,
        defaultProfileImage: ProfilePicture,
        selectedFile: null,
      };
    },
    computed: {
      darkMode() {
        // Hier den aktuellen Dark Mode Status aus deinem globalen Zustand oder Store abrufen
        return false; // Hier vorübergehend hart kodiert
      }
    },
    created() {
      // Daten von der API laden, wenn die Komponente erstellt wird
      this.fetchUserData();
    },
    methods: {
      fetchUserData() {
        // URL deines API-Endpunkts für Benutzerdaten
        const apiUrl = 'http://api.storely.at/api/user/profile'; // Hier musst du die tatsächliche URL deines API-Endpunkts angeben
        
        // Axios verwenden, um die Daten von der API abzurufen
        axios.get(apiUrl)
          .then(response => {
            // Erfolgreiche Antwort: Aktualisiere die Benutzerdaten
            this.user = response.data;
            this.tempUser = { ...this.user }; // Temporäre Benutzerdaten aktualisieren
          })
          .catch(error => {
            // Fehler beim Laden der Daten: Zeige eine Fehlermeldung oder behandle den Fehler entsprechend
            console.error('Fehler beim Laden der Benutzerdaten:', error);
          });
      },
      toggleEditing() {
        if (this.editing) {
          // Übernehmen der Änderungen, wenn im Bearbeitungsmodus gespeichert wird
          this.user.username = this.tempUser.username;
        } else {
          // Speichern der aktuellen Benutzerdaten, bevor sie bearbeitet werden
          this.tempUser = { ...this.user };
        }
        this.editing = !this.editing;
      },
      cancelEdit() {
        // Beim Abbrechen des Bearbeitungsmodus das tempUser-Objekt zurücksetzen
        this.editing = false;
        // Zurücksetzen des temporären Benutzerobjekts auf die aktuellen Benutzerdaten
        this.tempUser = { ...this.user };
      },
      onFileChange(event) {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('profileImage', file);

        // Axios verwenden, um das Bild an den Server zu senden
        axios.post('http://api.storely.at/api/uploadProfileImage', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('authToken')}`, // Verwenden Sie 'Bearer' vor Ihrem Token
          },
        })
        .then(response => {
          // Erfolgreiche Antwort: Aktualisieren Sie das Profilbild in der Benutzeroberfläche
          this.user.profileImageUrl = response.data.filePath;
        })
        .catch(error => {
          // Fehler beim Hochladen des Bildes: Zeigen Sie eine Fehlermeldung oder behandeln Sie den Fehler entsprechend
          console.error('Fehler beim Hochladen des Profilbilds:', error);
        });
      }
    }
  };
  </script>

  <style scoped>
  .dark-mode-card {
    background-color: #333;
    color: #fff;
  }

  .profile-picture-container {
    text-align: center;
    margin-bottom: 20px;
  }

  .profile-picture {
    width: 150px; /* Größe des Profilbilds */
    height: 150px;
    border-radius: 50%; /* Kreisrunde Form */
    object-fit: cover; /* Skalierung des Bildes */
    border: 2px solid #4A90E2;
  }

  .change-profile-button {
    cursor: pointer;
    font-size: 12px;
    color: #4A90E2;
  }

  .edit-mode-input {
    border: 1px solid #4A90E2; /* Rahmenfarbe im Bearbeitungsmodus */
    border-radius: 4px; /* Abgerundete Ecken */
    padding: 6px 10px; /* Innenabstand */
    margin-bottom: 10px; /* Platz unten */
    display: block; /* Elemente untereinander anzeigen */
  }

  .edit-mode-button {
    border: 1px solid #4A90E2; /* Rahmen für Buttons */
    border-radius: 4px; /* Abgerundete Ecken */
    padding: 8px 20px; /* Innenabstand */
    margin-right: 10px; /* Abstand zwischen Buttons */
    cursor: pointer; /* Zeiger beim Überfahren */
    background-color: transparent; /* Transparenter Hintergrund */
    color: #4A90E2; /* Textfarbe */
  }

  .edit-mode-button:hover {
    background-color: #4A90E2; /* Hintergrundfarbe beim Überfahren */
    color: #fff; /* Textfarbe beim Überfahren */
  }

  .button-container {
    text-align: center; /* Zentrierte Ausrichtung */
  }

  .error-message {
    color: red; /* Rote Farbe für Fehlermeldungen */
  }
  </style>
-->
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

