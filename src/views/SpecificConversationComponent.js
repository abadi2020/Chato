import React, { Component, PureComponent } from "react";
import AppBar from "@material-ui/core/AppBar/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import {
  IconButton,
  MuiThemeProvider,
  TextField,
  Typography
} from "@material-ui/core";
import { Edit, Close, Send, Delete } from "@material-ui/icons";
import theme from "./theme";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ChatController from "../controllers/Chat";
import firebase from "firebase";
import "./Conversation.css";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css

import { GroupModal } from "./ManageGroupPar";

class SpecificConversationComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: this.props.open,
      user: this.props.user,
      conversationData: this.props.conversationData,
      participants: this.props.participants,
      message: "",
      participantsArr: this.props.conversationData.participants,
      AddingUserToGroup: ""
    };

    this.listenMessages();
  }

  listenMessages = () => {
    firebase
      .firestore()
      .collection("chats")
      .doc(this.props.conversationData.id)
      .onSnapshot(snapshot => {
        let obj = snapshot.data();
        obj["id"] = this.props.conversationData.id;
        if (obj.hasOwnProperty("message")) {
          for (let i = 0; i < obj.message.length; ++i) {
            obj.message[i].message = ChatController.decrypt(
              obj.message[i].message
            );
          }
        }
        this.setState({ conversationData: obj });
      });
  };

  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  sendParentSomeData = () => {
    this.props.closeFromConversation(false);
  };

  handleClose = () => {
    this.setState({ open: false });

    this.sendParentSomeData();
  };

  handleDelete = () => {
    ChatController.deleteConversation(
      this.state.conversationData.id,
      this.state.user.email
    );

    this.setState({ open: false });

    this.sendParentSomeData();
  };

  handleDeleteMsg = index => {
    this.state.conversationData.message.splice(index, 1);
    let msg = this.state.conversationData.message;
    for (let i = 0; i < msg.length; ++i) {
      msg[i].message = ChatController.encrypt(msg[i].message);
    }

    ChatController.deleteConversationMsg(this.state.conversationData.id, msg);
  };

  onMessageChange = e => {
    this.setState({ message: e.target.value });
  };

  onUserAddChange = e => {
    this.setState({ AddingUserToGroup: e.target.value });
  };

  onSendClicked = () => {
    let msg = ChatController.encrypt(this.state.message);

    let data = {
      from: this.state.user.email,
      message: msg,
      time: new Date()
    };

    if (this.state.conversationData.hasOwnProperty("message")) {
      ChatController.addMessage(this.state.conversationData.id, data, false);
      this.setState({ message: "" });
    } else {
      ChatController.addMessage(this.state.conversationData.id, data, true);
      this.setState({ message: "" });
    }
  };

  scrollToBottom() {
    const { thing } = this.refs;
    thing.scrollTop = thing.scrollHeight - thing.clientHeight;
  }

  deleteConversation = () => {
    confirmAlert({
      title: "Confirm to delete",
      message: "Are you sure you want to delete this conversation permanently?",
      buttons: [
        {
          label: "DELETE",
          onClick: () => this.handleDelete()
        },
        {
          label: "Cancel",
          onClick: () => alert("Deletion canceled.")
        }
      ]
    });
  };

  deleteMsg = msgIndex => {
    confirmAlert({
      title: "Confirm to delete",
      message: "Are you sure you want to delete this message permanently?",
      buttons: [
        {
          label: "DELETE",
          onClick: () => this.handleDeleteMsg(msgIndex)
        },
        {
          label: "Cancel",
          onClick: () => alert("Deletion canceled.")
        }
      ]
    });
  };

  deletePartic = participant => {
    let filteredArray = this.state.participantsArr.filter(
      item => item !== participant
    );
    this.setState({ participantsArr: filteredArray });
  };

  addPartic = () => {
    if (
      !this.state.participantsArr.indexOf(this.state.AddingUserToGroup) > -1
    ) {
      this.setState(prevState => ({
        participantsArr: [
          prevState.AddingUserToGroup,
          ...prevState.participantsArr
        ],
        AddingUserToGroup: ""
      }));
    }
  };

  submitParticipants = () => {
    if (
      !(
        JSON.stringify(this.state.participantsArr) ==
        JSON.stringify(this.state.conversationData.participants)
      )
    )
      ChatController.updateParticipants(
        this.state.conversationData.id,
        this.state.participantsArr
      );

    GroupModal.close("custom-modal-1");
  };

  render() {
    const emptyorundefined =
      this.state.message === undefined || this.state.message === "";
    const addingUserEmpty =
      this.state.AddingUserToGroup === undefined ||
      this.state.AddingUserToGroup === "";

    return (
      <MuiThemeProvider theme={theme}>
        {this.state && this.state.conversationData !== undefined && (
          <div>
            <AppBar
              position="fixed"
              style={{
                verticalAlign: "top",
                marginTop: 0,
                left: 70,
                top: 0,
                width: "100%"
              }}
            >
              <Toolbar>
                <Typography style={{ maxWidth: "90%" }} variant="h6">
                  {this.state.participants}
                </Typography>
                {this.state.conversationData.admin === "" && (
                  <IconButton
                    edge="end"
                    style={{ top: 0, right: 50, position: "fixed" }}
                    onClick={this.deleteConversation}
                  >
                    <Delete
                      fontSize="large"
                      style={{ width: 30, height: 30 }}
                    />
                  </IconButton>
                )}

                {this.state.conversationData.admin !== "" &&
                  this.state.conversationData.admin ===
                    this.state.user.email && (
                    <IconButton
                      edge="end"
                      style={{ top: 0, right: 50, position: "fixed" }}
                      onClick={GroupModal.open("custom-modal-1")}
                    >
                      <Edit
                        fontSize="large"
                        style={{ width: 30, height: 30 }}
                      />
                    </IconButton>
                  )}
                <GroupModal id="custom-modal-1">
                  <h5>Group Participants</h5>
                  <div
                    style={{
                      minWidth: 200,
                      maxWidth: 500,
                      marginTop: "-10px"
                    }}
                  >
                    <TextField
                      placeholder="Add a participant"
                      autoFocus={true}
                      required
                      value={this.state.AddingUserToGroup}
                      onChange={this.onUserAddChange}
                      InputProps={{
                        style: { fontFamily: "Arial", color: "black" }
                      }}
                    />
                    <IconButton
                      color="primary"
                      disabled={addingUserEmpty}
                      onClick={this.addPartic}
                    >
                      <Send
                        fontSize="large"
                        style={{ width: 30, height: 30 }}
                      />
                    </IconButton>
                  </div>
                  <List>
                    {this.state.participantsArr !== null &&
                    this.state.participantsArr !== undefined ? (
                      this.state.participantsArr.map((mes, index) => (
                        <ListItem
                          key={index}
                          alignItems="flex-start"
                          className="participantItem"
                        >
                          <ListItemText>
                            {mes}
                            <IconButton
                              edge="end"
                              onClick={() => this.deletePartic(mes)}
                            >
                              <Delete
                                fontSize="small"
                                style={{ width: 20, height: 20 }}
                              />
                            </IconButton>
                          </ListItemText>
                        </ListItem>
                      ))
                    ) : (
                      <div />
                    )}
                  </List>

                  <div
                    style={{
                      marginTop: "30px",
                      width: "120px",
                      height: "auto"
                    }}
                    onClick={GroupModal.close("custom-modal-1")}
                  >
                    <button onClick={GroupModal.close("custom-modal-1")}>
                      Cancel
                    </button>

                    <button
                      style={{ marginLeft: "5px" }}
                      onClick={this.submitParticipants}
                    >
                      Submit
                    </button>
                  </div>
                </GroupModal>

                <IconButton
                  edge="end"
                  style={{ top: 0, right: 10, position: "fixed" }}
                  onClick={this.handleClose}
                >
                  <Close fontSize="large" style={{ width: 30, height: 30 }} />
                </IconButton>
              </Toolbar>
            </AppBar>
            <div
              ref={`thing`}
              style={{
                position: "relative",
                overflow: "auto",
                maxHeight: 550,
                width: "150%",
                marginTop: "100px"
              }}
            >
              <List>
                {this.state.conversationData.message !== null &&
                this.state.conversationData.message !== undefined ? (
                  this.state.conversationData.message.map((mes, index) =>
                    mes.from === this.state.user.email ? (
                      <ListItem
                        key={index}
                        alignItems="flex-start"
                        className="msgFromMe"
                      >
                        <ListItemText
                          primary={mes.from}
                          secondary={
                            <React.Fragment>
                              <Typography
                                component="span"
                                variant="body2"
                                color="textPrimary"
                              ></Typography>
                              {mes.message}
                            </React.Fragment>
                          }
                        />

                        <IconButton
                          edge="end"
                          onClick={() => this.deleteMsg(index)}
                        >
                          <Delete
                            fontSize="small"
                            style={{ width: 20, height: 20 }}
                          />
                        </IconButton>
                      </ListItem>
                    ) : (
                      <ListItem
                        key={index}
                        alignItems="flex-start"
                        className="msgToMe"
                      >
                        <ListItemText
                          primary={mes.from}
                          secondary={
                            <React.Fragment>
                              <Typography
                                component="span"
                                variant="body2"
                                color="textPrimary"
                              ></Typography>
                              {mes.message}
                            </React.Fragment>
                          }
                        />

                        <IconButton
                          edge="end"
                          onClick={() => this.deleteMsg(index)}
                        >
                          <Delete
                            color="primary"
                            fontSize="small"
                            style={{ width: 20, height: 20 }}
                          />
                        </IconButton>
                      </ListItem>
                    )
                  )
                ) : (
                  <div />
                )}
              </List>
            </div>
          </div>
        )}
        <React.Fragment>
          <div
            style={{
              bottom: 10,
              left: 100,
              position: "fixed",
              minWidth: 200,
              maxWidth: 500
            }}
          >
            <TextField
              onChange={this.onMessageChange}
              placeholder="type a message"
              autoFocus={true}
              required
              multiline
              value={this.state.message}
            />
            <IconButton
              color="primary"
              disabled={emptyorundefined}
              onClick={this.onSendClicked}
            >
              <Send fontSize="large" style={{ width: 30, height: 30 }} />
            </IconButton>
          </div>
        </React.Fragment>
      </MuiThemeProvider>
    );
  }
}

export default SpecificConversationComponent;
