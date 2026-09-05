import type { Place, TripType, TripDirection } from "@/types";

export type BorderDirection = "MX_TO_US" | "US_TO_MX";

export type BorderCorridor =
  | "tijuana-san-diego"
  | "mexicali-calexico"
  | "andrade-los-algodones"
  | "san-luis"
  | "lukeville-sasabe"
  | "nogales"
  | "douglas-naco"
  | "columbus-santa-teresa"
  | "el-paso-juarez"
  | "presidio-o-jinaga"
  | "del-rio-acuna"
  | "eagle-pass-piedras-negras"
  | "laredo-nuevo-laredo"
  | "reynosa-hidalgo"
  | "matamoros-brownsville"
  | "rio-grande-roma";

export interface BorderCrossing {
  id: string;
  name: string;
  mexicanCity: string;
  usCity: string;
  mexicanState: string;
  usState: string;
  mexicanAddress: string;
  usAddress: string;
  corridor: BorderCorridor;
  coordinates: { lat: number; lng: number };
  country: "US";
}

export const BORDER_CROSSINGS: BorderCrossing[] = [
  // Tijuana / San Diego Corridor (CA)
  {
    id: "san-ysidro",
    name: "San Ysidro",
    mexicanCity: "Tijuana",
    usCity: "San Diego",
    mexicanState: "Baja California",
    usState: "California",
    mexicanAddress: "Av. de las Américas s/n, Zona Río, 22000 Tijuana, B.C.",
    usAddress: "7450 Camino de la Plaza, San Ysidro, CA 92173",
    corridor: "tijuana-san-diego",
    coordinates: { lat: 32.5431, lng: -117.0379 },
    country: "US",
  },
  {
    id: "otay-mesa",
    name: "Otay Mesa",
    mexicanCity: "Tijuana",
    usCity: "San Diego",
    mexicanState: "Baja California",
    usState: "California",
    mexicanAddress: "Av. de los Parientes s/n, Mesa de Otay, 22435 Tijuana, B.C.",
    usAddress: "2701 Terminal Ave, San Diego, CA 92154",
    corridor: "tijuana-san-diego",
    coordinates: { lat: 32.5561, lng: -116.9756 },
    country: "US",
  },
  {
    id: "otay-mesa-east",
    name: "Otay Mesa East",
    mexicanCity: "Tijuana",
    usCity: "San Diego",
    mexicanState: "Baja California",
    usState: "California",
    mexicanAddress: "Blvd. 2000, La Presa, 22105 Tijuana, B.C.",
    usAddress: "Chula Vista, CA 91913",
    corridor: "tijuana-san-diego",
    coordinates: { lat: 32.53, lng: -116.91 },
    country: "US",
  },
  {
    id: "tecate",
    name: "Tecate",
    mexicanCity: "Tecate",
    usCity: "Tecate",
    mexicanState: "Baja California",
    usState: "California",
    mexicanAddress: "Libre s/n, Col. Centro, 21400 Tecate, B.C.",
    usAddress: "1500 Eastgate Blvd, Tecate, CA 91980",
    corridor: "tijuana-san-diego",
    coordinates: { lat: 32.5694, lng: -116.6333 },
    country: "US",
  },

  // Mexicali / Calexico + Andrade
  {
    id: "calexico-west",
    name: "Calexico West",
    mexicanCity: "Mexicali",
    usCity: "Calexico",
    mexicanState: "Baja California",
    usState: "California",
    mexicanAddress: "Av. Niños Héroes s/n, Col. Centro, 21100 Mexicali, B.C.",
    usAddress: "1099 East 1st St, Calexico, CA 92231",
    corridor: "mexicali-calexico",
    coordinates: { lat: 32.6789, lng: -115.4989 },
    country: "US",
  },
  {
    id: "calexico-east",
    name: "Calexico East",
    mexicanCity: "Mexicali",
    usCity: "Calexico",
    mexicanState: "Baja California",
    usState: "California",
    mexicanAddress: "Carretera México-Tijuana km 13, 21100 Mexicali, B.C.",
    usAddress: "1415 East 1st St, Calexico, CA 92231",
    corridor: "mexicali-calexico",
    coordinates: { lat: 32.6703, lng: -115.4614 },
    country: "US",
  },
  {
    id: "andrade",
    name: "Andrade",
    mexicanCity: "Los Algodones",
    usCity: "Winterhaven",
    mexicanState: "Baja California",
    usState: "California",
    mexicanAddress: "Av. 5 de Mayo s/n, 21970 Los Algodones, B.C.",
    usAddress: "550 S Winterhaven Dr, Winterhaven, CA 92283",
    corridor: "andrade-los-algodones",
    coordinates: { lat: 32.7315, lng: -114.73 },
    country: "US",
  },

  // Yuma / San Luis + Lukeville / Sasabe (AZ)
  {
    id: "san-luis",
    name: "San Luis",
    mexicanCity: "San Luis Río Colorado",
    usCity: "San Luis",
    mexicanState: "Sonora",
    usState: "Arizona",
    mexicanAddress: "Av. Sonora s/n, Col. Centro, 83400 San Luis R.C., Son.",
    usAddress: "1450 S 1st Ave, San Luis, AZ 85349",
    corridor: "san-luis",
    coordinates: { lat: 32.4863, lng: -114.7817 },
    country: "US",
  },
  {
    id: "lukeville",
    name: "Lukeville",
    mexicanCity: "Sonoyta",
    usCity: "Lukeville",
    mexicanState: "Sonora",
    usState: "Arizona",
    mexicanAddress: "Carretera Sonoyta-Lukeville km 2, 83570 Sonoyta, Son.",
    usAddress: "Highway 85, Lukeville, AZ 85341",
    corridor: "lukeville-sasabe",
    coordinates: { lat: 31.884, lng: -112.832 },
    country: "US",
  },
  {
    id: "sasabe",
    name: "Sasabe",
    mexicanCity: "Sasabe",
    usCity: "Sasabe",
    mexicanState: "Sonora",
    usState: "Arizona",
    mexicanAddress: "Carretera Sásabe-Altar s/n, 83970 Sásabe, Son.",
    usAddress: "Arizona State Route 286, Sasabe, AZ 85633",
    corridor: "lukeville-sasabe",
    coordinates: { lat: 31.485, lng: -111.544 },
    country: "US",
  },
  {
    id: "nogales-mariposa",
    name: "Nogales Mariposa",
    mexicanCity: "Nogales",
    usCity: "Nogales",
    mexicanState: "Sonora",
    usState: "Arizona",
    mexicanAddress: "Av. José López Portillo s/n, Col. Centro, 84000 Nogales, Son.",
    usAddress: "101 N Dual Hwy, Nogales, AZ 85621",
    corridor: "nogales",
    coordinates: { lat: 31.3359, lng: -110.9408 },
    country: "US",
  },
  {
    id: "nogales-deconcini",
    name: "Nogales DeConcini",
    mexicanCity: "Nogales",
    usCity: "Nogales",
    mexicanState: "Sonora",
    usState: "Arizona",
    mexicanAddress: "Av. Adolfo López Mateos s/n, Col. Centro, 84000 Nogales, Son.",
    usAddress: "450 N Dual Hwy, Nogales, AZ 85621",
    corridor: "nogales",
    coordinates: { lat: 31.3442, lng: -110.9392 },
    country: "US",
  },
  {
    id: "nogales-morley",
    name: "Nogales Morley Gate",
    mexicanCity: "Nogales",
    usCity: "Nogales",
    mexicanState: "Sonora",
    usState: "Arizona",
    mexicanAddress: "Calle Morley s/n, Col. Centro, 84000 Nogales, Son.",
    usAddress: "Morley Ave, Nogales, AZ 85621",
    corridor: "nogales",
    coordinates: { lat: 31.3339, lng: -110.9415 },
    country: "US",
  },
  {
    id: "naco",
    name: "Naco",
    mexicanCity: "Naco",
    usCity: "Naco",
    mexicanState: "Sonora",
    usState: "Arizona",
    mexicanAddress: "Av. Francisco I. Madero s/n, 84180 Naco, Son.",
    usAddress: "339 W First St, Naco, AZ 85620",
    corridor: "douglas-naco",
    coordinates: { lat: 31.336, lng: -109.948 },
    country: "US",
  },
  {
    id: "douglas",
    name: "Douglas",
    mexicanCity: "Agua Prieta",
    usCity: "Douglas",
    mexicanState: "Sonora",
    usState: "Arizona",
    mexicanAddress: "Av. 6 s/n, Col. Centro, 84200 Agua Prieta, Son.",
    usAddress: "1 Pan American Ave, Douglas, AZ 85607",
    corridor: "douglas-naco",
    coordinates: { lat: 31.344, lng: -109.543 },
    country: "US",
  },

  // New Mexico
  {
    id: "columbus",
    name: "Columbus",
    mexicanCity: "Palomas",
    usCity: "Columbus",
    mexicanState: "Chihuahua",
    usState: "New Mexico",
    mexicanAddress: "Av. Benito Juárez s/n, 31830 Palomas, Chih.",
    usAddress: "3000 Ash St, Columbus, NM 88029",
    corridor: "columbus-santa-teresa",
    coordinates: { lat: 31.829, lng: -107.639 },
    country: "US",
  },
  {
    id: "santa-teresa",
    name: "Santa Teresa",
    mexicanCity: "San Jerónimo",
    usCity: "Santa Teresa",
    mexicanState: "Chihuahua",
    usState: "New Mexico",
    mexicanAddress: "Carretera Palomas-Juárez km 12, 32543 San Jerónimo, Chih.",
    usAddress: "1189 County Road 187, Santa Teresa, NM 88008",
    corridor: "columbus-santa-teresa",
    coordinates: { lat: 31.871, lng: -106.68 },
    country: "US",
  },
  {
    id: "antelope-wells",
    name: "Antelope Wells",
    mexicanCity: "El Berrendo",
    usCity: "Antelope Wells",
    mexicanState: "Chihuahua",
    usState: "New Mexico",
    mexicanAddress: "Carretera Janos-Agua Prieta s/n, 32830 El Berrendo, Chih.",
    usAddress: "Antelope Wells, NM 88023",
    corridor: "columbus-santa-teresa",
    coordinates: { lat: 31.342, lng: -108.506 },
    country: "US",
  },

  // El Paso / Juárez (TX)
  {
    id: "el-paso-ysleta",
    name: "Ysleta",
    mexicanCity: "Ciudad Juárez",
    usCity: "El Paso",
    mexicanState: "Chihuahua",
    usState: "Texas",
    mexicanAddress: "Av. Carlos Juárez s/n, Col. Centro, 32000 Ciudad Juárez, Chih.",
    usAddress: "11500 Alameda Ave, El Paso, TX 79925",
    corridor: "el-paso-juarez",
    coordinates: { lat: 31.7533, lng: -106.3172 },
    country: "US",
  },
  {
    id: "el-paso-stanton",
    name: "Stanton",
    mexicanCity: "Ciudad Juárez",
    usCity: "El Paso",
    mexicanState: "Chihuahua",
    usState: "Texas",
    mexicanAddress: "Av. Lincoln s/n, Col. Centro, 32000 Ciudad Juárez, Chih.",
    usAddress: "1110 S Stanton St, El Paso, TX 79901",
    corridor: "el-paso-juarez",
    coordinates: { lat: 31.7683, lng: -106.4247 },
    country: "US",
  },
  {
    id: "el-paso-bridge-of-americas",
    name: "Bridge of the Americas",
    mexicanCity: "Ciudad Juárez",
    usCity: "El Paso",
    mexicanState: "Chihuahua",
    usState: "Texas",
    mexicanAddress: "Av. de las Américas s/n, Col. Centro, 32000 Ciudad Juárez, Chih.",
    usAddress: "1601 Delta Dr, El Paso, TX 79901",
    corridor: "el-paso-juarez",
    coordinates: { lat: 31.7683, lng: -106.4503 },
    country: "US",
  },
  {
    id: "el-paso-paso-del-norte",
    name: "Paso del Norte",
    mexicanCity: "Ciudad Juárez",
    usCity: "El Paso",
    mexicanState: "Chihuahua",
    usState: "Texas",
    mexicanAddress: "Av. Juárez s/n, Col. Centro, 32000 Ciudad Juárez, Chih.",
    usAddress: "1001 E 6th Ave, El Paso, TX 79901",
    corridor: "el-paso-juarez",
    coordinates: { lat: 31.765, lng: -106.485 },
    country: "US",
  },
  {
    id: "fabens",
    name: "Fabens",
    mexicanCity: "Caseta",
    usCity: "Fabens",
    mexicanState: "Chihuahua",
    usState: "Texas",
    mexicanAddress: "Carretera Juárez-Porvenir km 45, 32750 Caseta, Chih.",
    usAddress: "13500 Fabens St, Fabens, TX 79838",
    corridor: "el-paso-juarez",
    coordinates: { lat: 31.438, lng: -106.138 },
    country: "US",
  },
  {
    id: "presidio",
    name: "Presidio",
    mexicanCity: "Ojinaga",
    usCity: "Presidio",
    mexicanState: "Chihuahua",
    usState: "Texas",
    mexicanAddress: "Av. Transfronteriza s/n, 32882 Ojinaga, Chih.",
    usAddress: "BIB Rd, Presidio, TX 79845",
    corridor: "presidio-o-jinaga",
    coordinates: { lat: 29.56, lng: -104.372 },
    country: "US",
  },

  // West Texas: Del Rio / Eagle Pass
  {
    id: "del-rio",
    name: "Del Rio",
    mexicanCity: "Ciudad Acuña",
    usCity: "Del Rio",
    mexicanState: "Coahuila",
    usState: "Texas",
    mexicanAddress: "Av. Sur Poniente s/n, Col. Centro, 26200 Ciudad Acuña, Coah.",
    usAddress: "702 W Gibbs St, Del Rio, TX 78840",
    corridor: "del-rio-acuna",
    coordinates: { lat: 29.374, lng: -100.88 },
    country: "US",
  },
  {
    id: "eagle-pass",
    name: "Eagle Pass",
    mexicanCity: "Piedras Negras",
    usCity: "Eagle Pass",
    mexicanState: "Coahuila",
    usState: "Texas",
    mexicanAddress: "Puente Internacional I, 26000 Piedras Negras, Coah.",
    usAddress: "1600 Garrison St, Eagle Pass, TX 78852",
    corridor: "eagle-pass-piedras-negras",
    coordinates: { lat: 28.707, lng: -100.499 },
    country: "US",
  },
  {
    id: "eagle-pass-camino-real",
    name: "Eagle Pass Camino Real",
    mexicanCity: "Piedras Negras",
    usCity: "Eagle Pass",
    mexicanState: "Coahuila",
    usState: "Texas",
    mexicanAddress: "Puente Internacional II, 26000 Piedras Negras, Coah.",
    usAddress: "3200 El Indio Hwy, Eagle Pass, TX 78852",
    corridor: "eagle-pass-piedras-negras",
    coordinates: { lat: 28.69, lng: -100.5 },
    country: "US",
  },

  // Laredo (TX)
  {
    id: "laredo-world-trade",
    name: "Laredo World Trade",
    mexicanCity: "Nuevo Laredo",
    usCity: "Laredo",
    mexicanState: "Tamaulipas",
    usState: "Texas",
    mexicanAddress: "World Trade Bridge, 88000 Nuevo Laredo, Tamps.",
    usAddress: "2200 World Trade Bridge, Laredo, TX 78045",
    corridor: "laredo-nuevo-laredo",
    coordinates: { lat: 27.623, lng: -99.53 },
    country: "US",
  },
  {
    id: "laredo-colombia",
    name: "Laredo Colombia",
    mexicanCity: "Colombia",
    usCity: "Laredo",
    mexicanState: "Nuevo León",
    usState: "Texas",
    mexicanAddress: "Puente Colombia, 66000 Colombia, N.L.",
    usAddress: "Washington St, Laredo, TX 78044",
    corridor: "laredo-nuevo-laredo",
    coordinates: { lat: 27.701, lng: -99.753 },
    country: "US",
  },
  {
    id: "laredo-juarez-lincoln",
    name: "Juarez-Lincoln",
    mexicanCity: "Nuevo Laredo",
    usCity: "Laredo",
    mexicanState: "Tamaulipas",
    usState: "Texas",
    mexicanAddress: "Av. 15 de Junio s/n, Col. Centro, 88000 Nuevo Laredo, Tamps.",
    usAddress: "1000 Salinas Ave, Laredo, TX 78040",
    corridor: "laredo-nuevo-laredo",
    coordinates: { lat: 27.5064, lng: -99.5076 },
    country: "US",
  },
  {
    id: "laredo-gateway",
    name: "Gateway to the Americas",
    mexicanCity: "Nuevo Laredo",
    usCity: "Laredo",
    mexicanState: "Tamaulipas",
    usState: "Texas",
    mexicanAddress: "Av. Doblado s/n, Col. Centro, 88000 Nuevo Laredo, Tamps.",
    usAddress: "1550 San Bernardo Ave, Laredo, TX 78040",
    corridor: "laredo-nuevo-laredo",
    coordinates: { lat: 27.508, lng: -99.505 },
    country: "US",
  },

  // Lower Rio Grande
  {
    id: "roma",
    name: "Roma",
    mexicanCity: "Miguel Alemán",
    usCity: "Roma",
    mexicanState: "Tamaulipas",
    usState: "Texas",
    mexicanAddress: "Puente Roma-Miguel Alemán, 88300 Miguel Alemán, Tamps.",
    usAddress: "500 N Water St, Roma, TX 78584",
    corridor: "rio-grande-roma",
    coordinates: { lat: 26.407, lng: -99.017 },
    country: "US",
  },
  {
    id: "rio-grande-city",
    name: "Rio Grande City",
    mexicanCity: "Camargo",
    usCity: "Rio Grande City",
    mexicanState: "Tamaulipas",
    usState: "Texas",
    mexicanAddress: "Puente Camargo, 88440 Camargo, Tamps.",
    usAddress: "475 S Main St, Rio Grande City, TX 78582",
    corridor: "rio-grande-roma",
    coordinates: { lat: 26.379, lng: -98.824 },
    country: "US",
  },
  {
    id: "hidalgo",
    name: "Hidalgo",
    mexicanCity: "Reynosa",
    usCity: "Hidalgo",
    mexicanState: "Tamaulipas",
    usState: "Texas",
    mexicanAddress: "Av. Cuauhtémoc s/n, Col. Centro, 88000 Reynosa, Tamps.",
    usAddress: "1112 International Blvd, Hidalgo, TX 78557",
    corridor: "reynosa-hidalgo",
    coordinates: { lat: 26.2644, lng: -98.2647 },
    country: "US",
  },
  {
    id: "pharr",
    name: "Pharr",
    mexicanCity: "Reynosa",
    usCity: "Pharr",
    mexicanState: "Tamaulipas",
    usState: "Texas",
    mexicanAddress: "Puente Pharr-Reynosa, 88760 Reynosa, Tamps.",
    usAddress: "1200 S Cage Blvd, Pharr, TX 78577",
    corridor: "reynosa-hidalgo",
    coordinates: { lat: 26.191, lng: -98.191 },
    country: "US",
  },
  {
    id: "anzalduas",
    name: "Anzalduas",
    mexicanCity: "Reynosa",
    usCity: "Mission",
    mexicanState: "Tamaulipas",
    usState: "Texas",
    mexicanAddress: "Puente Anzaldúas, 88760 Reynosa, Tamps.",
    usAddress: "2200 S Anzalduas Hwy, Mission, TX 78572",
    corridor: "reynosa-hidalgo",
    coordinates: { lat: 26.14, lng: -98.33 },
    country: "US",
  },
  {
    id: "donna",
    name: "Donna",
    mexicanCity: "Río Bravo",
    usCity: "Donna",
    mexicanState: "Tamaulipas",
    usState: "Texas",
    mexicanAddress: "Puente Donna-Río Bravo, 88900 Río Bravo, Tamps.",
    usAddress: "1100 S Donna Loop, Donna, TX 78537",
    corridor: "reynosa-hidalgo",
    coordinates: { lat: 26.161, lng: -98.06 },
    country: "US",
  },
  {
    id: "progreso",
    name: "Progreso",
    mexicanCity: "Nuevo Progreso",
    usCity: "Progreso",
    mexicanState: "Tamaulipas",
    usState: "Texas",
    mexicanAddress: "Puente Progreso, 88810 Nuevo Progreso, Tamps.",
    usAddress: "350 S International Blvd, Progreso, TX 78579",
    corridor: "reynosa-hidalgo",
    coordinates: { lat: 26.094, lng: -97.957 },
    country: "US",
  },
  {
    id: "los-indios",
    name: "Los Indios",
    mexicanCity: "Matamoros",
    usCity: "Los Indios",
    mexicanState: "Tamaulipas",
    usState: "Texas",
    mexicanAddress: "Puente Los Indios, 87360 Matamoros, Tamps.",
    usAddress: "2500 S International Blvd, Los Indios, TX 78564",
    corridor: "matamoros-brownsville",
    coordinates: { lat: 26.045, lng: -97.74 },
    country: "US",
  },
  {
    id: "brownsville-gateway",
    name: "Brownsville Gateway",
    mexicanCity: "Matamoros",
    usCity: "Brownsville",
    mexicanState: "Tamaulipas",
    usState: "Texas",
    mexicanAddress: "Puente Gateway, 87360 Matamoros, Tamps.",
    usAddress: "301 E 13th St, Brownsville, TX 78520",
    corridor: "matamoros-brownsville",
    coordinates: { lat: 25.9, lng: -97.495 },
    country: "US",
  },
  {
    id: "brownsville-veterans",
    name: "Brownsville Veterans",
    mexicanCity: "Matamoros",
    usCity: "Brownsville",
    mexicanState: "Tamaulipas",
    usState: "Texas",
    mexicanAddress: "Puente Veterans (Los Tomates), 87360 Matamoros, Tamps.",
    usAddress: "1 Veteran Bridge, Brownsville, TX 78520",
    corridor: "matamoros-brownsville",
    coordinates: { lat: 25.8624, lng: -97.5069 },
    country: "US",
  },
  {
    id: "brownsville-bm",
    name: "Brownsville B&M",
    mexicanCity: "Matamoros",
    usCity: "Brownsville",
    mexicanState: "Tamaulipas",
    usState: "Texas",
    mexicanAddress: "Puente B&M, 87360 Matamoros, Tamps.",
    usAddress: "400 E Harrison St, Brownsville, TX 78520",
    corridor: "matamoros-brownsville",
    coordinates: { lat: 25.898, lng: -97.51 },
    country: "US",
  },
];

export interface BorderCity {
  name: string;
  country: "MX" | "US";
  corridor: BorderCorridor;
  coordinates: { lat: number; lng: number };
}

export const BORDER_CITIES_MX: BorderCity[] = [
  { name: "Tijuana", country: "MX", corridor: "tijuana-san-diego", coordinates: { lat: 32.5149, lng: -117.0382 } },
  { name: "Tecate", country: "MX", corridor: "tijuana-san-diego", coordinates: { lat: 32.5694, lng: -116.6333 } },
  { name: "Mexicali", country: "MX", corridor: "mexicali-calexico", coordinates: { lat: 32.6275, lng: -115.4844 } },
  { name: "Los Algodones", country: "MX", corridor: "andrade-los-algodones", coordinates: { lat: 32.81, lng: -114.73 } },
  { name: "San Luis Río Colorado", country: "MX", corridor: "san-luis", coordinates: { lat: 32.4863, lng: -114.7817 } },
  { name: "Sonoyta", country: "MX", corridor: "lukeville-sasabe", coordinates: { lat: 31.861, lng: -112.85 } },
  { name: "Sasabe", country: "MX", corridor: "lukeville-sasabe", coordinates: { lat: 31.47, lng: -111.54 } },
  { name: "Nogales", country: "MX", corridor: "nogales", coordinates: { lat: 31.2959, lng: -110.9392 } },
  { name: "Naco", country: "MX", corridor: "douglas-naco", coordinates: { lat: 31.31, lng: -109.94 } },
  { name: "Agua Prieta", country: "MX", corridor: "douglas-naco", coordinates: { lat: 31.329, lng: -109.545 } },
  { name: "Palomas", country: "MX", corridor: "columbus-santa-teresa", coordinates: { lat: 31.78, lng: -107.62 } },
  { name: "San Jerónimo", country: "MX", corridor: "columbus-santa-teresa", coordinates: { lat: 31.78, lng: -106.68 } },
  { name: "Ciudad Juárez", country: "MX", corridor: "el-paso-juarez", coordinates: { lat: 31.6904, lng: -106.4245 } },
  { name: "Ojinaga", country: "MX", corridor: "presidio-o-jinaga", coordinates: { lat: 29.565, lng: -104.415 } },
  { name: "Ciudad Acuña", country: "MX", corridor: "del-rio-acuna", coordinates: { lat: 29.325, lng: -100.938 } },
  { name: "Piedras Negras", country: "MX", corridor: "eagle-pass-piedras-negras", coordinates: { lat: 28.685, lng: -100.523 } },
  { name: "Nuevo Laredo", country: "MX", corridor: "laredo-nuevo-laredo", coordinates: { lat: 27.4757, lng: -99.5213 } },
  { name: "Colombia", country: "MX", corridor: "laredo-nuevo-laredo", coordinates: { lat: 27.7, lng: -99.75 } },
  { name: "Miguel Alemán", country: "MX", corridor: "rio-grande-roma", coordinates: { lat: 26.435, lng: -99.028 } },
  { name: "Camargo", country: "MX", corridor: "rio-grande-roma", coordinates: { lat: 26.319, lng: -98.83 } },
  { name: "Reynosa", country: "MX", corridor: "reynosa-hidalgo", coordinates: { lat: 26.0928, lng: -98.277 } },
  { name: "Río Bravo", country: "MX", corridor: "reynosa-hidalgo", coordinates: { lat: 26.02, lng: -98.09 } },
  { name: "Nuevo Progreso", country: "MX", corridor: "reynosa-hidalgo", coordinates: { lat: 26.05, lng: -97.95 } },
  { name: "Matamoros", country: "MX", corridor: "matamoros-brownsville", coordinates: { lat: 25.8694, lng: -97.5034 } },
  { name: "Ensenada", country: "MX", corridor: "tijuana-san-diego", coordinates: { lat: 31.8667, lng: -116.6006 } },
  { name: "Rosarito", country: "MX", corridor: "tijuana-san-diego", coordinates: { lat: 32.3595, lng: -117.0464 } },
];

export const BORDER_CITIES_US: BorderCity[] = [
  { name: "San Diego", country: "US", corridor: "tijuana-san-diego", coordinates: { lat: 32.7157, lng: -117.1611 } },
  { name: "Chula Vista", country: "US", corridor: "tijuana-san-diego", coordinates: { lat: 32.6401, lng: -117.0842 } },
  { name: "Winterhaven", country: "US", corridor: "andrade-los-algodones", coordinates: { lat: 32.78, lng: -114.67 } },
  { name: "Calexico", country: "US", corridor: "mexicali-calexico", coordinates: { lat: 32.6789, lng: -115.4989 } },
  { name: "San Luis", country: "US", corridor: "san-luis", coordinates: { lat: 32.487, lng: -114.7822 } },
  { name: "Lukeville", country: "US", corridor: "lukeville-sasabe", coordinates: { lat: 31.884, lng: -112.832 } },
  { name: "Sasabe", country: "US", corridor: "lukeville-sasabe", coordinates: { lat: 31.485, lng: -111.544 } },
  { name: "Nogales", country: "US", corridor: "nogales", coordinates: { lat: 31.3404, lng: -110.9383 } },
  { name: "Naco", country: "US", corridor: "douglas-naco", coordinates: { lat: 31.33, lng: -109.94 } },
  { name: "Douglas", country: "US", corridor: "douglas-naco", coordinates: { lat: 31.344, lng: -109.543 } },
  { name: "Columbus", country: "US", corridor: "columbus-santa-teresa", coordinates: { lat: 31.829, lng: -107.639 } },
  { name: "Santa Teresa", country: "US", corridor: "columbus-santa-teresa", coordinates: { lat: 31.871, lng: -106.68 } },
  { name: "Antelope Wells", country: "US", corridor: "columbus-santa-teresa", coordinates: { lat: 31.342, lng: -108.506 } },
  { name: "El Paso", country: "US", corridor: "el-paso-juarez", coordinates: { lat: 31.7619, lng: -106.485 } },
  { name: "Fabens", country: "US", corridor: "el-paso-juarez", coordinates: { lat: 31.438, lng: -106.138 } },
  { name: "Presidio", country: "US", corridor: "presidio-o-jinaga", coordinates: { lat: 29.56, lng: -104.372 } },
  { name: "Del Rio", country: "US", corridor: "del-rio-acuna", coordinates: { lat: 29.374, lng: -100.88 } },
  { name: "Eagle Pass", country: "US", corridor: "eagle-pass-piedras-negras", coordinates: { lat: 28.707, lng: -100.499 } },
  { name: "Laredo", country: "US", corridor: "laredo-nuevo-laredo", coordinates: { lat: 27.5064, lng: -99.5076 } },
  { name: "Roma", country: "US", corridor: "rio-grande-roma", coordinates: { lat: 26.407, lng: -99.017 } },
  { name: "Rio Grande City", country: "US", corridor: "rio-grande-roma", coordinates: { lat: 26.379, lng: -98.824 } },
  { name: "Hidalgo", country: "US", corridor: "reynosa-hidalgo", coordinates: { lat: 26.2644, lng: -98.2647 } },
  { name: "Pharr", country: "US", corridor: "reynosa-hidalgo", coordinates: { lat: 26.191, lng: -98.191 } },
  { name: "Anzalduas", country: "US", corridor: "reynosa-hidalgo", coordinates: { lat: 26.14, lng: -98.33 } },
  { name: "Donna", country: "US", corridor: "reynosa-hidalgo", coordinates: { lat: 26.161, lng: -98.06 } },
  { name: "Progreso", country: "US", corridor: "reynosa-hidalgo", coordinates: { lat: 26.094, lng: -97.957 } },
  { name: "Los Indios", country: "US", corridor: "matamoros-brownsville", coordinates: { lat: 26.045, lng: -97.74 } },
  { name: "Brownsville", country: "US", corridor: "matamoros-brownsville", coordinates: { lat: 25.9261, lng: -97.4973 } },
];

export function getBorderCitiesForDirection(direction: BorderDirection): BorderCity[] {
  return direction === "MX_TO_US" ? BORDER_CITIES_MX : BORDER_CITIES_US;
}

export function getCrossingsForDirection(direction: BorderDirection): BorderCrossing[] {
  return BORDER_CROSSINGS;
}

export function findNearestCrossing(
  lat: number,
  lng: number
): BorderCrossing | null {
  let nearest: BorderCrossing | null = null;
  let minDist = Infinity;

  for (const crossing of BORDER_CROSSINGS) {
    const dist = haversineDistance(
      { lat, lng },
      crossing.coordinates
    );
    if (dist < minDist) {
      minDist = dist;
      nearest = crossing;
    }
  }

  return nearest;
}

export function isNearBorder(
  lat: number,
  lng: number,
  thresholdKm: number = 100
): boolean {
  const nearest = findNearestCrossing(lat, lng);
  if (!nearest) return false;
  return haversineDistance({ lat, lng }, nearest.coordinates) <= thresholdKm;
}

/** Determine which country a point is in based on nearest border crossing */
export function detectCountryFromLocation(
  lat: number,
  lng: number
): "MX" | "US" | null {
  const nearest = findNearestCrossing(lat, lng);
  if (!nearest) return null;

  const dist = haversineDistance({ lat, lng }, nearest.coordinates);
  if (dist > 200) return null;

  const mxCity = BORDER_CITIES_MX.find(
    (c) => c.name === nearest.mexicanCity
  );
  const usCity = BORDER_CITIES_US.find(
    (c) => c.name === nearest.usCity
  );

  if (!mxCity || !usCity) return null;

  const distToMx = haversineDistance({ lat, lng }, mxCity.coordinates);
  const distToUs = haversineDistance({ lat, lng }, usCity.coordinates);

  return distToMx < distToUs ? "MX" : "US";
}

/** Get destination cities (the OTHER side) given an origin country */
export function getDestinationCities(
  originCountry: "MX" | "US"
): BorderCity[] {
  return originCountry === "MX" ? BORDER_CITIES_US : BORDER_CITIES_MX;
}

/** Get origin cities (same side as the user) */
export function getOriginCities(
  userCountry: "MX" | "US"
): BorderCity[] {
  return userCountry === "MX" ? BORDER_CITIES_MX : BORDER_CITIES_US;
}

/** Find matching crossings between two border cities */
export function findCrossingsBetween(
  originName: string,
  destinationName: string
): BorderCrossing[] {
  const direct = BORDER_CROSSINGS.filter(
    (c) =>
      (c.mexicanCity === originName && c.usCity === destinationName) ||
      (c.usCity === originName && c.mexicanCity === destinationName)
  );

  if (direct.length > 0) return direct;

  const originCity = [...BORDER_CITIES_MX, ...BORDER_CITIES_US].find(
    (c) => c.name === originName
  );
  const destCity = [...BORDER_CITIES_MX, ...BORDER_CITIES_US].find(
    (c) => c.name === destinationName
  );

  const corridor = originCity?.corridor ?? destCity?.corridor;
  if (corridor) {
    return BORDER_CROSSINGS.filter((c) => c.corridor === corridor);
  }

  if (destCity) {
    return [...BORDER_CROSSINGS]
      .sort(
        (a, b) =>
          haversineDistance(a.coordinates, destCity.coordinates) -
          haversineDistance(b.coordinates, destCity.coordinates)
      )
      .slice(0, 3);
  }

  return [];
}

/** Get corridor display label */
export function getCorridorLabel(corridor: BorderCorridor): string {
  const labels: Record<BorderCorridor, string> = {
    "tijuana-san-diego": "Tijuana / San Diego",
    "mexicali-calexico": "Mexicali / Calexico",
    "andrade-los-algodones": "Los Algodones / Andrade",
    "san-luis": "San Luis",
    "lukeville-sasabe": "Lukeville / Sasabe",
    nogales: "Nogales",
    "douglas-naco": "Douglas / Naco",
    "columbus-santa-teresa": "Columbus / Santa Teresa",
    "el-paso-juarez": "El Paso / Ciudad Juárez",
    "presidio-o-jinaga": "Presidio / Ojinaga",
    "del-rio-acuna": "Del Rio / Acuña",
    "eagle-pass-piedras-negras": "Eagle Pass / Piedras Negras",
    "laredo-nuevo-laredo": "Laredo / Nuevo Laredo",
    "reynosa-hidalgo": "Reynosa / Hidalgo",
    "matamoros-brownsville": "Matamoros / Brownsville",
    "rio-grande-roma": "Roma / Rio Grande",
  };
  return labels[corridor] ?? corridor;
}

/** Group cities by corridor */
export function groupCitiesByCorridor(
  cities: BorderCity[]
): Array<{ corridor: BorderCorridor; label: string; cities: BorderCity[] }> {
  const grouped = new Map<BorderCorridor, BorderCity[]>();
  for (const city of cities) {
    const existing = grouped.get(city.corridor) ?? [];
    existing.push(city);
    grouped.set(city.corridor, existing);
  }

  return Array.from(grouped.entries())
    .map(([corridor, c]) => ({
      corridor,
      label: getCorridorLabel(corridor),
      cities: c,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

/** Find the nearest border city to a coordinate */
export function findNearestBorderCity(
  lat: number,
  lng: number
): BorderCity | null {
  const allCities = [...BORDER_CITIES_MX, ...BORDER_CITIES_US];
  let nearest: BorderCity | null = null;
  let minDist = Infinity;

  for (const city of allCities) {
    const dist = haversineDistance({ lat, lng }, city.coordinates);
    if (dist < minDist) {
      minDist = dist;
      nearest = city;
    }
  }

  if (minDist > 200) return null;

  return nearest;
}

export function haversineDistance(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const sinHalfLat = Math.sin(dLat / 2);
  const sinHalfLng = Math.sin(dLng / 2);
  const h =
    sinHalfLat * sinHalfLat +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      sinHalfLng * sinHalfLng;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// ─── New Trip Intelligence Functions ───

/** Determine if a trip crosses the US-MX border */
export function detectTripType(
  start: Place,
  destination: Place
): TripType {
  if (start.country === destination.country) {
    return "same_country";
  }

  const validDirections = [
    { from: "MX", to: "US" },
    { from: "US", to: "MX" },
  ];

  const isValid = validDirections.some(
    (d) => start.country === d.from && destination.country === d.to
  );

  return isValid ? "cross_border" : "unsupported";
}

/** Derive border direction from start and destination */
export function deriveDirection(
  start: Place,
  destination: Place
): TripDirection | null {
  if (start.country === "MX" && destination.country === "US") {
    return "MX_TO_US";
  }
  if (start.country === "US" && destination.country === "MX") {
    return "US_TO_MX";
  }
  return null;
}

/** Find candidate crossings based on route geography */
export function findCandidateCrossings(
  start: Place,
  destination: Place,
  direction: TripDirection
): BorderCrossing[] {
  const routeMidpoint = {
    lat: (start.latitude + destination.latitude) / 2,
    lng: (start.longitude + destination.longitude) / 2,
  };

  const withDistance = BORDER_CROSSINGS.map((crossing) => ({
    crossing,
    distanceToRoute:
      haversineDistance(crossing.coordinates, routeMidpoint) +
      haversineDistance(crossing.coordinates, { lat: start.latitude, lng: start.longitude }) * 0.3 +
      haversineDistance(crossing.coordinates, { lat: destination.latitude, lng: destination.longitude }) * 0.3,
  }));

  withDistance.sort((a, b) => a.distanceToRoute - b.distanceToRoute);

  return withDistance.slice(0, 5).map((item) => item.crossing);
}
