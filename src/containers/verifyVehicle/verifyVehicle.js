import React, { useState } from "react";

import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Spin, Modal } from "antd";
import { verifyVehicleAction } from "../../actions/userActions";
import VerifyVehicle from "../../components/verifyVehicle/verifyVehicle";

const VerifyVehicleContainer = (props) => {
  const { history } = props;

  const [isFetching, setIsFetching] = useState(false);
  const [hasErrored, setHasErrored] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  const { accessToken } = props;

  const onFinish = (values) => {
    const callback = (res, data) => {
      setIsFetching(false);
      if (res === "success") {
        Modal.success({
          title: "Success",
          content: data,
          onOk: () => history.push("/dashboard"),
        });
      } else {
        setHasErrored(true);
        setErrorMessage(data);
      }
    };
    setIsFetching(true);
    props.verifyVehicle({
      callback,
      accessToken,
      ...values,
    });
  };

  return (
    <Spin spinning={isFetching} className="spinner">
      <VerifyVehicle
        history={history}
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
  verifyVehicle: verifyVehicleAction,
};

VerifyVehicleContainer.propTypes = {
  accessToken: PropTypes.string,
  verifyVehicle: PropTypes.func,
  history: PropTypes.object,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VerifyVehicleContainer);
