const express = require('express');
const passport = require('passport');

const { categoriesController, questionsController, usersController } = require('../controllers');
const { FileNotFoundError, DatabaseError } = require('../errors/errors.js');

const router = express.Router();

module.exports = router;

// get error
// const oauthStartegy = new OAuth2Strategy(
//   {
//     authorizationURL: 'https://articl.net/oauth/authorize/',
//     callbackURL: 'https://api.articl.net/oauth2callback',
//     clientID: 'tgj1Hp9lRgxAfj7yQ9iRIzZoq2WrlZsPgLRXb0i3',
//     clientSecret: 'hPDw9L5ZUnQDWQ1nSXOeXg3d2UaeVticiVJsHOrC',
//     passReqToCallback: false,
//     tokenURL: 'https://articl.net/oauth/token/'
//   },
// // eslint-disable-next-line func-names
//   function(req, accessToken, refreshToken, params, profile, done) {
//     done(null, profile);
//   }
// );

// no response too
// passport.use(oauthStartegy);

// passport.use('oauth', oauthStartegy);

// get no response
// passport.use(
//   new OAuth2Strategy(
//     {
//       authorizationURL: 'https://articl.net/oauth/authorize/',
//       callbackURL: 'https://api.articl.net/oauth2callback',
//       clientID: 'tgj1Hp9lRgxAfj7yQ9iRIzZoq2WrlZsPgLRXb0i3',
//       clientSecret: 'hPDw9L5ZUnQDWQ1nSXOeXg3d2UaeVticiVJsHOrC',
//       tokenURL: 'https://articl.net/oauth/token/'
//     },
//     function(req, accessToken, refreshToken, params, profile, done) {
//       done(null, profile);
//     }
//   )
// );

router.get('/categories', categoriesController.getCategories);

router.post('/categories', categoriesController.postCategory);

router.delete('/categories', categoriesController.deleteCategories);

router.get('/questions', questionsController.getQuestions);

// router.post('/questions', passport.authenticate('jwt', { session: false }), questionsController.postQuestion);

router.get('/questions/:id', async function handler(req, res, next) {
  try {
    questionsController.getQuestions(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.post('/questions', passport.authenticate('jwt', { session: false }), async function handler(req, res, next) {
  try {
    questionsController.postQuestion(req, res, next);
  } catch (error) {
    next(error);
  }
});
router.get('/questions/:id', questionsController.findQuestionById);

router.put('/questions/:id', questionsController.updateQuestion);

// router.post('/questions', passport.authenticate('oauth2'), questionsController.postQuestion);
// router.post('/questions', passport.authenticate('jwt', { session: false }), questionsController.postQuestion);

router.post('/users', usersController.postUser);

router.get('/users', passport.authenticate('jwt', { session: false }), usersController.getUsers);

router.get('/users/:id', usersController.findUserById);

router.put('/users/:id', usersController.updateUser);

router.post('/login', passport.authenticate('login'), usersController.login);

router.post('/oauth/google', passport.authenticate('googleToken', { session: false }), usersController.getUsers);

router.post('/oauth/facebook', passport.authenticate('facebookToken', { session: false }), usersController.getUsers);
// only be used in development
router.delete('/questions', questionsController.deleteQuestions);

/*
router.use((req, res) => {
  console.log('everything worked!', res.body);
  res.status(200).send({ res });
});

router.use((error, req, res, next) => {
  if (error instanceof MongoError) {
    res.status(503).json({
      type: 'MongoError',
      message: error.message
    });
  }
  next(error);
});


*/
/*
router.all('*', (req, res) => {
  const error = new FileNotFoundError();
  res.status(404).json({ error });
});
*/
router.use((req, res) => {
  res.status(500).json({ errors: ['An unknown error occurred.'] });
});

router.use((err, req, res, next) => {
  console.log('`MESSAGE: ', err.message);
  const error = err;
  if (!error.statusCode) {
    error.statusCode = 500;
  }
  res.status(err.statusCode).send({ errors: error });
  next();
});

router.use((error, req, res, next) => {
  console.log('caught last');
  let result = error;
  if (error.name === 'MongoError') {
    result = new DatabaseError(error.errmsg);
  }
  res.status(500).json({ result });
});

router.use((req, res, next) => {
  console.log('404 caught here');
  const error = new FileNotFoundError();
  res.status(404).json({ error });
});
