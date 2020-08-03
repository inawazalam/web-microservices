import React, { useState, useEffect } from "react";

import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Spin } from "antd";
import { getServicesAction } from "../../actions/userActions";
import MechanicDashboard from "../../components/mechanicDashboard/mechanicDashboard";

const MechanicDashboardContainer = (props) => {
  const { history, accessToken, getServices } = props;

  const [isFetching, setIsFetching] = useState(false);
  const [services, setServices] = useState([]);
  const [hasErrored, setHasErrored] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  useEffect(() => {
    const callback = (res, data) => {
      setIsFetching(false);
      if (res === "success") {
        setServices(data);
      } else {
        setHasErrored(true);
        setErrorMessage(data);
      }
    };
    setIsFetching(true);
    getServices({ callback, accessToken });
  }, []);

  return (
    <Spin spinning={isFetching} className="spinner">
      <MechanicDashboard history={history} services={services} />
    </Spin>
  );
};

const mapStateToProps = ({ userReducer: { accessToken } }) => {
  return { accessToken };
};

const mapDispatchToProps = {
  getServices: getServicesAction,
};

MechanicDashboardContainer.propTypes = {
  accessToken: PropTypes.string,
  getServices: PropTypes.func,
  history: PropTypes.object
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MechanicDashboardContainer);
