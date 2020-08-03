import React, { useState, useEffect } from "react";

import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Spin, Modal } from "antd";
import {
  getProductsAction,
  buyProductAction,
  applyCouponAction,
} from "../../actions/userActions";
import Shop from "../../components/shop/shop";

const ShopContainer = (props) => {
  const { history, accessToken, userData, getProducts, buyProduct } = props;

  const [isFetching, setIsFetching] = useState(false);
  const [hasErrored, setHasErrored] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [products, setProducts] = useState([]);
  const [isCouponFormOpen, setIsCouponFormOpen] = useState(false);

  useEffect(() => {
    const callback = (res, data) => {
      setIsFetching(false);
      if (res === "success") {
        setProducts(data.products);
      }
    };
    setIsFetching(true);
    getProducts({ callback, accessToken });
  }, []);

  const handleBuyProduct = (product) => {
    const callback = (res, data) => {
      setIsFetching(false);
      if (res === "success") {
        Modal.success({
          title: "Success",
          content: data,
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
    buyProduct({ callback, accessToken, productId: product.id });
  };

  const handleFormFinish = (values) => {
    const callback = (res, data) => {
      setIsFetching(false);
      if (res === "success") {
        setIsCouponFormOpen(false);
        Modal.success({
          title: "Success",
          content: "Coupon applied",
        });
      } else {
        setHasErrored(true);
        setErrorMessage(data);
      }
    };
    setIsFetching(true);
    props.applyCoupon({
      callback,
      accessToken,
      ...values,
    });
  };

  return (
    <Spin spinning={isFetching} className="spinner">
      <Shop
        history={history}
        products={products}
        credit={userData.available_credit}
        onBuyProduct={handleBuyProduct}
        isCouponFormOpen={isCouponFormOpen}
        setIsCouponFormOpen={setIsCouponFormOpen}
        hasErrored={hasErrored}
        errorMessage={errorMessage}
        onFinish={handleFormFinish}
      />
    </Spin>
  );
};

const mapStateToProps = ({ userReducer: { accessToken, userData } }) => {
  return { accessToken, userData };
};

const mapDispatchToProps = {
  getProducts: getProductsAction,
  buyProduct: buyProductAction,
  applyCoupon: applyCouponAction,
};

ShopContainer.propTypes = {
  accessToken: PropTypes.string,
  userData: PropTypes.object,
  getProducts: PropTypes.func,
  buyProduct: PropTypes.func,
  applyCoupon: PropTypes.func,
  history: PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(ShopContainer);
