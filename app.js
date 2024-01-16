const express = require("express");
const path = require("path");

const app = express();
const port = 5000;

// define routes
app.get("/", function (request, response) {
    response.send("<h3> Welcome to home Page</h3>")
});

app.get("/about", function (request, response) {
    response.sendFile("about.html", {
        root: path.join(__dirname, "./views")
    });
});

app.get("/contact", function (request, response) {
    response.sendFile("contact.html", {
        root: path.join(__dirname, "./views")
    });
});

//  post request type
app.post("/catalogos", function (request, response) {
    response.json({
        status: 1,
        message: "este es un simple post request"
    });
});

// delete request type
app.delete("/catalogos", function (request, response) {
    response.json({
        status: 1,
        message: "este es un simple delete request."
    });
});

app.listen(port, function () {
    console.log("server runing at 5000 port.");
})