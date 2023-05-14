import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  // apiKey: "AIzaSyAsfabV4yzacVdOogs2PG6u-NoD6f2tQuI",
  // authDomain: "chatala-ced10.firebaseapp.com",
  // projectId: "chatala-ced10",
  // storageBucket: "chatala-ced10.appspot.com",
  // messagingSenderId: "532567438703",
  // appId: "1:532567438703:web:654307e9e3bb8398b2649a"
  apiKey: 'AIzaSyD6Rejn5y4jj7ZYcq7dNZqAU-TtRS031sA',
  authDomain: 'fir-66cfc.firebaseapp.com',
  databaseURL:
    'https://fir-66cfc-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'fir-66cfc',
  storageBucket: 'fir-66cfc.appspot.com',
  messagingSenderId: '579823469573',
  appId: '1:579823469573:web:e396546d531830c7b3086c',
  measurementId: 'G-3JHM811JD0',
};

const app = initializeApp(firebaseConfig);
export const authentication = getAuth(app);
