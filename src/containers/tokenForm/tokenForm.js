import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Modal, Spin } from "antd";
import { verifyTokenAction, logOutUserAction } from "../../actions/userActions";
import TokenForm from "../../components/tokenForm/tokenForm";

const TokenFormContainer = (props) => {
  const [isFetching, setIsFetching] = React.useState(false);
  const [hasErrored, setHasErrored] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  const callback = (res, data) => {
    setIsFetching(false);
    if (res === "success") {
      Modal.success({
        title: "Token Verified",
        content: data,
        onOk: () => {
          props.logOutUser({
            callback: () => {
              localStorage.clear();
              if (!localStorage.getItem("token")) props.history.push("/login");
            },
          });
        },
      });
    } else {
      setHasErrored(true);
      setErrorMessage(data);
    }
  };

  const onFinish = (values) => {
    const { accessToken } = props;
    setIsFetching(true);
    props.verifyToken({
      ...values,
      new_email: props.email,
      callback,
      accessToken,
    });
  };

  return (
    <Spin spinning={isFetching} className="spinner">
      <TokenForm
        onFinish={onFinish}
        hasErrored={hasErrored}
        errorMessage={errorMessage}
      />
    </Spin>
  );
};

const mapStateToProps = ({ userReducer: { accessToken } }) => {
  return { accessToken };
};

const mapDispatchToProps = {
  verifyToken: verifyTokenAction,
  logOutUser: logOutUserAction,
};

TokenFormContainer.propTypes = {
  accessToken: PropTypes.string,
  verifyToken: PropTypes.func,
  email: PropTypes.string,
  history: PropTypes.object,
  logOutUser: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(TokenFormContainer);
