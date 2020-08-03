import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Spin } from "antd";
import Login from "../../components/login/login";
import { logInUserAction } from "../../actions/userActions";

class LoginContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: false,
      hasErrored: false,
      errorMessage: "Wrong Username/Password",
    };
  }

  callback = (res, data) => {
    const { history } = this.props;
    this.setState({ isFetching: false });
    if (res === "success") {
      history.push("/dashboard");
    } else {
      this.setState({
        hasErrored: true,
        errorMessage: data,
      });
    }
  };

  onFinish = (values) => {
    const { logInUser } = this.props;
    this.setState({ isFetching: true });
    logInUser({ ...values, callback: this.callback });
  };

  render() {
    const { isFetching, hasErrored, errorMessage } = this.state;
    const { history } = this.props;
    return (
      <Spin spinning={isFetching} className="spinner">
        <Login
          hasErrored={hasErrored}
          errorMessage={errorMessage}
          onFinish={this.onFinish}
          history={history}
        />
      </Spin>
    );
  }
}

const mapDispatchToProps = {
  logInUser: logInUserAction,
};

LoginContainer.propTypes = {
  logInUser: PropTypes.func,
  history: PropTypes.object,
};

export default connect(null, mapDispatchToProps)(LoginContainer);
