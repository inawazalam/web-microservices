import React, { useState } from "react";

import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Spin, Modal } from "antd";
import NewPost from "../../components/newPost/newPost";
import { addPostAction } from "../../actions/userActions";

const NewPostContainer = (props) => {
  const { history, accessToken } = props;

  const [isFetching, setIsFetching] = useState(false);
  const [hasErrored, setHasErrored] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  const onFinish = (values) => {
    const callback = (res, data) => {
      setIsFetching(false);
      if (res === "success") {
        Modal.success({
          title: "Success",
          content: "Post Created.",
          onOk: () => history.push("/forum"),
        });
      } else {
        setHasErrored(true);
        setErrorMessage(data);
      }
    };
    setIsFetching(true);
    props.addPost({
      callback,
      accessToken,
      post: {
        ...values,
      },
    });
  };

  return (
    <Spin spinning={isFetching} className="spinner">
      <NewPost
        history={history}
        onFinish={onFinish}
        hasErrored={hasErrored}
        errorMessage={errorMessage}
      />
    </Spin>
  );
};

const mapStateToProps = ({ userReducer: { accessToken } }) => {
  return { accessToken };
};

const mapDispatchToProps = {
  addPost: addPostAction,
};

NewPostContainer.propTypes = {
  accessToken: PropTypes.string,
  addPost: PropTypes.func,
  history: PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(NewPostContainer);
