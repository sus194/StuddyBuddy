import { ChangeEvent, useContext, useEffect, useState } from "react";
import { Chats } from "../Chats";
import { Button, Form } from 'react-bootstrap';
import { MatchContext, MatchContextType } from "../Matching/MatchContext";

export default function ChatSpot({ onTypeSelect }:any){
    const matchContext = useContext(MatchContext) as MatchContextType;
    const [selectedTime, setSelectedTime] = useState<any>({});
    //const [errorMsg, setErrorMsg] = useState<any>({});
    const [rooms, setRooms] = useState<any[]>([])
    const [isSubmitted, setIsSubmitted] = useState<any>({});
    

    const chatrooms = matchContext.chatrooms?
    matchContext.chatrooms.map((room:Chats)=>{
        return room;
        
    }):null;

    useEffect(()=>{
      const r: any[] = []
      let change:boolean [] = []
      chatrooms?.map((chat:Chats, index: any)=>{
        if(rooms){
         if(rooms[index]){
          if(chat.meetTime != rooms[index].meetTime){
            console.log(rooms[index].meetTime)
            change.push(true)
            r.push(chat)
          }
          else{
            change.push(false)
            r.push(rooms[index])
          }
         }
         else{
          change.push(true)
          r.push(chat)
        }
          
        }
        else{
          change.push(true)
          r.push(chat)
        }
      })

      change.map((val: boolean)=>{
        if(val){
          setRooms(r)
        }
      })   
    },[chatrooms])


    useEffect(()=>{
      let sub:any = {}
      let err:any = {}
      let time: any = {}
      let change:boolean [] = []
      rooms?.map((chat:Chats)=>{
        if(Object.keys(selectedTime).length < rooms.length){
          change.push(true)
          err[chat.chatid] = ""
          time[chat.chatid] = chat.meetTime
          sub[chat.chatid] = false
        }
        else{
          if(selectedTime[chat.chatid] != chat.meetTime && (chat.meetTime.length!=0)){
            change.push(true)
            err[chat.chatid] = ""
            time[chat.chatid] = chat.meetTime
            sub[chat.chatid] = true
            if(chat.meetTime.length >0){
              sub[chat.chatid] = true
            }
            else{
              sub[chat.chatid] = false
            }
          }
  
          else{
            change.push(false)
          }
        }
        
        
      })

      change.map((val: boolean)=>{
        if(val ==true){
          console.log("heeloo")
          setIsSubmitted(sub)
          
          setSelectedTime(time)
        }
      })
      
      
      
    },[rooms])

    



    const handleTypeSelect = (type: string | null) => {
        onTypeSelect(type);
    };


    const handleTimechange = async(e: React.ChangeEvent<HTMLInputElement>, index: any)=>{

      let time: any  ={}
      let sub: any = {}
      Object.keys(selectedTime).map((key)=>{
        if(key === index){
          time[key] = e.target.value
          sub[key] = true
        }
        else{
          time[key] = selectedTime[key]
        }
      })
      setSelectedTime(time)
      
    } 
    

    const handleTimeSubmit = async (event:any) => {
      event.preventDefault();

      try {
        const time = event.target.elements[0].value;
        const key1 = event.target.elements[0].name;
        
        if(isValidTime(time)){

          const response = await fetch("/chats/time-update", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({time: time, id: key1 }),
          });
    
          if (response.ok) {
            let sub: any = {}
            Object.keys(isSubmitted).map((key:any)=>{
              if(key ==key1){
                sub[key] = true
              }
              else{
                sub[key] = isSubmitted[key]
              }
            })
          } 
          
        } else {
          alert("Your time should be in the format XX:XX (24 hour)");
        }
      
        
        
      } catch (error) {
        console.log("didnt work")
      }
   };

   const isValidTime = (time: string) => {
    const pattern = /^(?:2[0-3]|[01][0-9]):[0-5][0-9]$/; // regex for HH:MM format
    return pattern.test(time);
  };

  const handleEditClick = (index1: any) => {
    const sub1:any = {}
    Object.keys(isSubmitted).map((sub)=>{
      if(sub=== index1){
        sub1[index1] = false
      }
      else{
        sub1[sub] = isSubmitted[sub]
      }
    })
    setIsSubmitted(sub1);
  }

    
      return (
        <div>
      <h3>Meeting spots for the chats:</h3>
      <table>
        <thead>
          <tr>
            <th>Chat</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {rooms &&
            rooms.map((room: Chats) => (
              <tr key={room.chatid}>
                <td>
                  <Button variant="outline-secondary" style={{ width:"150px",  wordWrap: "break-word" }} onClick={() => handleTypeSelect(room.chatid)}>
                    {room.title}
                  </Button>
                </td>
                <td>
                  {isSubmitted[room.chatid] ? (
                    <div style={{ display: "flex" }}>
                      <Form.Control
                        type="time"
                        style={{ width: "auto" }}
                        size="sm"
                        width={"auto"}
                        name = {room.chatid}
                        value={selectedTime[room.chatid]}
                        readOnly={true}
                        onChange={(e) => handleTimechange(e as any, room.chatid)}
                      />
                      <Button onClick={()=>handleEditClick(room.chatid)}>Edit</Button>
                    </div>
                  ) : (
                    <Form onSubmit={handleTimeSubmit} style={{ display:"flex" }}>
                      <Form.Control
                        type="time"
                        style={{ width: "auto" }}
                        size="sm"
                        width={"auto"}
                        name = {room.chatid}
                        value={selectedTime[room.chatid]}
                        onChange={(e) => handleTimechange(e as any, room.chatid)}
                      />
                      <Button type="submit" variant='primary'>Submit</Button>
                    </Form>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
        
      );
}