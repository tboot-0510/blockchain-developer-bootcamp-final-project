import {create as ipfsHttpClient} from "ipfs-http-client";
export const IPFS_GATEWAY = 'ipfs.infura.io';

const ipfsClient = ipfsHttpClient(
  {host: IPFS_GATEWAY, 
  port: '5001', 
  protocol: 'https'
  });


// const ipfsClient = ipfsHttpClient('/ip4/127.0.0.1/tcp/5001');
console.log('config', ipfsClient.getEndpointConfig());
ipfsClient.id(async function (err, res) {
  if (err) throw err;
  console.log(res)
})

export default ipfsClient;