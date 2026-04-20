// ── Wookieepedia image URLs ────────────────────────────────────────────────────
// All images sourced from starwars.fandom.com via the MediaWiki API.
// Planet images are used as fallbacks when no scene-specific image is available.

const PLANET_IMAGES = {
  'Tatooine':        'https://static.wikia.nocookie.net/starwars/images/b/b0/Tatooine_TPM.png/revision/latest/scale-to-width-down/600?cb=20241209041104',
  'Coruscant':       'https://static.wikia.nocookie.net/starwars/images/8/84/CoruscantGlobeE1.png/revision/latest/scale-to-width-down/600?cb=20240513175137',
  'Naboo':           'https://static.wikia.nocookie.net/starwars/images/f/f0/Naboo_planet.png/revision/latest/scale-to-width-down/600?cb=20251122020213',
  'Mustafar':        'https://static.wikia.nocookie.net/starwars/images/6/61/Mustafar-TROSGG.png/revision/latest/scale-to-width-down/600?cb=20200722072411',
  'Hoth':            'https://static.wikia.nocookie.net/starwars/images/a/a1/Hoth-2024SWHyperspace.png/revision/latest/scale-to-width-down/600?cb=20251122012415',
  'Dagobah':         'https://static.wikia.nocookie.net/starwars/images/7/7d/Dagobah-CGSWG.png/revision/latest/scale-to-width-down/600?cb=20241208214847',
  'Bespin':          'https://static.wikia.nocookie.net/starwars/images/1/11/Bespin-SWCT.png/revision/latest/scale-to-width-down/600?cb=20181010054421',
  'Yavin 4':         'https://static.wikia.nocookie.net/starwars/images/d/d4/Yavin-4-SWCT.png/revision/latest/scale-to-width-down/600?cb=20181015023938',
  'Endor':           'https://static.wikia.nocookie.net/starwars/images/1/1d/Endor_BF2.png/revision/latest/scale-to-width-down/600?cb=20171014232605',
  'Geonosis':        'https://static.wikia.nocookie.net/starwars/images/6/6d/Geonosis_AotC.png/revision/latest/scale-to-width-down/600?cb=20121231120327',
  'Kamino':          'https://static.wikia.nocookie.net/starwars/images/1/1c/Kamino-SWCT.png/revision/latest?cb=20251031043524',
  'Alderaan':        'https://static.wikia.nocookie.net/starwars/images/4/4a/Alderaan.jpg/revision/latest?cb=20061211013805',
  'Kashyyyk':        'https://static.wikia.nocookie.net/starwars/images/e/ea/Kashyyyk-SW-MTHC.png/revision/latest/scale-to-width-down/600?cb=20251122015233',
  'Jakku':           'https://static.wikia.nocookie.net/starwars/images/f/ff/Jakku-PoeDameronFlightLog.png/revision/latest?cb=20251031044441',
  'Ahch-To':         'https://static.wikia.nocookie.net/starwars/images/0/04/Ahch-To_TLJTVD.png/revision/latest?cb=20251031041236',
  'Exegol':          'https://static.wikia.nocookie.net/starwars/images/4/40/Exegol-TROSTGG.png/revision/latest/scale-to-width-down/600?cb=20250131030648',
  'Polis Massa':     'https://static.wikia.nocookie.net/starwars/images/6/60/PolisMassa.png/revision/latest/scale-to-width-down/600?cb=20130205053216',
  'Starkiller Base': 'https://static.wikia.nocookie.net/starwars/images/8/8d/StarkillerBaseCrop-FH.png/revision/latest/scale-to-width-down/600?cb=20220314044340',
  'Crait':           'https://static.wikia.nocookie.net/starwars/images/1/13/Crait_TLJVD.png/revision/latest/scale-to-width-down/600?cb=20190603071432',
  'Pasaana':         'https://static.wikia.nocookie.net/starwars/images/1/1b/Pasaana-TROSGG.png/revision/latest/scale-to-width-down/600?cb=20200321022322',
  'Kef Bir':         'https://static.wikia.nocookie.net/starwars/images/d/d8/KefBir.jpg/revision/latest/scale-to-width-down/600?cb=20200109213910',
  'Kijimi':          'https://static.wikia.nocookie.net/starwars/images/4/4e/Kijimi-TROSTGG.png/revision/latest/scale-to-width-down/600?cb=20230804052601',
  'Cantonica':       'https://static.wikia.nocookie.net/starwars/images/d/da/Cantonica_TLJVD.png/revision/latest/scale-to-width-down/600?cb=20250130064231',
  "D'Qar":           'https://static.wikia.nocookie.net/starwars/images/f/f0/DQar_SWCT.png/revision/latest?cb=20181010053100',
  'Ajan Kloss':      'https://static.wikia.nocookie.net/starwars/images/a/a3/Ajan-Kloss-TROS-GG.png/revision/latest/scale-to-width-down/600?cb=20250106064537',
  'Utapau':          'https://static.wikia.nocookie.net/starwars/images/c/ce/UtapauRotS.png/revision/latest?cb=20160118063015',
  'Takodana':        'https://static.wikia.nocookie.net/starwars/images/f/f6/Tak.png/revision/latest?cb=20251031035110',
};

// ── Scene-specific images ─────────────────────────────────────────────────────
// Key format: "CharacterName:beatIndex"
// When present these override the planet fallback.

const _SCENE = {
  // ── re-usable scene keys ──
  PODRACE:          'https://static.wikia.nocookie.net/starwars/images/d/d9/Boonta_Eve_Podracers.png/revision/latest/scale-to-width-down/600?cb=20130118055046',
  ORDER66:          'https://static.wikia.nocookie.net/starwars/images/4/44/End_Days.jpg/revision/latest/scale-to-width-down/600?cb=20111028234105',
  GEONOSIS_BATTLE:  'https://static.wikia.nocookie.net/starwars/images/e/e4/Battle_of_Geonosis.png/revision/latest/scale-to-width-down/600?cb=20170325151752',
  MUSTAFAR_DUEL:    'https://static.wikia.nocookie.net/starwars/images/8/81/You_Were_My_Friend_AtG_Darren_Tan.png/revision/latest/scale-to-width-down/600?cb=20181210065718',
  BATTLE_YAVIN:     'https://static.wikia.nocookie.net/starwars/images/0/00/Battle_of_Yavin_OFL.png/revision/latest/scale-to-width-down/600?cb=20190217010540',
  BATTLE_HOTH:      'https://static.wikia.nocookie.net/starwars/images/6/67/Battle_of_Hoth.jpg/revision/latest/scale-to-width-down/600?cb=20091202184047',
  CLOUD_CITY_DUEL:  'https://static.wikia.nocookie.net/starwars/images/c/cd/CloudCityDuel-TSWB.png/revision/latest/scale-to-width-down/600?cb=20211226193509',
  RESCUE_HAN:       'https://static.wikia.nocookie.net/starwars/images/4/4a/Khetanna_boom.png/revision/latest/scale-to-width-down/600?cb=20130401045712',
  BATTLE_ENDOR:     'https://static.wikia.nocookie.net/starwars/images/c/cc/BattleOverEndor-RotJAVA.png/revision/latest/scale-to-width-down/600?cb=20250325043022',
  BATTLE_CRAIT:     'https://static.wikia.nocookie.net/starwars/images/1/15/Battle_of_Crait.jpg/revision/latest/scale-to-width-down/600?cb=20171010080932',
  BATTLE_EXEGOL:    'https://static.wikia.nocookie.net/starwars/images/3/30/Battle_of_Exegol.jpg/revision/latest/scale-to-width-down/600?cb=20230129165110',
  BATTLE_CORUSCANT: 'https://static.wikia.nocookie.net/starwars/images/3/34/Spacebattle.jpg/revision/latest/scale-to-width-down/600?cb=20091019154628',
  SENATE_DUEL:      'https://static.wikia.nocookie.net/starwars/images/a/a8/YodaPalpsduel.png/revision/latest/scale-to-width-down/600?cb=20130205183735',
  BATTLE_KASHYYYK:  'https://static.wikia.nocookie.net/starwars/images/a/a9/Cwkashyyykbattle.png/revision/latest/scale-to-width-down/600?cb=20130210053603',
  BATTLE_NABOO:     'https://static.wikia.nocookie.net/starwars/images/7/72/OOM-9b.jpg/revision/latest/scale-to-width-down/600?cb=20111008201653',
  TAKODANA_SKIRMISH:'https://static.wikia.nocookie.net/starwars/images/f/fb/TakodanaEngagement-BFII.png/revision/latest/scale-to-width-down/600?cb=20180206025452',
  // Character portraits (used when no better scene image exists)
  ANAKIN:    'https://static.wikia.nocookie.net/starwars/images/6/6f/Anakin_Skywalker_RotS.png/revision/latest/scale-to-width-down/480?cb=20130621175844',
  LUKE:      'https://static.wikia.nocookie.net/starwars/images/3/3d/LukeSkywalker.png/revision/latest/scale-to-width-down/450?cb=20241221010122',
  LEIA:      'https://static.wikia.nocookie.net/starwars/images/f/f1/Leia_Organa_TROS.png/revision/latest/scale-to-width-down/450?cb=20200102034101',
  HAN:       'https://static.wikia.nocookie.net/starwars/images/e/e2/TFAHanSolo.png/revision/latest/scale-to-width-down/450?cb=20160208055002',
  CHEWIE:    'https://static.wikia.nocookie.net/starwars/images/4/48/Chewbacca_TLJ.png/revision/latest/scale-to-width-down/435?cb=20221108044917',
  OBIWAN:    'https://static.wikia.nocookie.net/starwars/images/4/4e/ObiWanHS-SWE.jpg/revision/latest/scale-to-width-down/450?cb=20111115052816',
  YODA:      'https://static.wikia.nocookie.net/starwars/images/d/d6/Yoda_SWSB.png/revision/latest/scale-to-width-down/500?cb=20150206140125',
  QUIGON:    'https://static.wikia.nocookie.net/starwars/images/f/f6/Qui-Gon_Jinn_Headshot_TPM.jpg/revision/latest/scale-to-width-down/439?cb=20180430174809',
  MACE:      'https://static.wikia.nocookie.net/starwars/images/2/27/MaceWindu_-WoSW.png/revision/latest/scale-to-width-down/473?cb=20220914013358',
  PALPATINE: 'https://static.wikia.nocookie.net/starwars/images/e/e2/Palpatine-CEUEEd.png/revision/latest/scale-to-width-down/500?cb=20250105171652',
  R2D2:      'https://static.wikia.nocookie.net/starwars/images/9/95/R2-D2-TROSOCE.png/revision/latest/scale-to-width-down/396?cb=20240104043013',
  C3PO:      'https://static.wikia.nocookie.net/starwars/images/a/a2/C-3PO-TROSTGG.png/revision/latest/scale-to-width-down/450?cb=20230706042830',
  REY:       'https://static.wikia.nocookie.net/starwars/images/2/2b/Rey_TROS_Fathead.png/revision/latest/scale-to-width-down/391?cb=20231113074423',
  KYLO:      'https://static.wikia.nocookie.net/starwars/images/b/bc/KyloRenVFcover-TROS.png/revision/latest/scale-to-width-down/450?cb=20250126000852',
};

const SCENE_IMAGES = {
  // ── Anakin ──
  'Anakin:0':  _SCENE.PODRACE,
  'Anakin:2':  _SCENE.BATTLE_NABOO,
  'Anakin:6':  _SCENE.GEONOSIS_BATTLE,
  'Anakin:8':  _SCENE.ORDER66,
  'Anakin:9':  _SCENE.MUSTAFAR_DUEL,
  'Anakin:10': _SCENE.ANAKIN,
  'Anakin:11': _SCENE.BATTLE_ENDOR,

  // ── Luke ──
  'Luke:3':  _SCENE.BATTLE_YAVIN,
  'Luke:4':  _SCENE.BATTLE_HOTH,
  'Luke:6':  _SCENE.CLOUD_CITY_DUEL,
  'Luke:7':  _SCENE.RESCUE_HAN,
  'Luke:9':  _SCENE.BATTLE_ENDOR,
  'Luke:11': _SCENE.BATTLE_CRAIT,

  // ── Leia ──
  'Leia:3':  _SCENE.BATTLE_YAVIN,
  'Leia:4':  _SCENE.BATTLE_HOTH,
  'Leia:6':  _SCENE.RESCUE_HAN,
  'Leia:7':  _SCENE.BATTLE_ENDOR,
  'Leia:9':  _SCENE.TAKODANA_SKIRMISH,
  'Leia:10': _SCENE.BATTLE_CRAIT,
  'Leia:11': _SCENE.LEIA,

  // ── Han ──
  'Han:1': _SCENE.BATTLE_YAVIN,
  'Han:2': _SCENE.BATTLE_HOTH,
  'Han:4': _SCENE.RESCUE_HAN,
  'Han:5': _SCENE.BATTLE_ENDOR,
  'Han:6': _SCENE.TAKODANA_SKIRMISH,
  'Han:8': _SCENE.HAN,

  // ── Chewbacca ──
  'Chewbacca:0':  _SCENE.BATTLE_KASHYYYK,
  'Chewbacca:2':  _SCENE.BATTLE_YAVIN,
  'Chewbacca:3':  _SCENE.BATTLE_HOTH,
  'Chewbacca:5':  _SCENE.RESCUE_HAN,
  'Chewbacca:6':  _SCENE.BATTLE_ENDOR,
  'Chewbacca:7':  _SCENE.TAKODANA_SKIRMISH,
  'Chewbacca:10': _SCENE.BATTLE_CRAIT,
  'Chewbacca:12': _SCENE.BATTLE_EXEGOL,

  // ── Obi-Wan ──
  'Obi-Wan:0':  _SCENE.BATTLE_NABOO,
  'Obi-Wan:3':  _SCENE.OBIWAN,
  'Obi-Wan:6':  _SCENE.GEONOSIS_BATTLE,
  'Obi-Wan:7':  _SCENE.BATTLE_CORUSCANT,
  'Obi-Wan:9':  _SCENE.MUSTAFAR_DUEL,
  'Obi-Wan:14': _SCENE.OBIWAN,
  'Obi-Wan:15': _SCENE.BATTLE_ENDOR,

  // ── Yoda ──
  'Yoda:3':  _SCENE.GEONOSIS_BATTLE,
  'Yoda:4':  _SCENE.SENATE_DUEL,
  'Yoda:5':  _SCENE.BATTLE_KASHYYYK,
  'Yoda:10': _SCENE.BATTLE_ENDOR,
  'Yoda:11': _SCENE.YODA,

  // ── Qui-Gon ──
  'Qui-Gon:0': _SCENE.BATTLE_NABOO,
  'Qui-Gon:3': _SCENE.QUIGON,

  // ── Mace ──
  'Mace:2': _SCENE.GEONOSIS_BATTLE,
  'Mace:3': _SCENE.MACE,

  // ── Palpatine ──
  'Palpatine:3': _SCENE.ORDER66,
  'Palpatine:5': _SCENE.BATTLE_ENDOR,
  'Palpatine:6': _SCENE.BATTLE_EXEGOL,

  // ── R2-D2 ──
  'R2-D2:5':  _SCENE.GEONOSIS_BATTLE,
  'R2-D2:6':  _SCENE.BATTLE_CORUSCANT,
  'R2-D2:10': _SCENE.BATTLE_YAVIN,
  'R2-D2:11': _SCENE.BATTLE_HOTH,
  'R2-D2:16': _SCENE.BATTLE_ENDOR,
  'R2-D2:19': _SCENE.BATTLE_CRAIT,
  'R2-D2:21': _SCENE.BATTLE_EXEGOL,

  // ── C-3PO ──
  'C-3PO:2':  _SCENE.GEONOSIS_BATTLE,
  'C-3PO:16': _SCENE.BATTLE_ENDOR,
  'C-3PO:19': _SCENE.BATTLE_EXEGOL,

  // ── Rey ──
  'Rey:1':  _SCENE.TAKODANA_SKIRMISH,
  'Rey:6':  _SCENE.BATTLE_CRAIT,
  'Rey:12': _SCENE.BATTLE_EXEGOL,

  // ── Kylo Ren ──
  'Kylo Ren:1': _SCENE.TAKODANA_SKIRMISH,
  'Kylo Ren:3': _SCENE.BATTLE_CRAIT,
  'Kylo Ren:8': _SCENE.BATTLE_EXEGOL,
};

// ── Lookup helper ─────────────────────────────────────────────────────────────
// Returns the best available image URL: scene-specific → planet → null (CSS art)
function getBeatImage(charName, beatIdx, beat) {
  return SCENE_IMAGES[`${charName}:${beatIdx}`]
      || PLANET_IMAGES[beat.planet]
      || null;
}
