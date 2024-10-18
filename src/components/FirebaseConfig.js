import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCeD_tzJuiBRDYtczPHsigtVHsP60YXlck",
  authDomain: "aires-acondiconados.firebaseapp.com",
  projectId: "aires-acondiconados",
  storageBucket: "aires-acondiconados.appspot.com",
  messagingSenderId: "738506207550",
  appId: "1:738506207550:web:13d6e47ff25dcace98bc6f",
  measurementId: "G-XJB644SCP1"
};

// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);
//const appFirebase = getAnalytics(appFirebase);

export default  appFirebase;