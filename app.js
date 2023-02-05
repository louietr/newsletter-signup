const express = require("express")
const bodyParser = require("body-parser")
const request = require("request")
const https = require("https")

const app = express()
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended:true}))

app.get("/", function(req, res) {
    res.sendFile(__dirname+"/signup.html");
})

app.post("/", function(req, res) {
    
        var firstName = req.body.fName;
        var lastName = req.body.lName;
        var email = req.body.email;
    
    console.log(firstName);
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };
    var jsonData = JSON.stringify(data)
    const url ="https://us13.api.mailchimp.com/3.0/lists/4a55f0d009"
    const options = {
        method: "POST",
        auth: "louie:08376ecab638c3915ef04ccbe2911bcf-us13"
    }
    const request = https.request(url, options, function(response) {
        console.log(response.statusCode)
        if (response.statusCode !== 200) {
            res.sendFile(__dirname+"/success.html");
        }
        else {
            res.sendFile(__dirname+"/failure.html");
        }
        response.on("data", function(data) {
            console.log(JSON.parse(data))
        })
    })
    request.write(jsonData);
    request.end();
});
app.post("/failure", function(req, res) {
    res.redirect("/")
})

app.listen(process.env.PORT || 3000, function() {
    console.log("Server is running on port 3000")
})



//API_KEY=08376ecab638c3915ef04ccbe2911bcf-us13
//List_id = 4a55f0d009