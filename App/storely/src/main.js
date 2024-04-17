import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';
import { loadFonts } from './plugins/webfontloader';
import '@fortawesome/fontawesome-free/css/all.css'; // FontAwesome Icons
import { QuillEditor } from '@vueup/vue-quill';

import '@vueup/vue-quill/dist/vue-quill.snow.css';

// Load fonts using the webfontloader
loadFonts();

const app = createApp(App);

// Custom directive to handle clicks outside an element
app.directive('click-outside', {
  beforeMount(el, binding, vnode) {
    el.clickOutsideEvent = function(event) {
      // Check that click was outside the el and its children
      if (!(el === event.target || el.contains(event.target))) {
        // Call the provided method, assuming vnode and binding instance context compatibility
        binding.value(event);
      }
    };
    document.addEventListener('click', el.clickOutsideEvent);
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent);
  },
});

// Register VueEditor globally
app.component('QuillEditor', QuillEditor);

// Use router and vuetify plugins
app.use(router).use(vuetify).mount('#app');
