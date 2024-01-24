<template>
  <v-app>
    <v-navigation-drawer app permanent>
      <v-list dense>
        <v-subheader>Folders</v-subheader>
        <v-list-item
          v-for="folder in folders"
          :key="folder.id"
          @click="selectFolder(folder)"
        >
          <v-list-item-title>{{ folder.name }}</v-list-item-title>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item @click="addFolder">
          <v-list-item-action>
            <v-icon>mdi-plus</v-icon>
          </v-list-item-action>
          <v-list-item-title>New Folder</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app>
      <v-toolbar-title>Notes App</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-container>
        <!-- Toolbar for text formatting (stubbed out) -->
        <v-toolbar flat dense>
          <!-- Add your toolbar items here -->
          <v-btn icon><v-icon>mdi-format-bold</v-icon></v-btn>
          <!-- ... other buttons ... -->
        </v-toolbar>

        <!-- Textarea to be replaced by rich text editor -->
        <v-textarea
          v-model="selectedNote.content"
          label="Edit Note"
          rows="10"
          auto-grow
        ></v-textarea>

        <v-btn @click="saveNote">Save Note</v-btn>
      </v-container>
    </v-main>
  </v-app>
</template>
<script>
export default {
  data: () => ({
    folders: [
      { id: 1, name: 'Folder 1', notes: [{ id: 1, content: 'Note 1 content' }] },
      { id: 2, name: 'Folder 2', notes: [] },
      // More folders...
    ],
    selectedFolder: null,
    selectedNote: { id: null, content: '' },
  }),
  methods: {
    addFolder() {
      const newFolderId = this.folders.length + 1;
      const newFolder = { id: newFolderId, name: 'New Folder ' + newFolderId, notes: [] };
      this.folders.push(newFolder);
      this.selectFolder(newFolder);
    },
    selectFolder(folder) {
      this.selectedFolder = folder;
      if (folder.notes.length > 0) {
        this.selectNote(folder.notes[0]);
      } else {
        this.selectedNote = { id: null, content: '' };
      }
    },
    saveNote() {
      if (this.selectedNote.id) {
        const noteIndex = this.selectedFolder.notes.findIndex(note => note.id === this.selectedNote.id);
        this.$set(this.selectedFolder.notes, noteIndex, this.selectedNote);
      } else {
        const newNoteId = this.selectedFolder.notes.length + 1;
        const newNote = { ...this.selectedNote, id: newNoteId };
        this.selectedFolder.notes.push(newNote);
        this.selectNote(newNote);
      }
    },
    selectNote(note) {
      this.selectedNote = note;
    },
  },
};
</script>
<style>
  /* Add your custom styles here */
</style>