const { check, validationResult } = require('express-validator');
const { ValidationError } = require('../errors/errors.js');

async function postUser(req) {
  try {
    Promise.all([
      await check('login')
        .isLength({
          min: 3
        })
        .withMessage('Your User must have a login content at least 3 characters long.')
        .escape()
        .run(req),
      await check('pass').run(req),
      await check('nicename')
        .isLength({
          min: 3
        })
        .withMessage('Your User must have a nicename content at least 3 characters long.')
        .escape()
        .run(req),
      await check('avatar')
        .isURL()
        .withMessage('Your url is not valid.')
        .run(req),
      await check('email')
        .isEmail()
        .withMessage('Your email is not valid.')
        .escape()
        .run(req),
      await check('url')
        .optional()
        .isURL()
        .withMessage('Your url is not valid.')
        .escape()
        .run(req),
      await check('level')
        .isNumeric()
        .withMessage('Your level should be numeric.')
        .escape()
        .run(req),
      await check('first')
        .optional()
        .escape()
        .run(req),
      await check('last')
        .optional()
        .escape()
        .run(req),
      await check('education')
        .optional()
        .escape()
        .run(req),
      await check('institution')
        .optional()
        .escape()
        .run(req),
      await check('specialty')
        .optional()
        .escape()
        .run(req),
      await check('institution')
        .optional()
        .escape()
        .run(req),
      await check('specialty')
        .optional()
        .escape()
        .run(req),
      await check('sub-specialty')
        .optional()
        .escape()
        .run(req),
      await check('deleted')
        .isBoolean()
        .withMessage('Your deleted tag should be boolean.')
        .run(req)
    ]);

    const invalid = validationResult(req);
    if (!invalid.isEmpty()) {
      const validationErrorPromise = new ValidationError(invalid.array());
      return Promise.reject(validationErrorPromise);
    }
    return true;
  } catch (error) {
    throw error;
  }
}
exports.postUser = postUser;
