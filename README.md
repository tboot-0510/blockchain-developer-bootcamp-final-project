# blockchain-developer-bootcamp-final-project

2021 Consesys Academy Bootcamp

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