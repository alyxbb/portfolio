const http = require('http');
const url = require("url");
const fs = require('fs');
const nodemailer = require('nodemailer');

 rawdata=fs.readFileSync("./backend/keys.json",)
keys=JSON.parse(rawdata);



const hostname = '127.0.0.1';
const port = 3000;
var transporter= nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: keys.emailsender,
        pass: keys.emailpassword
    }
})


function sendmail(data,callback){

    if (data.title===undefined || data.email===undefined || data.message===undefined||data.name===undefined){
        callback( 400,false,"Error! missing parameters","failed to send message. missing parameters. did you fail to fill in the form fully?");
    }else{
        let options = {
            from: keys.emailsender,
            to: keys.emailreciever,
            subject: data.title,
            text: "message from: " + data.name + "\nmessage: " + data.message,
            replyTo: data.email
        };
        transporter.sendMail(options, function(error, info){
        if (error) {
            console.log(error);
            return callback(500,false,"Server Error!","failed to send message. this is probably my fault. contact me on "+data.emailreciever+" if this persists.");
        } else {
            console.log('Email sent: ' + info.response);
            return callback(200,true,"Success!","message sent! you will recieve a reply within a few days");
        }
    });}
}


const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', ' application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    if(req.method==="POST"){



    const q = url.parse(req.url, true);
    switch (q.pathname){
        case "/sendmessage":
            body="";
            req.on("data",chunk => {
                body+=chunk.toString();
            });
            req.on("end",()=> {
                body = JSON.parse(body);
                sendmail(body,function(statuscode,wasSuccessful,title,message){
                    res.statuscode=statuscode;
                    res.end(JSON.stringify({"title":title,"message":message,"wasSuccessful":wasSuccessful}));
                });
            });

            break;

        default:
                res.statusCode= 404;
                res.end("404 not found");


    }}
    else{
        res.statusCode= 200;
        res.end();
    }

});




server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});