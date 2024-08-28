// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import RegisterUser from './components/User/RegisterUser';
import LoginUser from './components/User/LoginUser';
import ListUser from './components/User/ListUser';
import Header from './components/Header';
// import Footer from './components/Footer';
import Home from './components/Home';
import EditUser from './components/User/EditUser';
import UserProfile from './components/User/UserProfile';
import Createvent from './components/Event/Createvent';
import RegisterAttendee from './components/RegisterAttendee';
import EventList from './components/Event/EventList';
import EventEdit from './components/Event/EventEdit';
import Attendance from './components/Attendance/Attendance';
import AttendanceReport from './components/Attendance/AttendanceReport';
import EventHome from './components/Event/EventHome';
import Analytics from './components/Event/Analytics';
function App() {
  return (
    <Router>
      <Header />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<RegisterUser />} />
          <Route path="/login" element={<LoginUser />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/edit/:id" element={<EditUser />} />
          <Route path="/listuser" element={<ListUser />} />
          {/* Redirect to Home if path not found */}

          <Route path='/event-home' element={<EventHome/>}/>
          <Route path="/create-event" element={<Createvent/>} />
          <Route path="/edit-event/:id" element={<EventEdit/>}/>
          <Route path='/analytics' element={<Analytics/>} />

          <Route path="/register-attendee" element={<RegisterAttendee/>}/>
          <Route path="/eventlist" element={<EventList/>}/>

          <Route path='/attendance' element={<Attendance/>}/>
          <Route path='/report' element={<AttendanceReport/>}/>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
      {/* <Footer/> */}

    </Router>
  );
}

export default App;
