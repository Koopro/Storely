import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import ProfileView from '../views/ProfileView.vue';
import LoginView from '../views/LoginView.vue';
import TestView from '../views/TestView.vue';

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
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfileView,
  },
  {
    path: '/testing',
    name: 'testing',
    component: TestView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  // Assume `isLoggedIn` is a method to check login status
  const isAuthenticated = isLoggedIn(); // You need to implement this function

  if (!isAuthenticated && to.name !== 'login') {
    // If the user is not authenticated and is trying to access a page other than login, redirect to login page
    next({ name: 'login' });
  } else {
    // Otherwise, proceed as normal
    next();
  }
});

export default router;

function isLoggedIn() {
  // Implement your logic here to check if the user is logged in
  // For example, check if a valid token exists:
  return !!localStorage.getItem('authToken');
}
