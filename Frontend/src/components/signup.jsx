import React, { useState } from 'react';
import { Paper, TextField, Button, Typography, Alert ,Box} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [age, setAge] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [otp, setOtp] = useState("");
    const [messageotp, setMessageotp] = useState("");
    const [errorotp, setErrorotp] = useState("");

  const navigate = useNavigate();

  const handleNavigateTologin = () => {
    setTimeout(() => {
        navigate('/');
    }, 700);
  };

    const handleSignup = async (e) => {
        e.preventDefault();

        const formData = { name, email, age, password };
        try {
            const response = await fetch(`http://localhost:5000/signup`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const data = await response.json();
                setMessage(data.message || 'Signup successful!');
            } else {
                const dataa = await response.json();
                setError(dataa.message || 'Signup failed!');
            }
        } catch (error) {
            setError('An error occurred while signing up: ' + error.message);
        }
    }

    const handleOtp = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/verifyotp`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, otp })
            });

            if (response.ok) {
                const data = await response.json();
                setMessageotp(data.message || 'OTP match successful!');
                setName("");
                setEmail(""); 
                setAge(""); 
                setPassword(""); 
                setOtp("");
                setTimeout(() => {
                    navigate('/');
                }, 1500);
            } else {
                const dataa = await response.json();
                setErrorotp(dataa.message || 'OTP match failed!');
            }
        } catch (error) {
            setError('An error occurred while matching OTP: ' + error.message);
        }
    }

    return (
        <Box sx={{backgroundColor:"rgb(24, 23, 23)",paddingY:10}}>
        <Paper elevation={3} sx={{ margin: "auto", width: "35%", textAlign: "center", py: 5 }}>
            <Typography variant='h5'> SIGN UP Form</Typography>
            <TextField id="name" type='text' value={name} onChange={(e) => { setName(e.target.value) }} label="Name" variant="outlined" sx={{ width: "80%", my: 1 }} />
            <TextField id="email" type="email" value={email} onChange={(e) => { setEmail(e.target.value) }} label="Email" variant="outlined" sx={{ width: "80%", my: 1 }} />
            <TextField id="age" type='text' value={age} onChange={(e) => { setAge(e.target.value) }} label="Age" variant="outlined" sx={{ width: "80%", my: 1 }} />
            <TextField id="password" label="Password" value={password} onChange={(e) => { setPassword(e.target.value) }} type="password" variant="outlined" sx={{ width: "80%", my: 1 }} /> <br />
            <Button variant="contained" onClick={handleSignup} sx={{ margin: '10px 0px',backgroundColor:"black" }}>SIGN UP</Button> <br />
            {message && <Alert severity="success" sx={{ mt: 2, width: '80%', borderRadius: "20px", margin: 'auto' }}>{message}</Alert>}
            {error && <Alert severity="error" sx={{ mt: 2, width: '80%', borderRadius: "20px", margin: 'auto' }}>{error}</Alert>}

            {message && <><TextField id="otp" type="text" value={otp} onChange={(e) => { setOtp(e.target.value) }} label="OTP" variant="outlined" sx={{ width: "80%", my: 1 }} /> <br />
                <Button variant="contained" onClick={handleOtp} sx={{ margin: '10px 0px',backgroundColor:"black" }}>Verify OTP</Button> <br /> </>}
            <br />
            <Button 
      variant="text" 
      sx={{ margin: '2px 0px',color:"black"  }} 
      onClick={handleNavigateTologin}
    >
      Have an Account
    </Button> <br />
            {messageotp && <Alert severity="success" sx={{ mt: 2, width: '80%', borderRadius: "20px", margin: 'auto' }}>{messageotp}</Alert>}
            {errorotp && <Alert severity="error" sx={{ mt: 2, width: '80%', borderRadius: "20px", margin: 'auto' }}>{errorotp}</Alert>}
        </Paper>
        </Box>
    )
}

export default Signup;
