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
import regController from "../controllers/Register";
import NativeSelect from "@material-ui/core/NativeSelect";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

class Register extends React.Component {
  state = {
    email: "",
    password: "",
    fName: "",
    lName: "",
    DOB: new Date(),
    errors: []
  };

  handleEmailInput = e => {
    this.setState({ email: e.target.value });
  };


  handlePasswordInput = e => {
    this.setState({ password: e.target.value });
  };

  handleDOBChange = date => {
    this.setState({
      DOB: date
    });
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  onRegisterClicked = () => {
    var user = {
      email: this.state.email,
      firstname: this.state.fName,
      lastname: this.state.lName,
      DOB: this.state.DOB.toISOString().substr(0, 10),
    };


    regController.registerUser(
      this.state.email,
      this.state.name,
      this.state.password,
      user
    );
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
        <Card style={{ width: "300px", height: "100%" }}>
          <CardHeader
            title="You picked the right time to sign up!"
            color="primary"
            style={{ textAlign: "center" }}
          />
          <CardContent>
            <TextField
              style={{ width: "120px" }}
              onChange={this.handleChange("fName")}
              placeholder="First Name"
            />
            <TextField
              style={{ width: "120px", marginLeft: 5 }}
              onChange={this.handleChange("lName")}
              placeholder="Last Name"
            />
            <br />
            <br />
            <TextField
              required
              style={{ width: "240px" }}
              onChange={this.handleEmailInput}
              placeholder="Email*"
            />
            <br />
            <br />
            <TextField
              required
              style={{ width: "240px" }}
              type="password"
              onChange={this.handlePasswordInput}
              placeholder="Password*"
            />
            <br />
            <br />
            DOB:{" "}
            <DatePicker
              selected={this.state.date}
              onChange={this.handleDOBChange}
              name="DOB"
              placeholderText="DOB"
              value={this.state.DOB.toISOString().substr(0, 10)}
            />
            <br />
            <IconButton
              color="primary"
              style={{ marginTop: 10, float: "right" }}
              onClick={this.onRegisterClicked}
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

export default Register;
