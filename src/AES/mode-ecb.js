/**
*@requires CryptoJS
*/
CryptoJS.mode.ECB = (function () {  
    var ECB = CryptoJS.lib.BlockCipherMode.extend();  

    ECB.Encryptor = ECB.extend({  
        processBlock: function (words, offset) {  
            this._cipher.encryptBlock(words, offset);  
        }  
    });  

    ECB.Decryptor = ECB.extend({  
        processBlock: function (words, offset) {  
            this._cipher.decryptBlock(words, offset);  
        }  
    });  

    return ECB;  
}());

window.AES={
    encryptByDES:function (message, key) {//加密
        var keyHex = CryptoJS.enc.Utf8.parse(key);  
        var encrypted = CryptoJS.DES.encrypt(message, keyHex, {  
            mode: CryptoJS.mode.ECB,  
            padding: CryptoJS.pad.Pkcs7  
        });   
        return encrypted.toString();  
    } ,
 
 
    decryptByDES:function (ciphertext, key) {//解密
        var keyHex = CryptoJS.enc.Utf8.parse(key);  

        // direct decrypt ciphertext  
        var decrypted = CryptoJS.DES.decrypt({  
            ciphertext: CryptoJS.enc.Base64.parse(ciphertext)  
        }, keyHex, {  
            mode: CryptoJS.mode.ECB,  
            padding: CryptoJS.pad.Pkcs7  
        });  

        return decrypted.toString(CryptoJS.enc.Utf8);  
    },
	
	MD5:function(ciphertext,_length){
		_length=_length||32;
		var md5=CryptoJS.MD5(ciphertext,_length);
		return md5.toString();
	}
	
    
};
window.md5=window.md5||{
	hex_md5:function(ciphertext){
		return window.AES.MD5(ciphertext,32);
	},
	md5:function(ciphertext){
		return window.AES.MD5(ciphertext,16);
	}
};