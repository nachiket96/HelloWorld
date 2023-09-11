const express = require('express');
const port = 25000;
const {getPassword,gettableslist,showdatabases,dbtoolAccess,dbaccess,encrypt,decrypt}=require('./commonfunctions.js')
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});



//Granting the access
app.post("/grantaccess",async (req,res)=>{
  console.log(req.body)
  const { username,department,access,dbaccess} = req.body;
  const encr = require("./EncryptDecrypt");
  const dec = new encr();
  var conn = dec.decrypt(" R7abomE7zOksmEmC7pDhyA== HWZLt0FX6h+tdO3ZVQJwxQ== /rDAAaovaH93JYyzTdWf6w== qt0l8E6ojhNu3YAoLs81aw== Gq4pfCxRjAnfI2+r8co/UQ== H8EtGkdoNV9e9WAtBv4dMA== A+K83uRSu0eH5ogq8jwHmA== sN6FBFjHjWVEC1GHdG4HyA== IvPeMN8WxAxFxGQNMMz1Uw== NTAEZHZhYGZXFVdNpYWoVA== 3hqDiPAvnhvqNBvIc1VY8w==");
  //console.log(`Hello ${conn.databases[0].host}`);
  const mysql2 = require("mysql");
  var dbConn = mysql2.createPool({
    host: conn.databases[0].host,
    user: conn.databases[0].username,
    password: conn.databases[0].password,
    database: "db_tools",
    waitForConnections: true,
  });

  


  dbConn.on("connection", function (connection) {
    console.log("DB Connection established");
    connection.on("error", function (err) {
      console.error(new Date(), "MySQL error", err.code);
    });

    connection.on("close", function (err) {
      console.error(new Date(), "MySQL close", err);
    });
  });


  var pass="";
  var isadmin="";

try{
  var data=await getPassword(username)
  pass=data.passw
  isadmin=data.isadminflag
}
catch(error){
res.send(error)
}

  if(pass!=null){
      dbConn.query("INSERT INTO Users (username,password,department,access,dbaccess,isadmin) VALUES (?,?,?,?,?,?)",[username, pass,department,access,dbaccess,isadmin],(error,results,fields)=>{
          if (error) {
              console.error('Error:', error);
             
            } else {
              console.log('Insert successful');
              console.log('Affected rows:', results);
            }
          if(results.affectedRows>0){
              const query=`UPDATE Notification set status='granted',access='${access}' where username='${username}'`
              console.log(query);
              dbConn.query(query,[],(error,results,fields)=>{
              console.log('Affected rows:',results)
              if(results.affectedRows>0){
                  res.send({message:"updated status"})
              }
             }) 
          }
      })
  }
})


//Registering the users 
app.post("/users", (req, res) => {
  const { username, password,department,access,dbtools,isadmin} = req.body;
  const encr = require("./EncryptDecrypt");
  const dec = new encr();
  var conn = dec.decrypt(" R7abomE7zOksmEmC7pDhyA== HWZLt0FX6h+tdO3ZVQJwxQ== /rDAAaovaH93JYyzTdWf6w== qt0l8E6ojhNu3YAoLs81aw== Gq4pfCxRjAnfI2+r8co/UQ== H8EtGkdoNV9e9WAtBv4dMA== A+K83uRSu0eH5ogq8jwHmA== sN6FBFjHjWVEC1GHdG4HyA== IvPeMN8WxAxFxGQNMMz1Uw== NTAEZHZhYGZXFVdNpYWoVA== 3hqDiPAvnhvqNBvIc1VY8w==");
  console.log(conn);
  const mysql2 = require("mysql");
  var dbConn = mysql2.createPool({
    host: conn.databases[0].host,
    user: conn.databases[0].username,
    password: conn.databases[0].password,
    database: "db_tools",
    waitForConnections: true,
  });
  dbConn.on("connection", function (connection) {
    console.log("DB Connection established");
    connection.on("error", function (err) {
      console.error(new Date(), "MySQL error", err.code);
    });

    connection.on("close", function (err) {
      console.error(new Date(), "MySQL close", err);
    });
  });

  dbConn.query(`SELECT * from Users where username="${username}"`,function(error,results,fields){
      let flag=true
      if(error){
        res.send(error)
      }
      if (results.length>0){
          console.log(results)
          return res.send({errortype:"",errorcode:"-1",errormessage:"user already registered",data:results})
      }
      else {
      dbConn.query("INSERT INTO Users (username,password,department,access,dbaccess,isadmin) VALUES (?,?,?,?,?,?)",
                      [username, password,department,access,dbtools,isadmin],
                      (error, results, fields) => {
                        if (error){
                          return res.send({errortype:"",errorcode:"-1",errormessage:"user registered",data:error})
                        }
                        else if(results.affectedRows>0){
                           return res.send({errortype:"",errorcode:"1",errormessage:"user registered"})
                        }
                        else{
                          return res.send({errortype:"",errorcode:"-1",errormessage:"data base connection error"})
                        }
                      }
                    );
      }
  })

});


//users requesting for access
app.post("/notifications", async (req, res) => {
  console.log(req.body);
  const encr = require("./EncryptDecrypt");
  const dec = new encr();
  var conn = dec.decrypt(
    " R7abomE7zOksmEmC7pDhyA== HWZLt0FX6h+tdO3ZVQJwxQ== /rDAAaovaH93JYyzTdWf6w== qt0l8E6ojhNu3YAoLs81aw== Gq4pfCxRjAnfI2+r8co/UQ== H8EtGkdoNV9e9WAtBv4dMA== A+K83uRSu0eH5ogq8jwHmA== sN6FBFjHjWVEC1GHdG4HyA== IvPeMN8WxAxFxGQNMMz1Uw== NTAEZHZhYGZXFVdNpYWoVA== 3hqDiPAvnhvqNBvIc1VY8w=="
  );
  console.log(conn);
  const mysql2 = require("mysql");
  var dbConn = mysql2.createPool({
    host: conn.databases[0].host,
    user: conn.databases[0].username,
    password: conn.databases[0].password,
    database: "db_tools",
    waitForConnections: true,
  });
  dbConn.on("connection", function (connection) {
    console.log("DB Connection established");
    connection.on("error", function (err) {
      console.error(new Date(), "MySQL error", err.code);
    });
    connection.on("close", function (err) {
      console.error(new Date(), "MySQL close", err);
    });
  });
  console.log(req.body);
  dbConn.query(
    `SELECT username,access,comment,department,dbtools FROM Notification where status= "wait"`,
    function (error, results, fields) {
      console.log(results)
      if (error) throw error;
      res.send(results)
    }
  );
});

//Fetching all notifications
app.post("/get_notifications", (req, res) => {
  console.log(req.body);
  const encr = require("./EncryptDecrypt");
  const dec = new encr();
  var conn = dec.decrypt(
    " R7abomE7zOksmEmC7pDhyA== HWZLt0FX6h+tdO3ZVQJwxQ== /rDAAaovaH93JYyzTdWf6w== qt0l8E6ojhNu3YAoLs81aw== Gq4pfCxRjAnfI2+r8co/UQ== H8EtGkdoNV9e9WAtBv4dMA== A+K83uRSu0eH5ogq8jwHmA== sN6FBFjHjWVEC1GHdG4HyA== IvPeMN8WxAxFxGQNMMz1Uw== NTAEZHZhYGZXFVdNpYWoVA== 3hqDiPAvnhvqNBvIc1VY8w=="
  );
  console.log(conn);
  const mysql2 = require("mysql");
  var dbConn = mysql2.createPool({
    host: conn.databases[0].host,
    user: conn.databases[0].username,
    password: conn.databases[0].password,
    database: "db_tools",
    waitForConnections: true,
  });
  dbConn.on("connection", function (connection) {
      console.log("DB Connection established");
      connection.on("error", function (err) {
        console.error(new Date(), "MySQL error", err.code);
      });
      connection.on("close", function (err) {
        console.error(new Date(), "MySQL close", err);
      });
    });
  console.log(req.body);
  dbConn.query("SELECT * FROM Notification", function (error, results) {
      if (error) {
          console.error(new Date(), "MySQL query error",error);
          res.send({errortype:"",errorcode:"",errormessage:"Error retrieving data"});
          dbConn.end();
          return;
      }
      dbConn.end();
      console.log(results);
      res.send(results);
    });
});



//List of databasses 
app.post("/listdatabases",async (req,res)=>{
   const databases=await showdatabases();
   res.send(databases)
})

//Fetching all the tables 
app.post("/tables",async (req,res)=>{
  const tableslist=await gettableslist()
  //console.log(tables)
  res.send(tableslist)
})

//dbtools available 
app.post("/dbtoolkit",async (req,res)=>{
  const encr = require("./EncryptDecrypt");
  const dec = new encr();
  var conn = dec.decrypt(" R7abomE7zOksmEmC7pDhyA== HWZLt0FX6h+tdO3ZVQJwxQ== /rDAAaovaH93JYyzTdWf6w== qt0l8E6ojhNu3YAoLs81aw== Gq4pfCxRjAnfI2+r8co/UQ== H8EtGkdoNV9e9WAtBv4dMA== A+K83uRSu0eH5ogq8jwHmA== sN6FBFjHjWVEC1GHdG4HyA== IvPeMN8WxAxFxGQNMMz1Uw== NTAEZHZhYGZXFVdNpYWoVA== 3hqDiPAvnhvqNBvIc1VY8w==");
  //console.log(`Hello ${conn.databases[0].host}`);
  const mysql2 = require("mysql");

  var dbConn = mysql2.createPool({
    host: conn.databases[0].host,
    user: conn.databases[0].username,
    password: conn.databases[0].password,
    database: "db_tools",
    waitForConnections: true,
  });


  dbConn.on("connection", function (connection) {
    console.log("DB Connection established");
    connection.on("error", function (err) {
      console.error(new Date(), "MySQL error", err.code);
    });

    connection.on("close", function (err) {
      console.error(new Date(), "MySQL close", err);
    });
  });

  dbConn.query("SELECT * from Dbtools",(error,results)=>{
    if(error){
      res.send(error)
      dbConn.end()
    }
    else{
        res.send(results)
        dbConn.end()
    }
   
   
  })

})


//which tool access the user has 
app.post("/dbaccess",async(req,res)=>{
  const{username,password}=req.body
  
  try{
  const data=await dbtoolAccess(username,password)
  data.data.user=username

  const accessObject = data.data.access;

// Get the "dbTools" array
const dbToolsArray = data.data.dbTools;

// Loop through the dbTools array
dbToolsArray.forEach((item) => {
  // Add a new "access" property to each item
  if(item.dbtools_name=="ParallelDB"){
    item.image=item.dbtools_name+".png"
  }
  if(item.dbtools_name=="SnapShot"){
    item.image=item.dbtools_name+".png"
  }
  if(item.dbtools_name=="datamapping"){
    item.image=item.dbtools_name+".png"
  }
  
  item.access = JSON.parse(JSON.stringify(accessObject));
});

// Remove the "access" property from its original location
delete data.data.access;
  res.send(data)
  }catch(error){
    res.send(error)
  }
})

//who has been granted access
app.post("/history",async (req,res)=>{
  const encr = require("./EncryptDecrypt");
  const dec = new encr();
  var conn = dec.decrypt(" R7abomE7zOksmEmC7pDhyA== HWZLt0FX6h+tdO3ZVQJwxQ== /rDAAaovaH93JYyzTdWf6w== qt0l8E6ojhNu3YAoLs81aw== Gq4pfCxRjAnfI2+r8co/UQ== H8EtGkdoNV9e9WAtBv4dMA== A+K83uRSu0eH5ogq8jwHmA== sN6FBFjHjWVEC1GHdG4HyA== IvPeMN8WxAxFxGQNMMz1Uw== NTAEZHZhYGZXFVdNpYWoVA== 3hqDiPAvnhvqNBvIc1VY8w==");
  //console.log(`Hello ${conn.databases[0].host}`);
  const mysql2 = require("mysql");

  var dbConn = mysql2.createPool({
    host: conn.databases[0].host,
    user: conn.databases[0].username,
    password: conn.databases[0].password,
    database: "db_tools",
    waitForConnections: true,
  });

  dbConn.on("connection", function (connection) {
    console.log("DB Connection established");
    connection.on("error", function (err) {
      console.error(new Date(), "MySQL error", err.code);
    });

    connection.on("close", function (err) {
      console.error(new Date(), "MySQL close", err);
    });
  });
  

  dbConn.query("SELECT * from Users",async (error,results)=>{
    if(error){
      res.send(	{errortype: "mysql error",errorcode: "-1",errormessage: "error connecting to database"})
      dbConn.end()
    }
    else{
      for (let index = 0; index < results.length; index++) {
        //const element = results[index];
        results[index].dbaccess=await dbaccess(results[index])
        
      }


        res.send({errortype: "data success",errorcode: "1",errormessage: "datafetched",data:results})
        dbConn.end()
    }
   
  })

})

//encrypting the string
app.post("/encrypt",async (req,res)=>{
  const encr = require("./EncryptDecrypt");
  const dec = new encr();
  var conn = dec.decrypt(" R7abomE7zOksmEmC7pDhyA== HWZLt0FX6h+tdO3ZVQJwxQ== /rDAAaovaH93JYyzTdWf6w== qt0l8E6ojhNu3YAoLs81aw== Gq4pfCxRjAnfI2+r8co/UQ== H8EtGkdoNV9e9WAtBv4dMA== A+K83uRSu0eH5ogq8jwHmA== sN6FBFjHjWVEC1GHdG4HyA== IvPeMN8WxAxFxGQNMMz1Uw== NTAEZHZhYGZXFVdNpYWoVA== 3hqDiPAvnhvqNBvIc1VY8w==");
  //console.log(`Hello ${conn.databases[0].host}`);
  const mysql2 = require("mysql");

  var dbConn = mysql2.createPool({
    host: conn.databases[0].host,
    user: conn.databases[0].username,
    password: conn.databases[0].password,
    database: "db_tools",
    waitForConnections: true,
  });

  dbConn.on("connection", function (connection) {
    console.log("DB Connection established");
    connection.on("error", function (err) {
      console.error(new Date(), "MySQL error", err.code);
    });

    connection.on("close", function (err) {
      console.error(new Date(), "MySQL close", err);
    });
  });

  var encyrptedstring=await encrypt(JSON.stringify(req.body.connstr))
  const query = 'INSERT INTO Connstring (alias, connstr,assign) VALUES (?, ?,?)';
  const values = [req.body.alias,encyrptedstring,req.body.assign]; // Replace with actual values
   dbConn.query(query, values, (err, result) => {
    if (err) {
      //console.error('Error inserting data:', err);
      res.send({errortype:"connectivity error",errorcode:"-1",errormessage:err})
    }else{
      res.send({errortype:"success",errorcode:"0",errormessage:"data inserted succesfully"})
    }
 
  });
})


app.post("/fetchusers",async (req,res)=>{
  const encr = require("./EncryptDecrypt");
  const dec = new encr();
  var conn = dec.decrypt(" R7abomE7zOksmEmC7pDhyA== HWZLt0FX6h+tdO3ZVQJwxQ== /rDAAaovaH93JYyzTdWf6w== qt0l8E6ojhNu3YAoLs81aw== Gq4pfCxRjAnfI2+r8co/UQ== H8EtGkdoNV9e9WAtBv4dMA== A+K83uRSu0eH5ogq8jwHmA== sN6FBFjHjWVEC1GHdG4HyA== IvPeMN8WxAxFxGQNMMz1Uw== NTAEZHZhYGZXFVdNpYWoVA== 3hqDiPAvnhvqNBvIc1VY8w==");
  //console.log(`Hello ${conn.databases[0].host}`);
  const mysql2 = require("mysql");

  var dbConn = mysql2.createPool({
    host: conn.databases[0].host,
    user: conn.databases[0].username,
    password: conn.databases[0].password,
    database: "db_tools",
    waitForConnections: true,
  });

  dbConn.on("connection", function (connection) {
    console.log("DB Connection established");
    connection.on("error", function (err) {
      console.error(new Date(), "MySQL error", err.code);
    });

    connection.on("close", function (err) {
      console.error(new Date(), "MySQL close", err);
    });
  });

  //var encyrptedstring=await encrypt(JSON.stringify(req.body.connstr))
  const query = 'SELECT username from Users';
 // const values = [req.body.alias,encyrptedstring,req.body.assign]; // Replace with actual values
   dbConn.query(query,(err, results) => {
    if (err) {
      //console.error('Error inserting data:', err);
      res.send({errortype:"connectivity error",errorcode:"-1",errormessage:err})
      dbConn.end()
    }else{
      res.send({errortype:"success",errorcode:"0",errormessage:"data fetched",data:results})
      dbConn.end()
    }
 
  });
})

//decrypting the string
app.post("/decrypt",(req,res)=>{
  const encr = require("./EncryptDecrypt");
  const dec = new encr();
  var conn = dec.decrypt(" R7abomE7zOksmEmC7pDhyA== HWZLt0FX6h+tdO3ZVQJwxQ== /rDAAaovaH93JYyzTdWf6w== qt0l8E6ojhNu3YAoLs81aw== Gq4pfCxRjAnfI2+r8co/UQ== H8EtGkdoNV9e9WAtBv4dMA== A+K83uRSu0eH5ogq8jwHmA== sN6FBFjHjWVEC1GHdG4HyA== IvPeMN8WxAxFxGQNMMz1Uw== NTAEZHZhYGZXFVdNpYWoVA== 3hqDiPAvnhvqNBvIc1VY8w==");
  //console.log(`Hello ${conn.databases[0].host}`);
  const mysql2 = require("mysql");

  var dbConn = mysql2.createPool({
    host: conn.databases[0].host,
    user: conn.databases[0].username,
    password: conn.databases[0].password,
    database: "db_tools",
    waitForConnections: true,
  });

  dbConn.on("connection", function (connection) {
    console.log("DB Connection established");
    connection.on("error", function (err) {
      console.error(new Date(), "MySQL error", err.code);
    });

    connection.on("close", function (err) {
      console.error(new Date(), "MySQL close", err);
    });
  });

  //var encyrptedstring=await encrypt(JSON.stringify(req.body.connstr))
  const query = `SELECT * from Connstring where alias='${req.body.alias}'`;
 // const values = [req.body.alias,encyrptedstring,req.body.assign]; // Replace with actual values
   dbConn.query(query,async (err, results) => {
    if (err) {
      //console.error('Error inserting data:', err);

      res.send({errortype:"connectivity error",errorcode:"-1",errormessage:err})
      dbConn.end()
    }else{
      console.log(results)
      console.log(typeof(results[0].connstr))
      var decryptedstring=await decrypt(results[0].connstr)
      var jsonbody=JSON.parse(decryptedstring)
      console.log(jsonbody)
      var customConnstr=[{server:jsonbody.server,uid:jsonbody.uid,pwd:jsonbody.pwd}]
      res.send({errortype:"success",errorcode:"0",errormessage:"data fetched",data:customConnstr,alias:results[0].alias})
      dbConn.end()
    }
 
  });
})

//getting all the connection string 
app.post("/fetchallconnectios",async (req,res)=>{
  const encr = require("./EncryptDecrypt");
  const dec = new encr();
  var conn = dec.decrypt(" R7abomE7zOksmEmC7pDhyA== HWZLt0FX6h+tdO3ZVQJwxQ== /rDAAaovaH93JYyzTdWf6w== qt0l8E6ojhNu3YAoLs81aw== Gq4pfCxRjAnfI2+r8co/UQ== H8EtGkdoNV9e9WAtBv4dMA== A+K83uRSu0eH5ogq8jwHmA== sN6FBFjHjWVEC1GHdG4HyA== IvPeMN8WxAxFxGQNMMz1Uw== NTAEZHZhYGZXFVdNpYWoVA== 3hqDiPAvnhvqNBvIc1VY8w==");
  //console.log(`Hello ${conn.databases[0].host}`);
  const mysql2 = require("mysql");

  var dbConn = mysql2.createPool({
    host: conn.databases[0].host,
    user: conn.databases[0].username,
    password: conn.databases[0].password,
    database: "db_tools",
    waitForConnections: true,
  });

  dbConn.on("connection", function (connection) {
    console.log("DB Connection established");
    connection.on("error", function (err) {
      console.error(new Date(), "MySQL error", err.code);
    });

    connection.on("close", function (err) {
      console.error(new Date(), "MySQL close", err);
    });
  });

  //var encyrptedstring=await encrypt(JSON.stringify(req.body.connstr))
  const query = `SELECT *  from Connstring where alias='${req.body.alias}'`;
 // const values = [req.body.alias,encyrptedstring,req.body.assign]; // Replace with actual values
   dbConn.query(query,(err, results) => {
    if (err) {
      //console.error('Error inserting data:', err);
      res.send({errortype:"connectivity error",errorcode:"-1",errormessage:err})
      dbConn.end()
    }
    
    else if(results.length>0) {
      res.send({errortype:"success",errorcode:"0",errormessage:"connection string already present"})
      dbConn.end()
    }
    else{
      console.log(results.length)
      res.send({errortype:"success",errorcode:"0",errormessage:"no connection string present",data:{}})
    }
 
  });
})