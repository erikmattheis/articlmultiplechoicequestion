const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const GooglePlusTokenStrategy = require('passport-google-plus-token');
const FaceBookeTokenStrategy = require('passport-facebook-token');
const { User } = require('../data/usersSchema');

console.log('pass strategy');

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

// google oauth strategy
passport.use(
  'googleToken',
  new GooglePlusTokenStrategy(
    {
      clientID: process.env.GOOGLE_CLIENTID,
      clientSecret: process.env.GOOGLE_CLIENTSECRET
    },
    async (accessToken, refreshToken, profile, done) => {
      done(null, profile);
    }
  )
);

passport.use(
  'facebookToken',
  new FaceBookeTokenStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENTID,
      clientSecret: process.env.FACEBOOK_CLIENTSECRET
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log('profile', profile);
        done(null, profile);
      } catch (error) {
        done(error, false, error.message);
      }
    }
  )
);

// Create a passport middleware to handle User login
passport.use(
  'login',
  new LocalStrategy(
    {
      usernameField: 'login',
      passwordField: 'pass'
    },
    async (login, pass, done) => {
      try {
        const user = await User.findOne({ login });
        if (!user) {
          return done(null, false, { message: 'User not found' });
        }
        const validate = await user.isValidPassword(pass);
        if (!validate) {
          return done(null, false, { message: 'Wrong Password' });
        }
        return done(null, user, { message: 'Logged in Successfully' });
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  new JWTstrategy(
    {
      secretOrKey: 'top_secret',
      jwtFromRequest: ExtractJWT.fromUrlQueryParameter('secret_token')
    },
    async (token, done) => {
      try {
        done(null, token.user);
      } catch (error) {
        done(error);
      }
    }
  )
);
