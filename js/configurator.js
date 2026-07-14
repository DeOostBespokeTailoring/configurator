const IMG = 'tekeningen/';
// Publieke Web App URL voor veilige server-side lookup van vorige orderstoffen.
// Deze lookup geeft alleen stofgegevens terug, geen klantgegevens of maten.
const ORDER_LOOKUP_WEBHOOK = 'https://script.google.com/macros/s/AKfycbxsvaBE_idhCycPYSNTWFArabURE3m6e21JhkESucP0BbT3oQSA9vHsRMo5RN_hkQ5r0w/exec';
const ORDER_SUBMIT_WEBHOOK = ORDER_LOOKUP_WEBHOOK;

const GELEGENHEDEN = [
  {
    id: 'pak_kostuum',
    naam: 'Pak / kostuum',
    desc: 'Een twee- of driedelig pak, eventueel met extra broek. In principe één hoofdstof voor alle onderdelen.',
    icon: 'ti-shirt'
  },
  {
    id: 'tenue_de_ville',
    naam: 'Tenue de ville',
    desc: 'Een combinatie van jas, broek en eventueel gilet in meerdere stoffen. Geschikt voor formele dagkleding en bruiloften.',
    icon: 'ti-tie'
  },
  {
    id: 'black_tie',
    naam: 'Black-Tie / Avond- / Galakleding',
    desc: 'Dinner jacket, smoking, jacquet, rokkostuum of rok-wit. Deze route heeft eigen avondkleding-keuzes.',
    icon: 'ti-moon-stars'
  },
  {
    id: 'los_kledingstuk',
    naam: 'Los kledingstuk',
    desc: 'Bestel één los onderdeel, zoals een jasje, broek of gilet. Ook geschikt voor een extra onderdeel bij een eerdere order.',
    icon: 'ti-hanger'
  }
];

const KLEDINGSTUKKEN = ['Jas','Broek','Gilet'];

const BESTEL_OPTIES = [
  {
    id:'tweedelig',
    naam:'2-delig pak',
    desc:'Jas en broek.',
    icon:'ti-shirt',
    kledingstukken:['Jas','Broek'],
    geschiktVoor:['pak_kostuum','tenue_de_ville']
  },
  {
    id:'tweedelig_extra_broek',
    naam:'2-delig pak + extra broek',
    desc:'Jas, broek en een tweede broek.',
    icon:'ti-copy-plus',
    kledingstukken:['Jas','Broek'],
    extraItems:['Broek'],
    geschiktVoor:['pak_kostuum','tenue_de_ville']
  },
  {
    id:'driedelig',
    naam:'3-delig pak',
    desc:'Jas, broek en gilet.',
    icon:'ti-layers-intersect',
    kledingstukken:['Jas','Broek','Gilet'],
    geschiktVoor:['pak_kostuum','tenue_de_ville']
  },
  {
    id:'driedelig_extra_broek',
    naam:'3-delig pak + extra broek',
    desc:'Jas, broek, gilet en een tweede broek.',
    icon:'ti-copy-plus',
    kledingstukken:['Jas','Broek','Gilet'],
    extraItems:['Broek'],
    geschiktVoor:['pak_kostuum','tenue_de_ville']
  },
  {
    id:'dinner_jacket',
    naam:'Dinner jacket',
    desc:'Los avondjasje, bijvoorbeeld ivoor of velvet, te combineren met een avondbroek.',
    icon:'ti-shirt',
    kledingstukken:['Jas'],
    geschiktVoor:['black_tie'],
    blackTieType:'dinner_jacket'
  },
  {
    id:'smoking',
    naam:'Smoking',
    desc:'Smokingjas en smokingbroek met avondafwerking zoals satijn of grosgrain.',
    icon:'ti-moon-stars',
    kledingstukken:['Jas','Broek'],
    geschiktVoor:['black_tie'],
    blackTieType:'smoking'
  },
  {
    id:'jacquet',
    naam:'Jacquet',
    desc:'Jacquetjas, broek en eventueel gilet voor formele daggelegenheden.',
    icon:'ti-tie',
    kledingstukken:['Jas','Broek','Gilet'],
    geschiktVoor:['black_tie'],
    blackTieType:'jacquet'
  },
  {
    id:'rokkostuum',
    naam:'Rokkostuum',
    desc:'Rokjas en broek voor zeer formele avondkleding.',
    icon:'ti-stars',
    kledingstukken:['Jas','Broek'],
    geschiktVoor:['black_tie'],
    blackTieType:'rokkostuum'
  },
  {
    id:'rok_wit',
    naam:'Rok-wit',
    desc:'Rokkostuum met wit vest / white tie-opbouw.',
    icon:'ti-stars',
    kledingstukken:['Jas','Broek','Gilet'],
    geschiktVoor:['black_tie'],
    blackTieType:'rok_wit'
  },
  {
    id:'black_tie_losse_broek',
    naam:'Losse avondbroek',
    desc:'Alleen een smoking- of avondbroek, bijvoorbeeld als extra of vervanging.',
    icon:'ti-layout-bottombar',
    kledingstukken:['Broek'],
    geschiktVoor:['black_tie'],
    blackTieType:'losse_avondbroek'
  },
  {
    id:'los_jasje',
    naam:'Los jasje',
    desc:'Alleen een jasje samenstellen.',
    icon:'ti-shirt',
    kledingstukken:['Jas'],
    geschiktVoor:['los_kledingstuk']
  },
  {
    id:'losse_broek',
    naam:'Losse broek',
    desc:'Alleen een broek samenstellen.',
    icon:'ti-layout-bottombar',
    kledingstukken:['Broek'],
    geschiktVoor:['los_kledingstuk']
  },
  {
    id:'los_gilet',
    naam:'Los gilet',
    desc:'Alleen een gilet samenstellen.',
    icon:'ti-layers-intersect',
    kledingstukken:['Gilet'],
    geschiktVoor:['los_kledingstuk']
  },
  {
    id:'extra_bestaande_order',
    naam:'Extra kledingstuk bij eerdere order',
    desc:'Bestel een extra broek, jasje of gilet met verwijzing naar een vorige order en dezelfde stof.',
    icon:'ti-history',
    kledingstukken:['Broek'],
    geschiktVoor:['los_kledingstuk'],
    vereistVorigeOrder:true
  }
];

const STAPPEN = {
  Jas: [
    {
      id: 'jas_sluiting', label: 'Single of double breasted', icon: 'ti-shirt', verplicht: true,
      opties: [
        {id:'sb', naam:'Single breasted', desc:'Enkele rij knopen', img:'1._jas__1._single_of_double_breasted__single_breasted.png'},
        {id:'db', naam:'Double breasted', desc:'Dubbele rij knopen', img:'1._jas__1._single_of_double_breasted__double_breasted.png'},
      ]
    },
    {
      id: 'jas_knopen', label: 'Aantal knopen', icon: 'ti-circle-dot', verplicht: true,
      conditioneel: (k) => true,
      opties: (k) => k.jas_sluiting === 'db' ? [
        {id:'4x2', naam:'4×2', desc:'4 knopen, 2 rijen', img:'1._jas__2._hoveel_knopen__double__4x2.png'},
        {id:'6x2', naam:'6×2', desc:'6 knopen, 2 rijen', img:'1._jas__2._hoveel_knopen__double__6x2.png'},
      ] : [
        {id:'1', naam:'1 knoop', desc:'Minimalistisch', img:'1._jas__2._hoveel_knopen__single__1_knoop.png'},
        {id:'2', naam:'2 knopen', desc:'Klassiek', img:'1._jas__2._hoveel_knopen__single__2_knopen.png'},
        {id:'2.5', naam:'2,5 knopen', desc:'Halfknoop', img:'1._jas__2._hoveel_knopen__single__2_5_knopen.png'},
        {id:'3', naam:'3 knopen', desc:'Traditioneel', img:'1._jas__2._hoveel_knopen__single__3_knopen.png'},
        {id:'4', naam:'4 knopen', desc:'Langere jaslengte', img:'1._jas__2._hoveel_knopen__single__4_knopen.png'},
      ]
    },
    {
      id: 'jas_revers', label: 'Revers / kraag', icon: 'ti-chevrons-up', verplicht: true,
      opties: (k) => k.jas_sluiting === 'db' ? [
        {id:'notch_db', naam:'Notch revers', desc:'DB notch lapel', img:'1._jas__3._revers__double_breasted__notch.png'},
        {id:'peak_db', naam:'Peak revers', desc:'DB peak lapel', img:'1._jas__3._revers__double_breasted__peak.png'},
        {id:'shawl_db', naam:'Shawl kraag', desc:'DB shawl collar', img:'1._jas__3._revers__double_breasted__shawl.png'},
      ] : [
        {id:'notch_sb', naam:'Notch revers', desc:'Klassieke V-vorm', img:'1._jas__3._revers__single_breasted__notch.png'},
        {id:'peak_sb', naam:'Peak revers', desc:'Puntige revers', img:'1._jas__3._revers__single_breasted__peak.png'},
        {id:'shawl_sb', naam:'Shawl kraag', desc:'Ronde doorlopende kraag', img:'1._jas__3._revers__single_breasted__shawl.png'},
        {id:'nehru', naam:'Nehru / Mao', desc:'Staande kraag', img:'1._jas__3._revers__single_breasted__nehru.png'},
      ]
    },
    {
      id: 'jas_belly', label: 'Belly (reversgrootte)', icon: 'ti-arrows-horizontal', verplicht: false,
      opties: [
        {id:'geen_belly', naam:'Geen belly', desc:'Rechte revisrand', img:'1._jas__3._revers__belly__geen_belly.png'},
        {id:'belly', naam:'Belly', desc:'Lichte curve', img:'1._jas__3._revers__belly__belly.png'},
        {id:'meer_belly', naam:'Meer belly', desc:'Uitgesproken curve', img:'1._jas__3._revers__belly__meer_belly.png'},
      ]
    },
    {
      id: 'jas_zakken', label: 'Zakken', icon: 'ti-layout-bottombar', verplicht: true,
      opties: [
        {id:'slanted', naam:'Schuine zakken', desc:'Slanted pockets', img:'1._jas__4._zakken__slanted.png'},
        {id:'slanted_flap', naam:'Schuine zakken + flap', desc:'Slanted flap pockets', img:'1._jas__4._zakken__slanted_flap.png'},
        {id:'slanted_ticket', naam:'Schuine + ticketzak', desc:'Slanted + ticket pocket', img:'1._jas__4._zakken__slanted_ticket.png'},
        {id:'slanted_flap_ticket', naam:'Schuine flap + ticket', desc:'Slanted flap + ticket', img:'1._jas__4._zakken__slanted_flap_ticket.png'},
        {id:'welt', naam:'Paspelzakken', desc:'Welt pockets', img:'1._jas__4._zakken__welt_pocket.png'},
        {id:'welt_flap', naam:'Paspel + flap', desc:'Welt flap pockets', img:'1._jas__4._zakken__welt_flap.png'},
        {id:'welt_ticket', naam:'Paspel + ticket', desc:'Welt + ticket pocket', img:'1._jas__4._zakken__welt_ticket_pocket.png'},
        {id:'welt_flap_ticket', naam:'Paspel flap + ticket', desc:'Welt flap + ticket', img:'1._jas__4._zakken__welt_flap_ticket.png'},
        {id:'patch', naam:'Patch pockets', desc:'Opgenaaide zakken', img:'1._jas__4._zakken__patch_pockets.png'},
        {id:'patch_flap', naam:'Patch pockets + flap', desc:'Opgenaaid met flap', img:'1._jas__4._zakken__patch_pockets_flap.png'},
      ]
    },
    {
      id: 'jas_borstzak', label: 'Borstzak', icon: 'ti-square', verplicht: false,
      opties: [
        {id:'normaal', naam:'Standaard borstzak', desc:'Rechte paspel', img:'1._jas__8.2_borstzakken__borstzak_normaal.png'},
        {id:'barchetta', naam:'Barchetta', desc:'Gebogen borstzak', img:'1._jas__8.2_borstzakken__barchetta.png'},
      ]
    },
    {
      id: 'jas_split', label: 'Split (achterste)', icon: 'ti-layout-distribute-vertical', verplicht: true,
      opties: [
        {id:'geen_split', naam:'Geen split', desc:'Gesloten rug', img:'1._jas__6._split__geen_split.png'},
        {id:'enkele_split', naam:'Enkele split', desc:'Centrale split', img:'1._jas__6._split__enkele_split.png'},
        {id:'dubbele_split', naam:'Dubbele split', desc:'Twee zijsplits', img:'1._jas__6._split__dubbele_split.png'},
      ]
    },
    {
      id: 'jas_schouder', label: 'Schoudertype', icon: 'ti-arrows-horizontal', verplicht: false,
      opties: [
        {id:'normaal', naam:'Normaal', desc:'Klassieke schouder', img:'1._jas__9._schoudertype__normaal.png'},
        {id:'rollino', naam:'Rollino', desc:'Zachte Napolitaanse stijl', img:'1._jas__9._schoudertype__rollino.png'},
        {id:'spalla_camicia', naam:'Spalla Camicia', desc:'Hemdsmouw inzet', img:'1._jas__9._schoudertype__spalla_camicia.png'},
      ]
    },
    {
      id: 'jas_mouw_aantal', label: 'Mouwknopen — aantal', icon: 'ti-circles', verplicht: false,
      opties: [
        {id:'geen', naam:'Geen knopen', desc:'', img:'1._jas__7._knopen_op_de_mouw__aantal_knopen__geen_knopen.png'},
        {id:'3', naam:'3 knopen', desc:'', img:'1._jas__7._knopen_op_de_mouw__aantal_knopen__3_knopen.png'},
        {id:'4', naam:'4 knopen', desc:'Meest gangbaar', img:'1._jas__7._knopen_op_de_mouw__aantal_knopen__4_knopen.png'},
        {id:'5', naam:'5 knopen', desc:'', img:'1._jas__7._knopen_op_de_mouw__aantal_knopen__5_knopen.png'},
      ]
    },
    {
      id: 'jas_mouw_plaatsing', label: 'Mouwknopen — plaatsing', icon: 'ti-circles', verplicht: false,
      opties: [
        {id:'normaal', naam:'Normaal', desc:'Gelijke afstand', img:'1._jas__7._knopen_op_de_mouw__hoe_geplaatst__4_knopen.png'},
        {id:'kissing', naam:'Kissing buttons', desc:'Rakend aan elkaar', img:'1._jas__7._knopen_op_de_mouw__hoe_geplaatst__4_knopen_kissing.png'},
        {id:'meer_ruimte', naam:'Meer ruimte', desc:'Grotere tussenafstand', img:'1._jas__7._knopen_op_de_mouw__hoe_geplaatst__4_knopen_meer_ruimte.png'},
      ]
    },
    {
      id: 'jas_revers_detail', label: 'Revers detail', icon: 'ti-flower', verplicht: false,
      opties: [
        {id:'knoopsgat', naam:'Knoopsgat', desc:'Standaard buttonhole', img:'1._jas__8._flowerloop_op_revers_-_stitching__knoopsgat.png'},
        {id:'flowerloop', naam:'Flowerloop', desc:'Lusje voor bloem', img:'1._jas__8._flowerloop_op_revers_-_stitching__flowerloop.png'},
        {id:'milanees', naam:'Milanees', desc:'Milanese buttonhole', img:'1._jas__8._flowerloop_op_revers_-_stitching__milanees.png'},
      ]
    },
    {
      id: 'jas_stitching', label: 'Pick stitching', icon: 'ti-needle-thread', verplicht: false,
      opties: [
        {id:'panden', naam:'Panden', desc:'Alleen panden', img:'1._jas__8._pick_stitching__panden.png'},
        {id:'panden_revers', naam:'Panden + revers', desc:'', img:'1._jas__8._pick_stitching__panden_plus_revers.png'},
        {id:'panden_revers_naden', naam:'Panden + revers + naden', desc:'', img:'1._jas__8._pick_stitching__panden_plus_revers_plus_naden.png'},
        {id:'panden_revers_naden_dik', naam:'Dikker stitching', desc:'', img:'1._jas__8._pick_stitching__panden_plus_revers_plus_naden_dikker.png'},
        {id:'revers', naam:'Alleen revers', desc:'', img:'1._jas__8._pick_stitching__revers.png'},
      ]
    },
    {
      id: 'jas_swelled_edge', label: 'Swelled edge', icon: 'ti-line', verplicht: false,
      opties: [
        {id:'swelled', naam:'Swelled edge', desc:'Brede stiksels op revers', img:'1._jas__10._revers_swelled_edge__swelled_edge.png'},
        {id:'swelled_panden', naam:'Swelled edge + panden', desc:'Revers én panden', img:'1._jas__10._revers_swelled_edge__swelled_edge_revers_plus_panden.png'},
      ]
    },
    {
      id: 'jas_binnenzakken', label: 'Binnenzakken', icon: 'ti-box', verplicht: false,
      opties: [
        {id:'standaard', naam:'Standaard', desc:'Links binnenzak', img:'1._jas__5._binnenzakken__binnenzakken.png'},
        {id:'links', naam:'Alleen links', desc:'', img:'1._jas__5._binnenzakken__binnenzakken_links.png'},
        {id:'rechts', naam:'Alleen rechts', desc:'', img:'1._jas__5._binnenzakken__binnenzakken_rechts.png'},
        {id:'x2_boven', naam:'2× boven', desc:'', img:'1._jas__5._binnenzakken__binnenzakken_x_2_boven.png'},
        {id:'onder_x2', naam:'2× onder', desc:'', img:'1._jas__5._binnenzakken__binnenzakken_onder_x_2.png'},
        {id:'x4plus', naam:'4+ zakken', desc:'', img:'1._jas__5._binnenzakken__binnenzakken_x_4plus.png'},
        {id:'knoop', naam:'Met knoop', desc:'', img:'1._jas__5._binnenzakken__binnenzakken_met_knoop.png'},
        {id:'driehoek', naam:'Driehoek flap', desc:'', img:'1._jas__5._binnenzakken__binnenzakken_met_driehoek_flap.png'},
      ]
    },
  ],
  Broek: [
    {
      id: 'broek_stijl', label: 'Pijpvorm', icon: 'ti-layout-bottombar', verplicht: true,
      opties: [
        {id:'recht', naam:'Rechte pijp', desc:'Klassiek', img:'2._broek__1._stijl__rechte_pijp.png'},
        {id:'slim', naam:'Slim fit', desc:'Nauwer model', img:'2._broek__1._stijl__slim.png'},
        {id:'flared', naam:'Flared', desc:'Uitlopende pijp', img:'2._broek__1._stijl__flared.png'},
      ]
    },
    {
      id: 'broek_plooi', label: 'Plooien', icon: 'ti-fold', verplicht: true,
      opties: [
        {id:'geen', naam:'Geen plooi', desc:'Flat front', img:'2._broek__5._pleats__geen_plooi.png'},
        {id:'enkele', naam:'Enkele plooi', desc:'Forward pleat', img:'2._broek__5._pleats__enkele_plooi.png'},
        {id:'enkele2', naam:'Enkele plooi variant', desc:'Reverse pleat', img:'2._broek__5._pleats__enkele_plooi_2.png'},
        {id:'dubbele', naam:'Dubbele plooi', desc:'Twee plooien', img:'2._broek__5._pleats__dubbele_plooi.png'},
        {id:'dubbele2', naam:'Dubbele plooi variant', desc:'', img:'2._broek__5._pleats__dubbele_plooi_2.png'},
      ]
    },
    {
      id: 'broek_band', label: 'Broekband', icon: 'ti-belt', verplicht: true,
      opties: [
        {id:'6_wide', naam:'6 brede lussen', desc:'Standard waistband', img:'2._broek__2._broekband__6_wide_loops.png'},
        {id:'6_double', naam:'6 dubbele lussen', desc:'Double loops', img:'2._broek__2._broekband__6_double_loops.png'},
        {id:'8_loops', naam:'8 lussen', desc:'Extra lussen', img:'2._broek__2._broekband__8_loops.png'},
        {id:'no_loops', naam:'Zonder lussen', desc:'No loops', img:'2._broek__2._broekband__no_loops.png'},
        {id:'side_tabs_2', naam:'Side tabs 2 knopen', desc:'', img:'2._broek__2._broekband__side_tabs_2_buttons.png'},
        {id:'side_tabs_3', naam:'Side tabs 3 knopen', desc:'', img:'2._broek__2._broekband__side_tabs_3_buttons.png'},
        {id:'strap_buckle', naam:'Strap & buckle', desc:'Gesp sluiting', img:'2._broek__2._broekband__strap_&_buckle.png'},
        {id:'gurkha', naam:'Gurkha', desc:'Dubbele knoop sluiting', img:'2._broek__2._broekband__gurkha.png'},
        {id:'internal', naam:'Verstelbare band', desc:'Internal adjustable', img:'2._broek__2._broekband__internal_adjustable_waistband.png'},
        {id:'bretels', naam:'Bretels', desc:'Suspenders', img:'2._broek__2._broekband__bretels.png'},
      ]
    },
    {
      id: 'broek_sluiting', label: 'Sluiting', icon: 'ti-zipper', verplicht: true,
      opties: [
        {id:'knoop', naam:'Knoopsluiting', desc:'Buttoned fastening', img:'2._broek__4._sluiting__buttoned_fastening.png'},
        {id:'rits', naam:'Rits', desc:'Zipped fastening', img:'2._broek__4._sluiting__zipped_fastening.png'},
      ]
    },
    {
      id: 'broek_zakken', label: 'Zijzakken', icon: 'ti-layout-sidebar', verplicht: true,
      opties: [
        {id:'straight', naam:'Rechte zakken', desc:'Straight side pockets', img:'2._broek__6._zakken__straight_side_pockets.png'},
        {id:'slanted', naam:'Schuine zakken', desc:'Slanted slide pockets', img:'2._broek__6._zakken__slanted_slide_pockets.png'},
        {id:'rounded', naam:'Ronde zakken', desc:'Rounded pockets', img:'2._broek__6._zakken__rounded_pockets.png'},
        {id:'frogmouth', naam:'Frogmouth pockets', desc:'', img:'2._broek__6._zakken__frogmouth_pockets.png'},
        {id:'frogmouth_money', naam:'Frogmouth + geldvak', desc:'', img:'2._broek__6._zakken__frogmouth_pockets_money_pocket.png'},
        {id:'welted', naam:'Paspelzakken', desc:'Welted pockets', img:'2._broek__6._zakken__welted_pockets.png'},
      ]
    },
    {
      id: 'broek_achterzakken', label: 'Achterzakken', icon: 'ti-layout-bottombar-expand', verplicht: false,
      opties: [
        {id:'geen', naam:'Geen zakken', desc:'', img:'2._broek__7._achterzakken__no_pockets_trousers_back.png'},
        {id:'enkel_links', naam:'Enkel links', desc:'', img:'2._broek__7._achterzakken__single_back_pocket_left.png'},
        {id:'enkel_rechts', naam:'Enkel rechts', desc:'', img:'2._broek__7._achterzakken__single_back_pocket_right.png'},
        {id:'enkel_flap_links', naam:'Enkel flap links', desc:'', img:'2._broek__7._achterzakken__single_back_pocket_-w_flap_left.png'},
        {id:'enkel_flap_rechts', naam:'Enkel flap rechts', desc:'', img:'2._broek__7._achterzakken__single_back_pocket_-w_flap_right.png'},
        {id:'enkel_knoop', naam:'Enkel + knoop rechts', desc:'', img:'2._broek__7._achterzakken__single_back_pocket_-w_button_right.png'},
        {id:'dubbel', naam:'Dubbel', desc:'', img:'2._broek__7._achterzakken__double_back_pockets.png'},
        {id:'dubbel_knoppen', naam:'Dubbel + knopen', desc:'', img:'2._broek__7._achterzakken__double_back_pockets_-w_buttons.png'},
        {id:'dubbel_flap', naam:'Dubbel + flap', desc:'', img:'2._broek__7._achterzakken__double_back_pockets_-w_flap.png'},
        {id:'patch_vierkant', naam:'Patch vierkant', desc:'', img:'2._broek__7._achterzakken__double_patch_pockets_square.png'},
        {id:'patch_rond', naam:'Patch rond', desc:'', img:'2._broek__7._achterzakken__double_patch_pockets_round.png'},
        {id:'patch_punt', naam:'Patch punt', desc:'', img:'2._broek__7._achterzakken__double_patch_pockets_point.png'},
      ]
    },
    {
      id: 'broek_achterkant', label: 'Achterkant / fishtail', icon: 'ti-arrow-fork', verplicht: false,
      opties: [
        {id:'standaard', naam:'Standaard', desc:'', img:'2._broek__3._achterkant_-_fishtail_etc__standaard.png'},
        {id:'fishtail', naam:'Fishtail', desc:'Puntige achterkant', img:'2._broek__3._achterkant_-_fishtail_etc__fishtail.png'},
        {id:'fishtail_achter', naam:'Fishtail achter', desc:'', img:'2._broek__3._achterkant_-_fishtail_etc__fishtail_achter.png'},
        {id:'after_dinner', naam:'After dinner split', desc:'', img:'2._broek__3._achterkant_-_fishtail_etc__after_dinner_split.png'},
      ]
    },
    {
      id: 'broek_onderkant', label: 'Onderkant pijp', icon: 'ti-arrow-down', verplicht: false,
      opties: [
        {id:'recht', naam:'Recht afgewerkt', desc:'', img:'2._broek__8._onderkant__trouser_bottom_straight.png'},
        {id:'schuin', naam:'Schuin afgewerkt', desc:'', img:'2._broek__8._onderkant__trouser_bottom_slanted.png'},
        {id:'omslag', naam:'Met omslag', desc:'Turn-up', img:'2._broek__8._onderkant__omslag.png'},
        {id:'geen_omslag', naam:'Zonder omslag', desc:'', img:'2._broek__8._onderkant__geen_omslag.png'},
      ]
    },
    {
      id: 'broek_bies', label: 'Biezen', icon: 'ti-line', verplicht: false,
      opties: [
        {id:'enkel', naam:'Enkele bies', desc:'', img:'2._broek__9._biezen__enkele_bies.png'},
        {id:'dubbel', naam:'Dubbele bies', desc:'', img:'2._broek__9._biezen__dubbele_bies.png'},
      ]
    },
  ],
  Gilet: [
    {
      id: 'gilet_sluiting', label: 'Single of double', icon: 'ti-shirt', verplicht: true,
      opties: [
        {id:'sb', naam:'Single breasted', desc:'', img:'3._gilets__1._single_of_double__single_breasted.png'},
        {id:'db', naam:'Double breasted', desc:'', img:'3._gilets__1._single_of_double__double_breasted.png'},
      ]
    },
    {
      id: 'gilet_revers', label: 'Revers / kraag', icon: 'ti-chevrons-up', verplicht: true,
      opties: [
        {id:'notch', naam:'Notch revers', desc:'', img:'3._gilets__2._wel_of_geen_revers__notch.png'},
        {id:'peak', naam:'Peak revers', desc:'', img:'3._gilets__2._wel_of_geen_revers__peak.png'},
        {id:'shawl', naam:'Shawl kraag', desc:'', img:'3._gilets__2._wel_of_geen_revers__shawl.png'},
        {id:'nehru', naam:'Nehru', desc:'', img:'3._gilets__2._wel_of_geen_revers__nehru.png'},
        {id:'zonder', naam:'Zonder revers', desc:'V-hals', img:'3._gilets__2._wel_of_geen_revers__zonder.png'},
        {id:'zonder_rond', naam:'Zonder revers (rond)', desc:'Ronde hals', img:'3._gilets__2._wel_of_geen_revers__zonder-rond.png'},
      ]
    },
    {
      id: 'gilet_zakken', label: 'Zakken', icon: 'ti-layout-bottombar', verplicht: true,
      opties: [
        {id:'paspel', naam:'Paspelzakken', desc:'', img:'3._gilets__3._zakken__paspel.png'},
        {id:'zakken', naam:'Standaard zakken', desc:'', img:'3._gilets__3._zakken__zakken.png'},
        {id:'zakken_borstzak', naam:'Zakken + borstzak', desc:'', img:'3._gilets__3._zakken__zakken_met_borstzakken.png'},
        {id:'patch', naam:'Patch pockets', desc:'', img:'3._gilets__3._zakken__patch.png'},
        {id:'patch_flap', naam:'Patch + flap', desc:'', img:'3._gilets__3._zakken__patch_flap.png'},
        {id:'patch_flap_button', naam:'Patch + flap + knoop', desc:'', img:'3._gilets__3._zakken__patch_flap_button.png'},
        {id:'borstzak_links', naam:'Alleen borstzak links', desc:'', img:'3._gilets__3._zakken__zakken_borstzak_links.png'},
        {id:'borstzak_rechts', naam:'Alleen borstzak rechts', desc:'', img:'3._gilets__3._zakken__zakken_borstzak_rechts.png'},
      ]
    },
    {
      id: 'gilet_rug', label: 'Rugpand', icon: 'ti-rotate-180', verplicht: false,
      opties: [
        {id:'voering', naam:'Voering op rug', desc:'Klassiek', img:'3._gilets__5._rug_voering_of_stof__voering_op_de_rug.png'},
        {id:'stof', naam:'Stof op rug', desc:'Volledig in stof', img:'3._gilets__5._rug_voering_of_stof__stof_op_de_rug.png'},
      ]
    },
    {
      id: 'gilet_buckle', label: 'Buckle (achterkant)', icon: 'ti-adjustments', verplicht: false,
      opties: [
        {id:'met', naam:'Met buckle', desc:'Verstelbaar', img:'3._gilets__6._wel_of_geen_buckle__met_buckle.png'},
        {id:'zonder', naam:'Zonder buckle', desc:'', img:'3._gilets__6._wel_of_geen_buckle__zonder_buckle.png'},
      ]
    },
    {
      id: 'gilet_onderkant', label: 'Onderkant', icon: 'ti-arrow-down', verplicht: false,
      opties: [
        {id:'recht', naam:'Rechte onderkant', desc:'', img:'3._gilets__7._onderkant_recht_of_rond__normale_onderkant.png'},
        {id:'rond', naam:'Ronde onderkant', desc:'', img:'3._gilets__7._onderkant_recht_of_rond__ronde_onderkant.png'},
      ]
    },
  ]
};

let gelegenheid = null;
let bestelOptie = null;
let extraItemType = 'Broek';
let vorigeOrdernummer = '';
let vorigeOrderCode = '';
let vorigeOrderMatch = null;
let vorigeOrderLookupBezig = false;
let vorigeOrderLookupFout = '';
let actieveKled = 'Jas';
let actieveStap = 0;
let keuzes = {};
let aantallen = { Jas: 1, Broek: 1, Gilet: 1 };


function renderGelegenheden() {
  const grid = document.getElementById('gelegenheidGrid');
  if (!grid) return;
  grid.innerHTML = '';
  GELEGENHEDEN.forEach(g => {
    const card = document.createElement('div');
    card.className = 'gelegenheid-card' + (gelegenheid === g.id ? ' selected' : '');
    card.innerHTML = `
      <div>
        <div class="gelegenheid-icon"><i class="ti ${g.icon}"></i></div>
        <div class="gelegenheid-name">${g.naam}</div>
        <div class="gelegenheid-desc">${g.desc}</div>
      </div>`;
    card.onclick = () => {
      gelegenheid = g.id;
      const beschikbare = BESTEL_OPTIES.filter(o => (o.geschiktVoor || []).includes(g.id)).map(o => o.id);
      if (!bestelOptie || !beschikbare.includes(bestelOptie)) {
        bestelOptie = standaardBestelOptieVoorGelegenheid(g.id);
        aantallen = getDefaultAantallenForOptie(getBestelOptie());
      }
      actieveKled = getActieveKledingstukken()[0] || 'Jas';
      actieveStap = 0;
      renderGelegenheden();
      renderBestelOpties();
    };
    grid.appendChild(card);
  });
  renderBestelOpties();
}

function standaardBestelOptieVoorGelegenheid(id){
  if (id === 'black_tie') return 'smoking';
  if (id === 'los_kledingstuk') return 'los_jasje';
  return 'tweedelig';
}

function getDefaultAantallenForOptie(optie){
  const basis = { Jas: 0, Broek: 0, Gilet: 0 };
  if (!optie) return { Jas: 1, Broek: 1, Gilet: 0 };
  (optie.kledingstukken || []).forEach(k => { basis[k] = Math.max(1, basis[k] || 0); });
  (optie.extraItems || []).forEach(k => { basis[k] = (basis[k] || 0) + 1; });
  if (optie.id === 'extra_bestaande_order') basis[extraItemType || 'Broek'] = 1;
  return basis;
}

function aantalLabel(k){
  if (k === 'Jas') return 'jas / jasje';
  if (k === 'Broek') return 'broek';
  if (k === 'Gilet') return 'gilet';
  return k.toLowerCase();
}

function setAantalKledingstuk(k, value){
  const optie = getBestelOptie();
  const min = (optie && (optie.kledingstukken || []).includes(k)) ? 1 : 0;
  const n = Math.max(min, Math.min(9, parseInt(value, 10) || min));
  aantallen[k] = n;
  renderAantallen();
  renderSummaryPanel();
}

function renderAantallen(){
  // Aantallen bewust niet meer op de eerste startpagina tonen.
  // Ze verschijnen pas in de configurator zelf, in de zijbalk naast de stijlkeuzes.
  const box = document.getElementById('sidebarAantallenBox');
  if (!box) return;
  const optie = getBestelOptie();
  if (!gelegenheid || !optie) {
    box.className = 'aantal-box side-aantal-box';
    box.innerHTML = '';
    return;
  }
  const stukken = getActieveKledingstukken();
  box.className = 'aantal-box side-aantal-box active';
  box.innerHTML = `<div class="filter-title">Aantallen</div>
    <div class="filter-sub">Pas hier aantallen aan, bijvoorbeeld een extra broek of extra gilet.</div>
    <div class="aantal-grid">${stukken.map(k => {
      const min = (optie.kledingstukken || []).includes(k) ? 1 : 0;
      return `<div class="aantal-card">
        <div>
          <div class="aantal-name">${aantalLabel(k)}</div>
          <div class="aantal-desc">Wordt meegenomen in de aanvraag en technische export.</div>
        </div>
        <input class="aantal-input" type="number" min="${min}" max="9" step="1" value="${aantallen[k] || min}" onchange="setAantalKledingstuk('${k}', this.value)">
      </div>`;
    }).join('')}</div>`;
}

function getBeschikbareBestelOpties(){
  if (!gelegenheid) return [];
  return BESTEL_OPTIES.filter(o => (o.geschiktVoor || []).includes(gelegenheid));
}

function getBestelOptie(){
  return BESTEL_OPTIES.find(o => o.id === bestelOptie) || null;
}

function getActieveKledingstukken(){
  const optie = getBestelOptie();
  if (!optie) return ['Jas','Broek'];
  if (optie.id === 'extra_bestaande_order') return [extraItemType || 'Broek'];
  return optie.kledingstukken || ['Jas','Broek'];
}

function renderBestelOpties(){
  const section = document.getElementById('bestelSection');
  const grid = document.getElementById('bestelGrid');
  if (!section || !grid) return;
  if (!gelegenheid) {
    section.classList.remove('active');
    grid.innerHTML = '';
    return;
  }
  section.classList.add('active');
  const opties = getBeschikbareBestelOpties();
  grid.innerHTML = opties.map(o => `
    <div class="bestel-card ${bestelOptie===o.id?'selected':''}" onclick="selectBestelOptie('${o.id}')">
      <div class="bestel-icon"><i class="ti ${o.icon}"></i></div>
      <div class="bestel-name">${o.naam}</div>
      <div class="bestel-desc">${o.desc}</div>
    </div>
  `).join('');
  const prevBox = document.getElementById('prevOrderBox');
  if (prevBox) prevBox.className = 'prev-order-box' + (getBestelOptie()?.vereistVorigeOrder ? ' active' : '');
  renderVorigeOrderResult();
  renderAantallen();
}

function selectBestelOptie(id){
  bestelOptie = id;
  const optie = getBestelOptie();
  if (optie && optie.id !== 'extra_bestaande_order') {
    vorigeOrderMatch = null;
    vorigeOrdernummer = '';
  }
  aantallen = getDefaultAantallenForOptie(optie);
  actieveKled = getActieveKledingstukken()[0] || 'Jas';
  actieveStap = 0;
  renderBestelOpties();
}

function setExtraItemType(type){
  extraItemType = type;
  aantallen = getDefaultAantallenForOptie(getBestelOptie());
  actieveKled = type;
  actieveStap = 0;
  ['Broek','Jas','Gilet'].forEach(t => {
    const el = document.getElementById('extra'+t+'Btn');
    if (el) el.className = 'chip' + (t===type ? ' active' : '');
  });
  renderVorigeOrderResult();
  renderAantallen();
}

function escapeHtml(value){
  return String(value == null ? '' : value)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&#39;');
}

function jsonpLookupVorigeOrder(ordernummer, code){
  return new Promise((resolve, reject) => {
    if (!ORDER_LOOKUP_WEBHOOK) {
      reject(new Error('Geen lookup-webhook ingesteld.'));
      return;
    }
    const callbackName = 'deoostLookup_' + Date.now() + '_' + Math.random().toString(36).slice(2);
    const script = document.createElement('script');
    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error('Lookup duurde te lang. Probeer opnieuw of kies de stof handmatig.'));
    }, 12000);
    function cleanup(){
      clearTimeout(timeout);
      if (script.parentNode) script.parentNode.removeChild(script);
      try { delete window[callbackName]; } catch(e) { window[callbackName] = undefined; }
    }
    window[callbackName] = data => {
      cleanup();
      resolve(data || {});
    };
    const params = new URLSearchParams({
      action: 'lookupStof',
      ordernummer: ordernummer || '',
      code: code || '',
      callback: callbackName
    });
    script.onerror = () => {
      cleanup();
      reject(new Error('Lookup kon niet geladen worden. Controleer de webhook-deployment.'));
    };
    script.src = ORDER_LOOKUP_WEBHOOK + '?' + params.toString();
    document.head.appendChild(script);
  });
}

async function zoekVorigeOrder(){
  const input = document.getElementById('prevOrderInput');
  const codeInput = document.getElementById('prevOrderCodeInput');
  vorigeOrdernummer = (input ? input.value : vorigeOrdernummer).trim();
  vorigeOrderCode = (codeInput ? codeInput.value : vorigeOrderCode).trim();
  vorigeOrderMatch = null;
  vorigeOrderLookupFout = '';
  if (!vorigeOrdernummer && !vorigeOrderCode) {
    vorigeOrderLookupFout = 'Vul een vorig ordernummer en/of stof-/controlecode in.';
    renderVorigeOrderResult();
    return;
  }
  vorigeOrderLookupBezig = true;
  renderVorigeOrderResult();
  try {
    let data = getDemoVorigeOrder(vorigeOrdernummer, vorigeOrderCode);
    if (!data) data = await jsonpLookupVorigeOrder(vorigeOrdernummer, vorigeOrderCode);
    if (!data.ok) throw new Error(data.error || 'Geen stof gevonden.');
    // Alleen veilige stofgegevens worden opgeslagen. Geen klantnaam, e-mail, adres of maten.
    vorigeOrderMatch = {
      ordernummer: data.ordernummer || vorigeOrdernummer || '',
      kledingstuk: data.kledingstuk || '',
      stofnummer: data.stofnummer || '',
      stofId: data.stofId || '',
      leverancier: data.leverancier || '',
      bunch: data.bunch || '',
      bron: 'server_lookup'
    };
    const stof = getStofBijBestelling(vorigeOrderMatch);
    if (stof) {
      materiaalKeuzes.hoofdStof = stof.id;
      materiaalKeuzes.jasStof = stof.id;
      materiaalKeuzes.broekStof = stof.id;
      materiaalKeuzes.giletStof = stof.id;
    }
  } catch(err) {
    vorigeOrderLookupFout = err.message || String(err);
    vorigeOrderMatch = null;
  } finally {
    vorigeOrderLookupBezig = false;
    renderVorigeOrderResult();
  }
}

function getStofBijBestelling(order){
  if (!order) return null;
  return STOFFEN.find(s =>
    (order.stofId && s.id === order.stofId) ||
    (order.stofnummer && String(s.stofnummer || '').toLowerCase() === String(order.stofnummer).toLowerCase())
  ) || null;
}

function renderVorigeOrderResult(){
  const result = document.getElementById('prevOrderResult');
  if (!result) return;
  if (!getBestelOptie()?.vereistVorigeOrder) {
    result.innerHTML = '';
    return;
  }
  if (vorigeOrderLookupBezig) {
    result.innerHTML = '<div class="inline-note">Stof wordt opgehaald...</div>';
    return;
  }
  if (vorigeOrderLookupFout) {
    result.innerHTML = `<div class="inline-note">${escapeHtml(vorigeOrderLookupFout)} U kunt ook handmatig een stof kiezen.</div>`;
    return;
  }
  if (!vorigeOrdernummer && !vorigeOrderCode && !vorigeOrderMatch) {
    result.innerHTML = '<div class="inline-note">Nog geen vorige order gekoppeld. U kunt ook doorgaan en de stof later handmatig kiezen.</div>';
    return;
  }
  if (!vorigeOrderMatch) {
    result.innerHTML = '<div class="inline-note">Nog geen stof gevonden. Gebruik “Zoek stof” of kies de stof handmatig.</div>';
    return;
  }
  const stof = getStofBijBestelling(vorigeOrderMatch);
  if (!stof) {
    result.innerHTML = `<div class="inline-note">De lookup vond een stofreferentie, maar deze staat nog niet in <code>stoffen.js</code>. Gevonden stofId: <code>${escapeHtml(vorigeOrderMatch.stofId || '')}</code>, stofnummer: <code>${escapeHtml(vorigeOrderMatch.stofnummer || '')}</code>.</div>`;
    return;
  }
  const img = stof.swatch || stof.closeup || '';
  result.innerHTML = `
    <div class="prev-order-card">
      <div class="prev-order-img">${img ? `<img src="${img}" alt="${stof.naam}" onerror="this.style.display='none'">` : ''}</div>
      <div class="prev-order-info">
        <div class="prev-order-title">${stof.naam}</div>
        <div class="prev-order-meta">
          Vorige order: ${escapeHtml(vorigeOrderMatch.ordernummer || '—')}<br>
          ${stof.merk || stof.leverancier || ''} · ${stof.bunch || vorigeOrderMatch.bunch || ''} · ${stof.stofnummer || vorigeOrderMatch.stofnummer || ''}<br>
          ${stof.materiaal ? stof.materiaal.join('/') : ''} · ${stof.weving || ''} · ${stof.patroon || ''} · ${stof.kleur || ''}
        </div>
        <div class="prev-order-actions">
          <button class="info-link" onclick="openStofInfo('${stof.id}',event)"><i class="ti ti-info-circle"></i> Stofinformatie</button>
          <button class="info-link" onclick="selectStof('${stof.id}')"><i class="ti ti-check"></i> Gebruik deze stof</button>
        </div>
      </div>
    </div>`;
}



function getGelegenheid() {
  return GELEGENHEDEN.find(g => g.id === gelegenheid) || null;
}

function startConfiguratie() {
  if (!gelegenheid) {
    showNotice('De Oost Bespoke','Kies eerst een type kleding of gelegenheid.');
    return;
  }
  if (!bestelOptie) {
    showNotice('De Oost Bespoke','Kies eerst wat u wilt bestellen.');
    return;
  }
  actieveKled = getActieveKledingstukken()[0] || 'Jas';
  actieveStap = 0;
  document.getElementById('startScreen').style.display = 'none';
  document.getElementById('mainConfig').style.display = 'block';
  render();
}

function terugNaarStart() {
  document.getElementById('finalSummary').style.display = 'none';
  document.getElementById('materialConfig').style.display = 'none';
  document.getElementById('finishingConfig').style.display = 'none';
  document.getElementById('finalReview').style.display = 'none';
  document.getElementById('mainConfig').style.display = 'none';
  document.getElementById('startScreen').style.display = 'block';
  renderGelegenheden();
}

function huidigeStappen() {
  return (STAPPEN[actieveKled] || []).filter(s => s.id !== 'jas_constructie');
}

function huidigeStap() {
  return huidigeStappen()[actieveStap];
}

function getOpties(stap) {
  if (typeof stap.opties === 'function') return stap.opties(keuzes);
  return stap.opties;
}

function renderKledTabs() {
  const tabs = document.getElementById('kledTabs');
  tabs.innerHTML = '';
  getActieveKledingstukken().forEach(k => {
    const t = document.createElement('div');
    t.className = 'kled-tab' + (k === actieveKled ? ' active' : '');
    t.textContent = k;
    t.onclick = () => { actieveKled = k; actieveStap = 0; render(); };
    tabs.appendChild(t);
  });
}

function renderNav() {
  const nav = document.getElementById('navList');
  nav.innerHTML = '';
  huidigeStappen().forEach((stap, i) => {
    const heeftKeuze = keuzes[stap.id];
    const li = document.createElement('li');
    li.className = 'nav-item' + (i === actieveStap ? ' active' : '') + (heeftKeuze ? ' done' : '');
    li.innerHTML = `
      <i class="ti ${stap.icon} nav-icon"></i>
      <span class="nav-label">${stap.label}${!stap.verplicht ? ' <span style="opacity:.6;font-size:10px">(opt.)</span>' : ''}</span>
      <div class="nav-check"><i class="ti ti-check" style="font-size:9px;color:white"></i></div>`;
    li.onclick = () => { actieveStap = i; renderStep(); renderNav(); updateProgress(); };
    nav.appendChild(li);
  });
}

function renderSummaryPanel() {
  const list = document.getElementById('summaryList');
  const stappen = huidigeStappen();
  const items = stappen.filter(s => keuzes[s.id]);
  const g = getGelegenheid();
  if (!items.length && !g) {
    list.innerHTML = '<span class="summary-empty">Nog geen keuzes gemaakt</span>';
    return;
  }
  let html = '';
  if (g) {
    html += `<div class="summary-item">
      <div class="summary-thumb" style="display:flex;align-items:center;justify-content:center"><i class="ti ${g.icon}" style="font-size:18px;color:#8B6F47"></i></div>
      <div class="summary-text">
        <div class="summary-cat">Type kleding</div>
        <div class="summary-val">${g.naam}</div>
      </div>
    </div>`;
  }
  const bo = getBestelOptie();
  if (bo) {
    html += `<div class="summary-item">
      <div class="summary-thumb" style="display:flex;align-items:center;justify-content:center"><i class="ti ${bo.icon}" style="font-size:18px;color:#8B6F47"></i></div>
      <div class="summary-text">
        <div class="summary-cat">Bestelling</div>
        <div class="summary-val">${bo.id === 'extra_bestaande_order' ? bo.naam + ' — ' + extraItemType : bo.naam}</div>
      </div>
    </div>`;
  }
  if (vorigeOrderMatch) {
    html += `<div class="summary-item">
      <div class="summary-thumb" style="display:flex;align-items:center;justify-content:center"><i class="ti ti-history" style="font-size:18px;color:#8B6F47"></i></div>
      <div class="summary-text">
        <div class="summary-cat">Vorige order</div>
        <div class="summary-val">${vorigeOrderMatch.ordernummer}</div>
      </div>
    </div>`;
  }
  html += items.map(s => {
    const opties = getOpties(s);
    const opt = opties.find(o => o.id === keuzes[s.id]);
    if (!opt) return '';
    return `<div class="summary-item">
      <div class="summary-thumb"><img src="${IMG}${opt.img}" alt="${opt.naam}" onerror="this.style.display='none'"></div>
      <div class="summary-text">
        <div class="summary-cat">${s.label}</div>
        <div class="summary-val">${opt.naam}</div>
      </div>
    </div>`;
  }).join('');
  list.innerHTML = html;
}

function renderStep() {
  const stap = huidigeStap();
  if (!stap) return;
  const opties = getOpties(stap);
  const content = document.getElementById('stepContent');
  const g = getGelegenheid();
  content.innerHTML = `
    ${g ? `<div class="gelegenheid-badge"><i class="ti ${g.icon}" style="font-size:13px"></i>${g.naam}</div>` : ''}
    <div class="step-header">
      <div class="step-title">${stap.label} ${!stap.verplicht ? '<span class="step-optional">Optioneel</span>' : ''}</div>
    </div>
    <div class="opt-grid" id="optGrid"></div>
    <div class="step-nav">
      <button class="btn btn-ghost" onclick="prevStap()" ${actieveStap === 0 ? 'style="visibility:hidden"' : ''}>← Vorige</button>
      <div style="display:flex;gap:8px;align-items:center;">
        ${!stap.verplicht ? `<button class="btn-skip" onclick="slaOver()">Overslaan</button>` : ''}
        ${actieveStap < huidigeStappen().length - 1 ?
          `<button class="btn btn-primary" onclick="volgendeStap()">Volgende →</button>` :
          `<button class="btn btn-accent" onclick="toonSamenvatting()">Samenvatting bekijken →</button>`
        }
      </div>
    </div>`;

  const grid = document.getElementById('optGrid');
  opties.forEach(opt => {
    const c = document.createElement('div');
    c.className = 'opt-card' + (keuzes[stap.id] === opt.id ? ' selected' : '');
    c.innerHTML = `
      <div class="opt-img">
        <img src="${IMG}${opt.img}" alt="${opt.naam}" onerror="this.style.display='none'">
        <button class="opt-zoom" onclick="openLb('${IMG}${opt.img}','${opt.naam}',event)" title="Vergroot">
          <i class="ti ti-zoom-in"></i>
        </button>
      </div>
      <div class="opt-info">
        <div class="opt-name">${opt.naam}</div>
        ${opt.desc ? `<div class="opt-desc">${opt.desc}</div>` : ''}
      </div>`;
    c.onclick = () => {
      keuzes[stap.id] = opt.id;
      grid.querySelectorAll('.opt-card').forEach(x => x.classList.remove('selected'));
      c.classList.add('selected');
      renderNav();
      renderSummaryPanel();
    };
    grid.appendChild(c);
  });
}

function updateProgress() {
  const stappen = huidigeStappen();
  const pct = stappen.length ? ((actieveStap + 1) / stappen.length * 100) : 0;
  document.getElementById('progressFill').style.width = pct + '%';
}

function volgendeStap() {
  const stap = huidigeStap();
  if (stap && stap.verplicht && !keuzes[stap.id]) {
    showNotice('De Oost Bespoke','Maak eerst een keuze voor “' + stap.label + '” voordat u verder gaat.');
    return;
  }
  if (actieveStap < huidigeStappen().length - 1) {
    actieveStap++;
    render();
  }
}

function prevStap() {
  if (actieveStap > 0) { actieveStap--; render(); }
}

function slaOver() {
  delete keuzes[huidigeStap().id];
  volgendeStap();
}


function renderAantalRegel(){
  const stukken = getActieveKledingstukken();
  if (!stukken.length) return '';
  const txt = stukken.map(k => `${k}: ${aantallen[k] || 1}`).join(' · ');
  return `<div style="font-size:11px;color:#6b6560;line-height:1.5;margin-top:4px">Aantallen: ${txt}</div>${vorigeOrderMatch ? `<div style="font-size:11px;color:#6b6560;line-height:1.5;margin-top:4px">Vorige order: ${vorigeOrderMatch.ordernummer}</div>` : ''}`;
}

function toonSamenvatting() {
  document.getElementById('mainConfig').style.display = 'none';
  const fin = document.getElementById('finalSummary');
  fin.style.display = 'block';
  const content = document.getElementById('finalContent');

  let html = '';
  const g = getGelegenheid();
  if (g) {
    html += `<div class="sum-kled-block"><div class="sum-kled-title">Type kleding / gelegenheid</div>
      <div class="sum-card" style="max-width:320px">
        <div class="sum-card-info" style="padding:12px">
          <div class="sum-card-cat">Gekozen route</div>
          <div class="sum-card-val">${g.naam}</div>
          <div style="font-size:11px;color:#6b6560;line-height:1.5;margin-top:4px">${g.desc}</div>
        </div>
      </div>
    </div>`;
  }
  const bo = getBestelOptie();
  if (bo) {
    html += `<div class="sum-kled-block"><div class="sum-kled-title">Wat wilt u bestellen?</div>
      <div class="sum-card" style="max-width:320px">
        <div class="sum-card-info" style="padding:12px">
          <div class="sum-card-cat">Bestelling</div>
          <div class="sum-card-val">${bo.id === 'extra_bestaande_order' ? bo.naam + ' — ' + extraItemType : bo.naam}</div>
          <div style="font-size:11px;color:#6b6560;line-height:1.5;margin-top:4px">${bo.desc}</div>
          ${renderAantalRegel()}
        </div>
      </div>
    </div>`;
  }
  getActieveKledingstukken().forEach(kled => {
    const stappen = STAPPEN[kled];
    const items = stappen.filter(s => keuzes[s.id]);
    if (!items.length) return;
    html += `<div class="sum-kled-block"><div class="sum-kled-title">${kled}</div><div class="sum-grid">`;
    items.forEach(s => {
      const opties = typeof s.opties === 'function' ? s.opties(keuzes) : s.opties;
      const opt = opties.find(o => o.id === keuzes[s.id]);
      if (!opt) return;
      html += `<div class="sum-card">
        <div class="sum-card-img"><img src="${IMG}${opt.img}" alt="${opt.naam}" style="width:100%;height:100%;object-fit:contain;padding:4px" onerror="this.style.display='none'"></div>
        <div class="sum-card-info">
          <div class="sum-card-cat">${s.label}</div>
          <div class="sum-card-val">${opt.naam}</div>
        </div>
      </div>`;
    });
    html += '</div></div>';
  });
  content.innerHTML = html || '<p style="color:#6b6560;font-size:13px">Nog geen keuzes gemaakt.</p>';
}

function getSamenvatting() {
  const result = {};
  const g = getGelegenheid();
  if (g) {
    result.gelegenheid = {
      id: g.id,
      naam: g.naam,
      desc: g.desc
    };
  }
  const bo = getBestelOptie();
  if (bo) {
    result.bestelling = {
      id: bo.id,
      naam: bo.naam,
      desc: bo.desc,
      kledingstukken: getActieveKledingstukken(),
      extraItems: bo.extraItems || [],
      extraItemType: bo.id === 'extra_bestaande_order' ? extraItemType : null,
      blackTieType: bo.blackTieType || null,
      aantallen: Object.fromEntries(getActieveKledingstukken().map(k => [k, aantallen[k] || 1]))
    };
  }
  if (vorigeOrderMatch) {
    result.vorigeOrder = {
      ordernummer: vorigeOrderMatch.ordernummer,
      kledingstuk: vorigeOrderMatch.kledingstuk || '',
      stofnummer: vorigeOrderMatch.stofnummer || '',
      stofId: vorigeOrderMatch.stofId || ''
    };
  }
  result.materialen = {
    hoofdStof: materiaalKeuzes.hoofdStof,
    jasStof: materiaalKeuzes.jasStof,
    broekStof: materiaalKeuzes.broekStof,
    giletStof: materiaalKeuzes.giletStof,
    toonAlleStoffen: materiaalToonAlleStoffen,
    avondAfwerking: getGelegenheid() && getGelegenheid().id === 'black_tie' ? avondAfwerking : null,
    afwerking: {...afwerkingKeuzes}
  };
  if (typeof maatKeuzes !== 'undefined') result.maten = JSON.parse(JSON.stringify(maatKeuzes));
  if (typeof klantGegevens !== 'undefined') result.klant = JSON.parse(JSON.stringify(klantGegevens));
  getActieveKledingstukken().forEach(kled => {
    STAPPEN[kled].forEach(s => {
      if (keuzes[s.id]) result[s.id] = keuzes[s.id];
    });
  });
  return JSON.stringify(result);
}

function openLb(src, caption, e) {
  e.stopPropagation();
  document.getElementById('lbImg').src = src;
  document.getElementById('lbCaption').textContent = caption;
  document.getElementById('lb').style.display = 'flex';
}


/* =========================
   STOF / MATERIAAL OPZET
========================= */
const STOFFEN_IMG = '';

const STOFBOEKEN = (window.DEOST_STOFBOEKEN || []).filter(b => b.actief !== false);
const STOFBOEK_MAP = new Map(STOFBOEKEN.map(boek => [boek.id, boek]));

function verrijkStofMetBoek(stof){
  const boek = stof && stof.boekId ? STOFBOEK_MAP.get(stof.boekId) : null;
  if (!boek) return {...stof, stofboek:null};

  const defaults = {
    leverancier: boek.leverancier,
    bunch: boek.naam,
    materiaal: boek.materiaal,
    samenstelling: boek.samenstelling,
    gewicht: boek.gewicht,
    weving: boek.weving || boek.type,
    seizoen: boek.seizoen,
    uitstraling: boek.uitstraling,
    korteUitleg: boek.korteUitleg,
    advies: boek.advies,
    minderGeschiktVoor: boek.minderGeschiktVoor
  };

  return {...defaults, ...stof, stofboek:boek};
}

const STOFFEN = (window.DEOST_STOFFEN || []).map(verrijkStofMetBoek).filter(s => s.actief !== false);
const VOERINGEN = (window.DEOST_VOERINGEN || []).filter(v => v.actief !== false);
const KNOPEN = (window.DEOST_KNOPEN || []).filter(k => k.actief !== false);
const PRIJZEN = window.DEOST_PRIJZEN || {};
const URL_PARAMS = new URLSearchParams(window.location.search);
const INIT_STOF_ID = URL_PARAMS.get('stof') || '';
const INIT_STOF_COMBO = {
  jasStof: URL_PARAMS.get('jasStof') || '',
  broekStof: URL_PARAMS.get('broekStof') || '',
  giletStof: URL_PARAMS.get('giletStof') || ''
};
let initStofApplied = false;


let materiaalMode = 'help';
let materiaalFilters = {
  gebruik:'geen_voorkeur', uitstraling:'geen_voorkeur', kleur:'geen_voorkeur',
  materiaal:'geen_voorkeur', weving:'geen_voorkeur', patroon:'geen_voorkeur'
};
let materiaalKeuzes = { hoofdStof:null, jasStof:null, broekStof:null, giletStof:null };
let actieveMateriaalDoel = 'hoofdStof';
let materiaalToonAlleStoffen = false;
let bibliotheekOpen = false;
let bibliotheekToonAlle = false;
let bibliotheekZoek = '';

const AVOND_AFWERKING_OPTIES = [
  ['zwart_satijn','Zwart satijn'],
  ['gekleurd_satijn','Gekleurd satijn'],
  ['zwart_grosgrain','Zwart grosgrain'],
  ['stof_in_stof','Stof-in-stof']
];
let avondAfwerking = {
  revers:'zwart_satijn',
  paspelzakken:'zwart_satijn',
  gestoffeerdeKnopen:'zwart_satijn',
  broekbiezen:'zwart_satijn'
};


function pasInitStofToeIndienAanwezig(){
  if (initStofApplied) return;
  let toegepast = false;

  if (INIT_STOF_ID) {
    const stof = getStof(INIT_STOF_ID);
    if (stof) {
      materiaalKeuzes.hoofdStof = stof.id;
      materiaalKeuzes.jasStof = stof.id;
      materiaalKeuzes.broekStof = stof.id;
      materiaalKeuzes.giletStof = stof.id;
      toegepast = true;
    }
  }

  ['jasStof','broekStof','giletStof'].forEach(key => {
    const id = INIT_STOF_COMBO[key];
    const stof = id ? getStof(id) : null;
    if (stof) {
      materiaalKeuzes[key] = stof.id;
      toegepast = true;
    }
  });

  if (!materiaalKeuzes.hoofdStof) {
    materiaalKeuzes.hoofdStof = materiaalKeuzes.jasStof || materiaalKeuzes.broekStof || materiaalKeuzes.giletStof || null;
  }

  initStofApplied = toegepast;
}

function getDemoVorigeOrder(ordernummer, code){
  const o = String(ordernummer || '').trim().toUpperCase();
  const c = String(code || '').trim().toUpperCase();
  if ((o === 'MOCK-ORDER-001' || o === 'DEMO-ORDER-001') && (c === 'MOCK' || c === 'DEMO' || c === 'REF-MOCK-NAVY-HOPSACK')) {
    return {
      ok: true,
      ordernummer: o,
      kledingstuk: extraItemType || 'Broek',
      stofnummer: 'MOCK-001',
      stofId: 'MOCK-NAVY-HOPSACK',
      leverancier: 'De Oost Mock Library',
      bunch: 'Demo Suiting'
    };
  }
  return null;
}

function toonMateriaalKeuze(){
  document.getElementById('startScreen').style.display = 'none';
  document.getElementById('mainConfig').style.display = 'none';
  document.getElementById('finalSummary').style.display = 'none';
  document.getElementById('finishingConfig').style.display = 'none';
  document.getElementById('finalReview').style.display = 'none';
  document.getElementById('materialConfig').style.display = 'block';
  bepaalMateriaalDoel();
  pasInitStofToeIndienAanwezig();
  renderMateriaalKeuze();
}

function bepaalMateriaalDoel(){
  const g = getGelegenheid();
  const targets = getMateriaalDoelen();
  if (!g || g.id !== 'tenue_de_ville') {
    actieveMateriaalDoel = 'hoofdStof';
    return;
  }
  actieveMateriaalDoel = targets.find(t => !materiaalKeuzes[t]) || targets[0] || 'hoofdStof';
}

function getMateriaalDoelen(){
  const actieve = getActieveKledingstukken();
  const map = {Jas:'jasStof', Broek:'broekStof', Gilet:'giletStof'};
  return actieve.map(k => map[k]).filter(Boolean);
}

function doelLabel(doel){
  return {hoofdStof:'Hoofdstof',jasStof:'Jasstof',broekStof:'Broekstof',giletStof:'Giletstof'}[doel] || 'Stof';
}

function getStof(id){ return STOFFEN.find(s => s.id === id); }

function renderMateriaalKeuze(){
  const g = getGelegenheid();
  const content = document.getElementById('materialContent');
  content.innerHTML = `
    <div class="gelegenheid-badge"><i class="ti ${(g&&g.icon)||'ti-shirt'}"></i>${g ? g.naam : 'Geen gelegenheid gekozen'}</div>
    <div class="material-selection-panel">
      <div class="material-selection-title">Huidige materiaalkeuze</div>
      ${renderMateriaalSelectieTekst()}
    </div>
    <div class="material-mode-grid">
      <div class="material-mode ${materiaalMode==='help'?'active':''}" onclick="materiaalMode='help';renderMateriaalKeuze()">
        <div class="material-mode-icon"><i class="ti ti-sparkles"></i></div>
        <div class="material-mode-title">Help mij kiezen</div>
        <div class="material-mode-desc">Beantwoord eenvoudige vragen over gebruik, uitstraling en kleur. Wij tonen passende stoffen.</div>
      </div>
      <div class="material-mode ${materiaalMode==='browse'?'active':''}" onclick="materiaalMode='browse';renderMateriaalKeuze()">
        <div class="material-mode-icon"><i class="ti ti-adjustments"></i></div>
        <div class="material-mode-title">Zelf bladeren</div>
        <div class="material-mode-desc">Filter zelf op materiaalsoort, weving, patroon en kleur.</div>
      </div>
    </div>
    ${renderAvondAfwerking()}
    ${renderStoffenBibliotheekCTA()}
    ${materiaalMode==='help' ? renderHelpFilters() : renderBrowseFilters()}
    ${renderStofResultaten()}
  `;
}

function renderMateriaalSelectieTekst(){
  const g = getGelegenheid();
  const bo = getBestelOptie();
  let html = '';
  if (vorigeOrderMatch) {
    const stof = getStofBijBestelling(vorigeOrderMatch);
    html += `<div class="material-selection-row"><span>Vorige order:</span> ${vorigeOrderMatch.ordernummer}${stof ? ' — '+stof.naam+' ('+stof.stofnummer+')' : ''}</div>`;
  }
  if (g && g.id === 'tenue_de_ville') {
    const targets = getMateriaalDoelen();
    html += targets.map(k => {
      const stof = getStof(materiaalKeuzes[k]);
      return `<div class="material-selection-row"><span>${doelLabel(k)}:</span> ${stof ? stof.naam + ' (' + stof.stofnummer + ')' : 'nog niet gekozen'}</div>`;
    }).join('') + renderDoelKnoppen(targets);
    return html;
  }
  const stof = getStof(materiaalKeuzes.hoofdStof);
  let label = 'Hoofdstof';
  if (bo && bo.id === 'extra_bestaande_order') label = 'Stof voor '+extraItemType.toLowerCase();
  else if (bo && getActieveKledingstukken().length === 1) label = 'Stof voor '+getActieveKledingstukken()[0].toLowerCase();
  else if (g && g.id === 'black_tie') label = 'Avondstof';
  else label = 'Stof voor de geselecteerde kledingstukken';
  html += `<div class="material-selection-row"><span>${label}:</span> ${stof ? stof.naam + ' (' + stof.stofnummer + ')' : 'nog niet gekozen'}</div>`;
  if (g && g.id === 'black_tie') {
    html += `<div class="material-selection-row"><span>Avondafwerking:</span> revers ${avondLabel(avondAfwerking.revers)}, paspelzakken ${avondLabel(avondAfwerking.paspelzakken)}, knopen ${avondLabel(avondAfwerking.gestoffeerdeKnopen)}, broekbiezen ${avondLabel(avondAfwerking.broekbiezen)}</div>`;
  }
  return html;
}

function renderDoelKnoppen(doelen){
  return `<div class="chip-row" style="margin-top:8px">${doelen.map(d=>`<button class="chip ${actieveMateriaalDoel===d?'active':''}" onclick="actieveMateriaalDoel='${d}';renderMateriaalKeuze()">${doelLabel(d)}</button>`).join('')}<button class="chip" onclick="openStoffenBibliotheek(actieveMateriaalDoel)">Open bibliotheek voor ${doelLabel(actieveMateriaalDoel)}</button></div>`;
}


function avondLabel(id){
  const opt = AVOND_AFWERKING_OPTIES.find(o => o[0] === id);
  return opt ? opt[1] : id;
}

function setAvondAfwerking(key,val){
  avondAfwerking[key] = val;
  renderMateriaalKeuze();
}

function renderAvondAfwerking(){
  const g = getGelegenheid();
  if (!g || g.id !== 'black_tie') return '';
  const rows = [
    ['revers','Revers'],
    ['paspelzakken','Biezen van paspelzakken'],
    ['gestoffeerdeKnopen','Gestoffeerde knopen'],
    ['broekbiezen','Biezen op de broek']
  ];
  return `<div class="filter-section">
    <div class="filter-title">Avondafwerking</div>
    <div class="filter-sub">Kies per onderdeel de afwerking. Bij stof-in-stof kan de klant daarna een stof uit de stoffenbibliotheek kiezen.</div>
    ${rows.map(([key,label]) => `<div class="filter-row"><div class="filter-label">${label}</div><div class="chip-row">${AVOND_AFWERKING_OPTIES.map(([id,naam]) => `<button class="chip ${avondAfwerking[key]===id?'active':''}" onclick="setAvondAfwerking('${key}','${id}')">${naam}</button>`).join('')}</div></div>`).join('')}
  </div>`;
}

function renderStoffenBibliotheekCTA(){
  const g = getGelegenheid();
  const context = g ? g.naam : 'deze bestelling';
  return `<div class="library-cta">
    <div>
      <div class="library-cta-title">Stoffenbibliotheek</div>
      <div class="library-cta-text">Open een groter venster om rustig te zoeken, te filteren en desgewenst alle stoffen te tonen. Standaard tonen we aanbevolen stoffen voor ${context}.</div>
    </div>
    <div class="library-cta-actions">
      <button class="btn btn-primary" onclick="openStoffenBibliotheek()"><i class="ti ti-layout-grid"></i> Open stoffenbibliotheek</button>
      <button class="btn btn-ghost" onclick="materiaalToonAlleStoffen=!materiaalToonAlleStoffen;renderMateriaalKeuze()">${materiaalToonAlleStoffen ? 'Toon aanbevolen' : 'Toon alle stoffen'}</button>
    </div>
  </div>`;
}

function openStoffenBibliotheek(doel){
  if (doel) actieveMateriaalDoel = doel;
  bibliotheekOpen = true;
  bibliotheekToonAlle = materiaalToonAlleStoffen;
  const modal = document.getElementById('stoffenBibliotheekModal');
  if (modal) modal.style.display = 'flex';
  const search = document.getElementById('stoffenBibliotheekZoek');
  if (search) search.value = bibliotheekZoek || '';
  renderStoffenBibliotheek();
}

function closeStoffenBibliotheek(){
  bibliotheekOpen = false;
  const modal = document.getElementById('stoffenBibliotheekModal');
  if (modal) modal.style.display = 'none';
}

function renderStoffenBibliotheek(){
  const filters = document.getElementById('stoffenBibliotheekFilters');
  const results = document.getElementById('stoffenBibliotheekResults');
  const sub = document.getElementById('stoffenBibliotheekSub');
  if (!filters || !results) return;
  const g = getGelegenheid();
  if (sub) sub.textContent = `${bibliotheekToonAlle ? 'Alle stoffen' : 'Aanbevolen stoffen'} — selectie voor ${doelLabel(actieveMateriaalDoel)}${g ? ' bij '+g.naam : ''}.`;
  const a = document.getElementById('bibAanbevolenBtn');
  const b = document.getElementById('bibAlleBtn');
  if (a) a.className = 'chip' + (!bibliotheekToonAlle ? ' active' : '');
  if (b) b.className = 'chip' + (bibliotheekToonAlle ? ' active' : '');
  filters.innerHTML = `${materiaalMode==='help' ? renderHelpFilters() : renderBrowseFilters()}`;
  const stoffen = getGefilterdeStoffen({toonAlle:bibliotheekToonAlle, zoek:bibliotheekZoek});
  results.innerHTML = `<div class="fabric-library-results-head"><div><div class="fabric-library-results-title">${bibliotheekToonAlle ? 'Alle stoffen' : 'Aanbevolen stoffen'}</div><div class="fabric-library-results-count">${stoffen.length} resultaat${stoffen.length===1?'':'en'} — klik op een stof om te selecteren</div></div><button class="btn btn-ghost" onclick="resetMateriaalFilters();renderStoffenBibliotheek()">Filters wissen</button></div><div class="fabric-grid">${stoffen.map(renderStofCard).join('') || '<p class="summary-empty">Geen stoffen gevonden. Kies “Alle stoffen” of wis filters.</p>'}</div>`;
}

function renderHelpFilters(){
  return `<div class="filter-section">
    <div class="filter-title">Help mij kiezen</div>
    <div class="filter-sub">Laat technische termen gerust op “geen voorkeur”. De configurator gebruikt deze antwoorden alleen om de stoffenlijst te verkleinen.</div>
    ${renderChipFilter('gebruik','Waarvoor wilt u het dragen?',[
      ['geen_voorkeur','Alle toepassingen'],['zakelijk','Zakelijk'],['bruiloft','Bruiloft'],['zomer','Zomer'],['winter','Winter'],['avond','Avond / gala'],['casual','Casual']
    ])}
    ${renderChipFilter('uitstraling','Welke uitstraling zoekt u?',[
      ['geen_voorkeur','Alle uitstralingen'],['klassiek','Klassiek'],['rustig','Rustig'],['opvallend','Opvallend'],['formeel','Formeel'],['zacht','Zacht / informeel'],['veelzijdig','Veelzijdig']
    ])}
    ${renderChipFilter('kleur','Kleurfamilie',[
      ['geen_voorkeur','Alle kleuren'],['navy','Navy'],['blauw','Blauw'],['grijs','Grijs'],['zwart','Zwart'],['beige','Beige / naturel'],['bordeaux','Bordeaux']
    ])}
  </div>`;
}

function renderBrowseFilters(){
  return `<div class="filter-section">
    <div class="filter-title">Zelf bladeren</div>
    <div class="filter-sub">Gebruik de technische filters om doelgericht door de stoffenbibliotheek te bladeren.</div>
    ${renderChipFilter('materiaal','Materiaalsoort',[
      ['geen_voorkeur','Alle materialen'],['wol','Wol'],['katoen','Katoen'],['linnen','Linnen']
    ])}
    ${renderChipFilter('weving','Weving / structuur',[
      ['geen_voorkeur','Alle wevingen'],['hopsack','Hopsack'],['flanel','Flanel'],['twill','Twill'],['plain','Plain weave'],['barathea','Barathea'],['velvet','Velvet']
    ])}
    ${renderChipFilter('patroon','Patroon',[
      ['geen_voorkeur','Alle patronen'],['effen','Effen'],['prince_of_wales','Prince of Wales / Glencheck'],['windowpane','Windowpane'],['houndstooth','Houndstooth'],['stripe','Streep']
    ])}
    ${renderChipFilter('kleur','Kleur',[
      ['geen_voorkeur','Alle kleuren'],['navy','Navy'],['blauw','Blauw'],['grijs','Grijs'],['zwart','Zwart'],['beige','Beige'],['bordeaux','Bordeaux']
    ])}
  </div>`;
}

function renderChipFilter(key,label,opts){
  return `<div class="filter-row"><div class="filter-label">${label}</div><div class="chip-row">${opts.map(([id,naam])=>`<button class="chip ${materiaalFilters[key]===id?'active':''}" onclick="setMateriaalFilter('${key}','${id}')">${naam}</button>`).join('')}</div></div>`;
}

function setMateriaalFilter(key,val){
  materiaalFilters[key]=val;
  if (bibliotheekOpen) renderStoffenBibliotheek();
  renderMateriaalKeuze();
}

function waardeMatcht(waarde, filterWaarde){
  if (!filterWaarde || filterWaarde === 'geen_voorkeur' || filterWaarde === 'alle') return true;
  if (Array.isArray(waarde)) return waarde.includes(filterWaarde);
  return String(waarde || '').toLowerCase() === String(filterWaarde).toLowerCase();
}

function stofZoekMatcht(stof, zoek){
  const q = String(zoek || '').trim().toLowerCase();
  if (!q) return true;
  const tekst = [
    stof.id, stof.naam, stof.leverancier, stof.merk, stof.bunch, stof.stofnummer,
    stof.kleur, stof.patroonkleur, stof.weving, stof.patroon, stof.prijsGroep,
    ...(stof.materiaal || []), ...(stof.klantLabels || []), ...(stof.labels || [])
  ].filter(Boolean).join(' ').toLowerCase();
  return tekst.includes(q);
}

function getGefilterdeStoffen(opts={}){
  const g = getGelegenheid();
  const toonAlle = opts.toonAlle ?? materiaalToonAlleStoffen;
  const zoek = opts.zoek ?? '';
  return STOFFEN.filter(stof => {
    if (!toonAlle && g && g.id !== 'los_kledingstuk' && Array.isArray(stof.geschiktVoor) && !stof.geschiktVoor.includes(g.id)) return false;
    if (!stofZoekMatcht(stof, zoek)) return false;
    if (materiaalMode === 'help') {
      if (!waardeMatcht(stof.gebruik || [], materiaalFilters.gebruik) && !waardeMatcht(stof.seizoen || [], materiaalFilters.gebruik)) return false;
      if (!waardeMatcht(stof.uitstraling || [], materiaalFilters.uitstraling)) return false;
      if (!waardeMatcht(stof.kleur, materiaalFilters.kleur)) return false;
    } else {
      if (!waardeMatcht(stof.materiaal || [], materiaalFilters.materiaal)) return false;
      if (!waardeMatcht(stof.weving, materiaalFilters.weving)) return false;
      if (!waardeMatcht(stof.patroon, materiaalFilters.patroon)) return false;
      if (!waardeMatcht(stof.kleur, materiaalFilters.kleur)) return false;
    }
    return true;
  });
}

function renderStofResultaten(){
  const stoffen = getGefilterdeStoffen();
  return `<div class="fabric-results-head"><div><div class="fabric-results-title">${materiaalToonAlleStoffen ? 'Alle stoffen' : 'Aanbevolen stoffen'}</div><div class="fabric-results-count">${stoffen.length} resultaat${stoffen.length===1?'':'en'} — selectie voor ${doelLabel(actieveMateriaalDoel)}</div></div><div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end"><button class="btn btn-ghost" onclick="materiaalToonAlleStoffen=!materiaalToonAlleStoffen;renderMateriaalKeuze()">${materiaalToonAlleStoffen ? 'Toon aanbevolen' : 'Toon alle stoffen'}</button><button class="btn btn-ghost" onclick="resetMateriaalFilters()">Filters wissen</button><button class="btn btn-primary" onclick="openStoffenBibliotheek()">Open bibliotheek</button></div></div>
    <div class="fabric-grid">${stoffen.map(renderStofCard).join('') || '<p class="summary-empty">Geen stoffen gevonden. Wis filters of kies “Alle stoffen”.</p>'}</div>`;
}

function renderStofCard(stof){
  const selected = materiaalKeuzes[actieveMateriaalDoel] === stof.id || (actieveMateriaalDoel==='hoofdStof' && materiaalKeuzes.hoofdStof===stof.id);
  const img = STOFFEN_IMG + (stof.swatch || stof.closeup || 'placeholder.jpg');
  return `<div class="fabric-card ${selected?'selected':''}" onclick="selectStof('${stof.id}')">
    <div class="fabric-img">
      <img src="${img}" alt="${stof.naam}" onerror="this.style.display='none'">
      <div class="fabric-actions">
        <button class="fabric-icon-btn" onclick="openLb('${STOFFEN_IMG + (stof.closeup || stof.swatch)}','${stof.naam}',event)" title="Close-up"><i class="ti ti-zoom-in"></i></button>
        <button class="fabric-icon-btn" onclick="openStofInfo('${stof.id}',event)" title="Meer informatie"><i class="ti ti-info-circle"></i></button>
      </div>
    </div>
    <div class="fabric-info">
      <div class="fabric-name">${stof.naam}</div>
      <div class="fabric-meta">${stof.leverancier || stof.merk || ''} · ${stof.bunch ? stof.bunch + ' · ' : ''}${stof.stofnummer}<br>${(stof.materiaal || []).join('/')} · ${stof.weving} · ${stof.patroon} · ${stof.kleur}</div>
      <div class="fabric-tags">${(stof.klantLabels || stof.labels || []).map(t=>`<span class="fabric-tag">${t}</span>`).join('')}<span class="fabric-tag">Prijs ${stof.prijsGroep}</span></div>
    </div>
  </div>`;
}

function selectStof(id){
  const g = getGelegenheid();
  if (!g || g.id !== 'tenue_de_ville') {
    materiaalKeuzes.hoofdStof = id;
    getMateriaalDoelen().forEach(k => { materiaalKeuzes[k] = id; });
    if (!getMateriaalDoelen().length) {
      materiaalKeuzes.jasStof = id;
      materiaalKeuzes.broekStof = id;
      materiaalKeuzes.giletStof = id;
    }
  } else {
    materiaalKeuzes[actieveMateriaalDoel] = id;
  }
  renderMateriaalKeuze();
  if (bibliotheekOpen) {
    closeStoffenBibliotheek();
    closeNotice();
  }
}

function resetMateriaalFilters(){
  materiaalFilters = {gebruik:'geen_voorkeur', uitstraling:'geen_voorkeur', kleur:'geen_voorkeur', materiaal:'geen_voorkeur', weving:'geen_voorkeur', patroon:'geen_voorkeur'};
  bibliotheekZoek = '';
  const search = document.getElementById('stoffenBibliotheekZoek');
  if (search) search.value = '';
  renderMateriaalKeuze();
  if (bibliotheekOpen) renderStoffenBibliotheek();
}

function openStofInfo(id,e){
  if(e) e.stopPropagation();
  const stof = getStof(id);
  if (!stof) return;
  const heroPath = STOFFEN_IMG + (stof.hero || stof.swatch || stof.closeup || '');
  const swatchPath = STOFFEN_IMG + (stof.swatch || stof.closeup || '');
  const closeupPath = STOFFEN_IMG + (stof.closeup || stof.swatch || '');
  const videoPath = stof.video ? STOFFEN_IMG + stof.video : '';
  const media = document.getElementById('infoMedia');
  media.className = 'info-media';
  media.style.display = '';
  media.innerHTML = `
    ${heroPath ? `<div class="info-hero"><div class="info-hero-label">Stofbeeld</div><img src="${escapeHtml(heroPath)}" alt="${escapeHtml(stof.naam)} stofbeeld" onerror="this.style.display='none'"></div>` : ''}
    <div class="info-media-grid ${videoPath ? '' : 'single'}">
      <div class="info-media-item">
        <div class="info-media-label">Close-up</div>
        ${closeupPath ? `<img src="${escapeHtml(closeupPath)}" alt="${escapeHtml(stof.naam)} close-up" onerror="this.style.display='none'">` : ''}
      </div>
      ${videoPath ? `<div class="info-media-item">
        <div class="info-media-label">Lichtvideo</div>
        <video controls muted loop playsinline preload="metadata">
          <source src="${escapeHtml(videoPath)}" type="video/mp4">
        </video>
      </div>` : ''}
    </div>`;
  document.getElementById('infoContent').innerHTML = `
    <div class="info-title">${escapeHtml(stof.naam)}</div>
    <div class="info-meta">${escapeHtml(stof.leverancier || stof.merk || '')} · ${stof.bunch ? escapeHtml(stof.bunch) + ' · ' : ''}${escapeHtml(stof.stofnummer)} · Prijsgroep ${escapeHtml(stof.prijsGroep)}</div>
    <div class="info-section"><div class="info-section-title">Eigenschappen</div><div class="info-text">Materiaal: ${escapeHtml((stof.materiaal || []).join(', '))}<br>Weving: ${escapeHtml(stof.weving)}<br>Patroon: ${escapeHtml(stof.patroon)}<br>Kleur: ${escapeHtml(stof.kleur)}${stof.patroonkleur ? '<br>Patroonkleur: '+escapeHtml(stof.patroonkleur) : ''}</div></div>
    <div class="info-section"><div class="info-section-title">Korte uitleg</div><div class="info-text">${escapeHtml(stof.korteUitleg || '')}</div></div>
    <div class="info-section"><div class="info-section-title">Advies</div><div class="info-text">${escapeHtml(stof.advies || '')}</div></div>
    ${stof.minderGeschiktVoor ? `<div class="info-section"><div class="info-section-title">Minder geschikt voor</div><div class="info-text">${escapeHtml(stof.minderGeschiktVoor)}</div></div>` : ''}

    ${stof.stofboek ? `
      <div class="info-section">
        <div class="info-section-title">Over het stofboek</div>
        <div class="info-text">
          <strong>${escapeHtml(stof.stofboek.leverancier)} · ${escapeHtml(stof.stofboek.naam)}</strong><br><br>
          ${escapeHtml(stof.stofboek.langeUitleg || '')}
          ${stof.stofboek.herkomst ? `<br><br>Herkomst: ${escapeHtml(stof.stofboek.herkomst)}` : ''}
          ${stof.stofboek.fabriek ? `<br>Fabriek: ${escapeHtml(stof.stofboek.fabriek)}` : ''}
          ${stof.stofboek.afwerking ? `<br>Afwerking: ${escapeHtml(stof.stofboek.afwerking)}` : ''}
          ${stof.stofboek.nummerreeks ? `<br>Nummerreeks: ${escapeHtml(stof.stofboek.nummerreeks)}` : ''}
        </div>
      </div>` : ''}

    <div class="info-link-row">
      ${stof.closeup ? `<a class="info-link" href="${escapeHtml(closeupPath)}" target="_blank" rel="noopener"><i class="ti ti-zoom-in"></i> Open close-up</a>` : ''}
      ${videoPath ? `<a class="info-link" href="${escapeHtml(videoPath)}" target="_blank" rel="noopener"><i class="ti ti-player-play"></i> Open lichtvideo</a>` : ''}
      ${stof.blogUrl ? `<a class="info-link" href="${escapeHtml(stof.blogUrl)}" target="_blank" rel="noopener"><i class="ti ti-article"></i> Gerelateerde blog</a>` : ''}
      ${stof.videoUrl ? `<a class="info-link" href="${escapeHtml(stof.videoUrl)}" target="_blank" rel="noopener"><i class="ti ti-brand-youtube"></i> Externe video</a>` : ''}
      <button class="info-link" onclick="selectStof('${escapeHtml(stof.id)}');closeInfoModal()"><i class="ti ti-check"></i> Selecteer deze stof</button>
    </div>`;
  const infoModal = document.getElementById('infoModal');
  infoModal.style.display='flex';
  infoModal.scrollTop = 0;
}

function closeInfoModal(){ const m=document.getElementById('infoModal'); if(m)m.style.display='none'; const media=document.getElementById('infoMedia'); if(media){ media.className='info-media'; media.style.display=''; media.innerHTML=''; } }


const VOERING_TYPE_OPTIES = [
  {id:'volledig_gevoerd', naam:'Volledig gevoerd', desc:'Klassiek en netjes afgewerkt. Logische keuze voor formele pakken en avondkleding.', img:'tekeningen/voering/volledig-gevoerd.png', icon:'ti-layers-intersect'},
  {id:'half_gevoerd', naam:'Half gevoerd', desc:'Lichter en soepeler, met behoud van nette afwerking in borst en rug.', img:'tekeningen/voering/half-gevoerd.png', icon:'ti-layout-sidebar'},
  {id:'quarter_lined', naam:'Quarter lined', desc:'Zeer lichte afwerking met minimale voering; luchtig maar nog steeds netjes afgewerkt.', img:'tekeningen/voering/quarter-lined.png', icon:'ti-square-half'},
  {id:'ongevoerd', naam:'Ongevoerd / unlined', desc:'Zeer licht en casual. Vooral geschikt voor zomerse of ongeconstrueerde jasjes.', img:'tekeningen/voering/ongevoerd.png', icon:'ti-wind'},
  {id:'op_advies', naam:'Op advies van De Oost', desc:'Wij kiezen de meest logische voeringwijze op basis van stof, gebruik en constructie.', icon:'ti-sparkles'}
];

const CONSTRUCTIE_OPTIES = [
  {id:'full_canvas', naam:'Full canvas', desc:'Volledige canvasconstructie; de meest traditionele opbouw met veel vorm en drape.', img:'tekeningen/constructie/full-canvas.png', icon:'ti-layers'},
  {id:'half_canvas', naam:'Half canvas', desc:'Canvas in borst en revers; goede balans tussen vorm, comfort en toegankelijkheid.', img:'tekeningen/constructie/half-canvas.png', icon:'ti-layers-intersect'},
  {id:'licht_ongeconstrueerd', naam:'Licht geconstrueerd', desc:'Zachtere constructie met minder binnenwerk; lichter, soepeler en informeler.', img:'tekeningen/constructie/licht-geconstrueerd.png', icon:'ti-feather'},
  {id:'op_advies', naam:'Op advies van De Oost', desc:'Wij stemmen de constructie af op stof, model en gebruik.', icon:'ti-sparkles'}
];

const KNOOP_TYPE_OPTIES = [
  {id:'donker_hoorn', naam:'Donker hoorn', desc:'Klassieke keuze voor navy, grijs en veel zakelijke stoffen.', icon:'ti-circle'},
  {id:'bruin_hoorn', naam:'Bruin hoorn', desc:'Warmer en natuurlijker, mooi bij bruin, groen, beige en casual jasjes.', icon:'ti-circle'},
  {id:'parelmoer', naam:'Parelmoer', desc:'Lichter en iets uitgesprokener; vooral mooi bij lichte of zomerse stoffen.', icon:'ti-circle'},
  {id:'gestoffeerd_revers', naam:'Gestoffeerd — zelfde als revers', desc:'Voor avondkleding: knopen volgen het gekozen reversmateriaal.', icon:'ti-circle-half-2'},
  {id:'gestoffeerd_stof_in_stof', naam:'Gestoffeerd — stof-in-stof', desc:'Knopen worden overtrokken met de gekozen hoofdstof of een gekozen stof.', icon:'ti-circle-half-2'},
  {id:'op_advies', naam:'Op advies van De Oost', desc:'Wij kiezen de meest passende knoop bij stof en gelegenheid.', icon:'ti-sparkles'}
];

let afwerkingKeuzes = {
  voeringType:'volledig_gevoerd',
  voeringId:null,
  constructie:'half_canvas',
  knoopType:'donker_hoorn',
  knoopId:null,
  knoopMateriaalBron:'standaard'
};

function hideAllMainScreens(){
  ['startScreen','mainConfig','materialConfig','finishingConfig','finalSummary','finalReview','measureConfig','customerConfig','orderReview'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
}

function showNotice(title, text){
  const m = document.getElementById('noticeModal');
  if (!m) return;
  document.getElementById('noticeTitle').textContent = title || 'De Oost Bespoke';
  document.getElementById('noticeText').textContent = text || '';
  m.style.display = 'flex';
}
function closeNotice(){
  const m = document.getElementById('noticeModal');
  if (m) m.style.display = 'none';
}

// Veiligheidsnet: mocht er ergens nog een oude alert-call staan, toon dan onze eigen De Oost-melding in plaats van de browser-popup met github.io.
window.alert = function(message){
  showNotice('De Oost Bespoke', String(message || ''));
};

function materiaalCompleet(){
  const g = getGelegenheid();
  if (g && g.id === 'tenue_de_ville') {
    return getMateriaalDoelen().every(k => !!materiaalKeuzes[k]);
  }
  return !!materiaalKeuzes.hoofdStof;
}

function toonMateriaalSamenvatting(){
  if (!materiaalCompleet()) {
    showNotice('De Oost Bespoke','Kies eerst een stof voordat u doorgaat naar voering, knopen en constructie.');
    return;
  }
  toonAfwerkingKeuze();
}

function toonAfwerkingKeuze(){
  hideAllMainScreens();
  const screen = document.getElementById('finishingConfig');
  screen.style.display = 'block';
  renderAfwerkingKeuze();
  window.scrollTo({top:0,behavior:'smooth'});
}

function terugNaarMateriaal(){
  hideAllMainScreens();
  document.getElementById('materialConfig').style.display = 'block';
  renderMateriaalKeuze();
  window.scrollTo({top:0,behavior:'smooth'});
}

function labelFrom(list,id){
  const x = list.find(o => o.id === id);
  return x ? x.naam : id;
}

function setAfwerking(key,val){
  afwerkingKeuzes[key] = val;
  if (key === 'knoopType') {
    afwerkingKeuzes.knoopMateriaalBron = val.startsWith('gestoffeerd') ? val : 'standaard';
  }
  renderAfwerkingKeuze();
}

function selectVoering(id){ afwerkingKeuzes.voeringId = id; renderAfwerkingKeuze(); }
function selectKnoop(id){ afwerkingKeuzes.knoopId = id; renderAfwerkingKeuze(); }

function renderChoiceCards(list,key){
  return `<div class="choice-card-grid">${list.map(o => {
    const selected = afwerkingKeuzes[key]===o.id;
    const img = o.img || '';
    const imgHtml = img ? `<div class="choice-card-image">
      <img src="${img}" alt="${o.naam}" onerror="this.closest('.choice-card-image').classList.add('missing-image');this.style.display='none'">
      <div class="choice-card-actions">
        <button class="fabric-icon-btn" onclick="openLb('${img}','${o.naam}',event)" title="Vergroot"><i class="ti ti-zoom-in"></i></button>
        <button class="fabric-icon-btn" onclick="openAfwerkingInfo('${key}','${o.id}',event)" title="Meer informatie"><i class="ti ti-info-circle"></i></button>
      </div>
    </div>` : `<button class="choice-card-info-btn" onclick="openAfwerkingInfo('${key}','${o.id}',event)" title="Meer informatie"><i class="ti ti-info-circle"></i></button><div class="choice-card-icon"><i class="ti ${o.icon}"></i></div>`;
    return `<div class="choice-card ${img?'has-image':''} ${selected?'selected':''}" onclick="setAfwerking('${key}','${o.id}')">
      ${imgHtml}
      <div class="choice-card-body">
        <div class="choice-card-title">${o.naam}</div>
        <div class="choice-card-desc">${o.desc}</div>
      </div>
    </div>`;
  }).join('')}</div>`;
}

function getAfwerkingList(key){
  if (key === 'voeringType') return VOERING_TYPE_OPTIES;
  if (key === 'constructie') return CONSTRUCTIE_OPTIES;
  if (key === 'knoopType') return KNOOP_TYPE_OPTIES;
  return [];
}

function getAfwerkingInfoText(key,id){
  const texts = {
    voeringType: {
      volledig_gevoerd: {
        title:'Effect van volledig gevoerd',
        body:'Het jasje voelt gladder aan bij aantrekken en heeft een klassieke, nette binnenafwerking. Het geeft iets meer structuur en gewicht en is logisch voor formele pakken, avondkleding en kouder weer.',
        advies:'Meest veilige keuze wanneer de klant een traditionele afwerking wil of het jasje vaak over een overhemd draagt.'
      },
      half_gevoerd: {
        title:'Effect van half gevoerd',
        body:'De bovenrug, schouders en voorpand blijven netjes afgewerkt, terwijl het jasje lichter en luchtiger wordt. De stof valt natuurlijker en het draagcomfort is beter bij warmere omstandigheden.',
        advies:'Mooi compromis voor veel maatpakken, losse jasjes en zomerse wollen stoffen.'
      },
      quarter_lined: {
        title:'Effect van quarter lined',
        body:'Alleen de meest noodzakelijke delen worden gevoerd. Het jasje blijft heel licht en ademt goed, maar toont aan de binnenkant meer van de constructie en naden.',
        advies:'Voor klanten die bewust een lichte, ambachtelijke en minder formele afwerking zoeken.'
      },
      ongevoerd: {
        title:'Effect van ongevoerd / unlined',
        body:'De meest luchtige en soepele keuze. Het jasje voelt minder opgebouwd en casualer. De binnenafwerking moet zeer netjes zijn omdat er vrijwel geen voering is die naden verbergt.',
        advies:'Vooral geschikt voor linnen, lichte zomerstoffen, casual jasjes en zachte constructies.'
      },
      op_advies: {
        title:'Op advies van De Oost',
        body:'Wij stemmen de voeringwijze af op stof, gelegenheid, constructie en gewenst draaggevoel.',
        advies:'Handig wanneer de klant niet zeker weet of de stof beter volledig, half of ongevoerd verwerkt kan worden.'
      }
    },
    constructie: {
      full_canvas: {
        title:'Effect van full canvas',
        body:'De canvaslaag loopt door het hele voorpand. Het jasje vormt zich met dragen naar het lichaam, behoudt mooi zijn vorm en krijgt een natuurlijke drape. Dit is de meest traditionele constructie.',
        advies:'Aanrader voor formele pakken, zakelijke garderobe en klanten die maximale levensduur en vorm willen.'
      },
      half_canvas: {
        title:'Effect van half canvas',
        body:'Canvas in borst en revers geeft structuur waar dat het meest zichtbaar is, terwijl het jasje lichter en toegankelijker blijft dan full canvas.',
        advies:'Voor de meeste maatpakken de beste balans tussen vorm, comfort, prijs en duurzaamheid.'
      },
      licht_ongeconstrueerd: {
        title:'Effect van licht / ongeconstrueerd',
        body:'Minder binnenwerk geeft een zachter, losser en informeler draaggevoel. De stof beweegt meer mee en het jasje oogt minder strak opgebouwd.',
        advies:'Geschikt voor casual jasjes, zomerstoffen, linnen, hopsack en klanten die comfort boven strakke structuur kiezen.'
      },
      op_advies: {
        title:'Constructie op advies',
        body:'De optimale constructie hangt sterk af van stofgewicht, gebruik, schouderlijn, gewenste formaliteit en budget.',
        advies:'Veilige keuze als de klant vooral de uitstraling kiest en de technische opbouw aan De Oost wil overlaten.'
      }
    },
    knoopType: {
      donker_hoorn:{title:'Donker hoorn',body:'Rustige klassieke knoop voor navy, grijs, zwart en veel zakelijke stoffen.',advies:'Een veilige keuze wanneer de knoop niet te veel aandacht moet vragen.'},
      bruin_hoorn:{title:'Bruin hoorn',body:'Warmer en natuurlijker dan donker hoorn. Werkt goed bij aardetinten, groen, beige en casual jasjes.',advies:'Geeft een iets informelere, ambachtelijke uitstraling.'},
      parelmoer:{title:'Parelmoer',body:'Lichter en luxer in uitstraling, met subtiele glans.',advies:'Mooi bij lichte zomerse stoffen of wanneer een frissere knoop gewenst is.'},
      gestoffeerd_revers:{title:'Gestoffeerd — zelfde als revers',body:'Voor avondkleding kunnen knopen worden overtrokken in hetzelfde materiaal als het revers, zoals satijn of grosgrain.',advies:'Zorgt voor een coherente black-tie afwerking.'},
      gestoffeerd_stof_in_stof:{title:'Gestoffeerd — stof-in-stof',body:'De knoop wordt overtrokken met de hoofdstof of een gekozen stof uit het assortiment.',advies:'Rustig en chic, vooral wanneer zichtbare contrastknopen ongewenst zijn.'},
      op_advies:{title:'Knopen op advies',body:'De Oost kiest de knoop die het beste past bij stof, gelegenheid en afwerking.',advies:'Handig als de klant niet zeker weet welke knoop het meest passend is.'}
    }
  };
  return (texts[key] && texts[key][id]) || null;
}

function openAfwerkingInfo(key,id,e){
  if (e) e.stopPropagation();
  const list = getAfwerkingList(key);
  const opt = list.find(o => o.id === id);
  if (!opt) return;
  const extra = getAfwerkingInfoText(key,id);
  const media = document.getElementById('infoMedia');
  if (opt.img) {
    media.style.display = '';
    media.innerHTML = `<img src="${opt.img}" alt="${opt.naam}" style="object-fit:contain;background:white;padding:14px" onerror="this.parentElement.style.display='none'">`;
  } else {
    media.style.display = 'none';
    media.innerHTML = '';
  }
  document.getElementById('infoContent').innerHTML = `
    <div class="info-title">${opt.naam}</div>
    <div class="info-meta">${key === 'voeringType' ? 'Voeringwijze' : key === 'constructie' ? 'Constructie / canvas' : 'Knopen'}</div>
    <div class="info-section"><div class="info-section-title">Omschrijving</div><div class="info-text">${opt.desc}</div></div>
    ${extra ? `<div class="info-section"><div class="info-section-title">${extra.title}</div><div class="info-text">${extra.body}</div></div><div class="info-section"><div class="info-section-title">Advies</div><div class="info-text">${extra.advies}</div></div>` : ''}
    <div class="info-link-row"><button class="info-link" onclick="setAfwerking('${key}','${id}');closeInfoModal()"><i class="ti ti-check"></i> Selecteer deze keuze</button></div>`;
  const infoModal = document.getElementById('infoModal');
  infoModal.style.display='flex';
  infoModal.scrollTop = 0;
}


function renderResourceCards(items,type){
  if (!items.length) return '<div class="inline-note">Nog geen '+(type==='voering'?'voeringen':'knopen')+' in het databestand. U kunt voorlopig “op advies” gebruiken of later records toevoegen.</div>';
  return `<div class="resource-grid">${items.map(item => {
    const selected = type==='voering' ? afwerkingKeuzes.voeringId===item.id : afwerkingKeuzes.knoopId===item.id;
    const img = item.swatch || item.closeup || '';
    const onclick = type==='voering' ? `selectVoering('${item.id}')` : `selectKnoop('${item.id}')`;
    const meta = type==='voering' ? `${item.materiaal || ''} · ${item.kleur || ''}` : `${item.materiaal || ''} · ${item.kleur || ''}`;
    return `<div class="resource-card ${selected?'selected':''}" onclick="${onclick}">
      <div class="resource-img">${img ? `<img src="${img}" alt="${item.naam}" onerror="this.style.display='none'">` : `<div class="resource-fallback">${item.naam ? item.naam.slice(0,1) : '•'}</div>`}</div>
      <div class="resource-info"><div class="resource-name">${item.naam}</div><div class="resource-meta">${meta}<br>${(item.klantLabels || item.labels || []).join(' · ')}</div></div>
    </div>`;
  }).join('')}</div>`;
}

function renderAfwerkingKeuze(){
  const g = getGelegenheid();
  const content = document.getElementById('finishContent');
  const voeringItems = VOERINGEN.length ? VOERINGEN : [];
  const knoopItems = KNOPEN.length ? KNOPEN : [];
  const avondExtra = g && g.id === 'black_tie' ? `<div class="inline-note" style="margin-top:.75rem">Bij black tie kan “gestoffeerd — zelfde als revers” automatisch aansluiten op uw avondafwerking: revers ${avondLabel(avondAfwerking.revers)}, knopen ${avondLabel(avondAfwerking.gestoffeerdeKnopen)}.</div>` : '';
  content.innerHTML = `<div class="finish-layout">
    <div class="filter-section">
      <div class="filter-title">Voeringwijze</div>
      <div class="filter-sub">Kies hoe het jasje gevoerd wordt. Dit bepaalt comfort, gewicht en afwerking.</div>
      ${renderChoiceCards(VOERING_TYPE_OPTIES,'voeringType')}
    </div>

    <div class="filter-section">
      <div class="filter-title">Voering kiezen</div>
      <div class="filter-sub">Kies een voeringkleur of laat deze later op advies bepalen.</div>
      <div class="chip-row"><button class="chip ${!afwerkingKeuzes.voeringId?'active':''}" onclick="selectVoering(null)">Op advies / later kiezen</button></div>
      ${renderResourceCards(voeringItems,'voering')}
    </div>

    <div class="filter-section">
      <div class="filter-title">Constructie / canvas</div>
      <div class="filter-sub">Deze keuze staat hier omdat canvas en binnenwerk meer met maakwijze en maatvoering te maken hebben dan met modelstijl.</div>
      ${renderChoiceCards(CONSTRUCTIE_OPTIES,'constructie')}
    </div>

    <div class="filter-section">
      <div class="filter-title">Knopen</div>
      <div class="filter-sub">Kies het type knoop. Voor avondkleding kunnen gestoffeerde knopen gekoppeld worden aan revers of stof.</div>
      ${renderChoiceCards(KNOOP_TYPE_OPTIES,'knoopType')}
      ${avondExtra}
    </div>

    <div class="filter-section">
      <div class="filter-title">Knoopselectie</div>
      <div class="filter-sub">Optioneel: kies alvast een specifieke knoop uit de knopenbibliotheek.</div>
      <div class="chip-row"><button class="chip ${!afwerkingKeuzes.knoopId?'active':''}" onclick="selectKnoop(null)">Op advies / later kiezen</button></div>
      ${renderResourceCards(knoopItems,'knoop')}
    </div>
  </div>`;
}

function getAfwerkingSamenvattingHtml(){
  const voering = VOERINGEN.find(v => v.id === afwerkingKeuzes.voeringId);
  const knoop = KNOPEN.find(k => k.id === afwerkingKeuzes.knoopId);
  return `<div class="final-review-block"><div class="final-review-title">Voering, knopen & constructie</div>
    <div class="final-review-row"><span>Voeringwijze:</span> ${labelFrom(VOERING_TYPE_OPTIES, afwerkingKeuzes.voeringType)}</div>
    <div class="final-review-row"><span>Voering:</span> ${voering ? voering.naam : 'Op advies / later kiezen'}</div>
    <div class="final-review-row"><span>Constructie:</span> ${labelFrom(CONSTRUCTIE_OPTIES, afwerkingKeuzes.constructie)}</div>
    <div class="final-review-row"><span>Knopen:</span> ${labelFrom(KNOOP_TYPE_OPTIES, afwerkingKeuzes.knoopType)}</div>
    <div class="final-review-row"><span>Specifieke knoop:</span> ${knoop ? knoop.naam : 'Op advies / later kiezen'}</div>
  </div>`;
}

function getMateriaalSamenvattingHtml(){
  const g = getGelegenheid();
  let rows = '';
  if (g && g.id === 'tenue_de_ville') {
    getMateriaalDoelen().forEach(k => {
      const stof = getStof(materiaalKeuzes[k]);
      rows += `<div class="final-review-row"><span>${doelLabel(k)}:</span> ${stof ? stof.naam + ' (' + stof.stofnummer + ')' : 'nog niet gekozen'}</div>`;
    });
  } else {
    const stof = getStof(materiaalKeuzes.hoofdStof);
    rows += `<div class="final-review-row"><span>Stof:</span> ${stof ? stof.naam + ' (' + stof.stofnummer + ')' : 'nog niet gekozen'}</div>`;
  }
  if (g && g.id === 'black_tie') rows += `<div class="final-review-row"><span>Avondafwerking:</span> revers ${avondLabel(avondAfwerking.revers)}, paspelzakken ${avondLabel(avondAfwerking.paspelzakken)}, knopen ${avondLabel(avondAfwerking.gestoffeerdeKnopen)}, broekbiezen ${avondLabel(avondAfwerking.broekbiezen)}</div>`;
  return `<div class="final-review-block"><div class="final-review-title">Stof & materiaal</div>${rows}</div>`;
}

function toonEindSamenvatting(){
  hideAllMainScreens();
  const box = document.getElementById('finalReview');
  box.style.display = 'block';
  const bo = getBestelOptie();
  const g = getGelegenheid();
  document.getElementById('finalReviewContent').innerHTML = `<div class="finish-head"><div class="finish-title">Controleer uw keuze</div><div class="finish-sub">Dit is de huidige combinatie van stijl, stof, voering, knopen en constructie.</div></div>
    <div class="final-review-block"><div class="final-review-title">Startkeuze</div>
      <div class="final-review-row"><span>Gelegenheid:</span> ${g ? g.naam : '—'}</div>
      <div class="final-review-row"><span>Bestelling:</span> ${bo ? (bo.id === 'extra_bestaande_order' ? bo.naam + ' — ' + extraItemType : bo.naam) : '—'}</div>
      <div class="final-review-row"><span>Aantallen:</span> ${getActieveKledingstukken().map(k => `${k}: ${aantallen[k] || 1}`).join(' · ') || '—'}</div>
      ${vorigeOrderMatch ? `<div class="final-review-row"><span>Vorige order:</span> ${vorigeOrderMatch.ordernummer}</div>` : ''}
    </div>
    ${getMateriaalSamenvattingHtml()}
    ${getAfwerkingSamenvattingHtml()}`;
  window.scrollTo({top:0,behavior:'smooth'});
}


/* =========================
   MATEN & KLANTGEGEVENS
========================= */
const MAAT_AANLEVER_OPTIES = [
  {id:'nu_invullen', naam:'Ik vul mijn maten nu in', desc:'Toon de maatvelden voor de gekozen kledingstukken.', icon:'ti-ruler-measure'},
  {id:'bestaande_maten', naam:'De Oost heeft mijn maten al', desc:'Gebruik bestaande maten of een eerdere order als uitgangspunt.', icon:'ti-archive'},
  {id:'langskomen', naam:'Ik kom langs om gemeten te worden', desc:'De maten worden tijdens een afspraak opgenomen.', icon:'ti-calendar'},
  {id:'later', naam:'Ik lever de maten later aan', desc:'Maak de aanvraag alvast af en voeg maten later toe.', icon:'ti-clock'}
];

const MAAT_VELDEN = {
  Jas: [
    ['jas_borst','Borstomvang','cm'],
    ['jas_taille','Taille / buik','cm'],
    ['jas_heup','Zit / heup','cm'],
    ['jas_schouder','Schouderbreedte','cm'],
    ['jas_ruglengte','Ruglengte jas','cm'],
    ['jas_mouwlengte','Mouwlengte','cm'],
    ['jas_biceps','Bovenarm','cm']
  ],
  Broek: [
    ['broek_taille','Taille','cm'],
    ['broek_heup','Heup / zit','cm'],
    ['broek_binnenbeen','Binnenbeenlengte','cm'],
    ['broek_buitenbeen','Buitenbeenlengte','cm'],
    ['broek_kruishoogte','Kruishoogte','cm'],
    ['broek_dij','Dijwijdte','cm'],
    ['broek_knie','Kniebreedte','cm'],
    ['broek_voetwijdte','Voetwijdte','cm']
  ],
  Gilet: [
    ['gilet_borst','Borstomvang','cm'],
    ['gilet_taille','Taille','cm'],
    ['gilet_ruglengte','Ruglengte gilet','cm'],
    ['gilet_voorlengte','Voorlengte gilet','cm']
  ]
};

let maatKeuzes = {
  aanlevering:'nu_invullen',
  toelichting:'',
  velden:{}
};

let klantGegevens = {
  naam:'', email:'', telefoon:'',
  straat:'', postcode:'', plaats:'', land:'Nederland',
  deadline:'', opmerkingen:''
};

function getMaatKledingstukken(){
  return getActieveKledingstukken().filter(k => MAAT_VELDEN[k]);
}

function setMaatAanlevering(id){
  maatKeuzes.aanlevering = id;
  renderMatenKeuze();
}

function updateMaatVeld(id,value){
  maatKeuzes.velden[id] = value;
}

function updateMaatToelichting(value){
  maatKeuzes.toelichting = value;
}

function updateKlantVeld(id,value){
  klantGegevens[id] = value;
}

function toonMatenKeuze(){
  hideAllMainScreens();
  const screen = document.getElementById('measureConfig');
  screen.style.display = 'block';
  renderMatenKeuze();
  window.scrollTo({top:0,behavior:'smooth'});
}

function renderMatenKeuze(){
  const content = document.getElementById('measureContent');
  if (!content) return;
  const kled = getMaatKledingstukken();
  const bo = getBestelOptie();
  const isExtra = bo && bo.id === 'extra_bestaande_order';
  const modeCards = MAAT_AANLEVER_OPTIES.map(o => `<div class="measure-mode-card ${maatKeuzes.aanlevering===o.id?'selected':''}" onclick="setMaatAanlevering('${o.id}')">
    <div class="measure-mode-icon"><i class="ti ${o.icon}"></i></div>
    <div class="measure-mode-name">${o.naam}</div>
    <div class="measure-mode-desc">${o.desc}</div>
  </div>`).join('');

  let fieldsHtml = '';
  if (maatKeuzes.aanlevering === 'nu_invullen') {
    fieldsHtml = kled.map(k => `<div class="form-section">
      <div class="form-section-title">${k}maten</div>
      <div class="form-section-sub">Voorlopige maatvelden voor ${k.toLowerCase()}. Deze lijst kunnen we later exact gelijk trekken met jullie maatformulier.</div>
      <div class="form-grid">
        ${MAAT_VELDEN[k].map(([id,label,unit]) => `<label class="form-field">
          <span class="form-label">${label}</span>
          <input class="form-input" type="number" inputmode="decimal" step="0.1" placeholder="${unit}" value="${escapeHtml(maatKeuzes.velden[id] || '')}" oninput="updateMaatVeld('${id}',this.value)">
        </label>`).join('')}
      </div>
    </div>`).join('');
  } else if (maatKeuzes.aanlevering === 'bestaande_maten') {
    fieldsHtml = `<div class="form-note">We gebruiken bestaande maten als uitgangspunt. Geef hieronder alleen wijzigingen of aandachtspunten door, bijvoorbeeld “broek 1 cm ruimer in taille” of “jasje iets korter”.</div>`;
  } else if (maatKeuzes.aanlevering === 'langskomen') {
    fieldsHtml = `<div class="form-note">De aanvraag kan alvast worden samengesteld. De maten worden tijdens een afspraak bij De Oost opgenomen.</div>`;
  } else {
    fieldsHtml = `<div class="form-note">De aanvraag kan alvast worden afgerond. De maten worden later per afspraak, e-mail of formulier aangeleverd.</div>`;
  }

  content.innerHTML = `<div class="form-section">
    <div class="form-section-title">Hoe wilt u de maten aanleveren?</div>
    <div class="form-section-sub">Gekozen kledingstukken: ${kled.join(', ') || '—'}${isExtra ? '. Bij een extra kledingstuk kan een eerdere order als referentie worden gebruikt.' : ''}</div>
    <div class="measure-mode-grid">${modeCards}</div>
  </div>
  ${fieldsHtml}
  <div class="form-section">
    <div class="form-section-title">Aanvullende maatopmerking</div>
    <div class="form-section-sub">Optioneel: noteer pasvormwensen, wijzigingen ten opzichte van vorige order of andere bijzonderheden.</div>
    <textarea class="form-textarea" oninput="updateMaatToelichting(this.value)" placeholder="Bijvoorbeeld: iets hogere taille, broekspijp smaller, jasje comfortabeler over de borst...">${escapeHtml(maatKeuzes.toelichting || '')}</textarea>
  </div>`;
}

function toonKlantGegevens(){
  hideAllMainScreens();
  const screen = document.getElementById('customerConfig');
  screen.style.display = 'block';
  renderKlantGegevens();
  window.scrollTo({top:0,behavior:'smooth'});
}

function renderKlantGegevens(){
  const content = document.getElementById('customerContent');
  if (!content) return;
  content.innerHTML = `<div class="form-section">
    <div class="form-section-title">Contactgegevens</div>
    <div class="form-section-sub">Naam en e-mail zijn minimaal nodig om de aanvraag op te volgen.</div>
    <div class="form-grid">
      ${renderInput('naam','Naam','text','Voor- en achternaam')}
      ${renderInput('email','E-mail','email','naam@voorbeeld.nl')}
      ${renderInput('telefoon','Telefoon','tel','+31 ...')}
    </div>
  </div>
  <div class="form-section">
    <div class="form-section-title">Adresgegevens</div>
    <div class="form-section-sub">Optioneel in deze fase; handig als de aanvraag later direct naar orderverwerking gaat.</div>
    <div class="form-grid">
      ${renderInput('straat','Straat + huisnummer','text','')}
      ${renderInput('postcode','Postcode','text','')}
      ${renderInput('plaats','Plaats','text','')}
      ${renderInput('land','Land','text','Nederland')}
    </div>
  </div>
  <div class="form-section">
    <div class="form-section-title">Planning en opmerkingen</div>
    <div class="form-grid">
      ${renderInput('deadline','Gewenste datum / deadline','date','')}
    </div>
    <div style="margin-top:12px">
      <label class="form-field"><span class="form-label">Opmerkingen</span><textarea class="form-textarea" oninput="updateKlantVeld('opmerkingen',this.value)" placeholder="Bijvoorbeeld gelegenheid, gewenste leverdatum, specifieke wensen of vragen...">${escapeHtml(klantGegevens.opmerkingen || '')}</textarea></label>
    </div>
  </div>`;
}

function renderInput(id,label,type,placeholder){
  return `<label class="form-field"><span class="form-label">${label}</span><input class="form-input" type="${type}" value="${escapeHtml(klantGegevens[id] || '')}" placeholder="${escapeHtml(placeholder || '')}" oninput="updateKlantVeld('${id}',this.value)"></label>`;
}

function getMatenSamenvattingHtml(){
  const aanlever = MAAT_AANLEVER_OPTIES.find(o => o.id === maatKeuzes.aanlevering);
  let rows = `<div class="final-review-row"><span>Aanlevering:</span> ${aanlever ? aanlever.naam : maatKeuzes.aanlevering}</div>`;
  const filled = Object.entries(maatKeuzes.velden || {}).filter(([,v]) => String(v || '').trim());
  if (maatKeuzes.aanlevering === 'nu_invullen') {
    rows += filled.length ? filled.map(([k,v]) => `<div class="final-review-row"><span>${maatLabel(k)}:</span> ${escapeHtml(v)} cm</div>`).join('') : `<div class="final-review-row"><span>Ingevulde maten:</span> Nog geen maatvelden ingevuld</div>`;
  }
  if (maatKeuzes.toelichting) rows += `<div class="final-review-row"><span>Opmerking:</span> ${escapeHtml(maatKeuzes.toelichting)}</div>`;
  return `<div class="final-review-block"><div class="final-review-title">Maten</div>${rows}</div>`;
}

function maatLabel(id){
  for (const groep of Object.values(MAAT_VELDEN)) {
    const item = groep.find(x => x[0] === id);
    if (item) return item[1];
  }
  return id;
}

function getKlantSamenvattingHtml(){
  return `<div class="final-review-block"><div class="final-review-title">Klantgegevens</div>
    <div class="final-review-row"><span>Naam:</span> ${escapeHtml(klantGegevens.naam || '—')}</div>
    <div class="final-review-row"><span>E-mail:</span> ${escapeHtml(klantGegevens.email || '—')}</div>
    <div class="final-review-row"><span>Telefoon:</span> ${escapeHtml(klantGegevens.telefoon || '—')}</div>
    <div class="final-review-row"><span>Adres:</span> ${escapeHtml([klantGegevens.straat, klantGegevens.postcode, klantGegevens.plaats, klantGegevens.land].filter(Boolean).join(', ') || '—')}</div>
    <div class="final-review-row"><span>Deadline:</span> ${escapeHtml(klantGegevens.deadline || '—')}</div>
    <div class="final-review-row"><span>Opmerkingen:</span> ${escapeHtml(klantGegevens.opmerkingen || '—')}</div>
  </div>`;
}

function toonDefinitieveControle(){
  if (!klantGegevens.naam || !klantGegevens.email) {
    showNotice('De Oost Bespoke','Vul minimaal naam en e-mailadres in voordat u de aanvraag controleert.');
    return;
  }
  hideAllMainScreens();
  const box = document.getElementById('orderReview');
  box.style.display = 'block';
  const bo = getBestelOptie();
  const g = getGelegenheid();
  const json = getSamenvatting();
  document.getElementById('orderReviewContent').innerHTML = `<div class="form-head"><div class="form-title">Controleer uw aanvraag</div><div class="form-sub">Dit is de volledige aanvraag tot en met stijl, stof, afwerking, maten en klantgegevens. Als alles klopt, kunt u de aanvraag naar De Oost versturen.</div></div>
    <div class="final-review-block"><div class="final-review-title">Startkeuze</div>
      <div class="final-review-row"><span>Gelegenheid:</span> ${g ? g.naam : '—'}</div>
      <div class="final-review-row"><span>Bestelling:</span> ${bo ? (bo.id === 'extra_bestaande_order' ? bo.naam + ' — ' + extraItemType : bo.naam) : '—'}</div>
      <div class="final-review-row"><span>Aantallen:</span> ${getActieveKledingstukken().map(k => `${k}: ${aantallen[k] || 1}`).join(' · ') || '—'}</div>
      ${vorigeOrderMatch ? `<div class="final-review-row"><span>Vorige order:</span> ${vorigeOrderMatch.ordernummer}</div>` : ''}
    </div>
    ${getMateriaalSamenvattingHtml()}
    ${getAfwerkingSamenvattingHtml()}
    ${getMatenSamenvattingHtml()}
    ${getKlantSamenvattingHtml()}
    <div class="final-review-block"><div class="final-review-title">Technische export</div><div class="form-section-sub">Voor controle tijdens de bouw. Later sturen we deze data naar Apps Script/Google Sheets.</div><div class="final-json-box">${escapeHtml(JSON.stringify(JSON.parse(json), null, 2))}</div></div>`;
  window.scrollTo({top:0,behavior:'smooth'});
}



/* =========================
   VERZENDEN NAAR APPS SCRIPT
========================= */
let aanvraagWordtVerstuurd = false;

function buildAanvraagPayload(){
  const payload = JSON.parse(getSamenvatting());
  payload.type = 'stijlconfigurator';
  payload.bron = 'deoost_stijlconfigurator';
  payload.clientSubmittedAt = new Date().toISOString();
  return payload;
}

function setSubmitState(active){
  aanvraagWordtVerstuurd = !!active;
  const btn = document.getElementById('submitOrderBtn');
  if (btn) {
    btn.disabled = !!active;
    btn.textContent = active ? 'Aanvraag wordt verstuurd…' : 'Aanvraag versturen';
  }
}

function verstuurAanvraag(){
  if (aanvraagWordtVerstuurd) return;
  if (!klantGegevens.naam || !klantGegevens.email) {
    showNotice('De Oost Bespoke','Vul minimaal naam en e-mailadres in voordat u de aanvraag verstuurt.');
    return;
  }
  if (!materiaalCompleet()) {
    showNotice('De Oost Bespoke','Kies eerst een stof voordat u de aanvraag verstuurt.');
    return;
  }
  if (!ORDER_SUBMIT_WEBHOOK) {
    showNotice('De Oost Bespoke','Er is nog geen verzend-webhook ingesteld.');
    return;
  }

  const payload = buildAanvraagPayload();
  setSubmitState(true);
  submitAanvraagViaIframe(payload);
}

function submitAanvraagViaIframe(payload){
  const oldForm = document.getElementById('deoostSubmitForm');
  if (oldForm) oldForm.remove();
  const oldFrame = document.getElementById('deoostSubmitFrame');
  if (oldFrame) oldFrame.remove();

  const iframe = document.createElement('iframe');
  iframe.name = 'deoostSubmitFrame';
  iframe.id = 'deoostSubmitFrame';
  iframe.style.display = 'none';
  document.body.appendChild(iframe);

  const form = document.createElement('form');
  form.id = 'deoostSubmitForm';
  form.method = 'POST';
  form.action = ORDER_SUBMIT_WEBHOOK;
  form.target = 'deoostSubmitFrame';
  form.style.display = 'none';

  const actionInput = document.createElement('input');
  actionInput.type = 'hidden';
  actionInput.name = 'action';
  actionInput.value = 'submitAanvraag';
  form.appendChild(actionInput);

  const modeInput = document.createElement('input');
  modeInput.type = 'hidden';
  modeInput.name = 'responseMode';
  modeInput.value = 'postMessage';
  form.appendChild(modeInput);

  const payloadInput = document.createElement('input');
  payloadInput.type = 'hidden';
  payloadInput.name = 'payload';
  payloadInput.value = JSON.stringify(payload);
  form.appendChild(payloadInput);

  document.body.appendChild(form);
  form.submit();

  window.setTimeout(() => {
    if (aanvraagWordtVerstuurd) {
      setSubmitState(false);
      showNotice('De Oost Bespoke','We hebben nog geen bevestiging van de server ontvangen. Controleer de Google Sheet of probeer het opnieuw.');
    }
  }, 25000);
}

window.addEventListener('message', function(event){
  const data = event.data || {};
  if (!data || data.type !== 'deoostOrderResult') return;
  setSubmitState(false);
  if (data.ok) {
    showNotice('De Oost Bespoke','Aanvraag ontvangen. Ordernummer: ' + (data.orderId || '—') + (data.warning ? '\n\nLet op: ' + data.warning : ''));
  } else {
    showNotice('De Oost Bespoke','Het versturen is niet gelukt: ' + (data.error || 'onbekende fout'));
  }
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.getElementById('lb').style.display = 'none';
    closeInfoModal();
    closeStoffenBibliotheek();
    closeNotice();
  }
});

function render() {
  renderKledTabs();
  renderNav();
  renderStep();
  renderSummaryPanel();
  renderAantallen();
  updateProgress();
}

renderGelegenheden();
