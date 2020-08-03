import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Modal, Spin } from "antd";
import { verifyOTPAction } from "../../actions/userActions";
import OTPForm from "../../components/otpForm/otpForm";

const OtpFormContainer = (props) => {
  const [isFetching, setIsFetching] = React.useState(false);
  const [hasErrored, setHasErrored] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  const callback = (res, data) => {
    setIsFetching(false);
    if (res === "success") {
      Modal.success({
        title: "OTP Verified",
        content: "Your password has been set.",
        onOk: () => props.history.push("/login"),
      });
    } else if (res === "redirect") {
      Modal.error({
        title: "Failure",
        content: data,
        onOk: () => props.history.push("/login"),
        onCancel: () => props.history.push("/login"),
      });
    } else {
      setHasErrored(true);
      setErrorMessage(data);
    }
  };

  const onFinish = (values) => {
    setIsFetching(true);
    props.verifyOTP({ ...values, email: props.email, callback });
  };

  return (
    <Spin spinning={isFetching} className="spinner">
      <OTPForm
        onFinish={onFinish}
        hasErrored={hasErrored}
        errorMessage={errorMessage}
      />
    </Spin>
  );
};

const mapDispatchToProps = {
  verifyOTP: verifyOTPAction,
};

OtpFormContainer.propTypes = {
  verifyOTP: PropTypes.func,
  email: PropTypes.string,
  history: PropTypes.object
};

export default connect(null, mapDispatchToProps)(OtpFormContainer);
