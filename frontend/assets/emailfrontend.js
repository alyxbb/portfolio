function sendmail(e) {
    console.log(e.formData);
    console.log("sending mail");
    name=document.getElementById("name").value
    email=document.getElementById("email").value
    title=document.getElementById("subject").value
    message=document.getElementById("message").value
    data = {"name":name,"email":email,"title":title,"message":message};
    fetch("http://127.0.0.1:3000/sendmessage", {
        method: "POST",

        headers: {
            "Content-Type": "application/json",
            "accept": "application/json"
        },
        body: JSON.stringify(data),

    }).then(response =>response.json())
        .then(data => {
            document.getElementById("message-title").innerHTML=data.title;
            document.getElementById("message-content").innerHTML=data.message;
            if(data.wasSuccessful){
                document.getElementById("alertbox").classList.add("alert-success");
                document.getElementById("alertbox").classList.remove("alert-danger");
            } else{
                document.getElementById("alertbox").classList.add("alert-danger");
                document.getElementById("alertbox").classList.remove("alert-success");
            }
            document.getElementById("alertbox").style.display="block";

        }).catch(error => console.log(error))



    return false;
}