const http = require('http');
const fs = require("fs");
const url = require("url");
const nodemailer = require('nodemailer');
const hostname = '127.0.0.1';
const port = 3000;
var transporter= nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'EMAIL',
        pass: 'EMAILPASSWORD'
    }
})


function sendmail(q,callback){
    data=q.query
    if (data.title===undefined || data.email===undefined || data.message===undefined||data.name===undefined){
        callback( "failed to send message. missing parameters. did you fail to fill in the form fully?");
    }else{
    var options = {
        from: 'AUTOEMAIL',
        to: 'EMAIL',
        subject: data.title,
        text: "message from: "+data.name+"\nmessage: "+data.message,
        replyTo: data.email
    };
    transporter.sendMail(options, function(error, info){
        if (error) {
            console.log(error);
            return callback("failed to send message. this is my fault not yours contact me on EMAIL for help");
        } else {
            console.log('Email sent: ' + info.response);
            return callback("message sent! you will recieve a reply within a few days");
        }
    });}
}


const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'text/html');
    const q = url.parse(req.url, true);
    let filename ="."+ q.pathname+".html";
    switch (q.pathname){
        case "/sendmessage":
            sendmail(q,function(message){
                readfilebutreplace(filename,res,"<!--message-->",message);
            });
            break;

        case "/":
        case "/index.html":
            readfile("index.html",res);
            break;
        case "/about":
            readfile("about.html",res);
            break;
        case"/contact":
            readfile("contact.html",res);
            break;
        case"/projects":
            readfile("projects.html",res);
            break;
        default:
            if(q.pathname.startsWith("/assets/")){
                readfile("."+q.pathname,res);
            } else{

                show404(res);
            }


    }

});



function readfile(filename,res){
    fs.readFile(filename, (err, data) => {
        if (err) {
            show404(res);
        } else {
            res.statusCode = 200;
            res.end(data);
        }
    });
}
function show404(res){
    fs.readFile("404.html", (err, data) => {
        if (err) {
            console.log(err);
            res.statusCode = 404;
            res.end('404 PageNotFound');
        } else {
            res.statusCode = 404;
            res.end(data);
        }
    });
}

function readfilebutreplace(filename,res,original,newtxt){
    fs.readFile(filename, (err, data) => {
        if (err) {
            show404(res);
        } else {
            res.statusCode = 200;

            res.end(data.toString().replace(original,newtxt));
        }
    });
}

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});