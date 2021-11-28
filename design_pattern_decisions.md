# Design patterns

## Inheritance and Interfaces 
- `MedicalBlock` contract inherits the OpenZeppelin's `Ownable` contract to enable ownership the managing party.

## Access Control Design Patterns
-`Ownable` design pattern is one particular function `addAdmin()`. This function allows the contract creator to add specific admins, i.e. hospitals to the contract. 
- There are custom access control for specific functions related to a specific user/party. i.e `onlyPatients()` for patients
`onlyProviders` for doctors and `onlyAdminOrOwner` for the admin and/or owner.