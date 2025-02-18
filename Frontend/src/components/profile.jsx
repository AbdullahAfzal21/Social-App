import React,{useState,useEffect} from 'react';
import { Typography, AppBar, Toolbar, Box, Button, Container,  Card,
    CardContent,Avatar,IconButton } from '@mui/material';
    import FavoriteIcon from '@mui/icons-material/Favorite';
    import { CardOverflow,AspectRatio   } from '@mui/joy';
    import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
    import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

export default function Profile() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [userdata, setuserdata] = useState({});
  const [newdp, setdp] = useState(false);
  const [image, setimage] = useState("");


 
  const handleImageChange = (e) => {
    setimage(e.target.files[0]);
  }; 
  const uploaddp = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!image) {
      alert("Please select an image file.");
      return;
    }

    const formData = new FormData();
    formData.append("image", image); 

    try {
      const response = await fetch("http://localhost:5000/update/profilepic", {
        method: "PUT",  
        headers: {
          token: token,
      },
        body: formData,  
      });

      if (response.ok) {
        setdp(false);  
        alert("Profile picture updated successfully!");
        window.location.reload();
      } else {
        const data = await response.json();
        setError(data.error || "Something went wrong.");
        alert("Profile pic not uploaded!");
      }
    } catch (error) {
      setError("Error: " + error.message);
      alert("Error uploading profile picture.");
    }
  };

  function newprofilepic(){
setdp(true);
  }
  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/profile", {
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
       
        setPosts(result.posts.map(post => ({
          ...post,
          liked: post.postliked.some(like => like.userId === result.userId),
          likeCount: post.postliked.length 
        }
      )));
        try {
          const response = await fetch("http://localhost:5000/userdata", {
            method: "GET",
            headers: {
              'Content-Type': 'application/json',
              token: token
            }
          });
  
          if (!response.ok) {
            alert("Failed to fetch user data");
            throw new Error("Failed to fetch user data");

          }
          const result = await response.json();
          setuserdata(result);
          
        } catch (error) {
          setError(error.message);
          alert("Failed to fetch user data");
          navigate('/');
        }

      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, [navigate]);


  
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
  function logout(){
    localStorage.removeItem('token');
    navigate('/');
  }

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

  return (
    <>
      <AppBar component="nav" sx={{ backgroundColor: 'black' }}>
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
            Social App
          </Typography>
          <Typography
            variant="h5"
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
         My Profile
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Button
              variant="text"
              sx={{ margin: '10px 0px', color: "white" }}
              onClick={() => navigate('/timeline')}
            >
           Timeline
            </Button>
            <Button
              variant="text"
              sx={{ margin: '10px 0px', color: "white" }}
              onClick={() => navigate('/createpost')}
            >
              Create Post
            </Button>
            
            <Button
              variant="text"
              sx={{ margin: '10px 0px', color: "white" }}
              onClick={logout}
            >
              Log Out
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container sx={{ marginTop: 10 }}>
        {error && <Typography color="error">{error}</Typography>}
<Box sx={{width:"40%",margin:"auto"}}>
        <Avatar
     alt="Image Post"
     src={`http://localhost:5000${userdata.profilePic}`}
  sx={{ width: 200, height: 200 }}
  
/>
<div>
      <Button
        variant="text"
        sx={{ padding: "6px 30px", color: "BLACK" }}
        onClick={newprofilepic}
      >
        Upload Profile Pic
      </Button>

      {newdp && (
        <form onSubmit={uploaddp}>
          <input
            type="file"
            onChange={handleImageChange}
            style={{ display: "none" }}
            id="profile-pic-input"
          />
          <label htmlFor="profile-pic-input">
            <Button
              variant="outlined"
              sx={{ padding: "6px 30px", color: "black" }}
              component="span"
            >
              Choose File
            </Button>
          </label>

          <br />
          <Button
            variant="contained"
            sx={{ marginTop: "5px" }}
            type="submit"
          >
            Upload
          </Button>
        </form>
      )}

      {error && <p>{error}</p>}
    </div>

<Typography variant='h6'><b>NAME :</b> {userdata.name}</Typography>
<Typography variant='h6'><b>EMAIL :</b> {userdata.email}</Typography>
<Typography variant='h6'><b>AGE :</b> {userdata.age}</Typography>
</Box>
        
        {posts.length===0? <Typography variant='h5' sx={{textAlign:"center",paddingTop:20}}>You Dont Have any Post</Typography>:  posts.slice().reverse().map((post) =>{
          return (
            <Card variant="outlined" sx={{ width: 320, margin: "auto", marginTop: 5 }} key={post._id}>
<Typography sx={{ backgroundColor: "black", color: "white", display: "flex" ,justifyContent:"space-between"}} variant="h6">

  <Avatar
    alt="User Profile Photo"
    src={`http://localhost:5000${post.user.profilePic}`}
    sx={{ width: 28, height: 28, marginRight: 1, my: 0.5 }}
  />
    {post.user.name}


  <div sx={{ marginLeft: "20px" }}> 
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
</Typography>

              <CardContent>
                <Typography variant="h5">{post.title}</Typography>
                <Typography>{post.content}</Typography>
              </CardContent>

              {post.image &&
      <AspectRatio ratio="2">
        <img
src={`http://localhost:5000/${post.image.replace(/\\/g, '/')}` }
  alt={ 'Placeholder'}
  style={{ maxWidth: '100%', height: 'auto' }}
/>
   </AspectRatio>
        }

              <CardOverflow variant="soft" sx={{ bgcolor: 'background.level1' , padding: 0 }}>
                <CardContent orientation="horizontal" sx={{ padding: 0 }}>
      <Typography level="body-xs" textColor="text.secondary" sx={{ fontWeight: 'md' }}>
                <IconButton
                  aria-label="like"
                  size="medium"
                  onClick={() => handleLikeDislike(post._id)}
                >
                  <FavoriteIcon fontSize="inherit" color={post.liked ? "error" : "disabled"} />
                </IconButton>
                    <Typography variant='p' sx={{ marginRight: "50px" }}>{post.likeCount}</Typography>
                    {new Date(post.createdAt).toLocaleDateString()}
                  </Typography>
                </CardContent>
              </CardOverflow>
            </Card>
          );
        })}
      </Container>
<Container  maxWidth={false} 
    disableGutters  sx={{width:"100%",textAlign:"center",backgroundColor:"black",color:"white",py:"10px ",mt:"60px"}}>Your Profile Feed Ends Here</Container>
    </>
  );
}
