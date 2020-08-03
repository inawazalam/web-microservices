import React, { useState, useEffect } from "react";

import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Spin, Modal, Avatar } from "antd";
import { getOrdersAction, returnOrderAction } from "../../actions/userActions";
import PastOrders from "../../components/pastOrders/pastOrders";

const PastOrdersContainer = (props) => {
  const { history, accessToken, getOrders, returnOrder } = props;

  const [isFetching, setIsFetching] = useState(false);
  const [orders, setOrders] = useState([]);
  const [hasErrored, setHasErrored] = React.useState(false);

  useEffect(() => {
    const callback = (res, data) => {
      setIsFetching(false);
      if (res === "success") {
        setOrders(data.orders);
      } else {
        setHasErrored(true);
      }
    };
    setIsFetching(true);
    getOrders({ callback, accessToken });
  }, []);

  const handleReturnOrder = (orderId) => {
    const callback = (res, data) => {
      setIsFetching(false);
      if (res === "success") {
        orders.forEach((order, index) => {
          if (order.id === data.order.id) {
            const newOrders = [...orders];
            newOrders[index] = data.order;
            setOrders(newOrders);
          }
        });
        Modal.success({
          title: data.message,
          content: (
            <Avatar
              shape="square"
              src={data.qr_code_url}
              alt="Return QR Code"
              size={200}
            />
          ),
          onOk: () => history.push("/past-orders"),
        });
      } else {
        Modal.error({
          title: "Failure",
          content: data,
        });
      }
    };
    setIsFetching(true);
    returnOrder({ callback, accessToken, orderId });
  };

  return (
    <Spin spinning={isFetching} className="spinner">
      <PastOrders
        history={history}
        orders={orders}
        returnOrder={handleReturnOrder}
      />
    </Spin>
  );
};

const mapStateToProps = ({ userReducer: { accessToken } }) => {
  return { accessToken };
};

const mapDispatchToProps = {
  getOrders: getOrdersAction,
  returnOrder: returnOrderAction,
};

PastOrdersContainer.propTypes = {
  accessToken: PropTypes.string,
  getOrders: PropTypes.func,
  returnOrder: PropTypes.func,
  history: PropTypes.object,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PastOrdersContainer);
