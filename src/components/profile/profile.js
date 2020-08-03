import "./profile.css";

import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import {
  PageHeader,
  Row,
  Col,
  Layout,
  Card,
  Button,
  Descriptions,
  Badge,
  Avatar,
  Dropdown,
  Menu,
  Modal,
  Form,
  Input,
} from "antd";
import {
  PlusOutlined,
  LoadingOutlined,
  EditOutlined,
  MoreOutlined,
  CameraOutlined,
} from "@ant-design/icons";

import { VIDEO_NAME_REQUIRED } from "../../constants/messages";

const { Content } = Layout;
const { Meta } = Card;

const Profile = (props) => {
  const {
    userData,
    uploadProfilePic,
    uploadVideo,
    isVideoModalOpen,
    setIsVideoModalOpen,
    hasErrored,
    errorMessage,
    onVideoFormFinish,
    shareVideoWithCommunity,
  } = props;

  const picInputRef = useRef();
  const videoInputRef = useRef();

  const takeVideoAction = (input) => {
    if (input.key === "1") videoInputRef.current.click();
    if (input.key === "2") setIsVideoModalOpen(true);
    if (input.key === "3") shareVideoWithCommunity();
  };

  const videoSideBar = () => {
    return (
      <Menu onClick={(key) => takeVideoAction(key)}>
        <Menu.Item key="1">Change Video</Menu.Item>
        <Menu.Item key="2">Change Video Name</Menu.Item>
        <Menu.Item key="3">Share Video with Community</Menu.Item>
      </Menu>
    );
  };

  return (
    <Layout className="page-container">
      <PageHeader title="Your Profile" className="profile-header" />
      <Content>
        <Card>
          <Meta
            description={(
              <Row gutter={[60, 20]}>
                <Col flex="200px">
                  <Badge
                    offset={[0, 200]}
                    count={(
                      <Button
                        type="primary"
                        shape="round"
                        icon={<CameraOutlined />}
                        size="large"
                        onClick={() => picInputRef.current.click()}
                      />
                    )}
                  >
                    <input
                      type="file"
                      hidden
                      ref={picInputRef}
                      accept="image/*"
                      onChange={uploadProfilePic}
                    />
                    <Avatar
                      shape="square"
                      size={200}
                      src={userData.picture_url}
                    />
                  </Badge>
                </Col>
                <Col flex="600px">
                  <Descriptions column={1}>
                    <Descriptions.Item label="Name">
                      {userData.name}
                    </Descriptions.Item>
                    <Descriptions.Item label="Email">
                      {`${userData.email}`}
                      <Button
                        type="primary"
                        shape="round"
                        className="change-email-btn"
                        icon={<EditOutlined />}
                        onClick={() => props.history.push("/change-email")}
                      >
                        Change email
                      </Button>
                    </Descriptions.Item>
                    <Descriptions.Item label="Phone No.">
                      {userData.number}
                    </Descriptions.Item>
                  </Descriptions>
                </Col>
              </Row>
            )}
          />
        </Card>
        <PageHeader
          className="profile-header"
          title={`Video Name: ${userData.video_name ? userData.video_name : ""}`}
          extra={[
            <Dropdown overlay={videoSideBar} key="drop-down">
              <div>
                <MoreOutlined className="more-icon" />
              </div>
            </Dropdown>,
          ]}
        />
        <Card>
          <Meta
            description={(
              <Row gutter={[60, 20]}>
                <Col span={24}>
                  <>
                    <video
                      controls
                      className="profile-video"
                      key={userData.video_url}
                    >
                      <source src={userData.video_url} type="video/mp4" />
                    </video>
                    <input
                      type="file"
                      hidden
                      ref={videoInputRef}
                      accept="video/*"
                      onChange={uploadVideo}
                    />
                  </>
                </Col>
              </Row>
            )}
          />
        </Card>
      </Content>
      <Modal
        title="Enter new Video Name"
        visible={isVideoModalOpen}
        footer={null}
        onCancel={() => setIsVideoModalOpen(false)}
      >
        <Form
          name="basic"
          initialValues={{
            remember: true,
          }}
          onFinish={onVideoFormFinish}
        >
          <Form.Item
            name="videoName"
            initialValue={userData.video_name}
            rules={[{ required: true, message: VIDEO_NAME_REQUIRED }]}
          >
            <Input placeholder="Car Video Name" />
          </Form.Item>
          <Form.Item>
            {hasErrored && <div className="error-message">{errorMessage}</div>}
            <Button type="primary" htmlType="submit" className="form-button">
              Change Video Name
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

Profile.propTypes = {
  history: PropTypes.object,
  userData: PropTypes.object,
  uploadProfilePic: PropTypes.func,
  uploadVideo: PropTypes.func,
  isVideoModalOpen: PropTypes.bool,
  setIsVideoModalOpen: PropTypes.func,
  hasErrored: PropTypes.bool,
  errorMessage: PropTypes.string,
  onVideoFormFinish:PropTypes.func,
  shareVideoWithCommunity:PropTypes.func,
};

export default Profile;
