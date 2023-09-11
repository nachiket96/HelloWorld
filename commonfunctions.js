const { error } = require('console');
const crypto = require('crypto');

function getPassword(username) {
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
    return new Promise((resolve, reject) => {
      dbConn.query(`SELECT * FROM Notification WHERE username = "${username}"`, function (error, results, fields) {
        if (error) {
          reject({errortype:"",errorcode:"-2",errormessage:"db error"});
        } else {
          if (results.length > 0) {
            const password = results[0].password;
            const admin = results[0].isadmin
            // const dbtools = results[0].dbtools;
            dbConn.end()
            resolve({passw:password,isadminflag:admin});
          } else {
            reject({errortype:"",errorcode:"-1",errormessage:"username not present "});
            dbConn.end()
          }
        }
      });
    });
  }


// Fetching user access and sending appropriate db tools
function dbtoolAccess(username,password) {
  const encr = require("./EncryptDecrypt");
  const dec = new encr();
  var conn = dec.decrypt(
    " R7abomE7zOksmEmC7pDhyA== HWZLt0FX6h+tdO3ZVQJwxQ== /rDAAaovaH93JYyzTdWf6w== qt0l8E6ojhNu3YAoLs81aw== Gq4pfCxRjAnfI2+r8co/UQ== H8EtGkdoNV9e9WAtBv4dMA== A+K83uRSu0eH5ogq8jwHmA== sN6FBFjHjWVEC1GHdG4HyA== IvPeMN8WxAxFxGQNMMz1Uw== NTAEZHZhYGZXFVdNpYWoVA== 3hqDiPAvnhvqNBvIc1VY8w=="
  );
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
  var query = "SELECT isadmin, access, dbaccess FROM Users WHERE username = ? and password = ? ";
  var access = {view:false, edit:false, admin: false};

  return new Promise((resolve, reject) => {
    dbConn.query(query,[username,password], function (error, results) {
      if (error) {
        //console.error(new Date(), "MySQL query error",error);
        reject({errortype:"",errorcode:"",errormessage:"Error retrieving data"});
        dbConn.end();
        return;
      } else if(results.length > 0) {
        try {
          const output = results[0];
         // const isadmin = (output.isadmin == 1) ? true : false;
         const isadmin=output.isadmin;
          access[output.access] = true;
          const array = JSON.parse(output.dbaccess);
          const placeholder = array.map(() => "?").join(", ");
          query = `SELECT dbtools_name FROM Dbtools WHERE id IN (${placeholder});`;
          dbConn.query(query, array, async function (error, results) {
            if (error) {
              //console.error(new Date(), "MySQL query error",error);
              reject({errortype:"",errorcode:"",errormessage:"Error retrieving data"});
              dbConn.end();
              return;
            }
            dbTools_response = JSON.stringify(results);
            const combinedData = {
              isadmin : isadmin,
              access: access,
              dbTools: JSON.parse(dbTools_response)   
            };
            console.log(combinedData);
            var data=await getdatabaseconnstrforUsers(username)
            resolve({errortype:"",errorcode:"1",errormessage:"access is there ",data:combinedData,constr:data});
            //dbConn.end()
          });
        } catch (error) {
          //console.error(new Date(), "Data not in correct format",error);
          reject({errortype:"",errorcode:"-2",errormessage:"no db access for the user "});
          dbConn.end();
          return;
        }  
      } else {
        console.log(new Date(), "Incorrect username ");
        reject({errortype:"",errorcode:"-1",errormessage:"Incorrect user "});
        dbConn.end()
        return;
      }
    }); 
  })

}
  
  function gettableslist(database,connectionstr){
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


    return new Promise((resolve, reject) => {
      dbConn.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'db_tools'",(error,results)=>{
        if(error)
        {
          reject(new Error("tables not found"));
          dbConn.end()
          
        }
        else{
          resolve({tablelist:results})
          dbConn.end()
        }
      })
    })



  }


  function showdatabases(){
    const encr = require("./EncryptDecrypt");
    const dec = new encr();
    var conn = dec.decrypt(" R7abomE7zOksmEmC7pDhyA== HWZLt0FX6h+tdO3ZVQJwxQ== /rDAAaovaH93JYyzTdWf6w== qt0l8E6ojhNu3YAoLs81aw== Gq4pfCxRjAnfI2+r8co/UQ== H8EtGkdoNV9e9WAtBv4dMA== A+K83uRSu0eH5ogq8jwHmA== sN6FBFjHjWVEC1GHdG4HyA== IvPeMN8WxAxFxGQNMMz1Uw== NTAEZHZhYGZXFVdNpYWoVA== 3hqDiPAvnhvqNBvIc1VY8w==");
    //console.log(`Hello ${conn.databases[0].host}`);
    const mysql2 = require("mysql");
    var dbConn = mysql2.createPool({
      host: conn.databases[0].host,
      user: conn.databases[0].username,
      password: conn.databases[0].password,
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



    return new Promise((resolve, reject) => {
      dbConn.query("SHOW DATABASES",(error,results)=>{
        if(error){
         reject(error)
         dbConn.end()
        }
        else{
          resolve(results)
          dbConn.end()
        }
      })
    })



  }


  // async function hello(){
  //   try{
  //   const data=await dbtoolAccess("swati")
  //   console.log(data)
  //   }
  //   catch(error){
  //     console.log(error)
  //   }
  // }
  // hello()
  //gettableslist()



  // function dbtoolAccesshistory(username,password) {
  //   const encr = require("./EncryptDecrypt");
  //   const dec = new encr();
  //   var conn = dec.decrypt(
  //     " R7abomE7zOksmEmC7pDhyA== HWZLt0FX6h+tdO3ZVQJwxQ== /rDAAaovaH93JYyzTdWf6w== qt0l8E6ojhNu3YAoLs81aw== Gq4pfCxRjAnfI2+r8co/UQ== H8EtGkdoNV9e9WAtBv4dMA== A+K83uRSu0eH5ogq8jwHmA== sN6FBFjHjWVEC1GHdG4HyA== IvPeMN8WxAxFxGQNMMz1Uw== NTAEZHZhYGZXFVdNpYWoVA== 3hqDiPAvnhvqNBvIc1VY8w=="
  //   );
  //   const mysql2 = require("mysql");
  //   var dbConn = mysql2.createPool({
  //     host: conn.databases[0].host,
  //     user: conn.databases[0].username,
  //     password: conn.databases[0].password,
  //     database: "db_tools",
  //     waitForConnections: true,
  //   });
  //   dbConn.on("connection", function (connection) {
  //     console.log("DB Connection established");
  //     connection.on("error", function (err) {
  //       console.error(new Date(), "MySQL error", err.code);
  //     });
  //     connection.on("close", function (err) {
  //       console.error(new Date(), "MySQL close", err);
  //     });
  //   });
  //   var query = "SELECT isadmin, access, dbaccess FROM Users WHERE username = ? and password = ? ";
  //   var access = {view:false, edit:false, admin: false};
  
  //   return new Promise((resolve, reject) => {
  //     dbConn.query(query,[username,password], function (error, results) {
  //       if (error) {
  //         //console.error(new Date(), "MySQL query error",error);
  //         reject({errortype:"",errorcode:"",errormessage:"Error retrieving data"});
  //         dbConn.end();
  //         return;
  //       } else if(results.length > 0) {
  //         try {
  //           const output = results[0];
  //          // const isadmin = (output.isadmin == 1) ? true : false;
  //          const isadmin=output.isadmin;
  //           access[output.access] = true;
  //           const array = JSON.parse(output.dbaccess);
  //           const placeholder = array.map(() => "?").join(", ");
  //           query = `SELECT dbtools_name FROM Dbtools WHERE id IN (${placeholder});`;
  //           dbConn.query(query, array, function (error, results) {
  //             if (error) {
  //               //console.error(new Date(), "MySQL query error",error);
  //               reject({errortype:"",errorcode:"",errormessage:"Error retrieving data"});
  //               dbConn.end();
  //               return;
  //             }
  //             dbTools_response = JSON.stringify(results);
  //             const combinedData = {
  //               isadmin : isadmin,
  //               access: access,
  //               dbTools: JSON.parse(dbTools_response)   
  //             };
  //             console.log(combinedData);
  //             resolve({errortype:"",errorcode:"1",errormessage:"access is there ",data:combinedData});
  //             //dbConn.end()
  //           });
  //         } catch (error) {
  //           //console.error(new Date(), "Data not in correct format",error);
  //           reject({errortype:"",errorcode:"-2",errormessage:"no db access for the user "});
  //           dbConn.end();
  //           return;
  //         }  
  //       } else {
  //         console.log(new Date(), "Incorrect username ");
  //         reject({errortype:"",errorcode:"-1",errormessage:"Incorrect user "});
  //         dbConn.end()
  //         return;
  //       }
  //     }); 
  //   })
  
  // }

  function dbaccess(element){
    const array = JSON.parse(element.dbaccess);
    const placeholder = array.map(() => "?").join(", ");
    const encr = require("./EncryptDecrypt");
    const dec = new encr();
    var conn = dec.decrypt(
      " R7abomE7zOksmEmC7pDhyA== HWZLt0FX6h+tdO3ZVQJwxQ== /rDAAaovaH93JYyzTdWf6w== qt0l8E6ojhNu3YAoLs81aw== Gq4pfCxRjAnfI2+r8co/UQ== H8EtGkdoNV9e9WAtBv4dMA== A+K83uRSu0eH5ogq8jwHmA== sN6FBFjHjWVEC1GHdG4HyA== IvPeMN8WxAxFxGQNMMz1Uw== NTAEZHZhYGZXFVdNpYWoVA== 3hqDiPAvnhvqNBvIc1VY8w=="
    );
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
    var query = `SELECT dbtools_name FROM Dbtools WHERE id IN (${placeholder});`;

    return new Promise((resolve, reject) => {
      dbConn.query(query, array, function (error, results) {
        if(error){
          reject({errortype:"",errorcode:"-2",errormessage:error})
        }
        var dbTools_response = JSON.stringify(results);
        var data=JSON.parse(dbTools_response)
        resolve (data)
      })
    })
  }


  // Encryption function
function encrypt(text, encryptionKey) {
  const cipher = crypto.createCipher('aes-256-cbc', encryptionKey);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}


function encrypt(text, encryptionKey) {
  encryptionKey="dbtools"
  return new Promise((resolve, reject) => {
    const cipher = crypto.createCipher('aes-256-cbc', encryptionKey);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    resolve(encrypted);
  });
}

// Decryption function
function decrypt(encryptedText, encryptionKey) {
  encryptionKey="dbtools"
  return new Promise((resolve, reject) => {
    const decipher = crypto.createDecipher('aes-256-cbc', encryptionKey);
    try {
      let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      resolve(decrypted);
    } catch (error) {
      reject(error);
    }
  });
}


function getdatabaseconnstrforUsers(username){
  const encr = require("./EncryptDecrypt");
  const dec = new encr();
  var conn = dec.decrypt(
    " R7abomE7zOksmEmC7pDhyA== HWZLt0FX6h+tdO3ZVQJwxQ== /rDAAaovaH93JYyzTdWf6w== qt0l8E6ojhNu3YAoLs81aw== Gq4pfCxRjAnfI2+r8co/UQ== H8EtGkdoNV9e9WAtBv4dMA== A+K83uRSu0eH5ogq8jwHmA== sN6FBFjHjWVEC1GHdG4HyA== IvPeMN8WxAxFxGQNMMz1Uw== NTAEZHZhYGZXFVdNpYWoVA== 3hqDiPAvnhvqNBvIc1VY8w=="
  );
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
  return new Promise((resolve, reject) => {
    dbConn.query(`SELECT * FROM Connstring where assign='${username}'`,(error,results)=>{
      if(error){
        reject(error)
      }
      else if (results.length>0){
        resolve(results)
      }
      else{
        resolve(results)
      }
    })
  })
  
}





  
  module.exports={getPassword,gettableslist,showdatabases,dbtoolAccess,dbaccess,encrypt,decrypt}
