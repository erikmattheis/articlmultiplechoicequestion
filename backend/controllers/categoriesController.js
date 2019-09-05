const categoriesData = require('../data/categoriesData');
const categoriesValidator = require('../validators/categoriesValidator');
const { ValidationError } = require('../errors/errors.js');

async function postCategory(req, res) {
  try {
    await categoriesValidator.postCategory(req);

    const insertionResult = await categoriesData.postCategory(req);
    res.status(201).json({ question: insertionResult, success: 'success' });
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(422).json({ error });
    }
    res.status(500).json({ error });
  }
}
exports.postCategory = postCategory;

async function getCategories(req, res, next) {
  try {
    let result = '';
    if (req.query.title) {
      result = await categoriesData.getCategoriesbyTitle(req);
    } else {
      result = await categoriesData.getCategoryNames();
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
exports.getCategories = getCategories;

async function deleteCategories(req, res) {
  try {
    const result = await categoriesData.deleteCategoryByTitle(req);
    if (result instanceof Error) {
      res.status(405).json(result);
    } else {
      res.status(200).json({ result });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
}
exports.deleteCategories = deleteCategories;
