import React from "react";
import { MuiThemeProvider } from "@material-ui/core/styles";
import {
  Card,
  CardHeader,
  CardContent,
  IconButton,
  TextField
} from "@material-ui/core";
import AddCircle from "@material-ui/icons/AddCircleRounded";
import SendIcon from "@material-ui/icons/Send";
import theme from "./theme";
import "../Login.scss";
import regController from "../controllers/Login";

class Login extends React.Component {
  state = {
    email: "",
    password: "",
    user: null,
    error: null,
    loggedIn: null
  };

  handleEmailInput = e => {
    this.setState({ email: e.target.value });
  };

  handlePasswordInput = e => {
    this.setState({ password: e.target.value });
  };

  onLoginClicked = async () => {
    await regController
      .loginUser(this.state.email, this.state.password)
      .then(result => {
        this.setState({ user: result });
      })
      .catch(error => {
        this.setState({ error: error });
      });

    if (this.state.error != null) alert(this.state.error.message);
    else {
      await regController
        .getUser(this.state.email)
        .then(result => {
          this.setState({ user: result });
        })
        .catch(error => {
          this.setState({ error: error });
        });

      if (this.state.error != null) alert(this.state.error.message);

      this.sendParentSomeData();
    }
  };

  sendParentSomeData = () => {
    this.props.dataFromChild(this.state.user);
  };

  render() {
    const { email, password } = this.state;
    const emptyorundefined =
      email === undefined ||
      email === "" ||
      password === undefined ||
      password === "";

    return (
      <MuiThemeProvider theme={theme}>
        <Card className="cardStyle" style={{ width: "300px", height: "100%" }}>
          <CardHeader
            title="Enter email and password to sign in"
            color="inherit"
            style={{ textAlign: "center" }}
          />
          <CardContent>
            <TextField
              style={{ width: "240px" }}
              onChange={this.handleEmailInput}
              placeholder="Email"
              //value={name}
            />
            <br />
            <br />
            <TextField
              style={{ width: "240px" }}
              type="password"
              onChange={this.handlePasswordInput}
              placeholder="Password"
              //value={name}
            />
            <IconButton
              color="primary"
              style={{ marginTop: 50, float: "right" }}
              onClick={this.onLoginClicked}
              disabled={emptyorundefined}
            >
              <AddCircle fontSize="large" component={SendIcon} />
            </IconButton>
          </CardContent>
        </Card>
      </MuiThemeProvider>
    );
  }
}

export default Login;
