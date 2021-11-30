# blockchain-developer-bootcamp-final-project

2021 Consensys Academy Bootcamp

**Author:**
Thomas Boot

**Ethereum account for NFT certification:**
`0x8b22897ABc3f204263c9eB76Dc166F52e2F01b40`

**Screencast of the deployed website**
`https://www.loom.com/share/451c5e2e5beb4f58a333015e84501487`


## MedLink - Scope of the project 
The aim of this project is to come with a blockchain based solution to tackle real world healthcare challenges : unable to efficiently connect healthcare facilities, secure patient data sharing, data tracability. 
This plateform would act as a permissioned based blockchain which allows patients, doctors and public institutions (hospitals) to read, share and update medical information through encryption and blockchain based technologies. 
Any interaction with electronic health reports (EHR) are recorded as transactions on the network. 
Transactions are only visible between active participants associated with the process. 

## Simple Workflow 
1. Access website and connect metamask to browser. 
2. Connect to Admin page (if admin is locally designated in deploy script, otherwise contact me to request adding your doctor and patient ETH address).
3. Create Doctor and Patient profiles and register them with different metamask accounts.
4. In another browser, connect your patient address to the Profile page and fill in the genesis EHR (personal medical information, DOB, insurance number)
5. If patient decides, it can grant Read/Write access to one of the doctors in the admin's network (admin being i.e. a hospital).
6. Granting/Revoking access will translate into a transaction with the smart contract. Upon success, the front-end will be updated automatically.
7. Logout or open another browser and connect to the Doctor page with the doctor account. The user will have access to the network of patients and see which patients have granted him access. 
8. After checking the permission to read/edit between the patients and the doctor, the ones that granted access will show 3 separate options where the doctor can interact with the smart contract. 
   1. Read the patient's EHR data : First Name, Last Name, Ethereum address, DOB, Insurance number. (This section can be further detailed with more information : blood type, etc)
   2. Update the patient's EHR by writing and committing a new medical record to the blockchain. The content of the report is encrypted and stored with IPFS. The Doctor can add files to the EHR. Patient/Doctor that share the same password can decrypt the content of the EHR. 
   3. If needed, the doctor can transfer READ access of a patient EHR to another doctor on the network. 
9. Switching back to the patient's portal, the patient can access to it's updated EHR, with the decrypted content, address of the provider, date and time of the EHR creation. 

## Additional functions, underlying process and further ideas to finish/implement.

### Encryption process

1. For now, the front-end doesn't allow the patient to set a password to encrypt his medical data. The password is defined by default and hard coded. 
2. The encryption method used is : AES from `crypto-js` package. 
The worflow for encryption is as follow : 
- The report is encrypted with default generated key from password input. 
- The encrypted data is added to the IPFS Client which returns a IPFS Hash. 
- The IPFS hash is then converted to a `bytes32` hash using `bs58` package. 
- The converted hash (EHRhash) is added to the blockchain and stored on chain. 
3. The decryption method is the reversed process of the encryption. 
- The front-end fetches patient's EHR and retrieves the EHRhash.
- The corresponding hash is converted back from a `bytes32` hash into the original IPFS hash. 
- The IPFS hash is fetched in the IPFS client and then decrypted using AES and the same (default) key. 
- The content of the decryption is displayed on the front-end side. 
   
### Additional functions 

1. Admin has the right to remove users from the blockchain. 
2. For instance, when DoctorA grants READ access to patientA to DoctorB, DoctorB can only read content of EHR and not update the medical file. It would need updated permission from patientA to enable DoctorB to update the file.

### Non implemented functions
1. Patient sets password to encrypt his data and doctor should type in password to decrypt the data. 
2. Encrypt the uploaded files by the doctor (i.e. PDF, images...) 

### Further ideas

1. Patient should be able to have the digital property of their data. We could therefore cryptographically store their data in a NFT manner. 
2. Storage of important medical data (benign/malignant findings, not checkup routines) could be stored inside off-chain oracle to contribute to a updated medical knowledge "database".
3. Those off-chain oracle would allow any healthcare company to search for key data and submit research with incentive for patients willing to contribute. 
4. If patient accepts, he is then rewarded with a native cryptocoin. 
5. Third parties are able to gather relevant and approved medical data automatically. 
6. Insurance payment plan through same blockchain with fiat or crypto currency.


## How to run code locally 
### Prerequisites
- Node.js >= v16.9.1
- Yarn
- Metamask: ``npm i -g @metamask/detect-provider``

**Smart Contract : Deployment and testing** 
1. Clone the project to desired folder :
`git clone https://github.com/tboot-0510/blockchain-developer-bootcamp-final-project.git`
2. Go to `smart contract` and run `yarn install` to build smart contract dependencies.
3. Run `npx hardhat test` to run smart contract tests.
4. Before deploying script, in `scripts/deploy.js` change line 23 to your metamask account that would refer to your admin.
5. RUn `npx hardhat run scripts/deploy.js --network rinkeby` to deploy locally.

**Front-end : Deployment and testing**
1. Go to `client` and run `yarn install` to build front end dependencies. 
2. Run `npm start` in a terminal window.
3. Open `localhost:3000`

## Deployed webiste URL 
`https://medlink-app-tboot-0510.vercel.app/` 
To interact on publically deployed website, please email me to `tboot@hawk.iit.edu` doctor and patient metamask account so that I can add them. 
Or deploy locally and interact with it on your own.