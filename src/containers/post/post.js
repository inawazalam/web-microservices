import React, { useState, useEffect } from "react";

import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Spin, Modal } from "antd";
import Post from "../../components/post/post";
import { getPostByIdAction, addCommentAction } from "../../actions/userActions";

const PostContainer = (props) => {
  const { history, accessToken, getPostById, addComment } = props;

  const [isCommentFormOpen, setIsCommentFormOpen] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [post, setPost] = useState({
    author: {
      nickname: "",
      profile_pic_url: "",
    },
    comments: [],
    title: "",
    content: "",
  });
  const [hasErrored, setHasErrored] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get("post_id");

  useEffect(() => {
    const callback = (res, data) => {
      setIsFetching(false);
      if (res === "success") {
        setPost(data);
      }
    };
    setIsFetching(true);
    getPostById({ callback, accessToken, postId });
  }, []);

  const onFinish = (values) => {
    const callback = (res, data) => {
      setIsFetching(false);
      if (res === "success") {
        Modal.success({
          title: "Success",
          content: "Comment Added",
        });
        setIsCommentFormOpen(false);
        setPost(data);
      } else {
        setHasErrored(true);
        setErrorMessage(data);
      }
    };
    setIsFetching(true);
    props.addComment({
      callback,
      accessToken,
      postId,
      ...values,
    });
  };

  return (
    <Spin spinning={isFetching} className="spinner">
      <Post
        history={history}
        onFinish={onFinish}
        hasErrored={hasErrored}
        errorMessage={errorMessage}
        post={post}
        isCommentFormOpen={isCommentFormOpen}
        setIsCommentFormOpen={setIsCommentFormOpen}
      />
    </Spin>
  );
};

const mapStateToProps = ({ userReducer: { accessToken } }) => {
  return { accessToken };
};

const mapDispatchToProps = {
  getPostById: getPostByIdAction,
  addComment: addCommentAction,
};

PostContainer.propTypes = {
  accessToken: PropTypes.string,
  getPostById: PropTypes.func,
  addComment: PropTypes.func,
  history: PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(PostContainer);
