import "firebase/compat/auth";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAl4q8BnWehruhpxFaOnDfPG7B0hD-4wVw",
  authDomain: "project-management-ff05b.firebaseapp.com",
  projectId: "project-management-ff05b",
  storageBucket: "project-management-ff05b.appspot.com",
  messagingSenderId: "385075384072",
  appId: "1:385075384072:web:b23a41b4563a8667eb26bd",
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

export const db = firebase.firestore();
export default auth;
export const storage = firebase.storage();
