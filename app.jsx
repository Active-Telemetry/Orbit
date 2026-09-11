const { useState, useEffect, useCallback } = React;

/* ---------------------------------------------------------------------- */
/* Minimal inline icon set (avoids an external icon-library dependency so */
/* the app works fully offline once cached by the service worker)         */
/* ---------------------------------------------------------------------- */

function Icon({ children, size = 20, color = "currentColor", ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      {children}
    </svg>
  );
}

const ChevronLeft = (p) => (
  <Icon {...p}>
    <polyline points="15 18 9 12 15 6" />
  </Icon>
);
const ChevronRight = (p) => (
  <Icon {...p}>
    <polyline points="9 18 15 12 9 6" />
  </Icon>
);
const ChevronDown = (p) => (
  <Icon {...p}>
    <polyline points="6 9 12 15 18 9" />
  </Icon>
);
const SettingsIcon = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </Icon>
);
const CheckCircle2 = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="9 12 11.5 14.5 16 9" />
  </Icon>
);
const XCircle = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </Icon>
);
const Download = (p) => (
  <Icon {...p}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </Icon>
);
const Upload = (p) => (
  <Icon {...p}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </Icon>
);
const RotateCcw = (p) => (
  <Icon {...p}>
    <polyline points="1 4 1 10 7 10" />
    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
  </Icon>
);
const BookOpen = (p) => (
  <Icon {...p}>
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </Icon>
);
const Brain = (p) => (
  <Icon {...p}>
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44A2.5 2.5 0 0 1 4.5 17.5 2.5 2.5 0 0 1 2 15a2.5 2.5 0 0 1 1.06-2.04A2.5 2.5 0 0 1 4.5 8.5a2.5 2.5 0 0 1 1.5-4A2.5 2.5 0 0 1 9.5 2z" />
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44A2.5 2.5 0 0 0 19.5 17.5 2.5 2.5 0 0 0 22 15a2.5 2.5 0 0 0-1.06-2.04A2.5 2.5 0 0 0 19.5 8.5a2.5 2.5 0 0 0-1.5-4A2.5 2.5 0 0 0 14.5 2z" />
  </Icon>
);
const Lock = (p) => (
  <Icon {...p}>
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </Icon>
);

/* ---------------------------------------------------------------------- */
/* App identity                                                           */
/* ---------------------------------------------------------------------- */

const APP_VERSION = "0.4.0";
const SCHEMA_VERSION = 1;

/* ---------------------------------------------------------------------- */
/* Difficulty bands (NCEA-style: Achieved / Merit / Excellence)           */
/* ---------------------------------------------------------------------- */
/*
  Every learn node and every question carries a numeric `band` (1-3).
  Progress itself is still stored keyed by question id only (see
  CONTEXT.md "Question ID convention") — band is a property of content,
  not of saved state, so no schema/version migration is needed here.
*/

const BANDS = [
  { level: 1, code: "A", label: "Achieved" },
  { level: 2, code: "M", label: "Merit" },
  { level: 3, code: "E", label: "Excellence" },
];

function bandOf(item) {
  return item.band ?? 1;
}

/* ---------------------------------------------------------------------- */
/* Content: NCEA Level 1 Science                                          */
/* ---------------------------------------------------------------------- */
/*
  Structure: Subject -> Area -> Module -> { learn tree, question bank }
  v0.1 ships Biology fully. Other areas are visible but marked "coming soon"
  so the whole-curriculum shape is in place for later content passes.
*/

const SUBJECTS = {
  science: {
    id: "science",
    name: "Science",
    tagline: "NCEA Level 1",
    areas: [
      {
        id: "biology",
        name: "Biology",
        blurb: "Cells, organisms, and how living things interact",
        accent: "biology",
        available: true,
        modules: [
          {
            id: "cells",
            name: "Cells & Organisation",
            blurb: "The building blocks of life, and how they're organised",
            submodules: [
              {
                id: "cells-basics",
                name: "Cells as the Basic Unit of Life",
                blurb: "What a cell is, and how cells build up into organisms",
                learn: [
                  {
                    band: 1,
                    title: "All living things are made of cells",
                    body: "Every organism, from a single bacterium to a blue whale, is built from cells. A cell is the smallest unit that can carry out the basic functions of life — taking in energy, removing waste, and reproducing.",
                    children: [
                      {
                        band: 2,
                        title: "Cells are the basic unit of life",
                        body: "Nothing smaller than a cell can independently carry out life processes. Viruses, for example, aren't made of cells and can't reproduce on their own — which is one reason biologists debate whether they count as 'alive'.",
                      },
                      {
                        band: 2,
                        title:
                          "Organisms can be single-celled or multicellular",
                        body: "Some organisms, like bacteria and amoebas, are made of just one cell that does everything. Others, like humans, are made of trillions of cells that specialise in different jobs.",
                      },
                    ],
                  },
                  {
                    band: 1,
                    title: "Levels of organisation",
                    body: "In multicellular organisms, similar cells group together and become more complex step by step.",
                    children: [
                      {
                        band: 2,
                        title:
                          "Cell → Tissue → Organ → Organ system → Organism",
                        body: "Cells of the same type group into tissue. Different tissues combine into an organ. Organs that work together form an organ system. All the systems together make up the organism.",
                      },
                      {
                        band: 2,
                        title: "Worked example: the heart",
                        body: "Muscle cells group into cardiac muscle tissue. That tissue, plus valve and nerve tissue, forms the heart (an organ). The heart works with blood vessels to form the circulatory system.",
                      },
                    ],
                  },
                  {
                    band: 3,
                    title: "Why viruses complicate the definition of 'life'",
                    body: "Viruses cannot metabolise or reproduce independently — they hijack a host cell's machinery to copy themselves. This means the cell theory (that all life is made of cells, and cells only arise from existing cells) doesn't cleanly include viruses, which is why many biologists classify them as non-living even though they carry genetic material and evolve.",
                  },
                ],
                questions: [
                  {
                    id: "cells_q1",
                    band: 1,
                    type: "mcq",
                    prompt: "What is the basic unit of life?",
                    options: ["An organ", "A cell", "A tissue", "An organism"],
                    answer: "A cell",
                  },
                  {
                    id: "cells_q4",
                    band: 1,
                    type: "mcq",
                    prompt: "Put these in order, smallest to largest:",
                    options: [
                      "Cell → Tissue → Organ → Organ system",
                      "Organ → Cell → Tissue → Organ system",
                      "Tissue → Cell → Organ system → Organ",
                      "Organ system → Organ → Tissue → Cell",
                    ],
                    answer: "Cell → Tissue → Organ → Organ system",
                  },
                  {
                    id: "cells_q8",
                    band: 1,
                    type: "mcq",
                    prompt:
                      "An organism made of just one cell that does every job is:",
                    options: [
                      "Multicellular",
                      "Single-celled",
                      "An organ system",
                      "A tissue",
                    ],
                    answer: "Single-celled",
                  },
                  {
                    id: "cells_q15",
                    band: 3,
                    type: "mcq",
                    prompt:
                      "Why do many biologists argue that viruses are not truly 'alive', despite containing genetic material?",
                    options: [
                      "They are too small to see",
                      "They cannot carry out life processes independently of a host cell",
                      "They do not contain any genetic material",
                      "They only infect plants, not animals",
                    ],
                    answer:
                      "They cannot carry out life processes independently of a host cell",
                  },
                ],
              },
              {
                id: "cells-structures",
                name: "Cell Structures",
                blurb: "The organelles inside a cell, and what each one does",
                learn: [
                  {
                    band: 1,
                    title: "Cell structures and their jobs",
                    body: "Cells contain smaller structures, called organelles, that each do a specific job — similar to organs inside a body.",
                    children: [
                      {
                        band: 2,
                        title: "Cell membrane",
                        body: "A thin barrier around the cell that controls what substances enter and leave — letting nutrients in and waste out.",
                      },
                      {
                        band: 2,
                        title: "Nucleus",
                        body: "Contains the cell's DNA (genetic instructions) and controls the cell's activities, a bit like a control centre.",
                      },
                      {
                        band: 2,
                        title: "Cytoplasm",
                        body: "The jelly-like substance filling the cell, where many chemical reactions of life take place and organelles are suspended.",
                      },
                      {
                        band: 2,
                        title: "Mitochondria",
                        body: "Often called the 'powerhouse' of the cell — they release energy from food through a process called respiration.",
                      },
                    ],
                  },
                  {
                    band: 3,
                    title: "Why organelle numbers vary between cell types",
                    body: "Cells aren't identical inside — a muscle cell packs far more mitochondria than a skin cell, because muscle contraction demands much more energy. The number and size of a cell's organelles reflect the specific job that cell does, not just its type.",
                  },
                ],
                questions: [
                  {
                    id: "cells_q2",
                    band: 1,
                    type: "mcq",
                    prompt:
                      "Which structure controls what enters and leaves a cell?",
                    options: [
                      "Nucleus",
                      "Mitochondria",
                      "Cell membrane",
                      "Cytoplasm",
                    ],
                    answer: "Cell membrane",
                  },
                  {
                    id: "cells_q3",
                    band: 1,
                    type: "mcq",
                    prompt:
                      "Which part of the cell contains the genetic material (DNA)?",
                    options: ["Cytoplasm", "Nucleus", "Cell wall", "Vacuole"],
                    answer: "Nucleus",
                  },
                  {
                    id: "cells_q5",
                    band: 1,
                    type: "mcq",
                    prompt:
                      "Which organelle releases energy from food through respiration?",
                    options: [
                      "Chloroplast",
                      "Nucleus",
                      "Mitochondria",
                      "Cell wall",
                    ],
                    answer: "Mitochondria",
                  },
                  {
                    id: "cells_q16",
                    band: 3,
                    type: "mcq",
                    prompt:
                      "A liver cell contains far more mitochondria than a skin cell. What does this most likely reflect?",
                    options: [
                      "Liver cells are larger than skin cells",
                      "Liver cells have a much higher energy demand",
                      "Skin cells don't need a nucleus",
                      "Mitochondria are only found in internal organs",
                    ],
                    answer: "Liver cells have a much higher energy demand",
                  },
                ],
              },
              {
                id: "cells-plantanimal",
                name: "Plant vs Animal Cells",
                blurb: "The extra features that set plant cells apart",
                learn: [
                  {
                    band: 1,
                    title: "Plant cells vs animal cells",
                    body: "Plant and animal cells share the structures above, but plant cells have three extra features suited to a stationary, food-producing lifestyle.",
                    children: [
                      {
                        band: 2,
                        title: "Cell wall",
                        body: "A rigid layer outside the cell membrane, made of cellulose, that gives the cell a fixed shape and support.",
                      },
                      {
                        band: 2,
                        title: "Chloroplasts",
                        body: "Contain chlorophyll and carry out photosynthesis, converting sunlight into food energy. Animal cells don't have these.",
                      },
                      {
                        band: 2,
                        title: "Large central vacuole",
                        body: "A fluid-filled sac that helps keep the cell rigid (turgid) and stores water, nutrients, and waste.",
                      },
                    ],
                  },
                  {
                    band: 3,
                    title:
                      "Why plant cells need rigidity but animal cells don't",
                    body: "Plants can't move to escape gravity or physical stress, so their cell walls and turgid vacuoles provide structural support that keeps the whole plant upright. Animal cells rely on internal skeletons and muscle instead, so they can stay flexible and mobile without a rigid outer wall.",
                  },
                ],
                questions: [
                  {
                    id: "cells_q6",
                    band: 1,
                    type: "mcq",
                    prompt:
                      "Which structure is found in plant cells but not animal cells?",
                    options: [
                      "Cell membrane",
                      "Cytoplasm",
                      "Chloroplast",
                      "Nucleus",
                    ],
                    answer: "Chloroplast",
                  },
                  {
                    id: "cells_q7",
                    band: 1,
                    type: "mcq",
                    prompt: "What does the cell wall mainly do?",
                    options: [
                      "Produces energy",
                      "Gives the cell a fixed shape and support",
                      "Stores genetic material",
                      "Carries out photosynthesis",
                    ],
                    answer: "Gives the cell a fixed shape and support",
                  },
                  {
                    id: "cells_q14",
                    band: 1,
                    type: "mcq",
                    prompt:
                      "Which process do plant cells use to make their own food?",
                    options: [
                      "Respiration",
                      "Digestion",
                      "Photosynthesis",
                      "Excretion",
                    ],
                    answer: "Photosynthesis",
                  },
                  {
                    id: "cells_q17",
                    band: 3,
                    type: "mcq",
                    prompt:
                      "Why would a rigid cell wall be a disadvantage for an animal cell but not for a plant cell?",
                    options: [
                      "It would stop animal cells reproducing",
                      "It would prevent the flexible movement and shape changes animal cells often need",
                      "Animal cells don't need structure at all",
                      "It would make animal cells photosynthesise",
                    ],
                    answer:
                      "It would prevent the flexible movement and shape changes animal cells often need",
                  },
                ],
              },
              {
                id: "cells-specialised",
                name: "Specialised Cells",
                blurb: "How cells adapt their structure to suit their job",
                learn: [
                  {
                    band: 1,
                    title: "Specialised cells",
                    body: "In multicellular organisms, cells differentiate to take on specific jobs, becoming specialised in structure and function to do that job well.",
                    children: [
                      {
                        band: 2,
                        title: "Red blood cells",
                        body: "Packed with haemoglobin and shaped as a biconcave disc to carry oxygen efficiently. They have no nucleus, leaving more room for haemoglobin.",
                      },
                      {
                        band: 2,
                        title: "Nerve cells (neurons)",
                        body: "Long and thin, with branching extensions, letting them carry electrical signals quickly over long distances.",
                      },
                      {
                        band: 2,
                        title: "Root hair cells",
                        body: "Have a long, thin extension that increases surface area, helping plant roots absorb more water and minerals from the soil.",
                      },
                    ],
                  },
                  {
                    band: 3,
                    title: "Trade-offs in specialisation",
                    body: "Specialisation makes a cell excellent at one job, but often at a cost — red blood cells lose their nucleus to fit more haemoglobin, which also means they can't repair themselves or divide, so the body must constantly replace them from bone marrow stem cells.",
                  },
                ],
                questions: [
                  {
                    id: "cells_q9",
                    band: 1,
                    type: "mcq",
                    prompt:
                      "What is a cell that has adapted to carry out a specific job called?",
                    options: [
                      "A generic cell",
                      "A specialised cell",
                      "A tissue-only cell",
                      "An organ cell",
                    ],
                    answer: "A specialised cell",
                  },
                  {
                    id: "cells_q10",
                    band: 1,
                    type: "text",
                    prompt:
                      "Name the blood cell type specialised to carry oxygen around the body.",
                    answers: ["red blood cell", "red blood cells"],
                  },
                  {
                    id: "cells_q11",
                    band: 1,
                    type: "mcq",
                    prompt: "Nerve cells (neurons) are specialised to:",
                    options: [
                      "Store fat",
                      "Carry electrical signals",
                      "Photosynthesise",
                      "Digest food",
                    ],
                    answer: "Carry electrical signals",
                  },
                  {
                    id: "cells_q12",
                    band: 1,
                    type: "text",
                    prompt:
                      "Root hair cells have a long extension that increases what, helping them absorb water?",
                    answers: ["surface area"],
                  },
                  {
                    id: "cells_q13",
                    band: 2,
                    type: "mcq",
                    prompt: "Why do red blood cells lack a nucleus?",
                    options: [
                      "To save energy",
                      "To leave more room for haemoglobin",
                      "Because they are dead cells",
                      "Because they don't need DNA",
                    ],
                    answer: "To leave more room for haemoglobin",
                  },
                  {
                    id: "cells_q18",
                    band: 3,
                    type: "text",
                    prompt:
                      "Red blood cells lose their nucleus to carry more oxygen, but this creates what long-term limitation for the cell?",
                    answers: [
                      "they cannot divide or repair themselves",
                      "cannot repair or reproduce",
                      "they can't repair themselves",
                      "cannot divide",
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: "ecology",
            name: "Ecology & Ecosystems",
            blurb:
              "How living things depend on each other and their environment",
            submodules: [
              {
                id: "eco-ecosystems",
                name: "Ecosystems & Habitats",
                blurb: "What an ecosystem and a habitat actually are",
                learn: [
                  {
                    band: 1,
                    title:
                      "Living things depend on each other and their environment",
                    body: "An ecosystem is a community of living things interacting with each other and with the non-living parts of their environment, like water, soil, and climate.",
                    children: [
                      {
                        band: 2,
                        title: "Ecosystem",
                        body: "All the organisms in an area, plus the physical environment they live in and interact with.",
                      },
                      {
                        band: 2,
                        title: "Habitat",
                        body: "The specific place where an organism lives, providing the conditions and resources it needs — e.g. a stream is the habitat of a native kōura (freshwater crayfish).",
                      },
                    ],
                  },
                  {
                    band: 3,
                    title: "Where do ecosystem boundaries really sit?",
                    body: "Ecosystems don't have hard edges — a river flowing into an estuary carries nutrients, and migratory birds connect a wetland to ecosystems thousands of kilometres away. Ecologists draw boundaries for convenience, but real ecosystems are open systems constantly exchanging matter and energy with neighbouring ones.",
                  },
                ],
                questions: [
                  {
                    id: "eco_q1",
                    band: 1,
                    type: "mcq",
                    prompt: "What is an ecosystem?",
                    options: [
                      "A single species living alone",
                      "A community of living things interacting with their environment",
                      "Only the non-living parts of an environment",
                      "A food chain with exactly three organisms",
                    ],
                    answer:
                      "A community of living things interacting with their environment",
                  },
                  {
                    id: "eco_q14",
                    band: 1,
                    type: "mcq",
                    prompt: "What is a habitat?",
                    options: [
                      "Every organism in the world",
                      "The specific place where an organism lives",
                      "A single food chain",
                      "A type of decomposer",
                    ],
                    answer: "The specific place where an organism lives",
                  },
                  {
                    id: "eco_q15",
                    band: 3,
                    type: "mcq",
                    prompt:
                      "Why are ecosystem boundaries considered somewhat artificial by ecologists?",
                    options: [
                      "Ecosystems never interact with each other",
                      "Matter and energy regularly cross between neighbouring ecosystems",
                      "All ecosystems are exactly the same size",
                      "Habitats and ecosystems are identical concepts",
                    ],
                    answer:
                      "Matter and energy regularly cross between neighbouring ecosystems",
                  },
                ],
              },
              {
                id: "eco-feeding",
                name: "Feeding Relationships",
                blurb: "How energy moves through an ecosystem",
                learn: [
                  {
                    band: 1,
                    title: "Feeding relationships",
                    body: "Energy moves through an ecosystem as organisms eat one another. Different roles are involved.",
                    children: [
                      {
                        band: 2,
                        title: "Producers",
                        body: "Make their own food, usually via photosynthesis (plants, algae). They form the base of almost every food chain.",
                      },
                      {
                        band: 2,
                        title: "Consumers",
                        body: "Get energy by eating other organisms. Herbivores eat plants, carnivores eat animals, omnivores eat both.",
                      },
                      {
                        band: 2,
                        title: "Decomposers",
                        body: "Break down dead organisms and waste, releasing nutrients back into the soil for producers to use again — fungi and bacteria are key decomposers.",
                      },
                      {
                        band: 2,
                        title: "Food chains and food webs",
                        body: "A food chain shows one feeding pathway (e.g. grass → rabbit → hawk). A food web links many food chains together, showing the more realistic, interconnected picture.",
                      },
                    ],
                  },
                  {
                    band: 3,
                    title: "Why energy is lost at each feeding level",
                    body: "Only about 10% of the energy at one feeding level typically transfers to the next — the rest is lost as heat through respiration or is never eaten. This is why food chains rarely have more than four or five links, and why there are always far more producers than top predators.",
                  },
                ],
                questions: [
                  {
                    id: "eco_q2",
                    band: 1,
                    type: "mcq",
                    prompt: "Organisms that make their own food are called:",
                    options: [
                      "Consumers",
                      "Decomposers",
                      "Producers",
                      "Predators",
                    ],
                    answer: "Producers",
                  },
                  {
                    id: "eco_q3",
                    band: 1,
                    type: "mcq",
                    prompt:
                      "What is the main role of decomposers in an ecosystem?",
                    options: [
                      "Hunting live prey",
                      "Producing oxygen",
                      "Breaking down dead material and recycling nutrients",
                      "Competing with producers for sunlight",
                    ],
                    answer:
                      "Breaking down dead material and recycling nutrients",
                  },
                  {
                    id: "eco_q4",
                    band: 1,
                    type: "mcq",
                    prompt: "A food web is best described as:",
                    options: [
                      "A single feeding pathway",
                      "Many interconnected food chains",
                      "A list of every species in a country",
                      "The non-living parts of a habitat",
                    ],
                    answer: "Many interconnected food chains",
                  },
                  {
                    id: "eco_q16",
                    band: 3,
                    type: "mcq",
                    prompt:
                      "Why do food chains rarely have more than four or five links?",
                    options: [
                      "Predators refuse to eat more than four prey species",
                      "Most energy is lost as heat at each feeding level, leaving too little to support another level",
                      "Producers cannot support more than five consumers",
                      "Decomposers stop the chain after five levels",
                    ],
                    answer:
                      "Most energy is lost as heat at each feeding level, leaving too little to support another level",
                  },
                ],
              },
              {
                id: "eco-populations",
                name: "Populations & Communities",
                blurb: "How ecologists study living things at different scales",
                learn: [
                  {
                    band: 1,
                    title: "Populations and communities",
                    body: "Ecologists study living things at different scales.",
                    children: [
                      {
                        band: 2,
                        title: "Population",
                        body: "All the individuals of one species living in the same area at the same time — e.g. all the tūī in a forest reserve.",
                      },
                      {
                        band: 2,
                        title: "Community",
                        body: "All the different populations of different species living and interacting in the same area.",
                      },
                      {
                        band: 2,
                        title: "Limiting factors",
                        body: "Things that restrict how large a population can grow — food, water, space, disease, and predators are common limiting factors.",
                      },
                    ],
                  },
                  {
                    band: 3,
                    title: "Why limiting factors interact, not act alone",
                    body: "Real populations are rarely capped by a single limiting factor — food shortage can make a population more vulnerable to disease, and overcrowding can increase competition for both space and food at once. Predicting population size usually means weighing several interacting limiting factors together.",
                  },
                ],
                questions: [
                  {
                    id: "eco_q5",
                    band: 1,
                    type: "mcq",
                    prompt:
                      "All the individuals of one species in an area make up a:",
                    options: [
                      "Community",
                      "Ecosystem",
                      "Population",
                      "Habitat",
                    ],
                    answer: "Population",
                  },
                  {
                    id: "eco_q6",
                    band: 1,
                    type: "mcq",
                    prompt:
                      "Which of these is a limiting factor on population size?",
                    options: [
                      "Food availability",
                      "Species name",
                      "Cell structure",
                      "Scientific classification",
                    ],
                    answer: "Food availability",
                  },
                  {
                    id: "eco_q17",
                    band: 3,
                    type: "mcq",
                    prompt:
                      "A population with plentiful food but very little available nesting space is likely to be limited mainly by:",
                    options: [
                      "Food availability",
                      "Space",
                      "Disease",
                      "Predation",
                    ],
                    answer: "Space",
                  },
                ],
              },
              {
                id: "eco-humanimpact",
                name: "Human Impact & Conservation",
                blurb:
                  "How human activity changes ecosystems, and how we protect them",
                learn: [
                  {
                    band: 1,
                    title: "Human impact on ecosystems",
                    body: "Human activity changes ecosystems, sometimes faster than species can adapt.",
                    children: [
                      {
                        band: 2,
                        title: "Habitat loss",
                        body: "Clearing land for farming or building removes the resources species depend on, often reducing population sizes sharply.",
                      },
                      {
                        band: 2,
                        title: "Introduced species",
                        body: "Species brought from elsewhere (like possums or stoats in Aotearoa) can outcompete or prey on native species that have no natural defences against them.",
                      },
                      {
                        band: 2,
                        title: "Conservation",
                        body: "Deliberate action to protect species and habitats — such as predator control, replanting, or setting up protected reserves.",
                      },
                    ],
                  },
                  {
                    band: 3,
                    title:
                      "Why removing one introduced predator isn't always enough",
                    body: "Removing stoats might let bird numbers recover, but if rats are also present, rats can increase in the stoats' absence and take over as the main threat to eggs and chicks. Effective conservation often needs to manage multiple introduced species together, not just the most visible one.",
                  },
                ],
                questions: [
                  {
                    id: "eco_q7",
                    band: 2,
                    type: "mcq",
                    prompt:
                      "Why can introduced predators like stoats harm native NZ birds?",
                    options: [
                      "The birds have strong natural defences against them",
                      "The birds evolved without mammalian predators, so lack defences",
                      "Stoats only eat plants",
                      "Introduced species always improve ecosystems",
                    ],
                    answer:
                      "The birds evolved without mammalian predators, so lack defences",
                  },
                  {
                    id: "eco_q8",
                    band: 1,
                    type: "mcq",
                    prompt:
                      "Deliberate action to protect species and habitats is called:",
                    options: [
                      "Predation",
                      "Conservation",
                      "Decomposition",
                      "Competition",
                    ],
                    answer: "Conservation",
                  },
                  {
                    id: "eco_q18",
                    band: 3,
                    type: "mcq",
                    prompt:
                      "Why might removing only one introduced predator species from an ecosystem fail to protect native birds?",
                    options: [
                      "Removing any predator always fixes the problem",
                      "A second introduced species may increase and take over as the main threat",
                      "Native birds don't respond to predator control",
                      "Introduced species can't affect each other's populations",
                    ],
                    answer:
                      "A second introduced species may increase and take over as the main threat",
                  },
                ],
              },
              {
                id: "eco-adaptation",
                name: "Adaptation & Survival",
                blurb:
                  "How species adapt to survive and compete in their environment",
                learn: [
                  {
                    band: 1,
                    title: "Adaptation and survival",
                    body: "Species develop features over generations that help them survive and reproduce in their particular environment.",
                    children: [
                      {
                        band: 2,
                        title: "Structural adaptations",
                        body: "Physical features suited to an environment, like a fantail's wide beak for catching insects mid-flight.",
                      },
                      {
                        band: 2,
                        title: "Behavioural adaptations",
                        body: "Actions or behaviour patterns that improve survival, like migration, hibernation, or being nocturnal to avoid predators or heat.",
                      },
                      {
                        band: 2,
                        title: "Competition",
                        body: "Organisms compete for the same limited resources — food, space, and mates — both within and between species.",
                      },
                    ],
                  },
                  {
                    band: 3,
                    title:
                      "Adaptation is a population-level, not individual, process",
                    body: "An individual animal doesn't adapt during its own lifetime — adaptation happens over generations, as individuals with helpful inherited traits survive and reproduce more, gradually shifting the traits common in the population. A single fantail can't develop a better beak; the population's average beak shape changes over many generations.",
                  },
                ],
                questions: [
                  {
                    id: "eco_q9",
                    band: 1,
                    type: "mcq",
                    prompt:
                      "A physical feature that helps a species survive in its environment is called a:",
                    options: [
                      "Behavioural adaptation",
                      "Structural adaptation",
                      "Limiting factor",
                      "Food web",
                    ],
                    answer: "Structural adaptation",
                  },
                  {
                    id: "eco_q10",
                    band: 1,
                    type: "text",
                    prompt:
                      "What word describes organisms competing for the same limited resources?",
                    answers: ["competition"],
                  },
                  {
                    id: "eco_q11",
                    band: 1,
                    type: "mcq",
                    prompt:
                      "Migrating to a warmer region for winter is an example of a:",
                    options: [
                      "Structural adaptation",
                      "Behavioural adaptation",
                      "Limiting factor",
                      "Decomposer",
                    ],
                    answer: "Behavioural adaptation",
                  },
                  {
                    id: "eco_q12",
                    band: 1,
                    type: "mcq",
                    prompt:
                      "Two species competing for the same food source is an example of:",
                    options: [
                      "Predation",
                      "Competition",
                      "Decomposition",
                      "Photosynthesis",
                    ],
                    answer: "Competition",
                  },
                  {
                    id: "eco_q13",
                    band: 1,
                    type: "text",
                    prompt:
                      "What term describes an animal that is mainly active at night?",
                    answers: ["nocturnal"],
                  },
                  {
                    id: "eco_q19",
                    band: 3,
                    type: "mcq",
                    prompt:
                      "Which statement correctly describes how adaptation happens in a species?",
                    options: [
                      "An individual animal changes its body during its lifetime to suit its environment",
                      "Traits that improve survival become more common across generations as those individuals reproduce more",
                      "All members of a species adapt identically and instantly",
                      "Adaptation only happens if an environment stays exactly the same",
                    ],
                    answer:
                      "Traits that improve survival become more common across generations as those individuals reproduce more",
                  },
                ],
              },
            ],
          },
          {
            id: "genetics",
            name: "Genetics & Variation",
            blurb: "DNA, mutations, inheritance, and how genetic diversity shapes populations",
            submodules: [
              {
                id: "gen-basics",
                name: "Genes, Alleles & Phenotypes",
                blurb: "The relationship between DNA, alleles, genotypes, and physical traits",
                learn: [
                  {
                    band: 1,
                    title: "DNA carries genetic information",
                    body: "Genes are specific sections of DNA that code for traits. Chromosomes are structures that carry many genes. Different versions of the same gene are called alleles, which are responsible for variations in traits.",
                    children: [
                      {
                        band: 2,
                        title: "Genotype vs Phenotype",
                        body: "Genotype is the allele combination an organism has for a gene (its genetic makeup). Phenotype is the observable physical expression of that genotype. Genotype determines phenotype.",
                      },
                      {
                        band: 2,
                        title: "Homozygous vs Heterozygous",
                        body: "Homozygous means having two identical alleles for a gene (either both dominant or both recessive). Heterozygous means having two different alleles for a gene.",
                      },
                    ],
                  },
                  {
                    band: 3,
                    title: "How genotype complexity influences disease expression",
                    body: "An organism's phenotype isn't always a simple one-to-one mirror of its genotype — environmental factors can interact with genetic predispositions, and carrier states in heterozygous individuals mean recessive alleles can be hidden across generations without being physically expressed.",
                  },
                ],
                questions: [
                  {
                    id: "gen_q1",
                    band: 1,
                    type: "mcq",
                    prompt: "What is a specific section of DNA that codes for a trait called?",
                    options: ["An allele", "A gene", "A chromosome", "A phenotype"],
                    answer: "A gene",
                  },
                  {
                    id: "gen_q2",
                    band: 1,
                    type: "text",
                    prompt: "What term describes alternative forms of the same gene?",
                    answers: ["allele", "alleles"],
                  },
                  {
                    id: "gen_q3",
                    band: 1,
                    type: "mcq",
                    prompt: "What is the observable physical expression of a genotype called?",
                    options: ["Genotype", "Chromosome", "Phenotype", "Mutation"],
                    answer: "Phenotype",
                  },
                  {
                    id: "gen_q4",
                    band: 2,
                    type: "mcq",
                    prompt: "An individual with two different alleles for a specific gene is described as:",
                    options: ["Homozygous dominant", "Homozygous recessive", "Heterozygous", "Mutated"],
                    answer: "Heterozygous",
                  },
                  {
                    id: "gen_q5",
                    band: 3,
                    type: "mcq",
                    prompt: "Why can a recessive allele remain present in a population across generations without being expressed in every individual who carries it?",
                    options: [
                      "Recessive alleles always destroy themselves over time",
                      "Heterozygous individuals carry the allele safely while expressing the dominant phenotype",
                      "Recessive alleles automatically mutate into dominant ones",
                      "Only homozygous individuals can ever pass on DNA",
                    ],
                    answer: "Heterozygous individuals carry the allele safely while expressing the dominant phenotype",
                  },
                ],
              },
              {
                id: "gen-variation",
                name: "Mutation & Meiosis",
                blurb: "How genetic variation arises through mutation and sexual reproduction",
                learn: [
                  {
                    band: 1,
                    title: "Sources of genetic variation",
                    body: "Genetic variation within a population is essential for adaptability and survival. It is driven primarily by mutations and sexual reproduction.",
                    children: [
                      {
                        band: 2,
                        title: "Mutation",
                        body: "A permanent change in the DNA base sequence. Mutations are the ultimate source of all new alleles.",
                      },
                      {
                        band: 2,
                        title: "Meiosis and sexual reproduction",
                        body: "Meiosis generates genetic diversity through crossing over, independent assortment, and random fertilisation, creating new allele combinations in offspring.",
                      },
                    ],
                  },
                  {
                    band: 3,
                    title: "Why genetic variation matters for populations",
                    body: "Greater genetic variation enhances a species' survival potential under environmental change, by increasing the statistical likelihood that some individuals carry beneficial alleles capable of surviving novel pressures like diseases or climate shifts.",
                  },
                ],
                questions: [
                  {
                    id: "gen_q6",
                    band: 1,
                    type: "text",
                    prompt: "What term describes a permanent change in the DNA base sequence?",
                    answers: ["mutation", "mutations"],
                  },
                  {
                    id: "gen_q7",
                    band: 1,
                    type: "mcq",
                    prompt: "What is the ultimate source of all new alleles in a population?",
                    options: ["Mitosis", "Mutation", "Digestion", "Respiration"],
                    answer: "Mutation",
                  },
                  {
                    id: "gen_q8",
                    band: 2,
                    type: "mcq",
                    prompt: "Which meiosis process involves the exchange of genetic material between homologous chromosomes?",
                    options: ["Independent assortment", "Crossing over", "Random fertilisation", "Binary fission"],
                    answer: "Crossing over",
                  },
                  {
                    id: "gen_q9",
                    band: 3,
                    type: "mcq",
                    prompt: "How does high genetic variation directly protect a population against sudden environmental changes?",
                    options: [
                      "It stops individuals from ever getting sick",
                      "It increases the chance that some individuals possess alleles suited to survive the new conditions",
                      "It forces all individuals to adapt identically",
                      "It reduces competition for food resources",
                    ],
                    answer: "It increases the chance that some individuals possess alleles suited to survive the new conditions",
                  },
                ],
              },
              {
                id: "gen-tracking",
                name: "Inheritance & Gene Tracking",
                blurb: "Using Punnett squares, pedigrees, and DNA tracking to study inheritance",
                learn: [
                  {
                    band: 1,
                    title: "Tracking genetic relationships",
                    body: "Scientists use various tools to identify, follow, and predict alleles and genetic relationships within families and populations.",
                    children: [
                      {
                        band: 2,
                        title: "Punnett squares and pedigree charts",
                        body: "Punnett squares calculate the probability of offspring inheriting specific genotypes, while pedigree charts map inheritance patterns across family generations.",
                      },
                      {
                        band: 2,
                        title: "DNA sequencing",
                        body: "Directly reading DNA base sequences allows scientists to identify genetic markers and measure relatedness between individuals or species.",
                      },
                    ],
                  },
                  {
                    band: 3,
                    title: "Limitations of predictive tracking models",
                    body: "While Punnett squares give exact statistical probabilities, real-world inheritance can be complicated by linked genes, multiple alleles, and environmental influences that skew expected Mendelian ratios in large populations.",
                  },
                ],
                questions: [
                  {
                    id: "gen_q10",
                    band: 1,
                    type: "mcq",
                    prompt: "What tool is commonly used to predict the probability of offspring inheriting particular genotypes?",
                    options: ["Pedigree chart", "Punnett square", "Microscope", "Phylogenetic tree"],
                    answer: "Punnett square",
                  },
                  {
                    id: "gen_q11",
                    band: 1,
                    type: "text",
                    prompt: "What chart maps inheritance patterns across multiple family generations?",
                    answers: ["pedigree chart", "pedigree", "family tree"],
                  },
                  {
                    id: "gen_q12",
                    band: 2,
                    type: "mcq",
                    prompt: "What does DNA sequencing allow scientists to do?",
                    options: [
                      "Change an organism's phenotype instantly",
                      "Identify genetic markers and compare base sequences",
                      "Prevent all mutations from occurring",
                      "Convert genotypes directly into proteins without transcription",
                    ],
                    answer: "Identify genetic markers and compare base sequences",
                  },
                  {
                    id: "gen_q13",
                    band: 3,
                    type: "mcq",
                    prompt: "Why might real-world population inheritance patterns differ from simple Punnett square predictions?",
                    options: [
                      "Punnett squares only work for plants",
                      "Factors like linked genes, multiple alleles, and complex inheritance can alter expected ratios",
                      "DNA sequencing prevents inheritance calculations",
                      "Alleles change randomly every hour",
                    ],
                    answer: "Factors like linked genes, multiple alleles, and complex inheritance can alter expected ratios",
                  },
                ],
              },
              {
                id: "gen-ccr5",
                name: "Applied Context: CCR5 & HIV Resistance",
                blurb: "Real-world application of genetics to medical research and viral resistance",
                learn: [
                  {
                    band: 1,
                    title: "The CCR5 gene and viral resistance",
                    body: "A specific variation in the CCR5 gene produces a mutant allele that alters a receptor protein on white blood cells, conferring natural resistance to HIV infection.",
                    children: [
                      {
                        band: 2,
                        title: "Genotypes in the CCR5 context",
                        body: "Individuals homozygous for the mutant allele (hh) are resistant to HIV, whereas susceptible individuals are heterozygous or homozygous for the normal allele (Hh or HH).",
                      },
                      {
                        band: 2,
                        title: "Medical applications",
                        body: "Understanding such genetic variations helps researchers develop targeted drug therapies and improve healthcare equity by tailoring treatments.",
                      },
                    ],
                  },
                  {
                    band: 3,
                    title: "Broader implications of genetic discovery",
                    body: "Discoveries like the CCR5 mutation demonstrate how basic genetics research directly translates into novel antiviral strategies, though equitable global access to resulting therapies remains a significant societal challenge.",
                  },
                ],
                questions: [
                  {
                    id: "gen_q14",
                    band: 1,
                    type: "mcq",
                    prompt: "What does the mutant allele of the CCR5 gene alter in the body?",
                    options: ["Red blood cell shape", "A white blood cell receptor protein", "Enzyme production in the liver", "Digestive acid levels"],
                    answer: "A white blood cell receptor protein",
                  },
                  {
                    id: "gen_q15",
                    band: 2,
                    type: "text",
                    prompt: "What genotype (using 'h' for the mutant allele) describes individuals who are resistant to HIV infection?",
                    answers: ["hh", "homozygous recessive"],
                  },
                  {
                    id: "gen_q16",
                    band: 3,
                    type: "mcq",
                    prompt: "How does studying genetic variations like the CCR5 mutation benefit modern medicine?",
                    options: [
                      "It allows scientists to eliminate all viruses instantly",
                      "It supports the development of targeted treatments and preventative drug therapies",
                      "It proves that genotypes never determine phenotypes",
                      "It replaces the need for clinical trials",
                    ],
                    answer: "It supports the development of targeted treatments and preventative drug therapies",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "chemistry",
        name: "Chemistry",
        blurb: "Atoms, elements, and chemical reactions",
        accent: "chemistry",
        available: true,
        modules: [
          {
            id: "atoms",
            name: "Atoms, Elements & the Periodic Table",
            blurb:
              "The particles that make up all matter, and how we organise them",
            submodules: [
              {
                id: "atoms-structure",
                name: "Atoms & Atomic Structure",
                blurb: "What atoms are made of",
                learn: [
                  {
                    band: 1,
                    title: "All matter is made of atoms",
                    body: "Everything around you — air, water, this screen — is built from atoms. An atom is the smallest particle of an element that still has that element's chemical properties.",
                    children: [
                      {
                        band: 2,
                        title: "Atoms are mostly empty space",
                        body: "A tiny, dense nucleus sits at the centre, with electrons moving through a much larger volume of space around it.",
                      },
                    ],
                  },
                  {
                    band: 1,
                    title: "Atomic structure",
                    body: "Atoms are built from three subatomic particles.",
                    children: [
                      {
                        band: 2,
                        title: "Protons",
                        body: "Positively charged particles found in the nucleus. The number of protons is the atomic number, and it defines which element an atom is.",
                      },
                      {
                        band: 2,
                        title: "Neutrons",
                        body: "Particles with no electrical charge, also found in the nucleus, alongside the protons.",
                      },
                      {
                        band: 2,
                        title: "Electrons",
                        body: "Negatively charged particles that occupy shells around the nucleus. They're involved in chemical bonding.",
                      },
                    ],
                  },
                  {
                    band: 3,
                    title: "Why atoms are electrically neutral overall",
                    body: "A neutral atom has equal numbers of protons and electrons, so their charges cancel out. When an atom gains or loses electrons — becoming an ion — that balance is broken, which is exactly why ions carry an overall charge while atoms don't.",
                  },
                ],
                questions: [
                  {
                    id: "atoms_q1",
                    band: 1,
                    type: "mcq",
                    prompt:
                      "What is the smallest particle of an element that keeps its chemical properties?",
                    options: [
                      "A molecule",
                      "A compound",
                      "An atom",
                      "A mixture",
                    ],
                    answer: "An atom",
                  },
                  {
                    id: "atoms_q2",
                    band: 1,
                    type: "mcq",
                    prompt: "Which subatomic particle has a positive charge?",
                    options: ["Electron", "Neutron", "Proton", "Nucleus"],
                    answer: "Proton",
                  },
                  {
                    id: "atoms_q3",
                    band: 1,
                    type: "text",
                    prompt:
                      "What is the name of the negatively charged particle that occupies shells around the nucleus?",
                    answers: ["electron", "electrons"],
                  },
                  {
                    id: "atoms_q4",
                    band: 1,
                    type: "mcq",
                    prompt: "What does an element's atomic number tell you?",
                    options: [
                      "Its number of neutrons",
                      "Its number of protons",
                      "Its total mass",
                      "Its group in the periodic table only",
                    ],
                    answer: "Its number of protons",
                  },
                  {
                    id: "atoms_q15",
                    band: 3,
                    type: "mcq",
                    prompt:
                      "An atom with 11 protons and 11 electrons is electrically neutral. What would happen to its charge if it lost one electron?",
                    options: [
                      "It would stay neutral",
                      "It would become positively charged",
                      "It would become negatively charged",
                      "It would stop being the same element",
                    ],
                    answer: "It would become positively charged",
                  },
                ],
              },
              {
                id: "atoms-periodic",
                name: "Elements & the Periodic Table",
                blurb: "How elements are organised, and what that reveals",
                learn: [
                  {
                    band: 1,
                    title: "Elements and the periodic table",
                    body: "The periodic table arranges every known element in a way that reveals patterns in their properties.",
                    children: [
                      {
                        band: 2,
                        title: "Element",
                        body: "A pure substance made of only one type of atom — like oxygen, carbon, or gold.",
                      },
                      {
                        band: 2,
                        title: "Groups (columns)",
                        body: "Elements in the same group have the same number of outer-shell electrons, giving them similar chemical properties.",
                      },
                      {
                        band: 2,
                        title: "Periods (rows)",
                        body: "Each period represents a row of elements with the same number of electron shells.",
                      },
                    ],
                  },
                  {
                    band: 3,
                    title: "Why groups predict reactivity, not just similarity",
                    body: "Elements in the same group don't just look similar on paper — they tend to react in comparable ways because they have the same number of outer-shell electrons available for bonding. That's why chemists can predict how an untested element will behave just from its position in the table.",
                  },
                ],
                questions: [
                  {
                    id: "atoms_q5",
                    band: 1,
                    type: "text",
                    prompt:
                      "What do we call a pure substance made of only one type of atom?",
                    answers: ["element"],
                  },
                  {
                    id: "atoms_q6",
                    band: 1,
                    type: "mcq",
                    prompt:
                      "Elements in the same group (column) of the periodic table tend to have similar:",
                    options: [
                      "Colours",
                      "Chemical properties",
                      "Atomic numbers",
                      "Names",
                    ],
                    answer: "Chemical properties",
                  },
                  {
                    id: "atoms_q16",
                    band: 3,
                    type: "mcq",
                    prompt:
                      "Sodium (group 1) reacts vigorously with water. Based on periodic table patterns, which element would you predict reacts similarly?",
                    options: [
                      "Chlorine (group 17)",
                      "Potassium (group 1)",
                      "Neon (group 18)",
                      "Carbon (group 14)",
                    ],
                    answer: "Potassium (group 1)",
                  },
                ],
              },
              {
                id: "atoms-compounds",
                name: "Compounds & Mixtures",
                blurb: "How atoms and elements combine",
                learn: [
                  {
                    band: 1,
                    title: "Compounds and mixtures",
                    body: "Atoms and elements can combine in different ways.",
                    children: [
                      {
                        band: 2,
                        title: "Molecule",
                        body: "Two or more atoms bonded together — they can be the same element (O2) or different elements (H2O).",
                      },
                      {
                        band: 2,
                        title: "Compound",
                        body: "Two or more different elements chemically bonded together in a fixed ratio, like water (H2O) — hard to separate back into elements.",
                      },
                      {
                        band: 2,
                        title: "Mixture",
                        body: "Two or more substances physically combined but not chemically bonded, like sand and salt — can be separated by physical means.",
                      },
                    ],
                  },
                  {
                    band: 3,
                    title:
                      "Why compounds behave differently from their elements",
                    body: "Sodium is a reactive metal and chlorine is a toxic gas, but sodium chloride (table salt) is a stable, edible solid — because chemically bonding elements together creates a substance with entirely new properties, not a blend of the originals' properties.",
                  },
                ],
                questions: [
                  {
                    id: "atoms_q7",
                    band: 1,
                    type: "text",
                    prompt: "What is the chemical formula for water?",
                    answers: ["h2o"],
                  },
                  {
                    id: "atoms_q8",
                    band: 1,
                    type: "mcq",
                    prompt:
                      "A mixture can be separated by physical means because its substances are:",
                    options: [
                      "Chemically bonded",
                      "Physically combined, not chemically bonded",
                      "All the same element",
                      "Radioactive",
                    ],
                    answer: "Physically combined, not chemically bonded",
                  },
                  {
                    id: "atoms_q17",
                    band: 3,
                    type: "mcq",
                    prompt:
                      "Why can a compound have completely different properties from the elements it's made from?",
                    options: [
                      "Compounds are just mixtures of their elements",
                      "Chemical bonding rearranges electrons and creates a new substance with its own properties",
                      "Compounds always keep the exact properties of each element",
                      "Properties only change when heat is added",
                    ],
                    answer:
                      "Chemical bonding rearranges electrons and creates a new substance with its own properties",
                  },
                ],
              },
              {
                id: "atoms-bonding",
                name: "Chemical Bonding",
                blurb: "How atoms bond together, and what ions are",
                learn: [
                  {
                    band: 1,
                    title: "Chemical bonding",
                    body: "Atoms bond by interacting with their outer-shell electrons, forming the compounds and molecules that make up most matter.",
                    children: [
                      {
                        band: 2,
                        title: "Ionic bonding",
                        body: "Electrons transfer from one atom to another, creating charged particles (ions) that attract each other — like in table salt, sodium chloride.",
                      },
                      {
                        band: 2,
                        title: "Covalent bonding",
                        body: "Atoms share electrons rather than transferring them, common between non-metal atoms — like in water or carbon dioxide.",
                      },
                      {
                        band: 2,
                        title: "Ions",
                        body: "Atoms that have gained or lost electrons, giving them an overall electrical charge — positive if they lost electrons, negative if they gained them.",
                      },
                    ],
                  },
                  {
                    band: 3,
                    title: "Predicting bond type from the elements involved",
                    body: "As a rule of thumb, metal + non-metal tends to form ionic bonds (electron transfer), while non-metal + non-metal tends to form covalent bonds (electron sharing). This is because metals lose outer electrons easily, while non-metals both tend to hold onto or attract electrons strongly.",
                  },
                ],
                questions: [
                  {
                    id: "atoms_q9",
                    band: 1,
                    type: "mcq",
                    prompt:
                      "Bonding where electrons are transferred between atoms is called:",
                    options: [
                      "Covalent bonding",
                      "Ionic bonding",
                      "Metallic bonding",
                      "Nuclear bonding",
                    ],
                    answer: "Ionic bonding",
                  },
                  {
                    id: "atoms_q10",
                    band: 1,
                    type: "text",
                    prompt:
                      "What word describes bonding where atoms share electrons?",
                    answers: ["covalent", "covalent bonding"],
                  },
                  {
                    id: "atoms_q11",
                    band: 1,
                    type: "mcq",
                    prompt:
                      "An atom that has lost or gained electrons, giving it a charge, is called a(n):",
                    options: ["Isotope", "Ion", "Molecule", "Nucleus"],
                    answer: "Ion",
                  },
                  {
                    id: "atoms_q12",
                    band: 1,
                    type: "mcq",
                    prompt: "An atom that loses electrons becomes:",
                    options: [
                      "Negatively charged",
                      "Positively charged",
                      "Neutral",
                      "Radioactive",
                    ],
                    answer: "Positively charged",
                  },
                  {
                    id: "atoms_q13",
                    band: 1,
                    type: "text",
                    prompt:
                      "What is the common name of the compound formed by ionic bonding between sodium and chlorine?",
                    answers: ["sodium chloride", "salt", "table salt"],
                  },
                  {
                    id: "atoms_q14",
                    band: 1,
                    type: "mcq",
                    prompt: "Covalent bonding is most common between:",
                    options: [
                      "Two metal atoms",
                      "Two non-metal atoms",
                      "A metal and a noble gas",
                      "Only identical atoms",
                    ],
                    answer: "Two non-metal atoms",
                  },
                  {
                    id: "atoms_q18",
                    band: 3,
                    type: "mcq",
                    prompt:
                      "Magnesium (a metal) reacts with oxygen (a non-metal). What type of bonding would you predict forms?",
                    options: [
                      "Covalent bonding",
                      "Ionic bonding",
                      "No bonding is possible",
                      "Metallic bonding only",
                    ],
                    answer: "Ionic bonding",
                  },
                ],
              },
            ],
          },
          {
            id: "reactions",
            name: "Chemical Reactions",
            blurb:
              "How substances transform into new ones, and how to spot it happening",
            submodules: [
              {
                id: "react-basics",
                name: "How Reactions Work",
                blurb:
                  "What happens to atoms in a reaction, and how to spot one",
                learn: [
                  {
                    band: 1,
                    title:
                      "Chemical reactions rearrange atoms into new substances",
                    body: "In a chemical reaction, the atoms in the starting substances are rearranged to form different substances. No atoms are created or destroyed.",
                    children: [
                      {
                        band: 2,
                        title: "Reactants and products",
                        body: "Reactants are the substances you start with. Products are the new substances formed by the reaction.",
                      },
                      {
                        band: 2,
                        title: "Conservation of mass",
                        body: "Because atoms are only rearranged, not created or destroyed, the total mass of the products equals the total mass of the reactants.",
                      },
                    ],
                  },
                  {
                    band: 1,
                    title: "Signs of a chemical reaction",
                    body: "Several clues suggest a chemical reaction has happened, rather than just a physical change.",
                    children: [
                      {
                        band: 2,
                        title: "Common signs",
                        body: "A colour change, gas produced (bubbles), a temperature change, a solid forming from two liquids (precipitate), or a new smell.",
                      },
                    ],
                  },
                  {
                    band: 3,
                    title: "Using conservation of mass to check a reaction",
                    body: "Because atoms are only rearranged in a reaction, chemists can use conservation of mass to check their work: if the reactants weigh 50g total, the products must also weigh 50g total (accounting for any gas that escapes). A mismatch usually means a mistake in measurement or an unaccounted-for gas.",
                  },
                ],
                questions: [
                  {
                    id: "react_q1",
                    band: 1,
                    type: "mcq",
                    prompt:
                      "In a chemical reaction, the substances you start with are called:",
                    options: [
                      "Products",
                      "Reactants",
                      "Compounds",
                      "Catalysts",
                    ],
                    answer: "Reactants",
                  },
                  {
                    id: "react_q2",
                    band: 1,
                    type: "mcq",
                    prompt:
                      "The new substances formed by a chemical reaction are called:",
                    options: ["Reactants", "Elements", "Products", "Mixtures"],
                    answer: "Products",
                  },
                  {
                    id: "react_q4",
                    band: 1,
                    type: "mcq",
                    prompt:
                      "Which of these is a typical sign a chemical reaction has occurred?",
                    options: [
                      "The substance changes shape only",
                      "A gas is produced (bubbles)",
                      "The substance is moved to another container",
                      "The substance is cut into smaller pieces",
                    ],
                    answer: "A gas is produced (bubbles)",
                  },
                  {
                    id: "react_q5",
                    band: 1,
                    type: "text",
                    prompt:
                      "What is the name of the law stating atoms are neither created nor destroyed in a reaction?",
                    answers: [
                      "law of conservation of mass",
                      "conservation of mass",
                    ],
                  },
                  {
                    id: "react_q15",
                    band: 3,
                    type: "mcq",
                    prompt:
                      "50g of reactants undergo a reaction in a sealed container and no gas escapes. What should the total mass of products be?",
                    options: [
                      "Less than 50g",
                      "Exactly 50g",
                      "More than 50g",
                      "It depends on the temperature",
                    ],
                    answer: "Exactly 50g",
                  },
                ],
              },
              {
                id: "react-types",
                name: "Types of Reactions",
                blurb:
                  "Combustion and neutralisation, two reactions you'll see everywhere",
                learn: [
                  {
                    band: 1,
                    title: "Types of reactions",
                    body: "Some reaction types come up again and again in everyday contexts.",
                    children: [
                      {
                        band: 2,
                        title: "Combustion",
                        body: "A fuel reacts with oxygen, releasing energy — usually as heat and light. Produces carbon dioxide and water when the fuel contains carbon and hydrogen.",
                      },
                      {
                        band: 2,
                        title: "Neutralisation",
                        body: "An acid reacts with a base, producing a salt and water. This is why antacids (a base) settle an acidic stomach.",
                      },
                    ],
                  },
                  {
                    band: 3,
                    title: "Why incomplete combustion is dangerous",
                    body: "Complete combustion (plenty of oxygen) produces carbon dioxide and water. With limited oxygen, incomplete combustion can instead produce carbon monoxide — a colourless, odourless gas that's dangerous because it binds to haemoglobin more strongly than oxygen does, starving the body of oxygen.",
                  },
                ],
                questions: [
                  {
                    id: "react_q6",
                    band: 1,
                    type: "mcq",
                    prompt:
                      "A neutralisation reaction between an acid and a base produces a salt and:",
                    options: ["Oxygen", "Carbon dioxide", "Water", "Fuel"],
                    answer: "Water",
                  },
                  {
                    id: "react_q7",
                    band: 1,
                    type: "mcq",
                    prompt: "A combustion reaction needs fuel plus which gas?",
                    options: [
                      "Nitrogen",
                      "Oxygen",
                      "Carbon dioxide",
                      "Hydrogen",
                    ],
                    answer: "Oxygen",
                  },
                  {
                    id: "react_q16",
                    band: 3,
                    type: "mcq",
                    prompt:
                      "Burning a fuel in a poorly ventilated room can produce dangerous carbon monoxide instead of carbon dioxide. Why?",
                    options: [
                      "There is too much oxygen available",
                      "There isn't enough oxygen for complete combustion",
                      "The fuel contains no carbon",
                      "Carbon monoxide is produced only from neutralisation",
                    ],
                    answer: "There isn't enough oxygen for complete combustion",
                  },
                ],
              },
              {
                id: "react-energy",
                name: "Energy Changes",
                blurb: "Whether a reaction releases or absorbs energy",
                learn: [
                  {
                    band: 1,
                    title: "Energy changes in reactions",
                    body: "Reactions either release or absorb energy from their surroundings.",
                    children: [
                      {
                        band: 2,
                        title: "Exothermic",
                        body: "Releases energy to the surroundings — the reaction mixture feels hotter. Combustion is exothermic.",
                      },
                      {
                        band: 2,
                        title: "Endothermic",
                        body: "Absorbs energy from the surroundings — the reaction mixture feels colder.",
                      },
                    ],
                  },
                  {
                    band: 3,
                    title: "Why some reactions need a 'kick start'",
                    body: "Even a strongly exothermic reaction, like combustion, usually needs an initial input of energy (like a spark) to get going — this is called activation energy. Once started, the reaction releases enough energy to sustain itself, but without that first push, many exothermic reactions won't begin at all.",
                  },
                ],
                questions: [
                  {
                    id: "react_q3",
                    band: 1,
                    type: "text",
                    prompt:
                      "What word describes a reaction that releases heat energy to its surroundings?",
                    answers: ["exothermic"],
                  },
                  {
                    id: "react_q8",
                    band: 1,
                    type: "text",
                    prompt:
                      "What word describes a reaction that absorbs energy from its surroundings?",
                    answers: ["endothermic"],
                  },
                  {
                    id: "react_q17",
                    band: 3,
                    type: "mcq",
                    prompt:
                      "Petrol releases a large amount of energy when it burns, yet a match is needed to start the fire. Why?",
                    options: [
                      "Petrol is actually endothermic",
                      "The reaction needs an initial input of activation energy to begin",
                      "Petrol never burns without added oxygen",
                      "The match cools the petrol first",
                    ],
                    answer:
                      "The reaction needs an initial input of activation energy to begin",
                  },
                ],
              },
              {
                id: "react-acidsbases",
                name: "Acids, Bases & pH",
                blurb: "How acids and bases behave, and how the pH scale works",
                learn: [
                  {
                    band: 1,
                    title: "Acids, bases, and pH",
                    body: "Acids and bases are common classes of chemicals, defined by how they behave in reactions and where they sit on the pH scale.",
                    children: [
                      {
                        band: 2,
                        title: "Acids",
                        body: "Substances with a pH below 7 that taste sour and react with metals and bases — like vinegar and lemon juice.",
                      },
                      {
                        band: 2,
                        title: "Bases and alkalis",
                        body: "Bases have a pH above 7 and react with acids — like soap and baking soda. A base that dissolves in water is called an alkali.",
                      },
                      {
                        band: 2,
                        title: "The pH scale",
                        body: "Runs from 0 (strongly acidic) to 14 (strongly basic), with 7 being neutral — like pure water.",
                      },
                    ],
                  },
                  {
                    band: 3,
                    title: "Why pH is a logarithmic scale",
                    body: "Each whole step on the pH scale represents a tenfold change in acidity — a solution of pH 3 is ten times more acidic than pH 4, and a hundred times more acidic than pH 5. This is why even a small pH change (like ocean acidification) can represent a large real change in acidity.",
                  },
                ],
                questions: [
                  {
                    id: "react_q9",
                    band: 1,
                    type: "mcq",
                    prompt: "On the pH scale, a substance with pH 3 is:",
                    options: [
                      "Strongly basic",
                      "Acidic",
                      "Neutral",
                      "Radioactive",
                    ],
                    answer: "Acidic",
                  },
                  {
                    id: "react_q10",
                    band: 1,
                    type: "text",
                    prompt: "What pH value is considered neutral?",
                    answers: ["7"],
                  },
                  {
                    id: "react_q11",
                    band: 1,
                    type: "mcq",
                    prompt: "Which of these typically has a pH above 7?",
                    options: ["Lemon juice", "Vinegar", "Soap", "Battery acid"],
                    answer: "Soap",
                  },
                  {
                    id: "react_q12",
                    band: 1,
                    type: "text",
                    prompt: "What do we call a base that dissolves in water?",
                    answers: ["alkali"],
                  },
                  {
                    id: "react_q13",
                    band: 1,
                    type: "mcq",
                    prompt:
                      "Acids typically react with metals to produce hydrogen gas and:",
                    options: ["A salt", "Only water", "Oxygen", "Carbon"],
                    answer: "A salt",
                  },
                  {
                    id: "react_q14",
                    band: 1,
                    type: "mcq",
                    prompt: "What does the pH scale measure?",
                    options: [
                      "The temperature of a substance",
                      "How acidic or basic a substance is",
                      "The mass of a substance",
                      "The energy released in a reaction",
                    ],
                    answer: "How acidic or basic a substance is",
                  },
                  {
                    id: "react_q18",
                    band: 3,
                    type: "mcq",
                    prompt:
                      "A solution changes from pH 6 to pH 4. How much more acidic has it become?",
                    options: [
                      "Twice as acidic",
                      "Ten times as acidic",
                      "One hundred times as acidic",
                      "It hasn't become more acidic",
                    ],
                    answer: "One hundred times as acidic",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "physics",
        name: "Physics",
        blurb: "Forces, energy, and motion",
        accent: "physics",
        available: true,
        modules: [
          {
            id: "forces",
            name: "Forces & Motion",
            blurb: "How pushes and pulls change the way objects move",
            submodules: [
              {
                id: "forces-basics",
                name: "Forces & Motion Basics",
                blurb: "What a force is, and balanced vs unbalanced forces",
                learn: [
                  {
                    band: 1,
                    title: "Forces change the motion of objects",
                    body: "A force is a push or a pull, measured in Newtons (N). Forces can start, stop, speed up, slow down, or change the direction of an object's motion.",
                    children: [
                      {
                        band: 2,
                        title: "Balanced vs unbalanced forces",
                        body: "When forces on an object are balanced, its motion doesn't change. When forces are unbalanced, the object accelerates in the direction of the larger force.",
                      },
                    ],
                  },
                  {
                    band: 3,
                    title: "Why 'balanced' doesn't mean 'no forces'",
                    body: "A book resting on a table has forces acting on it — gravity pulling down, the table pushing up — but they're equal and opposite, so they cancel out and the book stays still. Balanced forces mean zero net force, not zero forces.",
                  },
                ],
                questions: [
                  {
                    id: "forces_q1",
                    band: 1,
                    type: "mcq",
                    prompt: "What unit is force measured in?",
                    options: ["Watts", "Joules", "Newtons", "Metres"],
                    answer: "Newtons",
                  },
                  {
                    id: "forces_q5",
                    band: 1,
                    type: "mcq",
                    prompt:
                      "If the forces acting on an object are balanced, its motion:",
                    options: [
                      "Speeds up",
                      "Stays the same (no acceleration)",
                      "Always stops immediately",
                      "Reverses direction",
                    ],
                    answer: "Stays the same (no acceleration)",
                  },
                  {
                    id: "forces_q15",
                    band: 3,
                    type: "mcq",
                    prompt:
                      "A box sits still on the floor. Which statement correctly describes the forces acting on it?",
                    options: [
                      "No forces are acting on the box at all",
                      "Forces are acting on the box, but they are balanced so there's no net force",
                      "Only gravity acts on the box",
                      "The forces are unbalanced but too small to notice",
                    ],
                    answer:
                      "Forces are acting on the box, but they are balanced so there's no net force",
                  },
                ],
              },
              {
                id: "forces-types",
                name: "Common Types of Forces",
                blurb: "Gravity, friction, and the other named forces",
                learn: [
                  {
                    band: 1,
                    title: "Common types of forces",
                    body: "Several named forces show up again and again in physics problems.",
                    children: [
                      {
                        band: 2,
                        title: "Gravity",
                        body: "A force that pulls objects with mass toward each other — on Earth, this pulls everything toward the ground.",
                      },
                      {
                        band: 2,
                        title: "Friction",
                        body: "A force that opposes motion between two surfaces in contact, converting motion energy into heat.",
                      },
                      {
                        band: 2,
                        title: "Applied force",
                        body: "A direct push or pull on an object, like kicking a ball.",
                      },
                      {
                        band: 2,
                        title: "Normal force",
                        body: "A support force a surface exerts perpendicular to itself, stopping objects from falling through it.",
                      },
                    ],
                  },
                  {
                    band: 3,
                    title: "Why friction can be helpful or a hindrance",
                    body: "Friction is usually described as opposing motion, but that's exactly why it's essential for walking, gripping, and braking — without it, tyres would spin uselessly and shoes would slide out from under you. Engineers deliberately increase friction in some places (brake pads) and reduce it in others (lubricated engine parts).",
                  },
                ],
                questions: [
                  {
                    id: "forces_q2",
                    band: 1,
                    type: "text",
                    prompt:
                      "What force opposes motion between two touching surfaces?",
                    answers: ["friction"],
                  },
                  {
                    id: "forces_q7",
                    band: 1,
                    type: "text",
                    prompt:
                      "What force pulls objects with mass toward the Earth?",
                    answers: ["gravity"],
                  },
                  {
                    id: "forces_q16",
                    band: 3,
                    type: "mcq",
                    prompt:
                      "Why do car tyres need friction with the road in order for the car to move forward?",
                    options: [
                      "Friction pushes the car forward directly",
                      "Friction between the tyre and road lets the spinning tyre grip and propel the car instead of just spinning in place",
                      "Friction has no effect on how cars move",
                      "Cars move forward only because of gravity",
                    ],
                    answer:
                      "Friction between the tyre and road lets the spinning tyre grip and propel the car instead of just spinning in place",
                  },
                ],
              },
              {
                id: "forces-newton",
                name: "Newton's Laws",
                blurb: "The three rules that govern how forces affect motion",
                learn: [
                  {
                    band: 1,
                    title: "Newton's laws, simplified",
                    body: "Isaac Newton described three rules that govern how forces affect motion.",
                    children: [
                      {
                        band: 2,
                        title: "First law — inertia",
                        body: "An object stays at rest, or keeps moving at a constant velocity, unless acted on by an unbalanced force.",
                      },
                      {
                        band: 2,
                        title: "Second law — F = m × a",
                        body: "The bigger the force, or the smaller the mass, the bigger the acceleration produced.",
                      },
                      {
                        band: 2,
                        title: "Third law — action and reaction",
                        body: "Every force has an equal and opposite reaction force — when you push on a wall, it pushes back on you just as hard.",
                      },
                    ],
                  },
                  {
                    band: 3,
                    title: "Why a rocket can push against empty space",
                    body: "Newton's third law explains how rockets work even in the vacuum of space: the rocket pushes exhaust gas backward, and the gas pushes the rocket forward with an equal and opposite force. Unlike a car, a rocket doesn't need to push against the ground or air — it only needs something to push against itself, which is its own expelled fuel.",
                  },
                ],
                questions: [
                  {
                    id: "forces_q3",
                    band: 1,
                    type: "mcq",
                    prompt: "Newton's first law is also known as the law of:",
                    options: ["Momentum", "Inertia", "Gravity", "Energy"],
                    answer: "Inertia",
                  },
                  {
                    id: "forces_q6",
                    band: 1,
                    type: "mcq",
                    prompt: "F = m × a describes which of Newton's laws?",
                    options: [
                      "First law",
                      "Second law",
                      "Third law",
                      "None of them",
                    ],
                    answer: "Second law",
                  },
                  {
                    id: "forces_q17",
                    band: 3,
                    type: "mcq",
                    prompt:
                      "How can a rocket accelerate in the vacuum of space, where there's no air to push against?",
                    options: [
                      "It pushes against the vacuum itself",
                      "Expelling exhaust gas backward creates an equal and opposite forward force on the rocket",
                      "Rockets can't actually accelerate in space",
                      "Gravity from nearby planets pushes the rocket forward",
                    ],
                    answer:
                      "Expelling exhaust gas backward creates an equal and opposite forward force on the rocket",
                  },
                ],
              },
              {
                id: "forces-motion",
                name: "Speed, Velocity & Acceleration",
                blurb: "How these three related terms differ",
                learn: [
                  {
                    band: 1,
                    title: "Speed, velocity, and acceleration",
                    body: "These three terms are related but describe motion differently.",
                    children: [
                      {
                        band: 2,
                        title: "Speed",
                        body: "How fast something travels: distance ÷ time.",
                      },
                      {
                        band: 2,
                        title: "Velocity",
                        body: "Speed with a direction — 20 km/h north, for example.",
                      },
                      {
                        band: 2,
                        title: "Acceleration",
                        body: "How quickly velocity changes over time — can mean speeding up, slowing down, or changing direction.",
                      },
                    ],
                  },
                  {
                    band: 3,
                    title: "Why velocity can change without a change in speed",
                    body: "A car driving at a constant 50 km/h around a roundabout has a constant speed, but its velocity is constantly changing, because velocity includes direction and the direction is changing every instant. This means the car is accelerating even though the speedometer never moves.",
                  },
                ],
                questions: [
                  {
                    id: "forces_q4",
                    band: 1,
                    type: "text",
                    prompt: "Complete the formula: speed = distance ÷ ___",
                    answers: ["time"],
                  },
                  {
                    id: "forces_q8",
                    band: 1,
                    type: "mcq",
                    prompt: "Velocity differs from speed because it includes:",
                    options: ["Direction", "Mass", "Time", "Distance"],
                    answer: "Direction",
                  },
                  {
                    id: "forces_q18",
                    band: 3,
                    type: "mcq",
                    prompt:
                      "A car travels around a circular track at a perfectly constant speed. Is it accelerating?",
                    options: [
                      "No, because its speed never changes",
                      "Yes, because its direction is constantly changing, so its velocity is changing",
                      "No, acceleration only applies to speeding up",
                      "Only if it also changes speed",
                    ],
                    answer:
                      "Yes, because its direction is constantly changing, so its velocity is changing",
                  },
                ],
              },
              {
                id: "forces-massweight",
                name: "Mass & Weight",
                blurb: "Why mass and weight aren't the same thing",
                learn: [
                  {
                    band: 1,
                    title: "Mass and weight",
                    body: "Mass and weight are often confused but describe different things in physics.",
                    children: [
                      {
                        band: 2,
                        title: "Mass",
                        body: "The amount of matter in an object, measured in kilograms. An object's mass stays the same wherever it is in the universe.",
                      },
                      {
                        band: 2,
                        title: "Weight",
                        body: "The force of gravity acting on an object's mass, measured in Newtons. Weight changes depending on the strength of gravity.",
                      },
                      {
                        band: 2,
                        title: "Weight on other worlds",
                        body: "An astronaut has the same mass on the Moon as on Earth, but weighs less there because the Moon's gravity is weaker.",
                      },
                    ],
                  },
                  {
                    band: 3,
                    title:
                      "Why mass and weight get measured with different tools",
                    body: "A balance scale compares an object's mass to known masses and gives the same reading anywhere, because it's cancelling out gravity's effect on both sides. Spring/bathroom scales, however, measure weight — the force gravity exerts — so the same object would read differently on the Moon even though its mass hasn't changed.",
                  },
                ],
                questions: [
                  {
                    id: "forces_q9",
                    band: 1,
                    type: "mcq",
                    prompt: "What is the amount of matter in an object called?",
                    options: ["Weight", "Mass", "Force", "Density"],
                    answer: "Mass",
                  },
                  {
                    id: "forces_q10",
                    band: 1,
                    type: "text",
                    prompt:
                      "Weight is a force caused by what acting on an object's mass?",
                    answers: ["gravity"],
                  },
                  {
                    id: "forces_q11",
                    band: 1,
                    type: "mcq",
                    prompt: "Which unit is weight measured in?",
                    options: ["Kilograms", "Newtons", "Litres", "Metres"],
                    answer: "Newtons",
                  },
                  {
                    id: "forces_q12",
                    band: 1,
                    type: "mcq",
                    prompt:
                      "An astronaut's mass on the Moon, compared to on Earth, is:",
                    options: [
                      "Much greater",
                      "The same",
                      "Much smaller",
                      "Zero",
                    ],
                    answer: "The same",
                  },
                  {
                    id: "forces_q13",
                    band: 2,
                    type: "mcq",
                    prompt:
                      "Why does an astronaut weigh less on the Moon than on Earth?",
                    options: [
                      "The Moon has more mass than Earth",
                      "The Moon's gravity is weaker",
                      "The astronaut's mass decreases on the Moon",
                      "There is no air on the Moon",
                    ],
                    answer: "The Moon's gravity is weaker",
                  },
                  {
                    id: "forces_q14",
                    band: 1,
                    type: "text",
                    prompt: "What unit is mass measured in?",
                    answers: ["kilograms", "kg"],
                  },
                  {
                    id: "forces_q19",
                    band: 3,
                    type: "mcq",
                    prompt:
                      "Why would an object give the same reading on a balance scale on both Earth and the Moon, but a different reading on a spring/bathroom scale?",
                    options: [
                      "Balance scales measure weight, spring scales measure mass",
                      "Balance scales compare mass directly and cancel out gravity's effect; spring scales measure the force of gravity (weight), which changes with location",
                      "Both types of scale always give identical readings everywhere",
                      "The object's mass changes on the Moon",
                    ],
                    answer:
                      "Balance scales compare mass directly and cancel out gravity's effect; spring scales measure the force of gravity (weight), which changes with location",
                  },
                ],
              },
            ],
          },
          {
            id: "energy",
            name: "Energy & Waves",
            blurb:
              "How energy is transferred and transformed, and how waves carry it",
            submodules: [
              {
                id: "energy-forms",
                name: "Forms & Transformation of Energy",
                blurb:
                  "The law of conservation of energy, and everyday transformation examples",
                learn: [
                  {
                    band: 1,
                    title:
                      "Energy is transferred and transformed, never created or destroyed",
                    body: "This is the law of conservation of energy. Energy exists in many forms, and can change from one form to another, but the total amount stays the same.",
                    children: [
                      {
                        band: 2,
                        title: "Common forms of energy",
                        body: "Kinetic (movement), potential (stored, due to position or state), thermal (heat), light, sound, electrical, and chemical energy.",
                      },
                    ],
                  },
                  {
                    band: 1,
                    title: "Energy transformation examples",
                    body: "Everyday events involve chains of energy transformation.",
                    children: [
                      {
                        band: 2,
                        title: "A falling object",
                        body: "Gravitational potential energy converts into kinetic energy as an object falls and speeds up.",
                      },
                      {
                        band: 2,
                        title: "A torch",
                        body: "Chemical energy in the battery converts to electrical energy, then to light energy (and some heat).",
                      },
                    ],
                  },
                  {
                    band: 3,
                    title:
                      "Tracking energy through a whole chain, not just one step",
                    body: "In a real device, energy transforms through several steps and some is 'lost' as heat at each one — a torch converts chemical energy to electrical to light, but some is wasted as heat at the battery and bulb. Conservation of energy still holds; the 'lost' energy hasn't vanished, it's just spread into a less useful form.",
                  },
                ],
                questions: [
                  {
                    id: "energy_q1",
                    band: 1,
                    type: "mcq",
                    prompt: "The energy of a moving object is called:",
                    options: [
                      "Potential energy",
                      "Kinetic energy",
                      "Thermal energy",
                      "Chemical energy",
                    ],
                    answer: "Kinetic energy",
                  },
                  {
                    id: "energy_q2",
                    band: 1,
                    type: "text",
                    prompt:
                      "Energy stored due to an object's height is called gravitational ___ energy.",
                    answers: [
                      "potential",
                      "gravitational potential energy",
                      "potential energy",
                    ],
                  },
                  {
                    id: "energy_q3",
                    band: 1,
                    type: "mcq",
                    prompt:
                      "The law of conservation of energy states that energy cannot be created or:",
                    options: [
                      "Transferred",
                      "Destroyed",
                      "Transformed",
                      "Measured",
                    ],
                    answer: "Destroyed",
                  },
                  {
                    id: "energy_q15",
                    band: 3,
                    type: "mcq",
                    prompt:
                      "An incandescent light bulb converts most of its electrical energy into heat rather than light. According to the law of conservation of energy, what has happened to that 'wasted' energy?",
                    options: [
                      "It has been destroyed",
                      "It has been transformed into a less useful form (heat) rather than disappearing",
                      "It was never really electrical energy to begin with",
                      "It escaped the law of conservation of energy",
                    ],
                    answer:
                      "It has been transformed into a less useful form (heat) rather than disappearing",
                  },
                ],
              },
              {
                id: "energy-waves",
                name: "Waves",
                blurb: "How waves carry energy, and how they behave",
                learn: [
                  {
                    band: 1,
                    title: "Waves carry energy",
                    body: "Waves transfer energy from one place to another without transferring matter.",
                    children: [
                      {
                        band: 2,
                        title: "Transverse waves",
                        body: "The medium vibrates perpendicular to the direction the wave travels — light and other electromagnetic waves are transverse.",
                      },
                      {
                        band: 2,
                        title: "Longitudinal waves",
                        body: "The medium vibrates parallel to the direction the wave travels — sound is a longitudinal wave.",
                      },
                      {
                        band: 2,
                        title: "Wave properties",
                        body: "Amplitude (height of the wave, related to energy), wavelength (distance between repeating points), and frequency (waves passing per second).",
                      },
                    ],
                  },
                  {
                    band: 1,
                    title: "Wave behaviours",
                    body: "Waves interact with materials and boundaries in predictable ways.",
                    children: [
                      {
                        band: 2,
                        title: "Reflection",
                        body: "A wave bounces off a surface, like an echo or a mirror image.",
                      },
                      {
                        band: 2,
                        title: "Refraction",
                        body: "A wave bends as it passes from one medium into another, changing speed — like light bending as it enters water.",
                      },
                    ],
                  },
                  {
                    band: 3,
                    title:
                      "Why louder sound needs more energy, not just more amplitude",
                    body: "A wave's amplitude and the energy it carries are directly linked — doubling a wave's amplitude actually delivers four times the energy, not just twice. This is why turning music up 'a little' on a dial can require a surprisingly large increase in the amplifier's power output.",
                  },
                ],
                questions: [
                  {
                    id: "energy_q4",
                    band: 1,
                    type: "text",
                    prompt:
                      "What is the term for the distance between two successive wave crests?",
                    answers: ["wavelength"],
                  },
                  {
                    id: "energy_q5",
                    band: 1,
                    type: "mcq",
                    prompt: "Sound waves are an example of which type of wave?",
                    options: [
                      "Transverse",
                      "Longitudinal",
                      "Electromagnetic",
                      "Standing",
                    ],
                    answer: "Longitudinal",
                  },
                  {
                    id: "energy_q6",
                    band: 1,
                    type: "mcq",
                    prompt: "Light waves are an example of which type of wave?",
                    options: [
                      "Longitudinal",
                      "Transverse",
                      "Mechanical only",
                      "None — light isn't a wave",
                    ],
                    answer: "Transverse",
                  },
                  {
                    id: "energy_q7",
                    band: 1,
                    type: "text",
                    prompt:
                      "What is the name for a wave bouncing off a surface?",
                    answers: ["reflection"],
                  },
                  {
                    id: "energy_q8",
                    band: 1,
                    type: "mcq",
                    prompt:
                      "Unlike light, sound needs what in order to travel?",
                    options: [
                      "A vacuum",
                      "A medium (like air or water)",
                      "Darkness",
                      "Gravity",
                    ],
                    answer: "A medium (like air or water)",
                  },
                  {
                    id: "energy_q16",
                    band: 3,
                    type: "mcq",
                    prompt:
                      "If a sound wave's amplitude is doubled, what happens to the energy it carries?",
                    options: [
                      "It stays the same",
                      "It doubles",
                      "It quadruples (becomes 4x)",
                      "It is halved",
                    ],
                    answer: "It quadruples (becomes 4x)",
                  },
                ],
              },
              {
                id: "energy-resources",
                name: "Energy Resources",
                blurb:
                  "Renewable vs non-renewable, and how electricity is generated",
                learn: [
                  {
                    band: 1,
                    title: "Energy resources",
                    body: "Much of the energy we use is converted from resources found in or on the Earth, which can be grouped by how quickly they're replaced.",
                    children: [
                      {
                        band: 2,
                        title: "Non-renewable resources",
                        body: "Fossil fuels like coal, oil, and gas form over millions of years and are used up far faster than they're replaced.",
                      },
                      {
                        band: 2,
                        title: "Renewable resources",
                        body: "Sources like solar, wind, and hydro power are naturally replenished on a human timescale and don't run out.",
                      },
                      {
                        band: 2,
                        title: "Electricity generation",
                        body: "Most electricity is generated by transforming another form of energy — such as the kinetic energy of falling water or spinning turbines — into electrical energy.",
                      },
                    ],
                  },
                  {
                    band: 3,
                    title:
                      "Why 'renewable' doesn't automatically mean 'no environmental impact'",
                    body: "Renewable sources won't run out, but they can still have environmental costs — hydro dams can flood habitats and block fish migration, and wind turbines can affect bird populations. Evaluating an energy source means weighing renewability against its full environmental footprint, not just whether it runs out.",
                  },
                ],
                questions: [
                  {
                    id: "energy_q9",
                    band: 1,
                    type: "mcq",
                    prompt:
                      "Which of these is a non-renewable energy resource?",
                    options: ["Solar", "Wind", "Coal", "Hydro"],
                    answer: "Coal",
                  },
                  {
                    id: "energy_q10",
                    band: 1,
                    type: "text",
                    prompt:
                      "What word describes energy resources that are naturally replenished and won't run out?",
                    answers: ["renewable"],
                  },
                  {
                    id: "energy_q11",
                    band: 1,
                    type: "mcq",
                    prompt: "Fossil fuels form over what kind of timescale?",
                    options: [
                      "A few days",
                      "A few years",
                      "Millions of years",
                      "They don't form naturally",
                    ],
                    answer: "Millions of years",
                  },
                  {
                    id: "energy_q12",
                    band: 1,
                    type: "mcq",
                    prompt:
                      "Hydroelectric power generates electricity mainly from the kinetic energy of:",
                    options: [
                      "Wind",
                      "Falling or flowing water",
                      "Sunlight",
                      "Burning coal",
                    ],
                    answer: "Falling or flowing water",
                  },
                  {
                    id: "energy_q13",
                    band: 1,
                    type: "text",
                    prompt:
                      "Name a renewable energy source that uses sunlight directly.",
                    answers: ["solar", "solar power", "solar energy"],
                  },
                  {
                    id: "energy_q14",
                    band: 2,
                    type: "mcq",
                    prompt: "Why are fossil fuels considered non-renewable?",
                    options: [
                      "They are too expensive to mine",
                      "They are used up far faster than they form",
                      "They produce no energy",
                      "They are illegal to use",
                    ],
                    answer: "They are used up far faster than they form",
                  },
                  {
                    id: "energy_q17",
                    band: 3,
                    type: "mcq",
                    prompt:
                      "Which statement best reflects a genuine environmental trade-off of a renewable energy source?",
                    options: [
                      "Renewable sources have zero environmental impact by definition",
                      "A hydro dam is renewable but can still flood habitats and disrupt fish migration",
                      "Solar panels never require any resources to manufacture",
                      "Wind power cannot be considered renewable",
                    ],
                    answer:
                      "A hydro dam is renewable but can still flood habitats and disrupt fish migration",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "earthspace",
        name: "Earth & Space",
        blurb: "Our planet, its systems, and the universe beyond",
        accent: "earth",
        available: true,
        modules: [
          {
            id: "earthsystems",
            name: "Earth Systems & Climate",
            blurb: "How Earth's systems interact, and how climate is changing",
            submodules: [
              {
                id: "earthsys-spheres",
                name: "Earth's Interacting Spheres",
                blurb: "The four systems that make up Earth",
                learn: [
                  {
                    band: 1,
                    title:
                      "Earth's systems interact to shape climate and environment",
                    body: "Earth can be thought of as four interacting systems, or spheres, that constantly exchange matter and energy with each other.",
                    children: [
                      {
                        band: 2,
                        title: "Geosphere",
                        body: "The solid Earth — rock, soil, and the structures beneath the surface.",
                      },
                      {
                        band: 2,
                        title: "Hydrosphere",
                        body: "All the water in Earth's system — oceans, rivers, lakes, groundwater, and ice.",
                      },
                      {
                        band: 2,
                        title: "Atmosphere",
                        body: "The layer of gases surrounding Earth, mostly nitrogen and oxygen.",
                      },
                      {
                        band: 2,
                        title: "Biosphere",
                        body: "All living things and the ecosystems they form.",
                      },
                    ],
                  },
                  {
                    band: 3,
                    title: "How the spheres interact in one event",
                    body: "A volcanic eruption shows all four spheres interacting at once: the geosphere releases ash and gas, the atmosphere carries and disperses it, the hydrosphere's rainfall washes ash into rivers, and the biosphere is affected as ash blocks sunlight and settles on plants. Most natural events involve several spheres simultaneously, not just one.",
                  },
                ],
                questions: [
                  {
                    id: "earthsys_q5",
                    band: 1,
                    type: "text",
                    prompt:
                      "What is the name for the sphere of Earth's system made of rock and soil?",
                    answers: ["geosphere"],
                  },
                  {
                    id: "earthsys_q7",
                    band: 1,
                    type: "text",
                    prompt:
                      "What is the name for all the water in Earth's system — oceans, rivers, and ice?",
                    answers: ["hydrosphere"],
                  },
                  {
                    id: "earthsys_q8",
                    band: 1,
                    type: "mcq",
                    prompt:
                      "The term for all living things and ecosystems on Earth is the:",
                    options: [
                      "Geosphere",
                      "Hydrosphere",
                      "Atmosphere",
                      "Biosphere",
                    ],
                    answer: "Biosphere",
                  },
                  {
                    id: "earthsys_q15",
                    band: 3,
                    type: "mcq",
                    prompt:
                      "A volcanic eruption releases ash that spreads through the sky and eventually settles into nearby rivers, affecting fish. Which spheres are involved in this single event?",
                    options: [
                      "Only the geosphere",
                      "The geosphere, atmosphere, hydrosphere, and biosphere all together",
                      "Only the atmosphere and biosphere",
                      "Spheres cannot interact with each other",
                    ],
                    answer:
                      "The geosphere, atmosphere, hydrosphere, and biosphere all together",
                  },
                ],
              },
              {
                id: "earthsys-atmosphere",
                name: "Atmosphere & Greenhouse Effect",
                blurb: "How the atmosphere keeps Earth warm",
                learn: [
                  {
                    band: 1,
                    title: "The atmosphere and the greenhouse effect",
                    body: "Gases in the atmosphere trap some of the Sun's heat, keeping Earth warm enough to support life.",
                    children: [
                      {
                        band: 2,
                        title: "The greenhouse effect",
                        body: "Certain gases (like carbon dioxide and methane) trap heat that would otherwise escape to space — a natural process essential for life on Earth.",
                      },
                      {
                        band: 2,
                        title: "The enhanced greenhouse effect",
                        body: "Human activities, especially burning fossil fuels, have increased greenhouse gas levels, trapping more heat than the natural process alone.",
                      },
                    ],
                  },
                  {
                    band: 3,
                    title:
                      "Why the greenhouse effect is necessary but the enhanced version is a problem",
                    body: "Without any greenhouse effect, Earth's average temperature would be far below freezing — the natural process is essential for life. The concern with climate change isn't the greenhouse effect itself, but that human emissions have intensified it faster than ecosystems can adapt.",
                  },
                ],
                questions: [
                  {
                    id: "earthsys_q1",
                    band: 1,
                    type: "mcq",
                    prompt:
                      "Which gas makes up the largest percentage of Earth's atmosphere?",
                    options: [
                      "Oxygen",
                      "Carbon dioxide",
                      "Nitrogen",
                      "Hydrogen",
                    ],
                    answer: "Nitrogen",
                  },
                  {
                    id: "earthsys_q2",
                    band: 1,
                    type: "text",
                    prompt:
                      "What is the name for the natural process where gases trap heat in the atmosphere?",
                    answers: ["greenhouse effect", "the greenhouse effect"],
                  },
                  {
                    id: "earthsys_q16",
                    band: 3,
                    type: "mcq",
                    prompt:
                      "Why is it inaccurate to say the greenhouse effect itself is 'bad' for the planet?",
                    options: [
                      "The greenhouse effect doesn't actually exist",
                      "The natural greenhouse effect keeps Earth warm enough for life; it's the human-enhanced, faster version that causes problems",
                      "Greenhouse gases have no effect on temperature",
                      "Only carbon dioxide is a greenhouse gas",
                    ],
                    answer:
                      "The natural greenhouse effect keeps Earth warm enough for life; it's the human-enhanced, faster version that causes problems",
                  },
                ],
              },
              {
                id: "earthsys-climate",
                name: "Weather, Climate & Climate Change",
                blurb:
                  "The difference between weather and climate, and how climate is changing",
                learn: [
                  {
                    band: 1,
                    title: "Weather vs climate",
                    body: "These two terms are often confused but describe different timescales.",
                    children: [
                      {
                        band: 2,
                        title: "Weather",
                        body: "The short-term state of the atmosphere in a place — today's temperature, rain, or wind.",
                      },
                      {
                        band: 2,
                        title: "Climate",
                        body: "The long-term average weather pattern of a region, typically measured over decades.",
                      },
                    ],
                  },
                  {
                    band: 1,
                    title: "Climate change",
                    body: "Rising greenhouse gas levels are changing Earth's climate at an unusually fast rate.",
                    children: [
                      {
                        band: 2,
                        title: "Causes",
                        body: "Burning fossil fuels (coal, oil, gas) for energy releases carbon dioxide, the main driver of recent warming.",
                      },
                      {
                        band: 2,
                        title: "Effects",
                        body: "Rising sea levels, more extreme weather events, and disruption to ecosystems that can't adapt quickly enough.",
                      },
                    ],
                  },
                  {
                    band: 3,
                    title:
                      "Why a single cold day doesn't disprove climate change",
                    body: "Weather is short-term and highly variable, so one unusually cold week says little about long-term climate trends — a region can have a record-cold day in a year that's still among the warmest on record globally. Climate trends are judged from decades of data, not individual weather events.",
                  },
                ],
                questions: [
                  {
                    id: "earthsys_q3",
                    band: 1,
                    type: "mcq",
                    prompt:
                      "The main difference between weather and climate is:",
                    options: [
                      "Weather only happens at the coast",
                      "Climate is short-term, weather is long-term",
                      "Weather is short-term, climate is a long-term average",
                      "There is no real difference",
                    ],
                    answer:
                      "Weather is short-term, climate is a long-term average",
                  },
                  {
                    id: "earthsys_q4",
                    band: 1,
                    type: "mcq",
                    prompt:
                      "Burning fossil fuels mainly increases atmospheric levels of:",
                    options: [
                      "Oxygen",
                      "Nitrogen",
                      "Carbon dioxide",
                      "Water vapour only",
                    ],
                    answer: "Carbon dioxide",
                  },
                  {
                    id: "earthsys_q6",
                    band: 1,
                    type: "mcq",
                    prompt:
                      "Which of these is a typical effect of climate change?",
                    options: [
                      "Falling sea levels",
                      "More extreme weather events",
                      "A cooler, more stable climate",
                      "Reduced greenhouse gas levels",
                    ],
                    answer: "More extreme weather events",
                  },
                  {
                    id: "earthsys_q17",
                    band: 3,
                    type: "mcq",
                    prompt:
                      "Someone argues 'climate change can't be real, it snowed heavily where I live last week.' What's the flaw in this reasoning?",
                    options: [
                      "Snow never happens on a warming planet",
                      "A single local weather event doesn't reflect long-term global climate trends",
                      "The person is completely correct",
                      "Weather and climate are the same thing",
                    ],
                    answer:
                      "A single local weather event doesn't reflect long-term global climate trends",
                  },
                ],
              },
              {
                id: "earthsys-hazards",
                name: "Rock Cycle & Natural Hazards",
                blurb: "Tectonic plates, earthquakes, and volcanoes",
                learn: [
                  {
                    band: 1,
                    title: "The rock cycle and natural hazards",
                    body: "Aotearoa New Zealand sits on the boundary of two tectonic plates, making rock formation and natural hazards especially relevant here.",
                    children: [
                      {
                        band: 2,
                        title: "Tectonic plates",
                        body: "Earth's crust is broken into huge slabs called tectonic plates that slowly move, driven by heat from within the Earth.",
                      },
                      {
                        band: 2,
                        title: "Earthquakes",
                        body: "Occur when built-up stress along a plate boundary or fault line is suddenly released, causing the ground to shake.",
                      },
                      {
                        band: 2,
                        title: "Volcanoes",
                        body: "Form where molten rock (magma) rises through the crust, often near plate boundaries — New Zealand has several active volcanoes.",
                      },
                    ],
                  },
                  {
                    band: 3,
                    title: "Why plate boundaries produce different hazards",
                    body: "The type of hazard depends on how plates interact: where plates collide (convergent boundaries), one can be forced under the other, producing volcanoes and powerful earthquakes; where plates slide past each other (transform boundaries, like along much of Aotearoa's Alpine Fault), earthquakes occur without the volcanic activity.",
                  },
                ],
                questions: [
                  {
                    id: "earthsys_q9",
                    band: 1,
                    type: "mcq",
                    prompt:
                      "Earth's crust is broken into large, slowly moving slabs called:",
                    options: [
                      "Continents",
                      "Tectonic plates",
                      "Oceans",
                      "Biomes",
                    ],
                    answer: "Tectonic plates",
                  },
                  {
                    id: "earthsys_q10",
                    band: 1,
                    type: "text",
                    prompt:
                      "An earthquake happens when built-up stress along a fault is suddenly what?",
                    answers: ["released"],
                  },
                  {
                    id: "earthsys_q11",
                    band: 1,
                    type: "mcq",
                    prompt:
                      "Volcanoes form where molten rock, called ___, rises through the crust:",
                    options: ["Lava only", "Magma", "Basalt", "Granite"],
                    answer: "Magma",
                  },
                  {
                    id: "earthsys_q12",
                    band: 2,
                    type: "mcq",
                    prompt:
                      "Why does New Zealand experience frequent earthquakes?",
                    options: [
                      "It has no tectonic activity",
                      "It sits on a boundary between two tectonic plates",
                      "It is far from any plate boundary",
                      "Its atmosphere is unusually thick",
                    ],
                    answer: "It sits on a boundary between two tectonic plates",
                  },
                  {
                    id: "earthsys_q13",
                    band: 1,
                    type: "text",
                    prompt:
                      "What do we call molten rock once it reaches Earth's surface?",
                    answers: ["lava"],
                  },
                  {
                    id: "earthsys_q14",
                    band: 1,
                    type: "mcq",
                    prompt:
                      "What mainly drives the slow movement of tectonic plates?",
                    options: [
                      "Ocean currents",
                      "Heat from within the Earth",
                      "Wind patterns",
                      "Gravity from the Moon",
                    ],
                    answer: "Heat from within the Earth",
                  },
                  {
                    id: "earthsys_q18",
                    band: 3,
                    type: "mcq",
                    prompt:
                      "New Zealand's Alpine Fault is a transform boundary, where plates slide past each other rather than colliding. Based on this, which hazard would you expect it to produce?",
                    options: [
                      "Frequent volcanic eruptions but no earthquakes",
                      "Earthquakes, without the volcanic activity seen at colliding boundaries",
                      "Neither earthquakes nor volcanoes",
                      "Only tsunamis, never earthquakes",
                    ],
                    answer:
                      "Earthquakes, without the volcanic activity seen at colliding boundaries",
                  },
                ],
              },
            ],
          },
          {
            id: "solarsystem",
            name: "The Solar System & Beyond",
            blurb: "Earth's place among the planets, stars, and galaxies",
            submodules: [
              {
                id: "solar-system",
                name: "Our Solar System",
                blurb:
                  "What holds the solar system together, and its eight planets",
                learn: [
                  {
                    band: 1,
                    title:
                      "Earth is part of a solar system within a much larger universe",
                    body: "Our solar system consists of the Sun and everything that orbits it, held in place by gravity.",
                    children: [
                      {
                        band: 2,
                        title: "Gravity keeps planets in orbit",
                        body: "The Sun's gravity pulls on the planets, keeping them travelling in roughly circular paths instead of flying off in a straight line.",
                      },
                    ],
                  },
                  {
                    band: 1,
                    title: "Our solar system",
                    body: "Eight planets orbit the Sun, in order: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune.",
                    children: [
                      {
                        band: 2,
                        title: "Inner rocky planets",
                        body: "Mercury, Venus, Earth, and Mars are small, dense, and made mostly of rock.",
                      },
                      {
                        band: 2,
                        title: "Outer gas giants",
                        body: "Jupiter, Saturn, Uranus, and Neptune are much larger and made mostly of gas and ice.",
                      },
                    ],
                  },
                  {
                    band: 3,
                    title:
                      "Why orbits are stable, not falling in or flying away",
                    body: "A planet in orbit is constantly 'falling' toward the Sun due to gravity, but it's also moving sideways fast enough that it keeps missing — the curve of its fall matches the curve of the Sun's pull, producing a stable orbit rather than a collision or an escape into space.",
                  },
                ],
                questions: [
                  {
                    id: "solar_q1",
                    band: 1,
                    type: "mcq",
                    prompt: "What force keeps planets in orbit around the Sun?",
                    options: [
                      "Friction",
                      "Gravity",
                      "Magnetism",
                      "Air pressure",
                    ],
                    answer: "Gravity",
                  },
                  {
                    id: "solar_q3",
                    band: 1,
                    type: "mcq",
                    prompt: "Which planet is closest to the Sun?",
                    options: ["Venus", "Earth", "Mercury", "Mars"],
                    answer: "Mercury",
                  },
                  {
                    id: "solar_q8",
                    band: 1,
                    type: "text",
                    prompt:
                      "What term describes planets like Mercury, Venus, Earth, and Mars, made mostly of rock?",
                    answers: [
                      "rocky planets",
                      "terrestrial planets",
                      "rocky",
                      "terrestrial",
                    ],
                  },
                  {
                    id: "solar_q15",
                    band: 3,
                    type: "mcq",
                    prompt:
                      "Why doesn't Earth eventually spiral into the Sun, given that gravity is constantly pulling it inward?",
                    options: [
                      "Gravity from the Sun doesn't actually reach Earth",
                      "Earth's sideways orbital speed continuously balances the Sun's inward pull, keeping it in a stable orbit",
                      "Earth has its own force pushing it away from the Sun",
                      "The Sun's gravity switches on and off",
                    ],
                    answer:
                      "Earth's sideways orbital speed continuously balances the Sun's inward pull, keeping it in a stable orbit",
                  },
                ],
              },
              {
                id: "solar-earthmotion",
                name: "Earth's Motion",
                blurb: "Why we get day and night, and the seasons",
                learn: [
                  {
                    band: 1,
                    title: "Earth's motion",
                    body: "Two separate movements of Earth explain our days, years, and seasons.",
                    children: [
                      {
                        band: 2,
                        title: "Rotation",
                        body: "Earth spins on its axis once roughly every 24 hours, causing day and night.",
                      },
                      {
                        band: 2,
                        title: "Revolution and tilt",
                        body: "Earth orbits the Sun once every 365.25 days. Because Earth's axis is tilted, different hemispheres receive more direct sunlight at different times of year — causing the seasons.",
                      },
                    ],
                  },
                  {
                    band: 3,
                    title:
                      "Why NZ summer and northern-hemisphere winter happen together",
                    body: "Earth's axial tilt means that when the Southern Hemisphere is tilted toward the Sun, it receives more direct sunlight (summer), while the Northern Hemisphere is tilted away and gets less direct sunlight (winter) — both hemispheres share the same orbital position at that moment, but experience opposite seasons because of the tilt.",
                  },
                ],
                questions: [
                  {
                    id: "solar_q2",
                    band: 1,
                    type: "text",
                    prompt:
                      "Earth's spin on its axis causes which daily cycle?",
                    answers: ["day and night", "day/night", "day night"],
                  },
                  {
                    id: "solar_q4",
                    band: 1,
                    type: "mcq",
                    prompt: "The main cause of Earth's seasons is:",
                    options: [
                      "Earth's distance from the Sun changing a lot",
                      "Earth's axial tilt",
                      "The Moon's gravity",
                      "Changes in the Sun's brightness",
                    ],
                    answer: "Earth's axial tilt",
                  },
                  {
                    id: "solar_q7",
                    band: 1,
                    type: "mcq",
                    prompt:
                      "Roughly how long does one full orbit of the Sun take?",
                    options: ["24 hours", "30 days", "365 days", "10 years"],
                    answer: "365 days",
                  },
                  {
                    id: "solar_q16",
                    band: 3,
                    type: "mcq",
                    prompt:
                      "Why does New Zealand experience summer at the same time the Northern Hemisphere experiences winter?",
                    options: [
                      "Earth is closer to the Sun during NZ's summer",
                      "Earth's axial tilt means the Southern Hemisphere faces the Sun more directly while the Northern Hemisphere faces away, at the same point in Earth's orbit",
                      "The Sun moves closer to New Zealand specifically",
                      "New Zealand and the Northern Hemisphere orbit the Sun separately",
                    ],
                    answer:
                      "Earth's axial tilt means the Southern Hemisphere faces the Sun more directly while the Northern Hemisphere faces away, at the same point in Earth's orbit",
                  },
                ],
              },
              {
                id: "solar-beyond",
                name: "Beyond the Solar System",
                blurb:
                  "Stars, galaxies, and how astronomers measure the universe",
                learn: [
                  {
                    band: 1,
                    title: "Beyond the solar system",
                    body: "The Sun is just one star among billions, grouped into galaxies across the universe.",
                    children: [
                      {
                        band: 2,
                        title: "Stars and galaxies",
                        body: "A galaxy is a huge collection of stars, gas, and dust held together by gravity. Our Sun belongs to the Milky Way galaxy.",
                      },
                      {
                        band: 2,
                        title: "Light-years",
                        body: "Distances between stars are so vast that astronomers measure them in light-years — the distance light travels in one year.",
                      },
                    ],
                  },
                  {
                    band: 3,
                    title: "Why looking into space means looking into the past",
                    body: "Because light takes time to travel, seeing a star 100 light-years away means seeing light that left it 100 years ago — astronomers are effectively looking back in time, and some very distant objects they observe may no longer exist in their observed form today.",
                  },
                ],
                questions: [
                  {
                    id: "solar_q5",
                    band: 1,
                    type: "text",
                    prompt:
                      "What unit is used to measure distances between stars?",
                    answers: [
                      "light-year",
                      "light year",
                      "light-years",
                      "light years",
                    ],
                  },
                  {
                    id: "solar_q6",
                    band: 1,
                    type: "mcq",
                    prompt: "Our solar system's galaxy is called the:",
                    options: ["Andromeda", "Milky Way", "Solar Belt", "Orion"],
                    answer: "Milky Way",
                  },
                  {
                    id: "solar_q17",
                    band: 3,
                    type: "mcq",
                    prompt:
                      "A star is measured to be 4 light-years from Earth. What does this tell us about the light we currently see from it?",
                    options: [
                      "The light left the star 4 years ago and shows how it looked back then",
                      "The light shows exactly how the star looks right now",
                      "Light-years measure time, not distance, so this has no bearing on light",
                      "The star is only 4 kilometres away",
                    ],
                    answer:
                      "The light left the star 4 years ago and shows how it looked back then",
                  },
                ],
              },
              {
                id: "solar-moon",
                name: "The Moon & Eclipses",
                blurb: "Moon phases, and how eclipses happen",
                learn: [
                  {
                    band: 1,
                    title: "The Moon and eclipses",
                    body: "Earth's only natural satellite shapes some of our most familiar sky patterns.",
                    children: [
                      {
                        band: 2,
                        title: "Phases of the Moon",
                        body: "The Moon doesn't produce its own light — we see it because it reflects sunlight. As it orbits Earth, we see different amounts of its sunlit side, creating phases over about 29.5 days.",
                      },
                      {
                        band: 2,
                        title: "Solar eclipse",
                        body: "Occurs when the Moon passes directly between the Sun and Earth, blocking some or all of the Sun's light from a small area on Earth.",
                      },
                      {
                        band: 2,
                        title: "Lunar eclipse",
                        body: "Occurs when Earth passes directly between the Sun and the Moon, casting Earth's shadow onto the Moon.",
                      },
                    ],
                  },
                  {
                    band: 3,
                    title: "Why eclipses don't happen every month",
                    body: "The Moon orbits Earth roughly monthly, so you might expect an eclipse every month — but the Moon's orbit is slightly tilted relative to Earth's orbit around the Sun, so most months the Moon passes above or below the Sun-Earth line rather than directly across it. Eclipses only occur on the rare occasions all three line up precisely.",
                  },
                ],
                questions: [
                  {
                    id: "solar_q9",
                    band: 2,
                    type: "mcq",
                    prompt: "Why does the Moon appear to shine?",
                    options: [
                      "It produces its own light",
                      "It reflects sunlight",
                      "It reflects Earth's light",
                      "It is a small star",
                    ],
                    answer: "It reflects sunlight",
                  },
                  {
                    id: "solar_q10",
                    band: 1,
                    type: "text",
                    prompt:
                      "Roughly how many days does the Moon take to go through all its phases?",
                    answers: [
                      "29.5",
                      "29",
                      "29.5 days",
                      "29 days",
                      "a month",
                      "about a month",
                    ],
                  },
                  {
                    id: "solar_q11",
                    band: 1,
                    type: "mcq",
                    prompt: "A solar eclipse occurs when:",
                    options: [
                      "Earth passes between the Sun and Moon",
                      "The Moon passes between the Sun and Earth",
                      "The Sun passes between Earth and Moon",
                      "The Moon disappears completely",
                    ],
                    answer: "The Moon passes between the Sun and Earth",
                  },
                  {
                    id: "solar_q12",
                    band: 1,
                    type: "mcq",
                    prompt: "A lunar eclipse occurs when:",
                    options: [
                      "The Moon passes between the Sun and Earth",
                      "Earth passes between the Sun and Moon",
                      "The Moon leaves its orbit",
                      "The Sun goes dark",
                    ],
                    answer: "Earth passes between the Sun and Moon",
                  },
                  {
                    id: "solar_q13",
                    band: 1,
                    type: "text",
                    prompt: "What is Earth's only natural satellite called?",
                    answers: ["the moon", "moon"],
                  },
                  {
                    id: "solar_q14",
                    band: 1,
                    type: "mcq",
                    prompt: "During a lunar eclipse, what falls on the Moon?",
                    options: [
                      "Sunlight directly",
                      "Earth's shadow",
                      "The Moon's own shadow",
                      "Starlight only",
                    ],
                    answer: "Earth's shadow",
                  },
                  {
                    id: "solar_q18",
                    band: 3,
                    type: "mcq",
                    prompt:
                      "The Moon orbits Earth roughly once a month, yet solar and lunar eclipses don't happen every month. Why not?",
                    options: [
                      "The Moon only orbits Earth a few times a year",
                      "The Moon's orbit is tilted relative to Earth's orbit, so exact alignment with the Sun is rare",
                      "Eclipses actually do happen every month but are never visible",
                      "The Sun moves out of alignment, not the Moon",
                    ],
                    answer:
                      "The Moon's orbit is tilted relative to Earth's orbit, so exact alignment with the Sun is rare",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
};

/* ---------------------------------------------------------------------- */
/* State helpers                                                          */
/* ---------------------------------------------------------------------- */

function emptyState() {
  return { schemaVersion: SCHEMA_VERSION, progress: {} };
}

function getModuleProgress(state, subjectId, areaId, moduleId) {
  return (
    state.progress?.[subjectId]?.[areaId]?.[moduleId] || {
      questionStats: {},
      lastStudied: null,
    }
  );
}

function updateStat(prevStat, correct) {
  const prevEma = prevStat?.ema ?? null;
  const newEma =
    prevEma === null
      ? correct
        ? 100
        : 0
      : Math.round(prevEma * 0.65 + (correct ? 100 : 0) * 0.35);
  return {
    seen: (prevStat?.seen || 0) + 1,
    correct: (prevStat?.correct || 0) + (correct ? 1 : 0),
    ema: newEma,
  };
}

const MASTERY_THRESHOLD = 80;

function avg(nums) {
  const scored = nums.filter((s) => s !== null && s !== undefined);
  if (scored.length === 0) return null;
  return Math.round(scored.reduce((a, b) => a + b, 0) / scored.length);
}

/* --- Per-band scores -----------------------------------------------------
   Each mirrors the non-banded version below, but only considers content
   tagged with the given band. A submodule with no band-3 questions yet
   returns null for band 3, rather than counting as 0% - see CONTEXT.md. */

function submoduleBandScore(submodule, band, moduleProgress) {
  if (!submodule) return null;
  const qs = submodule.questions.filter((q) => bandOf(q) === band);
  if (qs.length === 0) return null;
  const stats = moduleProgress?.questionStats || {};
  let total = 0;
  for (const q of qs) total += stats[q.id]?.ema ?? 0;
  return Math.round(total / qs.length);
}

function moduleBandScore(module, band, moduleProgress) {
  if (!module || !module.submodules) return null;
  return avg(
    module.submodules.map((sm) => submoduleBandScore(sm, band, moduleProgress)),
  );
}

function areaBandScore(area, band, state, subjectId) {
  return avg(
    area.modules.map((m) =>
      moduleBandScore(
        m,
        band,
        getModuleProgress(state, subjectId, area.id, m.id),
      ),
    ),
  );
}

function subjectBandScore(subject, band, state) {
  return avg(
    subject.areas
      .filter((a) => a.available)
      .map((a) => areaBandScore(a, band, state, subject.id)),
  );
}

/* --- Overall scores (average across whichever bands have content) ------- */

function submoduleScore(submodule, moduleProgress) {
  if (!submodule) return null;
  return avg(
    BANDS.map((b) => submoduleBandScore(submodule, b.level, moduleProgress)),
  );
}

function moduleScore(module, moduleProgress) {
  if (!module || !module.submodules || module.submodules.length === 0)
    return null;
  return avg(module.submodules.map((sm) => submoduleScore(sm, moduleProgress)));
}

function areaScore(area, state, subjectId) {
  return avg(
    area.modules.map((m) =>
      moduleScore(m, getModuleProgress(state, subjectId, area.id, m.id)),
    ),
  );
}

function subjectScore(subject, state) {
  return avg(
    subject.areas
      .filter((a) => a.available)
      .map((a) => areaScore(a, state, subject.id)),
  );
}

function daysAgo(ts) {
  if (!ts) return "Not started yet";
  const diff = Math.floor((Date.now() - ts) / 86400000);
  if (diff <= 0) return "Studied today";
  if (diff === 1) return "Studied yesterday";
  return `Studied ${diff}d ago`;
}

/* ---------------------------------------------------------------------- */
/* Small building blocks                                                  */
/* ---------------------------------------------------------------------- */

function Ring({ value, size = 44, stroke = 5, color = "var(--accent)" }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = value === null ? 0 : Math.max(0, Math.min(100, value));
  const offset = c - (pct / 100) * c;
  return (
    <svg width={size} height={size} style={{ display: "block" }}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="var(--border)"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={value === null ? "var(--border)" : color}
        strokeWidth={stroke}
        strokeDasharray={c}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dashoffset 0.5s ease" }}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="central"
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: size * 0.28,
          fill: "var(--ink)",
        }}
      >
        {value === null ? "–" : value}
      </text>
    </svg>
  );
}

function Bar({ value, color = "var(--accent)" }) {
  const pct = value === null ? 0 : value;
  return (
    <div
      style={{
        background: "var(--border)",
        borderRadius: 4,
        height: 6,
        width: "100%",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${pct}%`,
          height: "100%",
          background: value === null ? "var(--border)" : color,
          borderRadius: 4,
          transition: "width 0.4s ease",
        }}
      />
    </div>
  );
}

function Header({ title, subtitle, onBack, onSettings }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "18px 20px 14px",
      }}
    >
      {onBack ? (
        <button onClick={onBack} style={styles.iconBtn} aria-label="Back">
          <ChevronLeft size={22} color="var(--ink)" />
        </button>
      ) : (
        <div style={{ width: 38 }} />
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: "'Fraunces', serif",
            fontSize: 20,
            fontWeight: 600,
            color: "var(--ink)",
            lineHeight: 1.2,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {title}
        </div>
        {subtitle && (
          <div style={{ fontSize: 13, color: "var(--ink-dim)", marginTop: 2 }}>
            {subtitle}
          </div>
        )}
      </div>
      {onSettings && (
        <button
          onClick={onSettings}
          style={styles.iconBtn}
          aria-label="Settings"
        >
          <SettingsIcon size={20} color="var(--ink)" />
        </button>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Band (Achieved / Merit / Excellence) components                        */
/* ---------------------------------------------------------------------- */

function BandBadge({ level, accent = "accent", size = "sm" }) {
  const band = BANDS.find((b) => b.level === level) || BANDS[0];
  const small = size === "sm";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: small ? 18 : 22,
        height: small ? 18 : 22,
        padding: small ? "0 5px" : "0 7px",
        borderRadius: 999,
        border: `1px solid var(--${accent})`,
        color: `var(--${accent})`,
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: small ? 10.5 : 12,
        fontWeight: 600,
        flexShrink: 0,
      }}
      title={band.label}
    >
      {band.code}
    </span>
  );
}

/* Single-select row of band tabs, used wherever "which band am I looking
   at" needs to be obvious and the content should filter cumulatively
   (Learn) or per-band (Mode choice). `scores` is { [level]: number|null }. */
function BandTabs({ selected, onSelect, accent, scores = {} }) {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      {BANDS.map((b) => {
        const active = selected === b.level;
        const score = scores[b.level] ?? null;
        return (
          <button
            key={b.level}
            onClick={() => onSelect(b.level)}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              padding: "10px 6px",
              borderRadius: 12,
              border: `1px solid ${active ? `var(--${accent})` : "var(--border)"}`,
              background: active ? `var(--${accent})` : "var(--surface)",
              cursor: "pointer",
            }}
          >
            <span
              style={{
                fontSize: 12.5,
                fontWeight: 600,
                color: active ? "#12181F" : "var(--ink)",
              }}
            >
              {b.label}
            </span>
            <span
              style={{
                fontSize: 11,
                fontFamily: "'IBM Plex Mono', monospace",
                color: active ? "#12181F" : "var(--ink-dim)",
                opacity: active ? 0.75 : 1,
              }}
            >
              {score === null ? "–" : `${score}%`}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* Multi-select checkboxes, used before a Revise session to let the student
   choose exactly which band(s) they're tested on. `counts` is
   { [level]: number } of how many questions exist at that band in the
   current pool, so a band with 0 questions can be disabled. */
function BandCheckboxes({ selectedSet, onToggle, accent, counts = {} }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {BANDS.map((b) => {
        const count = counts[b.level] ?? 0;
        const disabled = count === 0;
        const checked = selectedSet.has(b.level) && !disabled;
        return (
          <button
            key={b.level}
            onClick={() => !disabled && onToggle(b.level)}
            disabled={disabled}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              width: "100%",
              padding: "12px 14px",
              borderRadius: 12,
              border: `1px solid ${checked ? `var(--${accent})` : "var(--border)"}`,
              background: checked ? "var(--surface-raised)" : "var(--surface)",
              opacity: disabled ? 0.4 : 1,
              cursor: disabled ? "default" : "pointer",
              textAlign: "left",
            }}
          >
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: 6,
                border: `1.5px solid ${checked ? `var(--${accent})` : "var(--border)"}`,
                background: checked ? `var(--${accent})` : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {checked && <CheckCircle2 size={14} color="#12181F" />}
            </div>
            <BandBadge level={b.level} accent={accent} />
            <div style={{ flex: 1 }}>
              <div
                style={{ fontSize: 14.5, fontWeight: 600, color: "var(--ink)" }}
              >
                {b.label}
              </div>
              <div
                style={{ fontSize: 12, color: "var(--ink-dim)", marginTop: 1 }}
              >
                {disabled
                  ? "No questions yet"
                  : `${count} question${count === 1 ? "" : "s"}`}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Screens                                                                */
/* ---------------------------------------------------------------------- */

function HomeScreen({ state, onOpenSubject, onSettings }) {
  const subject = SUBJECTS.science;
  const score = subjectScore(subject, state);

  return (
    <div>
      <div style={{ padding: "28px 20px 8px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 12.5,
                color: "var(--accent)",
                fontWeight: 600,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              Orbit
            </div>
            <div
              style={{
                fontFamily: "'Fraunces', serif",
                fontSize: 30,
                fontWeight: 600,
                color: "var(--ink)",
                lineHeight: 1.15,
                maxWidth: 240,
              }}
            >
              What are we learning today?
            </div>
            <div
              style={{ fontSize: 14, color: "var(--ink-dim)", marginTop: 8 }}
            >
              Pick a subject to get started
            </div>
          </div>
          <button
            onClick={onSettings}
            style={{ ...styles.iconBtn, marginTop: 4 }}
            aria-label="Settings"
          >
            <SettingsIcon size={20} color="var(--ink)" />
          </button>
        </div>
      </div>

      <div style={{ padding: "20px 20px 0" }}>
        <button
          onClick={() => onOpenSubject(subject.id)}
          style={styles.subjectCard}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 12,
                  color: "var(--accent)",
                  fontWeight: 600,
                  letterSpacing: 0.3,
                }}
              >
                {subject.tagline}
              </div>
              <div
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: 24,
                  fontWeight: 600,
                  color: "var(--ink)",
                  marginTop: 4,
                }}
              >
                {subject.name}
              </div>
              <div
                style={{ fontSize: 13, color: "var(--ink-dim)", marginTop: 6 }}
              >
                {subject.areas.filter((a) => a.available).length} of{" "}
                {subject.areas.length} areas available
              </div>
            </div>
            <Ring value={score} size={52} />
          </div>
        </button>

        <div style={styles.comingSoonCard}>
          <div
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: 17,
              color: "var(--ink-dim)",
            }}
          >
            More subjects coming soon
          </div>
        </div>
      </div>
    </div>
  );
}

function AreaScreen({ subject, state, onOpenArea, onBack, onSettings }) {
  return (
    <div>
      <Header
        title={subject.name}
        subtitle="Choose an area to study"
        onBack={onBack}
        onSettings={onSettings}
      />
      <div
        style={{
          padding: "8px 20px 20px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
        }}
      >
        {subject.areas.map((area) => {
          const score = area.available
            ? areaScore(area, state, subject.id)
            : null;
          return (
            <button
              key={area.id}
              disabled={!area.available}
              onClick={() => area.available && onOpenArea(area.id)}
              style={{
                ...styles.areaCard,
                opacity: area.available ? 1 : 0.5,
                cursor: area.available ? "pointer" : "default",
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: `var(--${area.accent})`,
                  marginBottom: 10,
                }}
              />
              <div
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: 17,
                  fontWeight: 600,
                  color: "var(--ink)",
                }}
              >
                {area.name}
              </div>
              <div
                style={{
                  fontSize: 12.5,
                  color: "var(--ink-dim)",
                  marginTop: 4,
                  lineHeight: 1.4,
                }}
              >
                {area.blurb}
              </div>
              <div
                style={{
                  marginTop: 14,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                {area.available ? (
                  <Bar value={score} color={`var(--${area.accent})`} />
                ) : (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      fontSize: 12,
                      color: "var(--ink-dim)",
                    }}
                  >
                    <Lock size={12} /> Coming soon
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ModuleListScreen({
  subject,
  area,
  state,
  onOpenModule,
  onBack,
  onSettings,
}) {
  return (
    <div>
      <Header
        title={area.name}
        subtitle={`${area.modules.length} modules`}
        onBack={onBack}
        onSettings={onSettings}
      />
      <div
        style={{
          padding: "8px 20px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {area.modules.map((mod) => {
          const progress = getModuleProgress(
            state,
            subject.id,
            area.id,
            mod.id,
          );
          const score = moduleScore(mod, progress);
          return (
            <button
              key={mod.id}
              onClick={() => onOpenModule(mod.id)}
              style={styles.moduleRow}
            >
              <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
                <div
                  style={{ fontSize: 16, fontWeight: 600, color: "var(--ink)" }}
                >
                  {mod.name}
                </div>
                <div
                  style={{
                    fontSize: 12.5,
                    color: "var(--ink-dim)",
                    marginTop: 3,
                    lineHeight: 1.4,
                  }}
                >
                  {mod.blurb}
                </div>
                <div
                  style={{
                    fontSize: 11.5,
                    color: "var(--ink-dim)",
                    marginTop: 8,
                    fontFamily: "'IBM Plex Mono', monospace",
                  }}
                >
                  {daysAgo(progress.lastStudied)}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Ring value={score} size={40} color={`var(--${area.accent})`} />
                <ChevronRight size={18} color="var(--ink-dim)" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SubmoduleListScreen({
  subject,
  area,
  module,
  state,
  onOpenSubmodule,
  onReviseAll,
  onBack,
  onSettings,
}) {
  const progress = getModuleProgress(state, subject.id, area.id, module.id);
  const overallScore = moduleScore(module, progress);
  // "Mastered" badge reflects Achieved-band mastery specifically - the
  // NCEA pass threshold - even though Merit/Excellence scores are shown
  // alongside for the student aiming higher.
  const masteredCount = module.submodules.filter((sm) => {
    const s = submoduleBandScore(sm, 1, progress);
    return s !== null && s >= MASTERY_THRESHOLD;
  }).length;

  return (
    <div>
      <Header
        title={module.name}
        subtitle={area.name}
        onBack={onBack}
        onSettings={onSettings}
      />
      <div style={{ padding: "4px 20px 8px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 18,
          }}
        >
          <Ring
            value={overallScore}
            size={52}
            color={`var(--${area.accent})`}
          />
          <div>
            <div style={{ fontSize: 13, color: "var(--ink-dim)" }}>
              {masteredCount} of {module.submodules.length} topics mastered
            </div>
            <div
              style={{ fontSize: 12.5, color: "var(--ink-dim)", marginTop: 2 }}
            >
              {daysAgo(progress.lastStudied)}
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          padding: "0 20px 12px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {module.submodules.map((sm, i) => {
          const achievedScore = submoduleBandScore(sm, 1, progress);
          const mastered =
            achievedScore !== null && achievedScore >= MASTERY_THRESHOLD;
          return (
            <button
              key={sm.id}
              onClick={() => onOpenSubmodule(sm.id)}
              style={styles.moduleRow}
            >
              <div
                style={{
                  ...styles.submoduleIndex,
                  background: mastered
                    ? `var(--${area.accent})`
                    : "var(--surface-raised)",
                  borderColor: mastered
                    ? `var(--${area.accent})`
                    : "var(--border)",
                }}
              >
                {mastered ? (
                  <CheckCircle2 size={16} color="#12181F" />
                ) : (
                  <span
                    style={{
                      fontSize: 12.5,
                      color: "var(--ink-dim)",
                      fontFamily: "'IBM Plex Mono', monospace",
                    }}
                  >
                    {i + 1}
                  </span>
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
                <div
                  style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)" }}
                >
                  {sm.name}
                </div>
                <div
                  style={{
                    fontSize: 12.5,
                    color: "var(--ink-dim)",
                    marginTop: 3,
                    lineHeight: 1.4,
                  }}
                >
                  {sm.blurb}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ display: "flex", gap: 4 }}>
                  {BANDS.map((b) => (
                    <div
                      key={b.level}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <Ring
                        value={submoduleBandScore(sm, b.level, progress)}
                        size={26}
                        stroke={3}
                        color={`var(--${area.accent})`}
                      />
                      <span
                        style={{
                          fontSize: 9,
                          color: "var(--ink-dim)",
                          fontFamily: "'IBM Plex Mono', monospace",
                        }}
                      >
                        {b.code}
                      </span>
                    </div>
                  ))}
                </div>
                <ChevronRight size={18} color="var(--ink-dim)" />
              </div>
            </button>
          );
        })}
      </div>
      <div style={{ padding: "8px 20px 20px" }}>
        <button onClick={onReviseAll} style={styles.secondaryBtn}>
          <Brain size={16} /> Revise this whole module
        </button>
      </div>
    </div>
  );
}

function ModeChoiceScreen({
  area,
  submodule,
  state,
  subjectId,
  moduleId,
  onLearn,
  onRevise,
  onBack,
  onSettings,
}) {
  const progress = getModuleProgress(state, subjectId, area.id, moduleId);
  const [selectedBand, setSelectedBand] = useState(1);
  const scores = Object.fromEntries(
    BANDS.map((b) => [
      b.level,
      submoduleBandScore(submodule, b.level, progress),
    ]),
  );
  const score = scores[selectedBand];
  const bandLabel = BANDS.find((b) => b.level === selectedBand).label;

  return (
    <div>
      <Header
        title={submodule.name}
        subtitle={area.name}
        onBack={onBack}
        onSettings={onSettings}
      />
      <div style={{ padding: "12px 20px 20px" }}>
        <div style={{ marginBottom: 16 }}>
          <BandTabs
            selected={selectedBand}
            onSelect={setSelectedBand}
            accent={area.accent}
            scores={scores}
          />
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 24,
          }}
        >
          <Ring value={score} size={56} color={`var(--${area.accent})`} />
          <div>
            <div style={{ fontSize: 13, color: "var(--ink-dim)" }}>
              {bandLabel} proficiency
            </div>
            <div
              style={{ fontSize: 12.5, color: "var(--ink-dim)", marginTop: 2 }}
            >
              {score === null
                ? "No questions at this band yet"
                : score >= MASTERY_THRESHOLD
                  ? "Mastered"
                  : "Keep going"}
            </div>
          </div>
        </div>

        <button
          onClick={() => onLearn(selectedBand)}
          style={{ ...styles.modeBtn, marginBottom: 12 }}
        >
          <BookOpen size={22} color={`var(--${area.accent})`} />
          <div style={{ flex: 1, textAlign: "left" }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: "var(--ink)" }}>
              Learn
            </div>
            <div
              style={{ fontSize: 12.5, color: "var(--ink-dim)", marginTop: 2 }}
            >
              Work through this topic from the big picture down to the details,
              up to {bandLabel} level
            </div>
          </div>
          <ChevronRight size={18} color="var(--ink-dim)" />
        </button>

        <button onClick={onRevise} style={styles.modeBtn}>
          <Brain size={22} color={`var(--${area.accent})`} />
          <div style={{ flex: 1, textAlign: "left" }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: "var(--ink)" }}>
              Revise
            </div>
            <div
              style={{ fontSize: 12.5, color: "var(--ink-dim)", marginTop: 2 }}
            >
              Choose which band(s) to be tested on and update your proficiency
              score
            </div>
          </div>
          <ChevronRight size={18} color="var(--ink-dim)" />
        </button>
      </div>
    </div>
  );
}

function teaser(text, max = 78) {
  if (!text) return "";
  return text.length > max ? text.slice(0, max).trim() + "…" : text;
}

function LearnNode({ node, accent, depth, maxBand }) {
  const [open, setOpen] = useState(false);
  if (bandOf(node) > maxBand) return null;
  const visibleChildren = (node.children || []).filter(
    (c) => bandOf(c) <= maxBand,
  );
  const hasChildren = visibleChildren.length > 0;
  return (
    <div style={{ marginLeft: depth > 0 ? 16 : 0 }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          ...styles.learnNodeBtn,
          borderLeft: depth > 0 ? `2px solid var(--${accent})` : "none",
          paddingLeft: depth > 0 ? 14 : 16,
        }}
      >
        <div style={{ flex: 1, textAlign: "left" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {bandOf(node) > 1 && (
              <BandBadge level={bandOf(node)} accent={accent} />
            )}
            <div
              style={{
                fontSize: depth === 0 ? 16 : 14.5,
                fontWeight: 600,
                color: "var(--ink)",
              }}
            >
              {node.title}
            </div>
          </div>
          <div
            style={{
              fontSize: 13.5,
              color: "var(--ink-dim)",
              marginTop: 6,
              lineHeight: 1.55,
            }}
          >
            {open ? node.body : teaser(node.body)}
          </div>
        </div>
        {hasChildren && (
          <ChevronDown
            size={16}
            color="var(--ink-dim)"
            style={{
              transform: open ? "rotate(180deg)" : "none",
              transition: "transform 0.2s",
              flexShrink: 0,
              marginTop: 3,
            }}
          />
        )}
      </button>
      {open && hasChildren && (
        <div
          style={{
            marginTop: 6,
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          {visibleChildren.map((child, i) => (
            <LearnNode
              key={i}
              node={child}
              accent={accent}
              depth={depth + 1}
              maxBand={maxBand}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function LearnScreen({ area, submodule, initialBand, onBack, onSettings }) {
  const [maxBand, setMaxBand] = useState(initialBand || 1);
  const visibleTopNodes = submodule.learn.filter((n) => bandOf(n) <= maxBand);
  return (
    <div>
      <Header
        title={submodule.name}
        subtitle="Learn"
        onBack={onBack}
        onSettings={onSettings}
      />
      <div style={{ padding: "0 20px 8px" }}>
        <BandTabs
          selected={maxBand}
          onSelect={setMaxBand}
          accent={area.accent}
        />
        <div
          style={{
            fontSize: 12,
            color: "var(--ink-dim)",
            marginTop: 8,
            lineHeight: 1.4,
          }}
        >
          Showing content up to {BANDS.find((b) => b.level === maxBand).label}{" "}
          level
        </div>
      </div>
      <div
        style={{
          padding: "12px 20px 32px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {visibleTopNodes.map((node, i) => (
          <LearnNode
            key={i}
            node={node}
            accent={area.accent}
            depth={0}
            maxBand={maxBand}
          />
        ))}
      </div>
    </div>
  );
}

function normalizeAnswer(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ");
}

function isTextCorrect(input, acceptedAnswers) {
  const norm = normalizeAnswer(input);
  if (!norm) return false;
  return acceptedAnswers.some((a) => normalizeAnswer(a) === norm);
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* Shown before a Revise session starts. Lets the student tick exactly
   which band(s) they want to be tested on; "module" here is whatever
   pool of questions is being revised (a single submodule, or the
   flattened "revise this whole module" pool). */
function ReviseSetupScreen({ area, module, onStart, onBack, onSettings }) {
  const [selectedSet, setSelectedSet] = useState(() => new Set([1, 2, 3]));
  const counts = Object.fromEntries(
    BANDS.map((b) => [
      b.level,
      module.questions.filter((q) => bandOf(q) === b.level).length,
    ]),
  );
  const toggle = (level) => {
    setSelectedSet((prev) => {
      const next = new Set(prev);
      if (next.has(level)) next.delete(level);
      else next.add(level);
      return next;
    });
  };
  const selectedCount = BANDS.filter(
    (b) => selectedSet.has(b.level) && counts[b.level] > 0,
  ).reduce((sum, b) => sum + counts[b.level], 0);
  const canStart = selectedCount > 0;

  return (
    <div>
      <Header
        title={module.name}
        subtitle="Choose bands to revise"
        onBack={onBack}
        onSettings={onSettings}
      />
      <div style={{ padding: "8px 20px 20px" }}>
        <BandCheckboxes
          selectedSet={selectedSet}
          onToggle={toggle}
          accent={area.accent}
          counts={counts}
        />
        <button
          onClick={() => canStart && onStart(Array.from(selectedSet))}
          disabled={!canStart}
          style={{
            ...styles.primaryBtn,
            width: "100%",
            marginTop: 20,
            opacity: canStart ? 1 : 0.5,
            cursor: canStart ? "pointer" : "default",
          }}
        >
          {canStart
            ? `Start (${selectedCount} question${selectedCount === 1 ? "" : "s"})`
            : "Select at least one band"}
        </button>
      </div>
    </div>
  );
}

function ReviseScreen({
  area,
  module,
  bands,
  subjectId,
  onBack,
  onSettings,
  onFinish,
}) {
  const [order] = useState(() =>
    shuffle(module.questions.filter((q) => bands.includes(bandOf(q)))),
  );
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [textValue, setTextValue] = useState("");
  const [answered, setAnswered] = useState(false);
  const [wasCorrect, setWasCorrect] = useState(false);
  const [results, setResults] = useState({}); // questionId -> bool
  const [optionOrder, setOptionOrder] = useState(() =>
    order[0].type === "mcq" ? shuffle(order[0].options) : [],
  );
  const [done, setDone] = useState(false);

  const q = order[index];
  const correctCount = Object.values(results).filter(Boolean).length;

  const selectAnswer = (opt) => {
    if (answered) return;
    const correct = opt === q.answer;
    setSelected(opt);
    setWasCorrect(correct);
    setAnswered(true);
    setResults((r) => ({ ...r, [q.id]: correct }));
  };

  const submitText = () => {
    if (answered || !textValue.trim()) return;
    const correct = isTextCorrect(textValue, q.answers);
    setWasCorrect(correct);
    setAnswered(true);
    setResults((r) => ({ ...r, [q.id]: correct }));
  };

  const next = () => {
    if (index + 1 >= order.length) {
      setDone(true);
      onFinish(results);
      return;
    }
    const nextIndex = index + 1;
    const nextQ = order[nextIndex];
    setIndex(nextIndex);
    setSelected(null);
    setTextValue("");
    setAnswered(false);
    setWasCorrect(false);
    setOptionOrder(nextQ.type === "mcq" ? shuffle(nextQ.options) : []);
  };

  if (done) {
    const sessionScore = Math.round((correctCount / order.length) * 100);
    return (
      <div>
        <Header
          title={module.name}
          subtitle="Session complete"
          onBack={onBack}
          onSettings={onSettings}
        />
        <div style={{ padding: "24px 20px", textAlign: "center" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: 18,
            }}
          >
            <Ring
              value={sessionScore}
              size={90}
              stroke={7}
              color={`var(--${area.accent})`}
            />
          </div>
          <div
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: 20,
              fontWeight: 600,
              color: "var(--ink)",
            }}
          >
            {correctCount} of {order.length} correct
          </div>
          <div
            style={{
              fontSize: 13.5,
              color: "var(--ink-dim)",
              marginTop: 8,
              lineHeight: 1.5,
            }}
          >
            Your proficiency score has been updated. Keep revising to reinforce
            what you don't recall yet.
          </div>
          <button
            onClick={onBack}
            style={{ ...styles.primaryBtn, marginTop: 24, width: "100%" }}
          >
            Back to module
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header
        title={module.name}
        subtitle={`Question ${index + 1} of ${order.length}`}
        onBack={onBack}
        onSettings={onSettings}
      />
      <div style={{ padding: "12px 20px 28px" }}>
        {bands.length > 1 && (
          <div style={{ marginBottom: 10 }}>
            <BandBadge level={bandOf(q)} accent={area.accent} size="lg" />
          </div>
        )}
        <div
          style={{
            fontFamily: "'Fraunces', serif",
            fontSize: 19,
            fontWeight: 600,
            color: "var(--ink)",
            lineHeight: 1.4,
            marginBottom: 20,
          }}
        >
          {q.prompt}
        </div>
        {q.type === "mcq" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {optionOrder.map((opt) => {
              let bg = "var(--surface-raised)";
              let border = "var(--border)";
              let icon = null;
              if (answered) {
                if (opt === q.answer) {
                  bg = "rgba(127, 209, 160, 0.12)";
                  border = "var(--correct)";
                  icon = <CheckCircle2 size={18} color="var(--correct)" />;
                } else if (opt === selected) {
                  bg = "rgba(232, 115, 92, 0.12)";
                  border = "var(--incorrect)";
                  icon = <XCircle size={18} color="var(--incorrect)" />;
                }
              }
              return (
                <button
                  key={opt}
                  onClick={() => selectAnswer(opt)}
                  disabled={answered}
                  style={{
                    ...styles.optionBtn,
                    background: bg,
                    borderColor: border,
                    cursor: answered ? "default" : "pointer",
                  }}
                >
                  <span>{opt}</span>
                  {icon}
                </button>
              );
            })}
          </div>
        ) : (
          <div>
            <div style={{ display: "flex", gap: 10 }}>
              <input
                type="text"
                value={textValue}
                onChange={(e) => setTextValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submitText()}
                disabled={answered}
                placeholder="Type your answer"
                style={{
                  ...styles.textInput,
                  borderColor: answered
                    ? wasCorrect
                      ? "var(--correct)"
                      : "var(--incorrect)"
                    : "var(--border)",
                  background: answered
                    ? wasCorrect
                      ? "rgba(127, 209, 160, 0.12)"
                      : "rgba(232, 115, 92, 0.12)"
                    : "var(--surface-raised)",
                }}
              />
              {!answered && (
                <button
                  onClick={submitText}
                  disabled={!textValue.trim()}
                  style={{
                    ...styles.primaryBtn,
                    opacity: textValue.trim() ? 1 : 0.5,
                    flexShrink: 0,
                  }}
                >
                  Check
                </button>
              )}
            </div>
            {answered && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginTop: 12,
                }}
              >
                {wasCorrect ? (
                  <CheckCircle2 size={18} color="var(--correct)" />
                ) : (
                  <XCircle size={18} color="var(--incorrect)" />
                )}
                <div style={{ fontSize: 13.5, color: "var(--ink-dim)" }}>
                  {wasCorrect ? "Correct" : `Correct answer: ${q.answers[0]}`}
                </div>
              </div>
            )}
          </div>
        )}

        {answered && (
          <button
            onClick={next}
            style={{ ...styles.primaryBtn, width: "100%", marginTop: 22 }}
          >
            {index + 1 >= order.length ? "See results" : "Next question"}
          </button>
        )}
      </div>
    </div>
  );
}

function SettingsScreen({ state, onBack, onExport, onImport, onReset }) {
  const [importError, setImportError] = useState(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        if (
          typeof parsed !== "object" ||
          parsed === null ||
          !("schemaVersion" in parsed)
        ) {
          throw new Error("Not a recognised Orbit export file.");
        }
        onImport(parsed);
        setImportError(null);
      } catch (err) {
        setImportError(err.message || "Couldn't read that file.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div>
      <Header title="Settings" onBack={onBack} />
      <div
        style={{
          padding: "8px 20px 32px",
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        <div>
          <div style={styles.settingsLabel}>Your data</div>
          <div
            style={{
              fontSize: 13,
              color: "var(--ink-dim)",
              marginBottom: 12,
              lineHeight: 1.5,
            }}
          >
            Export your progress to back it up or move it to another device.
            Import replaces your current progress.
          </div>
          <button
            onClick={onExport}
            style={{ ...styles.secondaryBtn, marginBottom: 10 }}
          >
            <Download size={16} /> Export progress
          </button>
          <label style={{ ...styles.secondaryBtn, cursor: "pointer" }}>
            <Upload size={16} /> Import progress
            <input
              type="file"
              accept="application/json"
              onChange={handleFile}
              style={{ display: "none" }}
            />
          </label>
          {importError && (
            <div
              style={{
                fontSize: 12.5,
                color: "var(--incorrect)",
                marginTop: 8,
              }}
            >
              {importError}
            </div>
          )}
        </div>

        <div>
          <div style={styles.settingsLabel}>Reset</div>
          <div
            style={{
              fontSize: 13,
              color: "var(--ink-dim)",
              marginBottom: 12,
              lineHeight: 1.5,
            }}
          >
            Clear all proficiency scores and start fresh. This can't be undone.
          </div>
          {!confirmReset ? (
            <button
              onClick={() => setConfirmReset(true)}
              style={styles.secondaryBtn}
            >
              <RotateCcw size={16} /> Reset all progress
            </button>
          ) : (
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => {
                  onReset();
                  setConfirmReset(false);
                }}
                style={{
                  ...styles.secondaryBtn,
                  borderColor: "var(--incorrect)",
                  color: "var(--incorrect)",
                }}
              >
                Yes, reset everything
              </button>
              <button
                onClick={() => setConfirmReset(false)}
                style={styles.secondaryBtn}
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        <div
          style={{
            marginTop: 12,
            paddingTop: 20,
            borderTop: "1px solid var(--border)",
          }}
        >
          <div
            style={{
              fontSize: 12.5,
              color: "var(--ink-dim)",
              fontFamily: "'IBM Plex Mono', monospace",
            }}
          >
            Version {APP_VERSION} · schema v{SCHEMA_VERSION}
          </div>
          <div
            style={{
              fontSize: 12,
              color: "var(--ink-dim)",
              marginTop: 6,
              lineHeight: 1.5,
            }}
          >
            Progress is saved automatically on this device. Export a backup
            before switching phones, clearing browser data, or reinstalling.
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Root app                                                                */
/* ---------------------------------------------------------------------- */

const STORAGE_KEY = "orbit:progress";

function loadState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || !("progress" in parsed))
      return emptyState();
    return {
      schemaVersion: parsed.schemaVersion || SCHEMA_VERSION,
      progress: parsed.progress || {},
    };
  } catch (err) {
    console.error("Couldn't read saved progress, starting fresh.", err);
    return emptyState();
  }
}

function Orbit() {
  const [state, setState] = useState(loadState);
  const [nav, setNav] = useState([{ screen: "home" }]);
  const current = nav[nav.length - 1];

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.error("Couldn't save progress locally.", err);
    }
  }, [state]);

  const push = (screen) => setNav((n) => [...n, screen]);
  const pop = () => setNav((n) => (n.length > 1 ? n.slice(0, -1) : n));
  const goHome = () => setNav([{ screen: "home" }]);
  const openSettings = () => push({ screen: "settings" });

  const recordSession = useCallback((subjectId, areaId, moduleId, results) => {
    setState((prev) => {
      const next = structuredClone(prev);
      if (!next.progress[subjectId]) next.progress[subjectId] = {};
      if (!next.progress[subjectId][areaId])
        next.progress[subjectId][areaId] = {};
      const existing = next.progress[subjectId][areaId][moduleId] || {
        questionStats: {},
        lastStudied: null,
      };
      for (const [qId, correct] of Object.entries(results)) {
        existing.questionStats[qId] = updateStat(
          existing.questionStats[qId],
          correct,
        );
      }
      existing.lastStudied = Date.now();
      next.progress[subjectId][areaId][moduleId] = existing;
      return next;
    });
  }, []);

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orbit-progress-v${APP_VERSION}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (parsed) => {
    setState({
      schemaVersion: parsed.schemaVersion || SCHEMA_VERSION,
      progress: parsed.progress || {},
    });
  };

  const handleReset = () => setState(emptyState());

  let body = null;

  if (current.screen === "home") {
    body = (
      <HomeScreen
        state={state}
        onOpenSubject={(subjectId) => push({ screen: "areas", subjectId })}
        onSettings={openSettings}
      />
    );
  } else if (current.screen === "areas") {
    const subject = SUBJECTS[current.subjectId];
    body = (
      <AreaScreen
        subject={subject}
        state={state}
        onOpenArea={(areaId) =>
          push({ screen: "modules", subjectId: subject.id, areaId })
        }
        onBack={pop}
        onSettings={openSettings}
      />
    );
  } else if (current.screen === "modules") {
    const subject = SUBJECTS[current.subjectId];
    const area = subject.areas.find((a) => a.id === current.areaId);
    body = (
      <ModuleListScreen
        subject={subject}
        area={area}
        state={state}
        onOpenModule={(moduleId) =>
          push({
            screen: "submodules",
            subjectId: subject.id,
            areaId: area.id,
            moduleId,
          })
        }
        onBack={pop}
        onSettings={openSettings}
      />
    );
  } else if (current.screen === "submodules") {
    const subject = SUBJECTS[current.subjectId];
    const area = subject.areas.find((a) => a.id === current.areaId);
    const module = area.modules.find((m) => m.id === current.moduleId);
    body = (
      <SubmoduleListScreen
        subject={subject}
        area={area}
        module={module}
        state={state}
        onOpenSubmodule={(submoduleId) =>
          push({ ...current, screen: "mode", submoduleId })
        }
        onReviseAll={() =>
          push({ ...current, screen: "revise-setup", submoduleId: "ALL" })
        }
        onBack={pop}
        onSettings={openSettings}
      />
    );
  } else if (current.screen === "mode") {
    const subject = SUBJECTS[current.subjectId];
    const area = subject.areas.find((a) => a.id === current.areaId);
    const module = area.modules.find((m) => m.id === current.moduleId);
    const submodule = module.submodules.find(
      (sm) => sm.id === current.submoduleId,
    );
    body = (
      <ModeChoiceScreen
        area={area}
        submodule={submodule}
        state={state}
        subjectId={subject.id}
        moduleId={module.id}
        onLearn={(band) => push({ ...current, screen: "learn", band })}
        onRevise={() => push({ ...current, screen: "revise-setup" })}
        onBack={pop}
        onSettings={openSettings}
      />
    );
  } else if (current.screen === "learn") {
    const subject = SUBJECTS[current.subjectId];
    const area = subject.areas.find((a) => a.id === current.areaId);
    const module = area.modules.find((m) => m.id === current.moduleId);
    const submodule = module.submodules.find(
      (sm) => sm.id === current.submoduleId,
    );
    body = (
      <LearnScreen
        area={area}
        submodule={submodule}
        initialBand={current.band}
        onBack={pop}
        onSettings={openSettings}
      />
    );
  } else if (current.screen === "revise-setup") {
    const subject = SUBJECTS[current.subjectId];
    const area = subject.areas.find((a) => a.id === current.areaId);
    const module = area.modules.find((m) => m.id === current.moduleId);
    const revising =
      current.submoduleId === "ALL"
        ? {
            id: "all",
            name: module.name,
            questions: module.submodules.flatMap((sm) => sm.questions),
          }
        : module.submodules.find((sm) => sm.id === current.submoduleId);
    body = (
      <ReviseSetupScreen
        area={area}
        module={revising}
        onStart={(bands) => push({ ...current, screen: "revise", bands })}
        onBack={pop}
        onSettings={openSettings}
      />
    );
  } else if (current.screen === "revise") {
    const subject = SUBJECTS[current.subjectId];
    const area = subject.areas.find((a) => a.id === current.areaId);
    const module = area.modules.find((m) => m.id === current.moduleId);
    const revising =
      current.submoduleId === "ALL"
        ? {
            id: "all",
            name: module.name,
            questions: module.submodules.flatMap((sm) => sm.questions),
          }
        : module.submodules.find((sm) => sm.id === current.submoduleId);
    body = (
      <ReviseScreen
        area={area}
        module={revising}
        bands={current.bands || [1, 2, 3]}
        subjectId={subject.id}
        onBack={pop}
        onSettings={openSettings}
        onFinish={(results) =>
          recordSession(subject.id, area.id, module.id, results)
        }
      />
    );
  } else if (current.screen === "settings") {
    body = (
      <SettingsScreen
        state={state}
        onBack={pop}
        onExport={handleExport}
        onImport={handleImport}
        onReset={handleReset}
      />
    );
  }

  return (
    <div
      style={{
        "--bg": "#12181F",
        "--surface": "#1B2430",
        "--surface-raised": "#232F3D",
        "--ink": "#ECE9E1",
        "--ink-dim": "#98A2AF",
        "--accent": "#F2B705",
        "--biology": "#7FD1A0",
        "--chemistry": "#6FB8E8",
        "--physics": "#C6A6F0",
        "--earth": "#F2A65A",
        "--correct": "#7FD1A0",
        "--incorrect": "#E8735C",
        "--border": "#2A3644",
        background: "var(--bg)",
        minHeight: "100dvh",
        maxWidth: 460,
        margin: "0 auto",
        fontFamily: "'IBM Plex Sans', sans-serif",
        color: "var(--ink)",
        paddingTop: "env(safe-area-inset-top)",
        paddingLeft: "env(safe-area-inset-left)",
        paddingRight: "env(safe-area-inset-right)",
        paddingBottom: "max(24px, env(safe-area-inset-bottom))",
      }}
    >
      <style>{`
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        html, body { background: #12181F; overscroll-behavior-y: none; }
        button { font-family: inherit; }
        button:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
      `}</style>
      {body}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Orbit />);

/* ---------------------------------------------------------------------- */
/* Shared inline style objects                                            */
/* ---------------------------------------------------------------------- */

const styles = {
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    background: "var(--surface-raised)",
    border: "1px solid var(--border)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    flexShrink: 0,
  },
  subjectCard: {
    width: "100%",
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: 16,
    padding: 20,
    cursor: "pointer",
    textAlign: "left",
    marginBottom: 12,
  },
  comingSoonCard: {
    width: "100%",
    border: "1px dashed var(--border)",
    borderRadius: 16,
    padding: 20,
    textAlign: "center",
  },
  areaCard: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: 14,
    padding: 16,
    textAlign: "left",
    display: "flex",
    flexDirection: "column",
  },
  moduleRow: {
    width: "100%",
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: 14,
    padding: "14px 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    cursor: "pointer",
    textAlign: "left",
  },
  submoduleIndex: {
    width: 28,
    height: 28,
    borderRadius: "50%",
    border: "1.5px solid var(--border)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  modeBtn: {
    width: "100%",
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: 14,
    padding: "16px",
    display: "flex",
    alignItems: "center",
    gap: 14,
    cursor: "pointer",
  },
  learnNodeBtn: {
    width: "100%",
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: 12,
    padding: "13px 16px",
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
    cursor: "pointer",
    textAlign: "left",
  },
  optionBtn: {
    width: "100%",
    border: "1px solid var(--border)",
    borderRadius: 12,
    padding: "14px 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    fontSize: 14.5,
    color: "var(--ink)",
    textAlign: "left",
  },
  textInput: {
    flex: 1,
    border: "1px solid var(--border)",
    borderRadius: 12,
    padding: "14px 16px",
    fontSize: 15,
    color: "var(--ink)",
    outline: "none",
    minWidth: 0,
  },
  primaryBtn: {
    background: "var(--accent)",
    color: "#1B1404",
    border: "none",
    borderRadius: 12,
    padding: "14px 18px",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
  },
  secondaryBtn: {
    background: "var(--surface-raised)",
    color: "var(--ink)",
    border: "1px solid var(--border)",
    borderRadius: 12,
    padding: "12px 16px",
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 8,
    width: "100%",
  },
  settingsLabel: {
    fontSize: 12,
    fontWeight: 600,
    color: "var(--ink-dim)",
    marginBottom: 6,
    textTransform: "none",
  },
};
