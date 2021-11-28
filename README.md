# blockchain-developer-bootcamp-final-project

2021 Consesys Academy Bootcamp

**Author:**
Thomas Boot

**Ethereum account for NFT certification:**
`0x8b22897ABc3f204263c9eB76Dc166F52e2F01b40`

## Scope of the project 
## Scope of the project 
The aim of this project is to come with a blockchain based solution to tackle real world healthcare challenges : unable to efficiently connect healthcare facilities, secure patient data sharing, data tracability. 
This plateform would act as a permissioned based blockchain which allows patients, public institutions (hospitals), insurance companies to join the network once their identity and role are defined. 

## Roles and Workflow 

Any interaction with electronic health reports (EHR) are recorded as transactions on the network. Transactions are only viewable between active participants associated with the process. 

### Patient Data Access
1. Register to the blockchain using his credentials and fills in personal information, affiliated practitioner, insurance provider.
2. Practioner's ID is added to the patient's authorized asset on the ledger. 
3. Patient's ID is added to the Practitioner's authorized asset on the ledger. If authorization from patient. 
4. Patient can allow access or revoke access to practitioner.

Underlying ideas :
4. EHR is encrypted by Practitioner's public key. 
5. EHR is decrypted by Patient's private key. 

### Practitioner
1. Practitioner can update his own personal info
2. Practitioner A updates permissions to allow Practitioner B to access Patient A's EHR. 
3. Verify if Practitioner A is recognized and has permission from patient to read or update EHR.
4. Practitioner can create a new EHR

Underlying ideas :
1. Practitioner A uses it's private key to decrypt the EHR. 
2. Practitioner B uses it's public key to encrypt the EHR. 
3. Practitioner A and B exchange authorizations by adding each other's ID to the respective authorized asset. 

### Institution
1. Medical institution can add practitioner to his establishment
2. Medical institution can set practitioner on actif/non-actif

### Patient Data Tracability 
1. Healthcare/Pharmaceutical companies are able to source data available through the blockchain - (keyword search, off-chain oracle)
2. Submit research with incentive for patients willing to contribute. 
3. If patient accepts, he is then rewarded with a native cryptocoin. 
4. Third parties are able to gather relevant and approved medical data automatically. 


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
`website.com` 
To interact on publically deployed website, please email me : doctor and patient metamask account so that I can add them. 
Or deploy locally and interact with it on your own.

## Scope of the project 
The aim of this project is to come with a blockchain based solution to tackle real world healthcare challenges : unable to efficiently connect healthcare facilities, secure patient data sharing, data tracability. 
This plateform would act as a permissioned based blockchain which allows patients, public institutions (hospitals), insurance companies to join the network once their identity and role are defined. 

## Roles and Workflow 

Any interaction with electronic health reports (EHR) are recorded as transactions on the network. Transactions are only viewable between active participants associated with the process. 

### Patient Data Access
1. Register to the blockchain using his credentials and fills in personal information, affiliated practitioner, insurance provider.
2. Practioner's ID is added to the patient's authorized asset on the ledger. 
3. Patient's ID is added to the Practitioner's authorized asset on the ledger. If authorization from patient. 
4. Patient can allow access or revoke access to practitioner.

Underlying ideas :
4. EHR is encrypted by Practitioner's public key. 
5. EHR is decrypted by Patient's private key. 

### Practitioner
1. Practitioner can update his own personal info
2. Practitioner A updates permissions to allow Practitioner B to access Patient A's EHR. 
3. Verify if Practitioner A is recognized and has permission from patient to read or update EHR.
4. Practitioner can create a new EHR

Underlying ideas :
1. Practitioner A uses it's private key to decrypt the EHR. 
2. Practitioner B uses it's public key to encrypt the EHR. 
3. Practitioner A and B exchange authorizations by adding each other's ID to the respective authorized asset. 

### Institution
1. Medical institution can add practitioner to his establishment
2. Medical institution can set practitioner on actif/non-actif

### Patient Data Tracability 
1. Healthcare/Pharmaceutical companies are able to source data available through the blockchain - (keyword search, off-chain oracle)
2. Submit research with incentive for patients willing to contribute. 
3. If patient accepts, he is then rewarded with a native cryptocoin. 
4. Third parties are able to gather relevant and approved medical data automatically. 


### Explorations 
- Insurance payment plan through same blockchain with fiat or crypto currency