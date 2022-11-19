import model from "../models/database";
import CryptoJS from "crypto-js";

function encrypt(message) {
  return CryptoJS.AES.encrypt(message, process.env.REACT_APP_KEY).toString();
}

function decrypt(message) {
  return CryptoJS.AES.decrypt(
    message.toString(),
    process.env.REACT_APP_KEY
  ).toString(CryptoJS.enc.Utf8);
}

async function addConversation(data) {
  model.pushData("chats", data);
}

async function addMessage(id, element, emptyConv) {
  if (!emptyConv) model.addToMessageArray("chats", id, element);
  else model.addField("chats", id, element);
}

async function getConvData(value) {
  return await model.getByID("chats", value);
}

async function getConversations(user) {
  return model.getByArrayValue("chats", "participants", user.email);
}

async function deleteConversation(id, email) {
  model.DeleteFromParticipantsArray(id, email);
}

async function deleteConversationMsg(id, index) {
  model.DeleteFromMsgArray(id, index);
}

async function updateParticipants(id, newParticipants) {
  model.SetParticipantsArray(id, newParticipants);
}

export default {
  addConversation,
  getConversations,
  addMessage,
  getConvData,
  encrypt,
  decrypt,
  deleteConversation,
  deleteConversationMsg,
  updateParticipants
};
