const express = require("express");
const siteController = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


siteController.get("/", (req, res, next) => {
  res.render("index");

});

function checkRoles(role) {
  return function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    } else {
      res.redirect('/login')
    }
  }
}

siteController.get('private', (req, res) => {
  res.render('/private', {user: req.user});
});

siteController.get('/prioracess', (req,res,next) => {
  res.render('prioracess');
});


function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login')
  }
}
siteController.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});



siteController.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const role = req.body.role;

  if (username === "" || password === "") {
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }

    User.findOne({ username }, "username", (err, user) => {
      if (user !== null) {
        res.render("auth/signup", { message: "The username already exists" });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        username,
        password: hashPass,
        role,
      });

      newUser.save((err) => {
        if (err) {
          res.render("auth/signup", { message: "Something went wrong" });
        } else {
          if (role === 'Boss') {
          res.redirect('prioracess');
        } else {
          res.redirect("/");
          }
        }
      });
    });
  });

module.exports = siteController;
