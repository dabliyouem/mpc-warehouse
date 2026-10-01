// Default Warehouse Configuration and Initial Inventory Data
const DEFAULT_CONFIG = {
  warehouseName: "MPC/SRC WAREHOUSE",
  phone: "+1 234 567 8900",
  whatsapp: "12345678900", // International format digits only for wa.me
  adminPassword: "DABLIYOU12" // Default password for admin panel
};

const INITIAL_PRODUCTS = [
  {
    "id": "prod-1789388006702",
    "ref": "ARMOIR DUCATI",
    "designation": "NA",
    "category": "TABLEAUX ELECTRIQUES",
    "type": "ENVELOPPE (TABLEAU & COFFRET)",
    "qte": 1,
    "unit": "pcs",
    "images": [
      "https://i.postimg.cc/SKFgbf6T/20260908-100721.jpg",
      "https://i.postimg.cc/yN4LCym2/20260908-100731.jpg",
      "https://i.postimg.cc/6QJMxfrb/20260908-100736.jpg",
      "https://i.postimg.cc/q7V1Hxsm/20260908-100744.jpg",
      "https://i.postimg.cc/x1b6Z4zZ/20260908-100748.jpg",
      "https://i.postimg.cc/JzBpF2k5/20260908-100757.jpg",
      "https://i.postimg.cc/GmsXf5yP/20260908-100806.jpg",
      "https://i.postimg.cc/vZ60KNVf/20260908-100815.jpg",
      "https://i.postimg.cc/sgZTLNhY/20260908-100831.jpg"
    ],
    "description": ""
  },
  {
    "id": "prod-1788959259167",
    "ref": "MCS20088PER5",
    "designation": "Armoire au sol , simple porte en acier , IP 55 IK 10, 2000x800x800 - ELDON",
    "category": "TABLEAUX ELECTRIQUES",
    "type": "ENVELOPPE (TABLEAU & COFFRET)",
    "qte": 1,
    "unit": "pcs",
    "images": [
      "https://i.postimg.cc/x88nKdK9/20260908-100318.jpg",
      "https://i.postimg.cc/mkkBQrQg/20260908-100329.jpg",
      "https://i.postimg.cc/prrRDdDd/20260908-100336.jpg",
      "https://i.postimg.cc/Y0Pk8w3p/20260908-100349.jpg"
    ],
    "description": "ARMOIRE CONTENANT DU MATRIEL A LINTRIEUR"
  },
  {
    "id": "prod-1788958832925",
    "ref": "NSYSF201080",
    "designation": "Spacial SF - cellule - 1 porte - sans châssis - assemblé - 2000x1000x800mm",
    "category": "TABLEAUX ELECTRIQUES",
    "type": "ENVELOPPE (TABLEAU & COFFRET)",
    "qte": 2,
    "unit": "pcs",
    "images": [
      "https://i.postimg.cc/Gttdkpv6/20260908-095637.jpg",
      "https://i.postimg.cc/KjjxnYt6/20260908-095646.jpg",
      "https://i.postimg.cc/rssMSpS6/20260908-095654.jpg"
    ],
    "description": ""
  },
  {
    "id": "prod-1788954675047",
    "ref": "PODIV0103",
    "designation": "Resistive Loadbank FCV-400:",
    "category": "TABLEAUX ELECTRIQUES",
    "type": "ENVELOPPE (TABLEAU & COFFRET)",
    "qte": 1,
    "unit": "pcs",
    "images": [
      "https://i.postimg.cc/mD8Tz91q/20260908-095144.jpg",
      "https://i.postimg.cc/76mqGzJR/20260908-095202.jpg",
      "https://i.postimg.cc/fLBMtd0Q/20260908-095211.jpg",
      "https://i.postimg.cc/Xqq4wv9h/20260908-095225.jpg"
    ],
    "description": "IP23 includes 8 steps, Total min Power 400 kW @400 V, 3-ph, 50 HzStep 1,2,..8 @400 V : 50 kW(+/-10%), (3x3.2 Ohm, Y connected, 72 A)Resistor Element: Fe-Cr-Al Resistor Grids Cooling: By 1 x (20,000 m3/h, 400 V, 2.5 kW, 74 dB(A) fan) Air Intake: From below sides, underneath the loadbank Air Exhaust: From top side dischargeAir Flow: Vertical through elementsAs per attached design TR-4501 + Control BoxIncludes (380-400 VAC, 50 Hz, 2.5 kW) cooling fanstep switches, fuses, digital multimeter and step contactors and manual switching\""
  },
  {
    "id": "prod-1788952134576",
    "ref": "MIDI.161.600",
    "designation": "ECRAN DE PROJECTIONS ESCAMOTABLE ET MOTORISÉ 600X375 KAUBER",
    "category": "SYSTEME CFA",
    "type": "AUDIO-VISUEL",
    "qte": 3,
    "unit": "pcs",
    "images": [
      "https://i.postimg.cc/768MjCBP/original-5uw-Lm-Rv-HQLv-C.jpg",
      "https://i.postimg.cc/nzbYNsdF/original-bz-R3e-Juz59m.jpg",
      "https://i.postimg.cc/FRDhdSkn/20260907-151535.jpg",
      "https://i.postimg.cc/mD8Tz91p/20260907-160724.jpg"
    ],
    "description": "MIDI is a large format series of aluminum casing, electric projection screens. Timeless design and a wide selection of projection"
  },
  {
    "id": "prod-1788951882589",
    "ref": "MIDI.161.500",
    "designation": "ECRAN DE PROJECTIONS ESCAMOTABLE ET MOTORISÉ 500X313 KAUBER",
    "category": "SYSTEME CFA",
    "type": "AUDIO-VISUEL",
    "qte": 13,
    "unit": "pcs",
    "images": [
      "https://i.postimg.cc/nzbYNsdF/original-bz-R3e-Juz59m.jpg",
      "https://i.postimg.cc/768MjCBP/original-5uw-Lm-Rv-HQLv-C.jpg",
      "https://i.postimg.cc/DZB7JG41/20260907-151530.jpg",
      "https://i.postimg.cc/mD8Tz91p/20260907-160724.jpg"
    ],
    "description": "MIDI is a large format series of aluminum casing, electric projection screens. Timeless design and a wide selection of projection"
  }
];
