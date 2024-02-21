import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import ProfileView from '../views/ProfileView.vue';
import LoginView from '../views/LoginView.vue';
import TestView from '../views/TestView.vue';
import RegisterView from '../views/RegisterView.vue';

const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginView
  },
  {
    path: '/home',
    name: 'home',
    component: HomeView,
    meta: { requiresAuth: false } // Add a meta field to indicate authentication is required
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfileView,
    meta: { requiresAuth: false }
  },
  {
    path: '/testing',
    name: 'testing',
    component: TestView,
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

// Global navigation guard
router.beforeEach((to, from, next) => {
  // Check if the route requires authentication
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // Assume 'isLoggedIn' is a flag in localStorage or Vuex state
    if (!localStorage.getItem('isLoggedIn')) {
      // Redirect to the login page
      next({ name: 'login' });
    } else {
      // Proceed to the route
      next();
    }
  } else {
    // If the route does not require authentication, just proceed
    next();
  }
});

export default router;
