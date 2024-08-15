let express = require("express");
let {open} = require("sqlite");

let sqlite3 = require("sqlite3");
let path = require("path");
let app = express();
const jwt = require("jsonwebtoken");
let db_path = path.join(__dirname,"sqlite_database.db");
let db = null;
let connect = async ()=>{
    try{
      db = await open({
        filename:db_path,
        driver:sqlite3.Database
      })
      app.listen(3000,()=>{
        console.log("running at 3000 port");
      })
    }
    catch (e){
      console.log("database error",e);
      process.exit(1);
    }
}

const cors = require("cors");
app.use(cors({
    origin: 'http://127.0.0.1:5500'
}));
  

connect();
app.get("/",(request,response)=>{
  response.send("sankeerth");
})
app.use(express.json());
app.post("/register/",async(request,response)=>{
  let {name,number,address,password} = request.body;
  // console.log(name,number,address,password);
  let query = `insert into login (user_name,password,phone_no,address)values('${name}','${password}',${number},'${address}');`
  await db.run(query);
 // response.send("recieved");
})

app.post("/login/",async (request,response)=>{
  let {loginName,loginPassword} = request.body;
  let query = await db.get(`select * from login where user_name='${loginName}' and password='${loginPassword}';`);
  
  if(query===undefined){
    response.send("Invalid credentials");
  }
  else{
    const payload = {
      username: loginName,
      user_id:query.user_id
    };
    let t = jwt.sign(payload,'sankeerth');
    console.log(t);
    response.send(t);
  }
})
let verify = (request,response,next)=>{
    let token = request.headers["authorization"].split(" ")[1];
    console.log(token);
    jwt.verify(token,'sankeerth',async (error,payload)=>{
      if(error){
        console.log(error);
      }
      else{
        console.log(payload);
        request.username = payload.username;
        request.user_id = payload.user_id;
      }
      next();
    })
}

app.get("/showcustomer/",verify,async (request,response)=>{
    let {user_id} = request;
    let query = `select owner_id as o_id,customer_id as c_id,customer_name,customer_id,phone_no,address from customer_owner inner join login on login.user_id=customer_owner.customer_id where customer_owner.owner_id=${user_id};`
    let result = await db.all(query);
    response.send(result);
})

app.get("/showowner/",verify,async (request,response)=>{
  let {user_id} = request;
  let query = `select owner_id as o_id,customer_id as c_id,owner_name as customer_name,owner_id as customer_id,phone_no,address from customer_owner inner join login on login.user_id=customer_owner.owner_id where customer_owner.customer_id=${user_id};`
  let result = await db.all(query);
  response.send(result);
})

app.post("/showdetails/",async (request,response)=>{
  let {id} = request.body;
  console.log(id);
  let q = `select user_name,phone_no,address from login where user_id=${id};`
  let r = await db.get(q);
  response.send(r);
  
})
app.post("/showmoneydetails/",async (request,response)=>{
  let {owner,customer} = request.body;
  console.log(owner,customer);
  let query = `select money,given_date from money where owner_id=${owner} and customer_id = ${customer} ;`
  let result = await db.get(query);
  response.send(result);
})

app.post("/showdates/",async (request,response)=>{
    let {owner,customer,tablename} = request.body;
    let q = `select pay_date,status from ${tablename} where owner_id=${owner} and customer_id=${customer};`
    let r = await db.get(q);
    response.send(r);
})
let r = async(request,response,next)=>{
  let {pid,did} = request.body;
  let query = `select * from login where user_id=${did};`
  let r = await db.get(query);
  if(r === undefined){
    response.send("cannot find debtor with provided id");
  }
  else{
    
    query = `select * from login where user_id=${pid};`
    r = await db.get(query);
    if(r === undefined){
      response.send("cannot find Payer with provided id");
    }
    else{
      next();
    }
  }

}
app.post("/addcustomer/",r,async(request,response)=>{
    let {did,pid,dname,pname,amount,date,fdate,sdate,tdate} = request.body;
    dname = dname.toLowerCase();
    pname = pname.toLowerCase();
    let query = `insert into customer_owner(owner_name,owner_id,customer_name,customer_id)values('${dname}',${did},'${pname}',${pid});`
    await db.run(query);
    query = `insert into money(owner_id,customer_id,money,given_date)values(${did},${pid},${amount},${date});`
    await db.run(query);
    query = `insert into week1(owner_id,customer_id,pay_date,status)values(${did},${pid},${fdate},"unpaid");`
    await db.run(query);
    query = `insert into week2(owner_id,customer_id,pay_date,status)values(${did},${pid},${sdate},"unpaid");`
    await db.run(query);
    query = `insert into week3(owner_id,customer_id,pay_date,status)values(${did},${pid},${tdate},"unpaid");`
    await db.run(query);
    response.send("Added successfully");
})

app.post("/updatestatus/",async(request,response)=>{
  let {a,o_id,c_id,table} = request.body;
  console.log(a,o_id,c_id,table);
  let query = `update ${table} set status='${a}' where owner_id=${o_id} and customer_id=${c_id};`
  await db.run(query);
  response.send("added");
})

app.post("/filter/",async(request,response)=>{
  let {w1,w2,w3,o_id} = request.body;
  
  let f = w1;
  let s = w2;
  let t = w3;
  let query = null;
  console.log(f,s,t,o_id);
  if(f===true && s===false && t===false){
    query = `select login.user_name as name,login.phone_no as phone_no from week1 inner join login on week1.customer_id=login.user_id where status="unpaid" and owner_id=${o_id};`
    let r = await db.all(query);
    response.send(r);
  }
  else if(f===false && s===true && t===false){
    query = `select login.user_name as name,login.phone_no as phone_no from week2 inner join login on week2.customer_id=login.user_id where status="unpaid" and owner_id=${o_id};`
    let r = await db.all(query);
    response.send(r);
  }
  else if(f===false && s===false && t===true){
    query = `select login.user_name as name,login.phone_no as phone_no from week3 inner join login on week3.customer_id=login.user_id where status="unpaid" and owner_id=${o_id};`
    let r = await db.all(query);
    response.send(r);
  }
  else if(f===true && s===true && t===false){
    query = `select login.user_name as name,login.phone_no as phone_no from week1 inner join login on week1.customer_id=login.user_id where status="unpaid" and owner_id=${o_id} union select login.user_name as name,login.phone_no as phone_no from week2 inner join login on week2.customer_id=login.user_id where status="unpaid" and owner_id=${o_id};`
    let r = await db.all(query);
    response.send(r);
  }
  else if(f===true && s===false && t===true){
    query = `select login.user_name as name,login.phone_no as phone_no from week1 inner join login on week1.customer_id=login.user_id where status="unpaid" and owner_id=${o_id} union select login.user_name as name,login.phone_no as phone_no from week3 inner join login on week3.customer_id=login.user_id where status="unpaid" and owner_id=${o_id};`
    let r = await db.all(query);
    response.send(r);
  }
  else if(f===false && s===true && t===false){
    query = `select login.user_name as name,login.phone_no as phone_no from week2 inner join login on week2.customer_id=login.user_id where status="unpaid" and owner_id=${o_id} union select login.user_name as name,login.phone_no as phone_no from week3 inner join login on week3.customer_id=login.user_id where status="unpaid" and owner_id=${o_id};`
    let r = await db.all(query);
    response.send(r);
  }
  else{
    query = `select login.user_name as name,login.phone_no as phone_no from week2 inner join login on week2.customer_id=login.user_id where status="unpaid" and owner_id=${o_id} union select login.user_name as name,login.phone_no as phone_no from week3 inner join login on week3.customer_id=login.user_id where status="unpaid" and owner_id=${o_id} union select login.user_name as name,login.phone_no as phone_no from week1 inner join login on login.user_id=week1.customer_id where owner_id=${o_id} and status="unpaid";`
    let r = await db.all(query);
    response.send(r);
  }
  
})