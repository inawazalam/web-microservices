import React, { useState, useEffect } from "react";

import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Spin, Modal } from "antd";
import {
  getVehiclesAction,
  refreshLocationAction,
  resendMailAction,
} from "../../actions/userActions";
import Dashboard from "../../components/dashboard/dashboard";

const DashboardContainer = (props) => {
  const {
    history,
    accessToken,
    getVehicles,
    resendMail,
    refreshLocation,
  } = props;

  const [isFetching, setIsFetching] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [hasErrored, setHasErrored] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  useEffect(() => {
    const callback = (res, data) => {
      setIsFetching(false);
      if (res === "success") {
        setVehicles(data);
      } else {
        setHasErrored(true);
        setErrorMessage(data);
      }
    };
    setIsFetching(true);
    getVehicles({ callback, accessToken });
  }, []);

  const handleRefreshLocation = (carId) => {
    const callback = (res, data) => {
      setIsFetching(false);
      if (res === "success") {
        vehicles.forEach((vehicle, index) => {
          if (vehicle.uuid === carId) {
            const newVehicles = [...vehicles];
            newVehicles[index].vehicleLocation = data;
            setVehicles(newVehicles);
          }
        });
      } else {
        Modal.error({
          title: "Failed",
          content: data,
        });
      }
    };
    setIsFetching(true);
    refreshLocation({ callback, accessToken, carId });
  };

  const handleResendMail = () => {
    const callback = (res, data) => {
      setIsFetching(false);
      if (res === "success") {
        Modal.success({
          title: "Success",
          content: data,
        });
      } else {
        Modal.error({
          title: "Failed",
          content: data,
        });
      }
    };
    setIsFetching(true);
    resendMail({ callback, accessToken });
  };

  return (
    <Spin spinning={isFetching} className="spinner">
      <Dashboard
        history={history}
        vehicles={vehicles}
        refreshLocation={handleRefreshLocation}
        resendMail={handleResendMail}
      />
    </Spin>
  );
};

const mapStateToProps = ({ userReducer: { accessToken } }) => {
  return { accessToken };
};

const mapDispatchToProps = {
  getVehicles: getVehiclesAction,
  refreshLocation: refreshLocationAction,
  resendMail: resendMailAction,
};

DashboardContainer.propTypes = {
  accessToken: PropTypes.string,
  getVehicles: PropTypes.func,
  resendMail: PropTypes.func,
  refreshLocation: PropTypes.func,
  history: PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardContainer);
