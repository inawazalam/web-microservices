import React, { Component } from "react";
import { Modal, Spin } from "antd";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Signup from "../../components/signup/signup";

import { signUpUserAction } from "../../actions/userActions";

class SignupContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: false,
      hasErrored: false,
      errorMessage: "",
    };
  }

  callback = (res, data) => {
    const { history } = this.props;
    this.setState({ isFetching: false });
    if (res === "success") {
      Modal.success({
        title: data,
        content: data,
        onOk: () => history.push("/login"),
      });
    } else {
      this.setState({
        hasErrored: true,
        errorMessage: data,
      });
    }
  };

  onFinish = (values) => {
    const { signUpUser } = this.props;
    this.setState({ isFetching: true });
    signUpUser({ ...values, callback: this.callback });
  };

  render() {
    const { history } = this.props;
    const { isFetching, hasErrored, errorMessage } = this.state;
    return (
      <Spin spinning={isFetching} className="spinner">
        <Signup
          history={history}
          hasErrored={hasErrored}
          errorMessage={errorMessage}
          onFinish={this.onFinish}
        />
      </Spin>
    );
  }
}

const mapDispatchToProps = {
  signUpUser: signUpUserAction,
};

SignupContainer.propTypes = {
  signUpUser: PropTypes.func,
  history: PropTypes.object,
};

export default connect(null, mapDispatchToProps)(SignupContainer);
