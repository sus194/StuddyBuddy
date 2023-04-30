import React, { useEffect, useState } from "react";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import RootNavbar from "../Root/RootNavbar";
import { Button, Col, Container, Form, FormGroup, Row } from "react-bootstrap";
import io from 'socket.io-client';

const AddUsers = () => {
  const navigate = useNavigate();
  const data: any = useLoaderData();
  const { id } = useParams<{ id: string }>();
  // used in form
  const [buddies, setBuddies] = useState<string[]>([]);
  // fetched from database
  const [buddiesList, setBuddiesList] = useState<string[]>([]);
  const [socket, setSocket] = useState<any>(null);
 
  
  const handleCheckboxChange = (value: string) => {
     // Check if the checkbox being unchecked is the last one
    const isLastUnchecked = buddies.length === 1 && buddies.includes(value);

    if (isLastUnchecked) {
        // Prevent the checkbox from being unchecked
        return;
    }
    if (buddies.includes(value)) {
      setBuddies(buddies.filter((buddy) => buddy !== value));
    } else {
      setBuddies([...buddies, value]);
    }
  };

  useEffect(() => {
        // check logged in
        if (!data.loggedIn) {
          setTimeout(() => navigate("/login"), 0);
        } else {
            const fetchMatchedBuddies = async () => {
                // get the users buddies
                const response = await fetch("/matches/buddies");
                const data = await response.json();
                const buddyNames = data.map((buddy: any) => buddy.username);

                // remove buddies currently in chat
                const response2 = await fetch(`/chats/${id}/users`);
                const data2 = await response2.json();
                const buddyNames2 = data2.map((buddy: any) => buddy.username);

                const buddiesNotInChat = buddyNames.filter((buddy: any) => !buddyNames2.includes(buddy));
              
                setBuddiesList(buddiesNotInChat);
                
            };
            fetchMatchedBuddies();            
        }
  }, [data.loggedIn, navigate]);

  useEffect(() => {
    const newSocket = io("/chat", { query: { chatId: id } });
    setSocket(newSocket);
  
    return () => {
      newSocket.close();
    };
  }, []);


  // Emits the buddies you added to server
  const handleSubmit = (event: any) => {
    event.preventDefault();
  
    if (socket) {
      socket.emit("add-users", {
        chatroom: id,
        users: buddies,
      });
    }
    navigate(`/chatroom/${id}`)
  };

  return data.loggedIn ? (
    <>
    <RootNavbar loggedIn={data.loggedIn} />
    <Container>
        <Row>
          <Col sm={2} md={3} lg={4}></Col>
          <Col sm={8} md={6} lg={4}>
            <h2 style={{textAlign:'center'}}>Create New Chat</h2>
            <Form onSubmit={handleSubmit}>
              <FormGroup className="mb-3" controlId="formCourses">
                <Form.Label>Choose your buddies to add to this group:</Form.Label>
                {buddiesList.map((buddy) => (
                    <Form.Check
                        key={buddy}
                        type="checkbox"
                        label={buddy}
                        value={buddy}
                        onChange={(e) => handleCheckboxChange(e.target.value)}
                        checked={buddies.includes(buddy)}
                    />
                 ))}
              </FormGroup>
              <div className="d-flex justify-content-evenly">
                <Button variant='primary' type="submit">Submit</Button>
              </div>
            </Form>
          </Col>
          <Col sm={2} md={3} lg={4}></Col>
        </Row>
    </Container>
    </>
  ) : null;
}

export default AddUsers