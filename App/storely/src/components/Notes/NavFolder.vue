<template>
  <v-container>
    <v-list dense>
      <!-- Loop through folders -->
      <v-list-item v-for="item in items" :key="item.id" @click.stop="toggle(item)">
        <v-list-item-icon>
          <v-icon :style="{ color: item.color }">{{ item.open ? 'mdi-folder-open' : 'mdi-folder' }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content @dblclick.stop="editItem(item)">
          <v-list-item-title :style="{ color: item.color }">{{ item.name }}</v-list-item-title>
        </v-list-item-content>

        <!-- Files inside the folder -->
        <v-list-group v-if="item.open" no-action>
          <v-list-item v-for="file in item.files" :key="file.id" @dblclick.stop="editFile(file, item)">
            <v-list-item-icon>
              <v-icon>mdi-file</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title :style="{ color: file.color }">{{ file.name }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-btn small @click.stop="addFile(item)">Add File</v-btn>
        </v-list-group>
      </v-list-item>
    </v-list>
    <v-btn color="primary" @click="addFolder">Add Folder</v-btn>

    <!-- Dialog for adding or editing folders and files -->
    <v-dialog v-model="showAddDialog" max-width="500px">
      <v-card>
        <v-card-title class="text-h6">{{ currentItem.id ? 'Edit' : 'Add' }} {{ editingFile ? 'File' : 'Folder' }}</v-card-title>
        <v-card-text>
          <v-text-field
              v-model="currentItem.name"
              label="Name"
              outlined
              :rules="nameRules"
              required>
          </v-text-field>

          <v-color-picker v-model="currentItem.color" @input="updateColor" hide-alpha></v-color-picker>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="cancelItem">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="saveItem">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    items: [],
    showAddDialog: false,
    editingFile: false,
    parentFolder: null,
    nameRules: [v => !!v || 'Name is required'],
    currentItem: {
      id: null,
      name: '',
      color: '#000000'
    }
  }),
  methods: {
    toggle(item) {
      item.open = !item.open;
    },
    editItem(item) {
      this.editingFile = false;
      this.currentItem = { ...item };
      this.showAddDialog = true;
    },
    addFolder() {
      this.editingFile = false;
      this.parentFolder = null;
      this.currentItem = { id: null, name: '', color: '#000000', files: [] };
      this.showAddDialog = true;
    },
    addFile(folder) {
      this.editingFile = true;
      this.parentFolder = folder;
      this.currentItem = { id: null, name: '', color: '#000000' };
      this.showAddDialog = true;
    },
    editFile(file, folder) {
      this.editingFile = true;
      this.parentFolder = folder;
      this.currentItem = { ...file };
      this.showAddDialog = true;
    },
    saveItem() {
      if (this.currentItem.name.trim() === '') {
        return; // Prevent saving if name is empty
      }
      if (this.currentItem.id) {
        if (this.editingFile) {
          const index = this.parentFolder.files.findIndex(f => f.id === this.currentItem.id);
          if (index !== -1) {
            this.parentFolder.files[index] = { ...this.currentItem };
          }
        } else {
          const index = this.items.findIndex(i => i.id === this.currentItem.id);
          if (index !== -1) {
            this.items[index] = { ...this.currentItem };
          }
        }
      } else {
        this.currentItem.id = Date.now();
        if (this.editingFile) {
          this.parentFolder.files.push({ ...this.currentItem });
        } else {
          this.items.push({ ...this.currentItem });
        }
      }
      this.resetCurrentItem();
    },
    resetCurrentItem() {
      this.currentItem ={ id: null, name: '', color: '#000000' };
      this.showAddDialog = false;
    },
    cancelItem() {
      this.resetCurrentItem();
    },
    updateColor(color) {
      this.currentItem.color = color;
    }
  }
}
</script>

<style>
.v-color-picker-preview__alpha {
  display: none;
}
</style>