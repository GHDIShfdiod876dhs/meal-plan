import firebase from 'firebase/app';
import { firebaseConfig } from '../keys.js';
import 'firebase/auth';
import 'firebase/firestore';

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const googleProvider = new firebase.auth.GoogleAuthProvider();

export const db = firebase.firestore();

export const { FieldValue } = firebase.firestore;
