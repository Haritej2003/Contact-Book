import React, { useState, useEffect} from "react";
import "../Login.css";

import axios from "axios"
import { Link, useNavigate } from 'react-router-dom';
export function UserLogin() {
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [error,setError]=useState('');
  const navigate=useNavigate();
  useEffect(() => {
    document.body.classList.add("login-body");

    return () => {
        document.body.classList.remove("login-body");
    };
}, []);
  async function LoginSubmit(e) {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/user/login", { Email, Password,
      }, { headers: { "Content-Type": "application/json" } })

      console.log(response.data.message);
      if(response.status===201){
        
        const token="Bearer "+response.data.token;
        localStorage.setItem("Authorization",token);
        localStorage.setItem("UserId",response.data.user);
        // document.cookie = "token=your_token_here; path=/; secure; HttpOnly; max-age=3600"; //use this instead of localstorage
        navigate("/user")
      }
    } catch (e) {
      if (e.response) {
        // Server responded with a non-2xx status code
        console.log('Error Status:', e.response.status);
        console.log('Error Data:', e.response.data);
        if(e.response.status === 404){
          setError("No account found. Please register");
          console.log("error called")
        }
        else if (e.response.status >= 400) {
          setError("Invalid username or password");
          console.log("error called")
        } else if (e.response.status === 500) {
          // Handle server-side errors
          setError("nternal Server Error");
          console.log('Internal Server Error');
        }
      } else if (e.request) {
        // Request made but no response
        console.log('No response received:', e.request);
      } else {
        // Some error in setting up the request
        console.log('Error Message:', e.message);
      }
    }
  }
  

  return <div className="LoginContainer">
    <h1>Login</h1>
    <form className="form" onSubmit={LoginSubmit}>
      
      <Input  type="email" placeholder="Email" value={Email} Callback={setEmail}/>
      <Input  type="password" placeholder="Password" value={Password} Callback={setPassword}/>
      {error && <p className="error-message" style={{ color: "red" }}>{error}</p>}
      <button type="submit">SUBMIT</button>
      <p className="paragraph">Do not have an account? <Link to="/signup">Click to register</Link></p>
    </form>
  </div>
}

const Input=React.memo(function Input(props){
  return <input
  type={props.type}
  placeholder={props.placeholder}
  value={props.value}
  onChange={(e) => props.Callback(e.target.value)}
  required
/>
})
