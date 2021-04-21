import firebase from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyBsdIYSBkCehCj5krwFqFjEMAN_xz_VIvs",
    authDomain: "relpo-88360.firebaseapp.com",
    projectId: "relpo-88360",
    storageBucket: "relpo-88360.appspot.com",
    messagingSenderId: "10108693366",
    appId: "1:10108693366:web:5525d64140ffb296d2a857",
    measurementId: "G-66J2YL6KVW"
};
const fire=firebase.initializeApp(firebaseConfig);
export default fire;