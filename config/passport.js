var passport = require('passport');
var GitHubStrategy = require('passport-github2').Strategy;
var User = require('../models/User')

console.log(process.env.GITHUB_CLIENT_ID)

passport.use(new GitHubStrategy({
    clientID: '9b8689510f1da6d56dd5',
    clientSecret: 'f2ff34bf2c6353033bb1f4cb3f656bc713db0219',
    callbackURL: "http://localhost:3000/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log("in")
    console.log(process.env.GITHUB_CLIENT_ID)
    console.log(process.env.GITHUB_CLIENT_SECRET)
    User.findOne({ 'githubId': profile.id }, function(err, student) {
      if (err) return cb(err);
      if (student) {
        return cb(null, student);
      } else {
        // we have a new student via OAuth!
        console.log(profile)
        var newUser = new User({
          fullName: profile.username,
          githubId: profile.id
        });
        console.log(newUser)
        newUser.save(function(err) {
          if (err) return cb(err);
          return cb(null, newUser);
        });
      }
    });
  }
));


 passport.serializeUser(function(student, done) {
     done(null, student.id);
 });


 passport.deserializeUser(function(id, done) {
   User.findById(id, function(err, student) {
     done(err, student);
   });
 });