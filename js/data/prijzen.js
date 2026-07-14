/* De Oost — prijzen.js
   Voorbereid voor prijsindicaties. Houd dit indicatief totdat de definitieve prijsflow vaststaat.
*/

window.DEOST_PRIJZEN = {
  valuta: "EUR",
  prijsGroepen: {
    A: { label: "Basis", omschrijving: "Basiscollectie" },
    B: { label: "Premium", omschrijving: "Premium collectie" },
    C: { label: "Luxe", omschrijving: "Luxe collectie" },
    D: { label: "Special", omschrijving: "Specials, velvet, cashmere of eveningwear" }
  },
  indicatief: {
    pak_kostuum: {
      A: 1095,
      B: 1295,
      C: 1595,
      D: 1995
    },
    tenue_de_ville: {
      A: 1195,
      B: 1495,
      C: 1795,
      D: 2295
    },
    black_tie: {
      A: 1295,
      B: 1595,
      C: 1895,
      D: 2495
    }
  }
};
