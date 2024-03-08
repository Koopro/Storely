import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import ProfileView from '../views/ProfileView.vue';
import LoginView from '../views/LoginView.vue';
import TestView from '../views/TestView.vue';
import VerifyEmail from '../components/EmailVerification.vue';

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
  {
    path: '/verify-email',
    name: 'verify-email',
    component: VerifyEmail,
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

const publicPages = ['login', 'verify-email']; // Add other public route names as needed

router.beforeEach((to, from, next) => {
  const isAuthenticated = isLoggedIn(); // Ensure this checks auth token validity
  const isPublicPage = publicPages.includes(to.name);

  if (!isAuthenticated && !isPublicPage) {
    // If the user is not authenticated and the page is not public, redirect to login page
    next({ name: 'login' });
  } else if (isAuthenticated && to.name === 'login') {
    // If the user is already authenticated and tries to access the login page, redirect to home
    next({ name: 'home' });
  } else {
    // Proceed to the page
    next();
  }
});


export default router;

function isLoggedIn() {
  // Implement your logic here to check if the user is logged in
  // For example, check if a valid token exists:
  return !!localStorage.getItem('authToken');
}
