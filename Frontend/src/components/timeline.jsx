// 

// practice

import React, { useState, useEffect } from 'react';
import { Typography, AppBar, Toolbar, Box, Button, Container, Card, CardContent, Avatar, IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { AspectRatio } from '@mui/joy';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

export default function Timeline() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/timeline", {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            token: token
          }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();

        setPosts(
          result.posts.map(post => ({
            ...post,
            liked: post.postliked.some(like => like.userId === result.userId),
            mypost: post.user._id === result.userId ? true : false,
            likeCount: post.postliked.length 
          })));

      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, []);

  const handleLikeDislike = async (postId) => {
    try {
      const response = await fetch(`http://localhost:5000/like/${postId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': localStorage.getItem('token')
        }
      });
      const data = await response.json();

      if (response.ok) {
        setPosts(prevPosts =>
          prevPosts.map(post =>
            post._id === postId
              ? { ...post, likeCount: data.likeCount, liked: data.liked }
              : post
          )
        );
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    socket.on("postLiked", (data) => {
      
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post._id === data.postId
            ? { ...post, likeCount: data.likeCount}
            : post
        )
      );
    });
    return () => {
      socket.off("postLiked");
    };
  }, []);
  const deletePost = async (postId) => {
    const token = localStorage.getItem('token'); 
    try {
      const response = await fetch(`http://localhost:5000/post/delete/${postId}`, {
        method: "DELETE", 
        headers: {
          'Content-Type': 'application/json',
          'token': token,  
        },
      });
  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete the post');
      }
  
      setPosts((prevPosts) => prevPosts.filter(post => post._id !== postId));
      const result = await response.json();
      alert(result.message);  
    } catch (error) {
      console.error('Error deleting post:', error.message);
      alert('Error deleting post: ' + error.message);  
    }
  };
  function logout() {
    localStorage.removeItem('token');
    navigate('/');
  }

  return (
    <>
      <AppBar component="nav" sx={{ backgroundColor: 'black' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}>
            Social App
          </Typography>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}>
            TimeLine
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Button variant="text" sx={{ margin: '10px 0px', color: "white" }} onClick={() => navigate('/profile')}>Profile</Button>
            <Button variant="text" sx={{ margin: '10px 0px', color: "white" }} onClick={() => navigate('/createpost')}>Create Post</Button>
            <Button variant="text" sx={{ margin: '10px 0px', color: "white" }} onClick={logout}>Log Out</Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Container sx={{ marginTop: 10 }}>
        {posts.slice().reverse().map((post) => (
          <Card variant="outlined" sx={{ width: 320, margin: "auto", marginTop: 5 }} key={post._id}>
            <Typography sx={{ backgroundColor: "black", color: "white", display: "flex" }} variant="h6">
              <Avatar alt="User Profile Photo" src={`http://localhost:5000${post.user.profilePic}`} sx={{ width: 28, height: 28, marginRight: 1, my: 0.5 }} />
              {post.user.name}


              { post.mypost &&   <div > 
  <IconButton
  sx={{ color: "white" }}
  onClick={() => navigate(`/updatepost/${post._id}`)} 
>
  <EditIcon />
</IconButton>

 <IconButton
    sx={{ color: "white" }}
            onClick={() => deletePost(post._id)} 
  >
    <DeleteOutlinedIcon />
  </IconButton></div>

              }
            </Typography>

            <CardContent>
              <Typography variant="h5">{post.title}</Typography>
              <Typography>{post.content}</Typography>
            </CardContent>

            {post.image && (
              <AspectRatio ratio="2">
                <img src={`http://localhost:5000/${post.image.replace(/\\/g, '/')}`} alt="Post" style={{ maxWidth: '100%', height: 'auto' }} />
              </AspectRatio>
            )}

            <CardContent sx={{ padding: 0 }}>
              <Typography variant="body-xs" textColor="text.secondary" sx={{ fontWeight: 'md' }}>
                <IconButton
                  aria-label="like"
                  size="medium"
                  onClick={() => handleLikeDislike(post._id)}
                >
                  <FavoriteIcon fontSize="inherit" color={post.liked ? "error" : "disabled"} />
                </IconButton>
                <Typography variant="p" sx={{ marginRight: "50px" }}>{post.likeCount}</Typography>
                {new Date(post.createdAt).toLocaleDateString()}
              </Typography>
            </CardContent>
          </Card>
        ))}
        {error}
      </Container>

      <Container maxWidth={false} disableGutters sx={{ width: "100%", textAlign: "center", backgroundColor: "black", color: "white", py: "10px", mt: "60px" }}>
        Your Timeline Feed Ends Here
      </Container>
    </>
  );
}
