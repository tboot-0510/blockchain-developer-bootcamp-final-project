import {create as ipfsHttpClient} from "ipfs-http-client";
// const projectId = "21Gikf1QWlFSPhZzRIPW1crvD54";
// const projectSecret = "3226db806aec17160dc8ed85214d24e1"
// const auth =
//   'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64')

// const ipfsClient = ipfsHttpClient(
//   {host: 'ipfs.infura.io', 
//   port: '5001', 
//   protocol: 'https',
//   headers: {
//     authorization: auth
//   }});

// const ipfsClient = ipfsHttpClient(
//   {host: 'ipfs.infura.io', 
//   port: '5001', 
//   protocol: 'https',
//   apiPath: '/api/v0',
//   });


const ipfsClient = ipfsHttpClient('/ip4/127.0.0.1/tcp/5001');
// const ipfsClient = ipfsHttpClient();
console.log('config', ipfsClient.getEndpointConfig());
ipfsClient.id(async function (err, res) {
  if (err) throw err;
  console.log(res)
})

export default ipfsClient;