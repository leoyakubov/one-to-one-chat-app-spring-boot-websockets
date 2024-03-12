import { DingtalkOutlined } from "@ant-design/icons";
import { Button, Form, Input, Spin, notification } from "antd";
import axios from 'axios';
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { signup } from "../util/ApiUtil";
import { ACCESS_TOKEN } from "../util/constants";
import "./Signup.css";

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState();

  useEffect(() => {
    if (localStorage.getItem(ACCESS_TOKEN) !== null) {
      navigate("/");
    }
    fetchData();
  }, [navigate]);

  const fetchData = () => {
    axios.get("https://source.unsplash.com/random?animal")
      .then((data) => {
        const result = data.request.responseURL;
        console.log(result);
        setAvatarUrl(result);
        setLoading(false);
      });
  };

  const onFinish = (values) => {
    setLoading(true);
    signup(values)
      .then((response) => {
        notification.success({
          message: "Success",
          description:
            "Thank you! You're successfully registered. Please Login to continue!",
        });
        navigate("/login");
        setLoading(false);
      })
      .catch((error) => {
        notification.error({
          message: "Error",
          description:
            error.message || "Sorry! Something went wrong. Please try again!",
        });
        setLoading(false);
      });
  };

  return (
    loading ? 
      <div className="login-container">
        <Spin tip="Loading" size="large" />
      </div>
    :
    <div className="login-container">
      <DingtalkOutlined style={{ fontSize: 50 }} />
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item
          name="name"
          rules={[{ required: true, message: "Please input your name!" }]}
        >
          <Input size="large" placeholder="Name" />
        </Form.Item>
        <Form.Item
          name="username"
          rules={[{ required: true, message: "Please input your Username!" }]}
        >
          <Input size="large" placeholder="Username" />
        </Form.Item>
        <Form.Item
          name="email"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input size="large" placeholder="Email" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your Password!" }]}
        >
          <Input size="large" type="password" placeholder="Password" />
        </Form.Item>
        <Form.Item
          name="profilePicUrl"
          initialValue={avatarUrl}
          rules={[
            {
              required: true,
              message: "Please input your profile picture URL!",
            },
          ]}
        >
          <Input size="large" placeholder="Profile picture url" />
        </Form.Item>
        <Form.Item>
          <Button
            shape="round"
            size="large"
            htmlType="submit"
            className="login-form-button"
            loading={loading}
          >
            Signup
          </Button>
        </Form.Item>
        Already a member? <a href="/login">Log in</a>
      </Form>
    </div>
  );
};

export default Signup;
