// ═══════════════════════════════════════════════════════════════════════════
// DINOBASE — COMPLETE DATA SYSTEM
// Structured, scalable JSON-based dinosaur database
// ═══════════════════════════════════════════════════════════════════════════

const DINOBASE = {
  version: "2.0.0",
  schemaVersion: 1,
  lastUpdated: "2026-05-02",

  // ─── DATA MODEL (designed to scale to 100s+ entries) ─────────────────
  schema: {
    dinosaur: {
      required: ["id", "name", "period", "diet", "size", "habitat", "classification", "facts"],
      notes: {
        name: "Use {scientific, common}.",
        period: "One of triassic | jurassic | cretaceous.",
        diet: "One of carnivore | herbivore | omnivore | piscivore.",
        size: "Derived from measurements; includes {category, lengthM, heightM, weightKg}.",
        facts: "Array of short fact strings for the species card/detail view."
      }
    }
  },

  enums: {
    periods: ["triassic", "jurassic", "cretaceous"],
    diets: ["carnivore", "herbivore", "omnivore", "piscivore"],
    sizeCategories: ["small", "medium", "large"]
  },

  // ─── CLASSIFICATION TAXONOMY ───────────────────────────────────────────
  taxonomy: {
    saurischia: {
      label: "Saurischia",
      subgroups: ["theropod", "sauropod", "spinosaur"]
    },
    ornithischia: {
      label: "Ornithischia",
      subgroups: ["ceratopsian", "ankylosaur", "stegosaur", "ornithopod", "hadrosaur"]
    },
    pterosauria: {
      label: "Pterosauria",
      subgroups: ["pterosaur"]
    }
  },

  // ─── GEOLOGIC PERIODS ──────────────────────────────────────────────────
  periods: {
    triassic: {
      label: "Triassic",
      startMya: 252,
      endMya: 201,
      color: "#c8743a",
      description: "The dawn of the dinosaurs. After the Permian-Triassic extinction, life slowly rebuilds on a single supercontinent — Pangaea.",
      keyEvents: [
        { mya: 252, event: "Permian-Triassic mass extinction — 96% of marine species vanish" },
        { mya: 240, event: "First dinosauriform animals appear" },
        { mya: 235, event: "True dinosaurs emerge (Eoraptor, Herrerasaurus)" },
        { mya: 220, event: "First pterosaurs take flight" },
        { mya: 210, event: "First mammals appear" },
        { mya: 201, event: "Triassic-Jurassic extinction event" }
      ]
    },
    jurassic: {
      label: "Jurassic",
      startMya: 201,
      endMya: 145,
      color: "#4a7c4e",
      description: "The golden age of dinosaurs. Pangaea splits apart, seas rise, and lush jungles spread across the globe. Sauropods reach titanic proportions.",
      keyEvents: [
        { mya: 200, event: "Pangaea begins splitting — Laurasia and Gondwana form" },
        { mya: 180, event: "Sauropods diversify and dominate" },
        { mya: 165, event: "Stegosaurs reach peak diversity" },
        { mya: 155, event: "Archaeopteryx — the first bird-like dinosaur" },
        { mya: 150, event: "Brachiosaurus, Allosaurus, Diplodocus all co-exist" },
        { mya: 145, event: "Jurassic-Cretaceous boundary" }
      ]
    },
    cretaceous: {
      label: "Cretaceous",
      startMya: 145,
      endMya: 66,
      color: "#5a3a8c",
      description: "The final and longest period. Continents approach modern positions, flowering plants emerge, and the most famous dinosaurs of all rise to dominance.",
      keyEvents: [
        { mya: 145, event: "Flowering plants (angiosperms) begin to appear" },
        { mya: 120, event: "Continents separate further — dinosaurs evolve differently on each" },
        { mya: 100, event: "Spinosaurus — largest land predator ever" },
        { mya: 90, event: "Sea levels at historic highs — shallow seas across North America" },
        { mya: 75, event: "Ceratopsians and hadrosaurs dominate North America" },
        { mya: 68, event: "Tyrannosaurus rex emerges" },
        { mya: 66, event: "Chicxulub asteroid impact — K-Pg mass extinction" }
      ]
    }
  },

  // ─── FACTS TICKER ──────────────────────────────────────────────────────
  facts: [
    "The word 'dinosaur' was coined by British paleontologist Richard Owen in 1842.",
    "Birds are the only living descendants of dinosaurs — making dinosaurs technically not extinct.",
    "T-Rex had a bite force of over 8,000 pounds — stronger than any land animal alive today.",
    "Patagotitan mayorum weighed as much as 12 African elephants.",
    "The Stegosaurus had a brain the size of a walnut, despite being the size of a bus.",
    "Velociraptor was actually about the size of a turkey, not as depicted in films.",
    "Some dinosaurs had feathers millions of years before birds evolved.",
    "Sauropod necks could reach over 15 metres in length.",
    "The Chicxulub crater from the asteroid that killed the dinosaurs is 150 km wide.",
    "Dinosaurs existed for 165 million years — humans have only existed for 300,000 years.",
    "The smallest known dinosaur, Microraptor, was the size of a pigeon.",
    "Ankylosaurus had armour so hard that its tail club could shatter bone.",
    "Diplodocus could crack its tail like a whip, producing a sonic boom.",
    "T-Rex could not stick out its tongue — it was attached to the floor of its mouth, like a crocodile's."
  ],

  // ─── GLOSSARY ──────────────────────────────────────────────────────────
  glossary: [
    { term: "Paleontology", def: "The scientific study of prehistoric life through fossils and geological records." },
    { term: "Theropod", def: "Bipedal saurischian dinosaurs, mostly carnivores, ancestors of modern birds." },
    { term: "Sauropod", def: "Long-necked, quadrupedal herbivores — the largest animals to walk the Earth." },
    { term: "Mya", def: "Million Years Ago — the unit of geological time used in paleontology." },
    { term: "Holotype", def: "The specific fossil specimen that defines and names a new species." },
    { term: "Stratigraphy", def: "The study of rock layers to determine the relative age of fossils." },
    { term: "Clade", def: "A group of organisms evolved from a common ancestor, used in classification." },
    { term: "K-Pg Boundary", def: "The geological boundary marking the mass extinction 66 million years ago." },
    { term: "Mesozoic Era", def: "The 'Age of Reptiles' spanning Triassic, Jurassic, and Cretaceous periods." },
    { term: "Endothermy", def: "The ability to regulate internal body temperature — evidence suggests many dinosaurs were warm-blooded." },
    { term: "Bipedal", def: "Walking on two legs — characteristic of theropods and early dinosaurs." },
    { term: "Quadrupedal", def: "Walking on four legs — characteristic of sauropods, ceratopsians, and ankylosaurs." }
  ],

  // ─── FOSSIL LOCATIONS FOR MAP ─────────────────────────────────────────
  fossilSites: [
    { id: "hell-creek", name: "Hell Creek Formation", country: "USA (Montana)", cx: 145, cy: 140, period: "cretaceous", species: ["tyrannosaurus-rex", "triceratops", "ankylosaurus"] },
    { id: "morrison", name: "Morrison Formation", country: "USA (Colorado/Wyoming)", cx: 135, cy: 155, period: "jurassic", species: ["brachiosaurus", "stegosaurus", "allosaurus"] },
    { id: "gobi", name: "Gobi Desert", country: "Mongolia/China", cx: 760, cy: 130, period: "cretaceous", species: ["velociraptor", "protoceratops", "oviraptor"] },
    { id: "patagonia", name: "Patagonia", country: "Argentina", cx: 210, cy: 440, period: "cretaceous", species: ["giganotosaurus", "argentinosaurus"] },
    { id: "tendaguru", name: "Tendaguru Beds", country: "Tanzania", cx: 530, cy: 340, period: "jurassic", species: ["brachiosaurus"] },
    { id: "sahara", name: "Sahara Region", country: "North Africa", cx: 500, cy: 210, period: "cretaceous", species: ["spinosaurus"] },
    { id: "solnhofen", name: "Solnhofen Limestone", country: "Germany", cx: 490, cy: 90, period: "jurassic", species: ["archaeopteryx"] },
    { id: "liaoning", name: "Yixian Formation", country: "China (Liaoning)", cx: 840, cy: 110, period: "cretaceous", species: ["microraptor", "psittacosaurus"] },
    { id: "australia-qld", name: "Winton Formation", country: "Australia (Queensland)", cx: 920, cy: 390, period: "cretaceous", species: [] },
    { id: "india-dec", name: "Lameta Formation", country: "India", cx: 700, cy: 220, period: "cretaceous", species: [] }
  ],

  // ─── DINOSAUR DATABASE ────────────────────────────────────────────────
  dinosaurs: [
    {
      id: "tyrannosaurus-rex",
      name: { scientific: "Tyrannosaurus rex", common: "T-Rex" },
      pronunciation: "tie-RAN-oh-SOR-us RECKS",
      meaningOfName: "Tyrant Lizard King",
      period: "cretaceous",
      subPeriod: "Late Cretaceous",
      mya: { start: 68, end: 66 },
      diet: "carnivore",
      classification: "theropod",
      subclassification: "Tyrannosauridae",
      measurements: {
        length: { value: 12, unit: "m", notes: "Up to 12.3m" },
        height: { value: 4, unit: "m", notes: "Hip height ~3.7m" },
        weight: { value: 8000, unit: "kg", notes: "6,000–9,000 kg" },
        speed: { value: 25, unit: "km/h", notes: "Estimated 17–25 km/h" }
      },
      behavior: "Apex predator. Likely both active hunter and opportunistic scavenger. Lived in forested river environments. May have had feathers on parts of its body. Highly developed olfactory senses.",
      habitat: "Forests, river valleys, and coastal lowlands of Late Cretaceous North America",
      locomotion: "bipedal",
      socialBehavior: "Likely solitary or in small family groups",
      discovery: {
        discoveredBy: "Barnum Brown",
        year: 1902,
        location: "Hell Creek Formation, Montana, USA"
      },
      fossilLocations: ["hell-creek"],
      predators: [],
      prey: ["triceratops"],
      funFacts: [
        "T-Rex had the most powerful bite of any land animal ever — estimated at 57,000 Newtons.",
        "Its arms, though tiny, could lift up to 200 kg each.",
        "A T-Rex's tooth could be up to 30cm long, including the root.",
        "New research suggests T-Rex may have had lips covering its teeth.",
        "The famous 'Sue' specimen at the Field Museum in Chicago is one of the most complete T-Rex skeletons ever found."
      ],
      notableSpecimens: [
        { name: "Sue", completeness: "90%", location: "Field Museum, Chicago", year: 1990 },
        { name: "Stan", completeness: "70%", location: "Black Hills Institute / Saudi Arabia", year: 1987 },
        { name: "Scotty", completeness: "65%", location: "Royal Saskatchewan Museum", year: 1991 }
      ],
      featured: true,
      emoji: "🦖",
      color: "#8b2020"
    },
    {
      id: "triceratops",
      name: { scientific: "Triceratops horridus", common: "Triceratops" },
      pronunciation: "try-SEHR-ah-tops",
      meaningOfName: "Three-Horned Face",
      period: "cretaceous",
      subPeriod: "Late Cretaceous",
      mya: { start: 68, end: 66 },
      diet: "herbivore",
      classification: "ceratopsian",
      subclassification: "Ceratopsidae",
      measurements: {
        length: { value: 9, unit: "m", notes: "8–9m" },
        height: { value: 3, unit: "m", notes: "At shoulder ~2.9m" },
        weight: { value: 8000, unit: "kg", notes: "6,000–12,000 kg" },
        speed: { value: 24, unit: "km/h", notes: "Estimated charge speed" }
      },
      behavior: "Herd animal. Used horns and frill for combat, display, and thermoregulation. Grazed on low-lying plants using its powerful parrot-like beak.",
      habitat: "Open woodlands and plains of Late Cretaceous North America",
      locomotion: "quadrupedal",
      socialBehavior: "Likely herding behavior based on multiple fossil finds",
      discovery: {
        discoveredBy: "John Bell Hatcher (described by O.C. Marsh)",
        year: 1889,
        location: "Lance Formation, Wyoming, USA"
      },
      fossilLocations: ["hell-creek"],
      predators: ["tyrannosaurus-rex"],
      prey: [],
      funFacts: [
        "Triceratops is one of the most common dinosaurs found in Hell Creek Formation.",
        "Its frill may have changed colour for communication and mate selection.",
        "Evidence of healed T-Rex bite marks have been found on Triceratops bones — they could survive attacks.",
        "Triceratops horns could reach over 1 metre in length.",
        "It is the state fossil of Wyoming and South Dakota."
      ],
      notableSpecimens: [
        { name: "Nell", completeness: "55%", location: "Smithsonian NMNH", year: 1905 }
      ],
      featured: true,
      emoji: "🦏",
      color: "#7a6830"
    },
    {
      id: "brachiosaurus",
      name: { scientific: "Brachiosaurus altithorax", common: "Brachiosaurus" },
      pronunciation: "BRAK-ee-oh-SOR-us",
      meaningOfName: "Arm Lizard",
      period: "jurassic",
      subPeriod: "Late Jurassic",
      mya: { start: 154, end: 153 },
      diet: "herbivore",
      classification: "sauropod",
      subclassification: "Brachiosauridae",
      measurements: {
        length: { value: 26, unit: "m", notes: "22–26m" },
        height: { value: 13, unit: "m", notes: "Up to 13m with neck raised" },
        weight: { value: 56000, unit: "kg", notes: "30,000–60,000 kg" },
        speed: { value: 10, unit: "km/h", notes: "Estimated slow walk" }
      },
      behavior: "Gentle giant. Browsed on treetop vegetation using its extraordinarily long neck. Required enormous quantities of food daily. May have lived in herds for protection.",
      habitat: "Semi-arid floodplains and forests of Late Jurassic North America and Africa",
      locomotion: "quadrupedal",
      socialBehavior: "Likely herding behavior",
      discovery: {
        discoveredBy: "Elmer Riggs",
        year: 1900,
        location: "Morrison Formation, Colorado, USA"
      },
      fossilLocations: ["morrison", "tendaguru"],
      predators: ["allosaurus"],
      prey: [],
      funFacts: [
        "Brachiosaurus's front legs were longer than its hind legs, giving it a giraffe-like posture.",
        "It needed to consume roughly 200–400 kg of vegetation per day.",
        "Its heart would have weighed approximately 400 kg to pump blood to its brain.",
        "Nostrils were positioned on top of the skull, likely for resonance rather than water breathing.",
        "The famous skeleton at the Berlin Museum of Natural History is one of the tallest mounted dinosaur skeletons in the world."
      ],
      notableSpecimens: [
        { name: "HMN SII", completeness: "45%", location: "Berlin Museum of Natural History", year: 1909 }
      ],
      featured: true,
      emoji: "🦕",
      color: "#3a6b40"
    },
    {
      id: "velociraptor",
      name: { scientific: "Velociraptor mongoliensis", common: "Velociraptor" },
      pronunciation: "vel-OSS-ih-RAP-tor",
      meaningOfName: "Swift Thief",
      period: "cretaceous",
      subPeriod: "Late Cretaceous",
      mya: { start: 75, end: 71 },
      diet: "carnivore",
      classification: "theropod",
      subclassification: "Dromaeosauridae",
      measurements: {
        length: { value: 2, unit: "m", notes: "1.8–2m" },
        height: { value: 0.5, unit: "m", notes: "~50cm at hip" },
        weight: { value: 15, unit: "kg", notes: "10–15 kg" },
        speed: { value: 40, unit: "km/h", notes: "Estimated 40–60 km/h" }
      },
      behavior: "Pack hunter. Used its sickle-shaped claw on the second toe to pin and slash prey. Was likely feathered. Highly intelligent for a dinosaur with a large brain relative to body size.",
      habitat: "Arid desert environments of Late Cretaceous Mongolia",
      locomotion: "bipedal",
      socialBehavior: "Pack hunting behavior strongly suggested by fossil evidence",
      discovery: {
        discoveredBy: "Peter Kaisen",
        year: 1923,
        location: "Djadochta Formation, Mongolia"
      },
      fossilLocations: ["gobi"],
      predators: [],
      prey: ["protoceratops"],
      funFacts: [
        "Movie Velociraptors are actually based on Deinonychus — real Velociraptors were turkey-sized.",
        "Velociraptor had quill knobs on its forearms, proving it had feathers.",
        "The famous 'Fighting Dinosaurs' fossil shows a Velociraptor locked in combat with a Protoceratops.",
        "Its sickle claw was held off the ground while running to keep it sharp.",
        "Velociraptor's intelligence is estimated to rival modern birds and reptiles."
      ],
      notableSpecimens: [
        { name: "Fighting Dinosaurs", completeness: "80%", location: "Mongolian Academy of Sciences", year: 1971 }
      ],
      featured: true,
      emoji: "⚡",
      color: "#6b5a20"
    },
    {
      id: "spinosaurus",
      name: { scientific: "Spinosaurus aegyptiacus", common: "Spinosaurus" },
      pronunciation: "SPY-no-SOR-us",
      meaningOfName: "Spine Lizard",
      period: "cretaceous",
      subPeriod: "Late Cretaceous",
      mya: { start: 99, end: 93.5 },
      diet: "piscivore",
      classification: "spinosaur",
      subclassification: "Spinosauridae",
      measurements: {
        length: { value: 14, unit: "m", notes: "14–18m — possibly the largest carnivorous dinosaur" },
        height: { value: 5.5, unit: "m", notes: "~5.5m at sail" },
        weight: { value: 7400, unit: "kg", notes: "7,000–23,000 kg (estimates vary widely)" },
        speed: { value: 15, unit: "km/h", notes: "Slow on land, faster in water" }
      },
      behavior: "Semi-aquatic apex predator. Primarily hunted large fish using its crocodile-like snout. Could swim using its paddling hind limbs. The sail on its back may have regulated temperature or been used for display.",
      habitat: "River systems and coastal swamps of Cretaceous North Africa",
      locomotion: "quadrupedal (semi-aquatic)",
      socialBehavior: "Likely solitary",
      discovery: {
        discoveredBy: "Ernst Stromer von Reichenbach",
        year: 1912,
        location: "Bahariya Formation, Egypt"
      },
      fossilLocations: ["sahara"],
      predators: [],
      prey: [],
      funFacts: [
        "The original Spinosaurus fossils were destroyed in WWII Allied bombing of Munich in 1944.",
        "New discoveries in 2014 revealed Spinosaurus was semi-aquatic — the first known swimming dinosaur.",
        "Its spine neural extensions could reach 1.65 metres in height.",
        "It may have outweighed T-Rex by several tonnes.",
        "Spinosaurus had nostrils positioned mid-snout, allowing it to breathe while partially submerged."
      ],
      notableSpecimens: [
        { name: "FSAC-KK 11888", completeness: "40%", location: "University of Casablanca", year: 2008 }
      ],
      featured: true,
      emoji: "🌊",
      color: "#1a4a6b"
    },
    {
      id: "stegosaurus",
      name: { scientific: "Stegosaurus stenops", common: "Stegosaurus" },
      pronunciation: "STEG-oh-SOR-us",
      meaningOfName: "Roof Lizard",
      period: "jurassic",
      subPeriod: "Late Jurassic",
      mya: { start: 155, end: 150 },
      diet: "herbivore",
      classification: "stegosaur",
      subclassification: "Stegosauridae",
      measurements: {
        length: { value: 9, unit: "m", notes: "6–9m" },
        height: { value: 4, unit: "m", notes: "Including plates" },
        weight: { value: 5000, unit: "kg", notes: "3,500–5,000 kg" },
        speed: { value: 7, unit: "km/h", notes: "Relatively slow" }
      },
      behavior: "Slow-moving herbivore. Used its thagomizer (tail spikes) for defense against predators. The distinctive back plates may have been used for thermoregulation or display.",
      habitat: "Forests and plains of Late Jurassic North America",
      locomotion: "quadrupedal",
      socialBehavior: "Possibly solitary or small groups",
      discovery: {
        discoveredBy: "Othniel Charles Marsh",
        year: 1877,
        location: "Morrison Formation, Colorado, USA"
      },
      fossilLocations: ["morrison"],
      predators: ["allosaurus"],
      prey: [],
      funFacts: [
        "Stegosaurus had a brain the size of a walnut — one of the smallest brain-to-body ratios of any dinosaur.",
        "Its tail spikes (thagomizer) could reach 60–90cm in length.",
        "The back plates were filled with blood vessels — possibly used to regulate body temperature.",
        "Stegosaurus lived over 80 million years before T-Rex — they never co-existed.",
        "An Allosaurus hip bone with a Stegosaurus tail spike wound has been found, confirming they fought."
      ],
      notableSpecimens: [
        { name: "Sophie", completeness: "85%", location: "Natural History Museum, London", year: 2003 }
      ],
      featured: false,
      emoji: "🔱",
      color: "#5a7a2a"
    },
    {
      id: "ankylosaurus",
      name: { scientific: "Ankylosaurus magniventris", common: "Ankylosaurus" },
      pronunciation: "AN-ky-lo-SOR-us",
      meaningOfName: "Fused Lizard",
      period: "cretaceous",
      subPeriod: "Late Cretaceous",
      mya: { start: 68, end: 66 },
      diet: "herbivore",
      classification: "ankylosaur",
      subclassification: "Ankylosauridae",
      measurements: {
        length: { value: 10, unit: "m", notes: "6–10m" },
        height: { value: 1.8, unit: "m", notes: "Low-slung body" },
        weight: { value: 6000, unit: "kg", notes: "4,500–8,000 kg" },
        speed: { value: 10, unit: "km/h", notes: "Slow but armoured" }
      },
      behavior: "Living tank. Covered head to tail in bony osteoderms and armour. Used its club tail to shatter the bones of predators. Low browser feeding on ground-level vegetation.",
      habitat: "Forests and floodplains of Late Cretaceous North America",
      locomotion: "quadrupedal",
      socialBehavior: "Likely solitary",
      discovery: {
        discoveredBy: "Barnum Brown",
        year: 1906,
        location: "Hell Creek Formation, Montana, USA"
      },
      fossilLocations: ["hell-creek"],
      predators: ["tyrannosaurus-rex"],
      prey: [],
      funFacts: [
        "Ankylosaurus tail club could swing with enough force to break the leg bones of a T-Rex.",
        "Even its eyelids were armoured with bony plates.",
        "Its nasal passages were elaborately coiled — possibly for cooling the brain.",
        "No complete skull has ever been found — our knowledge is based on partial specimens.",
        "The armour was so heavy that Ankylosaurus likely could not run fast at all."
      ],
      notableSpecimens: [],
      featured: false,
      emoji: "🛡️",
      color: "#5a4a2a"
    },
    {
      id: "diplodocus",
      name: { scientific: "Diplodocus carnegii", common: "Diplodocus" },
      pronunciation: "dip-LOD-oh-kus",
      meaningOfName: "Double Beam",
      period: "jurassic",
      subPeriod: "Late Jurassic",
      mya: { start: 154, end: 152 },
      diet: "herbivore",
      classification: "sauropod",
      subclassification: "Diplodocidae",
      measurements: {
        length: { value: 27, unit: "m", notes: "24–27m" },
        height: { value: 4, unit: "m", notes: "At shoulder" },
        weight: { value: 14000, unit: "kg", notes: "10,000–16,000 kg" },
        speed: { value: 12, unit: "km/h", notes: "Estimated" }
      },
      behavior: "One of the longest dinosaurs. Used its extremely long tail, possibly as a whip producing supersonic sounds. Fed by raking vegetation with its peg-like teeth. Likely lived in herds.",
      habitat: "Floodplains and riverbanks of Late Jurassic North America",
      locomotion: "quadrupedal",
      socialBehavior: "Herding behavior suggested by bonebeds",
      discovery: {
        discoveredBy: "Samuel Williston",
        year: 1877,
        location: "Morrison Formation, Wyoming, USA"
      },
      fossilLocations: ["morrison"],
      predators: ["allosaurus"],
      prey: [],
      funFacts: [
        "Diplodocus could crack its tail like a whip to produce a supersonic boom for communication or defense.",
        "Andrew Carnegie funded copies of Diplodocus skeletons that were gifted to museums worldwide.",
        "Its teeth were shaped like pencils — only for stripping leaves, not chewing.",
        "Diplodocus swallowed stones (gastroliths) to help grind food in its stomach.",
        "It may have held its neck horizontally rather than upright, like a giant feeding crane."
      ],
      notableSpecimens: [
        { name: "CM 84", completeness: "80%", location: "Carnegie Museum of Natural History", year: 1899 }
      ],
      featured: false,
      emoji: "📏",
      color: "#4a6b3a"
    },
    {
      id: "allosaurus",
      name: { scientific: "Allosaurus fragilis", common: "Allosaurus" },
      pronunciation: "AL-oh-SOR-us",
      meaningOfName: "Different Lizard",
      period: "jurassic",
      subPeriod: "Late Jurassic",
      mya: { start: 155, end: 145 },
      diet: "carnivore",
      classification: "theropod",
      subclassification: "Allosauridae",
      measurements: {
        length: { value: 12, unit: "m", notes: "8–12m" },
        height: { value: 3.5, unit: "m", notes: "At hip" },
        weight: { value: 2300, unit: "kg", notes: "1,500–2,800 kg" },
        speed: { value: 30, unit: "km/h", notes: "Estimated" }
      },
      behavior: "Apex predator of the Jurassic. May have hunted large sauropods in coordinated group attacks. Attacked with its upper jaw like a hatchet rather than biting down hard.",
      habitat: "Morrison Formation semi-arid plains and forests",
      locomotion: "bipedal",
      socialBehavior: "Possible pack hunting",
      discovery: {
        discoveredBy: "Othniel Charles Marsh",
        year: 1877,
        location: "Morrison Formation, Colorado, USA"
      },
      fossilLocations: ["morrison"],
      predators: [],
      prey: ["stegosaurus", "diplodocus", "brachiosaurus"],
      funFacts: [
        "Allosaurus was the apex predator of the Jurassic — the T-Rex of its time.",
        "Its skull had fenestrae (holes) to reduce weight while maintaining strength.",
        "Over 60 individual Allosaurus specimens have been found at the Cleveland-Lloyd Quarry in Utah.",
        "It may have attacked Stegosaurus from behind to avoid the deadly tail spikes.",
        "Evidence of pack hunting includes juveniles and adults found together with shared prey."
      ],
      notableSpecimens: [
        { name: "Big Al", completeness: "95%", location: "Museum of the Rockies", year: 1991 }
      ],
      featured: false,
      emoji: "🗡️",
      color: "#7a3a20"
    },
    {
      id: "giganotosaurus",
      name: { scientific: "Giganotosaurus carolinii", common: "Giganotosaurus" },
      pronunciation: "jy-ga-NO-to-SOR-us",
      meaningOfName: "Giant Southern Lizard",
      period: "cretaceous",
      subPeriod: "Late Cretaceous",
      mya: { start: 99.6, end: 95 },
      diet: "carnivore",
      classification: "theropod",
      subclassification: "Carcharodontosauridae",
      measurements: {
        length: { value: 13, unit: "m", notes: "12–13m, possibly larger" },
        height: { value: 4, unit: "m", notes: "Estimated" },
        weight: { value: 8000, unit: "kg", notes: "6,200–13,800 kg" },
        speed: { value: 20, unit: "km/h", notes: "Estimated" }
      },
      behavior: "Apex predator of South America. Likely hunted titanosaur sauropods. May have lived in loose groups. Brain was actually smaller than T-Rex's relative to body size.",
      habitat: "Forests and floodplains of Cretaceous South America",
      locomotion: "bipedal",
      socialBehavior: "Possible group hunting behavior",
      discovery: {
        discoveredBy: "Rubén Carolini",
        year: 1993,
        location: "Candeleros Formation, Patagonia, Argentina"
      },
      fossilLocations: ["patagonia"],
      predators: [],
      prey: ["argentinosaurus"],
      funFacts: [
        "Giganotosaurus may have been slightly longer than T-Rex, though T-Rex was likely heavier.",
        "It lived 30 million years before T-Rex on a different continent.",
        "Its teeth were blade-like for slicing rather than T-Rex's bone-crushing teeth.",
        "The type specimen was found by an amateur fossil hunter, Rubén Carolini.",
        "It was the largest known carnivore when discovered in 1995, briefly surpassing T-Rex."
      ],
      notableSpecimens: [
        { name: "MUCPv-Ch1", completeness: "70%", location: "Municipal Carmen Funes Museum, Argentina", year: 1993 }
      ],
      featured: false,
      emoji: "🔥",
      color: "#8b4020"
    },
    {
      id: "iguanodon",
      name: { scientific: "Iguanodon bernissartensis", common: "Iguanodon" },
      pronunciation: "ig-WAN-oh-don",
      meaningOfName: "Iguana Tooth",
      period: "cretaceous",
      subPeriod: "Early Cretaceous",
      mya: { start: 126, end: 122 },
      diet: "herbivore",
      classification: "ornithopod",
      subclassification: "Iguanodontidae",
      measurements: {
        length: { value: 10, unit: "m", notes: "9–10m" },
        height: { value: 3, unit: "m", notes: "Bipedal height" },
        weight: { value: 3000, unit: "kg", notes: "2,500–3,500 kg" },
        speed: { value: 20, unit: "km/h", notes: "Could run bipedally" }
      },
      behavior: "One of the first well-studied dinosaurs. Could walk on two or four legs. Thumbspike used for defense. Sophisticated teeth for grinding tough plant matter. Likely herded.",
      habitat: "Forests and floodplains of Early Cretaceous Europe and North America",
      locomotion: "bipedal and quadrupedal",
      socialBehavior: "Herding behavior — 38 individuals found together in Bernissart, Belgium",
      discovery: {
        discoveredBy: "Gideon Mantell",
        year: 1822,
        location: "Sussex, England"
      },
      fossilLocations: [],
      predators: [],
      prey: [],
      funFacts: [
        "Iguanodon was one of the three original dinosaurs that inspired Richard Owen to coin the term 'Dinosauria'.",
        "When first reconstructed, the thumb spike was incorrectly placed on the nose like a horn.",
        "38 complete Iguanodon skeletons were found in a Belgian coal mine at Bernissart.",
        "It had a sophisticated jaw mechanism that allowed lateral grinding — unusual for dinosaurs.",
        "Iguanodon was the second dinosaur ever formally named (1825)."
      ],
      notableSpecimens: [
        { name: "Bernissart specimens", completeness: "90%", location: "Royal Belgian Institute of Natural Sciences", year: 1878 }
      ],
      featured: false,
      emoji: "🌾",
      color: "#4a6b2a"
    },
    {
      id: "microraptor",
      name: { scientific: "Microraptor gui", common: "Microraptor" },
      pronunciation: "MY-kro-RAP-tor",
      meaningOfName: "Small Thief",
      period: "cretaceous",
      subPeriod: "Early Cretaceous",
      mya: { start: 125, end: 120 },
      diet: "carnivore",
      classification: "theropod",
      subclassification: "Dromaeosauridae",
      measurements: {
        length: { value: 0.9, unit: "m", notes: "~77cm–90cm" },
        height: { value: 0.3, unit: "m", notes: "Pigeon-sized" },
        weight: { value: 1, unit: "kg", notes: "~0.5–1 kg" },
        speed: { value: 30, unit: "km/h", notes: "Gliding speed" }
      },
      behavior: "Four-winged gliding dinosaur. Used all four limbs with flight feathers to glide between trees. Ate small vertebrates, fish, and insects. Provides critical evidence for the dinosaur-bird transition.",
      habitat: "Forested environments of Early Cretaceous China",
      locomotion: "gliding",
      socialBehavior: "Likely solitary",
      discovery: {
        discoveredBy: "Xu Xing et al.",
        year: 2003,
        location: "Yixian Formation, Liaoning, China"
      },
      fossilLocations: ["liaoning"],
      predators: [],
      prey: [],
      funFacts: [
        "Microraptor had four wings — feathers on both arms and legs.",
        "Some specimens preserved iridescent feathers suggesting a crow-like black sheen.",
        "It represents a crucial link between non-avian dinosaurs and birds.",
        "Stomach contents have revealed it ate fish, birds, and small mammals.",
        "Despite its size, it was a dromaeosaur closely related to Velociraptor."
      ],
      notableSpecimens: [],
      featured: false,
      emoji: "🐦",
      color: "#2a3a6b"
    },
    {
      id: "argentinosaurus",
      name: { scientific: "Argentinosaurus huinculensis", common: "Argentinosaurus" },
      pronunciation: "ar-jen-TEE-no-SOR-us",
      meaningOfName: "Argentina Lizard",
      period: "cretaceous",
      subPeriod: "Late Cretaceous",
      mya: { start: 96, end: 92 },
      diet: "herbivore",
      classification: "sauropod",
      subclassification: "Titanosauria",
      measurements: {
        length: { value: 35, unit: "m", notes: "30–40m estimated" },
        height: { value: 10, unit: "m", notes: "Estimated" },
        weight: { value: 80000, unit: "kg", notes: "60,000–90,000 kg — possibly the largest animal to ever walk Earth" },
        speed: { value: 7, unit: "km/h", notes: "Estimated slow walk" }
      },
      behavior: "The possible largest animal to ever walk the Earth. A titanosaur sauropod that needed enormous amounts of vegetation. Its eggs would have been the size of rugby balls.",
      habitat: "Forests and plains of Cretaceous South America",
      locomotion: "quadrupedal",
      socialBehavior: "Herding — nesting sites with hundreds of eggs discovered",
      discovery: {
        discoveredBy: "Guillermo Heredia (farmer), described by Coria & Salgado",
        year: 1987,
        location: "Huincul Formation, Patagonia, Argentina"
      },
      fossilLocations: ["patagonia"],
      predators: ["giganotosaurus"],
      prey: [],
      funFacts: [
        "Argentinosaurus may be the largest animal to ever walk the Earth — heavier than 12 African elephants.",
        "A single vertebra can be over 1.5 metres tall.",
        "It took approximately 40 years to reach full size.",
        "Only fragmentary remains are known — its true size is estimated from what we have.",
        "A complete Argentinosaurus skeleton would require a museum hall of its own."
      ],
      notableSpecimens: [],
      featured: false,
      emoji: "🏔️",
      color: "#5a4a3a"
    },
    {
      id: "parasaurolophus",
      name: { scientific: "Parasaurolophus walkeri", common: "Parasaurolophus" },
      pronunciation: "par-ah-SOR-oh-LO-fus",
      meaningOfName: "Near Crested Lizard",
      period: "cretaceous",
      subPeriod: "Late Cretaceous",
      mya: { start: 76, end: 73 },
      diet: "herbivore",
      classification: "ornithopod",
      subclassification: "Hadrosauridae",
      measurements: {
        length: { value: 10, unit: "m", notes: "9–10m" },
        height: { value: 3, unit: "m", notes: "Bipedal" },
        weight: { value: 2700, unit: "kg", notes: "~2,500–3,000 kg" },
        speed: { value: 25, unit: "km/h", notes: "Estimated bipedal sprint" }
      },
      behavior: "The most recognizable hadrosaur. Its hollow tube crest could produce resonating sounds for communication over long distances — like a living trombone. Moved in enormous herds.",
      habitat: "Floodplains and forests of Late Cretaceous North America",
      locomotion: "bipedal and quadrupedal",
      socialBehavior: "Large herds — some bonebeds contain thousands of individuals",
      discovery: {
        discoveredBy: "William Parks",
        year: 1922,
        location: "Dinosaur Park Formation, Alberta, Canada"
      },
      fossilLocations: [],
      predators: ["tyrannosaurus-rex"],
      prey: [],
      funFacts: [
        "Parasaurolophus could produce low-frequency sounds audible for kilometres using its hollow crest.",
        "The crest was 1.8 metres long and acted like a natural horn instrument.",
        "It is sometimes called the 'duck-billed dinosaur' for its broad, flat snout.",
        "Hadrosaurs like Parasaurolophus were among the most successful dinosaurs ever.",
        "Mummified specimens have been found with skin impressions showing a pebbly texture."
      ],
      notableSpecimens: [],
      featured: false,
      emoji: "🎺",
      color: "#6b4a2a"
    },
    {
      id: "carnotaurus",
      name: { scientific: "Carnotaurus sastrei", common: "Carnotaurus" },
      pronunciation: "kar-no-TOR-us",
      meaningOfName: "Flesh-Eating Bull",
      period: "cretaceous",
      subPeriod: "Late Cretaceous",
      mya: { start: 72, end: 69 },
      diet: "carnivore",
      classification: "theropod",
      subclassification: "Abelisauridae",
      measurements: {
        length: { value: 8, unit: "m", notes: "7.5–8m" },
        height: { value: 2.5, unit: "m", notes: "At hip" },
        weight: { value: 1500, unit: "kg", notes: "~1,350–2,100 kg" },
        speed: { value: 48, unit: "km/h", notes: "One of the fastest large theropods" }
      },
      behavior: "Unique bull-horned predator. Had extremely reduced arms — even smaller than T-Rex's. May have been the fastest large predator of its time. Skin impressions show a distinctive pebbly texture.",
      habitat: "Arid regions of Late Cretaceous South America",
      locomotion: "bipedal",
      socialBehavior: "Unknown — possibly intraspecific combat with horns",
      discovery: {
        discoveredBy: "José Bonaparte",
        year: 1984,
        location: "La Colonia Formation, Patagonia, Argentina"
      },
      fossilLocations: ["patagonia"],
      predators: [],
      prey: [],
      funFacts: [
        "Carnotaurus had actual horns above its eyes — the only large theropod known to have them.",
        "Its skin was preserved, showing large bony bumps (osteoderms) over its body.",
        "Despite its tiny arms, it may have been one of the fastest large predators.",
        "Its skull was short and deep, giving it an extremely powerful bite for its size.",
        "It is the antagonist dinosaur in Disney's animated film 'Dinosaur' (2000)."
      ],
      notableSpecimens: [
        { name: "MACN-CH 894", completeness: "72%", location: "Argentinian Museum of Natural Science", year: 1984 }
      ],
      featured: false,
      emoji: "🐂",
      color: "#7a2a3a"
    },
    {
      id: "protoceratops",
      name: { scientific: "Protoceratops andrewsi", common: "Protoceratops" },
      pronunciation: "pro-toe-SEHR-ah-tops",
      meaningOfName: "First Horned Face",
      period: "cretaceous",
      subPeriod: "Late Cretaceous",
      mya: { start: 75, end: 71 },
      diet: "herbivore",
      classification: "ceratopsian",
      subclassification: "Protoceratopsidae",
      measurements: {
        length: { value: 1.8, unit: "m", notes: "~1.5–1.8m" },
        height: { value: 0.6, unit: "m", notes: "Small, sheep-sized" },
        weight: { value: 180, unit: "kg", notes: "~180 kg" },
        speed: { value: 20, unit: "km/h", notes: "Estimated" }
      },
      behavior: "Small ancestral ceratopsian. Lived in large groups in the Gobi desert. Famous for the 'Fighting Dinosaurs' fossil showing it in combat with Velociraptor. Nesting in communal areas.",
      habitat: "Desert environments of Late Cretaceous Mongolia",
      locomotion: "quadrupedal",
      socialBehavior: "Herding and communal nesting",
      discovery: {
        discoveredBy: "Walter Granger & William K. Gregory",
        year: 1923,
        location: "Djadochta Formation, Mongolia"
      },
      fossilLocations: ["gobi"],
      predators: ["velociraptor", "oviraptor"],
      prey: [],
      funFacts: [
        "Protoceratops eggs were originally misidentified as the first dinosaur eggs ever found.",
        "Its fossils may have inspired the legend of the griffin in ancient Scythian cultures.",
        "The 'Fighting Dinosaurs' fossil is one of the most remarkable dinosaur fossils ever found.",
        "They nested in groups, laying clutches of 12–15 elongated eggs.",
        "Its frill grew as it aged and was likely used for display and species recognition."
      ],
      notableSpecimens: [
        { name: "Fighting Dinosaurs", completeness: "80%", location: "Mongolian Institute of Palaeontology", year: 1971 }
      ],
      featured: false,
      emoji: "🐏",
      color: "#7a6b40"
    },
    {
      id: "oviraptor",
      name: { scientific: "Oviraptor philoceratops", common: "Oviraptor" },
      pronunciation: "oh-vih-RAP-tor",
      meaningOfName: "Egg Thief",
      period: "cretaceous",
      subPeriod: "Late Cretaceous",
      mya: { start: 75, end: 71 },
      diet: "omnivore",
      classification: "theropod",
      subclassification: "Oviraptoridae",
      measurements: {
        length: { value: 1.6, unit: "m", notes: "~1.5–2m" },
        height: { value: 0.9, unit: "m", notes: "Bipedal" },
        weight: { value: 35, unit: "kg", notes: "~25–40 kg" },
        speed: { value: 40, unit: "km/h", notes: "Fast, agile" }
      },
      behavior: "Unjustly named — was actually found brooding over its own nest when mistakenly thought to be stealing Protoceratops eggs. Had a toothless beak and a distinctive head crest. Covered in feathers.",
      habitat: "Desert environments of Late Cretaceous Mongolia",
      locomotion: "bipedal",
      socialBehavior: "Solitary with brooding parental behavior",
      discovery: {
        discoveredBy: "Henry Fairfield Osborn",
        year: 1924,
        location: "Djadochta Formation, Mongolia"
      },
      fossilLocations: ["gobi"],
      predators: ["velociraptor"],
      prey: [],
      funFacts: [
        "Oviraptor was wrongly named 'Egg Thief' — it was later found brooding its own eggs like a modern bird.",
        "It had a bizarre, parrot-like beak with no teeth.",
        "It sat on its eggs with its arms wrapped around the nest — exactly like modern birds.",
        "Its elaborate head crest was likely used for display, similar to a modern cassowary.",
        "Several specimens have been found in brooding positions directly over egg clutches."
      ],
      notableSpecimens: [],
      featured: false,
      emoji: "🥚",
      color: "#8b7a3a"
    },
    {
      id: "eoraptor",
      name: { scientific: "Eoraptor lunensis", common: "Eoraptor" },
      pronunciation: "EE-oh-RAP-tor",
      meaningOfName: "Dawn Thief",
      period: "triassic",
      subPeriod: "Late Triassic",
      mya: { start: 231, end: 228 },
      diet: "omnivore",
      classification: "theropod",
      subclassification: "Eodromaeidae",
      measurements: {
        length: { value: 1, unit: "m", notes: "~1m" },
        height: { value: 0.3, unit: "m", notes: "Small, fox-sized" },
        weight: { value: 5, unit: "kg", notes: "~5 kg" },
        speed: { value: 35, unit: "km/h", notes: "Fast for its size" }
      },
      behavior: "One of the earliest known dinosaurs. Small, agile omnivore that gives us a window into what the very first dinosaurs looked like. Had both leaf-shaped (herbivorous) and serrated (carnivorous) teeth.",
      habitat: "River floodplains of Late Triassic South America",
      locomotion: "bipedal",
      socialBehavior: "Unknown",
      discovery: {
        discoveredBy: "Ricardo Martínez",
        year: 1991,
        location: "Ischigualasto Formation, Argentina"
      },
      fossilLocations: [],
      predators: [],
      prey: [],
      funFacts: [
        "Eoraptor is one of the earliest known dinosaurs, living 231 million years ago.",
        "It shows us what the common ancestor of all dinosaurs may have looked like.",
        "Despite being named 'thief', it was likely an omnivore rather than pure carnivore.",
        "It lived alongside Herrerasaurus, a much larger early predator.",
        "Its fossil site, Ischigualasto (Valley of the Moon), is a UNESCO World Heritage Site."
      ],
      notableSpecimens: [
        { name: "PVSJ 512", completeness: "90%", location: "Museum of Natural Sciences, San Juan, Argentina", year: 1991 }
      ],
      featured: false,
      emoji: "🌅",
      color: "#c8743a"
    },
    {
      id: "archaeopteryx",
      name: { scientific: "Archaeopteryx lithographica", common: "Archaeopteryx" },
      pronunciation: "ar-kee-OP-ter-iks",
      meaningOfName: "Ancient Wing",
      period: "jurassic",
      subPeriod: "Late Jurassic",
      mya: { start: 150, end: 148 },
      diet: "carnivore",
      classification: "theropod",
      subclassification: "Avialae",
      measurements: {
        length: { value: 0.5, unit: "m", notes: "Roughly crow-sized" },
        height: { value: 0.2, unit: "m", notes: "Standing height estimate" },
        weight: { value: 1, unit: "kg", notes: "Estimates vary; around ~1 kg" },
        speed: { value: 25, unit: "km/h", notes: "Short flights/glides; uncertain" }
      },
      behavior: "Early bird-like dinosaur. Likely capable of short powered flights or gliding. Feathers provided insulation and aerodynamic surfaces.",
      habitat: "Subtropical island lagoons of Late Jurassic Europe",
      locomotion: "flying (short flights/gliding)",
      socialBehavior: "Unknown",
      discovery: {
        discoveredBy: "Hermann von Meyer (described)",
        year: 1861,
        location: "Solnhofen Limestone, Bavaria, Germany"
      },
      fossilLocations: ["solnhofen"],
      predators: [],
      prey: [],
      funFacts: [
        "Archaeopteryx is one of the most famous transitional fossils linking non-avian dinosaurs and birds.",
        "Its feathers were asymmetrical — a feature associated with flight in modern birds.",
        "It retained dinosaur traits like teeth and a long bony tail.",
        "Most specimens come from the Solnhofen Limestone, which preserves exquisite detail.",
        "Debate continues over how strong a flier it was — likely best at short bursts rather than long-distance soaring."
      ],
      notableSpecimens: [
        { name: "London specimen", completeness: "Partial skeleton", location: "Natural History Museum, London", year: 1861 }
      ],
      featured: false,
      emoji: "🪶",
      color: "#4a7c4e"
    },
    {
      id: "psittacosaurus",
      name: { scientific: "Psittacosaurus mongoliensis", common: "Psittacosaurus" },
      pronunciation: "SIT-ah-ko-SOR-us",
      meaningOfName: "Parrot Lizard",
      period: "cretaceous",
      subPeriod: "Early Cretaceous",
      mya: { start: 125, end: 105 },
      diet: "herbivore",
      classification: "ceratopsian",
      subclassification: "Psittacosauridae",
      measurements: {
        length: { value: 2, unit: "m", notes: "Typically 1–2m" },
        height: { value: 0.7, unit: "m", notes: "Estimate" },
        weight: { value: 20, unit: "kg", notes: "Estimates vary by species" },
        speed: { value: 20, unit: "km/h", notes: "Likely a quick runner; uncertain" }
      },
      behavior: "Small, beaked ceratopsian. Likely lived in groups; some fossils show adults with juveniles suggesting parental care. Some specimens show tail bristles.",
      habitat: "Forested river valleys and floodplains of Early Cretaceous Asia",
      locomotion: "bipedal",
      socialBehavior: "Likely social based on juvenile aggregations",
      discovery: {
        discoveredBy: "Henry Fairfield Osborn",
        year: 1923,
        location: "Mongolia / northern China"
      },
      fossilLocations: ["liaoning"],
      predators: [],
      prey: [],
      funFacts: [
        "Psittacosaurus is one of the most commonly found dinosaurs in Early Cretaceous Asia, with many specimens discovered.",
        "It had a powerful parrot-like beak for cropping tough vegetation.",
        "Some specimens preserve long bristle-like structures on the tail.",
        "A famous fossil preserves an adult surrounded by juveniles — possible evidence of parental care.",
        "It represents an early branch of ceratopsians, long before Triceratops evolved."
      ],
      notableSpecimens: [],
      featured: false,
      emoji: "🦜",
      color: "#5a3a8c"
    }
  ]
};

// ─── HELPERS + INDEXES (fast lookups for 100s+ entries) ──────────────────

// Size category used by filters: small (<5m), medium (5–15m), large (>15m)
DINOBASE.getSizeCategory = (dino) => {
  const lengthM = dino?.size?.lengthM ?? dino?.measurements?.length?.value;
  if (typeof lengthM !== "number") return null;
  if (lengthM < 5) return "small";
  if (lengthM <= 15) return "medium";
  return "large";
};

DINOBASE.formatWeight = (kg) => {
  if (typeof kg !== "number") return "—";
  if (kg >= 1000) return `${(kg / 1000).toFixed(1)} tonnes`;
  return `${kg} kg`;
};

DINOBASE.formatLength = (m) => {
  if (typeof m !== "number") return "—";
  return `${m} m`;
};

// Ensure each record includes required keys: facts + size
DINOBASE.normalizeDinosaurs = () => {
  for (const dino of DINOBASE.dinosaurs) {
    if (!dino || typeof dino !== "object") continue;

    // Canonical species facts field
    if (!Array.isArray(dino.facts) && Array.isArray(dino.funFacts)) dino.facts = dino.funFacts;
    if (!Array.isArray(dino.funFacts) && Array.isArray(dino.facts)) dino.funFacts = dino.facts;

    // Canonical size field (derived from measurements)
    const lengthM = dino?.measurements?.length?.value;
    const heightM = dino?.measurements?.height?.value;
    const weightKg = dino?.measurements?.weight?.value;

    if (!dino.size || typeof dino.size !== "object") dino.size = {};
    if (typeof dino.size.lengthM !== "number" && typeof lengthM === "number") dino.size.lengthM = lengthM;
    if (typeof dino.size.heightM !== "number" && typeof heightM === "number") dino.size.heightM = heightM;
    if (typeof dino.size.weightKg !== "number" && typeof weightKg === "number") dino.size.weightKg = weightKg;
    if (typeof dino.size.category !== "string") dino.size.category = DINOBASE.getSizeCategory(dino);
  }
};

// Indexes for fast lookups and filtering
DINOBASE.buildIndexes = () => {
  const byId = Object.create(null);
  const byPeriod = Object.create(null);
  const byDiet = Object.create(null);
  const byClassification = Object.create(null);
  const bySize = Object.create(null);

  const add = (index, key, value) => {
    if (!key) return;
    if (!index[key]) index[key] = [];
    index[key].push(value);
  };

  for (const dino of DINOBASE.dinosaurs) {
    if (!dino?.id) continue;
    byId[dino.id] = dino;
    add(byPeriod, dino.period, dino);
    add(byDiet, dino.diet, dino);
    add(byClassification, dino.classification, dino);
    add(bySize, dino.size?.category ?? DINOBASE.getSizeCategory(dino), dino);
  }

  DINOBASE.indexes = { byId, byPeriod, byDiet, byClassification, bySize };
  return DINOBASE.indexes;
};

DINOBASE.reindex = () => {
  DINOBASE.normalizeDinosaurs();
  return DINOBASE.buildIndexes();
};

// Query helpers (use indexes when present)
DINOBASE.getById = (id) => DINOBASE.indexes?.byId?.[id] ?? DINOBASE.dinosaurs.find(d => d.id === id);
DINOBASE.getFeatured = () => DINOBASE.dinosaurs.filter(d => d.featured);
DINOBASE.getByPeriod = (p) => (DINOBASE.indexes?.byPeriod?.[p] ?? DINOBASE.dinosaurs.filter(d => d.period === p)).slice();
DINOBASE.getByDiet = (diet) => (DINOBASE.indexes?.byDiet?.[diet] ?? DINOBASE.dinosaurs.filter(d => d.diet === diet)).slice();
DINOBASE.getByClassification = (c) => (DINOBASE.indexes?.byClassification?.[c] ?? DINOBASE.dinosaurs.filter(d => d.classification === c)).slice();
DINOBASE.getBySize = (sizeCategory) => (DINOBASE.indexes?.bySize?.[sizeCategory] ?? DINOBASE.dinosaurs.filter(d => DINOBASE.getSizeCategory(d) === sizeCategory)).slice();

// Build derived fields + indexes on load
DINOBASE.reindex();

// ═══════════════════════════════════════════════════════════
// HELPER FUNCTIONS (REQUIRED FOR app.js)
// ═══════════════════════════════════════════════════════════

DINOBASE.getFeatured = function () {
  return this.dinosaurs.filter(d => d.featured);
};

DINOBASE.getById = function (id) {
  return this.dinosaurs.find(d => d.id === id);
};

DINOBASE.getByPeriod = function (period) {
  return this.dinosaurs.filter(d => d.period === period);
};

DINOBASE.getSizeCategory = function (dino) {
  const length = dino?.measurements?.length?.value || 0;

  if (length < 5) return "small";
  if (length < 15) return "medium";
  return "large";
};

DINOBASE.formatLength = function (value) {
  if (!value) return "N/A";
  return value + " m";
};

DINOBASE.formatWeight = function (value) {
  if (!value) return "N/A";
  return value + " kg";
};

DINOBASE.reindex = function () {
  this.index = {};
  this.dinosaurs.forEach(d => {
    this.index[d.id] = d;
  });
};

// Final browser facade used by app.js. Kept at the end so it wins over any
// legacy helper definitions above while preserving the full dataset unchanged.
(() => {
  const getLength = (dino) => dino?.size?.lengthM ?? dino?.measurements?.length?.value;
  const getWeight = (dino) => dino?.size?.weightKg ?? dino?.measurements?.weight?.value;

  DINOBASE.getSizeCategory = (dino) => {
    const lengthM = getLength(dino);
    if (typeof lengthM !== "number") return null;
    if (lengthM < 5) return "small";
    if (lengthM <= 15) return "medium";
    return "large";
  };

  DINOBASE.formatLength = (meters) => {
    if (typeof meters !== "number") return "N/A";
    return `${meters.toLocaleString(undefined, { maximumFractionDigits: 1 })} m`;
  };

  DINOBASE.formatWeight = (kg) => {
    if (typeof kg !== "number") return "N/A";
    if (kg >= 1000) {
      return `${(kg / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })} tonnes`;
    }
    return `${kg.toLocaleString()} kg`;
  };

  DINOBASE.normalizeDinosaurs = () => {
    DINOBASE.dinosaurs.forEach((dino) => {
      if (!dino || typeof dino !== "object") return;
      if (!Array.isArray(dino.facts) && Array.isArray(dino.funFacts)) dino.facts = dino.funFacts;
      if (!Array.isArray(dino.funFacts) && Array.isArray(dino.facts)) dino.funFacts = dino.facts;

      dino.size = dino.size && typeof dino.size === "object" ? dino.size : {};
      const lengthM = dino?.measurements?.length?.value;
      const heightM = dino?.measurements?.height?.value;
      const weightKg = dino?.measurements?.weight?.value;
      if (typeof lengthM === "number") dino.size.lengthM = lengthM;
      if (typeof heightM === "number") dino.size.heightM = heightM;
      if (typeof weightKg === "number") dino.size.weightKg = weightKg;
      dino.size.category = DINOBASE.getSizeCategory(dino);
    });
  };

  DINOBASE.buildIndexes = () => {
    const indexes = {
      byId: Object.create(null),
      byPeriod: Object.create(null),
      byDiet: Object.create(null),
      byClassification: Object.create(null),
      bySize: Object.create(null)
    };

    const add = (bucket, key, dino) => {
      if (!key) return;
      indexes[bucket][key] ||= [];
      indexes[bucket][key].push(dino);
    };

    DINOBASE.dinosaurs.forEach((dino) => {
      if (!dino?.id) return;
      indexes.byId[dino.id] = dino;
      add("byPeriod", dino.period, dino);
      add("byDiet", dino.diet, dino);
      add("byClassification", dino.classification, dino);
      add("bySize", dino.size?.category || DINOBASE.getSizeCategory(dino), dino);
    });

    DINOBASE.indexes = indexes;
    return indexes;
  };

  DINOBASE.reindex = () => {
    DINOBASE.normalizeDinosaurs();
    return DINOBASE.buildIndexes();
  };

  DINOBASE.getById = (id) => DINOBASE.indexes?.byId?.[id] || DINOBASE.dinosaurs.find((dino) => dino.id === id) || null;
  DINOBASE.getFeatured = () => DINOBASE.dinosaurs.filter((dino) => dino.featured).slice();
  DINOBASE.getByPeriod = (period) => (DINOBASE.indexes?.byPeriod?.[period] || []).slice();
  DINOBASE.getByDiet = (diet) => (DINOBASE.indexes?.byDiet?.[diet] || []).slice();
  DINOBASE.getByClassification = (classification) => (DINOBASE.indexes?.byClassification?.[classification] || []).slice();
  DINOBASE.getBySize = (size) => (DINOBASE.indexes?.bySize?.[size] || []).slice();

  DINOBASE.reindex();
  window.DINOBASE = DINOBASE;
})();
