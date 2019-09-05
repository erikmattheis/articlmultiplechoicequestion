const jwt = require('jsonwebtoken');
const { User } = require('./usersSchema');

async function postUser(req) {
  try {
    const user = new User(req.body);
    const result = await user.save();
    return result;
  } catch (error) {
    throw error;
  }
}
exports.postUser = postUser;

async function findUserById(req) {
  try {
    const results = await User.find({ _id: req.params.id });
    return {
      message: 'success',
      questions: results
    };
  } catch (error) {
    throw error;
  }
}
exports.findUserById = findUserById;

async function getUsers(req) {
  try {
    const results = await User.find();
    return {
      message: 'success',
      questions: results
    };
  } catch (error) {
    throw error;
  }
}
exports.getUsers = getUsers;

async function updateUserById(req) {
  try {
    const updateItems = req.body;
    const result = await User.updateOne({ _id: req.params.id }, updateItems);
    return {
      message: 'success',
      questions: result
    };
  } catch (error) {
    throw error;
  }
}
exports.updateUserById = updateUserById;

async function login(req) {
  try {
    const user = {
      // eslint-disable-next-line no-underscore-dangle
      _id: req.user._id,
      login: req.user.login
    };
    const token = jwt.sign({ user }, 'top_secret');
    return {
      token
    };
  } catch (error) {
    throw error;
  }
}
exports.login = login;
