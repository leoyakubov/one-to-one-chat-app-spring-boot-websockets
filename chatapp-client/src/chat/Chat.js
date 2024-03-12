import { Button, message } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import ScrollToBottom from "react-scroll-to-bottom";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  chatActiveContact,
  chatMessages,
  loggedInUser,
} from "../atom/globalState";
import {
  countNewMessages,
  findChatMessage,
  findChatMessages,
  getUsers,
} from "../util/ApiUtil";
import { ACCESS_TOKEN, CHAT_SERVICE_URL} from "../util/constants";
import "./Chat.css";

console.debug("Chat component");

var stompClient = null;

const Chat = () => {
  const currentUser = useRecoilValue(loggedInUser);
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useRecoilState(chatActiveContact);
  const [messages, setMessages] = useRecoilState(chatMessages);

  console.log("Inside Chat component");

  const loadContacts = useCallback(() => {
    console.log("Loading contacts...");
    const promise = getUsers().then((users) =>
      users.map((contact) =>
        countNewMessages(contact.id, currentUser.id).then((count) => {
          contact.newMessages = count;
          console.log("Loaded contacts. Messages count: ", count);
          return contact;
        })
      )
    ).catch((error) => {
      console.error(error);
      localStorage.removeItem(ACCESS_TOKEN);
      navigate("/login");
    });

    promise.then((promises) =>
      Promise.all(promises).then((users) => {
        setContacts(users);
        console.log("Active contact: ", activeContact);
        console.log("Users: ", users);
        if (activeContact === undefined && users.length > 0) {
          setActiveContact(users[0]);
        }
      })
    );
  }, [navigate, activeContact, setContacts, setActiveContact, currentUser.id]);

  const onMessageReceived = useCallback((msg) => {
    const notification = JSON.parse(msg.body);
    console.log("Message received: ", notification);
    const active = JSON.parse(localStorage.getItem("recoil-persist")).chatActiveContact;
    console.log("Active contact: ", active);

    if (active.id === notification.senderId) {
      findChatMessage(notification.id).then((message) => {
        const newMessages = JSON.parse(localStorage.getItem("recoil-persist")).chatMessages;
        newMessages.push(message);
        setMessages(newMessages);
      });
    } else {
      message.info("Received a new message from " + notification.senderName);
    }
    loadContacts();
  }, [loadContacts, setMessages]);

  const sendMessage = useCallback((msg) => {
    if (msg.trim() !== "") {
      const message = {
        senderId: currentUser.id,
        recipientId: activeContact.id,
        senderName: currentUser.name,
        recipientName: activeContact.name,
        content: msg,
        timestamp: new Date(),
      };

      console.log("Message: ", message);
      console.log("Sending it... ");
      if (stompClient.connected) {
        stompClient.send("/app/chat", {}, JSON.stringify(message));
        console.log("Message sent: ", message);
      }

      const newMessages = [...messages];
      newMessages.push(message);
      setMessages(newMessages);
    }
  }, [activeContact.id, activeContact.name, currentUser.id, currentUser.name, messages, setMessages]);

  const onConnected = useCallback(() => {
    console.log("connected");
    console.log("currentUser: ", currentUser);

    if (stompClient.connected) {
      stompClient.subscribe(
        "/user/" + currentUser.id + "/queue/messages",
        onMessageReceived
      );
    }
  }, [currentUser, onMessageReceived]);

  const onError = useCallback((err) => {
    console.log("Error on connect: ", err);
  }, []);

  const connect = useCallback(() => {
    console.log("Connecting to socket...");
    const Stomp = require("stompjs");
    var SockJS = require("sockjs-client");
    SockJS = new SockJS(CHAT_SERVICE_URL + "/ws");
    stompClient = Stomp.over(SockJS);
    stompClient.connect({}, onConnected, onError);
  }, [onConnected, onError]);

  useEffect(() => {
    console.log("useEffect hook 1...");
    if (localStorage.getItem(ACCESS_TOKEN) === null) {
      navigate("/login");
    }
    connect();
    loadContacts();
  }, [navigate, connect, loadContacts]);

  useEffect(() => {
    console.log("useEffect hook 2...");
    if (activeContact === undefined) return;
    findChatMessages(activeContact.id, currentUser.id).then((msgs) =>
      setMessages(msgs)
    );
    loadContacts();
  }, [activeContact, currentUser.id, loadContacts, setMessages]);

  return (
    <div id="frame">
      <div id="sidepanel">
        <div id="profile">
          <div class="wrap">
            <img
              id="profile-img"
              src={currentUser.profilePicture}
              class="online"
              alt=""
            />
            <p>{currentUser.name}</p>
            <div id="status-options">
              <ul>
                <li id="status-online" class="active">
                  <span class="status-circle"></span> <p>Online</p>
                </li>
                <li id="status-away">
                  <span class="status-circle"></span> <p>Away</p>
                </li>
                <li id="status-busy">
                  <span class="status-circle"></span> <p>Busy</p>
                </li>
                <li id="status-offline">
                  <span class="status-circle"></span> <p>Offline</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div id="search" />
        <div id="contacts">
          <ul>
            {contacts.map((contact) => (
              <li
                onClick={() => setActiveContact(contact)}
                class={
                  activeContact && contact.id === activeContact.id
                    ? "contact active"
                    : "contact"
                }
              >
                <div class="wrap">
                  <span class="contact-status online"></span>
                  <img id={contact.id} src={contact.profilePicture} alt="" />
                  <div class="meta">
                    <p class="name">{contact.name}</p>
                    {contact.newMessages !== undefined &&
                      contact.newMessages > 0 && (
                        <p class="preview">
                          {contact.newMessages} new messages
                        </p>
                      )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div id="bottom-bar">
          <button id="addcontact" onClick={() => navigate("/")}>
            <i class="fa fa-user fa-fw" aria-hidden="true"></i>{" "}
            <span>Profile</span>
          </button>
          {/* <button id="settings">
            <i class="fa fa-cog fa-fw" aria-hidden="true"></i>{" "}
            <span>Settings</span>
          </button> */}
        </div>
      </div>
      <div class="content">
        <div class="contact-profile">
          <img src={activeContact && activeContact.profilePicture} alt="" />
          <p>{activeContact && activeContact.name}</p>
        </div>
        <ScrollToBottom className="messages">
          <ul>
            {messages.map((msg) => (
              <li class={msg.senderId === currentUser.id ? "sent" : "replies"}>
                {msg.senderId !== currentUser.id && (
                  <img src={activeContact.profilePicture} alt="" />
                )}
                <p>{msg.content}<br /></p>
              </li>
            ))}
          </ul>
        </ScrollToBottom>
        <div class="message-input">
          <div class="wrap">
            <input
              name="user_input"
              size="large"
              placeholder="Write your message..."
              value={text}
              onChange={(event) => setText(event.target.value)}
              onKeyPress={(event) => {
                if (event.key === "Enter") {
                  sendMessage(text);
                  setText("");
                }
              }}
            />

            <Button
              type="primary"
              size="small"
              // icon={<i class="fa fa-paper-plane" aria-hidden="true"></i>}
              onClick={() => {
                sendMessage(text);
                setText("");
              }}>
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
