/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Department, QuestionPaper, StudyResource, QuizQuestion, Announcement } from '../types';

export const DEPARTMENTS_DATA: Department[] = [
  {
    id: 'physics',
    name: 'Department of Physics',
    description: 'The Physics department at THB College is dedicated to providing a comprehensive education in physics, combining theoretical knowledge with practical applications. The department offers undergraduate courses that cover a wide range of topics, including classical mechanics, electromagnetism, quantum mechanics, and thermodynamics.',
    hodName: 'Dr. Rasna Rajkhowa',
    labs: [
      'General Physics Laboratory',
      'Advanced Optics & Spectroscopic Darkroom',
      'Analog & Digital Electronics Lab',
      'Computational Physics Simulation Cell'
    ],
    careerProspects: [
      'Research Scientist in BARC, ISRO & CSIR Labs',
      'Data Analyst or Computational Modeling Specialist',
      'Geophysicist and Meteorological Consultant',
      'Academician and Educators in Premier Institutions'
    ],
    achievements: [
      'DST-FIST sponsored departmental state-of-the-art research instrumentation.',
      'Over 15 research papers published in International SCI journals in the last 3 years.',
      'Our alumni are pursuing Ph.D. positions at IITs, IISer, and overseas universities.'
    ],
    faculties: [
      {
        name: 'Dr. Rasna Rajkhowa',
        designation: 'Assistant Professor & HoD',
        qualification: 'M.Sc., Ph.D. (Gauhati University)',
        specialization: 'Spectroscopy & Theoretical Physics',
        email: 'rasna.r@thbcollege.ac.in',
        contact: '9854492326'
      },
      {
        name: 'Dr. Palash Borah',
        designation: 'Assistant Professor',
        qualification: 'M.Sc., Ph.D. (Tezpur University)',
        specialization: 'Nuclear Physics & Quantum Mechanics',
        email: 'palash.b@thbcollege.ac.in',
        contact: '7002167936'
      },
      {
        name: 'Dr. Paramita Deka',
        designation: 'Assistant Professor',
        qualification: 'M.Sc., Ph.D. (NEHU)',
        specialization: 'Condensed Matter Physics & Electronics',
        email: 'paramita.d@thbcollege.ac.in',
        contact: '8486579743'
      }
    ],
    syllabus: {
      title: 'Gauhati University B.Sc. Physics (Honours) CBCS Syllabus',
      pdfUrl: 'https://web.gauhati.ac.in/syllabi/undergraduate/cbcs/BSc_Physics_Honours.pdf',
      fileSize: '1.2 MB',
      modules: [
        'Mathematical Physics-I & Mechanics',
        'Electricity & Magnetism',
        'Thermal Physics',
        'Digital Systems & Applications',
        'Quantum Mechanics & Solid State Physics',
        'Electromagnetic Theory'
      ]
    }
  },
  {
    id: 'chemistry',
    name: 'Department of Chemistry',
    description: 'The Chemistry department at THB College offers a comprehensive education in chemistry, encompassing both theoretical concepts and practical applications. The department provides undergraduate courses covering various branches of chemistry, including organic, inorganic, physical, and analytical chemistry.',
    hodName: 'Bipul Chandra Saikia',
    labs: [
      'Inorganic & Organic Synthesis Laboratory',
      'Physical Chemistry Instrumentation Center',
      'Environmental Analysis Wing'
    ],
    careerProspects: [
      'Chemical & Pharmaceutical Industry Researcher',
      'Quality Control Analyst in Food & Materials Sectors',
      'Environmental Scientist & Water Quality Specialist',
      'Higher Studies in Chemical Sciences'
    ],
    achievements: [
      'Successfully completed UGC major research project on local water contaminants.',
      'Highest student placement in ASTU/Gauhati University chemistry postgraduate streams.',
      'Hosted National Seminar on Green Chemistry and Local Biodiversity products.'
    ],
    faculties: [
      {
        name: 'Bipul Chandra Saikia',
        designation: 'Assistant Professor & HoD',
        qualification: 'M.Sc. (Dibrugarh University), M.Phil.',
        specialization: 'Organic Chemistry & Natural Product Isolation',
        email: 'bipul.saikia@thbcollege.ac.in',
        contact: '8011438500'
      },
      {
        name: 'Dipak Saikia',
        designation: 'Assistant Professor',
        qualification: 'M.Sc. (Gauhati University)',
        specialization: 'Analytical Chemistry & Kinetics',
        email: 'dipak.saikia@thbcollege.ac.in',
        contact: '6002295643'
      }
    ],
    syllabus: {
      title: 'Gauhati University B.Sc. Chemistry (Honours) CBCS Syllabus',
      pdfUrl: 'https://web.gauhati.ac.in/syllabi/undergraduate/cbcs/BSc_Chemistry_Honours.pdf',
      fileSize: '1.4 MB',
      modules: [
        'Inorganic Chemistry-I & Physical Chemistry-I',
        'Organic Chemistry-I & Physical Chemistry-II',
        'Organic Chemistry-II & Inorganic Chemistry-II',
        'Physical Chemistry-III & Organic Chemistry-III',
        'Inorganic Chemistry-IV & Physical Chemistry-IV',
        'Organic Chemistry-V & Spectroscopy'
      ]
    }
  },
  {
    id: 'mathematics',
    name: 'Department of Mathematics',
    description: 'The Mathematics department at THB College offers a diverse range of courses in mathematics, covering areas such as algebra, calculus, geometry, and statistics. The department aims to provide students with a solid foundation in mathematical theory and its practical applications.',
    hodName: 'Dr. Nava Jyoti Hazarika',
    labs: [
      'Mathematical Computing Lab (MATLAB, SageMath, C++)',
      'Departmental Reference Library'
    ],
    careerProspects: [
      'Actuarial Science & Risk Analyst in Insurance Sectors',
      'Cryptologist & Cyber Security Analyst',
      'Software Developer or Systems Architect',
      'Research Scholar in Pure or Applied Mathematics'
    ],
    achievements: [
      'Students secured top ranks in the State Mathematical Olympiad.',
      'Regular workshops organized on Career Opportunities in Statistics and Actuarial Science.',
      'Special remedial coaching provided for JAM/GATE science entrance tests.'
    ],
    faculties: [
      {
        name: 'Dr. Nava Jyoti Hazarika',
        designation: 'Assistant Professor & HoD',
        qualification: 'M.Sc., Ph.D. (Gauhati University)',
        specialization: 'Abstract Algebra & Topologies',
        email: 'navajyoti.h@thbcollege.ac.in',
        contact: '9854020070'
      },
      {
        name: 'Dr. Bhaskar Kalita',
        designation: 'Associate Professor',
        qualification: 'M.Sc., Ph.D. (Gauhati University)',
        specialization: 'Fluid Dynamics & Applied Mathematics',
        email: 'bhaskar.k@thbcollege.ac.in',
        contact: '7002550338'
      },
      {
        name: 'Gaurab Bardhan',
        designation: 'Assistant Professor',
        qualification: 'M.Sc. (Tezpur University)',
        specialization: 'Real Analysis & Number Theory',
        email: 'gaurab.b@thbcollege.ac.in',
        contact: '6000404331'
      }
    ],
    syllabus: {
      title: 'Gauhati University B.Sc. Mathematics (Honours) CBCS Syllabus',
      pdfUrl: 'https://web.gauhati.ac.in/syllabi/undergraduate/cbcs/BSc_Mathematics_Honours.pdf',
      fileSize: '1.1 MB',
      modules: [
        'Calculus & Algebra (Group Theory)',
        'Real Analysis & Differential Equations',
        'Theory of Real Functions & PDE',
        'Numerical Methods & Riemann Integration',
        'Ring Theory & Multivariate Calculus',
        'Complex Analysis & Metric Spaces'
      ]
    }
  },
  {
    id: 'botany',
    name: 'Department of Botany',
    description: 'The Botany department at THB College offers a comprehensive education in plant sciences, covering topics such as plant anatomy, physiology, taxonomy, ecology, and biotechnology. The department provides undergraduate courses that emphasize both theoretical knowledge and practical skills in the field of botany.',
    hodName: 'Dr. Tulshi Upadhyay',
    labs: [
      'Plant Physiology & Biochemistry Laboratory',
      'Cytogenetics & Plant Tissue Culture Center',
      'Regional Botanical Museum & Ethnobotanical Herbarium'
    ],
    careerProspects: [
      'Forest Officer / Ecologist in State Environment Dept',
      'Agricultural Officer & Plant Breeder',
      'Research & Curator in Botanical Gardens and Herbaria',
      'Pharmacognosist and Herbal Formulation Designer'
    ],
    achievements: [
      'Maintains an extensive Botanical Garden inside THB College campus with over 150 rare medicinal species.',
      'Collaborative Research project initiated with tea board authority of Assam.',
      'Annual Field Excursions to Bio-Hotspots in Northeast India.'
    ],
    faculties: [
      {
        name: 'Dr. Tulshi Upadhyay',
        designation: 'Assistant Professor & HoD',
        qualification: 'M.Sc., Ph.D. (Gauhati University)',
        specialization: 'Plant Physiology & Ecology',
        email: 'tulshi.u@thbcollege.ac.in',
        contact: '8876635028'
      },
      {
        name: 'Rupa Kalita',
        designation: 'Assistant Professor',
        qualification: 'M.Sc. (Gauhati University)',
        specialization: 'Cytogenetics & Plant Anatomy',
        email: 'rupa.kalita@thbcollege.ac.in',
        contact: '8638936103'
      },
      {
        name: 'Bikash Deka',
        designation: 'Assistant Professor',
        qualification: 'M.Sc. (Gauhati University)',
        specialization: 'Plant Biotechnology & Molecular Breeding',
        email: 'bikash.deka@thbcollege.ac.in',
        contact: 'N/A'
      },
      {
        name: 'Baishali Das',
        designation: 'Assistant Professor',
        qualification: 'M.Sc. (Gauhati University)',
        specialization: 'Mycology & Phytopathology',
        email: 'baishali.das@thbcollege.ac.in',
        contact: 'N/A'
      }
    ],
    syllabus: {
      title: 'Gauhati University B.Sc. Botany (Honours) CBCS Syllabus',
      pdfUrl: 'https://web.gauhati.ac.in/syllabi/undergraduate/cbcs/BSc_Botany_Honours.pdf',
      fileSize: '1.3 MB',
      modules: [
        'Microbiology, Phycology & Mycology',
        'Archegoniatae, Anatomy & Angiosperm Taxonomy',
        'Economic Botany & Genetics',
        'Molecular Biology & Plant Ecology',
        'Plant Physiology & Metabolism',
        'Plant Biotechnology & Bio-informatics'
      ]
    }
  },
  {
    id: 'zoology',
    name: 'Department of Zoology',
    description: 'A thriving biological hub dedicated to animal physiology, biodiversity conservation, toxicology, and evolutionary genetics. We emphasize field learning and laboratory analysis.',
    hodName: 'Dr. Rupam Hazarika',
    labs: [
      'General & Advanced Zoology Lab',
      'Bioscience & Molecular Biology Unit',
      'Vertebrate and Invertebrate Specimen Museum'
    ],
    careerProspects: [
      'Wildlife Biologist & Conservation Strategist (Kaziranga Network)',
      'Fishery Extension Officer or Apiculture Specialist',
      'Scientific Analyst in Healthcare and Toxicological Labs',
      'Forest Ranger and Environmental Officer'
    ],
    achievements: [
      'Active student campaigns on protecting local endangered species like the One-horned Rhinoceros.',
      'Departmental projects funded by ASTEC (Assam Science Technology & Ecology Council).',
      'Regular industrial visits to dairy, sericulture, and aquaculture state farms.'
    ],
    faculties: [
      {
        name: 'Dr. Rupam Hazarika',
        designation: 'Associate Professor & HoD',
        qualification: 'M.Sc., Ph.D. (Dibrugarh University)',
        specialization: 'Fisheries Biology & Freshwater Limnology',
        email: 'rupam.hazarika@thbcollege.ac.in'
      },
      {
        name: 'Dr. Kakali Chetia',
        designation: 'Assistant Professor',
        qualification: 'M.Sc., Ph.D. (Gauhati University)',
        specialization: 'Cell Biology & Insect Endocrinology',
        email: 'kakali.c@thbcollege.ac.in'
      }
    ],
    syllabus: {
      title: 'Gauhati University B.Sc. Zoology (Honours) CBCS Syllabus',
      pdfUrl: 'https://web.gauhati.ac.in/syllabi/undergraduate/cbcs/BSc_Zoology_Honours.pdf',
      fileSize: '1.5 MB',
      modules: [
        'Non-Chordates & Cell Biology',
        'Chordates & Animal Physiology',
        'Biochemistry & Molecular Biology',
        'Principles of Ecology & Evolution',
        'Developmental Biology & Parasitology',
        'Animal Biotechnology & Immunology'
      ]
    }
  }
];

export const QUESTION_PAPERS: QuestionPaper[] = [
  // Physics PYQs
  {
    id: 'q-phy-1',
    subject: 'Mechanics & Relativity (Major)',
    departmentId: 'physics',
    semester: 'Semester I',
    year: 2024,
    examType: 'End-Semester Exam',
    fileSize: '1.4 MB',
    downloads: 342
  },
  {
    id: 'q-phy-2',
    subject: 'Electricity and Magnetism',
    departmentId: 'physics',
    semester: 'Semester II',
    year: 2023,
    examType: 'End-Semester Exam',
    fileSize: '1.2 MB',
    downloads: 215
  },
  {
    id: 'q-phy-3',
    subject: 'Thermal Physics & Statistical Mechanics',
    departmentId: 'physics',
    semester: 'Semester III',
    year: 2024,
    examType: 'End-Semester Exam',
    fileSize: '1.6 MB',
    downloads: 198
  },
  {
    id: 'q-phy-4',
    subject: 'Mathematical Physics - II',
    departmentId: 'physics',
    semester: 'Semester III',
    year: 2022,
    examType: 'End-Semester Exam',
    fileSize: '1.8 MB',
    downloads: 165
  },
  {
    id: 'q-phy-5',
    subject: 'Quantum Mechanics',
    departmentId: 'physics',
    semester: 'Semester V',
    year: 2024,
    examType: 'End-Semester Exam',
    fileSize: '2.1 MB',
    downloads: 289
  },
  {
    id: 'q-phy-6',
    subject: 'Solid State Physics',
    departmentId: 'physics',
    semester: 'Semester V',
    year: 2023,
    examType: 'End-Semester Exam',
    fileSize: '1.5 MB',
    downloads: 233
  },
  {
    id: 'q-phy-sessional-1',
    subject: 'Classical Mechanics & Wave Motion',
    departmentId: 'physics',
    semester: 'Semester I',
    year: 2024,
    examType: 'Sessional Exam',
    fileSize: '650 KB',
    downloads: 140
  },

  // Chemistry PYQs
  {
    id: 'q-chm-1',
    subject: 'Organic Chemistry - I (Reactions of Hydrocarbons)',
    departmentId: 'chemistry',
    semester: 'Semester I',
    year: 2024,
    examType: 'End-Semester Exam',
    fileSize: '1.8 MB',
    downloads: 412
  },
  {
    id: 'q-chm-2',
    subject: 'Physical Chemistry - I (Gas Laws & Thermodynamics)',
    departmentId: 'chemistry',
    semester: 'Semester II',
    year: 2023,
    examType: 'End-Semester Exam',
    fileSize: '2.0 MB',
    downloads: 308
  },
  {
    id: 'q-chm-3',
    subject: 'Inorganic Chemistry - II (Transition Elements)',
    departmentId: 'chemistry',
    semester: 'Semester III',
    year: 2024,
    examType: 'End-Semester Exam',
    fileSize: '1.7 MB',
    downloads: 271
  },
  {
    id: 'q-chm-4',
    subject: 'Molecular Spectroscopy & Photochemistry',
    departmentId: 'chemistry',
    semester: 'Semester V',
    year: 2024,
    examType: 'End-Semester Exam',
    fileSize: '1.9 MB',
    downloads: 320
  },
  {
    id: 'q-chm-sessional-1',
    subject: 'Basic Principles of Analytical Chemistry',
    departmentId: 'chemistry',
    semester: 'Semester IV',
    year: 2023,
    examType: 'Sessional Exam',
    fileSize: '780 KB',
    downloads: 98
  },

  // Mathematics PYQs
  {
    id: 'q-mat-1',
    subject: 'Calculus & Analytical Geometry',
    departmentId: 'mathematics',
    semester: 'Semester I',
    year: 2024,
    examType: 'End-Semester Exam',
    fileSize: '2.2 MB',
    downloads: 502
  },
  {
    id: 'q-mat-2',
    subject: 'Algebra - I (Group Theory & Linear Algebra)',
    departmentId: 'mathematics',
    semester: 'Semester II',
    year: 2023,
    examType: 'End-Semester Exam',
    fileSize: '1.9 MB',
    downloads: 410
  },
  {
    id: 'q-mat-3',
    subject: 'Real Analysis',
    departmentId: 'mathematics',
    semester: 'Semester III',
    year: 2024,
    examType: 'End-Semester Exam',
    fileSize: '1.8 MB',
    downloads: 356
  },
  {
    id: 'q-mat-4',
    subject: 'Differential Equations & Mathematical Modeling',
    departmentId: 'mathematics',
    semester: 'Semester IV',
    year: 2023,
    examType: 'End-Semester Exam',
    fileSize: '1.7 MB',
    downloads: 280
  },
  {
    id: 'q-mat-5',
    subject: 'Complex Analysis',
    departmentId: 'mathematics',
    semester: 'Semester VI',
    year: 2024,
    examType: 'End-Semester Exam',
    fileSize: '2.1 MB',
    downloads: 195
  },

  // Botany PYQs
  {
    id: 'q-bot-1',
    subject: 'Phycology and Microbiology',
    departmentId: 'botany',
    semester: 'Semester I',
    year: 2024,
    examType: 'End-Semester Exam',
    fileSize: '1.5 MB',
    downloads: 220
  },
  {
    id: 'q-bot-2',
    subject: 'Mycology and Phytopathology',
    departmentId: 'botany',
    semester: 'Semester II',
    year: 2023,
    examType: 'End-Semester Exam',
    fileSize: '1.6 MB',
    downloads: 185
  },
  {
    id: 'q-bot-3',
    subject: 'Plant Anatomy and Embryology',
    departmentId: 'botany',
    semester: 'Semester III',
    year: 2024,
    examType: 'End-Semester Exam',
    fileSize: '1.4 MB',
    downloads: 247
  },

  // Zoology PYQs
  {
    id: 'q-zoo-1',
    subject: 'Non-Chordates I: Protista to Pseudocoelomates',
    departmentId: 'zoology',
    semester: 'Semester I',
    year: 2024,
    examType: 'End-Semester Exam',
    fileSize: '1.3 MB',
    downloads: 290
  },
  {
    id: 'q-zoo-2',
    subject: 'Principles of Ecology',
    departmentId: 'zoology',
    semester: 'Semester II',
    year: 2023,
    examType: 'End-Semester Exam',
    fileSize: '1.5 MB',
    downloads: 212
  },
  {
    id: 'q-zoo-3',
    subject: 'Cell Biology & Genetics',
    departmentId: 'zoology',
    semester: 'Semester III',
    year: 2024,
    examType: 'End-Semester Exam',
    fileSize: '1.7 MB',
    downloads: 310
  },

];

export const STUDY_RESOURCES: StudyResource[] = [
  // Physics Resources
  {
    id: 'r-phy-1',
    title: 'Lecture Notes on Quantum Uncertainty & Wave Functions',
    departmentId: 'physics',
    semester: 'Semester V',
    type: 'Note',
    author: 'Prof. Himashree Goswami',
    description: 'Detailed insights on the dual nature of matter, Heisenberg uncertainty relation, and mathematical modeling of Schrodinger equations with practical 1-D potential well boundary limits.',
    downloadCount: 145,
    fileSize: '1.2 MB',
    contentPreview: `### Quantum Mechanics & The Uncertainty Principle
    
**1. Postulates of Quantum Mechanics:**
- The state of a quantum system is fully characterized by a wave function $\\Psi(x, t)$.
- For every physical observable, there corresponds a mathematical Hermitian operator.
- The expectation value of an observable represented by operator $\\hat{A}$ is given by:
  $$\\langle A \\rangle = \\int_{-\\infty}^{\\infty} \\Psi^* \\hat{A} \\Psi \\, dx$$

**2. Heisenberg Uncertainty Principle:**
- Energy and Position-Momentum limits form canonical conjugates:
  $$\\Delta x \\cdot \\Delta p \\ge \\frac{\\hbar}{2}$$
- Where $\\hbar = h / (2\\pi)$ is the reduced Planck constant.

**3. Application: Infinite Square Well (1-D Box):**
  - Boundary conditions: $V(x) = 0$ for $0 < x < L$, and $V(x) = \\infty$ elsewhere.
  - Solving the Schrodinger Equation yields normalized wavefunctions:
    $$\\psi_n(x) = \\sqrt{\\frac{2}{L}} \\sin\\left(\\frac{n\\pi x}{L}\\right)$$
  - Quantized Energy levels:
    $$E_n = \\frac{n^2 h^2}{8 m L^2}$$
`
  },
  {
    id: 'r-phy-2',
    title: 'Advanced Optics Darkroom Lab Manual & Experiment Notes',
    departmentId: 'physics',
    semester: 'Semester III',
    type: 'Lab Manual',
    author: 'Dr. Nayan Jyoti Kalita',
    description: 'Step-by-step methodologies on determining sodium light wavelength using Newton\'s rings apparatus and measuring Rydberg constant using diffraction spectrometer setups.',
    downloadCount: 89,
    fileSize: '2.5 MB',
    contentPreview: `### Advanced Optics Lab Manual: Newton's Rings Experiment
    
**Experiment Objective:**
To determine the wavelength of monoclonal sodium light using the interference pattern of Newton’s Rings.

**Formula & Apparatus Requirements:**
- Plano-Convex Lens of high radius of curvature ($R$).
- Flat Glass Plate.
- Travelling Microscope or micrometer scale.
- Sodium vapor lamp context.
- Formula: 
  $$\\lambda = \\frac{D_{n+m}^2 - D_n^2}{4 m R}$$
  where $D_n$ is the diameter of the $n$-th dark ring.

**Standard Protocol:**
1. Clean the lens surface and glass slide thoroughly with absolute alcohol.
2. Set up the $45^{\\circ}$ reflector wedge to generate orthogonal incident beam interference.
3. Bring the central black spotlight spot into focus using the fine micrometer control.
4. Record horizontal crosswire points traveling right (rings 20, 18, ..., 2) and repeating for the left margin.
`
  },

  // Chemistry Resources
  {
    id: 'r-chm-1',
    title: 'Core Organic Mechanism - Nucleophilic Substitution (S_N1 vs S_N2)',
    departmentId: 'chemistry',
    semester: 'Semester I',
    type: 'Note',
    author: 'Prof. Devajyoti Baruah',
    description: 'Full kinetics, pathway illustrations, solvent selection rules, stereobond inversion criteria, and local diagnostic exercise keys.',
    downloadCount: 220,
    fileSize: '1.4 MB',
    contentPreview: `### Nucleophilic Substitution Pathways (S_N1 vs S_N2)
    
**1. S_N1 (Substitution Nucleophilic Unimolecular):**
- **Kinetics:** First order reaction, Rate = $k[R-X]$. Two-step mechanism.
- **Intermediate:** Carbocation formation. Stability: $3^{\\circ} > 2^{\\circ} >> 1^{\\circ}$.
- **Stereochemistry:** Racemization (attack from both sides leads to racemic mixture).
- **Protic Polar Solvents:** Strongly favored (e.g., $H_2O$, $CH_3OH$) as they stabilize the leaving group anion.

**2. S_N2 (Substitution Nucleophilic Bimolecular):**
- **Kinetics:** Second order, Rate = $k[R-X][\\text{Nu}^-]$. Single concerted step.
- **Intermediate:** Pentacoordinated transition state. Steric hindrance holds back rate.
- **Stereochemistry:** Walden Inversion (exclusive back-side attack).
- **Aprotic Polar Solvents:** Strongly favored (e.g., DMSO, Acetone) keeping nucleophiles bare and active.
`
  },
  {
    id: 'r-chm-2',
    title: 'Gauhati University Chemistry Complete B.Sc. Syllabus Profile',
    departmentId: 'chemistry',
    semester: 'Semester I',
    type: 'Syllabus',
    author: 'Academic Council',
    description: 'Official core curriculum syllabus blueprint detailing distribution of physical, organic, and analytical paper credits.',
    downloadCount: 165,
    fileSize: '950 KB',
    contentPreview: `### Gauhati University Chemistry Syllabus (CBCS)
    
**General Breakdown:**
- **Semester I:** Organic Chemistry (Structure & Bonding), Inorganic Chemistry (Atomic Orbitals).
- **Semester II:** Physical Chemistry (Ideal Gases, Thermodynamics-I).
- **Semester III:** Stereochemistry, Phase Equilibria, Coordination Materials.
- **Semester IV:** Molecular Spectroscopy, Organic Synthesis, Green Contaminants.
- **Semester V:** Quantum Chemistry, Industrial Polymers, Quantitative Analysis Labs.
- **Semester VI:** Nanomaterials, Analytical Instrumentation, Dissertation Research.
`
  },

  // Mathematics Resources
  {
    id: 'r-mat-1',
    title: 'Selected Theorems on Real Analysis (Dedekind cuts & Cantor Sets)',
    departmentId: 'mathematics',
    semester: 'Semester III',
    type: 'Lecture Note',
    author: 'Dr. Rupali Saikia Bhuyan',
    description: 'Comprehensive proofs on Bolzano-Weierstrass theorem, completeness of real fields, Heine-Borel covers, and construction of nowhere-dense Cantor ternary structures.',
    downloadCount: 180,
    fileSize: '1.5 MB',
    contentPreview: `### Real Analysis: Completeness & Limit Theorems
    
**1. Bolzano-Weierstrass Theorem:**
*Theorem:* Every bounded sequence of real numbers has a convergent subsequence.
*Proof sketch:* Let $(x_n)$ be a bounded sequence mapped in compact interval $[a, b]$. Bisect the interval repeatedly into $[a, c]$ and $[c, b]$. At least one must contain infinitely many indices of $x_n$. Inductively constructing sub-intervals leads to a unique point $x$ which acts as subsequence limit.

**2. Heine-Borel Theorem:**
*Theorem:* A subset $S$ of $\\mathbb{R}$ is compact if and only if it is closed and bounded.

**3. Cantor Ternary Set construction:**
- Start with the closed unit interval $I_0 = [0, 1]$.
- Remove the open middle third interval $G_1 = (1/3, 2/3)$, leaving $I_1 = [0, 1/3] \\cup [2/3, 1]$.
- Proceed iteratively: $C = \\bigcap_{n=1}^\\infty I_n$.
- Properties: Uncountable, zero measure, totally disconnected, and compact.
`
  },

];

export const SCIENCE_QUIZ: QuizQuestion[] = [
  // Physics Questions
  {
    id: 'qz-phy-1',
    departmentId: 'physics',
    question: 'According to Heisenberg\'s Uncertainty Principle, what is the product of the uncertainty in position and momentum strictly constrained by?',
    options: [
      'Greater than or equal to Planck\'s constant (h)',
      'Greater than or equal to h / (4π), which is ħ / 2',
      'Exactly equal to speed of light squared',
      'Constrained to zero at absolute zero temperature'
    ],
    correctIndex: 1,
    explanation: 'The fundamental uncertainty relation is Δx · Δp ≥ ℏ/2, where Joint variables cannot be measured with absolute precision. ℏ is h/2π, so ℏ/2 = h/4π.'
  },
  {
    id: 'qz-phy-2',
    departmentId: 'physics',
    question: 'In a plano-convex lens setup for Newton\'s rings, what is the geometric reason behind getting dark central fringes in reflected light?',
    options: [
      'Constructive interference due to total internal reflection',
      'Phase change of π (180 degrees) upon reflection off the denser bottom glass plate, producing destructive interference',
      'Inherent color absorption of the sodium lamp spectrum',
      'Scattering by dust particles at the contact hotspot'
    ],
    correctIndex: 1,
    explanation: 'When light reflects off the bottom glass plate (denser medium), it undergoes a phase shift of 180° (π). Since distance is zero at the contact point, this phase change ensures destructive interference, resulting in a dark central spot.'
  },

  // Chemistry Questions
  {
    id: 'qz-chm-1',
    departmentId: 'chemistry',
    question: 'Which of the following organic reaction pathways features a concerted, single-step reaction with complete stereochemical configuration inversion (Walden Inversion)?',
    options: [
      'S_N1 Mechanistic pathway',
      'S_N2 Mechanistic pathway',
      'E1 Elimination mechanism',
      'Electrophilic aromatic substitution (EArS)'
    ],
    correctIndex: 1,
    explanation: 'The SN2 reaction is a backside-coordinated nucleophilic attack. It occurs in a single step with a pentacoordinate transition state, flipping the bonds like an umbrella in a strong wind (Walden Inversion).'
  },
  {
    id: 'qz-chm-2',
    departmentId: 'chemistry',
    question: 'What type of polar solvents are generally used to speed up and optimize nucleophilic substitution rates in S_N2 reactions?',
    options: [
      'Protic Polar solvents like Water and Ethanol',
      'Aprotic Polar solvents like DMSO, THF, and Acetone',
      'Non-polar solvents like Hexane and Toluene',
      'Supercritical liquid water'
    ],
    correctIndex: 1,
    explanation: 'Aprotic polar solvents (DMSO, DMF, Acetone) do not have acidic hydrogens, so they do not solvate or mask nucleophiles through hydrogen-bonding. This leaves the nucleophile free and active for backside displacement.'
  },

  // Math Questions
  {
    id: 'qz-mat-1',
    departmentId: 'mathematics',
    question: 'Which theorem states that every bounded set of real numbers contains a subsequence that converges to a real limit point?',
    options: [
      'Heine-Borel Compactness Theorem',
      'Bolzano-Weierstrass Theorem',
      'Intermediate Value Theorem (IVT)',
      'Cayley\'s Isomorphism Theorem'
    ],
    correctIndex: 1,
    explanation: 'The Bolzano-Weierstrass Theorem guarantees that infinite bounded subsets of real numbers possess convergent subsequences, a foundational component of modern abstract analysis.'
  },

];

export const ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Gauhati University Practical Exam Schedule Announced',
    content: 'The B.Sc. 2nd, 4th, and 6th Semester Practical Examinations are scheduled from June 15 to June 25, 2026. Students are requested to contact their respective laboratory in-charges to verify roll-number slots and submit completed raw laboratory notebooks on or before June 10.',
    date: 'May 28, 2026',
    tag: 'Exam',
    isImportant: true
  },
  {
    id: 'ann-2',
    title: 'Inauguration of DST-FIST Computational Physics Wing',
    content: 'The Science Dean is cordially inviting all majors and research practitioners to the inauguration of our high-speed Computational Modeling Center. Dr. Hemanta Saikia from Tezpur University will join as chief guest and conduct a session on Multi-Physics simulations.',
    date: 'May 25, 2026',
    tag: 'Event',
    isImportant: false
  },
  {
    id: 'ann-3',
    title: 'Admission Registration 2026-27 for B.Sc. Science Honors Open',
    content: 'Online applications for fresh intake into Physics, Chemistry, Math, Zoology, and Botany honors are officially open. Admissions will follow strict merit lists under Gauhati University regulations. Check the primary college counters for reservation standards.',
    date: 'May 20, 2026',
    tag: 'Admission',
    isImportant: true
  },
  {
    id: 'ann-4',
    title: 'Inter-College Science Hackathon: Tech-Hem 2026',
    content: 'Botany and Physics Departments will host the district level Tech-Hem Hackathon on June 12, 2026, focused on Rural Eco-conservation solutions. Cash prizes of Rs 25,000 await the winning team. Registrations are open until June 5.',
    date: 'May 15, 2026',
    tag: 'Event',
    isImportant: false
  }
];

// Helper to simulate mock download response
export function incrementDownloadCount(resourceId: string): void {
  const resource = STUDY_RESOURCES.find(r => r.id === resourceId);
  if (resource) {
    resource.downloadCount += 1;
  }
}
