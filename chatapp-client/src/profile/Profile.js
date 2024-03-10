import { LogoutOutlined } from "@ant-design/icons";
import { Avatar, Card } from "antd";
import React, { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from "recoil";
import { loggedInUser } from "../atom/globalState";
import { getCurrentUser } from "../util/ApiUtil";
import "./Profile.css";

const { Meta } = Card;

const Profile = () => {
  const [currentUser, setLoggedInUser] = useRecoilState(loggedInUser);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (localStorage.getItem("accessToken") === null) {
      navigate("/login");
    }
    loadCurrentUser();
  }, []);

  const loadCurrentUser = () => {
    getCurrentUser()
      .then((response) => {
        setLoggedInUser(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  // ADD link to chat when logged in
  return (
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
  );
};

export default Profile;
