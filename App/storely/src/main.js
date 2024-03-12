import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';
import { loadFonts } from './plugins/webfontloader';
import '@fortawesome/fontawesome-free/css/all.css'; // Ensure you are importing the CSS

loadFonts();

const app = createApp(App);

app.directive('click-outside', {
  beforeMount(el, binding, vnode) {
    el.clickOutsideEvent = function(event) {
      // Check that click was outside the el and its children
      if (!(el === event.target || el.contains(event.target))) {
        // Call the provided method, making sure to bind vnode.context
        binding.value(event);
      }
    };
    document.addEventListener('click', el.clickOutsideEvent);
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent);
  },
});

app.use(router).use(vuetify).mount('#app');
