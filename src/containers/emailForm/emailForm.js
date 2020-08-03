import { Modal, Spin } from "antd";
import React from "react";

import PropTypes from "prop-types";
import { connect } from "react-redux";
import { forgotPasswordAction } from "../../actions/userActions";
import EmailForm from "../../components/emailForm/emailForm";

const EmailFormContainer = (props) => {
  const { onMailChange } = props;

  const [isFetching, setIsFetching] = React.useState(false);
  const [hasErrored, setHasErrored] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  const callback = (res, data) => {
    if (res === "success") {
      setIsFetching(false);
      Modal.success({
        title: "Success",
        content: "OTP has been sent to your registered emailid",
        onOk: () => props.setCurrentStep(props.currentStep + 1),
      });
    } else {
      setHasErrored(true);
      setErrorMessage(data);
    }
  };

  const onFinish = (values) => {
    setIsFetching(true);
    props.forgotPassword({ ...values, callback });
  };

  return (
    <Spin spinning={isFetching} className="spinner">
      <EmailForm
        onFinish={onFinish}
        hasErrored={hasErrored}
        errorMessage={errorMessage}
        onMailChange={onMailChange}
      />
    </Spin>
  );
};

const mapDispatchToProps = {
  forgotPassword: forgotPasswordAction,
};

EmailFormContainer.propTypes = {
  forgotPassword: PropTypes.func,
  currentStep: PropTypes.number,
  setCurrentStep: PropTypes.func,
  onMailChange: PropTypes.func,
  history: PropTypes.object
};

export default connect(null, mapDispatchToProps)(EmailFormContainer);
