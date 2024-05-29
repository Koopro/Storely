import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import ProfileView from '../views/ProfileView.vue';
import LoginView from '../views/LoginView.vue';
import TestView from '../views/TestView.vue';
import VerifyEmail from '../components/EmailVerification.vue';
import ToDoView from '../components/ToDo/ToDoView.vue';
import Calendar from '../views/Calendar.vue';
import TestView2 from '../views/TestView2.vue';
import TestView3 from '../views/TestView3.vue';
import TestView4 from '../views/TestView4.vue';
import ChatView from '../views/ChatView.vue';
import TestView8 from '../views/TestView8.vue';
import AdminView from '../views/AdminView.vue';
import NotesView from '../views/NotesView.vue';

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
    path: '/todo',
    name: 'todo',
    component: ToDoView,
  },
  {
    path: '/testing',
    name: 'testing',
    component: TestView,
  },
  {
    path: '/testing2',
    name: 'testing2',
    component: TestView2,
  },
  {
    path: '/verify-email',
    name: 'verify-email',
    component: VerifyEmail,
  },
  {
    path: '/testing2',
    name: 'testing2',
    component: TestView2,
  } ,
  {
    path: '/testing3',
    name: 'testing3',
    component: TestView3,
  },
  {
    path: '/testing4',
    name: 'testing4',
    component: TestView4,
  },
  {
  path: '/calendar',
    name: 'calendar',
    component: Calendar,
  },
  {
  path: '/chat',
    name: 'chat',
    component: ChatView,
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminView,
  },
  {
    path: '/notes',
    name: 'notes',
    component: NotesView
  }, 
  {
    path: '/testing8',
    name: 'testing8',
    component: TestView8
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
  return !!localStorage.getItem('authToken');
}
