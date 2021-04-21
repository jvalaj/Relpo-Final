import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { useUser } from "../../../contexts/user_context";
import UserInterface from "../../../interface/user_interface";
import fire from "../../../utils/firebase/firebase";
import { RideWithID } from "../ride_page";

interface ChatInterface {
  sender: UserInterface;
  message: string;
  timestamp: number;
}

export default function ChatBox({ ride }: { ride: RideWithID }) {
  const [chats, setChats] = useState<ChatInterface[]>([]);
  const [message, setMessage] = useState("");
  const [user] = useUser();
  function sendChat(e: any) {
    e.preventDefault();
    if (message === "") return;
    fire
      .firestore()
      .collection("rides")
      .doc(ride.docID)
      .collection("chats")
      .add({ message, sender: user, timestamp: new Date().getTime() });
    setMessage("");
  }

  useEffect(() => {
    fire
      .firestore()
      .collection("rides")
      .doc(ride.docID)
      .collection("chats")
      .onSnapshot((data: any) => {
        let tempChats: ChatInterface[] = [];
        data.docs.forEach((doc: any) => tempChats.push(doc.data()));
        tempChats.sort((a, b) => a.timestamp - b.timestamp);
        setChats(tempChats);
        const element = document?.querySelector("#chat-box");
        if (element)
          element.scrollTop = element.scrollHeight - element.clientHeight;
      });
  }, [ride.docID]);
  return (
    <div className="container min-vh-50">
      <div
        id="chat-box"
        className="row-fluid min-vh-75 overflow-auto mb-4 p-2"
        style={{ height: 500 }}
      >
        {chats.map((chat) => (
          <div
            className={
              chat.sender.uuid === user?.uuid ? "text-right" : "text-left"
            }
          >
            <div>{chat.message}</div>
            <small className="text-muted">
              {chat.sender.name} |{" "}
              {new Date(chat.timestamp).toLocaleTimeString()}
            </small>
          </div>
        ))}
      </div>
      <div className="row-fluid flex-grow-1 d-flex">
        <Form className="w-100" onSubmit={sendChat}>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Send a message"
              aria-label="Recipient's username"
              aria-describedby="button-addon2"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              className="btn btn-outline-secondary"
              type="submit"
              id="button-addon2"
              disabled={message === ""}
            >
              Send
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
