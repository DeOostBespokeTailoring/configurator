/* De Oost — stofboeken.js
   Algemene informatie die voor een compleet stofboek/collectie geldt.

   Gewicht, samenstelling en prijs horen ALTIJD bij de individuele stof
   in het leveranciersbestand onder js/data/stoffen/.
*/

window.DEOST_STOFBOEKEN = [
  {
    id: "STANDEVEN-OXBRIDGE-FLANNEL-1",
    leverancier: "Standeven",
    naam: "Oxbridge Flannel 1",
    nummerreeks: "22000–22074",

    type: "Vintage wollen flannel",
    constructie: "Worsted-woollen hybride",
    weving: "flanel",
    afwerking: "Traditionele dubbele mill-finish / blind finish",

    herkomst: "Made in England",
    fabriek: "Stanley Mills, West Yorkshire",
    productie:
      "Geweven in de eigen fabriek van Standeven in Stanley Mills, West Yorkshire. De stof wordt gewassen en geperst met water uit de Pennine Hills.",

    seizoen: ["herfst", "winter"],
    uitstraling: ["zacht", "mat", "klassiek", "Brits", "vintage"],
    patronen: ["effen", "krijtstreep", "pied-de-poule", "ruit", "glen check"],
    kennisTags: ["flannel", "engelse-stof", "made-in-england"],

    korteUitleg:
      "Oxbridge Flannel is een robuuste Engelse wollen flannel met een zachte, matte uitstraling. De collectie is geïnspireerd op historische ontwerpen uit de Standeven-archieven.",

    langeUitleg:
      "Standeven produceert sinds 1885 hoogwaardige Engelse stoffen. Oxbridge Flannel is een nostalgische collectie die rechtstreeks is geïnspireerd op ontwerpen uit de uitgebreide Standeven-archieven. De stof wordt gemaakt van een worsted-woollen hybride. Door de traditionele dubbele mill-finish openen de wolvezels zich, waardoor een zachte, volle touch en de karakteristieke matte blind finish ontstaan. De collectie omvat gecoördineerde effen kleuren, krijtstrepen, pied-de-poule, ruiten en moderne interpretaties van de klassieke Glen check.",

    advies:
      "Zeer geschikt voor herfst- en winterpakken, losse broeken, gilets en klassieke combinaties met een rijke Britse uitstraling.",

    minderGeschiktVoor:
      "Minder geschikt voor warme zomerdagen, ultralichte pakken en zeer formele black-tie kleding waarvoor een gladdere avondstof gewenst is.",

    blogUrl: "",
    blogTitel: "Lees meer over Oxbridge Flannel",

    bronvermelding:
      "Informatie overgenomen uit het Standeven Oxbridge Flannel 1-stofboek.",

    actief: true
  }
];

/*
TEMPLATE NIEUW STOFBOEK

window.DEOST_STOFBOEKEN.push({
  id: "LEVERANCIER-STOFBOEK",
  leverancier: "Volledige leveranciersnaam",
  naam: "Volledige naam stofboek",
  nummerreeks: "",
  type: "",
  constructie: "",
  weving: "",
  afwerking: "",
  herkomst: "",
  fabriek: "",
  productie: "",
  seizoen: [],
  uitstraling: [],
  patronen: [],
  kennisTags: [],
  korteUitleg: "",
  langeUitleg: "",
  advies: "",
  minderGeschiktVoor: "",
  blogUrl: "",
  blogTitel: "Lees meer over deze collectie",
  actief: false
});
*/
