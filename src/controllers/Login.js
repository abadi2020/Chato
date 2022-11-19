import model from "../models/database";

async function loginUser(email, password) {
  return await model.signIn(email, password);
}

async function getUsers() {
  return await model.getAllData("users");
}

async function getUser(email) {
  return await model.getByField("users", "email", email);
}

function listenToAuth() {
  return model.statusChanged();
}

export default {
  loginUser,
  listenToAuth,
  getUsers,
  getUser
};
