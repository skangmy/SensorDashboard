import firebase from 'firebase'

const app = firebase.initializeApp({
  apiKey: "AIzaSyB57cOM8RLLMY8ZhsJ4cA0Ox8FIogD-hDA",
  authDomain: "newagent-182e8.firebaseapp.com",
  databaseURL: "https://newagent-182e8.firebaseio.com",
  projectId: "newagent-182e8",
  storageBucket: "newagent-182e8.appspot.com",
  messagingSenderId: "1071148644926",
  appId: "1:1071148644926:web:1281408b4f0ffd7da4ef6f"
});

export const db = app.database();
export const namesRef = db.ref('User')

