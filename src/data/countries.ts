// ── Geographic Presets: Comprehensive Global Coverage (All 250+ Countries & Major Cities) ──
export interface CityPreset {
  name: string
  center: [number, number]
  label: string
}

export interface CountryPreset {
  code: string
  name: string
  cities: CityPreset[]
}

export const COUNTRY_PRESETS: CountryPreset[] = [
  {
    "code": "AF",
    "name": "Afghanistan",
    "cities": [
      {
        "name": "Andkhoy",
        "center": [
          36.95293,
          65.12376
        ],
        "label": "Andkhoy"
      },
      {
        "name": "Asadabad",
        "center": [
          34.87311,
          71.14697
        ],
        "label": "Asadabad"
      },
      {
        "name": "Ashkāsham",
        "center": [
          36.68333,
          71.53333
        ],
        "label": "Ashkāsham"
      },
      {
        "name": "Aībak",
        "center": [
          36.26468,
          68.01551
        ],
        "label": "Aībak"
      },
      {
        "name": "Baghlān",
        "center": [
          36.13068,
          68.70829
        ],
        "label": "Baghlān"
      },
      {
        "name": "Balkh",
        "center": [
          36.75635,
          66.8972
        ],
        "label": "Balkh"
      },
      {
        "name": "Baraki Barak",
        "center": [
          33.96744,
          68.9492
        ],
        "label": "Baraki Barak"
      },
      {
        "name": "Bāmyān",
        "center": [
          34.82156,
          67.82734
        ],
        "label": "Bāmyān"
      },
      {
        "name": "Bāsawul",
        "center": [
          34.24749,
          70.87218
        ],
        "label": "Bāsawul"
      },
      {
        "name": "Bāzārak",
        "center": [
          35.31292,
          69.51519
        ],
        "label": "Bāzārak"
      },
      {
        "name": "Chahār Burj",
        "center": [
          34.24475,
          62.19165
        ],
        "label": "Chahār Burj"
      },
      {
        "name": "Charikar",
        "center": [
          35.01361,
          69.17139
        ],
        "label": "Charikar"
      },
      {
        "name": "Chīras",
        "center": [
          35.41674,
          65.98234
        ],
        "label": "Chīras"
      },
      {
        "name": "Darzāb",
        "center": [
          35.97744,
          65.37828
        ],
        "label": "Darzāb"
      },
      {
        "name": "Dasht-e Archī",
        "center": [
          37.13333,
          69.16667
        ],
        "label": "Dasht-e Archī"
      },
      {
        "name": "Dowlatābād",
        "center": [
          36.98821,
          66.82069
        ],
        "label": "Dowlatābād"
      },
      {
        "name": "Farah",
        "center": [
          32.37451,
          62.11638
        ],
        "label": "Farah"
      },
      {
        "name": "Fayrōz Kōh",
        "center": [
          34.51952,
          65.25093
        ],
        "label": "Fayrōz Kōh"
      },
      {
        "name": "Fayzabad",
        "center": [
          37.11664,
          70.58002
        ],
        "label": "Fayzabad"
      },
      {
        "name": "Gardez",
        "center": [
          33.59744,
          69.22592
        ],
        "label": "Gardez"
      }
    ]
  },
  {
    "code": "AX",
    "name": "Aland Islands",
    "cities": [
      {
        "name": "Aland Islands City",
        "center": [
          60.116667,
          19.9
        ],
        "label": "Aland Islands (Capital / Main)"
      }
    ]
  },
  {
    "code": "AL",
    "name": "Albania",
    "cities": [
      {
        "name": "Bajram Curri",
        "center": [
          42.35734,
          20.07679
        ],
        "label": "Bajram Curri"
      },
      {
        "name": "Ballsh",
        "center": [
          40.59889,
          19.73472
        ],
        "label": "Ballsh"
      },
      {
        "name": "Banaj",
        "center": [
          40.82492,
          19.84074
        ],
        "label": "Banaj"
      },
      {
        "name": "Bashkia Berat",
        "center": [
          40.69997,
          19.94983
        ],
        "label": "Bashkia Berat"
      },
      {
        "name": "Bashkia Bulqizë",
        "center": [
          41.47152,
          20.33192
        ],
        "label": "Bashkia Bulqizë"
      },
      {
        "name": "Bashkia Devoll",
        "center": [
          40.60078,
          20.93814
        ],
        "label": "Bashkia Devoll"
      },
      {
        "name": "Bashkia Divjakë",
        "center": [
          40.95716,
          19.52364
        ],
        "label": "Bashkia Divjakë"
      },
      {
        "name": "Bashkia Dropull",
        "center": [
          39.98584,
          20.30529
        ],
        "label": "Bashkia Dropull"
      },
      {
        "name": "Bashkia Durrës",
        "center": [
          41.42743,
          19.4869
        ],
        "label": "Bashkia Durrës"
      },
      {
        "name": "Bashkia Fier",
        "center": [
          40.72937,
          19.4869
        ],
        "label": "Bashkia Fier"
      },
      {
        "name": "Bashkia Finiq",
        "center": [
          39.84393,
          20.16659
        ],
        "label": "Bashkia Finiq"
      },
      {
        "name": "Bashkia Himarë",
        "center": [
          40.11581,
          19.81389
        ],
        "label": "Bashkia Himarë"
      },
      {
        "name": "Bashkia Kavajë",
        "center": [
          41.18127,
          19.55579
        ],
        "label": "Bashkia Kavajë"
      },
      {
        "name": "Bashkia Kelcyrë",
        "center": [
          40.36196,
          20.16476
        ],
        "label": "Bashkia Kelcyrë"
      },
      {
        "name": "Bashkia Klos",
        "center": [
          41.50826,
          20.07107
        ],
        "label": "Bashkia Klos"
      },
      {
        "name": "Bashkia Kolonjë",
        "center": [
          40.3142,
          20.61482
        ],
        "label": "Bashkia Kolonjë"
      },
      {
        "name": "Bashkia Konispol",
        "center": [
          39.70064,
          20.13353
        ],
        "label": "Bashkia Konispol"
      },
      {
        "name": "Bashkia Krujë",
        "center": [
          41.50091,
          19.72571
        ],
        "label": "Bashkia Krujë"
      },
      {
        "name": "Bashkia Kurbin",
        "center": [
          41.62215,
          19.70734
        ],
        "label": "Bashkia Kurbin"
      },
      {
        "name": "Bashkia Kuçovë",
        "center": [
          40.82489,
          19.9535
        ],
        "label": "Bashkia Kuçovë"
      }
    ]
  },
  {
    "code": "DZ",
    "name": "Algeria",
    "cities": [
      {
        "name": "Abou el Hassan",
        "center": [
          36.41657,
          1.19616
        ],
        "label": "Abou el Hassan"
      },
      {
        "name": "Adrar",
        "center": [
          27.87429,
          -0.29388
        ],
        "label": "Adrar"
      },
      {
        "name": "Aflou",
        "center": [
          34.11279,
          2.10228
        ],
        "label": "Aflou"
      },
      {
        "name": "Akbou",
        "center": [
          36.4575,
          4.53494
        ],
        "label": "Akbou"
      },
      {
        "name": "Algiers",
        "center": [
          36.73225,
          3.08746
        ],
        "label": "Algiers"
      },
      {
        "name": "Amizour",
        "center": [
          36.64022,
          4.90131
        ],
        "label": "Amizour"
      },
      {
        "name": "Ammi Moussa",
        "center": [
          35.86781,
          1.11143
        ],
        "label": "Ammi Moussa"
      },
      {
        "name": "Annaba",
        "center": [
          36.9,
          7.76667
        ],
        "label": "Annaba"
      },
      {
        "name": "Aoulef",
        "center": [
          26.96667,
          1.08333
        ],
        "label": "Aoulef"
      },
      {
        "name": "Arbatache",
        "center": [
          36.63773,
          3.37127
        ],
        "label": "Arbatache"
      },
      {
        "name": "Arhribs",
        "center": [
          36.79361,
          4.31158
        ],
        "label": "Arhribs"
      },
      {
        "name": "Arris",
        "center": [
          35.25881,
          6.34706
        ],
        "label": "Arris"
      },
      {
        "name": "Azazga",
        "center": [
          36.74472,
          4.37222
        ],
        "label": "Azazga"
      },
      {
        "name": "Azzaba",
        "center": [
          36.73944,
          7.10528
        ],
        "label": "Azzaba"
      },
      {
        "name": "Aïn Arnat",
        "center": [
          36.18683,
          5.31347
        ],
        "label": "Aïn Arnat"
      },
      {
        "name": "Aïn Bessem",
        "center": [
          36.29333,
          3.67319
        ],
        "label": "Aïn Bessem"
      },
      {
        "name": "Aïn Beïda",
        "center": [
          35.79639,
          7.39278
        ],
        "label": "Aïn Beïda"
      },
      {
        "name": "Aïn Defla",
        "center": [
          36.26405,
          1.9679
        ],
        "label": "Aïn Defla"
      },
      {
        "name": "Aïn El Berd District",
        "center": [
          35.35,
          -0.51667
        ],
        "label": "Aïn El Berd District"
      },
      {
        "name": "Aïn Fakroun",
        "center": [
          35.97108,
          6.87374
        ],
        "label": "Aïn Fakroun"
      }
    ]
  },
  {
    "code": "AS",
    "name": "American Samoa",
    "cities": [
      {
        "name": "American Samoa City",
        "center": [
          -14.33333333,
          -170
        ],
        "label": "American Samoa (Capital / Main)"
      }
    ]
  },
  {
    "code": "AD",
    "name": "Andorra",
    "cities": [
      {
        "name": "Andorra la Vella",
        "center": [
          42.50779,
          1.52109
        ],
        "label": "Andorra la Vella"
      },
      {
        "name": "Arinsal",
        "center": [
          42.57205,
          1.48453
        ],
        "label": "Arinsal"
      },
      {
        "name": "Canillo",
        "center": [
          42.5676,
          1.59756
        ],
        "label": "Canillo"
      },
      {
        "name": "El Tarter",
        "center": [
          42.57952,
          1.65362
        ],
        "label": "El Tarter"
      },
      {
        "name": "Encamp",
        "center": [
          42.53474,
          1.58014
        ],
        "label": "Encamp"
      },
      {
        "name": "Ordino",
        "center": [
          42.55623,
          1.53319
        ],
        "label": "Ordino"
      },
      {
        "name": "Pas de la Casa",
        "center": [
          42.54277,
          1.73361
        ],
        "label": "Pas de la Casa"
      },
      {
        "name": "Sant Julià de Lòria",
        "center": [
          42.46372,
          1.49129
        ],
        "label": "Sant Julià de Lòria"
      },
      {
        "name": "la Massana",
        "center": [
          42.54499,
          1.51483
        ],
        "label": "la Massana"
      },
      {
        "name": "les Escaldes",
        "center": [
          42.50729,
          1.53414
        ],
        "label": "les Escaldes"
      }
    ]
  },
  {
    "code": "AO",
    "name": "Angola",
    "cities": [
      {
        "name": "Belas",
        "center": [
          -9.06875,
          13.16072
        ],
        "label": "Belas"
      },
      {
        "name": "Benguela",
        "center": [
          -12.57626,
          13.40547
        ],
        "label": "Benguela"
      },
      {
        "name": "Cabinda",
        "center": [
          -5.55,
          12.2
        ],
        "label": "Cabinda"
      },
      {
        "name": "Caconda",
        "center": [
          -13.73333,
          15.06667
        ],
        "label": "Caconda"
      },
      {
        "name": "Caluquembe",
        "center": [
          -13.92093,
          14.53476
        ],
        "label": "Caluquembe"
      },
      {
        "name": "Camabatela",
        "center": [
          -8.18812,
          15.37495
        ],
        "label": "Camabatela"
      },
      {
        "name": "Camacupa",
        "center": [
          -12.01667,
          17.48333
        ],
        "label": "Camacupa"
      },
      {
        "name": "Catabola",
        "center": [
          -12.15,
          17.28333
        ],
        "label": "Catabola"
      },
      {
        "name": "Catumbela",
        "center": [
          -12.43002,
          13.54677
        ],
        "label": "Catumbela"
      },
      {
        "name": "Caxito",
        "center": [
          -8.57848,
          13.66425
        ],
        "label": "Caxito"
      },
      {
        "name": "Cazaji",
        "center": [
          -11.06715,
          20.70148
        ],
        "label": "Cazaji"
      },
      {
        "name": "Caála",
        "center": [
          -12.8525,
          15.56056
        ],
        "label": "Caála"
      },
      {
        "name": "Chela",
        "center": [
          -12.30261,
          15.43358
        ],
        "label": "Chela"
      },
      {
        "name": "Chibia",
        "center": [
          -15.23657,
          13.88468
        ],
        "label": "Chibia"
      },
      {
        "name": "Chicomba",
        "center": [
          -14.30788,
          14.98672
        ],
        "label": "Chicomba"
      },
      {
        "name": "Chipindo",
        "center": [
          -13.8683,
          15.73277
        ],
        "label": "Chipindo"
      },
      {
        "name": "Chissamba",
        "center": [
          -12.16667,
          17.33333
        ],
        "label": "Chissamba"
      },
      {
        "name": "Cuito",
        "center": [
          -12.38333,
          16.93333
        ],
        "label": "Cuito"
      },
      {
        "name": "Cuvango",
        "center": [
          -14.27693,
          16.31475
        ],
        "label": "Cuvango"
      },
      {
        "name": "Gambos",
        "center": [
          -15.80926,
          14.07661
        ],
        "label": "Gambos"
      }
    ]
  },
  {
    "code": "AI",
    "name": "Anguilla",
    "cities": [
      {
        "name": "Anguilla City",
        "center": [
          18.25,
          -63.16666666
        ],
        "label": "Anguilla (Capital / Main)"
      }
    ]
  },
  {
    "code": "AQ",
    "name": "Antarctica",
    "cities": [
      {
        "name": "Antarctica City",
        "center": [
          -74.65,
          4.48
        ],
        "label": "Antarctica (Capital / Main)"
      }
    ]
  },
  {
    "code": "AG",
    "name": "Antigua And Barbuda",
    "cities": [
      {
        "name": "All Saints",
        "center": [
          17.06671,
          -61.79303
        ],
        "label": "All Saints"
      },
      {
        "name": "Bolands",
        "center": [
          17.06565,
          -61.87466
        ],
        "label": "Bolands"
      },
      {
        "name": "Codrington",
        "center": [
          17.63333,
          -61.83333
        ],
        "label": "Codrington"
      },
      {
        "name": "Falmouth",
        "center": [
          17.02741,
          -61.78136
        ],
        "label": "Falmouth"
      },
      {
        "name": "Liberta",
        "center": [
          17.04141,
          -61.79052
        ],
        "label": "Liberta"
      },
      {
        "name": "Parham",
        "center": [
          17.09682,
          -61.77046
        ],
        "label": "Parham"
      },
      {
        "name": "Piggotts",
        "center": [
          17.11667,
          -61.8
        ],
        "label": "Piggotts"
      },
      {
        "name": "Potters Village",
        "center": [
          17.11337,
          -61.81962
        ],
        "label": "Potters Village"
      },
      {
        "name": "Saint John’s",
        "center": [
          17.12096,
          -61.84329
        ],
        "label": "Saint John’s"
      }
    ]
  },
  {
    "code": "AR",
    "name": "Argentina",
    "cities": [
      {
        "name": "28 de Noviembre",
        "center": [
          -51.5839,
          -72.21382
        ],
        "label": "28 de Noviembre"
      },
      {
        "name": "Abra Pampa",
        "center": [
          -22.72049,
          -65.69697
        ],
        "label": "Abra Pampa"
      },
      {
        "name": "Achiras",
        "center": [
          -33.17538,
          -64.99331
        ],
        "label": "Achiras"
      },
      {
        "name": "Adelia María",
        "center": [
          -33.63152,
          -64.02097
        ],
        "label": "Adelia María"
      },
      {
        "name": "Agua de Oro",
        "center": [
          -31.06661,
          -64.30017
        ],
        "label": "Agua de Oro"
      },
      {
        "name": "Aguilares",
        "center": [
          -27.4338,
          -65.61427
        ],
        "label": "Aguilares"
      },
      {
        "name": "Alba Posse",
        "center": [
          -27.56978,
          -54.68262
        ],
        "label": "Alba Posse"
      },
      {
        "name": "Albardón",
        "center": [
          -31.43722,
          -68.52556
        ],
        "label": "Albardón"
      },
      {
        "name": "Aldea San Antonio",
        "center": [
          -32.62317,
          -58.70512
        ],
        "label": "Aldea San Antonio"
      },
      {
        "name": "Alderetes",
        "center": [
          -26.81667,
          -65.13333
        ],
        "label": "Alderetes"
      },
      {
        "name": "Alejandro Roca",
        "center": [
          -33.35369,
          -63.71849
        ],
        "label": "Alejandro Roca"
      },
      {
        "name": "Alejo Ledesma",
        "center": [
          -33.60643,
          -62.62304
        ],
        "label": "Alejo Ledesma"
      },
      {
        "name": "Allen",
        "center": [
          -38.97736,
          -67.82714
        ],
        "label": "Allen"
      },
      {
        "name": "Almafuerte",
        "center": [
          -27.50825,
          -55.40258
        ],
        "label": "Almafuerte"
      },
      {
        "name": "Alpachiri",
        "center": [
          -37.37704,
          -63.77445
        ],
        "label": "Alpachiri"
      },
      {
        "name": "Alta Gracia",
        "center": [
          -31.65292,
          -64.42826
        ],
        "label": "Alta Gracia"
      },
      {
        "name": "Alta Italia",
        "center": [
          -35.3335,
          -64.11496
        ],
        "label": "Alta Italia"
      },
      {
        "name": "Alto Río Senguer",
        "center": [
          -45.04105,
          -70.81982
        ],
        "label": "Alto Río Senguer"
      },
      {
        "name": "Altos de Chipión",
        "center": [
          -30.9559,
          -62.33727
        ],
        "label": "Altos de Chipión"
      },
      {
        "name": "Aluminé",
        "center": [
          -39.23686,
          -70.9197
        ],
        "label": "Aluminé"
      }
    ]
  },
  {
    "code": "AM",
    "name": "Armenia",
    "cities": [
      {
        "name": "Abovyan",
        "center": [
          40.04851,
          44.54742
        ],
        "label": "Abovyan"
      },
      {
        "name": "Agarak",
        "center": [
          41.01072,
          44.46845
        ],
        "label": "Agarak"
      },
      {
        "name": "Agarakadzor",
        "center": [
          39.73608,
          45.35553
        ],
        "label": "Agarakadzor"
      },
      {
        "name": "Agarakavan",
        "center": [
          40.33069,
          44.07233
        ],
        "label": "Agarakavan"
      },
      {
        "name": "Aghavnadzor",
        "center": [
          40.58195,
          44.69581
        ],
        "label": "Aghavnadzor"
      },
      {
        "name": "Aghavnatun",
        "center": [
          40.2333,
          44.25295
        ],
        "label": "Aghavnatun"
      },
      {
        "name": "Akht’ala",
        "center": [
          41.16838,
          44.75811
        ],
        "label": "Akht’ala"
      },
      {
        "name": "Akhuryan",
        "center": [
          40.78003,
          43.90027
        ],
        "label": "Akhuryan"
      },
      {
        "name": "Aknalich",
        "center": [
          40.14728,
          44.16669
        ],
        "label": "Aknalich"
      },
      {
        "name": "Aknashen",
        "center": [
          40.09551,
          44.28604
        ],
        "label": "Aknashen"
      },
      {
        "name": "Akner",
        "center": [
          39.53491,
          46.30732
        ],
        "label": "Akner"
      },
      {
        "name": "Akunk’",
        "center": [
          40.15886,
          45.72568
        ],
        "label": "Akunk’"
      },
      {
        "name": "Alashkert",
        "center": [
          40.10712,
          44.05108
        ],
        "label": "Alashkert"
      },
      {
        "name": "Alaverdi",
        "center": [
          41.09766,
          44.67316
        ],
        "label": "Alaverdi"
      },
      {
        "name": "Amasia",
        "center": [
          40.95442,
          43.7872
        ],
        "label": "Amasia"
      },
      {
        "name": "Angeghakot’",
        "center": [
          39.56952,
          45.94452
        ],
        "label": "Angeghakot’"
      },
      {
        "name": "Anushavan",
        "center": [
          40.65008,
          43.98053
        ],
        "label": "Anushavan"
      },
      {
        "name": "Apaga",
        "center": [
          40.09729,
          44.25293
        ],
        "label": "Apaga"
      },
      {
        "name": "Aparan",
        "center": [
          40.59323,
          44.3589
        ],
        "label": "Aparan"
      },
      {
        "name": "Arabkir",
        "center": [
          40.20549,
          44.50699
        ],
        "label": "Arabkir"
      }
    ]
  },
  {
    "code": "AW",
    "name": "Aruba",
    "cities": [
      {
        "name": "Oranjestad",
        "center": [
          12.5211,
          -70.0355
        ],
        "label": "Oranjestad"
      }
    ]
  },
  {
    "code": "AU",
    "name": "Australia",
    "cities": [
      {
        "name": "Sydney, NSW",
        "center": [
          -33.8688,
          151.2093
        ],
        "label": "Sydney, NSW"
      },
      {
        "name": "Melbourne, VIC",
        "center": [
          -37.8136,
          144.9631
        ],
        "label": "Melbourne, VIC"
      },
      {
        "name": "Brisbane, QLD",
        "center": [
          -27.4698,
          153.0251
        ],
        "label": "Brisbane, QLD"
      },
      {
        "name": "Perth, WA",
        "center": [
          -31.9505,
          115.8605
        ],
        "label": "Perth, WA"
      },
      {
        "name": "Adelaide, SA",
        "center": [
          -34.9285,
          138.6007
        ],
        "label": "Adelaide, SA"
      },
      {
        "name": "Gold Coast, QLD",
        "center": [
          -28.0167,
          153.4
        ],
        "label": "Gold Coast, QLD"
      },
      {
        "name": "Canberra, ACT",
        "center": [
          -35.2809,
          149.13
        ],
        "label": "Canberra, ACT"
      },
      {
        "name": "Newcastle, NSW",
        "center": [
          -32.9283,
          151.7817
        ],
        "label": "Newcastle, NSW"
      }
    ]
  },
  {
    "code": "AT",
    "name": "Austria",
    "cities": [
      {
        "name": "Abfaltersbach",
        "center": [
          46.75715,
          12.52828
        ],
        "label": "Abfaltersbach"
      },
      {
        "name": "Absam",
        "center": [
          47.29572,
          11.50593
        ],
        "label": "Absam"
      },
      {
        "name": "Absdorf",
        "center": [
          48.40021,
          15.97874
        ],
        "label": "Absdorf"
      },
      {
        "name": "Abtenau",
        "center": [
          47.56373,
          13.34599
        ],
        "label": "Abtenau"
      },
      {
        "name": "Abtissendorf",
        "center": [
          46.99583,
          15.45639
        ],
        "label": "Abtissendorf"
      },
      {
        "name": "Abwinden",
        "center": [
          48.25903,
          14.42625
        ],
        "label": "Abwinden"
      },
      {
        "name": "Achau",
        "center": [
          48.08026,
          16.38611
        ],
        "label": "Achau"
      },
      {
        "name": "Achenkirch",
        "center": [
          47.52659,
          11.70559
        ],
        "label": "Achenkirch"
      },
      {
        "name": "Aderklaa",
        "center": [
          48.28333,
          16.53333
        ],
        "label": "Aderklaa"
      },
      {
        "name": "Adlwang",
        "center": [
          47.99245,
          14.21742
        ],
        "label": "Adlwang"
      },
      {
        "name": "Admont",
        "center": [
          47.57537,
          14.46075
        ],
        "label": "Admont"
      },
      {
        "name": "Adnet",
        "center": [
          47.69746,
          13.13115
        ],
        "label": "Adnet"
      },
      {
        "name": "Afiesl",
        "center": [
          48.58229,
          14.12777
        ],
        "label": "Afiesl"
      },
      {
        "name": "Aflenz Kurort",
        "center": [
          47.54211,
          15.23898
        ],
        "label": "Aflenz Kurort"
      },
      {
        "name": "Aggsbach",
        "center": [
          48.29404,
          15.40382
        ],
        "label": "Aggsbach"
      },
      {
        "name": "Ahorn",
        "center": [
          48.52382,
          14.17408
        ],
        "label": "Ahorn"
      },
      {
        "name": "Aibl",
        "center": [
          46.68145,
          15.22619
        ],
        "label": "Aibl"
      },
      {
        "name": "Aichkirchen",
        "center": [
          48.10944,
          13.79158
        ],
        "label": "Aichkirchen"
      },
      {
        "name": "Aigen im Ennstal",
        "center": [
          47.51667,
          14.13333
        ],
        "label": "Aigen im Ennstal"
      },
      {
        "name": "Aigen im Mühlkreis",
        "center": [
          48.64578,
          13.97109
        ],
        "label": "Aigen im Mühlkreis"
      }
    ]
  },
  {
    "code": "AZ",
    "name": "Azerbaijan",
    "cities": [
      {
        "name": "Agdzhabedy",
        "center": [
          40.05015,
          47.45937
        ],
        "label": "Agdzhabedy"
      },
      {
        "name": "Aghstafa",
        "center": [
          41.11889,
          45.45389
        ],
        "label": "Aghstafa"
      },
      {
        "name": "Aghsu",
        "center": [
          40.57028,
          48.40087
        ],
        "label": "Aghsu"
      },
      {
        "name": "Aliabad",
        "center": [
          41.4829,
          46.63483
        ],
        "label": "Aliabad"
      },
      {
        "name": "Altıağac",
        "center": [
          40.85785,
          48.9354
        ],
        "label": "Altıağac"
      },
      {
        "name": "Amirdzhan",
        "center": [
          40.42639,
          49.98361
        ],
        "label": "Amirdzhan"
      },
      {
        "name": "Aran",
        "center": [
          40.62528,
          46.97556
        ],
        "label": "Aran"
      },
      {
        "name": "Arıqdam",
        "center": [
          40.59313,
          45.799
        ],
        "label": "Arıqdam"
      },
      {
        "name": "Arıqıran",
        "center": [
          40.53971,
          45.61414
        ],
        "label": "Arıqıran"
      },
      {
        "name": "Askyaran",
        "center": [
          39.9391,
          46.83161
        ],
        "label": "Askyaran"
      },
      {
        "name": "Astara",
        "center": [
          38.45598,
          48.87498
        ],
        "label": "Astara"
      },
      {
        "name": "Avşar",
        "center": [
          39.97389,
          47.42389
        ],
        "label": "Avşar"
      },
      {
        "name": "Ağdam",
        "center": [
          39.99096,
          46.92736
        ],
        "label": "Ağdam"
      },
      {
        "name": "Ağdaş",
        "center": [
          40.64699,
          47.4738
        ],
        "label": "Ağdaş"
      },
      {
        "name": "Badamdar",
        "center": [
          40.34024,
          49.8045
        ],
        "label": "Badamdar"
      },
      {
        "name": "Baku",
        "center": [
          40.37767,
          49.89201
        ],
        "label": "Baku"
      },
      {
        "name": "Bakıxanov",
        "center": [
          40.41894,
          49.96693
        ],
        "label": "Bakıxanov"
      },
      {
        "name": "Balakhani",
        "center": [
          40.46344,
          49.91893
        ],
        "label": "Balakhani"
      },
      {
        "name": "Barda",
        "center": [
          40.37577,
          47.12619
        ],
        "label": "Barda"
      },
      {
        "name": "Basqal",
        "center": [
          40.7552,
          48.39104
        ],
        "label": "Basqal"
      }
    ]
  },
  {
    "code": "BH",
    "name": "Bahrain",
    "cities": [
      {
        "name": "Al Muharraq",
        "center": [
          26.25722,
          50.61194
        ],
        "label": "Al Muharraq"
      },
      {
        "name": "Al Ḩadd",
        "center": [
          26.24556,
          50.65417
        ],
        "label": "Al Ḩadd"
      },
      {
        "name": "Ar Rifā‘",
        "center": [
          26.13,
          50.555
        ],
        "label": "Ar Rifā‘"
      },
      {
        "name": "Dār Kulayb",
        "center": [
          26.06861,
          50.50389
        ],
        "label": "Dār Kulayb"
      },
      {
        "name": "Jidd Ḩafş",
        "center": [
          26.21861,
          50.54778
        ],
        "label": "Jidd Ḩafş"
      },
      {
        "name": "Madīnat Ḩamad",
        "center": [
          26.11528,
          50.50694
        ],
        "label": "Madīnat Ḩamad"
      },
      {
        "name": "Madīnat ‘Īsá",
        "center": [
          26.17361,
          50.54778
        ],
        "label": "Madīnat ‘Īsá"
      },
      {
        "name": "Manama",
        "center": [
          26.22787,
          50.58565
        ],
        "label": "Manama"
      },
      {
        "name": "Sitrah",
        "center": [
          26.15472,
          50.62056
        ],
        "label": "Sitrah"
      }
    ]
  },
  {
    "code": "BD",
    "name": "Bangladesh",
    "cities": [
      {
        "name": "Azimpur",
        "center": [
          23.7298,
          90.3854
        ],
        "label": "Azimpur"
      },
      {
        "name": "Badarganj",
        "center": [
          25.67419,
          89.05377
        ],
        "label": "Badarganj"
      },
      {
        "name": "Bagerhat",
        "center": [
          22.4,
          89.75
        ],
        "label": "Bagerhat"
      },
      {
        "name": "Bandarban",
        "center": [
          22,
          92.33333
        ],
        "label": "Bandarban"
      },
      {
        "name": "Baniachang",
        "center": [
          24.51863,
          91.35787
        ],
        "label": "Baniachang"
      },
      {
        "name": "Barguna",
        "center": [
          22.13333,
          90.13333
        ],
        "label": "Barguna"
      },
      {
        "name": "Barisal",
        "center": [
          22.8,
          90.5
        ],
        "label": "Barisal"
      },
      {
        "name": "Bera",
        "center": [
          24.07821,
          89.63262
        ],
        "label": "Bera"
      },
      {
        "name": "Bhairab Bāzār",
        "center": [
          24.0524,
          90.9764
        ],
        "label": "Bhairab Bāzār"
      },
      {
        "name": "Bherāmāra",
        "center": [
          24.02452,
          88.99234
        ],
        "label": "Bherāmāra"
      },
      {
        "name": "Bhola",
        "center": [
          22.36667,
          90.81667
        ],
        "label": "Bhola"
      },
      {
        "name": "Bhāndāria",
        "center": [
          22.48898,
          90.06273
        ],
        "label": "Bhāndāria"
      },
      {
        "name": "Bhātpāra Abhaynagar",
        "center": [
          23.01472,
          89.43936
        ],
        "label": "Bhātpāra Abhaynagar"
      },
      {
        "name": "Bibir Hat",
        "center": [
          22.68347,
          91.79058
        ],
        "label": "Bibir Hat"
      },
      {
        "name": "Bogra",
        "center": [
          24.78333,
          89.35
        ],
        "label": "Bogra"
      },
      {
        "name": "Brahmanbaria",
        "center": [
          23.98333,
          91.16667
        ],
        "label": "Brahmanbaria"
      },
      {
        "name": "Burhānuddin",
        "center": [
          22.49518,
          90.72391
        ],
        "label": "Burhānuddin"
      },
      {
        "name": "Bājitpur",
        "center": [
          24.21623,
          90.95002
        ],
        "label": "Bājitpur"
      },
      {
        "name": "Chandpur",
        "center": [
          23.25,
          90.83333
        ],
        "label": "Chandpur"
      },
      {
        "name": "Chapai Nababganj",
        "center": [
          24.68333,
          88.25
        ],
        "label": "Chapai Nababganj"
      }
    ]
  },
  {
    "code": "BB",
    "name": "Barbados",
    "cities": [
      {
        "name": "Bathsheba",
        "center": [
          13.21133,
          -59.52596
        ],
        "label": "Bathsheba"
      },
      {
        "name": "Bridgetown",
        "center": [
          13.10732,
          -59.62021
        ],
        "label": "Bridgetown"
      },
      {
        "name": "Crane",
        "center": [
          13.10487,
          -59.44861
        ],
        "label": "Crane"
      },
      {
        "name": "Greenland",
        "center": [
          13.25808,
          -59.57763
        ],
        "label": "Greenland"
      },
      {
        "name": "Holetown",
        "center": [
          13.18672,
          -59.63808
        ],
        "label": "Holetown"
      },
      {
        "name": "Oistins",
        "center": [
          13.07067,
          -59.54637
        ],
        "label": "Oistins"
      },
      {
        "name": "Speightstown",
        "center": [
          13.25072,
          -59.64396
        ],
        "label": "Speightstown"
      }
    ]
  },
  {
    "code": "BY",
    "name": "Belarus",
    "cities": [
      {
        "name": "Aktsyabrski",
        "center": [
          52.644,
          28.8801
        ],
        "label": "Aktsyabrski"
      },
      {
        "name": "Antopal’",
        "center": [
          52.2038,
          24.7863
        ],
        "label": "Antopal’"
      },
      {
        "name": "Ashmyanski Rayon",
        "center": [
          54.41667,
          25.91667
        ],
        "label": "Ashmyanski Rayon"
      },
      {
        "name": "Ashmyany",
        "center": [
          54.421,
          25.936
        ],
        "label": "Ashmyany"
      },
      {
        "name": "Asipovichy",
        "center": [
          53.3011,
          28.6386
        ],
        "label": "Asipovichy"
      },
      {
        "name": "Asipovitski Rayon",
        "center": [
          53.33333,
          28.75
        ],
        "label": "Asipovitski Rayon"
      },
      {
        "name": "Asnyezhytsy",
        "center": [
          52.1891,
          26.1299
        ],
        "label": "Asnyezhytsy"
      },
      {
        "name": "Astrashytski Haradok",
        "center": [
          54.0651,
          27.695
        ],
        "label": "Astrashytski Haradok"
      },
      {
        "name": "Astravyets",
        "center": [
          54.61378,
          25.95537
        ],
        "label": "Astravyets"
      },
      {
        "name": "Astravyetski Rayon",
        "center": [
          54.66667,
          26
        ],
        "label": "Astravyetski Rayon"
      },
      {
        "name": "Atolina",
        "center": [
          53.7817,
          27.4346
        ],
        "label": "Atolina"
      },
      {
        "name": "Azyartso",
        "center": [
          53.8397,
          27.3917
        ],
        "label": "Azyartso"
      },
      {
        "name": "Babruysk",
        "center": [
          53.1384,
          29.2214
        ],
        "label": "Babruysk"
      },
      {
        "name": "Babruyski Rayon",
        "center": [
          53.08333,
          29.16667
        ],
        "label": "Babruyski Rayon"
      },
      {
        "name": "Balbasava",
        "center": [
          54.4207,
          30.2909
        ],
        "label": "Balbasava"
      },
      {
        "name": "Bal’shavik",
        "center": [
          54.0036,
          27.5669
        ],
        "label": "Bal’shavik"
      },
      {
        "name": "Baranovichi",
        "center": [
          53.1327,
          26.0139
        ],
        "label": "Baranovichi"
      },
      {
        "name": "Baranovichskiy Rayon",
        "center": [
          53.16667,
          25.83333
        ],
        "label": "Baranovichskiy Rayon"
      },
      {
        "name": "Baran’",
        "center": [
          54.4784,
          30.3159
        ],
        "label": "Baran’"
      },
      {
        "name": "Baruny",
        "center": [
          54.3171,
          26.1376
        ],
        "label": "Baruny"
      }
    ]
  },
  {
    "code": "BE",
    "name": "Belgium",
    "cities": [
      {
        "name": "Aalst",
        "center": [
          50.93604,
          4.0355
        ],
        "label": "Aalst"
      },
      {
        "name": "Aalter",
        "center": [
          51.09017,
          3.44693
        ],
        "label": "Aalter"
      },
      {
        "name": "Aarschot",
        "center": [
          50.98715,
          4.83695
        ],
        "label": "Aarschot"
      },
      {
        "name": "Aartselaar",
        "center": [
          51.13412,
          4.38678
        ],
        "label": "Aartselaar"
      },
      {
        "name": "Aiseau",
        "center": [
          50.41158,
          4.58671
        ],
        "label": "Aiseau"
      },
      {
        "name": "Alken",
        "center": [
          50.87553,
          5.30558
        ],
        "label": "Alken"
      },
      {
        "name": "Alveringem",
        "center": [
          51.01238,
          2.71117
        ],
        "label": "Alveringem"
      },
      {
        "name": "Amay",
        "center": [
          50.54829,
          5.30974
        ],
        "label": "Amay"
      },
      {
        "name": "Amblève",
        "center": [
          50.35357,
          6.17002
        ],
        "label": "Amblève"
      },
      {
        "name": "Andenne",
        "center": [
          50.48941,
          5.09513
        ],
        "label": "Andenne"
      },
      {
        "name": "Anderlues",
        "center": [
          50.40704,
          4.27136
        ],
        "label": "Anderlues"
      },
      {
        "name": "Anhée",
        "center": [
          50.31039,
          4.87827
        ],
        "label": "Anhée"
      },
      {
        "name": "Ans",
        "center": [
          50.6623,
          5.52029
        ],
        "label": "Ans"
      },
      {
        "name": "Anthisnes",
        "center": [
          50.48323,
          5.519
        ],
        "label": "Anthisnes"
      },
      {
        "name": "Antoing",
        "center": [
          50.56765,
          3.4492
        ],
        "label": "Antoing"
      },
      {
        "name": "Antwerpen",
        "center": [
          51.21989,
          4.40346
        ],
        "label": "Antwerpen"
      },
      {
        "name": "Anzegem",
        "center": [
          50.837,
          3.47786
        ],
        "label": "Anzegem"
      },
      {
        "name": "Ardooie",
        "center": [
          50.9757,
          3.19736
        ],
        "label": "Ardooie"
      },
      {
        "name": "Arendonk",
        "center": [
          51.32267,
          5.08289
        ],
        "label": "Arendonk"
      },
      {
        "name": "Arlon",
        "center": [
          49.68333,
          5.81667
        ],
        "label": "Arlon"
      }
    ]
  },
  {
    "code": "BZ",
    "name": "Belize",
    "cities": [
      {
        "name": "Belize City",
        "center": [
          17.49952,
          -88.19756
        ],
        "label": "Belize City"
      },
      {
        "name": "Belmopan",
        "center": [
          17.25,
          -88.76667
        ],
        "label": "Belmopan"
      },
      {
        "name": "Benque Viejo el Carmen",
        "center": [
          17.075,
          -89.13917
        ],
        "label": "Benque Viejo el Carmen"
      },
      {
        "name": "Corozal",
        "center": [
          18.39375,
          -88.38849
        ],
        "label": "Corozal"
      },
      {
        "name": "Dangriga",
        "center": [
          16.9697,
          -88.23313
        ],
        "label": "Dangriga"
      },
      {
        "name": "Hopelchén",
        "center": [
          17.8,
          -89.1
        ],
        "label": "Hopelchén"
      },
      {
        "name": "Orange Walk",
        "center": [
          18.08124,
          -88.56328
        ],
        "label": "Orange Walk"
      },
      {
        "name": "Placencia",
        "center": [
          16.51419,
          -88.36647
        ],
        "label": "Placencia"
      },
      {
        "name": "Punta Gorda",
        "center": [
          16.09835,
          -88.8097
        ],
        "label": "Punta Gorda"
      },
      {
        "name": "San Ignacio",
        "center": [
          17.1588,
          -89.0696
        ],
        "label": "San Ignacio"
      },
      {
        "name": "San Pedro",
        "center": [
          17.91598,
          -87.9659
        ],
        "label": "San Pedro"
      },
      {
        "name": "Shipyard",
        "center": [
          17.89382,
          -88.65452
        ],
        "label": "Shipyard"
      },
      {
        "name": "Valley of Peace",
        "center": [
          17.33472,
          -88.83472
        ],
        "label": "Valley of Peace"
      }
    ]
  },
  {
    "code": "BJ",
    "name": "Benin",
    "cities": [
      {
        "name": "Abomey",
        "center": [
          7.18286,
          1.99119
        ],
        "label": "Abomey"
      },
      {
        "name": "Abomey-Calavi",
        "center": [
          6.44852,
          2.35566
        ],
        "label": "Abomey-Calavi"
      },
      {
        "name": "Allada",
        "center": [
          6.66547,
          2.15138
        ],
        "label": "Allada"
      },
      {
        "name": "Banikoara",
        "center": [
          11.29845,
          2.43856
        ],
        "label": "Banikoara"
      },
      {
        "name": "Bassila",
        "center": [
          9.00814,
          1.6654
        ],
        "label": "Bassila"
      },
      {
        "name": "Bembèrèkè",
        "center": [
          10.22827,
          2.66335
        ],
        "label": "Bembèrèkè"
      },
      {
        "name": "Bohicon",
        "center": [
          7.17826,
          2.0667
        ],
        "label": "Bohicon"
      },
      {
        "name": "Bétérou",
        "center": [
          9.19916,
          2.25855
        ],
        "label": "Bétérou"
      },
      {
        "name": "Commune of Agbangnizoun",
        "center": [
          7.076,
          1.961
        ],
        "label": "Commune of Agbangnizoun"
      },
      {
        "name": "Commune of Athieme",
        "center": [
          6.56924,
          1.70259
        ],
        "label": "Commune of Athieme"
      },
      {
        "name": "Commune of Djougou",
        "center": [
          9.643,
          1.896
        ],
        "label": "Commune of Djougou"
      },
      {
        "name": "Comé",
        "center": [
          6.40764,
          1.88198
        ],
        "label": "Comé"
      },
      {
        "name": "Cotonou",
        "center": [
          6.36536,
          2.41833
        ],
        "label": "Cotonou"
      },
      {
        "name": "Cové",
        "center": [
          7.22097,
          2.34017
        ],
        "label": "Cové"
      },
      {
        "name": "Dassa-Zoumé",
        "center": [
          7.75,
          2.18333
        ],
        "label": "Dassa-Zoumé"
      },
      {
        "name": "Djakotomey",
        "center": [
          6.9,
          1.71667
        ],
        "label": "Djakotomey"
      },
      {
        "name": "Djougou",
        "center": [
          9.70853,
          1.66598
        ],
        "label": "Djougou"
      },
      {
        "name": "Dogbo",
        "center": [
          6.79911,
          1.78073
        ],
        "label": "Dogbo"
      },
      {
        "name": "Guilmaro",
        "center": [
          10.56583,
          1.72444
        ],
        "label": "Guilmaro"
      },
      {
        "name": "Hinvi",
        "center": [
          6.76667,
          2.16667
        ],
        "label": "Hinvi"
      }
    ]
  },
  {
    "code": "BM",
    "name": "Bermuda",
    "cities": [
      {
        "name": "Hamilton",
        "center": [
          32.2949,
          -64.783
        ],
        "label": "Hamilton"
      }
    ]
  },
  {
    "code": "BT",
    "name": "Bhutan",
    "cities": [
      {
        "name": "Daga",
        "center": [
          27.07529,
          89.87688
        ],
        "label": "Daga"
      },
      {
        "name": "Daphu",
        "center": [
          26.96667,
          89.38333
        ],
        "label": "Daphu"
      },
      {
        "name": "Gasa",
        "center": [
          27.90372,
          89.72689
        ],
        "label": "Gasa"
      },
      {
        "name": "Ha",
        "center": [
          27.38747,
          89.28074
        ],
        "label": "Ha"
      },
      {
        "name": "Jakar",
        "center": [
          27.54918,
          90.7525
        ],
        "label": "Jakar"
      },
      {
        "name": "Lhuentse",
        "center": [
          27.66787,
          91.18393
        ],
        "label": "Lhuentse"
      },
      {
        "name": "Mongar",
        "center": [
          27.27471,
          91.23963
        ],
        "label": "Mongar"
      },
      {
        "name": "Pajo",
        "center": [
          27.53333,
          89.88333
        ],
        "label": "Pajo"
      },
      {
        "name": "Panbang",
        "center": [
          26.86667,
          90.98333
        ],
        "label": "Panbang"
      },
      {
        "name": "Paro",
        "center": [
          27.4305,
          89.41334
        ],
        "label": "Paro"
      },
      {
        "name": "Pemagatshel",
        "center": [
          27.03795,
          91.40305
        ],
        "label": "Pemagatshel"
      },
      {
        "name": "Phuntsholing",
        "center": [
          26.85164,
          89.38837
        ],
        "label": "Phuntsholing"
      },
      {
        "name": "Punākha",
        "center": [
          27.59137,
          89.87743
        ],
        "label": "Punākha"
      },
      {
        "name": "Samdrup Jongkhar",
        "center": [
          26.80069,
          91.50519
        ],
        "label": "Samdrup Jongkhar"
      },
      {
        "name": "Samtse",
        "center": [
          26.89903,
          89.09951
        ],
        "label": "Samtse"
      },
      {
        "name": "Sarpang",
        "center": [
          26.86395,
          90.26745
        ],
        "label": "Sarpang"
      },
      {
        "name": "Shemgang",
        "center": [
          27.21689,
          90.65793
        ],
        "label": "Shemgang"
      },
      {
        "name": "Thimphu",
        "center": [
          27.46609,
          89.64191
        ],
        "label": "Thimphu"
      },
      {
        "name": "Trashi Yangtse",
        "center": [
          27.6116,
          91.498
        ],
        "label": "Trashi Yangtse"
      },
      {
        "name": "Trashigang",
        "center": [
          27.3331,
          91.55424
        ],
        "label": "Trashigang"
      }
    ]
  },
  {
    "code": "BO",
    "name": "Bolivia",
    "cities": [
      {
        "name": "Abapó",
        "center": [
          -18.88279,
          -63.38026
        ],
        "label": "Abapó"
      },
      {
        "name": "Achacachi",
        "center": [
          -16.05,
          -68.68333
        ],
        "label": "Achacachi"
      },
      {
        "name": "Aiquile",
        "center": [
          -18.20408,
          -65.18068
        ],
        "label": "Aiquile"
      },
      {
        "name": "Amarete",
        "center": [
          -15.23675,
          -68.98462
        ],
        "label": "Amarete"
      },
      {
        "name": "Arani",
        "center": [
          -17.56854,
          -65.76883
        ],
        "label": "Arani"
      },
      {
        "name": "Ascención de Guarayos",
        "center": [
          -15.89299,
          -63.18855
        ],
        "label": "Ascención de Guarayos"
      },
      {
        "name": "Ascensión",
        "center": [
          -15.7,
          -63.08333
        ],
        "label": "Ascensión"
      },
      {
        "name": "Atocha",
        "center": [
          -20.93515,
          -66.22139
        ],
        "label": "Atocha"
      },
      {
        "name": "Batallas",
        "center": [
          -16.3,
          -68.53333
        ],
        "label": "Batallas"
      },
      {
        "name": "Bermejo",
        "center": [
          -22.73206,
          -64.33724
        ],
        "label": "Bermejo"
      },
      {
        "name": "Betanzos",
        "center": [
          -19.55293,
          -65.45395
        ],
        "label": "Betanzos"
      },
      {
        "name": "Bolivar",
        "center": [
          -17.96667,
          -66.53333
        ],
        "label": "Bolivar"
      },
      {
        "name": "Boyuibe",
        "center": [
          -20.43227,
          -63.28147
        ],
        "label": "Boyuibe"
      },
      {
        "name": "Buena Vista",
        "center": [
          -17.4583,
          -63.67126
        ],
        "label": "Buena Vista"
      },
      {
        "name": "Camargo",
        "center": [
          -20.64064,
          -65.20893
        ],
        "label": "Camargo"
      },
      {
        "name": "Camiri",
        "center": [
          -20.03849,
          -63.51833
        ],
        "label": "Camiri"
      },
      {
        "name": "Capinota",
        "center": [
          -17.71113,
          -66.26082
        ],
        "label": "Capinota"
      },
      {
        "name": "Caranavi",
        "center": [
          -15.83652,
          -67.56901
        ],
        "label": "Caranavi"
      },
      {
        "name": "Challapata",
        "center": [
          -18.90208,
          -66.77048
        ],
        "label": "Challapata"
      },
      {
        "name": "Charagua",
        "center": [
          -19.79151,
          -63.19864
        ],
        "label": "Charagua"
      }
    ]
  },
  {
    "code": "BQ",
    "name": "Bonaire, Sint Eustatius and Saba",
    "cities": [
      {
        "name": "Bonaire, Sint Eustatius and Saba City",
        "center": [
          12.15,
          -68.266667
        ],
        "label": "Bonaire, Sint Eustatius and Saba (Capital / Main)"
      }
    ]
  },
  {
    "code": "BA",
    "name": "Bosnia and Herzegovina",
    "cities": [
      {
        "name": "Balatun",
        "center": [
          44.86332,
          19.33931
        ],
        "label": "Balatun"
      },
      {
        "name": "Banja Luka",
        "center": [
          44.77842,
          17.19386
        ],
        "label": "Banja Luka"
      },
      {
        "name": "Banovići",
        "center": [
          44.40596,
          18.52648
        ],
        "label": "Banovići"
      },
      {
        "name": "Barice",
        "center": [
          44.54065,
          18.48069
        ],
        "label": "Barice"
      },
      {
        "name": "Bihać",
        "center": [
          44.81694,
          15.87083
        ],
        "label": "Bihać"
      },
      {
        "name": "Bijela",
        "center": [
          43.60871,
          17.95078
        ],
        "label": "Bijela"
      },
      {
        "name": "Bijeljina",
        "center": [
          44.76583,
          19.15083
        ],
        "label": "Bijeljina"
      },
      {
        "name": "Bila",
        "center": [
          43.78265,
          16.92676
        ],
        "label": "Bila"
      },
      {
        "name": "Bileća",
        "center": [
          42.87645,
          18.42967
        ],
        "label": "Bileća"
      },
      {
        "name": "Blagaj",
        "center": [
          43.25892,
          17.88815
        ],
        "label": "Blagaj"
      },
      {
        "name": "Blatnica",
        "center": [
          44.48677,
          17.82278
        ],
        "label": "Blatnica"
      },
      {
        "name": "Bosanska Krupa",
        "center": [
          44.8825,
          16.15139
        ],
        "label": "Bosanska Krupa"
      },
      {
        "name": "Bosanski Petrovac",
        "center": [
          44.55537,
          16.36897
        ],
        "label": "Bosanski Petrovac"
      },
      {
        "name": "Bosansko Grahovo",
        "center": [
          44.17944,
          16.36389
        ],
        "label": "Bosansko Grahovo"
      },
      {
        "name": "Breza",
        "center": [
          44.01862,
          18.26063
        ],
        "label": "Breza"
      },
      {
        "name": "Brka",
        "center": [
          44.82837,
          18.7242
        ],
        "label": "Brka"
      },
      {
        "name": "Brod",
        "center": [
          45.13747,
          17.98722
        ],
        "label": "Brod"
      },
      {
        "name": "Bronzani Majdan",
        "center": [
          44.79237,
          16.94039
        ],
        "label": "Bronzani Majdan"
      },
      {
        "name": "Brčko",
        "center": [
          44.86995,
          18.81012
        ],
        "label": "Brčko"
      },
      {
        "name": "Bugojno",
        "center": [
          44.05722,
          17.45083
        ],
        "label": "Bugojno"
      }
    ]
  },
  {
    "code": "BW",
    "name": "Botswana",
    "cities": [
      {
        "name": "Bokaa",
        "center": [
          -24.45,
          26.01667
        ],
        "label": "Bokaa"
      },
      {
        "name": "Botlhapatlou",
        "center": [
          -24.02591,
          25.48976
        ],
        "label": "Botlhapatlou"
      },
      {
        "name": "Dekar",
        "center": [
          -21.53333,
          21.93333
        ],
        "label": "Dekar"
      },
      {
        "name": "Dukwe",
        "center": [
          -20.58333,
          26.41667
        ],
        "label": "Dukwe"
      },
      {
        "name": "Dutlwe",
        "center": [
          -23.98333,
          23.9
        ],
        "label": "Dutlwe"
      },
      {
        "name": "Gabane",
        "center": [
          -24.66667,
          25.78222
        ],
        "label": "Gabane"
      },
      {
        "name": "Gaborone",
        "center": [
          -24.76234,
          25.7995
        ],
        "label": "Gaborone"
      },
      {
        "name": "Gaphatshwe",
        "center": [
          -24.57389,
          25.83417
        ],
        "label": "Gaphatshwe"
      },
      {
        "name": "Ghanzi",
        "center": [
          -21.69785,
          21.64581
        ],
        "label": "Ghanzi"
      },
      {
        "name": "Gobojango",
        "center": [
          -21.8327,
          28.72882
        ],
        "label": "Gobojango"
      },
      {
        "name": "Gweta",
        "center": [
          -20.18333,
          25.23333
        ],
        "label": "Gweta"
      },
      {
        "name": "Hukuntsi",
        "center": [
          -23.9988,
          21.77962
        ],
        "label": "Hukuntsi"
      },
      {
        "name": "Janeng",
        "center": [
          -25.41667,
          25.55
        ],
        "label": "Janeng"
      },
      {
        "name": "Kalamare",
        "center": [
          -22.93369,
          26.57032
        ],
        "label": "Kalamare"
      },
      {
        "name": "Kang",
        "center": [
          -23.67518,
          22.78762
        ],
        "label": "Kang"
      },
      {
        "name": "Kanye",
        "center": [
          -24.96675,
          25.33273
        ],
        "label": "Kanye"
      },
      {
        "name": "Khakhea",
        "center": [
          -24.68954,
          23.49403
        ],
        "label": "Khakhea"
      },
      {
        "name": "Khudumelapye",
        "center": [
          -23.88333,
          24.75
        ],
        "label": "Khudumelapye"
      },
      {
        "name": "Kopong",
        "center": [
          -24.48333,
          25.88333
        ],
        "label": "Kopong"
      },
      {
        "name": "Lehututu",
        "center": [
          -23.96667,
          21.86667
        ],
        "label": "Lehututu"
      }
    ]
  },
  {
    "code": "BV",
    "name": "Bouvet Island",
    "cities": [
      {
        "name": "Bouvet Island City",
        "center": [
          -54.43333333,
          3.4
        ],
        "label": "Bouvet Island (Capital / Main)"
      }
    ]
  },
  {
    "code": "BR",
    "name": "Brazil",
    "cities": [
      {
        "name": "Abadia de Goiás",
        "center": [
          -16.77762,
          -49.46841
        ],
        "label": "Abadia de Goiás"
      },
      {
        "name": "Abadia dos Dourados",
        "center": [
          -18.36347,
          -47.46997
        ],
        "label": "Abadia dos Dourados"
      },
      {
        "name": "Abadiânia",
        "center": [
          -16.22632,
          -48.62681
        ],
        "label": "Abadiânia"
      },
      {
        "name": "Abaetetuba",
        "center": [
          -1.71806,
          -48.8825
        ],
        "label": "Abaetetuba"
      },
      {
        "name": "Abaeté",
        "center": [
          -19.11099,
          -45.43051
        ],
        "label": "Abaeté"
      },
      {
        "name": "Abaiara",
        "center": [
          -7.33642,
          -39.06129
        ],
        "label": "Abaiara"
      },
      {
        "name": "Abaré",
        "center": [
          -8.80961,
          -39.27062
        ],
        "label": "Abaré"
      },
      {
        "name": "Abatiá",
        "center": [
          -23.29903,
          -50.32176
        ],
        "label": "Abatiá"
      },
      {
        "name": "Abaíra",
        "center": [
          -13.32129,
          -41.69759
        ],
        "label": "Abaíra"
      },
      {
        "name": "Abdon Batista",
        "center": [
          -27.58981,
          -51.04023
        ],
        "label": "Abdon Batista"
      },
      {
        "name": "Abel Figueiredo",
        "center": [
          -4.94378,
          -48.42275
        ],
        "label": "Abel Figueiredo"
      },
      {
        "name": "Abelardo Luz",
        "center": [
          -26.59825,
          -52.22321
        ],
        "label": "Abelardo Luz"
      },
      {
        "name": "Abre Campo",
        "center": [
          -20.27265,
          -42.43908
        ],
        "label": "Abre Campo"
      },
      {
        "name": "Abreu e Lima",
        "center": [
          -7.86865,
          -35.08171
        ],
        "label": "Abreu e Lima"
      },
      {
        "name": "Abreulândia",
        "center": [
          -9.43672,
          -49.31733
        ],
        "label": "Abreulândia"
      },
      {
        "name": "Acaiaca",
        "center": [
          -20.4036,
          -43.10077
        ],
        "label": "Acaiaca"
      },
      {
        "name": "Acajutiba",
        "center": [
          -11.60682,
          -38.03594
        ],
        "label": "Acajutiba"
      },
      {
        "name": "Acarape",
        "center": [
          -4.20565,
          -38.6916
        ],
        "label": "Acarape"
      },
      {
        "name": "Acaraú",
        "center": [
          -2.95424,
          -40.08597
        ],
        "label": "Acaraú"
      },
      {
        "name": "Acari",
        "center": [
          -6.38547,
          -36.63908
        ],
        "label": "Acari"
      }
    ]
  },
  {
    "code": "IO",
    "name": "British Indian Ocean Territory",
    "cities": [
      {
        "name": "British Indian Ocean Territory City",
        "center": [
          -6,
          71.5
        ],
        "label": "British Indian Ocean Territory (Capital / Main)"
      }
    ]
  },
  {
    "code": "BN",
    "name": "Brunei",
    "cities": [
      {
        "name": "Bandar Seri Begawan",
        "center": [
          4.89035,
          114.94006
        ],
        "label": "Bandar Seri Begawan"
      },
      {
        "name": "Bangar",
        "center": [
          4.70861,
          115.07167
        ],
        "label": "Bangar"
      },
      {
        "name": "Berakas A",
        "center": [
          4.97032,
          114.92989
        ],
        "label": "Berakas A"
      },
      {
        "name": "Kapok",
        "center": [
          5.02447,
          115.04664
        ],
        "label": "Kapok"
      },
      {
        "name": "Kuala Belait",
        "center": [
          4.58361,
          114.2312
        ],
        "label": "Kuala Belait"
      },
      {
        "name": "Mentiri",
        "center": [
          4.97058,
          115.02078
        ],
        "label": "Mentiri"
      },
      {
        "name": "Serasa",
        "center": [
          5.01718,
          115.05841
        ],
        "label": "Serasa"
      },
      {
        "name": "Seria",
        "center": [
          4.60637,
          114.32476
        ],
        "label": "Seria"
      },
      {
        "name": "Tutong",
        "center": [
          4.80278,
          114.64917
        ],
        "label": "Tutong"
      }
    ]
  },
  {
    "code": "BG",
    "name": "Bulgaria",
    "cities": [
      {
        "name": "Aheloy",
        "center": [
          42.64987,
          27.64838
        ],
        "label": "Aheloy"
      },
      {
        "name": "Ahtopol",
        "center": [
          42.09768,
          27.93961
        ],
        "label": "Ahtopol"
      },
      {
        "name": "Aksakovo",
        "center": [
          43.25615,
          27.82105
        ],
        "label": "Aksakovo"
      },
      {
        "name": "Alfatar",
        "center": [
          43.94525,
          27.28751
        ],
        "label": "Alfatar"
      },
      {
        "name": "Anton",
        "center": [
          42.75,
          24.28333
        ],
        "label": "Anton"
      },
      {
        "name": "Antonovo",
        "center": [
          43.15,
          26.16667
        ],
        "label": "Antonovo"
      },
      {
        "name": "Apriltsi",
        "center": [
          42.84142,
          24.91759
        ],
        "label": "Apriltsi"
      },
      {
        "name": "Ardino",
        "center": [
          41.58333,
          25.13333
        ],
        "label": "Ardino"
      },
      {
        "name": "Asen",
        "center": [
          42.65,
          25.2
        ],
        "label": "Asen"
      },
      {
        "name": "Asenovgrad",
        "center": [
          42.01667,
          24.86667
        ],
        "label": "Asenovgrad"
      },
      {
        "name": "Asparuhovo",
        "center": [
          43.18067,
          27.88823
        ],
        "label": "Asparuhovo"
      },
      {
        "name": "Aytos",
        "center": [
          42.7,
          27.25
        ],
        "label": "Aytos"
      },
      {
        "name": "Balchik",
        "center": [
          43.42166,
          28.15848
        ],
        "label": "Balchik"
      },
      {
        "name": "Balgarevo",
        "center": [
          43.40296,
          28.41189
        ],
        "label": "Balgarevo"
      },
      {
        "name": "Banite",
        "center": [
          41.61667,
          25.01667
        ],
        "label": "Banite"
      },
      {
        "name": "Bansko",
        "center": [
          41.8383,
          23.48851
        ],
        "label": "Bansko"
      },
      {
        "name": "Bata",
        "center": [
          42.73802,
          27.49643
        ],
        "label": "Bata"
      },
      {
        "name": "Batak",
        "center": [
          41.94225,
          24.21843
        ],
        "label": "Batak"
      },
      {
        "name": "Batanovtsi",
        "center": [
          42.59692,
          22.95634
        ],
        "label": "Batanovtsi"
      },
      {
        "name": "Belene",
        "center": [
          43.64594,
          25.12627
        ],
        "label": "Belene"
      }
    ]
  },
  {
    "code": "BF",
    "name": "Burkina Faso",
    "cities": [
      {
        "name": "Banfora",
        "center": [
          10.63333,
          -4.76667
        ],
        "label": "Banfora"
      },
      {
        "name": "Barani",
        "center": [
          13.1691,
          -3.8899
        ],
        "label": "Barani"
      },
      {
        "name": "Batié",
        "center": [
          9.88333,
          -2.91667
        ],
        "label": "Batié"
      },
      {
        "name": "Bazega Province",
        "center": [
          11.91667,
          -1.5
        ],
        "label": "Bazega Province"
      },
      {
        "name": "Bobo-Dioulasso",
        "center": [
          11.17715,
          -4.2979
        ],
        "label": "Bobo-Dioulasso"
      },
      {
        "name": "Bogandé",
        "center": [
          12.9704,
          -0.14953
        ],
        "label": "Bogandé"
      },
      {
        "name": "Boromo",
        "center": [
          11.74542,
          -2.93006
        ],
        "label": "Boromo"
      },
      {
        "name": "Boulsa",
        "center": [
          12.66664,
          -0.57469
        ],
        "label": "Boulsa"
      },
      {
        "name": "Boussé",
        "center": [
          12.66121,
          -1.89515
        ],
        "label": "Boussé"
      },
      {
        "name": "Dano",
        "center": [
          11.1464,
          -3.05784
        ],
        "label": "Dano"
      },
      {
        "name": "Diapaga",
        "center": [
          12.07305,
          1.78838
        ],
        "label": "Diapaga"
      },
      {
        "name": "Diébougou",
        "center": [
          10.96209,
          -3.24967
        ],
        "label": "Diébougou"
      },
      {
        "name": "Djibo",
        "center": [
          14.0994,
          -1.62554
        ],
        "label": "Djibo"
      },
      {
        "name": "Dori",
        "center": [
          14.0354,
          -0.0345
        ],
        "label": "Dori"
      },
      {
        "name": "Dédougou",
        "center": [
          12.46338,
          -3.46075
        ],
        "label": "Dédougou"
      },
      {
        "name": "Fada N'gourma",
        "center": [
          12.06157,
          0.35843
        ],
        "label": "Fada N'gourma"
      },
      {
        "name": "Garango",
        "center": [
          11.8,
          -0.55056
        ],
        "label": "Garango"
      },
      {
        "name": "Gayéri",
        "center": [
          12.64824,
          0.49314
        ],
        "label": "Gayéri"
      },
      {
        "name": "Gnagna Province",
        "center": [
          12.9188,
          0.0392
        ],
        "label": "Gnagna Province"
      },
      {
        "name": "Gorom-Gorom",
        "center": [
          14.4429,
          -0.23468
        ],
        "label": "Gorom-Gorom"
      }
    ]
  },
  {
    "code": "BI",
    "name": "Burundi",
    "cities": [
      {
        "name": "Bubanza",
        "center": [
          -3.0804,
          29.391
        ],
        "label": "Bubanza"
      },
      {
        "name": "Bujumbura",
        "center": [
          -3.38193,
          29.36142
        ],
        "label": "Bujumbura"
      },
      {
        "name": "Bururi",
        "center": [
          -3.94877,
          29.62438
        ],
        "label": "Bururi"
      },
      {
        "name": "Cankuzo",
        "center": [
          -3.2186,
          30.5528
        ],
        "label": "Cankuzo"
      },
      {
        "name": "Cibitoke",
        "center": [
          -2.8869,
          29.1248
        ],
        "label": "Cibitoke"
      },
      {
        "name": "Gitega",
        "center": [
          -3.42708,
          29.92463
        ],
        "label": "Gitega"
      },
      {
        "name": "Karuzi",
        "center": [
          -3.10139,
          30.16278
        ],
        "label": "Karuzi"
      },
      {
        "name": "Kayanza",
        "center": [
          -2.9221,
          29.6293
        ],
        "label": "Kayanza"
      },
      {
        "name": "Kirundo",
        "center": [
          -2.5845,
          30.0959
        ],
        "label": "Kirundo"
      },
      {
        "name": "Makamba",
        "center": [
          -4.1348,
          29.804
        ],
        "label": "Makamba"
      },
      {
        "name": "Muramvya",
        "center": [
          -3.2682,
          29.6079
        ],
        "label": "Muramvya"
      },
      {
        "name": "Muyinga",
        "center": [
          -2.8451,
          30.3414
        ],
        "label": "Muyinga"
      },
      {
        "name": "Mwaro",
        "center": [
          -3.51128,
          29.70334
        ],
        "label": "Mwaro"
      },
      {
        "name": "Ngozi",
        "center": [
          -2.9075,
          29.8306
        ],
        "label": "Ngozi"
      },
      {
        "name": "Rumonge",
        "center": [
          -3.9736,
          29.4386
        ],
        "label": "Rumonge"
      },
      {
        "name": "Rutana",
        "center": [
          -3.9279,
          29.992
        ],
        "label": "Rutana"
      },
      {
        "name": "Ruyigi",
        "center": [
          -3.47639,
          30.24861
        ],
        "label": "Ruyigi"
      }
    ]
  },
  {
    "code": "KH",
    "name": "Cambodia",
    "cities": [
      {
        "name": "Angkor Chey",
        "center": [
          10.76667,
          104.65
        ],
        "label": "Angkor Chey"
      },
      {
        "name": "Bakan",
        "center": [
          12.78,
          103.79
        ],
        "label": "Bakan"
      },
      {
        "name": "Banlung",
        "center": [
          13.73939,
          106.98727
        ],
        "label": "Banlung"
      },
      {
        "name": "Banteay Meas",
        "center": [
          10.61667,
          104.53333
        ],
        "label": "Banteay Meas"
      },
      {
        "name": "Baribour",
        "center": [
          12.43,
          104.47
        ],
        "label": "Baribour"
      },
      {
        "name": "Battambang",
        "center": [
          13.10271,
          103.19822
        ],
        "label": "Battambang"
      },
      {
        "name": "Cheung Prey",
        "center": [
          12.1,
          105.07
        ],
        "label": "Cheung Prey"
      },
      {
        "name": "Chhouk District",
        "center": [
          10.81667,
          104.45
        ],
        "label": "Chhouk District"
      },
      {
        "name": "Kampong Bay",
        "center": [
          10.59554,
          104.17136
        ],
        "label": "Kampong Bay"
      },
      {
        "name": "Kampong Cham",
        "center": [
          11.98,
          105.445
        ],
        "label": "Kampong Cham"
      },
      {
        "name": "Kampong Chhnang",
        "center": [
          12.26,
          104.67
        ],
        "label": "Kampong Chhnang"
      },
      {
        "name": "Kampong Speu",
        "center": [
          11.45332,
          104.52085
        ],
        "label": "Kampong Speu"
      },
      {
        "name": "Kampong Tranch",
        "center": [
          10.55,
          104.46667
        ],
        "label": "Kampong Tranch"
      },
      {
        "name": "Kampot",
        "center": [
          10.61041,
          104.18145
        ],
        "label": "Kampot"
      },
      {
        "name": "Khan 7 Makara",
        "center": [
          11.56254,
          104.91405
        ],
        "label": "Khan 7 Makara"
      },
      {
        "name": "Khan Châmkar Mon",
        "center": [
          11.5439,
          104.92175
        ],
        "label": "Khan Châmkar Mon"
      },
      {
        "name": "Khan Duŏn Pénh",
        "center": [
          11.57561,
          104.92025
        ],
        "label": "Khan Duŏn Pénh"
      },
      {
        "name": "Khan Dângkaô",
        "center": [
          11.52457,
          104.83944
        ],
        "label": "Khan Dângkaô"
      },
      {
        "name": "Khan Méan Chey",
        "center": [
          11.51976,
          104.95467
        ],
        "label": "Khan Méan Chey"
      },
      {
        "name": "Khan Russey Keo",
        "center": [
          11.61946,
          104.9099
        ],
        "label": "Khan Russey Keo"
      }
    ]
  },
  {
    "code": "CM",
    "name": "Cameroon",
    "cities": [
      {
        "name": "Abong Mbang",
        "center": [
          3.98333,
          13.18333
        ],
        "label": "Abong Mbang"
      },
      {
        "name": "Akom II",
        "center": [
          2.78333,
          10.56667
        ],
        "label": "Akom II"
      },
      {
        "name": "Akono",
        "center": [
          3.5,
          11.33333
        ],
        "label": "Akono"
      },
      {
        "name": "Akonolinga",
        "center": [
          3.76667,
          12.25
        ],
        "label": "Akonolinga"
      },
      {
        "name": "Ambam",
        "center": [
          2.38333,
          11.28333
        ],
        "label": "Ambam"
      },
      {
        "name": "Babanki",
        "center": [
          6.11667,
          10.25
        ],
        "label": "Babanki"
      },
      {
        "name": "Bafang",
        "center": [
          5.15705,
          10.1771
        ],
        "label": "Bafang"
      },
      {
        "name": "Bafia",
        "center": [
          4.75,
          11.23333
        ],
        "label": "Bafia"
      },
      {
        "name": "Bafoussam",
        "center": [
          5.47775,
          10.41759
        ],
        "label": "Bafoussam"
      },
      {
        "name": "Bali",
        "center": [
          5.88737,
          10.01176
        ],
        "label": "Bali"
      },
      {
        "name": "Bamenda",
        "center": [
          5.9597,
          10.14597
        ],
        "label": "Bamenda"
      },
      {
        "name": "Bamendjou",
        "center": [
          5.38988,
          10.33014
        ],
        "label": "Bamendjou"
      },
      {
        "name": "Bamusso",
        "center": [
          4.4591,
          8.9027
        ],
        "label": "Bamusso"
      },
      {
        "name": "Bana",
        "center": [
          5.14655,
          10.27545
        ],
        "label": "Bana"
      },
      {
        "name": "Bandjoun",
        "center": [
          5.37568,
          10.41326
        ],
        "label": "Bandjoun"
      },
      {
        "name": "Bangangté",
        "center": [
          5.14079,
          10.52535
        ],
        "label": "Bangangté"
      },
      {
        "name": "Bankim",
        "center": [
          6.08303,
          11.4905
        ],
        "label": "Bankim"
      },
      {
        "name": "Bansoa",
        "center": [
          5.44836,
          10.31355
        ],
        "label": "Bansoa"
      },
      {
        "name": "Banyo",
        "center": [
          6.75,
          11.81667
        ],
        "label": "Banyo"
      },
      {
        "name": "Batibo",
        "center": [
          5.8358,
          9.8553
        ],
        "label": "Batibo"
      }
    ]
  },
  {
    "code": "CA",
    "name": "Canada",
    "cities": [
      {
        "name": "Toronto, ON",
        "center": [
          43.6532,
          -79.3832
        ],
        "label": "Toronto, ON"
      },
      {
        "name": "Montreal, QC",
        "center": [
          45.5017,
          -73.5673
        ],
        "label": "Montreal, QC"
      },
      {
        "name": "Vancouver, BC",
        "center": [
          49.2827,
          -123.1207
        ],
        "label": "Vancouver, BC"
      },
      {
        "name": "Calgary, AB",
        "center": [
          51.0447,
          -114.0719
        ],
        "label": "Calgary, AB"
      },
      {
        "name": "Edmonton, AB",
        "center": [
          53.5461,
          -113.4938
        ],
        "label": "Edmonton, AB"
      },
      {
        "name": "Ottawa, ON",
        "center": [
          45.4215,
          -75.6972
        ],
        "label": "Ottawa, ON"
      },
      {
        "name": "Winnipeg, MB",
        "center": [
          49.8951,
          -97.1384
        ],
        "label": "Winnipeg, MB"
      },
      {
        "name": "Quebec City, QC",
        "center": [
          46.8139,
          -71.208
        ],
        "label": "Quebec City, QC"
      },
      {
        "name": "Hamilton, ON",
        "center": [
          43.2557,
          -79.8711
        ],
        "label": "Hamilton, ON"
      },
      {
        "name": "Halifax, NS",
        "center": [
          44.6488,
          -63.5752
        ],
        "label": "Halifax, NS"
      },
      {
        "name": "Victoria, BC",
        "center": [
          48.4284,
          -123.3656
        ],
        "label": "Victoria, BC"
      }
    ]
  },
  {
    "code": "CV",
    "name": "Cape Verde",
    "cities": [
      {
        "name": "Assomada",
        "center": [
          15.1,
          -23.68333
        ],
        "label": "Assomada"
      },
      {
        "name": "Calheta",
        "center": [
          15.18613,
          -23.59228
        ],
        "label": "Calheta"
      },
      {
        "name": "Cidade Velha",
        "center": [
          14.91531,
          -23.60527
        ],
        "label": "Cidade Velha"
      },
      {
        "name": "Cova Figueira",
        "center": [
          14.89054,
          -24.29343
        ],
        "label": "Cova Figueira"
      },
      {
        "name": "Espargos",
        "center": [
          16.75524,
          -22.9446
        ],
        "label": "Espargos"
      },
      {
        "name": "Igreja",
        "center": [
          15.03389,
          -24.325
        ],
        "label": "Igreja"
      },
      {
        "name": "João Teves",
        "center": [
          15.06694,
          -23.58917
        ],
        "label": "João Teves"
      },
      {
        "name": "Mindelo",
        "center": [
          16.89014,
          -24.98042
        ],
        "label": "Mindelo"
      },
      {
        "name": "Nova Sintra",
        "center": [
          14.87139,
          -24.69556
        ],
        "label": "Nova Sintra"
      },
      {
        "name": "Pedra Badejo",
        "center": [
          15.1375,
          -23.53083
        ],
        "label": "Pedra Badejo"
      },
      {
        "name": "Pombas",
        "center": [
          17.15026,
          -25.02007
        ],
        "label": "Pombas"
      },
      {
        "name": "Ponta do Sol",
        "center": [
          17.20171,
          -25.09217
        ],
        "label": "Ponta do Sol"
      },
      {
        "name": "Porto Novo",
        "center": [
          17.01969,
          -25.06471
        ],
        "label": "Porto Novo"
      },
      {
        "name": "Praia",
        "center": [
          14.93152,
          -23.51254
        ],
        "label": "Praia"
      },
      {
        "name": "Ribeira Brava",
        "center": [
          16.61583,
          -24.29833
        ],
        "label": "Ribeira Brava"
      },
      {
        "name": "Ribeira Grande",
        "center": [
          17.1825,
          -25.065
        ],
        "label": "Ribeira Grande"
      },
      {
        "name": "Sal Rei",
        "center": [
          16.17611,
          -22.91722
        ],
        "label": "Sal Rei"
      },
      {
        "name": "Santa Cruz",
        "center": [
          15.13333,
          -23.56667
        ],
        "label": "Santa Cruz"
      },
      {
        "name": "Santa Maria",
        "center": [
          16.59796,
          -22.90509
        ],
        "label": "Santa Maria"
      },
      {
        "name": "São Domingos",
        "center": [
          15.02438,
          -23.5625
        ],
        "label": "São Domingos"
      }
    ]
  },
  {
    "code": "KY",
    "name": "Cayman Islands",
    "cities": [
      {
        "name": "George Town",
        "center": [
          19.2869,
          -81.3674
        ],
        "label": "George Town"
      }
    ]
  },
  {
    "code": "CF",
    "name": "Central African Republic",
    "cities": [
      {
        "name": "Alindao",
        "center": [
          5.02667,
          21.20876
        ],
        "label": "Alindao"
      },
      {
        "name": "Bambari",
        "center": [
          5.76795,
          20.67565
        ],
        "label": "Bambari"
      },
      {
        "name": "Bamingui",
        "center": [
          7.88897,
          20.04875
        ],
        "label": "Bamingui"
      },
      {
        "name": "Bangassou",
        "center": [
          4.74132,
          22.81838
        ],
        "label": "Bangassou"
      },
      {
        "name": "Bangui",
        "center": [
          4.36122,
          18.55496
        ],
        "label": "Bangui"
      },
      {
        "name": "Baoro",
        "center": [
          5.66667,
          15.96667
        ],
        "label": "Baoro"
      },
      {
        "name": "Batangafo",
        "center": [
          7.30082,
          18.2833
        ],
        "label": "Batangafo"
      },
      {
        "name": "Berberati",
        "center": [
          4.31211,
          15.88948
        ],
        "label": "Berberati"
      },
      {
        "name": "Bimbo",
        "center": [
          4.25671,
          18.41583
        ],
        "label": "Bimbo"
      },
      {
        "name": "Birao",
        "center": [
          10.28488,
          22.78818
        ],
        "label": "Birao"
      },
      {
        "name": "Boali",
        "center": [
          4.80048,
          18.12747
        ],
        "label": "Boali"
      },
      {
        "name": "Bocaranga",
        "center": [
          6.76546,
          15.77873
        ],
        "label": "Bocaranga"
      },
      {
        "name": "Boda",
        "center": [
          4.31887,
          17.46953
        ],
        "label": "Boda"
      },
      {
        "name": "Boganangone",
        "center": [
          4.73558,
          17.14047
        ],
        "label": "Boganangone"
      },
      {
        "name": "Bossangoa",
        "center": [
          6.49263,
          17.45518
        ],
        "label": "Bossangoa"
      },
      {
        "name": "Bouar",
        "center": [
          5.93404,
          15.59599
        ],
        "label": "Bouar"
      },
      {
        "name": "Bouca",
        "center": [
          6.50734,
          18.2767
        ],
        "label": "Bouca"
      },
      {
        "name": "Bozoum",
        "center": [
          6.31933,
          16.37992
        ],
        "label": "Bozoum"
      },
      {
        "name": "Bria",
        "center": [
          6.54233,
          21.98633
        ],
        "label": "Bria"
      },
      {
        "name": "Carnot",
        "center": [
          4.94273,
          15.87735
        ],
        "label": "Carnot"
      }
    ]
  },
  {
    "code": "TD",
    "name": "Chad",
    "cities": [
      {
        "name": "Abéché",
        "center": [
          13.82916,
          20.8324
        ],
        "label": "Abéché"
      },
      {
        "name": "Adré",
        "center": [
          13.46648,
          22.19875
        ],
        "label": "Adré"
      },
      {
        "name": "Am Timan",
        "center": [
          11.0297,
          20.2827
        ],
        "label": "Am Timan"
      },
      {
        "name": "Aozou",
        "center": [
          21.8375,
          17.4275
        ],
        "label": "Aozou"
      },
      {
        "name": "Ati",
        "center": [
          13.2154,
          18.3353
        ],
        "label": "Ati"
      },
      {
        "name": "Benoy",
        "center": [
          8.98327,
          16.31991
        ],
        "label": "Benoy"
      },
      {
        "name": "Beïnamar",
        "center": [
          8.6698,
          15.3813
        ],
        "label": "Beïnamar"
      },
      {
        "name": "Biltine",
        "center": [
          14.52791,
          20.92749
        ],
        "label": "Biltine"
      },
      {
        "name": "Bitkine",
        "center": [
          11.9801,
          18.2138
        ],
        "label": "Bitkine"
      },
      {
        "name": "Bokoro",
        "center": [
          12.37813,
          17.05876
        ],
        "label": "Bokoro"
      },
      {
        "name": "Bol",
        "center": [
          13.46706,
          14.71363
        ],
        "label": "Bol"
      },
      {
        "name": "Bongor",
        "center": [
          10.28056,
          15.37222
        ],
        "label": "Bongor"
      },
      {
        "name": "Béboto",
        "center": [
          8.26681,
          16.93898
        ],
        "label": "Béboto"
      },
      {
        "name": "Bébédja",
        "center": [
          8.6761,
          16.566
        ],
        "label": "Bébédja"
      },
      {
        "name": "Béré",
        "center": [
          9.3202,
          16.1552
        ],
        "label": "Béré"
      },
      {
        "name": "Doba",
        "center": [
          8.65,
          16.85
        ],
        "label": "Doba"
      },
      {
        "name": "Fada",
        "center": [
          17.18535,
          21.58114
        ],
        "label": "Fada"
      },
      {
        "name": "Faya-Largeau",
        "center": [
          17.9257,
          19.10428
        ],
        "label": "Faya-Largeau"
      },
      {
        "name": "Goundi",
        "center": [
          9.36267,
          17.36597
        ],
        "label": "Goundi"
      },
      {
        "name": "Gounou Gaya",
        "center": [
          9.6294,
          15.5132
        ],
        "label": "Gounou Gaya"
      }
    ]
  },
  {
    "code": "CL",
    "name": "Chile",
    "cities": [
      {
        "name": "Algarrobo",
        "center": [
          -33.369256,
          -71.668139
        ],
        "label": "Algarrobo"
      },
      {
        "name": "Alhué",
        "center": [
          -34.03333333,
          -71.1
        ],
        "label": "Alhué"
      },
      {
        "name": "Alto Biobío",
        "center": [
          -38.05,
          -71.31666667
        ],
        "label": "Alto Biobío"
      },
      {
        "name": "Alto Hospicio",
        "center": [
          -20.25,
          -70.11666667
        ],
        "label": "Alto Hospicio"
      },
      {
        "name": "Alto del Carmen",
        "center": [
          -28.93355556,
          -70.46227778
        ],
        "label": "Alto del Carmen"
      },
      {
        "name": "Ancud",
        "center": [
          -41.8707,
          -73.81622
        ],
        "label": "Ancud"
      },
      {
        "name": "Andacollo",
        "center": [
          -30.21666667,
          -71.08333333
        ],
        "label": "Andacollo"
      },
      {
        "name": "Angol",
        "center": [
          -37.79519,
          -72.71636
        ],
        "label": "Angol"
      },
      {
        "name": "Antofagasta",
        "center": [
          -23.65236,
          -70.3954
        ],
        "label": "Antofagasta"
      },
      {
        "name": "Antuco",
        "center": [
          -37.33333333,
          -71.68333333
        ],
        "label": "Antuco"
      },
      {
        "name": "Antártica",
        "center": [
          -75,
          -71.5
        ],
        "label": "Antártica"
      },
      {
        "name": "Arauco",
        "center": [
          -37.2463,
          -73.31752
        ],
        "label": "Arauco"
      },
      {
        "name": "Arica",
        "center": [
          -18.4746,
          -70.29792
        ],
        "label": "Arica"
      },
      {
        "name": "Aysén",
        "center": [
          -45.40303,
          -72.69184
        ],
        "label": "Aysén"
      },
      {
        "name": "Buin",
        "center": [
          -33.73257,
          -70.74281
        ],
        "label": "Buin"
      },
      {
        "name": "Bulnes",
        "center": [
          -36.74232,
          -72.29854
        ],
        "label": "Bulnes"
      },
      {
        "name": "Cabildo",
        "center": [
          -32.41737,
          -70.82435
        ],
        "label": "Cabildo"
      },
      {
        "name": "Cabo de Hornos",
        "center": [
          -54.93333333,
          -67.61666667
        ],
        "label": "Cabo de Hornos"
      },
      {
        "name": "Cabrero",
        "center": [
          -37.03394,
          -72.40468
        ],
        "label": "Cabrero"
      },
      {
        "name": "Calama",
        "center": [
          -22.45667,
          -68.92371
        ],
        "label": "Calama"
      }
    ]
  },
  {
    "code": "CN",
    "name": "China",
    "cities": [
      {
        "name": "Beijing",
        "center": [
          39.9042,
          116.4074
        ],
        "label": "Beijing"
      },
      {
        "name": "Shanghai",
        "center": [
          31.2304,
          121.4737
        ],
        "label": "Shanghai"
      },
      {
        "name": "Guangzhou",
        "center": [
          23.1291,
          113.2644
        ],
        "label": "Guangzhou"
      },
      {
        "name": "Shenzhen",
        "center": [
          22.5431,
          114.0579
        ],
        "label": "Shenzhen"
      },
      {
        "name": "Chengdu",
        "center": [
          30.5728,
          104.0668
        ],
        "label": "Chengdu"
      },
      {
        "name": "Hangzhou",
        "center": [
          30.2741,
          120.1551
        ],
        "label": "Hangzhou"
      },
      {
        "name": "Wuhan",
        "center": [
          30.5928,
          114.3055
        ],
        "label": "Wuhan"
      },
      {
        "name": "Chongqing",
        "center": [
          29.563,
          106.5516
        ],
        "label": "Chongqing"
      }
    ]
  },
  {
    "code": "CX",
    "name": "Christmas Island",
    "cities": [
      {
        "name": "Christmas Island City",
        "center": [
          -10.5,
          105.66666666
        ],
        "label": "Christmas Island (Capital / Main)"
      }
    ]
  },
  {
    "code": "CC",
    "name": "Cocos (Keeling) Islands",
    "cities": [
      {
        "name": "Cocos (Keeling) Islands City",
        "center": [
          -12.5,
          96.83333333
        ],
        "label": "Cocos (Keeling) Islands (Capital / Main)"
      }
    ]
  },
  {
    "code": "CO",
    "name": "Colombia",
    "cities": [
      {
        "name": "Abejorral",
        "center": [
          5.78928,
          -75.42725
        ],
        "label": "Abejorral"
      },
      {
        "name": "Abrego",
        "center": [
          8,
          -73.2
        ],
        "label": "Abrego"
      },
      {
        "name": "Abriaquí",
        "center": [
          6.63148,
          -76.06444
        ],
        "label": "Abriaquí"
      },
      {
        "name": "Acacías",
        "center": [
          3.98695,
          -73.75797
        ],
        "label": "Acacías"
      },
      {
        "name": "Acandí",
        "center": [
          8.51158,
          -77.27719
        ],
        "label": "Acandí"
      },
      {
        "name": "Acevedo",
        "center": [
          1.83611111,
          -75.855
        ],
        "label": "Acevedo"
      },
      {
        "name": "Achí",
        "center": [
          8.5695,
          -74.55715
        ],
        "label": "Achí"
      },
      {
        "name": "Agua de Dios",
        "center": [
          4.37648,
          -74.66995
        ],
        "label": "Agua de Dios"
      },
      {
        "name": "Aguachica",
        "center": [
          8.30844,
          -73.6166
        ],
        "label": "Aguachica"
      },
      {
        "name": "Aguada",
        "center": [
          6.16019,
          -73.52747
        ],
        "label": "Aguada"
      },
      {
        "name": "Aguadas",
        "center": [
          5.61161,
          -75.45624
        ],
        "label": "Aguadas"
      },
      {
        "name": "Aguazul",
        "center": [
          5.17282,
          -72.54706
        ],
        "label": "Aguazul"
      },
      {
        "name": "Agustín Codazzi",
        "center": [
          10.03672,
          -73.23558
        ],
        "label": "Agustín Codazzi"
      },
      {
        "name": "Aipe",
        "center": [
          3.22194444,
          -75.2375
        ],
        "label": "Aipe"
      },
      {
        "name": "Albania",
        "center": [
          1.26325,
          -75.95366
        ],
        "label": "Albania"
      },
      {
        "name": "Albán",
        "center": [
          4.89432,
          -74.44388
        ],
        "label": "Albán"
      },
      {
        "name": "Alcalá",
        "center": [
          4.67458,
          -75.77188
        ],
        "label": "Alcalá"
      },
      {
        "name": "Aldana",
        "center": [
          0.88283,
          -77.70103
        ],
        "label": "Aldana"
      },
      {
        "name": "Alejandría",
        "center": [
          6.36667,
          -75.08333
        ],
        "label": "Alejandría"
      },
      {
        "name": "Algarrobo",
        "center": [
          10.18553,
          -74.06158
        ],
        "label": "Algarrobo"
      }
    ]
  },
  {
    "code": "KM",
    "name": "Comoros",
    "cities": [
      {
        "name": "Adda-Douéni",
        "center": [
          -12.2925,
          44.49722
        ],
        "label": "Adda-Douéni"
      },
      {
        "name": "Antsahé",
        "center": [
          -12.35639,
          44.5225
        ],
        "label": "Antsahé"
      },
      {
        "name": "Assimpao",
        "center": [
          -12.23306,
          44.31972
        ],
        "label": "Assimpao"
      },
      {
        "name": "Bahani",
        "center": [
          -11.63972,
          43.28417
        ],
        "label": "Bahani"
      },
      {
        "name": "Bambadjani",
        "center": [
          -11.47861,
          43.37722
        ],
        "label": "Bambadjani"
      },
      {
        "name": "Bambao",
        "center": [
          -12.20325,
          44.51638
        ],
        "label": "Bambao"
      },
      {
        "name": "Bandajou",
        "center": [
          -12.19167,
          44.28694
        ],
        "label": "Bandajou"
      },
      {
        "name": "Barakani",
        "center": [
          -12.13861,
          44.43026
        ],
        "label": "Barakani"
      },
      {
        "name": "Bimbini",
        "center": [
          -12.18833,
          44.23556
        ],
        "label": "Bimbini"
      },
      {
        "name": "Boungouéni",
        "center": [
          -12.20556,
          44.29944
        ],
        "label": "Boungouéni"
      },
      {
        "name": "Bouni",
        "center": [
          -11.48694,
          43.38833
        ],
        "label": "Bouni"
      },
      {
        "name": "Chandra",
        "center": [
          -12.195,
          44.46472
        ],
        "label": "Chandra"
      },
      {
        "name": "Chezani",
        "center": [
          -11.4314,
          43.39625
        ],
        "label": "Chezani"
      },
      {
        "name": "Chindini",
        "center": [
          -11.92328,
          43.49109
        ],
        "label": "Chindini"
      },
      {
        "name": "Chironkamba",
        "center": [
          -12.19111,
          44.3525
        ],
        "label": "Chironkamba"
      },
      {
        "name": "Chitrouni",
        "center": [
          -12.18583,
          44.33556
        ],
        "label": "Chitrouni"
      },
      {
        "name": "Chouani",
        "center": [
          -11.8233,
          43.29429
        ],
        "label": "Chouani"
      },
      {
        "name": "Daji",
        "center": [
          -12.32583,
          44.48861
        ],
        "label": "Daji"
      },
      {
        "name": "Dembéni",
        "center": [
          -11.87361,
          43.39778
        ],
        "label": "Dembéni"
      },
      {
        "name": "Djoyézi",
        "center": [
          -12.30587,
          43.77425
        ],
        "label": "Djoyézi"
      }
    ]
  },
  {
    "code": "CG",
    "name": "Congo",
    "cities": [
      {
        "name": "Brazzaville",
        "center": [
          -4.26613,
          15.28318
        ],
        "label": "Brazzaville"
      },
      {
        "name": "Djambala",
        "center": [
          -2.54472,
          14.75333
        ],
        "label": "Djambala"
      },
      {
        "name": "Dolisie",
        "center": [
          -4.19834,
          12.66664
        ],
        "label": "Dolisie"
      },
      {
        "name": "Ewo",
        "center": [
          -0.8725,
          14.82056
        ],
        "label": "Ewo"
      },
      {
        "name": "Gamboma",
        "center": [
          -1.87639,
          15.86444
        ],
        "label": "Gamboma"
      },
      {
        "name": "Impfondo",
        "center": [
          1.61804,
          18.05981
        ],
        "label": "Impfondo"
      },
      {
        "name": "Kayes",
        "center": [
          -4.20493,
          13.28608
        ],
        "label": "Kayes"
      },
      {
        "name": "Kinkala",
        "center": [
          -4.36139,
          14.76444
        ],
        "label": "Kinkala"
      },
      {
        "name": "Loandjili",
        "center": [
          -4.75611,
          11.85778
        ],
        "label": "Loandjili"
      },
      {
        "name": "Madingou",
        "center": [
          -4.15361,
          13.55
        ],
        "label": "Madingou"
      },
      {
        "name": "Makoua",
        "center": [
          0.00694,
          15.63333
        ],
        "label": "Makoua"
      },
      {
        "name": "Mossendjo",
        "center": [
          -2.94968,
          12.70423
        ],
        "label": "Mossendjo"
      },
      {
        "name": "Ouésso",
        "center": [
          1.61361,
          16.05167
        ],
        "label": "Ouésso"
      },
      {
        "name": "Owando",
        "center": [
          -0.48193,
          15.89988
        ],
        "label": "Owando"
      },
      {
        "name": "Pointe-Noire",
        "center": [
          -4.77609,
          11.86352
        ],
        "label": "Pointe-Noire"
      },
      {
        "name": "Sibiti",
        "center": [
          -3.68192,
          13.34985
        ],
        "label": "Sibiti"
      },
      {
        "name": "Sémbé",
        "center": [
          1.64806,
          14.58056
        ],
        "label": "Sémbé"
      }
    ]
  },
  {
    "code": "CK",
    "name": "Cook Islands",
    "cities": [
      {
        "name": "Cook Islands City",
        "center": [
          -21.23333333,
          -159.76666666
        ],
        "label": "Cook Islands (Capital / Main)"
      }
    ]
  },
  {
    "code": "CR",
    "name": "Costa Rica",
    "cities": [
      {
        "name": "Abangares",
        "center": [
          10.21667,
          -85
        ],
        "label": "Abangares"
      },
      {
        "name": "Acosta",
        "center": [
          9.8,
          -84.2
        ],
        "label": "Acosta"
      },
      {
        "name": "Alajuela",
        "center": [
          10.01625,
          -84.21163
        ],
        "label": "Alajuela"
      },
      {
        "name": "Alajuelita",
        "center": [
          9.9,
          -84.1
        ],
        "label": "Alajuelita"
      },
      {
        "name": "Alvarado",
        "center": [
          9.93333,
          -83.8
        ],
        "label": "Alvarado"
      },
      {
        "name": "Aserrí",
        "center": [
          9.86667,
          -84.1
        ],
        "label": "Aserrí"
      },
      {
        "name": "Atenas",
        "center": [
          9.98333,
          -84.38333
        ],
        "label": "Atenas"
      },
      {
        "name": "Bagaces",
        "center": [
          10.5,
          -85.25
        ],
        "label": "Bagaces"
      },
      {
        "name": "Barva",
        "center": [
          10.08333,
          -84.1
        ],
        "label": "Barva"
      },
      {
        "name": "Batán",
        "center": [
          10.08354,
          -83.33413
        ],
        "label": "Batán"
      },
      {
        "name": "Belén",
        "center": [
          10.40789,
          -85.58836
        ],
        "label": "Belén"
      },
      {
        "name": "Bijagua",
        "center": [
          10.73279,
          -85.05676
        ],
        "label": "Bijagua"
      },
      {
        "name": "Buenos Aires",
        "center": [
          9.11667,
          -83.25
        ],
        "label": "Buenos Aires"
      },
      {
        "name": "Calle Blancos",
        "center": [
          9.95,
          -84.06667
        ],
        "label": "Calle Blancos"
      },
      {
        "name": "Canoas",
        "center": [
          8.53305,
          -82.83844
        ],
        "label": "Canoas"
      },
      {
        "name": "Carrillo",
        "center": [
          10.41667,
          -85.58333
        ],
        "label": "Carrillo"
      },
      {
        "name": "Carrillos",
        "center": [
          10.02918,
          -84.27403
        ],
        "label": "Carrillos"
      },
      {
        "name": "Cartago",
        "center": [
          9.86444,
          -83.91944
        ],
        "label": "Cartago"
      },
      {
        "name": "Cañas",
        "center": [
          10.48005,
          -85.11349
        ],
        "label": "Cañas"
      },
      {
        "name": "Chacarita",
        "center": [
          9.98424,
          -84.77892
        ],
        "label": "Chacarita"
      }
    ]
  },
  {
    "code": "CI",
    "name": "Cote D'Ivoire (Ivory Coast)",
    "cities": [
      {
        "name": "Abengourou",
        "center": [
          6.72972,
          -3.49639
        ],
        "label": "Abengourou"
      },
      {
        "name": "Abidjan",
        "center": [
          5.30966,
          -4.01266
        ],
        "label": "Abidjan"
      },
      {
        "name": "Abobo",
        "center": [
          5.41613,
          -4.0159
        ],
        "label": "Abobo"
      },
      {
        "name": "Aboisso",
        "center": [
          5.46779,
          -3.20711
        ],
        "label": "Aboisso"
      },
      {
        "name": "Adiaké",
        "center": [
          5.28634,
          -3.30403
        ],
        "label": "Adiaké"
      },
      {
        "name": "Adzopé",
        "center": [
          6.10694,
          -3.86194
        ],
        "label": "Adzopé"
      },
      {
        "name": "Affery",
        "center": [
          6.32035,
          -3.95235
        ],
        "label": "Affery"
      },
      {
        "name": "Agboville",
        "center": [
          5.92801,
          -4.21319
        ],
        "label": "Agboville"
      },
      {
        "name": "Agnibilékrou",
        "center": [
          7.13113,
          -3.20415
        ],
        "label": "Agnibilékrou"
      },
      {
        "name": "Agnéby-Tiassa",
        "center": [
          5.79488,
          -4.37187
        ],
        "label": "Agnéby-Tiassa"
      },
      {
        "name": "Akoupé",
        "center": [
          6.38423,
          -3.88759
        ],
        "label": "Akoupé"
      },
      {
        "name": "Anyama",
        "center": [
          5.49462,
          -4.05183
        ],
        "label": "Anyama"
      },
      {
        "name": "Arrah",
        "center": [
          6.67342,
          -3.96938
        ],
        "label": "Arrah"
      },
      {
        "name": "Ayamé",
        "center": [
          5.6052,
          -3.15709
        ],
        "label": "Ayamé"
      },
      {
        "name": "Bafing",
        "center": [
          8.40611,
          -7.58048
        ],
        "label": "Bafing"
      },
      {
        "name": "Bangolo",
        "center": [
          7.01232,
          -7.48639
        ],
        "label": "Bangolo"
      },
      {
        "name": "Biankouma",
        "center": [
          7.73909,
          -7.61377
        ],
        "label": "Biankouma"
      },
      {
        "name": "Bingerville",
        "center": [
          5.35581,
          -3.88537
        ],
        "label": "Bingerville"
      },
      {
        "name": "Bocanda",
        "center": [
          7.06264,
          -4.49948
        ],
        "label": "Bocanda"
      },
      {
        "name": "Bondoukou",
        "center": [
          8.0402,
          -2.80003
        ],
        "label": "Bondoukou"
      }
    ]
  },
  {
    "code": "HR",
    "name": "Croatia",
    "cities": [
      {
        "name": "Andrijaševci",
        "center": [
          45.22472,
          18.73806
        ],
        "label": "Andrijaševci"
      },
      {
        "name": "Antunovac",
        "center": [
          45.49083,
          18.675
        ],
        "label": "Antunovac"
      },
      {
        "name": "Babina Greda",
        "center": [
          45.11722,
          18.53694
        ],
        "label": "Babina Greda"
      },
      {
        "name": "Bakar",
        "center": [
          45.30861,
          14.53028
        ],
        "label": "Bakar"
      },
      {
        "name": "Bale",
        "center": [
          45.04056,
          13.78361
        ],
        "label": "Bale"
      },
      {
        "name": "Bale-Valle",
        "center": [
          45.04089,
          13.78565
        ],
        "label": "Bale-Valle"
      },
      {
        "name": "Banjol",
        "center": [
          44.75,
          14.78333
        ],
        "label": "Banjol"
      },
      {
        "name": "Batrina",
        "center": [
          45.18944,
          17.66639
        ],
        "label": "Batrina"
      },
      {
        "name": "Baška",
        "center": [
          44.97028,
          14.75333
        ],
        "label": "Baška"
      },
      {
        "name": "Baška Voda",
        "center": [
          43.35694,
          16.95028
        ],
        "label": "Baška Voda"
      },
      {
        "name": "Bedekovčina",
        "center": [
          46.04111,
          15.99639
        ],
        "label": "Bedekovčina"
      },
      {
        "name": "Beli Manastir",
        "center": [
          45.77,
          18.60361
        ],
        "label": "Beli Manastir"
      },
      {
        "name": "Belica",
        "center": [
          46.40417,
          16.51833
        ],
        "label": "Belica"
      },
      {
        "name": "Belišće",
        "center": [
          45.68028,
          18.40583
        ],
        "label": "Belišće"
      },
      {
        "name": "Benkovac",
        "center": [
          44.03444,
          15.61278
        ],
        "label": "Benkovac"
      },
      {
        "name": "Beretinec",
        "center": [
          46.25,
          16.3
        ],
        "label": "Beretinec"
      },
      {
        "name": "Bestovje",
        "center": [
          45.80833,
          15.81667
        ],
        "label": "Bestovje"
      },
      {
        "name": "Bibinje",
        "center": [
          44.07324,
          15.28288
        ],
        "label": "Bibinje"
      },
      {
        "name": "Bijelo Brdo",
        "center": [
          45.51722,
          18.87083
        ],
        "label": "Bijelo Brdo"
      },
      {
        "name": "Bilje",
        "center": [
          45.60694,
          18.74389
        ],
        "label": "Bilje"
      }
    ]
  },
  {
    "code": "CU",
    "name": "Cuba",
    "cities": [
      {
        "name": "Abreus",
        "center": [
          22.27797,
          -80.56931
        ],
        "label": "Abreus"
      },
      {
        "name": "Aguada de Pasajeros",
        "center": [
          22.3852,
          -80.84792
        ],
        "label": "Aguada de Pasajeros"
      },
      {
        "name": "Alacranes",
        "center": [
          22.76719,
          -81.56803
        ],
        "label": "Alacranes"
      },
      {
        "name": "Alamar",
        "center": [
          23.15794,
          -82.27837
        ],
        "label": "Alamar"
      },
      {
        "name": "Alquízar",
        "center": [
          22.80517,
          -82.58392
        ],
        "label": "Alquízar"
      },
      {
        "name": "Amancio",
        "center": [
          20.81914,
          -77.57958
        ],
        "label": "Amancio"
      },
      {
        "name": "Arroyo Naranjo",
        "center": [
          23.03677,
          -82.36937
        ],
        "label": "Arroyo Naranjo"
      },
      {
        "name": "Artemisa",
        "center": [
          22.81667,
          -82.75944
        ],
        "label": "Artemisa"
      },
      {
        "name": "Bahía Honda",
        "center": [
          22.90332,
          -83.15994
        ],
        "label": "Bahía Honda"
      },
      {
        "name": "Banes",
        "center": [
          20.96116,
          -75.722
        ],
        "label": "Banes"
      },
      {
        "name": "Baracoa",
        "center": [
          20.34711,
          -74.49624
        ],
        "label": "Baracoa"
      },
      {
        "name": "Baraguá",
        "center": [
          21.68216,
          -78.62567
        ],
        "label": "Baraguá"
      },
      {
        "name": "Bartolomé Masó",
        "center": [
          20.16635,
          -76.94291
        ],
        "label": "Bartolomé Masó"
      },
      {
        "name": "Batabanó",
        "center": [
          22.71794,
          -82.28965
        ],
        "label": "Batabanó"
      },
      {
        "name": "Bauta",
        "center": [
          22.98226,
          -82.54719
        ],
        "label": "Bauta"
      },
      {
        "name": "Bayamo",
        "center": [
          20.37417,
          -76.64361
        ],
        "label": "Bayamo"
      },
      {
        "name": "Bejucal",
        "center": [
          22.92861,
          -82.38861
        ],
        "label": "Bejucal"
      },
      {
        "name": "Bolondrón",
        "center": [
          22.76307,
          -81.4478
        ],
        "label": "Bolondrón"
      },
      {
        "name": "Boyeros",
        "center": [
          23.0072,
          -82.4017
        ],
        "label": "Boyeros"
      },
      {
        "name": "Cabaiguán",
        "center": [
          22.07874,
          -79.49726
        ],
        "label": "Cabaiguán"
      }
    ]
  },
  {
    "code": "CW",
    "name": "Curaçao",
    "cities": [
      {
        "name": "Willemstad",
        "center": [
          12.1224,
          -68.9335
        ],
        "label": "Willemstad"
      }
    ]
  },
  {
    "code": "CY",
    "name": "Cyprus",
    "cities": [
      {
        "name": "Acherítou",
        "center": [
          35.10022,
          33.86155
        ],
        "label": "Acherítou"
      },
      {
        "name": "Akáki",
        "center": [
          35.13341,
          33.12873
        ],
        "label": "Akáki"
      },
      {
        "name": "Alámpra",
        "center": [
          34.98898,
          33.39887
        ],
        "label": "Alámpra"
      },
      {
        "name": "Ammochostos Municipality",
        "center": [
          35.11755,
          33.94335
        ],
        "label": "Ammochostos Municipality"
      },
      {
        "name": "Aradíppou",
        "center": [
          34.95151,
          33.59199
        ],
        "label": "Aradíppou"
      },
      {
        "name": "Aredioú",
        "center": [
          35.04844,
          33.1961
        ],
        "label": "Aredioú"
      },
      {
        "name": "Argáka",
        "center": [
          35.06646,
          32.49446
        ],
        "label": "Argáka"
      },
      {
        "name": "Astromerítis",
        "center": [
          35.14096,
          33.03793
        ],
        "label": "Astromerítis"
      },
      {
        "name": "Athíenou",
        "center": [
          35.0618,
          33.54156
        ],
        "label": "Athíenou"
      },
      {
        "name": "Avgórou",
        "center": [
          35.03615,
          33.83918
        ],
        "label": "Avgórou"
      },
      {
        "name": "Ayia Napa",
        "center": [
          34.98213,
          34.00183
        ],
        "label": "Ayia Napa"
      },
      {
        "name": "Chlórakas",
        "center": [
          34.79768,
          32.41207
        ],
        "label": "Chlórakas"
      },
      {
        "name": "Derýneia",
        "center": [
          35.06484,
          33.96083
        ],
        "label": "Derýneia"
      },
      {
        "name": "Dhromolaxia",
        "center": [
          34.87551,
          33.58684
        ],
        "label": "Dhromolaxia"
      },
      {
        "name": "Dáli",
        "center": [
          35.02294,
          33.42195
        ],
        "label": "Dáli"
      },
      {
        "name": "Emba",
        "center": [
          34.807,
          32.42406
        ],
        "label": "Emba"
      },
      {
        "name": "Ergátes",
        "center": [
          35.05365,
          33.24292
        ],
        "label": "Ergátes"
      },
      {
        "name": "Erími",
        "center": [
          34.67766,
          32.91815
        ],
        "label": "Erími"
      },
      {
        "name": "Famagusta",
        "center": [
          35.12054,
          33.93894
        ],
        "label": "Famagusta"
      },
      {
        "name": "Frénaros",
        "center": [
          35.04121,
          33.92242
        ],
        "label": "Frénaros"
      }
    ]
  },
  {
    "code": "CZ",
    "name": "Czech Republic",
    "cities": [
      {
        "name": "Abertamy",
        "center": [
          50.36874,
          12.81826
        ],
        "label": "Abertamy"
      },
      {
        "name": "Adamov",
        "center": [
          49.30162,
          16.65253
        ],
        "label": "Adamov"
      },
      {
        "name": "Albrechtice",
        "center": [
          49.78645,
          18.52444
        ],
        "label": "Albrechtice"
      },
      {
        "name": "Albrechtice nad Orlicí",
        "center": [
          50.13979,
          16.06437
        ],
        "label": "Albrechtice nad Orlicí"
      },
      {
        "name": "Aš",
        "center": [
          50.22387,
          12.19499
        ],
        "label": "Aš"
      },
      {
        "name": "Babice",
        "center": [
          49.12167,
          17.48075
        ],
        "label": "Babice"
      },
      {
        "name": "Bakov nad Jizerou",
        "center": [
          50.4823,
          14.94149
        ],
        "label": "Bakov nad Jizerou"
      },
      {
        "name": "Bartošovice",
        "center": [
          49.66884,
          18.05461
        ],
        "label": "Bartošovice"
      },
      {
        "name": "Batelov",
        "center": [
          49.31425,
          15.39465
        ],
        "label": "Batelov"
      },
      {
        "name": "Bavorov",
        "center": [
          49.12184,
          14.07893
        ],
        "label": "Bavorov"
      },
      {
        "name": "Baška",
        "center": [
          49.64584,
          18.37233
        ],
        "label": "Baška"
      },
      {
        "name": "Bechlín",
        "center": [
          50.41615,
          14.34092
        ],
        "label": "Bechlín"
      },
      {
        "name": "Bechyně",
        "center": [
          49.29523,
          14.4681
        ],
        "label": "Bechyně"
      },
      {
        "name": "Bedihošť",
        "center": [
          49.44826,
          17.16643
        ],
        "label": "Bedihošť"
      },
      {
        "name": "Benecko",
        "center": [
          50.66633,
          15.54816
        ],
        "label": "Benecko"
      },
      {
        "name": "Benešov",
        "center": [
          49.78162,
          14.68697
        ],
        "label": "Benešov"
      },
      {
        "name": "Benešov nad Ploučnicí",
        "center": [
          50.74159,
          14.31239
        ],
        "label": "Benešov nad Ploučnicí"
      },
      {
        "name": "Benešov nad Černou",
        "center": [
          48.7294,
          14.62737
        ],
        "label": "Benešov nad Černou"
      },
      {
        "name": "Benátky nad Jizerou",
        "center": [
          50.29085,
          14.82343
        ],
        "label": "Benátky nad Jizerou"
      },
      {
        "name": "Bernartice",
        "center": [
          49.36889,
          14.38101
        ],
        "label": "Bernartice"
      }
    ]
  },
  {
    "code": "CD",
    "name": "Democratic Republic of the Congo",
    "cities": [
      {
        "name": "Aketi",
        "center": [
          2.73877,
          23.78326
        ],
        "label": "Aketi"
      },
      {
        "name": "Bandundu",
        "center": [
          -3.31687,
          17.38063
        ],
        "label": "Bandundu"
      },
      {
        "name": "Basoko",
        "center": [
          1.23909,
          23.61598
        ],
        "label": "Basoko"
      },
      {
        "name": "Beni",
        "center": [
          0.49113,
          29.47306
        ],
        "label": "Beni"
      },
      {
        "name": "Boende",
        "center": [
          -0.28163,
          20.88053
        ],
        "label": "Boende"
      },
      {
        "name": "Bolobo",
        "center": [
          -2.158,
          16.23249
        ],
        "label": "Bolobo"
      },
      {
        "name": "Boma",
        "center": [
          -5.85098,
          13.05364
        ],
        "label": "Boma"
      },
      {
        "name": "Bondo",
        "center": [
          3.81461,
          23.68665
        ],
        "label": "Bondo"
      },
      {
        "name": "Bongandanga",
        "center": [
          1.50695,
          21.0726
        ],
        "label": "Bongandanga"
      },
      {
        "name": "Bosobolo",
        "center": [
          4.1898,
          19.8833
        ],
        "label": "Bosobolo"
      },
      {
        "name": "Bukama",
        "center": [
          -9.20443,
          25.85475
        ],
        "label": "Bukama"
      },
      {
        "name": "Bukavu",
        "center": [
          -2.49077,
          28.84281
        ],
        "label": "Bukavu"
      },
      {
        "name": "Bulungu",
        "center": [
          -4.54437,
          18.60364
        ],
        "label": "Bulungu"
      },
      {
        "name": "Bumba",
        "center": [
          2.18771,
          22.46827
        ],
        "label": "Bumba"
      },
      {
        "name": "Bunia",
        "center": [
          1.55941,
          30.25224
        ],
        "label": "Bunia"
      },
      {
        "name": "Businga",
        "center": [
          3.33863,
          20.88577
        ],
        "label": "Businga"
      },
      {
        "name": "Buta",
        "center": [
          2.78582,
          24.72997
        ],
        "label": "Buta"
      },
      {
        "name": "Butembo",
        "center": [
          0.14164,
          29.29117
        ],
        "label": "Butembo"
      },
      {
        "name": "Gandajika",
        "center": [
          -6.74504,
          23.95328
        ],
        "label": "Gandajika"
      },
      {
        "name": "Gbadolite",
        "center": [
          4.279,
          21.00284
        ],
        "label": "Gbadolite"
      }
    ]
  },
  {
    "code": "DK",
    "name": "Denmark",
    "cities": [
      {
        "name": "Aabenraa",
        "center": [
          55.04434,
          9.41741
        ],
        "label": "Aabenraa"
      },
      {
        "name": "Aabenraa Kommune",
        "center": [
          54.9898,
          9.31282
        ],
        "label": "Aabenraa Kommune"
      },
      {
        "name": "Aalborg",
        "center": [
          57.048,
          9.9187
        ],
        "label": "Aalborg"
      },
      {
        "name": "Aars",
        "center": [
          56.80399,
          9.51441
        ],
        "label": "Aars"
      },
      {
        "name": "Albertslund",
        "center": [
          55.65691,
          12.36381
        ],
        "label": "Albertslund"
      },
      {
        "name": "Albertslund Kommune",
        "center": [
          55.68022,
          12.34797
        ],
        "label": "Albertslund Kommune"
      },
      {
        "name": "Allerød Kommune",
        "center": [
          55.85856,
          12.32558
        ],
        "label": "Allerød Kommune"
      },
      {
        "name": "Allingåbro",
        "center": [
          56.46432,
          10.31957
        ],
        "label": "Allingåbro"
      },
      {
        "name": "Arden",
        "center": [
          56.76899,
          9.86184
        ],
        "label": "Arden"
      },
      {
        "name": "Asnæs",
        "center": [
          55.81229,
          11.50129
        ],
        "label": "Asnæs"
      },
      {
        "name": "Assens",
        "center": [
          55.27023,
          9.90081
        ],
        "label": "Assens"
      },
      {
        "name": "Assens Kommune",
        "center": [
          55.29958,
          10.07952
        ],
        "label": "Assens Kommune"
      },
      {
        "name": "Assentoft",
        "center": [
          56.4421,
          10.1517
        ],
        "label": "Assentoft"
      },
      {
        "name": "Augustenborg",
        "center": [
          54.95201,
          9.87216
        ],
        "label": "Augustenborg"
      },
      {
        "name": "Auning",
        "center": [
          56.43079,
          10.37818
        ],
        "label": "Auning"
      },
      {
        "name": "Avlum",
        "center": [
          56.26539,
          8.79256
        ],
        "label": "Avlum"
      },
      {
        "name": "Ballerup",
        "center": [
          55.73165,
          12.36328
        ],
        "label": "Ballerup"
      },
      {
        "name": "Ballerup Kommune",
        "center": [
          55.73248,
          12.35793
        ],
        "label": "Ballerup Kommune"
      },
      {
        "name": "Beder",
        "center": [
          56.06025,
          10.21179
        ],
        "label": "Beder"
      },
      {
        "name": "Bellinge",
        "center": [
          55.33535,
          10.32045
        ],
        "label": "Bellinge"
      }
    ]
  },
  {
    "code": "DJ",
    "name": "Djibouti",
    "cities": [
      {
        "name": "'Ali Sabieh",
        "center": [
          11.15583,
          42.7125
        ],
        "label": "'Ali Sabieh"
      },
      {
        "name": "Alaïli Ḏaḏḏa‘",
        "center": [
          12.42167,
          42.89556
        ],
        "label": "Alaïli Ḏaḏḏa‘"
      },
      {
        "name": "Arta",
        "center": [
          11.52639,
          42.85194
        ],
        "label": "Arta"
      },
      {
        "name": "Dikhil",
        "center": [
          11.10454,
          42.36971
        ],
        "label": "Dikhil"
      },
      {
        "name": "Djibouti",
        "center": [
          11.58901,
          43.14503
        ],
        "label": "Djibouti"
      },
      {
        "name": "Dorra",
        "center": [
          12.15028,
          42.47624
        ],
        "label": "Dorra"
      },
      {
        "name": "Goubétto",
        "center": [
          11.42389,
          43.00028
        ],
        "label": "Goubétto"
      },
      {
        "name": "Gâlâfi",
        "center": [
          11.71583,
          41.83611
        ],
        "label": "Gâlâfi"
      },
      {
        "name": "Holhol",
        "center": [
          11.31028,
          42.92944
        ],
        "label": "Holhol"
      },
      {
        "name": "Loyada",
        "center": [
          11.46111,
          43.25278
        ],
        "label": "Loyada"
      },
      {
        "name": "Obock",
        "center": [
          11.96693,
          43.28835
        ],
        "label": "Obock"
      },
      {
        "name": "Tadjourah",
        "center": [
          11.78778,
          42.88222
        ],
        "label": "Tadjourah"
      }
    ]
  },
  {
    "code": "DM",
    "name": "Dominica",
    "cities": [
      {
        "name": "Berekua",
        "center": [
          15.23333,
          -61.31667
        ],
        "label": "Berekua"
      },
      {
        "name": "Calibishie",
        "center": [
          15.59297,
          -61.34901
        ],
        "label": "Calibishie"
      },
      {
        "name": "Castle Bruce",
        "center": [
          15.44397,
          -61.25723
        ],
        "label": "Castle Bruce"
      },
      {
        "name": "Colihaut",
        "center": [
          15.48478,
          -61.46215
        ],
        "label": "Colihaut"
      },
      {
        "name": "La Plaine",
        "center": [
          15.32768,
          -61.24753
        ],
        "label": "La Plaine"
      },
      {
        "name": "Mahaut",
        "center": [
          15.36357,
          -61.39701
        ],
        "label": "Mahaut"
      },
      {
        "name": "Marigot",
        "center": [
          15.53886,
          -61.28375
        ],
        "label": "Marigot"
      },
      {
        "name": "Pointe Michel",
        "center": [
          15.25976,
          -61.37452
        ],
        "label": "Pointe Michel"
      },
      {
        "name": "Pont Cassé",
        "center": [
          15.36667,
          -61.35
        ],
        "label": "Pont Cassé"
      },
      {
        "name": "Portsmouth",
        "center": [
          15.58333,
          -61.46667
        ],
        "label": "Portsmouth"
      },
      {
        "name": "Rosalie",
        "center": [
          15.36667,
          -61.26667
        ],
        "label": "Rosalie"
      },
      {
        "name": "Roseau",
        "center": [
          15.30174,
          -61.38808
        ],
        "label": "Roseau"
      },
      {
        "name": "Saint Joseph",
        "center": [
          15.4,
          -61.43333
        ],
        "label": "Saint Joseph"
      },
      {
        "name": "Salisbury",
        "center": [
          15.43689,
          -61.43637
        ],
        "label": "Salisbury"
      },
      {
        "name": "Soufrière",
        "center": [
          15.23374,
          -61.35881
        ],
        "label": "Soufrière"
      },
      {
        "name": "Wesley",
        "center": [
          15.56667,
          -61.31667
        ],
        "label": "Wesley"
      },
      {
        "name": "Woodford Hill",
        "center": [
          15.58093,
          -61.33149
        ],
        "label": "Woodford Hill"
      }
    ]
  },
  {
    "code": "DO",
    "name": "Dominican Republic",
    "cities": [
      {
        "name": "Agua Santa del Yuna",
        "center": [
          19.15072,
          -69.80069
        ],
        "label": "Agua Santa del Yuna"
      },
      {
        "name": "Altamira",
        "center": [
          19.7,
          -70.83333
        ],
        "label": "Altamira"
      },
      {
        "name": "Amina",
        "center": [
          19.54813,
          -70.99599
        ],
        "label": "Amina"
      },
      {
        "name": "Arenoso",
        "center": [
          19.18732,
          -69.85917
        ],
        "label": "Arenoso"
      },
      {
        "name": "Arroyo Salado",
        "center": [
          19.5,
          -69.9
        ],
        "label": "Arroyo Salado"
      },
      {
        "name": "Azua",
        "center": [
          18.45319,
          -70.7349
        ],
        "label": "Azua"
      },
      {
        "name": "Baitoa",
        "center": [
          19.32512,
          -70.70357
        ],
        "label": "Baitoa"
      },
      {
        "name": "Bajos de Haina",
        "center": [
          18.41667,
          -70.03333
        ],
        "label": "Bajos de Haina"
      },
      {
        "name": "Baní",
        "center": [
          18.27964,
          -70.33185
        ],
        "label": "Baní"
      },
      {
        "name": "Bayaguana",
        "center": [
          18.78333,
          -69.6
        ],
        "label": "Bayaguana"
      },
      {
        "name": "Bella Vista",
        "center": [
          18.45539,
          -69.9454
        ],
        "label": "Bella Vista"
      },
      {
        "name": "Bisonó",
        "center": [
          19.58333,
          -70.86667
        ],
        "label": "Bisonó"
      },
      {
        "name": "Boca Chica",
        "center": [
          18.45,
          -69.6
        ],
        "label": "Boca Chica"
      },
      {
        "name": "Boca de Yuma",
        "center": [
          18.37825,
          -68.609
        ],
        "label": "Boca de Yuma"
      },
      {
        "name": "Bohechío",
        "center": [
          18.77515,
          -70.98889
        ],
        "label": "Bohechío"
      },
      {
        "name": "Bonao",
        "center": [
          18.91667,
          -70.46667
        ],
        "label": "Bonao"
      },
      {
        "name": "Cabarete",
        "center": [
          19.74982,
          -70.40829
        ],
        "label": "Cabarete"
      },
      {
        "name": "Cabral",
        "center": [
          18.19991,
          -71.2466
        ],
        "label": "Cabral"
      },
      {
        "name": "Cabrera",
        "center": [
          19.6426,
          -69.90489
        ],
        "label": "Cabrera"
      },
      {
        "name": "Cachón",
        "center": [
          18.24833,
          -71.18912
        ],
        "label": "Cachón"
      }
    ]
  },
  {
    "code": "TL",
    "name": "East Timor",
    "cities": [
      {
        "name": "Aileu",
        "center": [
          -8.72806,
          125.56639
        ],
        "label": "Aileu"
      },
      {
        "name": "Ainaro",
        "center": [
          -8.99241,
          125.50816
        ],
        "label": "Ainaro"
      },
      {
        "name": "Alas",
        "center": [
          -9.0273,
          125.7868
        ],
        "label": "Alas"
      },
      {
        "name": "Atauro Island",
        "center": [
          -8.26785,
          125.59699
        ],
        "label": "Atauro Island"
      },
      {
        "name": "Baguia",
        "center": [
          -8.62787,
          126.65743
        ],
        "label": "Baguia"
      },
      {
        "name": "Barique",
        "center": [
          -8.85472,
          126.06556
        ],
        "label": "Barique"
      },
      {
        "name": "Baucau",
        "center": [
          -8.46667,
          126.45
        ],
        "label": "Baucau"
      },
      {
        "name": "Baukau",
        "center": [
          -8.47572,
          126.45633
        ],
        "label": "Baukau"
      },
      {
        "name": "Bazartete",
        "center": [
          -8.62464,
          125.38168
        ],
        "label": "Bazartete"
      },
      {
        "name": "Cristo Rei",
        "center": [
          -8.52047,
          125.60837
        ],
        "label": "Cristo Rei"
      },
      {
        "name": "Dili",
        "center": [
          -8.55861,
          125.57361
        ],
        "label": "Dili"
      },
      {
        "name": "Ermera Villa",
        "center": [
          -8.75222,
          125.39694
        ],
        "label": "Ermera Villa"
      },
      {
        "name": "Fatuberliu",
        "center": [
          -8.9479,
          125.86633
        ],
        "label": "Fatuberliu"
      },
      {
        "name": "Fatumean",
        "center": [
          -9.22917,
          125.03583
        ],
        "label": "Fatumean"
      },
      {
        "name": "Fohorem",
        "center": [
          -9.28361,
          125.08944
        ],
        "label": "Fohorem"
      },
      {
        "name": "Gleno",
        "center": [
          -8.72389,
          125.43611
        ],
        "label": "Gleno"
      },
      {
        "name": "Hato-Udo",
        "center": [
          -9.12036,
          125.58935
        ],
        "label": "Hato-Udo"
      },
      {
        "name": "Hatulia",
        "center": [
          -8.81667,
          125.31667
        ],
        "label": "Hatulia"
      },
      {
        "name": "Iliomar",
        "center": [
          -8.70917,
          126.82833
        ],
        "label": "Iliomar"
      },
      {
        "name": "Laclo",
        "center": [
          -8.55,
          125.91667
        ],
        "label": "Laclo"
      }
    ]
  },
  {
    "code": "EC",
    "name": "Ecuador",
    "cities": [
      {
        "name": "Alausí",
        "center": [
          -2.20329,
          -78.84714
        ],
        "label": "Alausí"
      },
      {
        "name": "Alfredo Baquerizo Moreno",
        "center": [
          -1.91667,
          -79.51667
        ],
        "label": "Alfredo Baquerizo Moreno"
      },
      {
        "name": "Ambato",
        "center": [
          -1.24908,
          -78.61675
        ],
        "label": "Ambato"
      },
      {
        "name": "Archidona",
        "center": [
          -0.9095,
          -77.80772
        ],
        "label": "Archidona"
      },
      {
        "name": "Atuntaqui",
        "center": [
          0.33247,
          -78.21371
        ],
        "label": "Atuntaqui"
      },
      {
        "name": "Azogues",
        "center": [
          -2.73969,
          -78.8486
        ],
        "label": "Azogues"
      },
      {
        "name": "Babahoyo",
        "center": [
          -1.80217,
          -79.53443
        ],
        "label": "Babahoyo"
      },
      {
        "name": "Bahía de Caráquez",
        "center": [
          -0.59792,
          -80.42367
        ],
        "label": "Bahía de Caráquez"
      },
      {
        "name": "Balzar",
        "center": [
          -1.36501,
          -79.90494
        ],
        "label": "Balzar"
      },
      {
        "name": "Baláo",
        "center": [
          -2.911,
          -79.81441
        ],
        "label": "Baláo"
      },
      {
        "name": "Baños",
        "center": [
          -1.39699,
          -78.42289
        ],
        "label": "Baños"
      },
      {
        "name": "Boca Suno",
        "center": [
          -0.69832,
          -77.14083
        ],
        "label": "Boca Suno"
      },
      {
        "name": "Calceta",
        "center": [
          -0.84582,
          -80.16389
        ],
        "label": "Calceta"
      },
      {
        "name": "Cantón Portoviejo",
        "center": [
          -1.05,
          -80.45
        ],
        "label": "Cantón Portoviejo"
      },
      {
        "name": "Cantón San Fernando",
        "center": [
          -3.13349,
          -79.26893
        ],
        "label": "Cantón San Fernando"
      },
      {
        "name": "Catarama",
        "center": [
          -1.57504,
          -79.45998
        ],
        "label": "Catarama"
      },
      {
        "name": "Cayambe",
        "center": [
          0.04084,
          -78.14524
        ],
        "label": "Cayambe"
      },
      {
        "name": "Cañar",
        "center": [
          -2.56062,
          -78.9394
        ],
        "label": "Cañar"
      },
      {
        "name": "Chone",
        "center": [
          -0.69819,
          -80.09361
        ],
        "label": "Chone"
      },
      {
        "name": "Colimes",
        "center": [
          -1.54553,
          -80.01165
        ],
        "label": "Colimes"
      }
    ]
  },
  {
    "code": "EG",
    "name": "Egypt",
    "cities": [
      {
        "name": "10th of Ramadan",
        "center": [
          30.2993939,
          31.6141789
        ],
        "label": "10th of Ramadan"
      },
      {
        "name": "Abnūb",
        "center": [
          27.2696,
          31.15105
        ],
        "label": "Abnūb"
      },
      {
        "name": "Abu Simbel",
        "center": [
          22.3457,
          31.61624
        ],
        "label": "Abu Simbel"
      },
      {
        "name": "Abū Qurqāş",
        "center": [
          27.9312,
          30.83841
        ],
        "label": "Abū Qurqāş"
      },
      {
        "name": "Abū Tīj",
        "center": [
          27.04411,
          31.31897
        ],
        "label": "Abū Tīj"
      },
      {
        "name": "Abū al Maţāmīr",
        "center": [
          30.91018,
          30.17438
        ],
        "label": "Abū al Maţāmīr"
      },
      {
        "name": "Ad Dilinjāt",
        "center": [
          30.82796,
          30.53552
        ],
        "label": "Ad Dilinjāt"
      },
      {
        "name": "Ain Sukhna",
        "center": [
          29.60018,
          32.31671
        ],
        "label": "Ain Sukhna"
      },
      {
        "name": "Ajā",
        "center": [
          30.94162,
          31.29039
        ],
        "label": "Ajā"
      },
      {
        "name": "Akhmīm",
        "center": [
          26.56217,
          31.74503
        ],
        "label": "Akhmīm"
      },
      {
        "name": "Al Badārī",
        "center": [
          26.99257,
          31.41554
        ],
        "label": "Al Badārī"
      },
      {
        "name": "Al Balyanā",
        "center": [
          26.23568,
          32.00347
        ],
        "label": "Al Balyanā"
      },
      {
        "name": "Al Bawīţī",
        "center": [
          28.34919,
          28.86591
        ],
        "label": "Al Bawīţī"
      },
      {
        "name": "Al Bājūr",
        "center": [
          30.43046,
          31.03679
        ],
        "label": "Al Bājūr"
      },
      {
        "name": "Al Fashn",
        "center": [
          28.82431,
          30.89948
        ],
        "label": "Al Fashn"
      },
      {
        "name": "Al Fayyūm",
        "center": [
          29.30995,
          30.8418
        ],
        "label": "Al Fayyūm"
      },
      {
        "name": "Al Jammālīyah",
        "center": [
          31.18065,
          31.86497
        ],
        "label": "Al Jammālīyah"
      },
      {
        "name": "Al Khānkah",
        "center": [
          30.21035,
          31.36812
        ],
        "label": "Al Khānkah"
      },
      {
        "name": "Al Khārijah",
        "center": [
          25.45141,
          30.54635
        ],
        "label": "Al Khārijah"
      },
      {
        "name": "Al Manshāh",
        "center": [
          26.47686,
          31.8035
        ],
        "label": "Al Manshāh"
      }
    ]
  },
  {
    "code": "SV",
    "name": "El Salvador",
    "cities": [
      {
        "name": "Acajutla",
        "center": [
          13.59278,
          -89.8275
        ],
        "label": "Acajutla"
      },
      {
        "name": "Aguilares",
        "center": [
          13.95722,
          -89.18972
        ],
        "label": "Aguilares"
      },
      {
        "name": "Ahuachapán",
        "center": [
          13.92139,
          -89.845
        ],
        "label": "Ahuachapán"
      },
      {
        "name": "Anamorós",
        "center": [
          13.74056,
          -87.87361
        ],
        "label": "Anamorós"
      },
      {
        "name": "Antiguo Cuscatlán",
        "center": [
          13.66492,
          -89.25319
        ],
        "label": "Antiguo Cuscatlán"
      },
      {
        "name": "Apastepeque",
        "center": [
          13.66667,
          -88.78333
        ],
        "label": "Apastepeque"
      },
      {
        "name": "Apopa",
        "center": [
          13.80722,
          -89.17917
        ],
        "label": "Apopa"
      },
      {
        "name": "Armenia",
        "center": [
          13.74361,
          -89.49889
        ],
        "label": "Armenia"
      },
      {
        "name": "Atiquizaya",
        "center": [
          13.97694,
          -89.7525
        ],
        "label": "Atiquizaya"
      },
      {
        "name": "Ayutuxtepeque",
        "center": [
          13.74556,
          -89.20639
        ],
        "label": "Ayutuxtepeque"
      },
      {
        "name": "Berlín",
        "center": [
          13.5,
          -88.53333
        ],
        "label": "Berlín"
      },
      {
        "name": "Cacaopera",
        "center": [
          13.76667,
          -88.08333
        ],
        "label": "Cacaopera"
      },
      {
        "name": "Candelaria de La Frontera",
        "center": [
          14.11667,
          -89.65
        ],
        "label": "Candelaria de La Frontera"
      },
      {
        "name": "Chalatenango",
        "center": [
          14.03333,
          -88.93333
        ],
        "label": "Chalatenango"
      },
      {
        "name": "Chalchuapa",
        "center": [
          13.98667,
          -89.68111
        ],
        "label": "Chalchuapa"
      },
      {
        "name": "Chapeltique",
        "center": [
          13.63333,
          -88.26667
        ],
        "label": "Chapeltique"
      },
      {
        "name": "Chinameca",
        "center": [
          13.5,
          -88.35
        ],
        "label": "Chinameca"
      },
      {
        "name": "Chirilagua",
        "center": [
          13.22028,
          -88.13861
        ],
        "label": "Chirilagua"
      },
      {
        "name": "Ciudad Arce",
        "center": [
          13.84028,
          -89.44722
        ],
        "label": "Ciudad Arce"
      },
      {
        "name": "Ciudad Barrios",
        "center": [
          13.76667,
          -88.26667
        ],
        "label": "Ciudad Barrios"
      }
    ]
  },
  {
    "code": "GQ",
    "name": "Equatorial Guinea",
    "cities": [
      {
        "name": "Aconibe",
        "center": [
          1.29683,
          10.93691
        ],
        "label": "Aconibe"
      },
      {
        "name": "Acurenam",
        "center": [
          1.03225,
          10.64882
        ],
        "label": "Acurenam"
      },
      {
        "name": "Ayene",
        "center": [
          1.85592,
          10.68994
        ],
        "label": "Ayene"
      },
      {
        "name": "Añisoc",
        "center": [
          1.8658,
          10.76892
        ],
        "label": "Añisoc"
      },
      {
        "name": "Bata",
        "center": [
          1.86391,
          9.76582
        ],
        "label": "Bata"
      },
      {
        "name": "Bicurga",
        "center": [
          1.58113,
          10.46716
        ],
        "label": "Bicurga"
      },
      {
        "name": "Bitica",
        "center": [
          1.4261,
          9.62316
        ],
        "label": "Bitica"
      },
      {
        "name": "Cogo",
        "center": [
          1.08425,
          9.693
        ],
        "label": "Cogo"
      },
      {
        "name": "Ebebiyin",
        "center": [
          2.15106,
          11.33528
        ],
        "label": "Ebebiyin"
      },
      {
        "name": "Evinayong",
        "center": [
          1.43677,
          10.55124
        ],
        "label": "Evinayong"
      },
      {
        "name": "Luba",
        "center": [
          3.45683,
          8.55465
        ],
        "label": "Luba"
      },
      {
        "name": "Machinda",
        "center": [
          1.88262,
          9.95133
        ],
        "label": "Machinda"
      },
      {
        "name": "Malabo",
        "center": [
          3.75578,
          8.78166
        ],
        "label": "Malabo"
      },
      {
        "name": "Mbini",
        "center": [
          1.58267,
          9.61478
        ],
        "label": "Mbini"
      },
      {
        "name": "Mengomeyén",
        "center": [
          1.69439,
          11.03422
        ],
        "label": "Mengomeyén"
      },
      {
        "name": "Mikomeseng",
        "center": [
          2.13609,
          10.61322
        ],
        "label": "Mikomeseng"
      },
      {
        "name": "Mongomo",
        "center": [
          1.62742,
          11.31346
        ],
        "label": "Mongomo"
      },
      {
        "name": "Ncue",
        "center": [
          2.01643,
          10.47066
        ],
        "label": "Ncue"
      },
      {
        "name": "Nsang",
        "center": [
          2.02475,
          10.94599
        ],
        "label": "Nsang"
      },
      {
        "name": "Nsok",
        "center": [
          1.12985,
          11.26603
        ],
        "label": "Nsok"
      }
    ]
  },
  {
    "code": "ER",
    "name": "Eritrea",
    "cities": [
      {
        "name": "Adi Keyh",
        "center": [
          14.84444,
          39.37722
        ],
        "label": "Adi Keyh"
      },
      {
        "name": "Ak’ordat",
        "center": [
          15.54798,
          37.88291
        ],
        "label": "Ak’ordat"
      },
      {
        "name": "Asmara",
        "center": [
          15.33805,
          38.93184
        ],
        "label": "Asmara"
      },
      {
        "name": "Assab",
        "center": [
          13.00917,
          42.73944
        ],
        "label": "Assab"
      },
      {
        "name": "Barentu",
        "center": [
          15.10582,
          37.59067
        ],
        "label": "Barentu"
      },
      {
        "name": "Dek’emhāre",
        "center": [
          15.07,
          39.0475
        ],
        "label": "Dek’emhāre"
      },
      {
        "name": "Edd",
        "center": [
          13.93088,
          41.6938
        ],
        "label": "Edd"
      },
      {
        "name": "Keren",
        "center": [
          15.77792,
          38.45107
        ],
        "label": "Keren"
      },
      {
        "name": "Massawa",
        "center": [
          15.60811,
          39.47455
        ],
        "label": "Massawa"
      },
      {
        "name": "Mendefera",
        "center": [
          14.88722,
          38.81528
        ],
        "label": "Mendefera"
      },
      {
        "name": "Teseney",
        "center": [
          15.11,
          36.6575
        ],
        "label": "Teseney"
      }
    ]
  },
  {
    "code": "EE",
    "name": "Estonia",
    "cities": [
      {
        "name": "Abja-Paluoja",
        "center": [
          58.12528,
          25.34972
        ],
        "label": "Abja-Paluoja"
      },
      {
        "name": "Alatskivi",
        "center": [
          58.59806,
          27.13361
        ],
        "label": "Alatskivi"
      },
      {
        "name": "Anija vald",
        "center": [
          59.27644,
          25.48168
        ],
        "label": "Anija vald"
      },
      {
        "name": "Antsla",
        "center": [
          57.82556,
          26.54056
        ],
        "label": "Antsla"
      },
      {
        "name": "Antsla vald",
        "center": [
          57.77738,
          26.5952
        ],
        "label": "Antsla vald"
      },
      {
        "name": "Aruküla",
        "center": [
          59.36686,
          25.07618
        ],
        "label": "Aruküla"
      },
      {
        "name": "Aseri",
        "center": [
          59.45056,
          26.8675
        ],
        "label": "Aseri"
      },
      {
        "name": "Audru",
        "center": [
          58.40861,
          24.37389
        ],
        "label": "Audru"
      },
      {
        "name": "Elva",
        "center": [
          58.2225,
          26.42111
        ],
        "label": "Elva"
      },
      {
        "name": "Haabneeme",
        "center": [
          59.51358,
          24.82225
        ],
        "label": "Haabneeme"
      },
      {
        "name": "Haapsalu",
        "center": [
          58.94306,
          23.54139
        ],
        "label": "Haapsalu"
      },
      {
        "name": "Haapsalu linn",
        "center": [
          58.9358,
          23.53005
        ],
        "label": "Haapsalu linn"
      },
      {
        "name": "Haljala",
        "center": [
          59.43361,
          26.26139
        ],
        "label": "Haljala"
      },
      {
        "name": "Haljala vald",
        "center": [
          59.45427,
          26.22015
        ],
        "label": "Haljala vald"
      },
      {
        "name": "Harku",
        "center": [
          59.38641,
          24.57176
        ],
        "label": "Harku"
      },
      {
        "name": "Harku vald",
        "center": [
          59.39157,
          24.46206
        ],
        "label": "Harku vald"
      },
      {
        "name": "Hullo",
        "center": [
          58.99004,
          23.24441
        ],
        "label": "Hullo"
      },
      {
        "name": "Iisaku",
        "center": [
          59.10139,
          27.30806
        ],
        "label": "Iisaku"
      },
      {
        "name": "Järva-Jaani",
        "center": [
          59.03861,
          25.88639
        ],
        "label": "Järva-Jaani"
      },
      {
        "name": "Järvakandi",
        "center": [
          58.77889,
          24.82583
        ],
        "label": "Järvakandi"
      }
    ]
  },
  {
    "code": "ET",
    "name": "Ethiopia",
    "cities": [
      {
        "name": "Abomsa",
        "center": [
          9.98333,
          39.98333
        ],
        "label": "Abomsa"
      },
      {
        "name": "Addiet Canna",
        "center": [
          11.26667,
          37.48333
        ],
        "label": "Addiet Canna"
      },
      {
        "name": "Addis Ababa",
        "center": [
          9.02497,
          38.74689
        ],
        "label": "Addis Ababa"
      },
      {
        "name": "Administrative Zone 1",
        "center": [
          8.14699,
          33.97335
        ],
        "label": "Administrative Zone 1"
      },
      {
        "name": "Administrative Zone 2",
        "center": [
          13.68513,
          40.05615
        ],
        "label": "Administrative Zone 2"
      },
      {
        "name": "Administrative Zone 3",
        "center": [
          10.00902,
          40.47394
        ],
        "label": "Administrative Zone 3"
      },
      {
        "name": "Afder Zone",
        "center": [
          5.25,
          43
        ],
        "label": "Afder Zone"
      },
      {
        "name": "Alaba Special Wereda",
        "center": [
          7.45347,
          38.21189
        ],
        "label": "Alaba Special Wereda"
      },
      {
        "name": "Arba Minch",
        "center": [
          6.03333,
          37.55
        ],
        "label": "Arba Minch"
      },
      {
        "name": "Arsi Zone",
        "center": [
          7.5,
          39.5
        ],
        "label": "Arsi Zone"
      },
      {
        "name": "Asaita",
        "center": [
          11.56838,
          41.43869
        ],
        "label": "Asaita"
      },
      {
        "name": "Asosa",
        "center": [
          10,
          34.5
        ],
        "label": "Asosa"
      },
      {
        "name": "Axum",
        "center": [
          14.12109,
          38.72337
        ],
        "label": "Axum"
      },
      {
        "name": "Bahir Dar",
        "center": [
          11.59364,
          37.39077
        ],
        "label": "Bahir Dar"
      },
      {
        "name": "Bako",
        "center": [
          5.78333,
          36.56667
        ],
        "label": "Bako"
      },
      {
        "name": "Batī",
        "center": [
          11.19152,
          40.01675
        ],
        "label": "Batī"
      },
      {
        "name": "Bedelē",
        "center": [
          8.456,
          36.35302
        ],
        "label": "Bedelē"
      },
      {
        "name": "Bedēsa",
        "center": [
          8.9,
          40.78333
        ],
        "label": "Bedēsa"
      },
      {
        "name": "Bench Maji Zone",
        "center": [
          6.45994,
          35.30549
        ],
        "label": "Bench Maji Zone"
      },
      {
        "name": "Bichena",
        "center": [
          10.45,
          38.2
        ],
        "label": "Bichena"
      }
    ]
  },
  {
    "code": "FK",
    "name": "Falkland Islands",
    "cities": [
      {
        "name": "Falkland Islands City",
        "center": [
          -51.75,
          -59
        ],
        "label": "Falkland Islands (Capital / Main)"
      }
    ]
  },
  {
    "code": "FO",
    "name": "Faroe Islands",
    "cities": [
      {
        "name": "Torshavn",
        "center": [
          62.0107,
          -6.7716
        ],
        "label": "Torshavn"
      }
    ]
  },
  {
    "code": "FJ",
    "name": "Fiji Islands",
    "cities": [
      {
        "name": "Ba",
        "center": [
          -17.5343,
          177.67407
        ],
        "label": "Ba"
      },
      {
        "name": "Ba Province",
        "center": [
          -17.66667,
          177.66667
        ],
        "label": "Ba Province"
      },
      {
        "name": "Bua Province",
        "center": [
          -16.83333,
          178.75
        ],
        "label": "Bua Province"
      },
      {
        "name": "Cakaudrove Province",
        "center": [
          -16.66667,
          179.41667
        ],
        "label": "Cakaudrove Province"
      },
      {
        "name": "Kadavu Province",
        "center": [
          -18.99331,
          178.22021
        ],
        "label": "Kadavu Province"
      },
      {
        "name": "Labasa",
        "center": [
          -16.4332,
          179.36451
        ],
        "label": "Labasa"
      },
      {
        "name": "Lau Province",
        "center": [
          -18.20488,
          -178.79251
        ],
        "label": "Lau Province"
      },
      {
        "name": "Lautoka",
        "center": [
          -17.61686,
          177.45049
        ],
        "label": "Lautoka"
      },
      {
        "name": "Levuka",
        "center": [
          -18.06667,
          179.31667
        ],
        "label": "Levuka"
      },
      {
        "name": "Lomaiviti Province",
        "center": [
          -17.66667,
          178.8
        ],
        "label": "Lomaiviti Province"
      },
      {
        "name": "Macuata Province",
        "center": [
          -16.5,
          179.25
        ],
        "label": "Macuata Province"
      },
      {
        "name": "Nadi",
        "center": [
          -17.80309,
          177.41617
        ],
        "label": "Nadi"
      },
      {
        "name": "Naitasiri Province",
        "center": [
          -17.83333,
          178.25
        ],
        "label": "Naitasiri Province"
      },
      {
        "name": "Namosi Province",
        "center": [
          -18.05,
          178.13333
        ],
        "label": "Namosi Province"
      },
      {
        "name": "Nandronga and Navosa Province",
        "center": [
          -18,
          177.66667
        ],
        "label": "Nandronga and Navosa Province"
      },
      {
        "name": "Ra Province",
        "center": [
          -17.5,
          178.16667
        ],
        "label": "Ra Province"
      },
      {
        "name": "Rewa Province",
        "center": [
          -18.08333,
          178.33333
        ],
        "label": "Rewa Province"
      },
      {
        "name": "Serua Province",
        "center": [
          -18.16667,
          178
        ],
        "label": "Serua Province"
      },
      {
        "name": "Suva",
        "center": [
          -18.14161,
          178.44149
        ],
        "label": "Suva"
      },
      {
        "name": "Tailevu Province",
        "center": [
          -17.83333,
          178.5
        ],
        "label": "Tailevu Province"
      }
    ]
  },
  {
    "code": "FI",
    "name": "Finland",
    "cities": [
      {
        "name": "Alahärmä",
        "center": [
          63.23333,
          22.85
        ],
        "label": "Alahärmä"
      },
      {
        "name": "Alajärvi",
        "center": [
          63,
          23.81667
        ],
        "label": "Alajärvi"
      },
      {
        "name": "Alastaro",
        "center": [
          60.95,
          22.85
        ],
        "label": "Alastaro"
      },
      {
        "name": "Alavieska",
        "center": [
          64.16667,
          24.3
        ],
        "label": "Alavieska"
      },
      {
        "name": "Alavus",
        "center": [
          62.58333,
          23.61667
        ],
        "label": "Alavus"
      },
      {
        "name": "Anjala",
        "center": [
          60.68333,
          26.83333
        ],
        "label": "Anjala"
      },
      {
        "name": "Artjärvi",
        "center": [
          60.74544,
          26.07084
        ],
        "label": "Artjärvi"
      },
      {
        "name": "Asikkala",
        "center": [
          61.21667,
          25.5
        ],
        "label": "Asikkala"
      },
      {
        "name": "Askainen",
        "center": [
          60.56667,
          21.86667
        ],
        "label": "Askainen"
      },
      {
        "name": "Askola",
        "center": [
          60.53333,
          25.6
        ],
        "label": "Askola"
      },
      {
        "name": "Aura",
        "center": [
          60.6471,
          22.58755
        ],
        "label": "Aura"
      },
      {
        "name": "Auttoinen",
        "center": [
          61.29901,
          25.08887
        ],
        "label": "Auttoinen"
      },
      {
        "name": "Dragsfjärd",
        "center": [
          60.06667,
          22.48333
        ],
        "label": "Dragsfjärd"
      },
      {
        "name": "Ekenäs",
        "center": [
          59.97359,
          23.43389
        ],
        "label": "Ekenäs"
      },
      {
        "name": "Elimäki",
        "center": [
          60.71667,
          26.46667
        ],
        "label": "Elimäki"
      },
      {
        "name": "Eno",
        "center": [
          62.80511,
          30.15422
        ],
        "label": "Eno"
      },
      {
        "name": "Enonkoski",
        "center": [
          62.08333,
          28.93333
        ],
        "label": "Enonkoski"
      },
      {
        "name": "Enontekiö",
        "center": [
          68.38573,
          23.63215
        ],
        "label": "Enontekiö"
      },
      {
        "name": "Espoo",
        "center": [
          60.2052,
          24.6522
        ],
        "label": "Espoo"
      },
      {
        "name": "Eura",
        "center": [
          61.13333,
          22.13333
        ],
        "label": "Eura"
      }
    ]
  },
  {
    "code": "FR",
    "name": "France",
    "cities": [
      {
        "name": "Paris",
        "center": [
          48.8566,
          2.3522
        ],
        "label": "Paris"
      },
      {
        "name": "Lyon",
        "center": [
          45.764,
          4.8357
        ],
        "label": "Lyon"
      },
      {
        "name": "Marseille",
        "center": [
          43.2965,
          5.3698
        ],
        "label": "Marseille"
      },
      {
        "name": "Toulouse",
        "center": [
          43.6047,
          1.4442
        ],
        "label": "Toulouse"
      },
      {
        "name": "Nice",
        "center": [
          43.7102,
          7.262
        ],
        "label": "Nice"
      },
      {
        "name": "Nantes",
        "center": [
          47.2184,
          -1.5536
        ],
        "label": "Nantes"
      },
      {
        "name": "Strasbourg",
        "center": [
          48.5734,
          7.7521
        ],
        "label": "Strasbourg"
      },
      {
        "name": "Montpellier",
        "center": [
          43.6108,
          3.8767
        ],
        "label": "Montpellier"
      },
      {
        "name": "Bordeaux",
        "center": [
          44.8378,
          -0.5792
        ],
        "label": "Bordeaux"
      },
      {
        "name": "Lille",
        "center": [
          50.6292,
          3.0573
        ],
        "label": "Lille"
      }
    ]
  },
  {
    "code": "GF",
    "name": "French Guiana",
    "cities": [
      {
        "name": "French Guiana City",
        "center": [
          4,
          -53
        ],
        "label": "French Guiana (Capital / Main)"
      }
    ]
  },
  {
    "code": "PF",
    "name": "French Polynesia",
    "cities": [
      {
        "name": "Papeete",
        "center": [
          -17.5516,
          -149.5584
        ],
        "label": "Papeete"
      }
    ]
  },
  {
    "code": "TF",
    "name": "French Southern Territories",
    "cities": [
      {
        "name": "French Southern Territories City",
        "center": [
          -49.25,
          69.167
        ],
        "label": "French Southern Territories (Capital / Main)"
      }
    ]
  },
  {
    "code": "GA",
    "name": "Gabon",
    "cities": [
      {
        "name": "Bitam",
        "center": [
          2.07597,
          11.50065
        ],
        "label": "Bitam"
      },
      {
        "name": "Booué",
        "center": [
          -0.09207,
          11.93846
        ],
        "label": "Booué"
      },
      {
        "name": "Cocobeach",
        "center": [
          1.00019,
          9.58229
        ],
        "label": "Cocobeach"
      },
      {
        "name": "Fougamou",
        "center": [
          -1.21544,
          10.58378
        ],
        "label": "Fougamou"
      },
      {
        "name": "Franceville",
        "center": [
          -1.63333,
          13.58357
        ],
        "label": "Franceville"
      },
      {
        "name": "Gamba",
        "center": [
          -2.65,
          10
        ],
        "label": "Gamba"
      },
      {
        "name": "Koulamoutou",
        "center": [
          -1.13667,
          12.46399
        ],
        "label": "Koulamoutou"
      },
      {
        "name": "Lambaréné",
        "center": [
          -0.7001,
          10.24055
        ],
        "label": "Lambaréné"
      },
      {
        "name": "Lastoursville",
        "center": [
          -0.81742,
          12.70818
        ],
        "label": "Lastoursville"
      },
      {
        "name": "Libreville",
        "center": [
          0.39241,
          9.45356
        ],
        "label": "Libreville"
      },
      {
        "name": "Lékoni",
        "center": [
          -1.58431,
          14.25905
        ],
        "label": "Lékoni"
      },
      {
        "name": "Makokou",
        "center": [
          0.57381,
          12.86419
        ],
        "label": "Makokou"
      },
      {
        "name": "Mayumba",
        "center": [
          -3.43198,
          10.6554
        ],
        "label": "Mayumba"
      },
      {
        "name": "Mbigou",
        "center": [
          -1.90046,
          11.906
        ],
        "label": "Mbigou"
      },
      {
        "name": "Mimongo",
        "center": [
          -1.61952,
          11.60675
        ],
        "label": "Mimongo"
      },
      {
        "name": "Mitzic",
        "center": [
          0.78205,
          11.54904
        ],
        "label": "Mitzic"
      },
      {
        "name": "Moanda",
        "center": [
          -1.56652,
          13.1987
        ],
        "label": "Moanda"
      },
      {
        "name": "Mouila",
        "center": [
          -1.86846,
          11.05594
        ],
        "label": "Mouila"
      },
      {
        "name": "Mounana",
        "center": [
          -1.4085,
          13.15857
        ],
        "label": "Mounana"
      },
      {
        "name": "Ndendé",
        "center": [
          -2.40077,
          11.35813
        ],
        "label": "Ndendé"
      }
    ]
  },
  {
    "code": "GE",
    "name": "Georgia",
    "cities": [
      {
        "name": "Abasha",
        "center": [
          42.2,
          42.2
        ],
        "label": "Abasha"
      },
      {
        "name": "Adigeni",
        "center": [
          41.68191,
          42.69867
        ],
        "label": "Adigeni"
      },
      {
        "name": "Adigeni Municipality",
        "center": [
          41.71667,
          42.73333
        ],
        "label": "Adigeni Municipality"
      },
      {
        "name": "Agara",
        "center": [
          42.03761,
          43.82382
        ],
        "label": "Agara"
      },
      {
        "name": "Akhaldaba",
        "center": [
          41.65395,
          42.15163
        ],
        "label": "Akhaldaba"
      },
      {
        "name": "Akhalgori",
        "center": [
          42.12597,
          44.48333
        ],
        "label": "Akhalgori"
      },
      {
        "name": "Akhalk’alak’i",
        "center": [
          41.40514,
          43.48629
        ],
        "label": "Akhalk’alak’i"
      },
      {
        "name": "Akhaltsikhe",
        "center": [
          41.63901,
          42.98262
        ],
        "label": "Akhaltsikhe"
      },
      {
        "name": "Akhaltsikhis Munitsip’alit’et’i",
        "center": [
          41.63333,
          43
        ],
        "label": "Akhaltsikhis Munitsip’alit’et’i"
      },
      {
        "name": "Akhmet’a",
        "center": [
          42.03111,
          45.2075
        ],
        "label": "Akhmet’a"
      },
      {
        "name": "Akhmet’is Munitsip’alit’et’i",
        "center": [
          42.25,
          45.33333
        ],
        "label": "Akhmet’is Munitsip’alit’et’i"
      },
      {
        "name": "Ambrolauri",
        "center": [
          42.52111,
          43.16222
        ],
        "label": "Ambrolauri"
      },
      {
        "name": "Ambrolauris Munitsip’alit’et’i",
        "center": [
          42.56667,
          43.1
        ],
        "label": "Ambrolauris Munitsip’alit’et’i"
      },
      {
        "name": "Aspindza",
        "center": [
          41.57389,
          43.24826
        ],
        "label": "Aspindza"
      },
      {
        "name": "Asp’indzis Munitsip’alit’et’i",
        "center": [
          41.5,
          43.25
        ],
        "label": "Asp’indzis Munitsip’alit’et’i"
      },
      {
        "name": "Baghdatis Munitsip’alit’et’i",
        "center": [
          42,
          42.9
        ],
        "label": "Baghdatis Munitsip’alit’et’i"
      },
      {
        "name": "Bakuriani",
        "center": [
          41.74972,
          43.5325
        ],
        "label": "Bakuriani"
      },
      {
        "name": "Batumi",
        "center": [
          41.64228,
          41.63392
        ],
        "label": "Batumi"
      },
      {
        "name": "Bich’vinta",
        "center": [
          43.16197,
          40.34102
        ],
        "label": "Bich’vinta"
      },
      {
        "name": "Bolnisi",
        "center": [
          41.44794,
          44.53838
        ],
        "label": "Bolnisi"
      }
    ]
  },
  {
    "code": "DE",
    "name": "Germany",
    "cities": [
      {
        "name": "Berlin",
        "center": [
          52.52,
          13.405
        ],
        "label": "Berlin"
      },
      {
        "name": "Munich",
        "center": [
          48.1351,
          11.582
        ],
        "label": "Munich"
      },
      {
        "name": "Frankfurt",
        "center": [
          50.1109,
          8.6821
        ],
        "label": "Frankfurt"
      },
      {
        "name": "Hamburg",
        "center": [
          53.5511,
          9.9937
        ],
        "label": "Hamburg"
      },
      {
        "name": "Cologne",
        "center": [
          50.9375,
          6.9603
        ],
        "label": "Cologne"
      },
      {
        "name": "Stuttgart",
        "center": [
          48.7758,
          9.1829
        ],
        "label": "Stuttgart"
      },
      {
        "name": "Düsseldorf",
        "center": [
          51.2277,
          6.7735
        ],
        "label": "Düsseldorf"
      },
      {
        "name": "Leipzig",
        "center": [
          51.3397,
          12.3731
        ],
        "label": "Leipzig"
      },
      {
        "name": "Dresden",
        "center": [
          51.0504,
          13.7373
        ],
        "label": "Dresden"
      },
      {
        "name": "Hannover",
        "center": [
          52.3759,
          9.732
        ],
        "label": "Hannover"
      },
      {
        "name": "Nuremberg",
        "center": [
          49.4521,
          11.0767
        ],
        "label": "Nuremberg"
      }
    ]
  },
  {
    "code": "GH",
    "name": "Ghana",
    "cities": [
      {
        "name": "Aboso",
        "center": [
          5.36073,
          -1.94856
        ],
        "label": "Aboso"
      },
      {
        "name": "Aburi",
        "center": [
          5.84802,
          -0.17449
        ],
        "label": "Aburi"
      },
      {
        "name": "Accra",
        "center": [
          5.55602,
          -0.1969
        ],
        "label": "Accra"
      },
      {
        "name": "Aflao",
        "center": [
          6.11982,
          1.19012
        ],
        "label": "Aflao"
      },
      {
        "name": "Agogo",
        "center": [
          6.80004,
          -1.08193
        ],
        "label": "Agogo"
      },
      {
        "name": "Akim Oda",
        "center": [
          5.92665,
          -0.98577
        ],
        "label": "Akim Oda"
      },
      {
        "name": "Akim Swedru",
        "center": [
          5.8938,
          -1.01636
        ],
        "label": "Akim Swedru"
      },
      {
        "name": "Akropong",
        "center": [
          5.97462,
          -0.08542
        ],
        "label": "Akropong"
      },
      {
        "name": "Akwatia",
        "center": [
          6.04024,
          -0.80876
        ],
        "label": "Akwatia"
      },
      {
        "name": "Anloga",
        "center": [
          5.79473,
          0.89728
        ],
        "label": "Anloga"
      },
      {
        "name": "Aowin",
        "center": [
          5.7530928,
          -3.0751887
        ],
        "label": "Aowin"
      },
      {
        "name": "Apam",
        "center": [
          5.28483,
          -0.73711
        ],
        "label": "Apam"
      },
      {
        "name": "Asamankese",
        "center": [
          5.86006,
          -0.6635
        ],
        "label": "Asamankese"
      },
      {
        "name": "Asunafo North",
        "center": [
          6.8196891,
          -2.807705
        ],
        "label": "Asunafo North"
      },
      {
        "name": "Asunafo South",
        "center": [
          6.6480138,
          -2.6887437
        ],
        "label": "Asunafo South"
      },
      {
        "name": "Asutifi North",
        "center": [
          6.9477486,
          -2.7675716
        ],
        "label": "Asutifi North"
      },
      {
        "name": "Asutifi South",
        "center": [
          6.6480138,
          -2.6887437
        ],
        "label": "Asutifi South"
      },
      {
        "name": "Atebubu-Amantin",
        "center": [
          7.70237,
          -1.2197943
        ],
        "label": "Atebubu-Amantin"
      },
      {
        "name": "Atsiaman",
        "center": [
          5.69775,
          -0.32824
        ],
        "label": "Atsiaman"
      },
      {
        "name": "Axim",
        "center": [
          4.86641,
          -2.24181
        ],
        "label": "Axim"
      }
    ]
  },
  {
    "code": "GI",
    "name": "Gibraltar",
    "cities": [
      {
        "name": "Gibraltar",
        "center": [
          36.1408,
          -5.3536
        ],
        "label": "Gibraltar"
      }
    ]
  },
  {
    "code": "GR",
    "name": "Greece",
    "cities": [
      {
        "name": "Acharnés",
        "center": [
          38.08333,
          23.73333
        ],
        "label": "Acharnés"
      },
      {
        "name": "Acharávi",
        "center": [
          39.7936,
          19.81736
        ],
        "label": "Acharávi"
      },
      {
        "name": "Adámas",
        "center": [
          36.72506,
          24.44685
        ],
        "label": "Adámas"
      },
      {
        "name": "Aegina",
        "center": [
          37.74667,
          23.4275
        ],
        "label": "Aegina"
      },
      {
        "name": "Afidnés",
        "center": [
          38.20332,
          23.83982
        ],
        "label": "Afidnés"
      },
      {
        "name": "Afrátion",
        "center": [
          38.45212,
          23.68775
        ],
        "label": "Afrátion"
      },
      {
        "name": "Afántou",
        "center": [
          36.29354,
          28.16225
        ],
        "label": "Afántou"
      },
      {
        "name": "Aghios Panteleímon",
        "center": [
          38.11643,
          23.98182
        ],
        "label": "Aghios Panteleímon"
      },
      {
        "name": "Agios Dimitrios",
        "center": [
          37.93333,
          23.73333
        ],
        "label": "Agios Dimitrios"
      },
      {
        "name": "Agios Dimítrios Kropiás",
        "center": [
          37.80612,
          23.85793
        ],
        "label": "Agios Dimítrios Kropiás"
      },
      {
        "name": "Agios Georgis",
        "center": [
          39.72363,
          19.69969
        ],
        "label": "Agios Georgis"
      },
      {
        "name": "Agios Ioannis Rentis",
        "center": [
          37.96491,
          23.66511
        ],
        "label": "Agios Ioannis Rentis"
      },
      {
        "name": "Agkathiá",
        "center": [
          40.55535,
          22.47083
        ],
        "label": "Agkathiá"
      },
      {
        "name": "Agnanteró",
        "center": [
          39.48586,
          21.84789
        ],
        "label": "Agnanteró"
      },
      {
        "name": "Agriá",
        "center": [
          39.34078,
          23.01258
        ],
        "label": "Agriá"
      },
      {
        "name": "Agrínio",
        "center": [
          38.62139,
          21.40778
        ],
        "label": "Agrínio"
      },
      {
        "name": "Agía Foteiní",
        "center": [
          35.25459,
          24.63495
        ],
        "label": "Agía Foteiní"
      },
      {
        "name": "Agía Galíni",
        "center": [
          35.09707,
          24.68818
        ],
        "label": "Agía Galíni"
      },
      {
        "name": "Agía Kyriakí",
        "center": [
          39.52264,
          20.88358
        ],
        "label": "Agía Kyriakí"
      },
      {
        "name": "Agía Marína",
        "center": [
          37.82036,
          23.84424
        ],
        "label": "Agía Marína"
      }
    ]
  },
  {
    "code": "GL",
    "name": "Greenland",
    "cities": [
      {
        "name": "Nuuk",
        "center": [
          64.1814,
          -51.6941
        ],
        "label": "Nuuk"
      }
    ]
  },
  {
    "code": "GD",
    "name": "Grenada",
    "cities": [
      {
        "name": "Gouyave",
        "center": [
          12.16462,
          -61.72965
        ],
        "label": "Gouyave"
      },
      {
        "name": "Grenville",
        "center": [
          12.12278,
          -61.62498
        ],
        "label": "Grenville"
      },
      {
        "name": "Hillsborough",
        "center": [
          12.48292,
          -61.45597
        ],
        "label": "Hillsborough"
      },
      {
        "name": "Saint David’s",
        "center": [
          12.04903,
          -61.66875
        ],
        "label": "Saint David’s"
      },
      {
        "name": "Saint George's",
        "center": [
          12.05288,
          -61.75226
        ],
        "label": "Saint George's"
      },
      {
        "name": "Sauteurs",
        "center": [
          12.21833,
          -61.63917
        ],
        "label": "Sauteurs"
      },
      {
        "name": "Victoria",
        "center": [
          12.19021,
          -61.70677
        ],
        "label": "Victoria"
      }
    ]
  },
  {
    "code": "GP",
    "name": "Guadeloupe",
    "cities": [
      {
        "name": "Guadeloupe City",
        "center": [
          16.25,
          -61.583333
        ],
        "label": "Guadeloupe (Capital / Main)"
      }
    ]
  },
  {
    "code": "GU",
    "name": "Guam",
    "cities": [
      {
        "name": "Hagatna",
        "center": [
          13.4757,
          144.7489
        ],
        "label": "Hagatna"
      }
    ]
  },
  {
    "code": "GT",
    "name": "Guatemala",
    "cities": [
      {
        "name": "Acatenango",
        "center": [
          14.55451,
          -90.94368
        ],
        "label": "Acatenango"
      },
      {
        "name": "Agua Blanca",
        "center": [
          14.5,
          -89.65
        ],
        "label": "Agua Blanca"
      },
      {
        "name": "Aguacatán",
        "center": [
          15.34222,
          -91.31141
        ],
        "label": "Aguacatán"
      },
      {
        "name": "Almolonga",
        "center": [
          14.81591,
          -91.49464
        ],
        "label": "Almolonga"
      },
      {
        "name": "Alotenango",
        "center": [
          14.48028,
          -90.8075
        ],
        "label": "Alotenango"
      },
      {
        "name": "Amatitlán",
        "center": [
          14.4774,
          -90.63489
        ],
        "label": "Amatitlán"
      },
      {
        "name": "Antigua Guatemala",
        "center": [
          14.56111,
          -90.73444
        ],
        "label": "Antigua Guatemala"
      },
      {
        "name": "Asunción Mita",
        "center": [
          14.33083,
          -89.71083
        ],
        "label": "Asunción Mita"
      },
      {
        "name": "Atescatempa",
        "center": [
          14.17444,
          -89.7425
        ],
        "label": "Atescatempa"
      },
      {
        "name": "Barberena",
        "center": [
          14.30739,
          -90.36156
        ],
        "label": "Barberena"
      },
      {
        "name": "Barillas",
        "center": [
          15.80361,
          -91.31583
        ],
        "label": "Barillas"
      },
      {
        "name": "Cabricán",
        "center": [
          15.07485,
          -91.648
        ],
        "label": "Cabricán"
      },
      {
        "name": "Cahabón",
        "center": [
          15.56667,
          -89.81667
        ],
        "label": "Cahabón"
      },
      {
        "name": "Cajolá",
        "center": [
          14.92205,
          -91.61478
        ],
        "label": "Cajolá"
      },
      {
        "name": "Camotán",
        "center": [
          14.82017,
          -89.37224
        ],
        "label": "Camotán"
      },
      {
        "name": "Canillá",
        "center": [
          15.16549,
          -90.85256
        ],
        "label": "Canillá"
      },
      {
        "name": "Cantel",
        "center": [
          14.81154,
          -91.45536
        ],
        "label": "Cantel"
      },
      {
        "name": "Casillas",
        "center": [
          14.42222,
          -90.24417
        ],
        "label": "Casillas"
      },
      {
        "name": "Catarina",
        "center": [
          14.85354,
          -92.07682
        ],
        "label": "Catarina"
      },
      {
        "name": "Chahal Guatemala",
        "center": [
          15.79122,
          -89.60518
        ],
        "label": "Chahal Guatemala"
      }
    ]
  },
  {
    "code": "GG",
    "name": "Guernsey and Alderney",
    "cities": [
      {
        "name": "Saint Peter Port",
        "center": [
          49.4589,
          -2.5353
        ],
        "label": "Saint Peter Port"
      }
    ]
  },
  {
    "code": "GN",
    "name": "Guinea",
    "cities": [
      {
        "name": "Beyla",
        "center": [
          8.69011,
          -8.64869
        ],
        "label": "Beyla"
      },
      {
        "name": "Beyla Prefecture",
        "center": [
          8.91667,
          -8.41667
        ],
        "label": "Beyla Prefecture"
      },
      {
        "name": "Boffa",
        "center": [
          10.33333,
          -14.16667
        ],
        "label": "Boffa"
      },
      {
        "name": "Boke Prefecture",
        "center": [
          11.08333,
          -14.41667
        ],
        "label": "Boke Prefecture"
      },
      {
        "name": "Boké",
        "center": [
          10.93217,
          -14.29055
        ],
        "label": "Boké"
      },
      {
        "name": "Camayenne",
        "center": [
          9.535,
          -13.68778
        ],
        "label": "Camayenne"
      },
      {
        "name": "Conakry",
        "center": [
          9.53795,
          -13.67729
        ],
        "label": "Conakry"
      },
      {
        "name": "Coyah",
        "center": [
          9.75,
          -13.41667
        ],
        "label": "Coyah"
      },
      {
        "name": "Dalaba",
        "center": [
          10.75,
          -12.3
        ],
        "label": "Dalaba"
      },
      {
        "name": "Dubréka",
        "center": [
          9.79111,
          -13.52333
        ],
        "label": "Dubréka"
      },
      {
        "name": "Forécariah",
        "center": [
          9.43056,
          -13.08806
        ],
        "label": "Forécariah"
      },
      {
        "name": "Fria",
        "center": [
          10.41667,
          -13.58333
        ],
        "label": "Fria"
      },
      {
        "name": "Gaoual",
        "center": [
          11.75,
          -13.2
        ],
        "label": "Gaoual"
      },
      {
        "name": "Gaoual Prefecture",
        "center": [
          11.75,
          -13.2
        ],
        "label": "Gaoual Prefecture"
      },
      {
        "name": "Gueckedou",
        "center": [
          8.56744,
          -10.1336
        ],
        "label": "Gueckedou"
      },
      {
        "name": "Kankan",
        "center": [
          10.38542,
          -9.30568
        ],
        "label": "Kankan"
      },
      {
        "name": "Kankan Prefecture",
        "center": [
          10.271,
          -9.178
        ],
        "label": "Kankan Prefecture"
      },
      {
        "name": "Kerouane Prefecture",
        "center": [
          9.16667,
          -9.08333
        ],
        "label": "Kerouane Prefecture"
      },
      {
        "name": "Kimbo",
        "center": [
          10.4,
          -13.55
        ],
        "label": "Kimbo"
      },
      {
        "name": "Kindia",
        "center": [
          10.08333,
          -12.8
        ],
        "label": "Kindia"
      }
    ]
  },
  {
    "code": "GW",
    "name": "Guinea-Bissau",
    "cities": [
      {
        "name": "Bafatá",
        "center": [
          12.16583,
          -14.66167
        ],
        "label": "Bafatá"
      },
      {
        "name": "Bissorã",
        "center": [
          12.22306,
          -15.4475
        ],
        "label": "Bissorã"
      },
      {
        "name": "Bolama",
        "center": [
          11.57694,
          -15.47611
        ],
        "label": "Bolama"
      },
      {
        "name": "Buba",
        "center": [
          11.58889,
          -14.99583
        ],
        "label": "Buba"
      },
      {
        "name": "Bubaque",
        "center": [
          11.28333,
          -15.83333
        ],
        "label": "Bubaque"
      },
      {
        "name": "Cacheu",
        "center": [
          12.27444,
          -16.16528
        ],
        "label": "Cacheu"
      },
      {
        "name": "Canchungo",
        "center": [
          12.06722,
          -16.03333
        ],
        "label": "Canchungo"
      },
      {
        "name": "Catió",
        "center": [
          11.2825,
          -15.25472
        ],
        "label": "Catió"
      },
      {
        "name": "Contuboel Sector",
        "center": [
          12.555,
          -14.641
        ],
        "label": "Contuboel Sector"
      },
      {
        "name": "Farim",
        "center": [
          12.48389,
          -15.22167
        ],
        "label": "Farim"
      },
      {
        "name": "Gabú",
        "center": [
          12.28,
          -14.22222
        ],
        "label": "Gabú"
      },
      {
        "name": "Mansôa",
        "center": [
          12.07333,
          -15.31889
        ],
        "label": "Mansôa"
      },
      {
        "name": "Quebo",
        "center": [
          11.33333,
          -14.93333
        ],
        "label": "Quebo"
      },
      {
        "name": "Quinhámel",
        "center": [
          11.88694,
          -15.85556
        ],
        "label": "Quinhámel"
      }
    ]
  },
  {
    "code": "GY",
    "name": "Guyana",
    "cities": [
      {
        "name": "Anna Regina",
        "center": [
          7.26439,
          -58.50769
        ],
        "label": "Anna Regina"
      },
      {
        "name": "Bartica",
        "center": [
          6.40799,
          -58.62192
        ],
        "label": "Bartica"
      },
      {
        "name": "Georgetown",
        "center": [
          6.80448,
          -58.15527
        ],
        "label": "Georgetown"
      },
      {
        "name": "Lethem",
        "center": [
          3.38333,
          -59.8
        ],
        "label": "Lethem"
      },
      {
        "name": "Linden",
        "center": [
          6.00809,
          -58.30714
        ],
        "label": "Linden"
      },
      {
        "name": "Mabaruma",
        "center": [
          8.2,
          -59.78333
        ],
        "label": "Mabaruma"
      },
      {
        "name": "Mahaica Village",
        "center": [
          6.68405,
          -57.92181
        ],
        "label": "Mahaica Village"
      },
      {
        "name": "Mahaicony Village",
        "center": [
          6.57633,
          -57.80486
        ],
        "label": "Mahaicony Village"
      },
      {
        "name": "Mahdia",
        "center": [
          5.26667,
          -59.15
        ],
        "label": "Mahdia"
      },
      {
        "name": "New Amsterdam",
        "center": [
          6.24793,
          -57.5171
        ],
        "label": "New Amsterdam"
      },
      {
        "name": "Parika",
        "center": [
          6.83712,
          -58.42941
        ],
        "label": "Parika"
      },
      {
        "name": "Rosignol",
        "center": [
          6.27095,
          -57.53697
        ],
        "label": "Rosignol"
      },
      {
        "name": "Skeldon",
        "center": [
          5.88333,
          -57.13333
        ],
        "label": "Skeldon"
      },
      {
        "name": "Vreed-en-Hoop",
        "center": [
          6.80927,
          -58.19798
        ],
        "label": "Vreed-en-Hoop"
      }
    ]
  },
  {
    "code": "HT",
    "name": "Haiti",
    "cities": [
      {
        "name": "Acul du Nord",
        "center": [
          19.66667,
          -72.28333
        ],
        "label": "Acul du Nord"
      },
      {
        "name": "Ansavo",
        "center": [
          18.41667,
          -73.5
        ],
        "label": "Ansavo"
      },
      {
        "name": "Anse Rouge",
        "center": [
          19.63382,
          -73.0553
        ],
        "label": "Anse Rouge"
      },
      {
        "name": "Anse à Galets",
        "center": [
          18.83449,
          -72.86644
        ],
        "label": "Anse à Galets"
      },
      {
        "name": "Anse-à-Pitre",
        "center": [
          18.05,
          -71.75
        ],
        "label": "Anse-à-Pitre"
      },
      {
        "name": "Anse-à-Veau",
        "center": [
          18.5011,
          -73.3449
        ],
        "label": "Anse-à-Veau"
      },
      {
        "name": "Aquin",
        "center": [
          18.27974,
          -73.39433
        ],
        "label": "Aquin"
      },
      {
        "name": "Arcahaie",
        "center": [
          19.81667,
          -72.91667
        ],
        "label": "Arcahaie"
      },
      {
        "name": "Arrondissement de Bainet",
        "center": [
          18.25,
          -72.85
        ],
        "label": "Arrondissement de Bainet"
      },
      {
        "name": "Arrondissement de Cerca La Source",
        "center": [
          19.11667,
          -71.75
        ],
        "label": "Arrondissement de Cerca La Source"
      },
      {
        "name": "Arrondissement de Croix des Bouquets",
        "center": [
          18.48333,
          -72.01667
        ],
        "label": "Arrondissement de Croix des Bouquets"
      },
      {
        "name": "Arrondissement de Fort Liberté",
        "center": [
          19.56667,
          -71.83333
        ],
        "label": "Arrondissement de Fort Liberté"
      },
      {
        "name": "Arrondissement de Jacmel",
        "center": [
          18.33333,
          -72.5
        ],
        "label": "Arrondissement de Jacmel"
      },
      {
        "name": "Arrondissement de Léogâne",
        "center": [
          18.41667,
          -72.75
        ],
        "label": "Arrondissement de Léogâne"
      },
      {
        "name": "Arrondissement de Plaisance",
        "center": [
          19.66756,
          -72.54908
        ],
        "label": "Arrondissement de Plaisance"
      },
      {
        "name": "Arrondissement de Port-Salut",
        "center": [
          18.13333,
          -73.9
        ],
        "label": "Arrondissement de Port-Salut"
      },
      {
        "name": "Arrondissement de Port-au-Prince",
        "center": [
          18.5,
          -72.36667
        ],
        "label": "Arrondissement de Port-au-Prince"
      },
      {
        "name": "Arrondissement de Port-de-Paix",
        "center": [
          19.83333,
          -72.88333
        ],
        "label": "Arrondissement de Port-de-Paix"
      },
      {
        "name": "Arrondissement de Saint-Louis du Nord",
        "center": [
          19.85,
          -72.66667
        ],
        "label": "Arrondissement de Saint-Louis du Nord"
      },
      {
        "name": "Arrondissement de Saint-Marc",
        "center": [
          19,
          -72.5
        ],
        "label": "Arrondissement de Saint-Marc"
      }
    ]
  },
  {
    "code": "HM",
    "name": "Heard Island and McDonald Islands",
    "cities": [
      {
        "name": "Heard Island and McDonald Islands City",
        "center": [
          -53.1,
          72.51666666
        ],
        "label": "Heard Island and McDonald Islands (Capital / Main)"
      }
    ]
  },
  {
    "code": "HN",
    "name": "Honduras",
    "cities": [
      {
        "name": "Agalteca",
        "center": [
          14.45,
          -87.26667
        ],
        "label": "Agalteca"
      },
      {
        "name": "Agua Azul",
        "center": [
          14.91667,
          -87.96667
        ],
        "label": "Agua Azul"
      },
      {
        "name": "Agua Azul Rancho",
        "center": [
          14.9,
          -87.95
        ],
        "label": "Agua Azul Rancho"
      },
      {
        "name": "Agua Blanca Sur",
        "center": [
          15.25,
          -87.88333
        ],
        "label": "Agua Blanca Sur"
      },
      {
        "name": "Agua Caliente",
        "center": [
          14.88333,
          -88.81667
        ],
        "label": "Agua Caliente"
      },
      {
        "name": "Agua Fría",
        "center": [
          13.46889,
          -87.55111
        ],
        "label": "Agua Fría"
      },
      {
        "name": "Agualote",
        "center": [
          15.33528,
          -88.55306
        ],
        "label": "Agualote"
      },
      {
        "name": "Aguanqueterique",
        "center": [
          13.98606,
          -87.64622
        ],
        "label": "Aguanqueterique"
      },
      {
        "name": "Aguas del Padre",
        "center": [
          14.56667,
          -87.88333
        ],
        "label": "Aguas del Padre"
      },
      {
        "name": "Ahuas",
        "center": [
          15.46923,
          -84.34479
        ],
        "label": "Ahuas"
      },
      {
        "name": "Ajuterique",
        "center": [
          14.38333,
          -87.7
        ],
        "label": "Ajuterique"
      },
      {
        "name": "Alauca",
        "center": [
          13.8402,
          -86.69526
        ],
        "label": "Alauca"
      },
      {
        "name": "Alianza",
        "center": [
          13.44815,
          -87.68643
        ],
        "label": "Alianza"
      },
      {
        "name": "Alubarén",
        "center": [
          13.78226,
          -87.4699
        ],
        "label": "Alubarén"
      },
      {
        "name": "Amapala",
        "center": [
          13.29222,
          -87.65389
        ],
        "label": "Amapala"
      },
      {
        "name": "Antigua Ocotepeque",
        "center": [
          14.4,
          -89.2
        ],
        "label": "Antigua Ocotepeque"
      },
      {
        "name": "Apacilagua",
        "center": [
          13.45821,
          -87.01122
        ],
        "label": "Apacilagua"
      },
      {
        "name": "Arada",
        "center": [
          14.85,
          -88.3
        ],
        "label": "Arada"
      },
      {
        "name": "Aramecina",
        "center": [
          13.74222,
          -87.71028
        ],
        "label": "Aramecina"
      },
      {
        "name": "Araulí",
        "center": [
          13.95,
          -86.55
        ],
        "label": "Araulí"
      }
    ]
  },
  {
    "code": "HK",
    "name": "Hong Kong S.A.R.",
    "cities": [
      {
        "name": "Hong Kong Central",
        "center": [
          22.2819,
          114.1581
        ],
        "label": "Hong Kong (Central / Victoria)"
      },
      {
        "name": "Kowloon",
        "center": [
          22.3193,
          114.1694
        ],
        "label": "Kowloon"
      }
    ]
  },
  {
    "code": "HU",
    "name": "Hungary",
    "cities": [
      {
        "name": "Aba",
        "center": [
          47.02907,
          18.52172
        ],
        "label": "Aba"
      },
      {
        "name": "Abasár",
        "center": [
          47.79705,
          20.00324
        ],
        "label": "Abasár"
      },
      {
        "name": "Abaújszántó",
        "center": [
          48.28333,
          21.2
        ],
        "label": "Abaújszántó"
      },
      {
        "name": "Abda",
        "center": [
          47.69464,
          17.54489
        ],
        "label": "Abda"
      },
      {
        "name": "Abony",
        "center": [
          47.1899,
          20.00476
        ],
        "label": "Abony"
      },
      {
        "name": "Abádszalók",
        "center": [
          47.46667,
          20.6
        ],
        "label": "Abádszalók"
      },
      {
        "name": "Acsa",
        "center": [
          47.79425,
          19.38795
        ],
        "label": "Acsa"
      },
      {
        "name": "Adony",
        "center": [
          47.1194,
          18.86493
        ],
        "label": "Adony"
      },
      {
        "name": "Adács",
        "center": [
          47.6921,
          19.97696
        ],
        "label": "Adács"
      },
      {
        "name": "Ajak",
        "center": [
          48.17664,
          22.06273
        ],
        "label": "Ajak"
      },
      {
        "name": "Ajka",
        "center": [
          47.10196,
          17.55892
        ],
        "label": "Ajka"
      },
      {
        "name": "Ajkai Járás",
        "center": [
          47.07988,
          17.56375
        ],
        "label": "Ajkai Járás"
      },
      {
        "name": "Akasztó",
        "center": [
          46.69167,
          19.20423
        ],
        "label": "Akasztó"
      },
      {
        "name": "Alap",
        "center": [
          46.79915,
          18.68938
        ],
        "label": "Alap"
      },
      {
        "name": "Alattyán",
        "center": [
          47.42705,
          20.04219
        ],
        "label": "Alattyán"
      },
      {
        "name": "Albertirsa",
        "center": [
          47.24315,
          19.61686
        ],
        "label": "Albertirsa"
      },
      {
        "name": "Algyő",
        "center": [
          46.33472,
          20.20849
        ],
        "label": "Algyő"
      },
      {
        "name": "Alsónémedi",
        "center": [
          47.31524,
          19.15843
        ],
        "label": "Alsónémedi"
      },
      {
        "name": "Alsózsolca",
        "center": [
          48.06982,
          20.88046
        ],
        "label": "Alsózsolca"
      },
      {
        "name": "Anarcs",
        "center": [
          48.17642,
          22.11167
        ],
        "label": "Anarcs"
      }
    ]
  },
  {
    "code": "IS",
    "name": "Iceland",
    "cities": [
      {
        "name": "Akrahreppur",
        "center": [
          65.35505,
          -18.79572
        ],
        "label": "Akrahreppur"
      },
      {
        "name": "Akranes",
        "center": [
          64.32179,
          -22.0749
        ],
        "label": "Akranes"
      },
      {
        "name": "Akureyri",
        "center": [
          65.68353,
          -18.0878
        ],
        "label": "Akureyri"
      },
      {
        "name": "Bláskógabyggð",
        "center": [
          64.41667,
          -20.33333
        ],
        "label": "Bláskógabyggð"
      },
      {
        "name": "Borgarbyggð",
        "center": [
          64.71446,
          -21.23788
        ],
        "label": "Borgarbyggð"
      },
      {
        "name": "Borgarfjarðarhreppur",
        "center": [
          65.43401,
          -13.82933
        ],
        "label": "Borgarfjarðarhreppur"
      },
      {
        "name": "Borgarnes",
        "center": [
          64.53834,
          -21.92064
        ],
        "label": "Borgarnes"
      },
      {
        "name": "Breiðdalshreppur",
        "center": [
          64.83333,
          -14.25
        ],
        "label": "Breiðdalshreppur"
      },
      {
        "name": "Dalabyggð",
        "center": [
          65.10121,
          -21.72871
        ],
        "label": "Dalabyggð"
      },
      {
        "name": "Dalvík",
        "center": [
          65.97018,
          -18.52861
        ],
        "label": "Dalvík"
      },
      {
        "name": "Dalvíkurbyggð",
        "center": [
          65.87318,
          -18.60844
        ],
        "label": "Dalvíkurbyggð"
      },
      {
        "name": "Egilsstaðir",
        "center": [
          65.26687,
          -14.39485
        ],
        "label": "Egilsstaðir"
      },
      {
        "name": "Eskifjörður",
        "center": [
          65.07306,
          -14.01525
        ],
        "label": "Eskifjörður"
      },
      {
        "name": "Eyja- og Miklaholtshreppur",
        "center": [
          64.85846,
          -22.54557
        ],
        "label": "Eyja- og Miklaholtshreppur"
      },
      {
        "name": "Eyjafjarðarsveit",
        "center": [
          65.33333,
          -18.16667
        ],
        "label": "Eyjafjarðarsveit"
      },
      {
        "name": "Fjallabyggð",
        "center": [
          66.05962,
          -18.7822
        ],
        "label": "Fjallabyggð"
      },
      {
        "name": "Fjarðabyggð",
        "center": [
          65.08333,
          -14
        ],
        "label": "Fjarðabyggð"
      },
      {
        "name": "Fljótsdalshreppur",
        "center": [
          64.85275,
          -15.2568
        ],
        "label": "Fljótsdalshreppur"
      },
      {
        "name": "Fljótsdalshérað",
        "center": [
          65.2502,
          -15.37211
        ],
        "label": "Fljótsdalshérað"
      },
      {
        "name": "Flóahreppur",
        "center": [
          63.89569,
          -20.80159
        ],
        "label": "Flóahreppur"
      }
    ]
  },
  {
    "code": "IN",
    "name": "India",
    "cities": [
      {
        "name": "Mumbai, MH",
        "center": [
          19.076,
          72.8777
        ],
        "label": "Mumbai (BKC / South)"
      },
      {
        "name": "Delhi, DL",
        "center": [
          28.6139,
          77.209
        ],
        "label": "Delhi (NCR / Connaught Place)"
      },
      {
        "name": "Bengaluru, KA",
        "center": [
          12.9716,
          77.5946
        ],
        "label": "Bengaluru (Koramangala / Indiranagar)"
      },
      {
        "name": "Hyderabad, TS",
        "center": [
          17.385,
          78.4867
        ],
        "label": "Hyderabad (HITEC City)"
      },
      {
        "name": "Chennai, TN",
        "center": [
          13.0827,
          80.2707
        ],
        "label": "Chennai"
      },
      {
        "name": "Kolkata, WB",
        "center": [
          22.5726,
          88.3639
        ],
        "label": "Kolkata"
      },
      {
        "name": "Pune, MH",
        "center": [
          18.5204,
          73.8567
        ],
        "label": "Pune"
      },
      {
        "name": "Ahmedabad, GJ",
        "center": [
          23.0225,
          72.5714
        ],
        "label": "Ahmedabad"
      },
      {
        "name": "Jaipur, RJ",
        "center": [
          26.9124,
          75.7873
        ],
        "label": "Jaipur"
      },
      {
        "name": "Surat, GJ",
        "center": [
          21.1702,
          72.8311
        ],
        "label": "Surat"
      },
      {
        "name": "Lucknow, UP",
        "center": [
          26.8467,
          80.9462
        ],
        "label": "Lucknow"
      },
      {
        "name": "Chandigarh",
        "center": [
          30.7333,
          76.7794
        ],
        "label": "Chandigarh"
      },
      {
        "name": "Kochi, KL",
        "center": [
          9.9312,
          76.2673
        ],
        "label": "Kochi"
      },
      {
        "name": "Indore, MP",
        "center": [
          22.7196,
          75.8577
        ],
        "label": "Indore"
      },
      {
        "name": "Noida / Gurgaon",
        "center": [
          28.4595,
          77.0266
        ],
        "label": "Gurgaon / Noida"
      }
    ]
  },
  {
    "code": "ID",
    "name": "Indonesia",
    "cities": [
      {
        "name": "Abepura",
        "center": [
          -2.5964,
          140.6324
        ],
        "label": "Abepura"
      },
      {
        "name": "Adiwerna",
        "center": [
          -6.9375,
          109.1325
        ],
        "label": "Adiwerna"
      },
      {
        "name": "Amahai",
        "center": [
          -3.33984,
          128.91975
        ],
        "label": "Amahai"
      },
      {
        "name": "Ambarawa",
        "center": [
          -7.26333,
          110.3975
        ],
        "label": "Ambarawa"
      },
      {
        "name": "Ambarita",
        "center": [
          2.6814,
          98.8311
        ],
        "label": "Ambarita"
      },
      {
        "name": "Ambon",
        "center": [
          -3.69583,
          128.18333
        ],
        "label": "Ambon"
      },
      {
        "name": "Amlapura",
        "center": [
          -8.45,
          115.61667
        ],
        "label": "Amlapura"
      },
      {
        "name": "Amlapura city",
        "center": [
          -8.44869,
          115.60621
        ],
        "label": "Amlapura city"
      },
      {
        "name": "Amuntai",
        "center": [
          -2.41773,
          115.24941
        ],
        "label": "Amuntai"
      },
      {
        "name": "Arjawinangun",
        "center": [
          -6.64528,
          108.41028
        ],
        "label": "Arjawinangun"
      },
      {
        "name": "Astanajapura",
        "center": [
          -6.8017,
          108.6311
        ],
        "label": "Astanajapura"
      },
      {
        "name": "Atambua",
        "center": [
          -9.10611,
          124.8925
        ],
        "label": "Atambua"
      },
      {
        "name": "Babat",
        "center": [
          -7.11282,
          112.16354
        ],
        "label": "Babat"
      },
      {
        "name": "Baekrajan",
        "center": [
          -6.7674,
          110.8541
        ],
        "label": "Baekrajan"
      },
      {
        "name": "Baki",
        "center": [
          -7.61278,
          110.78389
        ],
        "label": "Baki"
      },
      {
        "name": "Balaipungut",
        "center": [
          1.05949,
          101.29054
        ],
        "label": "Balaipungut"
      },
      {
        "name": "Balapulang",
        "center": [
          -7.04858,
          109.10056
        ],
        "label": "Balapulang"
      },
      {
        "name": "Balikpapan",
        "center": [
          -1.26753,
          116.82887
        ],
        "label": "Balikpapan"
      },
      {
        "name": "Balung",
        "center": [
          -7.73333,
          113.91667
        ],
        "label": "Balung"
      },
      {
        "name": "Bambanglipuro",
        "center": [
          -7.95,
          110.28333
        ],
        "label": "Bambanglipuro"
      }
    ]
  },
  {
    "code": "IR",
    "name": "Iran",
    "cities": [
      {
        "name": "Ab Meshkin",
        "center": [
          35.61305556,
          48.26916667
        ],
        "label": "Ab Meshkin"
      },
      {
        "name": "Abadan",
        "center": [
          30.3392,
          48.3043
        ],
        "label": "Abadan"
      },
      {
        "name": "Abarlaq-e Sofla",
        "center": [
          34.67138889,
          48.22833333
        ],
        "label": "Abarlaq-e Sofla"
      },
      {
        "name": "Abdalan",
        "center": [
          34.65277778,
          48.24555556
        ],
        "label": "Abdalan"
      },
      {
        "name": "Abdol Rahim",
        "center": [
          34.62638889,
          49.0175
        ],
        "label": "Abdol Rahim"
      },
      {
        "name": "Abhar",
        "center": [
          36.1468,
          49.218
        ],
        "label": "Abhar"
      },
      {
        "name": "Abrumand",
        "center": [
          34.90277778,
          48.32027778
        ],
        "label": "Abrumand"
      },
      {
        "name": "Abrīsham",
        "center": [
          32.55613,
          51.57325
        ],
        "label": "Abrīsham"
      },
      {
        "name": "Abshineh",
        "center": [
          34.781944,
          48.614722
        ],
        "label": "Abshineh"
      },
      {
        "name": "Abu ol Fathabad",
        "center": [
          34.05666667,
          48.50916667
        ],
        "label": "Abu ol Fathabad"
      },
      {
        "name": "Aghajari",
        "center": [
          30.7006,
          49.8315
        ],
        "label": "Aghajari"
      },
      {
        "name": "Aghcheh Qayah",
        "center": [
          35.35,
          48.3425
        ],
        "label": "Aghcheh Qayah"
      },
      {
        "name": "Ahar",
        "center": [
          38.4774,
          47.0699
        ],
        "label": "Ahar"
      },
      {
        "name": "Ahmadabad-e Tappeh",
        "center": [
          34.61277778,
          48.99277778
        ],
        "label": "Ahmadabad-e Tappeh"
      },
      {
        "name": "Ahram",
        "center": [
          28.8826,
          51.2746
        ],
        "label": "Ahram"
      },
      {
        "name": "Ahu Tappeh",
        "center": [
          34.93777778,
          48.00111111
        ],
        "label": "Ahu Tappeh"
      },
      {
        "name": "Ahvaz",
        "center": [
          31.31901,
          48.6842
        ],
        "label": "Ahvaz"
      },
      {
        "name": "Ajin",
        "center": [
          34.73611111,
          47.92416667
        ],
        "label": "Ajin"
      },
      {
        "name": "Ajorlu",
        "center": [
          35.13833333,
          49.22944444
        ],
        "label": "Ajorlu"
      },
      {
        "name": "Akanlu",
        "center": [
          35.61416667,
          48.18805556
        ],
        "label": "Akanlu"
      }
    ]
  },
  {
    "code": "IQ",
    "name": "Iraq",
    "cities": [
      {
        "name": "Abu Ghraib District",
        "center": [
          33.29194,
          44.06919
        ],
        "label": "Abu Ghraib District"
      },
      {
        "name": "Abū Ghurayb",
        "center": [
          33.30563,
          44.18477
        ],
        "label": "Abū Ghurayb"
      },
      {
        "name": "Ad Dujayl",
        "center": [
          33.84667,
          44.23444
        ],
        "label": "Ad Dujayl"
      },
      {
        "name": "Ad Dīwānīyah",
        "center": [
          31.99289,
          44.92552
        ],
        "label": "Ad Dīwānīyah"
      },
      {
        "name": "Al Başrah al Qadīmah",
        "center": [
          30.50316,
          47.81507
        ],
        "label": "Al Başrah al Qadīmah"
      },
      {
        "name": "Al Fallūjah",
        "center": [
          33.34913,
          43.78599
        ],
        "label": "Al Fallūjah"
      },
      {
        "name": "Al Fāw",
        "center": [
          29.97421,
          48.47309
        ],
        "label": "Al Fāw"
      },
      {
        "name": "Al Hindīyah",
        "center": [
          32.54671,
          44.22765
        ],
        "label": "Al Hindīyah"
      },
      {
        "name": "Al Hārithah",
        "center": [
          30.58481,
          47.76114
        ],
        "label": "Al Hārithah"
      },
      {
        "name": "Al Kūt",
        "center": [
          32.5128,
          45.81817
        ],
        "label": "Al Kūt"
      },
      {
        "name": "Al Mawşil al Jadīdah",
        "center": [
          36.33271,
          43.10555
        ],
        "label": "Al Mawşil al Jadīdah"
      },
      {
        "name": "Al Miqdādīyah",
        "center": [
          33.97861,
          44.93694
        ],
        "label": "Al Miqdādīyah"
      },
      {
        "name": "Al Mishkhāb",
        "center": [
          31.80437,
          44.4893
        ],
        "label": "Al Mishkhāb"
      },
      {
        "name": "Al Musayyib",
        "center": [
          32.77872,
          44.29005
        ],
        "label": "Al Musayyib"
      },
      {
        "name": "Al Ḩayy",
        "center": [
          32.17419,
          46.04345
        ],
        "label": "Al Ḩayy"
      },
      {
        "name": "Al Ḩillah",
        "center": [
          32.46367,
          44.41963
        ],
        "label": "Al Ḩillah"
      },
      {
        "name": "Al ‘Amādīyah",
        "center": [
          37.09214,
          43.48769
        ],
        "label": "Al ‘Amādīyah"
      },
      {
        "name": "Al ‘Amārah",
        "center": [
          31.83561,
          47.14483
        ],
        "label": "Al ‘Amārah"
      },
      {
        "name": "Al ‘Azīzīyah",
        "center": [
          32.90941,
          45.06359
        ],
        "label": "Al ‘Azīzīyah"
      },
      {
        "name": "Al-Hamdaniya",
        "center": [
          36.27093,
          43.37758
        ],
        "label": "Al-Hamdaniya"
      }
    ]
  },
  {
    "code": "IE",
    "name": "Ireland",
    "cities": [
      {
        "name": "Abbeyfeale",
        "center": [
          52.38139,
          -9.3025
        ],
        "label": "Abbeyfeale"
      },
      {
        "name": "Abbeyleix",
        "center": [
          52.91331,
          -7.34456
        ],
        "label": "Abbeyleix"
      },
      {
        "name": "Adare",
        "center": [
          52.56194,
          -8.79556
        ],
        "label": "Adare"
      },
      {
        "name": "Aghada",
        "center": [
          51.83917,
          -8.21222
        ],
        "label": "Aghada"
      },
      {
        "name": "An Cabhán",
        "center": [
          53.91667,
          -7.25
        ],
        "label": "An Cabhán"
      },
      {
        "name": "An Clár",
        "center": [
          52.83333,
          -9
        ],
        "label": "An Clár"
      },
      {
        "name": "An Iarmhí",
        "center": [
          53.5,
          -7.5
        ],
        "label": "An Iarmhí"
      },
      {
        "name": "An Longfort",
        "center": [
          53.66667,
          -7.75
        ],
        "label": "An Longfort"
      },
      {
        "name": "An Mhí",
        "center": [
          53.66667,
          -6.66667
        ],
        "label": "An Mhí"
      },
      {
        "name": "An Muileann gCearr",
        "center": [
          53.53333,
          -7.35
        ],
        "label": "An Muileann gCearr"
      },
      {
        "name": "An Ros",
        "center": [
          53.52424,
          -6.10497
        ],
        "label": "An Ros"
      },
      {
        "name": "Annacotty",
        "center": [
          52.66768,
          -8.53121
        ],
        "label": "Annacotty"
      },
      {
        "name": "Ardee",
        "center": [
          53.85972,
          -6.54056
        ],
        "label": "Ardee"
      },
      {
        "name": "Ardnacrusha",
        "center": [
          52.70908,
          -8.61431
        ],
        "label": "Ardnacrusha"
      },
      {
        "name": "Arklow",
        "center": [
          52.79306,
          -6.14139
        ],
        "label": "Arklow"
      },
      {
        "name": "Artane",
        "center": [
          53.38712,
          -6.2138
        ],
        "label": "Artane"
      },
      {
        "name": "Ashbourne",
        "center": [
          53.51163,
          -6.39821
        ],
        "label": "Ashbourne"
      },
      {
        "name": "Ashford",
        "center": [
          53.00833,
          -6.11139
        ],
        "label": "Ashford"
      },
      {
        "name": "Askeaton",
        "center": [
          52.59972,
          -8.97556
        ],
        "label": "Askeaton"
      },
      {
        "name": "Athboy",
        "center": [
          53.62327,
          -6.91434
        ],
        "label": "Athboy"
      }
    ]
  },
  {
    "code": "IL",
    "name": "Israel",
    "cities": [
      {
        "name": "Abū Ghaush",
        "center": [
          31.80592,
          35.1093
        ],
        "label": "Abū Ghaush"
      },
      {
        "name": "Acre",
        "center": [
          32.92814,
          35.07647
        ],
        "label": "Acre"
      },
      {
        "name": "Afula",
        "center": [
          32.60907,
          35.2892
        ],
        "label": "Afula"
      },
      {
        "name": "Arad",
        "center": [
          31.25882,
          35.21282
        ],
        "label": "Arad"
      },
      {
        "name": "Ashdod",
        "center": [
          31.79213,
          34.64966
        ],
        "label": "Ashdod"
      },
      {
        "name": "Ashkelon",
        "center": [
          31.66926,
          34.57149
        ],
        "label": "Ashkelon"
      },
      {
        "name": "Atlit",
        "center": [
          32.68889,
          34.94236
        ],
        "label": "Atlit"
      },
      {
        "name": "Azor",
        "center": [
          32.0243,
          34.80632
        ],
        "label": "Azor"
      },
      {
        "name": "Basmat Ṭab‘ūn",
        "center": [
          32.73898,
          35.15716
        ],
        "label": "Basmat Ṭab‘ūn"
      },
      {
        "name": "Bat Yam",
        "center": [
          32.02379,
          34.75185
        ],
        "label": "Bat Yam"
      },
      {
        "name": "Beersheba",
        "center": [
          31.25181,
          34.7913
        ],
        "label": "Beersheba"
      },
      {
        "name": "Beit Jann",
        "center": [
          32.96464,
          35.38152
        ],
        "label": "Beit Jann"
      },
      {
        "name": "Bet Dagan",
        "center": [
          32.00191,
          34.82977
        ],
        "label": "Bet Dagan"
      },
      {
        "name": "Bet Shemesh",
        "center": [
          31.73072,
          34.99293
        ],
        "label": "Bet Shemesh"
      },
      {
        "name": "Bet She’an",
        "center": [
          32.49728,
          35.49632
        ],
        "label": "Bet She’an"
      },
      {
        "name": "Bet Yiẕẖaq",
        "center": [
          32.32751,
          34.88878
        ],
        "label": "Bet Yiẕẖaq"
      },
      {
        "name": "Bnei Ayish",
        "center": [
          31.78333,
          34.75
        ],
        "label": "Bnei Ayish"
      },
      {
        "name": "Bnei Brak",
        "center": [
          32.08074,
          34.8338
        ],
        "label": "Bnei Brak"
      },
      {
        "name": "Buqei‘a",
        "center": [
          32.97747,
          35.33345
        ],
        "label": "Buqei‘a"
      },
      {
        "name": "Bu‘eina",
        "center": [
          32.80636,
          35.36486
        ],
        "label": "Bu‘eina"
      }
    ]
  },
  {
    "code": "IT",
    "name": "Italy",
    "cities": [
      {
        "name": "Rome",
        "center": [
          41.9028,
          12.4964
        ],
        "label": "Rome"
      },
      {
        "name": "Milan",
        "center": [
          45.4642,
          9.19
        ],
        "label": "Milan"
      },
      {
        "name": "Naples",
        "center": [
          40.8518,
          14.2681
        ],
        "label": "Naples"
      },
      {
        "name": "Turin",
        "center": [
          45.0703,
          7.6869
        ],
        "label": "Turin"
      },
      {
        "name": "Florence",
        "center": [
          43.7696,
          11.2558
        ],
        "label": "Florence"
      },
      {
        "name": "Bologna",
        "center": [
          44.4949,
          11.3426
        ],
        "label": "Bologna"
      },
      {
        "name": "Venice",
        "center": [
          45.4408,
          12.3155
        ],
        "label": "Venice"
      },
      {
        "name": "Genoa",
        "center": [
          44.4056,
          8.9463
        ],
        "label": "Genoa"
      },
      {
        "name": "Palermo",
        "center": [
          38.1157,
          13.3615
        ],
        "label": "Palermo"
      }
    ]
  },
  {
    "code": "JM",
    "name": "Jamaica",
    "cities": [
      {
        "name": "12th Street",
        "center": [
          18.21097,
          -78.13603
        ],
        "label": "12th Street"
      },
      {
        "name": "Aberdeen",
        "center": [
          18.20508,
          -77.67932
        ],
        "label": "Aberdeen"
      },
      {
        "name": "Aboukir",
        "center": [
          18.2509,
          -77.34327
        ],
        "label": "Aboukir"
      },
      {
        "name": "Above Rocks",
        "center": [
          18.11432,
          -76.8759
        ],
        "label": "Above Rocks"
      },
      {
        "name": "Accompong",
        "center": [
          18.22985,
          -77.74816
        ],
        "label": "Accompong"
      },
      {
        "name": "Adelphi",
        "center": [
          18.4506,
          -77.7859
        ],
        "label": "Adelphi"
      },
      {
        "name": "Aenon Town",
        "center": [
          18.21027,
          -77.39851
        ],
        "label": "Aenon Town"
      },
      {
        "name": "Airy Castle",
        "center": [
          17.92506,
          -76.34216
        ],
        "label": "Airy Castle"
      },
      {
        "name": "Albert Town",
        "center": [
          18.29434,
          -77.54239
        ],
        "label": "Albert Town"
      },
      {
        "name": "Albion",
        "center": [
          17.90119,
          -76.60761
        ],
        "label": "Albion"
      },
      {
        "name": "Alderton",
        "center": [
          18.28706,
          -77.20832
        ],
        "label": "Alderton"
      },
      {
        "name": "Alexandria",
        "center": [
          18.30411,
          -77.35311
        ],
        "label": "Alexandria"
      },
      {
        "name": "Alley",
        "center": [
          17.79036,
          -77.27085
        ],
        "label": "Alley"
      },
      {
        "name": "Alligator Pond",
        "center": [
          17.86932,
          -77.56769
        ],
        "label": "Alligator Pond"
      },
      {
        "name": "Allman Town",
        "center": [
          17.98297,
          -76.78685
        ],
        "label": "Allman Town"
      },
      {
        "name": "Alps",
        "center": [
          18.35498,
          -77.50897
        ],
        "label": "Alps"
      },
      {
        "name": "Alston",
        "center": [
          18.17639,
          -77.43468
        ],
        "label": "Alston"
      },
      {
        "name": "Alva",
        "center": [
          18.29679,
          -77.31717
        ],
        "label": "Alva"
      },
      {
        "name": "Amiel Town",
        "center": [
          18.34027,
          -76.97612
        ],
        "label": "Amiel Town"
      },
      {
        "name": "Amity",
        "center": [
          18.27361,
          -77.89805
        ],
        "label": "Amity"
      }
    ]
  },
  {
    "code": "JP",
    "name": "Japan",
    "cities": [
      {
        "name": "Tokyo",
        "center": [
          35.6762,
          139.6503
        ],
        "label": "Tokyo"
      },
      {
        "name": "Osaka",
        "center": [
          34.6937,
          135.5023
        ],
        "label": "Osaka"
      },
      {
        "name": "Kyoto",
        "center": [
          35.0116,
          135.7681
        ],
        "label": "Kyoto"
      },
      {
        "name": "Yokohama",
        "center": [
          35.4437,
          139.638
        ],
        "label": "Yokohama"
      },
      {
        "name": "Nagoya",
        "center": [
          35.1815,
          136.9066
        ],
        "label": "Nagoya"
      },
      {
        "name": "Sapporo",
        "center": [
          43.0618,
          141.3545
        ],
        "label": "Sapporo"
      },
      {
        "name": "Fukuoka",
        "center": [
          33.5904,
          130.4017
        ],
        "label": "Fukuoka"
      },
      {
        "name": "Kobe",
        "center": [
          34.6901,
          135.1955
        ],
        "label": "Kobe"
      }
    ]
  },
  {
    "code": "JE",
    "name": "Jersey",
    "cities": [
      {
        "name": "Saint Helier",
        "center": [
          49.1858,
          -2.1064
        ],
        "label": "Saint Helier"
      }
    ]
  },
  {
    "code": "JO",
    "name": "Jordan",
    "cities": [
      {
        "name": "Adir",
        "center": [
          31.20217,
          35.76155
        ],
        "label": "Adir"
      },
      {
        "name": "Al Azraq ash Shamālī",
        "center": [
          31.88209,
          36.83017
        ],
        "label": "Al Azraq ash Shamālī"
      },
      {
        "name": "Al Jafr",
        "center": [
          30.3184,
          36.17775
        ],
        "label": "Al Jafr"
      },
      {
        "name": "Al Jubayhah",
        "center": [
          32.01071,
          35.89802
        ],
        "label": "Al Jubayhah"
      },
      {
        "name": "Al Jīzah",
        "center": [
          31.69893,
          35.9553
        ],
        "label": "Al Jīzah"
      },
      {
        "name": "Al Karāmah",
        "center": [
          31.95439,
          35.58033
        ],
        "label": "Al Karāmah"
      },
      {
        "name": "Al Khinzīrah",
        "center": [
          31.05056,
          35.60606
        ],
        "label": "Al Khinzīrah"
      },
      {
        "name": "Al Kittah",
        "center": [
          32.27685,
          35.84114
        ],
        "label": "Al Kittah"
      },
      {
        "name": "Al Mazār al Janūbī",
        "center": [
          31.06722,
          35.69486
        ],
        "label": "Al Mazār al Janūbī"
      },
      {
        "name": "Al Qaşr",
        "center": [
          31.31407,
          35.74393
        ],
        "label": "Al Qaşr"
      },
      {
        "name": "Al Quwayrah",
        "center": [
          29.80045,
          35.3116
        ],
        "label": "Al Quwayrah"
      },
      {
        "name": "Al Ḩamrā’",
        "center": [
          32.44017,
          36.15265
        ],
        "label": "Al Ḩamrā’"
      },
      {
        "name": "Amman",
        "center": [
          31.95522,
          35.94503
        ],
        "label": "Amman"
      },
      {
        "name": "Aqaba",
        "center": [
          29.52667,
          35.00778
        ],
        "label": "Aqaba"
      },
      {
        "name": "Ar Rabbah",
        "center": [
          31.26923,
          35.73829
        ],
        "label": "Ar Rabbah"
      },
      {
        "name": "Ar Ramthā",
        "center": [
          32.55873,
          36.00816
        ],
        "label": "Ar Ramthā"
      },
      {
        "name": "As Salţ",
        "center": [
          32.03917,
          35.72722
        ],
        "label": "As Salţ"
      },
      {
        "name": "Ash Shajarah",
        "center": [
          32.64391,
          35.94175
        ],
        "label": "Ash Shajarah"
      },
      {
        "name": "Ash Shawbak",
        "center": [
          30.52134,
          35.57135
        ],
        "label": "Ash Shawbak"
      },
      {
        "name": "Aydūn",
        "center": [
          32.50528,
          35.85809
        ],
        "label": "Aydūn"
      }
    ]
  },
  {
    "code": "KZ",
    "name": "Kazakhstan",
    "cities": [
      {
        "name": "Abay",
        "center": [
          49.63575,
          72.86164
        ],
        "label": "Abay"
      },
      {
        "name": "Abay Qalasy",
        "center": [
          49.63333,
          72.88333
        ],
        "label": "Abay Qalasy"
      },
      {
        "name": "Akkol",
        "center": [
          51.99374,
          70.94704
        ],
        "label": "Akkol"
      },
      {
        "name": "Akkol’",
        "center": [
          53.29617,
          69.59997
        ],
        "label": "Akkol’"
      },
      {
        "name": "Aksu",
        "center": [
          52.44422,
          71.95761
        ],
        "label": "Aksu"
      },
      {
        "name": "Aksu-Ayuly",
        "center": [
          48.76788,
          73.67272
        ],
        "label": "Aksu-Ayuly"
      },
      {
        "name": "Aktas",
        "center": [
          49.77952,
          72.96128
        ],
        "label": "Aktas"
      },
      {
        "name": "Aktau",
        "center": [
          48.03333,
          72.83333
        ],
        "label": "Aktau"
      },
      {
        "name": "Aktobe",
        "center": [
          50.27969,
          57.20718
        ],
        "label": "Aktobe"
      },
      {
        "name": "Aktogay",
        "center": [
          48.16667,
          75.3
        ],
        "label": "Aktogay"
      },
      {
        "name": "Almaty",
        "center": [
          43.25667,
          76.92861
        ],
        "label": "Almaty"
      },
      {
        "name": "Altayskiy",
        "center": [
          50.24593,
          82.36252
        ],
        "label": "Altayskiy"
      },
      {
        "name": "Aqadyr",
        "center": [
          48.26014,
          72.85851
        ],
        "label": "Aqadyr"
      },
      {
        "name": "Aqbaqay",
        "center": [
          45,
          72.78333
        ],
        "label": "Aqbaqay"
      },
      {
        "name": "Aqsay",
        "center": [
          51.1681,
          52.99782
        ],
        "label": "Aqsay"
      },
      {
        "name": "Aqshataū",
        "center": [
          47.98917,
          74.0575
        ],
        "label": "Aqshataū"
      },
      {
        "name": "Aqtoghay",
        "center": [
          46.95,
          79.66667
        ],
        "label": "Aqtoghay"
      },
      {
        "name": "Aqtoghay Aūdany",
        "center": [
          48.5,
          74.75
        ],
        "label": "Aqtoghay Aūdany"
      },
      {
        "name": "Aral",
        "center": [
          46.8,
          61.66667
        ],
        "label": "Aral"
      },
      {
        "name": "Arkalyk",
        "center": [
          50.24915,
          66.92027
        ],
        "label": "Arkalyk"
      }
    ]
  },
  {
    "code": "KE",
    "name": "Kenya",
    "cities": [
      {
        "name": "Ahero",
        "center": [
          -0.17359,
          34.9189
        ],
        "label": "Ahero"
      },
      {
        "name": "Athi River",
        "center": [
          -1.4563,
          36.97826
        ],
        "label": "Athi River"
      },
      {
        "name": "Baringo",
        "center": [
          0.46667,
          35.96667
        ],
        "label": "Baringo"
      },
      {
        "name": "Bondo",
        "center": [
          0.23522,
          34.28086
        ],
        "label": "Bondo"
      },
      {
        "name": "Bungoma",
        "center": [
          0.5635,
          34.56055
        ],
        "label": "Bungoma"
      },
      {
        "name": "Busia",
        "center": [
          0.46005,
          34.11169
        ],
        "label": "Busia"
      },
      {
        "name": "Butere",
        "center": [
          0.20694,
          34.49006
        ],
        "label": "Butere"
      },
      {
        "name": "Chepareria",
        "center": [
          1.30583,
          35.20365
        ],
        "label": "Chepareria"
      },
      {
        "name": "Chuka",
        "center": [
          -0.33316,
          37.64587
        ],
        "label": "Chuka"
      },
      {
        "name": "Eldama Ravine",
        "center": [
          0.05196,
          35.72734
        ],
        "label": "Eldama Ravine"
      },
      {
        "name": "Eldoret",
        "center": [
          0.52036,
          35.26993
        ],
        "label": "Eldoret"
      },
      {
        "name": "Embu",
        "center": [
          -0.53987,
          37.45743
        ],
        "label": "Embu"
      },
      {
        "name": "Garissa",
        "center": [
          -0.45275,
          39.64601
        ],
        "label": "Garissa"
      },
      {
        "name": "Gazi",
        "center": [
          -4.42402,
          39.50588
        ],
        "label": "Gazi"
      },
      {
        "name": "Hola",
        "center": [
          -1.48256,
          40.03341
        ],
        "label": "Hola"
      },
      {
        "name": "Homa Bay",
        "center": [
          -0.52731,
          34.45714
        ],
        "label": "Homa Bay"
      },
      {
        "name": "Isiolo",
        "center": [
          0.35462,
          37.58218
        ],
        "label": "Isiolo"
      },
      {
        "name": "Iten",
        "center": [
          0.67028,
          35.50806
        ],
        "label": "Iten"
      },
      {
        "name": "Kabarnet",
        "center": [
          0.49194,
          35.74303
        ],
        "label": "Kabarnet"
      },
      {
        "name": "Kajiado",
        "center": [
          -1.85238,
          36.77683
        ],
        "label": "Kajiado"
      }
    ]
  },
  {
    "code": "KI",
    "name": "Kiribati",
    "cities": [
      {
        "name": "Abaiang",
        "center": [
          1.85293,
          172.94369
        ],
        "label": "Abaiang"
      },
      {
        "name": "Abemama",
        "center": [
          0.4,
          173.86667
        ],
        "label": "Abemama"
      },
      {
        "name": "Ambo Village",
        "center": [
          1.35317,
          173.04259
        ],
        "label": "Ambo Village"
      },
      {
        "name": "Aranuka",
        "center": [
          0.16428,
          173.60579
        ],
        "label": "Aranuka"
      },
      {
        "name": "Arorae",
        "center": [
          -2.63493,
          176.82229
        ],
        "label": "Arorae"
      },
      {
        "name": "Bairiki Village",
        "center": [
          1.32924,
          172.97522
        ],
        "label": "Bairiki Village"
      },
      {
        "name": "Banaba",
        "center": [
          -0.855,
          169.538
        ],
        "label": "Banaba"
      },
      {
        "name": "Banana Village",
        "center": [
          1.98329,
          -157.36526
        ],
        "label": "Banana Village"
      },
      {
        "name": "Banraeaba Village",
        "center": [
          1.3454,
          173.03464
        ],
        "label": "Banraeaba Village"
      },
      {
        "name": "Beru",
        "center": [
          -1.32957,
          175.98072
        ],
        "label": "Beru"
      },
      {
        "name": "Betio Village",
        "center": [
          1.35797,
          172.92105
        ],
        "label": "Betio Village"
      },
      {
        "name": "Bikenibeu Village",
        "center": [
          1.3673,
          173.12415
        ],
        "label": "Bikenibeu Village"
      },
      {
        "name": "Bonriki Village",
        "center": [
          1.38081,
          173.13887
        ],
        "label": "Bonriki Village"
      },
      {
        "name": "Buota Village",
        "center": [
          1.39078,
          173.13082
        ],
        "label": "Buota Village"
      },
      {
        "name": "Butaritari",
        "center": [
          3.17205,
          172.79675
        ],
        "label": "Butaritari"
      },
      {
        "name": "Eita Village",
        "center": [
          1.36154,
          173.08113
        ],
        "label": "Eita Village"
      },
      {
        "name": "Kanton",
        "center": [
          -2.81,
          -171.678
        ],
        "label": "Kanton"
      },
      {
        "name": "Kiritimati",
        "center": [
          1.94,
          -157.475
        ],
        "label": "Kiritimati"
      },
      {
        "name": "Kuria",
        "center": [
          0.26522,
          173.38881
        ],
        "label": "Kuria"
      },
      {
        "name": "London Village",
        "center": [
          1.98487,
          -157.47502
        ],
        "label": "London Village"
      }
    ]
  },
  {
    "code": "XK",
    "name": "Kosovo",
    "cities": [
      {
        "name": "Pristina",
        "center": [
          42.6629,
          21.1655
        ],
        "label": "Pristina"
      },
      {
        "name": "Prizren",
        "center": [
          42.2153,
          20.7415
        ],
        "label": "Prizren"
      }
    ]
  },
  {
    "code": "KW",
    "name": "Kuwait",
    "cities": [
      {
        "name": "Abu Al Hasaniya",
        "center": [
          29.19076,
          48.11355
        ],
        "label": "Abu Al Hasaniya"
      },
      {
        "name": "Abu Fatira",
        "center": [
          29.19746,
          48.10278
        ],
        "label": "Abu Fatira"
      },
      {
        "name": "Ad Dasmah",
        "center": [
          29.365,
          48.00139
        ],
        "label": "Ad Dasmah"
      },
      {
        "name": "Al Aḩmadī",
        "center": [
          29.07694,
          48.08389
        ],
        "label": "Al Aḩmadī"
      },
      {
        "name": "Al Farwānīyah",
        "center": [
          29.2775,
          47.95861
        ],
        "label": "Al Farwānīyah"
      },
      {
        "name": "Al Faḩāḩīl",
        "center": [
          29.0825,
          48.13028
        ],
        "label": "Al Faḩāḩīl"
      },
      {
        "name": "Al Finţās",
        "center": [
          29.17389,
          48.12111
        ],
        "label": "Al Finţās"
      },
      {
        "name": "Al Funayţīs",
        "center": [
          29.22528,
          48.10167
        ],
        "label": "Al Funayţīs"
      },
      {
        "name": "Al Jahrā’",
        "center": [
          29.3375,
          47.65806
        ],
        "label": "Al Jahrā’"
      },
      {
        "name": "Al Mahbūlah",
        "center": [
          29.145,
          48.13028
        ],
        "label": "Al Mahbūlah"
      },
      {
        "name": "Al Manqaf",
        "center": [
          29.09611,
          48.13278
        ],
        "label": "Al Manqaf"
      },
      {
        "name": "Al Wafrah",
        "center": [
          28.63917,
          47.93056
        ],
        "label": "Al Wafrah"
      },
      {
        "name": "Al-Masayel",
        "center": [
          29.2393,
          48.08862
        ],
        "label": "Al-Masayel"
      },
      {
        "name": "Ar Riqqah",
        "center": [
          29.14583,
          48.09472
        ],
        "label": "Ar Riqqah"
      },
      {
        "name": "Ar Rumaythīyah",
        "center": [
          29.31167,
          48.07417
        ],
        "label": "Ar Rumaythīyah"
      },
      {
        "name": "Ar Rābiyah",
        "center": [
          29.295,
          47.93306
        ],
        "label": "Ar Rābiyah"
      },
      {
        "name": "As Sālimīyah",
        "center": [
          29.33389,
          48.07611
        ],
        "label": "As Sālimīyah"
      },
      {
        "name": "Ash Shāmīyah",
        "center": [
          29.34722,
          47.96167
        ],
        "label": "Ash Shāmīyah"
      },
      {
        "name": "Az Zawr",
        "center": [
          29.4425,
          48.27472
        ],
        "label": "Az Zawr"
      },
      {
        "name": "Bayān",
        "center": [
          29.3032,
          48.04881
        ],
        "label": "Bayān"
      }
    ]
  },
  {
    "code": "KG",
    "name": "Kyrgyzstan",
    "cities": [
      {
        "name": "Ak-Suu",
        "center": [
          42.49948,
          78.52702
        ],
        "label": "Ak-Suu"
      },
      {
        "name": "Ala-Buka",
        "center": [
          41.40806,
          71.46306
        ],
        "label": "Ala-Buka"
      },
      {
        "name": "Alamudunskiy Rayon",
        "center": [
          42.81985,
          74.59398
        ],
        "label": "Alamudunskiy Rayon"
      },
      {
        "name": "At-Bashi",
        "center": [
          41.16951,
          75.80099
        ],
        "label": "At-Bashi"
      },
      {
        "name": "Aydarken",
        "center": [
          39.94319,
          71.34184
        ],
        "label": "Aydarken"
      },
      {
        "name": "Balykchy",
        "center": [
          42.46017,
          76.18709
        ],
        "label": "Balykchy"
      },
      {
        "name": "Batken",
        "center": [
          40.06259,
          70.81939
        ],
        "label": "Batken"
      },
      {
        "name": "Bazar-Korgon",
        "center": [
          41.0376,
          72.74586
        ],
        "label": "Bazar-Korgon"
      },
      {
        "name": "Belovodskoye",
        "center": [
          42.82944,
          74.1083
        ],
        "label": "Belovodskoye"
      },
      {
        "name": "Bishkek",
        "center": [
          42.87,
          74.59
        ],
        "label": "Bishkek"
      },
      {
        "name": "Cholpon-Ata",
        "center": [
          42.64944,
          77.08225
        ],
        "label": "Cholpon-Ata"
      },
      {
        "name": "Chong-Alay District",
        "center": [
          39.47614,
          72.33017
        ],
        "label": "Chong-Alay District"
      },
      {
        "name": "Chuyskiy Rayon",
        "center": [
          42.66667,
          75.33333
        ],
        "label": "Chuyskiy Rayon"
      },
      {
        "name": "Daroot-Korgon",
        "center": [
          39.55274,
          72.20518
        ],
        "label": "Daroot-Korgon"
      },
      {
        "name": "Iradan",
        "center": [
          40.26667,
          72.1
        ],
        "label": "Iradan"
      },
      {
        "name": "Isfana",
        "center": [
          39.83895,
          69.5276
        ],
        "label": "Isfana"
      },
      {
        "name": "Ivanovka",
        "center": [
          42.88778,
          75.085
        ],
        "label": "Ivanovka"
      },
      {
        "name": "Jalal-Abad",
        "center": [
          40.93333,
          73
        ],
        "label": "Jalal-Abad"
      },
      {
        "name": "Jumgal",
        "center": [
          41.94924,
          74.40566
        ],
        "label": "Jumgal"
      },
      {
        "name": "Kadzhi-Say",
        "center": [
          42.14107,
          77.17848
        ],
        "label": "Kadzhi-Say"
      }
    ]
  },
  {
    "code": "LA",
    "name": "Laos",
    "cities": [
      {
        "name": "Anouvong district",
        "center": [
          18.89731,
          103.09274
        ],
        "label": "Anouvong district"
      },
      {
        "name": "Attapeu",
        "center": [
          14.81071,
          106.83184
        ],
        "label": "Attapeu"
      },
      {
        "name": "Ban Houakhoua",
        "center": [
          20.2467,
          100.45401
        ],
        "label": "Ban Houakhoua"
      },
      {
        "name": "Ban Houayxay",
        "center": [
          20.27,
          100.4178
        ],
        "label": "Ban Houayxay"
      },
      {
        "name": "Ban Nahin",
        "center": [
          18.24253,
          104.21281
        ],
        "label": "Ban Nahin"
      },
      {
        "name": "Ban Thatèng",
        "center": [
          15.43317,
          106.38272
        ],
        "label": "Ban Thatèng"
      },
      {
        "name": "Champasak",
        "center": [
          14.89204,
          105.87787
        ],
        "label": "Champasak"
      },
      {
        "name": "Kaysone Phomvihane",
        "center": [
          16.54943,
          104.82339
        ],
        "label": "Kaysone Phomvihane"
      },
      {
        "name": "Lamam",
        "center": [
          15.41705,
          106.69461
        ],
        "label": "Lamam"
      },
      {
        "name": "Longchaeng",
        "center": [
          18.89394,
          103.14274
        ],
        "label": "Longchaeng"
      },
      {
        "name": "Luang Namtha",
        "center": [
          20.9486,
          101.40188
        ],
        "label": "Luang Namtha"
      },
      {
        "name": "Luang Prabang",
        "center": [
          19.88601,
          102.13503
        ],
        "label": "Luang Prabang"
      },
      {
        "name": "Muang Alsaphangthong",
        "center": [
          16.72645,
          105.39326
        ],
        "label": "Muang Alsaphangthong"
      },
      {
        "name": "Muang Atsaphan",
        "center": [
          16.9474,
          105.4029
        ],
        "label": "Muang Atsaphan"
      },
      {
        "name": "Muang Bachiangchaleunsook",
        "center": [
          15.24426,
          105.96716
        ],
        "label": "Muang Bachiangchaleunsook"
      },
      {
        "name": "Muang Champasak",
        "center": [
          14.85704,
          105.75334
        ],
        "label": "Muang Champasak"
      },
      {
        "name": "Muang Champhon",
        "center": [
          16.49363,
          105.2202
        ],
        "label": "Muang Champhon"
      },
      {
        "name": "Muang Dakchung",
        "center": [
          15.38199,
          107.31847
        ],
        "label": "Muang Dakchung"
      },
      {
        "name": "Muang Houayxay",
        "center": [
          20.38763,
          100.62687
        ],
        "label": "Muang Houayxay"
      },
      {
        "name": "Muang Khaleum",
        "center": [
          15.79886,
          107.04529
        ],
        "label": "Muang Khaleum"
      }
    ]
  },
  {
    "code": "LV",
    "name": "Latvia",
    "cities": [
      {
        "name": "Aglona",
        "center": [
          56.13274,
          27.00682
        ],
        "label": "Aglona"
      },
      {
        "name": "Ainaži",
        "center": [
          57.86348,
          24.35853
        ],
        "label": "Ainaži"
      },
      {
        "name": "Aizkraukle",
        "center": [
          56.60477,
          25.25534
        ],
        "label": "Aizkraukle"
      },
      {
        "name": "Aizpute",
        "center": [
          56.72108,
          21.60156
        ],
        "label": "Aizpute"
      },
      {
        "name": "Aknīste",
        "center": [
          56.16152,
          25.74783
        ],
        "label": "Aknīste"
      },
      {
        "name": "Aloja",
        "center": [
          57.76723,
          24.87743
        ],
        "label": "Aloja"
      },
      {
        "name": "Alsunga",
        "center": [
          56.98194,
          21.55938
        ],
        "label": "Alsunga"
      },
      {
        "name": "Alūksne",
        "center": [
          57.42162,
          27.04662
        ],
        "label": "Alūksne"
      },
      {
        "name": "Ape",
        "center": [
          57.53928,
          26.69291
        ],
        "label": "Ape"
      },
      {
        "name": "Auce",
        "center": [
          56.45981,
          22.90169
        ],
        "label": "Auce"
      },
      {
        "name": "Baldone",
        "center": [
          56.74451,
          24.40078
        ],
        "label": "Baldone"
      },
      {
        "name": "Baloži",
        "center": [
          56.87643,
          24.11825
        ],
        "label": "Baloži"
      },
      {
        "name": "Baltinava",
        "center": [
          56.94394,
          27.64401
        ],
        "label": "Baltinava"
      },
      {
        "name": "Balvi",
        "center": [
          57.1313,
          27.26583
        ],
        "label": "Balvi"
      },
      {
        "name": "Bauska",
        "center": [
          56.40794,
          24.19443
        ],
        "label": "Bauska"
      },
      {
        "name": "Bolderaja",
        "center": [
          57.03132,
          24.05571
        ],
        "label": "Bolderaja"
      },
      {
        "name": "Brocēni",
        "center": [
          56.6789,
          22.56945
        ],
        "label": "Brocēni"
      },
      {
        "name": "Carnikava",
        "center": [
          57.12935,
          24.28423
        ],
        "label": "Carnikava"
      },
      {
        "name": "Cesvaine",
        "center": [
          56.96754,
          26.30764
        ],
        "label": "Cesvaine"
      },
      {
        "name": "Cibla",
        "center": [
          56.5498,
          27.8837
        ],
        "label": "Cibla"
      }
    ]
  },
  {
    "code": "LB",
    "name": "Lebanon",
    "cities": [
      {
        "name": "Aanjar",
        "center": [
          33.72778,
          35.93111
        ],
        "label": "Aanjar"
      },
      {
        "name": "Ain Ebel",
        "center": [
          33.11023,
          35.40251
        ],
        "label": "Ain Ebel"
      },
      {
        "name": "Baabda",
        "center": [
          33.83389,
          35.54417
        ],
        "label": "Baabda"
      },
      {
        "name": "Baalbek",
        "center": [
          34.00583,
          36.21806
        ],
        "label": "Baalbek"
      },
      {
        "name": "Batroûn",
        "center": [
          34.25528,
          35.65806
        ],
        "label": "Batroûn"
      },
      {
        "name": "Bcharré",
        "center": [
          34.25083,
          36.01056
        ],
        "label": "Bcharré"
      },
      {
        "name": "Beirut",
        "center": [
          33.89332,
          35.50157
        ],
        "label": "Beirut"
      },
      {
        "name": "Bhamdoun",
        "center": [
          33.795,
          35.65111
        ],
        "label": "Bhamdoun"
      },
      {
        "name": "Bhamdoûn el Mhatta",
        "center": [
          33.80861,
          35.65972
        ],
        "label": "Bhamdoûn el Mhatta"
      },
      {
        "name": "Caza de Aakkar",
        "center": [
          34.53333,
          36.16667
        ],
        "label": "Caza de Aakkar"
      },
      {
        "name": "Caza de Baabda",
        "center": [
          33.84592,
          35.66791
        ],
        "label": "Caza de Baabda"
      },
      {
        "name": "Caza de Baalbek",
        "center": [
          34.09822,
          36.27157
        ],
        "label": "Caza de Baalbek"
      },
      {
        "name": "Caza de Bent Jbaïl",
        "center": [
          33.15964,
          35.41137
        ],
        "label": "Caza de Bent Jbaïl"
      },
      {
        "name": "Caza de Nabatîyé",
        "center": [
          33.39435,
          35.44483
        ],
        "label": "Caza de Nabatîyé"
      },
      {
        "name": "En Nâqoûra",
        "center": [
          33.11806,
          35.13972
        ],
        "label": "En Nâqoûra"
      },
      {
        "name": "Ghazieh",
        "center": [
          33.5175,
          35.36889
        ],
        "label": "Ghazieh"
      },
      {
        "name": "Habboûch",
        "center": [
          33.40729,
          35.48169
        ],
        "label": "Habboûch"
      },
      {
        "name": "Jbaïl",
        "center": [
          34.12111,
          35.64806
        ],
        "label": "Jbaïl"
      },
      {
        "name": "Jounieh",
        "center": [
          33.98083,
          35.61778
        ],
        "label": "Jounieh"
      },
      {
        "name": "Marjayoûn",
        "center": [
          33.36028,
          35.59111
        ],
        "label": "Marjayoûn"
      }
    ]
  },
  {
    "code": "LS",
    "name": "Lesotho",
    "cities": [
      {
        "name": "Butha-Buthe",
        "center": [
          -28.76659,
          28.24937
        ],
        "label": "Butha-Buthe"
      },
      {
        "name": "Leribe",
        "center": [
          -28.87185,
          28.04501
        ],
        "label": "Leribe"
      },
      {
        "name": "Mafeteng",
        "center": [
          -29.82299,
          27.23744
        ],
        "label": "Mafeteng"
      },
      {
        "name": "Maputsoe",
        "center": [
          -28.8866,
          27.89915
        ],
        "label": "Maputsoe"
      },
      {
        "name": "Maseru",
        "center": [
          -29.31667,
          27.48333
        ],
        "label": "Maseru"
      },
      {
        "name": "Mohale’s Hoek",
        "center": [
          -30.15137,
          27.47691
        ],
        "label": "Mohale’s Hoek"
      },
      {
        "name": "Mokhotlong",
        "center": [
          -29.28939,
          29.06751
        ],
        "label": "Mokhotlong"
      },
      {
        "name": "Nako",
        "center": [
          -29.61667,
          27.76667
        ],
        "label": "Nako"
      },
      {
        "name": "Qacha’s Nek",
        "center": [
          -30.11537,
          28.68936
        ],
        "label": "Qacha’s Nek"
      },
      {
        "name": "Quthing",
        "center": [
          -30.40001,
          27.70027
        ],
        "label": "Quthing"
      },
      {
        "name": "Teyateyaneng",
        "center": [
          -29.14719,
          27.74895
        ],
        "label": "Teyateyaneng"
      },
      {
        "name": "Thaba-Tseka",
        "center": [
          -29.52204,
          28.6084
        ],
        "label": "Thaba-Tseka"
      }
    ]
  },
  {
    "code": "LR",
    "name": "Liberia",
    "cities": [
      {
        "name": "Barclayville",
        "center": [
          4.67443,
          -8.23306
        ],
        "label": "Barclayville"
      },
      {
        "name": "Bensonville",
        "center": [
          6.44716,
          -10.61283
        ],
        "label": "Bensonville"
      },
      {
        "name": "Bopolu",
        "center": [
          7.06667,
          -10.4875
        ],
        "label": "Bopolu"
      },
      {
        "name": "Buchanan",
        "center": [
          5.87693,
          -10.04964
        ],
        "label": "Buchanan"
      },
      {
        "name": "Cestos City",
        "center": [
          5.45683,
          -9.58167
        ],
        "label": "Cestos City"
      },
      {
        "name": "Fish Town",
        "center": [
          5.19739,
          -7.87579
        ],
        "label": "Fish Town"
      },
      {
        "name": "Ganta",
        "center": [
          7.30222,
          -8.53083
        ],
        "label": "Ganta"
      },
      {
        "name": "Gbarnga",
        "center": [
          6.99543,
          -9.47122
        ],
        "label": "Gbarnga"
      },
      {
        "name": "Greenville",
        "center": [
          5.01133,
          -9.0388
        ],
        "label": "Greenville"
      },
      {
        "name": "Harper",
        "center": [
          4.3782,
          -7.71081
        ],
        "label": "Harper"
      },
      {
        "name": "Kakata",
        "center": [
          6.53104,
          -10.35368
        ],
        "label": "Kakata"
      },
      {
        "name": "Monrovia",
        "center": [
          6.30054,
          -10.7969
        ],
        "label": "Monrovia"
      },
      {
        "name": "New Yekepa",
        "center": [
          7.57944,
          -8.53778
        ],
        "label": "New Yekepa"
      },
      {
        "name": "Robertsport",
        "center": [
          6.75329,
          -11.3671
        ],
        "label": "Robertsport"
      },
      {
        "name": "Sanniquellie",
        "center": [
          7.36215,
          -8.71326
        ],
        "label": "Sanniquellie"
      },
      {
        "name": "Tubmanburg",
        "center": [
          6.87064,
          -10.8211
        ],
        "label": "Tubmanburg"
      },
      {
        "name": "Voinjama",
        "center": [
          8.42194,
          -9.74778
        ],
        "label": "Voinjama"
      },
      {
        "name": "Zwedru",
        "center": [
          6.06846,
          -8.13559
        ],
        "label": "Zwedru"
      }
    ]
  },
  {
    "code": "LY",
    "name": "Libya",
    "cities": [
      {
        "name": "Ajdabiya",
        "center": [
          30.75545,
          20.22625
        ],
        "label": "Ajdabiya"
      },
      {
        "name": "Al Abyār",
        "center": [
          32.19,
          20.59653
        ],
        "label": "Al Abyār"
      },
      {
        "name": "Al Ajaylat",
        "center": [
          32.75718,
          12.37633
        ],
        "label": "Al Ajaylat"
      },
      {
        "name": "Al Bayḑā’",
        "center": [
          32.76272,
          21.75506
        ],
        "label": "Al Bayḑā’"
      },
      {
        "name": "Al Burayqah",
        "center": [
          30.40624,
          19.57386
        ],
        "label": "Al Burayqah"
      },
      {
        "name": "Al Jadīd",
        "center": [
          27.05,
          14.4
        ],
        "label": "Al Jadīd"
      },
      {
        "name": "Al Jawf",
        "center": [
          24.1989,
          23.29093
        ],
        "label": "Al Jawf"
      },
      {
        "name": "Al Khums",
        "center": [
          32.64861,
          14.26191
        ],
        "label": "Al Khums"
      },
      {
        "name": "Al Marj",
        "center": [
          32.49257,
          20.82909
        ],
        "label": "Al Marj"
      },
      {
        "name": "Al Qaţrūn",
        "center": [
          24.95139,
          14.64861
        ],
        "label": "Al Qaţrūn"
      },
      {
        "name": "Al Qubbah",
        "center": [
          32.75684,
          22.24106
        ],
        "label": "Al Qubbah"
      },
      {
        "name": "Al ‘Azīzīyah",
        "center": [
          32.53194,
          13.0175
        ],
        "label": "Al ‘Azīzīyah"
      },
      {
        "name": "At Tāj",
        "center": [
          24.20487,
          23.2857
        ],
        "label": "At Tāj"
      },
      {
        "name": "Awjilah",
        "center": [
          29.10806,
          21.28694
        ],
        "label": "Awjilah"
      },
      {
        "name": "Az Zuwaytīnah",
        "center": [
          30.9522,
          20.12022
        ],
        "label": "Az Zuwaytīnah"
      },
      {
        "name": "Az Zāwīyah",
        "center": [
          32.7571,
          12.72764
        ],
        "label": "Az Zāwīyah"
      },
      {
        "name": "Bani Walid",
        "center": [
          31.74554,
          13.98354
        ],
        "label": "Bani Walid"
      },
      {
        "name": "Benghazi",
        "center": [
          32.11486,
          20.06859
        ],
        "label": "Benghazi"
      },
      {
        "name": "Brak",
        "center": [
          27.54956,
          14.27139
        ],
        "label": "Brak"
      },
      {
        "name": "Darnah",
        "center": [
          32.76704,
          22.63669
        ],
        "label": "Darnah"
      }
    ]
  },
  {
    "code": "LI",
    "name": "Liechtenstein",
    "cities": [
      {
        "name": "Balzers",
        "center": [
          47.06665,
          9.50251
        ],
        "label": "Balzers"
      },
      {
        "name": "Eschen",
        "center": [
          47.21071,
          9.52223
        ],
        "label": "Eschen"
      },
      {
        "name": "Gamprin",
        "center": [
          47.22038,
          9.50935
        ],
        "label": "Gamprin"
      },
      {
        "name": "Mauren",
        "center": [
          47.21805,
          9.5442
        ],
        "label": "Mauren"
      },
      {
        "name": "Planken",
        "center": [
          47.18516,
          9.54437
        ],
        "label": "Planken"
      },
      {
        "name": "Ruggell",
        "center": [
          47.23799,
          9.5254
        ],
        "label": "Ruggell"
      },
      {
        "name": "Schaan",
        "center": [
          47.16498,
          9.50867
        ],
        "label": "Schaan"
      },
      {
        "name": "Schellenberg",
        "center": [
          47.23123,
          9.54678
        ],
        "label": "Schellenberg"
      },
      {
        "name": "Triesen",
        "center": [
          47.10752,
          9.52815
        ],
        "label": "Triesen"
      },
      {
        "name": "Triesenberg",
        "center": [
          47.11815,
          9.54197
        ],
        "label": "Triesenberg"
      },
      {
        "name": "Vaduz",
        "center": [
          47.14151,
          9.52154
        ],
        "label": "Vaduz"
      }
    ]
  },
  {
    "code": "LT",
    "name": "Lithuania",
    "cities": [
      {
        "name": "Akademija (Kaunas)",
        "center": [
          54.8964,
          23.82411
        ],
        "label": "Akademija (Kaunas)"
      },
      {
        "name": "Akmenė",
        "center": [
          56.25,
          22.75
        ],
        "label": "Akmenė"
      },
      {
        "name": "Aleksotas",
        "center": [
          54.88037,
          23.90842
        ],
        "label": "Aleksotas"
      },
      {
        "name": "Alytus",
        "center": [
          54.39635,
          24.04142
        ],
        "label": "Alytus"
      },
      {
        "name": "Anyksciai",
        "center": [
          55.52557,
          25.10264
        ],
        "label": "Anyksciai"
      },
      {
        "name": "Ariogala",
        "center": [
          55.262,
          23.477
        ],
        "label": "Ariogala"
      },
      {
        "name": "Aukstadvaris",
        "center": [
          54.57946,
          24.52683
        ],
        "label": "Aukstadvaris"
      },
      {
        "name": "Baltoji Vokė",
        "center": [
          54.60002,
          25.19318
        ],
        "label": "Baltoji Vokė"
      },
      {
        "name": "Birzai",
        "center": [
          56.2,
          24.75
        ],
        "label": "Birzai"
      },
      {
        "name": "Birštonas",
        "center": [
          54.61667,
          24.03333
        ],
        "label": "Birštonas"
      },
      {
        "name": "Būgai",
        "center": [
          55.41387,
          22.60894
        ],
        "label": "Būgai"
      },
      {
        "name": "Dainava (Kaunas)",
        "center": [
          54.91525,
          23.96831
        ],
        "label": "Dainava (Kaunas)"
      },
      {
        "name": "Daugai",
        "center": [
          54.36667,
          24.33333
        ],
        "label": "Daugai"
      },
      {
        "name": "Druskininkai",
        "center": [
          54.01573,
          23.98703
        ],
        "label": "Druskininkai"
      },
      {
        "name": "Dūkštas",
        "center": [
          55.522,
          26.321
        ],
        "label": "Dūkštas"
      },
      {
        "name": "Eiguliai",
        "center": [
          54.93133,
          23.93243
        ],
        "label": "Eiguliai"
      },
      {
        "name": "Eišiškės",
        "center": [
          54.17414,
          24.99917
        ],
        "label": "Eišiškės"
      },
      {
        "name": "Elektrėnai",
        "center": [
          54.78544,
          24.66302
        ],
        "label": "Elektrėnai"
      },
      {
        "name": "Ežerėlis",
        "center": [
          54.88315,
          23.60396
        ],
        "label": "Ežerėlis"
      },
      {
        "name": "Fabijoniškės",
        "center": [
          54.73333,
          25.24167
        ],
        "label": "Fabijoniškės"
      }
    ]
  },
  {
    "code": "LU",
    "name": "Luxembourg",
    "cities": [
      {
        "name": "Alzingen",
        "center": [
          49.565,
          6.16361
        ],
        "label": "Alzingen"
      },
      {
        "name": "Aspelt",
        "center": [
          49.52278,
          6.22472
        ],
        "label": "Aspelt"
      },
      {
        "name": "Bascharage",
        "center": [
          49.56727,
          5.9073
        ],
        "label": "Bascharage"
      },
      {
        "name": "Bavigne",
        "center": [
          49.92194,
          5.84944
        ],
        "label": "Bavigne"
      },
      {
        "name": "Beaufort",
        "center": [
          49.83583,
          6.29167
        ],
        "label": "Beaufort"
      },
      {
        "name": "Bech",
        "center": [
          49.7526,
          6.36379
        ],
        "label": "Bech"
      },
      {
        "name": "Beckerich",
        "center": [
          49.73056,
          5.88722
        ],
        "label": "Beckerich"
      },
      {
        "name": "Belvaux",
        "center": [
          49.51014,
          5.92414
        ],
        "label": "Belvaux"
      },
      {
        "name": "Berdorf",
        "center": [
          49.82051,
          6.34945
        ],
        "label": "Berdorf"
      },
      {
        "name": "Bergem",
        "center": [
          49.525,
          6.04222
        ],
        "label": "Bergem"
      },
      {
        "name": "Bertrange",
        "center": [
          49.61111,
          6.05
        ],
        "label": "Bertrange"
      },
      {
        "name": "Bettborn",
        "center": [
          49.79528,
          5.94111
        ],
        "label": "Bettborn"
      },
      {
        "name": "Bettembourg",
        "center": [
          49.51861,
          6.10278
        ],
        "label": "Bettembourg"
      },
      {
        "name": "Bettendorf",
        "center": [
          49.87667,
          6.21806
        ],
        "label": "Bettendorf"
      },
      {
        "name": "Betzdorf",
        "center": [
          49.68333,
          6.35
        ],
        "label": "Betzdorf"
      },
      {
        "name": "Bissen",
        "center": [
          49.78733,
          6.0654
        ],
        "label": "Bissen"
      },
      {
        "name": "Biwer",
        "center": [
          49.70605,
          6.37201
        ],
        "label": "Biwer"
      },
      {
        "name": "Boevange-sur-Attert",
        "center": [
          49.77256,
          6.01532
        ],
        "label": "Boevange-sur-Attert"
      },
      {
        "name": "Boulaide",
        "center": [
          49.88778,
          5.81639
        ],
        "label": "Boulaide"
      },
      {
        "name": "Bourscheid",
        "center": [
          49.90862,
          6.0675
        ],
        "label": "Bourscheid"
      }
    ]
  },
  {
    "code": "MO",
    "name": "Macau S.A.R.",
    "cities": [
      {
        "name": "Macau Peninsula",
        "center": [
          22.1987,
          113.5439
        ],
        "label": "Macau (Peninsula)"
      },
      {
        "name": "Taipa & Cotai",
        "center": [
          22.1467,
          113.5604
        ],
        "label": "Taipa & Cotai"
      }
    ]
  },
  {
    "code": "MK",
    "name": "Macedonia",
    "cities": [
      {
        "name": "Batinci",
        "center": [
          41.91909,
          21.47978
        ],
        "label": "Batinci"
      },
      {
        "name": "Bedinje",
        "center": [
          42.14167,
          21.69639
        ],
        "label": "Bedinje"
      },
      {
        "name": "Belčišta",
        "center": [
          41.30278,
          20.83028
        ],
        "label": "Belčišta"
      },
      {
        "name": "Beranci",
        "center": [
          41.15969,
          21.35963
        ],
        "label": "Beranci"
      },
      {
        "name": "Berovo",
        "center": [
          41.70306,
          22.85778
        ],
        "label": "Berovo"
      },
      {
        "name": "Bistrica",
        "center": [
          40.97892,
          21.3658
        ],
        "label": "Bistrica"
      },
      {
        "name": "Bitola",
        "center": [
          41.03143,
          21.33474
        ],
        "label": "Bitola"
      },
      {
        "name": "Blatec",
        "center": [
          41.83668,
          22.57909
        ],
        "label": "Blatec"
      },
      {
        "name": "Bogdanci",
        "center": [
          41.20306,
          22.57556
        ],
        "label": "Bogdanci"
      },
      {
        "name": "Bogomila",
        "center": [
          41.59306,
          21.47167
        ],
        "label": "Bogomila"
      },
      {
        "name": "Bogovinje",
        "center": [
          41.92361,
          20.91361
        ],
        "label": "Bogovinje"
      },
      {
        "name": "Bojane",
        "center": [
          42.00009,
          21.19265
        ],
        "label": "Bojane"
      },
      {
        "name": "Bosilovo",
        "center": [
          41.44056,
          22.72778
        ],
        "label": "Bosilovo"
      },
      {
        "name": "Brvenica",
        "center": [
          41.96722,
          20.98083
        ],
        "label": "Brvenica"
      },
      {
        "name": "Bukovik",
        "center": [
          41.96833,
          21.23694
        ],
        "label": "Bukovik"
      },
      {
        "name": "Butel",
        "center": [
          42.03083,
          21.44667
        ],
        "label": "Butel"
      },
      {
        "name": "Bučin",
        "center": [
          41.27377,
          21.31692
        ],
        "label": "Bučin"
      },
      {
        "name": "Capari",
        "center": [
          41.05656,
          21.17884
        ],
        "label": "Capari"
      },
      {
        "name": "Cegrane",
        "center": [
          41.83889,
          20.97583
        ],
        "label": "Cegrane"
      },
      {
        "name": "Centar Župa",
        "center": [
          41.47849,
          20.55945
        ],
        "label": "Centar Župa"
      }
    ]
  },
  {
    "code": "MG",
    "name": "Madagascar",
    "cities": [
      {
        "name": "Ampasimanolotra",
        "center": [
          -18.81667,
          49.06667
        ],
        "label": "Ampasimanolotra"
      },
      {
        "name": "Andovoranto",
        "center": [
          -18.95443,
          49.1094
        ],
        "label": "Andovoranto"
      },
      {
        "name": "Mahanoro",
        "center": [
          -19.9,
          48.8
        ],
        "label": "Mahanoro"
      },
      {
        "name": "Mahavelona",
        "center": [
          -17.68475,
          49.50869
        ],
        "label": "Mahavelona"
      },
      {
        "name": "Marolambo",
        "center": [
          -20.05,
          48.11667
        ],
        "label": "Marolambo"
      },
      {
        "name": "Toamasina",
        "center": [
          -18.1492,
          49.40234
        ],
        "label": "Toamasina"
      },
      {
        "name": "Toamasina I",
        "center": [
          -18.13863,
          49.39203
        ],
        "label": "Toamasina I"
      },
      {
        "name": "Toamasina II",
        "center": [
          -17.94053,
          49.14608
        ],
        "label": "Toamasina II"
      },
      {
        "name": "Vohibinany",
        "center": [
          -17.35,
          49.03333
        ],
        "label": "Vohibinany"
      }
    ]
  },
  {
    "code": "MW",
    "name": "Malawi",
    "cities": [
      {
        "name": "Balaka",
        "center": [
          -14.97928,
          34.95575
        ],
        "label": "Balaka"
      },
      {
        "name": "Balaka District",
        "center": [
          -15.04839,
          35.0591
        ],
        "label": "Balaka District"
      },
      {
        "name": "Blantyre",
        "center": [
          -15.78499,
          35.00854
        ],
        "label": "Blantyre"
      },
      {
        "name": "Blantyre District",
        "center": [
          -15.64732,
          34.93956
        ],
        "label": "Blantyre District"
      },
      {
        "name": "Chikwawa",
        "center": [
          -16.03352,
          34.80091
        ],
        "label": "Chikwawa"
      },
      {
        "name": "Chikwawa District",
        "center": [
          -16.16667,
          34.75
        ],
        "label": "Chikwawa District"
      },
      {
        "name": "Chipoka",
        "center": [
          -13.99329,
          34.51566
        ],
        "label": "Chipoka"
      },
      {
        "name": "Chiradzulu",
        "center": [
          -15.67461,
          35.14071
        ],
        "label": "Chiradzulu"
      },
      {
        "name": "Chiradzulu District",
        "center": [
          -15.75268,
          35.21576
        ],
        "label": "Chiradzulu District"
      },
      {
        "name": "Chitipa",
        "center": [
          -9.70237,
          33.26969
        ],
        "label": "Chitipa"
      },
      {
        "name": "Chitipa District",
        "center": [
          -9.92727,
          33.42541
        ],
        "label": "Chitipa District"
      },
      {
        "name": "Dedza",
        "center": [
          -14.3779,
          34.33322
        ],
        "label": "Dedza"
      },
      {
        "name": "Dedza District",
        "center": [
          -14.26273,
          34.18559
        ],
        "label": "Dedza District"
      },
      {
        "name": "Dowa",
        "center": [
          -13.65399,
          33.93754
        ],
        "label": "Dowa"
      },
      {
        "name": "Dowa District",
        "center": [
          -13.60098,
          33.82378
        ],
        "label": "Dowa District"
      },
      {
        "name": "Karonga",
        "center": [
          -9.93333,
          33.93333
        ],
        "label": "Karonga"
      },
      {
        "name": "Karonga District",
        "center": [
          -10.11153,
          33.88151
        ],
        "label": "Karonga District"
      },
      {
        "name": "Kasungu",
        "center": [
          -13.03333,
          33.48333
        ],
        "label": "Kasungu"
      },
      {
        "name": "Kasungu District",
        "center": [
          -13,
          33.41667
        ],
        "label": "Kasungu District"
      },
      {
        "name": "Likoma District",
        "center": [
          -12.06065,
          34.73608
        ],
        "label": "Likoma District"
      }
    ]
  },
  {
    "code": "MY",
    "name": "Malaysia",
    "cities": [
      {
        "name": "Alor Gajah",
        "center": [
          2.3804,
          102.2089
        ],
        "label": "Alor Gajah"
      },
      {
        "name": "Alor Setar",
        "center": [
          6.12104,
          100.36014
        ],
        "label": "Alor Setar"
      },
      {
        "name": "Ampang",
        "center": [
          3.15,
          101.76667
        ],
        "label": "Ampang"
      },
      {
        "name": "Ayer Hangat",
        "center": [
          6.42062,
          99.82199
        ],
        "label": "Ayer Hangat"
      },
      {
        "name": "Bagan Pulau Ketam",
        "center": [
          3.01667,
          101.26667
        ],
        "label": "Bagan Pulau Ketam"
      },
      {
        "name": "Bagan Serai",
        "center": [
          5.0108,
          100.54101
        ],
        "label": "Bagan Serai"
      },
      {
        "name": "Bahau",
        "center": [
          2.8079,
          102.4049
        ],
        "label": "Bahau"
      },
      {
        "name": "Bakri",
        "center": [
          2.0441,
          102.6527
        ],
        "label": "Bakri"
      },
      {
        "name": "Bandar Labuan",
        "center": [
          5.28883,
          115.26924
        ],
        "label": "Bandar Labuan"
      },
      {
        "name": "Banting",
        "center": [
          2.8136,
          101.50185
        ],
        "label": "Banting"
      },
      {
        "name": "Batang Berjuntai",
        "center": [
          3.38333,
          101.41667
        ],
        "label": "Batang Berjuntai"
      },
      {
        "name": "Batu Arang",
        "center": [
          3.31667,
          101.46667
        ],
        "label": "Batu Arang"
      },
      {
        "name": "Batu Berendam",
        "center": [
          2.2487,
          102.246
        ],
        "label": "Batu Berendam"
      },
      {
        "name": "Batu Feringgi",
        "center": [
          5.4709,
          100.24529
        ],
        "label": "Batu Feringgi"
      },
      {
        "name": "Batu Gajah",
        "center": [
          4.46916,
          101.04107
        ],
        "label": "Batu Gajah"
      },
      {
        "name": "Batu Pahat",
        "center": [
          1.8548,
          102.9325
        ],
        "label": "Batu Pahat"
      },
      {
        "name": "Beaufort",
        "center": [
          5.3473,
          115.7455
        ],
        "label": "Beaufort"
      },
      {
        "name": "Bedong",
        "center": [
          5.72743,
          100.50876
        ],
        "label": "Bedong"
      },
      {
        "name": "Bemban",
        "center": [
          2.2684,
          102.3746
        ],
        "label": "Bemban"
      },
      {
        "name": "Bentong Town",
        "center": [
          3.52229,
          101.90866
        ],
        "label": "Bentong Town"
      }
    ]
  },
  {
    "code": "MV",
    "name": "Maldives",
    "cities": [
      {
        "name": "Dhidhdhoo",
        "center": [
          6.88744,
          73.11402
        ],
        "label": "Dhidhdhoo"
      },
      {
        "name": "Felidhoo",
        "center": [
          3.47182,
          73.54699
        ],
        "label": "Felidhoo"
      },
      {
        "name": "Fonadhoo",
        "center": [
          1.83243,
          73.50257
        ],
        "label": "Fonadhoo"
      },
      {
        "name": "Funadhoo",
        "center": [
          6.15091,
          73.29013
        ],
        "label": "Funadhoo"
      },
      {
        "name": "Fuvahmulah",
        "center": [
          -0.29878,
          73.42403
        ],
        "label": "Fuvahmulah"
      },
      {
        "name": "Guraidhoo",
        "center": [
          3.90045,
          73.46623
        ],
        "label": "Guraidhoo"
      },
      {
        "name": "Hithadhoo",
        "center": [
          -0.6,
          73.08333
        ],
        "label": "Hithadhoo"
      },
      {
        "name": "Hulhumale",
        "center": [
          4.21169,
          73.54008
        ],
        "label": "Hulhumale"
      },
      {
        "name": "Kudahuvadhoo",
        "center": [
          2.67075,
          72.89437
        ],
        "label": "Kudahuvadhoo"
      },
      {
        "name": "Kulhudhuffushi",
        "center": [
          6.62207,
          73.06998
        ],
        "label": "Kulhudhuffushi"
      },
      {
        "name": "Maafushi",
        "center": [
          3.94231,
          73.4907
        ],
        "label": "Maafushi"
      },
      {
        "name": "Mahibadhoo",
        "center": [
          3.75713,
          72.96893
        ],
        "label": "Mahibadhoo"
      },
      {
        "name": "Male",
        "center": [
          4.17521,
          73.50916
        ],
        "label": "Male"
      },
      {
        "name": "Manadhoo",
        "center": [
          5.76687,
          73.4136
        ],
        "label": "Manadhoo"
      },
      {
        "name": "Meedhoo",
        "center": [
          -0.58333,
          73.23333
        ],
        "label": "Meedhoo"
      },
      {
        "name": "Muli",
        "center": [
          2.91667,
          73.56667
        ],
        "label": "Muli"
      },
      {
        "name": "Naifaru",
        "center": [
          5.44438,
          73.36571
        ],
        "label": "Naifaru"
      },
      {
        "name": "Thinadhoo",
        "center": [
          0.5306,
          72.99969
        ],
        "label": "Thinadhoo"
      },
      {
        "name": "Ugoofaaru",
        "center": [
          5.66812,
          73.03017
        ],
        "label": "Ugoofaaru"
      },
      {
        "name": "Veymandoo",
        "center": [
          2.18772,
          73.09556
        ],
        "label": "Veymandoo"
      }
    ]
  },
  {
    "code": "ML",
    "name": "Mali",
    "cities": [
      {
        "name": "Abeïbara",
        "center": [
          19.11667,
          1.75
        ],
        "label": "Abeïbara"
      },
      {
        "name": "Ansongo",
        "center": [
          15.6597,
          0.5022
        ],
        "label": "Ansongo"
      },
      {
        "name": "Araouane",
        "center": [
          18.90476,
          -3.52649
        ],
        "label": "Araouane"
      },
      {
        "name": "Bafoulabé",
        "center": [
          13.8065,
          -10.8321
        ],
        "label": "Bafoulabé"
      },
      {
        "name": "Bamako",
        "center": [
          12.65,
          -8
        ],
        "label": "Bamako"
      },
      {
        "name": "Banamba",
        "center": [
          13.54773,
          -7.44808
        ],
        "label": "Banamba"
      },
      {
        "name": "Bandiagara",
        "center": [
          14.35005,
          -3.61038
        ],
        "label": "Bandiagara"
      },
      {
        "name": "Baroueli",
        "center": [
          13.07489,
          -6.57171
        ],
        "label": "Baroueli"
      },
      {
        "name": "Bougouni",
        "center": [
          11.41769,
          -7.48323
        ],
        "label": "Bougouni"
      },
      {
        "name": "Cercle de Bourem",
        "center": [
          17.71192,
          -0.34284
        ],
        "label": "Cercle de Bourem"
      },
      {
        "name": "Cercle de Goundam",
        "center": [
          18.60035,
          -4.99306
        ],
        "label": "Cercle de Goundam"
      },
      {
        "name": "Cercle de San",
        "center": [
          13.17895,
          -5.01617
        ],
        "label": "Cercle de San"
      },
      {
        "name": "Cercle d’Abeïbara",
        "center": [
          19.48878,
          2.20025
        ],
        "label": "Cercle d’Abeïbara"
      },
      {
        "name": "Dire",
        "center": [
          16.28017,
          -3.31302
        ],
        "label": "Dire"
      },
      {
        "name": "Djénné",
        "center": [
          13.90608,
          -4.55332
        ],
        "label": "Djénné"
      },
      {
        "name": "Douentza",
        "center": [
          15.00155,
          -2.94978
        ],
        "label": "Douentza"
      },
      {
        "name": "Douentza Cercle",
        "center": [
          15.06947,
          -2.40875
        ],
        "label": "Douentza Cercle"
      },
      {
        "name": "Gao",
        "center": [
          16.27167,
          -0.04472
        ],
        "label": "Gao"
      },
      {
        "name": "Gao Cercle",
        "center": [
          16.72237,
          0.43984
        ],
        "label": "Gao Cercle"
      },
      {
        "name": "Goundam",
        "center": [
          16.41453,
          -3.67075
        ],
        "label": "Goundam"
      }
    ]
  },
  {
    "code": "MT",
    "name": "Malta",
    "cities": [
      {
        "name": "Attard",
        "center": [
          35.88972,
          14.4425
        ],
        "label": "Attard"
      },
      {
        "name": "Balzan",
        "center": [
          35.90028,
          14.455
        ],
        "label": "Balzan"
      },
      {
        "name": "Birkirkara",
        "center": [
          35.89722,
          14.46111
        ],
        "label": "Birkirkara"
      },
      {
        "name": "Birżebbuġa",
        "center": [
          35.82583,
          14.52694
        ],
        "label": "Birżebbuġa"
      },
      {
        "name": "Cospicua",
        "center": [
          35.88556,
          14.5275
        ],
        "label": "Cospicua"
      },
      {
        "name": "Dingli",
        "center": [
          35.86139,
          14.38222
        ],
        "label": "Dingli"
      },
      {
        "name": "Fgura",
        "center": [
          35.87028,
          14.51333
        ],
        "label": "Fgura"
      },
      {
        "name": "Floriana",
        "center": [
          35.89583,
          14.50833
        ],
        "label": "Floriana"
      },
      {
        "name": "Fontana",
        "center": [
          36.0375,
          14.23611
        ],
        "label": "Fontana"
      },
      {
        "name": "Gudja",
        "center": [
          35.84917,
          14.50306
        ],
        "label": "Gudja"
      },
      {
        "name": "Għajnsielem",
        "center": [
          36.02639,
          14.285
        ],
        "label": "Għajnsielem"
      },
      {
        "name": "Għarb",
        "center": [
          36.06,
          14.20889
        ],
        "label": "Għarb"
      },
      {
        "name": "Għaxaq",
        "center": [
          35.84889,
          14.51667
        ],
        "label": "Għaxaq"
      },
      {
        "name": "Gżira",
        "center": [
          35.90583,
          14.48806
        ],
        "label": "Gżira"
      },
      {
        "name": "Hal Gharghur",
        "center": [
          35.92409,
          14.45118
        ],
        "label": "Hal Gharghur"
      },
      {
        "name": "Haz-Zebbug",
        "center": [
          35.87194,
          14.44111
        ],
        "label": "Haz-Zebbug"
      },
      {
        "name": "Imdina",
        "center": [
          35.88694,
          14.4025
        ],
        "label": "Imdina"
      },
      {
        "name": "Imsida",
        "center": [
          35.8925,
          14.48278
        ],
        "label": "Imsida"
      },
      {
        "name": "Imtarfa",
        "center": [
          35.89333,
          14.39889
        ],
        "label": "Imtarfa"
      },
      {
        "name": "Imġarr",
        "center": [
          35.92056,
          14.36639
        ],
        "label": "Imġarr"
      }
    ]
  },
  {
    "code": "IM",
    "name": "Man (Isle of)",
    "cities": [
      {
        "name": "Douglas",
        "center": [
          54.15,
          -4.4833
        ],
        "label": "Douglas"
      }
    ]
  },
  {
    "code": "MH",
    "name": "Marshall Islands",
    "cities": [
      {
        "name": "Marshall Islands City",
        "center": [
          9,
          168
        ],
        "label": "Marshall Islands (Capital / Main)"
      }
    ]
  },
  {
    "code": "MQ",
    "name": "Martinique",
    "cities": [
      {
        "name": "Martinique City",
        "center": [
          14.666667,
          -61
        ],
        "label": "Martinique (Capital / Main)"
      }
    ]
  },
  {
    "code": "MR",
    "name": "Mauritania",
    "cities": [
      {
        "name": "Aioun",
        "center": [
          16.6614,
          -9.6149
        ],
        "label": "Aioun"
      },
      {
        "name": "Akjoujt",
        "center": [
          19.74657,
          -14.38531
        ],
        "label": "Akjoujt"
      },
      {
        "name": "Aleg",
        "center": [
          17.05314,
          -13.91312
        ],
        "label": "Aleg"
      },
      {
        "name": "Atar",
        "center": [
          20.5177,
          -13.04857
        ],
        "label": "Atar"
      },
      {
        "name": "Barkéwol",
        "center": [
          16.64039,
          -12.49849
        ],
        "label": "Barkéwol"
      },
      {
        "name": "Chingueṭṭi",
        "center": [
          20.463,
          -12.362
        ],
        "label": "Chingueṭṭi"
      },
      {
        "name": "Kaédi",
        "center": [
          16.15027,
          -13.5037
        ],
        "label": "Kaédi"
      },
      {
        "name": "Kiffa",
        "center": [
          16.62073,
          -11.40208
        ],
        "label": "Kiffa"
      },
      {
        "name": "Nouadhibou",
        "center": [
          20.94188,
          -17.03842
        ],
        "label": "Nouadhibou"
      },
      {
        "name": "Néma",
        "center": [
          16.61702,
          -7.25649
        ],
        "label": "Néma"
      },
      {
        "name": "Rosso",
        "center": [
          16.51378,
          -15.80503
        ],
        "label": "Rosso"
      },
      {
        "name": "Sélibaby",
        "center": [
          15.15846,
          -12.1843
        ],
        "label": "Sélibaby"
      },
      {
        "name": "Tékane",
        "center": [
          16.60175,
          -15.34866
        ],
        "label": "Tékane"
      },
      {
        "name": "Zouerate",
        "center": [
          22.73542,
          -12.47134
        ],
        "label": "Zouerate"
      },
      {
        "name": "’Elb el Jmel",
        "center": [
          17.0105,
          -13.97102
        ],
        "label": "’Elb el Jmel"
      }
    ]
  },
  {
    "code": "MU",
    "name": "Mauritius",
    "cities": [
      {
        "name": "Albion",
        "center": [
          -20.20814,
          57.40766
        ],
        "label": "Albion"
      },
      {
        "name": "Amaury",
        "center": [
          -20.13083,
          57.65917
        ],
        "label": "Amaury"
      },
      {
        "name": "Arsenal",
        "center": [
          -20.10556,
          57.53528
        ],
        "label": "Arsenal"
      },
      {
        "name": "Baie aux Huîtres",
        "center": [
          -19.69444,
          63.40833
        ],
        "label": "Baie aux Huîtres"
      },
      {
        "name": "Bambous",
        "center": [
          -20.25667,
          57.40611
        ],
        "label": "Bambous"
      },
      {
        "name": "Bambous Virieux",
        "center": [
          -20.34278,
          57.7575
        ],
        "label": "Bambous Virieux"
      },
      {
        "name": "Beau Bassin-Rose Hill",
        "center": [
          -20.23325,
          57.46609
        ],
        "label": "Beau Bassin-Rose Hill"
      },
      {
        "name": "Beau Vallon",
        "center": [
          -20.41889,
          57.69528
        ],
        "label": "Beau Vallon"
      },
      {
        "name": "Bel Air Rivière Sèche",
        "center": [
          -20.25777,
          57.74976
        ],
        "label": "Bel Air Rivière Sèche"
      },
      {
        "name": "Bois des Amourettes",
        "center": [
          -20.36306,
          57.73111
        ],
        "label": "Bois des Amourettes"
      },
      {
        "name": "Bon Accueil",
        "center": [
          -20.17083,
          57.65639
        ],
        "label": "Bon Accueil"
      },
      {
        "name": "Brisée Verdière",
        "center": [
          -20.16389,
          57.64667
        ],
        "label": "Brisée Verdière"
      },
      {
        "name": "Calebasses",
        "center": [
          -20.11167,
          57.55389
        ],
        "label": "Calebasses"
      },
      {
        "name": "Camp Diable",
        "center": [
          -20.46278,
          57.57889
        ],
        "label": "Camp Diable"
      },
      {
        "name": "Camp Ithier",
        "center": [
          -20.21583,
          57.74556
        ],
        "label": "Camp Ithier"
      },
      {
        "name": "Camp Thorel",
        "center": [
          -20.21472,
          57.61611
        ],
        "label": "Camp Thorel"
      },
      {
        "name": "Camp de Masque",
        "center": [
          -20.23694,
          57.66333
        ],
        "label": "Camp de Masque"
      },
      {
        "name": "Cap Malheureux",
        "center": [
          -19.98417,
          57.61417
        ],
        "label": "Cap Malheureux"
      },
      {
        "name": "Cargados Carajos",
        "center": [
          -16.60329,
          59.65851
        ],
        "label": "Cargados Carajos"
      },
      {
        "name": "Cascavelle",
        "center": [
          -20.28694,
          57.40722
        ],
        "label": "Cascavelle"
      }
    ]
  },
  {
    "code": "YT",
    "name": "Mayotte",
    "cities": [
      {
        "name": "Mayotte City",
        "center": [
          -12.83333333,
          45.16666666
        ],
        "label": "Mayotte (Capital / Main)"
      }
    ]
  },
  {
    "code": "MX",
    "name": "Mexico",
    "cities": [
      {
        "name": "10 de Abril",
        "center": [
          16.82917,
          -99.74083
        ],
        "label": "10 de Abril"
      },
      {
        "name": "18 de Marzo",
        "center": [
          18.96889,
          -98.16028
        ],
        "label": "18 de Marzo"
      },
      {
        "name": "1ra. Sección de Izapa",
        "center": [
          14.92083,
          -92.17083
        ],
        "label": "1ra. Sección de Izapa"
      },
      {
        "name": "2da. Sección de Medio Monte",
        "center": [
          14.88194,
          -92.18444
        ],
        "label": "2da. Sección de Medio Monte"
      },
      {
        "name": "31 de Octubre",
        "center": [
          27.29583,
          -110.0375
        ],
        "label": "31 de Octubre"
      },
      {
        "name": "Abala",
        "center": [
          20.64745,
          -89.68094
        ],
        "label": "Abala"
      },
      {
        "name": "Abasolo",
        "center": [
          16.8214,
          -92.21611
        ],
        "label": "Abasolo"
      },
      {
        "name": "Abasolo del Valle",
        "center": [
          17.78306,
          -95.54556
        ],
        "label": "Abasolo del Valle"
      },
      {
        "name": "Abdenago C. García",
        "center": [
          29.98937,
          -107.5521
        ],
        "label": "Abdenago C. García"
      },
      {
        "name": "Abelardo L. Rodríguez",
        "center": [
          18.72842,
          -90.90456
        ],
        "label": "Abelardo L. Rodríguez"
      },
      {
        "name": "Abrevadero",
        "center": [
          18.28222,
          -95.21444
        ],
        "label": "Abrevadero"
      },
      {
        "name": "Acachapan y Colmena 3ra. Sección",
        "center": [
          18.04858,
          -92.7775
        ],
        "label": "Acachapan y Colmena 3ra. Sección"
      },
      {
        "name": "Acachuén",
        "center": [
          19.84715,
          -102.09272
        ],
        "label": "Acachuén"
      },
      {
        "name": "Acacoyagua",
        "center": [
          15.41414,
          -92.68169
        ],
        "label": "Acacoyagua"
      },
      {
        "name": "Acahuasco",
        "center": [
          20.96254,
          -98.59656
        ],
        "label": "Acahuasco"
      },
      {
        "name": "Acahuizotla",
        "center": [
          17.36054,
          -99.46759
        ],
        "label": "Acahuizotla"
      },
      {
        "name": "Acajete",
        "center": [
          19.11154,
          -97.95231
        ],
        "label": "Acajete"
      },
      {
        "name": "Acala",
        "center": [
          16.55625,
          -92.80449
        ],
        "label": "Acala"
      },
      {
        "name": "Acalco",
        "center": [
          17.50575,
          -99.1667
        ],
        "label": "Acalco"
      },
      {
        "name": "Acalpican de Morelos",
        "center": [
          18.01854,
          -102.34033
        ],
        "label": "Acalpican de Morelos"
      }
    ]
  },
  {
    "code": "FM",
    "name": "Micronesia",
    "cities": [
      {
        "name": "Colonia",
        "center": [
          9.51638,
          138.12167
        ],
        "label": "Colonia"
      },
      {
        "name": "Dalipebinaw Municipality",
        "center": [
          9.52229,
          138.0854
        ],
        "label": "Dalipebinaw Municipality"
      },
      {
        "name": "Eot Municipality",
        "center": [
          7.3854,
          151.7392
        ],
        "label": "Eot Municipality"
      },
      {
        "name": "Ettal Municipality",
        "center": [
          5.592,
          153.56
        ],
        "label": "Ettal Municipality"
      },
      {
        "name": "Fais",
        "center": [
          9.766,
          140.52
        ],
        "label": "Fais"
      },
      {
        "name": "Fais Municipality",
        "center": [
          9.766,
          140.519
        ],
        "label": "Fais Municipality"
      },
      {
        "name": "Fananu Municipality",
        "center": [
          8.55811,
          151.90822
        ],
        "label": "Fananu Municipality"
      },
      {
        "name": "Fanapanges Municipality",
        "center": [
          7.353,
          151.6676
        ],
        "label": "Fanapanges Municipality"
      },
      {
        "name": "Fanif Municipality",
        "center": [
          9.56056,
          138.11333
        ],
        "label": "Fanif Municipality"
      },
      {
        "name": "Faraulep Municipality",
        "center": [
          8.588,
          144.5065
        ],
        "label": "Faraulep Municipality"
      },
      {
        "name": "Fefen Municipality",
        "center": [
          7.353,
          151.831
        ],
        "label": "Fefen Municipality"
      },
      {
        "name": "Fonoton Municipality",
        "center": [
          7.486,
          151.8794
        ],
        "label": "Fonoton Municipality"
      },
      {
        "name": "Gagil Municipality",
        "center": [
          9.54722,
          138.19028
        ],
        "label": "Gagil Municipality"
      },
      {
        "name": "Gilman Municipality",
        "center": [
          9.44611,
          138.06389
        ],
        "label": "Gilman Municipality"
      },
      {
        "name": "Houk Municipality",
        "center": [
          6.683,
          149.3
        ],
        "label": "Houk Municipality"
      },
      {
        "name": "Kanifay Municipality",
        "center": [
          9.46735,
          138.05935
        ],
        "label": "Kanifay Municipality"
      },
      {
        "name": "Kitti Municipality",
        "center": [
          6.8249,
          158.16081
        ],
        "label": "Kitti Municipality"
      },
      {
        "name": "Kolonia",
        "center": [
          6.964,
          158.2062
        ],
        "label": "Kolonia"
      },
      {
        "name": "Kolonia Municipality",
        "center": [
          6.964,
          158.2058
        ],
        "label": "Kolonia Municipality"
      },
      {
        "name": "Kolonia Town",
        "center": [
          6.964,
          158.206
        ],
        "label": "Kolonia Town"
      }
    ]
  },
  {
    "code": "MD",
    "name": "Moldova",
    "cities": [
      {
        "name": "Anenii Noi",
        "center": [
          46.87839,
          29.23483
        ],
        "label": "Anenii Noi"
      },
      {
        "name": "Basarabeasca",
        "center": [
          46.3317,
          28.96365
        ],
        "label": "Basarabeasca"
      },
      {
        "name": "Bender",
        "center": [
          46.83156,
          29.47769
        ],
        "label": "Bender"
      },
      {
        "name": "Bilicenii Vechi",
        "center": [
          47.6558,
          28.04734
        ],
        "label": "Bilicenii Vechi"
      },
      {
        "name": "Biruinţa",
        "center": [
          47.81353,
          28.07004
        ],
        "label": "Biruinţa"
      },
      {
        "name": "Briceni",
        "center": [
          48.36289,
          27.07787
        ],
        "label": "Briceni"
      },
      {
        "name": "Bucovăţ",
        "center": [
          47.19064,
          28.45802
        ],
        "label": "Bucovăţ"
      },
      {
        "name": "Bugeac",
        "center": [
          46.36554,
          28.6625
        ],
        "label": "Bugeac"
      },
      {
        "name": "Bălţi",
        "center": [
          47.76314,
          27.92932
        ],
        "label": "Bălţi"
      },
      {
        "name": "Cahul",
        "center": [
          45.90425,
          28.19929
        ],
        "label": "Cahul"
      },
      {
        "name": "Camenca",
        "center": [
          48.03233,
          28.69899
        ],
        "label": "Camenca"
      },
      {
        "name": "Cantemir",
        "center": [
          46.27743,
          28.2027
        ],
        "label": "Cantemir"
      },
      {
        "name": "Ceadîr-Lunga",
        "center": [
          46.06169,
          28.83078
        ],
        "label": "Ceadîr-Lunga"
      },
      {
        "name": "Chisinau",
        "center": [
          47.00556,
          28.8575
        ],
        "label": "Chisinau"
      },
      {
        "name": "Chiţcani",
        "center": [
          46.78296,
          29.61682
        ],
        "label": "Chiţcani"
      },
      {
        "name": "Cimişlia",
        "center": [
          46.52685,
          28.76441
        ],
        "label": "Cimişlia"
      },
      {
        "name": "Ciorescu",
        "center": [
          47.13,
          28.88937
        ],
        "label": "Ciorescu"
      },
      {
        "name": "Cocieri",
        "center": [
          47.3017,
          29.11755
        ],
        "label": "Cocieri"
      },
      {
        "name": "Comrat",
        "center": [
          46.29456,
          28.6565
        ],
        "label": "Comrat"
      },
      {
        "name": "Crasnoe",
        "center": [
          46.64844,
          29.80403
        ],
        "label": "Crasnoe"
      }
    ]
  },
  {
    "code": "MC",
    "name": "Monaco",
    "cities": [
      {
        "name": "Monaco",
        "center": [
          43.7384,
          7.4246
        ],
        "label": "Monaco (Monte Carlo)"
      }
    ]
  },
  {
    "code": "MN",
    "name": "Mongolia",
    "cities": [
      {
        "name": "Altai",
        "center": [
          46.37222,
          96.25833
        ],
        "label": "Altai"
      },
      {
        "name": "Altay",
        "center": [
          48.29359,
          89.51488
        ],
        "label": "Altay"
      },
      {
        "name": "Arvayheer",
        "center": [
          46.26389,
          102.775
        ],
        "label": "Arvayheer"
      },
      {
        "name": "Baruun-Urt",
        "center": [
          46.68056,
          113.27917
        ],
        "label": "Baruun-Urt"
      },
      {
        "name": "Bayanhongor",
        "center": [
          46.19444,
          100.71806
        ],
        "label": "Bayanhongor"
      },
      {
        "name": "Bulgan",
        "center": [
          48.8125,
          103.53472
        ],
        "label": "Bulgan"
      },
      {
        "name": "Choibalsan",
        "center": [
          48.07257,
          114.53264
        ],
        "label": "Choibalsan"
      },
      {
        "name": "Choyr",
        "center": [
          46.36111,
          108.36111
        ],
        "label": "Choyr"
      },
      {
        "name": "Dalandzadgad",
        "center": [
          43.57083,
          104.425
        ],
        "label": "Dalandzadgad"
      },
      {
        "name": "Darhan",
        "center": [
          49.48667,
          105.92278
        ],
        "label": "Darhan"
      },
      {
        "name": "Dzuunmod",
        "center": [
          47.70694,
          106.95278
        ],
        "label": "Dzuunmod"
      },
      {
        "name": "Dzüünharaa",
        "center": [
          48.85229,
          106.45786
        ],
        "label": "Dzüünharaa"
      },
      {
        "name": "Erdenet",
        "center": [
          49.03333,
          104.08333
        ],
        "label": "Erdenet"
      },
      {
        "name": "Ereencav",
        "center": [
          49.8807,
          115.72526
        ],
        "label": "Ereencav"
      },
      {
        "name": "Hanh",
        "center": [
          51.50265,
          100.66395
        ],
        "label": "Hanh"
      },
      {
        "name": "Hanhongor",
        "center": [
          43.77345,
          104.47998
        ],
        "label": "Hanhongor"
      },
      {
        "name": "Harhorin",
        "center": [
          47.19753,
          102.82379
        ],
        "label": "Harhorin"
      },
      {
        "name": "Hovd",
        "center": [
          44.67024,
          102.17491
        ],
        "label": "Hovd"
      },
      {
        "name": "Kharkhorin",
        "center": [
          47.19245,
          102.81349
        ],
        "label": "Kharkhorin"
      },
      {
        "name": "Khovd",
        "center": [
          48.00556,
          91.64194
        ],
        "label": "Khovd"
      }
    ]
  },
  {
    "code": "ME",
    "name": "Montenegro",
    "cities": [
      {
        "name": "Andrijevica",
        "center": [
          42.73389,
          19.79194
        ],
        "label": "Andrijevica"
      },
      {
        "name": "Bar",
        "center": [
          42.09306,
          19.10028
        ],
        "label": "Bar"
      },
      {
        "name": "Berane",
        "center": [
          42.8425,
          19.87333
        ],
        "label": "Berane"
      },
      {
        "name": "Bijelo Polje",
        "center": [
          43.03834,
          19.74758
        ],
        "label": "Bijelo Polje"
      },
      {
        "name": "Budva",
        "center": [
          42.28639,
          18.84
        ],
        "label": "Budva"
      },
      {
        "name": "Cetinje",
        "center": [
          42.39063,
          18.91417
        ],
        "label": "Cetinje"
      },
      {
        "name": "Danilovgrad",
        "center": [
          42.55384,
          19.14608
        ],
        "label": "Danilovgrad"
      },
      {
        "name": "Dobrota",
        "center": [
          42.45417,
          18.76833
        ],
        "label": "Dobrota"
      },
      {
        "name": "Golubovci",
        "center": [
          42.335,
          19.23111
        ],
        "label": "Golubovci"
      },
      {
        "name": "Goričani",
        "center": [
          42.33222,
          19.21194
        ],
        "label": "Goričani"
      },
      {
        "name": "Gusinje",
        "center": [
          42.56194,
          19.83389
        ],
        "label": "Gusinje"
      },
      {
        "name": "Kolašin",
        "center": [
          42.82229,
          19.51653
        ],
        "label": "Kolašin"
      },
      {
        "name": "Kotor",
        "center": [
          42.42067,
          18.76825
        ],
        "label": "Kotor"
      },
      {
        "name": "Mataguži",
        "center": [
          42.32361,
          19.27278
        ],
        "label": "Mataguži"
      },
      {
        "name": "Mojanovići",
        "center": [
          42.34167,
          19.22139
        ],
        "label": "Mojanovići"
      },
      {
        "name": "Mojkovac",
        "center": [
          42.96044,
          19.5833
        ],
        "label": "Mojkovac"
      },
      {
        "name": "Nikšić",
        "center": [
          42.7731,
          18.94446
        ],
        "label": "Nikšić"
      },
      {
        "name": "Petrovac na Moru",
        "center": [
          42.20556,
          18.9425
        ],
        "label": "Petrovac na Moru"
      },
      {
        "name": "Plav",
        "center": [
          42.59694,
          19.94556
        ],
        "label": "Plav"
      },
      {
        "name": "Pljevlja",
        "center": [
          43.3567,
          19.35843
        ],
        "label": "Pljevlja"
      }
    ]
  },
  {
    "code": "MS",
    "name": "Montserrat",
    "cities": [
      {
        "name": "Montserrat City",
        "center": [
          16.75,
          -62.2
        ],
        "label": "Montserrat (Capital / Main)"
      }
    ]
  },
  {
    "code": "MA",
    "name": "Morocco",
    "cities": [
      {
        "name": "Abadou",
        "center": [
          31.57917,
          -7.31308
        ],
        "label": "Abadou"
      },
      {
        "name": "Adassil",
        "center": [
          31.10783,
          -8.49083
        ],
        "label": "Adassil"
      },
      {
        "name": "Agadir",
        "center": [
          30.42018,
          -9.59815
        ],
        "label": "Agadir"
      },
      {
        "name": "Agadir Melloul",
        "center": [
          30.22492,
          -7.79601
        ],
        "label": "Agadir Melloul"
      },
      {
        "name": "Agadir-Ida-ou-Tnan",
        "center": [
          30.58333,
          -9.5
        ],
        "label": "Agadir-Ida-ou-Tnan"
      },
      {
        "name": "Agdz",
        "center": [
          30.69356,
          -6.44628
        ],
        "label": "Agdz"
      },
      {
        "name": "Aguelmous",
        "center": [
          33.16139,
          -5.84626
        ],
        "label": "Aguelmous"
      },
      {
        "name": "Ahfir",
        "center": [
          34.95368,
          -2.10027
        ],
        "label": "Ahfir"
      },
      {
        "name": "Akhfennir",
        "center": [
          28.09455,
          -12.05157
        ],
        "label": "Akhfennir"
      },
      {
        "name": "Aknoul",
        "center": [
          34.65371,
          -3.86754
        ],
        "label": "Aknoul"
      },
      {
        "name": "Al Aaroui",
        "center": [
          35.0109,
          -3.00938
        ],
        "label": "Al Aaroui"
      },
      {
        "name": "Al Fqih Ben Çalah",
        "center": [
          32.50213,
          -6.68771
        ],
        "label": "Al Fqih Ben Çalah"
      },
      {
        "name": "Al Hoceïma",
        "center": [
          35.25165,
          -3.93723
        ],
        "label": "Al Hoceïma"
      },
      {
        "name": "Al-Haouz",
        "center": [
          31.34083,
          -7.91076
        ],
        "label": "Al-Haouz"
      },
      {
        "name": "Al-Hoceima",
        "center": [
          35,
          -4.25
        ],
        "label": "Al-Hoceima"
      },
      {
        "name": "Almis Marmoucha",
        "center": [
          33.32,
          -4.18
        ],
        "label": "Almis Marmoucha"
      },
      {
        "name": "Alnif",
        "center": [
          31.11411,
          -5.17154
        ],
        "label": "Alnif"
      },
      {
        "name": "Aoufous",
        "center": [
          31.68,
          -4.17
        ],
        "label": "Aoufous"
      },
      {
        "name": "Aoulouz",
        "center": [
          30.67307,
          -8.18087
        ],
        "label": "Aoulouz"
      },
      {
        "name": "Aourir",
        "center": [
          30.49238,
          -9.6355
        ],
        "label": "Aourir"
      }
    ]
  },
  {
    "code": "MZ",
    "name": "Mozambique",
    "cities": [
      {
        "name": "Alto Molócuè",
        "center": [
          -15.64932,
          37.66384
        ],
        "label": "Alto Molócuè"
      },
      {
        "name": "António Enes",
        "center": [
          -16.2325,
          39.90861
        ],
        "label": "António Enes"
      },
      {
        "name": "Beira",
        "center": [
          -19.84361,
          34.83889
        ],
        "label": "Beira"
      },
      {
        "name": "Boane District",
        "center": [
          -26.029,
          32.389
        ],
        "label": "Boane District"
      },
      {
        "name": "Chibuto",
        "center": [
          -24.68667,
          33.53056
        ],
        "label": "Chibuto"
      },
      {
        "name": "Chimoio",
        "center": [
          -19.11639,
          33.48333
        ],
        "label": "Chimoio"
      },
      {
        "name": "Chinde",
        "center": [
          -18.58111,
          36.45861
        ],
        "label": "Chinde"
      },
      {
        "name": "Chiure",
        "center": [
          -13.46665,
          39.70317
        ],
        "label": "Chiure"
      },
      {
        "name": "Chokwé",
        "center": [
          -24.53333,
          32.98333
        ],
        "label": "Chokwé"
      },
      {
        "name": "Concelho de Matola",
        "center": [
          -25.83472,
          32.49516
        ],
        "label": "Concelho de Matola"
      },
      {
        "name": "Cuamba",
        "center": [
          -14.80306,
          36.53722
        ],
        "label": "Cuamba"
      },
      {
        "name": "Dondo",
        "center": [
          -19.60944,
          34.74306
        ],
        "label": "Dondo"
      },
      {
        "name": "Ilha de Moçambique",
        "center": [
          -15.03417,
          40.73583
        ],
        "label": "Ilha de Moçambique"
      },
      {
        "name": "Inhambane",
        "center": [
          -23.865,
          35.38333
        ],
        "label": "Inhambane"
      },
      {
        "name": "KaTembe",
        "center": [
          -26.02985,
          32.53204
        ],
        "label": "KaTembe"
      },
      {
        "name": "Lichinga",
        "center": [
          -13.31278,
          35.24056
        ],
        "label": "Lichinga"
      },
      {
        "name": "Macia",
        "center": [
          -25.02694,
          33.09889
        ],
        "label": "Macia"
      },
      {
        "name": "Magude District",
        "center": [
          -25.02389,
          32.6515
        ],
        "label": "Magude District"
      },
      {
        "name": "Mandimba",
        "center": [
          -14.3525,
          35.65056
        ],
        "label": "Mandimba"
      },
      {
        "name": "Manhica",
        "center": [
          -25.34035,
          32.84234
        ],
        "label": "Manhica"
      }
    ]
  },
  {
    "code": "MM",
    "name": "Myanmar",
    "cities": [
      {
        "name": "Bago",
        "center": [
          17.33521,
          96.48135
        ],
        "label": "Bago"
      },
      {
        "name": "Bhamo",
        "center": [
          24.25256,
          97.23357
        ],
        "label": "Bhamo"
      },
      {
        "name": "Bogale",
        "center": [
          16.29415,
          95.39742
        ],
        "label": "Bogale"
      },
      {
        "name": "Chauk",
        "center": [
          20.89921,
          94.81784
        ],
        "label": "Chauk"
      },
      {
        "name": "Dawei",
        "center": [
          14.0823,
          98.19151
        ],
        "label": "Dawei"
      },
      {
        "name": "Dellok",
        "center": [
          16.04072,
          97.91773
        ],
        "label": "Dellok"
      },
      {
        "name": "Falam",
        "center": [
          22.91335,
          93.67779
        ],
        "label": "Falam"
      },
      {
        "name": "Hakha",
        "center": [
          22.64452,
          93.61076
        ],
        "label": "Hakha"
      },
      {
        "name": "Hinthada",
        "center": [
          17.64944,
          95.45705
        ],
        "label": "Hinthada"
      },
      {
        "name": "Hpa-An",
        "center": [
          16.88953,
          97.63482
        ],
        "label": "Hpa-An"
      },
      {
        "name": "Kanbe",
        "center": [
          16.70728,
          96.00168
        ],
        "label": "Kanbe"
      },
      {
        "name": "Kawthoung",
        "center": [
          9.98238,
          98.55034
        ],
        "label": "Kawthoung"
      },
      {
        "name": "Kayan",
        "center": [
          16.90802,
          96.56037
        ],
        "label": "Kayan"
      },
      {
        "name": "Klonhtoug",
        "center": [
          15.95411,
          98.4325
        ],
        "label": "Klonhtoug"
      },
      {
        "name": "Kyaikkami",
        "center": [
          16.07686,
          97.56388
        ],
        "label": "Kyaikkami"
      },
      {
        "name": "Kyaiklat",
        "center": [
          16.44502,
          95.72373
        ],
        "label": "Kyaiklat"
      },
      {
        "name": "Kyaikto",
        "center": [
          17.30858,
          97.01124
        ],
        "label": "Kyaikto"
      },
      {
        "name": "Kyain Seikgyi Township",
        "center": [
          15.82288,
          98.25257
        ],
        "label": "Kyain Seikgyi Township"
      },
      {
        "name": "Kyaukse",
        "center": [
          21.6056,
          96.13508
        ],
        "label": "Kyaukse"
      },
      {
        "name": "Lashio",
        "center": [
          22.9359,
          97.7498
        ],
        "label": "Lashio"
      }
    ]
  },
  {
    "code": "NA",
    "name": "Namibia",
    "cities": [
      {
        "name": "Arandis",
        "center": [
          -22.41667,
          14.96667
        ],
        "label": "Arandis"
      },
      {
        "name": "Aranos",
        "center": [
          -24.13333,
          19.11667
        ],
        "label": "Aranos"
      },
      {
        "name": "Bagani",
        "center": [
          -18.11065,
          21.61645
        ],
        "label": "Bagani"
      },
      {
        "name": "Bethanie",
        "center": [
          -26.48333,
          17.15
        ],
        "label": "Bethanie"
      },
      {
        "name": "Epupa Constituency",
        "center": [
          -17.00388,
          13.24825
        ],
        "label": "Epupa Constituency"
      },
      {
        "name": "Gobabis",
        "center": [
          -22.45,
          18.96667
        ],
        "label": "Gobabis"
      },
      {
        "name": "Grootfontein",
        "center": [
          -19.56667,
          18.11667
        ],
        "label": "Grootfontein"
      },
      {
        "name": "Hentiesbaai",
        "center": [
          -22.11667,
          14.28333
        ],
        "label": "Hentiesbaai"
      },
      {
        "name": "Hoachanas",
        "center": [
          -23.91667,
          18.05
        ],
        "label": "Hoachanas"
      },
      {
        "name": "Karasburg",
        "center": [
          -28.01667,
          18.75
        ],
        "label": "Karasburg"
      },
      {
        "name": "Karibib",
        "center": [
          -21.93333,
          15.83333
        ],
        "label": "Karibib"
      },
      {
        "name": "Katima Mulilo",
        "center": [
          -17.5,
          24.26667
        ],
        "label": "Katima Mulilo"
      },
      {
        "name": "Katutura",
        "center": [
          -22.52306,
          17.06028
        ],
        "label": "Katutura"
      },
      {
        "name": "Keetmanshoop",
        "center": [
          -26.58333,
          18.13333
        ],
        "label": "Keetmanshoop"
      },
      {
        "name": "Khorixas",
        "center": [
          -20.36667,
          14.96667
        ],
        "label": "Khorixas"
      },
      {
        "name": "Khorixas Constituency",
        "center": [
          -20.36792,
          14.95996
        ],
        "label": "Khorixas Constituency"
      },
      {
        "name": "Lüderitz",
        "center": [
          -26.64807,
          15.15383
        ],
        "label": "Lüderitz"
      },
      {
        "name": "Maltahöhe",
        "center": [
          -24.83333,
          16.98333
        ],
        "label": "Maltahöhe"
      },
      {
        "name": "Mariental",
        "center": [
          -24.63333,
          17.96667
        ],
        "label": "Mariental"
      },
      {
        "name": "Okahandja",
        "center": [
          -21.98333,
          16.91667
        ],
        "label": "Okahandja"
      }
    ]
  },
  {
    "code": "NR",
    "name": "Nauru",
    "cities": [
      {
        "name": "Anabar",
        "center": [
          -0.50845,
          166.95326
        ],
        "label": "Anabar"
      },
      {
        "name": "Arijejen",
        "center": [
          -0.52545,
          166.91247
        ],
        "label": "Arijejen"
      },
      {
        "name": "Baiti",
        "center": [
          -0.50803,
          166.92945
        ],
        "label": "Baiti"
      },
      {
        "name": "Ijuw",
        "center": [
          -0.521,
          166.95813
        ],
        "label": "Ijuw"
      },
      {
        "name": "Menen",
        "center": [
          -0.54539,
          166.94871
        ],
        "label": "Menen"
      },
      {
        "name": "Uaboe",
        "center": [
          -0.51393,
          166.92384
        ],
        "label": "Uaboe"
      },
      {
        "name": "Yaren",
        "center": [
          -0.55085,
          166.9252
        ],
        "label": "Yaren"
      }
    ]
  },
  {
    "code": "NP",
    "name": "Nepal",
    "cities": [
      {
        "name": "Banepā",
        "center": [
          27.63245,
          85.52192
        ],
        "label": "Banepā"
      },
      {
        "name": "Bhadrapur",
        "center": [
          26.54404,
          88.09436
        ],
        "label": "Bhadrapur"
      },
      {
        "name": "Bharatpur",
        "center": [
          27.6768,
          84.43589
        ],
        "label": "Bharatpur"
      },
      {
        "name": "Bhattarai Danda",
        "center": [
          27.88333,
          83.93333
        ],
        "label": "Bhattarai Danda"
      },
      {
        "name": "Bhojpur",
        "center": [
          27.93565,
          81.77555
        ],
        "label": "Bhojpur"
      },
      {
        "name": "Biratnagar",
        "center": [
          26.45505,
          87.27007
        ],
        "label": "Biratnagar"
      },
      {
        "name": "Birendranagar",
        "center": [
          28.60194,
          81.63389
        ],
        "label": "Birendranagar"
      },
      {
        "name": "Birgañj",
        "center": [
          27.01709,
          84.8808
        ],
        "label": "Birgañj"
      },
      {
        "name": "Butwāl",
        "center": [
          27.70055,
          83.44836
        ],
        "label": "Butwāl"
      },
      {
        "name": "Bāglung",
        "center": [
          28.27189,
          83.58975
        ],
        "label": "Bāglung"
      },
      {
        "name": "Chitre",
        "center": [
          28.42673,
          83.69076
        ],
        "label": "Chitre"
      },
      {
        "name": "Dadeldhurā",
        "center": [
          29.29842,
          80.58059
        ],
        "label": "Dadeldhurā"
      },
      {
        "name": "Dailekh",
        "center": [
          28.84434,
          81.71011
        ],
        "label": "Dailekh"
      },
      {
        "name": "Dhangaḍhi̇̄",
        "center": [
          28.70137,
          80.58975
        ],
        "label": "Dhangaḍhi̇̄"
      },
      {
        "name": "Dhankutā",
        "center": [
          26.98333,
          87.33333
        ],
        "label": "Dhankutā"
      },
      {
        "name": "Dharān",
        "center": [
          26.81436,
          87.27972
        ],
        "label": "Dharān"
      },
      {
        "name": "Dhulikhel",
        "center": [
          27.6221,
          85.54281
        ],
        "label": "Dhulikhel"
      },
      {
        "name": "Dihi",
        "center": [
          27.87552,
          83.92759
        ],
        "label": "Dihi"
      },
      {
        "name": "Dipayal",
        "center": [
          29.26083,
          80.94
        ],
        "label": "Dipayal"
      },
      {
        "name": "Dārchulā",
        "center": [
          29.83,
          80.55
        ],
        "label": "Dārchulā"
      }
    ]
  },
  {
    "code": "NL",
    "name": "Netherlands",
    "cities": [
      {
        "name": "'s Gravenmoer",
        "center": [
          51.65594,
          4.94076
        ],
        "label": "'s Gravenmoer"
      },
      {
        "name": "'s-Gravenland",
        "center": [
          51.92336,
          4.55315
        ],
        "label": "'s-Gravenland"
      },
      {
        "name": "'s-Gravenzande",
        "center": [
          52.00167,
          4.16528
        ],
        "label": "'s-Gravenzande"
      },
      {
        "name": "'s-Heerenberg",
        "center": [
          51.8767,
          6.25877
        ],
        "label": "'s-Heerenberg"
      },
      {
        "name": "'s-Hertogenbosch",
        "center": [
          51.69917,
          5.30417
        ],
        "label": "'s-Hertogenbosch"
      },
      {
        "name": "'t Hofke",
        "center": [
          51.44943,
          5.51926
        ],
        "label": "'t Hofke"
      },
      {
        "name": "'t Zand",
        "center": [
          52.83667,
          4.75556
        ],
        "label": "'t Zand"
      },
      {
        "name": "Aagtekerke",
        "center": [
          51.54667,
          3.50972
        ],
        "label": "Aagtekerke"
      },
      {
        "name": "Aalburg",
        "center": [
          51.75482,
          5.13156
        ],
        "label": "Aalburg"
      },
      {
        "name": "Aalden",
        "center": [
          52.79,
          6.71806
        ],
        "label": "Aalden"
      },
      {
        "name": "Aalsmeer",
        "center": [
          52.25917,
          4.75972
        ],
        "label": "Aalsmeer"
      },
      {
        "name": "Aalst",
        "center": [
          51.7825,
          5.12778
        ],
        "label": "Aalst"
      },
      {
        "name": "Aalten",
        "center": [
          51.925,
          6.58056
        ],
        "label": "Aalten"
      },
      {
        "name": "Aardenburg",
        "center": [
          51.27333,
          3.44722
        ],
        "label": "Aardenburg"
      },
      {
        "name": "Aarle-Rixtel",
        "center": [
          51.50976,
          5.63839
        ],
        "label": "Aarle-Rixtel"
      },
      {
        "name": "Abbekerk",
        "center": [
          52.73167,
          5.01806
        ],
        "label": "Abbekerk"
      },
      {
        "name": "Abcoude",
        "center": [
          52.2725,
          4.96944
        ],
        "label": "Abcoude"
      },
      {
        "name": "Abcoven",
        "center": [
          51.5275,
          5.08333
        ],
        "label": "Abcoven"
      },
      {
        "name": "Abdissenbosch",
        "center": [
          50.91667,
          6.03333
        ],
        "label": "Abdissenbosch"
      },
      {
        "name": "Adegeest",
        "center": [
          52.13621,
          4.45249
        ],
        "label": "Adegeest"
      }
    ]
  },
  {
    "code": "NC",
    "name": "New Caledonia",
    "cities": [
      {
        "name": "Noumea",
        "center": [
          -22.2758,
          166.458
        ],
        "label": "Noumea"
      }
    ]
  },
  {
    "code": "NZ",
    "name": "New Zealand",
    "cities": [
      {
        "name": "Ahipara",
        "center": [
          -35.16667,
          173.16667
        ],
        "label": "Ahipara"
      },
      {
        "name": "Amberley",
        "center": [
          -43.15589,
          172.72975
        ],
        "label": "Amberley"
      },
      {
        "name": "Arrowtown",
        "center": [
          -44.93837,
          168.81007
        ],
        "label": "Arrowtown"
      },
      {
        "name": "Ashburton",
        "center": [
          -43.89834,
          171.73011
        ],
        "label": "Ashburton"
      },
      {
        "name": "Ashburton District",
        "center": [
          -43.9,
          171.75
        ],
        "label": "Ashburton District"
      },
      {
        "name": "Auckland",
        "center": [
          -36.84853,
          174.76349
        ],
        "label": "Auckland"
      },
      {
        "name": "Balclutha",
        "center": [
          -46.23389,
          169.75
        ],
        "label": "Balclutha"
      },
      {
        "name": "Blenheim",
        "center": [
          -41.51603,
          173.9528
        ],
        "label": "Blenheim"
      },
      {
        "name": "Bluff",
        "center": [
          -46.6,
          168.33333
        ],
        "label": "Bluff"
      },
      {
        "name": "Brightwater",
        "center": [
          -41.38333,
          173.11667
        ],
        "label": "Brightwater"
      },
      {
        "name": "Brooklyn",
        "center": [
          -41.30586,
          174.76257
        ],
        "label": "Brooklyn"
      },
      {
        "name": "Bulls",
        "center": [
          -40.17487,
          175.38463
        ],
        "label": "Bulls"
      },
      {
        "name": "Burnham",
        "center": [
          -43.61667,
          172.31667
        ],
        "label": "Burnham"
      },
      {
        "name": "Cambridge",
        "center": [
          -37.87822,
          175.4402
        ],
        "label": "Cambridge"
      },
      {
        "name": "Castlepoint",
        "center": [
          -40.9,
          176.21667
        ],
        "label": "Castlepoint"
      },
      {
        "name": "Christchurch",
        "center": [
          -43.53333,
          172.63333
        ],
        "label": "Christchurch"
      },
      {
        "name": "Christchurch City",
        "center": [
          -43.64578,
          172.74586
        ],
        "label": "Christchurch City"
      },
      {
        "name": "Clutha District",
        "center": [
          -46.03883,
          169.60617
        ],
        "label": "Clutha District"
      },
      {
        "name": "Coromandel",
        "center": [
          -36.7611,
          175.49634
        ],
        "label": "Coromandel"
      },
      {
        "name": "Cromwell",
        "center": [
          -45.03837,
          169.20008
        ],
        "label": "Cromwell"
      }
    ]
  },
  {
    "code": "NI",
    "name": "Nicaragua",
    "cities": [
      {
        "name": "Achuapa",
        "center": [
          13.0537,
          -86.59004
        ],
        "label": "Achuapa"
      },
      {
        "name": "Acoyapa",
        "center": [
          11.97028,
          -85.17113
        ],
        "label": "Acoyapa"
      },
      {
        "name": "Altagracia",
        "center": [
          11.56615,
          -85.5784
        ],
        "label": "Altagracia"
      },
      {
        "name": "Belén",
        "center": [
          11.50299,
          -85.88935
        ],
        "label": "Belén"
      },
      {
        "name": "Bluefields",
        "center": [
          12.01366,
          -83.76353
        ],
        "label": "Bluefields"
      },
      {
        "name": "Boaco",
        "center": [
          12.47224,
          -85.6586
        ],
        "label": "Boaco"
      },
      {
        "name": "Bocana de Paiwas",
        "center": [
          12.78571,
          -85.12269
        ],
        "label": "Bocana de Paiwas"
      },
      {
        "name": "Bonanza",
        "center": [
          14.02885,
          -84.59103
        ],
        "label": "Bonanza"
      },
      {
        "name": "Buenos Aires",
        "center": [
          11.46916,
          -85.81661
        ],
        "label": "Buenos Aires"
      },
      {
        "name": "Camoapa",
        "center": [
          12.38383,
          -85.51277
        ],
        "label": "Camoapa"
      },
      {
        "name": "Catarina",
        "center": [
          11.91197,
          -86.07383
        ],
        "label": "Catarina"
      },
      {
        "name": "Chichigalpa",
        "center": [
          12.57758,
          -87.02705
        ],
        "label": "Chichigalpa"
      },
      {
        "name": "Chinandega",
        "center": [
          12.62937,
          -87.13105
        ],
        "label": "Chinandega"
      },
      {
        "name": "Cinco Pinos",
        "center": [
          13.22956,
          -86.86808
        ],
        "label": "Cinco Pinos"
      },
      {
        "name": "Ciudad Antigua",
        "center": [
          13.6392903,
          -86.3118983
        ],
        "label": "Ciudad Antigua"
      },
      {
        "name": "Ciudad Darío",
        "center": [
          12.73143,
          -86.12402
        ],
        "label": "Ciudad Darío"
      },
      {
        "name": "Ciudad Sandino",
        "center": [
          12.15889,
          -86.34417
        ],
        "label": "Ciudad Sandino"
      },
      {
        "name": "Comalapa",
        "center": [
          12.28345,
          -85.51081
        ],
        "label": "Comalapa"
      },
      {
        "name": "Condega",
        "center": [
          13.36502,
          -86.39846
        ],
        "label": "Condega"
      },
      {
        "name": "Corinto",
        "center": [
          12.4825,
          -87.17304
        ],
        "label": "Corinto"
      }
    ]
  },
  {
    "code": "NE",
    "name": "Niger",
    "cities": [
      {
        "name": "Abalak",
        "center": [
          15.41618,
          6.16975
        ],
        "label": "Abalak"
      },
      {
        "name": "Agadez",
        "center": [
          16.97333,
          7.99111
        ],
        "label": "Agadez"
      },
      {
        "name": "Aguié",
        "center": [
          13.50601,
          7.77863
        ],
        "label": "Aguié"
      },
      {
        "name": "Alaghsas",
        "center": [
          17.0187,
          8.0168
        ],
        "label": "Alaghsas"
      },
      {
        "name": "Arlit",
        "center": [
          18.83409,
          7.43327
        ],
        "label": "Arlit"
      },
      {
        "name": "Ayorou",
        "center": [
          14.73075,
          0.91739
        ],
        "label": "Ayorou"
      },
      {
        "name": "Balleyara",
        "center": [
          13.72848,
          2.87503
        ],
        "label": "Balleyara"
      },
      {
        "name": "Bilma",
        "center": [
          18.68532,
          12.91643
        ],
        "label": "Bilma"
      },
      {
        "name": "Birni N Konni",
        "center": [
          13.79599,
          5.25026
        ],
        "label": "Birni N Konni"
      },
      {
        "name": "Boboye Department",
        "center": [
          13.08167,
          2.91083
        ],
        "label": "Boboye Department"
      },
      {
        "name": "Bouza",
        "center": [
          14.42293,
          6.04278
        ],
        "label": "Bouza"
      },
      {
        "name": "Dakoro",
        "center": [
          14.51056,
          6.765
        ],
        "label": "Dakoro"
      },
      {
        "name": "Diffa",
        "center": [
          13.31536,
          12.61135
        ],
        "label": "Diffa"
      },
      {
        "name": "Dogondoutchi",
        "center": [
          13.6403,
          4.02649
        ],
        "label": "Dogondoutchi"
      },
      {
        "name": "Dosso",
        "center": [
          13.049,
          3.1937
        ],
        "label": "Dosso"
      },
      {
        "name": "Département d' Illéla",
        "center": [
          14.25,
          5
        ],
        "label": "Département d' Illéla"
      },
      {
        "name": "Département de Bilma",
        "center": [
          20.5,
          13.25
        ],
        "label": "Département de Bilma"
      },
      {
        "name": "Département de Birni Nkonni",
        "center": [
          13.9,
          5.25
        ],
        "label": "Département de Birni Nkonni"
      },
      {
        "name": "Département de Bouza",
        "center": [
          14.43333,
          6
        ],
        "label": "Département de Bouza"
      },
      {
        "name": "Département de Dakoro",
        "center": [
          14.75,
          7
        ],
        "label": "Département de Dakoro"
      }
    ]
  },
  {
    "code": "NG",
    "name": "Nigeria",
    "cities": [
      {
        "name": "Aba",
        "center": [
          5.10658,
          7.36667
        ],
        "label": "Aba"
      },
      {
        "name": "Abakaliki",
        "center": [
          6.32485,
          8.11368
        ],
        "label": "Abakaliki"
      },
      {
        "name": "Abalama",
        "center": [
          4.76305556,
          6.84027778
        ],
        "label": "Abalama"
      },
      {
        "name": "Abeokuta",
        "center": [
          7.15571,
          3.34509
        ],
        "label": "Abeokuta"
      },
      {
        "name": "Abocho",
        "center": [
          7.5677,
          6.9863
        ],
        "label": "Abocho"
      },
      {
        "name": "Abonnema",
        "center": [
          4.7231169,
          6.7788461
        ],
        "label": "Abonnema"
      },
      {
        "name": "Abraka",
        "center": [
          5.79023,
          6.10473
        ],
        "label": "Abraka"
      },
      {
        "name": "Abuja",
        "center": [
          9.05785,
          7.49508
        ],
        "label": "Abuja"
      },
      {
        "name": "Adani",
        "center": [
          6.73971,
          7.01117
        ],
        "label": "Adani"
      },
      {
        "name": "Ado Odo",
        "center": [
          6.6,
          2.93333
        ],
        "label": "Ado Odo"
      },
      {
        "name": "Ado-Ekiti",
        "center": [
          7.62329,
          5.22087
        ],
        "label": "Ado-Ekiti"
      },
      {
        "name": "Adoru",
        "center": [
          6.97694,
          7.16262
        ],
        "label": "Adoru"
      },
      {
        "name": "Afikpo",
        "center": [
          5.89258,
          7.93534
        ],
        "label": "Afikpo"
      },
      {
        "name": "Agbabu",
        "center": [
          6.58862,
          4.8343
        ],
        "label": "Agbabu"
      },
      {
        "name": "Agbor",
        "center": [
          6.25375,
          6.1942
        ],
        "label": "Agbor"
      },
      {
        "name": "Agenebode",
        "center": [
          7.10512,
          6.69381
        ],
        "label": "Agenebode"
      },
      {
        "name": "Ago Are",
        "center": [
          8.5,
          3.41667
        ],
        "label": "Ago Are"
      },
      {
        "name": "Agulu",
        "center": [
          6.10045,
          7.061
        ],
        "label": "Agulu"
      },
      {
        "name": "Ahoada",
        "center": [
          5.08333333,
          6.65
        ],
        "label": "Ahoada"
      },
      {
        "name": "Ajasse Ipo",
        "center": [
          8.23333,
          4.81667
        ],
        "label": "Ajasse Ipo"
      }
    ]
  },
  {
    "code": "NU",
    "name": "Niue",
    "cities": [
      {
        "name": "Niue City",
        "center": [
          -19.03333333,
          -169.86666666
        ],
        "label": "Niue (Capital / Main)"
      }
    ]
  },
  {
    "code": "NF",
    "name": "Norfolk Island",
    "cities": [
      {
        "name": "Norfolk Island City",
        "center": [
          -29.03333333,
          167.95
        ],
        "label": "Norfolk Island (Capital / Main)"
      }
    ]
  },
  {
    "code": "KP",
    "name": "North Korea",
    "cities": [
      {
        "name": "Anak",
        "center": [
          38.51083,
          125.49417
        ],
        "label": "Anak"
      },
      {
        "name": "Anbyŏn-ŭp",
        "center": [
          39.0425,
          127.52389
        ],
        "label": "Anbyŏn-ŭp"
      },
      {
        "name": "Anju",
        "center": [
          39.61778,
          125.66472
        ],
        "label": "Anju"
      },
      {
        "name": "Aoji",
        "center": [
          42.52448,
          130.39718
        ],
        "label": "Aoji"
      },
      {
        "name": "Ayang-ni",
        "center": [
          38.24306,
          125.78
        ],
        "label": "Ayang-ni"
      },
      {
        "name": "Chaeryŏng-ŭp",
        "center": [
          38.39917,
          125.61556
        ],
        "label": "Chaeryŏng-ŭp"
      },
      {
        "name": "Changgang-gun",
        "center": [
          41.06333,
          126.72556
        ],
        "label": "Changgang-gun"
      },
      {
        "name": "Changyŏn",
        "center": [
          38.25083,
          125.09611
        ],
        "label": "Changyŏn"
      },
      {
        "name": "Chasŏng",
        "center": [
          41.46083,
          126.64139
        ],
        "label": "Chasŏng"
      },
      {
        "name": "Chongjin",
        "center": [
          41.79556,
          129.77583
        ],
        "label": "Chongjin"
      },
      {
        "name": "Chunghwa",
        "center": [
          38.86389,
          125.8
        ],
        "label": "Chunghwa"
      },
      {
        "name": "Chŏngju",
        "center": [
          39.69333,
          125.21028
        ],
        "label": "Chŏngju"
      },
      {
        "name": "Chŏngju-gun",
        "center": [
          39.70944,
          125.25278
        ],
        "label": "Chŏngju-gun"
      },
      {
        "name": "Haeju",
        "center": [
          38.04056,
          125.71472
        ],
        "label": "Haeju"
      },
      {
        "name": "Hamhŭng",
        "center": [
          39.91833,
          127.53639
        ],
        "label": "Hamhŭng"
      },
      {
        "name": "Hau-ri",
        "center": [
          41.20056,
          129.47028
        ],
        "label": "Hau-ri"
      },
      {
        "name": "Hoemul-li",
        "center": [
          41.43389,
          129.67
        ],
        "label": "Hoemul-li"
      },
      {
        "name": "Hoeryŏng",
        "center": [
          42.44113,
          129.74601
        ],
        "label": "Hoeryŏng"
      },
      {
        "name": "Hoeyang",
        "center": [
          38.71028,
          127.59833
        ],
        "label": "Hoeyang"
      },
      {
        "name": "Hongwŏn",
        "center": [
          40.02528,
          127.95583
        ],
        "label": "Hongwŏn"
      }
    ]
  },
  {
    "code": "MP",
    "name": "Northern Mariana Islands",
    "cities": [
      {
        "name": "Northern Mariana Islands City",
        "center": [
          15.2,
          145.75
        ],
        "label": "Northern Mariana Islands (Capital / Main)"
      }
    ]
  },
  {
    "code": "NO",
    "name": "Norway",
    "cities": [
      {
        "name": "Agdenes",
        "center": [
          63.50575,
          9.82623
        ],
        "label": "Agdenes"
      },
      {
        "name": "Alstahaug",
        "center": [
          65.97556,
          12.56836
        ],
        "label": "Alstahaug"
      },
      {
        "name": "Alta",
        "center": [
          69.97675,
          23.29634
        ],
        "label": "Alta"
      },
      {
        "name": "Alvdal",
        "center": [
          62.10854,
          10.63483
        ],
        "label": "Alvdal"
      },
      {
        "name": "Andenes",
        "center": [
          69.31428,
          16.11939
        ],
        "label": "Andenes"
      },
      {
        "name": "Andøy",
        "center": [
          69.08033,
          15.77637
        ],
        "label": "Andøy"
      },
      {
        "name": "Aremark",
        "center": [
          59.22198,
          11.69582
        ],
        "label": "Aremark"
      },
      {
        "name": "Ask",
        "center": [
          60.07131,
          11.0362
        ],
        "label": "Ask"
      },
      {
        "name": "Asker",
        "center": [
          59.83734,
          10.43595
        ],
        "label": "Asker"
      },
      {
        "name": "Askim",
        "center": [
          59.58464,
          11.16084
        ],
        "label": "Askim"
      },
      {
        "name": "Askvoll",
        "center": [
          61.3485,
          5.05318
        ],
        "label": "Askvoll"
      },
      {
        "name": "Askøy",
        "center": [
          60.40916,
          5.22599
        ],
        "label": "Askøy"
      },
      {
        "name": "Audnedal",
        "center": [
          58.28378,
          7.35487
        ],
        "label": "Audnedal"
      },
      {
        "name": "Aukra",
        "center": [
          62.805,
          6.88722
        ],
        "label": "Aukra"
      },
      {
        "name": "Auli",
        "center": [
          60.0345,
          11.36046
        ],
        "label": "Auli"
      },
      {
        "name": "Aure",
        "center": [
          63.2675,
          8.52778
        ],
        "label": "Aure"
      },
      {
        "name": "Aurland",
        "center": [
          60.90556,
          7.18734
        ],
        "label": "Aurland"
      },
      {
        "name": "Aurskog-Høland",
        "center": [
          59.88321,
          11.56491
        ],
        "label": "Aurskog-Høland"
      },
      {
        "name": "Aursmoen",
        "center": [
          59.92763,
          11.44275
        ],
        "label": "Aursmoen"
      },
      {
        "name": "Austevoll",
        "center": [
          60.09578,
          5.22722
        ],
        "label": "Austevoll"
      }
    ]
  },
  {
    "code": "OM",
    "name": "Oman",
    "cities": [
      {
        "name": "Adam",
        "center": [
          22.37934,
          57.52718
        ],
        "label": "Adam"
      },
      {
        "name": "Al Buraymī",
        "center": [
          24.25088,
          55.79312
        ],
        "label": "Al Buraymī"
      },
      {
        "name": "Al Khābūrah",
        "center": [
          23.97144,
          57.09313
        ],
        "label": "Al Khābūrah"
      },
      {
        "name": "As Suwayq",
        "center": [
          23.84944,
          57.43861
        ],
        "label": "As Suwayq"
      },
      {
        "name": "Bahlā’",
        "center": [
          22.97886,
          57.3047
        ],
        "label": "Bahlā’"
      },
      {
        "name": "Barkā’",
        "center": [
          23.67872,
          57.88605
        ],
        "label": "Barkā’"
      },
      {
        "name": "Bawshar",
        "center": [
          23.57769,
          58.39982
        ],
        "label": "Bawshar"
      },
      {
        "name": "Bayt al ‘Awābī",
        "center": [
          23.30324,
          57.52459
        ],
        "label": "Bayt al ‘Awābī"
      },
      {
        "name": "Bidbid",
        "center": [
          23.40787,
          58.1283
        ],
        "label": "Bidbid"
      },
      {
        "name": "Dib Dibba",
        "center": [
          26.19778,
          56.25778
        ],
        "label": "Dib Dibba"
      },
      {
        "name": "Haymā’",
        "center": [
          19.95931,
          56.27575
        ],
        "label": "Haymā’"
      },
      {
        "name": "Izkī",
        "center": [
          22.93333,
          57.76667
        ],
        "label": "Izkī"
      },
      {
        "name": "Khasab",
        "center": [
          26.17993,
          56.24774
        ],
        "label": "Khasab"
      },
      {
        "name": "Liwá",
        "center": [
          24.53077,
          56.563
        ],
        "label": "Liwá"
      },
      {
        "name": "Madḩā’ al Jadīdah",
        "center": [
          25.28345,
          56.3328
        ],
        "label": "Madḩā’ al Jadīdah"
      },
      {
        "name": "Muscat",
        "center": [
          23.58413,
          58.40778
        ],
        "label": "Muscat"
      },
      {
        "name": "Nizwá",
        "center": [
          22.93333,
          57.53333
        ],
        "label": "Nizwá"
      },
      {
        "name": "Oman Smart Future City",
        "center": [
          23.6527,
          57.59926
        ],
        "label": "Oman Smart Future City"
      },
      {
        "name": "Rustaq",
        "center": [
          23.39083,
          57.42444
        ],
        "label": "Rustaq"
      },
      {
        "name": "Seeb",
        "center": [
          23.67027,
          58.18911
        ],
        "label": "Seeb"
      }
    ]
  },
  {
    "code": "PK",
    "name": "Pakistan",
    "cities": [
      {
        "name": "Karachi, Gulshan-e-Iqbal",
        "center": [
          24.9215,
          67.0979
        ],
        "label": "Karachi (Gulshan-e-Iqbal)"
      },
      {
        "name": "Karachi, Clifton & DHA",
        "center": [
          24.8138,
          67.0305
        ],
        "label": "Karachi (Clifton & DHA)"
      },
      {
        "name": "Karachi, Saddar & I.I. Chundrigar",
        "center": [
          24.8569,
          67.0097
        ],
        "label": "Karachi (Saddar / Financial)"
      },
      {
        "name": "Karachi, North Nazimabad",
        "center": [
          24.9388,
          67.0425
        ],
        "label": "Karachi (North Nazimabad)"
      },
      {
        "name": "Lahore, Gulberg",
        "center": [
          31.5204,
          74.3587
        ],
        "label": "Lahore (Gulberg / MM Alam)"
      },
      {
        "name": "Lahore, DHA",
        "center": [
          31.4707,
          74.3986
        ],
        "label": "Lahore (DHA)"
      },
      {
        "name": "Lahore, Johar Town",
        "center": [
          31.4697,
          74.2728
        ],
        "label": "Lahore (Johar Town / Expo)"
      },
      {
        "name": "Islamabad, Blue Area",
        "center": [
          33.7215,
          73.0722
        ],
        "label": "Islamabad (Blue Area / F-7 / F-6)"
      },
      {
        "name": "Islamabad, F-10 & F-11",
        "center": [
          33.6934,
          73.0031
        ],
        "label": "Islamabad (F-10 / F-11 / G-11)"
      },
      {
        "name": "Rawalpindi, Saddar & Bahria",
        "center": [
          33.5973,
          73.0551
        ],
        "label": "Rawalpindi (Saddar / Bahria Town)"
      },
      {
        "name": "Faisalabad, Clock Tower & D Ground",
        "center": [
          31.4504,
          73.135
        ],
        "label": "Faisalabad (D Ground / Clock Tower)"
      },
      {
        "name": "Multan, Cantt & Bosan Rd",
        "center": [
          30.1575,
          71.5249
        ],
        "label": "Multan"
      },
      {
        "name": "Peshawar, University Rd",
        "center": [
          34.0151,
          71.5249
        ],
        "label": "Peshawar"
      },
      {
        "name": "Quetta, Jinnah Rd",
        "center": [
          30.1798,
          66.975
        ],
        "label": "Quetta"
      },
      {
        "name": "Sialkot, Paris Rd",
        "center": [
          32.4945,
          74.5229
        ],
        "label": "Sialkot"
      },
      {
        "name": "Gujranwala, Model Town",
        "center": [
          32.1877,
          74.1945
        ],
        "label": "Gujranwala"
      },
      {
        "name": "Hyderabad, Latifabad & Qasimabad",
        "center": [
          25.396,
          68.3578
        ],
        "label": "Hyderabad (Sindh)"
      },
      {
        "name": "Abbottabad, Mandian",
        "center": [
          34.1688,
          73.2215
        ],
        "label": "Abbottabad"
      },
      {
        "name": "Bahawalpur",
        "center": [
          29.3544,
          71.6911
        ],
        "label": "Bahawalpur"
      },
      {
        "name": "Sargodha",
        "center": [
          32.0836,
          72.6711
        ],
        "label": "Sargodha"
      }
    ]
  },
  {
    "code": "PW",
    "name": "Palau",
    "cities": [
      {
        "name": "Angaur State",
        "center": [
          6.90601,
          134.12997
        ],
        "label": "Angaur State"
      },
      {
        "name": "Imeong Hamlet",
        "center": [
          7.53134,
          134.52713
        ],
        "label": "Imeong Hamlet"
      },
      {
        "name": "Kayangel",
        "center": [
          8.08228,
          134.71725
        ],
        "label": "Kayangel"
      },
      {
        "name": "Kloulklubed",
        "center": [
          7.04192,
          134.25561
        ],
        "label": "Kloulklubed"
      },
      {
        "name": "Koror",
        "center": [
          7.33978,
          134.47326
        ],
        "label": "Koror"
      },
      {
        "name": "Koror Town",
        "center": [
          7.34257,
          134.47888
        ],
        "label": "Koror Town"
      },
      {
        "name": "Melekeok Village",
        "center": [
          7.49567,
          134.63671
        ],
        "label": "Melekeok Village"
      },
      {
        "name": "Mengellang",
        "center": [
          7.6957,
          134.63054
        ],
        "label": "Mengellang"
      },
      {
        "name": "Ngardmau",
        "center": [
          7.60986,
          134.5744
        ],
        "label": "Ngardmau"
      },
      {
        "name": "Ngchemiangel",
        "center": [
          7.44613,
          134.47678
        ],
        "label": "Ngchemiangel"
      },
      {
        "name": "Ngchesar Hamlet",
        "center": [
          7.46932,
          134.60991
        ],
        "label": "Ngchesar Hamlet"
      },
      {
        "name": "Ngerkeai",
        "center": [
          7.55456,
          134.63612
        ],
        "label": "Ngerkeai"
      },
      {
        "name": "Ngetkib",
        "center": [
          7.36451,
          134.51484
        ],
        "label": "Ngetkib"
      },
      {
        "name": "Sonsorol Village",
        "center": [
          5.32608,
          132.21943
        ],
        "label": "Sonsorol Village"
      },
      {
        "name": "Tobi Village",
        "center": [
          3.00488,
          131.12168
        ],
        "label": "Tobi Village"
      },
      {
        "name": "Ulimang",
        "center": [
          7.62416,
          134.64208
        ],
        "label": "Ulimang"
      }
    ]
  },
  {
    "code": "PS",
    "name": "Palestinian Territory Occupied",
    "cities": [
      {
        "name": "Ramallah",
        "center": [
          31.9038,
          35.2034
        ],
        "label": "Ramallah"
      },
      {
        "name": "Gaza City",
        "center": [
          31.5017,
          34.4668
        ],
        "label": "Gaza City"
      },
      {
        "name": "Hebron",
        "center": [
          31.5326,
          35.0998
        ],
        "label": "Hebron"
      }
    ]
  },
  {
    "code": "PA",
    "name": "Panama",
    "cities": [
      {
        "name": "Achutupo",
        "center": [
          9.19827,
          -77.98729
        ],
        "label": "Achutupo"
      },
      {
        "name": "Agua Buena",
        "center": [
          7.83465,
          -80.39405
        ],
        "label": "Agua Buena"
      },
      {
        "name": "Aguadulce",
        "center": [
          8.24183,
          -80.54609
        ],
        "label": "Aguadulce"
      },
      {
        "name": "Aguas Blancas",
        "center": [
          8.50351,
          -80.31169
        ],
        "label": "Aguas Blancas"
      },
      {
        "name": "Ailigandí",
        "center": [
          9.2281,
          -78.02778
        ],
        "label": "Ailigandí"
      },
      {
        "name": "Alanje",
        "center": [
          8.39791,
          -82.55947
        ],
        "label": "Alanje"
      },
      {
        "name": "Alcalde Díaz",
        "center": [
          9.12016,
          -79.55641
        ],
        "label": "Alcalde Díaz"
      },
      {
        "name": "Algarrobos Arriba",
        "center": [
          8.5155,
          -82.42263
        ],
        "label": "Algarrobos Arriba"
      },
      {
        "name": "Almirante",
        "center": [
          9.30091,
          -82.4018
        ],
        "label": "Almirante"
      },
      {
        "name": "Alto Boquete",
        "center": [
          8.73458,
          -82.43213
        ],
        "label": "Alto Boquete"
      },
      {
        "name": "Alto de Jesús",
        "center": [
          8.26152,
          -81.48412
        ],
        "label": "Alto de Jesús"
      },
      {
        "name": "Alto de La Estancia",
        "center": [
          8.58792,
          -80.18443
        ],
        "label": "Alto de La Estancia"
      },
      {
        "name": "Alto del Espino",
        "center": [
          8.84213,
          -79.84551
        ],
        "label": "Alto del Espino"
      },
      {
        "name": "Altos de San Francisco",
        "center": [
          8.86167,
          -79.79
        ],
        "label": "Altos de San Francisco"
      },
      {
        "name": "Ancón",
        "center": [
          8.96015,
          -79.5514
        ],
        "label": "Ancón"
      },
      {
        "name": "Antón",
        "center": [
          8.39733,
          -80.26063
        ],
        "label": "Antón"
      },
      {
        "name": "Arenas",
        "center": [
          7.36865,
          -80.86268
        ],
        "label": "Arenas"
      },
      {
        "name": "Arenosa",
        "center": [
          9.03978,
          -79.95128
        ],
        "label": "Arenosa"
      },
      {
        "name": "Arosemena",
        "center": [
          8.97091,
          -79.96641
        ],
        "label": "Arosemena"
      },
      {
        "name": "Arraiján",
        "center": [
          8.95187,
          -79.66011
        ],
        "label": "Arraiján"
      }
    ]
  },
  {
    "code": "PG",
    "name": "Papua new Guinea",
    "cities": [
      {
        "name": "Abau",
        "center": [
          -10.08333,
          148.91667
        ],
        "label": "Abau"
      },
      {
        "name": "Aitape",
        "center": [
          -3.13697,
          142.34913
        ],
        "label": "Aitape"
      },
      {
        "name": "Aitape Lumi",
        "center": [
          -3.25,
          142.08333
        ],
        "label": "Aitape Lumi"
      },
      {
        "name": "Alotau",
        "center": [
          -10.25,
          150.08333
        ],
        "label": "Alotau"
      },
      {
        "name": "Angalimp South Wahgi",
        "center": [
          -6.05,
          144.56667
        ],
        "label": "Angalimp South Wahgi"
      },
      {
        "name": "Arawa",
        "center": [
          -6.22977,
          155.56598
        ],
        "label": "Arawa"
      },
      {
        "name": "Baiyer Mul",
        "center": [
          -5.53333,
          144.15
        ],
        "label": "Baiyer Mul"
      },
      {
        "name": "Bogia",
        "center": [
          -4.5,
          145
        ],
        "label": "Bogia"
      },
      {
        "name": "Bulolo",
        "center": [
          -7.41667,
          146.75
        ],
        "label": "Bulolo"
      },
      {
        "name": "Central Bougainville",
        "center": [
          -6.22806,
          155.56583
        ],
        "label": "Central Bougainville"
      },
      {
        "name": "Chuave",
        "center": [
          -6.16667,
          145.08333
        ],
        "label": "Chuave"
      },
      {
        "name": "Daru",
        "center": [
          -9.07786,
          143.20893
        ],
        "label": "Daru"
      },
      {
        "name": "Daulo",
        "center": [
          -5.98333,
          145.23333
        ],
        "label": "Daulo"
      },
      {
        "name": "Dei",
        "center": [
          -5.68333,
          144.36667
        ],
        "label": "Dei"
      },
      {
        "name": "Esa’ala",
        "center": [
          -9.58333,
          150.75
        ],
        "label": "Esa’ala"
      },
      {
        "name": "Finschhafen",
        "center": [
          -6.41667,
          147.5
        ],
        "label": "Finschhafen"
      },
      {
        "name": "Gazelle",
        "center": [
          -4.48333,
          151.86667
        ],
        "label": "Gazelle"
      },
      {
        "name": "Goilala",
        "center": [
          -8.33333,
          147
        ],
        "label": "Goilala"
      },
      {
        "name": "Goroka",
        "center": [
          -6.05,
          145.38333
        ],
        "label": "Goroka"
      },
      {
        "name": "Gumine",
        "center": [
          -6.25,
          144.88333
        ],
        "label": "Gumine"
      }
    ]
  },
  {
    "code": "PY",
    "name": "Paraguay",
    "cities": [
      {
        "name": "Abaí",
        "center": [
          -26.03333,
          -55.93333
        ],
        "label": "Abaí"
      },
      {
        "name": "Acahay",
        "center": [
          -25.91667,
          -57.15
        ],
        "label": "Acahay"
      },
      {
        "name": "Altos",
        "center": [
          -25.26263,
          -57.25443
        ],
        "label": "Altos"
      },
      {
        "name": "Antequera",
        "center": [
          -24.08526,
          -57.20221
        ],
        "label": "Antequera"
      },
      {
        "name": "Areguá",
        "center": [
          -25.3125,
          -57.38472
        ],
        "label": "Areguá"
      },
      {
        "name": "Arquitecto Tomás Romero Pereira",
        "center": [
          -26.48333,
          -55.25
        ],
        "label": "Arquitecto Tomás Romero Pereira"
      },
      {
        "name": "Arroyos y Esteros",
        "center": [
          -25.05478,
          -57.09873
        ],
        "label": "Arroyos y Esteros"
      },
      {
        "name": "Atyrá",
        "center": [
          -25.27876,
          -57.17192
        ],
        "label": "Atyrá"
      },
      {
        "name": "Bella Vista",
        "center": [
          -22.13333,
          -56.51667
        ],
        "label": "Bella Vista"
      },
      {
        "name": "Belén",
        "center": [
          -23.46611,
          -57.26194
        ],
        "label": "Belén"
      },
      {
        "name": "Benjamín Aceval",
        "center": [
          -24.96667,
          -57.56667
        ],
        "label": "Benjamín Aceval"
      },
      {
        "name": "Buena Vista",
        "center": [
          -26.18387,
          -56.08171
        ],
        "label": "Buena Vista"
      },
      {
        "name": "Caacupé",
        "center": [
          -25.38575,
          -57.14217
        ],
        "label": "Caacupé"
      },
      {
        "name": "Caaguazú",
        "center": [
          -25.47104,
          -56.01603
        ],
        "label": "Caaguazú"
      },
      {
        "name": "Caapucú",
        "center": [
          -26.23523,
          -57.18212
        ],
        "label": "Caapucú"
      },
      {
        "name": "Caazapá",
        "center": [
          -26.19583,
          -56.36806
        ],
        "label": "Caazapá"
      },
      {
        "name": "Capiatá",
        "center": [
          -25.3552,
          -57.44545
        ],
        "label": "Capiatá"
      },
      {
        "name": "Capitán Bado",
        "center": [
          -23.26667,
          -55.53333
        ],
        "label": "Capitán Bado"
      },
      {
        "name": "Capitán Miranda",
        "center": [
          -27.2,
          -55.8
        ],
        "label": "Capitán Miranda"
      },
      {
        "name": "Capitán Pablo Lagerenza",
        "center": [
          -19.91667,
          -60.78333
        ],
        "label": "Capitán Pablo Lagerenza"
      }
    ]
  },
  {
    "code": "PE",
    "name": "Peru",
    "cities": [
      {
        "name": "Abancay",
        "center": [
          -13.63389,
          -72.88139
        ],
        "label": "Abancay"
      },
      {
        "name": "Acarí",
        "center": [
          -15.42393,
          -74.61361
        ],
        "label": "Acarí"
      },
      {
        "name": "Acolla",
        "center": [
          -11.73193,
          -75.54634
        ],
        "label": "Acolla"
      },
      {
        "name": "Aguas Verdes",
        "center": [
          -3.48139,
          -80.245
        ],
        "label": "Aguas Verdes"
      },
      {
        "name": "Ambo",
        "center": [
          -10.13083,
          -76.20472
        ],
        "label": "Ambo"
      },
      {
        "name": "Andahuaylas",
        "center": [
          -13.65556,
          -73.38722
        ],
        "label": "Andahuaylas"
      },
      {
        "name": "Andoas",
        "center": [
          -2.9025,
          -76.4025
        ],
        "label": "Andoas"
      },
      {
        "name": "Anta",
        "center": [
          -13.47056,
          -72.14833
        ],
        "label": "Anta"
      },
      {
        "name": "Arequipa",
        "center": [
          -16.39889,
          -71.535
        ],
        "label": "Arequipa"
      },
      {
        "name": "Ascope",
        "center": [
          -7.71444,
          -79.10778
        ],
        "label": "Ascope"
      },
      {
        "name": "Asentamiento Humano Nicolas de Pierola",
        "center": [
          -11.93573,
          -76.70611
        ],
        "label": "Asentamiento Humano Nicolas de Pierola"
      },
      {
        "name": "Asuncion",
        "center": [
          -9.18987,
          -77.39878
        ],
        "label": "Asuncion"
      },
      {
        "name": "Atalaya",
        "center": [
          -10.3898,
          -73.21977
        ],
        "label": "Atalaya"
      },
      {
        "name": "Atuncolla",
        "center": [
          -15.68333,
          -70.15
        ],
        "label": "Atuncolla"
      },
      {
        "name": "Ayabaca",
        "center": [
          -4.63983,
          -79.71491
        ],
        "label": "Ayabaca"
      },
      {
        "name": "Ayacucho",
        "center": [
          -13.15878,
          -74.22321
        ],
        "label": "Ayacucho"
      },
      {
        "name": "Ayaviri",
        "center": [
          -14.88639,
          -70.58889
        ],
        "label": "Ayaviri"
      },
      {
        "name": "Ayna",
        "center": [
          -12.65,
          -73.91667
        ],
        "label": "Ayna"
      },
      {
        "name": "Azángaro",
        "center": [
          -14.90843,
          -70.19616
        ],
        "label": "Azángaro"
      },
      {
        "name": "Bagua Grande",
        "center": [
          -5.75611,
          -78.44111
        ],
        "label": "Bagua Grande"
      }
    ]
  },
  {
    "code": "PH",
    "name": "Philippines",
    "cities": [
      {
        "name": "Aanislag",
        "center": [
          13.0748,
          123.703
        ],
        "label": "Aanislag"
      },
      {
        "name": "Abaca",
        "center": [
          11.1342,
          122.7156
        ],
        "label": "Abaca"
      },
      {
        "name": "Abangay",
        "center": [
          10.96667,
          122.65
        ],
        "label": "Abangay"
      },
      {
        "name": "Abiera",
        "center": [
          11.5749,
          122.09
        ],
        "label": "Abiera"
      },
      {
        "name": "Abilay",
        "center": [
          10.73333,
          122.5
        ],
        "label": "Abilay"
      },
      {
        "name": "Abis",
        "center": [
          9.7173,
          122.9438
        ],
        "label": "Abis"
      },
      {
        "name": "Aborlan",
        "center": [
          9.43361,
          118.54879
        ],
        "label": "Aborlan"
      },
      {
        "name": "Abra de Ilog",
        "center": [
          13.4437,
          120.7291
        ],
        "label": "Abra de Ilog"
      },
      {
        "name": "Abucay",
        "center": [
          14.73347,
          120.53358
        ],
        "label": "Abucay"
      },
      {
        "name": "Abucayan",
        "center": [
          9.929,
          123.9146
        ],
        "label": "Abucayan"
      },
      {
        "name": "Abulug",
        "center": [
          18.44528,
          121.45333
        ],
        "label": "Abulug"
      },
      {
        "name": "Abut",
        "center": [
          17.35423,
          121.60138
        ],
        "label": "Abut"
      },
      {
        "name": "Abuyog",
        "center": [
          10.74579722,
          125.01218056
        ],
        "label": "Abuyog"
      },
      {
        "name": "Abuyon",
        "center": [
          13.6226,
          122.5191
        ],
        "label": "Abuyon"
      },
      {
        "name": "Acao",
        "center": [
          16.52556,
          120.37639
        ],
        "label": "Acao"
      },
      {
        "name": "Accusilian",
        "center": [
          17.74791,
          121.46254
        ],
        "label": "Accusilian"
      },
      {
        "name": "Acli",
        "center": [
          15.12279,
          120.6447
        ],
        "label": "Acli"
      },
      {
        "name": "Adams",
        "center": [
          18.46141944,
          120.90210278
        ],
        "label": "Adams"
      },
      {
        "name": "Adela",
        "center": [
          12.44164,
          120.97291
        ],
        "label": "Adela"
      },
      {
        "name": "Adlaon",
        "center": [
          10.3,
          123.9
        ],
        "label": "Adlaon"
      }
    ]
  },
  {
    "code": "PN",
    "name": "Pitcairn Island",
    "cities": [
      {
        "name": "Pitcairn Island City",
        "center": [
          -25.06666666,
          -130.1
        ],
        "label": "Pitcairn Island (Capital / Main)"
      }
    ]
  },
  {
    "code": "PL",
    "name": "Poland",
    "cities": [
      {
        "name": "Abramów",
        "center": [
          51.45647,
          22.31521
        ],
        "label": "Abramów"
      },
      {
        "name": "Adamów",
        "center": [
          51.74335,
          22.26414
        ],
        "label": "Adamów"
      },
      {
        "name": "Adamówka",
        "center": [
          50.25857,
          22.69595
        ],
        "label": "Adamówka"
      },
      {
        "name": "Albigowa",
        "center": [
          50.01425,
          22.22414
        ],
        "label": "Albigowa"
      },
      {
        "name": "Aleksandrów",
        "center": [
          51.27126,
          19.99005
        ],
        "label": "Aleksandrów"
      },
      {
        "name": "Aleksandrów Kujawski",
        "center": [
          52.87659,
          18.69345
        ],
        "label": "Aleksandrów Kujawski"
      },
      {
        "name": "Aleksandrów Łódzki",
        "center": [
          51.81965,
          19.30384
        ],
        "label": "Aleksandrów Łódzki"
      },
      {
        "name": "Alwernia",
        "center": [
          50.06056,
          19.53953
        ],
        "label": "Alwernia"
      },
      {
        "name": "Andrespol",
        "center": [
          51.72783,
          19.64175
        ],
        "label": "Andrespol"
      },
      {
        "name": "Andrychów",
        "center": [
          49.85497,
          19.33834
        ],
        "label": "Andrychów"
      },
      {
        "name": "Annopol",
        "center": [
          50.88551,
          21.85678
        ],
        "label": "Annopol"
      },
      {
        "name": "Augustów",
        "center": [
          53.84321,
          22.97979
        ],
        "label": "Augustów"
      },
      {
        "name": "Babiak",
        "center": [
          52.3453,
          18.66663
        ],
        "label": "Babiak"
      },
      {
        "name": "Babica",
        "center": [
          49.93476,
          21.87035
        ],
        "label": "Babica"
      },
      {
        "name": "Babice",
        "center": [
          50.05565,
          19.19955
        ],
        "label": "Babice"
      },
      {
        "name": "Babimost",
        "center": [
          52.16488,
          15.82769
        ],
        "label": "Babimost"
      },
      {
        "name": "Baborów",
        "center": [
          50.1576,
          17.98513
        ],
        "label": "Baborów"
      },
      {
        "name": "Baboszewo",
        "center": [
          52.6807,
          20.25527
        ],
        "label": "Baboszewo"
      },
      {
        "name": "Bachowice",
        "center": [
          49.95812,
          19.49369
        ],
        "label": "Bachowice"
      },
      {
        "name": "Balice",
        "center": [
          50.08799,
          19.79462
        ],
        "label": "Balice"
      }
    ]
  },
  {
    "code": "PT",
    "name": "Portugal",
    "cities": [
      {
        "name": "A dos Cunhados",
        "center": [
          39.15237,
          -9.2972
        ],
        "label": "A dos Cunhados"
      },
      {
        "name": "A dos Francos",
        "center": [
          39.32272,
          -9.04743
        ],
        "label": "A dos Francos"
      },
      {
        "name": "Abrantes",
        "center": [
          39.46667,
          -8.2
        ],
        "label": "Abrantes"
      },
      {
        "name": "Abraveses",
        "center": [
          40.68137,
          -7.92102
        ],
        "label": "Abraveses"
      },
      {
        "name": "Abrigada",
        "center": [
          39.14472222,
          -9.01861111
        ],
        "label": "Abrigada"
      },
      {
        "name": "Adaúfe",
        "center": [
          41.58732,
          -8.39817
        ],
        "label": "Adaúfe"
      },
      {
        "name": "Adão",
        "center": [
          40.45916667,
          -7.165
        ],
        "label": "Adão"
      },
      {
        "name": "Aguada de Cima",
        "center": [
          40.52291,
          -8.427
        ],
        "label": "Aguada de Cima"
      },
      {
        "name": "Agualva",
        "center": [
          38.77004444,
          -9.29881111
        ],
        "label": "Agualva"
      },
      {
        "name": "Aguiar da Beira",
        "center": [
          40.81726,
          -7.54431
        ],
        "label": "Aguiar da Beira"
      },
      {
        "name": "Aguçadoura",
        "center": [
          41.43116,
          -8.77844
        ],
        "label": "Aguçadoura"
      },
      {
        "name": "Ajuda",
        "center": [
          38.7075,
          -9.19833333
        ],
        "label": "Ajuda"
      },
      {
        "name": "Alandroal",
        "center": [
          38.62924,
          -7.36599
        ],
        "label": "Alandroal"
      },
      {
        "name": "Albardo",
        "center": [
          40.51145,
          -7.13028
        ],
        "label": "Albardo"
      },
      {
        "name": "Albergaria-a-Velha",
        "center": [
          40.68706,
          -8.50399
        ],
        "label": "Albergaria-a-Velha"
      },
      {
        "name": "Albufeira",
        "center": [
          37.08819,
          -8.2503
        ],
        "label": "Albufeira"
      },
      {
        "name": "Alcabideche",
        "center": [
          38.73361111,
          -9.40916667
        ],
        "label": "Alcabideche"
      },
      {
        "name": "Alcains",
        "center": [
          39.91540278,
          -7.46107778
        ],
        "label": "Alcains"
      },
      {
        "name": "Alcanede",
        "center": [
          39.41501,
          -8.82189
        ],
        "label": "Alcanede"
      },
      {
        "name": "Alcanena",
        "center": [
          39.459,
          -8.66892
        ],
        "label": "Alcanena"
      }
    ]
  },
  {
    "code": "PR",
    "name": "Puerto Rico",
    "cities": [
      {
        "name": "San Juan",
        "center": [
          18.4655,
          -66.1057
        ],
        "label": "San Juan"
      },
      {
        "name": "Ponce",
        "center": [
          18.0111,
          -66.6141
        ],
        "label": "Ponce"
      },
      {
        "name": "Bayamon",
        "center": [
          18.3986,
          -66.1557
        ],
        "label": "Bayamon"
      }
    ]
  },
  {
    "code": "QA",
    "name": "Qatar",
    "cities": [
      {
        "name": "Al Ghuwayrīyah",
        "center": [
          25.82882,
          51.24567
        ],
        "label": "Al Ghuwayrīyah"
      },
      {
        "name": "Al Jumaylīyah",
        "center": [
          25.61068,
          51.09108
        ],
        "label": "Al Jumaylīyah"
      },
      {
        "name": "Al Khawr",
        "center": [
          25.68389,
          51.50583
        ],
        "label": "Al Khawr"
      },
      {
        "name": "Al Wakrah",
        "center": [
          25.17151,
          51.60337
        ],
        "label": "Al Wakrah"
      },
      {
        "name": "Al Wukayr",
        "center": [
          25.15107,
          51.53718
        ],
        "label": "Al Wukayr"
      },
      {
        "name": "Ar Rayyān",
        "center": [
          25.29194,
          51.42444
        ],
        "label": "Ar Rayyān"
      },
      {
        "name": "Ar Ruways",
        "center": [
          26.13978,
          51.21493
        ],
        "label": "Ar Ruways"
      },
      {
        "name": "Ash Shīḩānīyah",
        "center": [
          25.37088,
          51.22264
        ],
        "label": "Ash Shīḩānīyah"
      },
      {
        "name": "Doha",
        "center": [
          25.28545,
          51.53096
        ],
        "label": "Doha"
      },
      {
        "name": "Dukhān",
        "center": [
          25.42485,
          50.78227
        ],
        "label": "Dukhān"
      },
      {
        "name": "Fuwayriţ",
        "center": [
          26.02565,
          51.36971
        ],
        "label": "Fuwayriţ"
      },
      {
        "name": "Madīnat ash Shamāl",
        "center": [
          26.12933,
          51.2009
        ],
        "label": "Madīnat ash Shamāl"
      },
      {
        "name": "Musay‘īd",
        "center": [
          24.99226,
          51.55067
        ],
        "label": "Musay‘īd"
      },
      {
        "name": "Umm Bāb",
        "center": [
          25.21417,
          50.80722
        ],
        "label": "Umm Bāb"
      },
      {
        "name": "Umm Şalāl Muḩammad",
        "center": [
          25.41524,
          51.40647
        ],
        "label": "Umm Şalāl Muḩammad"
      }
    ]
  },
  {
    "code": "RE",
    "name": "Reunion",
    "cities": [
      {
        "name": "Reunion City",
        "center": [
          -21.15,
          55.5
        ],
        "label": "Reunion (Capital / Main)"
      }
    ]
  },
  {
    "code": "RO",
    "name": "Romania",
    "cities": [
      {
        "name": "1 Decembrie",
        "center": [
          44.29083,
          26.05806
        ],
        "label": "1 Decembrie"
      },
      {
        "name": "23 August",
        "center": [
          43.91667,
          28.58333
        ],
        "label": "23 August"
      },
      {
        "name": "Abram",
        "center": [
          47.31667,
          22.38333
        ],
        "label": "Abram"
      },
      {
        "name": "Abrud",
        "center": [
          46.27406,
          23.06339
        ],
        "label": "Abrud"
      },
      {
        "name": "Abrud-Sat",
        "center": [
          46.28166,
          23.06098
        ],
        "label": "Abrud-Sat"
      },
      {
        "name": "Abrămuţ",
        "center": [
          47.31667,
          22.25
        ],
        "label": "Abrămuţ"
      },
      {
        "name": "Abuș",
        "center": [
          46.35,
          24.38333333
        ],
        "label": "Abuș"
      },
      {
        "name": "Acriș",
        "center": [
          45.63673,
          25.99247
        ],
        "label": "Acriș"
      },
      {
        "name": "Acâş",
        "center": [
          47.53333,
          22.78333
        ],
        "label": "Acâş"
      },
      {
        "name": "Acățari",
        "center": [
          46.48333333,
          24.63333333
        ],
        "label": "Acățari"
      },
      {
        "name": "Adamclisi",
        "center": [
          44.08333,
          27.95
        ],
        "label": "Adamclisi"
      },
      {
        "name": "Adea",
        "center": [
          46.55511,
          21.58433
        ],
        "label": "Adea"
      },
      {
        "name": "Adjud",
        "center": [
          46.1,
          27.16667
        ],
        "label": "Adjud"
      },
      {
        "name": "Adjudeni",
        "center": [
          47.01408,
          26.94903
        ],
        "label": "Adjudeni"
      },
      {
        "name": "Adjudu Vechi",
        "center": [
          46.13485,
          27.18891
        ],
        "label": "Adjudu Vechi"
      },
      {
        "name": "Adrian",
        "center": [
          46.782092,
          24.833242
        ],
        "label": "Adrian"
      },
      {
        "name": "Adrianu Mare",
        "center": [
          46.493573,
          24.803244
        ],
        "label": "Adrianu Mare"
      },
      {
        "name": "Adrianu Mic",
        "center": [
          46.500821,
          24.790514
        ],
        "label": "Adrianu Mic"
      },
      {
        "name": "Adunaţi",
        "center": [
          45.13333,
          25.61667
        ],
        "label": "Adunaţi"
      },
      {
        "name": "Adunații-Copăceni",
        "center": [
          44.25413,
          26.04929
        ],
        "label": "Adunații-Copăceni"
      }
    ]
  },
  {
    "code": "RU",
    "name": "Russia",
    "cities": [
      {
        "name": "Abadzekhskaya",
        "center": [
          44.39389,
          40.22139
        ],
        "label": "Abadzekhskaya"
      },
      {
        "name": "Abagur",
        "center": [
          53.7308,
          87.2526
        ],
        "label": "Abagur"
      },
      {
        "name": "Abakan",
        "center": [
          53.71556,
          91.42917
        ],
        "label": "Abakan"
      },
      {
        "name": "Abakan Gorod",
        "center": [
          53.71667,
          91.43333
        ],
        "label": "Abakan Gorod"
      },
      {
        "name": "Abalak",
        "center": [
          58.12861,
          68.59444
        ],
        "label": "Abalak"
      },
      {
        "name": "Aban",
        "center": [
          56.6787,
          96.0658
        ],
        "label": "Aban"
      },
      {
        "name": "Abanskiy Rayon",
        "center": [
          56.83333,
          96
        ],
        "label": "Abanskiy Rayon"
      },
      {
        "name": "Abatskoye",
        "center": [
          56.28748,
          70.45553
        ],
        "label": "Abatskoye"
      },
      {
        "name": "Abaza",
        "center": [
          52.655,
          90.09278
        ],
        "label": "Abaza"
      },
      {
        "name": "Abdulino",
        "center": [
          53.7,
          53.66667
        ],
        "label": "Abdulino"
      },
      {
        "name": "Abinsk",
        "center": [
          44.86803,
          38.15728
        ],
        "label": "Abinsk"
      },
      {
        "name": "Abinskiy Rayon",
        "center": [
          44.83402,
          38.27891
        ],
        "label": "Abinskiy Rayon"
      },
      {
        "name": "Abram Mys",
        "center": [
          68.97839,
          33.01926
        ],
        "label": "Abram Mys"
      },
      {
        "name": "Abramovka",
        "center": [
          51.1886,
          41.0202
        ],
        "label": "Abramovka"
      },
      {
        "name": "Abrau-Dyurso",
        "center": [
          44.69973,
          37.60098
        ],
        "label": "Abrau-Dyurso"
      },
      {
        "name": "Abyysky District",
        "center": [
          68.33333,
          146
        ],
        "label": "Abyysky District"
      },
      {
        "name": "Abzakovo",
        "center": [
          53.82861,
          58.59333
        ],
        "label": "Abzakovo"
      },
      {
        "name": "Abzelilovskiy Rayon",
        "center": [
          53.41667,
          58.5
        ],
        "label": "Abzelilovskiy Rayon"
      },
      {
        "name": "Achikulak",
        "center": [
          44.55167,
          44.83778
        ],
        "label": "Achikulak"
      },
      {
        "name": "Achinsk",
        "center": [
          56.2694,
          90.4993
        ],
        "label": "Achinsk"
      }
    ]
  },
  {
    "code": "RW",
    "name": "Rwanda",
    "cities": [
      {
        "name": "Butare",
        "center": [
          -2.59667,
          29.73944
        ],
        "label": "Butare"
      },
      {
        "name": "Byumba",
        "center": [
          -1.5763,
          30.0675
        ],
        "label": "Byumba"
      },
      {
        "name": "Cyangugu",
        "center": [
          -2.4846,
          28.9075
        ],
        "label": "Cyangugu"
      },
      {
        "name": "Eglise Catholique, Centrale GIKO",
        "center": [
          -1.93653,
          29.8061
        ],
        "label": "Eglise Catholique, Centrale GIKO"
      },
      {
        "name": "Gisenyi",
        "center": [
          -1.70278,
          29.25639
        ],
        "label": "Gisenyi"
      },
      {
        "name": "Gitarama",
        "center": [
          -2.07444,
          29.75667
        ],
        "label": "Gitarama"
      },
      {
        "name": "Kibungo",
        "center": [
          -2.1597,
          30.5427
        ],
        "label": "Kibungo"
      },
      {
        "name": "Kibuye",
        "center": [
          -2.06028,
          29.34778
        ],
        "label": "Kibuye"
      },
      {
        "name": "Kigali",
        "center": [
          -1.94995,
          30.05885
        ],
        "label": "Kigali"
      },
      {
        "name": "Musanze",
        "center": [
          -1.49984,
          29.63497
        ],
        "label": "Musanze"
      },
      {
        "name": "Nzega",
        "center": [
          -2.479,
          29.5564
        ],
        "label": "Nzega"
      },
      {
        "name": "Rwamagana",
        "center": [
          -1.9487,
          30.4347
        ],
        "label": "Rwamagana"
      }
    ]
  },
  {
    "code": "SH",
    "name": "Saint Helena",
    "cities": [
      {
        "name": "Saint Helena City",
        "center": [
          -15.95,
          -5.7
        ],
        "label": "Saint Helena (Capital / Main)"
      }
    ]
  },
  {
    "code": "KN",
    "name": "Saint Kitts And Nevis",
    "cities": [
      {
        "name": "Cayon",
        "center": [
          17.35,
          -62.73333
        ],
        "label": "Cayon"
      },
      {
        "name": "Charlestown",
        "center": [
          17.13333,
          -62.61667
        ],
        "label": "Charlestown"
      },
      {
        "name": "Cotton Ground",
        "center": [
          17.16667,
          -62.61667
        ],
        "label": "Cotton Ground"
      },
      {
        "name": "Dieppe Bay Town",
        "center": [
          17.41473,
          -62.8139
        ],
        "label": "Dieppe Bay Town"
      },
      {
        "name": "Fig Tree",
        "center": [
          17.12623,
          -62.60265
        ],
        "label": "Fig Tree"
      },
      {
        "name": "Market Shop",
        "center": [
          17.13218,
          -62.57267
        ],
        "label": "Market Shop"
      },
      {
        "name": "Middle Island",
        "center": [
          17.3259,
          -62.81055
        ],
        "label": "Middle Island"
      },
      {
        "name": "Monkey Hill",
        "center": [
          17.32327,
          -62.72914
        ],
        "label": "Monkey Hill"
      },
      {
        "name": "Newcastle",
        "center": [
          17.2,
          -62.58333
        ],
        "label": "Newcastle"
      },
      {
        "name": "Nicola Town",
        "center": [
          17.37956,
          -62.75318
        ],
        "label": "Nicola Town"
      },
      {
        "name": "Saint Paul’s",
        "center": [
          17.40605,
          -62.83562
        ],
        "label": "Saint Paul’s"
      },
      {
        "name": "Sandy Point Town",
        "center": [
          17.35908,
          -62.84858
        ],
        "label": "Sandy Point Town"
      },
      {
        "name": "Trinity",
        "center": [
          17.30037,
          -62.77584
        ],
        "label": "Trinity"
      }
    ]
  },
  {
    "code": "LC",
    "name": "Saint Lucia",
    "cities": [
      {
        "name": "Active Hill",
        "center": [
          14.0194,
          -60.97767
        ],
        "label": "Active Hill"
      },
      {
        "name": "Agard Lands/Morne Dudon",
        "center": [
          14.00768,
          -60.96462
        ],
        "label": "Agard Lands/Morne Dudon"
      },
      {
        "name": "Almondale",
        "center": [
          14.01848,
          -60.96162
        ],
        "label": "Almondale"
      },
      {
        "name": "Annus",
        "center": [
          13.77449,
          -61.00511
        ],
        "label": "Annus"
      },
      {
        "name": "Anse Canot",
        "center": [
          13.90871,
          -60.9044
        ],
        "label": "Anse Canot"
      },
      {
        "name": "Anse Chastanet",
        "center": [
          13.86426,
          -61.07016
        ],
        "label": "Anse Chastanet"
      },
      {
        "name": "Anse Cochon",
        "center": [
          13.92261,
          -61.0525
        ],
        "label": "Anse Cochon"
      },
      {
        "name": "Anse Galet",
        "center": [
          13.93221,
          -61.0429
        ],
        "label": "Anse Galet"
      },
      {
        "name": "Anse Ger",
        "center": [
          13.79567,
          -60.91567
        ],
        "label": "Anse Ger"
      },
      {
        "name": "Anse La Raye",
        "center": [
          13.94619,
          -61.03879
        ],
        "label": "Anse La Raye"
      },
      {
        "name": "Anse La Verdue",
        "center": [
          13.90964,
          -61.04755
        ],
        "label": "Anse La Verdue"
      },
      {
        "name": "Athens",
        "center": [
          13.90574,
          -60.89184
        ],
        "label": "Athens"
      },
      {
        "name": "Au Leon",
        "center": [
          13.95245,
          -60.90456
        ],
        "label": "Au Leon"
      },
      {
        "name": "Au Tabor",
        "center": [
          13.9454,
          -61.04112
        ],
        "label": "Au Tabor"
      },
      {
        "name": "Au Tabor Hill",
        "center": [
          13.94457,
          -61.03559
        ],
        "label": "Au Tabor Hill"
      },
      {
        "name": "Augier",
        "center": [
          13.76669,
          -60.98063
        ],
        "label": "Augier"
      },
      {
        "name": "Aurendel Hill",
        "center": [
          14.00069,
          -60.9867
        ],
        "label": "Aurendel Hill"
      },
      {
        "name": "Babonneau Proper",
        "center": [
          14.00535,
          -60.9464
        ],
        "label": "Babonneau Proper"
      },
      {
        "name": "Bagatelle",
        "center": [
          13.99797,
          -60.98156
        ],
        "label": "Bagatelle"
      },
      {
        "name": "Balata",
        "center": [
          14.01471,
          -60.95167
        ],
        "label": "Balata"
      }
    ]
  },
  {
    "code": "PM",
    "name": "Saint Pierre and Miquelon",
    "cities": [
      {
        "name": "Saint Pierre and Miquelon City",
        "center": [
          46.83333333,
          -56.33333333
        ],
        "label": "Saint Pierre and Miquelon (Capital / Main)"
      }
    ]
  },
  {
    "code": "VC",
    "name": "Saint Vincent And The Grenadines",
    "cities": [
      {
        "name": "Barrouallie",
        "center": [
          13.23676,
          -61.27275
        ],
        "label": "Barrouallie"
      },
      {
        "name": "Biabou",
        "center": [
          13.1943,
          -61.13904
        ],
        "label": "Biabou"
      },
      {
        "name": "Byera Village",
        "center": [
          13.25636,
          -61.11954
        ],
        "label": "Byera Village"
      },
      {
        "name": "Chateaubelair",
        "center": [
          13.29069,
          -61.24043
        ],
        "label": "Chateaubelair"
      },
      {
        "name": "Georgetown",
        "center": [
          13.28054,
          -61.1185
        ],
        "label": "Georgetown"
      },
      {
        "name": "Kingstown",
        "center": [
          13.15527,
          -61.22742
        ],
        "label": "Kingstown"
      },
      {
        "name": "Kingstown Park",
        "center": [
          13.15924,
          -61.23161
        ],
        "label": "Kingstown Park"
      },
      {
        "name": "Layou",
        "center": [
          13.20175,
          -61.27014
        ],
        "label": "Layou"
      },
      {
        "name": "Port Elizabeth",
        "center": [
          13.01102,
          -61.23548
        ],
        "label": "Port Elizabeth"
      }
    ]
  },
  {
    "code": "BL",
    "name": "Saint-Barthelemy",
    "cities": [
      {
        "name": "Saint-Barthelemy City",
        "center": [
          18.5,
          -63.41666666
        ],
        "label": "Saint-Barthelemy (Capital / Main)"
      }
    ]
  },
  {
    "code": "MF",
    "name": "Saint-Martin (French part)",
    "cities": [
      {
        "name": "Saint-Martin (French part) City",
        "center": [
          18.08333333,
          -63.95
        ],
        "label": "Saint-Martin (French part) (Capital / Main)"
      }
    ]
  },
  {
    "code": "WS",
    "name": "Samoa",
    "cities": [
      {
        "name": "Afega",
        "center": [
          -13.79726,
          -171.85308
        ],
        "label": "Afega"
      },
      {
        "name": "Apia",
        "center": [
          -13.83333,
          -171.76666
        ],
        "label": "Apia"
      },
      {
        "name": "Asau",
        "center": [
          -13.51963,
          -172.63784
        ],
        "label": "Asau"
      },
      {
        "name": "Falefa",
        "center": [
          -13.88695,
          -171.58805
        ],
        "label": "Falefa"
      },
      {
        "name": "Fasito‘outa",
        "center": [
          -13.81163,
          -171.94063
        ],
        "label": "Fasito‘outa"
      },
      {
        "name": "Gataivai",
        "center": [
          -13.7736,
          -172.38802
        ],
        "label": "Gataivai"
      },
      {
        "name": "Leulumoega",
        "center": [
          -13.82297,
          -171.96127
        ],
        "label": "Leulumoega"
      },
      {
        "name": "Lotofagā",
        "center": [
          -13.97643,
          -171.85781
        ],
        "label": "Lotofagā"
      },
      {
        "name": "Lufilufi",
        "center": [
          -13.87449,
          -171.59857
        ],
        "label": "Lufilufi"
      },
      {
        "name": "Malie",
        "center": [
          -13.80044,
          -171.8469
        ],
        "label": "Malie"
      },
      {
        "name": "Matavai",
        "center": [
          -14.03208,
          -171.64768
        ],
        "label": "Matavai"
      },
      {
        "name": "Mulifanua",
        "center": [
          -13.83183,
          -172.03602
        ],
        "label": "Mulifanua"
      },
      {
        "name": "Nofoali‘i",
        "center": [
          -13.8217,
          -171.95873
        ],
        "label": "Nofoali‘i"
      },
      {
        "name": "Safotu",
        "center": [
          -13.45132,
          -172.40177
        ],
        "label": "Safotu"
      },
      {
        "name": "Samamea",
        "center": [
          -13.93375,
          -171.53122
        ],
        "label": "Samamea"
      },
      {
        "name": "Satapuala",
        "center": [
          -13.83535,
          -171.97963
        ],
        "label": "Satapuala"
      },
      {
        "name": "Solosolo",
        "center": [
          -13.87504,
          -171.64181
        ],
        "label": "Solosolo"
      },
      {
        "name": "Vailima",
        "center": [
          -13.86417,
          -171.76126
        ],
        "label": "Vailima"
      },
      {
        "name": "Vailoa",
        "center": [
          -13.75551,
          -172.30698
        ],
        "label": "Vailoa"
      },
      {
        "name": "Vaiusu",
        "center": [
          -13.82678,
          -171.79333
        ],
        "label": "Vaiusu"
      }
    ]
  },
  {
    "code": "SM",
    "name": "San Marino",
    "cities": [
      {
        "name": "Acquaviva",
        "center": [
          43.94593,
          12.4185
        ],
        "label": "Acquaviva"
      },
      {
        "name": "Borgo Maggiore",
        "center": [
          43.94193,
          12.44738
        ],
        "label": "Borgo Maggiore"
      },
      {
        "name": "Domagnano",
        "center": [
          43.94961,
          12.46828
        ],
        "label": "Domagnano"
      },
      {
        "name": "Faetano",
        "center": [
          43.92831,
          12.49798
        ],
        "label": "Faetano"
      },
      {
        "name": "Fiorentino",
        "center": [
          43.91001,
          12.45738
        ],
        "label": "Fiorentino"
      },
      {
        "name": "Monte Giardino",
        "center": [
          43.90878,
          12.48201
        ],
        "label": "Monte Giardino"
      },
      {
        "name": "Poggio di Chiesanuova",
        "center": [
          43.90451,
          12.42142
        ],
        "label": "Poggio di Chiesanuova"
      },
      {
        "name": "San Marino",
        "center": [
          43.93667,
          12.44639
        ],
        "label": "San Marino"
      },
      {
        "name": "Serravalle",
        "center": [
          43.96897,
          12.48167
        ],
        "label": "Serravalle"
      }
    ]
  },
  {
    "code": "ST",
    "name": "Sao Tome and Principe",
    "cities": [
      {
        "name": "Cantagalo District",
        "center": [
          0.21667,
          6.7
        ],
        "label": "Cantagalo District"
      },
      {
        "name": "Caué District",
        "center": [
          0.13415,
          6.63825
        ],
        "label": "Caué District"
      },
      {
        "name": "Santo António",
        "center": [
          1.63943,
          7.41951
        ],
        "label": "Santo António"
      },
      {
        "name": "São Tomé",
        "center": [
          0.33654,
          6.72732
        ],
        "label": "São Tomé"
      },
      {
        "name": "Trindade",
        "center": [
          0.29667,
          6.68139
        ],
        "label": "Trindade"
      }
    ]
  },
  {
    "code": "SA",
    "name": "Saudi Arabia",
    "cities": [
      {
        "name": "Riyadh, Olaya & KAFD",
        "center": [
          24.7136,
          46.6753
        ],
        "label": "Riyadh (Olaya / KAFD)"
      },
      {
        "name": "Jeddah, Corniche & Al-Balad",
        "center": [
          21.5433,
          39.1728
        ],
        "label": "Jeddah (Corniche / Al-Balad)"
      },
      {
        "name": "Dammam & Al Khobar",
        "center": [
          26.4207,
          50.0888
        ],
        "label": "Dammam & Al Khobar"
      },
      {
        "name": "Mecca",
        "center": [
          21.4225,
          39.8262
        ],
        "label": "Mecca"
      },
      {
        "name": "Medina",
        "center": [
          24.4539,
          39.6142
        ],
        "label": "Medina"
      },
      {
        "name": "Tabuk",
        "center": [
          28.3835,
          36.5662
        ],
        "label": "Tabuk"
      },
      {
        "name": "Taif",
        "center": [
          21.2854,
          40.4222
        ],
        "label": "Taif"
      },
      {
        "name": "Abha",
        "center": [
          18.2164,
          42.5053
        ],
        "label": "Abha"
      }
    ]
  },
  {
    "code": "SN",
    "name": "Senegal",
    "cities": [
      {
        "name": "Adéane",
        "center": [
          12.63,
          -16.01694
        ],
        "label": "Adéane"
      },
      {
        "name": "Bignona",
        "center": [
          12.81028,
          -16.22639
        ],
        "label": "Bignona"
      },
      {
        "name": "Dakar",
        "center": [
          14.6937,
          -17.44406
        ],
        "label": "Dakar"
      },
      {
        "name": "Dakar Department",
        "center": [
          14.71403,
          -17.45534
        ],
        "label": "Dakar Department"
      },
      {
        "name": "Dara",
        "center": [
          15.34844,
          -15.47993
        ],
        "label": "Dara"
      },
      {
        "name": "Diawara",
        "center": [
          15.02196,
          -12.54374
        ],
        "label": "Diawara"
      },
      {
        "name": "Diofior",
        "center": [
          14.18333,
          -16.66667
        ],
        "label": "Diofior"
      },
      {
        "name": "Département de Salémata",
        "center": [
          12.59971,
          -12.77619
        ],
        "label": "Département de Salémata"
      },
      {
        "name": "Fatick Department",
        "center": [
          14.25909,
          -16.49884
        ],
        "label": "Fatick Department"
      },
      {
        "name": "Foundiougne",
        "center": [
          14.13333,
          -16.46667
        ],
        "label": "Foundiougne"
      },
      {
        "name": "Gandiaye",
        "center": [
          14.23333,
          -16.26667
        ],
        "label": "Gandiaye"
      },
      {
        "name": "Goléré",
        "center": [
          16.25575,
          -14.10165
        ],
        "label": "Goléré"
      },
      {
        "name": "Goudomp Department",
        "center": [
          12.57778,
          -15.87222
        ],
        "label": "Goudomp Department"
      },
      {
        "name": "Guinguinéo",
        "center": [
          14.26667,
          -15.95
        ],
        "label": "Guinguinéo"
      },
      {
        "name": "Guédiawaye Department",
        "center": [
          14.7761,
          -17.3956
        ],
        "label": "Guédiawaye Department"
      },
      {
        "name": "Guéoul",
        "center": [
          15.48333,
          -16.35
        ],
        "label": "Guéoul"
      },
      {
        "name": "Joal-Fadiout",
        "center": [
          14.16667,
          -16.83333
        ],
        "label": "Joal-Fadiout"
      },
      {
        "name": "Kaffrine",
        "center": [
          14.10594,
          -15.5508
        ],
        "label": "Kaffrine"
      },
      {
        "name": "Kanel",
        "center": [
          15.4916,
          -13.17627
        ],
        "label": "Kanel"
      },
      {
        "name": "Kaolack",
        "center": [
          14.15197,
          -16.07259
        ],
        "label": "Kaolack"
      }
    ]
  },
  {
    "code": "RS",
    "name": "Serbia",
    "cities": [
      {
        "name": "Adorjan",
        "center": [
          46.00333,
          20.04007
        ],
        "label": "Adorjan"
      },
      {
        "name": "Aleksandrovo",
        "center": [
          45.63755,
          20.59288
        ],
        "label": "Aleksandrovo"
      },
      {
        "name": "Alibunar",
        "center": [
          45.08083,
          20.96583
        ],
        "label": "Alibunar"
      },
      {
        "name": "Apatin",
        "center": [
          45.6726,
          18.978
        ],
        "label": "Apatin"
      },
      {
        "name": "Aradac",
        "center": [
          45.38346,
          20.30137
        ],
        "label": "Aradac"
      },
      {
        "name": "Aranđelovac",
        "center": [
          44.30694,
          20.56
        ],
        "label": "Aranđelovac"
      },
      {
        "name": "Arilje",
        "center": [
          43.75306,
          20.09556
        ],
        "label": "Arilje"
      },
      {
        "name": "Badovinci",
        "center": [
          44.78534,
          19.37146
        ],
        "label": "Badovinci"
      },
      {
        "name": "Bajina Bašta",
        "center": [
          43.97083,
          19.5675
        ],
        "label": "Bajina Bašta"
      },
      {
        "name": "Banatska Topola",
        "center": [
          45.67248,
          20.4653
        ],
        "label": "Banatska Topola"
      },
      {
        "name": "Banatski Despotovac",
        "center": [
          45.36606,
          20.66407
        ],
        "label": "Banatski Despotovac"
      },
      {
        "name": "Banatski Dvor",
        "center": [
          45.51866,
          20.51146
        ],
        "label": "Banatski Dvor"
      },
      {
        "name": "Banatski Karlovac",
        "center": [
          45.04987,
          21.018
        ],
        "label": "Banatski Karlovac"
      },
      {
        "name": "Banatsko Karađorđevo",
        "center": [
          45.58693,
          20.56421
        ],
        "label": "Banatsko Karađorđevo"
      },
      {
        "name": "Banatsko Veliko Selo",
        "center": [
          45.81961,
          20.60772
        ],
        "label": "Banatsko Veliko Selo"
      },
      {
        "name": "Banovo Polje",
        "center": [
          44.9104,
          19.44916
        ],
        "label": "Banovo Polje"
      },
      {
        "name": "Baranda",
        "center": [
          45.08459,
          20.44264
        ],
        "label": "Baranda"
      },
      {
        "name": "Barice",
        "center": [
          45.18189,
          21.08279
        ],
        "label": "Barice"
      },
      {
        "name": "Barič",
        "center": [
          44.6507,
          20.25941
        ],
        "label": "Barič"
      },
      {
        "name": "Bačka Palanka",
        "center": [
          45.24966,
          19.39664
        ],
        "label": "Bačka Palanka"
      }
    ]
  },
  {
    "code": "SC",
    "name": "Seychelles",
    "cities": [
      {
        "name": "Anse Boileau",
        "center": [
          -4.71667,
          55.48333
        ],
        "label": "Anse Boileau"
      },
      {
        "name": "Anse Royale",
        "center": [
          -4.73333,
          55.51667
        ],
        "label": "Anse Royale"
      },
      {
        "name": "Beau Vallon",
        "center": [
          -4.62091,
          55.43015
        ],
        "label": "Beau Vallon"
      },
      {
        "name": "Bel Ombre",
        "center": [
          -4.61667,
          55.41667
        ],
        "label": "Bel Ombre"
      },
      {
        "name": "Cascade",
        "center": [
          -4.66667,
          55.5
        ],
        "label": "Cascade"
      },
      {
        "name": "Port Glaud",
        "center": [
          -4.66667,
          55.41667
        ],
        "label": "Port Glaud"
      },
      {
        "name": "Takamaka",
        "center": [
          -4.76667,
          55.5
        ],
        "label": "Takamaka"
      },
      {
        "name": "Victoria",
        "center": [
          -4.62001,
          55.45501
        ],
        "label": "Victoria"
      }
    ]
  },
  {
    "code": "SL",
    "name": "Sierra Leone",
    "cities": [
      {
        "name": "Alikalia",
        "center": [
          9.15356,
          -11.38712
        ],
        "label": "Alikalia"
      },
      {
        "name": "Baiima",
        "center": [
          8.10826,
          -11.84772
        ],
        "label": "Baiima"
      },
      {
        "name": "Baoma",
        "center": [
          7.99344,
          -11.71468
        ],
        "label": "Baoma"
      },
      {
        "name": "Barma",
        "center": [
          8.34959,
          -11.33059
        ],
        "label": "Barma"
      },
      {
        "name": "Bindi",
        "center": [
          9.91376,
          -11.44669
        ],
        "label": "Bindi"
      },
      {
        "name": "Binkolo",
        "center": [
          8.95225,
          -11.98029
        ],
        "label": "Binkolo"
      },
      {
        "name": "Blama",
        "center": [
          7.87481,
          -11.34548
        ],
        "label": "Blama"
      },
      {
        "name": "Bo",
        "center": [
          7.96472,
          -11.73833
        ],
        "label": "Bo"
      },
      {
        "name": "Bo District",
        "center": [
          7.98877,
          -11.6734
        ],
        "label": "Bo District"
      },
      {
        "name": "Boajibu",
        "center": [
          8.18763,
          -11.34026
        ],
        "label": "Boajibu"
      },
      {
        "name": "Bombali District",
        "center": [
          9.28444,
          -12.16449
        ],
        "label": "Bombali District"
      },
      {
        "name": "Bomi",
        "center": [
          7.24611,
          -11.52583
        ],
        "label": "Bomi"
      },
      {
        "name": "Bonthe",
        "center": [
          7.52639,
          -12.505
        ],
        "label": "Bonthe"
      },
      {
        "name": "Bonthe District",
        "center": [
          7.51622,
          -12.33591
        ],
        "label": "Bonthe District"
      },
      {
        "name": "Buedu",
        "center": [
          8.2796,
          -10.37135
        ],
        "label": "Buedu"
      },
      {
        "name": "Bumbuna",
        "center": [
          9.04466,
          -11.74576
        ],
        "label": "Bumbuna"
      },
      {
        "name": "Bumpe",
        "center": [
          7.89209,
          -11.90541
        ],
        "label": "Bumpe"
      },
      {
        "name": "Bunumbu",
        "center": [
          8.17421,
          -10.86432
        ],
        "label": "Bunumbu"
      },
      {
        "name": "Daru",
        "center": [
          7.98976,
          -10.84223
        ],
        "label": "Daru"
      },
      {
        "name": "Foindu",
        "center": [
          7.40906,
          -11.54328
        ],
        "label": "Foindu"
      }
    ]
  },
  {
    "code": "SG",
    "name": "Singapore",
    "cities": [
      {
        "name": "Singapore",
        "center": [
          1.28967,
          103.85007
        ],
        "label": "Singapore"
      },
      {
        "name": "Woodlands",
        "center": [
          1.43801,
          103.78877
        ],
        "label": "Woodlands"
      }
    ]
  },
  {
    "code": "SX",
    "name": "Sint Maarten (Dutch part)",
    "cities": [
      {
        "name": "Philipsburg",
        "center": [
          18.0255,
          -63.0456
        ],
        "label": "Philipsburg"
      }
    ]
  },
  {
    "code": "SK",
    "name": "Slovakia",
    "cities": [
      {
        "name": "Banská Bystrica",
        "center": [
          48.73946,
          19.15349
        ],
        "label": "Banská Bystrica"
      },
      {
        "name": "Banská Štiavnica",
        "center": [
          48.44858,
          18.91003
        ],
        "label": "Banská Štiavnica"
      },
      {
        "name": "Bardejov",
        "center": [
          49.29175,
          21.27271
        ],
        "label": "Bardejov"
      },
      {
        "name": "Bojnice",
        "center": [
          48.78511,
          18.5864
        ],
        "label": "Bojnice"
      },
      {
        "name": "Bratislava",
        "center": [
          48.14816,
          17.10674
        ],
        "label": "Bratislava"
      },
      {
        "name": "Bratislava - Vajnory",
        "center": [
          48.20563,
          17.20759
        ],
        "label": "Bratislava - Vajnory"
      },
      {
        "name": "Brezno",
        "center": [
          48.80431,
          19.63631
        ],
        "label": "Brezno"
      },
      {
        "name": "Brezová pod Bradlom",
        "center": [
          48.66349,
          17.53905
        ],
        "label": "Brezová pod Bradlom"
      },
      {
        "name": "Bytča",
        "center": [
          49.22404,
          18.55878
        ],
        "label": "Bytča"
      },
      {
        "name": "Bánovce nad Bebravou",
        "center": [
          48.7213,
          18.25754
        ],
        "label": "Bánovce nad Bebravou"
      },
      {
        "name": "Chlmec",
        "center": [
          48.88628,
          21.9393
        ],
        "label": "Chlmec"
      },
      {
        "name": "Detva",
        "center": [
          48.56082,
          19.41954
        ],
        "label": "Detva"
      },
      {
        "name": "Dobšiná",
        "center": [
          48.82073,
          20.36988
        ],
        "label": "Dobšiná"
      },
      {
        "name": "Dolný Kubín",
        "center": [
          49.20983,
          19.30341
        ],
        "label": "Dolný Kubín"
      },
      {
        "name": "Dubnica nad Váhom",
        "center": [
          48.95981,
          18.16634
        ],
        "label": "Dubnica nad Váhom"
      },
      {
        "name": "Dudince",
        "center": [
          48.17135,
          18.88782
        ],
        "label": "Dudince"
      },
      {
        "name": "Dunajská Lužná",
        "center": [
          48.08347,
          17.26072
        ],
        "label": "Dunajská Lužná"
      },
      {
        "name": "Dunajská Streda",
        "center": [
          47.99268,
          17.61211
        ],
        "label": "Dunajská Streda"
      },
      {
        "name": "Fiľakovo",
        "center": [
          48.26757,
          19.82473
        ],
        "label": "Fiľakovo"
      },
      {
        "name": "Gabčíkovo",
        "center": [
          47.89211,
          17.57884
        ],
        "label": "Gabčíkovo"
      }
    ]
  },
  {
    "code": "SI",
    "name": "Slovenia",
    "cities": [
      {
        "name": "Ajdovščina",
        "center": [
          45.88601,
          13.90946
        ],
        "label": "Ajdovščina"
      },
      {
        "name": "Ankaran",
        "center": [
          45.57861,
          13.73611
        ],
        "label": "Ankaran"
      },
      {
        "name": "Apače",
        "center": [
          46.69722,
          15.91056
        ],
        "label": "Apače"
      },
      {
        "name": "Bakovci",
        "center": [
          46.61889,
          16.15028
        ],
        "label": "Bakovci"
      },
      {
        "name": "Beltinci",
        "center": [
          46.60528,
          16.24056
        ],
        "label": "Beltinci"
      },
      {
        "name": "Benedikt",
        "center": [
          46.60861,
          15.88833
        ],
        "label": "Benedikt"
      },
      {
        "name": "Bilje",
        "center": [
          45.89444,
          13.63222
        ],
        "label": "Bilje"
      },
      {
        "name": "Bistrica ob Dravi",
        "center": [
          46.55419,
          15.54855
        ],
        "label": "Bistrica ob Dravi"
      },
      {
        "name": "Bistrica ob Sotli",
        "center": [
          46.05889,
          15.66417
        ],
        "label": "Bistrica ob Sotli"
      },
      {
        "name": "Bistrica pri Tržiču",
        "center": [
          46.35472,
          14.29167
        ],
        "label": "Bistrica pri Tržiču"
      },
      {
        "name": "Bled",
        "center": [
          46.36917,
          14.11361
        ],
        "label": "Bled"
      },
      {
        "name": "Bohinjska Bistrica",
        "center": [
          46.27216,
          13.9535
        ],
        "label": "Bohinjska Bistrica"
      },
      {
        "name": "Borovnica",
        "center": [
          45.91583,
          14.36306
        ],
        "label": "Borovnica"
      },
      {
        "name": "Bovec",
        "center": [
          46.33808,
          13.55245
        ],
        "label": "Bovec"
      },
      {
        "name": "Braslovče",
        "center": [
          46.28972,
          15.03889
        ],
        "label": "Braslovče"
      },
      {
        "name": "Bresternica",
        "center": [
          46.56972,
          15.575
        ],
        "label": "Bresternica"
      },
      {
        "name": "Brezovica pri Ljubljani",
        "center": [
          46.03333,
          14.4
        ],
        "label": "Brezovica pri Ljubljani"
      },
      {
        "name": "Brežice",
        "center": [
          45.90333,
          15.59111
        ],
        "label": "Brežice"
      },
      {
        "name": "Britof",
        "center": [
          46.26024,
          14.39037
        ],
        "label": "Britof"
      },
      {
        "name": "Cankova",
        "center": [
          46.72083,
          16.0225
        ],
        "label": "Cankova"
      }
    ]
  },
  {
    "code": "SB",
    "name": "Solomon Islands",
    "cities": [
      {
        "name": "Auki",
        "center": [
          -8.76778,
          160.69778
        ],
        "label": "Auki"
      },
      {
        "name": "Buala",
        "center": [
          -8.14497,
          159.59212
        ],
        "label": "Buala"
      },
      {
        "name": "Gizo",
        "center": [
          -8.10303,
          156.84186
        ],
        "label": "Gizo"
      },
      {
        "name": "Honiara",
        "center": [
          -9.43333,
          159.95
        ],
        "label": "Honiara"
      },
      {
        "name": "Kirakira",
        "center": [
          -10.45442,
          161.92045
        ],
        "label": "Kirakira"
      },
      {
        "name": "Lata",
        "center": [
          -10.725,
          165.79722
        ],
        "label": "Lata"
      },
      {
        "name": "Tulagi",
        "center": [
          -9.10306,
          160.15056
        ],
        "label": "Tulagi"
      }
    ]
  },
  {
    "code": "SO",
    "name": "Somalia",
    "cities": [
      {
        "name": "Afgooye",
        "center": [
          2.1381,
          45.1212
        ],
        "label": "Afgooye"
      },
      {
        "name": "Baardheere",
        "center": [
          2.34464,
          42.27644
        ],
        "label": "Baardheere"
      },
      {
        "name": "Baidoa",
        "center": [
          3.11383,
          43.6498
        ],
        "label": "Baidoa"
      },
      {
        "name": "Bandarbeyla",
        "center": [
          9.4942,
          50.8122
        ],
        "label": "Bandarbeyla"
      },
      {
        "name": "Bargaal",
        "center": [
          11.28636,
          51.0773
        ],
        "label": "Bargaal"
      },
      {
        "name": "Beledweyne",
        "center": [
          4.73583,
          45.20361
        ],
        "label": "Beledweyne"
      },
      {
        "name": "Bereeda",
        "center": [
          11.87037,
          51.05795
        ],
        "label": "Bereeda"
      },
      {
        "name": "Bosaso",
        "center": [
          11.28421,
          49.18158
        ],
        "label": "Bosaso"
      },
      {
        "name": "Burao",
        "center": [
          9.52213,
          45.53363
        ],
        "label": "Burao"
      },
      {
        "name": "Buulobarde",
        "center": [
          3.85375,
          45.56744
        ],
        "label": "Buulobarde"
      },
      {
        "name": "Buur Gaabo",
        "center": [
          -1.21917,
          41.83725
        ],
        "label": "Buur Gaabo"
      },
      {
        "name": "Buurhakaba",
        "center": [
          2.80257,
          44.07805
        ],
        "label": "Buurhakaba"
      },
      {
        "name": "Cadale",
        "center": [
          2.7603,
          46.3222
        ],
        "label": "Cadale"
      },
      {
        "name": "Caluula",
        "center": [
          11.96611,
          50.75694
        ],
        "label": "Caluula"
      },
      {
        "name": "Ceek",
        "center": [
          8.99907,
          45.35824
        ],
        "label": "Ceek"
      },
      {
        "name": "Ceelbuur",
        "center": [
          4.68501,
          46.6176
        ],
        "label": "Ceelbuur"
      },
      {
        "name": "Ceeldheer",
        "center": [
          3.84878,
          47.18064
        ],
        "label": "Ceeldheer"
      },
      {
        "name": "Ceerigaabo",
        "center": [
          10.61616,
          47.36795
        ],
        "label": "Ceerigaabo"
      },
      {
        "name": "Dhuusamarreeb",
        "center": [
          5.53597,
          46.38666
        ],
        "label": "Dhuusamarreeb"
      },
      {
        "name": "Dujuuma",
        "center": [
          1.25311,
          42.57377
        ],
        "label": "Dujuuma"
      }
    ]
  },
  {
    "code": "ZA",
    "name": "South Africa",
    "cities": [
      {
        "name": "Adelaide",
        "center": [
          -32.70747,
          26.29564
        ],
        "label": "Adelaide"
      },
      {
        "name": "Albertina",
        "center": [
          -34.20544,
          21.58001
        ],
        "label": "Albertina"
      },
      {
        "name": "Alberton",
        "center": [
          -26.26786,
          28.12225
        ],
        "label": "Alberton"
      },
      {
        "name": "Alfred Nzo District Municipality",
        "center": [
          -30.66803,
          29.1549
        ],
        "label": "Alfred Nzo District Municipality"
      },
      {
        "name": "Alice",
        "center": [
          -32.78749,
          26.8344
        ],
        "label": "Alice"
      },
      {
        "name": "Aliwal North",
        "center": [
          -30.69366,
          26.71141
        ],
        "label": "Aliwal North"
      },
      {
        "name": "Allanridge",
        "center": [
          -27.75431,
          26.64382
        ],
        "label": "Allanridge"
      },
      {
        "name": "Amajuba District Municipality",
        "center": [
          -27.73558,
          30.13537
        ],
        "label": "Amajuba District Municipality"
      },
      {
        "name": "Amathole District Municipality",
        "center": [
          -32.55895,
          27.45919
        ],
        "label": "Amathole District Municipality"
      },
      {
        "name": "Arniston",
        "center": [
          -34.66739,
          20.23086
        ],
        "label": "Arniston"
      },
      {
        "name": "Atlantis",
        "center": [
          -33.56668,
          18.48335
        ],
        "label": "Atlantis"
      },
      {
        "name": "Balfour",
        "center": [
          -26.66331,
          28.59016
        ],
        "label": "Balfour"
      },
      {
        "name": "Ballito",
        "center": [
          -29.53897,
          31.21439
        ],
        "label": "Ballito"
      },
      {
        "name": "Barberton",
        "center": [
          -25.78842,
          31.05319
        ],
        "label": "Barberton"
      },
      {
        "name": "Barkly West",
        "center": [
          -28.53537,
          24.52151
        ],
        "label": "Barkly West"
      },
      {
        "name": "Beaufort West",
        "center": [
          -32.35671,
          22.58295
        ],
        "label": "Beaufort West"
      },
      {
        "name": "Belfast",
        "center": [
          -25.68991,
          30.03504
        ],
        "label": "Belfast"
      },
      {
        "name": "Benoni",
        "center": [
          -26.18848,
          28.32078
        ],
        "label": "Benoni"
      },
      {
        "name": "Berea",
        "center": [
          -29.85185,
          30.99337
        ],
        "label": "Berea"
      },
      {
        "name": "Bergvliet",
        "center": [
          -34.04746,
          18.4525
        ],
        "label": "Bergvliet"
      }
    ]
  },
  {
    "code": "GS",
    "name": "South Georgia",
    "cities": [
      {
        "name": "South Georgia City",
        "center": [
          -54.5,
          -37
        ],
        "label": "South Georgia (Capital / Main)"
      }
    ]
  },
  {
    "code": "KR",
    "name": "South Korea",
    "cities": [
      {
        "name": "Andong",
        "center": [
          36.56636,
          128.72275
        ],
        "label": "Andong"
      },
      {
        "name": "Andong-si",
        "center": [
          36.56667,
          128.71667
        ],
        "label": "Andong-si"
      },
      {
        "name": "Ansan-si",
        "center": [
          37.32361,
          126.82194
        ],
        "label": "Ansan-si"
      },
      {
        "name": "Anseong",
        "center": [
          37.01083,
          127.27028
        ],
        "label": "Anseong"
      },
      {
        "name": "Anyang-si",
        "center": [
          37.3925,
          126.92694
        ],
        "label": "Anyang-si"
      },
      {
        "name": "Asan",
        "center": [
          36.78361,
          127.00417
        ],
        "label": "Asan"
      },
      {
        "name": "Asan-si",
        "center": [
          36.80791,
          126.97769
        ],
        "label": "Asan-si"
      },
      {
        "name": "Beolgyo",
        "center": [
          34.84897,
          127.34052
        ],
        "label": "Beolgyo"
      },
      {
        "name": "Boeun-gun",
        "center": [
          36.49489,
          127.72865
        ],
        "label": "Boeun-gun"
      },
      {
        "name": "Bonghwa-gun",
        "center": [
          36.88951,
          128.73573
        ],
        "label": "Bonghwa-gun"
      },
      {
        "name": "Boryeong",
        "center": [
          36.34931,
          126.59772
        ],
        "label": "Boryeong"
      },
      {
        "name": "Boryeong-si",
        "center": [
          36.35649,
          126.59444
        ],
        "label": "Boryeong-si"
      },
      {
        "name": "Boseong-gun",
        "center": [
          34.84622,
          127.22189
        ],
        "label": "Boseong-gun"
      },
      {
        "name": "Buan-gun",
        "center": [
          35.7,
          126.66667
        ],
        "label": "Buan-gun"
      },
      {
        "name": "Bucheon-si",
        "center": [
          37.5044,
          126.76625
        ],
        "label": "Bucheon-si"
      },
      {
        "name": "Buk-gu",
        "center": [
          35.19724,
          128.99134
        ],
        "label": "Buk-gu"
      },
      {
        "name": "Bupyeong-gu",
        "center": [
          37.4972,
          126.71107
        ],
        "label": "Bupyeong-gu"
      },
      {
        "name": "Busan",
        "center": [
          35.10168,
          129.03004
        ],
        "label": "Busan"
      },
      {
        "name": "Buyeo",
        "center": [
          36.27472,
          126.90906
        ],
        "label": "Buyeo"
      },
      {
        "name": "Buyeo-gun",
        "center": [
          36.26257,
          126.85802
        ],
        "label": "Buyeo-gun"
      }
    ]
  },
  {
    "code": "SS",
    "name": "South Sudan",
    "cities": [
      {
        "name": "Yirol",
        "center": [
          6.5525,
          30.49806
        ],
        "label": "Yirol"
      }
    ]
  },
  {
    "code": "ES",
    "name": "Spain",
    "cities": [
      {
        "name": "Madrid",
        "center": [
          40.4168,
          -3.7038
        ],
        "label": "Madrid"
      },
      {
        "name": "Barcelona",
        "center": [
          41.3879,
          2.1699
        ],
        "label": "Barcelona"
      },
      {
        "name": "Valencia",
        "center": [
          39.4699,
          -0.3763
        ],
        "label": "Valencia"
      },
      {
        "name": "Seville",
        "center": [
          37.3891,
          -5.9845
        ],
        "label": "Seville"
      },
      {
        "name": "Zaragoza",
        "center": [
          41.6488,
          -0.8891
        ],
        "label": "Zaragoza"
      },
      {
        "name": "Malaga",
        "center": [
          36.7213,
          -4.4217
        ],
        "label": "Malaga"
      },
      {
        "name": "Bilbao",
        "center": [
          43.263,
          -2.935
        ],
        "label": "Bilbao"
      },
      {
        "name": "Alicante",
        "center": [
          38.3452,
          -0.481
        ],
        "label": "Alicante"
      }
    ]
  },
  {
    "code": "LK",
    "name": "Sri Lanka",
    "cities": [
      {
        "name": "Akurana",
        "center": [
          7.365,
          80.617222
        ],
        "label": "Akurana"
      },
      {
        "name": "Alawatugoda",
        "center": [
          7.41048962,
          80.60918933
        ],
        "label": "Alawatugoda"
      },
      {
        "name": "Ambalangoda",
        "center": [
          6.2355,
          80.0538
        ],
        "label": "Ambalangoda"
      },
      {
        "name": "Ambatenna",
        "center": [
          7.35252855,
          80.61378113
        ],
        "label": "Ambatenna"
      },
      {
        "name": "Ampara",
        "center": [
          7.29754,
          81.68202
        ],
        "label": "Ampara"
      },
      {
        "name": "Ampara District",
        "center": [
          7.0833,
          81.75
        ],
        "label": "Ampara District"
      },
      {
        "name": "Anuradhapura",
        "center": [
          8.31223,
          80.41306
        ],
        "label": "Anuradhapura"
      },
      {
        "name": "Anuradhapura District",
        "center": [
          8.33333,
          80.5
        ],
        "label": "Anuradhapura District"
      },
      {
        "name": "Badulla",
        "center": [
          6.9802,
          81.0577
        ],
        "label": "Badulla"
      },
      {
        "name": "Badulla District",
        "center": [
          6.98472,
          81.05639
        ],
        "label": "Badulla District"
      },
      {
        "name": "Battaramulla South",
        "center": [
          6.8964,
          79.9181
        ],
        "label": "Battaramulla South"
      },
      {
        "name": "Batticaloa",
        "center": [
          7.7102,
          81.6924
        ],
        "label": "Batticaloa"
      },
      {
        "name": "Batticaloa District",
        "center": [
          7.75,
          81.4997
        ],
        "label": "Batticaloa District"
      },
      {
        "name": "Bentota",
        "center": [
          6.42598,
          79.99575
        ],
        "label": "Bentota"
      },
      {
        "name": "Beruwala",
        "center": [
          6.4788,
          79.9828
        ],
        "label": "Beruwala"
      },
      {
        "name": "Chilaw",
        "center": [
          7.57583,
          79.79528
        ],
        "label": "Chilaw"
      },
      {
        "name": "Colombo",
        "center": [
          6.93548,
          79.84868
        ],
        "label": "Colombo"
      },
      {
        "name": "Colombo District",
        "center": [
          6.8664,
          80.0166
        ],
        "label": "Colombo District"
      },
      {
        "name": "Dambulla",
        "center": [
          7.86,
          80.65167
        ],
        "label": "Dambulla"
      },
      {
        "name": "Daskara",
        "center": [
          7.20902217,
          80.57764643
        ],
        "label": "Daskara"
      }
    ]
  },
  {
    "code": "SD",
    "name": "Sudan",
    "cities": [
      {
        "name": "Abu Jibeha",
        "center": [
          11.4562,
          31.2285
        ],
        "label": "Abu Jibeha"
      },
      {
        "name": "Abū Zabad",
        "center": [
          12.35,
          29.25
        ],
        "label": "Abū Zabad"
      },
      {
        "name": "Ad Dabbah",
        "center": [
          18.05,
          30.95
        ],
        "label": "Ad Dabbah"
      },
      {
        "name": "Ad Dindar",
        "center": [
          13.2,
          34.16667
        ],
        "label": "Ad Dindar"
      },
      {
        "name": "Ad Douiem",
        "center": [
          14.0012,
          32.3116
        ],
        "label": "Ad Douiem"
      },
      {
        "name": "Ad-Damazin",
        "center": [
          11.7891,
          34.3592
        ],
        "label": "Ad-Damazin"
      },
      {
        "name": "Al Fūlah",
        "center": [
          11.73292,
          28.35786
        ],
        "label": "Al Fūlah"
      },
      {
        "name": "Al Hasaheisa",
        "center": [
          14.75264,
          33.29836
        ],
        "label": "Al Hasaheisa"
      },
      {
        "name": "Al Hilāliyya",
        "center": [
          14.9398,
          33.234
        ],
        "label": "Al Hilāliyya"
      },
      {
        "name": "Al Kawa",
        "center": [
          13.7463,
          32.4996
        ],
        "label": "Al Kawa"
      },
      {
        "name": "Al Kiremit al ‘Arakiyyīn",
        "center": [
          14.3476,
          32.9437
        ],
        "label": "Al Kiremit al ‘Arakiyyīn"
      },
      {
        "name": "Al Lagowa",
        "center": [
          11.4,
          29.13333
        ],
        "label": "Al Lagowa"
      },
      {
        "name": "Al Manāqil",
        "center": [
          14.2459,
          32.9891
        ],
        "label": "Al Manāqil"
      },
      {
        "name": "Al Masallamiyya",
        "center": [
          14.5748,
          33.3373
        ],
        "label": "Al Masallamiyya"
      },
      {
        "name": "Al Mijlad",
        "center": [
          11.03333,
          27.73333
        ],
        "label": "Al Mijlad"
      },
      {
        "name": "Al Qadarif",
        "center": [
          14.03493,
          35.38344
        ],
        "label": "Al Qadarif"
      },
      {
        "name": "Al Qiţena",
        "center": [
          14.8648,
          32.3668
        ],
        "label": "Al Qiţena"
      },
      {
        "name": "Al Ḩawātah",
        "center": [
          13.41667,
          34.63333
        ],
        "label": "Al Ḩawātah"
      },
      {
        "name": "An Nuhūd",
        "center": [
          12.7,
          28.43333
        ],
        "label": "An Nuhūd"
      },
      {
        "name": "Ar Rahad",
        "center": [
          12.71667,
          30.65
        ],
        "label": "Ar Rahad"
      }
    ]
  },
  {
    "code": "SR",
    "name": "Suriname",
    "cities": [
      {
        "name": "Albina",
        "center": [
          5.49788,
          -54.05522
        ],
        "label": "Albina"
      },
      {
        "name": "Brokopondo",
        "center": [
          5.05594,
          -54.98043
        ],
        "label": "Brokopondo"
      },
      {
        "name": "Brownsweg",
        "center": [
          5.00435,
          -55.15333
        ],
        "label": "Brownsweg"
      },
      {
        "name": "Groningen",
        "center": [
          5.8,
          -55.46667
        ],
        "label": "Groningen"
      },
      {
        "name": "Lelydorp",
        "center": [
          5.7,
          -55.23333
        ],
        "label": "Lelydorp"
      },
      {
        "name": "Mariënburg",
        "center": [
          5.87722,
          -55.04322
        ],
        "label": "Mariënburg"
      },
      {
        "name": "Moengo",
        "center": [
          5.61411,
          -54.40121
        ],
        "label": "Moengo"
      },
      {
        "name": "Nieuw Amsterdam",
        "center": [
          5.88573,
          -55.08871
        ],
        "label": "Nieuw Amsterdam"
      },
      {
        "name": "Nieuw Nickerie",
        "center": [
          5.92606,
          -56.97297
        ],
        "label": "Nieuw Nickerie"
      },
      {
        "name": "Onverwacht",
        "center": [
          5.58983,
          -55.19462
        ],
        "label": "Onverwacht"
      },
      {
        "name": "Paramaribo",
        "center": [
          5.86638,
          -55.16682
        ],
        "label": "Paramaribo"
      },
      {
        "name": "Totness",
        "center": [
          5.87618,
          -56.32572
        ],
        "label": "Totness"
      },
      {
        "name": "Wageningen",
        "center": [
          5.7601,
          -56.66523
        ],
        "label": "Wageningen"
      }
    ]
  },
  {
    "code": "SJ",
    "name": "Svalbard And Jan Mayen Islands",
    "cities": [
      {
        "name": "Svalbard And Jan Mayen Islands City",
        "center": [
          78,
          20
        ],
        "label": "Svalbard And Jan Mayen Islands (Capital / Main)"
      }
    ]
  },
  {
    "code": "SZ",
    "name": "Swaziland",
    "cities": [
      {
        "name": "Bhunya",
        "center": [
          -26.55,
          31.01667
        ],
        "label": "Bhunya"
      },
      {
        "name": "Big Bend",
        "center": [
          -26.81667,
          31.93333
        ],
        "label": "Big Bend"
      },
      {
        "name": "Bulembu",
        "center": [
          -25.96667,
          31.13333
        ],
        "label": "Bulembu"
      },
      {
        "name": "Dvokodvweni Inkhundla",
        "center": [
          -26.45398,
          31.76456
        ],
        "label": "Dvokodvweni Inkhundla"
      },
      {
        "name": "Ekukhanyeni",
        "center": [
          -26.3875,
          31.52806
        ],
        "label": "Ekukhanyeni"
      },
      {
        "name": "Hhukwini",
        "center": [
          -26.31972,
          31.22222
        ],
        "label": "Hhukwini"
      },
      {
        "name": "Hlatikulu",
        "center": [
          -26.97917,
          31.32444
        ],
        "label": "Hlatikulu"
      },
      {
        "name": "Hluti",
        "center": [
          -27.21667,
          31.61667
        ],
        "label": "Hluti"
      },
      {
        "name": "Kubuta",
        "center": [
          -26.88333,
          31.48333
        ],
        "label": "Kubuta"
      },
      {
        "name": "Kwaluseni",
        "center": [
          -26.48333,
          31.33333
        ],
        "label": "Kwaluseni"
      },
      {
        "name": "Lavumisa",
        "center": [
          -27.31005,
          31.89198
        ],
        "label": "Lavumisa"
      },
      {
        "name": "Lobamba",
        "center": [
          -26.46667,
          31.2
        ],
        "label": "Lobamba"
      },
      {
        "name": "Lomashasha",
        "center": [
          -26.06644,
          32.00768
        ],
        "label": "Lomashasha"
      },
      {
        "name": "Malkerns",
        "center": [
          -26.56667,
          31.18333
        ],
        "label": "Malkerns"
      },
      {
        "name": "Manzini",
        "center": [
          -26.49884,
          31.38004
        ],
        "label": "Manzini"
      },
      {
        "name": "Manzini South",
        "center": [
          -26.48333,
          31.36667
        ],
        "label": "Manzini South"
      },
      {
        "name": "Matsanjeni",
        "center": [
          -27.21585,
          31.72309
        ],
        "label": "Matsanjeni"
      },
      {
        "name": "Mbabane",
        "center": [
          -26.31667,
          31.13333
        ],
        "label": "Mbabane"
      },
      {
        "name": "Mhlambanyatsi",
        "center": [
          -26.45,
          31.01667
        ],
        "label": "Mhlambanyatsi"
      },
      {
        "name": "Mhlume",
        "center": [
          -26.03333,
          31.85
        ],
        "label": "Mhlume"
      }
    ]
  },
  {
    "code": "SE",
    "name": "Sweden",
    "cities": [
      {
        "name": "Abborrberget",
        "center": [
          60.15,
          14.8
        ],
        "label": "Abborrberget"
      },
      {
        "name": "Akalla",
        "center": [
          59.41465,
          17.91398
        ],
        "label": "Akalla"
      },
      {
        "name": "Alafors",
        "center": [
          57.92579,
          12.07835
        ],
        "label": "Alafors"
      },
      {
        "name": "Alby",
        "center": [
          59.2335,
          17.8538
        ],
        "label": "Alby"
      },
      {
        "name": "Alfta",
        "center": [
          61.34675,
          16.07499
        ],
        "label": "Alfta"
      },
      {
        "name": "Alingsås",
        "center": [
          57.93033,
          12.53345
        ],
        "label": "Alingsås"
      },
      {
        "name": "Alsike",
        "center": [
          59.75324,
          17.77331
        ],
        "label": "Alsike"
      },
      {
        "name": "Alunda",
        "center": [
          60.26667,
          18.4
        ],
        "label": "Alunda"
      },
      {
        "name": "Alvesta",
        "center": [
          56.89935,
          14.55559
        ],
        "label": "Alvesta"
      },
      {
        "name": "Andalen",
        "center": [
          57.70039,
          11.76136
        ],
        "label": "Andalen"
      },
      {
        "name": "Anderslöv",
        "center": [
          55.43836,
          13.31966
        ],
        "label": "Anderslöv"
      },
      {
        "name": "Anderstorp",
        "center": [
          57.28333,
          13.63333
        ],
        "label": "Anderstorp"
      },
      {
        "name": "Aneby",
        "center": [
          57.83895,
          14.81016
        ],
        "label": "Aneby"
      },
      {
        "name": "Angered",
        "center": [
          57.78628,
          12.09852
        ],
        "label": "Angered"
      },
      {
        "name": "Ankarsrum",
        "center": [
          57.69896,
          16.33407
        ],
        "label": "Ankarsrum"
      },
      {
        "name": "Anneberg",
        "center": [
          60.24167,
          18.41667
        ],
        "label": "Anneberg"
      },
      {
        "name": "Annelund",
        "center": [
          57.98843,
          13.07483
        ],
        "label": "Annelund"
      },
      {
        "name": "Arboga",
        "center": [
          59.39387,
          15.83882
        ],
        "label": "Arboga"
      },
      {
        "name": "Arbrå",
        "center": [
          61.46667,
          16.38333
        ],
        "label": "Arbrå"
      },
      {
        "name": "Arjeplog",
        "center": [
          66.05173,
          17.88606
        ],
        "label": "Arjeplog"
      }
    ]
  },
  {
    "code": "CH",
    "name": "Switzerland",
    "cities": [
      {
        "name": "Aadorf",
        "center": [
          47.49204,
          8.90099
        ],
        "label": "Aadorf"
      },
      {
        "name": "Aarau",
        "center": [
          47.39254,
          8.04422
        ],
        "label": "Aarau"
      },
      {
        "name": "Aarberg",
        "center": [
          47.04439,
          7.27578
        ],
        "label": "Aarberg"
      },
      {
        "name": "Aarburg",
        "center": [
          47.32067,
          7.89986
        ],
        "label": "Aarburg"
      },
      {
        "name": "Aarwangen",
        "center": [
          47.23845,
          7.76854
        ],
        "label": "Aarwangen"
      },
      {
        "name": "Acquarossa",
        "center": [
          46.45473,
          8.94261
        ],
        "label": "Acquarossa"
      },
      {
        "name": "Adelboden",
        "center": [
          46.49142,
          7.56031
        ],
        "label": "Adelboden"
      },
      {
        "name": "Adligenswil",
        "center": [
          47.06521,
          8.36124
        ],
        "label": "Adligenswil"
      },
      {
        "name": "Adliswil",
        "center": [
          47.30997,
          8.52462
        ],
        "label": "Adliswil"
      },
      {
        "name": "Adliswil / Adliswil (Stadtkern)",
        "center": [
          47.31128,
          8.52675
        ],
        "label": "Adliswil / Adliswil (Stadtkern)"
      },
      {
        "name": "Adliswil / Hündli-Zopf",
        "center": [
          47.31637,
          8.51888
        ],
        "label": "Adliswil / Hündli-Zopf"
      },
      {
        "name": "Adliswil / Oberleimbach",
        "center": [
          47.3202,
          8.51508
        ],
        "label": "Adliswil / Oberleimbach"
      },
      {
        "name": "Adliswil / Sonnenberg",
        "center": [
          47.30958,
          8.52055
        ],
        "label": "Adliswil / Sonnenberg"
      },
      {
        "name": "Adliswil / Sood",
        "center": [
          47.3187,
          8.52425
        ],
        "label": "Adliswil / Sood"
      },
      {
        "name": "Adliswil / Tal",
        "center": [
          47.31142,
          8.53446
        ],
        "label": "Adliswil / Tal"
      },
      {
        "name": "Aesch",
        "center": [
          47.47104,
          7.5973
        ],
        "label": "Aesch"
      },
      {
        "name": "Aeschi b. Spiez",
        "center": [
          46.65848,
          7.6965
        ],
        "label": "Aeschi b. Spiez"
      },
      {
        "name": "Affeltrangen",
        "center": [
          47.52581,
          9.03307
        ],
        "label": "Affeltrangen"
      },
      {
        "name": "Affoltern / Hasenbüel",
        "center": [
          47.27324,
          8.45218
        ],
        "label": "Affoltern / Hasenbüel"
      },
      {
        "name": "Affoltern / Oberdorf",
        "center": [
          47.27852,
          8.45651
        ],
        "label": "Affoltern / Oberdorf"
      }
    ]
  },
  {
    "code": "SY",
    "name": "Syria",
    "cities": [
      {
        "name": "Ad Darbāsīyah",
        "center": [
          37.07279,
          40.65199
        ],
        "label": "Ad Darbāsīyah"
      },
      {
        "name": "Ad Duraykīsh",
        "center": [
          34.89514,
          36.14303
        ],
        "label": "Ad Duraykīsh"
      },
      {
        "name": "Ad Dānā",
        "center": [
          36.21254,
          36.76998
        ],
        "label": "Ad Dānā"
      },
      {
        "name": "Afrin District",
        "center": [
          36.54891,
          36.79295
        ],
        "label": "Afrin District"
      },
      {
        "name": "Al Atārib",
        "center": [
          36.13907,
          36.82504
        ],
        "label": "Al Atārib"
      },
      {
        "name": "Al Bāb",
        "center": [
          36.37051,
          37.5157
        ],
        "label": "Al Bāb"
      },
      {
        "name": "Al Ghanţū",
        "center": [
          34.82202,
          36.69613
        ],
        "label": "Al Ghanţū"
      },
      {
        "name": "Al Kiswah",
        "center": [
          33.3581,
          36.2419
        ],
        "label": "Al Kiswah"
      },
      {
        "name": "Al Mayādīn",
        "center": [
          35.01982,
          40.45154
        ],
        "label": "Al Mayādīn"
      },
      {
        "name": "Al Muzayrīb",
        "center": [
          32.71084,
          36.02751
        ],
        "label": "Al Muzayrīb"
      },
      {
        "name": "Al Mālikīyah",
        "center": [
          37.17701,
          42.14006
        ],
        "label": "Al Mālikīyah"
      },
      {
        "name": "Al Qaryatayn",
        "center": [
          34.22956,
          37.24066
        ],
        "label": "Al Qaryatayn"
      },
      {
        "name": "Al Qunayţirah",
        "center": [
          33.12595,
          35.82461
        ],
        "label": "Al Qunayţirah"
      },
      {
        "name": "Al Quşayr",
        "center": [
          34.5078,
          36.58029
        ],
        "label": "Al Quşayr"
      },
      {
        "name": "Al Quţayfah",
        "center": [
          33.73848,
          36.60071
        ],
        "label": "Al Quţayfah"
      },
      {
        "name": "Al Qāmishlī",
        "center": [
          37.05215,
          41.23142
        ],
        "label": "Al Qāmishlī"
      },
      {
        "name": "Al Ḩarāk",
        "center": [
          32.74932,
          36.30994
        ],
        "label": "Al Ḩarāk"
      },
      {
        "name": "Al Ḩasakah",
        "center": [
          36.50237,
          40.74772
        ],
        "label": "Al Ḩasakah"
      },
      {
        "name": "Al-Bab District",
        "center": [
          36.30946,
          37.53277
        ],
        "label": "Al-Bab District"
      },
      {
        "name": "Al-Haffah District",
        "center": [
          35.59687,
          36.11198
        ],
        "label": "Al-Haffah District"
      }
    ]
  },
  {
    "code": "TW",
    "name": "Taiwan",
    "cities": [
      {
        "name": "Banqiao",
        "center": [
          25.01427,
          121.46719
        ],
        "label": "Banqiao"
      },
      {
        "name": "Changhua",
        "center": [
          23.95361,
          120.49083
        ],
        "label": "Changhua"
      },
      {
        "name": "Chiayi",
        "center": [
          23.47722,
          120.44527
        ],
        "label": "Chiayi"
      },
      {
        "name": "Chiayi County",
        "center": [
          23.46333,
          120.58166
        ],
        "label": "Chiayi County"
      },
      {
        "name": "Daxi",
        "center": [
          24.88373,
          121.29043
        ],
        "label": "Daxi"
      },
      {
        "name": "Donggang",
        "center": [
          22.46515,
          120.44927
        ],
        "label": "Donggang"
      },
      {
        "name": "Douliu",
        "center": [
          23.70944,
          120.54333
        ],
        "label": "Douliu"
      },
      {
        "name": "Hengchun",
        "center": [
          22.00417,
          120.74389
        ],
        "label": "Hengchun"
      },
      {
        "name": "Hsinchu",
        "center": [
          24.80361,
          120.96861
        ],
        "label": "Hsinchu"
      },
      {
        "name": "Hsinchu County",
        "center": [
          24.67416,
          121.16111
        ],
        "label": "Hsinchu County"
      },
      {
        "name": "Hualien",
        "center": [
          23.78166,
          121.39333
        ],
        "label": "Hualien"
      },
      {
        "name": "Hualien City",
        "center": [
          23.97694,
          121.60444
        ],
        "label": "Hualien City"
      },
      {
        "name": "Jincheng",
        "center": [
          24.43415,
          118.31712
        ],
        "label": "Jincheng"
      },
      {
        "name": "Jiufen",
        "center": [
          25.10957,
          121.84424
        ],
        "label": "Jiufen"
      },
      {
        "name": "Kaohsiung",
        "center": [
          22.61626,
          120.31333
        ],
        "label": "Kaohsiung"
      },
      {
        "name": "Kinmen County",
        "center": [
          24.45333,
          118.38861
        ],
        "label": "Kinmen County"
      },
      {
        "name": "Lienchiang",
        "center": [
          26.37004,
          120.49545
        ],
        "label": "Lienchiang"
      },
      {
        "name": "Lugu",
        "center": [
          23.74639,
          120.7525
        ],
        "label": "Lugu"
      },
      {
        "name": "Magong",
        "center": [
          23.5654,
          119.58627
        ],
        "label": "Magong"
      },
      {
        "name": "Miaoli",
        "center": [
          24.48972,
          120.90638
        ],
        "label": "Miaoli"
      }
    ]
  },
  {
    "code": "TJ",
    "name": "Tajikistan",
    "cities": [
      {
        "name": "Abdurahmoni Jomí",
        "center": [
          37.94636,
          68.80878
        ],
        "label": "Abdurahmoni Jomí"
      },
      {
        "name": "Adrasmon",
        "center": [
          40.64928,
          69.98472
        ],
        "label": "Adrasmon"
      },
      {
        "name": "Ayní",
        "center": [
          39.39406,
          68.53766
        ],
        "label": "Ayní"
      },
      {
        "name": "Boshchorbogh",
        "center": [
          37.52027,
          68.12825
        ],
        "label": "Boshchorbogh"
      },
      {
        "name": "Bŭston",
        "center": [
          40.52286,
          69.33307
        ],
        "label": "Bŭston"
      },
      {
        "name": "Bŭstonqal’a",
        "center": [
          37.84783,
          68.83125
        ],
        "label": "Bŭstonqal’a"
      },
      {
        "name": "Chkalov",
        "center": [
          40.23417,
          69.69481
        ],
        "label": "Chkalov"
      },
      {
        "name": "Chubek",
        "center": [
          37.61453,
          69.70525
        ],
        "label": "Chubek"
      },
      {
        "name": "Danghara",
        "center": [
          38.09578,
          69.33998
        ],
        "label": "Danghara"
      },
      {
        "name": "Darband",
        "center": [
          38.86776,
          69.96642
        ],
        "label": "Darband"
      },
      {
        "name": "Dŭstí",
        "center": [
          37.34812,
          68.66398
        ],
        "label": "Dŭstí"
      },
      {
        "name": "Farkhor",
        "center": [
          37.49219,
          69.40356
        ],
        "label": "Farkhor"
      },
      {
        "name": "Ghafurov",
        "center": [
          40.21571,
          69.72867
        ],
        "label": "Ghafurov"
      },
      {
        "name": "Gharavŭtí",
        "center": [
          37.56703,
          68.44668
        ],
        "label": "Gharavŭtí"
      },
      {
        "name": "Hisor",
        "center": [
          38.52504,
          68.55124
        ],
        "label": "Hisor"
      },
      {
        "name": "Isfara",
        "center": [
          40.12649,
          70.62526
        ],
        "label": "Isfara"
      },
      {
        "name": "Ishqoshim",
        "center": [
          36.72484,
          71.61331
        ],
        "label": "Ishqoshim"
      },
      {
        "name": "Istaravshan",
        "center": [
          39.9142,
          69.00328
        ],
        "label": "Istaravshan"
      },
      {
        "name": "Jilikŭl",
        "center": [
          37.49167,
          68.53106
        ],
        "label": "Jilikŭl"
      },
      {
        "name": "Karakenja",
        "center": [
          39.23585,
          71.52412
        ],
        "label": "Karakenja"
      }
    ]
  },
  {
    "code": "TZ",
    "name": "Tanzania",
    "cities": [
      {
        "name": "Arusha",
        "center": [
          -3.36667,
          36.68333
        ],
        "label": "Arusha"
      },
      {
        "name": "Babati",
        "center": [
          -4.21667,
          35.75
        ],
        "label": "Babati"
      },
      {
        "name": "Bagamoyo",
        "center": [
          -6.44222,
          38.90422
        ],
        "label": "Bagamoyo"
      },
      {
        "name": "Bariadi",
        "center": [
          -2.8,
          33.98333
        ],
        "label": "Bariadi"
      },
      {
        "name": "Bashanet",
        "center": [
          -4.23333,
          35.41667
        ],
        "label": "Bashanet"
      },
      {
        "name": "Basotu",
        "center": [
          -4.36667,
          35.08333
        ],
        "label": "Basotu"
      },
      {
        "name": "Biharamulo",
        "center": [
          -2.63194,
          31.30889
        ],
        "label": "Biharamulo"
      },
      {
        "name": "Bugarama",
        "center": [
          -2.87056,
          30.52806
        ],
        "label": "Bugarama"
      },
      {
        "name": "Bugene",
        "center": [
          -1.59111,
          31.14028
        ],
        "label": "Bugene"
      },
      {
        "name": "Bukene",
        "center": [
          -4.23333,
          32.88333
        ],
        "label": "Bukene"
      },
      {
        "name": "Bukoba",
        "center": [
          -1.33167,
          31.81222
        ],
        "label": "Bukoba"
      },
      {
        "name": "Bukonyo",
        "center": [
          -1.95,
          32.93333
        ],
        "label": "Bukonyo"
      },
      {
        "name": "Bungu",
        "center": [
          -7.63369,
          39.05818
        ],
        "label": "Bungu"
      },
      {
        "name": "Buseresere",
        "center": [
          -3.02361,
          31.87472
        ],
        "label": "Buseresere"
      },
      {
        "name": "Butiama",
        "center": [
          -1.76667,
          33.96667
        ],
        "label": "Butiama"
      },
      {
        "name": "Chake Chake",
        "center": [
          -5.24586,
          39.76659
        ],
        "label": "Chake Chake"
      },
      {
        "name": "Chala",
        "center": [
          -7.58333,
          31.26667
        ],
        "label": "Chala"
      },
      {
        "name": "Chalinze",
        "center": [
          -6.63784,
          38.35396
        ],
        "label": "Chalinze"
      },
      {
        "name": "Chanika",
        "center": [
          -5.41667,
          38.01667
        ],
        "label": "Chanika"
      },
      {
        "name": "Chato",
        "center": [
          -2.63778,
          31.76694
        ],
        "label": "Chato"
      }
    ]
  },
  {
    "code": "TH",
    "name": "Thailand",
    "cities": [
      {
        "name": "Amnat Charoen",
        "center": [
          15.85851,
          104.62883
        ],
        "label": "Amnat Charoen"
      },
      {
        "name": "Amphoe Akat Amnuai",
        "center": [
          17.63589,
          103.9759
        ],
        "label": "Amphoe Akat Amnuai"
      },
      {
        "name": "Amphoe Amphawa",
        "center": [
          13.36721,
          99.91232
        ],
        "label": "Amphoe Amphawa"
      },
      {
        "name": "Amphoe Ao Luek",
        "center": [
          8.38526,
          98.75378
        ],
        "label": "Amphoe Ao Luek"
      },
      {
        "name": "Amphoe Aranyaprathet",
        "center": [
          13.69086,
          102.47693
        ],
        "label": "Amphoe Aranyaprathet"
      },
      {
        "name": "Amphoe At Samat",
        "center": [
          15.84014,
          103.86619
        ],
        "label": "Amphoe At Samat"
      },
      {
        "name": "Amphoe Ba Cho",
        "center": [
          6.54591,
          101.64923
        ],
        "label": "Amphoe Ba Cho"
      },
      {
        "name": "Amphoe Ban Bueng",
        "center": [
          13.2528,
          101.18151
        ],
        "label": "Amphoe Ban Bueng"
      },
      {
        "name": "Amphoe Ban Chang",
        "center": [
          12.7323,
          101.04878
        ],
        "label": "Amphoe Ban Chang"
      },
      {
        "name": "Amphoe Ban Dan",
        "center": [
          15.12363,
          103.18937
        ],
        "label": "Amphoe Ban Dan"
      },
      {
        "name": "Amphoe Ban Dan Lan Hoi",
        "center": [
          17.05278,
          99.49148
        ],
        "label": "Amphoe Ban Dan Lan Hoi"
      },
      {
        "name": "Amphoe Ban Dung",
        "center": [
          17.71134,
          103.26729
        ],
        "label": "Amphoe Ban Dung"
      },
      {
        "name": "Amphoe Ban Fang",
        "center": [
          16.49162,
          102.61669
        ],
        "label": "Amphoe Ban Fang"
      },
      {
        "name": "Amphoe Ban Haet",
        "center": [
          16.20067,
          102.77465
        ],
        "label": "Amphoe Ban Haet"
      },
      {
        "name": "Amphoe Ban Hong",
        "center": [
          18.27422,
          98.83794
        ],
        "label": "Amphoe Ban Hong"
      },
      {
        "name": "Amphoe Ban Kha",
        "center": [
          13.32374,
          99.37323
        ],
        "label": "Amphoe Ban Kha"
      },
      {
        "name": "Amphoe Ban Khai",
        "center": [
          12.83827,
          101.3421
        ],
        "label": "Amphoe Ban Khai"
      },
      {
        "name": "Amphoe Ban Khok",
        "center": [
          18.1468,
          101.0661
        ],
        "label": "Amphoe Ban Khok"
      },
      {
        "name": "Amphoe Ban Kruat",
        "center": [
          14.39205,
          103.11494
        ],
        "label": "Amphoe Ban Kruat"
      },
      {
        "name": "Amphoe Ban Laem",
        "center": [
          13.16968,
          99.98771
        ],
        "label": "Amphoe Ban Laem"
      }
    ]
  },
  {
    "code": "BS",
    "name": "The Bahamas",
    "cities": [
      {
        "name": "Abraham’s Bay",
        "center": [
          22.36667,
          -72.96667
        ],
        "label": "Abraham’s Bay"
      },
      {
        "name": "Alice Town",
        "center": [
          25.728,
          -79.29721
        ],
        "label": "Alice Town"
      },
      {
        "name": "Andros Town",
        "center": [
          24.70502,
          -77.76912
        ],
        "label": "Andros Town"
      },
      {
        "name": "Arthur’s Town",
        "center": [
          24.6224,
          -75.67151
        ],
        "label": "Arthur’s Town"
      },
      {
        "name": "Clarence Town",
        "center": [
          23.1,
          -74.98333
        ],
        "label": "Clarence Town"
      },
      {
        "name": "Cockburn Town",
        "center": [
          24.05179,
          -74.53138
        ],
        "label": "Cockburn Town"
      },
      {
        "name": "Colonel Hill",
        "center": [
          22.7545,
          -74.20415
        ],
        "label": "Colonel Hill"
      },
      {
        "name": "Cooper’s Town",
        "center": [
          26.87137,
          -77.51131
        ],
        "label": "Cooper’s Town"
      },
      {
        "name": "Duncan Town",
        "center": [
          22.19083,
          -75.72583
        ],
        "label": "Duncan Town"
      },
      {
        "name": "Dunmore Town",
        "center": [
          25.50216,
          -76.63633
        ],
        "label": "Dunmore Town"
      },
      {
        "name": "Freeport",
        "center": [
          26.53333,
          -78.7
        ],
        "label": "Freeport"
      },
      {
        "name": "George Town",
        "center": [
          23.51616,
          -75.78665
        ],
        "label": "George Town"
      },
      {
        "name": "High Rock",
        "center": [
          26.60999,
          -78.27863
        ],
        "label": "High Rock"
      },
      {
        "name": "Lucaya",
        "center": [
          26.53333,
          -78.66667
        ],
        "label": "Lucaya"
      },
      {
        "name": "Marsh Harbour",
        "center": [
          26.54124,
          -77.0636
        ],
        "label": "Marsh Harbour"
      },
      {
        "name": "Matthew Town",
        "center": [
          20.94982,
          -73.67346
        ],
        "label": "Matthew Town"
      },
      {
        "name": "Nassau",
        "center": [
          25.06666667,
          -77.33333333
        ],
        "label": "Nassau"
      },
      {
        "name": "Port Nelson",
        "center": [
          23.64967,
          -74.84157
        ],
        "label": "Port Nelson"
      },
      {
        "name": "San Andros",
        "center": [
          25.06667,
          -78.05
        ],
        "label": "San Andros"
      },
      {
        "name": "Spanish Wells",
        "center": [
          25.54717,
          -76.76405
        ],
        "label": "Spanish Wells"
      }
    ]
  },
  {
    "code": "GM",
    "name": "The Gambia",
    "cities": [
      {
        "name": "Abuko",
        "center": [
          13.40417,
          -16.65583
        ],
        "label": "Abuko"
      },
      {
        "name": "Bakadagy",
        "center": [
          13.3,
          -14.38333
        ],
        "label": "Bakadagy"
      },
      {
        "name": "Bakau",
        "center": [
          13.47806,
          -16.68194
        ],
        "label": "Bakau"
      },
      {
        "name": "Bambali",
        "center": [
          13.48333,
          -15.33333
        ],
        "label": "Bambali"
      },
      {
        "name": "Banjul",
        "center": [
          13.45274,
          -16.57803
        ],
        "label": "Banjul"
      },
      {
        "name": "Bansang",
        "center": [
          13.43333,
          -14.65
        ],
        "label": "Bansang"
      },
      {
        "name": "Baro Kunda",
        "center": [
          13.48333,
          -15.26667
        ],
        "label": "Baro Kunda"
      },
      {
        "name": "Barra",
        "center": [
          13.48278,
          -16.54556
        ],
        "label": "Barra"
      },
      {
        "name": "Basse Santa Su",
        "center": [
          13.30995,
          -14.21373
        ],
        "label": "Basse Santa Su"
      },
      {
        "name": "Brifu",
        "center": [
          13.5,
          -13.93333
        ],
        "label": "Brifu"
      },
      {
        "name": "Brikama",
        "center": [
          13.27136,
          -16.64944
        ],
        "label": "Brikama"
      },
      {
        "name": "Brikama Nding",
        "center": [
          13.53333,
          -14.93333
        ],
        "label": "Brikama Nding"
      },
      {
        "name": "Bureng",
        "center": [
          13.41667,
          -15.28333
        ],
        "label": "Bureng"
      },
      {
        "name": "Central Baddibu",
        "center": [
          13.53333,
          -15.91667
        ],
        "label": "Central Baddibu"
      },
      {
        "name": "Chilla",
        "center": [
          13.55,
          -16.28333
        ],
        "label": "Chilla"
      },
      {
        "name": "Daba Kunda",
        "center": [
          13.31667,
          -14.3
        ],
        "label": "Daba Kunda"
      },
      {
        "name": "Dankunku",
        "center": [
          13.56667,
          -15.31667
        ],
        "label": "Dankunku"
      },
      {
        "name": "Daru Rilwan",
        "center": [
          13.55,
          -15.98333
        ],
        "label": "Daru Rilwan"
      },
      {
        "name": "Demba Kunda",
        "center": [
          13.25,
          -14.26667
        ],
        "label": "Demba Kunda"
      },
      {
        "name": "Denton",
        "center": [
          13.5,
          -14.93333
        ],
        "label": "Denton"
      }
    ]
  },
  {
    "code": "TG",
    "name": "Togo",
    "cities": [
      {
        "name": "Amlamé",
        "center": [
          7.46667,
          0.9
        ],
        "label": "Amlamé"
      },
      {
        "name": "Aného",
        "center": [
          6.22798,
          1.5919
        ],
        "label": "Aného"
      },
      {
        "name": "Atakpamé",
        "center": [
          7.53333,
          1.13333
        ],
        "label": "Atakpamé"
      },
      {
        "name": "Badou",
        "center": [
          7.58333,
          0.6
        ],
        "label": "Badou"
      },
      {
        "name": "Bafilo",
        "center": [
          9.35,
          1.26667
        ],
        "label": "Bafilo"
      },
      {
        "name": "Bassar",
        "center": [
          9.25025,
          0.78213
        ],
        "label": "Bassar"
      },
      {
        "name": "Dapaong",
        "center": [
          10.86225,
          0.20762
        ],
        "label": "Dapaong"
      },
      {
        "name": "Kandé",
        "center": [
          9.95778,
          1.04472
        ],
        "label": "Kandé"
      },
      {
        "name": "Kara",
        "center": [
          9.55111,
          1.18611
        ],
        "label": "Kara"
      },
      {
        "name": "Kpalimé",
        "center": [
          6.9,
          0.63333
        ],
        "label": "Kpalimé"
      },
      {
        "name": "Lomé",
        "center": [
          6.12874,
          1.22154
        ],
        "label": "Lomé"
      },
      {
        "name": "Niamtougou",
        "center": [
          9.76806,
          1.10528
        ],
        "label": "Niamtougou"
      },
      {
        "name": "Notsé",
        "center": [
          6.95,
          1.16667
        ],
        "label": "Notsé"
      },
      {
        "name": "Pagouda",
        "center": [
          9.7525,
          1.32778
        ],
        "label": "Pagouda"
      },
      {
        "name": "Préfecture de Bassar",
        "center": [
          9.25,
          0.75
        ],
        "label": "Préfecture de Bassar"
      },
      {
        "name": "Sansanné-Mango",
        "center": [
          10.35917,
          0.47083
        ],
        "label": "Sansanné-Mango"
      },
      {
        "name": "Sokodé",
        "center": [
          8.98333,
          1.13333
        ],
        "label": "Sokodé"
      },
      {
        "name": "Sotouboua",
        "center": [
          8.5634,
          0.98399
        ],
        "label": "Sotouboua"
      },
      {
        "name": "Tabligbo",
        "center": [
          6.58333,
          1.5
        ],
        "label": "Tabligbo"
      },
      {
        "name": "Tchamba",
        "center": [
          9.03333,
          1.41667
        ],
        "label": "Tchamba"
      }
    ]
  },
  {
    "code": "TK",
    "name": "Tokelau",
    "cities": [
      {
        "name": "Tokelau City",
        "center": [
          -9,
          -172
        ],
        "label": "Tokelau (Capital / Main)"
      }
    ]
  },
  {
    "code": "TO",
    "name": "Tonga",
    "cities": [
      {
        "name": "Haveluloto",
        "center": [
          -21.15216,
          -175.21333
        ],
        "label": "Haveluloto"
      },
      {
        "name": "Hihifo",
        "center": [
          -15.9544,
          -173.79616
        ],
        "label": "Hihifo"
      },
      {
        "name": "Kolonga",
        "center": [
          -21.13333,
          -175.06667
        ],
        "label": "Kolonga"
      },
      {
        "name": "Neiafu",
        "center": [
          -18.6506,
          -173.98404
        ],
        "label": "Neiafu"
      },
      {
        "name": "Nuku‘alofa",
        "center": [
          -21.13938,
          -175.2018
        ],
        "label": "Nuku‘alofa"
      },
      {
        "name": "Pangai",
        "center": [
          -19.81468,
          -174.35423
        ],
        "label": "Pangai"
      },
      {
        "name": "Vaini",
        "center": [
          -21.19292,
          -175.17678
        ],
        "label": "Vaini"
      },
      {
        "name": "‘Ohonua",
        "center": [
          -21.33333,
          -174.95
        ],
        "label": "‘Ohonua"
      }
    ]
  },
  {
    "code": "TT",
    "name": "Trinidad And Tobago",
    "cities": [
      {
        "name": "Arima",
        "center": [
          10.63737,
          -61.28228
        ],
        "label": "Arima"
      },
      {
        "name": "Arouca",
        "center": [
          10.62877,
          -61.33487
        ],
        "label": "Arouca"
      },
      {
        "name": "Chaguanas",
        "center": [
          10.51667,
          -61.41667
        ],
        "label": "Chaguanas"
      },
      {
        "name": "Couva",
        "center": [
          10.42248,
          -61.46748
        ],
        "label": "Couva"
      },
      {
        "name": "Debe",
        "center": [
          10.20846,
          -61.45273
        ],
        "label": "Debe"
      },
      {
        "name": "Laventille",
        "center": [
          10.64917,
          -61.49889
        ],
        "label": "Laventille"
      },
      {
        "name": "Marabella",
        "center": [
          10.30618,
          -61.44671
        ],
        "label": "Marabella"
      },
      {
        "name": "Mon Repos",
        "center": [
          10.27979,
          -61.4459
        ],
        "label": "Mon Repos"
      },
      {
        "name": "Mucurapo",
        "center": [
          10.66253,
          -61.53697
        ],
        "label": "Mucurapo"
      },
      {
        "name": "Paradise",
        "center": [
          10.65298,
          -61.36298
        ],
        "label": "Paradise"
      },
      {
        "name": "Petit Valley",
        "center": [
          10.69974,
          -61.54717
        ],
        "label": "Petit Valley"
      },
      {
        "name": "Peñal",
        "center": [
          10.16667,
          -61.46667
        ],
        "label": "Peñal"
      },
      {
        "name": "Point Fortin",
        "center": [
          10.17411,
          -61.68407
        ],
        "label": "Point Fortin"
      },
      {
        "name": "Port of Spain",
        "center": [
          10.66668,
          -61.51889
        ],
        "label": "Port of Spain"
      },
      {
        "name": "Princes Town",
        "center": [
          10.27184,
          -61.37103
        ],
        "label": "Princes Town"
      },
      {
        "name": "Rio Claro",
        "center": [
          10.30594,
          -61.17556
        ],
        "label": "Rio Claro"
      },
      {
        "name": "San Fernando",
        "center": [
          10.27969,
          -61.46835
        ],
        "label": "San Fernando"
      },
      {
        "name": "Sangre Grande",
        "center": [
          10.58705,
          -61.13008
        ],
        "label": "Sangre Grande"
      },
      {
        "name": "Scarborough",
        "center": [
          11.18229,
          -60.73525
        ],
        "label": "Scarborough"
      },
      {
        "name": "Siparia",
        "center": [
          10.14525,
          -61.5074
        ],
        "label": "Siparia"
      }
    ]
  },
  {
    "code": "TN",
    "name": "Tunisia",
    "cities": [
      {
        "name": "Agareb",
        "center": [
          34.74406,
          10.4611
        ],
        "label": "Agareb"
      },
      {
        "name": "Akouda",
        "center": [
          35.8691,
          10.5653
        ],
        "label": "Akouda"
      },
      {
        "name": "Al Marsá",
        "center": [
          36.87818,
          10.32466
        ],
        "label": "Al Marsá"
      },
      {
        "name": "Al Matlīn",
        "center": [
          37.24516,
          10.05
        ],
        "label": "Al Matlīn"
      },
      {
        "name": "Ar Rudayyif",
        "center": [
          34.3827,
          8.15549
        ],
        "label": "Ar Rudayyif"
      },
      {
        "name": "Ariana",
        "center": [
          36.86012,
          10.19337
        ],
        "label": "Ariana"
      },
      {
        "name": "As Sanad",
        "center": [
          34.4628,
          9.26404
        ],
        "label": "As Sanad"
      },
      {
        "name": "As Sars",
        "center": [
          36.0764,
          9.02117
        ],
        "label": "As Sars"
      },
      {
        "name": "Banbalah",
        "center": [
          35.7,
          10.8
        ],
        "label": "Banbalah"
      },
      {
        "name": "Bekalta",
        "center": [
          35.61739,
          10.99466
        ],
        "label": "Bekalta"
      },
      {
        "name": "Ben Arous",
        "center": [
          36.75452,
          10.22167
        ],
        "label": "Ben Arous"
      },
      {
        "name": "Ben Gardane",
        "center": [
          33.13783,
          11.21965
        ],
        "label": "Ben Gardane"
      },
      {
        "name": "Beni Hassane",
        "center": [
          35.5672,
          10.80869
        ],
        "label": "Beni Hassane"
      },
      {
        "name": "Beni Kheddache",
        "center": [
          33.25279,
          10.19883
        ],
        "label": "Beni Kheddache"
      },
      {
        "name": "Bir Ali Ben Khalifa",
        "center": [
          34.73592,
          10.0924
        ],
        "label": "Bir Ali Ben Khalifa"
      },
      {
        "name": "Bir el Hafey",
        "center": [
          34.93212,
          9.19321
        ],
        "label": "Bir el Hafey"
      },
      {
        "name": "Bizerte",
        "center": [
          37.27442,
          9.87391
        ],
        "label": "Bizerte"
      },
      {
        "name": "Bizerte Sud",
        "center": [
          37.25528,
          9.67915
        ],
        "label": "Bizerte Sud"
      },
      {
        "name": "Bou Arada",
        "center": [
          36.35251,
          9.62175
        ],
        "label": "Bou Arada"
      },
      {
        "name": "Bou Attouche",
        "center": [
          33.89927,
          9.78496
        ],
        "label": "Bou Attouche"
      }
    ]
  },
  {
    "code": "TR",
    "name": "Turkey",
    "cities": [
      {
        "name": "Abana",
        "center": [
          41.97858,
          34.011
        ],
        "label": "Abana"
      },
      {
        "name": "Acarlar",
        "center": [
          37.82444,
          27.74667
        ],
        "label": "Acarlar"
      },
      {
        "name": "Acıgöl",
        "center": [
          38.55028,
          34.50917
        ],
        "label": "Acıgöl"
      },
      {
        "name": "Acıpayam",
        "center": [
          37.42385,
          29.34941
        ],
        "label": "Acıpayam"
      },
      {
        "name": "Acırlı",
        "center": [
          37.45549,
          41.29499
        ],
        "label": "Acırlı"
      },
      {
        "name": "Adaklı İlçesi",
        "center": [
          39.2287,
          40.48252
        ],
        "label": "Adaklı İlçesi"
      },
      {
        "name": "Adalar",
        "center": [
          40.86913,
          29.12064
        ],
        "label": "Adalar"
      },
      {
        "name": "Adana",
        "center": [
          37.00167,
          35.32889
        ],
        "label": "Adana"
      },
      {
        "name": "Adapazarı",
        "center": [
          40.78056,
          30.40333
        ],
        "label": "Adapazarı"
      },
      {
        "name": "Adilcevaz",
        "center": [
          38.79911,
          42.73159
        ],
        "label": "Adilcevaz"
      },
      {
        "name": "Adıyaman",
        "center": [
          37.76441,
          38.27629
        ],
        "label": "Adıyaman"
      },
      {
        "name": "Afyonkarahisar",
        "center": [
          38.75667,
          30.54333
        ],
        "label": "Afyonkarahisar"
      },
      {
        "name": "Afşin",
        "center": [
          38.24769,
          36.91399
        ],
        "label": "Afşin"
      },
      {
        "name": "Ahlat",
        "center": [
          38.7489,
          42.48007
        ],
        "label": "Ahlat"
      },
      {
        "name": "Ahmetli",
        "center": [
          38.5196,
          27.93865
        ],
        "label": "Ahmetli"
      },
      {
        "name": "Ahırlı İlçesi",
        "center": [
          37.24828,
          32.12419
        ],
        "label": "Ahırlı İlçesi"
      },
      {
        "name": "Akarsu",
        "center": [
          37.22616,
          41.05138
        ],
        "label": "Akarsu"
      },
      {
        "name": "Akdağmadeni",
        "center": [
          39.66028,
          35.88361
        ],
        "label": "Akdağmadeni"
      },
      {
        "name": "Akdeniz",
        "center": [
          36.86424,
          34.67731
        ],
        "label": "Akdeniz"
      },
      {
        "name": "Akdere",
        "center": [
          36.24083,
          33.75041
        ],
        "label": "Akdere"
      }
    ]
  },
  {
    "code": "TM",
    "name": "Turkmenistan",
    "cities": [
      {
        "name": "Abadan",
        "center": [
          38.05415,
          58.19721
        ],
        "label": "Abadan"
      },
      {
        "name": "Akdepe",
        "center": [
          42.05513,
          59.37877
        ],
        "label": "Akdepe"
      },
      {
        "name": "Annau",
        "center": [
          37.88754,
          58.51596
        ],
        "label": "Annau"
      },
      {
        "name": "Arçabil",
        "center": [
          37.915,
          58.08987
        ],
        "label": "Arçabil"
      },
      {
        "name": "Ashgabat",
        "center": [
          37.95,
          58.38333
        ],
        "label": "Ashgabat"
      },
      {
        "name": "Atamyrat",
        "center": [
          37.83573,
          65.21058
        ],
        "label": "Atamyrat"
      },
      {
        "name": "Baharly",
        "center": [
          38.43624,
          57.43158
        ],
        "label": "Baharly"
      },
      {
        "name": "Balkanabat",
        "center": [
          39.51075,
          54.36713
        ],
        "label": "Balkanabat"
      },
      {
        "name": "Bayramaly",
        "center": [
          37.61852,
          62.16715
        ],
        "label": "Bayramaly"
      },
      {
        "name": "Bereket",
        "center": [
          39.24463,
          55.51536
        ],
        "label": "Bereket"
      },
      {
        "name": "Boldumsaz",
        "center": [
          42.12824,
          59.67101
        ],
        "label": "Boldumsaz"
      },
      {
        "name": "Daşoguz",
        "center": [
          41.83625,
          59.96661
        ],
        "label": "Daşoguz"
      },
      {
        "name": "Farap",
        "center": [
          39.17037,
          63.61165
        ],
        "label": "Farap"
      },
      {
        "name": "Gazojak",
        "center": [
          41.18746,
          61.4036
        ],
        "label": "Gazojak"
      },
      {
        "name": "Gowurdak",
        "center": [
          37.81244,
          66.04656
        ],
        "label": "Gowurdak"
      },
      {
        "name": "Gumdag",
        "center": [
          39.20611,
          54.59056
        ],
        "label": "Gumdag"
      },
      {
        "name": "Kaka",
        "center": [
          37.34821,
          59.61431
        ],
        "label": "Kaka"
      },
      {
        "name": "Köneürgench",
        "center": [
          42.32773,
          59.15442
        ],
        "label": "Köneürgench"
      },
      {
        "name": "Magtymguly",
        "center": [
          38.43749,
          56.28081
        ],
        "label": "Magtymguly"
      },
      {
        "name": "Mary",
        "center": [
          37.59378,
          61.83031
        ],
        "label": "Mary"
      }
    ]
  },
  {
    "code": "TC",
    "name": "Turks And Caicos Islands",
    "cities": [
      {
        "name": "Turks And Caicos Islands City",
        "center": [
          21.75,
          -71.58333333
        ],
        "label": "Turks And Caicos Islands (Capital / Main)"
      }
    ]
  },
  {
    "code": "TV",
    "name": "Tuvalu",
    "cities": [
      {
        "name": "Alapi Village",
        "center": [
          -8.52074,
          179.1968
        ],
        "label": "Alapi Village"
      },
      {
        "name": "Asau Village",
        "center": [
          -7.49026,
          178.68016
        ],
        "label": "Asau Village"
      },
      {
        "name": "Fakaifou Village",
        "center": [
          -8.51758,
          179.20094
        ],
        "label": "Fakaifou Village"
      },
      {
        "name": "Funafuti",
        "center": [
          -8.52425,
          179.19417
        ],
        "label": "Funafuti"
      },
      {
        "name": "Kulia Village",
        "center": [
          -6.10819,
          177.33393
        ],
        "label": "Kulia Village"
      },
      {
        "name": "Niulakita",
        "center": [
          -10.788,
          179.466
        ],
        "label": "Niulakita"
      },
      {
        "name": "Savave Village",
        "center": [
          -8.02731,
          178.31351
        ],
        "label": "Savave Village"
      },
      {
        "name": "Tanrake Village",
        "center": [
          -7.24562,
          177.14511
        ],
        "label": "Tanrake Village"
      },
      {
        "name": "Toga Village",
        "center": [
          -6.28764,
          176.31472
        ],
        "label": "Toga Village"
      }
    ]
  },
  {
    "code": "UG",
    "name": "Uganda",
    "cities": [
      {
        "name": "Adjumani",
        "center": [
          3.37786,
          31.7909
        ],
        "label": "Adjumani"
      },
      {
        "name": "Amudat",
        "center": [
          1.95,
          34.95
        ],
        "label": "Amudat"
      },
      {
        "name": "Apac",
        "center": [
          1.97556,
          32.53861
        ],
        "label": "Apac"
      },
      {
        "name": "Arua",
        "center": [
          3.02013,
          30.91105
        ],
        "label": "Arua"
      },
      {
        "name": "Bugembe",
        "center": [
          0.48213,
          33.24065
        ],
        "label": "Bugembe"
      },
      {
        "name": "Bugiri",
        "center": [
          0.57139,
          33.74167
        ],
        "label": "Bugiri"
      },
      {
        "name": "Bukomansimbi District",
        "center": [
          -0.12855,
          31.62527
        ],
        "label": "Bukomansimbi District"
      },
      {
        "name": "Bukwa District",
        "center": [
          1.27115,
          34.66778
        ],
        "label": "Bukwa District"
      },
      {
        "name": "Bulambuli District",
        "center": [
          1.32055,
          34.28062
        ],
        "label": "Bulambuli District"
      },
      {
        "name": "Bundibugyo",
        "center": [
          0.71117,
          30.06469
        ],
        "label": "Bundibugyo"
      },
      {
        "name": "Busembatia",
        "center": [
          0.77725,
          33.62364
        ],
        "label": "Busembatia"
      },
      {
        "name": "Busia",
        "center": [
          0.46588,
          34.09221
        ],
        "label": "Busia"
      },
      {
        "name": "Buvuma District",
        "center": [
          -0.36744,
          33.20071
        ],
        "label": "Buvuma District"
      },
      {
        "name": "Buwenge",
        "center": [
          0.64996,
          33.17128
        ],
        "label": "Buwenge"
      },
      {
        "name": "Bweyogerere",
        "center": [
          0.35773,
          32.66332
        ],
        "label": "Bweyogerere"
      },
      {
        "name": "Bwizibwera",
        "center": [
          -0.59167,
          30.62861
        ],
        "label": "Bwizibwera"
      },
      {
        "name": "Byakabanda",
        "center": [
          -0.7425,
          31.40639
        ],
        "label": "Byakabanda"
      },
      {
        "name": "Entebbe",
        "center": [
          0.05621,
          32.47949
        ],
        "label": "Entebbe"
      },
      {
        "name": "Fort Portal",
        "center": [
          0.66174,
          30.2748
        ],
        "label": "Fort Portal"
      },
      {
        "name": "Gomba District",
        "center": [
          0.20017,
          31.75023
        ],
        "label": "Gomba District"
      }
    ]
  },
  {
    "code": "UA",
    "name": "Ukraine",
    "cities": [
      {
        "name": "Abramok",
        "center": [
          50.63694444,
          27.9075
        ],
        "label": "Abramok"
      },
      {
        "name": "Abrikosovka",
        "center": [
          45.10759,
          35.10139
        ],
        "label": "Abrikosovka"
      },
      {
        "name": "Abrikosovo",
        "center": [
          45.69236,
          34.10156
        ],
        "label": "Abrikosovo"
      },
      {
        "name": "Adamivka",
        "center": [
          50.37694444,
          27.91527778
        ],
        "label": "Adamivka"
      },
      {
        "name": "Adamove",
        "center": [
          50.83111111,
          27.48305556
        ],
        "label": "Adamove"
      },
      {
        "name": "Adzhamka",
        "center": [
          48.54245,
          32.53542
        ],
        "label": "Adzhamka"
      },
      {
        "name": "Aeroflotskiy",
        "center": [
          45.01816,
          33.99961
        ],
        "label": "Aeroflotskiy"
      },
      {
        "name": "Agativka",
        "center": [
          49.98611111,
          28.605
        ],
        "label": "Agativka"
      },
      {
        "name": "Agrarnoye",
        "center": [
          45.01596,
          34.05725
        ],
        "label": "Agrarnoye"
      },
      {
        "name": "Akimovka",
        "center": [
          45.51981,
          34.82438
        ],
        "label": "Akimovka"
      },
      {
        "name": "Alchevs’k",
        "center": [
          48.46893,
          38.81669
        ],
        "label": "Alchevs’k"
      },
      {
        "name": "Alchevs’ka Mis’krada",
        "center": [
          48.48029,
          38.7969
        ],
        "label": "Alchevs’ka Mis’krada"
      },
      {
        "name": "Aleksandrovka",
        "center": [
          45.57654,
          34.09947
        ],
        "label": "Aleksandrovka"
      },
      {
        "name": "Alekseyevka",
        "center": [
          45.58194,
          33.6298
        ],
        "label": "Alekseyevka"
      },
      {
        "name": "Alupka",
        "center": [
          44.41808,
          34.04531
        ],
        "label": "Alupka"
      },
      {
        "name": "Alushta",
        "center": [
          44.67728,
          34.4097
        ],
        "label": "Alushta"
      },
      {
        "name": "Amurskoye",
        "center": [
          45.27822,
          34.12823
        ],
        "label": "Amurskoye"
      },
      {
        "name": "Amvrosiivka Raion",
        "center": [
          47.75,
          38.5
        ],
        "label": "Amvrosiivka Raion"
      },
      {
        "name": "Amvrosiyivka",
        "center": [
          47.79348,
          38.47768
        ],
        "label": "Amvrosiyivka"
      },
      {
        "name": "Andriyivka",
        "center": [
          49.76293844,
          34.3003749
        ],
        "label": "Andriyivka"
      }
    ]
  },
  {
    "code": "AE",
    "name": "United Arab Emirates",
    "cities": [
      {
        "name": "Dubai, Downtown & Business Bay",
        "center": [
          25.2048,
          55.2708
        ],
        "label": "Dubai (Downtown / Business Bay)"
      },
      {
        "name": "Dubai, Marina & JBR",
        "center": [
          25.0805,
          55.1403
        ],
        "label": "Dubai (Marina & JBR)"
      },
      {
        "name": "Dubai, Deira & Bur Dubai",
        "center": [
          25.2697,
          55.3094
        ],
        "label": "Dubai (Deira / Bur Dubai)"
      },
      {
        "name": "Abu Dhabi, Corniche & Al Maryah",
        "center": [
          24.4539,
          54.3773
        ],
        "label": "Abu Dhabi (Corniche / Al Maryah)"
      },
      {
        "name": "Sharjah, Al Majaz & City Centre",
        "center": [
          25.3463,
          55.4209
        ],
        "label": "Sharjah"
      },
      {
        "name": "Ajman",
        "center": [
          25.4052,
          55.5136
        ],
        "label": "Ajman"
      },
      {
        "name": "Ras Al Khaimah",
        "center": [
          25.7895,
          55.9432
        ],
        "label": "Ras Al Khaimah"
      },
      {
        "name": "Al Ain",
        "center": [
          24.2075,
          55.7447
        ],
        "label": "Al Ain"
      },
      {
        "name": "Fujairah",
        "center": [
          25.1288,
          56.3265
        ],
        "label": "Fujairah"
      }
    ]
  },
  {
    "code": "GB",
    "name": "United Kingdom",
    "cities": [
      {
        "name": "London",
        "center": [
          51.5074,
          -0.1278
        ],
        "label": "London"
      },
      {
        "name": "Manchester",
        "center": [
          53.4808,
          -2.2426
        ],
        "label": "Manchester"
      },
      {
        "name": "Birmingham",
        "center": [
          52.4862,
          -1.8904
        ],
        "label": "Birmingham"
      },
      {
        "name": "Leeds",
        "center": [
          53.8008,
          -1.5491
        ],
        "label": "Leeds"
      },
      {
        "name": "Glasgow",
        "center": [
          55.8642,
          -4.2518
        ],
        "label": "Glasgow"
      },
      {
        "name": "Liverpool",
        "center": [
          53.4084,
          -2.9916
        ],
        "label": "Liverpool"
      },
      {
        "name": "Bristol",
        "center": [
          51.4545,
          -2.5879
        ],
        "label": "Bristol"
      },
      {
        "name": "Edinburgh",
        "center": [
          55.9533,
          -3.1883
        ],
        "label": "Edinburgh"
      },
      {
        "name": "Sheffield",
        "center": [
          53.3811,
          -1.4701
        ],
        "label": "Sheffield"
      },
      {
        "name": "Newcastle upon Tyne",
        "center": [
          54.9783,
          -1.6178
        ],
        "label": "Newcastle"
      },
      {
        "name": "Cardiff",
        "center": [
          51.4816,
          -3.1791
        ],
        "label": "Cardiff"
      },
      {
        "name": "Belfast",
        "center": [
          54.5973,
          -5.9301
        ],
        "label": "Belfast"
      },
      {
        "name": "Nottingham",
        "center": [
          52.9548,
          -1.1581
        ],
        "label": "Nottingham"
      },
      {
        "name": "Southampton",
        "center": [
          50.9097,
          -1.4044
        ],
        "label": "Southampton"
      },
      {
        "name": "Cambridge",
        "center": [
          52.2053,
          0.1218
        ],
        "label": "Cambridge"
      },
      {
        "name": "Oxford",
        "center": [
          51.752,
          -1.2577
        ],
        "label": "Oxford"
      }
    ]
  },
  {
    "code": "US",
    "name": "United States",
    "cities": [
      {
        "name": "New York, NY",
        "center": [
          40.7128,
          -74.006
        ],
        "label": "New York, NY (NYC)"
      },
      {
        "name": "Los Angeles, CA",
        "center": [
          34.0522,
          -118.2437
        ],
        "label": "Los Angeles, CA"
      },
      {
        "name": "Chicago, IL",
        "center": [
          41.8781,
          -87.6298
        ],
        "label": "Chicago, IL"
      },
      {
        "name": "Houston, TX",
        "center": [
          29.7604,
          -95.3698
        ],
        "label": "Houston, TX"
      },
      {
        "name": "Phoenix, AZ",
        "center": [
          33.4484,
          -112.074
        ],
        "label": "Phoenix, AZ"
      },
      {
        "name": "Philadelphia, PA",
        "center": [
          39.9526,
          -75.1652
        ],
        "label": "Philadelphia, PA"
      },
      {
        "name": "San Antonio, TX",
        "center": [
          29.4241,
          -98.4936
        ],
        "label": "San Antonio, TX"
      },
      {
        "name": "San Diego, CA",
        "center": [
          32.7157,
          -117.1611
        ],
        "label": "San Diego, CA"
      },
      {
        "name": "Dallas, TX",
        "center": [
          32.7767,
          -96.797
        ],
        "label": "Dallas, TX"
      },
      {
        "name": "Austin, TX",
        "center": [
          30.2672,
          -97.7431
        ],
        "label": "Austin, TX"
      },
      {
        "name": "San Jose, CA",
        "center": [
          37.3382,
          -121.8863
        ],
        "label": "San Jose, CA (Silicon Valley)"
      },
      {
        "name": "San Francisco, CA",
        "center": [
          37.7749,
          -122.4194
        ],
        "label": "San Francisco, CA"
      },
      {
        "name": "Seattle, WA",
        "center": [
          47.6062,
          -122.3321
        ],
        "label": "Seattle, WA"
      },
      {
        "name": "Denver, CO",
        "center": [
          39.7392,
          -104.9903
        ],
        "label": "Denver, CO"
      },
      {
        "name": "Washington, DC",
        "center": [
          38.9072,
          -77.0369
        ],
        "label": "Washington, DC"
      },
      {
        "name": "Boston, MA",
        "center": [
          42.3601,
          -71.0589
        ],
        "label": "Boston, MA"
      },
      {
        "name": "Miami, FL",
        "center": [
          25.7617,
          -80.1918
        ],
        "label": "Miami, FL"
      },
      {
        "name": "Atlanta, GA",
        "center": [
          33.749,
          -84.388
        ],
        "label": "Atlanta, GA"
      },
      {
        "name": "Las Vegas, NV",
        "center": [
          36.1699,
          -115.1398
        ],
        "label": "Las Vegas, NV"
      },
      {
        "name": "Orlando, FL",
        "center": [
          28.5383,
          -81.3792
        ],
        "label": "Orlando, FL"
      },
      {
        "name": "Tampa, FL",
        "center": [
          27.9506,
          -82.4572
        ],
        "label": "Tampa, FL"
      },
      {
        "name": "Charlotte, NC",
        "center": [
          35.2271,
          -80.8431
        ],
        "label": "Charlotte, NC"
      },
      {
        "name": "Nashville, TN",
        "center": [
          36.1627,
          -86.7816
        ],
        "label": "Nashville, TN"
      },
      {
        "name": "Detroit, MI",
        "center": [
          42.3314,
          -83.0458
        ],
        "label": "Detroit, MI"
      },
      {
        "name": "Minneapolis, MN",
        "center": [
          44.9778,
          -93.265
        ],
        "label": "Minneapolis, MN"
      },
      {
        "name": "Portland, OR",
        "center": [
          45.5152,
          -122.6784
        ],
        "label": "Portland, OR"
      },
      {
        "name": "Salt Lake City, UT",
        "center": [
          40.7608,
          -111.891
        ],
        "label": "Salt Lake City, UT"
      }
    ]
  },
  {
    "code": "UM",
    "name": "United States Minor Outlying Islands",
    "cities": [
      {
        "name": "United States Minor Outlying Islands City",
        "center": [
          0,
          0
        ],
        "label": "United States Minor Outlying Islands (Capital / Main)"
      }
    ]
  },
  {
    "code": "UY",
    "name": "Uruguay",
    "cities": [
      {
        "name": "25 de Agosto",
        "center": [
          -34.41167,
          -56.40222
        ],
        "label": "25 de Agosto"
      },
      {
        "name": "25 de Mayo",
        "center": [
          -34.18917,
          -56.33944
        ],
        "label": "25 de Mayo"
      },
      {
        "name": "Aceguá",
        "center": [
          -31.87178,
          -54.16351
        ],
        "label": "Aceguá"
      },
      {
        "name": "Aguas Corrientes",
        "center": [
          -34.52194,
          -56.39361
        ],
        "label": "Aguas Corrientes"
      },
      {
        "name": "Aiguá",
        "center": [
          -34.20498,
          -54.75665
        ],
        "label": "Aiguá"
      },
      {
        "name": "Alejandro Gallinal",
        "center": [
          -33.86252,
          -55.54264
        ],
        "label": "Alejandro Gallinal"
      },
      {
        "name": "Artigas",
        "center": [
          -30.4,
          -56.46667
        ],
        "label": "Artigas"
      },
      {
        "name": "Atlántida",
        "center": [
          -34.7719,
          -55.7584
        ],
        "label": "Atlántida"
      },
      {
        "name": "Baltasar Brum",
        "center": [
          -30.71905,
          -57.32596
        ],
        "label": "Baltasar Brum"
      },
      {
        "name": "Barra de Carrasco",
        "center": [
          -34.87722,
          -56.02972
        ],
        "label": "Barra de Carrasco"
      },
      {
        "name": "Barros Blancos",
        "center": [
          -34.7524,
          -56.00259
        ],
        "label": "Barros Blancos"
      },
      {
        "name": "Bella Unión",
        "center": [
          -30.25966,
          -57.59919
        ],
        "label": "Bella Unión"
      },
      {
        "name": "Bella Vista",
        "center": [
          -34.87527778,
          -56.18666667
        ],
        "label": "Bella Vista"
      },
      {
        "name": "Belvedere",
        "center": [
          -34.85155556,
          -56.21611111
        ],
        "label": "Belvedere"
      },
      {
        "name": "Belén",
        "center": [
          -30.78716,
          -57.77577
        ],
        "label": "Belén"
      },
      {
        "name": "Blanquillo",
        "center": [
          -32.76667,
          -55.63333
        ],
        "label": "Blanquillo"
      },
      {
        "name": "Buceo",
        "center": [
          -34.9,
          -56.13305556
        ],
        "label": "Buceo"
      },
      {
        "name": "Canelones",
        "center": [
          -34.52278,
          -56.27778
        ],
        "label": "Canelones"
      },
      {
        "name": "Capurro (Montevideo)",
        "center": [
          -34.875,
          -56.20555556
        ],
        "label": "Capurro (Montevideo)"
      },
      {
        "name": "Cardal",
        "center": [
          -34.29056,
          -56.38889
        ],
        "label": "Cardal"
      }
    ]
  },
  {
    "code": "UZ",
    "name": "Uzbekistan",
    "cities": [
      {
        "name": "Andijon",
        "center": [
          40.78206,
          72.34424
        ],
        "label": "Andijon"
      },
      {
        "name": "Andijon Tumani",
        "center": [
          40.8,
          72.41667
        ],
        "label": "Andijon Tumani"
      },
      {
        "name": "Angren",
        "center": [
          41.01667,
          70.14361
        ],
        "label": "Angren"
      },
      {
        "name": "Asaka",
        "center": [
          40.64153,
          72.23868
        ],
        "label": "Asaka"
      },
      {
        "name": "Asaka Tumani",
        "center": [
          40.66667,
          72.25
        ],
        "label": "Asaka Tumani"
      },
      {
        "name": "Baliqchi Tumani",
        "center": [
          40.86667,
          72
        ],
        "label": "Baliqchi Tumani"
      },
      {
        "name": "Bekobod",
        "center": [
          40.22083,
          69.26972
        ],
        "label": "Bekobod"
      },
      {
        "name": "Bektemir",
        "center": [
          41.20972,
          69.33417
        ],
        "label": "Bektemir"
      },
      {
        "name": "Beruniy",
        "center": [
          41.69111,
          60.7525
        ],
        "label": "Beruniy"
      },
      {
        "name": "Beshariq",
        "center": [
          40.43583,
          70.61028
        ],
        "label": "Beshariq"
      },
      {
        "name": "Beshkent",
        "center": [
          38.82139,
          65.65306
        ],
        "label": "Beshkent"
      },
      {
        "name": "Boghot Tumani",
        "center": [
          41.31495,
          60.85327
        ],
        "label": "Boghot Tumani"
      },
      {
        "name": "Boysun",
        "center": [
          38.20835,
          67.20664
        ],
        "label": "Boysun"
      },
      {
        "name": "Bo‘ka",
        "center": [
          40.81108,
          69.19417
        ],
        "label": "Bo‘ka"
      },
      {
        "name": "Bo‘z Tumani",
        "center": [
          40.66667,
          71.91667
        ],
        "label": "Bo‘z Tumani"
      },
      {
        "name": "Bukhara",
        "center": [
          39.77472,
          64.42861
        ],
        "label": "Bukhara"
      },
      {
        "name": "Buloqboshi Tumani",
        "center": [
          40.61667,
          72.46667
        ],
        "label": "Buloqboshi Tumani"
      },
      {
        "name": "Bulung’ur",
        "center": [
          39.76472,
          67.27139
        ],
        "label": "Bulung’ur"
      },
      {
        "name": "Charxin",
        "center": [
          39.69667,
          66.76861
        ],
        "label": "Charxin"
      },
      {
        "name": "Chelak",
        "center": [
          39.92028,
          66.86111
        ],
        "label": "Chelak"
      }
    ]
  },
  {
    "code": "VU",
    "name": "Vanuatu",
    "cities": [
      {
        "name": "Isangel",
        "center": [
          -19.54167,
          169.28167
        ],
        "label": "Isangel"
      },
      {
        "name": "Lakatoro",
        "center": [
          -16.09992,
          167.41636
        ],
        "label": "Lakatoro"
      },
      {
        "name": "Luganville",
        "center": [
          -15.51989,
          167.16235
        ],
        "label": "Luganville"
      },
      {
        "name": "Norsup",
        "center": [
          -16.06536,
          167.39714
        ],
        "label": "Norsup"
      },
      {
        "name": "Port-Olry",
        "center": [
          -15.04175,
          167.07265
        ],
        "label": "Port-Olry"
      },
      {
        "name": "Port-Vila",
        "center": [
          -17.73648,
          168.31366
        ],
        "label": "Port-Vila"
      },
      {
        "name": "Sola",
        "center": [
          -13.87611,
          167.55167
        ],
        "label": "Sola"
      }
    ]
  },
  {
    "code": "VA",
    "name": "Vatican City State (Holy See)",
    "cities": [
      {
        "name": "Vatican City",
        "center": [
          41.9029,
          12.4534
        ],
        "label": "Vatican City"
      }
    ]
  },
  {
    "code": "VE",
    "name": "Venezuela",
    "cities": [
      {
        "name": "Acarigua",
        "center": [
          9.55451,
          -69.19564
        ],
        "label": "Acarigua"
      },
      {
        "name": "Altagracia de Orituco",
        "center": [
          9.86005,
          -66.38139
        ],
        "label": "Altagracia de Orituco"
      },
      {
        "name": "Alto Barinas",
        "center": [
          8.5931,
          -70.2261
        ],
        "label": "Alto Barinas"
      },
      {
        "name": "Anaco",
        "center": [
          9.42958,
          -64.46428
        ],
        "label": "Anaco"
      },
      {
        "name": "Aragua de Barcelona",
        "center": [
          9.45588,
          -64.82928
        ],
        "label": "Aragua de Barcelona"
      },
      {
        "name": "Araure",
        "center": [
          9.58144,
          -69.23851
        ],
        "label": "Araure"
      },
      {
        "name": "Barcelona",
        "center": [
          10.13625,
          -64.68618
        ],
        "label": "Barcelona"
      },
      {
        "name": "Barinas",
        "center": [
          8.62261,
          -70.20749
        ],
        "label": "Barinas"
      },
      {
        "name": "Barinitas",
        "center": [
          8.76171,
          -70.41199
        ],
        "label": "Barinitas"
      },
      {
        "name": "Barquisimeto",
        "center": [
          10.0647,
          -69.35703
        ],
        "label": "Barquisimeto"
      },
      {
        "name": "Baruta",
        "center": [
          10.43424,
          -66.87558
        ],
        "label": "Baruta"
      },
      {
        "name": "Boconó",
        "center": [
          9.25385,
          -70.25105
        ],
        "label": "Boconó"
      },
      {
        "name": "Cabimas",
        "center": [
          10.39907,
          -71.45206
        ],
        "label": "Cabimas"
      },
      {
        "name": "Cabudare",
        "center": [
          10.02658,
          -69.26203
        ],
        "label": "Cabudare"
      },
      {
        "name": "Cagua",
        "center": [
          10.18634,
          -67.45935
        ],
        "label": "Cagua"
      },
      {
        "name": "Calabozo",
        "center": [
          8.92416,
          -67.42929
        ],
        "label": "Calabozo"
      },
      {
        "name": "Cantaura",
        "center": [
          9.30571,
          -64.35841
        ],
        "label": "Cantaura"
      },
      {
        "name": "Caraballeda",
        "center": [
          10.61216,
          -66.85192
        ],
        "label": "Caraballeda"
      },
      {
        "name": "Caracas",
        "center": [
          10.5,
          -66.93333333
        ],
        "label": "Caracas"
      },
      {
        "name": "Caripito",
        "center": [
          10.11135,
          -63.09985
        ],
        "label": "Caripito"
      }
    ]
  },
  {
    "code": "VN",
    "name": "Vietnam",
    "cities": [
      {
        "name": "Biên Hòa",
        "center": [
          10.94469,
          106.82432
        ],
        "label": "Biên Hòa"
      },
      {
        "name": "Buôn Ma Thuột",
        "center": [
          12.66747,
          108.03775
        ],
        "label": "Buôn Ma Thuột"
      },
      {
        "name": "Bình Long",
        "center": [
          11.64711,
          106.60586
        ],
        "label": "Bình Long"
      },
      {
        "name": "Bạc Liêu",
        "center": [
          9.29414,
          105.72776
        ],
        "label": "Bạc Liêu"
      },
      {
        "name": "Bảo Lộc",
        "center": [
          11.54798,
          107.80772
        ],
        "label": "Bảo Lộc"
      },
      {
        "name": "Bắc Giang",
        "center": [
          21.27307,
          106.1946
        ],
        "label": "Bắc Giang"
      },
      {
        "name": "Bắc Kạn",
        "center": [
          22.14701,
          105.83481
        ],
        "label": "Bắc Kạn"
      },
      {
        "name": "Bắc Ninh",
        "center": [
          21.18608,
          106.07631
        ],
        "label": "Bắc Ninh"
      },
      {
        "name": "Bến Tre",
        "center": [
          10.24147,
          106.37585
        ],
        "label": "Bến Tre"
      },
      {
        "name": "Bỉm Sơn",
        "center": [
          20.07806,
          105.86028
        ],
        "label": "Bỉm Sơn"
      },
      {
        "name": "Cam Ranh",
        "center": [
          11.92144,
          109.15913
        ],
        "label": "Cam Ranh"
      },
      {
        "name": "Cao Bằng",
        "center": [
          22.66568,
          106.25786
        ],
        "label": "Cao Bằng"
      },
      {
        "name": "Cao Lãnh",
        "center": [
          10.46017,
          105.63294
        ],
        "label": "Cao Lãnh"
      },
      {
        "name": "Cho Dok",
        "center": [
          10.7,
          105.11667
        ],
        "label": "Cho Dok"
      },
      {
        "name": "Cung Kiệm",
        "center": [
          21.18697,
          106.16076
        ],
        "label": "Cung Kiệm"
      },
      {
        "name": "Cà Mau",
        "center": [
          9.17682,
          105.15242
        ],
        "label": "Cà Mau"
      },
      {
        "name": "Cát Bà",
        "center": [
          20.72779,
          107.04819
        ],
        "label": "Cát Bà"
      },
      {
        "name": "Côn Sơn",
        "center": [
          8.68641,
          106.60824
        ],
        "label": "Côn Sơn"
      },
      {
        "name": "Cần Giuộc",
        "center": [
          10.60857,
          106.67135
        ],
        "label": "Cần Giuộc"
      },
      {
        "name": "Cần Giờ",
        "center": [
          10.41115,
          106.95474
        ],
        "label": "Cần Giờ"
      }
    ]
  },
  {
    "code": "VG",
    "name": "Virgin Islands (British)",
    "cities": [
      {
        "name": "Road Town",
        "center": [
          18.4286,
          -64.6185
        ],
        "label": "Road Town"
      }
    ]
  },
  {
    "code": "VI",
    "name": "Virgin Islands (US)",
    "cities": [
      {
        "name": "Charlotte Amalie",
        "center": [
          18.3419,
          -64.9307
        ],
        "label": "Charlotte Amalie"
      }
    ]
  },
  {
    "code": "WF",
    "name": "Wallis And Futuna Islands",
    "cities": [
      {
        "name": "Wallis And Futuna Islands City",
        "center": [
          -13.3,
          -176.2
        ],
        "label": "Wallis And Futuna Islands (Capital / Main)"
      }
    ]
  },
  {
    "code": "EH",
    "name": "Western Sahara",
    "cities": [
      {
        "name": "Western Sahara City",
        "center": [
          24.5,
          -13
        ],
        "label": "Western Sahara (Capital / Main)"
      }
    ]
  },
  {
    "code": "YE",
    "name": "Yemen",
    "cities": [
      {
        "name": "AL-khashā upper",
        "center": [
          14.34044,
          46.71365
        ],
        "label": "AL-khashā upper"
      },
      {
        "name": "Abs",
        "center": [
          16.0215,
          43.0485
        ],
        "label": "Abs"
      },
      {
        "name": "Ad Dahi",
        "center": [
          15.2232,
          43.1935
        ],
        "label": "Ad Dahi"
      },
      {
        "name": "Ad Dis",
        "center": [
          15.0949,
          50.0159
        ],
        "label": "Ad Dis"
      },
      {
        "name": "Ad Durayhimi",
        "center": [
          14.6046,
          43.0718
        ],
        "label": "Ad Durayhimi"
      },
      {
        "name": "Ad Dīs ash Sharqīyah",
        "center": [
          14.9084,
          49.94847
        ],
        "label": "Ad Dīs ash Sharqīyah"
      },
      {
        "name": "Aden",
        "center": [
          12.77944,
          45.03667
        ],
        "label": "Aden"
      },
      {
        "name": "Adh Dhlia'ah",
        "center": [
          15.0139,
          47.8972
        ],
        "label": "Adh Dhlia'ah"
      },
      {
        "name": "Aflah Al Yaman",
        "center": [
          15.9789,
          43.4111
        ],
        "label": "Aflah Al Yaman"
      },
      {
        "name": "Aflah Ash Shawm",
        "center": [
          16.0528,
          43.412
        ],
        "label": "Aflah Ash Shawm"
      },
      {
        "name": "Ahwar",
        "center": [
          13.6853,
          46.7556
        ],
        "label": "Ahwar"
      },
      {
        "name": "Ain",
        "center": [
          14.9503,
          45.6004
        ],
        "label": "Ain"
      },
      {
        "name": "Al  Hawtah",
        "center": [
          13.0624,
          44.8816
        ],
        "label": "Al  Hawtah"
      },
      {
        "name": "Al A'rsh",
        "center": [
          14.3656,
          44.7778
        ],
        "label": "Al A'rsh"
      },
      {
        "name": "Al Abdiyah",
        "center": [
          14.717,
          45.3934
        ],
        "label": "Al Abdiyah"
      },
      {
        "name": "Al Abr",
        "center": [
          15.9137,
          47.2288
        ],
        "label": "Al Abr"
      },
      {
        "name": "Al Ashah",
        "center": [
          16.324,
          43.7874
        ],
        "label": "Al Ashah"
      },
      {
        "name": "Al Bayda",
        "center": [
          13.98523,
          45.57272
        ],
        "label": "Al Bayda"
      },
      {
        "name": "Al Bayda City",
        "center": [
          13.9849,
          45.5566
        ],
        "label": "Al Bayda City"
      },
      {
        "name": "Al Bayḑā’",
        "center": [
          13.93666,
          45.54822
        ],
        "label": "Al Bayḑā’"
      }
    ]
  },
  {
    "code": "ZM",
    "name": "Zambia",
    "cities": [
      {
        "name": "Chadiza",
        "center": [
          -14.06779,
          32.43917
        ],
        "label": "Chadiza"
      },
      {
        "name": "Chama",
        "center": [
          -11.21303,
          33.1521
        ],
        "label": "Chama"
      },
      {
        "name": "Chambishi",
        "center": [
          -12.63247,
          28.05367
        ],
        "label": "Chambishi"
      },
      {
        "name": "Chibombo",
        "center": [
          -14.65685,
          28.07057
        ],
        "label": "Chibombo"
      },
      {
        "name": "Chibombo District",
        "center": [
          -14.65808,
          28.07376
        ],
        "label": "Chibombo District"
      },
      {
        "name": "Chililabombwe",
        "center": [
          -12.36475,
          27.82286
        ],
        "label": "Chililabombwe"
      },
      {
        "name": "Chingola",
        "center": [
          -12.52897,
          27.88382
        ],
        "label": "Chingola"
      },
      {
        "name": "Chingola District",
        "center": [
          -12.48478,
          27.66313
        ],
        "label": "Chingola District"
      },
      {
        "name": "Chinsali",
        "center": [
          -10.54142,
          32.08162
        ],
        "label": "Chinsali"
      },
      {
        "name": "Chipata",
        "center": [
          -13.63333,
          32.65
        ],
        "label": "Chipata"
      },
      {
        "name": "Choma",
        "center": [
          -16.80889,
          26.9875
        ],
        "label": "Choma"
      },
      {
        "name": "Chongwe",
        "center": [
          -15.32916,
          28.68204
        ],
        "label": "Chongwe"
      },
      {
        "name": "Gwembe",
        "center": [
          -16.49755,
          27.60691
        ],
        "label": "Gwembe"
      },
      {
        "name": "Isoka",
        "center": [
          -10.16062,
          32.63353
        ],
        "label": "Isoka"
      },
      {
        "name": "Itezhi-Tezhi District",
        "center": [
          -15.74092,
          26.04146
        ],
        "label": "Itezhi-Tezhi District"
      },
      {
        "name": "Kabompo",
        "center": [
          -13.59268,
          24.20081
        ],
        "label": "Kabompo"
      },
      {
        "name": "Kabwe",
        "center": [
          -14.4469,
          28.44644
        ],
        "label": "Kabwe"
      },
      {
        "name": "Kafue",
        "center": [
          -15.76911,
          28.18136
        ],
        "label": "Kafue"
      },
      {
        "name": "Kalabo",
        "center": [
          -14.99307,
          22.67926
        ],
        "label": "Kalabo"
      },
      {
        "name": "Kalengwa",
        "center": [
          -13.46586,
          25.00271
        ],
        "label": "Kalengwa"
      }
    ]
  },
  {
    "code": "ZW",
    "name": "Zimbabwe",
    "cities": [
      {
        "name": "Banket",
        "center": [
          -17.38333,
          30.4
        ],
        "label": "Banket"
      },
      {
        "name": "Beatrice",
        "center": [
          -18.25283,
          30.8473
        ],
        "label": "Beatrice"
      },
      {
        "name": "Beitbridge",
        "center": [
          -22.21667,
          30
        ],
        "label": "Beitbridge"
      },
      {
        "name": "Beitbridge District",
        "center": [
          -21.89829,
          30.07409
        ],
        "label": "Beitbridge District"
      },
      {
        "name": "Bikita District",
        "center": [
          -20.13752,
          31.93156
        ],
        "label": "Bikita District"
      },
      {
        "name": "Bindura",
        "center": [
          -17.30192,
          31.33056
        ],
        "label": "Bindura"
      },
      {
        "name": "Bindura District",
        "center": [
          -17.2123,
          31.303
        ],
        "label": "Bindura District"
      },
      {
        "name": "Binga",
        "center": [
          -17.62027,
          27.34139
        ],
        "label": "Binga"
      },
      {
        "name": "Binga District",
        "center": [
          -17.8046,
          27.70088
        ],
        "label": "Binga District"
      },
      {
        "name": "Bubi District",
        "center": [
          -19.52508,
          28.67998
        ],
        "label": "Bubi District"
      },
      {
        "name": "Buhera District",
        "center": [
          -19.45658,
          31.93156
        ],
        "label": "Buhera District"
      },
      {
        "name": "Bulawayo",
        "center": [
          -20.15,
          28.58333
        ],
        "label": "Bulawayo"
      },
      {
        "name": "Centenary",
        "center": [
          -16.72289,
          31.11462
        ],
        "label": "Centenary"
      },
      {
        "name": "Centenary District",
        "center": [
          -16.41667,
          31.16667
        ],
        "label": "Centenary District"
      },
      {
        "name": "Chakari",
        "center": [
          -18.06294,
          29.89246
        ],
        "label": "Chakari"
      },
      {
        "name": "Chegutu",
        "center": [
          -18.13021,
          30.14074
        ],
        "label": "Chegutu"
      },
      {
        "name": "Chegutu District",
        "center": [
          -18.13097,
          30.40046
        ],
        "label": "Chegutu District"
      },
      {
        "name": "Chimanimani",
        "center": [
          -19.8,
          32.86667
        ],
        "label": "Chimanimani"
      },
      {
        "name": "Chimanimani District",
        "center": [
          -19.78295,
          32.73338
        ],
        "label": "Chimanimani District"
      },
      {
        "name": "Chinhoyi",
        "center": [
          -17.36667,
          30.2
        ],
        "label": "Chinhoyi"
      }
    ]
  },
  {
    "code": "OTHER",
    "name": "Other Region / Custom City",
    "cities": [
      {
        "name": "Custom",
        "center": [
          24.9215,
          67.0979
        ],
        "label": "Type Custom City / District"
      }
    ]
  }
];
