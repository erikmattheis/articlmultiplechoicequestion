const paginate = require('express-paginate');
const { Question } = require('./questionsSchema');
const categoriesData = require('../data/categoriesData');

async function postQuestion(req) {
  try {
    const categories = await categoriesData.getCategoriesbyTitle(req);
    const question = new Question({
      answers: req.body.answers,
      author: req.user,
      category: categories,
      createTime: new Date(),
      question: req.body.question,
      updated: new Date()
    });
    const result = await question.save();
    return result;
  } catch (error) {
    throw error;
  }
}
exports.postQuestion = postQuestion;

/*
function updateQCategories() {
  Question.update(
    {},
    {
      $set: {
        category: {
          category_image: '',
          description: 'This description.',
          parent: 0,
          term_id: 9999999,
          title: 'Fake category'
        }
      }
    },
    { multi: true },
    function(error, properties) {
      console.log('error', error);
      console.log('epropertiesrror', properties);
    }
  );
}

updateQCategories();
*/
async function getQuestions(req) {
  req.query.sort = req.query.sort ? req.query.sort : 'updated';
  try {
    const opts = req.params.id ? { _id: req.params.id } : {};
    const [results, itemCount] = await Promise.all([
      Question.find(opts)
        .limit(req.query.limit)
        .skip(req.skip)
        .sort(req.query.sort)
        .lean()
        .exec(),
      Question.count({})
    ]);
    const pageCount = Math.ceil(itemCount / req.query.limit);

    return {
      has_more: paginate.hasNextPages(req)(pageCount),
      questions: results
    };
  } catch (error) {
    throw error;
  }
}
exports.getQuestions = getQuestions;

async function deleteQuestions() {
  try {
    if (process.env.NODE_ENV !== 'development') {
      const error = await new Error(
        'deleteQuestion may only be used in development! To start the app in development mode, run gulp.'
      );
      return error;
    }
    await Question.remove();
    return 'Successfully deleted questions!';
  } catch (error) {
    throw error;
  }
}
exports.deleteQuestions = deleteQuestions;

async function findQuestionById(req) {
  try {
    const results = await Question.find({ _id: req.params.id });
    return {
      message: 'success',
      questions: results
    };
  } catch (error) {
    throw error;
  }
}
exports.findQuestionById = findQuestionById;

async function findQuestionByAuthor(req) {
  const regAuthor = RegExp(req.query.author, 'i');
  try {
    const results = await Question.find({
      author: {
        $regex: regAuthor
      }
    });
    return {
      message: 'success',
      questions: results
    };
  } catch (error) {
    throw error;
  }
}
exports.findQuestionByAuthor = findQuestionByAuthor;

async function findQuestionByCategory(req) {
  const reg = RegExp(req.query.category, 'i');
  try {
    const results = await Question.find({
      $or: [{ 'category.title': { $regex: reg } }, { 'category.description': { $regex: reg } }]
    });
    return {
      message: 'success',
      questions: results
    };
  } catch (error) {
    throw error;
  }
}
exports.findQuestionByCategory = findQuestionByCategory;

async function findQuestionAllMeeting(req) {
  console.log(`try to find: ${req.query.find}`);
  try {
    const results = await Question.find({
      $text: {
        $search: req.query.find
      }
    });
    return {
      message: 'success',
      questions: results
    };
  } catch (error) {
    throw error;
  }
}
exports.findQuestionAllMeeting = findQuestionAllMeeting;

async function updateQuestionById(req) {
  try {
    const categories = await categoriesData.getCategoriesbyTitle(req);
    const updateItems = req.body;
    updateItems.updated = new Date();
    updateItems.category = categories;
    const result = await Question.updateOne({ _id: req.params.id }, updateItems);
    return {
      message: 'success',
      questions: result
    };
  } catch (error) {
    throw error;
  }
}
exports.updateQuestionById = updateQuestionById;
