const express= require("express");
const bodyParser= require("body-parser");
const client = require("@mailchimp/mailchimp_marketing");
const app = express();
require('dotenv').config();
client.setConfig({apiKey:process.env.API_KEY, server:process.env.SERVER,});

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));


app.get("/",function(req, res){

  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
  const firstName= req.body.fname;
  const lastName= req.body.lname;
  const email= req.body.email;
  const subscribingUser = {
    firstName: firstName,
    lastName: lastName,
    email: email
  }
  const run = async () => {
    try {
      const response = await client.lists.addListMember("f4ea741fbc", {
        email_address: subscribingUser.email,
        status: "subscribed",
        merge_fields: {
          FNAME: subscribingUser.firstName,
          LNAME: subscribingUser.lastName
        }
      });
      console.log(response);
      res.sendFile(__dirname + "/success.html");
    } catch (err) {
      console.log("====== ERROR ======");
      console.log(JSON.parse(err.response.error.text).detail);
      res.sendFile(__dirname + "/failure.html");
    }
  };
    run();
});

app.post("/failure", function(req,res){

    res.redirect("/");
});

app.listen(process.env.PORT || 3000, function(){
console.log("Server is running on port 3000");

});
