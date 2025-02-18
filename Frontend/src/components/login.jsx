import React, { useState } from 'react';
import { Paper, TextField, Button, Typography, Alert ,Box} from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleNavigateToSignup = () => {

        setTimeout(() => {
            navigate('/signup');
        }, 700);
      };
      const handleNavigateToforgetpassword = () => {
        setTimeout(() => {
            navigate('/forgetpassword');
        }, 700);
        
      };

    const handleLogin = async (e) => {
        e.preventDefault();
        const formData = { email, password };
        try {
            const response = await fetch(`http://localhost:5000/login`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                setMessage(data.message || 'Login successful!');
// fetchProtectedData();
                setEmail(""); 
                setPassword(""); 
                setTimeout(() => {
                    navigate("/timeline");
                }, 1500);
            } else {
                setError(data.message || 'Login failed!');
            }
        } catch (error) {
            setError(' error ' + error.message);
        }
    };

    // const fetchProtectedData = async () => {
    //     const token = localStorage.getItem('token');
    //     try {
    //         const response = await fetch('http://localhost:4000/protected', {
    //             headers: {
    //            'token': token 
    //             },
    //         });
    //         if (response.ok) {
    //             navigate("/timeline");
    //         } else {
    //             navigate('/');
    //         }
    //     } catch (error) {
    //         navigate('/');
    //     }
    // };
    
    return (
        <Box sx={{backgroundColor:"rgb(24, 23, 23)",height:"100vh",paddingTop:10,}}>
        <Paper elevation={3} sx={{ margin: "auto",  width: "35%", textAlign: "center", py: 5}}>
            <Typography variant='h5'>Login Form</Typography>
            <form onSubmit={handleLogin}>
                <TextField
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    label="Email"
                    variant="outlined"
                    sx={{ width: "80%", my: 1  }}
                />
                <TextField
                    id="password"
                    label="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    variant="outlined"
                    sx={{ width: "80%", my: 1  ,color: "black"}}
                />
                <br />
                <Button variant="contained" type="submit" sx={{ margin: '10px 0px',backgroundColor:"black" }}>Login</Button> <br />
           

            </form>
            {message && <Alert severity="success" sx={{ mt: 2, width: '80%', borderRadius: "20px", margin: 'auto' }}>{message}</Alert>}
            {error && <Alert severity="error" sx={{ mt: 2, width: '80%', borderRadius: "20px", margin: 'auto' }}>{error}</Alert>} <br />
            <Button 
      variant="text" 
      sx={{ margin: '10px 0px',color:"black"  }} 
      onClick={handleNavigateToSignup}
    >
      Doesn't Have an Account
    </Button> <br />
    <Button 
      variant="text" 
      sx={{ margin: '10px 0px',color:"black"  }} 
      onClick={handleNavigateToforgetpassword}
    >
      Forget Password
    </Button>
    
        </Paper>
        </Box>
    );
}
