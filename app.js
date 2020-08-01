const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const request = require("request");

const app = express();
//To send css,js, and images ....file to Server
app.use(express.static("public"));
//Using bodyparser to parse data from html to our server
app.use(bodyParser.urlencoded({extended: true}));
//Send file html to server
app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
});
//Post data when user click submit
app.post("/", function(req, res){
  //Take data from user
  const firstname = req.body.FirstName;
  const lastname = req.body.LastName;
  const email = req.body.Email;
  //Create Object that content data of FNAME LNAME EMAIL sending to API MailChimp
  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstname,
        LNAME: lastname
      }
    }]
  };
  //parsing data to flat format
  const jsonData = JSON.stringify(data);
  //Specify url of MailChimp API:
    //API KEY : 5515039320456539dd98ab38e361dfcc-us17
    //List KEY ID : 157ff2a98f
  const url = "https://us17.api.mailchimp.com/3.0/lists/157ff2a98f";
  const option = {
    method: "POST",
    auth: "Phanith:5515039320456539dd98ab38e361dfcc-us17"
  };
  //request server to send data to MailChimp API
  const request = https.request(url, option, function(response){
    if(response.statusCode === 200){
      res.sendFile(__dirname + "/success.html");
    }else{
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", function(data){
      console.log(JSON.parse(data));
    });
  });
  request.write(jsonData);
  request.end();
});
//Go back to Route
app.post("/failure", function(req, res){
  res.redirect("/");
});
//Set local host to port 3000 => set to process.env.PORT
app.listen(process.env.PORT || 3000, function(){
  console.log("Server is running on port 3000.");
});
//MailChimp API Key: 5515039320456539dd98ab38e361dfcc-us17
//List Key: 157ff2a98f


// //In this lesson we learn 2 way to send file css and image to the server
//       // Way 1
//    app.use(express.static("public"));
//       // Way 2
// // app.get("/styles.css", function(req, res){
// //   res.sendFile(__dirname + "/styles.css");
// // });
// // app.get("/images/MyLogo.png", function(req, res){
// //   res.sendFile(__dirname + "/images/MyLogo.png")
// // });
