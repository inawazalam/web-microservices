import React, { useState, useEffect } from "react";

import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Spin } from "antd";
import { getPostsAction, returnOrderAction } from "../../actions/userActions";
import Forum from "../../components/forum/forum";

const ForumContainer = (props) => {
  const { history, accessToken, getPosts } = props;

  const [isFetching, setIsFetching] = useState(false);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const callback = (res, data) => {
      setIsFetching(false);
      if (res === "success") {
        setPosts(data);
      }
    };
    setIsFetching(true);
    getPosts({ callback, accessToken });
  }, []);

  // const handleReturnOrder = (orderId) => {
  //   const callback = (res, data) => {
  //     setIsFetching(false);
  //     if (res === "success") {
  //       orders.forEach((order, index) => {
  //         if (order.id === data.order.id) {
  //           const newOrders = [...orders];
  //           newOrders[index] = data.order;
  //           setOrders(newOrders);
  //         }
  //       });
  //       Modal.success({
  //         title: data.message,
  //         content: (
  //           <Avatar
  //             shape="square"
  //             src={data.qr_code_url}
  //             alt="Return QR Code"
  //             size={200}
  //           />
  //         ),
  //         onOk: () => history.push("/past-orders"),
  //       });
  //     } else {
  //       Modal.error({
  //         title: "Failure",
  //         content: data,
  //       });
  //     }
  //   };
  //   setIsFetching(true);
  //   returnOrder({ callback, accessToken, orderId });
  // };

  return (
    <Spin spinning={isFetching} className="spinner">
      <Forum
        history={history}
        posts={posts}
        // returnOrder={handleReturnOrder}
      />
    </Spin>
  );
};

const mapStateToProps = ({ userReducer: { accessToken } }) => {
  return { accessToken };
};

const mapDispatchToProps = {
  getPosts: getPostsAction,
  returnOrder: returnOrderAction,
};

ForumContainer.propTypes = {
  accessToken: PropTypes.string,
  getPosts: PropTypes.func,
  history: PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(ForumContainer);
