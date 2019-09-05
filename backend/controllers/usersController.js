const usersData = require('../data/usersData');
const usersValidator = require('../validators/usersValidator');
const { ValidationError } = require('../errors/errors.js');

async function postUser(req, res, next) {
  try {
    await usersValidator.postUser(req);

    const result = await usersData.postUser(req);
    res.status(200).json(result);
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(422).json({ error });
    }
    res.status(500).json({ error });
  }
}
exports.postUser = postUser;

async function getUsers(req, res) {
  try {
    // no validation
    const users = await usersData.getUsers(req);
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ error });
  }
}
exports.getUsers = getUsers;

async function findUserById(req, res) {
  try {
    const result = await usersData.findUserById(req);
    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ error });
  }
}
exports.findUserById = findUserById;

async function updateUser(req, res, next) {
  try {
    const result = await usersData.updateUserById(req);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
exports.updateUser = updateUser;

async function login(req, res, next) {
  try {
    const result = await usersData.login(req, res);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
exports.login = login;
