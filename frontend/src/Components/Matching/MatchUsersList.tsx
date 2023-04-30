import { response } from "express";
import React, { useContext, useEffect, useState } from "react";
import { Button, ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import { MatchContext, MatchContextType } from "./MatchContext";
import './MatchUsersList.css';

function MatchUsersList() {

  const matchContext = useContext(MatchContext) as MatchContextType;

  const handleAddBuddy = async(busername: string)=>{
    const response = await fetch('/users/addsinglebuddy', {
      method:'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body:JSON.stringify({buddyname: busername})
    });
    if(!response.ok){
      console.log(response.status)
    }
  }

  const candidateList = matchContext.candidates ?
  matchContext.candidates.map((c) => 
    <ListGroup.Item key={c.username} className="d-flex justify-content-between align-items-start">
      <div className="d-flex align-items-center">
        <img
          src={`/users/image/${c.username}`}
          alt="profile"
          className="rounded-circle me-2"
          style={{ width: "40px", height: "40px", border: "2px solid black" }}
        />
        <div style={{ fontWeight: "bold" }}>{ c.username }</div>
      </div>
      <div className="d-flex justify-content-end">
      
      <Link 
          to={"/buddyprofile"} 
          state = {{buddyusername:c.username}}
          style={{ marginRight: "10px"}}
          className="btn btn-light"
          onClick={async () => {
            await handleAddBuddy(c.username)
          }}
          >
          View Profile
        </Link>

      <Button style={{ width:"93px"}} onClick={async () => {
        const response = await fetch('/matches/match', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username: c.username })
        });

        if (response.ok) {
          // All good, update the match context
          matchContext.updateContext();
        } else {
          console.log(response.status);
        }
      }}>
        Match
      </Button>
    </div>
    </ListGroup.Item>
  ) 
  : null;

  return (
    <>
      <h3>Matchable Users:</h3>
      <ListGroup>
        {candidateList}
      </ListGroup>
    </>
  );
}

export default MatchUsersList;
