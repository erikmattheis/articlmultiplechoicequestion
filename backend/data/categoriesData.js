const { Category } = require('./categoriesSchema');

const cache = require('../cache');
// const timer = require('../utils/timer');
// const memory = require('../utils/memory');

/*
function trimValues() {
  const batch = [];
  Category.find({ title: /^\s+|\s+$/ }, { title: 1 }).then(title => {
    title.forEach(function doTrim(doc) {
      batch.push({
        updateOne: {
          filter: { _id: doc._id },
          update: { $set: { title: doc.title.trim() } }
        }
      });
    });

    Category.bulkWrite(batch);
  });
}

trimValues();
*/

async function getCategoryNames() {
  try {
    let categoryNames = await cache.getValue('categoryNames');
    if (categoryNames) {
      return Promise.resolve(categoryNames);
    }
    categoryNames = await Category.distinct('title').exec();
    cache.setValue('categoryNames', categoryNames);
    return Promise.resolve(categoryNames);
  } catch (error) {
    throw error;
  }
}
module.exports.getCategoryNames = getCategoryNames;

async function getCategories() {
  try {
    const category = await Category.find();
    return category;
  } catch (error) {
    throw error;
  }
}
exports.getCategories = getCategories;

async function getAllCategories() {
  try {
    const categories = await Category.find();
    return categories;
  } catch (error) {
    throw error;
  }
}
module.exports.getAllCategories = getAllCategories;

async function getCategoriesbyTitle(req) {
  try {
    const categories = await Category.find({ title: req.body.category });

    return categories;
  } catch (error) {
    throw error;
  }
}
module.exports.getCategoriesbyTitle = getCategoriesbyTitle;

async function postCategory(req) {
  try {
    const category = new Category(req.body);
    const result = await category.save();
    return result;
  } catch (error) {
    throw error;
  }
}
module.exports.postCategory = postCategory;

async function deleteCategoryByTitle(req) {
  try {
    if (process.env.NODE_ENV !== 'development') {
      const error = await new Error(
        'deleteQuestion may only be used in development! To start the app in development mode, run gulp.'
      );
      return error;
    }
    await Category.deleteOne({ title: req.query.title });
    return 'Successfully deleted questions!';
  } catch (error) {
    throw error;
  }
}
exports.deleteCategoryByTitle = deleteCategoryByTitle;
