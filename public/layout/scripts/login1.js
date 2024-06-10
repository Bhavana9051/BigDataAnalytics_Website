function validate(){
    var username = document.getElementById("user_name").value;
    var password = document.getElementById("pass_word").value;
    var type = document.getElementById("user_type").value;
    // var email = document.getElementById("user_name").value;
  
    var map = new Map();
    map.set("xyz","xyz");
    map.set("abcd","abcd");
    map.set("iit2021093","123");
    
    //for student login 
   if(type == "student")
   {
     if (map.has(username)) {
       if (map.get(username) === password) {
           alert( "validation succeeded" );
           setTimeout(function(){window.location.href="index.html"});
      }
       else {
        alert( "validation failed" );
      location.href="fail.html";
      }
    } 
    
    else {
      alert( "validation failed" );
      location.href="fail.html";
     }
  
   }
  
   // for admin login
   else 
   { 
    if(   document.getElementById("user_name").value == "abc"
      && document.getElementById("log_pass_word").value == "abc" )
       {
         alert( "validation succeeded" );
         setTimeout(function(){window.location="index.html"});
       }
    else
       {
         alert( "validation failed" );
         location.href="fail.html";
       }
   }
  
  }
  
  function loggin(){
    setTimeout(function(){window.location="index.html"});
  }



//login- your password
const login_togglePassword = document.querySelector('#log_togglePassword');
  const login_password = document.querySelector('#log_pass_word');
 
  login_togglePassword.addEventListener('click', function (e1) {
    // toggle the type attribute
    const type2 = login_password.getAttribute('type') === 'password' ? 'text' : 'password';
    login_password.setAttribute('type', type2);
    // toggle the eye slash icon
    this.classList.toggle('bi-eye');
});


// email validation
function ValidateEmail_log(inputText)
{
var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
if(inputText.value.match(mailformat))
{
alert("Valid email address!");
document.formLogin.username.focus();
return true;
}
else
{
  if(!validate()){
    alert("You have entered an invalid email address!");
  }
document.formLogin.username.focus();
return false;
}
}