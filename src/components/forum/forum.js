import "./style.css";
import React from "react";
import PropTypes from "prop-types";
import {
  PageHeader,
  Row,
  Col,
  Layout,
  Descriptions,
  Card,
  Button,
  Avatar,
  Typography,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { formatDateFromIso } from "../../actions/userActions";

const { Content } = Layout;
const { Meta } = Card;
const { Paragraph } = Typography;

const Forum = (props) => {
  const { posts } = props;

  return (
    <Layout className="page-container">
      <PageHeader
        title="Forum"
        className="page-header"
        extra={[
          <Button
            type="primary"
            shape="round"
            icon={<PlusOutlined />}
            size="large"
            key="add-coupons"
            onClick={() => props.history.push("/new-post")}
          >
            New Post
          </Button>,
        ]}
      />
      <Content>
        <Row gutter={[40, 40]}>
          {posts.map((post) => (
            <Col key={post.id}>
              <Card
                hoverable
                onClick={() => props.history.push(`/post?post_id=${post.id}`)}
              >
                <Meta
                  avatar={(
                    <Avatar src={post.author.profile_pic_url} size="large" />
                  )}
                  title={post.title}
                />
                <Descriptions size="small" col={2}>
                  <Descriptions.Item label="Posted by">
                    {post.author.nickname}
                  </Descriptions.Item>
                  <Descriptions.Item label="Posted on">
                    {formatDateFromIso(post.CreatedAt)}
                  </Descriptions.Item>
                </Descriptions>
                <Typography className="post-content">
                  {post.content.split("\n").map((para) => (
                    <Paragraph key={para}>{para}</Paragraph>
                  ))}
                </Typography>
              </Card>
            </Col>
          ))}
        </Row>
      </Content>
    </Layout>
  );
};

Forum.propTypes = {
  history: PropTypes.object,
  posts: PropTypes.array,
};

export default Forum;
