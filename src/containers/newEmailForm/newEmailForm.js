import { Modal, Spin } from "antd";
import React from "react";

import PropTypes from "prop-types";
import { connect } from "react-redux";
import { changeEmailAction } from "../../actions/userActions";
import NewEmailForm from "../../components/newEmailForm/newEmailForm";

const NewEmailFormContainer = (props) => {
  const { accessToken, oldEmail, onMailChange } = props;

  const [isFetching, setIsFetching] = React.useState(false);
  const [hasErrored, setHasErrored] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  const callback = (res, data) => {
    setIsFetching(false);
    if (res === "success") {
      Modal.success({
        title: "Success",
        content: data.message,
        onOk: () => props.setCurrentStep(props.currentStep + 1),
      });
    } else {
      setHasErrored(true);
      setErrorMessage(data);
    }
  };

  const onFinish = (values) => {
    setIsFetching(true);
    props.changeEmail({
      ...values,
      callback,
      accessToken,
      old_email: oldEmail,
    });
  };

  return (
    <Spin spinning={isFetching} className="spinner">
      <NewEmailForm
        onFinish={onFinish}
        hasErrored={hasErrored}
        errorMessage={errorMessage}
        onMailChange={onMailChange}
      />
    </Spin>
  );
};

const mapStateToProps = ({
  userReducer: {
    accessToken,
    userData: { email },
  },
}) => {
  return { accessToken, oldEmail: email };
};

const mapDispatchToProps = {
  changeEmail: changeEmailAction,
};

NewEmailFormContainer.propTypes = {
  oldEmail: PropTypes.string,
  accessToken: PropTypes.string,
  changeEmail: PropTypes.func,
  currentStep: PropTypes.number,
  setCurrentStep: PropTypes.func,
  onMailChange: PropTypes.func,
  history: PropTypes.object,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewEmailFormContainer);
