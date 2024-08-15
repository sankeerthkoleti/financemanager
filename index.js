let username = document.getElementById("logemail");
let password = document.getElementById("logpass");
let signName = document.getElementById("signName");
let signNo = document.getElementById("signNo");
let signAddress = document.getElementById("signAddress");
let signPassword = document.getElementById("signPassword");
let loginBtn = document.getElementById("loginBtn");
let signupBtn = document.getElementById("signupBtn");
localStorage.removeItem("token");
loginBtn.onclick = () =>{
    let obj = {
        loginName:username.value,
        loginPassword:password.value
    }
    console.log(obj);
    let options = {
        method:"POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body:JSON.stringify(obj)
    }
    fetch("http://localhost:3000/login/", options)
    .then(function(response){
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            // Response is JSON
            return response.json();
          } else if (contentType && contentType.includes('text/html')) {
            // Response is HTML
            return response.text();
          }
    })
    .then(function(x){
        
        console.log(x);
        localStorage.setItem("token",x);
        console.log(localStorage.getItem("token"));
        window.location.href = "./page1.html";
    })
}

signupBtn.addEventListener("click",(event) =>{
    console.log(signName.value);
    console.log(signNo.value);
    console.log(signAddress.value);
    console.log(signPassword.value);

    let obj = {
        name:signName.value,
        number:signNo.value,
        address:signAddress.value,
        password:signPassword.value
    }
    console.log(obj);
    let options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body:JSON.stringify(obj)
    };


    fetch("http://localhost:3000/register/", options)
    .then(function(response){
        return response.text();
    })
    .then(function(x){
        console.log(x);
    })
})
