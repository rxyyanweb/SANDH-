import { DeliveryArea, MenuItem, MenuAddon } from '../types/restaurant';

export const RESTAURANT_INFO = {
  name: 'Sandh Restaurant',
  shortName: 'SANDH',
  tagline: 'Desi Cuisine & B.B.Q',
  category: 'Restaurant',
  subtitle: 'Authentic Taste. Memorable Moments.',
  totalReviews: '4.6(14)',
  phone: '03332793101',
  displayPhone: '0333 2793101',
  internationalPhone: '+923332793101',
  whatsappUrl: 'https://wa.me/923332793101',
  address: 'Allamah Basheer Ahmed Usmani Rd, Ayaz Town Shop #3, A 286، near Mochi More, Block 2 Gulshan-e-Iqbal, Karachi, Pakistan',
  mapsUrl: 'https://www.google.com/maps/place/S%26H+restaurant/@24.9225142,67.0699474,15z/data=!4m10!1m2!2m1!1srestaurants+near+me!3m6!1s0x3eb33fc9b025732b:0x809c7d522c2a7086!8m2!3d24.9208656!4d67.0865588!15sChNyZXN0YXVyYW50cyBuZWFyIG1lIgOQAQFaFSITcmVzdGF1cmFudHMgbmVhciBtZZIBCnJlc3RhdXJhbnTgAQA!16s%2Fg%2F11k7d1x2x0!5m1!1e1?entry=ttu&g_ep=EgoyMDI2MDkyMy4wIKXMDSoASAFQAw%3D%3D',
  facebookUrl: 'https://www.facebook.com/sandhrestaurantpk/?ref=NONE_xav_ig_profile_page_web#',
  instagramUrl: 'https://www.instagram.com/sandhrestaurant?igshid=63l5zet6bt2o',
  logoUrl:
    'https://instagram.fkhi22-1.fna.fbcdn.net/v/t51.2885-19/118764810_928643887620916_103410680705154400_n.jpg?stp=dst-jpg_s150x150_tt6&_nc_cat=107&_nc_map=urlgen_bucketless&ccb=7-5&_nc_sid=f7ccc5&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy41MDAuQzMifQ%3D%3D&_nc_ohc=qFxT6JoTSOsQ7kNvwE5lsCp&_nc_oc=AdqkwyoAkRYVZN1TvfvrbuLX9eA6KZ5uTXPOdXH3HJfJta60d0z9oCXlHiW6Y2LVI6I&_nc_zt=24&_nc_ht=instagram.fkhi22-1.fna&_nc_ss=7b6a8&oh=00_AQKQnxsoweMyBsEssdLV5H9Fbqb4q0P7FNRjUCEr7PrXuw&oe=6ABDB289',
  heroFirstImageUrl:
    'https://scontent.fkhi22-1.fna.fbcdn.net/v/t39.30808-6/306085060_467288025412175_2572772496143365089_n.png?stp=dst-png&cstp=mx640x360&ctp=s640x360&_nc_cat=103&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=kA5iPJAwW4QQ7kNvwE6VYbK&_nc_oc=AdpP8xia0O-CtYmK82Yo4bFt9M-JJpTMgJfEX4ws2R4ikqagWLy9ruDdvKa3nyZ3TWs&_nc_zt=23&_nc_ht=scontent.fkhi22-1.fna&_nc_gid=TTSeuaQ4N0GpYjqu785clg&_nc_ss=7b2a8&oh=00_AQLeatSVbolZH5IpqpdFGwuC33gdEASHltCgRVm1R_iG_A&oe=6ABD96E2',
  aboutText:
    'Sandh Restaurant offers an unforgettable dining experience with sizzling charcoal BBQ, authentic Karahi, Handi, and traditional delicacies for dine-in, takeaway, and delivery.',
  demoDisclaimer: 'Demo Website — Orders and reservations placed here are for demonstration purposes only.',
};

export const DELIVERY_AREAS: DeliveryArea[] = [
  { id: 'clifton', name: 'Clifton (Block 1–9 & Ocean Towers)', fee: 100, estimatedTime: '25–35 min' },
  { id: 'dha', name: 'DHA (Phase 1–8)', fee: 150, estimatedTime: '30–40 min' },
  { id: 'gulshan_iqbal', name: 'Gulshan-e-Iqbal', fee: 120, estimatedTime: '30–40 min' },
  { id: 'gulshan_jamal', name: 'Gulshan-e-Jamal', fee: 180, estimatedTime: '35–45 min' },
  { id: 'johar', name: 'Gulistan-e-Johar', fee: 200, estimatedTime: '40–50 min' },
  { id: 'bahadurabad', name: 'Bahadurabad & Dhoraji', fee: 220, estimatedTime: '40–50 min' },
  { id: 'fb_area', name: 'Federal B Area', fee: 240, estimatedTime: '45–55 min' },
  { id: 'university_rd', name: 'University Road / Scheme 33', fee: 250, estimatedTime: '45–55 min' },
];

export const CATEGORIES = [
  { id: 'all', label: 'All Dishes' },
  { id: 'karahi', label: 'Karahi' },
  { id: 'bbq', label: 'BBQ' },
  { id: 'handi', label: 'Handi' },
  { id: 'rice', label: 'Rice' },
  { id: 'tandoor', label: 'Tandoor' },
  { id: 'salads_raita', label: 'Salads & Raita' },
  { id: 'drinks', label: 'Drinks' },
  { id: 'desserts', label: 'Desserts' },
] as const;

// Common reusable add-ons matching screenshots
export const ADDON_DESI_GHEE: MenuAddon = { id: 'desi_ghee', name: 'Desi Ghee', price: 200, category: 'addon' };
export const ADDON_BUTTER: MenuAddon = { id: 'butter', name: 'Butter', price: 200, category: 'addon' };
export const ADDON_OLIVE_OIL: MenuAddon = { id: 'olive_oil', name: 'Olive Oil', price: 300, category: 'addon' };

export const ADDON_ROGHNI_NAAN: MenuAddon = { id: 'roghni_naan', name: 'Roghni Naan', price: 70, category: 'bread' };
export const ADDON_SADA_NAAN: MenuAddon = { id: 'sada_naan', name: 'Sada Naan', price: 40, category: 'bread' };
export const ADDON_GARLIC_NAAN: MenuAddon = { id: 'garlic_naan', name: 'Garlic Naan', price: 110, category: 'bread' };
export const ADDON_PARATHA: MenuAddon = { id: 'paratha', name: 'Crispy Paratha', price: 90, category: 'bread' };

export const ADDON_ZEERA_RAITA: MenuAddon = { id: 'zeera_raita', name: 'Zeera Raita', price: 90, category: 'raita' };
export const ADDON_MINT_RAITA: MenuAddon = { id: 'mint_raita', name: 'Mint Raita', price: 80, category: 'raita' };
export const ADDON_IMLI_CHUTNEY: MenuAddon = { id: 'imli_chutney', name: 'Special Imli Chutney', price: 60, category: 'raita' };
export const ADDON_FRESH_SALAD: MenuAddon = { id: 'fresh_salad', name: 'Fresh Kachumber Salad', price: 90, category: 'raita' };

const KARAHI_STANDARD_ADDONS = [
  ADDON_DESI_GHEE,
  ADDON_BUTTER,
  ADDON_OLIVE_OIL,
  ADDON_PARATHA,
  ADDON_ROGHNI_NAAN,
  ADDON_GARLIC_NAAN,
  ADDON_SADA_NAAN,
  ADDON_ZEERA_RAITA,
  ADDON_MINT_RAITA,
  ADDON_FRESH_SALAD,
];

export const MENU_ITEMS: MenuItem[] = [
  // Karahi
  {
    id: 'chicken_koyla_karahi',
    name: 'Chicken Koyla Karahi',
    categoryId: 'karahi',
    description: 'Experience The Unique Smoky Aroma Of Coal In This Flavorful Tomato Puree Gravy Karahi.',
    basePrice: 1300,
    image: '/src/assets/images/hero_karahi_pot_1790346550068.jpg',
    popular: true,
    spicyLevel: 2,
    sizes: [
      { name: 'Half', price: 1300, serves: '1-2 persons' },
      { name: 'Full', price: 2400, serves: '3-4 persons' },
    ],
    availableAddons: KARAHI_STANDARD_ADDONS,
  },
  {
    id: 'chicken_white_karahi',
    name: 'Chicken White Karahi',
    categoryId: 'karahi',
    description: 'Silky smooth mild karahi braised with thick dairy yogurt, fresh cream, white pepper, and roasted cumin.',
    basePrice: 1500,
    image: '/src/assets/images/reshmi_handi_dish_1790349458574.jpg',
    popular: true,
    spicyLevel: 1,
    sizes: [
      { name: 'Half', price: 1500, serves: '1-2 persons' },
      { name: 'Full', price: 2600, serves: '3-4 persons' },
    ],
    availableAddons: KARAHI_STANDARD_ADDONS,
  },
  {
    id: 'chicken_karahi',
    name: 'Chicken Karahi',
    categoryId: 'karahi',
    description: 'Fresh chicken cooked in a traditional iron wok with fresh tomatoes, ginger juliennes, green chilies and house spices.',
    basePrice: 1150,
    image: '/src/assets/images/hero_karahi_pot_1790346550068.jpg',
    popular: true,
    spicyLevel: 2,
    sizes: [
      { name: 'Half', price: 1150, serves: '1-2 persons' },
      { name: 'Full', price: 1950, serves: '3-4 persons' },
    ],
    availableAddons: KARAHI_STANDARD_ADDONS,
  },
  {
    id: 'mutton_karahi',
    name: 'Mutton Karahi',
    categoryId: 'karahi',
    description: 'Tender mutton cutlets simmered in black wok gravy with organic ghee, crushed black pepper, and whole green chilies.',
    basePrice: 1850,
    image: '/src/assets/images/mutton_karahi_dish_1790349442345.jpg',
    popular: true,
    spicyLevel: 2,
    sizes: [
      { name: 'Half', price: 1850, serves: '1-2 persons' },
      { name: 'Full', price: 3300, serves: '3-4 persons' },
    ],
    availableAddons: KARAHI_STANDARD_ADDONS,
  },

  // Handi
  {
    id: 'chicken_makhni_handi',
    name: 'Chicken Makhni Handi',
    categoryId: 'handi',
    description: 'Boneless tender chicken cubes slow-cooked in rich creamy butter gravy inside an earthen clay pot.',
    basePrice: 1250,
    image: '/src/assets/images/clay_pot_handi_1790346583434.jpg',
    popular: true,
    spicyLevel: 1,
    sizes: [
      { name: 'Half', price: 1250, serves: '1-2 persons' },
      { name: 'Full', price: 2150, serves: '3-4 persons' },
    ],
    availableAddons: KARAHI_STANDARD_ADDONS,
  },
  {
    id: 'chicken_reshmi_handi',
    name: 'Chicken Reshmi Handi',
    categoryId: 'handi',
    description: 'Silky smooth boneless chicken simmered in cashew-cream gravy with mild aromatic herbs.',
    basePrice: 1290,
    image: '/src/assets/images/reshmi_handi_dish_1790349458574.jpg',
    spicyLevel: 1,
    sizes: [
      { name: 'Half', price: 1290, serves: '1-2 persons' },
      { name: 'Full', price: 2200, serves: '3-4 persons' },
    ],
    availableAddons: KARAHI_STANDARD_ADDONS,
  },

  // BBQ & Specialties
  {
    id: 'isfahani_boti',
    name: 'Isfahani Boti',
    categoryId: 'bbq',
    description: 'Charcoal grilled tender Persian spiced boneless chicken skewers served with lemon & salad.',
    basePrice: 1000,
    image: '/src/assets/images/bbq_seekh_tikka_1790346568096.jpg',
    popular: true,
  },
  {
    id: 'crispy_fries',
    name: 'Crispy Fries',
    categoryId: 'bbq',
    description: 'Golden seasoned potato french fries served hot with tangy tomato dip.',
    basePrice: 350,
    image: '/src/assets/images/tikka_boti_platter_1790349472788.jpg',
    popular: true,
  },
  {
    id: 'shahi_tikka',
    name: 'Shahi Tikka',
    categoryId: 'bbq',
    description: 'Chef signature chicken quarter charbroiled with royal almond cream glaze.',
    basePrice: 530,
    image: '/src/assets/images/tikka_boti_platter_1790349472788.jpg',
    popular: true,
  },
  {
    id: 'fish_n_chips',
    name: 'Fish N Chips',
    categoryId: 'bbq',
    description: 'Golden batter-fried fish fillets with tartar dip and seasoned french fries.',
    basePrice: 1050,
    image: '/src/assets/images/beef_seekh_kabab_1790349486611.jpg',
    popular: true,
  },
  {
    id: 'chicken_seekh_kabab',
    name: 'Chicken Seekh Kabab',
    categoryId: 'bbq',
    description: 'Charcoal-grilled minced chicken skewers infused with onion, fresh mint, coriander, and royal BBQ spice blend.',
    basePrice: 650,
    image: '/src/assets/images/bbq_seekh_tikka_1790346568096.jpg',
    popular: true,
    spicyLevel: 2,
    sizes: [
      { name: 'Portion (4 pcs)', price: 650, serves: '1-2 persons' },
    ],
    availableAddons: [ADDON_ROGHNI_NAAN, ADDON_MINT_RAITA, ADDON_IMLI_CHUTNEY, ADDON_FRESH_SALAD],
  },
  {
    id: 'chicken_tikka_boti',
    name: 'Chicken Tikka Boti',
    categoryId: 'bbq',
    description: 'Smoky skewered boneless chicken chunks marinated in yogurt, raw papaya, and roasted cumin over hot coals.',
    basePrice: 580,
    image: '/src/assets/images/tikka_boti_platter_1790349472788.jpg',
    spicyLevel: 2,
    sizes: [
      { name: 'Portion (8 pcs)', price: 580, serves: '1-2 persons' },
    ],
    availableAddons: [ADDON_PARATHA, ADDON_ROGHNI_NAAN, ADDON_MINT_RAITA, ADDON_IMLI_CHUTNEY],
  },
  {
    id: 'beef_seekh_kabab',
    name: 'Beef Seekh Kabab',
    categoryId: 'bbq',
    description: 'Juicy melt-in-mouth beef skewers flame-grilled to perfection over natural hardwood charcoal.',
    basePrice: 720,
    image: '/src/assets/images/beef_seekh_kabab_1790349486611.jpg',
    popular: true,
    spicyLevel: 2,
    sizes: [
      { name: 'Portion (4 pcs)', price: 720, serves: '1-2 persons' },
    ],
    availableAddons: [ADDON_ROGHNI_NAAN, ADDON_SADA_NAAN, ADDON_MINT_RAITA, ADDON_IMLI_CHUTNEY],
  },

  // Rice
  {
    id: 'special_chicken_biryani',
    name: 'Special Chicken Biryani',
    categoryId: 'rice',
    description: 'Fragrant basmati sella rice layered with spiced chicken, golden potatoes, dried plums, and saffron aroma.',
    basePrice: 450,
    image: '/src/assets/images/chicken_biryani_1790349499099.jpg',
    popular: true,
    spicyLevel: 2,
    sizes: [
      { name: 'Single Portion', price: 450, serves: '1 person' },
      { name: 'Double Portion', price: 800, serves: '2-3 persons' },
    ],
    availableAddons: [ADDON_ZEERA_RAITA, ADDON_FRESH_SALAD],
  },
  {
    id: 'matka_mutton_biryani',
    name: 'Matka Mutton Biryani',
    categoryId: 'rice',
    description: 'Dum-cooked mutton biryani sealed in a clay matka with rose water, kewra essence, and roasted dry fruits.',
    basePrice: 850,
    image: '/src/assets/images/matka_biryani_1790349512479.jpg',
    spicyLevel: 2,
    sizes: [
      { name: 'Single Pot', price: 850, serves: '1-2 persons' },
    ],
    availableAddons: [ADDON_ZEERA_RAITA, ADDON_FRESH_SALAD],
  },

  // Tandoor
  {
    id: 'roghni_naan',
    name: 'Roghni Naan (Min. 4 Pcs)',
    categoryId: 'tandoor',
    description: 'Traditional tandoori bread glazed with milk, butter, and toasted white sesame seeds. Minimum order 4 pcs.',
    basePrice: 70,
    image: '/src/assets/images/tandoori_naan_basket_1790346599982.jpg',
  },
  {
    id: 'sada_tandoori_naan',
    name: 'Sada Tandoori Naan',
    categoryId: 'tandoor',
    description: 'Crisp and fluffy clay-oven leavened bread baked fresh on order.',
    basePrice: 40,
    image: '/src/assets/images/tandoori_naan_basket_1790346599982.jpg',
  },
  {
    id: 'crispy_lacha_paratha',
    name: 'Crispy Lacha Paratha',
    categoryId: 'tandoor',
    description: 'Multi-layered flaky paratha pan-fried with pure golden ghee.',
    basePrice: 90,
    image: '/src/assets/images/tandoori_naan_basket_1790346599982.jpg',
  },

  // Salads & Raita
  {
    id: 'zeera_raita',
    name: 'Zeera Raita',
    categoryId: 'salads_raita',
    description: 'Whisked fresh curd infused with roasted cumin seeds and a hint of rock salt.',
    basePrice: 90,
    image: '/src/assets/images/bbq_seekh_tikka_1790346568096.jpg',
  },
  {
    id: 'fresh_kachumber_salad',
    name: 'Fresh Kachumber Salad',
    categoryId: 'salads_raita',
    description: 'Finely diced crisp cucumbers, red onions, tomatoes, and green chilies with fresh lemon dressing.',
    basePrice: 90,
    image: '/src/assets/images/tikka_boti_platter_1790349472788.jpg',
  },

  // Drinks
  {
    id: 'mint_margarita',
    name: 'Fresh Mint Margarita',
    categoryId: 'drinks',
    description: 'Chilled crushed ice beverage with fresh garden mint leaves, fresh lime juice, and sparkling soda.',
    basePrice: 220,
    image: '/src/assets/images/refreshing_drinks_1790349540227.jpg',
  },
  {
    id: 'sweet_lassi',
    name: 'Traditional Sweet Lassi',
    categoryId: 'drinks',
    description: 'Authentic creamy churned yogurt drink topped with a thick layer of fresh malai.',
    basePrice: 180,
    image: '/src/assets/images/refreshing_drinks_1790349540227.jpg',
  },
  {
    id: 'soft_drink_can',
    name: 'Soft Drink (Can)',
    categoryId: 'drinks',
    description: 'Chilled 250ml soda can (Coke, Sprite, or Fanta).',
    basePrice: 90,
    image: '/src/assets/images/refreshing_drinks_1790349540227.jpg',
  },
  {
    id: 'mineral_water',
    name: 'Mineral Water (Large)',
    categoryId: 'drinks',
    description: '1.5 Litre sealed bottled drinking water.',
    basePrice: 100,
    image: '/src/assets/images/refreshing_drinks_1790349540227.jpg',
  },

  // Desserts
  {
    id: 'traditional_kheer',
    name: 'Shahi Zafrani Kheer',
    categoryId: 'desserts',
    description: 'Slow-cooked rice pudding infused with cardamoms, saffron strands, and crushed pistachios in clay cups.',
    basePrice: 240,
    image: '/src/assets/images/pakistani_desserts_1790349527821.jpg',
  },
  {
    id: 'hot_gulab_jamun',
    name: 'Hot Gulab Jamun (2 Pcs)',
    categoryId: 'desserts',
    description: 'Warm golden milk-solid dumplings soaked in aromatic cardamom sugar syrup.',
    basePrice: 220,
    image: '/src/assets/images/pakistani_desserts_1790349527821.jpg',
  },
];

export const GALLERY_ITEMS = [
  {
    id: 'g1',
    title: 'Signature Chicken Karahi',
    category: 'Special Dishes',
    image: '/src/assets/images/hero_karahi_pot_1790346550068.jpg',
    description: 'Slow simmered in a heavy black iron wok with fresh ginger and coriander.',
  },
  {
    id: 'g2',
    title: 'Artisanal BBQ Skewers',
    category: 'Food',
    image: '/src/assets/images/bbq_seekh_tikka_1790346568096.jpg',
    description: 'Charcoal grilled seekh kababs and chicken tikka boti.',
  },
  {
    id: 'g3',
    title: 'Clay Pot Makhni Handi',
    category: 'Special Dishes',
    image: '/src/assets/images/clay_pot_handi_1790346583434.jpg',
    description: 'Earthen pot delicacy with butter glaze and silky texture.',
  },
  {
    id: 'g4',
    title: 'Fresh Tandoori Roghni Naan',
    category: 'Food',
    image: '/src/assets/images/tandoori_naan_basket_1790346599982.jpg',
    description: 'Piping hot from the clay tandoor with sesame seeds and ghee.',
  },
  {
    id: 'g5',
    title: 'Royal Mutton Karahi',
    category: 'Special Dishes',
    image: '/src/assets/images/mutton_karahi_dish_1790349442345.jpg',
    description: 'Black cast-iron kadai mutton simmered in desi ghee.',
  },
  {
    id: 'g6',
    title: 'Clay Pot Matka Biryani',
    category: 'Food',
    image: '/src/assets/images/matka_biryani_1790349512479.jpg',
    description: 'Dum-cooked aromatic mutton biryani sealed in earthen matka.',
  },
];
