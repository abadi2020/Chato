import React, { Component } from "react";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { IconButton } from "@material-ui/core";
import theme from "./theme";
import Login from "./LoginComponent";
import Register from "./RegisterComponent";
import Conversations from "./ConversationsComponent";
import Profile from "./ProfileComponent";
import "../App.css";
import LoginController from "../controllers/Login";

import SideNav, { NavItem, NavIcon, NavText } from "@trendmicro/react-sidenav";
import "@trendmicro/react-sidenav/dist/react-sidenav.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ChatIcon from "@material-ui/icons/Chat";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Img from "react-image";
import ChatController from "../controllers/Chat";
import { white } from "ansi-colors";

class App extends Component {
  state = {
    authUser: null,
    isLoginOpen: true,
    isRegisterOpen: false,
    conversations: [],
    loggedIn: false,
    conversationsReady: false,
    user: null,
    value: "",
    showEstimate: true
  };

  componentDidMount() {
    this.listener = LoginController.listenToAuth(user => {
      user
        ? this.setState({ authUser: user })
        : this.setState({ authUser: null });
    });
  }

  componentWillUnmount() {
    this.listener();
  }

  showRegister() {
    this.setState({ isRegisterOpen: true, isLoginOpen: false });
  }

  msgFromChild = msg => {
    this.setState(
      {
        loggedIn: true,
        user: msg,
        isLoginOpen: false,
        isRegisterOpen: false
      },
      () => {
        ChatController.getConversations(this.state.user).then(
          data => {
            this.setState({ conversations: data }, () =>
              this.setState({ conversationsReady: true })
            );
          },
          error => {
            console.log(error);
          }
        );
      }
    );
  };

  showLogin() {
    this.setState({
      isLoginOpen: true,
      isRegisterOpen: false,
      showEstimate: false
    });
  }

  refreshPage() {
    window.location.reload();
  }

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        {!this.state.loggedIn && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Img
              style={{
                width: 100,
                height: 100
              }}
              src={require("../assets/images/ChatoLogoDark.png")}
            />
          </div>
        )}
        {!this.state.loggedIn && (
          <div className="root-container">
            <div className="box-controller">
              <div
                className={
                  "controller " +
                  (this.state.isLoginOpen ? "selected-controller" : "")
                }
                onClick={this.showLogin.bind(this)}
              >
                Login
              </div>
              <div
                className={
                  "controller " +
                  (this.state.isRegisterOpen ? "selected-controller" : "")
                }
                onClick={this.showRegister.bind(this)}
              >
                Register
              </div>
            </div>
            {this.state.isLoginOpen && (
              <Login dataFromChild={this.msgFromChild} />
            )}
            {this.state.isRegisterOpen && <Register />}
          </div>
        )}
        {this.state.loggedIn && this.state.conversationsReady && (
          <div className="root-container">
            <Router>
              <Route
                render={({ location, history }) => (
                  <React.Fragment>
                    <SideNav
                      style={{ paddingTop: 10, position: "fixed" }}
                      onSelect={selected => {
                        const to = "/" + selected;
                        if (location.pathname !== to) {
                          history.push(to);
                        }
                      }}
                    >
                      <NavItem>
                        <NavIcon>
                          <Img
                            style={{
                              width: 50,
                              height: 50,
                              marginLeft: 5
                            }}
                            src={require("../assets/images/ChatoLogoDark.png")}
                          />
                        </NavIcon>
                      </NavItem>
                      <NavItem>
                        <NavIcon>
                          <IconButton
                            color="inherit"
                            onClick={this.refreshPage}
                          >
                            <ExitToAppIcon
                              titleAccess="Logout"
                              style={{
                                width: 35,
                                height: 35,
                                marginLeft: 4,
                                justifyContent: "space-between"
                              }}
                            />
                          </IconButton>
                        </NavIcon>
                      </NavItem>

                      <SideNav.Toggle />

                      <SideNav.Nav defaultSelected="profile">
                        <NavItem eventKey="profile">
                          <NavIcon>
                            <AccountCircleIcon />
                          </NavIcon>
                          <NavText>profile</NavText>
                        </NavItem>
                        <NavItem eventKey="conversations">
                          <NavIcon>
                            <ChatIcon />
                          </NavIcon>
                          <NavText>conversations</NavText>
                        </NavItem>
                      </SideNav.Nav>
                    </SideNav>

                    <main>
                      <Route path="/" exact component={props => <App />} />
                      <Route
                        path="/profile"
                        component={props => <Profile user={this.state.user} />}
                      />
                      <Route
                        path="/conversations"
                        component={props => (
                          <Conversations
                            user={this.state.user}
                            conversations={this.state.conversations}
                          />
                        )}
                      />
                    </main>
                  </React.Fragment>
                )}
              />
            </Router>
          </div>
        )}
      </MuiThemeProvider>
    );
  }
}

export default App;
