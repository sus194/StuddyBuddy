import React, { useEffect, useState } from 'react'
import { Form, useNavigate } from 'react-router-dom';
import { Button, Carousel } from 'react-bootstrap';
import './Modal.css'
import { response } from 'express';

interface ModalProps{
    open:boolean;
    onClose:()=>void;
    chatId:string;
    usersInChat:any[];
    loggedInUser:string;
    
}

interface Review {
    name: string;
    reviews: string |FormDataEntryValue;
  }  

const Modal = ({open, onClose, chatId, usersInChat, loggedInUser}:ModalProps) => {
    const [reviewList, setReviewList] = useState([]);
    const navigate = useNavigate();
    const [users, setUsers] = useState<any[]>([]);

    const getBuddiesForReview = async () => {
        const filteredUsers = usersInChat.filter((user: any) => user.username !== loggedInUser);
        setUsers(filteredUsers);
    }; 

    useEffect(()=>{
        getBuddiesForReview();
    }, [usersInChat])

    const prepareForm = async(event:any) => {
        event.preventDefault();
        const form = event.target;
        const data = new FormData(form);
        const entries = Array.from(data.entries());

        const newArrayOfObj:Review[] = entries.map(([name, reviews])=>({name, reviews}));

        const addreview = await fetch('/users/addreview', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newArrayOfObj)
        });
        if (addreview.status >= 200 && addreview.status < 300){
            onClose();
            navigate('/chats');
        }
        else{
            console.log("failed to write review");
        }

    }

    if(!open) return null;

    return (
    <div className='overlay'>
      <div className='modalContainer'>
         <p onClick={onClose} className='closeBtn'>X</p>
         <div className='content'>
         How were your study buddies?
         <Form onSubmit={prepareForm}>

            {users.map((person, index)=>(
                <div key={index}>
                    <br/>
                    Give {person.username} a review:
                    <br/>
                        <textarea name={person.username} minLength={50}/>
                </div>
            ))}
            <br />
            <Button variant='secondary' size="sm" type='submit'>Done</Button>
            </Form>

         </div>
      </div>
    </div>
  )
}

export default Modal
