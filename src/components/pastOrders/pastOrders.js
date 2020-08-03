import "./styles.css";

import React from "react";
import PropTypes from "prop-types";
import { PageHeader, Row, Col, Layout, Card, Button, Avatar } from "antd";
import { RollbackOutlined } from "@ant-design/icons";

const { Content } = Layout;
const { Meta } = Card;

const PastOrders = (props) => {
  const { orders, history } = props;
  return (
    <Layout>
      <PageHeader
        title="Past Orders"
        className="page-header"
        onBack={() => history.push("/shop")}
      />
      <Content>
        <Row gutter={[40, 40]}>
          {orders.map((order) => (
            <Col span={8} key={order.id}>
              <Card
                className="order-card"
                cover={(
                  <Avatar
                    shape="square"
                    className="order-avatar"
                    size={250}
                    src={order.product.image_url}
                  />
                )}
              >
                <Meta
                  description={(
                    <>
                      <PageHeader
                        title={`${order.created_on}, ${order.product.name}, $${
                          order.product.price * order.quantity
                        }`}
                        extra={[
                          <Button
                            type="primary"
                            shape="round"
                            // className="return-btn"
                            icon={
                              order.status === "delivered" && (
                                <RollbackOutlined />
                              )
                            }
                            size="large"
                            key="return-order"
                            disabled={order.status !== "delivered"}
                            onClick={() => props.returnOrder(order.id)}
                          >
                            {order.status === "delivered"
                              ? "Return"
                              : order.status}
                          </Button>,
                        ]}
                      />
                      {/* <Descriptions column={2} className="order-desc">
                        <Descriptions.Item label="Price">
                          {`$${order.product.price * order.quantity}`}
                        </Descriptions.Item>
                        <Descriptions.Item label="Date">
                          {order.created_on}
                        </Descriptions.Item>
                      </Descriptions> */}
                    </>
                  )}
                />
              </Card>
            </Col>
          ))}
        </Row>
      </Content>
    </Layout>
  );
};

PastOrders.propTypes = {
  history: PropTypes.object,
  orders: PropTypes.array,
  returnOrder: PropTypes.func,
};

export default PastOrders;
