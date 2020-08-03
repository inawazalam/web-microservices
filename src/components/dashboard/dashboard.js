import "./dashboard.css";

import React, { Fragment } from "react";
import PropTypes from "prop-types";
import {
  PageHeader,
  Card,
  Row,
  Col,
  Button,
  Avatar,
  Descriptions,
  Layout,
  Alert,
} from "antd";
import { ToolOutlined, SyncOutlined, PlusOutlined } from "@ant-design/icons";

const { Meta } = Card;
const { Content } = Layout;

const vehicleCardHeader = (vehicle, history) => (
  <PageHeader
    className="dashboard-header"
    title={`VIN: ${vehicle.vin}`}
    extra={[
      <Button
        type="primary"
        shape="round"
        icon={<ToolOutlined />}
        size="large"
        onClick={() => history.push(`/contact-mechanic?VIN=${vehicle.vin}`)}
        key="add-vehicle"
      >
        Contact Mechanic
      </Button>,
    ]}
  />
);

const vehicleCardContent = (vehicle, refreshLocation) => (
  <>
    <Row gutter={[20, 20]}>
      <Col flex="420px">
        <Avatar shape="square" size={400} src={vehicle.model.vehicle_img} />
      </Col>
      <Col flex="auto">
        <Descriptions size="large" column={1} className="vehicle-desc" bordered>
          <Descriptions.Item label="Company :">
            {vehicle.model.vehiclecompany.name}
          </Descriptions.Item>
          <Descriptions.Item label="Model :">
            {vehicle.model.model}
          </Descriptions.Item>
          <Descriptions.Item label="Fuel Type :">
            {vehicle.model.fuel_type}
          </Descriptions.Item>
          <Descriptions.Item label="Year :">{vehicle.year}</Descriptions.Item>
        </Descriptions>
      </Col>
      <Col flex="auto">
        <Row>
          <Col span={24}>
            <iframe
              className="map-iframe"
              width="100%"
              height="360"
              src={`https://maps.google.com/maps?q=${vehicle.vehicleLocation.latitude},${vehicle.vehicleLocation.longitude}&output=embed`}
              title="Map"
            />
          </Col>
          <Col span={24}>
            <Button
              type="primary"
              shape="round"
              icon={<SyncOutlined />}
              size="large"
              // className="refresh-loc-btn"
              onClick={() => refreshLocation(vehicle.uuid)}
            >
              Refresh Location
            </Button>
          </Col>
        </Row>
      </Col>
    </Row>
  </>
);

const Dashboard = (props) => {
  const { vehicles, history, refreshLocation, resendMail } = props;
  return (
    <Layout className="page-container">
      <PageHeader
        className="dashboard-header"
        title="Vehicles Details"
        extra={
          !vehicles.length && [
            <Button
              type="primary"
              shape="round"
              icon={<PlusOutlined />}
              size="large"
              onClick={() => history.push("/verify-vehicle")}
              key="verify-vehicle"
            >
              Add a Vehicle
            </Button>,
          ]
        }
      />
      <Content>
        <Row gutter={[40, 40]}>
          {vehicles.map((vehicle) => (
            <Col span={24} key={vehicle.vin}>
              <Card className="vehicle-card">
                <Meta
                  title={vehicleCardHeader(vehicle, history)}
                  description={vehicleCardContent(vehicle, refreshLocation)}
                />
              </Card>
            </Col>
          ))}
          {!vehicles.length && (
            <Col className="alert-msg-box">
              <Alert
                message={<span className="alert-header">No Vehicles Found</span>}
                description={(
                  <>
                    <span className="alert-msg">
                      Please check your email for the VIN and PIN code of your
                      vehicle.
                    </span>
                    <button
                      onClick={resendMail}
                      type="button"
                      className="alert-msg btn"
                    >
                      {" Click here "}
                    </button>
                    <span className="alert-msg">
                      to send the information again
                    </span>
                  </>
                )}
                type="warning"
              />
            </Col>
          )}
        </Row>
      </Content>
    </Layout>
  );
};

Dashboard.propTypes = {
  history: PropTypes.object,
  vehicles: PropTypes.array,
  resendMail: PropTypes.func,
  refreshLocation: PropTypes.func,
};

export default Dashboard;
