import React, { useEffect, useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import RootNavbar from "../Root/RootNavbar";
import { Button, Col, Container, Form, FormGroup, Row } from "react-bootstrap";

const CreateChat = () => {
  const navigate = useNavigate();
  const data: any = useLoaderData();
  const [chatName, setChatName] = useState("");
  // used in form
  const [buddies, setBuddies] = useState<string[]>([]);
  // fetched from database
  const [buddiesList, setBuddiesList] = useState<string[]>([]);
 
  
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
        if (!data.loggedIn) {
          setTimeout(() => navigate("/login"), 0);
        } else {
            const fetchMatchedBuddies = async () => {
                const response = await fetch("/matches/buddies");
                const data = await response.json();
                const buddyNames = data.map((buddy: any) => buddy.username);
                setBuddiesList(buddyNames);
                
            };
            fetchMatchedBuddies();            
        }
  }, [data.loggedIn, navigate]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const response = await fetch("/chats/new-group", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: chatName,
        users: buddies,
      }),
    });
    const data = await response.json();
    if(data) {
        alert(
            `Chat Created`)
        navigate('/chats')
    }
  };

  return data.loggedIn ? (
    <>
    <RootNavbar loggedIn={data.loggedIn} />
    <Container>
        <Row>
          <Col sm={2} md={3} lg={4}></Col>
          <Col sm={8} md={6} lg={4}>
            <h2>Create New Chat</h2>
            <Form onSubmit={handleSubmit}>
              <FormGroup className='mb-3' controlId='formUniversity'>
                <Form.Label>Chat Name:</Form.Label>
                <Form.Control type="text"
                  required
                  value={chatName || ""}
                  onChange={(e) => setChatName(e.target.value)} />
              </FormGroup>
              <FormGroup className="mb-3" controlId="formCourses">
                <Form.Label>Choose your buddies to start a group with:</Form.Label>
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

export default CreateChat