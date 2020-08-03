import React, { useState, useEffect } from "react";

import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Spin, Modal } from "antd";
import ContactMechanic from "../../components/contactMechanic/contactMechanic";
import {
  getMechanicsAction,
  contactMechanicAction,
} from "../../actions/userActions";

const ContactMechanicContainer = (props) => {
  const { history, accessToken, getMechanics } = props;

  const [isFetching, setIsFetching] = useState(false);
  const [mechanics, setMechanics] = useState([]);
  const [hasErrored, setHasErrored] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  useEffect(() => {
    const callback = (res, data) => {
      setIsFetching(false);
      if (res === "success") {
        setMechanics(data);
      } else {
        setHasErrored(true);
        setErrorMessage(data);
      }
    };
    setIsFetching(true);
    getMechanics({ callback, accessToken });
  }, []);

  const onFinish = (values) => {
    const callback = (res, data) => {
      setIsFetching(false);
      if (res === "success") {
        Modal.success({
          title: "Success",
          content: "Service Request sent to the mechanic",
          onOk: () => history.push("/mechanic-dashboard"),
        });
      } else {
        setHasErrored(true);
        setErrorMessage(data);
      }
    };
    setIsFetching(true);
    props.contactMechanic({
      callback,
      accessToken,
      ...values,
    });
  };

  return (
    <Spin spinning={isFetching} className="spinner">
      <ContactMechanic
        history={history}
        onFinish={onFinish}
        hasErrored={hasErrored}
        errorMessage={errorMessage}
        mechanics={mechanics}
      />
    </Spin>
  );
};

const mapStateToProps = ({ userReducer: { accessToken } }) => {
  return { accessToken };
};

const mapDispatchToProps = {
  getMechanics: getMechanicsAction,
  contactMechanic: contactMechanicAction,
};

ContactMechanicContainer.propTypes = {
  accessToken: PropTypes.string,
  getMechanics: PropTypes.func,
  contactMechanic: PropTypes.func,
  history: PropTypes.object,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContactMechanicContainer);
