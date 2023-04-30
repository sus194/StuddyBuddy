import React from 'react';
import './App.css';
import {
  Route,
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Navigate
} from "react-router-dom";

import LoginPage from './Login/LoginPage';
import RootPage, { checkLoggedIn } from './Root/RootPage';
import SignupPage from './Signup/SignupPage';
import EditProfile from './EditProfile/EditProfile';
import ChatList from './ChatList/ChatList';
import CreateChat from './ChatList/CreateChat';
import Chatroom from './ChatList/Chatroom';
import AddUsers from './ChatList/AddUsers';
import { Spinner } from 'react-bootstrap';
import BuddyProfile from './BuddyProfile/BuddyProfile';

function App() {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route
      >
        <Route path="/welcome" element = {<RootPage/>} loader = {checkLoggedIn}/>

        <Route path="/login" element={<LoginPage />} loader = {checkLoggedIn}/>

        <Route path="/signup" element={<SignupPage />} loader = {checkLoggedIn}/>

        <Route path="/profile" element={<EditProfile />} loader = {checkLoggedIn}/>

        <Route path="/buddyprofile" element={<BuddyProfile />} loader = {checkLoggedIn} />
        
        <Route path="/chats" element={<ChatList />} loader = {checkLoggedIn}/>

        <Route path="/create-chat" element={<CreateChat />} loader = {checkLoggedIn}/>

        <Route path="/chatroom/:id" element={<Chatroom />} loader = {checkLoggedIn}/>

        <Route path="/add-users/:id" element={<AddUsers />} loader = {checkLoggedIn}/>

        <Route path="*" element={
          <>
            <div className='d-flex justify-content-center align-items-center my-auto vh-100'>
              <Spinner animation="border" variant='primary' style={{ width:'100px', height:'100px' }} />
            </div>
            <Navigate to="/welcome" replace />
          </>} 
        />
        
      </Route>
      
    )
  )
  return (
    <RouterProvider router={router} />
  );
}

export default App;
