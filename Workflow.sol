pragma solidity >= 0.8.0;


contract EHR{
    string internal assetKey;
    string [] visits;
    string [] data;
    string id; 

    function readEHR(uint _ethrID) private{
        // function that allows practitioner to read patient's EHR 
    }
    
    function updateEHR(uint _ethrID) private view{
        // function that allows practitioner to update patient's EHR
        // need to call this externally from contract to save gas
    }
}

contract Patient{

    struct Person {
        string firstName;
        string lastName;
        string DOB;
        address insuranceProvider;
    }
    Person person;
    mapping(uint => Person) persons;

    function updateRight(address _practitionerID) private{
        // patient can create, delete, read and update it's own personal information 
    }

    function allowAccess(address _practitionerID) private{
        // Patient can grant doctors access to update EHR
    }

    function revokeAccess(address _practitionerID) private{
        // Patient can revoke doctors access to EHR
    }

    function shareData() private{
        // Function to share data with off-chain verified oracle 
        // Get reward if dataEHR is valid and access will be granted to 
        // specific EHRID 
    }
}

contract Practitioner{
    enum title {Doctor, Consultant, Surgeon, Pharmacist};

    function updateRights(address _practitionerID){
        // patient can create, delete, read and update it's own personal information 
    }

    function referPatient(address _practitionerID, address _patientID) internal{
        // function to refer Patient from practitioner A to practitioner B 
    }

    function addVisit(uint _ehrID, uint _visitID) private{
        // function that add patient visit and create EHR 
    }

    function createEHR(uint _ehrID) private {
        // function to create EHR 
    }
}

contract Institution{
    string practitionerID;
    string institutionName;
    mapping(uint => address) practitioners;

    function addPractitioner(uint _practitionerID, string _name) private{
        // creates practioners data and add to ledger 
    }

    function setPractitioner(uint _practitionerID) private{
        // function to set practitioner on actif/non-actif
    }



}