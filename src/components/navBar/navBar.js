import "./nav.css";

import { Button, Dropdown, Menu, Avatar, Layout, Space } from "antd";
import { DownOutlined } from "@ant-design/icons";
import React, { Component } from "react";

import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logOutUserAction } from "../../actions/userActions";

const { Header } = Layout;
/**
 * top navigation bar that contains
 * if not logged in:
 * Login button,
 * Traceable icon,
 * if logged in :
 * dropdown to navigate to change Password or My Profile
 * dropdown alos consists the logout button
 */
class Navbar extends Component {
  takeMenuAction = (input) => {
    const { history } = this.props;
    if (input.key === "1") history.push(`/shop`);
    else if (input.key === "2") history.push(`/reset-password`);
    else if (input.key === "3") history.push(`/forum`);
    else if (input.key === "4") history.push(`/my-profile`);
    else if (input.key === "5") this.logout();
  };

  logout = () => {
    const { logOutUser } = this.props;
    logOutUser({
      callback: () => {
        localStorage.clear();
      },
    });
  };

  menuSidebar = () => {
    return (
      <Menu onClick={(key) => this.takeMenuAction(key)}>
        <Menu.Item key="1">Shop</Menu.Item>
        <Menu.Item key="2">Change Password</Menu.Item>
        <Menu.Item key="3">Community</Menu.Item>
        <Menu.Item key="5">Logout</Menu.Item>
      </Menu>
    );
  };

  render() {
    const { isLoggedIn, userData, history } = this.props;
    return (
      <Header>
        <Space className="top-nav-left">
          <div className="logo-text" onClick={() => history.push("/")}>
            CRAPI
          </div>
        </Space>
        {isLoggedIn ? (
          <Space className="top-nav-right">
            <div>{`Good Morning, ${userData.name}!`}</div>
            <Avatar
              src={
                userData.picture_url ||
                "https://3.bp.blogspot.com/-qDc5kIFIhb8/UoJEpGN9DmI/AAAAAAABl1s/BfP6FcBY1R8/s1600/BlueHead.jpg"
              }
              className="avatar"
              size="large"
              onClick={() => history.push("/my-profile")}
            />
            <Dropdown overlay={this.menuSidebar()}>
              <div className="nav-items">
                <DownOutlined />
              </div>
            </Dropdown>
          </Space>
        ) : (
          <>
            <Space className="top-nav-right">
              <Button
                className="navbar-button"
                onClick={() => {
                  history.push("/login");
                }}
              >
                Login
              </Button>
              <Button
                className="navbar-button"
                onClick={() => history.push("/signup")}
              >
                Signup
              </Button>
            </Space>
          </>
        )}
      </Header>
    );
  }
}

const mapStateToProps = ({
  userReducer: { accessToken, userData, isLoggedIn, profilePicUrl },
}) => ({
  accessToken,
  userData,
  isLoggedIn,
  profilePicUrl,
});

const mapDispatchToProps = {
  logOutUser: logOutUserAction,
};

Navbar.propTypes = {
  isLoggedIn: PropTypes.bool,
  accessToken: PropTypes.string,
  userData: PropTypes.object,
  profilePicUrl: PropTypes.string,
  logOutUser: PropTypes.func,
  history: PropTypes.object,
  location: PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
