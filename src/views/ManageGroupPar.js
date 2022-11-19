import React from "react";
import PropTypes from "prop-types";

const propTypes = {
  id: PropTypes.string.isRequired
};

class GroupModal extends React.Component {
  static modals = [];

  static open = id => e => {
    e.preventDefault();

    // open modal specified by id
    let modal = GroupModal.modals.find(x => x.props.id === id);
    modal.setState({ isOpen: true });
    document.body.classList.add("group-modal-open");
  };

  static close = id => e => {
    e.preventDefault();

    // close modal specified by id
    let modal = GroupModal.modals.find(x => x.props.id === id);
    modal.setState({ isOpen: false });
    document.body.classList.remove("group-modal-open");
  };

  constructor(props) {
    super(props);

    this.state = { isOpen: false };

    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    // move element to bottom of page (just before </body>) so it can be displayed above everything else
    document.body.appendChild(this.element);

    // add this modal instance to the modal service so it's accessible from other components
    GroupModal.modals.push(this);
  }

  componentWillUnmount() {
    // remove this modal instance from modal service
    GroupModal.modals = GroupModal.modals.filter(
      x => x.props.id !== this.props.id
    );
    this.element.remove();
  }

  handleClick(e) {
    // close modal on background click
    if (e.target.className === "group-modal") {
      GroupModal.close(this.props.id)(e);
    }
  }

  render() {
    return (
      <div
        style={{ display: +this.state.isOpen ? "" : "none", width: "10px" }}
        onClick={this.handleClick}
        ref={el => (this.element = el)}
      >
        <div className="group-modal">
          <div className="group-modal-body">{this.props.children}</div>
        </div>
        <div className="group-modal-background"></div>
      </div>
    );
  }
}

GroupModal.propTypes = propTypes;

export { GroupModal };
