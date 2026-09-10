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

const APP_VERSION = "0.3.0";
const SCHEMA_VERSION = 1;

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
                    title: "All living things are made of cells",
                    body:
                      "Every organism, from a single bacterium to a blue whale, is built from cells. A cell is the smallest unit that can carry out the basic functions of life — taking in energy, removing waste, and reproducing.",
                    children: [
                      {
                        title: "Cells are the basic unit of life",
                        body:
                          "Nothing smaller than a cell can independently carry out life processes. Viruses, for example, aren't made of cells and can't reproduce on their own — which is one reason biologists debate whether they count as 'alive'.",
                      },
                      {
                        title: "Organisms can be single-celled or multicellular",
                        body:
                          "Some organisms, like bacteria and amoebas, are made of just one cell that does everything. Others, like humans, are made of trillions of cells that specialise in different jobs.",
                      },
                    ],
                  },
                  {
                    title: "Levels of organisation",
                    body:
                      "In multicellular organisms, similar cells group together and become more complex step by step.",
                    children: [
                      {
                        title: "Cell → Tissue → Organ → Organ system → Organism",
                        body:
                          "Cells of the same type group into tissue. Different tissues combine into an organ. Organs that work together form an organ system. All the systems together make up the organism.",
                      },
                      {
                        title: "Worked example: the heart",
                        body:
                          "Muscle cells group into cardiac muscle tissue. That tissue, plus valve and nerve tissue, forms the heart (an organ). The heart works with blood vessels to form the circulatory system.",
                      },
                    ],
                  },
                ],
                questions: [
                  {
                    id: "cells_q1",
                    type: "mcq",
                    prompt: "What is the basic unit of life?",
                    options: ["An organ", "A cell", "A tissue", "An organism"],
                    answer: "A cell",
                  },
                  {
                    id: "cells_q4",
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
                    type: "mcq",
                    prompt: "An organism made of just one cell that does every job is:",
                    options: ["Multicellular", "Single-celled", "An organ system", "A tissue"],
                    answer: "Single-celled",
                  },
                ],
              },
              {
                id: "cells-structures",
                name: "Cell Structures",
                blurb: "The organelles inside a cell, and what each one does",
                learn: [
                  {
                    title: "Cell structures and their jobs",
                    body:
                      "Cells contain smaller structures, called organelles, that each do a specific job — similar to organs inside a body.",
                    children: [
                      {
                        title: "Cell membrane",
                        body:
                          "A thin barrier around the cell that controls what substances enter and leave — letting nutrients in and waste out.",
                      },
                      {
                        title: "Nucleus",
                        body:
                          "Contains the cell's DNA (genetic instructions) and controls the cell's activities, a bit like a control centre.",
                      },
                      {
                        title: "Cytoplasm",
                        body:
                          "The jelly-like substance filling the cell, where many chemical reactions of life take place and organelles are suspended.",
                      },
                      {
                        title: "Mitochondria",
                        body:
                          "Often called the 'powerhouse' of the cell — they release energy from food through a process called respiration.",
                      },
                    ],
                  },
                ],
                questions: [
                  {
                    id: "cells_q2",
                    type: "mcq",
                    prompt: "Which structure controls what enters and leaves a cell?",
                    options: ["Nucleus", "Mitochondria", "Cell membrane", "Cytoplasm"],
                    answer: "Cell membrane",
                  },
                  {
                    id: "cells_q3",
                    type: "mcq",
                    prompt: "Which part of the cell contains the genetic material (DNA)?",
                    options: ["Cytoplasm", "Nucleus", "Cell wall", "Vacuole"],
                    answer: "Nucleus",
                  },
                  {
                    id: "cells_q5",
                    type: "mcq",
                    prompt: "Which organelle releases energy from food through respiration?",
                    options: ["Chloroplast", "Nucleus", "Mitochondria", "Cell wall"],
                    answer: "Mitochondria",
                  },
                ],
              },
              {
                id: "cells-plantanimal",
                name: "Plant vs Animal Cells",
                blurb: "The extra features that set plant cells apart",
                learn: [
                  {
                    title: "Plant cells vs animal cells",
                    body:
                      "Plant and animal cells share the structures above, but plant cells have three extra features suited to a stationary, food-producing lifestyle.",
                    children: [
                      {
                        title: "Cell wall",
                        body:
                          "A rigid layer outside the cell membrane, made of cellulose, that gives the cell a fixed shape and support.",
                      },
                      {
                        title: "Chloroplasts",
                        body:
                          "Contain chlorophyll and carry out photosynthesis, converting sunlight into food energy. Animal cells don't have these.",
                      },
                      {
                        title: "Large central vacuole",
                        body:
                          "A fluid-filled sac that helps keep the cell rigid (turgid) and stores water, nutrients, and waste.",
                      },
                    ],
                  },
                ],
                questions: [
                  {
                    id: "cells_q6",
                    type: "mcq",
                    prompt: "Which structure is found in plant cells but not animal cells?",
                    options: ["Cell membrane", "Cytoplasm", "Chloroplast", "Nucleus"],
                    answer: "Chloroplast",
                  },
                  {
                    id: "cells_q7",
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
                    type: "mcq",
                    prompt: "Which process do plant cells use to make their own food?",
                    options: ["Respiration", "Digestion", "Photosynthesis", "Excretion"],
                    answer: "Photosynthesis",
                  },
                ],
              },
              {
                id: "cells-specialised",
                name: "Specialised Cells",
                blurb: "How cells adapt their structure to suit their job",
                learn: [
                  {
                    title: "Specialised cells",
                    body:
                      "In multicellular organisms, cells differentiate to take on specific jobs, becoming specialised in structure and function to do that job well.",
                    children: [
                      {
                        title: "Red blood cells",
                        body:
                          "Packed with haemoglobin and shaped as a biconcave disc to carry oxygen efficiently. They have no nucleus, leaving more room for haemoglobin.",
                      },
                      {
                        title: "Nerve cells (neurons)",
                        body:
                          "Long and thin, with branching extensions, letting them carry electrical signals quickly over long distances.",
                      },
                      {
                        title: "Root hair cells",
                        body:
                          "Have a long, thin extension that increases surface area, helping plant roots absorb more water and minerals from the soil.",
                      },
                    ],
                  },
                ],
                questions: [
                  {
                    id: "cells_q9",
                    type: "mcq",
                    prompt: "What is a cell that has adapted to carry out a specific job called?",
                    options: ["A generic cell", "A specialised cell", "A tissue-only cell", "An organ cell"],
                    answer: "A specialised cell",
                  },
                  {
                    id: "cells_q10",
                    type: "text",
                    prompt: "Name the blood cell type specialised to carry oxygen around the body.",
                    answers: ["red blood cell", "red blood cells"],
                  },
                  {
                    id: "cells_q11",
                    type: "mcq",
                    prompt: "Nerve cells (neurons) are specialised to:",
                    options: ["Store fat", "Carry electrical signals", "Photosynthesise", "Digest food"],
                    answer: "Carry electrical signals",
                  },
                  {
                    id: "cells_q12",
                    type: "text",
                    prompt: "Root hair cells have a long extension that increases what, helping them absorb water?",
                    answers: ["surface area"],
                  },
                  {
                    id: "cells_q13",
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
                ],
              },
            ],
          },
          {
            id: "ecology",
            name: "Ecology & Ecosystems",
            blurb: "How living things depend on each other and their environment",
            submodules: [
              {
                id: "eco-ecosystems",
                name: "Ecosystems & Habitats",
                blurb: "What an ecosystem and a habitat actually are",
                learn: [
                  {
                    title: "Living things depend on each other and their environment",
                    body:
                      "An ecosystem is a community of living things interacting with each other and with the non-living parts of their environment, like water, soil, and climate.",
                    children: [
                      {
                        title: "Ecosystem",
                        body:
                          "All the organisms in an area, plus the physical environment they live in and interact with.",
                      },
                      {
                        title: "Habitat",
                        body:
                          "The specific place where an organism lives, providing the conditions and resources it needs — e.g. a stream is the habitat of a native kōura (freshwater crayfish).",
                      },
                    ],
                  },
                ],
                questions: [
                  {
                    id: "eco_q1",
                    type: "mcq",
                    prompt: "What is an ecosystem?",
                    options: [
                      "A single species living alone",
                      "A community of living things interacting with their environment",
                      "Only the non-living parts of an environment",
                      "A food chain with exactly three organisms",
                    ],
                    answer: "A community of living things interacting with their environment",
                  },
                  {
                    id: "eco_q14",
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
                ],
              },
              {
                id: "eco-feeding",
                name: "Feeding Relationships",
                blurb: "How energy moves through an ecosystem",
                learn: [
                  {
                    title: "Feeding relationships",
                    body:
                      "Energy moves through an ecosystem as organisms eat one another. Different roles are involved.",
                    children: [
                      {
                        title: "Producers",
                        body:
                          "Make their own food, usually via photosynthesis (plants, algae). They form the base of almost every food chain.",
                      },
                      {
                        title: "Consumers",
                        body:
                          "Get energy by eating other organisms. Herbivores eat plants, carnivores eat animals, omnivores eat both.",
                      },
                      {
                        title: "Decomposers",
                        body:
                          "Break down dead organisms and waste, releasing nutrients back into the soil for producers to use again — fungi and bacteria are key decomposers.",
                      },
                      {
                        title: "Food chains and food webs",
                        body:
                          "A food chain shows one feeding pathway (e.g. grass → rabbit → hawk). A food web links many food chains together, showing the more realistic, interconnected picture.",
                      },
                    ],
                  },
                ],
                questions: [
                  {
                    id: "eco_q2",
                    type: "mcq",
                    prompt: "Organisms that make their own food are called:",
                    options: ["Consumers", "Decomposers", "Producers", "Predators"],
                    answer: "Producers",
                  },
                  {
                    id: "eco_q3",
                    type: "mcq",
                    prompt: "What is the main role of decomposers in an ecosystem?",
                    options: [
                      "Hunting live prey",
                      "Producing oxygen",
                      "Breaking down dead material and recycling nutrients",
                      "Competing with producers for sunlight",
                    ],
                    answer: "Breaking down dead material and recycling nutrients",
                  },
                  {
                    id: "eco_q4",
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
                ],
              },
              {
                id: "eco-populations",
                name: "Populations & Communities",
                blurb: "How ecologists study living things at different scales",
                learn: [
                  {
                    title: "Populations and communities",
                    body: "Ecologists study living things at different scales.",
                    children: [
                      {
                        title: "Population",
                        body:
                          "All the individuals of one species living in the same area at the same time — e.g. all the tūī in a forest reserve.",
                      },
                      {
                        title: "Community",
                        body:
                          "All the different populations of different species living and interacting in the same area.",
                      },
                      {
                        title: "Limiting factors",
                        body:
                          "Things that restrict how large a population can grow — food, water, space, disease, and predators are common limiting factors.",
                      },
                    ],
                  },
                ],
                questions: [
                  {
                    id: "eco_q5",
                    type: "mcq",
                    prompt: "All the individuals of one species in an area make up a:",
                    options: ["Community", "Ecosystem", "Population", "Habitat"],
                    answer: "Population",
                  },
                  {
                    id: "eco_q6",
                    type: "mcq",
                    prompt: "Which of these is a limiting factor on population size?",
                    options: ["Food availability", "Species name", "Cell structure", "Scientific classification"],
                    answer: "Food availability",
                  },
                ],
              },
              {
                id: "eco-humanimpact",
                name: "Human Impact & Conservation",
                blurb: "How human activity changes ecosystems, and how we protect them",
                learn: [
                  {
                    title: "Human impact on ecosystems",
                    body: "Human activity changes ecosystems, sometimes faster than species can adapt.",
                    children: [
                      {
                        title: "Habitat loss",
                        body:
                          "Clearing land for farming or building removes the resources species depend on, often reducing population sizes sharply.",
                      },
                      {
                        title: "Introduced species",
                        body:
                          "Species brought from elsewhere (like possums or stoats in Aotearoa) can outcompete or prey on native species that have no natural defences against them.",
                      },
                      {
                        title: "Conservation",
                        body:
                          "Deliberate action to protect species and habitats — such as predator control, replanting, or setting up protected reserves.",
                      },
                    ],
                  },
                ],
                questions: [
                  {
                    id: "eco_q7",
                    type: "mcq",
                    prompt: "Why can introduced predators like stoats harm native NZ birds?",
                    options: [
                      "The birds have strong natural defences against them",
                      "The birds evolved without mammalian predators, so lack defences",
                      "Stoats only eat plants",
                      "Introduced species always improve ecosystems",
                    ],
                    answer: "The birds evolved without mammalian predators, so lack defences",
                  },
                  {
                    id: "eco_q8",
                    type: "mcq",
                    prompt: "Deliberate action to protect species and habitats is called:",
                    options: ["Predation", "Conservation", "Decomposition", "Competition"],
                    answer: "Conservation",
                  },
                ],
              },
              {
                id: "eco-adaptation",
                name: "Adaptation & Survival",
                blurb: "How species adapt to survive and compete in their environment",
                learn: [
                  {
                    title: "Adaptation and survival",
                    body:
                      "Species develop features over generations that help them survive and reproduce in their particular environment.",
                    children: [
                      {
                        title: "Structural adaptations",
                        body:
                          "Physical features suited to an environment, like a fantail's wide beak for catching insects mid-flight.",
                      },
                      {
                        title: "Behavioural adaptations",
                        body:
                          "Actions or behaviour patterns that improve survival, like migration, hibernation, or being nocturnal to avoid predators or heat.",
                      },
                      {
                        title: "Competition",
                        body:
                          "Organisms compete for the same limited resources — food, space, and mates — both within and between species.",
                      },
                    ],
                  },
                ],
                questions: [
                  {
                    id: "eco_q9",
                    type: "mcq",
                    prompt: "A physical feature that helps a species survive in its environment is called a:",
                    options: ["Behavioural adaptation", "Structural adaptation", "Limiting factor", "Food web"],
                    answer: "Structural adaptation",
                  },
                  {
                    id: "eco_q10",
                    type: "text",
                    prompt: "What word describes organisms competing for the same limited resources?",
                    answers: ["competition"],
                  },
                  {
                    id: "eco_q11",
                    type: "mcq",
                    prompt: "Migrating to a warmer region for winter is an example of a:",
                    options: ["Structural adaptation", "Behavioural adaptation", "Limiting factor", "Decomposer"],
                    answer: "Behavioural adaptation",
                  },
                  {
                    id: "eco_q12",
                    type: "mcq",
                    prompt: "Two species competing for the same food source is an example of:",
                    options: ["Predation", "Competition", "Decomposition", "Photosynthesis"],
                    answer: "Competition",
                  },
                  {
                    id: "eco_q13",
                    type: "text",
                    prompt: "What term describes an animal that is mainly active at night?",
                    answers: ["nocturnal"],
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
            blurb: "The particles that make up all matter, and how we organise them",
            submodules: [
              {
                id: "atoms-structure",
                name: "Atoms & Atomic Structure",
                blurb: "What atoms are made of",
                learn: [
                  {
                    title: "All matter is made of atoms",
                    body:
                      "Everything around you — air, water, this screen — is built from atoms. An atom is the smallest particle of an element that still has that element's chemical properties.",
                    children: [
                      {
                        title: "Atoms are mostly empty space",
                        body:
                          "A tiny, dense nucleus sits at the centre, with electrons moving through a much larger volume of space around it.",
                      },
                    ],
                  },
                  {
                    title: "Atomic structure",
                    body: "Atoms are built from three subatomic particles.",
                    children: [
                      {
                        title: "Protons",
                        body: "Positively charged particles found in the nucleus. The number of protons is the atomic number, and it defines which element an atom is.",
                      },
                      {
                        title: "Neutrons",
                        body: "Particles with no electrical charge, also found in the nucleus, alongside the protons.",
                      },
                      {
                        title: "Electrons",
                        body: "Negatively charged particles that occupy shells around the nucleus. They're involved in chemical bonding.",
                      },
                    ],
                  },
                ],
                questions: [
                  {
                    id: "atoms_q1",
                    type: "mcq",
                    prompt: "What is the smallest particle of an element that keeps its chemical properties?",
                    options: ["A molecule", "A compound", "An atom", "A mixture"],
                    answer: "An atom",
                  },
                  {
                    id: "atoms_q2",
                    type: "mcq",
                    prompt: "Which subatomic particle has a positive charge?",
                    options: ["Electron", "Neutron", "Proton", "Nucleus"],
                    answer: "Proton",
                  },
                  {
                    id: "atoms_q3",
                    type: "text",
                    prompt: "What is the name of the negatively charged particle that occupies shells around the nucleus?",
                    answers: ["electron", "electrons"],
                  },
                  {
                    id: "atoms_q4",
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
                ],
              },
              {
                id: "atoms-periodic",
                name: "Elements & the Periodic Table",
                blurb: "How elements are organised, and what that reveals",
                learn: [
                  {
                    title: "Elements and the periodic table",
                    body:
                      "The periodic table arranges every known element in a way that reveals patterns in their properties.",
                    children: [
                      {
                        title: "Element",
                        body: "A pure substance made of only one type of atom — like oxygen, carbon, or gold.",
                      },
                      {
                        title: "Groups (columns)",
                        body: "Elements in the same group have the same number of outer-shell electrons, giving them similar chemical properties.",
                      },
                      {
                        title: "Periods (rows)",
                        body: "Each period represents a row of elements with the same number of electron shells.",
                      },
                    ],
                  },
                ],
                questions: [
                  {
                    id: "atoms_q5",
                    type: "text",
                    prompt: "What do we call a pure substance made of only one type of atom?",
                    answers: ["element"],
                  },
                  {
                    id: "atoms_q6",
                    type: "mcq",
                    prompt: "Elements in the same group (column) of the periodic table tend to have similar:",
                    options: ["Colours", "Chemical properties", "Atomic numbers", "Names"],
                    answer: "Chemical properties",
                  },
                ],
              },
              {
                id: "atoms-compounds",
                name: "Compounds & Mixtures",
                blurb: "How atoms and elements combine",
                learn: [
                  {
                    title: "Compounds and mixtures",
                    body: "Atoms and elements can combine in different ways.",
                    children: [
                      {
                        title: "Molecule",
                        body: "Two or more atoms bonded together — they can be the same element (O2) or different elements (H2O).",
                      },
                      {
                        title: "Compound",
                        body: "Two or more different elements chemically bonded together in a fixed ratio, like water (H2O) — hard to separate back into elements.",
                      },
                      {
                        title: "Mixture",
                        body: "Two or more substances physically combined but not chemically bonded, like sand and salt — can be separated by physical means.",
                      },
                    ],
                  },
                ],
                questions: [
                  {
                    id: "atoms_q7",
                    type: "text",
                    prompt: "What is the chemical formula for water?",
                    answers: ["h2o"],
                  },
                  {
                    id: "atoms_q8",
                    type: "mcq",
                    prompt: "A mixture can be separated by physical means because its substances are:",
                    options: [
                      "Chemically bonded",
                      "Physically combined, not chemically bonded",
                      "All the same element",
                      "Radioactive",
                    ],
                    answer: "Physically combined, not chemically bonded",
                  },
                ],
              },
              {
                id: "atoms-bonding",
                name: "Chemical Bonding",
                blurb: "How atoms bond together, and what ions are",
                learn: [
                  {
                    title: "Chemical bonding",
                    body:
                      "Atoms bond by interacting with their outer-shell electrons, forming the compounds and molecules that make up most matter.",
                    children: [
                      {
                        title: "Ionic bonding",
                        body:
                          "Electrons transfer from one atom to another, creating charged particles (ions) that attract each other — like in table salt, sodium chloride.",
                      },
                      {
                        title: "Covalent bonding",
                        body:
                          "Atoms share electrons rather than transferring them, common between non-metal atoms — like in water or carbon dioxide.",
                      },
                      {
                        title: "Ions",
                        body:
                          "Atoms that have gained or lost electrons, giving them an overall electrical charge — positive if they lost electrons, negative if they gained them.",
                      },
                    ],
                  },
                ],
                questions: [
                  {
                    id: "atoms_q9",
                    type: "mcq",
                    prompt: "Bonding where electrons are transferred between atoms is called:",
                    options: ["Covalent bonding", "Ionic bonding", "Metallic bonding", "Nuclear bonding"],
                    answer: "Ionic bonding",
                  },
                  {
                    id: "atoms_q10",
                    type: "text",
                    prompt: "What word describes bonding where atoms share electrons?",
                    answers: ["covalent", "covalent bonding"],
                  },
                  {
                    id: "atoms_q11",
                    type: "mcq",
                    prompt: "An atom that has lost or gained electrons, giving it a charge, is called a(n):",
                    options: ["Isotope", "Ion", "Molecule", "Nucleus"],
                    answer: "Ion",
                  },
                  {
                    id: "atoms_q12",
                    type: "mcq",
                    prompt: "An atom that loses electrons becomes:",
                    options: ["Negatively charged", "Positively charged", "Neutral", "Radioactive"],
                    answer: "Positively charged",
                  },
                  {
                    id: "atoms_q13",
                    type: "text",
                    prompt: "What is the common name of the compound formed by ionic bonding between sodium and chlorine?",
                    answers: ["sodium chloride", "salt", "table salt"],
                  },
                  {
                    id: "atoms_q14",
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
                ],
              },
            ],
          },
          {
            id: "reactions",
            name: "Chemical Reactions",
            blurb: "How substances transform into new ones, and how to spot it happening",
            submodules: [
              {
                id: "react-basics",
                name: "How Reactions Work",
                blurb: "What happens to atoms in a reaction, and how to spot one",
                learn: [
                  {
                    title: "Chemical reactions rearrange atoms into new substances",
                    body:
                      "In a chemical reaction, the atoms in the starting substances are rearranged to form different substances. No atoms are created or destroyed.",
                    children: [
                      {
                        title: "Reactants and products",
                        body: "Reactants are the substances you start with. Products are the new substances formed by the reaction.",
                      },
                      {
                        title: "Conservation of mass",
                        body: "Because atoms are only rearranged, not created or destroyed, the total mass of the products equals the total mass of the reactants.",
                      },
                    ],
                  },
                  {
                    title: "Signs of a chemical reaction",
                    body: "Several clues suggest a chemical reaction has happened, rather than just a physical change.",
                    children: [
                      {
                        title: "Common signs",
                        body: "A colour change, gas produced (bubbles), a temperature change, a solid forming from two liquids (precipitate), or a new smell.",
                      },
                    ],
                  },
                ],
                questions: [
                  {
                    id: "react_q1",
                    type: "mcq",
                    prompt: "In a chemical reaction, the substances you start with are called:",
                    options: ["Products", "Reactants", "Compounds", "Catalysts"],
                    answer: "Reactants",
                  },
                  {
                    id: "react_q2",
                    type: "mcq",
                    prompt: "The new substances formed by a chemical reaction are called:",
                    options: ["Reactants", "Elements", "Products", "Mixtures"],
                    answer: "Products",
                  },
                  {
                    id: "react_q4",
                    type: "mcq",
                    prompt: "Which of these is a typical sign a chemical reaction has occurred?",
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
                    type: "text",
                    prompt: "What is the name of the law stating atoms are neither created nor destroyed in a reaction?",
                    answers: ["law of conservation of mass", "conservation of mass"],
                  },
                ],
              },
              {
                id: "react-types",
                name: "Types of Reactions",
                blurb: "Combustion and neutralisation, two reactions you'll see everywhere",
                learn: [
                  {
                    title: "Types of reactions",
                    body: "Some reaction types come up again and again in everyday contexts.",
                    children: [
                      {
                        title: "Combustion",
                        body: "A fuel reacts with oxygen, releasing energy — usually as heat and light. Produces carbon dioxide and water when the fuel contains carbon and hydrogen.",
                      },
                      {
                        title: "Neutralisation",
                        body: "An acid reacts with a base, producing a salt and water. This is why antacids (a base) settle an acidic stomach.",
                      },
                    ],
                  },
                ],
                questions: [
                  {
                    id: "react_q6",
                    type: "mcq",
                    prompt: "A neutralisation reaction between an acid and a base produces a salt and:",
                    options: ["Oxygen", "Carbon dioxide", "Water", "Fuel"],
                    answer: "Water",
                  },
                  {
                    id: "react_q7",
                    type: "mcq",
                    prompt: "A combustion reaction needs fuel plus which gas?",
                    options: ["Nitrogen", "Oxygen", "Carbon dioxide", "Hydrogen"],
                    answer: "Oxygen",
                  },
                ],
              },
              {
                id: "react-energy",
                name: "Energy Changes",
                blurb: "Whether a reaction releases or absorbs energy",
                learn: [
                  {
                    title: "Energy changes in reactions",
                    body: "Reactions either release or absorb energy from their surroundings.",
                    children: [
                      {
                        title: "Exothermic",
                        body: "Releases energy to the surroundings — the reaction mixture feels hotter. Combustion is exothermic.",
                      },
                      {
                        title: "Endothermic",
                        body: "Absorbs energy from the surroundings — the reaction mixture feels colder.",
                      },
                    ],
                  },
                ],
                questions: [
                  {
                    id: "react_q3",
                    type: "text",
                    prompt: "What word describes a reaction that releases heat energy to its surroundings?",
                    answers: ["exothermic"],
                  },
                  {
                    id: "react_q8",
                    type: "text",
                    prompt: "What word describes a reaction that absorbs energy from its surroundings?",
                    answers: ["endothermic"],
                  },
                ],
              },
              {
                id: "react-acidsbases",
                name: "Acids, Bases & pH",
                blurb: "How acids and bases behave, and how the pH scale works",
                learn: [
                  {
                    title: "Acids, bases, and pH",
                    body:
                      "Acids and bases are common classes of chemicals, defined by how they behave in reactions and where they sit on the pH scale.",
                    children: [
                      {
                        title: "Acids",
                        body:
                          "Substances with a pH below 7 that taste sour and react with metals and bases — like vinegar and lemon juice.",
                      },
                      {
                        title: "Bases and alkalis",
                        body:
                          "Bases have a pH above 7 and react with acids — like soap and baking soda. A base that dissolves in water is called an alkali.",
                      },
                      {
                        title: "The pH scale",
                        body:
                          "Runs from 0 (strongly acidic) to 14 (strongly basic), with 7 being neutral — like pure water.",
                      },
                    ],
                  },
                ],
                questions: [
                  {
                    id: "react_q9",
                    type: "mcq",
                    prompt: "On the pH scale, a substance with pH 3 is:",
                    options: ["Strongly basic", "Acidic", "Neutral", "Radioactive"],
                    answer: "Acidic",
                  },
                  {
                    id: "react_q10",
                    type: "text",
                    prompt: "What pH value is considered neutral?",
                    answers: ["7"],
                  },
                  {
                    id: "react_q11",
                    type: "mcq",
                    prompt: "Which of these typically has a pH above 7?",
                    options: ["Lemon juice", "Vinegar", "Soap", "Battery acid"],
                    answer: "Soap",
                  },
                  {
                    id: "react_q12",
                    type: "text",
                    prompt: "What do we call a base that dissolves in water?",
                    answers: ["alkali"],
                  },
                  {
                    id: "react_q13",
                    type: "mcq",
                    prompt: "Acids typically react with metals to produce hydrogen gas and:",
                    options: ["A salt", "Only water", "Oxygen", "Carbon"],
                    answer: "A salt",
                  },
                  {
                    id: "react_q14",
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
                    title: "Forces change the motion of objects",
                    body:
                      "A force is a push or a pull, measured in Newtons (N). Forces can start, stop, speed up, slow down, or change the direction of an object's motion.",
                    children: [
                      {
                        title: "Balanced vs unbalanced forces",
                        body: "When forces on an object are balanced, its motion doesn't change. When forces are unbalanced, the object accelerates in the direction of the larger force.",
                      },
                    ],
                  },
                ],
                questions: [
                  {
                    id: "forces_q1",
                    type: "mcq",
                    prompt: "What unit is force measured in?",
                    options: ["Watts", "Joules", "Newtons", "Metres"],
                    answer: "Newtons",
                  },
                  {
                    id: "forces_q5",
                    type: "mcq",
                    prompt: "If the forces acting on an object are balanced, its motion:",
                    options: [
                      "Speeds up",
                      "Stays the same (no acceleration)",
                      "Always stops immediately",
                      "Reverses direction",
                    ],
                    answer: "Stays the same (no acceleration)",
                  },
                ],
              },
              {
                id: "forces-types",
                name: "Common Types of Forces",
                blurb: "Gravity, friction, and the other named forces",
                learn: [
                  {
                    title: "Common types of forces",
                    body: "Several named forces show up again and again in physics problems.",
                    children: [
                      {
                        title: "Gravity",
                        body: "A force that pulls objects with mass toward each other — on Earth, this pulls everything toward the ground.",
                      },
                      {
                        title: "Friction",
                        body: "A force that opposes motion between two surfaces in contact, converting motion energy into heat.",
                      },
                      {
                        title: "Applied force",
                        body: "A direct push or pull on an object, like kicking a ball.",
                      },
                      {
                        title: "Normal force",
                        body: "A support force a surface exerts perpendicular to itself, stopping objects from falling through it.",
                      },
                    ],
                  },
                ],
                questions: [
                  {
                    id: "forces_q2",
                    type: "text",
                    prompt: "What force opposes motion between two touching surfaces?",
                    answers: ["friction"],
                  },
                  {
                    id: "forces_q7",
                    type: "text",
                    prompt: "What force pulls objects with mass toward the Earth?",
                    answers: ["gravity"],
                  },
                ],
              },
              {
                id: "forces-newton",
                name: "Newton's Laws",
                blurb: "The three rules that govern how forces affect motion",
                learn: [
                  {
                    title: "Newton's laws, simplified",
                    body: "Isaac Newton described three rules that govern how forces affect motion.",
                    children: [
                      {
                        title: "First law — inertia",
                        body: "An object stays at rest, or keeps moving at a constant velocity, unless acted on by an unbalanced force.",
                      },
                      {
                        title: "Second law — F = m × a",
                        body: "The bigger the force, or the smaller the mass, the bigger the acceleration produced.",
                      },
                      {
                        title: "Third law — action and reaction",
                        body: "Every force has an equal and opposite reaction force — when you push on a wall, it pushes back on you just as hard.",
                      },
                    ],
                  },
                ],
                questions: [
                  {
                    id: "forces_q3",
                    type: "mcq",
                    prompt: "Newton's first law is also known as the law of:",
                    options: ["Momentum", "Inertia", "Gravity", "Energy"],
                    answer: "Inertia",
                  },
                  {
                    id: "forces_q6",
                    type: "mcq",
                    prompt: "F = m × a describes which of Newton's laws?",
                    options: ["First law", "Second law", "Third law", "None of them"],
                    answer: "Second law",
                  },
                ],
              },
              {
                id: "forces-motion",
                name: "Speed, Velocity & Acceleration",
                blurb: "How these three related terms differ",
                learn: [
                  {
                    title: "Speed, velocity, and acceleration",
                    body: "These three terms are related but describe motion differently.",
                    children: [
                      {
                        title: "Speed",
                        body: "How fast something travels: distance ÷ time.",
                      },
                      {
                        title: "Velocity",
                        body: "Speed with a direction — 20 km/h north, for example.",
                      },
                      {
                        title: "Acceleration",
                        body: "How quickly velocity changes over time — can mean speeding up, slowing down, or changing direction.",
                      },
                    ],
                  },
                ],
                questions: [
                  {
                    id: "forces_q4",
                    type: "text",
                    prompt: "Complete the formula: speed = distance ÷ ___",
                    answers: ["time"],
                  },
                  {
                    id: "forces_q8",
                    type: "mcq",
                    prompt: "Velocity differs from speed because it includes:",
                    options: ["Direction", "Mass", "Time", "Distance"],
                    answer: "Direction",
                  },
                ],
              },
              {
                id: "forces-massweight",
                name: "Mass & Weight",
                blurb: "Why mass and weight aren't the same thing",
                learn: [
                  {
                    title: "Mass and weight",
                    body: "Mass and weight are often confused but describe different things in physics.",
                    children: [
                      {
                        title: "Mass",
                        body: "The amount of matter in an object, measured in kilograms. An object's mass stays the same wherever it is in the universe.",
                      },
                      {
                        title: "Weight",
                        body: "The force of gravity acting on an object's mass, measured in Newtons. Weight changes depending on the strength of gravity.",
                      },
                      {
                        title: "Weight on other worlds",
                        body: "An astronaut has the same mass on the Moon as on Earth, but weighs less there because the Moon's gravity is weaker.",
                      },
                    ],
                  },
                ],
                questions: [
                  {
                    id: "forces_q9",
                    type: "mcq",
                    prompt: "What is the amount of matter in an object called?",
                    options: ["Weight", "Mass", "Force", "Density"],
                    answer: "Mass",
                  },
                  {
                    id: "forces_q10",
                    type: "text",
                    prompt: "Weight is a force caused by what acting on an object's mass?",
                    answers: ["gravity"],
                  },
                  {
                    id: "forces_q11",
                    type: "mcq",
                    prompt: "Which unit is weight measured in?",
                    options: ["Kilograms", "Newtons", "Litres", "Metres"],
                    answer: "Newtons",
                  },
                  {
                    id: "forces_q12",
                    type: "mcq",
                    prompt: "An astronaut's mass on the Moon, compared to on Earth, is:",
                    options: ["Much greater", "The same", "Much smaller", "Zero"],
                    answer: "The same",
                  },
                  {
                    id: "forces_q13",
                    type: "mcq",
                    prompt: "Why does an astronaut weigh less on the Moon than on Earth?",
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
                    type: "text",
                    prompt: "What unit is mass measured in?",
                    answers: ["kilograms", "kg"],
                  },
                ],
              },
            ],
          },
          {
            id: "energy",
            name: "Energy & Waves",
            blurb: "How energy is transferred and transformed, and how waves carry it",
            submodules: [
              {
                id: "energy-forms",
                name: "Forms & Transformation of Energy",
                blurb: "The law of conservation of energy, and everyday transformation examples",
                learn: [
                  {
                    title: "Energy is transferred and transformed, never created or destroyed",
                    body:
                      "This is the law of conservation of energy. Energy exists in many forms, and can change from one form to another, but the total amount stays the same.",
                    children: [
                      {
                        title: "Common forms of energy",
                        body: "Kinetic (movement), potential (stored, due to position or state), thermal (heat), light, sound, electrical, and chemical energy.",
                      },
                    ],
                  },
                  {
                    title: "Energy transformation examples",
                    body: "Everyday events involve chains of energy transformation.",
                    children: [
                      {
                        title: "A falling object",
                        body: "Gravitational potential energy converts into kinetic energy as an object falls and speeds up.",
                      },
                      {
                        title: "A torch",
                        body: "Chemical energy in the battery converts to electrical energy, then to light energy (and some heat).",
                      },
                    ],
                  },
                ],
                questions: [
                  {
                    id: "energy_q1",
                    type: "mcq",
                    prompt: "The energy of a moving object is called:",
                    options: ["Potential energy", "Kinetic energy", "Thermal energy", "Chemical energy"],
                    answer: "Kinetic energy",
                  },
                  {
                    id: "energy_q2",
                    type: "text",
                    prompt: "Energy stored due to an object's height is called gravitational ___ energy.",
                    answers: ["potential", "gravitational potential energy", "potential energy"],
                  },
                  {
                    id: "energy_q3",
                    type: "mcq",
                    prompt: "The law of conservation of energy states that energy cannot be created or:",
                    options: ["Transferred", "Destroyed", "Transformed", "Measured"],
                    answer: "Destroyed",
                  },
                ],
              },
              {
                id: "energy-waves",
                name: "Waves",
                blurb: "How waves carry energy, and how they behave",
                learn: [
                  {
                    title: "Waves carry energy",
                    body: "Waves transfer energy from one place to another without transferring matter.",
                    children: [
                      {
                        title: "Transverse waves",
                        body: "The medium vibrates perpendicular to the direction the wave travels — light and other electromagnetic waves are transverse.",
                      },
                      {
                        title: "Longitudinal waves",
                        body: "The medium vibrates parallel to the direction the wave travels — sound is a longitudinal wave.",
                      },
                      {
                        title: "Wave properties",
                        body: "Amplitude (height of the wave, related to energy), wavelength (distance between repeating points), and frequency (waves passing per second).",
                      },
                    ],
                  },
                  {
                    title: "Wave behaviours",
                    body: "Waves interact with materials and boundaries in predictable ways.",
                    children: [
                      {
                        title: "Reflection",
                        body: "A wave bounces off a surface, like an echo or a mirror image.",
                      },
                      {
                        title: "Refraction",
                        body: "A wave bends as it passes from one medium into another, changing speed — like light bending as it enters water.",
                      },
                    ],
                  },
                ],
                questions: [
                  {
                    id: "energy_q4",
                    type: "text",
                    prompt: "What is the term for the distance between two successive wave crests?",
                    answers: ["wavelength"],
                  },
                  {
                    id: "energy_q5",
                    type: "mcq",
                    prompt: "Sound waves are an example of which type of wave?",
                    options: ["Transverse", "Longitudinal", "Electromagnetic", "Standing"],
                    answer: "Longitudinal",
                  },
                  {
                    id: "energy_q6",
                    type: "mcq",
                    prompt: "Light waves are an example of which type of wave?",
                    options: ["Longitudinal", "Transverse", "Mechanical only", "None — light isn't a wave"],
                    answer: "Transverse",
                  },
                  {
                    id: "energy_q7",
                    type: "text",
                    prompt: "What is the name for a wave bouncing off a surface?",
                    answers: ["reflection"],
                  },
                  {
                    id: "energy_q8",
                    type: "mcq",
                    prompt: "Unlike light, sound needs what in order to travel?",
                    options: ["A vacuum", "A medium (like air or water)", "Darkness", "Gravity"],
                    answer: "A medium (like air or water)",
                  },
                ],
              },
              {
                id: "energy-resources",
                name: "Energy Resources",
                blurb: "Renewable vs non-renewable, and how electricity is generated",
                learn: [
                  {
                    title: "Energy resources",
                    body:
                      "Much of the energy we use is converted from resources found in or on the Earth, which can be grouped by how quickly they're replaced.",
                    children: [
                      {
                        title: "Non-renewable resources",
                        body:
                          "Fossil fuels like coal, oil, and gas form over millions of years and are used up far faster than they're replaced.",
                      },
                      {
                        title: "Renewable resources",
                        body:
                          "Sources like solar, wind, and hydro power are naturally replenished on a human timescale and don't run out.",
                      },
                      {
                        title: "Electricity generation",
                        body:
                          "Most electricity is generated by transforming another form of energy — such as the kinetic energy of falling water or spinning turbines — into electrical energy.",
                      },
                    ],
                  },
                ],
                questions: [
                  {
                    id: "energy_q9",
                    type: "mcq",
                    prompt: "Which of these is a non-renewable energy resource?",
                    options: ["Solar", "Wind", "Coal", "Hydro"],
                    answer: "Coal",
                  },
                  {
                    id: "energy_q10",
                    type: "text",
                    prompt: "What word describes energy resources that are naturally replenished and won't run out?",
                    answers: ["renewable"],
                  },
                  {
                    id: "energy_q11",
                    type: "mcq",
                    prompt: "Fossil fuels form over what kind of timescale?",
                    options: ["A few days", "A few years", "Millions of years", "They don't form naturally"],
                    answer: "Millions of years",
                  },
                  {
                    id: "energy_q12",
                    type: "mcq",
                    prompt: "Hydroelectric power generates electricity mainly from the kinetic energy of:",
                    options: ["Wind", "Falling or flowing water", "Sunlight", "Burning coal"],
                    answer: "Falling or flowing water",
                  },
                  {
                    id: "energy_q13",
                    type: "text",
                    prompt: "Name a renewable energy source that uses sunlight directly.",
                    answers: ["solar", "solar power", "solar energy"],
                  },
                  {
                    id: "energy_q14",
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
                    title: "Earth's systems interact to shape climate and environment",
                    body:
                      "Earth can be thought of as four interacting systems, or spheres, that constantly exchange matter and energy with each other.",
                    children: [
                      {
                        title: "Geosphere",
                        body: "The solid Earth — rock, soil, and the structures beneath the surface.",
                      },
                      {
                        title: "Hydrosphere",
                        body: "All the water in Earth's system — oceans, rivers, lakes, groundwater, and ice.",
                      },
                      {
                        title: "Atmosphere",
                        body: "The layer of gases surrounding Earth, mostly nitrogen and oxygen.",
                      },
                      {
                        title: "Biosphere",
                        body: "All living things and the ecosystems they form.",
                      },
                    ],
                  },
                ],
                questions: [
                  {
                    id: "earthsys_q5",
                    type: "text",
                    prompt: "What is the name for the sphere of Earth's system made of rock and soil?",
                    answers: ["geosphere"],
                  },
                  {
                    id: "earthsys_q7",
                    type: "text",
                    prompt: "What is the name for all the water in Earth's system — oceans, rivers, and ice?",
                    answers: ["hydrosphere"],
                  },
                  {
                    id: "earthsys_q8",
                    type: "mcq",
                    prompt: "The term for all living things and ecosystems on Earth is the:",
                    options: ["Geosphere", "Hydrosphere", "Atmosphere", "Biosphere"],
                    answer: "Biosphere",
                  },
                ],
              },
              {
                id: "earthsys-atmosphere",
                name: "Atmosphere & Greenhouse Effect",
                blurb: "How the atmosphere keeps Earth warm",
                learn: [
                  {
                    title: "The atmosphere and the greenhouse effect",
                    body: "Gases in the atmosphere trap some of the Sun's heat, keeping Earth warm enough to support life.",
                    children: [
                      {
                        title: "The greenhouse effect",
                        body: "Certain gases (like carbon dioxide and methane) trap heat that would otherwise escape to space — a natural process essential for life on Earth.",
                      },
                      {
                        title: "The enhanced greenhouse effect",
                        body: "Human activities, especially burning fossil fuels, have increased greenhouse gas levels, trapping more heat than the natural process alone.",
                      },
                    ],
                  },
                ],
                questions: [
                  {
                    id: "earthsys_q1",
                    type: "mcq",
                    prompt: "Which gas makes up the largest percentage of Earth's atmosphere?",
                    options: ["Oxygen", "Carbon dioxide", "Nitrogen", "Hydrogen"],
                    answer: "Nitrogen",
                  },
                  {
                    id: "earthsys_q2",
                    type: "text",
                    prompt: "What is the name for the natural process where gases trap heat in the atmosphere?",
                    answers: ["greenhouse effect", "the greenhouse effect"],
                  },
                ],
              },
              {
                id: "earthsys-climate",
                name: "Weather, Climate & Climate Change",
                blurb: "The difference between weather and climate, and how climate is changing",
                learn: [
                  {
                    title: "Weather vs climate",
                    body: "These two terms are often confused but describe different timescales.",
                    children: [
                      {
                        title: "Weather",
                        body: "The short-term state of the atmosphere in a place — today's temperature, rain, or wind.",
                      },
                      {
                        title: "Climate",
                        body: "The long-term average weather pattern of a region, typically measured over decades.",
                      },
                    ],
                  },
                  {
                    title: "Climate change",
                    body: "Rising greenhouse gas levels are changing Earth's climate at an unusually fast rate.",
                    children: [
                      {
                        title: "Causes",
                        body: "Burning fossil fuels (coal, oil, gas) for energy releases carbon dioxide, the main driver of recent warming.",
                      },
                      {
                        title: "Effects",
                        body: "Rising sea levels, more extreme weather events, and disruption to ecosystems that can't adapt quickly enough.",
                      },
                    ],
                  },
                ],
                questions: [
                  {
                    id: "earthsys_q3",
                    type: "mcq",
                    prompt: "The main difference between weather and climate is:",
                    options: [
                      "Weather only happens at the coast",
                      "Climate is short-term, weather is long-term",
                      "Weather is short-term, climate is a long-term average",
                      "There is no real difference",
                    ],
                    answer: "Weather is short-term, climate is a long-term average",
                  },
                  {
                    id: "earthsys_q4",
                    type: "mcq",
                    prompt: "Burning fossil fuels mainly increases atmospheric levels of:",
                    options: ["Oxygen", "Nitrogen", "Carbon dioxide", "Water vapour only"],
                    answer: "Carbon dioxide",
                  },
                  {
                    id: "earthsys_q6",
                    type: "mcq",
                    prompt: "Which of these is a typical effect of climate change?",
                    options: [
                      "Falling sea levels",
                      "More extreme weather events",
                      "A cooler, more stable climate",
                      "Reduced greenhouse gas levels",
                    ],
                    answer: "More extreme weather events",
                  },
                ],
              },
              {
                id: "earthsys-hazards",
                name: "Rock Cycle & Natural Hazards",
                blurb: "Tectonic plates, earthquakes, and volcanoes",
                learn: [
                  {
                    title: "The rock cycle and natural hazards",
                    body:
                      "Aotearoa New Zealand sits on the boundary of two tectonic plates, making rock formation and natural hazards especially relevant here.",
                    children: [
                      {
                        title: "Tectonic plates",
                        body:
                          "Earth's crust is broken into huge slabs called tectonic plates that slowly move, driven by heat from within the Earth.",
                      },
                      {
                        title: "Earthquakes",
                        body:
                          "Occur when built-up stress along a plate boundary or fault line is suddenly released, causing the ground to shake.",
                      },
                      {
                        title: "Volcanoes",
                        body:
                          "Form where molten rock (magma) rises through the crust, often near plate boundaries — New Zealand has several active volcanoes.",
                      },
                    ],
                  },
                ],
                questions: [
                  {
                    id: "earthsys_q9",
                    type: "mcq",
                    prompt: "Earth's crust is broken into large, slowly moving slabs called:",
                    options: ["Continents", "Tectonic plates", "Oceans", "Biomes"],
                    answer: "Tectonic plates",
                  },
                  {
                    id: "earthsys_q10",
                    type: "text",
                    prompt: "An earthquake happens when built-up stress along a fault is suddenly what?",
                    answers: ["released"],
                  },
                  {
                    id: "earthsys_q11",
                    type: "mcq",
                    prompt: "Volcanoes form where molten rock, called ___, rises through the crust:",
                    options: ["Lava only", "Magma", "Basalt", "Granite"],
                    answer: "Magma",
                  },
                  {
                    id: "earthsys_q12",
                    type: "mcq",
                    prompt: "Why does New Zealand experience frequent earthquakes?",
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
                    type: "text",
                    prompt: "What do we call molten rock once it reaches Earth's surface?",
                    answers: ["lava"],
                  },
                  {
                    id: "earthsys_q14",
                    type: "mcq",
                    prompt: "What mainly drives the slow movement of tectonic plates?",
                    options: ["Ocean currents", "Heat from within the Earth", "Wind patterns", "Gravity from the Moon"],
                    answer: "Heat from within the Earth",
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
                blurb: "What holds the solar system together, and its eight planets",
                learn: [
                  {
                    title: "Earth is part of a solar system within a much larger universe",
                    body:
                      "Our solar system consists of the Sun and everything that orbits it, held in place by gravity.",
                    children: [
                      {
                        title: "Gravity keeps planets in orbit",
                        body: "The Sun's gravity pulls on the planets, keeping them travelling in roughly circular paths instead of flying off in a straight line.",
                      },
                    ],
                  },
                  {
                    title: "Our solar system",
                    body: "Eight planets orbit the Sun, in order: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune.",
                    children: [
                      {
                        title: "Inner rocky planets",
                        body: "Mercury, Venus, Earth, and Mars are small, dense, and made mostly of rock.",
                      },
                      {
                        title: "Outer gas giants",
                        body: "Jupiter, Saturn, Uranus, and Neptune are much larger and made mostly of gas and ice.",
                      },
                    ],
                  },
                ],
                questions: [
                  {
                    id: "solar_q1",
                    type: "mcq",
                    prompt: "What force keeps planets in orbit around the Sun?",
                    options: ["Friction", "Gravity", "Magnetism", "Air pressure"],
                    answer: "Gravity",
                  },
                  {
                    id: "solar_q3",
                    type: "mcq",
                    prompt: "Which planet is closest to the Sun?",
                    options: ["Venus", "Earth", "Mercury", "Mars"],
                    answer: "Mercury",
                  },
                  {
                    id: "solar_q8",
                    type: "text",
                    prompt: "What term describes planets like Mercury, Venus, Earth, and Mars, made mostly of rock?",
                    answers: ["rocky planets", "terrestrial planets", "rocky", "terrestrial"],
                  },
                ],
              },
              {
                id: "solar-earthmotion",
                name: "Earth's Motion",
                blurb: "Why we get day and night, and the seasons",
                learn: [
                  {
                    title: "Earth's motion",
                    body: "Two separate movements of Earth explain our days, years, and seasons.",
                    children: [
                      {
                        title: "Rotation",
                        body: "Earth spins on its axis once roughly every 24 hours, causing day and night.",
                      },
                      {
                        title: "Revolution and tilt",
                        body: "Earth orbits the Sun once every 365.25 days. Because Earth's axis is tilted, different hemispheres receive more direct sunlight at different times of year — causing the seasons.",
                      },
                    ],
                  },
                ],
                questions: [
                  {
                    id: "solar_q2",
                    type: "text",
                    prompt: "Earth's spin on its axis causes which daily cycle?",
                    answers: ["day and night", "day/night", "day night"],
                  },
                  {
                    id: "solar_q4",
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
                    type: "mcq",
                    prompt: "Roughly how long does one full orbit of the Sun take?",
                    options: ["24 hours", "30 days", "365 days", "10 years"],
                    answer: "365 days",
                  },
                ],
              },
              {
                id: "solar-beyond",
                name: "Beyond the Solar System",
                blurb: "Stars, galaxies, and how astronomers measure the universe",
                learn: [
                  {
                    title: "Beyond the solar system",
                    body: "The Sun is just one star among billions, grouped into galaxies across the universe.",
                    children: [
                      {
                        title: "Stars and galaxies",
                        body: "A galaxy is a huge collection of stars, gas, and dust held together by gravity. Our Sun belongs to the Milky Way galaxy.",
                      },
                      {
                        title: "Light-years",
                        body: "Distances between stars are so vast that astronomers measure them in light-years — the distance light travels in one year.",
                      },
                    ],
                  },
                ],
                questions: [
                  {
                    id: "solar_q5",
                    type: "text",
                    prompt: "What unit is used to measure distances between stars?",
                    answers: ["light-year", "light year", "light-years", "light years"],
                  },
                  {
                    id: "solar_q6",
                    type: "mcq",
                    prompt: "Our solar system's galaxy is called the:",
                    options: ["Andromeda", "Milky Way", "Solar Belt", "Orion"],
                    answer: "Milky Way",
                  },
                ],
              },
              {
                id: "solar-moon",
                name: "The Moon & Eclipses",
                blurb: "Moon phases, and how eclipses happen",
                learn: [
                  {
                    title: "The Moon and eclipses",
                    body: "Earth's only natural satellite shapes some of our most familiar sky patterns.",
                    children: [
                      {
                        title: "Phases of the Moon",
                        body:
                          "The Moon doesn't produce its own light — we see it because it reflects sunlight. As it orbits Earth, we see different amounts of its sunlit side, creating phases over about 29.5 days.",
                      },
                      {
                        title: "Solar eclipse",
                        body:
                          "Occurs when the Moon passes directly between the Sun and Earth, blocking some or all of the Sun's light from a small area on Earth.",
                      },
                      {
                        title: "Lunar eclipse",
                        body:
                          "Occurs when Earth passes directly between the Sun and the Moon, casting Earth's shadow onto the Moon.",
                      },
                    ],
                  },
                ],
                questions: [
                  {
                    id: "solar_q9",
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
                    type: "text",
                    prompt: "Roughly how many days does the Moon take to go through all its phases?",
                    answers: ["29.5", "29", "29.5 days", "29 days", "a month", "about a month"],
                  },
                  {
                    id: "solar_q11",
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
                    type: "text",
                    prompt: "What is Earth's only natural satellite called?",
                    answers: ["the moon", "moon"],
                  },
                  {
                    id: "solar_q14",
                    type: "mcq",
                    prompt: "During a lunar eclipse, what falls on the Moon?",
                    options: ["Sunlight directly", "Earth's shadow", "The Moon's own shadow", "Starlight only"],
                    answer: "Earth's shadow",
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
    prevEma === null ? (correct ? 100 : 0) : Math.round(prevEma * 0.65 + (correct ? 100 : 0) * 0.35);
  return {
    seen: (prevStat?.seen || 0) + 1,
    correct: (prevStat?.correct || 0) + (correct ? 1 : 0),
    ema: newEma,
  };
}

const MASTERY_THRESHOLD = 80;

function submoduleScore(submodule, moduleProgress) {
  if (!submodule || submodule.questions.length === 0) return null;
  const stats = moduleProgress?.questionStats || {};
  let total = 0;
  for (const q of submodule.questions) {
    total += stats[q.id]?.ema ?? 0;
  }
  return Math.round(total / submodule.questions.length);
}

function moduleScore(module, moduleProgress) {
  if (!module || !module.submodules || module.submodules.length === 0) return null;
  const scored = module.submodules
    .map((sm) => submoduleScore(sm, moduleProgress))
    .filter((s) => s !== null);
  if (scored.length === 0) return null;
  return Math.round(scored.reduce((a, b) => a + b, 0) / scored.length);
}

function areaScore(area, state, subjectId) {
  const scored = area.modules
    .map((m) => moduleScore(m, getModuleProgress(state, subjectId, area.id, m.id)))
    .filter((s) => s !== null);
  if (scored.length === 0) return null;
  return Math.round(scored.reduce((a, b) => a + b, 0) / scored.length);
}

function subjectScore(subject, state) {
  const scored = subject.areas
    .filter((a) => a.available)
    .map((a) => areaScore(a, state, subject.id))
    .filter((s) => s !== null);
  if (scored.length === 0) return null;
  return Math.round(scored.reduce((a, b) => a + b, 0) / scored.length);
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
    <div style={{ background: "var(--border)", borderRadius: 4, height: 6, width: "100%", overflow: "hidden" }}>
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
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "18px 20px 14px" }}>
      {onBack ? (
        <button onClick={onBack} style={styles.iconBtn} aria-label="Back">
          <ChevronLeft size={22} color="var(--ink)" />
        </button>
      ) : (
        <div style={{ width: 38 }} />
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 600, color: "var(--ink)", lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {title}
        </div>
        {subtitle && (
          <div style={{ fontSize: 13, color: "var(--ink-dim)", marginTop: 2 }}>{subtitle}</div>
        )}
      </div>
      {onSettings && (
        <button onClick={onSettings} style={styles.iconBtn} aria-label="Settings">
          <SettingsIcon size={20} color="var(--ink)" />
        </button>
      )}
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 12.5, color: "var(--accent)", fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>
              Orbit
            </div>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 30, fontWeight: 600, color: "var(--ink)", lineHeight: 1.15, maxWidth: 240 }}>
              What are we learning today?
            </div>
            <div style={{ fontSize: 14, color: "var(--ink-dim)", marginTop: 8 }}>
              Pick a subject to get started
            </div>
          </div>
          <button onClick={onSettings} style={{ ...styles.iconBtn, marginTop: 4 }} aria-label="Settings">
            <SettingsIcon size={20} color="var(--ink)" />
          </button>
        </div>
      </div>

      <div style={{ padding: "20px 20px 0" }}>
        <button onClick={() => onOpenSubject(subject.id)} style={styles.subjectCard}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 12, color: "var(--accent)", fontWeight: 600, letterSpacing: 0.3 }}>
                {subject.tagline}
              </div>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 24, fontWeight: 600, color: "var(--ink)", marginTop: 4 }}>
                {subject.name}
              </div>
              <div style={{ fontSize: 13, color: "var(--ink-dim)", marginTop: 6 }}>
                {subject.areas.filter((a) => a.available).length} of {subject.areas.length} areas available
              </div>
            </div>
            <Ring value={score} size={52} />
          </div>
        </button>

        <div style={styles.comingSoonCard}>
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: 17, color: "var(--ink-dim)" }}>
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
      <Header title={subject.name} subtitle="Choose an area to study" onBack={onBack} onSettings={onSettings} />
      <div style={{ padding: "8px 20px 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {subject.areas.map((area) => {
          const score = area.available ? areaScore(area, state, subject.id) : null;
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
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 17, fontWeight: 600, color: "var(--ink)" }}>
                {area.name}
              </div>
              <div style={{ fontSize: 12.5, color: "var(--ink-dim)", marginTop: 4, lineHeight: 1.4 }}>
                {area.blurb}
              </div>
              <div style={{ marginTop: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                {area.available ? (
                  <Bar value={score} color={`var(--${area.accent})`} />
                ) : (
                  <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "var(--ink-dim)" }}>
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

function ModuleListScreen({ subject, area, state, onOpenModule, onBack, onSettings }) {
  return (
    <div>
      <Header title={area.name} subtitle={`${area.modules.length} modules`} onBack={onBack} onSettings={onSettings} />
      <div style={{ padding: "8px 20px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
        {area.modules.map((mod) => {
          const progress = getModuleProgress(state, subject.id, area.id, mod.id);
          const score = moduleScore(mod, progress);
          return (
            <button key={mod.id} onClick={() => onOpenModule(mod.id)} style={styles.moduleRow}>
              <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
                <div style={{ fontSize: 16, fontWeight: 600, color: "var(--ink)" }}>{mod.name}</div>
                <div style={{ fontSize: 12.5, color: "var(--ink-dim)", marginTop: 3, lineHeight: 1.4 }}>
                  {mod.blurb}
                </div>
                <div style={{ fontSize: 11.5, color: "var(--ink-dim)", marginTop: 8, fontFamily: "'IBM Plex Mono', monospace" }}>
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

function SubmoduleListScreen({ subject, area, module, state, onOpenSubmodule, onReviseAll, onBack, onSettings }) {
  const progress = getModuleProgress(state, subject.id, area.id, module.id);
  const overallScore = moduleScore(module, progress);
  const masteredCount = module.submodules.filter((sm) => {
    const s = submoduleScore(sm, progress);
    return s !== null && s >= MASTERY_THRESHOLD;
  }).length;

  return (
    <div>
      <Header title={module.name} subtitle={area.name} onBack={onBack} onSettings={onSettings} />
      <div style={{ padding: "4px 20px 8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
          <Ring value={overallScore} size={52} color={`var(--${area.accent})`} />
          <div>
            <div style={{ fontSize: 13, color: "var(--ink-dim)" }}>
              {masteredCount} of {module.submodules.length} topics mastered
            </div>
            <div style={{ fontSize: 12.5, color: "var(--ink-dim)", marginTop: 2 }}>
              {daysAgo(progress.lastStudied)}
            </div>
          </div>
        </div>
      </div>
      <div style={{ padding: "0 20px 12px", display: "flex", flexDirection: "column", gap: 10 }}>
        {module.submodules.map((sm, i) => {
          const score = submoduleScore(sm, progress);
          const mastered = score !== null && score >= MASTERY_THRESHOLD;
          return (
            <button key={sm.id} onClick={() => onOpenSubmodule(sm.id)} style={styles.moduleRow}>
              <div
                style={{
                  ...styles.submoduleIndex,
                  background: mastered ? `var(--${area.accent})` : "var(--surface-raised)",
                  borderColor: mastered ? `var(--${area.accent})` : "var(--border)",
                }}
              >
                {mastered ? (
                  <CheckCircle2 size={16} color="#12181F" />
                ) : (
                  <span style={{ fontSize: 12.5, color: "var(--ink-dim)", fontFamily: "'IBM Plex Mono', monospace" }}>
                    {i + 1}
                  </span>
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)" }}>{sm.name}</div>
                <div style={{ fontSize: 12.5, color: "var(--ink-dim)", marginTop: 3, lineHeight: 1.4 }}>
                  {sm.blurb}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Ring value={score} size={34} color={`var(--${area.accent})`} />
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

function ModeChoiceScreen({ area, submodule, state, subjectId, moduleId, onLearn, onRevise, onBack, onSettings }) {
  const progress = getModuleProgress(state, subjectId, area.id, moduleId);
  const score = submoduleScore(submodule, progress);
  return (
    <div>
      <Header title={submodule.name} subtitle={area.name} onBack={onBack} onSettings={onSettings} />
      <div style={{ padding: "12px 20px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
          <Ring value={score} size={56} color={`var(--${area.accent})`} />
          <div>
            <div style={{ fontSize: 13, color: "var(--ink-dim)" }}>Proficiency</div>
            <div style={{ fontSize: 12.5, color: "var(--ink-dim)", marginTop: 2 }}>
              {score !== null && score >= MASTERY_THRESHOLD ? "Mastered" : "Keep going"}
            </div>
          </div>
        </div>

        <button onClick={onLearn} style={{ ...styles.modeBtn, marginBottom: 12 }}>
          <BookOpen size={22} color={`var(--${area.accent})`} />
          <div style={{ flex: 1, textAlign: "left" }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: "var(--ink)" }}>Learn</div>
            <div style={{ fontSize: 12.5, color: "var(--ink-dim)", marginTop: 2 }}>
              Work through this topic from the big picture down to the details
            </div>
          </div>
          <ChevronRight size={18} color="var(--ink-dim)" />
        </button>

        <button onClick={onRevise} style={styles.modeBtn}>
          <Brain size={22} color={`var(--${area.accent})`} />
          <div style={{ flex: 1, textAlign: "left" }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: "var(--ink)" }}>Revise</div>
            <div style={{ fontSize: 12.5, color: "var(--ink-dim)", marginTop: 2 }}>
              Test your recall with questions and update your proficiency score
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

function LearnNode({ node, accent, depth }) {
  const [open, setOpen] = useState(false);
  const hasChildren = node.children && node.children.length > 0;
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
          <div style={{ fontSize: depth === 0 ? 16 : 14.5, fontWeight: 600, color: "var(--ink)" }}>
            {node.title}
          </div>
          <div style={{ fontSize: 13.5, color: "var(--ink-dim)", marginTop: 6, lineHeight: 1.55 }}>
            {open ? node.body : teaser(node.body)}
          </div>
        </div>
        {hasChildren && (
          <ChevronDown
            size={16}
            color="var(--ink-dim)"
            style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0, marginTop: 3 }}
          />
        )}
      </button>
      {open && hasChildren && (
        <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 6 }}>
          {node.children.map((child, i) => (
            <LearnNode key={i} node={child} accent={accent} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

function LearnScreen({ area, submodule, onBack, onSettings }) {
  return (
    <div>
      <Header title={submodule.name} subtitle="Learn" onBack={onBack} onSettings={onSettings} />
      <div style={{ padding: "8px 20px 32px", display: "flex", flexDirection: "column", gap: 8 }}>
        {submodule.learn.map((node, i) => (
          <LearnNode key={i} node={node} accent={area.accent} depth={0} />
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

function ReviseScreen({ area, module, subjectId, onBack, onSettings, onFinish }) {
  const [order] = useState(() => shuffle(module.questions));
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [textValue, setTextValue] = useState("");
  const [answered, setAnswered] = useState(false);
  const [wasCorrect, setWasCorrect] = useState(false);
  const [results, setResults] = useState({}); // questionId -> bool
  const [optionOrder, setOptionOrder] = useState(() =>
    order[0].type === "mcq" ? shuffle(order[0].options) : []
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
        <Header title={module.name} subtitle="Session complete" onBack={onBack} onSettings={onSettings} />
        <div style={{ padding: "24px 20px", textAlign: "center" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
            <Ring value={sessionScore} size={90} stroke={7} color={`var(--${area.accent})`} />
          </div>
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 600, color: "var(--ink)" }}>
            {correctCount} of {order.length} correct
          </div>
          <div style={{ fontSize: 13.5, color: "var(--ink-dim)", marginTop: 8, lineHeight: 1.5 }}>
            Your proficiency score has been updated. Keep revising to reinforce what you don't recall yet.
          </div>
          <button onClick={onBack} style={{ ...styles.primaryBtn, marginTop: 24, width: "100%" }}>
            Back to module
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header title={module.name} subtitle={`Question ${index + 1} of ${order.length}`} onBack={onBack} onSettings={onSettings} />
      <div style={{ padding: "12px 20px 28px" }}>
        <div style={{ fontFamily: "'Fraunces', serif", fontSize: 19, fontWeight: 600, color: "var(--ink)", lineHeight: 1.4, marginBottom: 20 }}>
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
                  borderColor: answered ? (wasCorrect ? "var(--correct)" : "var(--incorrect)") : "var(--border)",
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
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}>
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
          <button onClick={next} style={{ ...styles.primaryBtn, width: "100%", marginTop: 22 }}>
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
        if (typeof parsed !== "object" || parsed === null || !("schemaVersion" in parsed)) {
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
      <div style={{ padding: "8px 20px 32px", display: "flex", flexDirection: "column", gap: 24 }}>
        <div>
          <div style={styles.settingsLabel}>Your data</div>
          <div style={{ fontSize: 13, color: "var(--ink-dim)", marginBottom: 12, lineHeight: 1.5 }}>
            Export your progress to back it up or move it to another device. Import replaces your current progress.
          </div>
          <button onClick={onExport} style={{ ...styles.secondaryBtn, marginBottom: 10 }}>
            <Download size={16} /> Export progress
          </button>
          <label style={{ ...styles.secondaryBtn, cursor: "pointer" }}>
            <Upload size={16} /> Import progress
            <input type="file" accept="application/json" onChange={handleFile} style={{ display: "none" }} />
          </label>
          {importError && (
            <div style={{ fontSize: 12.5, color: "var(--incorrect)", marginTop: 8 }}>{importError}</div>
          )}
        </div>

        <div>
          <div style={styles.settingsLabel}>Reset</div>
          <div style={{ fontSize: 13, color: "var(--ink-dim)", marginBottom: 12, lineHeight: 1.5 }}>
            Clear all proficiency scores and start fresh. This can't be undone.
          </div>
          {!confirmReset ? (
            <button onClick={() => setConfirmReset(true)} style={styles.secondaryBtn}>
              <RotateCcw size={16} /> Reset all progress
            </button>
          ) : (
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => {
                  onReset();
                  setConfirmReset(false);
                }}
                style={{ ...styles.secondaryBtn, borderColor: "var(--incorrect)", color: "var(--incorrect)" }}
              >
                Yes, reset everything
              </button>
              <button onClick={() => setConfirmReset(false)} style={styles.secondaryBtn}>
                Cancel
              </button>
            </div>
          )}
        </div>

        <div style={{ marginTop: 12, paddingTop: 20, borderTop: "1px solid var(--border)" }}>
          <div style={{ fontSize: 12.5, color: "var(--ink-dim)", fontFamily: "'IBM Plex Mono', monospace" }}>
            Version {APP_VERSION} · schema v{SCHEMA_VERSION}
          </div>
          <div style={{ fontSize: 12, color: "var(--ink-dim)", marginTop: 6, lineHeight: 1.5 }}>
            Progress is saved automatically on this device. Export a backup before switching phones, clearing browser data, or reinstalling.
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
    if (!parsed || typeof parsed !== "object" || !("progress" in parsed)) return emptyState();
    return { schemaVersion: parsed.schemaVersion || SCHEMA_VERSION, progress: parsed.progress || {} };
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

  const recordSession = useCallback(
    (subjectId, areaId, moduleId, results) => {
      setState((prev) => {
        const next = structuredClone(prev);
        if (!next.progress[subjectId]) next.progress[subjectId] = {};
        if (!next.progress[subjectId][areaId]) next.progress[subjectId][areaId] = {};
        const existing = next.progress[subjectId][areaId][moduleId] || {
          questionStats: {},
          lastStudied: null,
        };
        for (const [qId, correct] of Object.entries(results)) {
          existing.questionStats[qId] = updateStat(existing.questionStats[qId], correct);
        }
        existing.lastStudied = Date.now();
        next.progress[subjectId][areaId][moduleId] = existing;
        return next;
      });
    },
    []
  );

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
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
        onOpenArea={(areaId) => push({ screen: "modules", subjectId: subject.id, areaId })}
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
          push({ screen: "submodules", subjectId: subject.id, areaId: area.id, moduleId })
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
        onOpenSubmodule={(submoduleId) => push({ ...current, screen: "mode", submoduleId })}
        onReviseAll={() => push({ ...current, screen: "revise", submoduleId: "ALL" })}
        onBack={pop}
        onSettings={openSettings}
      />
    );
  } else if (current.screen === "mode") {
    const subject = SUBJECTS[current.subjectId];
    const area = subject.areas.find((a) => a.id === current.areaId);
    const module = area.modules.find((m) => m.id === current.moduleId);
    const submodule = module.submodules.find((sm) => sm.id === current.submoduleId);
    body = (
      <ModeChoiceScreen
        area={area}
        submodule={submodule}
        state={state}
        subjectId={subject.id}
        moduleId={module.id}
        onLearn={() => push({ ...current, screen: "learn" })}
        onRevise={() => push({ ...current, screen: "revise" })}
        onBack={pop}
        onSettings={openSettings}
      />
    );
  } else if (current.screen === "learn") {
    const subject = SUBJECTS[current.subjectId];
    const area = subject.areas.find((a) => a.id === current.areaId);
    const module = area.modules.find((m) => m.id === current.moduleId);
    const submodule = module.submodules.find((sm) => sm.id === current.submoduleId);
    body = <LearnScreen area={area} submodule={submodule} onBack={pop} onSettings={openSettings} />;
  } else if (current.screen === "revise") {
    const subject = SUBJECTS[current.subjectId];
    const area = subject.areas.find((a) => a.id === current.areaId);
    const module = area.modules.find((m) => m.id === current.moduleId);
    const revising =
      current.submoduleId === "ALL"
        ? { id: "all", name: module.name, questions: module.submodules.flatMap((sm) => sm.questions) }
        : module.submodules.find((sm) => sm.id === current.submoduleId);
    body = (
      <ReviseScreen
        area={area}
        module={revising}
        subjectId={subject.id}
        onBack={pop}
        onSettings={openSettings}
        onFinish={(results) => recordSession(subject.id, area.id, module.id, results)}
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
