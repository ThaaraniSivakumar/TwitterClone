
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBErfKS4Fi_WRF-lGAtjYRvTeOaCq-OpuM",
  authDomain: "create-a-website-like-tw-38a14.firebaseapp.com",
  projectId: "create-a-website-like-tw-38a14",
  storageBucket: "create-a-website-like-tw-38a14.appspot.com",
  messagingSenderId: "126233460560",
  appId: "1:126233460560:web:d030e3a874cb907ce7b655",
  measurementId: "G-CF316BDSQD"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export default auth ;


