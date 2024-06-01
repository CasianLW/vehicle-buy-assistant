### Testing with Postman

1. Open Postman.
2. Create a new request.
3. Set the method to `GET`.
4. Set the URL to `http://localhost:3000/mobilede-cars`.
5. Add the required query parameters (`make`, `model`, `year`).
6. Add optional query parameters as needed to apply filters.
7. Send the request.

### Example Requests in Postman

#### Example 1: Basic Request

**URL**: `http://localhost:3000/mobilede-cars?make=audi&model=a3&year=2017`

#### Example 2: Request with Filters

**URL**: `http://localhost:3000/mobilede-cars?make=audi&model=a3&year=2017&prn=10000&prx=55000&mln=30000&mlx=100000&ger=automatic_gear!manual_gear`

### Example JSON Response

```json
{
  "seeAllUrl": "https://www.automobile.fr/voiture/audi-a3/vhc:car,srt:price,sro:asc,dmg:false,frn:2017,prn:10000,prx:55000,mlx:200000",
  "cars": [
    {
      "title": "Audi A3 1.6 TDI sport Sportback/Xenon/Navi/Sitzhz.",
      "price": "11 500 € (TTC)",
      "details": "07/2018, 176 000 km, 85 kW (116 Ch DIN), Berline, Diesel, Boîte manuelle, Couleur extérieure: Gris, Nombre de portes: 4/5, Émissions de CO2: 108 g CO₂/km (comb.), 4,1 l/100km (comb.), CO₂ classe -- (comb.)",
      "location": "15749 Mittenwalde, Professionnel",
      "imgSrc": "https://img.classistatic.de/api/v1/mo-prod/images/4f/4f12c3bc-86c5-431b-a8f1-18a8f02fafec?rule=mo-640.jpg",
      "href": "https://www.automobile.fr/Voiture/Audi-A3-1.6-TDI-sport-Sportback-Xenon-Navi/vhc:car,pgn:1,pgs:10,srt:price,sro:asc,ms1:1900_8_,frn:2017,prn:10000,prx:55000,mlx:200000,dmg:false/pg:vipcar/388362871.html"
    }
  ]
}
```
