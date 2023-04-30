import React, { useEffect, useState } from 'react';
import { Button, ButtonGroup, Col, Container, Form, FormGroup, Row, Stack } from 'react-bootstrap';
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import RootNavbar from '../Root/RootNavbar';
import './LoginPage.css';

function LoginPage() {
  const navigate = useNavigate();
  const data:any = useLoaderData();
 
  useEffect(() => {
    if (data.loggedIn) {
      setTimeout(() => navigate('/welcome'), 0);
    }
  }, [data.loggedIn]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const response = await fetch('/users/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    if (response.ok) {
      // Login successful
      navigate("/welcome")
    } else {
      // Login failed
      alert("Wrong username/password.");
    }
  };

  return (
    <>
    <RootNavbar loggedIn={data.loggedIn} />
    <Container>
      <Row>
        <Col sm={2} md={3} lg={4}></Col>
        <Col sm={8} md={6} lg={4}>
        <h2>Login</h2>
        <Form onSubmit={handleSubmit}>
          <FormGroup className='mb-3' controlId='formUsername'>
            <Form.Label>Username:</Form.Label>
            <Form.Control type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
          </FormGroup>
          <FormGroup className='mb-3' controlId='formPassword'>
            <Form.Label>Password:</Form.Label>
            <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </FormGroup>
          <div className="d-flex justify-content-evenly">
            <Button onClick={() => {navigate('/signup')}} variant='primary'>Sign Up</Button>
            <Button variant='primary' type="submit">Login</Button>
          </div>
        </Form>
        </Col>
        <Col sm={2} md={3} lg={4}></Col>
      </Row>
    </Container>
    </>
    
    
  );
}

export default LoginPage;
