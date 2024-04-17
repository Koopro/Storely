<template>
  <v-container>
    <v-card class="h-100 w-auto editor-card">
      <v-card-text class="h-100 w-auto editor-container">
        <QuillEditor v-model="content" :options="editorOptions" class="editor"/>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import NavFolder from "./NavFolder.vue";

export default {
  name: 'RichTextEditor',
  components: {
    QuillEditor,
    NavFolder
  },
  data() {
    return {
      placeholder: 'Start typing here...',
      editorOptions: {
        modules: {
          toolbar: {
            container: [
              ['bold', 'italic', 'underline', 'strike'],
              ['blockquote', 'code-block'],
              [{ 'header': 1 }, { 'header': 2 }],
              [{ 'list': 'ordered'}, { 'list': 'bullet' }],
              [{ 'script': 'sub'}, { 'script': 'super' }],
              [{ 'indent': '-1'}, { 'indent': '+1' }],
              [{ 'direction': 'rtl' }],
              [{ 'size': ['small', false, 'large', 'huge'] }],
              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
              [{ 'color': [] }, { 'background': [] }],
              [{ 'font': [] }],
              [{ 'align': [] }],
              ['link', 'image', 'video']
            ],
          },
          tooltip: true
        }
      },
      rules: {
        required: value => !!value || 'Required.',
      },
      newName: '',
      items: [
        { name: 'Documents', type: 'folder', color: 'blue' },
        { name: 'Vacation Photos', type: 'folder', color: 'green' },
        { name: 'To-do list.txt', type: 'file', color: 'default' }
      ],
    };

  },
  methods: {
    addItem(type) {
      const name = type === 'folder' ? 'New Folder' : 'New File';
      const color = type === 'folder' ? 'default' : 'default';
      this.items.push({ name, type, color });
    },
    enableRename(item) {
      this.newName = item.name;
    },
    saveName(item) {
      item.name = this.newName;
    }
  }
}
</script>

<style scoped>
*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.editor {
  height: 100%;
}
</style>
