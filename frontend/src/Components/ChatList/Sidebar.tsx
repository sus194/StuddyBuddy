import { useState, useEffect } from "react";
import { Button, ListGroup } from "react-bootstrap";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
import Modal from "../Modal/Modal";


const Sidebar = (props:any) => {
  const navigate = useNavigate();
  const { chatId, loggedInUser } = props;
  const [users, setUsers] = useState<any[]>([]);
  const [socket, setSocket] = useState<any>(null);
  const [openModal, setOpenModal] = useState(false);


// retrieves all the users in the chat
  const fetchUsers = async () => {
    const response = await fetch(`/chats/${chatId}/users`);
    const data = await response.json();;
    setUsers(data);
  }; 

  useEffect(() => {
    fetchUsers();
    const newSocket = io("/chat", { query: { chatId } });
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("update-users", () => {
        fetchUsers();
      });
    }
  }, [socket]);

  const handleLeaveChat = () => {
    if (socket) {
      const confirmLeave = window.confirm("Are you sure you want to leave the chat?");
      if (confirmLeave) {    
        setOpenModal(true)
      }
    }
  };

  const rejectReview = () => {
    setOpenModal(false); 
    if (socket) {
      socket.emit("leave", {
        chatroom: chatId,
        user: loggedInUser,
      });
    }    
        navigate("/chats");
  };
  


  return (
    <div className="mb-3">
      <ListGroup>
        {users.map((user) => (
          <ListGroup.Item key={user.username} className="border-0 mb-2 d-flex justify-content-center align-items-center">
            <img
              src={`/users/image/${user.username}`}
              alt="profile"
              className="rounded-circle me-2 border border-dark"
              style={{ width: "40px", height: "40px" }}
            />
            <div className="text-center fw-bold">{user.username}</div>
          </ListGroup.Item>
        ))}
      </ListGroup>
      <div className="d-grid gap-1">
        <Button variant="outline-success" size="sm" onClick={() => navigate(`/add-users/${chatId}`)}>
          Add Users
        </Button>
        <Button variant="outline-danger" size="sm" onClick={handleLeaveChat}>
          Leave Chat
        </Button>
        <Modal open={openModal} chatId={chatId} usersInChat={users} loggedInUser={loggedInUser} onClose={rejectReview}/>
      </div>
    </div>
  );
  
};

export default Sidebar;
