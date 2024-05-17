//Imports from package.json and other files//
//const tasks = require("./Routes/Routers");
const express = require("express");
const path = require("path");
const Userdata = require("./models/usermess");
const artnummessdata = require("./models/artnummess");
const Articlemessdata = require("./models/Articlemess");
const app = express();
const connectDB = require("./Connect");
const bcrypt = require("bcrypt");
const passport = require("passport");
const initializePassport = require("./passport-config");
const flash = require("express-flash");
const session = require("express-session");
const { Storage } = require("@google-cloud/storage");
const Multer = require("multer");
const store = new session.MemoryStore();
const methodOverride = require("method-override");
const { log } = require("console");
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
    const test = await Userdata.findOne({ID: "1715176352408"});
   res.status(201).send(test)
  } catch(error){
   res.status(500).send(error);
}});

app.post("/api/delete/users",async (req,res)=>{
  const deleteusers = await Userdata.find();
res.status(201).send(deleteusers);
});
// Test API & DataBase//

//Loading standard middleware//
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
app.use(methodOverride("_method"));
//Loading standard middleware//

//Loading Login and Register middleware//
app.use(passport.initialize());
app.use(passport.session());

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
async function checkadminrights(req, res, next) {
  try {
    const sessionuser = req.session.passport.user;
    const user = await Userdata.findOne({ _id: sessionuser });
    if (user.Adminrights === true) {
      return next(); 
    } else {
      console.log("You have no admin rights");
      return res.redirect("/");
    }
  } catch (error) {
    console.log(error)
    return res.status(500).send(" Server Error");
  }
};

app.use((err, req, res, next) => {
  if (err.name === 'AuthenticationError') {
    return res.status(400).send(err.message);
  }
  next(err);
});
//Loading Login and Register middleware//

//Loading create-article middleware//
const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, 
  },
});
let projectId = "logical-river-421717"; 
let keyFilename = "mykey.json"; 
const storage = new Storage({
  projectId,
  keyFilename,
});
const bucket = storage.bucket("aftstorage");
//Loading create-article middleware//


//create-article code//
app.get("/upload", async(req,res)=>{
 try {
  const [files] = await bucket.getFiles();
  res.status(200).json(files);
 } catch (error) {
  res.status(400).send(error)
 } 
});
  //Uploading image to Google Cloud storage//
app.post("/upload", multer.single("imgfile"), (req, res) => {
  console.log("Made it /upload");
  try {
    if (req.file) {
      console.log("File found, trying to upload...");
      const blob = bucket.file(req.file.originalname);
      const blobStream = blob.createWriteStream();

      blobStream.on("finish", () => {
        res.status(200).send("Success with image");
        console.log("Success with image");
      });
      blobStream.end(req.file.buffer);
    } else throw "error with img";
  } catch (error) {
    res.status(500).send(error);
  }});
  //Uploading image to Google Cloud storage//

  //Sending he article id to webpage//
app.post("/articleid", async(req,res)=>{
  const artid = await artnummessdata.findOne({_id: "663a97347779a4f2faaa3b43"});
    let number = parseInt(artid.ID);
    number += 1;
    let string = number.toString();
    let zerosToAdd = 5 - string.length;  
    let zero = "0".repeat(Math.max(0, zerosToAdd)); 
    let ArticleID = "A" + zero + string;
  res.status(201).send(ArticleID);
});
  //Sending the article-id to webpage//

  //Sending article data to the database and updating article-id//
app.post("/ERPMNA", async (req,res)=>{
try {
  console.log(req.body)
  if(!req.body.ArtID || !req.body.Aname || !req.body.Aproducttype || !req.body.Acategory || !req.body.Acostprice || !req.body.Asaleprice || !req.body.Adiscount || !req.body.Astock || !req.body.Aproductdiscription){
    return res.status(400).send("Fill in all fields");
  }
  let art_id = req.body.ArtID;
  let newNumber = parseInt(art_id.substring(1));
  await artnummessdata.findByIdAndUpdate({_id: "663a97347779a4f2faaa3b43"}, {ID: newNumber},{new:true, runValidators: true,})
  const Addarticle = await Articlemessdata.create({
    ArtID: req.body.ArtID,
    Aname: req.body.Aname,
    Aproducttype: req.body.Aproducttype,
    Acategory: req.body.Acategory,
    Acostprice: req.body.Acostprice,
    Asaleprice: req.body.Asaleprice,
    Adiscount: req.body.Adiscount,
    Astock: req.body.Astock,
    Aimage: req.body.Aimage,
    Aproductdiscription: req.body.Aproductdiscription,
    Aactive: req.body.Aactive,
  });
    res.status(201).send("succes");
} catch (error) {
  console.error(error); 
  return res.status(500).send("Error adding-article");
}});
  //Sending article data to the database and updating article-id//
//create-article code//

// Update article//
app.post("/ERP_article/endpoint", async (req,res)=>{
  try {
    if(!req.body.ArtID || !req.body.Aname || !req.body.Aproducttype || !req.body.Acategory || !req.body.Acostprice || !req.body.Asaleprice || !req.body.Adiscount || !req.body.Astock || !req.body.Aproductdiscription){
      return res.status(400).send("Fill in all fields");
    }
    await Articlemessdata.findOneAndUpdate({ArtID: req.body.ArtID},{
      ArtID: req.body.ArtID,
      Aname: req.body.Aname,
      Aproducttype: req.body.Aproducttype,
      Acategory: req.body.Acategory,
      Acostprice: req.body.Acostprice,
      Asaleprice: req.body.Asaleprice,
      Adiscount: req.body.Adiscount,
      Astock: req.body.Astock,
      Aimage: req.body.Aimage,
      Aproductdiscription: req.body.Aproductdiscription,
      Aactive: req.body.Aactive,
    },{new:true, runValidators: true,});
      res.status(201).send("succes");
  } catch (error) {
    console.error(error); 
    return res.status(500).send("Error adding-article");
  }});
//Update article//

// Sending all articles to article maintenance//
app.post("/ERPAM", async(req,res)=>{
let allarticles = await Articlemessdata.find();
res.status(201).send(allarticles);
});
// Sending all articles to article maintenance//


// Article maintenance //
app.get("/API/ERP_article/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const article = await Articlemessdata.findOne({ ArtID: id });
    if(article){
      res.status(200).json(article);
    } else{
      return res.status(404).send("Article not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  };
});
// Article maintenance //

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

//Webshop code//
app.post("/Webshop", async(req,res)=>{
  let articledata = await Articlemessdata.find();
  res.status(200).send(articledata);
});
app.get("/API/webshop/article/:id/:id", async(req,res)=>{
try {
  const { id } = req.params;
  const articledata = await Articlemessdata.findOne({ _id: id });
  console.log(articledata);
  if(articledata){
    res.status(200).send(articledata);
  } else{
    return res.status(404).send("Article not found");
  }
} catch (error) {
  console.error(error);
  res.status(500).send("Server Error");
};
});
//Webshop code//

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
app.get("/Login", checkNotAuthenticated,async (req, res) => {
  res.sendFile(path.join(__dirname, "./public", "HTML/Login.html"));
});
app.get("/Register", checkNotAuthenticated, async (req, res) => {
  res.sendFile(path.join(__dirname, "./public", "HTML/Register.html"));
});
app.get("/Profile", checkAuthenticated,async (req, res) => {
  res.sendFile(path.join(__dirname, "./public", "HTML/Profile.html"));
});
app.get("/Webshop",async (req, res) => {
  res.sendFile(path.join(__dirname, "./public", "HTML/Webshop.html"));
});
app.get("/ERP", //checkAuthenticated, checkadminrights,//
 async(req, res) => {
  res.sendFile(path.join(__dirname, "./public", "HTML/ERP.html"));
});
app.get("/ERPMNA", //checkAuthenticated, checkadminrights,//
 async(req, res) => {
  res.sendFile(path.join(__dirname, "./public", "HTML/ERPMNA.html"));
});
app.get("/ERPAM", //checkAuthenticated, checkadminrights,//
 async(req, res) => {
  res.sendFile(path.join(__dirname, "./public", "HTML/ERPAM.html"));
});
app.get("/ERP_article/:id", //checkAuthenticated, checkadminrights,//
 async(req, res) => {
  res.sendFile(path.join(__dirname, "./public", "HTML/ERP_A.html"));
});
  app.get("/webshop/article/:id/:id", async(req,res)=>{
  res.sendFile(path.join(__dirname, "./public", "HTML/Webshop_article.html"));
})
app.all("*", (req, res) => {
  res.status(404).sendFile(path.join(__dirname, "./public", "HTML/404.html"));
});
//File paths//

//Turn on server and database//
const start = async () => {
  const PORT = process.env.PORT || 5000;
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => {
      console.log(`server is listening on port:${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};
start();
console.log("..............");
//Turn on server and database//