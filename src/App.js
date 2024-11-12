import React from 'react'
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'

import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage";
import VotingPage from "./pages/VotingPage";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from './pages/AdminPage';
import NotFound from "./pages/NotFound";

function App(){
  return(
   <Router>
    <Routes>
      
      <Route path="/" element={<LoginPage/>}/>
      <Route path="/signup" element={<SignupPage/>}/>
      <Route path="/voting" element={<VotingPage/>}/>
      <Route path="/profile" element={<ProfilePage/>}/>

      <Route path="*" element={<NotFound />} />
      
      <Route path="/admin" element={<AdminPage/>}/>
    </Routes>
   </Router>
  );
}
export default App;