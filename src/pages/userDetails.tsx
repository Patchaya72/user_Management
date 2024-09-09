import React, { useState, useEffect } from 'react';
import {  UserGetRespons2 } from "../models/userGetRespons2";
import {useSearchParams, useNavigate } from "react-router-dom";
import { Box, Button } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import EditIcon from '@mui/icons-material/Edit';
import { userService } from "../Service/ีuserService";


const UserDetails = () => {
  const [user, setUser] = useState<UserGetRespons2  >();
  const [formData, setFormData] = useState<UserGetRespons2  >();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [searchParam] = useSearchParams();
  const id = searchParam.get("id");
  const service = new userService();

  // Fetch the user data from the API
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response= await service.getUserbyId(Number(id));
        if(response){
        setUser(response);
        setFormData(response);
      } // Initialize form data with user data
      } catch (err) {
        setError('Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const navigateToHome = () => {
    navigate("/");
  };

  // Handle input changes for the form fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (formData) {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Handle saving the edited data
  const handleSave = async () => {
    if(formData){
    const updatedUser = await service.editUser(formData.id, formData);
    alert("แก้ไขสำเร็จ");
    console.log('Updated User Data:', updatedUser);
    setUser(updatedUser); 
    setIsEditing(false);
  }
  };


  const handleCancel = () => {
    setFormData(user); 
    setIsEditing(false); 
  };

  if (loading) {
    return <div  style={{
      height: "100vh", // เต็มความสูงของ viewport
      width: "100vw", // เต็มความกว้างของ viewport
      display: "flex",
      flexDirection: "column",
      backgroundColor: "whitesmoke",
    }} ><p style={{color:"black"}}>Loading...</p></div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div style={{
      height: "auto", // เต็มความสูงของ viewport
      width: "100vw", // เต็มความกว้างของ viewport
      backgroundColor: "gainsboro",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center", // จัดข้อมูลให้อยู่ตรงกลางแนวตั้ง
      alignItems: "center", // จัดข้อมูลให้อยู่ตรงกลางแนวนอน
      position: "relative", // สำหรับวางตำแหน่งปุ่ม Back และ Edit
    }} >
      <Button
    onClick={navigateToHome}
    sx={{
      position: "absolute",
      top: 20,
      left: 20, // ตำแหน่งด้านซ้ายของปุ่ม
    }} startIcon={<ArrowBackIosIcon />}
  >
    Back
  </Button>

   {!isEditing && (
    <Button
    color="warning"
    variant="contained" 
      onClick={() => setIsEditing(true)}
      sx={{
        position: "absolute",
        top: 50,
        right: 200, // ตำแหน่งด้านขวาของปุ่ม
      }}
      endIcon={<EditIcon />}
    >
      Edit
    </Button>
  )}
  <Box sx={{ textAlign: "center" ,color:"black",  backgroundColor:"whitesmoke", borderRadius: '8px', margin:"40px",width:"900px"}}>
      <h1>User Details</h1>
      {formData && (
        <>
          <img  src={formData.image} alt={`${formData.firstName} ${formData.lastName}` } style={{height: "100px",width: "100px",}} />
          
          <p><strong>ID:</strong> {formData.id}</p>
          <p>
            <strong>Name:</strong>
            {isEditing ? (
              <>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
              </>
            ) : (
              `${formData.firstName} ${formData.lastName}`
            )}
          </p>

          <p>
            <strong>Maiden Name:</strong>
            {isEditing ? (
              <input
                type="text"
                name="maidenName"
                value={formData.maidenName}
                onChange={handleInputChange}
              />
            ) : (
              formData.maidenName
            )}
          </p>

          {/* Editable Age, Gender */}
          <p>
            <strong>Age:</strong>
            {isEditing ? (
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
              />
            ) : (
              formData.age
            )}
          </p>
          <p>
            <strong>Gender:</strong>
            {isEditing ? (
              <input
                type="text"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
              />
            ) : (
              formData.gender
            )}
          </p>

          {/* Editable Email and Phone */}
          <p>
            <strong>Email:</strong>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            ) : (
              formData.email
            )}
          </p>
          <p>
            <strong>Phone:</strong>
            {isEditing ? (
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            ) : (
              formData.phone
            )}
          </p>

          {/* Editable Address */}
          <h2>Address</h2>
          <p>
            <strong>Address:</strong>
            {isEditing ? (
              <>
                <input
                  type="text"
                  name="address"
                  value={formData.address.address}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, address: e.target.value },
                    })
                  }
                />
                <input
                  type="text"
                  name="city"
                  value={formData.address.city}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, city: e.target.value },
                    })
                  }
                />
                <input
                  type="text"
                  name="state"
                  value={formData.address.state}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, state: e.target.value },
                    })
                  }
                />
              </>
            ) : (
              `${formData.address.address}, ${formData.address.city}, ${formData.address.state}`
            )}
          </p>

          {/* Editable Hair */}
          <p>
            <strong>Hair:</strong> Color: {isEditing ? (
              <input
                type="text"
                name="hairColor"
                value={formData.hair.color}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    hair: { ...formData.hair, color: e.target.value },
                  })
                }
              />
            ) : (
              formData.hair.color
            )}, Type: {isEditing ? (
              <input
                type="text"
                name="hairType"
                value={formData.hair.type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    hair: { ...formData.hair, type: e.target.value },
                  })
                }
              />
            ) : (
              formData.hair.type
            )}
          </p>

          {/* Editable Company */}
          <h2>Company</h2>
          <p>
            <strong>Company:</strong> {formData.company.name}, Department: {formData.company.department}, Title: {formData.company.title}
          </p>
          <p>
            <strong>Company Address:</strong> {isEditing ? (
              <>
                <input
                  type="text"
                  name="companyAddress"
                  value={formData.company.address.address}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      company: {
                        ...formData.company,
                        address: { ...formData.company.address, address: e.target.value },
                      },
                    })
                  }
                />
              </>
            ) : (
              formData.company.address.address
            )}
          </p>

          {/* Other Fields */}
          <p><strong>Birth Date:</strong> {formData.birthDate}</p>
          <p><strong>Height:</strong> {formData.height} cm</p>
          <p><strong>Weight:</strong> {formData.weight} kg</p>

          {/* Edit/Save and Cancel buttons */}
          {isEditing ? (
            <div style={{margin:"5px"}} >
              <Button   variant="contained" color="success"  sx={{ marginRight: 2 }} onClick={handleSave}>Save</Button>
              <Button  variant="contained"  color="error" onClick={handleCancel}>Cancel</Button>
            </div>
          ) : (
           <></>
          )}
        </>
      )}
    </Box>
    </div>
  );
};

export default UserDetails;
