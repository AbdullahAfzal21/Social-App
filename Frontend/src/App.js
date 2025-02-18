import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './components/signup.jsx';
import Login from './components/login.jsx';
import Forget from './components/forgetpassword.jsx';
import Timeline from './components/timeline.jsx';
import Profile from './components/profile.jsx';
import Create from './components/create.jsx';
import Edit from './components/updatepost.jsx';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} /> 
        <Route path="/signup" element={<Signup />} />  
        <Route path="/forgetpassword" element={<Forget />} />  
        <Route path="/timeline" element={< Timeline />} />  
        <Route path="/profile" element={< Profile />} />  
        <Route path="/createpost" element={< Create />} />  
        <Route path="/updatepost/:id" element={<Edit />} />

      </Routes>
    </Router>
  );
}

export default App;
