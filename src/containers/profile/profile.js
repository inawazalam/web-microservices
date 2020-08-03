import React, { useState } from "react";

import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Spin, Modal } from "antd";
import Profile from "../../components/profile/profile";
import {
  uploadProfilePicAction,
  uploadVideoAction,
  changeVideoNameAction,
  convertVideoAction,
} from "../../actions/userActions";

const ProfileContainer = (props) => {
  const {
    history,
    accessToken,
    userData,
    uploadProfilePic,
    uploadVideo,
    changeVideoName,
    convertVideo,
  } = props;

  const [isFetching, setIsFetching] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [hasErrored, setHasErrored] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleUploadProfilePic = (event) => {
    const callback = (res, data) => {
      setIsFetching(false);
      if (res === "success") {
        Modal.success({
          title: "Success",
          content: "Profile pic updated successfully",
          // onOk: () => history.push("/mechanic-dashboard"),
        });
      } else {
        Modal.error({
          title: "Failed",
          content: "",
          // onOk: () => history.push("/mechanic-dashboard"),
        });
      }
    };
    setIsFetching(true);
    uploadProfilePic({ callback, accessToken, file: event.target.files[0] });
  };

  const handleUploadVideo = (event) => {
    const callback = (res, data) => {
      setIsFetching(false);
      if (res === "success") {
        Modal.success({
          title: "Success",
          content: "Video updated successfully",
          // onOk: () => history.push("/mechanic-dashboard"),
        });
      } else {
        Modal.error({
          title: "Failed",
          content: data,
          // onOk: () => history.push("/mechanic-dashboard"),
        });
      }
    };
    setIsFetching(true);
    uploadVideo({ callback, accessToken, file: event.target.files[0] });
  };

  const handleChangeVideoName = (values) => {
    const callback = (res, data) => {
      setIsFetching(false);
      if (res === "success") {
        setIsVideoModalOpen(false);
        Modal.success({
          title: "Success",
          content: "Video Name Changed",
          // onOk: () => history.push("/mechanic-dashboard"),
        });
      } else {
        setHasErrored(true);
        setErrorMessage(data);
      }
    };
    setIsFetching(true);
    changeVideoName({ callback, accessToken, ...values });
  };

  const openNewPost = () =>
    history.push(`/new-post?content=${userData.video_url}`);

  const shareVideoWithCommunity = () => {
    const callback = (res, data) => {
      setIsFetching(false);
      if (res === "success") {
        setIsVideoModalOpen(false);
        Modal.success({
          title: "Success",
          content: data,
          onOk: openNewPost,
          onCancel: openNewPost,
        });
      } else {
        Modal.error({
          title: "Failure",
          content: data,
          onOk: openNewPost,
          onCancel: openNewPost,
        });
      }
    };
    setIsFetching(true);
    convertVideo({ callback, accessToken });
  };

  return (
    <Spin spinning={isFetching} className="spinner">
      <Profile
        history={history}
        userData={userData}
        uploadProfilePic={handleUploadProfilePic}
        uploadVideo={handleUploadVideo}
        isVideoModalOpen={isVideoModalOpen}
        setIsVideoModalOpen={setIsVideoModalOpen}
        onVideoFormFinish={handleChangeVideoName}
        shareVideoWithCommunity={shareVideoWithCommunity}
      />
    </Spin>
  );
};

const mapStateToProps = ({ userReducer: { accessToken, userData } }) => {
  return { accessToken, userData };
};

const mapDispatchToProps = {
  uploadProfilePic: uploadProfilePicAction,
  uploadVideo: uploadVideoAction,
  changeVideoName: changeVideoNameAction,
  convertVideo: convertVideoAction,
};

ProfileContainer.propTypes = {
  accessToken: PropTypes.string,
  history: PropTypes.object,
  userData: PropTypes.object,
  uploadProfilePic: PropTypes.func,
  uploadVideo: PropTypes.func,
  changeVideoName: PropTypes.func,
  convertVideo: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileContainer);
