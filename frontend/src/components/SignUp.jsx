import "../Signup.css";
import { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios"
import {Loader} from "./Loader"

export function SignUp() {
    const [loading,setLoading]=useState(true);
    const [formData, setFormData] = useState({
        Name:"",
        Email:"",
        Password:"",
        ConfirmPassword:""
    });
    const [error,setError]=useState("");
    const navigate = useNavigate()
    useEffect(()=>{
        setLoading(true);
        document.body.classList.add("signup-body");

        setLoading(false)
        return () => {
            document.body.classList.remove("signup-body");
        };
    },[])
    if (loading) {
        return <Loader />; // Show loader while loading
      }
    const handleChange = (e) => {
        
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError("");
    };


    async function handleSubmit(e) {
        e.preventDefault();
        if(!formData){
            alert("please enter details");
            return;
        }
        if (formData.Password !== formData.ConfirmPassword) {
            setError("passwords do not match");
            return;
        }
        try {
            const response = await axios.post("http://localhost:5000/user/sign-up", {
                    Name:formData.Name,
                    Email:formData.Email,
                    Password:formData.Password
            },{
                "Content-Type": "application/json",
              });
              if(response.status===201){
                const token=`Bearer ${response.data.token}`;
                console.log("user registered succesfully");
                localStorage.setItem("Authorization",token);
                localStorage.setItem("UserId",response.data.user);
                navigate("/user")

              }
            
        } catch (e) {
            setError(`${e.response?.data?.message || e.message}`);
        }
    }




    return <div className="signup-container">
        <h1>Create Your Account</h1>
        <p className="paragraph">Sign up to get started!</p>
        <form onSubmit={handleSubmit}>
            <label htmlFor="name">Name </label> <br />
            <input type="text" id="name" placeholder="Enter your name" name="Name" value={formData.Name}
                onChange={handleChange} />
            <br />
            <label htmlFor="email">Email Address </label> <br />
            <input type="email" id="email" placeholder="Enter email" name="Email" value={formData.Email}
                onChange={handleChange} />
            <br />
            <label htmlFor="password">Password </label> <br />
            <input type="password" id="password" placeholder="Create a password" name="Password" value={formData.Password}
                onChange={handleChange} />
            <br />
            <label htmlFor="confirmPassword">Confirm Password </label> <br />
            <input type="password" id="confirmPassword" placeholder="Confirm your password" name="ConfirmPassword" value={formData.ConfirmPassword}
                onChange={handleChange} />
            <br />
            {error && <p style={{ color: "red" }}>{error}</p>} <br />
            <button type="submit">Register</button>
            <p className="paragraph">Already have an account? <Link to="/login">Login here</Link></p>
           

        </form>
    </div>
}