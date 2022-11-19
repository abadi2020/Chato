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
import NativeSelect from "@material-ui/core/NativeSelect";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ProfileController from "../controllers/Profile";

class Profile extends React.Component {
  state = {
    email: "",
    password: "",
    fName: "",
    lName: "",
    DOB: new Date(),
    user: this.props.user,
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

  onSubmitClicked = async () => {
    var user = {
      uid: this.state.user.id,
      email: this.state.email,
      firstname: this.state.fName,
      lastname: this.state.lName,
      DOB: this.state.DOB.toISOString().substr(0, 10),
    };

    await ProfileController.updateProfile(user);

    //this.props.dataFromChild(user); // updating the user in parent component.
  };

  componentDidMount() {
    this.setState({ user: this.props.user });

    let year = this.state.user.DOB.substr(0, 4);
    let mon = this.state.user.DOB.substr(5, 2);
    let day = this.state.user.DOB.substr(8, 2);

    this.setState({
      email: this.state.user.email,
      password: "",
      fName: this.state.user.firstname,
      lName: this.state.user.lastname,
      DOB: new Date(year, mon, day)
    });

  }

  render() {
    const {
      email,
      password,
      fName,
      lName,
      DOB,
    } = this.state;
    const emptyorundefined = email === undefined || email === "";

    return (
      <MuiThemeProvider theme={theme}>
        <Card style={{ marginTop: "0", marginLeft: "30px", width: "270px" }}>
          <CardHeader
            title="Edit Your profile"
            color="primary"
            style={{ textAlign: "center" }}
          />
          <CardContent>
            <TextField
              label="First Name"
              value={fName}
              style={{ width: "100px" }}
              onChange={this.handleChange("fName")}
              placeholder="First Name"
            />
            <TextField
              label="Last Name"
              value={lName}
              style={{ marginLeft: "5px", width: "100px" }}
              onChange={this.handleChange("lName")}
              placeholder="Last Name"
            />
            <br />
            <br />
            <TextField
              disabled
              label="Email"
              value={email}
              style={{ width: "200px" }}
              onChange={this.handleEmailInput}
              placeholder="Email*"
            />
            <br />
            <br />
            <TextField
              label="Password"
              style={{ width: "200px" }}
              type="password"
              onChange={this.handlePasswordInput}
              placeholder="Leave empty to not change"
            />
            <br />
            <br />
            DOB: {}
            <DatePicker
              label="Date Of Birth"
              selected={this.state.date}
              onChange={this.handleDOBChange}
              name="DOB"
              placeholderText="DOB"
              value={DOB.toISOString().substr(0, 10)}
            />
            <br />
            <IconButton
              color="primary"
              style={{ marginTop: 10, float: "right" }}
              onClick={this.onSubmitClicked}
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

export default Profile;
