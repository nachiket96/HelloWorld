class Encrypt {
    decrypt() {
        var fs = require('fs');
        var crypto = require('crypto'),
            key = 'datamapping'

        var data = fs.readFileSync('login.txt.enc').toString().split(" ")
        var finaldata = '';
        for (let i = 1; i < data.length; i++) {
            var encryptedData = data[i]
            var decipher = crypto.createDecipher('aes-256-cbc', key);
            decipher.update(encryptedData, 'base64', 'utf8');
            var decryptedData = decipher.final('utf8');
            finaldata = finaldata + decryptedData
        }
        return JSON.parse(finaldata);
    }

    encrypted(p) {
        var crypto = require('crypto'),
            fs = require('fs'),
            key = 'datamapping',
            plaintext = JSON.stringify(p)
        var list = []
        for (let i = 0; i < plaintext.length; i++) {
            list.push(plaintext.slice(i, i + 14))
            i += 13
        }
        fs.writeFileSync('login.txt.enc', '')
        for (let i in list) {
            var cipher = crypto.createCipher('aes-256-cbc', key)
            cipher.update(list[i], 'utf8', 'base64');
            var encryptedData = cipher.final('base64');
            fs.writeFileSync('data.txt.enc', fs.readFileSync('data.txt.enc') + " " + encryptedData)
        }
        return 0;
    }
    encryptedstring(p) {
        
        var crypto = require('crypto'),
            key = 'datamapping',
            plaintext = p,
            list = [],
            data = ""

        for (let i = 0; i < plaintext.length; i++) {
            list.push(plaintext.slice(i, i + 14))
            i += 13
        }
        let fs = require('fs')
        fs.writeFileSync('login.txt.enc', '')
        
        for (let i in list) {
            var cipher = crypto.createCipher('aes-256-cbc', key)
            cipher.update(list[i], 'utf8', 'base64');
            var encryptedData = cipher.final('base64');
            data = data + encryptedData
            fs.writeFileSync('login.txt.enc', fs.readFileSync('login.txt.enc') + " " + encryptedData)
        }
        
        console.log("inside method")
        console.log(data);
        return data;
    }
    decrypt(p) {
        var crypto = require('crypto'),
            key = 'datamapping'

        var data = p.toString().split(" ")
        var finaldata = '';
        for (let i = 1; i < data.length; i++) {
            var encryptedData = data[i]
            var decipher = crypto.createDecipher('aes-256-cbc', key);
            decipher.update(encryptedData, 'base64', 'utf8');
            var decryptedData = decipher.final('utf8');
            finaldata = finaldata + decryptedData
        }
        return JSON.parse(finaldata);
    }
}
module.exports = Encrypt;
let en = new Encrypt();
en.encryptedstring(`{
    "databases": [{
        "type": "mysql",
        "username": "root",
        "password": "user@1234",
        "host": "192.168.3.92"
    }]
}`)


var data="hello"
if(typeof(data)==String){
    console.log("hi");
}