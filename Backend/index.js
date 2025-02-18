// const express = require("express");
// const mongoose = require("mongoose");
// const nodemailer = require('nodemailer');
// const multer= require('multer');
// const path = require('path');
// const cors = require("cors");
// const jwt = require("jsonwebtoken");
// const app = express();
// const port = 5000;
// const mysecretkey = "Abc123";
// app.use(cors());
// app.use(express.json());


// function check(req, res, next) {
//     const token = req.headers.token;
//     if (!token) {
//         return res.status(401).send("There is no token");
//     }
//     try {
//         const decodedata= jwt.verify(token, mysecretkey); 
//         req.user = decodedata;
//         next(); 
//     } catch (error) {
//         res.status(400).send("Invalid token");
//     }
// }
// function generate4DigitOTP() {
//     const digits = '0123456789';
//     let otp = '';
//     for (let i = 0; i < 4; i++) {
//         otp += digits[Math.floor(Math.random() * 10)];
//     }
//     return otp;
// }



// async function connection() {
//     try {
//         await mongoose.connect("mongodb://localhost:27017/Socialapp", {
//             useNewUrlParser: true,
//             useUnifiedTopology: true
//         });
//         console.log("Yes, MongoDB is connected");
//     } catch (error) {
//         console.log("It's not connecting", error);
//     }
// }
// connection();

// const userSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true,
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true,
//     },
//     age: {
//         type: Number,
//         required: true,
//     },
//     password: {
//         type: String,
//         required: true,
//         minlength: 2
//     },
//     profilePic: {
//         type: String,
//         default: "/uploads/defaultprofilepic.jpg" 
//     },
//     otp: {
//         type: String,
//         required: false, 
//     },
//     otpVerified: {
//         type: Boolean,
//         default: false, 
//     },
// });
// const User = mongoose.model("User", userSchema);

// const postSchema = new mongoose.Schema({
//     title: {
//         type: String,
//         required: true,
//     },
//     content: {
//         type: String,
//         required: true,
//     },
//     image: {
//         type: String, 
//         required: false,
//     },
//     user: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User", 
//         required: true,
//     },
//     postliked: [
//         {
//             userId: {
//                 type: mongoose.Schema.Types.ObjectId,
//                 ref: 'User',  
//                 required: true
//             }
//         }
//     ],
//     createdAt: {
//         type: Date,
//         default: Date.now,
//     },
// });
// const Post = mongoose.model("Post", postSchema);



// const transporter = nodemailer.createTransport({
//     service: 'gmail', 
//     auth: {
//         user: 'infoaliraza22@gmail.com',
//         pass: 'ievm lijm hsex xjkc'   
//     }
// });
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "uploads/"); 
//     },
//     filename: (req, file, cb) => {
//         const uniqueName = `${Date.now()}-${file.originalname}`;
//         cb(null, uniqueName);
//     },
// });
// const upload = multer({ storage });



// app.post("/signup", async (req, res) => {
//     const userData = req.body;
//     try {
   
//         const otp = generate4DigitOTP();

  
//         const userdata = new User({
//             ...userData,
//             otp: otp,
//         });
//         await userdata.save();


//         const mailOptions = {
//             from: 'infoaliraza22@gmail.com',
//             to: userData.email,
//             subject: 'OTP Verification',
//             text: `Hello ${userData.name},\n\nYour OTP for account verification is: ${otp}\n\nPlease use this to verify your account.\n\nBest regards.`
//         };


//         transporter.sendMail(mailOptions, (error, info) => {
//             if (error) {
//                 console.error("Error sending OTP:", error);
//                 return res.status(500).json({ message: "Error sending OTP: " + error.message });
//             }

//             res.status(200).json({ message: "Signup successful! Please verify your OTP." });
//         });

//     } catch (error) {
//         console.error("Error during signup:", error);
//         res.status(400).json({ message: "Error during signup: " + error.message });
//     }
// });


// app.post("/verifyotp", async (req, res) => {
//     const { email, otp } = req.body;

//     try {
//         const user = await User.findOne({ email });

//         if (!user) {
//             return res.status(404).json({ message: "User not found." });
//         }

//         if (user.otp === otp) {
//             user.otpVerified = true; 
//             user.otp = undefined;
//             await user.save();

//             res.status(200).json({ message: "OTP verified successfully. Account is now active." });
//         } else {
//             res.status(400).json({ message: "Invalid OTP. Please try again." });
//         }

//     } catch (error) {
//         console.error("Error verifying OTP:", error);
//         res.status(500).json({ message: "Error verifying OTP: " + error.message });
//     }
// });


// app.post("/login", async (req, res) => {
//     const { email, password } = req.body;
//     try {
//         let user = await User.findOne({ email });
//         if (!user) {
//             return res.status(404).json("User not found");
//         }
   
//         if (user.otpVerified === false && user.password !== password) {
//             return res.status(401).json({message: "OTP not verified and wrong password"});
//         } else if (user.otpVerified === false) {
//             return res.status(401).json({message:"OTP not verified"});
//         } else if (user.password !== password) {
//             return res.status(401).json({message:"Wrong password"});
//         }
        
//         const token = jwt.sign({ email: user.email, id: user._id }, mysecretkey);
//         return res.status(200).json({
//             message: "User is logged in",
//             token: token
//         });
//     } catch (error) {
//         console.error("Error logging in user:", error);
//         res.status(400).json("Error logging in user: " + error.message);
//     }
// });


// app.post("/forgetpassword", async (req, res) => {
//     const { email } = req.body;

//     try {
//         let user = await User.findOne({ email });

//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         const otp = generate4DigitOTP();

//         user.otp = otp;
//         await user.save();

//         const mailOptions = {
//             from: 'infoaliraza22@gmail.com',
//             to: user.email,
//             subject: 'OTP Verification',
//             text: `Hello ${user.name},\n\nYour OTP for new password is: ${otp}\n\nPlease use this to verify your account.\n\nBest regards.`
//         };

//         transporter.sendMail(mailOptions, (error, info) => {
//             if (error) {
//                 console.error("Error sending OTP:", error);
//                 return res.status(500).json({ message: "Error sending OTP", error: error.message });
//             }
//             res.status(200).json({ message: "OTP sent successfully. Please verify your OTP." });
//         });
//     } catch (error) {
//         console.error("Error during password reset:", error);
//         res.status(400).json({ message: "Error during password reset", error: error.message });
//     }
// });

// app.post("/verifyotp/newpassword", async (req, res) => {
//     const { email, otp, newpassword } = req.body;

//     try {
//         const user = await User.findOne({ email });

//         if (!user) {
//             return res.status(404).json({ message: "User not found." });
//         }

//         if (user.otp === otp) {
//             user.otp = undefined;
//             user.password = newpassword;
//             await user.save();

//             res.status(200).json({ message: "OTP verified successfully. Password is changed." });
//         } else {
//             res.status(400).json({ message: "Invalid OTP. Please try again." });
//         }

//     } catch (error) {
//         console.error("Error verifying OTP:", error);
//         res.status(500).json({ message: "Error verifying OTP", error: error.message });
//     }
// });



// // app.get("/protected",check ,(req, res) => {
// //     const token = req.headers.token;

// //     if (!token) {
// //         return res.status(401).json({ message: "No token provided" });
// //     }

// //     jwt.verify(token, mysecretkey, (err, user) => {
// //         if (err) {
// //             return res.status(403).json({ message: "Invalid token" });
// //         }

// //         res.status(200).json({ message: "Access granted", user });
// //     });
// // });


// // app.post("/profile",check, async (req, res) => {
// //     const { id} = req.user.id;
// //     try {
// //         const user = await User.findOne({id});

// //         if (!user) {
// //             return res.status(404).json({ message: "User not found." });
// //         }else{
// //             res.status(200).json({ message: "Token is right " });
// //         }
// //     } catch (error) {
// //         console.error("Wrong Token not right:", error);
// //         res.status(500).json({ message: "Wrong Token not right:", error: error.message });
// //     }
// // });

// app.post("/create-post", check, upload.single("image"), async (req, res) => {
//     const { title, content } = req.body;
//     try {
//         // Validate input
//         if (!title || !content) {
//             return res.status(400).json("Title and content are required.");
//         }
//         // Create post
//         const post = new Post({
//             title,
//             content,
//             image: req.file ? req.file.path : null, 
//             user: req.user.id, 
//         });
//         await post.save();
//         res.status(201).json({
//             message: "Post created successfully.",
//             post,
//         });
//     } catch (error) {
//         console.error("Error creating post:", error);
//         res.status(500).json("Error creating post: " + error.message);
//     }
// });

// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// app.get("/timeline", check, async (req, res) => {
//     try {

//         const posts = await Post.find()
//             .populate("user", "name profilePic"); 


//         const userId = req.user?.id || req.userId;


//         res.status(200).json({
//           userId: userId,  
//           posts: posts,    
//         });
//     } catch (error) {
//         console.error("Error fetching timeline:", error);
//         res.status(500).json("Error fetching timeline: " + error.message);
//     }
// });




// app.get("/userdata", check, async (req, res) => {
//     try {
//         const loginuser = await await User.findById(req.user.id);
//         res.status(200).json(loginuser);
//     } catch (error) {
//         console.error("Error fetching User Data:", error);
//         res.status(500).json("Error fetching User Data: " + error.message);
//     }
// });

// app.get("/profile",check, async (req, res) => {
//     try {
//         const posts = await Post.find({ user: req.user.id })
//         .populate('user', 'name profilePic');
//         const userId = req.user?.id || req.userId;


//         res.status(200).json({
//           userId: userId,  
//           posts: posts,    
//         });
//     } catch (error) {
//         console.error("Error fetching user posts:", error);
//         res.status(500).json("Error fetching user posts: " + error.message);
//     }
// });

// app.put("/post/edit/:id", check, multer({ dest: "uploads/" }).single("image"), async (req, res) => {
//     try {
//       const postId = req.params.id;
//       const { title, content } = req.body;
//       const post = await Post.findOne({ _id: postId, user: req.user.id });
//       if (!post) {
//         return res.status(404).json("Post not found or you are not authorized to edit this post.");
//       }
  
//       post.title = title || post.title;
//       post.content = content || post.content;
//       if (req.file) {
//         post.image = req.file.path; 
//       }
//       await post.save();
//       res.status(200).json({ message: "Post updated successfully.", post });
//     } catch (error) {
//       console.error("Error updating post:", error);
//       res.status(500).json("Error updating post: " + error.message);
//     }
//   });
  

// app.put("/update/profilepic", check, upload.single("image"), async (req, res) => {
//     try {
//         if (!req.file) {
//             return res.status(400).json({ error: "No image file uploaded." });
//         }

//         const user = await User.findById(req.user.id);
//         if (!user) {
//             return res.status(404).json({ error: "User not found." });
//         }

//         user.profilePic = "/" + req.file.path.replace(/\\/g, "/"); 
//         await user.save();

//         res.status(200).json({
//             message: "Profile picture updated successfully.",
//             profilePic: user.profilePic
//         });
//     } catch (error) {
//         console.error("Error updating profile picture:", error);
//         res.status(500).json({ error: "Error updating profile picture: " + error.message });
//     }
// });

// // delete post
// app.delete("/post/delete/:id", check, async (req, res) => {
//     try {
//         const postId = req.params.id;
//         const post = await Post.findOneAndDelete({ _id: postId, user: req.user.id });
//         if (!post) {
//             return res.status(404).json({ message: "Post not found or you are not authorized to delete this post." });
//         }
//         res.status(200).json({ message: "Post deleted successfully." });
//     } catch (error) {
//         console.error("Error deleting post:", error);
//         res.status(500).json({ message: "Error deleting post: " + error.message });
//     }
// });

// app.post("/like/:id", check, async (req, res) => {
//     try {
//         const postId = req.params.id;
//         const userId = req.user.id;  

//         const post = await Post.findById(postId);
//         if (!post) {
//             return res.status(404).json({ message: "Post not found" });
//         }

//         const alreadyLiked = post.postliked.some(like => like.userId.toString() === userId);

//         if (alreadyLiked) {
//             post.postliked = post.postliked.filter(like => like.userId.toString() !== userId);
//             await post.save();

//             return res.status(200).json({
//                 message: "Like removed successfully",
//                 likeCount: post.postliked.length,
//                 liked: false 
//             });
//         } else {
//             post.postliked.push({ userId });
//             await post.save();

//             return res.status(200).json({
//                 message: "Like added successfully",
//                 likeCount: post.postliked.length,
//                 liked: true 
//             });
//         }
//     } catch (error) {
//         console.error("Error liking post:", error);
//         res.status(500).json({ message: "Error liking post: " + error.message });
//     }
// });




// app.listen(port, () => {
//     console.log(`Server is running on http://localhost:${port}`);
// });




// this is checking file start 



const express = require("express");
const mongoose = require("mongoose");
const nodemailer = require('nodemailer');
const multer= require('multer');
const path = require('path');
const cors = require("cors");
const jwt = require("jsonwebtoken");
const http = require('http');  // new added
// const { Server } = require('socket.io'); // ned added
const app = express();
const server = http.createServer(app); // new added
const port = 5000;
const mysecretkey = "Abc123";
const io = require("socket.io")(server, {
    cors: {
      origin: "http://localhost:3000", // Allow React app to connect
      methods: ["GET", "POST", "PATCH"],
    },
  });// new added
  app.set("socketio", io); 
app.use(cors());
app.use(express.json());

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);
  
    // socket.on("likePost", (postId) => {
    //   // Optional: You can add custom logic here if needed
    //   console.log(`Post liked: ${postId}`);
    // });
  
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
function check(req, res, next) {
    const token = req.headers.token;
    if (!token) {
        return res.status(401).send("There is no token");
    }
    try {
        const decodedata= jwt.verify(token, mysecretkey); 
        req.user = decodedata;
        next(); 
    } catch (error) {
        res.status(400).send("Invalid token");
    }
}
function generate4DigitOTP() {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < 4; i++) {
        otp += digits[Math.floor(Math.random() * 10)];
    }
    return otp;
}



async function connection() {
    try {
        await mongoose.connect("mongodb://localhost:27017/Socialapp", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Yes, MongoDB is connected");
    } catch (error) {
        console.log("It's not connecting", error);
    }
}
connection();

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    age: {
        type: Number,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 2
    },
    profilePic: {
        type: String,
        default: "/uploads/defaultprofilepic.jpg" 
    },
    otp: {
        type: String,
        required: false, 
    },
    otpVerified: {
        type: Boolean,
        default: false, 
    },
});
const User = mongoose.model("User", userSchema);

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    image: {
        type: String, 
        required: false,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true,
    },
    postliked: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',  
                required: true
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
const Post = mongoose.model("Post", postSchema);



const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: 'abdullah.bhatti32176@gmail.com',
        pass: 'ehwk ebej mpwh thle'   
    }
});
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); 
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    },
});
const upload = multer({ storage });



app.post("/signup", async (req, res) => {
    const userData = req.body;
    try {
   
        const otp = generate4DigitOTP();

  
        const userdata = new User({
            ...userData,
            otp: otp,
        });
        await userdata.save();


        const mailOptions = {
            from: 'infoaliraza22@gmail.com',
            to: userData.email,
            subject: 'OTP Verification',
            text: `Hello ${userData.name},\n\nYour OTP for account verification is: ${otp}\n\nPlease use this to verify your account.\n\nBest regards.`
        };


        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending OTP:", error);
                return res.status(500).json({ message: "Error sending OTP: " + error.message });
            }

            res.status(200).json({ message: "Signup successful! Please verify your OTP." });
        });

    } catch (error) {
        console.error("Error during signup:", error);
        res.status(400).json({ message: "Error during signup: " + error.message });
    }
});


app.post("/verifyotp", async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        if (user.otp === otp) {
            user.otpVerified = true; 
            user.otp = undefined;
            await user.save();

            res.status(200).json({ message: "OTP verified successfully. Account is now active." });
        } else {
            res.status(400).json({ message: "Invalid OTP. Please try again." });
        }

    } catch (error) {
        console.error("Error verifying OTP:", error);
        res.status(500).json({ message: "Error verifying OTP: " + error.message });
    }
});


app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json("User not found");
        }
   
        if (user.otpVerified === false && user.password !== password) {
            return res.status(401).json({message: "OTP not verified and wrong password"});
        } else if (user.otpVerified === false) {
            return res.status(401).json({message:"OTP not verified"});
        } else if (user.password !== password) {
            return res.status(401).json({message:"Wrong password"});
        }
        
        const token = jwt.sign({ email: user.email, id: user._id }, mysecretkey);
        return res.status(200).json({
            message: "User is logged in",
            token: token
        });
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(400).json("Error logging in user: " + error.message);
    }
});


app.post("/forgetpassword", async (req, res) => {
    const { email } = req.body;

    try {
        let user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const otp = generate4DigitOTP();

        user.otp = otp;
        await user.save();

        const mailOptions = {
            from: 'infoaliraza22@gmail.com',
            to: user.email,
            subject: 'OTP Verification',
            text: `Hello ${user.name},\n\nYour OTP for new password is: ${otp}\n\nPlease use this to verify your account.\n\nBest regards.`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending OTP:", error);
                return res.status(500).json({ message: "Error sending OTP", error: error.message });
            }
            res.status(200).json({ message: "OTP sent successfully. Please verify your OTP." });
        });
    } catch (error) {
        console.error("Error during password reset:", error);
        res.status(400).json({ message: "Error during password reset", error: error.message });
    }
});

app.post("/verifyotp/newpassword", async (req, res) => {
    const { email, otp, newpassword } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        if (user.otp === otp) {
            user.otp = undefined;
            user.password = newpassword;
            await user.save();

            res.status(200).json({ message: "OTP verified successfully. Password is changed." });
        } else {
            res.status(400).json({ message: "Invalid OTP. Please try again." });
        }

    } catch (error) {
        console.error("Error verifying OTP:", error);
        res.status(500).json({ message: "Error verifying OTP", error: error.message });
    }
});



// app.get("/protected",check ,(req, res) => {
//     const token = req.headers.token;

//     if (!token) {
//         return res.status(401).json({ message: "No token provided" });
//     }

//     jwt.verify(token, mysecretkey, (err, user) => {
//         if (err) {
//             return res.status(403).json({ message: "Invalid token" });
//         }

//         res.status(200).json({ message: "Access granted", user });
//     });
// });


// app.post("/profile",check, async (req, res) => {
//     const { id} = req.user.id;
//     try {
//         const user = await User.findOne({id});

//         if (!user) {
//             return res.status(404).json({ message: "User not found." });
//         }else{
//             res.status(200).json({ message: "Token is right " });
//         }
//     } catch (error) {
//         console.error("Wrong Token not right:", error);
//         res.status(500).json({ message: "Wrong Token not right:", error: error.message });
//     }
// });

app.post("/create-post", check, upload.single("image"), async (req, res) => {
    const { title, content } = req.body;
    try {
        // Validate input
        if (!title || !content) {
            return res.status(400).json("Title and content are required.");
        }
        // Create post
        const post = new Post({
            title,
            content,
            image: req.file ? req.file.path : null, 
            user: req.user.id, 
        });
        await post.save();
        res.status(201).json({
            message: "Post created successfully.",
            post,
        });
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json("Error creating post: " + error.message);
    }
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/timeline", check, async (req, res) => {
    try {

        const posts = await Post.find()
            .populate("user", "name profilePic"); 


        const userId = req.user?.id || req.userId;


        res.status(200).json({
          userId: userId,  
          posts: posts,    
        });
    } catch (error) {
        console.error("Error fetching timeline:", error);
        res.status(500).json("Error fetching timeline: " + error.message);
    }
});




app.get("/userdata", check, async (req, res) => {
    try {
        const loginuser = await await User.findById(req.user.id);
        res.status(200).json(loginuser);
    } catch (error) {
        console.error("Error fetching User Data:", error);
        res.status(500).json("Error fetching User Data: " + error.message);
    }
});

app.get("/profile",check, async (req, res) => {
    try {
        const posts = await Post.find({ user: req.user.id })
        .populate('user', 'name profilePic');
        const userId = req.user?.id || req.userId;


        res.status(200).json({
          userId: userId,  
          posts: posts,    
        });
    } catch (error) {
        console.error("Error fetching user posts:", error);
        res.status(500).json("Error fetching user posts: " + error.message);
    }
});

app.put("/post/edit/:id", check, multer({ dest: "uploads/" }).single("image"), async (req, res) => {
    try {
      const postId = req.params.id;
      const { title, content } = req.body;
      const post = await Post.findOne({ _id: postId, user: req.user.id });
      if (!post) {
        return res.status(404).json("Post not found or you are not authorized to edit this post.");
      }
  
      post.title = title || post.title;
      post.content = content || post.content;
      if (req.file) {
        post.image = req.file.path; 
      }
      await post.save();
      res.status(200).json({ message: "Post updated successfully.", post });
    } catch (error) {
      console.error("Error updating post:", error);
      res.status(500).json("Error updating post: " + error.message);
    }
  });
  

app.put("/update/profilepic", check, upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No image file uploaded." });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        user.profilePic = "/" + req.file.path.replace(/\\/g, "/"); 
        await user.save();

        res.status(200).json({
            message: "Profile picture updated successfully.",
            profilePic: user.profilePic
        });
    } catch (error) {
        console.error("Error updating profile picture:", error);
        res.status(500).json({ error: "Error updating profile picture: " + error.message });
    }
});

// delete post
app.delete("/post/delete/:id", check, async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findOneAndDelete({ _id: postId, user: req.user.id });
        if (!post) {
            return res.status(404).json({ message: "Post not found or you are not authorized to delete this post." });
        }
        res.status(200).json({ message: "Post deleted successfully." });
    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({ message: "Error deleting post: " + error.message });
    }
});

app.post("/like/:id", check, async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user.id;  

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const alreadyLiked = post.postliked.some(like => like.userId.toString() === userId);

        if (alreadyLiked) {
            post.postliked = post.postliked.filter(like => like.userId.toString() !== userId);
            await post.save();

   req.app.get("socketio").emit("postLiked", {
                postId: post._id,
                likeCount: post.postliked.length,
                liked: false
            });
            
            return res.status(200).json({
                message: "Like removed successfully",
                likeCount: post.postliked.length,
                liked: false 
            });
        } else {
            post.postliked.push({ userId });
            await post.save();
            req.app.get("socketio").emit("postLiked", {
                postId: post._id,
                likeCount: post.postliked.length,
                liked: true
            });

            return res.status(200).json({
                message: "Like added successfully",
                likeCount: post.postliked.length,
                liked: true 
            });
        }
    } catch (error) {
        console.error("Error liking post:", error);
        res.status(500).json({ message: "Error liking post: " + error.message });
    }
});




server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
