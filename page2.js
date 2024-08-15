let he = document.getElementById("he");
let h = document.getElementById("h");
let p = document.getElementById("p");
let a = document.getElementById("a");
let owner_id = localStorage.getItem("owner_id");
let customer_id = localStorage.getItem("customer_id");
let word = localStorage.getItem("status")
let m = document.getElementById("m");
let d = document.getElementById("d");




let save_button = document.getElementById("save_button");
let klo = null;
console.log(word);
let mark_status_con = document.getElementById("mark_status");
let r = ()=>{
    let f = null;
    if(word==="owner"){
        f = {
            "id":owner_id,
        }
    }
    else{
        f = {
            "id":customer_id,
        }
    }
    console.log(f);
    let obj = {
        method:'POST',
        headers: {
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify(f)
    }
    fetch("http://localhost:3000/showdetails/",obj)
    .then((response)=>{
        return response.json();
    })
    .then((data)=>{
        let {user_name,phone_no,address} = data;
        h.textContent = "NAME : "+ user_name;
        p.textContent = "PHONE NO : "+phone_no;
        a.textContent = "ADDRESS : "+address;
        console.log(data);
    })
}
r();
if(word==="owner"){
    he.textContent = "DEBTOR";
    klo = "Taken On : ";
    
}
else{
    he.textContent = "PAYER";
    klo = "Given On : ";
    mark_status_con.classList.add("d-flex");
}
let w = ()=>{
    let f = {
        owner:owner_id,
        customer:customer_id
    }
    console.log(f);
    let obj = {
        method:'POST',
        headers: {
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify(f)
    }
    fetch("http://localhost:3000/showmoneydetails/",obj)
    .then((response)=>{
        return response.json();
    })
    .then((data)=>{
        let {money,given_date} = data;
        m.textContent = "RS : "+money;
        d.textContent = klo+given_date;
        console.log(data);
    })
}
w();

let week1 = ()=>{
    let f = {
        owner:owner_id,
        customer:customer_id,
        tablename:"week1"
    }
    let obj = {
        method:'POST',
        headers: {
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify(f)
    }
    fetch("http://localhost:3000/showdates/",obj)
    .then((response)=>{
        return response.json();
    })
    .then((data)=>{
        let con1h = document.getElementById("con1h");
        let con1p = document.getElementById("con1p");
        con1h.textContent = data.pay_date;
        con1p.textContent = data.status;
        console.log(data);
        if(data.status == "paid"){
            fdate.checkbox = true;
            let logo1 = document.getElementById("logo1");
            logo1.classList.remove("d-none");
        }
        else{
            fdate.checkbox = false;
        }
    })
}
let week2 = ()=>{
    let f = {
        owner:owner_id,
        customer:customer_id,
        tablename:"week2"
    }
    let obj = {
        method:'POST',
        headers: {
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify(f)
    }
    fetch("http://localhost:3000/showdates/",obj)
    .then((response)=>{
        return response.json();
    })
    .then((data)=>{
        let con1h = document.getElementById("con2h");
        let con1p = document.getElementById("con2p");
        con1h.textContent = data.pay_date;
        con1p.textContent = data.status;
        console.log(data);
        if(data.status == "paid"){
            sdate.checkbox = true;
        }
        else{
            sdate.checkbox = false;
        }
    })

}
let week3 = ()=>{
    let f = {
        owner:owner_id,
        customer:customer_id,
        tablename:"week3"
    }
    let obj = {
        method:'POST',
        headers: {
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify(f)
    }
    fetch("http://localhost:3000/showdates/",obj)
    .then((response)=>{
        return response.json();
    })
    .then((data)=>{
        let con1h = document.getElementById("con3h");
        let con1p = document.getElementById("con3p");
        con1h.textContent = data.pay_date;
        con1p.textContent = data.status;
        console.log(data);
        if(data.pay_date == "paid"){
            tdate.checkbox = true;
        }
        else{
            tdate.checkbox = false;
        }
    })


}

save_button.onclick = ()=>{
    let fp = document.getElementById("firstdatepaid");
    let fu = document.getElementById("firstdateunpaid");
    let sp = document.getElementById("seconddatepaid");
    let su = document.getElementById("seconddateunpaid");
    let tp = document.getElementById("thirddatepaid");
    let tu = document.getElementById("thirddateunpaid");
    
    if(fp.checked===true || fu.checked===true){
        if(fp.checked===true){
            let dic = {o_id:owner_id,c_id:customer_id,a:"paid",table:"week1"};
            let obj = {
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(dic)
            }
            fetch("http://localhost:3000/updatestatus/",obj)
            .then(response=>{
                console.log(response);
            })
        }
        else{
            let dic = {o_id:owner_id,c_id:customer_id,a:"unpaid",table:"week1"};
            let obj = {
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(dic)
            }
            fetch("http://localhost:3000/updatestatus/",obj)
            .then(response=>{
                console.log(response);
            })

        }
    }

    if(sp.checked===true || su.checked===true){
        if(sp.checked===true){
            let dic = {o_id:owner_id,c_id:customer_id,a:"paid",table:"week2"};
            let obj = {
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(dic)
            }
            fetch("http://localhost:3000/updatestatus/",obj)
            .then(response=>{
                console.log(response);
            })
        }
        else{
            let dic = {o_id:owner_id,c_id:customer_id,a:"unpaid",table:"week2"};
            let obj = {
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(dic)
            }
            fetch("http://localhost:3000/updatestatus/",obj)
            .then(response=>{
                console.log(response);
            })

        }
    }
    
    if(tp.checked===true || tu.checked===true){
        if(tp.checked===true){
            let dic = {o_id:owner_id,c_id:customer_id,a:"paid",table:"week3"};
            let obj = {
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(dic)
            }
            fetch("http://localhost:3000/updatestatus/",obj)
            .then(response=>{
                console.log(response);
            })
        }
        else{
            let dic = {o_id:owner_id,c_id:customer_id,a:"unpaid",table:"week3"};
            let obj = {
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(dic)
            }
            fetch("http://localhost:3000/updatestatus/",obj)
            .then(response=>{
                console.log(response);
            })

        }
    }    
}
week1();
week2();
week3();