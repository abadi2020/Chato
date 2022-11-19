import model from "../models/database";

async function updateProfile(user) {
  await model.updateDocument("users", user);
}

export default {
  updateProfile
};
