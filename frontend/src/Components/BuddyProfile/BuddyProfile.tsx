
import React, { useEffect, useState } from "react";
import { Button, Container, ListGroup, Card, ListGroupItem, Spinner } from 'react-bootstrap';
import { useNavigate, useLocation, useLoaderData } from "react-router-dom";
import "./BuddyProfile.css"
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { FaArrowCircleRight } from 'react-icons/fa';
import RootNavbar from "../Root/RootNavbar";


const BuddyProfile = () => {
  const navigate = useNavigate();
  const data: any = useLoaderData();
  const location = useLocation();
  console.log(location);
  const [buddyprofile, setBuddyprofile] = useState<any>();
  const [buddyUniversity, setbuddyUniversity] = useState<any>();
  const [buddyCourses, setbuddyCourses] = useState<any>([]);
  const [buddyBio, setbuddyBio] = useState<any>();
  const [buddyReview, setbuddyReview] = useState<any>([]);
  const [image, setImage] = useState<string | null>(null);


  useEffect(()=>{
    if (!data.loggedIn) {
      setTimeout(() => navigate("/login"), 0);
    } else {
      const fetchdata = async () => {
            //PUT THE BUDDY INTO THE USERS BUDDY SCHEMA!! done when button clicked
        //now i need to get the buddy's schema
        const singlebuddy = await fetch('/users/matchedbuddyinfo')
        const data = await singlebuddy.json()
        setbuddyCourses(data[0].courses);
        setbuddyUniversity(data[0].university);
        setBuddyprofile(location.state.buddyusername);
        setbuddyBio(data[0].bio);
        setbuddyReview(data[0].reviews); 
        setImage('/users/image/' + location.state.buddyusername); 
      }
      fetchdata();
    }
  }, []);
  
  if(!buddyprofile){
    return <p>Loading...</p>;
  }

  return (
      data.loggedIn ?
      <>
        <RootNavbar loggedIn={data.loggedIn} />

    <Container style={{display: 'flex', justifyContent: 'center'}}>
      <Card style={{ width: '18rem' }}>
        <Card.Body>
            <div style={{display:'flex', justifyContent:'center', alignItems: 'center'}}>
                {image && (
                  <div style={{ width: '50px', height: '50px', border: '2px solid black', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: "50%", marginRight: "10px"}}>
                    <img src={image} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: "50%"}} />
                  </div>
                )}
                <Card.Title>{buddyprofile}</Card.Title>
            </div>
        </Card.Body>
        <ListGroup className="list-group-flush">
          <ListGroupItem>University: {buddyUniversity}</ListGroupItem>
          <ListGroupItem>Courses: {buddyCourses}</ListGroupItem>
          <ListGroupItem>Bio: {buddyBio}</ListGroupItem>
          <ListGroupItem>Study Buddy Reviews: 
            <Carousel axis="horizontal"
                showStatus={false}
                className="relative"
                renderArrowNext={(clickHandler, hasNext) => {
                  return (
                    <div
                      className={`${
                        hasNext ? 'absolute' : 'hidden'
                      } top-0 bottom-0 right-0 flex justify-center items-center p-3 opacity-30 hover:opacity-100 cursor-pointer z-20`}
                      onClick={clickHandler}
                    >
                      <FaArrowCircleRight className="w-9 h-9 text-white carousel-arrow next" />
                    </div>
                  );
                }}
              >
              {buddyReview.map((oneReview:any, index:any)=>(
              <div key={index} className="buddyreviews">
                {oneReview}
              </div>
              ))}
            </Carousel>
              </ListGroupItem>
            <ListGroupItem className="text-center">
                <Button variant="secondary" onClick={() => navigate(-1)}>
                  Back
                </Button>
            </ListGroupItem>
        </ListGroup>
      </Card>
    </Container>
    </>
     : <div className='d-flex justify-content-center align-items-center my-auto vh-100'>
          <Spinner animation="border" variant='primary' style={{ width:'100px', height:'100px' }} />
      </div>
  );
};

export default BuddyProfile;
