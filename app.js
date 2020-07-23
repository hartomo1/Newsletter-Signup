const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
});

// collect data from body and turn it into array. and then into JSON

app.post("/", function(req, res){
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

// const data array fields follow the convention used on mailchimp
  const data = {
    members:[
      {
        email_address : email,
        status : "subscribed",
        merge_fields:{
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  }

  const jsonData = JSON.stringify(data);

  // https request
  const options = {
    method: "POST",
    auth: "gerejaku:a9f31e012e9a5adeb6f1443bbe98234a-us17"
  }

// us17 refers to the mailchimp server. there server 1-20
  const url = "https://us17.api.mailchimp.com/3.0/lists/efaf798802";

  const request = https.request(url, options, function(response){

    if (response.statusCode === 200){
      res.sendFile(__dirname+"/success.html");
    } else{
      res.sendFile(__dirname+"/failure.html");
    }


    response.on("data", function(data){
      console.log(JSON.parse(data));
    })
  })

  request.write(jsonData);
  request.end();

});


app.post("/failure", function(req, res){
  res.redirect("/");
})

app.listen(process.env.PORT || 3000, function(){
  console.log("Server started on port 3000")
});

// API Key
// a9f31e012e9a5adeb6f1443bbe98234a-us17

// List ID
// efaf798802
