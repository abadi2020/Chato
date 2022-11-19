import React, { Component } from "react";
import { MuiThemeProvider } from "@material-ui/core/styles";
import theme from "./theme";
import { IconButton, TextField, Typography} from "@material-ui/core";
import {AddCircle, GroupAdd} from "@material-ui/icons";
import StartChat from "./StartChatDialog";
import StartGroupChat from "./StartGroupChatDialog";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import SpecificConversation from './SpecificConversationComponent';
import ChatController from '../controllers/Chat';
import firebase from "firebase";

class ConversationsComponent extends Component {

    constructor(props){
        super(props);

        this.listenConversations();
    }

    state={
        startChat: false,
        startGroupChat: false,
        conversations: [],
        user: null,
        conversationSelected: false,
        conversationData: null,
        participants: ""
    };

    listenConversations = () => {
        firebase
            .firestore()
            .collection("chats")
            .onSnapshot((querySnapshot) =>{
                let data = [];
                querySnapshot.forEach((doc) => {
                    let obj = doc.data();
                    obj["id"] = doc.id;
                    if(obj.participants.includes(this.state.user.email))
                        data.push(obj);
                });
                this.setState({conversations: data});
            });
    };

    async componentDidMount() {
        this.setState({conversations: this.props.conversations});
        this.setState({user: this.props.user});
    };

    onAddClicked =() => {
        this.setState({startChat: true})
    };

    onGroupClicked =() => {
        this.setState({startGroupChat: true})
    };

    msgFromChild = async(msg) => {
        this.setState({startChat: msg});
    };

    msgFromGroupChild = async(msg) => {
        this.setState({startGroupChat: msg});
    };

    convMsgFromChild = (msg) =>{
        let data = {
            admin: "",
            participants: [this.state.user.email, msg]
        };
        ChatController.addConversation(data);
        this.setState({startChat: false});
    };

    convMsgFromGroupChild = (msg) =>{
        msg.push(this.state.user.email);
        let data = {
            admin: this.state.user.email,
            participants: msg
        };
        ChatController.addConversation(data);
        this.setState({startGroupChat: false});
    };

    closeFromConversation = async(msg) => {
        this.setState({conversationSelected: msg});
    };


    getLastMessage = (messages) => {
        return ChatController.decrypt(messages[messages.length - 1].message);
    };

    getParticipants = (conv) => {
        var participants = '';
        if (conv.length === 2){
            participants = (conv.filter(x => x !== this.state.user.email)).toString();
        }else{
            conv.map((c) => {
                if(c !== this.state.user.email){
                    participants += ` ${c}`;
                }
            });
        }

        return participants;
    };

    handleChatClick = (event, index) => {
        this.setState({conversationData: this.state.conversations[index]}, () => {
            this.setState({participants: this.getParticipants(this.state.conversationData.participants)}, () => {
                    this.setState({conversationSelected: true}
                    )
                }
            )
        });
    };

    render() {
        return (
            <MuiThemeProvider theme={theme}>
                {this.state && this.state.conversationSelected ?
                    <SpecificConversation open={true} user={this.state.user} conversationData={this.state.conversationData} participants={this.state.participants} closeFromConversation={this.closeFromConversation}/>
                    :
                    <div>
                    <List style={{
                        verticalAlign: "top",
                        marginTop: 0,
                        top:0,
                        left: 5,
                        width: '100%',
                        position: 'absolute',
                        overflow: 'auto',
                        minWidth: 100
                    }}>
                        <Divider variant="inset" component="li" />
                        {this.state.conversations.map((conv, index) => (
                            <div key={index}>
                                <ListItem key={index}
                                      button
                                      onClick={event => this.handleChatClick(event, index)}>
                                <ListItemAvatar style={{width: 50, height: 50}}>
                                    <Avatar alt="av" src="../assets/images/avatar.png" />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={this.getParticipants(conv.participants)}
                                    secondary={
                                        <React.Fragment>
                                            <Typography
                                                component="span"
                                                variant="body2"
                                                color="textPrimary"
                                            >
                                            </Typography>
                                            {conv.hasOwnProperty('message') ? this.getLastMessage(conv.message) : null}
                                        </React.Fragment>
                                    }
                                />
                            </ListItem>
                            <Divider variant="inset" component="li" />
                            </div>
                            ))}
                    </List>
                        <div style={{bottom: 0, right: 0, position: "absolute"}}>
                            <IconButton
                                color="primary"
                                onClick={this.onAddClicked}
                            >
                                <AddCircle fontSize="large" style={{width: 60, height: 60}}/>
                            </IconButton>
                            <IconButton
                                color="primary"
                                onClick={this.onGroupClicked}
                            >
                                <GroupAdd fontSize="large" style={{width: 60, height: 60}}/>
                            </IconButton>
                    </div>
                    </div>
                }
                {!this.state.startChat ? null : <StartChat open={true} openConvFromDialog={this.convMsgFromChild} openFromDialog={this.msgFromChild} />}
                {!this.state.startGroupChat ? null : <StartGroupChat open={true} openConvGroupFromDialog={this.convMsgFromGroupChild} openFromGroupDialog={this.msgFromGroupChild} />}
            </MuiThemeProvider>
        );
    }
}
export default ConversationsComponent;