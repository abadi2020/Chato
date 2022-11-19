import firebase from "firebase";

// Initialize Firebase
const config = {
  apiKey: "AIzaSyB98GnBna4bPyHd_j5B5hiZIHS8nRq8yHw",
  authDomain: "chato-ed3ba.firebaseapp.com",
  databaseURL: "https://chato-ed3ba.firebaseio.com",
  projectId: "chato-ed3ba",
  storageBucket: "chato-ed3ba.appspot.com",
  messagingSenderId: "386854783290",
  appId: "1:386854783290:web:468631cb9ecd83293ba803",
  measurementId: "G-BCQDQP6553"
};
firebase.initializeApp(config);

//register user
const signUp = (email, password) =>
  firebase.auth().createUserWithEmailAndPassword(email, password);

//log in
const signIn = (email, password) =>
  firebase.auth().signInWithEmailAndPassword(email, password);

const statusChanged = () =>
  firebase.auth().onAuthStateChanged(user => {
    return user;
  });

const pushEmpty = (collection, data) => {
  firebase
    .firestore()
    .collection(collection)
    .add(data)
    .then(() => console.log("Successfully added"))
    .catch(() => console.log("Error adding"));
};

const pushData = (collection, data) => {
  firebase
    .firestore()
    .collection(collection)
    .add(data)
    .then(() => console.log("Successfully added"))
    .catch(() => console.log("Error adding"));
};

const getAllData = collection => {
  let documents = [];
  firebase
    .firestore()
    .collection(collection)
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        documents.push(doc.data());
      });
    })
    .catch(err => {
      console.log("Error getting documents", err);
    });

  return documents;
};

const getByArrayValue = async (collection, field, value) => {
  let data = [];
  await firebase
    .firestore()
    .collection(collection)
    .where(field, "array-contains", value)
    .get()
    .then(snapshot => {
      if (snapshot.empty) {
        console.log("No matching documents.");
        return;
      }

      snapshot.docs.map(function(snapshot) {
        let obj = {};
        obj = snapshot.data();
        obj["id"] = snapshot.id;
        data.push(obj);
      });
    })
    .catch(err => {
      console.log("Error getting documents", err);
    });
  return data;
};

const getByID = async (collection, value) => {
  let data = {};
  await firebase
    .firestore()
    .collection(collection)
    .get()
    .then(snapshot => {
      if (snapshot.empty) {
        console.log("No matching documents.");
        return;
      }

      snapshot.docs.map(function(snapshot) {
        if (snapshot.id === value) {
          data = snapshot.data();
          data["id"] = snapshot.id;
        }
      });
    })
    .catch(err => {
      console.log("Error getting documents", err);
    });

  console.log(data);
  return data;
};

const getByField = async (collection, field, value) => {
  let data = {};
  await firebase
    .firestore()
    .collection(collection)
    .where(field, "==", value)
    .get()
    .then(snapshot => {
      if (snapshot.empty) {
        console.log("No matching documents.");
        return;
      }

      snapshot.docs.map(function(snapshot) {
        data = snapshot.data();
        data["id"] = snapshot.id;
      });
    })
    .catch(err => {
      console.log("Error getting documents", err);
    });

  return data;
};

const getId = (collection, field, value) => {
  let id = [];

  firebase
    .firestore()
    .collection(collection)
    .where(field, "==", value)
    .get()
    .then(snapshot => {
      if (snapshot.empty) {
        console.log("No matching documents.");
        return;
      }

      snapshot.forEach(doc => {
        id.push(doc.id);
      });
    });

  return id;
};

const addToMessageArray = (collection, id, element) => {
  // let msg = {};
  firebase
    .firestore()
    .collection(collection)
    .doc(id)
    .update({
      message: firebase.firestore.FieldValue.arrayUnion(element)
    })
    .then(() => {
      // getByID(collection, id).then((result) => {msg = result;});
      console.log("Updated Successfully !");
    })
    .catch(error => console.log(error));
  // return msg;
};

const addField = (collection, id, element) => {
  firebase
    .firestore()
    .collection(collection)
    .doc(id)
    .set(
      {
        message: firebase.firestore.FieldValue.arrayUnion(element)
      },
      { merge: true }
    )
    .then(() => console.log("Updated Successfully !"))
    .catch(error => console.log(error));
};

const DeleteFromParticipantsArray = (id, userid) => {
  firebase
    .firestore()
    .collection("chats")
    .doc(id)
    .update({
      participants: firebase.firestore.FieldValue.arrayRemove(userid)
    })
    .then(() => {
      console.log("Updated Successfully !" + userid);
    })
    .catch(error => console.log(error));
};

const SetParticipantsArray = (id, newParticipants) => {
  firebase
    .firestore()
    .collection("chats")
    .doc(id)
    .update({
      participants: newParticipants
    })
    .then(() => {
      console.log("Updated Successfully !");
    })
    .catch(error => console.log(error));
};
const DeleteFromMsgArray = (id, index) => {
  firebase
    .firestore()
    .collection("chats")
    .doc(id)
    .update({
      message: index
    })
    .then(() => {
      console.log("Deleted Successfully !");
    })
    .catch(error => console.log(error));
};

const updateDocument = (collection, data) => {
  let id = data.uid.toString();
  delete data.uid;
  //let id = data.email;
  firebase
    .firestore()
    .collection(collection)
    .doc(id)
    .set(data)
    .then(() => alert("Updated Successfully !"))
    .catch(error => alert(error));
};

export default {
  signUp,
  signIn,
  statusChanged,
  pushData,
  getAllData,
  updateDocument,
  getId,
  getByField,
  getByArrayValue,
  addToMessageArray,
  pushEmpty,
  addField,
  getByID,
  DeleteFromParticipantsArray,
  SetParticipantsArray,
  DeleteFromMsgArray
};
