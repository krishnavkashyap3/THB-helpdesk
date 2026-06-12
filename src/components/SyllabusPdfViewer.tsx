import React, { useState, useMemo } from 'react';
import { jsPDF } from 'jspdf';
import { DEPARTMENTS_DATA } from '../data/collegeData';
import { 
  ZoomIn, 
  ZoomOut, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Download, 
  FileText, 
  Printer, 
  Maximize2, 
  Sparkles,
  BookOpen,
  Info
} from 'lucide-react';

interface SyllabusPdfViewerProps {
  departmentId: string;
  departmentName: string;
  pdfUrl: string;
  fileSize: string;
}

interface SyllabusSemester {
  semester: string;
  courseName: string;
  credits: { theory: string; practical: string };
  marks: { theory: number; practical: number; total: number };
  classes: { theory: number; practical: number; total: number };
  theoryUnits: Array<{
    unit: string;
    title: string;
    content: string;
    classes: number;
    marks: number;
  }>;
  practicals: string[];
  readings: string[];
}

// Full detailed syllabus data compiled from official Gauhati University NEP/CBCS curriculum PDFs
const DEPARTMENT_SYLLABUSES: Record<string, SyllabusSemester[]> = {
  botany: [
    {
      semester: 'Semester I',
      courseName: 'Plant and Microbial Diversity',
      credits: { theory: '03', practical: '01' },
      marks: { theory: 60, practical: 40, total: 100 },
      classes: { theory: 45, practical: 30, total: 75 },
      theoryUnits: [
        {
          unit: 'Unit 1',
          title: 'Origin of Life',
          content: 'Origin of life: Theories of the Origin of Life, Concept of Kingdoms, and Tree of life.',
          classes: 3,
          marks: 4
        },
        {
          unit: 'Unit 2',
          title: 'Bacteria and Viruses',
          content: 'Bacteria: General features, cell structure, reproduction, conjugation, transformation, and transduction; introduction to Archaebacteria. Viruses: General features, replication, reproduction (Lytic and Lysogenic life cycles), RNA virus (TMV), DNA virus (Cauliflower Mosaic Virus).',
          classes: 8,
          marks: 10
        },
        {
          unit: 'Unit 3',
          title: 'Algae',
          content: 'Algae: General features, cell structure, range of thallus structure, reproduction, and classification; a brief account on Nostoc, Oedogonium, and Chara.',
          classes: 6,
          marks: 10
        },
        {
          unit: 'Unit 4',
          title: 'Fungi & Lichens',
          content: 'Fungi & Lichens: General features, distribution of fungi and its current status in the living world, reproduction, and classification (Ainsworth, 1973); a brief account of Mucor, Ascobolus, and Agaricus; a brief account on lichens: structure, types, and economic importance.',
          classes: 7,
          marks: 12
        },
        {
          unit: 'Unit 5',
          title: 'Bryophytes and Pteridophytes',
          content: 'Bryophytes: General features, adaptation to land habits, classification, and evolutionary trends; a brief account on Marchantia and Polytrichum. Pteridophytes: General features, classification, reproduction, evolutionary trends (stellar evolution), and affinities; a brief account on Lycopodium, Selaginella, and Pteris.',
          classes: 10,
          marks: 12
        },
        {
          unit: 'Unit 6',
          title: 'Gymnosperms and Angiosperms',
          content: 'Gymnosperms: General features, classification, reproduction, evolutionary trends, and affinities; a brief account on Cycas, and Gnetum. Angiosperms: General features, Concept of an artificial, natural, and phylogenetic system of classification. Floral parts and inflorescence; Brief accounts on Lamiaceae and Orchidaceae.',
          classes: 11,
          marks: 12
        }
      ],
      practicals: [
        'Study of structure of TMV and Bacteriophage (electron micrographs/models).',
        'Study of morphology of Nostoc, Oedogonium, Chara (Temporary preparation of slides).',
        'Study of Mucor, Ascobolus, Agaricus (Temporary preparation of slides).',
        'Study of vegetative and reproductive parts of Marchantia and Polytrichum (preparation of slides).',
        'Study of Lycopodium/ Selaginella (morphology, strobilus, and spores), Adiantum/ Pteris (morphology).',
        'Study of Cycas/ Pinus and Gnetum (morphology, leaf/ needle, megasporophyll and microsporophyll).',
        'Study of leaf venations in dicots and monocots (at least two specimens each).',
        'Study of different types of inflorescences and fruits.'
      ],
      readings: [
        'Bhatnagar SP, Moitra A (1996) Gymnosperms. New Delhi, Delhi: New Age International (P) Ltd Publishers.',
        'Campbell NA, Reece JB (2008) Biology, 8th edition, Pearson Benjamin Cummings, San Francisco.',
        'Evert RF, Eichhorn SE (2012) Raven Biology of Plants, 8th edition, New York, NY: W.H. Freeman and Company.',
        'Ingrouille M, Eddie B (2006) Plants: Evolution and Diversity. Cambridge University Press.',
        'Kumar HD (1999) Introductory Phycology, 2nd edition. Delhi, Delhi: Affiliated East-West Press Pvt. Ltd.'
      ]
    },
    {
      semester: 'Semester II',
      courseName: 'Cell Biology and Biomolecules',
      credits: { theory: '03', practical: '01' },
      marks: { theory: 60, practical: 40, total: 100 },
      classes: { theory: 45, practical: 30, total: 75 },
      theoryUnits: [
        {
          unit: 'Unit 1',
          title: 'Introduction to Cell',
          content: 'Cell as a unit of structure and function; Characteristics of prokaryotic and eukaryotic cells; Origin of eukaryotic cell (Endosymbiotic theory); Cytoskeleton, Cell division: Phases of eukaryotic cell cycle, mitosis and meiosis; Regulation of cell cycle.',
          classes: 8,
          marks: 12
        },
        {
          unit: 'Unit 2',
          title: 'Cell Wall and Plasma Membrane',
          content: 'Chemistry, structure and function of Plant cell wall. Overview of membrane function; fluid mosaic model; Chemical composition of membranes; Membrane transport – Passive, active and facilitated transport.',
          classes: 6,
          marks: 12
        },
        {
          unit: 'Unit 3',
          title: 'Cell Organelles',
          content: 'Cell organelles: Nucleus: Structure-nuclear envelope, Organization of chromatin, Nucleolus, Ribosome, Chloroplast, Mitochondria, Peroxisomes, Endoplasmic Reticulum, Golgi Apparatus, and Lysosomes.',
          classes: 9,
          marks: 8
        },
        {
          unit: 'Unit 4',
          title: 'Carbohydrates and Lipids',
          content: 'Carbohydrates: Nomenclature and classification. Lipids: Definition and major classes of storage and structural lipids; Structure, properties and functions of Essential fatty acids.',
          classes: 9,
          marks: 8
        },
        {
          unit: 'Unit 5',
          title: 'Amino acids and Proteins',
          content: 'Structure and classification of amino acids; Levels of protein structure (primary, secondary, tertiary, and quaternary); Protein denaturation and biological roles of proteins.',
          classes: 8,
          marks: 10
        },
        {
          unit: 'Unit 6',
          title: 'Nucleic Acids',
          content: 'Structure of nitrogenous bases; Structure and function of nucleotides; Types of nucleic acids; Structure of A, B, Z types of DNA; Types of RNA.',
          classes: 5,
          marks: 10
        }
      ],
      practicals: [
        'Qualitative tests for carbohydrates, reducing sugars, non-reducing sugars, lipids and proteins.',
        'Study of plant cell structure with the help of epidermal peel mount of Onion/ Rhoeo/ Crinum.',
        'Demonstration of the phenomenon of protoplasmic streaming in Hydrilla and Vallisneria leaf.',
        'Counting the cells per unit volume with the help of haemocytometer (Yeast/ pollen grains).',
        'Cytochemical staining of: DNA- Feulgen and cell wall in the epidermal peel of onion using Periodic Schiff’s (PAS) staining technique.',
        'Study different stages of mitosis and meiosis.'
      ],
      readings: [
        'Berg JM, Tymoczko JL and Stryer L (2011) Biochemistry, W.H. Freeman and Company.',
        'Campbell MK (2012) Biochemistry, 7th Edition. Published by Cengage Learning.',
        'Karp G (2010) Cell Biology, John Wiley & Sons, U.S.A. 6th Edition.',
        'Nelson DL, Cox MM (2008) Lehninger Principles of Biochemistry, 5th Edition, W.H. Freeman.'
      ]
    },
    {
      semester: 'Semester III',
      courseName: 'Laboratory and Field Techniques in Plant Science',
      credits: { theory: '03', practical: '01' },
      marks: { theory: 60, practical: 40, total: 100 },
      classes: { theory: 45, practical: 30, total: 75 },
      theoryUnits: [
        {
          unit: 'Unit 1',
          title: 'Laboratory Safety and Good Practices',
          content: 'General laboratory safety: dos and don’ts, lab safety measures, code of conduct in laboratory, safe handling of chemicals, glass apparatus, instruments, electrical appliances; First aid practices (acid spills, burns and other injuries), safety symbols, classes/ grades of chemicals, Laboratory waste management: radioactive, hazardous chemicals and biological wastes.',
          classes: 8,
          marks: 8
        },
        {
          unit: 'Unit 2',
          title: 'Handling & Maintenance of Instruments',
          content: 'Weighing balance, pipettes and micropipettes, magnetic stirrer, autoclave, laminar airflow, pH and conductivity meter(calibration and use), Incubator (static and shaker), Luxmeter, hemocytometer, micrometer, spectrophotometer, Agarose gel electrophoresis unit, SDS PAGE unit, centrifuge, distillation unit.',
          classes: 8,
          marks: 12
        },
        {
          unit: 'Unit 3',
          title: 'Measurements and Calculations',
          content: 'Units of measurements, conversion from one unit to another, Weighing, calculations: scientific notations, powers, logarithm and fractions; measurement of volumes of liquids.',
          classes: 4,
          marks: 8
        },
        {
          unit: 'Unit 4',
          title: 'Solutions and Buffers',
          content: 'Preparation of solutions: stock solution, standard solution. Types of solutions: Normal, Molar, Molal, Percentage, ppm, ppb. Dilution and dilution factors, Acids, Bases, adjustment of pH, Buffers - phosphate, Tris-HCl and Citrate buffer.',
          classes: 6,
          marks: 8
        },
        {
          unit: 'Unit 5',
          title: 'Microscopy and Culture Techniques',
          content: 'Microscopes: working principles and types (Light and Electron microscopes), sample and slide preparation: fixation, staining, mounting, preservation (for light and electron microscopy). Basic culture media (NA, NB, PDA, MS), selective and differential media, Culture techniques: plating (streak, spread & pour), serial dilution.',
          classes: 8,
          marks: 12
        },
        {
          unit: 'Unit 6',
          title: 'Biostatistics, Computing and Field Skills',
          content: 'Datatypes primary and secondary, methods of data collection, sample and sampling methods merits and demerits; technical and biological replicates; Tabulation and presentation of data, Descriptive statistics - Mean, Median, Mode, Variance, Standard Deviation, Standard error, Coefficient of Variation, MS-Word, PowerPoint, Excel, concept on biological databases. Collection, Identification, Preparation and Preservation of Herbarium and Museum specimens.',
          classes: 11,
          marks: 12
        }
      ],
      practicals: [
        'Preparation of solutions - molar, molal, normal, percentage, stock solution and dilution.',
        'Measurement of pH of solutions using pH meter/ pH strip and preparation of buffers (Phosphate /citrate buffer).',
        'Working with instruments - Centrifuge, autoclave, laminar air flow, hot air oven, incubator, light microscope, spectrophotometer/colorimeter.',
        'Slide preparation and staining of plant materials.',
        'Determination of cell/spore size using micrometer.',
        'Preparation of PDA/NA medium for growth and maintenance of fungal/bacterial cultures.'
      ],
      readings: [
        'Bisen PS (2014) Laboratory Protocols in Applied Life Sciences, 1st Edition. CRC Press.',
        'Danniel WW (1987) Biostatistics. New York, NY: John Wiley Sons.',
        'Evert RF, Eichhorn SE, Perry JB (2012) Laboratory Topics in Botany. W.H. Freeman & Co.'
      ]
    },
    {
      semester: 'Semester IV',
      courseName: 'Mycology and Phytopathology & Morphology and Anatomy of Angiosperms',
      credits: { theory: '03', practical: '01' },
      marks: { theory: 60, practical: 40, total: 100 },
      classes: { theory: 45, practical: 30, total: 75 },
      theoryUnits: [
        {
          unit: 'Unit 1',
          title: 'Introduction to Fungi & Plant Disease',
          content: 'General characteristics of fungi; hyphal forms; Cell and Cell wall composition; Nutrition; Origin of fungi; Classification of Fungi (Alexopoulos, 1962 & Ainsworth, 1973); Symbiotic fungi (Lichen & Mycorrhiza): Structural organization and types.',
          classes: 10,
          marks: 10
        },
        {
          unit: 'Unit 2',
          title: 'Lower & Higher Fungi Biology',
          content: 'Lower Fungi (Mastigomycotina & Zygomycotina) with reference to Synchytrium, Phytophthora and Mucor. Higher Fungi (Ascomycotina & Basidiomycotina) with reference to Aspergillus, Peziza, Puccinia and Agaricus.',
          classes: 12,
          marks: 20
        },
        {
          unit: 'Unit 3',
          title: 'Phytopathology & Plant Protection',
          content: 'Concept of plant disease; Symptoms; Etiology and disease cycle; Host-pathogens interaction; Control and quarantine. Bacterial (Citrus canker), Viral (TMV), and Fungal (Early blight of potato, Black stem rust of wheat, White rust).',
          classes: 10,
          marks: 12
        },
        {
          unit: 'Unit 4',
          title: 'Morphology of Angiosperms',
          content: 'Morphology of inflorescence, stamens and carpel, fruit. Telome theory, phyllode theory. Role of morphology in plant classification. Plant anatomy: Application in systematics and pharmacognosy.',
          classes: 6,
          marks: 10
        },
        {
          unit: 'Unit 5',
          title: 'Tissue Systems & Plant Body',
          content: 'Tissue and Tissue Systems: Classification, Simple & complex tissues, vascular bundles, endodermis and origin of lateral roots. Internal organization of stem, root, and leaf (Kranz anatomy).',
          classes: 7,
          marks: 8
        }
      ],
      practicals: [
        'Study of vegetative and reproductive structures of Mucor, Rhizopus, Phytophthora, Aspergillus, Penicillium, Peziza, Agaricus.',
        'Study of symptoms of locally available plant diseases caused by fungi, bacteria, and virus.',
        'Anatomical details of stem, root, leaf in dicots and monocots.',
        'Study of special types of inflorescences & fruits.'
      ],
      readings: [
        'Agrios GN (1997) Plant Pathology, 4th edition, Academic Press, U.K.',
        'Alexopoulos CJ, Mims CW, Blackwell M (1996) Introductory Mycology, John Wiley.',
        'Dickison WC (2000) Integrative Plant Anatomy. Harcourt Academic Press, USA.'
      ]
    },
    {
      semester: 'Semesters V & VI',
      courseName: 'Genetics, Plant Physiology, Biochemistry & Applied Plant Biology',
      credits: { theory: '03', practical: '01' },
      marks: { theory: 60, practical: 40, total: 100 },
      classes: { theory: 45, practical: 30, total: 75 },
      theoryUnits: [
        {
          unit: 'Module 1',
          title: 'Genetics & Molecular Biology',
          content: 'Mendelian genetics, chromosome mapping, crossing over, gene mutations and DNA repair mechanisms. Structure of DNA & RNA, replication of DNA, transcription, translation, and gene regulation controls.',
          classes: 12,
          marks: 15
        },
        {
          unit: 'Module 2',
          title: 'Plant Ecology & Climate Change',
          content: 'Ecosystems, ecological factors, population and community dynamics, functional ecology (energy flow, biogeochemical cycles), phytogeography, and environmental mitigation protocols.',
          classes: 10,
          marks: 15
        },
        {
          unit: 'Module 3',
          title: 'Plant Physiology & Metabolism',
          content: 'Plant-water relations, mineral nutrition, phloem translocation, plant growth regulators (Auxins, Gibberellins), plant stress physiology, photosynthesis, carbon oxidation and respiration.',
          classes: 13,
          marks: 15
        },
        {
          unit: 'Module 4',
          title: 'Applied Plant Biology & Biotech',
          content: 'Plant Tissue Culture, micropropagation, recombinant DNA technology, cloning vectors, gene transfer methods, and pest-resistant transgenic crop developments.',
          classes: 10,
          marks: 15
        }
      ],
      practicals: [
        'Verification of Mendels laws through seed ratios.',
        'Determination of osmotic potential of plant cells.',
        'Estimation of plant protein, chlorophyll, and reducing sugars.',
        'Demonstration of plant tissue culture inoculation techniques.'
      ],
      readings: [
        'Gardner EJ, Snustad DP (2015) Principles of Genetics. John Wiley.',
        'Taiz L, Zeiger E (2015) Plant Physiology and Development. Sinauer Associates.',
        'Bhojwani SS (2011) Plant Tissue Culture: Theory and Practice.'
      ]
    }
  ],
  chemistry: [
    {
      semester: 'Semester I',
      courseName: 'Chemistry I (Inorganic, Organic & Physical Theory)',
      credits: { theory: '03', practical: '01' },
      marks: { theory: 60, practical: 40, total: 100 },
      classes: { theory: 45, practical: 30, total: 75 },
      theoryUnits: [
        { unit: 'Unit I', title: 'Atomic structure', content: 'Historical development on structure of atom; Bohr’s model, H atom spectrum; black body radiation, wave function, Schrödinger wave equation, quantum numbers, Aufbau’s principle and its limitations.', classes: 8, marks: 12 },
        { unit: 'Unit II', title: 'Periodicity and chemical behaviour', content: 'Effective nuclear charge; Slater’s Rule; covalent and ionic radii, ionization energies, electronegativity scales, electron affinities.', classes: 3, marks: 6 },
        { unit: 'Unit III', title: 'Chemical bonding I (ionic interaction)', content: 'General characteristics of ionic compounds; lattice and solvation energy; Born Lande equation; Born Haber cycle calculation.', classes: 4, marks: 8 },
        { unit: 'Unit IV', title: 'Structure of organic molecules', content: 'Nature of bonding: hybridisation of atomic orbitals (qualitative VB and MO approach); effect of hybridization on bond properties.', classes: 4, marks: 8 },
        { unit: 'Unit V', title: 'Stereochemistry of organic molecules', content: 'Representation in 2D and 3D (Fischer, Newman, Sawhorse); geometrical isomerism; chirality (enantiomers and diastereomers); conformation barriers, ethane, butane.', classes: 8, marks: 12 },
        { unit: 'Unit VI', title: 'Electronic effects in organic molecules', content: 'Concept of electrophiles and nucleophiles; inductive effects; resonance, conjugation and delocalisation.', classes: 3, marks: 6 },
        { unit: 'Unit VII', title: 'Gaseous state', content: 'Causes of deviation from ideal gas, compressibility factor Z, van der Waals equation; Critical constants; virial equation, Boyle temperature.', classes: 8, marks: 12 },
        { unit: 'Unit VIII', title: 'Liquid state', content: 'Qualitative treatment of liquids. Physical properties: vapour pressure, surface tension, viscosity, detergents (micelle formation, CMC).', classes: 7, marks: 10 }
      ],
      practicals: [
        'Calibration of apparatus (volumetric flask, thermometer, melting point apparatus).',
        'Determination of solubility of a given salt at different temperatures and plotting curve.',
        'Determination of water of crystallisation of hydrated salt by ignition and weighing.',
        'Determination of melting points and purification of organic compounds by crystallization.',
        'Determine the surface tension of a given liquid using stalagmometer (drop number/weight method).'
      ],
      readings: [
        'Concise Inorganic Chemistry, J. D. Lee, 5th Edition, Pearson Education.',
        'Principles of Physical Chemistry, Puri, Sharma, Pathania, 48th Edition.',
        'Organic Chemistry, T. W. G. Solomons, C. B. Fryhle, S. A. Snyder.'
      ]
    },
    {
      semester: 'Semester II',
      courseName: 'Chemistry II (Coordination Complexes & Thermodynamics)',
      credits: { theory: '03', practical: '01' },
      marks: { theory: 60, practical: 40, total: 100 },
      classes: { theory: 45, practical: 30, total: 75 },
      theoryUnits: [
        { unit: 'Unit I', title: 'Chemical bonding II (covalent & forces)', content: 'Valence bond theory, molecular orbital theory (MOT), Molecular orbital diagrams of homonuclear (N2, O2) and heteronuclear diatomic molecules. VSEPR theory, Fajan’s rules, dipole moments, weak forces.', classes: 10, marks: 13 },
        { unit: 'Unit II', title: 'Coordination chemistry I (isomerism)', content: 'Introduction to coordination complexes (Werner theory, types of ligands), IUPAC nomenclature, isomerism in coordination complexes, numbers 4, 5, 6.', classes: 5, marks: 8 },
        { unit: 'Unit III', title: 'Reactive intermediates in organic reactions', content: 'Formation, structure and stability of reactive intermediates: carbocations, carbanions, radicals, carbenes, nitrenes, benzyne.', classes: 12, marks: 15 },
        { unit: 'Unit IV', title: 'Acidity, basicity, and pKa', content: 'The definition of pKa; Lewis acids and bases; organic acids and bases; substituents affecting the relative strength.', classes: 3, marks: 6 },
        { unit: 'Unit V', title: 'Thermodynamics', content: 'Isolated, closed, open systems. First law, Joule-Thomson coefficient, Kirchhoff’s equation. Second law, entropy, free energy (Gibbs A and G), Maxwell’s Relations.', classes: 15, marks: 18 }
      ],
      practicals: [
        'Preparation of buffer solution and measurement of pH using pH-meter.',
        'Determination of total hardness of water by titration against standardised EDTA solution.',
        'Synthesis of coordination compounds: Potassium tris(oxalato)chromate(III), [Ni(DMG)2].',
        'Qualitative organic analysis for N, S and halogens in given organic compounds.',
        'Determine the heat capacity of a calorimeter and sessional enthalpy of solution.'
      ],
      readings: [
        'General and Inorganic Chemistry, R.P. Sarkar (part 1) 3rd edition, NCBA.',
        'Concise Coordination Chemistry, R. Gopalan, V. Ramalingam, 1st edition.',
        'Atkins Physical Chemistry, Atkins, de Paula and Keeler, 11th edition.'
      ]
    },
    {
      semester: 'Semester III',
      courseName: 'Chemistry III (Stereochemistry, Redox & Aromaticity)',
      credits: { theory: '03', practical: '01' },
      marks: { theory: 60, practical: 40, total: 100 },
      classes: { theory: 45, practical: 30, total: 75 },
      theoryUnits: [
        { unit: 'Unit I', title: 'Acids and Bases', content: 'Acid-base concepts, proton affinity, superacids and superbases. Hard and Soft Acids and Bases (HSAB) principle.', classes: 7, marks: 10 },
        { unit: 'Unit II', title: 'Oxidation and reduction - I', content: 'Reduction potentials: Redox half-reactions, Nernst equation, redox indicators.', classes: 4, marks: 6 },
        { unit: 'Unit III', title: 'Coordination chemistry-II', content: 'Valence bond theory, inner and outer orbital complexes, back bonding, magnetic properties.', classes: 4, marks: 6 },
        { unit: 'Unit IV', title: 'Aromaticity', content: 'Concepts of aromatic, anti-aromatic and non-aromatic, Huckel’s rule.', classes: 3, marks: 5 },
        { unit: 'Unit V', title: 'Hydrocarbons and halogenated compounds', content: 'Methods of preparation, properties and nucleophilic aromatic substitutions.', classes: 4, marks: 6 },
        { unit: 'Unit VI', title: 'Alcohols, phenols and thiols', content: 'Preparation, properties and relative reactivities; Reimer-Tiemann and Kolbe-Schmidt reactions.', classes: 4, marks: 6 },
        { unit: 'Unit VII', title: 'Carbonyl compounds', content: 'Structure, reactivity, oxidations and reductions (PCC, PDC, Clemmensen, Wolff-Kishner, NaBH4).', classes: 4, marks: 6 },
        { unit: 'Unit VIII', title: 'Solutions and Colligative Properties', content: 'Ideal solutions, colligative properties, Raoult’s law and Henry’s law.', classes: 7, marks: 8 },
        { unit: 'Unit IX', title: 'Partial molar quantities', content: 'Fugacity, activity, Gibbs Duhem equation and excess sessional properties.', classes: 8, marks: 7 }
      ],
      practicals: [
        'Acid-base titration: estimation of carbonate, bicarbonate and hydroxide.',
        'Redox titration: estimation of Fe(II) using standardised KMnO4 solution.',
        'Identification and derivative preparation of functional groups in an organic sample.',
        'Determine the viscosity of a liquid at a given concentration by viscometer.'
      ],
      readings: [
        'Organic Chemistry, Volume 1, I. L. Finar, 5th edition.',
        'Vogel’s Qualitative Inorganic Analysis, G. Svehla, B. Sivasankar, Pearson.',
        'Concise Coordination Chemistry, R. Gopalan, V. Ramalingam.'
      ]
    },
    {
      semester: 'Semester IV',
      courseName: 'Inorganic Chemistry, Spectroscopy & Theoretical Physics (Combined)',
      credits: { theory: '03', practical: '01' },
      marks: { theory: 60, practical: 40, total: 100 },
      classes: { theory: 45, practical: 30, total: 75 },
      theoryUnits: [
        { unit: 'Module I', title: 'Inorganic Chemistry-I', content: 'Molecular symmetry, d-block transition chemistry, Crystal Field Theory, metallurgy, lanthanides, and nuclear chemistry introduction.', classes: 11, marks: 15 },
        { unit: 'Module II', title: 'Organic Chemistry I', content: 'Carboxylic acids, nitrogen containing functional groups, amino acids, heterocyclic compounds, and alkaloid structures.', classes: 12, marks: 15 },
        { unit: 'Module III', title: 'Theoretical Chemistry', content: 'Quantum mechanics postulates, particle and wavefunctions, 1-D box, rigid rotator, harmonic oscillator, H-atom quantum mechanics.', classes: 11, marks: 15 },
        { unit: 'Module IV', title: 'Magnetic Resonance & MRS', content: 'NMR spectroscopy, ESR, mass spectrometry, separation techniques, electroanalytical techniques, and diffraction.', classes: 11, marks: 15 }
      ],
      practicals: [
        'Qualitative analysis of mixtures containing four cations and anions.',
        'Organic preparations - benzoylation, bromination of acetanilide, iodoform.',
        'Writing and computer plotting of radial wavefunctions for H-atom.',
        'Structure identification from proton NMR and mass spectra.'
      ],
      readings: [
        'Introduction to Spectroscopy, D. L. Pavia, G. M. Lampman, 4th Edition.',
        'Quantum Chemistry, McQuarrie, Viva Student Edition.',
        'Inorganic Chemistry, G.L. Meissler and D. A. Tarr.'
      ]
    },
    {
      semester: 'Semesters V & VI',
      courseName: 'Advanced Chemistry Core Curriculum (NEP Scheme)',
      credits: { theory: '03', practical: '01' },
      marks: { theory: 60, practical: 40, total: 100 },
      classes: { theory: 45, practical: 30, total: 75 },
      theoryUnits: [
        { unit: 'Module I', title: 'Inorganic Complexes & Bioinorganic', content: 'Coordination chemistry IV, Main group silicates, Organometallics, bioinorganic chemistry trace metals, cisplatin therapeutics.', classes: 11, marks: 15 },
        { unit: 'Module II', title: 'Stereo-Chemical Synthesis & Biomolecules', content: 'C-C bond formation, active methylene, carbohydrates, terpenes, photochemistry and pericyclic reactions, organocentered systems.', classes: 11, marks: 15 },
        { unit: 'Module III', title: 'Reaction Dynamics & Electrochemistry', content: 'Kinetics, equilibrium and steady states, collision theory, phase and ionic equilibria, electrochemistry Debye-Huckel.', classes: 12, marks: 15 },
        { unit: 'Module IV', title: 'Industrial Chemistry', content: 'Industrial gases, silicate/glass industries, fertilizers, alloys, pyrotechnics, surface coatings, catalysis.', classes: 11, marks: 15 }
      ],
      practicals: [
        'Volumetric estimation of Fe(III) and iodometric estimation of Cu(II).',
        'Interpretation of IR spectra, extraction of caffeine from tea leaves.',
        'pH-metric, conductometric, and potentiometric sessional titrations.',
        'Industrial assay of calcium in CAN fertilizers.'
      ],
      readings: [
        'Industrial Chemistry, Vol-I, E. Stocchi, Ellis Horwood.',
        'Chemical Kinetics and Reaction Dynamics, Paul L. Houston.',
        'Lehninger Principles of Biochemistry, Cox MM, Nelson DL.'
      ]
    }
  ],
  physics: [
    {
      semester: 'Semester I',
      courseName: 'Mathematical Physics and Mechanics',
      credits: { theory: '03', practical: '01' },
      marks: { theory: 60, practical: 40, total: 100 },
      classes: { theory: 45, practical: 30, total: 75 },
      theoryUnits: [
        { unit: 'Unit I', title: 'Vector Calculus', content: 'Scalar and vector fields, gradient, divergence, curl, line, surface, volume integrals, Gauss and Stokes theorems (statements only).', classes: 8, marks: 10 },
        { unit: 'Unit II', title: 'Curvilinear coordinates', content: 'Orthogonal curvilinear coordinates, line element, curvilinear coordinates (spherical, cylindrical), gradient/divergence/curl.', classes: 5, marks: 8 },
        { unit: 'Unit III', title: 'Dirac delta function', content: 'Definition and properties of Dirac delta function. Gaussian, rectangular, and 3-Dimensional delta functions.', classes: 2, marks: 4 },
        { unit: 'Unit IV', title: 'Reference frames', content: 'Inertial frames. Non-inertial frames and fictitious forces. Uniformly rotating frame, centrifugal and Coriolis forces.', classes: 4, marks: 6 },
        { unit: 'Unit V', title: 'Gravitation & Central Forces', content: 'Motion under central force, reduction to one body problem, Kepler’s laws, gravitational potential of spherical bodies, Gauss’s law.', classes: 7, marks: 10 },
        { unit: 'Unit VI', title: 'Conservation laws', content: 'Dynamics of particles, Centre of mass, conservation of momentum, torque, impulse, collisions (elastic/inelastic) in laboratory systems.', classes: 4, marks: 6 },
        { unit: 'Unit VII', title: 'Rigid body and Oscillations', content: 'Rotational motion, moment of inertia, differential equation of SHM, elastic constants, cantilever, Poiseuille’s equation.', classes: 15, marks: 16 }
      ],
      practicals: [
        'To study the motion of spring and calculate spring constant and rigidity modulus.',
        'To determine the moment of inertia of a cylinder about two different axes of symmetry.',
        'To determine coefficient of viscosity of water by capillary flow method (Poiseuille’s method).',
        'To determine the Young’s modulus of the material of a wire by Searle’s apparatus.',
        'To determine the height of a building using a sextant.'
      ],
      readings: [
        'Essential Mathematical Methods for the Physical Sciences; K.F. Riley and M.P. Hobson.',
        'Introduction to Mechanics, D. Kleppner and R. J. Kolenkow, Tata McGraw-Hill.',
        'Analytical Mechanics, G. R. Fowles and G. L. Cassiday, Cengage Learning.'
      ]
    },
    {
      semester: 'Semester II',
      courseName: 'Mathematical Physics & Electricity and Magnetism',
      credits: { theory: '03', practical: '01' },
      marks: { theory: 60, practical: 40, total: 100 },
      classes: { theory: 45, practical: 30, total: 75 },
      theoryUnits: [
        { unit: 'Unit I', title: 'Differential equations', content: 'First and second order ODEs, integrating factors, complementary functions and particular integrals, Wronskians, PDEs wave/diffusion equations.', classes: 10, marks: 15 },
        { unit: 'Unit II', title: 'Matrices', content: 'Properties of matrices. Transpose, conjugate, Hermitian and anti-Hermitian, eigenvalues and eigenvectors, Cayley-Hamilton.', classes: 5, marks: 10 },
        { unit: 'Unit III', title: 'Electric Field & Potential', content: 'Electrostatic field, electric flux, Gauss’s law. Laplace’s and Poisson’s unique theorems, dipole torque and capacitance.', classes: 13, marks: 18 },
        { unit: 'Unit IV', title: 'Dielectric & Magnetic Fields', content: 'Electric fields in matter, displacement vector, Biot-Savart, Ampere’s circuital law, magnetic properties, B-H curve and hysteresis.', classes: 12, marks: 12 },
        { unit: 'Unit V', title: 'Electrical circuits', content: 'AC circuits, complex reactance, sessional LCR series/parallel resonance, quality factors, bandwidth, Thevenin and Norton theorems.', classes: 5, marks: 5 }
      ],
      practicals: [
        'Use a Multimeter for measuring Resistances, AC/DC Voltages, and Capacitances.',
        'To study LCR response curve and determine resonant frequency, Quality factor Q and bandwidth.',
        'To study the characteristics of a series RC circuit.',
        'To verify the Thevenin, Norton, superposition and maximum power transfer theorems.'
      ],
      readings: [
        'Introduction to Electrodynamics, D. J. Griffiths, Pearson.',
        'Electricity and Magnetism, Edward M. Purcell, McGraw-Hill.',
        'Mathematical Methods for Physicists; G. B. Arfken, H. J. Weber.'
      ]
    },
    {
      semester: 'Semester III',
      courseName: 'Waves and Optics',
      credits: { theory: '03', practical: '01' },
      marks: { theory: 60, practical: 40, total: 100 },
      classes: { theory: 45, practical: 30, total: 75 },
      theoryUnits: [
        { unit: 'Unit I', title: 'Wave Oscillations', content: 'Superposition principle, collinear oscillations of equal/different frequencies, beats, Lissajous figures, travelling waves, wave equation.', classes: 8, marks: 10 },
        { unit: 'Unit II', title: 'Velocity of waves', content: 'Transverse vibrations of stretched strings, longitudinal waves in fluid pipes, Newton’s formula, Laplace’s correction.', classes: 4, marks: 8 },
        { unit: 'Unit III', title: 'Superposition of waves', content: 'Standing waves in a string, analytical treatment, energy, normal modes, Melde’s experiment, open/closed pipes.', classes: 9, marks: 12 },
        { unit: 'Unit IV', title: 'Wave optics & Interference', content: 'Electromagnetic nature of light, wave fronts, Huygens, division of wavefront (Young’s double, biprism, thin films, Newton’s rings).', classes: 12, marks: 16 },
        { unit: 'Unit V', title: 'Diffraction & Polarization', content: 'Fresnel and Fraunhofer, single/double slit, grating, resolving power, polarized light, double refraction, wave plates.', classes: 12, marks: 14 }
      ],
      practicals: [
        'Study of Lissajous Figures using CRO to find unknown electrical frequency.',
        'To determine refractive index of the Material of a prism/sodium source.',
        'To determine the dispersive power and Cauchy constants of a prism using mercury source.',
        'To determine wavelength of sodium light using Fresnel Biprism or Newton’s Rings.',
        'To determine resolving power of a plane diffraction grating.'
      ],
      readings: [
        'Waves: Berkeley Physics Course, vol. 3, Francis Crawford.',
        'Fundamentals of Optics, F. A. Jenkins and H.E. White, McGraw-Hill.',
        'Principles of Optics, Max Born and Emil Wolf, Pergamon Press.'
      ]
    },
    {
      semester: 'Semester IV',
      courseName: 'Classical, Quantum, Analog Electronics & Mathematical Method',
      credits: { theory: '03', practical: '01' },
      marks: { theory: 60, practical: 40, total: 100 },
      classes: { theory: 45, practical: 30, total: 75 },
      theoryUnits: [
        { unit: 'Module I', title: 'Classical Mechanics', content: 'Lagrangian Mechanics, constraints, Euler-Lagrange equations, Hamiltonian canonical equations, relativity length/time dilation.', classes: 11, marks: 15 },
        { unit: 'Module II', title: 'Quantum Mechanics I', content: 'Black body radiation, photoelectric effect, wave-particle duality, uncertainty principle, Schrödinger equation, 1D well.', classes: 11, marks: 15 },
        { unit: 'Module III', title: 'Analog Electronics', content: 'Semiconductor diodes, rectifiers, BJTs, CE amplifiers, Coupled amplifiers, Op-amps (741), oscillators, CRO applications.', classes: 12, marks: 15 },
        { unit: 'Module IV', title: 'PDE & Complex Analysis', content: 'PDEs separation of variables, Fourier series, Complex variables, CR equations, Cauchy integral formula, residue theorem, tensors.', classes: 11, marks: 15 }
      ],
      practicals: [
        'To study V-I characteristics of PN junction diode, Zener diode, and BJT in CE.',
        'Design inverting / non-inverting amplifier, integrator, differentiator using Op-amp.',
        'Plot wavefunctions and expectations of a particle in a 1D box.',
        'Measurement of Plancks constant using black body radiation.'
      ],
      readings: [
        'Quantum Mechanics, John L. Powell, Bernd Crasemann.',
        'Integrated Electronics, J. Millman and C. C. Halkias, Tata McGraw-Hill.',
        'Classical Mechanics, H. Goldstein, C.P. Poole.'
      ]
    },
    {
      semester: 'Semesters V & VI',
      courseName: 'Modern Physics & Condensed Matter and EMT (NEP Syllabus)',
      credits: { theory: '03', practical: '01' },
      marks: { theory: 60, practical: 40, total: 100 },
      classes: { theory: 45, practical: 30, total: 75 },
      theoryUnits: [
        { unit: 'Module I', title: 'Atomic, Molecular & Solid State', content: 'Sommerfeld, Zeeman, multi-electron, Raman effect, crystal structure, Bravais lattices, specific heat, superconductivity, magnetic domains.', classes: 11, marks: 15 },
        { unit: 'Module II', title: 'Statistical Thermodynamics', content: 'Boltzmann distribution, Real gases deviation, Thermodynamics laws, entropy, ensembles, Bose-Einstein & Fermi-Dirac statistics.', classes: 11, marks: 15 },
        { unit: 'Module III', title: 'Electromagnetic Theory', content: 'Maxwells equations, EM waves boundary conditions, wave propagation, Fresnel, polarization uniaxial/biaxial, fibers.', classes: 12, marks: 15 },
        { unit: 'Module IV', title: 'Nuclear Physics & Digital', content: 'Binding energy, radioactivity alpha/beta/gamma, fission/fusion, IC scale, logic gates, Boolean simplification, flip-flops, registers.', classes: 11, marks: 15 }
      ],
      practicals: [
        'Verify scale of Malus law for plane polarized light, specific rotation of sugar.',
        'Measure dielectric constants and hysteresis loop of a ferroelectric crystal.',
        'Design half-adder, full-adders, SR and JK flip-flops using logic gate ICs.',
        'Measurement of magnetic susceptibility of solids (Quincks tube method).'
      ],
      readings: [
        'Condensed Matter Physics, N. W. Ashcroft and N. D. Mermin.',
        'Heat and Thermodynamics, Mark W. Zemansky, Richard H. Dittman.',
        'Introduction to Electrodynamics, D. J. Griffiths, Pearson.'
      ]
    }
  ],
  mathematics: [
    {
      semester: 'Semester I',
      courseName: 'Classical Algebra',
      credits: { theory: '04', practical: '00' },
      marks: { theory: 80, practical: 20, total: 100 },
      classes: { theory: 60, practical: 0, total: 60 },
      theoryUnits: [
        { unit: 'Unit 1', title: 'Complex Numbers', content: 'Polar representation, De Moivre’s theorem, roots of complex numbers, applications, exponential, logarithmic, hyperbolic functions.', classes: 20, marks: 25 },
        { unit: 'Unit 2', title: 'Algebraic equations', content: 'Fundamental Theorem of Classical Algebra, Descartes’ rule of signs, relation between roots and coefficients, symmetric functions, Cardon’s, Euler’s.', classes: 20, marks: 30 },
        { unit: 'Unit 3', title: 'Matrix Algebra', content: 'Matrix operations, inversion, Row Echelon form and Rank, consistency of linear systems, solution of homogeneous equations up to four variables.', classes: 20, marks: 25 }
      ],
      practicals: [
        'Not Applicable (Theory Course)'
      ],
      readings: [
        'Higher Algebra (Classical), Mappa, S.K., Levant Books, 8th Edition.',
        'Matrix Analysis and Applied Linear Algebra, Meyer, Carl D., SIAM.'
      ]
    },
    {
      semester: 'Semester II',
      courseName: 'Calculus',
      credits: { theory: '04', practical: '00' },
      marks: { theory: 80, practical: 20, total: 100 },
      classes: { theory: 60, practical: 0, total: 60 },
      theoryUnits: [
        { unit: 'Unit 1', title: 'Limits and continuity', content: 'Limits and continuity of a function, properties of continuous functions, Intermediate value theorem.', classes: 15, marks: 20 },
        { unit: 'Unit 2', title: 'Differentiability & Reduction Formulae', content: 'Successive differentiation, Leibnitz theorem, reduction formulae of sin^n x, cos^n x, tan^n x, sin^n x cos^m x.', classes: 15, marks: 20 },
        { unit: 'Unit 3', title: 'Mean value theorems', content: 'Rolle’s, Lagrange’s with geometrical interpretations, Maclaurin and Taylor polynomials, Taylor’s formula.', classes: 15, marks: 20 },
        { unit: 'Unit 4', title: 'Multivariable functions', content: 'Functions of two or more variables, partial differentiation, Euler’s theorem on homogeneous functions.', classes: 15, marks: 20 }
      ],
      practicals: [
        'Not Applicable (Theory Course)'
      ],
      readings: [
        'Calculus (10th ed.), Anton, Howard, Bivens, Davis, John Wiley.',
        'Differential Calculus, Shanti Narayan and P.K. Mittal, S. Chand.'
      ]
    },
    {
      semester: 'Semester III',
      courseName: 'Ordinary Differential Equations',
      credits: { theory: '04', practical: '00' },
      marks: { theory: 80, practical: 20, total: 100 },
      classes: { theory: 60, practical: 0, total: 60 },
      theoryUnits: [
        { unit: 'Unit 1', title: 'First Order ODEs', content: 'Differential equations origins, exact ODEs, integrating factors, linear and Bernoulli equations, Wronskian properties.', classes: 30, marks: 40 },
        { unit: 'Unit 2', title: 'Second Order Linear ODEs', content: 'Linear homogenous with constant coefficients, non-homogenous, variation of parameters, Cauchy-Euler equations.', classes: 30, marks: 40 }
      ],
      practicals: [
        'Not Applicable (Theory Course)'
      ],
      readings: [
        'Differential Equations, Ross, Shepley L., John Wiley & Sons.',
        'Advanced Engineering Mathematics, Kreyszig, Erwin, John Wiley.'
      ]
    },
    {
      semester: 'Semester IV',
      courseName: 'Analysis, Analytical Geometry & Number Theory (Combined)',
      credits: { theory: '03', practical: '01' },
      marks: { theory: 60, practical: 40, total: 100 },
      classes: { theory: 45, practical: 30, total: 75 },
      theoryUnits: [
        { unit: 'Module I', title: 'Real Analysis', content: 'Algebraic & order of R, completeness, limit of sequences, Cauchy convergence, infinite series ratio/root tests.', classes: 11, marks: 15 },
        { unit: 'Module II', title: 'Complex Analysis', content: 'Analytical functions, Cauchy-Riemann equations, contour integrals, Cauchy-Goursat, Laurent series, residue theorem.', classes: 11, marks: 15 },
        { unit: 'Module III', title: 'Analytical Geometry', content: 'Coordinates transformation, conics (parabola, ellipse, hyperbola), quadric surfaces (sphere, cylinder, cone), vectors 3-space.', classes: 12, marks: 15 },
        { unit: 'Module IV', title: 'Number Theory', content: 'Division algorithm, gcd, Diophantine of order ax+by=c, congruences, Fermat, Wilson, Mobius, Euler phi function.', classes: 11, marks: 15 }
      ],
      practicals: [
        'Matlab computer lab: declaring complex numbers, straight line integration, contour integration.',
        'Plot wavefunctions of complex variables and verify theorems.',
        'Solving Cauchy linear system and Diophantine equations.'
      ],
      readings: [
        'Introduction to Real Analysis, Bartle, R.G., Sherbert, D.R., John Wiley.',
        'Complex Variables and Applications, Ward Brown James, Churchill.',
        'Elementary Number Theory, Burton, David M., McGraw Hill.'
      ]
    },
    {
      semester: 'Semesters V & VI',
      courseName: 'Abstract/Linear Algebra, Calculus & Metric Spaces (Combined)',
      credits: { theory: '03', practical: '01' },
      marks: { theory: 60, practical: 40, total: 100 },
      classes: { theory: 45, practical: 30, total: 75 },
      theoryUnits: [
        { unit: 'Module I', title: 'Abstract Algebra', content: 'Groups, subgroups, cyclic, cosets, normal subgroups, ring theory ideals. Vector spaces, linear transformations, eigenvalues, diagonalization.', classes: 11, marks: 15 },
        { unit: 'Module II', title: 'Multivariate Calculus', content: 'Level curves, partials, chain rule, Lagrange extrema, double/triple integration, Green, Stokes, Gauss divergence.', classes: 11, marks: 15 },
        { unit: 'Module III', title: 'Numerical Analysis & PDE', content: 'Gauss-Seidel, Gregory-Newton interpolation, numerical differentiation/integration, first/second order partial differential equations.', classes: 12, marks: 15 },
        { unit: 'Module IV', title: 'Metric Spaces & Mechanics', content: 'Metric spaces, completeness, connectedness, compactness. Forces resolution, statics, SHM, motion in resisting medium.', classes: 11, marks: 15 }
      ],
      practicals: [
        'Computer lab implementing Lagrange and Newton interpolation.',
        'Forward and backward differences calculations, Trapezoidal / Simpson’s rule.',
        'Plotting integral surfaces of first order PDEs.'
      ],
      readings: [
        'Contemporary Abstract Algebra, Gallian, Joseph A., Cengage Learning.',
        'Linear Algebra and its Applications, Lay, David C., Pearson.',
        'Numerical Methods, Chapra, Steven C., McGraw Hill.'
      ]
    }
  ],
  zoology: [
    {
      semester: 'Semester I',
      courseName: 'Diversity of Non-chordates',
      credits: { theory: '03', practical: '01' },
      marks: { theory: 60, practical: 40, total: 100 },
      classes: { theory: 45, practical: 30, total: 75 },
      theoryUnits: [
        { unit: 'Unit 1', title: 'Protozoa to Nemathelminthes', content: 'General characteristics and Classification up to classes of Protista, Porifera, Cnidaria, Ctenophora, Platyhelminthes, Nemathelminthes.', classes: 7, marks: 15 },
        { unit: 'Unit 2', title: 'Coelom, Annelida and Arthropoda', content: 'Evolution of coelom and metamerism; General characteristics and Classification up to classes of Annelida, Arthropoda, Mollusca and Echinodermata.', classes: 8, marks: 20 },
        { unit: 'Unit 3', title: 'Locomotion & Parasitic Adaptation', content: 'Locomotion & Reproduction in Protista, Canal system in sponges, Polymorphism in Cnidaria, Coral reefs, Parasitic adaptations (Fasciola, Wuchereria), Excretion in Annelida, Vision & respiration.', classes: 30, marks: 25 }
      ],
      practicals: [
        'Study of the whole mount of Euglena, Amoeba and Paramecium collected from different water sources.',
        'Study of minimum of two representatives (specimen/slide/model) of each phylum of non-chordates.',
        'Study of larval forms of Arthropoda/Echinodermata.',
        'T.S. through pharynx, gizzard and earthworm intestine.',
        'Submission of a Project Report on life cycle of helminth parasite.'
      ],
      readings: [
        'Invertebrate Zoology, 8th Edition, Ruppert, E.E. and Barnes, R.D., Holt Saunders.',
        'Biology of the Invertebrates, 7th Edition, Pechenik, J., McGraw Hill.'
      ]
    },
    {
      semester: 'Semester II',
      courseName: 'Diversity of Chordates',
      credits: { theory: '03', practical: '01' },
      marks: { theory: 60, practical: 40, total: 100 },
      classes: { theory: 45, practical: 30, total: 75 },
      theoryUnits: [
        { unit: 'Unit 1', title: 'Origin of Chordates', content: 'Origin of Chordates-Dipleurula concept and Echinoderm theory. General characteristics and outline classification.', classes: 8, marks: 15 },
        { unit: 'Unit 2', title: 'Hemichordata, Urochordata & Cephalochordata', content: 'General characteristics of Hemichordata, Urochordata and Cephalochordata. larval forms of protochordates.', classes: 7, marks: 15 },
        { unit: 'Unit 3', title: 'Vertebrate Overviews', content: 'Advanced features of vertebrates; axial/appendicular skeleton, jaw suspensorium, cyclostomes; migration in fishes; parental care in Amphibia; biting in snakes, flight in birds.', classes: 30, marks: 30 }
      ],
      practicals: [
        'Study of museum specimens/ Models of Protochordata, Agnatha, fishes, amphibians, reptiles, aves, and mammals.',
        'Study of T.S. of Amphioxus through pharyngeal, intestinal and caudal regions.',
        'Identification key of venomous and non-venomous snakes.',
        'PowerPoint presentation on the study of any two vertebrates.'
      ],
      readings: [
        'The Life of Vertebrates, Young, J. Z. (2004), Oxford University press.',
        'Vertebrate Life, Pough, F. H. & Janis, C. M. (2018), Sinauer Associates.'
      ]
    },
    {
      semester: 'Semester III',
      courseName: 'Principles of Genetics',
      credits: { theory: '03', practical: '01' },
      marks: { theory: 60, practical: 40, total: 100 },
      classes: { theory: 45, practical: 30, total: 75 },
      theoryUnits: [
        { unit: 'Unit 1', title: 'Inheritance & Linkage mapping', content: 'Mendelian inheritance, epistasis, lethal genes, multiple alleles, linkage & crossing over, recombination frequency as linkage intensity, gene mapping.', classes: 15, marks: 20 },
        { unit: 'Unit 2', title: 'Mutations & Aberrations', content: 'Gene mutations, deletion, duplication, inversion, translocation, aneuploidy/polyploidy; mutagens; sessional detection ClB method.', classes: 20, marks: 25 },
        { unit: 'Unit 3', title: 'Sex determination & Organelle', content: 'Sex determination Drosophila and human, dosage compensation, extra nuclear organelle inheritance (Chlamydomonas, mitochondria, Paramecium).', classes: 10, marks: 15 }
      ],
      practicals: [
        'Study Mendelian laws and gene interactions verified by Chi-square analyses.',
        'Study of linkage maps based on data from Drosophila crosses.',
        'Identification of various mutant types of Drosophila (Photomicrographs).',
        'Study of human karyotype (normal and abnormal).'
      ],
      readings: [
        'Principles of Genetics, Gardner, E.J., Simmons, M.J., Snustad, D.P., Wiley.',
        'Concepts of Genetics, Klug, W.S., Cummings, M.R., Spencer, Benjamin.'
      ]
    },
    {
      semester: 'Semester IV',
      courseName: 'Systematics, Physiology, Ecology & Comparatives (Combined)',
      credits: { theory: '03', practical: '01' },
      marks: { theory: 60, practical: 40, total: 100 },
      classes: { theory: 45, practical: 30, total: 75 },
      theoryUnits: [
        { unit: 'Module I', title: 'Animal Systematics & Biostatistics', content: 'Animal Taxonomy and Systematics; species typological, nominalistic, biological; ICZN; Biostatistics central tendency, ANOVA.', classes: 11, marks: 15 },
        { unit: 'Module II', title: 'Physiology & Endocrinology', content: 'Muscular tissues, nerve impulse neuromuscular junctions, digestion, respiration, kidney, sessional urea, pituitary, adrenal, gonads.', classes: 11, marks: 15 },
        { unit: 'Module III', title: 'Ecology & Evolutionary Biology', content: 'Levels of organization, limit laws, populations natality/mortality, community succession, origin of life, Darwinism, speciation, drift.', classes: 12, marks: 15 },
        { unit: 'Module IV', title: 'Comparatives, Ethology & Parasites', content: 'Integument derivatives, skeletal arches, gills/lungs, urogenital duct, receptors, ethology history, clocks, Tryps/plasmodium.', classes: 11, marks: 15 }
      ],
      practicals: [
        'Two-sample t-test, F-value (ANOVA) calculations form given data.',
        'Preparation of squamous epithelium, striated muscle, and blood smear staining.',
        'Study of aquatic ecosystem: collection of phytoplankton/zooplankton, Winkler’s DO method.',
        'Submission of report on visit to National Park/Wildlife Sanctuary.'
      ],
      readings: [
        'Principles of Anatomy and Physiology, Tortora, G.J., Derrickson, B.H., John Wiley.',
        'Ecology, Colinvaux, P.A. (1973), John Wiley and Sons.',
        'Animal Taxonomy, Kapoor, V.C. (2019), Oxford & IBH.'
      ]
    },
    {
      semester: 'Semesters V & VI',
      courseName: 'Advanced Zoology Core (Biochemistry, Cells & Applied Biology)',
      credits: { theory: '03', practical: '01' },
      marks: { theory: 60, practical: 40, total: 100 },
      classes: { theory: 45, practical: 30, total: 75 },
      theoryUnits: [
        { unit: 'Module I', title: 'Biochemistry & Metabolism', content: 'Carbohydrates, lipids, proteins, level bonds, nucleic acids Cot curves, enzyme kinetics, sessional glycolysis, TCA, urea cycle.', classes: 11, marks: 15 },
        { unit: 'Module II', title: 'Entomology, Fisheries & Immunology', content: 'Insect orders morphology, vectors & pests, teleosts NE, fins, capture/culture fisheries, innate/adaptive immunity, antibodies, MHC.', classes: 11, marks: 15 },
        { unit: 'Module III', title: 'Reproduction & Molecular Biology', content: 'Gonadal hormones, male/female systems sessional, replication, replication telomerase, transcription, translation, operon, gene silencing.', classes: 12, marks: 15 },
        { unit: 'Module IV', title: 'Cell, Development & Applied', content: 'Cell organelles, membrane, junctions, chromosomes, gametogenesis, cleavage, IVF, wildlife conservation, databases, PCR, gene cloning.', classes: 11, marks: 15 }
      ],
      practicals: [
        'Qualitative tests of functional groups in carbohydrates, proteins, lipids.',
        'Estimation of pond pH, dissolved oxygen, dissection of fish pituitary.',
        'Temporary stained squash of onion root tip to study mitosis.',
        'Genomic DNA isolation from E. coli, PCR, restriction digestion.'
      ],
      readings: [
        'Lehninger’s Principles of Biochemistry, Cox, M.M and Nelson, D.L., Macmillan.',
        'Molecular Biology of the Cell, Alberts, B. (2014), John Wiley & Sons.',
        'Cell and Molecular Biology, Karp, G. (2019), John Wiley & Sons.'
      ]
    }
  ]
};

// Original BOTANY_FULL_Syllabus array kept for type support
const BOTANY_FULL_Syllabus = DEPARTMENT_SYLLABUSES.botany;


export default function SyllabusPdfViewer({ 
  departmentId, 
  departmentName, 
  pdfUrl, 
  fileSize 
}: SyllabusPdfViewerProps) {
  const [zoom, setZoom] = useState(100);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTab, setCurrentTab] = useState('documents'); // 'documents' or 'reader'
  const [selectedSemesterIdx, setSelectedSemesterIdx] = useState(0);
  const [contrastMode, setContrastMode] = useState<any>('light'); // 'light', 'cream', 'neutral-dark'
  const [pagesCount, setPagesCount] = useState(33); // Botany PDF is 45 pages overall
  const [customPage, setCustomPage] = useState(1);

  // Dynamic offline multi-page PDF builder and search filters compiled local-first.
  const activeSyllabus = useMemo(() => {
    return DEPARTMENT_SYLLABUSES[departmentId] || DEPARTMENT_SYLLABUSES.botany;
  }, [departmentId]);

  // Adjust selected idx when curriculum array length changes
  const activeSelectedSemesterIdx = useMemo(() => {
    if (selectedSemesterIdx >= activeSyllabus.length) {
      return 0;
    }
    return selectedSemesterIdx;
  }, [selectedSemesterIdx, activeSyllabus]);

  const downloadPdf = () => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Generate high-end multi-page beautifully formatted PDF completely offline for any department!
      activeSyllabus.forEach((sem, index) => {
        if (index > 0) {
          doc.addPage();
        }
        
        let y = 18;
        
        // Header Accent Rule
        doc.setDrawColor(20, 110, 100);
        doc.setLineWidth(0.8);
        doc.line(15, y - 5, 195, y - 5);
        
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(150, 120, 70); // Bronze/Gold tone
        doc.text(`TYAGBIR HEM BARUAH COLLEGE  -  DEPARTMENT OF ${departmentName.toUpperCase()}`, 105, y, { align: 'center' });
        y += 6;

        doc.setFontSize(13);
        doc.setTextColor(30, 41, 59);
        doc.text("Gauhati University Four-Year Undergraduate Programme", 105, y, { align: 'center' });
        y += 6;

        doc.setFontSize(10.5);
        doc.setTextColor(20, 110, 100);
        doc.text(`Official Honors Syllabus: ${sem.semester} [FYUGP/NEP/CBCS]`, 105, y, { align: 'center' });
        y += 5;

        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.text(
          `Course: ${sem.courseName}  |  Theory: ${sem.credits.theory} Credits  |  Practical: ${sem.credits.practical} Credit  |  Evaluation Marks: ${sem.marks.total}`,
          105,
          y,
          { align: 'center' }
        );
        y += 8;

        doc.setDrawColor(220, 225, 230);
        doc.setLineWidth(0.3);
        doc.line(15, y, 195, y);
        y += 8;

        // Part A: Theory
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(20, 110, 100);
        doc.text("PART A: THEORY CURRICULUM CORE STUDY UNITS", 15, y);
        y += 6;

        sem.theoryUnits.forEach((unitObj) => {
          if (y > 260) {
            doc.addPage();
            y = 18;
          }
          doc.setFont('Helvetica', 'bold');
          doc.setFontSize(8.5);
          doc.setTextColor(30, 41, 59);
          doc.text(`${unitObj.unit}: ${unitObj.title} (${unitObj.classes} Classes • ${unitObj.marks} Marks)`, 15, y);
          y += 4.5;

          doc.setFont('Helvetica', 'normal');
          doc.setFontSize(8);
          doc.setTextColor(70, 80, 95);
          const splitContent = doc.splitTextToSize(unitObj.content, 175);
          doc.text(splitContent, 15, y);
          y += (splitContent.length * 4) + 4;
        });

        // Part B: Practicals
        if (sem.practicals && sem.practicals.length > 0 && sem.practicals[0] !== 'Not Applicable (Theory Course)') {
          if (y > 240) {
            doc.addPage();
            y = 18;
          }
          y += 2;
          doc.setFont('Helvetica', 'bold');
          doc.setFontSize(10);
          doc.setTextColor(20, 110, 100);
          doc.text(`PART B: CORE PRACTICAL ACTIVITIES (Credit: ${sem.credits.practical})`, 15, y);
          y += 6;

          sem.practicals.forEach((prac, pIdx) => {
            if (y > 275) {
              doc.addPage();
              y = 18;
            }
            doc.setFont('Helvetica', 'normal');
            doc.setFontSize(8);
            doc.setTextColor(70, 80, 95);
            const splitPrac = doc.splitTextToSize(`${pIdx + 1}. ${prac}`, 175);
            doc.text(splitPrac, 15, y);
            y += (splitPrac.length * 4) + 1.5;
          });
        }

        // Part C: Reading List
        if (sem.readings && sem.readings.length > 0) {
          if (y > 230) {
            doc.addPage();
            y = 18;
          }
          y += 4;
          doc.setFont('Helvetica', 'bold');
          doc.setFontSize(10);
          doc.setTextColor(20, 110, 100);
          doc.text("PART C: PRESCRIBED REFERENCE LITERATURE READING LIST", 15, y);
          y += 6;

          sem.readings.forEach((book, bIdx) => {
            if (y > 275) {
              doc.addPage();
              y = 18;
            }
            doc.setFont('Helvetica', 'normal');
            doc.setFontSize(7.5);
            doc.setTextColor(110, 120, 135);
            const splitBook = doc.splitTextToSize(`• ${book}`, 175);
            doc.text(splitBook, 15, y);
            y += (splitBook.length * 4) + 1.5;
          });
        }

        // Footer
        doc.setDrawColor(220, 225, 230);
        doc.line(15, 282, 195, 282);
        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(140, 150, 165);
        doc.text("Tyagbir Hem Baruah College, Jamugurihat - Gauhati University Syllabus Port", 15, 286);
        doc.text(`Official GU Core Framework | Page ${index + 1} of ${activeSyllabus.length}`, 195, 286, { align: 'right' });
      });

      doc.save(`Gauhati_University_BSc_${departmentId}_Honours_Syllabus.pdf`);
    } catch (err) {
      console.error(err);
    }
  };

  // Filter semester information if user searches
  const filteredSyllabus = useMemo(() => {
    if (!searchQuery) return activeSyllabus;
    const lowerQuery = searchQuery.toLowerCase();
    return activeSyllabus.filter(sem => 
      sem.courseName.toLowerCase().includes(lowerQuery) ||
      sem.semester.toLowerCase().includes(lowerQuery) ||
      sem.theoryUnits.some(u => u.title.toLowerCase().includes(lowerQuery) || u.content.toLowerCase().includes(lowerQuery))
    );
  }, [searchQuery, activeSyllabus]);

  const activeSyllabusSemester = activeSyllabus[activeSelectedSemesterIdx] || activeSyllabus[0];

  const handleNextPage = () => {
    setSelectedSemesterIdx((prev) => (prev + 1) % activeSyllabus.length);
  };

  const handlePrevPage = () => {
    setSelectedSemesterIdx((prev) => (prev - 1 + activeSyllabus.length) % activeSyllabus.length);
  };

  const handlePrint = () => {
    window.print();
  };

  // Always enable interactive reader mode for the departments mapped!
  const hasInteractiveMode = DEPARTMENT_SYLLABUSES[departmentId] !== undefined;

  // Highlight helper for search
  const highlightText = (text: string) => {
    if (!searchQuery) return text;
    const parts = text.split(new RegExp(`(${searchQuery})`, 'gi'));
    return (
      <span>
        {parts.map((p, i) => 
          p.toLowerCase() === searchQuery.toLowerCase() 
            ? <mark key={i} className="bg-yellow-200 text-slate-900 rounded-xs px-0.5 font-semibold">{p}</mark> 
            : p
        )}
      </span>
    );
  };

  return (
    <div 
      className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[700px] text-slate-200 font-sans select-none" 
      id={`interactive-syllabus-viewer-${departmentId}`}
    >
      {/* Top PDF Reader Titlebar */}
      <div className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="bg-red-500/10 text-red-400 p-2 rounded-xl border border-red-500/15">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[9px] font-mono font-bold bg-slate-800 text-teal-400 border border-slate-700 px-2 py-0.5 rounded uppercase tracking-wider">
                GU Gauhati PDF Engine
              </span>
              <span className="text-[9px] font-mono font-bold bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/10">
                CBCS/NEP SECURE
              </span>
            </div>
            <h4 className="font-display text-sm font-bold text-white tracking-tight leading-normal mt-1">
              Gauhati University Bachelor of Science ({departmentName}) Honours Syllabus
            </h4>
          </div>
        </div>

        {/* Action downloads */}
        <div className="flex items-center space-x-3 w-full sm:w-auto self-stretch sm:self-auto justify-end">
          <button
            onClick={downloadPdf}
            className="flex items-center space-x-2 bg-teal-800 hover:bg-teal-900 border border-teal-700 text-white px-4 py-2 rounded-xl text-xs font-semibold select-none cursor-pointer tracking-wider transition-all"
            id={`download-syllabus-btn-${departmentId}`}
          >
            <Download className="h-3.5 w-3.5" />
            <span>PDF ({fileSize})</span>
          </button>
          <button
            onClick={handlePrint}
            className="p-2 bg-slate-850 hover:bg-slate-800 border border-slate-700 rounded-xl text-slate-300 hover:text-white transition-colors"
            title="Print Syllabus"
          >
            <Printer className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* PDF Action Toolbar */}
      <div className="bg-slate-900 border-b border-slate-800/80 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Navigation / Page selectors */}
        <div className="flex items-center space-x-2">
          {hasInteractiveMode ? (
            <>
              <button
                onClick={handlePrevPage}
                className="p-1 px-2 bg-slate-800 hover:bg-slate-700 active:bg-slate-950 text-slate-300 rounded border border-slate-750 font-bold transition-all disabled:opacity-30 disabled:pointer-events-none"
                disabled={activeSyllabus.length <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-[11px] font-mono font-medium text-slate-400">
                Semester Part <strong className="text-white">{activeSelectedSemesterIdx + 1}</strong> of <strong className="text-white">{activeSyllabus.length}</strong>
              </span>
              <button
                onClick={handleNextPage}
                className="p-1 px-2 bg-slate-800 hover:bg-slate-700 active:bg-slate-950 text-slate-300 rounded border border-slate-750 font-bold transition-all disabled:opacity-30 disabled:pointer-events-none"
                disabled={activeSyllabus.length <= 1}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </>
          ) : (
            <span className="text-[11px] font-mono text-slate-400">
              Document Mode: <strong className="text-white">Active (Single Page Mock)</strong>
            </span>
          )}
        </div>

        {/* Fit / Zoom levels */}
        <div className="flex items-center space-x-3 bg-slate-950/40 rounded px-2.5 py-1 border border-slate-850">
          <button
            onClick={() => setZoom(Math.max(60, zoom - 10))}
            className="text-slate-400 hover:text-white disabled:opacity-30"
            disabled={zoom <= 60}
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </button>
          <span className="font-mono text-[11px] text-slate-300 w-10 text-center font-bold">
            {zoom}%
          </span>
          <button
            onClick={() => setZoom(Math.min(155, zoom + 10))}
            className="text-slate-400 hover:text-white disabled:opacity-30"
            disabled={zoom >= 150}
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Reader background theme selector */}
        <div className="flex items-center space-x-1">
          <span className="text-[10px] text-slate-500 font-mono hidden md:inline">Paper Theme: </span>
          {['light', 'cream', 'neutral-dark'].map((theme) => (
            <button
              key={theme}
              onClick={() => setContrastMode(theme)}
              className={`px-2.5 py-1 rounded text-[10px] font-bold border capitalize transition-all ${
                contrastMode === theme 
                  ? 'bg-teal-650 text-white border-teal-500 shadow-sm' 
                   : 'bg-slate-800 hover:bg-slate-750 text-slate-300 border-slate-700'
              }`}
            >
              {theme === 'neutral-dark' ? 'dark' : theme}
            </button>
          ))}
        </div>

        {/* Text Filter search inside document */}
        <div className="relative">
          <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search in Syllabus..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-slate-950/70 border border-slate-800 focus:border-teal-700 rounded-lg pl-8 pr-3 py-1 text-xs text-white focus:outline-none placeholder:text-slate-600 transition-all w-36 md:w-48"
          />
        </div>
      </div>

      {/* Main Workspace Frame container */}
      <div className="flex flex-1 overflow-hidden bg-slate-950/80">
        
        {/* Document structure Index sidebar (Only shows for interactive botany syllabus layout) */}
        {hasInteractiveMode && (
          <div className="hidden md:flex flex-col w-52 bg-slate-950 border-r border-slate-850 p-4 shrink-0 overflow-y-auto space-y-4">
            <h5 className="text-[9px] font-mono font-bold text-slate-500 tracking-widest uppercase border-b border-slate-850 pb-1.5 flex items-center justify-between">
              <span>Syllabus Pages</span>
              <Sparkles className="h-2.5 w-2.5 text-amber-500" />
            </h5>
            <div className="space-y-1">
              {activeSyllabus.map((sem, sIdx) => (
                <button
                  key={sIdx}
                  onClick={() => setSelectedSemesterIdx(sIdx)}
                  className={`w-full text-left p-2.5 rounded-lg text-xs leading-snug tracking-tight font-medium border transition-all ${
                    activeSelectedSemesterIdx === sIdx
                      ? 'bg-slate-800 text-white border-slate-700 font-bold'
                      : 'bg-transparent text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-900/40'
                  }`}
                >
                  <div className="font-semibold text-slate-300">{sem.semester}</div>
                  <div className="text-[10px] text-slate-500 font-light line-clamp-1 mt-0.5">{sem.courseName}</div>
                </button>
              ))}
            </div>

            {/* Document Attributes Summary info box */}
            <div className="border border-slate-850 rounded-xl p-3 bg-slate-900/40 text-[10px] text-slate-500 leading-normal space-y-1.5">
              <span className="font-mono text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center space-x-1">
                <Info className="h-3 w-3 text-slate-500" />
                <span>GU Regulations</span>
              </span>
              <p className="font-light">Prescribed under FYUGP Choice Based Credit System (CBCS) Gauhati University standards.</p>
              <div className="text-slate-400 font-mono flex flex-col pt-1 space-y-0.5 border-t border-slate-850">
                <span>Theory Credit Ratio: 3:1</span>
                <span>Evaluation Marks: 60/40</span>
              </div>
            </div>
          </div>
        )}

        {/* Printable/Readable PDF Canvas Sheet panel */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 flex justify-center bg-slate-900/55 scrollbar-thin scrollbar-thumb-slate-800">
          
          <div 
            style={{ 
              transform: `scale(${zoom / 100})`, 
              transformOrigin: 'top center',
              width: '100%',
              maxWidth: zoom >= 100 ? '920px' : '720px',
              transition: 'transform 0.15s ease-out, max-width 0.15s ease-out'
            }}
            className={`border rounded-2xl p-6 sm:p-10 shadow-lg min-h-[520px] relative font-serif text-slate-800 select-text transition-colors duration-150 ${
              contrastMode === 'light' 
                ? 'bg-white border-white text-slate-900' 
                : contrastMode === 'cream' 
                  ? 'bg-[#FBF6ED] border-[#F4EBE0] text-[#4F3F2D]'
                  : 'bg-slate-950 border-slate-800 text-slate-300'
            }`}
            id="syllabus-view-paper"
          >
            {/* Stamp / Decorative University crest in document background */}
            <div className="absolute right-8 top-8 opacity-5 filter grayscale flex flex-col items-center select-none pointer-events-none">
              <div className="border-4 border-slate-500 rounded-full h-24 w-24 flex items-center justify-center font-mono text-[9px] font-bold text-center">
                OFFICIAL BLU-PRINT <br /> SECURE COPY
              </div>
            </div>

            {/* BOTTOM REAL RENDER: EXTREMELY ACCURATE COMPRESSED PDF BLUEPRINT */}
            <div className="space-y-8 tracking-normal">
              {/* PDF Course Heading Header */}
              <div className="text-center border-b-2 pb-6 border-slate-200/65 flex flex-col items-center">
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#9c845b]">Gauhati University Document Registry</span>
                <h3 className="font-display font-black text-xl sm:text-2xl mt-1 tracking-tight">Four-year Undergraduate Programme Syllabus</h3>
                <div className="flex items-center space-x-3 text-xs opacity-80 mt-1 font-mono">
                  <span>Subject: <strong className="font-bold underline uppercase">{departmentName} HONOURS</strong></span>
                  <span>•</span>
                  <span>Course Level Code: 100-299 UG</span>
                </div>
              </div>

              {/* Specific selected Page parameters */}
              <div className="space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50/55 p-3 rounded-xl border border-slate-100/70 text-xs text-slate-500 font-sans">
                  <div>
                    Active Unit Paper: <strong className="text-slate-800 font-bold">{activeSyllabusSemester.semester}</strong>
                  </div>
                  <div>
                    Course Focus: <em className="text-slate-700 italic font-semibold">{activeSyllabusSemester.courseName}</em>
                  </div>
                </div>

                {/* Syllabus Theory Credits Board info block representation */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50/20 p-4 border rounded-xl font-sans text-xs text-center border-dashed">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Theory Credits</span>
                    <strong className="text-base text-teal-800 font-bold">{activeSyllabusSemester.credits.theory} Credits</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Practical Credits</span>
                    <strong className="text-base text-teal-800 font-bold">{activeSyllabusSemester.credits.practical} Credits</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Evaluation Marks</span>
                    <strong className="text-base text-slate-800 font-bold">{activeSyllabusSemester.marks.theory} + {activeSyllabusSemester.marks.practical} ({activeSyllabusSemester.marks.total})</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Contact Hours</span>
                    <strong className="text-base text-slate-800 font-bold">{activeSyllabusSemester.classes.total} Sessions</strong>
                  </div>
                </div>

                {/* Theory syllabus course units table */}
                <div className="space-y-3">
                  <h4 className="text-xs uppercase font-bold text-slate-400 font-sans tracking-wider border-b border-slate-100 pb-1">
                    Part A: Theory Curriculum Document Content
                  </h4>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-serif text-sm border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-400 font-sans text-[11px] font-bold uppercase">
                          <th className="py-2.5 px-3 w-16">Unit NO.</th>
                          <th className="py-2.5 px-4">Detailed Core Syllabus Description</th>
                          <th className="py-2.5 px-3 text-center">Classes</th>
                          <th className="py-2.5 px-3 text-center">Marks</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100/50">
                        {activeSyllabusSemester.theoryUnits.map((u, uIdx) => (
                          <tr key={uIdx} className="hover:bg-slate-50/10">
                            <td className="py-3 px-3 font-mono font-bold text-xs text-slate-500 self-start align-top">
                              {u.unit}
                            </td>
                            <td className="py-3 px-4 leading-relaxed text-[13px] font-light">
                              <strong className="font-bold text-slate-900 block font-sans text-xs underline decoration-dotted mb-1">
                                {highlightText(u.title)}
                              </strong>
                              {highlightText(u.content)}
                            </td>
                            <td className="py-3 px-3 text-center font-mono text-xs text-slate-605">
                              {u.classes}
                            </td>
                            <td className="py-3 px-3 text-center font-mono text-xs font-bold text-slate-900">
                              {u.marks}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Practicals details */}
                {activeSyllabusSemester.practicals && activeSyllabusSemester.practicals.length > 0 && activeSyllabusSemester.practicals[0] !== 'Not Applicable (Theory Course)' && (
                  <div className="space-y-2 pt-4">
                    <h4 className="text-xs uppercase font-bold text-slate-400 font-sans tracking-wider border-b border-slate-100 pb-1">
                      Part B: Core Practicals (Credit: {activeSyllabusSemester.credits.practical})
                    </h4>
                    <ol className="list-decimal pl-5 space-y-1.5 text-xs font-sans text-slate-600 leading-relaxed font-light">
                      {activeSyllabusSemester.practicals.map((prac, pIdx) => (
                        <li key={pIdx}>
                          {highlightText(prac)}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {/* Reading list */}
                {activeSyllabusSemester.readings && activeSyllabusSemester.readings.length > 0 && (
                  <div className="space-y-2 pt-4">
                    <h4 className="text-xs uppercase font-bold text-slate-400 font-sans tracking-wider border-b border-slate-100 pb-1">
                      Prescribed Reference Literature Reading List
                    </h4>
                    <ul className="list-disc pl-5 space-y-1.5 text-xs font-sans text-slate-500 leading-relaxed font-light">
                      {activeSyllabusSemester.readings.map((book, bIdx) => (
                        <li key={bIdx}>
                          {highlightText(book)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Designer signatures */}
                <div className="pt-6 border-t-2 border-slate-200/50 flex flex-col sm:flex-row justify-between items-center text-xs font-sans text-slate-400 gap-4">
                  <div>
                    Faculty Council Lead: <strong className="text-slate-800">Board of Studies (Gauhati University)</strong>
                  </div>
                  <div className="text-right">
                    Approved Syllabus Blueprint Version • Session 2026-27
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
