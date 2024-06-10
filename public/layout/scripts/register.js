
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword,createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-auth.js";


  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyD_y6_pBagJB0L__779-flzoyDa75eT6EU",
    authDomain: "loginform-b71a3.firebaseapp.com",
    projectId: "loginform-b71a3",
    storageBucket: "loginform-b71a3.appspot.com",
    messagingSenderId: "84282682833",
    appId: "1:84282682833:web:6c8c594cdb35554ee604f0"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

document.getElementById("reg_btn").addEventListener('click',function(){
  window.location.href="/nocobot/pages/login1.html";
alert("Welcome Home");
});



document.getElementById("log_btn").addEventListener('click',function(){
  window.location.href="/nocobot/pages/register.html";
alert("welcome");

});


//sign-in
document.getElementById("login_btn").addEventListener('click',function(){
const loginEmail = document.getElementById("email_id").value;
const loginPassword = document.getElementById("log_pass_word").value;

signInWithEmailAndPassword(auth, loginEmail, loginPassword)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    // ...
    alert( "You are Signed in Successfully !!!" );
    window.location.href="/nocobot/index.html";
    // setTimeout(function(){window.location.href="index.html"});
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
  });

});


//sign-up
document.getElementById("register_btn").addEventListener('click',function(){
  const registerEmail = document.getElementById("your_email").value;
  const registerPassword = document.getElementById("pass_word").value;
  
  createUserWithEmailAndPassword(auth, registerEmail, registerPassword)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      // ...
      alert( "You are Signed Up Successfully !!!" );

      window.location.href="/nocobot/index.html";
      // setTimeout(function(){window.location.href="index.html"});
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
  
  });


//login- your password
const login_togglePassword = document.querySelector('#log_togglePassword');
  const login_password = document.querySelector('#log_pass_word');
 
  login_togglePassword.addEventListener('click', function (e1) {
    // toggle the type attribute
    const type2 = login_password.getAttribute('type') === 'password' ? 'text' : 'password';
    login_password.setAttribute('type', type2);
    // toggle the eye slash icon
    this.classList.toggle('fa-eye-slash');
});
















// // email validation
// function ValidateEmail(inputText)
// {
// var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
// if(inputText.value.match(mailformat))
// {
// alert("Valid email address!");
// document.form1.email.focus();
// return true;
// }
// else
// {
// alert("You have entered an invalid email address!");
// document.form1.email.focus();
// return false;
// }
// }


// //your password
// const togglePassword = document.querySelector('#togglePassword');
// const password = document.querySelector('#pass_word');


// togglePassword.addEventListener('click', function (e) {
//   // toggle the type attribute
//   const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
//   password.setAttribute('type', type);
//   // toggle the eye slash icon
//   // this.form1.toggle(getElementById(togglePassword));
//   this.classList.toggle('fa-eye-slash');
//   // this.getElementById
// });

//confirm password
// const con_togglePassword = document.querySelector('#con_togglePassword');
// const con_togglePassword = document.getElementById("con_togglePassword")
// // const con_password = document.querySelector('#con_pass_word');
// const con_password = document.getElementById("con_pass_word");

// con_togglePassword.addEventListener('click', function (e) {
//   // toggle the type attribute
//   const type1 = con_password.getAttribute('type') === 'password' ? 'text' : 'password';
//   con_password.setAttribute('type', type1);
//   // toggle the eye slash icon
//   // this.getElementById.toggle('con_pass_word');
//   this.classList.toggle("fa-eye-slash");
// });
