/* De Oost — bestellingen.js
   Voeg na elke voltooide bestelling een regel toe.
   Het ordernummer staat in de bevestigingsmail naar de klant.
   
   Structuur per bestelling:
   - ordernummer:  zoals in de bevestigingsmail (bijv. DO-KL-20240315-123)
   - klantnaam:    voor intern gebruik
   - kledingstuk:  Jas / Broek / Gilet / Overhemd
   - stofnummer:   stofnummer zoals in stoffen.js
   - stofId:       id zoals in stoffen.js (optioneel, als backup)
   - datum:        datum van de bestelling (dd-mm-jjjj)
*/

window.DEOST_BESTELLINGEN = [

  // VOORBEELDBESTELLING — verwijder of overschrijf deze na eerste echte bestelling
  {
    ordernummer: 'DO-KL-20240315-123',
    klantnaam: 'Voorbeeldklant',
    kledingstuk: 'Jas',
    stofnummer: 'HS-2341',
    stofId: 'HS-NAVY-HOPSACK',
    datum: '15-03-2024'
  },

  // Voeg hier nieuwe bestellingen toe:
  // {
  //   ordernummer: 'DO-KL-YYYYMMDD-XXX',
  //   klantnaam: 'Naam klant',
  //   kledingstuk: 'Jas',
  //   stofnummer: 'STOFNUMMER',
  //   stofId: 'STOF-ID',
  //   datum: 'DD-MM-JJJJ'
  // },

];
