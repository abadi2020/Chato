import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

export default class StartChatDialog extends React.Component {

    state ={
        open: false,
        user: "",
    };

    async componentDidMount() {
        this.setState({open: this.props.open});
    };

    sendParentSomeData = () => {
        this.props.openFromDialog(false);

    };

    handleUserChange = e => {
        this.setState({ user: e.target.value });

    };

    handleClose = () => {
        this.setState({ open: false });

        this.sendParentSomeData();
    };

    sendParentConversation = (email) => {
        this.props.openConvFromDialog(email);
        this.sendParentSomeData();
    };

    handleStart = () => {
        this.sendParentConversation(this.state.user);
        this.handleClose();
    };

    render() {
        const emptyorundefined =
            this.state.user === undefined ||
            this.state.user === '';

        return (
            <div>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">Start new conversation with the user</DialogTitle>
                    <DialogContent>
                        <TextField
                            required
                            autoFocus
                            margin="dense"
                            id="name"
                            type="text"
                            onChange={this.handleUserChange}
                            fullWidth
                        />
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
