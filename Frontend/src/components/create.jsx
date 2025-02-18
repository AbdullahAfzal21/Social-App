import React, { useState } from "react";
import {
  Typography,
  AppBar,
  Toolbar,
  Box,
  Button,
  TextField,
  Container,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function CreatePost() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const createPost = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (image) formData.append("image", image); 

    try {
      const response = await fetch("http://localhost:5000/create-post", {
        method: "POST",
        headers: {
        token:token,
        },
        body: formData, 
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || "Post created successfully!");
        setTitle(""); 
        setContent("");
        setTimeout(() => navigate("/timeline"), 1500);
      } else {
        setError(data || "Failed to create post.");
      }
    } catch (error) {
      setError("Error: " + error.message);
    }
  };

  return (
    <>
      <AppBar component="nav" sx={{ backgroundColor: "black" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Social App
          </Typography>
          <Typography variant="h5" sx={{ flexGrow: 1 }}>
            Create Post
          </Typography>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            <Button
              variant="text"
              sx={{ margin: "10px 0px", color: "white" }}
              onClick={() => navigate("/profile")}
            >
              Profile
            </Button>
            <Button
              variant="text"
              sx={{ margin: "10px 0px", color: "white" }}
              onClick={() => navigate("/timeline")}
            >
              TimeLine
            </Button>
            <Button
              variant="text"
              sx={{ margin: "10px 0px", color: "white" }}
              onClick={logout}
            >
              Log Out
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container
        sx={{
          margin: "auto",
          width: "30%",
          mt: "150px",
        }}
      >
        <Typography variant="h5" gutterBottom sx={{ textAlign: "center" }}>
          Create a New Post
        </Typography>

        {/* Display messages */}
        {message && <Typography color="success.main">{message}</Typography>}
        {error && <Typography color="error.main">{error}</Typography>}

        <form onSubmit={createPost}>
          {/* Title Input */}
          <TextField
            label="Title"
            fullWidth
            required
            margin="normal"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* Content Input */}
          <TextField
            label="Content"
            fullWidth
            required
            multiline
            rows={4}
            margin="normal"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          {/* Image Input */}
          <Button
            variant="outlined"
            component="label"
            fullWidth
            sx={{ margin: "10px 0" }}
          >
            Upload Image (Optional)
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </Button>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: "20px" }}
          >
            Create Post
          </Button>
        </form>
      </Container>
    </>
  );
}
