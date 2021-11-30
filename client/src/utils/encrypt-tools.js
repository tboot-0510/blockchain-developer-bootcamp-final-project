import bs58 from 'bs58';
import ipfsClient from '../ipfs.js';
var CryptoJS = require("crypto-js");

export const getBytes32FromIpfsHash = (ipfsHash) => {
  return "0x"+bs58.decode(ipfsHash).slice(2).toString('hex');
}

export const getIPFSHashFromBytes32 = (bytes32Hex) => {
  const hashHex = "1220" + bytes32Hex.slice(2)
  const hashBytes = Buffer.from(hashHex, 'hex');
  const hashStr = bs58.encode(hashBytes)
  return hashStr
}

var key = CryptoJS.enc.Utf8.parse('b75524255a7f54d2726a951bb39204df');
var iv  = CryptoJS.enc.Utf8.parse('1583288699248111');

export const encryptData = (msg, pass) => {
  var encrypted = CryptoJS.AES.encrypt(msg, key, { iv: iv });
  return encrypted
}

export const decryptData = (data, pass) => {
  var cipherParams = CryptoJS.lib.CipherParams.create({
    ciphertext: CryptoJS.enc.Base64.parse(data)
  });
  
  // var decrypted = CryptoJS.AES.decrypt(data.toString(), key, {iv:iv});
  var decrypted = CryptoJS.AES.decrypt(cipherParams, key, {iv:iv});
  return decrypted.toString(CryptoJS.enc.Utf8);
}

export const decryptEHR = async(bufferIPFS) => {
  let bufferHash = getIPFSHashFromBytes32(bufferIPFS);
  let res = await asyncGetFile(bufferHash);
  const originalText = decryptData(res.toString(), 'password')
  console.log('retrieved CID', bufferHash);
  return originalText;
}

export const addToIPFS = async(fileToUpload) => {
  const result = await ipfsClient.add(fileToUpload);
  return result
}

const asyncGetFile = async (ipfsHash) => {
  let result = await getFromIPFS(ipfsHash);
  return result;
}

export const getFromIPFS = async hashToGet => {

  const res = await ipfsClient.cat(hashToGet);
  let contents = '';
  const decoder = new TextDecoder('utf-8');
  for await (const chunk of res) {
    contents += decoder.decode(chunk, {
      stream: true
    })
  }

  contents += decoder.decode()
  return contents;
}


