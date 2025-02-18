import React, { useState } from 'react';
import { Paper, TextField, Button, Typography, Alert ,Box} from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function ForgetPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [messageOtp, setMessageOtp] = useState("");
  const [errorOtp, setErrorOtp] = useState("");

  const sendEmail = async () => {
    try {
      const response = await fetch(`http://localhost:5000/forgetpassword`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        setError("");
      } else {
        setError( "Doesn't Have Account on this Email.");
      }
    } catch (error) {
      setError("Error: " + error.message);
    }
  };

  const handleOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/verifyotp/newpassword`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp, newpassword: newPassword }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessageOtp(data.message);
        setErrorOtp("");
        setTimeout(() => {
          navigate('/');
      }, 1200);

      } else {
        setErrorOtp(data.error || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      setErrorOtp("Error: " + error.message);
    }
  };

  return (
    <Box sx={{backgroundColor:"rgb(24, 23, 23)",paddingY:5,height:"100vh"}}>
    <Paper
      elevation={3}
      sx={{ margin: "auto", marginTop: "50px", width: "35%", textAlign: "center", py: 5 }}
    >
      <Typography variant="h5">FORGET PASSWORD Form</Typography>

      <TextField
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        label="Email"
        variant="outlined"
        sx={{ width: "80%", my: 1 }}
      />
      <Button variant="contained" onClick={sendEmail} sx={{ margin: "10px 0px" ,backgroundColor:"black"}}>
        Send Email
      </Button>

      {message && (
        <>
          <Alert severity="success" sx={{ mt: 2, width: "80%", borderRadius: "20px", margin: "auto" }}>
            {message}
          </Alert>
          <TextField
            id="otp"
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            label="OTP"
            variant="outlined"
            sx={{ width: "80%", my: 1 }}
          />
          <TextField
            id="password"
            label="Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            type="password"
            variant="outlined"
            sx={{ width: "80%", my: 1 }}
          />
          <Button variant="contained" onClick={handleOtp} sx={{ margin: "10px 0px" ,backgroundColor:"black"}}>
            Verify OTP
          </Button>
        </>
      )}
      {error && (
        <Alert severity="error" sx={{ mt: 2, width: "80%", borderRadius: "20px", margin: "auto" }}>
          {error}
        </Alert>
      )}
      {messageOtp && (
        <Alert severity="success" sx={{ mt: 2, width: "80%", borderRadius: "20px", margin: "auto" }}>
          {messageOtp}
        </Alert>
      )}
      {errorOtp && (
        <Alert severity="error" sx={{ mt: 2, width: "80%", borderRadius: "20px", margin: "auto" }}>
          {errorOtp}
        </Alert>
      )}
    </Paper>
    </Box>
  );
}
