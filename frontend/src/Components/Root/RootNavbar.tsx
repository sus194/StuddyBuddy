import React, { useState , useEffect} from "react";
import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { Link, useLoaderData, useNavigate } from "react-router-dom";

interface RootNavbarProps {
    loggedIn: Boolean
}

function RootNavbar({ loggedIn }: RootNavbarProps) {
    const navigate = useNavigate();
    const [image, setImage] = useState<string | null>(null);
    const data: any = useLoaderData();

    useEffect(() => {
        if (data.loggedIn) {
            const fetchUserData = async () => {
            // const response = await fetch("/users/image/" + data.username);
            // const image = await response.json();
            setImage('/users/image/' + data.username);
          };
          fetchUserData();
        }
        }, [data.loggedIn, navigate]);

    const logout = async (event: any) => {
        event.preventDefault();

        const response = await fetch('/users/logout');
        const data = await response.json();
        if (data.loggedOut) {
            setTimeout(() => navigate('/login'), 0);
        }
    }

    return (
        <Navbar>
            <Container>
            <div className="navbar-brand" style={{display:'flex', justifyContent:'centre', alignItems: 'center',margin:'auto', paddingRight:'10px'}}>
              {image && (
              <div style={{ width: '50px', height: '50px', border: '2px solid black', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: "50%"}}>
                <img src={image} alt="Uploaded file" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: "50%"}} />
              </div>
              )}
            </div>
                <Navbar.Brand as={Link} to="/welcome">
                    StudyBuddy
                </Navbar.Brand>
                <Navbar.Toggle />
                {loggedIn ?
                    <Navbar.Collapse className="justify-content-between">
                        <Nav>
                            <Nav.Link onClick={() => {navigate('/profile')}}>Edit Profile</Nav.Link>
                            <Nav.Link onClick={() => {navigate('/chats')}}>Chat</Nav.Link>
                        </Nav>
                        <Navbar.Text>
                            <Button variant='danger' onClick={logout}>Logout</Button>
                        </Navbar.Text>
                    </Navbar.Collapse>
                : null
                }
            </Container>
        </Navbar>
    )
}

export default RootNavbar;