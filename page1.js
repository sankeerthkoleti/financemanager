let heading_status = document.getElementById("head");
let debtors_button = document.getElementById("debtors");
let payer_button = document.getElementById("payers");
let token = localStorage.getItem("token");
let back = document.getElementById("back");
let add = document.getElementById("add");
let form = document.getElementById("form");
let ul = document.getElementById("ul");
let fpayer = document.getElementById("fpayer");
let spayer = document.getElementById("spayer");
let tpayer = document.getElementById("tpayer");

debtors_button.onclick = ()=>{
    heading_status.textContent = "Debtors";
    add.textContent = "Add Debtors"
    x("owner");
}
payer_button.onclick = ()=>{
    heading_status.textContent = "Payers";
    x("customer");
    add.textContent = "Add Payer";
}
console.log(token);
let card = (element,word)=>{
    let div = document.createElement("button");
    div.classList.add("card");
    let div2 = document.createElement("div");
    div2.classList.add("align");
    let span1 = document.createElement("span");
    span1.classList.add("red");
    let span2 = document.createElement("span");
    span2.classList.add("yellow");
    let heading = document.createElement("h1");
    heading.textContent = element.customer_name;
    let phone = document.createElement("p");
    phone.textContent = "phone no: "+element.phone_no;
    let address = document.createElement("p");
    address.textContent = element.address;
    let span3 = document.createElement("span");
    span3.classList.add("green");
    div2.appendChild(span1);
    div2.appendChild(span2);
    div2.appendChild(span3);
    div.appendChild(div2);
    div.appendChild(heading);
    div.appendChild(phone);
    div.appendChild(address);
    back.appendChild(div);
    div.onclick = ()=>{
        localStorage.setItem("owner_id",element.o_id);
        localStorage.setItem("customer_id",element.c_id)
        localStorage.setItem("status",word);
        window.location.href = "./page2.html"; 
    }
}
let x = (word)=>{
    if(heading_status.textContent === "Payers"){
        let obj = {
            method: 'GET', // or 'POST', 'PUT', 'DELETE', etc.
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }
        fetch("http://localhost:3000/showcustomer/",obj)
        .then((response)=>{
            return response.json();
        })
        .then((data)=>{
            console.log(data);
            back.textContent = null;
            data.forEach(element => {
                card(element,word);
            });
        })
    }
    else{
        let obj = {
            method: 'GET', // or 'POST', 'PUT', 'DELETE', etc.
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }
        fetch("http://localhost:3000/showowner/",obj)
        .then((response)=>{
            return response.json();
        })
        .then((data)=>{
            console.log(data);
            back.textContent = null;
            data.forEach(element => {
                card(element,word);
            });
        })
    
    }
}
x();
form.addEventListener("submit",(event)=>{
    event.preventDefault();
    let data = new FormData(form);
    data = Object.fromEntries(data.entries());
    console.log(data);
    let obj = {
        method:"POST",
        headers:{
         "Content-Type":"application/json"
        },
        body:JSON.stringify(data)
    }
    fetch("http://localhost:3000/addcustomer/",obj)
    .then(response=>{
        console.log(response);
    })
})
let f = false;
let s = false;
let t = false;
fpayer.addEventListener("change",()=>{
    if(fpayer.checked===true){
        f = true;
    }
    call_filter();
});

spayer.addEventListener("change",()=>{
    if(spayer.checked===true){
        s = true;
    }
    call_filter();
});

tpayer.addEventListener("change",()=>{
    if(tpayer.checked===true){
        t = true;
    }
    call_filter();
});
let call_filter = ()=>{
    
    let owner_id = localStorage.getItem("owner_id");
    let dic = {o_id:owner_id,w1:f,w2:s,w3:t};
    let obj = {
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(dic)
    }
    fetch("http://localhost:3000/filter/",obj)
    .then(response=>{
        return response.json();
    })
    .then(data=>{
        console.log(data);
        ul.textContent = null;
        data.forEach(element => {
            create_card(element);
        });
    })
}

let create_card = (x) =>{
    let li = document.createElement("li");
    let div = document.createElement("div");
    li.classList.add("listitem")
    div.classList.add("d-flex","flex-column");
    li.appendChild(div);
    let p1 = document.createElement("p");
    p1.textContent = x.name;
    
    let p2 = document.createElement("p");
    p2.textContent = x.phone_no;
    div.appendChild(p1);
    div.appendChild(p2);
    ul.appendChild(li); 

}