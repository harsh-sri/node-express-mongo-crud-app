var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override'); // used to manipulate POST

router.use(bodyParser.urlencoded({ extended: true }))
router.use(methodOverride(function(req, res){
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
      }
}))


/* GET users listing. */
router.route('/')
      // get all users
      .get(function(req, res, next){
        // retrive all users from Mongo
        mongoose.model('User').find({}, function(err, users){
          if(err){
            return console.error(err);
          }else{
            // respond to both html and json, JSON requires 'Accept: application/json' in header
            res.format({
              // html response will render the index.jade file in views/users
              html: function(){
                res.render('users/index', {
                  title: 'All users',
                  'users': users
                });
              },
              // Json response wil show all users in json formats
              json: function(){
                res.json(users);
              }
            });
          }
        });
      })
      
      // POST a new user
      .post(function(req, res){
          // get values from POST request
          var name = req.body.name;
          var email = req.body.email;
          var phone = req.body.phone;
          var active= req.body.active;

          // call the create function of our DB
          mongoose.model('User').create({
            name: name,
            email:email,
            phone:phone,
            active:active
          }, function(err, user){
            if(err){
              res.send('There is some problem while adding information to our db');
            }else{
              // User has been created
              console.log('adding user into our db');
              res.format({
                html: function(){
                  // if it worked, set the header so that address bar doesn't still say /adduser
                  res.location('Users');
                  // and forward to success page
                  res.redirect('/users');
                },

                json: function(){
                  res.json(user);
                }
              })
            }
          })
      })


router.get('/new', function(req, res){
  res.render('users/new', {title:'Add New User'});
});


// route middleware to validate :id
router.param('id', function(req, res, next, id) {
  //console.log('validating ' + id + ' exists');
  //find the ID in the Database
  mongoose.model('User').findById(id, function (err, blob) {
      //if it isn't found, we are going to repond with 404
      if (err) {
          console.log(id + ' was not found');
          res.status(404)
          var err = new Error('Not Found');
          err.status = 404;
          res.format({
              html: function(){
                  next(err);
               },
              json: function(){
                     res.json({message : err.status  + ' ' + err});
               }
          });
      //if it is found we continue on
      } else {
          //uncomment this next line if you want to see every JSON document response for every GET/PUT/DELETE call
          //console.log(blob);
          // once validation is done save the new item in the req
          req.id = id;
          // go to the next thing
          next(); 
      } 
  });
});


router.route('/:id')
        .get(function(req, res){
            mongoose.model('User').findById(req.id, function(err, user){
              if(err){
                console.log('Get Error: there was a problem '+err);
              }else{
                console.log('GET Retrieving ID: '+ user._id);
                res.format({
                  html: function(){
                    res.render('users/show',{
                      'user':user
                    });
                  },
                  json: function(){
                    res.json(user);
                  }
                })
              }
            });
        });


router.get('/:id/edit', function(req, res){
  // search for the user within mongo
  mongoose.model('User').findById(req.id, function(err, user){
    if(err){
      console.log('GET Error: There was a poblem retriving... '+ err);
    }else{
      // return the user
      console.log('GET retriving Id: '+ user._id);
      res.format({
        html: function(){
          res.render('users/edit', {
            title: 'Update User Details',
            'user':user
          })
        },

        json: function(){
          res.json(user);
        }

      });
    }
  })
});

router.put('/:id/edit', function(req, res){
  // Get form values
  var name = req.body.name;
  var email = req.body.email;
  var phone = req.body.phone;
  var active = req.body.active;

  // find the document by Id
  mongoose.model('User').findById(req.id, function(err, user){
      if(err){
        console.log('There was a problem while updating the db');
      }else{
        user.update({
          name: name,
          email: email,
          phone:phone,
          active: active
        }, function(err, userID){
          if(err){
            res.send('There was a problem');
          }else{
            res.format({
              html: function(){
                res.redirect('/users/'+user._id);
              },
              json: function(){
                res.json(user);
              }
            })
          }
        });
      }
  })
})




module.exports = router;
