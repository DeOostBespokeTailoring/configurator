/* De Oost — stoffen.js
   Loader/manifest voor alle leveranciersbestanden.

   Bij een NIEUWE leverancier:
   1. Maak js/data/stoffen/volledige-leveranciersnaam.js
   2. Voeg het pad hieronder één keer toe.

   Bij een nieuw stofboek van een BESTAANDE leverancier hoeft dit bestand
   niet aangepast te worden.
*/

window.DEOST_STOFFEN = window.DEOST_STOFFEN || [];

const DEOST_STOFFEN_BESTANDEN = [
  "js/data/stoffen/standeven.js",
  "js/data/stoffen/de-oost-mock-library.js",
  "js/data/stoffen/holland-and-sherry.js",
  "js/data/stoffen/fox-brothers.js",
  "js/data/stoffen/caccioppoli.js",
  "js/data/stoffen/de-oost.js",
  "js/data/stoffen/bateman-ogden.js",
];

DEOST_STOFFEN_BESTANDEN.forEach(function (src) {
  document.write('<script src="' + src + '"><\/script>');
});
