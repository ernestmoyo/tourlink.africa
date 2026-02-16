import type { Package } from '@/types';

export const packages: Package[] = [
  // ═══════════════════════════════════════════════════════════════
  // 1. THE REGIONAL EXPLORER  (featured — full itinerary)
  // ═══════════════════════════════════════════════════════════════
  {
    slug: 'regional-explorer',
    name: 'The Regional Explorer',
    tier: 'budget',
    destinations: ['mozambique', 'zimbabwe'],
    experienceTypes: ['beach', 'safari', 'cultural'],
    durationDays: 14,
    durationNights: 13,
    routeSummary: 'Mozambique coast → Great Zimbabwe → Hwange → Victoria Falls',
    shortDescription:
      'A two-week adventure loop through Mozambique\'s Indian Ocean beaches and Zimbabwe\'s wildlife reserves — designed for Gen Z adventurers and budget-conscious explorers.',
    fullDescription: `The Regional Explorer is TourLink's answer to the question every budget-conscious traveller asks: can you see the real Africa — beaches, bush, and ancient history — in two weeks without breaking the bank? The answer is an emphatic yes. This 14-day loop begins on Mozambique's Indian Ocean coast, where warm waters, barefoot beach bars, and affordable seafood set the tone, before crossing into Zimbabwe for a cultural deep-dive at the Great Zimbabwe ruins, wildlife encounters in Hwange National Park, and a grand finale at Victoria Falls.

Accommodation mixes clean, characterful guesthouses and tented camps with the occasional lodge upgrade to keep costs down without sacrificing comfort. Overland transfers are part of the adventure — watching the landscape shift from tropical coastline to granite kopjes to dry mopane woodland is a journey in itself. The itinerary has been stress-tested with our partner operators Destination Africa (Mozambique) and Little Roz Tours (Zimbabwe) to ensure every connection, border crossing, and activity runs smoothly.

This package appeals to Gen Z travellers, gap-year adventurers, and anyone who values authenticity over opulence. Group sizes are kept small (4–12) to maintain an intimate feel, and the price includes all park fees, most meals, and internal transfers — so there are no nasty surprises on the ground.`,
    priceFrom: 3164,
    priceUnit: 'per-person',
    groupSizeMin: 4,
    groupSizeMax: 12,
    difficulty: 'moderate',
    bestMonths: [4, 5, 6, 7, 8, 9, 10],
    highlights: [
      'Snorkelling Mozambique\'s coral reefs off Tofo Beach',
      'Exploring the UNESCO-listed Great Zimbabwe ruins',
      'Hwange National Park game drives among 44,000 elephants',
      'Sunset cruise on the Zambezi above Victoria Falls',
      'Victoria Falls rainforest walk and bridge bungee option',
    ],
    included: [
      'All accommodation (13 nights — guesthouses, tented camps, and lodges)',
      'Most meals (13 breakfasts, 10 lunches, 11 dinners)',
      'All national park and monument entry fees',
      'Internal ground transfers and overland transport',
      'English-speaking guides throughout',
      'Zambezi sunset cruise at Victoria Falls',
      'Snorkelling equipment rental in Mozambique',
    ],
    excluded: [
      'International flights to/from Mozambique and out of Victoria Falls',
      'Visa fees (Mozambique ~$50, Zimbabwe ~$30 or KAZA Univisa $50)',
      'Travel and medical insurance (mandatory)',
      'Optional activities (bungee, helicopter, etc.)',
      'Alcoholic beverages and personal expenses',
    ],
    itinerary: [
      {
        dayNumber: 1,
        title: 'Arrival in Vilanculos',
        description:
          'Arrive at Vilanculos airport and transfer to your beachfront guesthouse. Settle in with a welcome seafood dinner on the sand as the sun sets over the Bazaruto channel.',
        accommodation: 'Casa Rex or similar beachfront guesthouse',
        meals: ['D'],
        activities: ['Airport transfer', 'Welcome dinner on the beach'],
        destination: 'mozambique',
        transferNote: 'Arrival transfer included from VNX airport (15 min)',
      },
      {
        dayNumber: 2,
        title: 'Bazaruto Archipelago Day Trip',
        description:
          'Board a traditional dhow for a full-day island excursion to Bazaruto Island. Snorkel over pristine coral reefs, swim in turquoise lagoons, and enjoy a grilled seafood lunch on a private sandbar. Keep an eye out for dugongs and sea turtles in the shallows.',
        accommodation: 'Casa Rex or similar beachfront guesthouse',
        meals: ['B', 'L'],
        activities: [
          'Dhow sailing to Bazaruto Island',
          'Snorkelling coral reefs',
          'Sandbar seafood lunch',
        ],
        destination: 'mozambique',
      },
      {
        dayNumber: 3,
        title: 'Tofo Beach & Ocean Safari',
        description:
          'Drive south along the coast to Tofo Beach, one of Mozambique\'s most vibrant beach towns. Afternoon ocean safari with a chance to spot whale sharks, manta rays, and humpback whales (seasonal). Evening at leisure in Tofo\'s lively beachside restaurants.',
        accommodation: 'Tofo Beach backpackers lodge or similar',
        meals: ['B', 'L'],
        activities: [
          'Scenic coastal drive to Tofo',
          'Ocean safari boat trip',
          'Free time in Tofo village',
        ],
        destination: 'mozambique',
        transferNote: 'Overland transfer Vilanculos → Tofo (~4 hours)',
      },
      {
        dayNumber: 4,
        title: 'Tofo — Free Day',
        description:
          'A free day to explore Tofo at your own pace. Options include a scuba dive on Manta Reef, a horse ride along the beach, a local market visit, or simply hammock time with a book. The Indian Ocean is warm year-round.',
        accommodation: 'Tofo Beach backpackers lodge or similar',
        meals: ['B'],
        activities: [
          'Free day — optional diving, horse riding, or market visit',
        ],
        destination: 'mozambique',
      },
      {
        dayNumber: 5,
        title: 'Mozambique to Zimbabwe — Great Zimbabwe',
        description:
          'Early departure from Tofo heading west through Mozambique and across the border into Zimbabwe. Arrive at the town of Masvingo and check into your lodge near the Great Zimbabwe National Monument.',
        accommodation: 'Lodge near Great Zimbabwe',
        meals: ['B', 'L', 'D'],
        activities: [
          'Cross-border overland transfer',
          'Border formalities assistance',
        ],
        destination: 'zimbabwe',
        transferNote:
          'Full-day overland transfer Tofo → Masvingo with border crossing (~8–9 hours including stops)',
      },
      {
        dayNumber: 6,
        title: 'Great Zimbabwe Ruins',
        description:
          'Full-day guided tour of the Great Zimbabwe ruins — the largest stone structures in sub-Saharan Africa south of the Sahara and a UNESCO World Heritage Site. Explore the Great Enclosure, the Hill Complex, and the Valley Ruins with a specialist historian guide. Afternoon visit to a local Shona sculpture village.',
        accommodation: 'Lodge near Great Zimbabwe',
        meals: ['B', 'L', 'D'],
        activities: [
          'Guided tour of Great Zimbabwe ruins',
          'Shona sculpture village visit',
        ],
        destination: 'zimbabwe',
      },
      {
        dayNumber: 7,
        title: 'Transfer to Hwange National Park',
        description:
          'Depart Masvingo and drive northwest through Zimbabwe\'s heartland to Hwange National Park, the country\'s largest wildlife reserve. Arrive in time for an afternoon game drive as the animals congregate around the park\'s pumped waterholes.',
        accommodation: 'Hwange tented camp',
        meals: ['B', 'L', 'D'],
        activities: [
          'Scenic overland transfer',
          'Afternoon game drive in Hwange',
        ],
        destination: 'zimbabwe',
        transferNote: 'Overland transfer Masvingo → Hwange (~6 hours)',
      },
      {
        dayNumber: 8,
        title: 'Hwange — Full Day Safari',
        description:
          'A full day in Hwange National Park with morning and afternoon game drives. Hwange supports over 100 mammal species including enormous elephant herds, lion prides, leopard, buffalo, sable antelope, and one of Southern Africa\'s healthiest wild dog populations. Picnic lunch at a shaded waterhole.',
        accommodation: 'Hwange tented camp',
        meals: ['B', 'L', 'D'],
        activities: [
          'Morning game drive',
          'Waterhole picnic lunch',
          'Afternoon game drive',
        ],
        destination: 'zimbabwe',
      },
      {
        dayNumber: 9,
        title: 'Hwange — Walking Safari & Night Drive',
        description:
          'Morning guided walking safari on a private concession bordering the park — an immersive experience tracking game on foot with an armed professional guide. Afternoon at leisure at camp. After dinner, an optional night drive to search for nocturnal species like aardvark, civet, and porcupine.',
        accommodation: 'Hwange tented camp',
        meals: ['B', 'L', 'D'],
        activities: [
          'Guided walking safari',
          'Leisure time at camp',
          'Night game drive',
        ],
        destination: 'zimbabwe',
      },
      {
        dayNumber: 10,
        title: 'Hwange to Victoria Falls',
        description:
          'Depart Hwange after a final early-morning game drive and transfer to Victoria Falls town. Check in and spend the afternoon exploring the craft markets and curio shops along the main street. Sundowner cocktails overlooking the gorge.',
        accommodation: 'Victoria Falls guesthouse',
        meals: ['B', 'L'],
        activities: [
          'Early morning game drive',
          'Transfer to Victoria Falls',
          'Craft market exploration',
        ],
        destination: 'zimbabwe',
        transferNote: 'Overland transfer Hwange → Victoria Falls (~2.5 hours)',
      },
      {
        dayNumber: 11,
        title: 'Victoria Falls — Rainforest & Activities',
        description:
          'Morning guided walk through the Victoria Falls Rainforest — feel the spray of the world\'s largest curtain of falling water and learn about the geology and local Tonga culture. Afternoon free for optional adrenaline activities: bridge bungee, zip-line, gorge swing, or white-water rafting (seasonal).',
        accommodation: 'Victoria Falls guesthouse',
        meals: ['B', 'D'],
        activities: [
          'Victoria Falls Rainforest guided walk',
          'Optional adrenaline activities (own cost)',
        ],
        destination: 'zimbabwe',
      },
      {
        dayNumber: 12,
        title: 'Zambezi Sunset Cruise & Cultural Visit',
        description:
          'Morning visit to a local village for a cultural exchange and insight into daily life along the Zambezi. Afternoon at leisure before boarding a sunset cruise on the upper Zambezi — drinks and canapes while hippos surface and elephants drink on the riverbanks.',
        accommodation: 'Victoria Falls guesthouse',
        meals: ['B', 'L', 'D'],
        activities: [
          'Village cultural visit',
          'Zambezi sunset cruise with drinks and canapes',
        ],
        destination: 'zimbabwe',
      },
      {
        dayNumber: 13,
        title: 'Victoria Falls — Free Day',
        description:
          'A final free day to tick off any remaining bucket-list items. Options include a helicopter flight over the falls (the famous "Flight of Angels"), a lion walk, a Zambia-side excursion (KAZA Univisa), or simply relaxing by the pool with a cold Zambezi Lager.',
        accommodation: 'Victoria Falls guesthouse',
        meals: ['B'],
        activities: [
          'Free day — optional helicopter flight, lion walk, or Zambia excursion',
        ],
        destination: 'zimbabwe',
      },
      {
        dayNumber: 14,
        title: 'Departure',
        description:
          'Transfer to Victoria Falls Airport for your onward flight. Alternatively, extend your stay with an add-on to Chobe National Park in Botswana (just 90 minutes away) or continue to Zambia\'s Livingstone.',
        meals: ['B'],
        activities: ['Airport transfer'],
        destination: 'zimbabwe',
        transferNote: 'Transfer to VFA airport included (25 min)',
      },
    ],
    heroImage: '/images/packages/safari-zanzibar.jpg',
    galleryImages: [
      '/images/packages/safari-zanzibar.jpg',
      '/images/destinations/fanjove-island.jpg',
      '/images/packages/wildlife-park.jpg',
      '/images/packages/migration-river.jpg',
    ],
    targetSegments: ['Gen Z', 'Adventurers', 'Budget travellers'],
    featured: true,
    partnerDMCs: ['Destination Africa', 'Little Roz Tours'],
  },

  // ═══════════════════════════════════════════════════════════════
  // 2. THE CLASSIC CONNECTOR  (featured — full itinerary)
  // ═══════════════════════════════════════════════════════════════
  {
    slug: 'classic-connector',
    name: 'The Classic Connector',
    tier: 'mid-range',
    destinations: ['south-africa', 'zimbabwe'],
    experienceTypes: ['safari', 'cultural'],
    durationDays: 10,
    durationNights: 9,
    routeSummary: 'Cape Town → Kruger National Park → Victoria Falls',
    shortDescription:
      'The ultimate Southern Africa highlights reel: Cape Town\'s cosmopolitan charm, the Kruger\'s Big Five, and Victoria Falls\' thundering spray — all in ten seamless days.',
    fullDescription: `The Classic Connector is TourLink's most popular multi-country package, and for good reason: it distils the three iconic pillars of Southern Africa — Cape Town, the Kruger, and Victoria Falls — into a ten-day itinerary that flows effortlessly from one highlight to the next. Designed for families and first-time safari-goers, the package balances structured activities with enough free time to explore at your own pace.

The journey opens in Cape Town, where three nights allow for Table Mountain, the V&A Waterfront, a Winelands day trip, and the Cape Peninsula drive. A short flight delivers you to the Greater Kruger area for three nights in a private game reserve on the park's western boundary — think open-vehicle game drives, bush walks, and fireside dinners under the Southern Cross. The finale is Victoria Falls: two nights wrapped around the falls themselves, a Zambezi sunset cruise, and the option to add helicopter flights or white-water rafting.

Internal flights are included, accommodation sits in the comfortable four-star bracket, and TourLink's partner operators MoAfrika Tours (South Africa) and T.S Tours (Zimbabwe) handle every transfer and guide assignment. The price range of $3,900–$5,100 per person reflects seasonal variation and room-category choices, keeping the package accessible to a wide audience without compromising on quality.`,
    priceFrom: 3900,
    priceTo: 5100,
    priceUnit: 'per-person',
    groupSizeMin: 2,
    groupSizeMax: 12,
    difficulty: 'easy',
    bestMonths: [4, 5, 6, 7, 8, 9, 10],
    highlights: [
      'Table Mountain summit and Cape Peninsula scenic drive',
      'Franschhoek or Stellenbosch Winelands tasting tour',
      'Big Five game drives in a private Kruger concession',
      'Victoria Falls Rainforest walk and Zambezi sunset cruise',
    ],
    included: [
      'All accommodation (9 nights — boutique hotels and safari lodges)',
      'Meals as specified (9 breakfasts, 5 lunches, 6 dinners)',
      'Internal flights: Cape Town → Kruger, Kruger → Victoria Falls',
      'All game drives and bush walks in the Kruger (2 per day)',
      'Victoria Falls Rainforest entry and guided walk',
      'Zambezi sunset cruise with drinks and canapes',
      'All ground transfers and airport meet-and-greets',
      'English-speaking guides throughout',
    ],
    excluded: [
      'International flights to Cape Town and out of Victoria Falls',
      'Zimbabwe visa or KAZA Univisa ($50)',
      'Travel and medical insurance (mandatory)',
      'Optional activities (helicopter, rafting, bungee)',
      'Alcoholic beverages outside of included activities',
    ],
    itinerary: [
      {
        dayNumber: 1,
        title: 'Arrival in Cape Town',
        description:
          'Arrive at Cape Town International Airport and transfer to your boutique hotel in the city centre or Waterfront area. Depending on arrival time, enjoy an afternoon stroll along the V&A Waterfront or relax at the hotel pool with views of Table Mountain.',
        accommodation: 'Boutique hotel, V&A Waterfront area',
        meals: ['D'],
        activities: ['Airport transfer', 'V&A Waterfront orientation walk'],
        destination: 'south-africa',
        transferNote: 'Private transfer from CPT airport (~25 min)',
      },
      {
        dayNumber: 2,
        title: 'Table Mountain & City Highlights',
        description:
          'Morning cable-car ascent of Table Mountain for panoramic views from the summit (weather permitting — hiking option available). Afternoon guided tour of the Bo-Kaap neighbourhood, Company\'s Garden, and the colourful streets of the city bowl. Evening at leisure to explore Cape Town\'s thriving restaurant scene.',
        accommodation: 'Boutique hotel, V&A Waterfront area',
        meals: ['B'],
        activities: [
          'Table Mountain cable car or guided hike',
          'Bo-Kaap and city centre walking tour',
        ],
        destination: 'south-africa',
      },
      {
        dayNumber: 3,
        title: 'Cape Winelands Day Trip',
        description:
          'Full-day excursion to the Stellenbosch and Franschhoek wine valleys. Visit two to three award-winning estates for tastings and a gourmet lunch among the vines. Return to Cape Town via the scenic Helshoogte Pass with a stop at a local chocolate or cheese artisan.',
        accommodation: 'Boutique hotel, V&A Waterfront area',
        meals: ['B', 'L'],
        activities: [
          'Stellenbosch and Franschhoek wine tastings',
          'Gourmet vineyard lunch',
          'Helshoogte Pass scenic drive',
        ],
        destination: 'south-africa',
      },
      {
        dayNumber: 4,
        title: 'Cape Peninsula & Fly to Kruger',
        description:
          'Early-morning scenic drive along Chapman\'s Peak to Cape Point and the Cape of Good Hope. Visit the penguin colony at Boulders Beach. Return to the airport for your afternoon flight to Hoedspruit or Kruger Mpumalanga. Transfer to your safari lodge and settle in with a welcome bush dinner.',
        accommodation: 'Private game reserve lodge, Greater Kruger',
        meals: ['B', 'L', 'D'],
        activities: [
          'Chapman\'s Peak and Cape Point scenic drive',
          'Boulders Beach penguin colony',
          'Flight to Kruger region',
          'Welcome bush dinner',
        ],
        destination: 'south-africa',
        transferNote:
          'Scenic drive (3 hrs) + flight CPT→MQP/HDS (~2 hrs) + lodge transfer (1 hr)',
      },
      {
        dayNumber: 5,
        title: 'Greater Kruger — Full Safari Day',
        description:
          'Your first full day on safari. Pre-dawn wake-up call for the morning game drive — coffee and rusks in the bush before tracking the Big Five as the animals are most active. Return to the lodge for brunch and pool time. Afternoon drive departs at 3:30 pm and continues into the golden hour, with sundowner drinks at a scenic viewpoint.',
        accommodation: 'Private game reserve lodge, Greater Kruger',
        meals: ['B', 'L', 'D'],
        activities: [
          'Early morning Big Five game drive',
          'Brunch at lodge',
          'Afternoon game drive with sundowner stop',
        ],
        destination: 'south-africa',
      },
      {
        dayNumber: 6,
        title: 'Greater Kruger — Bush Walk & Night Drive',
        description:
          'Morning guided bush walk on the concession with an armed ranger — learn to read tracks, identify medicinal plants, and understand the smaller wonders of the bush that vehicles miss. Afternoon game drive extends into a spotlight-assisted night drive searching for leopard, hyena, genet, and other nocturnal species.',
        accommodation: 'Private game reserve lodge, Greater Kruger',
        meals: ['B', 'L', 'D'],
        activities: [
          'Guided bush walk',
          'Afternoon-to-night game drive',
          'Boma dinner under the stars',
        ],
        destination: 'south-africa',
      },
      {
        dayNumber: 7,
        title: 'Final Kruger Drive & Fly to Victoria Falls',
        description:
          'Final early-morning game drive before breakfast and check-out. Transfer to the airstrip for your flight to Victoria Falls. Arrive and transfer to your hotel in the falls town. Afternoon at leisure to explore the curio markets and lookout points along the gorge.',
        accommodation: 'Hotel in Victoria Falls town',
        meals: ['B', 'D'],
        activities: [
          'Early morning farewell game drive',
          'Flight to Victoria Falls',
          'Settle in and gorge viewpoint visit',
        ],
        destination: 'zimbabwe',
        transferNote:
          'Lodge transfer + flight HDS/MQP→VFA (~2.5 hrs total including connection)',
      },
      {
        dayNumber: 8,
        title: 'Victoria Falls — Rainforest Walk & Activities',
        description:
          'Guided walk through the Victoria Falls Rainforest — experience the thundering spray of the world\'s largest waterfall and learn about the geology, ecology, and Tonga heritage of this UNESCO site. Afternoon free for optional adrenaline activities or a relaxing spa session at the hotel.',
        accommodation: 'Hotel in Victoria Falls town',
        meals: ['B'],
        activities: [
          'Victoria Falls Rainforest guided walk',
          'Free afternoon for optional activities',
        ],
        destination: 'zimbabwe',
      },
      {
        dayNumber: 9,
        title: 'Zambezi Sunset Cruise & Farewell Dinner',
        description:
          'Morning at leisure — sleep in, explore the town, or add an optional helicopter "Flight of Angels" over the falls. Late afternoon board a luxury sunset cruise on the upper Zambezi with drinks, canapes, and wildlife sightings along the riverbanks. Farewell dinner at a top Victoria Falls restaurant.',
        accommodation: 'Hotel in Victoria Falls town',
        meals: ['B', 'D'],
        activities: [
          'Free morning',
          'Zambezi sunset cruise with drinks',
          'Farewell dinner',
        ],
        destination: 'zimbabwe',
      },
      {
        dayNumber: 10,
        title: 'Departure from Victoria Falls',
        description:
          'Transfer to Victoria Falls Airport for your onward flight. Optional extensions available: add Chobe National Park in Botswana (90-minute day trip or 2-night stay) or cross to Zambia\'s Livingstone for the falls from the other side.',
        meals: ['B'],
        activities: ['Airport transfer'],
        destination: 'zimbabwe',
        transferNote: 'Private transfer to VFA airport (25 min)',
      },
    ],
    heroImage: '/images/packages/big-five-luxury.jpg',
    galleryImages: [
      '/images/packages/big-five-luxury.jpg',
      '/images/heroes/safari-sunset.jpg',
      '/images/packages/jeep-safari.webp',
      '/images/packages/migration-river.jpg',
    ],
    targetSegments: ['Families', 'First-timers', 'Couples'],
    featured: true,
    partnerDMCs: ['MoAfrika Tours', 'T.S Tours'],
  },

  // ═══════════════════════════════════════════════════════════════
  // 3. THE ULTIMATE EXCLUSIVE  (featured — full itinerary)
  // ═══════════════════════════════════════════════════════════════
  {
    slug: 'ultimate-exclusive',
    name: 'The Ultimate Exclusive',
    tier: 'luxury',
    destinations: ['zimbabwe'],
    experienceTypes: ['safari', 'cultural'],
    durationDays: 9,
    durationNights: 8,
    routeSummary:
      'Victoria Falls → Hwange (fly-in) → Mana Pools (fly-in) → Lake Kariba',
    shortDescription:
      'Zimbabwe\'s finest wilderness lodges connected by private charter flights — a luxury circuit through Victoria Falls, Hwange, Mana Pools, and Lake Kariba.',
    fullDescription: `The Ultimate Exclusive is TourLink's flagship luxury offering: a nine-day fly-in circuit through Zimbabwe's most celebrated wilderness areas, staying at the country's top-tier safari lodges and camps. Every transfer is by private light aircraft, eliminating road time and maximising game-viewing hours. This is Zimbabwe the way it was meant to be experienced — wild, remote, and profoundly beautiful.

The journey begins and ends at Victoria Falls, with two nights to experience the falls, the Zambezi, and the town's vibrant dining scene. From there, a charter flight delivers you to a private concession in Hwange National Park for world-class elephant encounters and predator sightings. Next, you fly north to Mana Pools — the UNESCO-listed Zambezi floodplain where walking safaris and canoeing among hippo and elephant are daily realities. The circuit closes with a night on a luxury houseboat on Lake Kariba before flying back to Victoria Falls.

Every lodge has been hand-selected for its guiding quality, exclusivity, and setting. Meals, premium drinks, laundry, and all activities are included, and a dedicated TourLink host ensures seamless connectivity between each camp. At $9,000+ per person, this is an investment — but for UHNW travellers and honeymooners who demand the exceptional, it delivers an African experience with zero compromise.`,
    priceFrom: 9000,
    priceUnit: 'per-person',
    groupSizeMin: 2,
    groupSizeMax: 6,
    difficulty: 'easy',
    bestMonths: [5, 6, 7, 8, 9, 10],
    highlights: [
      'Private charter flights between all camps — zero road time',
      'Hwange\'s iconic elephant herds at exclusive waterhole hides',
      'Walking safaris in UNESCO-listed Mana Pools',
      'Luxury houseboat night on Lake Kariba',
      'Helicopter "Flight of Angels" over Victoria Falls',
    ],
    included: [
      'All accommodation (8 nights — luxury lodges and houseboat)',
      'All meals and premium beverages at lodges',
      'All private charter flights between camps',
      'All game drives, walking safaris, canoeing, and boat cruises',
      'Victoria Falls Rainforest entry and guided walk',
      'Helicopter flight over Victoria Falls',
      'Lake Kariba houseboat experience with fishing',
      'Laundry service at all lodges',
    ],
    excluded: [
      'International flights to/from Victoria Falls',
      'Zimbabwe visa ($30) or KAZA Univisa ($50)',
      'Travel and medical insurance (mandatory)',
      'Premium imported wines and spirits beyond lodge house selection',
      'Gratuities for guides and lodge staff (suggested $20–$40 pp/day)',
    ],
    itinerary: [
      {
        dayNumber: 1,
        title: 'Arrival at Victoria Falls',
        description:
          'VIP meet-and-greet at Victoria Falls Airport with private transfer to your luxury hotel overlooking the gorge. Settle in and enjoy afternoon tea on the terrace with spray-mist views. Evening cocktails and a five-course welcome dinner.',
        accommodation: 'Victoria Falls luxury hotel',
        meals: ['D'],
        activities: [
          'VIP airport meet-and-greet',
          'Afternoon tea with gorge views',
          'Five-course welcome dinner',
        ],
        destination: 'zimbabwe',
        transferNote: 'Private transfer from VFA airport (15 min)',
      },
      {
        dayNumber: 2,
        title: 'Victoria Falls — Helicopter & Zambezi',
        description:
          'Morning helicopter "Flight of Angels" over the falls — an unforgettable aerial perspective of the mile-wide curtain of water and the zigzag gorges below. Guided rainforest walk at ground level to appreciate the scale and power up close. Afternoon luxury sunset cruise on the upper Zambezi with premium drinks, canapes, and wildlife sightings.',
        accommodation: 'Victoria Falls luxury hotel',
        meals: ['B', 'L', 'D'],
        activities: [
          'Helicopter flight over Victoria Falls',
          'Rainforest guided walk',
          'Luxury Zambezi sunset cruise',
        ],
        destination: 'zimbabwe',
      },
      {
        dayNumber: 3,
        title: 'Fly to Hwange — Afternoon Game Drive',
        description:
          'After a leisurely breakfast, transfer to the airstrip for your charter flight to Hwange National Park. Land on a bush airstrip and transfer to your private concession lodge. Settle in over lunch before heading out for an afternoon game drive along Hwange\'s legendary waterhole circuit.',
        accommodation: 'Exclusive Hwange concession lodge',
        meals: ['B', 'L', 'D'],
        activities: [
          'Charter flight to Hwange',
          'Lodge orientation and lunch',
          'Afternoon waterhole game drive',
        ],
        destination: 'zimbabwe',
        transferNote: 'Private charter flight VFA → Hwange (~45 min)',
      },
      {
        dayNumber: 4,
        title: 'Hwange — Full Safari Day',
        description:
          'Full day exploring Hwange\'s vast wilderness. Morning drive focuses on the pans and vlei areas where elephant herds, buffalo, sable antelope, and painted wild dogs are regularly sighted. Midday retreat to the lodge\'s waterhole hide for close-up photography as animals come to drink. Afternoon drive extends into golden-hour light with sundowners in the bush.',
        accommodation: 'Exclusive Hwange concession lodge',
        meals: ['B', 'L', 'D'],
        activities: [
          'Morning pan and vlei game drive',
          'Waterhole hide photography session',
          'Afternoon game drive with bush sundowners',
        ],
        destination: 'zimbabwe',
      },
      {
        dayNumber: 5,
        title: 'Fly to Mana Pools — Walking Safari',
        description:
          'Morning charter flight from Hwange to Mana Pools, landing on the Zambezi floodplain airstrip. Transfer to your riverside camp set beneath giant mahogany and acacia albida trees. After lunch, head out on a guided walking safari through the famous floodplain — approaching elephant and buffalo on foot in one of the few places in Africa where this is a daily reality.',
        accommodation: 'Luxury riverside camp, Mana Pools',
        meals: ['B', 'L', 'D'],
        activities: [
          'Charter flight to Mana Pools',
          'Camp orientation and riverside lunch',
          'Guided walking safari on the floodplain',
        ],
        destination: 'zimbabwe',
        transferNote: 'Private charter flight Hwange → Mana Pools (~1 hr)',
      },
      {
        dayNumber: 6,
        title: 'Mana Pools — Canoe & Bush Walk',
        description:
          'Morning canoe safari on the Zambezi, drifting past hippo pods, crocodile basking sites, and elephant herds watering along the banks. Return to camp for brunch and siesta. Afternoon walking safari deeper into the floodplain in search of the famous Mana Pools "standing elephants" that rear up on hind legs to feed from high branches.',
        accommodation: 'Luxury riverside camp, Mana Pools',
        meals: ['B', 'L', 'D'],
        activities: [
          'Zambezi canoe safari',
          'Afternoon walking safari',
          'Starlit dinner on the river deck',
        ],
        destination: 'zimbabwe',
      },
      {
        dayNumber: 7,
        title: 'Mana Pools — Final Walk & Fly to Kariba',
        description:
          'Final dawn walking safari in Mana Pools — the morning light on the floodplain is magical. Return for breakfast and pack up. Charter flight south to Lake Kariba where you board your luxury houseboat. Afternoon fishing for tiger fish or simply cruising the shoreline watching elephant and buffalo come to drink.',
        accommodation: 'Luxury houseboat, Lake Kariba',
        meals: ['B', 'L', 'D'],
        activities: [
          'Dawn walking safari',
          'Charter flight to Lake Kariba',
          'Houseboat cruise and tiger fishing',
        ],
        destination: 'zimbabwe',
        transferNote: 'Private charter flight Mana Pools → Kariba (~40 min)',
      },
      {
        dayNumber: 8,
        title: 'Lake Kariba & Return to Victoria Falls',
        description:
          'Sunrise on the lake — a breathtaking scene of flooded trees silhouetted against orange skies. Morning boat cruise along the Matusadona shoreline with excellent birding and big-game sightings. Late morning, disembark and transfer to Kariba airport for your charter flight back to Victoria Falls. Farewell dinner at a private venue overlooking the gorge.',
        accommodation: 'Victoria Falls luxury hotel',
        meals: ['B', 'L', 'D'],
        activities: [
          'Sunrise Lake Kariba cruise',
          'Matusadona shoreline game viewing',
          'Charter flight to Victoria Falls',
          'Private farewell dinner',
        ],
        destination: 'zimbabwe',
        transferNote: 'Private charter flight Kariba → VFA (~1 hr)',
      },
      {
        dayNumber: 9,
        title: 'Departure',
        description:
          'Private transfer to Victoria Falls Airport for your international departure. Your dedicated host ensures a seamless check-out and a fond farewell to Zimbabwe\'s extraordinary wilderness.',
        meals: ['B'],
        activities: ['Private airport transfer'],
        destination: 'zimbabwe',
        transferNote: 'Private transfer to VFA airport (15 min)',
      },
    ],
    heroImage: '/images/packages/honeymoon-couple.jpg',
    galleryImages: [
      '/images/packages/honeymoon-couple.jpg',
      '/images/properties/jabali-pool.jpg',
      '/images/properties/luxury-lodge.jpg',
      '/images/packages/wildlife-park.jpg',
    ],
    targetSegments: ['UHNW', 'Honeymoon', 'Luxury travellers'],
    featured: true,
    partnerDMCs: ['T.S Tours'],
  },

  // ═══════════════════════════════════════════════════════════════
  // 4. KILIMANJARO MACHAME ROUTE
  // ═══════════════════════════════════════════════════════════════
  {
    slug: 'kilimanjaro-machame',
    name: 'Kilimanjaro Machame Route',
    tier: 'budget',
    destinations: ['tanzania'],
    experienceTypes: ['mountain'],
    durationDays: 7,
    durationNights: 6,
    routeSummary: 'Arusha → Machame Gate → Kilimanjaro summit → Arusha',
    shortDescription:
      'Scale Africa\'s highest peak via the scenic Machame "Whiskey" route — seven days through rainforest, moorland, and glacial summit with expert guides.',
    fullDescription: `The Machame Route — affectionately known as the "Whiskey Route" for the extra challenge it offers over the "Coca-Cola" Marangu — is widely considered the most scenic path to Uhuru Peak, the summit of Mount Kilimanjaro at 5,895 metres. This seven-day itinerary allows an extra acclimatisation day at Karanga Camp, boosting summit success rates to over 90% when combined with TourLink's partner Altezza Travel's medical protocols and experienced mountain crews.

The climb passes through five distinct ecological zones: lush equatorial rainforest alive with colobus monkeys and exotic birds, heather and moorland dotted with giant groundsel and lobelia, the stark alpine desert of the Barranco Wall, and finally the glacial summit zone where Africa's remaining ice fields gleam under equatorial stars. The Barranco Wall scramble on Day 4 is the route's signature moment — a thrilling but non-technical rock scramble that rewards climbers with the most dramatic views on the mountain.

Altezza Travel provides all mountain logistics: professional KPAP-certified guides, a 3:1 porter-to-climber ratio, hot meals at every camp, supplemental oxygen for emergencies, and twice-daily oxygen-saturation monitoring. Prices include a night in Arusha before and after the climb, all park fees, and transport — making this one of the most transparent and complete Kilimanjaro packages on the market.`,
    priceFrom: 1969,
    priceUnit: 'per-person',
    groupSizeMin: 2,
    groupSizeMax: 12,
    difficulty: 'challenging',
    bestMonths: [1, 2, 6, 7, 8, 9, 10],
    highlights: [
      'Summit Uhuru Peak — the Roof of Africa at 5,895 m',
      'Barranco Wall scramble with panoramic valley views',
      'Five ecological zones from rainforest to glacial summit',
      'Professional KPAP-certified guides and medical monitoring',
    ],
    included: [
      'Pre- and post-climb hotel nights in Arusha (2 nights)',
      'All Kilimanjaro National Park fees',
      'Professional mountain guide and assistant guides',
      'Porters, cook, and full mountain crew (3:1 ratio)',
      'All meals on the mountain (3 meals/day + snacks)',
      'Quality mountain tents and dining mess tent',
      'Emergency supplemental oxygen and first-aid kit',
      'Airport transfers Kilimanjaro (JRO) ↔ Arusha',
    ],
    excluded: [
      'International flights to/from Kilimanjaro',
      'Tanzania visa ($50)',
      'Travel and evacuation insurance (mandatory)',
      'Personal mountain gear (rental available in Arusha)',
      'Gratuities for mountain crew (suggested $200–$300 total)',
    ],
    itinerary: [
      {
        dayNumber: 1,
        title: 'Machame Gate to Machame Camp',
        description:
          'Drive from Arusha to Machame Gate (1,800 m) for registration and gear check. Begin the ascent through dense equatorial rainforest — look for blue monkeys, colobus monkeys, and tropical birds. Arrive at Machame Camp (3,000 m) by late afternoon for dinner and an early night.',
        accommodation: 'Machame Camp (3,000 m) — tents',
        meals: ['B', 'L', 'D'],
        activities: [
          'Transfer to Machame Gate',
          'Trek through rainforest zone (~5–6 hrs)',
        ],
        destination: 'tanzania',
        transferNote: 'Arusha → Machame Gate by vehicle (~1.5 hrs)',
      },
      {
        dayNumber: 2,
        title: 'Machame Camp to Shira Camp',
        description:
          'Ascend through the heather and moorland zone, passing giant heathers draped in old man\'s beard lichen. The vegetation thins as you gain altitude, revealing sweeping views of Kibo peak ahead and the plains of Amboseli to the north. Arrive at Shira Camp (3,840 m) on the Shira Plateau.',
        accommodation: 'Shira Camp (3,840 m) — tents',
        meals: ['B', 'L', 'D'],
        activities: [
          'Trek through moorland zone (~5–6 hrs)',
          'Acclimatisation walk around Shira Plateau',
        ],
        destination: 'tanzania',
      },
      {
        dayNumber: 3,
        title: 'Shira Camp to Barranco Camp',
        description:
          'The "walk high, sleep low" acclimatisation strategy begins. Trek upward toward the Lava Tower at 4,630 m before descending steeply into the Barranco Valley (3,960 m). The dramatic altitude swing aids acclimatisation. Barranco Camp sits beneath the imposing Barranco Wall with stunning views of the Western Breach.',
        accommodation: 'Barranco Camp (3,960 m) — tents',
        meals: ['B', 'L', 'D'],
        activities: [
          'Ascent to Lava Tower (4,630 m)',
          'Descent to Barranco Valley (~7–8 hrs total)',
        ],
        destination: 'tanzania',
      },
    ],
    heroImage: '/images/packages/kilimanjaro-summit.webp',
    galleryImages: [
      '/images/packages/kilimanjaro-summit.webp',
      '/images/packages/kilimanjaro-trek.jpg',
      '/images/destinations/kilimanjaro-full.webp',
      '/images/packages/kilimanjaro-elephant.jpg',
    ],
    targetSegments: ['Adventurers', 'Bucket-list travellers'],
    featured: false,
    partnerDMCs: ['Altezza Travel'],
  },

  // ═══════════════════════════════════════════════════════════════
  // 5. BUSH & BEACH ESCAPE
  // ═══════════════════════════════════════════════════════════════
  {
    slug: 'bush-and-beach-escape',
    name: 'Bush & Beach Escape',
    tier: 'mid-range',
    destinations: ['south-africa', 'mozambique'],
    experienceTypes: ['bush-and-beach', 'safari', 'beach'],
    durationDays: 10,
    durationNights: 9,
    routeSummary: 'Timbavati Private Reserve (SA) → Vilanculos & Bazaruto (Mozambique)',
    shortDescription:
      'Five nights of Big Five bush in the Timbavati followed by four nights of Indian Ocean beach bliss in Mozambique\'s Bazaruto Archipelago.',
    fullDescription: `The Bush & Beach Escape is the quintessential two-act African holiday: act one delivers world-class Big Five wildlife in the Timbavati Private Nature Reserve, which shares an unfenced boundary with the Kruger National Park; act two shifts to the turquoise waters and white sands of Mozambique's Bazaruto Archipelago. The contrast is electric — from leopard sightings at dawn to snorkelling with sea turtles by noon the next day.

The Timbavati is one of the Greater Kruger's most prestigious private reserves, famous for its rare white lions and the intimacy of its bush experience. Open-vehicle game drives, night drives with spotlights, and guided walking safaris are all on offer, with a maximum of three vehicles per sighting ensuring exclusivity. After five nights in the bush, a short flight connects you to Vilanculos, the gateway to the Bazaruto Archipelago, where barefoot luxury lodges line empty beaches and dhow sails dot the horizon.

This package works beautifully for couples, honeymooners, and families with older children. The price range of $6,000–$10,000 per person reflects the wide spread of accommodation options available — from comfortable four-star lodges to exclusive-use beach villas. TourLink's partners New Frontiers Tours (South Africa) and Destination Africa (Mozambique) coordinate the cross-border logistics seamlessly.`,
    priceFrom: 6000,
    priceTo: 10000,
    priceUnit: 'per-person',
    groupSizeMin: 2,
    groupSizeMax: 8,
    difficulty: 'easy',
    bestMonths: [4, 5, 6, 7, 8, 9, 10, 11],
    highlights: [
      'Big Five game drives in the exclusive Timbavati Private Reserve',
      'Guided walking safaris tracking lion and rhino on foot',
      'Bazaruto Archipelago island hopping by dhow',
      'Snorkelling and diving on pristine coral reefs',
      'Barefoot luxury beach dinners under the stars',
    ],
    included: [
      'All accommodation (5 nights Timbavati lodge + 4 nights Bazaruto beach lodge)',
      'All meals and local beverages at both lodges',
      'All game drives and walking safaris in Timbavati (2 activities per day)',
      'Internal flight: Hoedspruit/Nelspruit → Vilanculos',
      'Dhow island excursion and snorkelling trip in Bazaruto',
      'All ground and boat transfers',
      'Meet-and-greet at all airports',
    ],
    excluded: [
      'International flights to Hoedspruit/Johannesburg and out of Vilanculos',
      'Mozambique visa (~$50)',
      'Travel and medical insurance (mandatory)',
      'Scuba diving (available at extra cost)',
      'Premium imported wines and spirits',
    ],
    itinerary: [
      {
        dayNumber: 1,
        title: 'Arrival in the Timbavati',
        description:
          'Arrive at Hoedspruit Eastgate Airport and transfer to your lodge in the Timbavati Private Nature Reserve. Settle in over lunch before your first afternoon game drive into Big Five territory. Return for a bush dinner around the campfire.',
        accommodation: 'Timbavati Private Reserve lodge',
        meals: ['L', 'D'],
        activities: [
          'Airport transfer to lodge',
          'Afternoon Big Five game drive',
          'Bush dinner by the campfire',
        ],
        destination: 'south-africa',
        transferNote: 'Transfer from HDS airport to lodge (~1 hr)',
      },
      {
        dayNumber: 2,
        title: 'Full Safari Day — Timbavati',
        description:
          'Pre-dawn coffee and rusks before a morning game drive focused on predator tracking. Return for a full brunch. Afternoon drive departs at 3:30 pm, continuing through golden hour with a sundowner stop at a scenic waterhole.',
        accommodation: 'Timbavati Private Reserve lodge',
        meals: ['B', 'L', 'D'],
        activities: [
          'Morning predator-tracking game drive',
          'Afternoon game drive with sundowner',
        ],
        destination: 'south-africa',
      },
      {
        dayNumber: 3,
        title: 'Fly to Mozambique — Beach Arrival',
        description:
          'Final morning game drive before breakfast and check-out. Transfer to the airstrip for your flight to Vilanculos, Mozambique. Arrive and transfer by boat to your beach lodge on the edge of the Bazaruto Archipelago. Afternoon at leisure on the beach.',
        accommodation: 'Bazaruto beach lodge',
        meals: ['B', 'L', 'D'],
        activities: [
          'Morning farewell game drive',
          'Flight to Vilanculos',
          'Boat transfer to beach lodge',
          'Beach afternoon at leisure',
        ],
        destination: 'mozambique',
        transferNote: 'Flight HDS → VNX (~2 hrs via JNB connection) + boat transfer to lodge',
      },
    ],
    heroImage: '/images/packages/safari-zanzibar.jpg',
    galleryImages: [
      '/images/packages/safari-zanzibar.jpg',
      '/images/packages/jeep-safari.webp',
      '/images/destinations/fanjove-island.jpg',
      '/images/packages/zanzibar-boat.webp',
    ],
    targetSegments: ['Couples', 'Families', 'Honeymoon'],
    featured: false,
    partnerDMCs: ['New Frontiers Tours', 'Destination Africa'],
  },

  // ═══════════════════════════════════════════════════════════════
  // 6. ZIMBABWE PANORAMA
  // ═══════════════════════════════════════════════════════════════
  {
    slug: 'zimbabwe-panorama',
    name: 'Zimbabwe Panorama',
    tier: 'mid-range',
    destinations: ['zimbabwe'],
    experienceTypes: ['cultural', 'safari'],
    durationDays: 11,
    durationNights: 10,
    routeSummary: 'Great Zimbabwe → Matobo Hills → Hwange National Park → Victoria Falls',
    shortDescription:
      'A cultural and wildlife odyssey through Zimbabwe: ancient ruins, rock art, world-class game reserves, and the thundering Victoria Falls.',
    fullDescription: `The Zimbabwe Panorama is a deep-dive into one of Southern Africa's most underrated destinations. Over eleven days, this itinerary weaves together the country's UNESCO-listed heritage sites, its extraordinary wildlife, and its dramatic natural landmarks into a single flowing narrative. This is not a whistle-stop tour — it is an immersion, designed for culturally curious travellers who want to understand a place as much as photograph it.

The journey begins at Great Zimbabwe, the medieval stone city that gave the country its name, before continuing to the Matobo Hills — a landscape of giant granite domes, ancient San rock art, and the grave of Cecil John Rhodes. From there, the route heads northwest to Hwange National Park for three nights of game drives among the country's largest elephant herds and predator populations. The grand finale is Victoria Falls, where two nights allow for the falls themselves, a Zambezi cruise, and the option to add adrenaline activities.

At $3,590 per person, the Zimbabwe Panorama delivers exceptional value. Accommodation is in comfortable mid-range lodges, all park entry fees are included, and Little Roz Tours' local guides bring the kind of deep cultural knowledge that transforms a trip from good to unforgettable. Group sizes are capped at ten for an intimate experience.`,
    priceFrom: 3590,
    priceUnit: 'per-person',
    groupSizeMin: 2,
    groupSizeMax: 10,
    difficulty: 'easy',
    bestMonths: [4, 5, 6, 7, 8, 9, 10],
    highlights: [
      'Guided tour of the Great Zimbabwe ruins — UNESCO World Heritage Site',
      'San rock art exploration in the Matobo Hills',
      'Three nights of game drives in Hwange National Park',
      'Victoria Falls Rainforest walk and Zambezi sunset cruise',
      'Local Shona cultural experiences and village visits',
    ],
    included: [
      'All accommodation (10 nights — lodges and guesthouses)',
      'All meals (10 breakfasts, 8 lunches, 9 dinners)',
      'All national park and monument entry fees',
      'Professional English-speaking guide throughout',
      'All ground transfers in a comfortable safari vehicle',
      'Zambezi sunset cruise with drinks',
      'Victoria Falls Rainforest guided walk',
    ],
    excluded: [
      'International flights to Masvingo and out of Victoria Falls',
      'Zimbabwe visa ($30) or KAZA Univisa ($50)',
      'Travel and medical insurance (mandatory)',
      'Optional adrenaline activities at Victoria Falls',
      'Alcoholic beverages beyond included activities',
    ],
    itinerary: [
      {
        dayNumber: 1,
        title: 'Arrival at Great Zimbabwe',
        description:
          'Arrive in Masvingo and transfer to your lodge near the Great Zimbabwe National Monument. Afternoon orientation walk around the ruins with your guide, followed by a welcome dinner showcasing traditional Zimbabwean cuisine.',
        accommodation: 'Lodge near Great Zimbabwe',
        meals: ['D'],
        activities: [
          'Airport/bus transfer to lodge',
          'Orientation walk at Great Zimbabwe',
          'Traditional Zimbabwean welcome dinner',
        ],
        destination: 'zimbabwe',
      },
      {
        dayNumber: 2,
        title: 'Great Zimbabwe & Matobo Hills',
        description:
          'Full morning guided tour of the Great Zimbabwe ruins — the Hill Complex, Great Enclosure, and Valley Ruins. After lunch, drive south to the Matobo Hills. Late-afternoon visit to Nswatugi Cave to see 2,000-year-old San rock paintings.',
        accommodation: 'Matobo Hills lodge',
        meals: ['B', 'L', 'D'],
        activities: [
          'Great Zimbabwe ruins guided tour',
          'Transfer to Matobo Hills',
          'San rock art cave visit',
        ],
        destination: 'zimbabwe',
        transferNote: 'Overland transfer Masvingo → Matobo Hills (~3 hrs)',
      },
      {
        dayNumber: 3,
        title: 'Matobo Hills — Rhino Tracking & Culture',
        description:
          'Morning walking safari to track white rhino on foot in the Matobo National Park — one of the best places in Zimbabwe to see these endangered animals up close. Afternoon visit to World\'s View, the dramatic hilltop burial site of Cecil John Rhodes, and a local village for a cultural exchange.',
        accommodation: 'Matobo Hills lodge',
        meals: ['B', 'L', 'D'],
        activities: [
          'Rhino tracking walking safari',
          'World\'s View visit',
          'Village cultural exchange',
        ],
        destination: 'zimbabwe',
      },
    ],
    heroImage: '/images/packages/safari-tanzania.webp',
    galleryImages: [
      '/images/packages/safari-tanzania.webp',
      '/images/packages/wildlife-park.jpg',
      '/images/packages/migration-river.jpg',
    ],
    targetSegments: ['Cultural travellers', 'History enthusiasts', 'Photographers'],
    featured: false,
    partnerDMCs: ['Little Roz Tours'],
  },

  // ═══════════════════════════════════════════════════════════════
  // 7. SERENGETI & ZANZIBAR
  // ═══════════════════════════════════════════════════════════════
  {
    slug: 'serengeti-and-zanzibar',
    name: 'Serengeti & Zanzibar',
    tier: 'luxury',
    destinations: ['tanzania'],
    experienceTypes: ['bush-and-beach', 'safari', 'beach'],
    durationDays: 12,
    durationNights: 11,
    routeSummary: 'Arusha → Tarangire → Serengeti → Ngorongoro Crater → Zanzibar',
    shortDescription:
      'Tanzania\'s definitive bush-and-beach itinerary: the Serengeti migration, Ngorongoro Crater, and Zanzibar\'s spice-island shores in twelve luxurious days.',
    fullDescription: `The Serengeti & Zanzibar package is Tanzania's signature combination and TourLink's best-selling East African itinerary. Over twelve days, it delivers the full spectrum of what makes this country extraordinary: the vast predator-rich plains of the Serengeti, the wildlife-packed caldera of the Ngorongoro Crater, the elephant-studded savannahs of Tarangire, and the turquoise, spice-scented shores of Zanzibar.

The safari component follows the classic northern circuit with a luxury twist: private 4x4 Land Cruisers with pop-up roofs, intimate tented camps limited to a handful of rooms, and guides who hold the country's highest TALA certification. The Serengeti segment is timed to coincide with wherever the migration herds are concentrated — whether that means the southern calving grounds in January-March or the dramatic Mara River crossings from July-October. The Ngorongoro Crater descent is an experience in its own right: the world's largest intact caldera, home to 25,000 animals including the endangered black rhino.

After seven nights in the bush, a scenic flight delivers you to Zanzibar's Stone Town. Four nights on the island balance cultural exploration — spice tours, Stone Town's labyrinthine alleys, and Forodhani night market — with pure beach relaxation on the north or east coast. The price range of $8,000–$14,000 per person reflects lodge choice and migration-season timing. Gosheni Safaris handles all mainland logistics with the precision of a World Travel Award winner.`,
    priceFrom: 8000,
    priceTo: 14000,
    priceUnit: 'per-person',
    groupSizeMin: 2,
    groupSizeMax: 8,
    difficulty: 'easy',
    bestMonths: [1, 2, 6, 7, 8, 9, 10],
    highlights: [
      'Serengeti game drives tracking the Great Wildebeest Migration',
      'Ngorongoro Crater floor descent with picnic lunch',
      'Tarangire baobab landscapes and elephant herds',
      'Zanzibar Stone Town walking tour and spice farm visit',
      'Four nights on Zanzibar\'s pristine beaches',
    ],
    included: [
      'All accommodation (7 nights luxury tented camps + 4 nights Zanzibar beach resort)',
      'All meals and beverages on safari; half-board in Zanzibar',
      'Private 4x4 Land Cruiser with TALA-certified guide',
      'All national park fees (Serengeti, Ngorongoro, Tarangire)',
      'Scenic bush flight: Serengeti → Zanzibar',
      'Zanzibar Stone Town walking tour and spice farm visit',
      'All ground and boat transfers',
      'Flying Doctors emergency evacuation cover',
    ],
    excluded: [
      'International flights to Kilimanjaro (JRO) and out of Zanzibar (ZNZ)',
      'Tanzania visa ($50)',
      'Travel and medical insurance (mandatory)',
      'Zanzibar dinner excursions beyond hotel half-board',
      'Optional diving, kite-surfing, and deep-sea fishing in Zanzibar',
    ],
    itinerary: [
      {
        dayNumber: 1,
        title: 'Arrival in Arusha',
        description:
          'Arrive at Kilimanjaro International Airport and transfer to your boutique lodge in Arusha. Meet your guide for a trip briefing over a welcome dinner with views of Mount Meru.',
        accommodation: 'Boutique lodge, Arusha',
        meals: ['D'],
        activities: [
          'Airport transfer',
          'Trip briefing and welcome dinner',
        ],
        destination: 'tanzania',
        transferNote: 'Private transfer from JRO airport (~45 min)',
      },
      {
        dayNumber: 2,
        title: 'Arusha to Tarangire National Park',
        description:
          'Drive south to Tarangire National Park, renowned for its massive baobab trees and some of Africa\'s densest elephant concentrations. Afternoon game drive along the Tarangire River where hundreds of elephants, giraffe, and buffalo congregate during the dry season.',
        accommodation: 'Luxury tented camp, Tarangire',
        meals: ['B', 'L', 'D'],
        activities: [
          'Scenic drive to Tarangire (~2.5 hrs)',
          'Afternoon game drive along the Tarangire River',
        ],
        destination: 'tanzania',
      },
      {
        dayNumber: 3,
        title: 'Tarangire to Serengeti',
        description:
          'Depart Tarangire and drive through the Ngorongoro Conservation Area to the Serengeti. Enter through Naabi Hill Gate and drive across the endless plains to your camp. En route, the landscape shifts from highland forest to open savannah — your first game sightings begin the moment you cross the Serengeti boundary.',
        accommodation: 'Luxury tented camp, Serengeti',
        meals: ['B', 'L', 'D'],
        activities: [
          'Scenic transfer through Ngorongoro Highlands',
          'Game drive en route to camp in the Serengeti',
        ],
        destination: 'tanzania',
        transferNote: 'Tarangire → Serengeti overland via Ngorongoro (~6–7 hrs with game driving)',
      },
    ],
    heroImage: '/images/packages/tanzania-zanzibar-15day.jpg',
    galleryImages: [
      '/images/packages/tanzania-zanzibar-15day.jpg',
      '/images/destinations/serengeti.jpg',
      '/images/destinations/ngorongoro.jpg',
      '/images/destinations/zanzibar.jpg',
      '/images/packages/zanzibar-boat.webp',
    ],
    targetSegments: ['Couples', 'Luxury travellers', 'Honeymoon'],
    featured: false,
    partnerDMCs: ['Gosheni Safaris'],
  },

  // ═══════════════════════════════════════════════════════════════
  // 8. CAPE & KRUGER CLASSIC
  // ═══════════════════════════════════════════════════════════════
  {
    slug: 'cape-and-kruger-classic',
    name: 'Cape & Kruger Classic',
    tier: 'mid-range',
    destinations: ['south-africa'],
    experienceTypes: ['safari', 'cultural'],
    durationDays: 8,
    durationNights: 7,
    routeSummary: 'Cape Town (3 nights) → Greater Kruger (4 nights)',
    shortDescription:
      'South Africa\'s two greatest hits in eight days: Cape Town\'s cosmopolitan culture and wine country, followed by Big Five game drives in the Greater Kruger.',
    fullDescription: `The Cape & Kruger Classic is TourLink's streamlined South Africa itinerary for travellers who want the country's two signature experiences without the filler. Three nights in Cape Town cover Table Mountain, the Winelands, and the Cape Peninsula, while four nights in the Greater Kruger deliver twice-daily game drives in a private concession with Big Five sightings virtually guaranteed.

Cape Town consistently ranks among the world's most beautiful cities, and the itinerary gives you three full days to understand why. Beyond the obvious — Table Mountain, the Waterfront, Robben Island — your guide weaves in the Bo-Kaap's cobbled streets, Kirstenbosch's botanical splendour, and a Winelands lunch that showcases South Africa's culinary renaissance. The transition to bush is dramatic: a two-hour flight drops you into the lowveld, where the soundtrack shifts from city traffic to birdsong and the night sky blazes with the Milky Way.

The Greater Kruger section is based in a private concession that borders the national park. This means open-vehicle game drives (no windows), off-road tracking, night drives with spotlights, and a maximum of three vehicles per sighting. The result is an immersive safari experience that public Kruger simply cannot match. MoAfrika Tours coordinates the full itinerary with a fleet of 75+ vehicles and guides who know every waterhole and leopard territory in the reserve.`,
    priceFrom: 3000,
    priceTo: 4500,
    priceUnit: 'per-person',
    groupSizeMin: 2,
    groupSizeMax: 12,
    difficulty: 'easy',
    bestMonths: [3, 4, 5, 6, 7, 8, 9, 10, 11],
    highlights: [
      'Table Mountain summit — cable car or guided hike',
      'Cape Winelands tasting tour with vineyard lunch',
      'Cape Peninsula scenic drive and Boulders Beach penguins',
      'Four nights of Big Five game drives in a private Kruger concession',
      'Bush walks and night drives in the Greater Kruger',
    ],
    included: [
      'All accommodation (3 nights Cape Town boutique hotel + 4 nights safari lodge)',
      'Meals: 7 breakfasts, 4 lunches (safari), 4 dinners (safari)',
      'Internal flight: Cape Town → Kruger (Hoedspruit/Nelspruit)',
      'All game drives and bush activities (2 per day on safari)',
      'Cape Town city and Winelands day tours',
      'All ground transfers and airport meet-and-greets',
    ],
    excluded: [
      'International flights to Cape Town and out of Kruger region',
      'Travel and medical insurance',
      'Cape Town meals beyond breakfast (wide restaurant choice available)',
      'Alcoholic beverages at safari lodge beyond house wines and beers',
      'Optional Table Mountain cable car ticket (if hiking option not taken)',
    ],
    itinerary: [
      {
        dayNumber: 1,
        title: 'Arrive Cape Town — Table Mountain',
        description:
          'Arrive at Cape Town International and transfer to your boutique hotel. Afternoon ascent of Table Mountain by cable car (weather permitting) for panoramic city and ocean views. Welcome dinner at a top Waterfront restaurant.',
        accommodation: 'Boutique hotel, Cape Town',
        meals: ['D'],
        activities: [
          'Airport transfer',
          'Table Mountain cable car',
          'Welcome dinner',
        ],
        destination: 'south-africa',
      },
      {
        dayNumber: 2,
        title: 'Cape Winelands Excursion',
        description:
          'Full-day tour through Stellenbosch and Franschhoek. Visit three estates for tastings, enjoy a gourmet lunch in the vineyards, and return via the scenic Helshoogte Pass. Evening at leisure in Cape Town.',
        accommodation: 'Boutique hotel, Cape Town',
        meals: ['B', 'L'],
        activities: [
          'Stellenbosch and Franschhoek wine tastings',
          'Vineyard gourmet lunch',
          'Helshoogte Pass scenic drive',
        ],
        destination: 'south-africa',
      },
      {
        dayNumber: 3,
        title: 'Cape Peninsula & Fly to Kruger',
        description:
          'Morning drive along Chapman\'s Peak to Cape Point and the Cape of Good Hope. Stop at Boulders Beach for the African penguin colony. Afternoon flight to the Kruger region. Arrive at your safari lodge for a welcome bush dinner.',
        accommodation: 'Private concession safari lodge, Greater Kruger',
        meals: ['B', 'L', 'D'],
        activities: [
          'Chapman\'s Peak and Cape Point drive',
          'Boulders Beach penguin colony',
          'Flight to Kruger',
          'Welcome bush dinner',
        ],
        destination: 'south-africa',
        transferNote: 'Flight CPT → HDS/MQP (~2 hrs) + lodge transfer (1 hr)',
      },
    ],
    heroImage: '/images/heroes/safari-sunset.jpg',
    galleryImages: [
      '/images/heroes/safari-sunset.jpg',
      '/images/packages/big-five-luxury.jpg',
      '/images/packages/jeep-safari.webp',
    ],
    targetSegments: ['First-timers', 'Couples', 'Solo travellers'],
    featured: false,
    partnerDMCs: ['MoAfrika Tours'],
  },

  // ═══════════════════════════════════════════════════════════════
  // 9. MOZAMBIQUE ARCHIPELAGO
  // ═══════════════════════════════════════════════════════════════
  {
    slug: 'mozambique-archipelago',
    name: 'Mozambique Archipelago',
    tier: 'luxury',
    destinations: ['mozambique'],
    experienceTypes: ['beach'],
    durationDays: 7,
    durationNights: 6,
    routeSummary: 'Vilanculos → Bazaruto Island → Benguerra Island → Vilanculos',
    shortDescription:
      'A week of Indian Ocean paradise: island-hop through the Bazaruto Archipelago with dhow sailing, coral reefs, and barefoot luxury on deserted beaches.',
    fullDescription: `The Mozambique Archipelago package is pure Indian Ocean indulgence. Over seven days, you will island-hop through the Bazaruto Archipelago — a chain of five pristine barrier islands off the coast of Vilanculos, protected as a national park and home to some of the most biodiverse marine environments in the western Indian Ocean. Dugongs, sea turtles, whale sharks (seasonal), and over 2,000 species of fish inhabit these warm, crystal-clear waters.

Accommodation alternates between two of the archipelago's finest beach lodges: one on Bazaruto Island, the largest in the chain with towering dunes and freshwater lakes, and one on Benguerra Island, a smaller, more intimate island known for its castaway vibe and world-class snorkelling. Days are spent sailing traditional dhows between islands, snorkelling over coral gardens, kayaking through mangrove channels, and simply lying on beaches where your footprints may be the only ones for kilometres.

This is a honeymoon and couples' favourite, but it also appeals to anyone seeking a genuine digital-detox experience. Lodge WiFi is intentionally limited, there are no televisions, and the rhythm of the tides replaces the rhythm of a schedule. Destination Africa coordinates all boat logistics, island permits, and marine park fees — guests simply arrive in Vilanculos and let the ocean take over.`,
    priceFrom: 5000,
    priceTo: 9000,
    priceUnit: 'per-person',
    groupSizeMin: 2,
    groupSizeMax: 8,
    difficulty: 'easy',
    bestMonths: [3, 4, 5, 6, 7, 8, 9, 10, 11],
    highlights: [
      'Island hopping through the Bazaruto Archipelago by traditional dhow',
      'Snorkelling with sea turtles and tropical fish on pristine reefs',
      'Barefoot luxury beach lodge stays on Bazaruto and Benguerra islands',
      'Whale shark encounters (October to March, seasonal)',
      'Sunset dhow cruise with fresh seafood and local wine',
    ],
    included: [
      'All accommodation (3 nights Bazaruto Island + 3 nights Benguerra Island)',
      'All meals and local beverages at both lodges',
      'All boat transfers between Vilanculos and islands',
      'Dhow sailing excursion and sandbar picnic',
      'Two guided snorkelling trips with marine guide',
      'Bazaruto National Park marine fees',
      'Kayaking and non-motorised water sports',
    ],
    excluded: [
      'International and domestic flights to/from Vilanculos',
      'Mozambique visa (~$50)',
      'Travel and medical insurance (mandatory)',
      'Scuba diving with PADI operator (available at lodges)',
      'Deep-sea fishing charters',
    ],
    itinerary: [
      {
        dayNumber: 1,
        title: 'Arrival in Vilanculos — Transfer to Bazaruto Island',
        description:
          'Arrive at Vilanculos airport and transfer by speedboat to your lodge on Bazaruto Island. The 45-minute crossing through turquoise waters sets the tone for the week. Settle in, explore the beach, and watch the sunset from the lodge deck with a cold cocktail.',
        accommodation: 'Beach lodge, Bazaruto Island',
        meals: ['L', 'D'],
        activities: [
          'Speedboat transfer to Bazaruto Island',
          'Beach exploration and sunset drinks',
        ],
        destination: 'mozambique',
        transferNote: 'Speedboat from Vilanculos to Bazaruto Island (~45 min)',
      },
      {
        dayNumber: 2,
        title: 'Bazaruto — Snorkelling & Dune Hike',
        description:
          'Morning snorkelling trip to Two Mile Reef, one of the archipelago\'s premier sites with pristine hard and soft corals, moray eels, and schools of tropical fish. Afternoon hike to the top of Bazaruto\'s towering sand dunes for 360-degree views of the archipelago and the Mozambique mainland.',
        accommodation: 'Beach lodge, Bazaruto Island',
        meals: ['B', 'L', 'D'],
        activities: [
          'Guided snorkelling at Two Mile Reef',
          'Sand dune summit hike',
          'Beach afternoon',
        ],
        destination: 'mozambique',
      },
      {
        dayNumber: 3,
        title: 'Bazaruto — Dhow Sailing & Sandbar Picnic',
        description:
          'Board a traditional Mozambican dhow and sail through the archipelago. Anchor at a remote sandbar for a seafood picnic lunch — grilled prawns, calamari, and fresh tropical fruit on a strip of white sand surrounded by turquoise water. Afternoon at leisure back at the lodge.',
        accommodation: 'Beach lodge, Bazaruto Island',
        meals: ['B', 'L', 'D'],
        activities: [
          'Traditional dhow sailing excursion',
          'Sandbar seafood picnic lunch',
          'Free afternoon at the lodge',
        ],
        destination: 'mozambique',
      },
    ],
    heroImage: '/images/packages/luxury-zanzibar-holiday.jpg',
    galleryImages: [
      '/images/packages/luxury-zanzibar-holiday.jpg',
      '/images/destinations/fanjove-island.jpg',
      '/images/packages/zanzibar-boat.webp',
      '/images/packages/honeymoon-couple.jpg',
    ],
    targetSegments: ['Honeymoon', 'Couples', 'Beach lovers'],
    featured: false,
    partnerDMCs: ['Destination Africa'],
  },

  // ═══════════════════════════════════════════════════════════════
  // 10. KAZA CORRIDOR EXPLORER
  // ═══════════════════════════════════════════════════════════════
  {
    slug: 'kaza-corridor-explorer',
    name: 'KAZA Corridor Explorer',
    tier: 'mid-range',
    destinations: ['zimbabwe', 'botswana', 'zambia'],
    experienceTypes: ['safari', 'cultural'],
    durationDays: 10,
    durationNights: 9,
    routeSummary: 'Victoria Falls → Chobe National Park (Botswana) → Livingstone (Zambia)',
    shortDescription:
      'Explore the KAZA Transfrontier Conservation Area across three countries: Victoria Falls, Chobe\'s elephants, and Zambia\'s Livingstone — all under one visa.',
    fullDescription: `The KAZA Corridor Explorer takes full advantage of the Kavango-Zambezi Transfrontier Conservation Area — the world's largest conservation landscape spanning five countries. This ten-day itinerary threads through three of them: Zimbabwe, Botswana, and Zambia, using the KAZA Univisa to move seamlessly between Victoria Falls, Chobe National Park, and Livingstone without additional border paperwork.

Victoria Falls anchors both ends of the journey, with two nights at the start for the falls experience and a night at the end for departure flexibility. In between, four nights in Chobe National Park deliver some of Southern Africa's most spectacular game viewing: the park's 120,000 elephants and the Chobe River's concentration of hippo, crocodile, and Cape buffalo create a wildlife density that is staggering even by African standards. The Zambia segment explores Livingstone's quieter side of the falls and the upper Zambezi's islands and rapids.

This is a superb choice for adventurous travellers who want a multi-country experience without the complexity of separate visas, disconnected flights, and repeated border formalities. The KAZA Univisa ($50) covers all three countries, and TourLink's partners handle every transfer — including the scenic 90-minute drive from Victoria Falls to Kasane (Chobe) and the river crossing to Zambia.`,
    priceFrom: 4000,
    priceTo: 6500,
    priceUnit: 'per-person',
    groupSizeMin: 2,
    groupSizeMax: 10,
    difficulty: 'easy',
    bestMonths: [4, 5, 6, 7, 8, 9, 10],
    highlights: [
      'Victoria Falls from both Zimbabwe and Zambia sides',
      'Chobe riverfront game drives and boat safaris',
      'Elephant herds of the Chobe — Africa\'s densest population',
      'Livingstone Island picnic at the edge of the falls (seasonal)',
      'Three countries, one visa, zero hassle',
    ],
    included: [
      'All accommodation (9 nights — lodges and hotels across three countries)',
      'All meals as specified (9 breakfasts, 7 lunches, 8 dinners)',
      'All game drives and boat cruises in Chobe',
      'Victoria Falls Rainforest entry (Zimbabwe side)',
      'Victoria Falls entry (Zambia side)',
      'Zambezi sunset cruise',
      'All ground and cross-border transfers',
      'English-speaking guide throughout',
    ],
    excluded: [
      'International flights to/from Victoria Falls',
      'KAZA Univisa ($50)',
      'Travel and medical insurance (mandatory)',
      'Optional activities (helicopter, bungee, rafting)',
      'Botswana park fees if not covered by lodge (confirm at booking)',
    ],
    itinerary: [
      {
        dayNumber: 1,
        title: 'Arrival at Victoria Falls',
        description:
          'Arrive at Victoria Falls Airport and transfer to your hotel. Afternoon guided walk through the Victoria Falls Rainforest on the Zimbabwe side — feel the thundering spray and photograph the rainbow-draped gorge. Welcome dinner overlooking the Zambezi.',
        accommodation: 'Hotel in Victoria Falls town',
        meals: ['D'],
        activities: [
          'Airport transfer',
          'Victoria Falls Rainforest guided walk',
          'Welcome dinner',
        ],
        destination: 'zimbabwe',
      },
      {
        dayNumber: 2,
        title: 'Victoria Falls — Zambezi Cruise & Free Time',
        description:
          'Morning at leisure to explore craft markets or add an optional helicopter flight. Afternoon Zambezi sunset cruise with drinks, canapes, and hippo sightings. Evening dinner at a local restaurant in Victoria Falls town.',
        accommodation: 'Hotel in Victoria Falls town',
        meals: ['B', 'D'],
        activities: [
          'Free morning for optional activities',
          'Zambezi sunset cruise with drinks and canapes',
        ],
        destination: 'zimbabwe',
      },
      {
        dayNumber: 3,
        title: 'Cross to Chobe — Afternoon Boat Safari',
        description:
          'Drive from Victoria Falls to Kasane, Botswana — crossing the border with your KAZA Univisa. Check in to your Chobe riverfront lodge. Afternoon boat cruise on the Chobe River with close encounters with elephant herds, buffalo, hippo, and Nile crocodile along the banks.',
        accommodation: 'Chobe riverfront lodge',
        meals: ['B', 'L', 'D'],
        activities: [
          'Overland transfer to Chobe via Kazungula border',
          'Afternoon Chobe River boat safari',
        ],
        destination: 'botswana',
        transferNote: 'Victoria Falls → Kasane overland (~90 min including border)',
      },
    ],
    heroImage: '/images/packages/wildlife-park.jpg',
    galleryImages: [
      '/images/packages/wildlife-park.jpg',
      '/images/packages/migration-river.jpg',
      '/images/packages/safari-tanzania.webp',
    ],
    targetSegments: ['Adventurers', 'Multi-country enthusiasts', 'Photographers'],
    featured: false,
    partnerDMCs: ['T.S Tours', 'Little Roz Tours'],
  },

  // ═══════════════════════════════════════════════════════════════
  // 11. NORTHERN CIRCUIT CLASSIC
  // ═══════════════════════════════════════════════════════════════
  {
    slug: 'northern-circuit-classic',
    name: 'Northern Circuit Classic',
    tier: 'mid-range',
    destinations: ['tanzania'],
    experienceTypes: ['safari'],
    durationDays: 8,
    durationNights: 7,
    routeSummary: 'Arusha → Tarangire → Serengeti → Ngorongoro Crater → Arusha',
    shortDescription:
      'Tanzania\'s iconic northern safari circuit in eight days: Tarangire elephants, Serengeti plains, and the Ngorongoro Crater in one flowing itinerary.',
    fullDescription: `The Northern Circuit Classic is the essential Tanzania safari — a carefully paced eight-day loop through the country's three greatest wildlife areas. Starting and ending in Arusha, the itinerary visits Tarangire National Park, the Serengeti, and the Ngorongoro Crater in a sequence that balances driving distances, ecological diversity, and peak game-viewing windows.

Tarangire opens the circuit with its dramatic baobab-studded landscape and some of Africa's densest elephant concentrations. From there, the route crosses the Ngorongoro Highlands to enter the Serengeti via Naabi Hill Gate, with three nights in the heart of the park to explore the vast plains and track predators. The migration's location varies by season, and your TALA-certified guide adjusts daily routes accordingly. The circuit climaxes with a descent into the Ngorongoro Crater — a 600-metre-deep caldera that functions as a self-contained ecosystem supporting approximately 25,000 animals including the endangered black rhino.

Priced at $4,500–$7,000 per person depending on lodge category and season, the Northern Circuit Classic sits in the sweet spot between budget camping safaris and ultra-luxury fly-in experiences. Accommodation is in well-appointed tented camps and lodges, vehicles are private (no sharing with strangers), and Gosheni Safaris' guides are among the most knowledgeable in East Africa.`,
    priceFrom: 4500,
    priceTo: 7000,
    priceUnit: 'per-person',
    groupSizeMin: 2,
    groupSizeMax: 8,
    difficulty: 'easy',
    bestMonths: [1, 2, 6, 7, 8, 9, 10, 11, 12],
    highlights: [
      'Tarangire\'s ancient baobab forests and massive elephant herds',
      'Three nights in the Serengeti with migration-tracking game drives',
      'Ngorongoro Crater descent — the world\'s largest intact caldera',
      'Private 4x4 Land Cruiser with TALA-certified guide',
      'Bush sundowners on the Serengeti plains',
    ],
    included: [
      'All accommodation (7 nights — tented camps and lodges)',
      'All meals and beverages on safari (full board)',
      'Private 4x4 Land Cruiser with pop-up roof',
      'TALA-certified English-speaking guide',
      'All national park and conservation area fees',
      'Ngorongoro Crater vehicle descent fee',
      'Airport transfers: JRO ↔ Arusha',
      'Flying Doctors emergency evacuation cover',
    ],
    excluded: [
      'International flights to/from Kilimanjaro (JRO)',
      'Tanzania visa ($50)',
      'Travel and medical insurance (mandatory)',
      'Optional hot-air balloon safari over the Serengeti (~$550 pp)',
      'Gratuities for guide and camp staff',
    ],
    itinerary: [
      {
        dayNumber: 1,
        title: 'Arusha to Tarangire National Park',
        description:
          'Meet your guide at your Arusha hotel after breakfast and drive south to Tarangire National Park. Enter the park and begin your first game drive along the Tarangire River, where dry-season concentrations of elephant, giraffe, zebra, and wildebeest are spectacular. Arrive at your tented camp by late afternoon.',
        accommodation: 'Tented camp, Tarangire',
        meals: ['B', 'L', 'D'],
        activities: [
          'Transfer from Arusha to Tarangire (~2.5 hrs)',
          'Afternoon game drive along the Tarangire River',
        ],
        destination: 'tanzania',
      },
      {
        dayNumber: 2,
        title: 'Tarangire to Serengeti',
        description:
          'After an early breakfast, drive northwest through the Ngorongoro Conservation Area and descend into the Serengeti. The landscape transforms from highland forest to open golden plains. Enter via Naabi Hill Gate and enjoy game driving en route to your Serengeti camp.',
        accommodation: 'Tented camp, Serengeti',
        meals: ['B', 'L', 'D'],
        activities: [
          'Scenic drive through Ngorongoro Highlands',
          'Serengeti entry and game driving to camp',
        ],
        destination: 'tanzania',
        transferNote: 'Tarangire → Serengeti via Ngorongoro (~6–7 hrs with stops)',
      },
      {
        dayNumber: 3,
        title: 'Full Day Serengeti Game Drives',
        description:
          'A full day exploring the Serengeti\'s vast plains. Morning drive follows the migration herds or focuses on the Seronera Valley\'s resident big-cat territories. Picnic lunch in the bush. Afternoon drive continues through different habitat zones, ending with a sundowner stop on a kopje (granite outcrop) with panoramic views.',
        accommodation: 'Tented camp, Serengeti',
        meals: ['B', 'L', 'D'],
        activities: [
          'Full-day game driving with picnic lunch',
          'Kopje sundowner with panoramic views',
        ],
        destination: 'tanzania',
      },
    ],
    heroImage: '/images/destinations/serengeti.jpg',
    galleryImages: [
      '/images/destinations/serengeti.jpg',
      '/images/destinations/ngorongoro.jpg',
      '/images/destinations/tarangire.jpg',
      '/images/destinations/lake-manyara.webp',
    ],
    targetSegments: ['First-timers', 'Families', 'Wildlife enthusiasts'],
    featured: false,
    partnerDMCs: ['Gosheni Safaris'],
  },

  // ═══════════════════════════════════════════════════════════════
  // 12. MIGRATION & CRATER LUXURY
  // ═══════════════════════════════════════════════════════════════
  {
    slug: 'migration-and-crater-luxury',
    name: 'Migration & Crater Luxury',
    tier: 'ultra-luxury',
    destinations: ['tanzania'],
    experienceTypes: ['safari'],
    durationDays: 10,
    durationNights: 9,
    routeSummary: 'Arusha → Ngorongoro Crater → Central Serengeti → Northern Serengeti → Arusha',
    shortDescription:
      'Tanzania\'s ultimate ultra-luxury safari: private fly-in camps, the Great Migration at its most dramatic, and the Ngorongoro Crater with no crowds.',
    fullDescription: `The Migration & Crater Luxury is TourLink's most exclusive East African offering — a ten-day, all-fly-in safari that places guests at the very heart of the Serengeti's Great Wildebeest Migration while accessing the Ngorongoro Crater with privileged early-morning timing that avoids the day-visitor rush. Every element of this itinerary has been curated for the ultra-high-net-worth traveller who expects perfection.

The journey begins with two nights on the Ngorongoro Crater rim at Lemala Osonjoi, where early-morning descent into the caldera means you are on the crater floor before other visitors arrive. From there, a bush flight carries you to the central Serengeti for three nights at a luxury tented camp positioned in the year-round big-cat hotspot around Seronera. The final safari segment moves north to the TAASA Migration Camp — a mobile camp that repositions seasonally to track the migration herds, placing guests within walking distance of the river-crossing action during peak months.

At $15,000–$25,000 per person, this package sits at the apex of the African safari market. It includes all bush flights, premium beverages, private game-drive vehicles, a dedicated safari host, and access to properties that collectively represent the finest new openings in Tanzanian luxury. Gosheni Safaris handles ground logistics with the precision that earned them the World Travel Awards' Leading DMC Tanzania recognition.`,
    priceFrom: 15000,
    priceTo: 25000,
    priceUnit: 'per-person',
    groupSizeMin: 2,
    groupSizeMax: 6,
    difficulty: 'easy',
    bestMonths: [1, 2, 6, 7, 8, 9, 10],
    highlights: [
      'Privileged early-morning Ngorongoro Crater descent before day visitors',
      'Private fly-in transfers between all camps — zero road time',
      'Mobile migration camp tracking the herds across the Serengeti',
      'Hot-air balloon safari over the Serengeti at sunrise',
      'Dedicated safari host and private game-drive vehicle throughout',
    ],
    included: [
      'All accommodation (9 nights — ultra-luxury lodges and tented camps)',
      'All meals, premium wines, spirits, and beverages',
      'All bush flights between camps and to/from Arusha',
      'Private 4x4 game-drive vehicle at each camp',
      'Dedicated TourLink safari host throughout',
      'Hot-air balloon safari over the Serengeti with Champagne breakfast',
      'Ngorongoro Crater descent with picnic lunch and premium drinks',
      'All national park fees, concession fees, and conservation levies',
      'Laundry service at all properties',
      'Flying Doctors emergency evacuation cover',
    ],
    excluded: [
      'International flights to/from Kilimanjaro (JRO)',
      'Tanzania visa ($50)',
      'Travel and medical insurance (mandatory)',
      'Gratuities for guides and lodge staff (suggested $30–$50 pp/day)',
      'Premium Champagne and rare vintages beyond house selection',
    ],
    itinerary: [
      {
        dayNumber: 1,
        title: 'Arrival in Arusha — Welcome',
        description:
          'VIP meet-and-greet at Kilimanjaro International Airport with private transfer to an exclusive Arusha boutique hotel. Meet your dedicated safari host for a detailed trip briefing and welcome dinner featuring East African cuisine paired with fine South African wines.',
        accommodation: 'Exclusive boutique hotel, Arusha',
        meals: ['D'],
        activities: [
          'VIP airport meet-and-greet',
          'Safari host briefing',
          'Welcome dinner with wine pairing',
        ],
        destination: 'tanzania',
        transferNote: 'Private transfer from JRO airport (~45 min)',
      },
      {
        dayNumber: 2,
        title: 'Fly to Ngorongoro — Crater Rim Afternoon',
        description:
          'Morning bush flight from Arusha to the Ngorongoro airstrip. Transfer to Lemala Osonjoi on the crater rim. After a leisurely lunch with caldera views, enjoy an afternoon nature walk along the rim through montane forest, accompanied by an armed ranger and your guide. Sundowners on the rim as the sun sets over the crater.',
        accommodation: 'Lemala Osonjoi, Ngorongoro Crater rim',
        meals: ['B', 'L', 'D'],
        activities: [
          'Bush flight to Ngorongoro',
          'Crater rim nature walk',
          'Rim sundowners with caldera views',
        ],
        destination: 'tanzania',
        transferNote: 'Bush flight Arusha → Ngorongoro (~35 min)',
      },
      {
        dayNumber: 3,
        title: 'Ngorongoro Crater — Early Descent',
        description:
          'Depart before dawn for a privileged early-morning descent into the Ngorongoro Crater — arriving on the floor before day visitors. Spend the morning exploring the 260-square-kilometre caldera: lion prides, black rhino, flamingo-fringed Lake Magadi, and enormous elephant bulls. Champagne picnic lunch on the crater floor before ascending for an afternoon at leisure at the lodge.',
        accommodation: 'Lemala Osonjoi, Ngorongoro Crater rim',
        meals: ['B', 'L', 'D'],
        activities: [
          'Pre-dawn crater descent',
          'Full-morning crater game drive',
          'Champagne picnic lunch on the crater floor',
          'Afternoon at leisure',
        ],
        destination: 'tanzania',
      },
    ],
    heroImage: '/images/packages/kenya-tanzania-migration.jpg',
    galleryImages: [
      '/images/packages/kenya-tanzania-migration.jpg',
      '/images/destinations/ngorongoro.jpg',
      '/images/destinations/serengeti.jpg',
      '/images/properties/luxury-lodge.jpg',
      '/images/properties/lodge-interior.jpg',
    ],
    targetSegments: ['UHNW', 'Luxury connoisseurs', 'Anniversary celebrations'],
    featured: false,
    partnerDMCs: ['Gosheni Safaris'],
  },
];
