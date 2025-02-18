import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Typography, TextField, Button, Container, AppBar, Toolbar, Box } from "@mui/material";

export default function Updatepost() {
  const { id } = useParams();  
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");



  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (image) formData.append("image", image);

    try {
      const response = await fetch(`http://localhost:5000/post/edit/${id}`, {
        method: "PUT",
        headers: {
          token: token,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(data.message || "Post updated successfully!");
        setTimeout(() => navigate(`/profile`), 1500);
      } else {
        const data = await response.json();
        throw new Error(data.message || "Failed to update the post");
      }
    } catch (error) {
      setError(error.message);
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
            Edit Post
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
              onClick={() => localStorage.removeItem("token")}
            >
              Log Out
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container sx={{ margin: "auto", width: "30%", mt: "150px" }}>
        <Typography variant="h5" gutterBottom sx={{ textAlign: "center" }}>
          Edit Your Post
        </Typography>


        {message && <Typography color="success.main">{message}</Typography>}
        {error && <Typography color="error.main">{error}</Typography>}

        <form onSubmit={handleSubmit}>

          <TextField
            label="Title"
            fullWidth
            margin="normal"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />


          <TextField
            label="Content"
            fullWidth
            multiline
            rows={4}
            margin="normal"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />


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
              onChange={handleImageChange}
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
            Update Post
          </Button>
        </form>
      </Container>
    </>
  );
}
