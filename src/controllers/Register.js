import model from "../models/database";

function validateEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}

function registerUser(email, name, password, userData) {
  if (validateEmail(email))
    model
      .signUp(email, password)
      .then(() => {
        model.pushData("users", userData);
        alert("Signed up. Please log in with your email and password.");
        return true;
      })
      .catch(error => {
        let errorCode = error.code;
        let errorMessage = error.message;
        if (errorCode === "auth/weak-password") {
          alert("The password is too weak.");
        } else {
          alert(errorMessage);
        }
        console.log(error);
      });
  else alert("Invalid data");
}

export default {
  registerUser
};
