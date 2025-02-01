import { useState, useEffect } from "react"
import "../User.css"
import axios from "axios"
import {AddContact} from "./AddContact"
import {DeleteContact} from "./DeleteContact"
import { useNavigate } from 'react-router-dom';
import {Loader} from './Loader';


export function UserComponent({ props }) {
  const [loading, setLoading] = useState(true)
  const [userDetails, setUserDetails] = useState({
    Name: "",
    Email: "",
  });
  const [contactList, setContacts] = useState([]);
  const [showAddContact, setShowAddContact] = useState(false);
  const [showDeleteContact, setShowDeleteContact] = useState(false);
  const navigate=useNavigate();
  useEffect(() => {
    document.body.classList.add("user-body");

    async function FetchData() {
      setLoading(true);
      try {
        
        const response = await axios.post("http://localhost:5000/user/current-user", {},
          { headers: { "Content-Type": "application/json", "Authorization": localStorage.getItem("Authorization") } });
        if (response.status === 200) {
          console.log("user received successfully");
          
          setUserDetails(response.data.user)
          setContacts(response.data.contacts || []);
        }
      } catch (error) {
        console.error("error occured ", error.message);
        if (error.response) {
          if (error.response.status === 401) {
            console.log("Session Expired. Please Login again");
            // navigate to login page
          }
          if (error.response.status === 402) {
            setContacts([]);
          }

        }
      }finally {
        setLoading(false); // Stop loading when the request finishes (success or failure)
      }
    }
    FetchData();
    return () => {
      document.body.classList.remove("user-body");
    };

  }, [])
  if (loading) {
    return <Loader />; // Show loader while loading
  }
  function handleLogout(){
    // e.preventDefault();
    localStorage.removeItem("UserId");
    localStorage.removeItem("Authorization");
    navigate("/");
  }
  return <div >
    <UserDetails user={userDetails} 
    onAddContact={() => setShowAddContact(true)}
    onDeleteContact={() => setShowDeleteContact(true)} 
    handleLogout={()=>handleLogout()}/>
    <Contacts contacts={contactList} />
    {/* Modal for adding a contact */}
    {showAddContact && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-btn" onClick={() => setShowAddContact(false)}>×</span>
            <AddContact setShowAddContact={setShowAddContact} setContacts={setContacts} />
          </div>
        </div>
      )}
      {showDeleteContact && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-btn" onClick={() => setShowDeleteContact(false)}>×</span>
            <DeleteContact setShowDeleteContact={setShowDeleteContact} setContacts={setContacts} contactList={contactList} />
          </div>
        </div>
      )}
  </div>
}
function UserDetails({ user, onAddContact, onDeleteContact, handleLogout }) {
 
  return (
    <div className="user-container">
      
      <div className="user-info">
        <div className="input-group">
          <label htmlFor="Name">Name:</label>
          <input type="text" id="Name" readOnly value={user.Name} />
        </div>
        <div className="input-group">
          <label htmlFor="Email">Email Address:</label>
          <input type="email" id="Email" readOnly value={user.Email} />
        </div>
      </div>

      
      <div className="button-group">
        
        <button className="add-btn" onClick={onAddContact}>Add Contacts</button>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
        <button className="delete-btn" onClick={onDeleteContact}>Delete Contacts</button>
      </div>
    </div>
  );


}
function Contacts({ contacts }) {
  return (
    <div className="contacts-container">
      <table className="contacts-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Phone Number</th>
            <th >Description</th>
          </tr>
        </thead>
        <tbody>
          {contacts.length > 0 ? (
            contacts.map((contact, index) => (
              <Contact
                key={contact._id}
                index={index}
                Name={contact.Name}
                PhnNumber={contact.PhnNumber}
                Description={contact.Description.length > 0 ? contact.Description : "No Description"}
              />
            ))
          ) : (
            <NoContact />
          )}
        </tbody>
      </table>
    </div>
  );
}

function Contact({ index, Name, PhnNumber, Description }) {
  return (
    <tr>
      <td>{index + 1}</td>
      <td>{Name}</td>
      <td>{PhnNumber}</td>
      <td className="description">{Description}</td>
    </tr>
  );
}

function NoContact() {
  return (
    <tr className="no-contact">
      <td colSpan={4}>OOPS.... NO CONTACTS</td>
    </tr>
  );
}


export default UserComponent;