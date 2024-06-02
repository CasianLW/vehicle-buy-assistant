const visitorMessage = `
Give me a response in json format, array of objects,no other textes or infos around (use 999999 for ids)
Example:
[
  {
    "make": "Volkswagen",
    "makeId": 999999, 
    "model": "Golf",
    "modelId": 999999,
    "year": 2018,
    "price": 15000,
    "consumption": 5.5, 
    "fuel_cost": 1.5, 
    "annual_maintenance": 500, 
    "registration_cost": 250, 
    "estimated_insurance": 700, 
    "max_km":2000000
  },...
  


`;

export default visitorMessage;
