// App.js
// var baseUrl = "http://localhost:3000"; // Replace with your actual base URL
// require("./model/db");
const express = require("express"),
      mongoose = require("mongoose"),
	passport = require("passport"),
	bodyParser = require("body-parser"),
	LocalStrategy = require("passport-local"),
	passportLocalMongoose =
		require("passport-local-mongoose")
const User = require("./model/User");
// const expressLayouts = require('express-ejs-layouts');

const publication = require("./model/publication.model");
const publicationController = require("./controllers/publicationController");
const Publication = mongoose.model('Publication');
var app = express();
var path = require('path');


mongoose.connect("mongodb://127.0.0.1/27017");


// app.set('layout', 'layouts/mainLayout');
//ejs engine code
app.set('views',path.join(__dirname,'/views/'));
// app.set('layout', 'mainLayout');
app.set("view engine", "ejs");

// use express-ejs-layouts middleware
// app.use(expressLayouts);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(require("express-session")({
	secret: "Rusty is a dog",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

var options = {
    dotfiles: 'ignore',
    etag: false,
    extensions: ['htm', 'html'],
    index: false,
    maxAge: '1d',
    redirect: false,
    setHeaders: function (res, path, stat) {
      res.set('x-timestamp', Date.now())
    }
  }
  
app.use(express.static('public', options));
app.use(express.static('public'));
  

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());






//=====================
// ROUTES
//=====================



// Showing home page
app.get("/", function (req, res) {
	res.render("home");
});

// Showing secret page
app.get("/secret", isLoggedIn, function (req, res) {
	res.render("secret");
});

//Showing publicationForm page
// app.get("/list", isLoggedIn, function (req, res) {
// 	res.render("list");
// });

//Showing Gallery Page
app.get("/gallery", function (req, res) {
	res.render("gallery");
});

//Showing Admin Page
app.get("/admin", function (req, res) {
	res.render("admin");
});

//Showing userslist Page
app.get("/userlist", function (req, res) {
	res.render("userlist");
});

// Showing register form
app.get("/register", function (req, res) {
	res.render("register");
});

//editProfile page
// app.get("/editProfile", function (req, res) {
// 	res.render("editProfile");
// });


// Handling user signup
app.post('/register', async (req, res) => {
	try {
	  const { name, email, password, confirmPassword, userType} = req.body;
	//   if (!name || !email || !password || !confirmPassword || !userType) {
    //     return res.status(400).send('All fields are required!');
    // }
	  // Check if password and confirm password fields match
	  if (password !== confirmPassword) {
		return res.status(400).send({ message: 'Password and confirm password do not match' });
	  }
  // Create a new user
  try {
	const existingUser = await User.findOne({ email: req.body.email });
	if (existingUser) {
		return res.status(400).send('User already exists!');
	}
		const user = await User.create({
		username: req.body.username,
		email: req.body.email,
		password: req.body.password,
		userType: req.body.userType
		});

		return res.status(200).json(user);
		// return res.render('register', { signup_message: 'Registration successful', error_message: null });
		// res.status(200).send(`<script>alert('Registration Successful!')</script><script>location.href='/login';</script>`);
    } catch (error) {
        res.status(500).send(error.message);
    }
		
	} catch (error) {
		res.status(400).json({ error })
		// return res.render('register', { error_message: error.message });
	}
  });
  

//Showing login form
app.get("/login", function (req, res) {
	res.render("login");
});

//Handling user login
app.post("/login", async function(req, res){
	try {
		// check if the user exists
		const user = await User.findOne({ email : req.body.email });
		if (user) {
		//check if password matches
		const result = req.body.password === user.password;
		if (result) {
			req.session.email = user.email;
			req.session.email = user.username;
			req.session.user = user.userType;
			if (user.userType === 'Professor') {
				res.render('profile');
			  } else  {
				res.render('secret');
			  }
		} else {
			res.status(400).json({ error: "password doesn't match" });
		}
		} else {
		res.status(400).json({ error: "User doesn't exist" });
		}
	} catch (error) {
		res.status(400).json({ error });
	}
});


// Route to display user profile
// app.get('/profile', (req, res) => {
// 	const userId = req.session.userId; // get the user ID from the session
// 	User.findById(userId, (err, user) => {
// 	  if (err) {
// 		console.log(err);
// 		res.status(500).send('Error fetching user from database');
// 	  } else {
// 		res.render('profile', { user: user });
// 	  }
// 	});
//   }); 


  // Route to handle the submission of additional user details
app.post('/profile/additional-details', (req, res) => {
	const userId = req.session.id; // get the user ID from the session
	User.findById(userId, (err, user) => {
	  if (err) {
		console.log(err);
		res.status(500).send('Error fetching user from database');
	  } else {
		user.studentId = req.body.studentId;
		user.qualification = req.body.qualification;
		user.institute = req.body.institute;
		user.gender = req.body.gender;
		user.bloodGroup = req.body.bloodGroup;
		user.yearOfGraduation = req.body.yearOfGraduation;
  
		user.save((err) => {
		  if (err) {
			console.log(err);
			res.status(500).send('Error updating user in database');
		  } else {
			res.redirect('/profile');
		  }
		});
	  }
	});
  });
  




//Handling user logout
app.get("/logout", function (req, res) {
	req.logout(function(err) {
		if (err) { return next(err); }
		res.redirect('/');
	});
});



// Function to check if the user is authenticated
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

app.get('/allPublications', async (req, res) => {
	try {
	  const docs = await Publication.find();
	  res.render("allPublications", {
		list: docs
	  });
	} catch (err) {
	  console.log('Error in retrieving publication list: ' + err);
	}
  });

// app.use('/', publicationController);
app.use('/', (req, res, next) => {
	req.session = req.session || {};
	req.session.email = req.session.email || null;
	publicationController(req, res, next);
  });
// Routes


  

var port = process.env.PORT || 3000;
app.listen(port, function () {
	console.log("Server Has Started!");
});





