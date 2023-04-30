import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, FormGroup, Row } from "react-bootstrap";
import { useLoaderData, useNavigate } from "react-router-dom";
import RootNavbar from "../Root/RootNavbar";

const EditProfile = () => {
  const navigate = useNavigate();
  const data: any = useLoaderData();
  const [university, setUniversity] = useState("");
  const [courses, setCourses] = useState<any[]>([]);
  const [image, setImage] = useState<any>(null);
  const [bio, setBio] = useState<any>("");

  useEffect(() => {
    if (!data.loggedIn) {
      setTimeout(() => navigate("/login"), 0);
    } else {
      const fetchUserData = async () => {
        const response = await fetch("/users/info");
        const data = await response.json(); 
        setUniversity(data.university);
        setCourses(data.courses);
        setBio(data.bio || '');
        // get user's profile image
        setImage('/users/image/' + data.username);
      };
      fetchUserData();
    }
  }, [data.loggedIn, navigate]);

  const handleImageChange = (event:any) =>{
    const selectedFile = event.target.files[0];
    if (selectedFile){
        setImage(selectedFile)
    }
    else{
        setImage(null)
    }
  }


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const filteredCourses = courses.filter(course => course !== "");
    const coursesArray = filteredCourses.map(course => course.trim());
    if (coursesArray.length === 0) {
      alert("You must have at least one course");
      return;
    }
    const formData = new FormData();
    formData.append("university", university);
    coursesArray.forEach((course) => {
      formData.append("courses[]", course);
    });
    formData.append("bio", bio);
                
    if(image){
      formData.append("image", image);
    }
    const response = await fetch("/users/edit", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if(data) {
        alert(
            `University set to: ${data.university} \nCourses set to ${data.courses}\n Bio is ${data.bio}`)
        navigate('/welcome')
    }
  };

  return data.loggedIn ? (
    <>
    <RootNavbar loggedIn={data.loggedIn} />
    <Container>
      <Row>
        <Col sm={2} md={3} lg={4}></Col>
        <Col sm={8} md={6} lg={4}>
        <h2>Edit Profile</h2>
        <Form onSubmit={handleSubmit} encType = "multipart/form-data">
            <div style={{display:'inline-block', justifyContent:'center', alignItems: 'center',margin:'auto', paddingLeft:'25%'}}>
              {image && (
              <div style={{ width: '150px', height: '150px', borderRadius: '50%', border: '2px solid black', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <img src={image} alt="Uploaded file" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              )}
            </div>
          <FormGroup className='mb-3 mt-3' controlId='formImage'>
            <Form.Label>Change Your Profile Picture:</Form.Label>
            <Form.Control 
                type="file"
                name="image"
                onChange={(event) => handleImageChange(event)} />
          </FormGroup>

          <FormGroup className='mb-3' controlId='formUniversity'>
            <Form.Label>University:</Form.Label>
            <Form.Control type="text"
              required
              value={university || ""}
              onChange={(e) => setUniversity(e.target.value)} />
          </FormGroup>
          <FormGroup className='mb-3' controlId='formCourses'>

              <Form.Label>Courses:</Form.Label>
              {courses.map((course, index) => (
                <div key={index} className="d-flex">
                  <Form.Control type="text" value={course}
                    onChange={(e) => {
                      const newCourses = [...courses];
                      newCourses[index] = e.target.value;
                      setCourses(newCourses);
                    }} />
                  <Button variant="outline-danger" onClick={() => {
                    const newCourses = [...courses];
                    newCourses.splice(index, 1);
                    setCourses(newCourses);
                  }}>X</Button>
                </div>
              ))}
              <Button variant="outline-success" onClick={() => {setCourses([...courses, ""]);}} style={{ width: "100%" }}>+</Button>
            </FormGroup>

            <FormGroup className='mb-3' controlId='formBio'>
            <Form.Label>Bio:</Form.Label>
            <Form.Control as="textarea" 
                rows={3}
                cols={10}
                value={bio || ""}
                onChange={(e)=>setBio(e.target.value)}
                minLength={15}
                required/>
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
};

export default EditProfile;