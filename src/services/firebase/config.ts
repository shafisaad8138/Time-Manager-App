import { initializeApp } from 'firebase/app';
import { browserLocalPersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Replace with your actual Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyB8Dh26maUzO0FKUdXKcxuCxDdn58CSKHU",
    authDomain: "time-manager-app-99a99.firebaseapp.com",
    projectId: "time-manager-app-99a99",
    storageBucket: "time-manager-app-99a99.firebasestorage.app",
    messagingSenderId: "174163305150",
    appId: "1:174163305150:android:027e03d2cde672d783f4ef"
};

const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
    persistence: browserLocalPersistence
});
export const db = getFirestore(app);
