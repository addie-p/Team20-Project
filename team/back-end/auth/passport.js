const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const { User } = require('../model/UserModel');


passport.use(
   new LocalStrategy(async (username, password, done) => {
       try {
           const user = await User.findOne({ where: { username } });
           if (!user) return done(null, false, { message: 'Incorrect username' });


           const isValidPassword = await bcrypt.compare(password, user.password);
           if (!isValidPassword) return done(null, false, { message: 'Incorrect password' });


           return done(null, user);
       } catch (error) {
           return done(error);
       }
   })
);

// serialize user instance to store user id
passport.serializeUser((user, done) => done(null, user.id));

// deserialize user instance from session by id
passport.deserializeUser(async (id, done) => {
   try {
       const user = await User.findByPk(id);
       done(null, user);
   } catch (error) {
       done(error);
   }
});


module.exports = passport;


