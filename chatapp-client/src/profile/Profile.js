import { LogoutOutlined } from "@ant-design/icons";
import { Avatar, Card, Button } from "antd";
import React, { useCallback, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from "recoil";
import { loggedInUser } from "../atom/globalState";
import { getCurrentUser } from "../util/ApiUtil";
import { ACCESS_TOKEN } from "../util/constants";
import "./Profile.css";

const { Meta } = Card;

const Profile = () => {
  const [currentUser, setLoggedInUser] = useRecoilState(loggedInUser);
  const navigate = useNavigate();

  const loadCurrentUser = useCallback(() => {
    getCurrentUser()
      .then((response) => {
        setLoggedInUser(response);
      })
      .catch((error) => {
        console.log(error);
      });
  },[setLoggedInUser]);

  const logout = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    navigate("/login");
  };

  useEffect(() => {
    if (localStorage.getItem(ACCESS_TOKEN) === null) {
      navigate("/login");
    }
    loadCurrentUser();
  }, [navigate, loadCurrentUser]);

  return (
    <div id="frame">
      <div className="profile-container">
        <Card
          style={{ width: 420, border: "1px solid #e1e0e0" }}
          actions={[<LogoutOutlined onClick={logout} />]}
        >
          <Meta
            avatar={
              <Avatar
                src={currentUser.profilePicture}
                className="user-avatar-circle"
              />
            }
            title={currentUser.name}
            description={"@" + currentUser.username}
          />
        </Card>
      </div>
      <div className="chat-container">
        <Button type="primary" onClick={() => navigate("/chat")}>
          Open Chat
        </Button>
      </div>
    </div>
  );
};

export default Profile;
