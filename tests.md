props used:
{
"userId": "12345",
"service": "mistral", // or "mistral" to test Mistral AI
"prompt": "Marie 40 ans mère de 2 enfants, veut acheter une nouvelle voiture qu'elle compte utiliser en daily pour aller ses enfants à l'école, faire les courses etc. Quelle voiture recommandez-vous? Donne moi une liste avec les details des voitures trouvées (entre 4 et 10) au JSON format. chaque voiture doit inclure: make, model, year, price, consommation, carburant cost, entretien annuel, cout carte grise, assurance estimee. Format the response as an array of JSON objects."
}

result of postman:

```json
[
  {
    "make": "Volkswagen",
    "model": "Golf",
    "year": 2018,
    "price": 15000,
    "consumption": 5.5, // L/100km
    "fuel_cost": 1.5, // EUR/L
    "annual_maintenance": 500, // EUR/year
    "registration_cost": 250, // EUR
    "estimated_insurance": 700 // EUR/year
  },
  {
    "make": "Renault",
    "model": "Megane",
    "year": 2019,
    "price": 16500,
    "consumption": 5.4,
    "fuel_cost": 1.5,
    "annual_maintenance": 600,
    "registration_cost": 250,
    "estimated_insurance": 800
  },
  {
    "make": "Peugeot",
    "model": "308",
    "year": 2020,
    "price": 18000,
    "consumption": 5.3,
    "fuel_cost": 1.5,
    "annual_maintenance": 650,
    "registration_cost": 250,
    "estimated_insurance": 850
  },
  {
    "make": "Citroen",
    "model": "C4",
    "year": 2017,
    "price": 13000,
    "consumption": 5.7,
    "fuel_cost": 1.5,
    "annual_maintenance": 450,
    "registration_cost": 250,
    "estimated_insurance": 650
  },
  {
    "make": "Toyota",
    "model": "Corolla",
    "year": 2019,
    "price": 17000,
    "consumption": 4.5,
    "fuel_cost": 1.5,
    "annual_maintenance": 400,
    "registration_cost": 250,
    "estimated_insurance": 800
  }
]
```
