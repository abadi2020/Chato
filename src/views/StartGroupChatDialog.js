import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

export default class StartGroupChatDialog extends React.Component {

    state ={
        open: false,
        user: "",
        users: [""],
        submit: false
    };

    async componentDidMount() {
        this.setState({open: this.props.open});
    };

    handleChange = e => {
        e.persist();

        const newInputs = [...this.state.users];

        newInputs[e.target.id] = e.target.value;

        if (e.target.value && newInputs.every(input => input.length) && this.state.users.length < 10) {
            newInputs.push("");
        }

        this.setState(() => ({
            users: newInputs
        }));
    };

    sendParentSomeData = () => {
        this.props.openFromGroupDialog(false);

    };

    handleClose = () => {
        this.setState({ open: false });

        this.sendParentSomeData();
    };

    sendParentConversation = (email) => {
        if(email.length < 10)
            email.pop();
        this.props.openConvGroupFromDialog(email);
        this.sendParentSomeData();
    };

    handleStart = () => {
        this.sendParentConversation(this.state.users);
        this.handleClose();
    };

    render() {
        const emptyorundefined =
            this.state.user === undefined ||
            this.state.users.length < 2;

        return (
            <div>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">Start new conversation with multiple users</DialogTitle>
                    <DialogContent>
                        <form onChange={this.handleChange} onSubmit={e => e.preventDefault()}>
                            {this.state.users.map((input, i) => {
                                return <div><br/> <TextField fullWidth key={i} id={i} value={input} /></div>;
                            })}
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.handleStart} color="primary" disabled={emptyorundefined}>
                            Start
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }

}
