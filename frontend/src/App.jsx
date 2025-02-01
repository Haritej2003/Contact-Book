import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import {UserLogin} from "./components/Login"
import {UserComponent} from "./components/User"
import {SignUp} from "./components/SignUp"
import {Loader} from "./components/Loader"
function App() {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
      // Simulating an API call or page load
      setLoading(true);
      setTimeout(() => {
        setLoading(false);  // Stop loading after 3 seconds (or after your data fetch finishes)
      }, 1000); 
    }, []);

  return (
    
    <Router>
    <div className="App">
    {loading && <Loader />}
      <Routes>
        
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/user" element={<UserComponent />} />
        
        <Route path="/" element={<UserLogin />} />
      </Routes>
    </div>
  </Router>
  )
}

export default App
