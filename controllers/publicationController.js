const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Publication = mongoose.model('Publication');


router.use(express.urlencoded({ extended: true }));

// Adding middleware to retrieve session data
router.use((req, res, next) => {
  // Retrieve session data and make it available to the route handler
  req.sessionID = {
    email: req.session.email,
    username: req.session.username
  };
  next();
});

router.get('/addOrEdit', (req, res) => {
  const email = req.session.email; // Access the session information
  if (!email) {
    // Redirect to the sign-in page or handle unauthorized access
    res.redirect('/signin');
    return;
  }
  res.render("addOrEdit", {
    viewTitle: "Insert Publication",
    publication: new Publication()
  });
});

function insertRecord(req, res) {
  const publication = new Publication();
  publication.username = req.body.username;
  publication.email = req.body.email;
  publication.url = req.body.url;
  publication.topic = req.body.topic;
  publication.keywords = req.body.keywords;
  publication.save()
    .then(() => {
      res.redirect('/list');
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        handleValidationError(err, req.body);
        res.render('addOrEdit', {
          viewTitle: 'Insert Publication',
          publication: req.body,
        });
      } else {
        console.log('Error during record insertion: ' + err);
        res.status(500).send('Error during record insertion');
      }
    });
}

router.post('/addOrEdit', (req, res) => {
  if (!req.body._id) {
    insertRecord(req, res);
  } else {
    updateRecord(req, res);
  }
});

router.get('/list', async (req, res) => {
  try {
    const email = req.query.email;
    const publications = await Publication.find({ email }).exec();
    res.render('list', { list: publications });
  } catch (error) {
    console.log('Error in retrieving publication list: ' + error);
  }
});




// router.get('/allPublications', async (req, res) => {
//   try {
//     const docs = await Publication.find();
//     res.render("allPublications", {
//       list: docs
//     });
//   } catch (err) {
//     console.log('Error in retrieving publication list: ' + err);
//   }
// });



function handleValidationError(err, body) {
  for (field in err.errors) {
    switch (err.errors[field].path) {
      case 'username':
        body['usernameError'] = err.errors[field].message;
        break;
      case 'email':
        body['emailError'] = err.errors[field].message;
        break;
      case 'url':
        body['urlError'] = err.errors[field].message;
        break;
      default:
        break;
    }
  }
}

async function updateRecord(req, res) {
  try {
    const { _id, email, ...remainingFields } = req.body;
    const filter = { _id };
    const update = { $set: { email, ...remainingFields } };
    const options = { new: true, upsert: true };

    const updatedDoc = await Publication.findOneAndUpdate(filter, update, options);
    res.redirect('/list');
  } catch (err) {
    if (err.name === 'ValidationError') {
      handleValidationError(err, req.body);
      res.render('addOrEdit', {
        viewTitle: 'Update Publication',
        publication: req.body
      });
    } else if (err.name === 'MongoServerError' && err.code === 11000) {
      // Duplicate key error handling
      handleDuplicateKeyError(err, req, res);
    } else {
      console.log('Error during record update: ' + err);
    }
  }
}

function handleDuplicateKeyError(err, req, res) {
  const field = err.message.match(/index: ([A-z]+)_/)[1];
  const message = `The ${field} is already taken.`;

  // Retrieve the existing publication for the given username
  Publication.findOne({ username: req.body.username }, (err, existingPublication) => {
    if (err || !existingPublication) {
      console.log('Error during duplicate key error handling: ' + err);
      res.status(500).send('Error during record update');
    } else {
      // Update the existing publication with the new data
      existingPublication.email = req.body.email;
      existingPublication.url = req.body.url;

      existingPublication.save((err) => {
        if (err) {
          console.log('Error during duplicate key error handling: ' + err);
          res.status(500).send('Error during record update');
        } else {
          res.redirect('/list');
        }
      });
    }
  });
}



// Handle favicon.ico request
router.get('/favicon.ico', (req, res) => res.status(204));


router.get('/:id', async (req, res) => {
  try {
    const doc = await Publication.findById(req.params.id).exec();
    res.render("addOrEdit", {
      viewTitle: "Update Publication",
      publication: doc
    });
  } catch (err) {
    console.log('Error in fetching publication: ' + err);
  }
});

router.get('/delete/:id', async (req, res) => {
  try {
    await Publication.findByIdAndRemove(req.params.id).exec();
    res.redirect('/list');
  } catch (err) {
    console.log('Error in deleting publication: ' + err);
  }
});

module.exports = router;






// router.post('/addOrEdit', (req, res) => {
//         insertRecord(req, res);
// });


// var multer = require('multer');

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, './uploads');
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.fieldname + "-"+ Date.now() + path.extname(file.originalname));
//   },
// });

// const storage = multer.memoryStorage();

// const fileFilter = (req, file, cb) => {
//   if (file.mimetype == 'application/pdf') {
//     cb(null, true);
//   } else {
//     cb(new Error('Invalid file type. Only PDF files are allowed.'));
//   }
// };

// const upload = multer({
//   storage: storage,
//   fileFilter: fileFilter,
//   limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit 10 * 1024 * 1024
// });



// router.get('/:id', (req, res) => {
//   Publication.findById(req.params.id, (err, doc) => {
//       if (!err) {
//           res.render("addOrEdit", {
//               viewTitle: "Update Publication",
//               publication: doc
//           });
//       }
//   });
// });

// router.get('/delete/:id', (req, res) => {
//   Publication.findByIdAndRemove(req.params.id, (err, doc) => {
//       if (!err) {
//           res.redirect('list');
//       }
//       else { console.log('Error in Publication delete :' + err); }
//   });
// });


// async function updateRecord(req, res) {
//   try {
//     const updatedDoc = await Publication.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true });
//     res.redirect('/list');
//   } catch (err) {
//     if (err.name === 'ValidationError') {
//       handleValidationError(err, req.body);
//       res.render('addOrEdit', {
//         viewTitle: 'Update Publication',
//         publication: req.body
//       });
//     } else {
//       console.log('Error during record update : ' + err);
//     }
//   }
// }

//   router.post('/addOrEdit', (req, res) => {
//     if (req.body._id == '')
//     insertRecord(req, res);
//     else
//     updateRecord(req, res);
// });

// res.json('from list');

// app.get("/list", isLoggedIn, async (req, res) => {
//   try {
//       const docs = await publication.find({ email: req.user.email }); // Fetch publications based on the user's email
//       res.render("list", {
//           list: docs
//       });
//   } catch (err) {
//       console.log('Error in retrieving publication list: ' + err);
//   }
// });

// router.get('/list', async (req, res) => {
//   try {
//     const user = req.user; // Get the currently logged-in user
//     const docs = await Publication.find({ email: user.email }).exec(); // Fetch publications based on the user's email
//     res.render("list", {
//       list: docs
//     });
//   } catch (err) {
//     console.log('Error in retrieving publication list: ' + err);
//   }
// });

// router.get('/list', async (req, res) => {
//   try {
//     const user = req.user; 
//     const docs = await Publication.find({ email: user.email }); // Fetch publications based on the user's email
//     res.render("list", {
//       list: docs
//     });
//   } catch (err) {
//     console.log('Error in retrieving publication list: ' + err);
//   }
// });
