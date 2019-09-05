const { check, validationResult } = require('express-validator');
const { getCategoryNames, getCategoryTermId } = require('../data/categoriesData');
const { ValidationError } = require('../errors/errors.js');

async function getCategoriesByTitle(req) {
  try {
    // const categoryNames = await getCategoryNames();
    Promise.all([
      await check('title')
        .not()
        .isEmpty()
        .withMessage('You must specify a title.')
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
exports.getCategoriesByTitle = getCategoriesByTitle;

async function postCategory(req) {
  try {
    const categoryNames = await getCategoryNames();
    const categoryTermId = await getCategoryTermId();
    Promise.all([
      await check('description')
        .not()
        .isEmpty()
        .withMessage('Your User must have a description.')
        .isLength({
          min: 5
        })
        .withMessage('Your User must have a description content at least five characters long.')
        .escape()
        .run(req),
      await check('parent')
        .not()
        .isEmpty()
        .withMessage('Your User must have a parent.')
        .isNumeric()
        .withMessage('Your parent musbe be number(term_if of other category).')
        .custom(num => {
          // const num = parseInt(value, 10);
          if (num !== 0 && categoryTermId.indexOf(num) === -1) {
            throw new Error(`Your parent ${num} should exist or set to 0，`);
          }
          return true;
        })
        .run(req),
      await check('title')
        .not()
        .isEmpty()
        .withMessage('Your category must have a title.')
        .escape()
        .custom(value => {
          if (categoryNames.indexOf(value) === -1) {
            return true;
          }
          throw new Error(`Your title: '${value}' in categories already exists.`);
        })
        .run(req),
      await check('category_image')
        .optional()
        .isURL()
        .withMessage('Category image must be a valid url or left empty.')
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
exports.postCategory = postCategory;
