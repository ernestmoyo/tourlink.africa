import type { DestinationInfo } from '@/types';

export const destinations: DestinationInfo[] = [
  // ── South Africa ──────────────────────────────────────────────
  {
    slug: 'south-africa',
    name: 'South Africa',
    tagline: 'The Gateway — Where Every Safari Begins',
    description: `South Africa commands nearly half of all safari arrivals on the continent and for good reason: world-class infrastructure, a stable rand that keeps pricing competitive, and a density of Big Five reserves matched only by East Africa. Johannesburg's O.R. Tambo and Cape Town International together handle over 22 million passengers a year, making the country the natural entry point for first-time visitors and multi-country itineraries alike.

Beyond the bush, South Africa delivers a breadth of experience that few single countries can rival. The Kruger National Park — at nearly two million hectares — anchors the safari offering, while the adjoining Sabi Sands and Timbavati private reserves provide off-road tracking, night drives, and walking safaris that public reserves cannot. Further south, the Cape Winelands pour some of the world's most celebrated cool-climate wines, the Garden Route threads between ancient forests and turquoise lagoons, and Table Mountain presides over a city that regularly appears on "best in the world" lists.

For TourLink clients the value proposition is clear: South Africa can stand alone as a seven-day highlight reel or serve as the anchor for a broader Southern and East Africa circuit — adding Victoria Falls, the Mozambique coast, or Botswana's Okavango with a short connecting flight. With park entry fees starting at roughly $33 per adult per day, the Kruger remains one of Africa's most accessible Big Five destinations at any budget tier.`,
    marketShare: '49.34%',
    keyHubs: ['JNB (Johannesburg)', 'CPT (Cape Town)'],
    signatureExperiences: [
      'Kruger National Park game drives',
      'Sabi Sands private reserve tracking',
      'Cape Winelands tasting tours',
      'Garden Route self-drive',
      'Table Mountain summit hike',
    ],
    entryFees: ['Kruger National Park: ~$33 per adult per day'],
    regulatoryNotes: [
      'Visa-free for 90+ nationalities',
      'Yellow fever certificate required if arriving from endemic country',
      '15% VAT applicable on tourism services',
    ],
    heroImage: '/images/heroes/safari-sunset.jpg',
    galleryImages: [
      '/images/heroes/safari-sunset.jpg',
      '/images/packages/big-five-luxury.jpg',
      '/images/packages/jeep-safari.webp',
    ],
  },

  // ── Tanzania ──────────────────────────────────────────────────
  {
    slug: 'tanzania',
    name: 'Tanzania',
    tagline: 'The Luxury Frontier — Serengeti, Kilimanjaro & Beyond',
    description: `Tanzania is where the African safari reaches its most cinematic expression. The Serengeti's two-million-strong wildebeest migration, the Ngorongoro Crater's self-contained Eden, and the snow-capped summit of Kilimanjaro — the continent's highest peak — combine to form a destination portfolio that no competitor can replicate. The country has invested heavily in low-volume, high-value tourism, and the result is an experience that feels genuinely wild even as infrastructure improves.

The northern circuit running from Arusha through Tarangire, Lake Manyara, the Serengeti, and the Ngorongoro Crater is one of the most concentrated wildlife corridors on Earth. Tarangire's baobab-studded landscape supports one of Africa's largest elephant populations, Lake Manyara offers tree-climbing lions and flamingo-fringed shores, and the Serengeti's endless plains deliver predator-prey theatre on an almost hourly basis. Add Zanzibar's spice-island beaches — a 90-minute flight from Arusha — and you have the definitive bush-and-beach combination.

Tanzania does carry premium pricing. Concession fees run at $70.80 per person per night plus 18% VAT, and northern-circuit park fees add up quickly across multi-day itineraries. However, TourLink's partnerships with Gosheni Safaris and Altezza Travel ensure clients benefit from contracted rates, priority lodge allocation, and operational expertise that keeps the value-per-dollar high even at the top end of the market.`,
    keyHubs: ['JRO (Kilimanjaro)', 'DAR (Dar es Salaam)'],
    signatureExperiences: [
      'Great Wildebeest Migration river crossings',
      'Ngorongoro Crater floor game drives',
      'Kilimanjaro summit treks',
      'Zanzibar spice tours and beach retreats',
      'Tarangire elephant herd encounters',
    ],
    entryFees: [
      'Concession fees: $70.80 per person per night + 18% VAT',
      'Serengeti entry: $82.60 per adult per 24 hours',
      'Ngorongoro Crater service fee: $295 per vehicle descent',
    ],
    regulatoryNotes: [
      'Visa on arrival available for most nationalities ($50)',
      'e-Visa system operational — pre-approval recommended',
      '18% VAT on tourism services',
      'Drone permits required and strictly enforced in national parks',
    ],
    heroImage: '/images/destinations/tanzania-hero.jpg',
    galleryImages: [
      '/images/destinations/tanzania-hero.jpg',
      '/images/destinations/serengeti.jpg',
      '/images/destinations/ngorongoro.jpg',
      '/images/destinations/ngorongoro-conservation.jpg',
      '/images/destinations/zanzibar.jpg',
      '/images/destinations/tarangire.jpg',
      '/images/destinations/lake-manyara.webp',
      '/images/destinations/kilimanjaro-full.webp',
      '/images/destinations/arusha.jpg',
    ],
  },

  // ── Zimbabwe ──────────────────────────────────────────────────
  {
    slug: 'zimbabwe',
    name: 'Zimbabwe',
    tagline: 'The Adventure Hub — Victoria Falls & Untamed Wilderness',
    description: `Zimbabwe punches well above its weight in the safari world. Victoria Falls — one of the Seven Natural Wonders — anchors a tourism economy that has rebounded strongly, with the falls town now connected to 12 direct regional flights and covered by the KAZA Univisa shared with Zambia. But the real draw for repeat safari-goers lies deeper in the country: Hwange's vast elephant herds, Mana Pools' walking-safari pedigree, and the houseboat culture of Lake Kariba.

Hwange National Park, the country's largest reserve at over 14,600 square kilometres, is home to an estimated 44,000 elephants and some of the continent's last viable populations of painted wild dog. Unlike East African parks where driving dominates, Hwange's concession system allows guests to leave the vehicle for guided bush walks alongside qualified professional guides — an experience that connects visitors to the African landscape in a way no game drive can. Mana Pools, a UNESCO World Heritage Site on the Zambezi floodplain, takes this further: it is one of the very few places in Africa where experienced walkers can approach elephant, buffalo, and lion on foot without a fence in sight.

For TourLink's multi-country circuits, Zimbabwe sits at a natural crossroads. Victoria Falls is a short hop from Botswana's Chobe, Zambia's Livingstone, and even Namibia's Caprivi Strip, making it the ideal pivot point for Southern and East Africa itineraries. Park entry at Victoria Falls is $50 per adult, and the country applies 15.5% VAT on tourism services from 2026.`,
    keyHubs: ['VFA (Victoria Falls) — 12 direct regional connections'],
    signatureExperiences: [
      'Victoria Falls rainforest walk and helicopter flight',
      'Hwange National Park elephant encounters',
      'Mana Pools walking safaris',
      'Lake Kariba houseboat cruises',
      'Great Zimbabwe ruins cultural tour',
    ],
    entryFees: [
      'Victoria Falls Rainforest: $50 per adult',
      'Hwange National Park: $20 per adult per day',
      'Mana Pools: $20 per adult per day',
    ],
    regulatoryNotes: [
      'KAZA Univisa ($50) covers Zimbabwe + Zambia',
      'Visa on arrival available for many nationalities',
      '15.5% VAT on tourism services from 2026',
      'USD widely accepted alongside local currency',
    ],
    heroImage: '/images/packages/migration-river.jpg',
    galleryImages: [
      '/images/packages/migration-river.jpg',
      '/images/packages/wildlife-park.jpg',
      '/images/packages/safari-tanzania.webp',
    ],
  },

  // ── Mozambique ────────────────────────────────────────────────
  {
    slug: 'mozambique',
    name: 'Mozambique',
    tagline: 'The Growth Engine — Pristine Beaches & Barefoot Luxury',
    description: `Mozambique is sub-Saharan Africa's fastest-growing tourism destination, posting a compound annual growth rate of 12.0% as travellers discover what insiders have known for years: its 2,500-kilometre Indian Ocean coastline harbours some of the most pristine marine environments on the planet. The Bazaruto Archipelago — a chain of five barrier islands off Vilanculos — offers turquoise waters, resident dugong populations, and coral reefs that rival the Maldives, while the remote Quirimbas Archipelago further north provides a true end-of-the-road castaway experience.

The country's lodge scene has matured rapidly. Barefoot-luxury properties dot the coastline from Tofo to Ibo Island, blending thatched-roof simplicity with world-class cuisine, dive operations, and dhow-sailing excursions. Vilanculos, the gateway to Bazaruto, is well connected to Johannesburg with daily flights, making it an ideal beach extension after a South African or Zimbabwean safari. For honeymoon couples and beach-focused travellers, Mozambique delivers an Indian Ocean experience with genuine African character — no overwater bungalows, but sundowner dhows, fresh peri-peri prawns on the sand, and whale sharks gliding through warm waters.

TourLink works with Destination Africa, a Mozambique-based specialist, to handle the logistics of island-hopping, boat transfers, and dive coordination that make or break an archipelago itinerary. Accommodation ranges from charming mid-range beach lodges to exclusive-use island villas, keeping the destination accessible across multiple budget tiers.`,
    growthRate: '12.0% CAGR — fastest growing in the region',
    keyHubs: ['VNX (Vilanculos)', 'MPM (Maputo)'],
    signatureExperiences: [
      'Bazaruto Archipelago island hopping',
      'Quirimbas Archipelago castaway retreats',
      'Barefoot luxury beach lodges',
      'Dhow sailing and snorkelling',
      'Whale shark encounters (Oct–Mar)',
    ],
    entryFees: [
      'Bazaruto National Park marine fee: $22 per person',
      'Quirimbas marine reserve fee: $20 per person',
    ],
    regulatoryNotes: [
      'Visa on arrival for most nationalities ($50)',
      'Yellow fever certificate required if arriving from endemic country',
      'Marine park fees collected by lodges on behalf of ANAC',
    ],
    heroImage: '/images/destinations/fanjove-island.jpg',
    galleryImages: [
      '/images/destinations/fanjove-island.jpg',
      '/images/packages/honeymoon-couple.jpg',
      '/images/packages/zanzibar-boat.webp',
    ],
  },

  // ── Namibia ───────────────────────────────────────────────────
  {
    slug: 'namibia',
    name: 'Namibia',
    tagline: 'The Desert Jewel — Ancient Landscapes & Stark Beauty',
    description: `Namibia is Africa's most photogenic country — a bold claim in a continent of visual superlatives, but one that the rust-red dunes of Sossusvlei, the fog-shrouded Skeleton Coast, and the wildlife-packed waterholes of Etosha readily justify. With a population density among the lowest on Earth, Namibia offers a sense of solitude and scale that even the Serengeti cannot match. Self-drive is safe and popular, the road network is well maintained, and the country's commitment to community-based conservation has created a model studied worldwide.

Etosha National Park remains the anchor of any Namibian safari. Its vast salt pan — visible from space — draws enormous concentrations of game to floodlit waterholes during the dry season, making it one of the easiest places in Africa to photograph black rhino. Beyond Etosha, the Damaraland conservancies protect desert-adapted elephant and the endangered black rhino in landscapes of red-rock tabletop mountains and petrified forests. The Fish River Canyon, the world's second-largest canyon, offers multi-day hiking through geological time, while the Skeleton Coast's seal colonies and shipwreck-strewn beaches feel like the edge of the known world.

For TourLink itineraries, Namibia pairs beautifully with Botswana via the Caprivi Strip or with South Africa through the Kgalagadi Transfrontier Park. The country's strong infrastructure and reliable self-drive conditions also make it an excellent choice for independent travellers who prefer to set their own pace between curated lodge stops.`,
    keyHubs: ['WDH (Windhoek)'],
    signatureExperiences: [
      'Etosha National Park waterhole game viewing',
      'Sossusvlei dune climbing at sunrise',
      'Skeleton Coast scenic flights',
      'Fish River Canyon hiking trail',
      'Damaraland desert-adapted elephant tracking',
    ],
    entryFees: [
      'Etosha National Park: N$150 (~$8) per adult per day',
      'Sossusvlei (Namib-Naukluft): N$150 (~$8) per adult per day',
    ],
    regulatoryNotes: [
      'Visa-free for most nationalities (90-day stamp)',
      'Self-drive friendly — international driving licence accepted',
      'Community conservancy fees vary by region',
    ],
    heroImage: '/images/heroes/balloon-safari.jpg',
    galleryImages: [
      '/images/heroes/balloon-safari.jpg',
      '/images/packages/jeep-safari.webp',
    ],
  },

  // ── Botswana ──────────────────────────────────────────────────
  {
    slug: 'botswana',
    name: 'Botswana',
    tagline: 'The Untouched Wilderness — Okavango & Beyond',
    description: `Botswana has built its entire tourism model around exclusivity: high-value, low-volume access to some of the most pristine ecosystems remaining in Africa. The Okavango Delta — a UNESCO World Heritage Site and the world's largest inland delta — floods annually from Angola's highland rains, transforming the Kalahari sandveld into a labyrinth of crystal-clear channels, palm-fringed islands, and papyrus-lined lagoons. Mokoro (dugout canoe) safaris through the delta's waterways are among the most iconic wildlife experiences on the continent.

Chobe National Park, bordering Namibia's Caprivi Strip, supports the largest continuous elephant population in Africa — an estimated 120,000 animals — and its riverfront game drives at sunset are legendary for the sheer density of wildlife within a single frame. The Makgadikgadi Salt Pans offer a surreal counterpoint: vast, flat expanses that host zebra and wildebeest migrations during the green season and provide some of Africa's best stargazing when dry. The Central Kalahari Game Reserve, one of the largest protected areas on Earth, shelters Kalahari lion, brown hyena, and gemsbok in a landscape of ancient riverbeds and golden grasslands.

Botswana's premium positioning means prices are higher than neighbouring countries — a deliberate policy to protect fragile ecosystems from overtourism. For TourLink clients seeking Africa's most exclusive wildlife immersion, Botswana delivers an experience where you may share a sighting with one or two vehicles rather than twenty. The country pairs naturally with Zimbabwe's Victoria Falls and Namibia's Caprivi for seamless cross-border circuits.`,
    keyHubs: ['MUB (Maun)', 'BBK (Kasane)'],
    signatureExperiences: [
      'Okavango Delta mokoro and walking safaris',
      'Chobe riverfront game drives and boat cruises',
      'Makgadikgadi Salt Pans quad-biking and meerkats',
      'Central Kalahari bush camping',
    ],
    entryFees: [
      'National park fees: $13 per person per day (SADC) / $50 (non-SADC)',
      'Okavango Delta concession fees vary by operator',
    ],
    regulatoryNotes: [
      'Visa-free for most nationalities (90-day stamp)',
      'Single-use plastic bags banned — bring reusable bags',
      'High-value, low-volume tourism policy — limited camp beds',
    ],
    heroImage: '/images/packages/wildlife-park.jpg',
    galleryImages: [
      '/images/packages/wildlife-park.jpg',
      '/images/packages/jeep-safari.webp',
      '/images/heroes/safari-sunset.jpg',
    ],
  },

  // ── Kenya ─────────────────────────────────────────────────────
  {
    slug: 'kenya',
    name: 'Kenya',
    tagline: 'The Classic Safari — Masai Mara & Coastal Charm',
    description: `Kenya invented the word "safari" — it is Swahili for "journey" — and the country remains the gold standard against which all other wildlife destinations are measured. The Masai Mara, the northern extension of Tanzania's Serengeti, is arguably the single best place on Earth to see big cats in action. Resident prides of lion, coalition cheetah hunts on the open plains, and the dramatic Mara River crossings during the July-to-October migration draw wildlife photographers and first-time visitors alike.

Beyond the Mara, Kenya's diversity is often underestimated. Amboseli National Park frames its elephant herds against the backdrop of Kilimanjaro's snow-capped summit — one of Africa's most photographed views. Tsavo, split into East and West, is Kenya's largest park system and offers a wilder, less-visited alternative to the more popular northern reserves. The coast delivers its own rewards: Diani Beach's powder-white sands, Mombasa's Swahili old town, and the Lamu Archipelago's car-free island culture provide a beach component that rivals Zanzibar.

Kenya's conservancy model — private community-owned wildlife areas bordering national reserves — has become a continental success story. Conservancies like Ol Pejeta, Lewa, and the Mara's Olare Motorogi offer exclusive traversing rights, night drives, and walking safaris that public parks cannot permit, all while channelling revenue directly to Maasai and other pastoral communities. For TourLink circuits, Kenya pairs naturally with Tanzania for an East African grand tour, or stands alone as a week-long highlight experience.`,
    keyHubs: ['NBO (Nairobi)', 'MBA (Mombasa)'],
    signatureExperiences: [
      'Masai Mara big-cat game drives and migration crossings',
      'Amboseli elephant herds with Kilimanjaro backdrop',
      'Diani Beach and Mombasa coastal retreats',
      'Tsavo wilderness safaris',
      'Ol Pejeta and Lewa conservancy visits',
    ],
    entryFees: [
      'Masai Mara: $80 per adult per day (non-resident)',
      'Amboseli: $60 per adult per day',
      'Conservancy fees: $80–$150 per person per day (included in lodge rates)',
    ],
    regulatoryNotes: [
      'eTA (electronic Travel Authorisation) required — apply online pre-departure',
      '16% VAT on tourism services',
      'No plastic bags permitted in the country',
    ],
    heroImage: '/images/packages/kenya-tanzania-migration.jpg',
    galleryImages: [
      '/images/packages/kenya-tanzania-migration.jpg',
      '/images/packages/masai-mara-zanzibar.jpg',
      '/images/packages/kenya-safari-zanzibar.jpg',
    ],
  },

  // ── Zambia ────────────────────────────────────────────────────
  {
    slug: 'zambia',
    name: 'Zambia',
    tagline: 'The Authentic Frontier — Walking Safaris & Wild Rivers',
    description: `Zambia is where the walking safari was born, and it remains the continent's purest expression of on-foot wildlife encounters. South Luangwa National Park — often called the "Valley of the Leopard" for its extraordinary density of these elusive cats — pioneered the guided bush walk in the 1950s, and the tradition endures today with multi-day walking trails that camp under the stars in remote seasonal bush camps. This is not soft adventure; it is the real thing, led by some of Africa's most experienced and decorated professional guides.

The country's second jewel is the Lower Zambezi National Park, set along the mighty Zambezi River directly opposite Zimbabwe's Mana Pools. Here, canoeing safaris drift past pods of hippo and herds of elephant drinking on the banks, while tiger-fishing provides one of the continent's premier freshwater angling experiences. Kafue National Park, Zambia's largest and oldest reserve at over 22,000 square kilometres, remains vastly undervisited despite supporting populations of lion, leopard, cheetah, and the rare and endemic Kafue lechwe antelope.

Victoria Falls from the Zambia side offers a dramatically different perspective to Zimbabwe's — visitors can walk right up to the lip of the Eastern Cataract and feel the spray on their faces. The KAZA Univisa makes crossing between the two countries effortless, and TourLink frequently includes both sides in a single itinerary. Zambia's combination of walking-safari pedigree, river-based adventures, and genuine off-the-beaten-track wilderness makes it the natural choice for travellers who have done East Africa and want something deeper.`,
    keyHubs: ['LUN (Lusaka)', 'LVI (Livingstone)'],
    signatureExperiences: [
      'Victoria Falls — Zambia-side lip walk',
      'South Luangwa walking safaris and leopard tracking',
      'Lower Zambezi canoeing and tiger-fishing',
      'Kafue National Park wilderness drives',
    ],
    entryFees: [
      'Victoria Falls (Zambia side): $20 per adult',
      'South Luangwa: $25 per adult per day',
      'Lower Zambezi: $25 per adult per day',
    ],
    regulatoryNotes: [
      'KAZA Univisa ($50) covers Zambia + Zimbabwe',
      'e-Visa available for most nationalities',
      'Yellow fever certificate required if arriving from endemic country',
    ],
    heroImage: '/images/packages/safari-tanzania.webp',
    galleryImages: [
      '/images/packages/safari-tanzania.webp',
      '/images/packages/migration-river.jpg',
      '/images/packages/wildlife-park.jpg',
    ],
  },
];
