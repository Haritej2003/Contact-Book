import { useState, useEffect } from "react"
import "../User.css"
import axios from "axios"
export function AddContact({setShowAddContact,setContacts}) {
  const [contact, setContact] = useState({
    Name: "",
    PhnNumber: "",
    Description: "",
    UserId:"",
    _id:"",
    __v:""
  })
  const [error,setError]=useState("")
  const handleChange = (e) => {

    setContact({ ...contact, [e.target.name]: e.target.value });

    setError("");
  };
  async function handleSubmitContact(e) {
    e.preventDefault();
    try{
      if (!contact.Name || !contact.PhnNumber) {
        setError("Name and Phone Number are required.");
        return;
      }
      
      const response = await axios.post("http://localhost:5000/contact/add", {
        Name:contact.Name, PhnNumber:contact.PhnNumber, Description:contact.Description, UserId: localStorage.getItem("UserId")
      }, { headers: { "Content-Type": "application/json", "Authorization": localStorage.getItem("Authorization") } });
      if(response.status===200){
          alert("Contact added successfully");
          setContacts(prev => [...prev, response.data.contact]); // Update contact list
          setShowAddContact(false); // Close modal
      }
    }catch(er){
       console.error("Error adding contact",er.message);
       setError(`Failed to add contact. ${er.response?.data?.message || er.message}`);


    }


  }
  return (
    <div>
      <form onSubmit={handleSubmitContact}>
        <label htmlFor="name">Name </label> <br />
        <input type="text" id="name" placeholder="Enter contact name" name="Name" value={contact.Name}
          onChange={handleChange} />
        <br />
        <label htmlFor="PhnNumber">Phone Number</label> <br />
        <input type="text" id="PhnNumber" placeholder="Enter Phone Number" name="PhnNumber" value={contact.PhnNumber}
          onChange={handleChange} />
        <br />
        <label htmlFor="description">Description </label> <br />
        <input type="text" id="description" placeholder="Give a description" name="Description" value={contact.Description}
          onChange={handleChange} />
        <br />
        {error && <p style={{ color: "red" }}>{error}</p>} <br />
        <button type="submit">Add</button>
      </form>
    </div>
  )
}
