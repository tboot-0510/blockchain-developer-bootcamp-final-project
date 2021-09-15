# blockchain-developer-bootcamp-final-project

2021 Consesys Academy Bootcamp

## Scope of the project 
The aim of this project is to come with a blockchain based solution to tackle real world healthcare challenges : unable to efficiently connect healthcare facilities, secure patient data sharing, data tracability. 
This plateform would act as a permissioned based blockchain which allows patients, public institutions (hospitals), insurance companies to join the network once their identity and role are defined. 

## Roles and Workflow 

Any interaction with electronic health reports (EHR) are recorded as transactions on the network. Transactions are only viewable between active participants associated with the process. 

### Patient Data Access
1. Register to the blockchain using his credentials and fills in personal information, affiliated praticioner, insurance provider.
2. Practioner's ID is added to the patient's authorized asset on the ledger. 
3. Patient's ID is added to the practioner's authorized asset on the ledger.
4. EHR is encrypted by Practioner's public key. 
5. EHR is decrypted by Patient's private key. 

### Practioner Referring Patient 
1. Practioner A updates permissions to allow Practioner B to access Patient A's EHR. 
2. Verify if Practioner A is recognized and has permission on particular EHR.
3. Practioner A uses it's private key to decrypt the EHR. 
4. Practioner B uses it's public key to encrypt the EHR. 
5. Practioner A and B exchange authorizations by adding each other's ID to the respective authorized asset. 

### Patient Data Tracability 
1. Healthcare/Pharmaceutical companies are able to source data available through the blockchain - (keyword search ?)
2. Submit research with incentive for patients willing to contribute. 
3. If patient accepts, he is then rewarded with a native cryptocoin. 
4. Third parties are able to gather relevant and approved medical data automatically. 


### Explorations 
- Insurance payment plan through same blockchain with fiat or crypto currency