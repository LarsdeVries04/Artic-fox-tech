//Imports from package.json and other files//
//const tasks = require("./Routes/Routers");
const express = require("express");
const path = require("path");
const Userdata = require("./models/message");
const app = express();
const connectDB = require("./Connect");
const bcrypt = require("bcrypt");
const passport = require("passport");
const initializePassport = require("./passport-config");
const flash = require("express-flash");
const session = require("express-session");
const store = new session.MemoryStore();
const methodOverride = require("method-override")
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
initializePassport(
  passport,
  (email) => Userdata.findOne({ Email: email }),
  (id) =>  Userdata.findOne({ ID: id })
);
//Imports from package.json and other files//


//Test API & DataBase//
app.post("/api/test", (req, res) => {
  res.send("Test succesful");
});

app.post("/api/test/database", async (req,res)=>{
  try{
    const test = await Userdata.findOne({Fname: "Lars"});
   res.status(201).send(test)
  }
catch(error){
   res.status(500).send(error);
}
});
// Test API & DataBase//

//Loading middleware//
app.use(express.json());
app.use(express.static(path.join(__dirname, "./public")));
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));
function checkAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next()
  }
  res.redirect("/Login")
}
function checkNotAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return res.redirect("/Profile")
  } 
  next()
}
app.use((err, req, res, next) => {
  if (err.name === 'AuthenticationError') {
    return res.status(400).send(err.message);
  }
  next(err);
});
//Loading middleware//

//Login and Register code//
app.post(
  "/Login",checkNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/Profile",
    failureRedirect: "/Login",
    failureFlash: true,
  }));

app.post("/Register", checkNotAuthenticated, async (req, res) => {
  try {
    if (req.body.password.length < 4 && req.body.password.length > 1) {
      return res.status(400).send("Password must be at least 8 characters long");

    } else if (req.body.password !== req.body.ConfirmPass) {
      return res.status(400).send("Confirm password does not match");
    }
    else if(!req.body.Fname || !req.body.Fname || !req.body.email || !req.body.password){
      return res.status(400).send("Fill in all fields");
    }
    
    const hashedpassword = await bcrypt.hash(req.body.password, 10);
    const task = await Userdata.create({
      ID: Date.now().toString(),
      Fname: req.body.Fname,
      Lname: req.body.Lname,
      Email: req.body.email,
      Password: hashedpassword,
    });
    res.status(201).redirect("/Login");
  } catch (error) {
    console.error(error); 
    if (error.code === 11000 && error.keyPattern.Email) {
      return res.status(400).send("Email address already in use");
    } else {
      console.error(error);
      return res.status(500).send("Error registering user");
    }
}});
app.delete('/Logout', (req, res, next) => {
  req.logOut((error) => {
    if (error) {
      return next(error);
    }
    res.redirect('/');
  });
});
//Login and Register code//

//Profile code//
app.post("/Profile", async(req,res)=>{
  if(req.isAuthenticated()){
    const sessionuser = await req.session.passport.user;
    const user = await Userdata.findOne({ _id: sessionuser})
      res.send(user);
  } else{
  res.status(404).send("no user found")
}});

app.post("/Profile_info", async(req,res,next)=>{
  if(req.isAuthenticated()){
    const sessionuser = await req.session.passport.user;
      try{
      const updateuser = await Userdata.findByIdAndUpdate({_id: sessionuser},
      {
      Fname: req.body.Fname,
      Lname: req.body.Lname,
      Email: req.body.email,
      Postcode: req.body.postcode,
      Address: req.body.address
      },
      {new:true, runValidators: true,}) 
      res.status(201).redirect("/Profile");
      } catch(error){
        console.log(error);
        if(!req.body.Fname || !req.body.Fname || !req.body.email){
          return res.status(500).redirect("/Profile");
        } else if (error.code === 11000 && error.keyPattern.Email) {
          return res.status(500).redirect("/Profile");
        } else {
          return res.status(500).redirect("/Profile");
        }
      }
}});
//Profile code//

//File paths//
app.get("/", async (req, res) => {
  res.sendFile(path.join(__dirname, "./public", "HTML/index.html"));
});
app.get("/Aboutus", async (req, res) => {
  res.sendFile(path.join(__dirname, "./public", "HTML/Aboutus.html"));
});
app.get("/Contactus", async (req, res) => {
  res.sendFile(path.join(__dirname, "./public", "HTML/Contactus.html"));
});
app.get("/Login", checkNotAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "./public", "HTML/Login.html"));
});
app.get("/Register", checkNotAuthenticated, async (req, res) => {
  res.sendFile(path.join(__dirname, "./public", "HTML/Register.html"));
});
app.get("/Profile", checkAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "./public", "HTML/Profile.html"));
});
app.get("/Webshop", (req, res) => {
  res.sendFile(path.join(__dirname, "./public", "HTML/Webshop.html"));
});
app.all("*", (req, res) => {
  res.status(404).sendFile(path.join(__dirname, "./public", "HTML/404.html"));
});
//File paths//

//Turn on server and database//
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(process.env.PORT || 5000, () => {
      console.log("server is listening on localhost:5000");
    });
  } catch (error) {
    console.log(error);
  }
};
start();
console.log("..............");

//Turn on server and database//