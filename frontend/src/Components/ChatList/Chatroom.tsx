import { useEffect, useRef, useState } from "react";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import { Button, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import RootNavbar from "../Root/RootNavbar";
import io from 'socket.io-client';
import Sidebar from "./Sidebar";

const Chatroom = () => {
  const navigate = useNavigate();
  const data: any = useLoaderData();
  const { id } = useParams<{ id: string }>();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState<any>(null);
  const messagesEndRef = useRef<any>(null);

  useEffect(() => {
    if (!data.loggedIn) {
      setTimeout(() => navigate("/login"), 0);
    } else {
      const fetchMessages = async () => {
        const response = await fetch(`/chats/${id}`);
        const data = await response.json();
        setMessages(data);
      }; 
      fetchMessages();
    }
  }, [data.loggedIn, navigate]);


  useEffect(() => {
    const newSocket = io("/chat", { query: { chatId: id } });
    setSocket(newSocket);
  
    return () => {
      newSocket.close();
    };
  }, []);
  
  // Scroll messages automatically when a new message is sent
  useEffect(() => {
    messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
  }, [messages]);
  
  

  useEffect(() => {
    if (socket) {
      socket.on("response", (message: any) => {
        setMessages((messages: any) => [...messages, message]);
      });
    }
  }, [socket]);


const handleSubmit = (event: any) => {
    event.preventDefault();
    const now = new Date();
    const timestamp = now.toUTCString();
  
    if (newMessage.trim() === "") {
      return;
    }
  
    if (socket) {
      socket.emit("message", {
        chatroom: id,
        body: newMessage,
        fromUser: data.username,
        sent: timestamp,
      });

    const messageObj = {
        chatroom: id,
        body: newMessage,
        fromUser: data.username,
        sent: timestamp,
    }
    setMessages((messages: any) => [...messages, messageObj]);
  
    setNewMessage("");
    }
  };

  return (
    data.loggedIn ?
    <>
      <RootNavbar loggedIn={data.loggedIn} />
      <Container>
        <Row>
          <Col md={9}>
            <div style={{ border: '1px solid gray', padding: '10px', borderRadius: '5px' }}>
              <div style={{ height: '80vh', overflowY: 'scroll' }} ref={messagesEndRef}>
                {messages.map((message: any, index: number) => (
                  <div key={index} className={`my-3 d-flex ${message.fromUser === data.username ? 'justify-content-end' : 'justify-content-start'}`}>
                    <div className={`p-3`} style={{ display: 'flex', flexDirection: 'column' }}>
                      {message.fromUser === data.username ? <span className="text-muted ml-2" style={{ textAlign: 'right'}}>You</span> : <span className="text-muted ml-2">{message.fromUser}</span>}
                      <p className='mb-1'>{message.body}</p>
                      <small style={{ textAlign: message.fromUser === data.username ? 'right' : 'left' }}>{new Date(message.sent).toLocaleString('en-US', { month: 'short', day:'numeric', hour: 'numeric', minute: 'numeric', hour12: true })}</small>
                    </div>
                  </div>
                ))}
              </div>
              <Form onSubmit={handleSubmit} className="d-flex">
                <Form.Group className="flex-grow-1 mr-2">
                  <Form.Control
                    type="text"
                    placeholder="Enter message"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                </Form.Group>
                <Button variant="primary" type="submit" style={{ width: "15%" }}>
                  Send
                </Button>
              </Form>
            </div>
          </Col>
          <Col md={3} style={{ marginTop: '5px' }}>
            <Sidebar chatId={id} loggedInUser={data.username}/>
          </Col>
        </Row>
      </Container>
    </>
    : <div className='d-flex justify-content-center align-items-center my-auto vh-100'>
        <Spinner animation="border" variant='primary' style={{ width:'100px', height:'100px' }} />
      </div>
  );
};

export default Chatroom;
