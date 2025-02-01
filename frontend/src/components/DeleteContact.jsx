import { useState, useEffect } from "react"
import "../User.css"
import axios from "axios"
export function DeleteContact({contactList,setContacts,setShowDeleteContact}) {
    const [id, setId] = useState('');
    const [error, setError] = useState("");
    const [ContactId,setContactId]=useState('');
    function handleChange(e){
        const inputId = e.target.value;
        const idNum = parseInt(inputId, 10);
        
        if(idNum<0 || isNaN(idNum)){
            setError("Invalid Id");
            return;
        }
        if (idNum >contactList.length) {
            setError("Index out of range");
            return;
          }
        
        setId(inputId);
        setContactId(contactList[idNum-1]._id);
        setError("");
    }
    async function handleSubmitContact(e){
        e.preventDefault();
        
        try{
            if(!ContactId){
                return;
            }
            const response=await axios.delete(`http://localhost:5000/contact/deleteContact?_id=${ContactId}`,{
                headers: { "Content-Type": "application/json", "Authorization": localStorage.getItem("Authorization") }
            })
            if(response.status===200){
                alert("Contact deleted successfully");
                setContacts(prev => prev.filter(contact => contact._id !== ContactId)) // Update contact list
                setShowDeleteContact(false); // Close modal
    
            }
        }catch(e){
            console.error("Error deleting contact",e.message);
            setError(`Failed to delete contact. ${e.response?.data?.message || e.message}`);
        }
    }
    return (
        <div>
            <form onSubmit={handleSubmitContact}>
                <label htmlFor="Id">Enter Index: </label> <br />
                <input type="text" id="Id" placeholder="Enter contact Index to delete" name="id" value={id}
                    onChange={handleChange} />
                <br />
                {error && <p style={{ color: "red" }}>{error}</p>} <br />
                <button type="submit">Delete</button>
            </form>
        </div>
    )
}