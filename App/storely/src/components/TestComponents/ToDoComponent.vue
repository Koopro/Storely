<template>
  <v-app>
    <v-container fluid>
      <v-row>
        <!-- Folder List -->
        <v-col cols="3">
          <v-list dense>
            <v-subheader>Folders</v-subheader>
            <v-list-item-group v-model="activeFolderIndex" color="primary">
              <v-list-item v-for="(folder, index) in folders" :key="folder.name" @click="selectFolder(index)">
                <v-list-item-icon>
                  <v-icon>{{ folder.icon }}</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  {{ folder.name }}
                  <v-chip v-if="noteCounts[folder.name]" small>{{ noteCounts[folder.name] }}</v-chip>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
            <v-divider></v-divider>
            <v-list-item>
              <v-text-field dense flat hide-details placeholder="New folder" v-model="newFolderName"></v-text-field>
              <v-btn color="primary" @click="addFolder">+</v-btn>
            </v-list-item>
          </v-list>
        </v-col>

        <!-- Notes Content -->
        <v-col cols="9">
          <v-card>
            <v-card-title class="headline blue-grey darken-2 white--text">
              {{ activeFolder.name }}
              <v-chip v-if="noteCounts[activeFolder.name]" small>{{ noteCounts[activeFolder.name] }}</v-chip>
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" v-for="(note, index) in filteredNotes" :key="index">
                  <v-card outlined>
                    <v-card-title class="d-flex justify-space-between">
                      {{ note.title }}
                      <v-icon small @click="toggleStar(note)">
                        {{ note.starred ? 'mdi-star' : 'mdi-star-outline' }}
                      </v-icon>
                    </v-card-title>
                    <v-card-subtitle>{{ note.date }}</v-card-subtitle>
                    <v-card-text>{{ note.content }}</v-card-text>
                    <v-card-actions>
                      <v-btn text color="red" @click="deleteNote(note)">Delete</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions v-if="!activeFolder.special">
              <v-btn color="blue" @click="newNoteDialog = true">+ Add Note</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- New Note Dialog -->
    <v-dialog v-model="newNoteDialog" persistent max-width="600px">
      <v-card>
        <v-card-title class="headline">New Note</v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field label="Note Title" v-model="newNoteTitle" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea label="Note Content" v-model="newNoteContent" required></v-textarea>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn color="blue darken-1" text @click="newNoteDialog = false">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="addNote">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      newFolderName: '',
      newNoteTitle: '',
      newNoteContent: '',
      newNoteDialog: false,
      activeFolderIndex: 0,
      folders: [
        { name: 'All Notes', icon: 'mdi-note-multiple', notes: [], special: true },
        { name: 'Starred', icon: 'mdi-star', notes: [], special: true },
        { name: 'Trash', icon: 'mdi-trash-can', notes: [], special: true },
      ],
    };
  },
  computed: {
    activeFolder() {
      return this.folders[this.activeFolderIndex];
    },
    filteredNotes() {
      return this.activeFolder.special
        ? this.aggregateSpecialFolderNotes(this.activeFolder)
        : this.activeFolder.notes;
    },
    noteCounts() {
      const counts = {};
      // Count for special folders
      counts['All Notes'] = this.aggregateSpecialFolderNotes({ name: 'All Notes' }).length;
      counts['Starred'] = this.aggregateSpecialFolderNotes({ name: 'Starred' }).length;
      counts['Trash'] = this.folders.find(folder => folder.name === 'Trash').notes.length;

      // Count for user-created folders
      this.folders.filter(folder => !folder.special).forEach(folder => {
        counts[folder.name] = folder.notes.length;
      });

      return counts;
    },
  },
  methods: {
    addFolder() {
      if (this.newFolderName.trim()) {
        this.folders.push({ name: this.newFolderName, icon: 'mdi-folder', notes: [], special: false });
        this.newFolderName = '';
      }
    },
    selectFolder(index) {
      this.activeFolderIndex = index;
    },
    addNote() {
      if (this.newNoteTitle.trim() && this.newNoteContent.trim()) {
        const newNote = {
          title: this.newNoteTitle,
          date: new Date().toLocaleString(),
          content: this.newNoteContent,
          starred: false,
        };
        this.folders[this.activeFolderIndex].notes.push(newNote);
        this.resetNoteDialog();
      }
    },
    resetNoteDialog() {
      this.newNoteDialog = false;
      this.newNoteTitle = '';
      this.newNoteContent = '';
    },
    deleteNote(noteToDelete) {
      this.folders.find(folder => folder.name === 'Trash').notes.push(noteToDelete);
      this.folders.forEach(folder => {
        folder.notes = folder.notes.filter(note => note !== noteToDelete);
      });
    },
    toggleStar(noteToToggle) {
      noteToToggle.starred = !noteToToggle.starred;
    },
    aggregateSpecialFolderNotes(folder) {
      if (folder.name === 'All Notes') {
        return this.folders.flatMap(f => (f.special ? [] : f.notes));
      } else if (folder.name === 'Starred') {
        return this.folders.flatMap(f => f.notes.filter(n => n.starred));
      } else if (folder.name === 'Trash') {
        return folder.notes;
      }
      return [];
    },
  },
};
</script>
