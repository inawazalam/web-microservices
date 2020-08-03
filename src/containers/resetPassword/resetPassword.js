import { Modal, Spin } from "antd";
import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import ResetPassword from "../../components/resetPassword/resetPassword";

import {
  resetPasswordAction,
  logOutUserAction,
} from "../../actions/userActions";

class ResetPasswordContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: false,
      hasErrored: false,
      errorMessage: "",
    };
  }

  logout = () => {
    const { logOutUser } = this.props;
    logOutUser({
      callback: () => {
        localStorage.clear();
      },
    });
  };

  callback = (res, data) => {
    this.setState({ isFetching: false });
    if (res === "success") {
      this.logout();
      Modal.success({
        title: "Password Reset Successfully",
        content: "You password is changed now.",
        // onOk: this.logout,
        // onCancel: this.logout,
      });
    } else {
      this.setState({
        hasErrored: true,
        errorMessage: data,
      });
    }
  };

  onFinish = (values) => {
    const { resetPassword, accessToken } = this.props;
    this.setState({ isFetching: true });
    resetPassword({
      ...values,
      accessToken,
      callback: this.callback,
    });
  };

  handleChange = () => {
    const { hasErrored } = this.state;
    if (hasErrored) {
      this.setState({
        hasErrored: false,
      });
    }
  };

  render() {
    const { isFetching, hasErrored, errorMessage } = this.state;
    const { history } = this.props;
    return (
      <Spin spinning={isFetching} className="spinner">
        <ResetPassword
          hasErrored={hasErrored}
          errorMessage={errorMessage}
          history={history}
          onFinish={this.onFinish}
        />
      </Spin>
    );
  }
}

const mapDispatchToProps = {
  resetPassword: resetPasswordAction,
  logOutUser: logOutUserAction,
};

const mapStateToProps = ({ userReducer: { accessToken } }) => {
  return {
    accessToken,
  };
};

ResetPasswordContainer.propTypes = {
  resetPassword: PropTypes.func,
  logOutUser: PropTypes.func,
  accessToken: PropTypes.string,
  history: PropTypes.object,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResetPasswordContainer);
