const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting comprehensive AIIA synthetic data seeding...');

  // Clean existing records safely in dependency order
  await prisma.patientStudyMessage.deleteMany({});
  await prisma.patientDocument.deleteMany({});
  await prisma.patientAdherenceLog.deleteMany({});
  await prisma.patientQuestionnaire.deleteMany({});
  await prisma.patientVisit.deleteMany({});
  await prisma.aIAnalysis.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.alert.deleteMany({});
  await prisma.cTRIRegistration.deleteMany({});
  await prisma.ethicsApproval.deleteMany({});
  await prisma.complianceRecord.deleteMany({});
  await prisma.safetyEvent.deleteMany({});
  await prisma.recruitmentRecord.deleteMany({});
  await prisma.patient.deleteMany({});
  await prisma.trialSite.deleteMany({});
  await prisma.trialMilestone.deleteMany({});
  await prisma.trial.deleteMany({});
  await prisma.researchSite.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('🧹 Cleaned existing tables.');

  // 1. Seed Users
  const passwordHash = await bcrypt.hash('Demo@AIIA2025', 10);

  const users = [
    {
      uniqueId: 'AIIA-ADM-1001',
      email: 'admin@aiia.demo',
      password: passwordHash,
      name: 'Dr. Tanuja Nesari',
      role: 'ADMIN',
      department: 'Directorate & Clinical Research',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
    },
    {
      uniqueId: 'AIIA-RES-2002',
      email: 'researcher@aiia.demo',
      password: passwordHash,
      name: 'Dr. Anand Kumar',
      role: 'RESEARCHER',
      department: 'Kayachikitsa (Internal Medicine)',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
    },
    {
      uniqueId: 'AIIA-SAF-3003',
      email: 'safety@aiia.demo',
      password: passwordHash,
      name: 'Dr. Priyadarshini Rao',
      role: 'SAFETY_OFFICER',
      department: 'Pharmacovigilance & Drug Safety Unit',
      avatar: 'https://images.unsplash.com/photo-1594824813589-4b71f9f25752?w=150&auto=format&fit=crop&q=80',
    },
    {
      uniqueId: 'AIIA-CMP-4004',
      email: 'compliance@aiia.demo',
      password: passwordHash,
      name: 'Adv. Rajeshwar Sharma',
      role: 'COMPLIANCE_OFFICER',
      department: 'Regulatory & Ethics Committee Secretariat',
      avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80',
    },
    {
      uniqueId: 'AIIA-MGT-5005',
      email: 'management@aiia.demo',
      password: passwordHash,
      name: 'Prof. Vaidya K. S. Dhiman',
      role: 'MANAGEMENT',
      department: 'Ministry of Ayush & Governing Body',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    },
    {
      uniqueId: 'AIIA-PAT-1001',
      email: 'patient@aiia.demo',
      password: passwordHash,
      name: 'Aditi Sharma',
      role: 'PATIENT',
      department: 'Trial Participant (AYU-001 Cohort)',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    },
  ];

  const createdUsers = [];
  for (const u of users) {
    const user = await prisma.user.create({ data: u });
    createdUsers.push(user);
  }
  const patientUser = createdUsers.find(u => u.role === 'PATIENT');
  console.log(`✅ Created ${createdUsers.length} demo users (including Patient Persona).`);

  // 2. Seed Premier Ayurvedic Research Centers
  const sitesData = [
    {
      siteCode: 'SITE-DEL-01',
      name: 'All India Institute of Ayurveda (AIIA Main Campus)',
      city: 'New Delhi',
      state: 'Delhi',
      principalInvestigator: 'Dr. Anand Kumar',
      contactEmail: 'delhi.research@aiia.gov.in',
      contactPhone: '+91-11-29997801',
      capacity: 350,
      performanceScore: 94,
      recruitmentRate: 92,
      dataQualityRate: 98,
      complianceRate: 96,
    },
    {
      siteCode: 'SITE-JAI-02',
      name: 'National Institute of Ayurveda (NIA)',
      city: 'Jaipur',
      state: 'Rajasthan',
      principalInvestigator: 'Prof. Sanjeev Sharma',
      contactEmail: 'jaipur.trials@nia.edu.in',
      contactPhone: '+91-141-2635816',
      capacity: 250,
      performanceScore: 82,
      recruitmentRate: 74,
      dataQualityRate: 91,
      complianceRate: 90,
    },
    {
      siteCode: 'SITE-JAM-03',
      name: 'Institute of Teaching & Research in Ayurveda (ITRA)',
      city: 'Jamnagar',
      state: 'Gujarat',
      principalInvestigator: 'Dr. B. C. Patel',
      contactEmail: 'jamnagar.ctms@itra.edu.in',
      contactPhone: '+91-288-2553936',
      capacity: 200,
      performanceScore: 89,
      recruitmentRate: 85,
      dataQualityRate: 93,
      complianceRate: 94,
    },
    {
      siteCode: 'SITE-GOA-04',
      name: 'AIIA Satellite Campus (Goa Centre of Excellence)',
      city: 'Pernem',
      state: 'Goa',
      principalInvestigator: 'Dr. Sujata Kadam',
      contactEmail: 'goa.trials@aiia.gov.in',
      contactPhone: '+91-832-2200450',
      capacity: 180,
      performanceScore: 91,
      recruitmentRate: 88,
      dataQualityRate: 95,
      complianceRate: 97,
    },
    {
      siteCode: 'SITE-VAR-05',
      name: 'Faculty of Ayurveda, IMS - Banaras Hindu University (BHU)',
      city: 'Varanasi',
      state: 'Uttar Pradesh',
      principalInvestigator: 'Prof. K. H. H. V. S. S. Narasimha Murthy',
      contactEmail: 'bhu.ayurveda@bhu.ac.in',
      contactPhone: '+91-542-2367568',
      capacity: 220,
      performanceScore: 86,
      recruitmentRate: 81,
      dataQualityRate: 89,
      complianceRate: 92,
    },
    {
      siteCode: 'SITE-MUM-06',
      name: 'Regional Ayurveda Research Institute (RARI)',
      city: 'Mumbai',
      state: 'Maharashtra',
      principalInvestigator: 'Dr. Jayashree Joshi',
      contactEmail: 'mumbai.rari@ccras.nic.in',
      contactPhone: '+91-22-24934988',
      capacity: 160,
      performanceScore: 68,
      recruitmentRate: 61,
      dataQualityRate: 84,
      complianceRate: 80,
    },
    {
      siteCode: 'SITE-BLR-07',
      name: 'Central Ayurveda Research Institute (CARI)',
      city: 'Bengaluru',
      state: 'Karnataka',
      principalInvestigator: 'Dr. G. Venkateswarlu',
      contactEmail: 'bengaluru.cari@ccras.nic.in',
      contactPhone: '+91-80-23383210',
      capacity: 190,
      performanceScore: 84,
      recruitmentRate: 78,
      dataQualityRate: 90,
      complianceRate: 91,
    },
    {
      siteCode: 'SITE-LKO-08',
      name: 'Central Council for Research in Ayurvedic Sciences (CCRAS Lucknow)',
      city: 'Lucknow',
      state: 'Uttar Pradesh',
      principalInvestigator: 'Dr. Ramesh Chandra',
      contactEmail: 'lucknow.trials@ccras.nic.in',
      contactPhone: '+91-522-2348911',
      capacity: 150,
      performanceScore: 71,
      recruitmentRate: 55,
      dataQualityRate: 82,
      complianceRate: 85,
    },
  ];

  const createdSites = [];
  for (const s of sitesData) {
    const site = await prisma.researchSite.create({ data: s });
    createdSites.push(site);
  }
  console.log(`✅ Created ${createdSites.length} research sites.`);

  // 3. Seed 25+ Ayurvedic Clinical Trials
  const trialsData = [
    {
      trialId: 'AYU-001',
      title: 'Standardized Ashwagandha (Withania somnifera) in Chronic Stress, Sleep Architecture & Serum Cortisol Regulation',
      shortDescription: 'Multi-center, double-blind, randomized placebo-controlled study evaluating standardized withanolide extract on HPA axis activity and deep sleep architecture.',
      treatment: 'Ashwagandha Extract WS-35 (600mg/day)',
      ayurvedicDiscipline: 'Kayachikitsa / Rasayana Tantra',
      indication: 'Generalized Anxiety, Insomnia & Elevated Serum Cortisol',
      phase: 'Phase III',
      studyType: 'Randomized Double-Blind Placebo-Controlled',
      principalInvestigator: 'Dr. Anand Kumar',
      targetParticipants: 240,
      currentEnrolled: 228,
      completedParticipants: 180,
      droppedParticipants: 8,
      startDate: new Date('2024-03-01'),
      expectedEndDate: new Date('2025-06-30'),
      status: 'Active',
      riskScore: 12,
      riskCategory: 'Low',
      complianceScore: 98,
      dataQualityScore: 97,
      safetyScore: 99,
      createdById: createdUsers[0].id,
    },
    {
      trialId: 'AYU-002',
      title: 'Comparative Efficacy & Safety of Bio-Enhanced Curcumin (BCM-95) vs Celecoxib in Grade II-III Knee Osteoarthritis (Sandhigata Vata)',
      shortDescription: 'Active-comparator trial evaluating synovial biomarker reduction (IL-6, TNF-alpha) and WOMAC functional pain scoring in osteoarthritis.',
      treatment: 'Bio-Enhanced Curcumin BCM-95 (500mg BID) vs Celecoxib (100mg BID)',
      ayurvedicDiscipline: 'Kayachikitsa / Sandhi Sharira',
      indication: 'Knee Osteoarthritis (Sandhigata Vata)',
      phase: 'Phase III',
      studyType: 'Active-Controlled Non-Inferiority Trial',
      principalInvestigator: 'Dr. Anand Kumar',
      targetParticipants: 300,
      currentEnrolled: 168,
      completedParticipants: 90,
      droppedParticipants: 24,
      startDate: new Date('2024-01-15'),
      expectedEndDate: new Date('2025-05-15'),
      status: 'Delayed',
      riskScore: 82,
      riskCategory: 'Critical',
      complianceScore: 78,
      dataQualityScore: 81,
      safetyScore: 84,
      createdById: createdUsers[0].id,
    },
    {
      trialId: 'AYU-003',
      title: 'Therapeutic Potential of Guduchi (Tinospora cordifolia) Ghanavati in Post-Viral Chronic Fatigue Syndrome & Immune Modulation',
      shortDescription: 'Evaluating immunomodulatory biomarkers (CD4/CD8 ratio, NK-cell activity) and Chalder Fatigue Scale improvements post-viral sequelae.',
      treatment: 'Guduchi Ghanavati (1000mg/day) + Samshamani Vati',
      ayurvedicDiscipline: 'Rasayana & Agada Tantra',
      indication: 'Post-Viral Fatigue Syndrome / Ojas Kshaya',
      phase: 'Phase II',
      studyType: 'Randomized Controlled Multi-Arm Trial',
      principalInvestigator: 'Dr. Priyadarshini Rao',
      targetParticipants: 180,
      currentEnrolled: 135,
      completedParticipants: 80,
      droppedParticipants: 10,
      startDate: new Date('2024-04-10'),
      expectedEndDate: new Date('2025-07-20'),
      status: 'Active',
      riskScore: 68,
      riskCategory: 'High',
      complianceScore: 82,
      dataQualityScore: 89,
      safetyScore: 92,
      createdById: createdUsers[1].id,
    },
    {
      trialId: 'AYU-004',
      title: 'Pharmacodynamics and Safety Profile of Shuddha Shilajit Formulation in Metabolic Syndrome and Mitochondrial Energy Output',
      shortDescription: 'Investigating fulvic acid bio-energetics, ATP production in peripheral blood mononuclear cells, and HOMA-IR insulin sensitivity metrics.',
      treatment: 'Standardized Shuddha Shilajit Extract (500mg/day)',
      ayurvedicDiscipline: 'Rasayana Tantra',
      indication: 'Metabolic Syndrome / Medoroga',
      phase: 'Phase I/II',
      studyType: 'Dose-Escalation Safety & Efficacy Trial',
      principalInvestigator: 'Dr. Anand Kumar',
      targetParticipants: 120,
      currentEnrolled: 72,
      completedParticipants: 35,
      droppedParticipants: 12,
      startDate: new Date('2024-02-01'),
      expectedEndDate: new Date('2025-04-30'),
      status: 'Delayed',
      riskScore: 78,
      riskCategory: 'High',
      complianceScore: 79,
      dataQualityScore: 75,
      safetyScore: 76,
      createdById: createdUsers[0].id,
    },
    {
      trialId: 'AYU-005',
      title: 'Impact of Triphala Churna on Gut Microbiome Diversity, SCFAs & Glycemic Control in Prediabetes (Prameha Purvarupa)',
      shortDescription: '16S rRNA metagenomic sequencing evaluating Akkermansia muciniphila colonization and HbA1c reduction with traditional Triphala powder.',
      treatment: 'Standardized Triphala Churna (5g bedtime with warm water)',
      ayurvedicDiscipline: 'Dravyaguna / Kayachikitsa',
      indication: 'Prediabetes & Gut Dysbiosis (Prameha)',
      phase: 'Phase III',
      studyType: 'Double-Blind Randomized Placebo-Controlled',
      principalInvestigator: 'Prof. Sanjeev Sharma',
      targetParticipants: 200,
      currentEnrolled: 184,
      completedParticipants: 130,
      droppedParticipants: 6,
      startDate: new Date('2024-05-01'),
      expectedEndDate: new Date('2025-08-30'),
      status: 'Active',
      riskScore: 62,
      riskCategory: 'High',
      complianceScore: 84,
      dataQualityScore: 93,
      safetyScore: 96,
      createdById: createdUsers[1].id,
    },
    {
      trialId: 'AYU-006',
      title: 'Cognitive Enhancement & Neuroprotective Efficacy of Bacopa monnieri (Brahmi) in Age-Associated Memory Impairment (Smriti Bhramsha)',
      shortDescription: 'Computerized neurocognitive testing (MoCA, CANTAB) and BDNF plasma levels across geriatric cohorts receiving standardized Bacoside-A.',
      treatment: 'Brahmi Extract (450mg/day standardized to 55% bacosides)',
      ayurvedicDiscipline: 'Manasa Roga / Rasayana',
      indication: 'Age-Associated Memory Impairment (Smriti Daurbalya)',
      phase: 'Phase III',
      studyType: 'Randomized Double-Blind Placebo-Controlled',
      principalInvestigator: 'Dr. Anand Kumar',
      targetParticipants: 160,
      currentEnrolled: 148,
      completedParticipants: 110,
      droppedParticipants: 5,
      startDate: new Date('2024-06-15'),
      expectedEndDate: new Date('2025-09-15'),
      status: 'Recruiting',
      riskScore: 18,
      riskCategory: 'Low',
      complianceScore: 96,
      dataQualityScore: 98,
      safetyScore: 99,
      createdById: createdUsers[0].id,
    },
    {
      trialId: 'AYU-007',
      title: 'Multicenter Real-World Effectiveness of AYUSH-64 Polyherbal Formulation in Mild-to-Moderate Upper Respiratory Tract Viral Illnesses',
      shortDescription: 'Observational registry analyzing symptom resolution duration, CRP reduction, and hospitalization avoidance in seasonal viral fevers.',
      treatment: 'AYUSH-64 Tablets (2 tablets 500mg TID for 7 days)',
      ayurvedicDiscipline: 'Jwara Chikitsa',
      indication: 'Upper Respiratory Viral Illness / Vata-Kapha Jwara',
      phase: 'Phase IV',
      studyType: 'Post-Market Observational Registry',
      principalInvestigator: 'Dr. Priyadarshini Rao',
      targetParticipants: 500,
      currentEnrolled: 500,
      completedParticipants: 485,
      droppedParticipants: 15,
      startDate: new Date('2023-11-01'),
      expectedEndDate: new Date('2024-12-31'),
      actualEndDate: new Date('2024-12-28'),
      status: 'Completed',
      riskScore: 8,
      riskCategory: 'Low',
      complianceScore: 99,
      dataQualityScore: 99,
      safetyScore: 99,
      createdById: createdUsers[0].id,
    },
    {
      trialId: 'AYU-008',
      title: 'Standardized Ksharasutra vs Conventional Fistulectomy in Complex High-Anal Fistula-in-Ano (Bhagandara): A Randomized Trial',
      shortDescription: 'Evaluation of sphincter preservation, recurrence rates, and visual analog pain scale comparing Apamarga Ksharasutra with open surgery.',
      treatment: 'Apamarga Ksharasutra Medicated Seton Application',
      ayurvedicDiscipline: 'Shalya Tantra',
      indication: 'Complex High Anal Fistula (Bhagandara)',
      phase: 'Phase III',
      studyType: 'Randomized Surgical Non-Inferiority Trial',
      principalInvestigator: 'Dr. Anand Kumar',
      targetParticipants: 150,
      currentEnrolled: 130,
      completedParticipants: 95,
      droppedParticipants: 4,
      startDate: new Date('2024-03-15'),
      expectedEndDate: new Date('2025-06-15'),
      status: 'Active',
      riskScore: 24,
      riskCategory: 'Low',
      complianceScore: 95,
      dataQualityScore: 94,
      safetyScore: 95,
      createdById: createdUsers[0].id,
    },
    {
      trialId: 'AYU-009',
      title: 'Nephroprotective Potential of Punarnavadi Compound in Stage 2-3 Diabetic Kidney Disease with Persistent Microalbuminuria',
      shortDescription: 'Monitoring eGFR trajectory, urinary albumin-to-creatinine ratio (UACR), and serum cystatin-C across 12-month treatment cycles.',
      treatment: 'Standardized Punarnavadi Kashaya + Chandraprabha Vati',
      ayurvedicDiscipline: 'Mutravaha Srotas Chikitsa',
      indication: 'Diabetic Nephropathy / Prameha Upadrava',
      phase: 'Phase II',
      studyType: 'Open-Label Add-On Randomized Trial',
      principalInvestigator: 'Dr. Priyadarshini Rao',
      targetParticipants: 140,
      currentEnrolled: 98,
      completedParticipants: 45,
      droppedParticipants: 8,
      startDate: new Date('2024-07-01'),
      expectedEndDate: new Date('2025-10-31'),
      status: 'Recruiting',
      riskScore: 42,
      riskCategory: 'Medium',
      complianceScore: 91,
      dataQualityScore: 88,
      safetyScore: 93,
      createdById: createdUsers[1].id,
    },
    {
      trialId: 'AYU-010',
      title: 'Classical Panchakarma (Virechana & Tikta Basti) Regimen in Refractory Plaque Psoriasis (Ekakustha): Clinical & Cytokine Trial',
      shortDescription: 'PASI score reduction, DLQI dermatological index, and serum IL-17/IL-23 reduction following structured seasonal shodhana procedures.',
      treatment: 'Classical Virechana followed by Mahatiktaka Ghrita Shodhana',
      ayurvedicDiscipline: 'Panchakarma / Twak Roga',
      indication: 'Chronic Plaque Psoriasis (Ekakustha)',
      phase: 'Phase II',
      studyType: 'Randomized Controlled Clinical Trial',
      principalInvestigator: 'Prof. Sanjeev Sharma',
      targetParticipants: 100,
      currentEnrolled: 82,
      completedParticipants: 60,
      droppedParticipants: 5,
      startDate: new Date('2024-04-01'),
      expectedEndDate: new Date('2025-07-31'),
      status: 'Active',
      riskScore: 35,
      riskCategory: 'Medium',
      complianceScore: 93,
      dataQualityScore: 92,
      safetyScore: 91,
      createdById: createdUsers[0].id,
    },
    {
      trialId: 'AYU-011',
      title: 'Cardioprotective & Endothelial Efficacy of Terminalia arjuna Bark Extract in Stable Angina (Hridroga) Post-PCI Rehabilitation',
      shortDescription: 'Flow-mediated dilation (FMD), high-sensitivity cardiac troponin, and Bruce treadmill exercise tolerance assessment.',
      treatment: 'Arjuna Hydroalcoholic Extract (500mg TID)',
      ayurvedicDiscipline: 'Hridroga Chikitsa',
      indication: 'Post-PCI Angina Pectoris / Hridroga',
      phase: 'Phase III',
      studyType: 'Randomized Double-Blind Add-on Trial',
      principalInvestigator: 'Dr. Anand Kumar',
      targetParticipants: 180,
      currentEnrolled: 155,
      completedParticipants: 112,
      droppedParticipants: 9,
      startDate: new Date('2024-05-15'),
      expectedEndDate: new Date('2025-08-15'),
      status: 'Active',
      riskScore: 28,
      riskCategory: 'Low',
      complianceScore: 94,
      dataQualityScore: 95,
      safetyScore: 97,
      createdById: createdUsers[0].id,
    },
    {
      trialId: 'AYU-012',
      title: 'Standardized Shatavari (Asparagus racemosus) Extract in Perimenopausal Vasomotor Symptoms and Bone Turnover Biomarkers',
      shortDescription: 'Evaluation of Kupperman Menopausal Index, serum CTX-1, osteocalcin, and hot flash frequency logs over 24 weeks.',
      treatment: 'Shatavari Extract (500mg BID standardized to 20% saponins)',
      ayurvedicDiscipline: 'Prasuti & Stri Roga',
      indication: 'Perimenopausal Syndrome (Rajonivritti Janya Lakshana)',
      phase: 'Phase III',
      studyType: 'Randomized Double-Blind Placebo-Controlled',
      principalInvestigator: 'Dr. Priyadarshini Rao',
      targetParticipants: 160,
      currentEnrolled: 152,
      completedParticipants: 120,
      droppedParticipants: 4,
      startDate: new Date('2024-02-15'),
      expectedEndDate: new Date('2025-05-30'),
      status: 'Active',
      riskScore: 16,
      riskCategory: 'Low',
      complianceScore: 97,
      dataQualityScore: 96,
      safetyScore: 98,
      createdById: createdUsers[1].id,
    },
    {
      trialId: 'AYU-013',
      title: 'Clinical Evaluation of Shuddha Guggulu in Atherogenic Dyslipidemia and Apolipoprotein-B Regulation',
      shortDescription: 'Lipid panel profiling, ApoB/ApoA-1 ratios, and carotid intima-media thickness (CIMT) progression analysis.',
      treatment: 'Shuddha Guggulu Purified Extract (1000mg/day)',
      ayurvedicDiscipline: 'Dravyaguna / Medoroga',
      indication: 'Hypercholesterolemia & Atherogenic Dyslipidemia',
      phase: 'Phase II',
      studyType: 'Parallel-Group Randomized Active-Controlled Trial',
      principalInvestigator: 'Prof. Sanjeev Sharma',
      targetParticipants: 120,
      currentEnrolled: 65,
      completedParticipants: 30,
      droppedParticipants: 11,
      startDate: new Date('2024-03-01'),
      expectedEndDate: new Date('2025-06-01'),
      status: 'Suspended',
      riskScore: 85,
      riskCategory: 'Critical',
      complianceScore: 65,
      dataQualityScore: 72,
      safetyScore: 70,
      createdById: createdUsers[0].id,
    },
    {
      trialId: 'AYU-014',
      title: 'Deglycyrrhizinated Licorice (Yashtimadhu) vs Omeprazole in Reflux Esophagitis (Amlapitta): Multicenter Endoscopic Trial',
      shortDescription: 'Upper GI endoscopy healing rates (Los Angeles Classification) and GERD Health-Related Quality of Life score improvements.',
      treatment: 'DGL Yashtimadhu Chewable Tablets (760mg before meals)',
      ayurvedicDiscipline: 'Annavaha Srotas Chikitsa',
      indication: 'Gastroesophageal Reflux Disease (Amlapitta)',
      phase: 'Phase III',
      studyType: 'Randomized Active-Comparator Endoscopic Study',
      principalInvestigator: 'Dr. Anand Kumar',
      targetParticipants: 220,
      currentEnrolled: 210,
      completedParticipants: 175,
      droppedParticipants: 7,
      startDate: new Date('2024-04-01'),
      expectedEndDate: new Date('2025-07-01'),
      status: 'Active',
      riskScore: 20,
      riskCategory: 'Low',
      complianceScore: 95,
      dataQualityScore: 94,
      safetyScore: 98,
      createdById: createdUsers[0].id,
    },
    {
      trialId: 'AYU-015',
      title: 'Varunadi Kwatha Formulation in Calcium Oxalate Renal Calculi (Ashmari): Ultrasonic Spontaneous Expulsion Rate Study',
      shortDescription: 'Evaluation of stone clearance (<8mm calculi), pain-free intervals, and 24-hour urinary oxalate/citrate balance.',
      treatment: 'Varunadi Kwatha (40ml BID before food) + Gokshuradi Guggulu',
      ayurvedicDiscipline: 'Shalya Tantra / Mutrashmari',
      indication: 'Urolithiasis (Ashmari)',
      phase: 'Phase III',
      studyType: 'Randomized Controlled Clinical Trial',
      principalInvestigator: 'Prof. Sanjeev Sharma',
      targetParticipants: 180,
      currentEnrolled: 165,
      completedParticipants: 140,
      droppedParticipants: 5,
      startDate: new Date('2024-01-10'),
      expectedEndDate: new Date('2025-04-10'),
      status: 'Active',
      riskScore: 19,
      riskCategory: 'Low',
      complianceScore: 96,
      dataQualityScore: 97,
      safetyScore: 99,
      createdById: createdUsers[1].id,
    },
    {
      trialId: 'AYU-016',
      title: 'Saptamrita Lauha and Triphala Netra Tarpana in Mild-to-Moderate Computer Vision Syndrome (Shushkakshipaka)',
      shortDescription: 'Schirmer tear test, Tear Break-up Time (TBUT), and Ocular Surface Disease Index (OSDI) scoring in digital screen workers.',
      treatment: 'Saptamrita Lauha (500mg BID) + Weekly Triphala Ghrita Tarpana',
      ayurvedicDiscipline: 'Shalakya Tantra (Netra Roga)',
      indication: 'Dry Eye Disease / Computer Vision Syndrome',
      phase: 'Phase II',
      studyType: 'Prospective Randomized Comparative Trial',
      principalInvestigator: 'Dr. Priyadarshini Rao',
      targetParticipants: 120,
      currentEnrolled: 108,
      completedParticipants: 85,
      droppedParticipants: 3,
      startDate: new Date('2024-06-01'),
      expectedEndDate: new Date('2025-09-01'),
      status: 'Recruiting',
      riskScore: 22,
      riskCategory: 'Low',
      complianceScore: 94,
      dataQualityScore: 96,
      safetyScore: 98,
      createdById: createdUsers[0].id,
    },
    {
      trialId: 'AYU-017',
      title: 'Phyllanthus niruri (Bhumyamalaki) in Chronic Hepatitis B Surface Antigen Low-Viremic Carriers: Viral Load Reduction Trial',
      shortDescription: 'Quantitative HBV-DNA viral load logs, serum ALT normalization, and transient elastography liver stiffness measurement.',
      treatment: 'Bhumyamalaki Whole Plant Extract (600mg TID)',
      ayurvedicDiscipline: 'Yakrit Roga Chikitsa',
      indication: 'Chronic Low-Titer Hepatitis B / Kamala',
      phase: 'Phase II',
      studyType: 'Randomized Controlled Exploratory Trial',
      principalInvestigator: 'Dr. Anand Kumar',
      targetParticipants: 100,
      currentEnrolled: 54,
      completedParticipants: 28,
      droppedParticipants: 9,
      startDate: new Date('2024-03-10'),
      expectedEndDate: new Date('2025-06-10'),
      status: 'Delayed',
      riskScore: 74,
      riskCategory: 'High',
      complianceScore: 81,
      dataQualityScore: 78,
      safetyScore: 82,
      createdById: createdUsers[0].id,
    },
    {
      trialId: 'AYU-018',
      title: 'Shankhpushpi (Convolvulus pluricaulis) Syrup in Pediatric Attention Deficit Hyperactivity Disorder (ADHD)',
      shortDescription: 'Conners 3rd Edition Parent/Teacher rating scales and computerized continuous performance test (CPT) metrics.',
      treatment: 'Standardized Shankhpushpi Medhya Rasayana Syrup (10ml BID)',
      ayurvedicDiscipline: 'Kaumarbhritya (Pediatrics)',
      indication: 'Pediatric ADHD / Unmada Lakshana',
      phase: 'Phase II',
      studyType: 'Double-Blind Randomized Placebo-Controlled',
      principalInvestigator: 'Dr. Priyadarshini Rao',
      targetParticipants: 90,
      currentEnrolled: 82,
      completedParticipants: 62,
      droppedParticipants: 4,
      startDate: new Date('2024-05-01'),
      expectedEndDate: new Date('2025-08-01'),
      status: 'Active',
      riskScore: 26,
      riskCategory: 'Low',
      complianceScore: 93,
      dataQualityScore: 95,
      safetyScore: 96,
      createdById: createdUsers[1].id,
    },
    {
      trialId: 'AYU-019',
      title: 'Ayurvedic Anti-Hypertensive Formulation (Sarpagandha Ghanavati) in Stage-1 Essential Hypertension (Rakta Gata Vata)',
      shortDescription: '24-hour Ambulatory Blood Pressure Monitoring (ABPM), pulse wave velocity (PWV), and renal resistive index.',
      treatment: 'Standardized Sarpagandha Ghanavati (250mg OD-BID titrated)',
      ayurvedicDiscipline: 'Kayachikitsa / Raktavaha Srotas',
      indication: 'Essential Hypertension (Uchha Raktachapa)',
      phase: 'Phase III',
      studyType: 'Randomized Active-Controlled Non-Inferiority Study',
      principalInvestigator: 'Prof. Sanjeev Sharma',
      targetParticipants: 250,
      currentEnrolled: 232,
      completedParticipants: 190,
      droppedParticipants: 11,
      startDate: new Date('2024-01-20'),
      expectedEndDate: new Date('2025-04-20'),
      status: 'Active',
      riskScore: 25,
      riskCategory: 'Low',
      complianceScore: 95,
      dataQualityScore: 96,
      safetyScore: 94,
      createdById: createdUsers[0].id,
    },
    {
      trialId: 'AYU-020',
      title: 'Classical Nasya Karma with Anu Taila in Chronic Allergic Rhinitis (Vataja Pratishyaya): A Multicenter Randomized Trial',
      shortDescription: 'Total Nasal Symptom Score (TNSS), absolute eosinophil count (AEC), and serum total IgE response post 21-day Nasya protocol.',
      treatment: 'Anu Taila Nasya (6 drops per nostril daily morning)',
      ayurvedicDiscipline: 'Shalakya Tantra (Nasa Roga)',
      indication: 'Allergic Rhinitis (Pratishyaya)',
      phase: 'Phase III',
      studyType: 'Multicenter Randomized Controlled Trial',
      principalInvestigator: 'Dr. Anand Kumar',
      targetParticipants: 200,
      currentEnrolled: 195,
      completedParticipants: 160,
      droppedParticipants: 5,
      startDate: new Date('2024-04-15'),
      expectedEndDate: new Date('2025-07-15'),
      status: 'Active',
      riskScore: 14,
      riskCategory: 'Low',
      complianceScore: 97,
      dataQualityScore: 98,
      safetyScore: 99,
      createdById: createdUsers[0].id,
    },
    {
      trialId: 'AYU-021',
      title: 'Vasavaleha Formulation in Mild-to-Moderate Chronic Bronchial Asthma (Tamaka Shwasa): Pulmonary Function Trial',
      shortDescription: 'Spirometric FEV1/FVC ratios, Asthma Control Test (ACT) scores, and daytime rescue inhaler usage frequencies.',
      treatment: 'Vasavaleha (10g BID with warm milk)',
      ayurvedicDiscipline: 'Pranavaha Srotas Chikitsa',
      indication: 'Bronchial Asthma (Tamaka Shwasa)',
      phase: 'Phase III',
      studyType: 'Randomized Add-On Superiority Trial',
      principalInvestigator: 'Dr. Priyadarshini Rao',
      targetParticipants: 160,
      currentEnrolled: 142,
      completedParticipants: 105,
      droppedParticipants: 6,
      startDate: new Date('2024-06-01'),
      expectedEndDate: new Date('2025-09-01'),
      status: 'Recruiting',
      riskScore: 23,
      riskCategory: 'Low',
      complianceScore: 96,
      dataQualityScore: 95,
      safetyScore: 97,
      createdById: createdUsers[1].id,
    },
    {
      trialId: 'AYU-022',
      title: 'Kaishore Guggulu and Guduchi Kwatha in Acute and Chronic Hyperuricemia (Vatarakta): Uric Acid Clearance Trial',
      shortDescription: 'Serum uric acid reduction, 24h fractional excretion of uric acid, and gout flare frequency over 16 weeks.',
      treatment: 'Kaishore Guggulu (1g TID) + Guduchi Kwatha (40ml BID)',
      ayurvedicDiscipline: 'Vatarakta Chikitsa',
      indication: 'Hyperuricemia & Gouty Arthritis (Vatarakta)',
      phase: 'Phase III',
      studyType: 'Randomized Active-Comparator Study',
      principalInvestigator: 'Prof. Sanjeev Sharma',
      targetParticipants: 150,
      currentEnrolled: 138,
      completedParticipants: 110,
      droppedParticipants: 4,
      startDate: new Date('2024-03-01'),
      expectedEndDate: new Date('2025-06-01'),
      status: 'Active',
      riskScore: 17,
      riskCategory: 'Low',
      complianceScore: 98,
      dataQualityScore: 97,
      safetyScore: 98,
      createdById: createdUsers[0].id,
    },
    {
      trialId: 'AYU-023',
      title: 'Jatamansi (Nardostachys jatamansi) in Mild-to-Moderate Major Depressive Disorder (Chittodvega / Vishada)',
      shortDescription: 'Hamilton Depression Rating Scale (HAM-D), MADRS scores, and serum BDNF levels in outpatient cohort.',
      treatment: 'Standardized Jatamansi Hydroalcoholic Extract (500mg BID)',
      ayurvedicDiscipline: 'Manasa Roga',
      indication: 'Depressive Episode / Vishada',
      phase: 'Phase II',
      studyType: 'Randomized Placebo-Controlled Study',
      principalInvestigator: 'Dr. Anand Kumar',
      targetParticipants: 110,
      currentEnrolled: 88,
      completedParticipants: 50,
      droppedParticipants: 8,
      startDate: new Date('2024-07-15'),
      expectedEndDate: new Date('2025-10-15'),
      status: 'Recruiting',
      riskScore: 38,
      riskCategory: 'Medium',
      complianceScore: 90,
      dataQualityScore: 89,
      safetyScore: 94,
      createdById: createdUsers[0].id,
    },
    {
      trialId: 'AYU-024',
      title: 'Panchavalkala Kwatha Topical Douche in Recurrent Non-Specific Vulvovaginitis (Kaphaja Yonivyapat)',
      shortDescription: 'Vaginal pH normalization, Nugent scoring for bacterial balance, and microbiological resolution rates.',
      treatment: 'Panchavalkala Kwatha Local Prakshalana (Twice daily)',
      ayurvedicDiscipline: 'Prasuti & Stri Roga',
      indication: 'Recurrent Vaginitis / Kaphaja Yonivyapat',
      phase: 'Phase III',
      studyType: 'Multicenter Comparative Clinical Trial',
      principalInvestigator: 'Dr. Priyadarshini Rao',
      targetParticipants: 140,
      currentEnrolled: 135,
      completedParticipants: 120,
      droppedParticipants: 3,
      startDate: new Date('2024-02-01'),
      expectedEndDate: new Date('2025-05-01'),
      status: 'Active',
      riskScore: 15,
      riskCategory: 'Low',
      complianceScore: 99,
      dataQualityScore: 98,
      safetyScore: 99,
      createdById: createdUsers[1].id,
    },
    {
      trialId: 'AYU-025',
      title: 'Kanchanara Guggulu and Varuna Kashaya in Euthyroid Simple Benign Thyroid Nodules (Galaganda): Volumetric Ultrasound Trial',
      shortDescription: 'Serial high-resolution thyroid ultrasound volume tracking (mL) and fine-needle biopsy surveillance over 6 months.',
      treatment: 'Kanchanara Guggulu (1g TID) + Varuna Kashaya (30ml BID)',
      ayurvedicDiscipline: 'Galaganda Chikitsa / Shalya Tantra',
      indication: 'Benign Thyroid Nodules (Galaganda)',
      phase: 'Phase II',
      studyType: 'Prospective Single-Arm Observational Trial',
      principalInvestigator: 'Prof. Sanjeev Sharma',
      targetParticipants: 80,
      currentEnrolled: 74,
      completedParticipants: 55,
      droppedParticipants: 2,
      startDate: new Date('2024-05-01'),
      expectedEndDate: new Date('2025-08-01'),
      status: 'Active',
      riskScore: 21,
      riskCategory: 'Low',
      complianceScore: 96,
      dataQualityScore: 95,
      safetyScore: 97,
      createdById: createdUsers[0].id,
    },
  ];

  const createdTrials = [];
  for (const t of trialsData) {
    const trial = await prisma.trial.create({ data: t });
    createdTrials.push(trial);
  }
  console.log(`✅ Created ${createdTrials.length} clinical trials.`);

  // 4. Seed Milestones for Trials
  const milestoneStages = [
    { title: 'Scientific Protocol Approval', stage: 'Protocol', seq: 1 },
    { title: 'Institutional Ethics Committee Clearance', stage: 'Ethics Approval', seq: 2 },
    { title: 'CTRI Mandatory Registration & Verification', stage: 'CTRI Registration', seq: 3 },
    { title: 'Multi-Site Initiation & Activation', stage: 'Site Activation', seq: 4 },
    { title: 'Patient Recruitment & Screening Phase', stage: 'Patient Recruitment', seq: 5 },
    { title: 'Intervention / Treatment Administration', stage: 'Treatment', seq: 6 },
    { title: 'Clinical Data Collection & Monitoring', stage: 'Data Collection', seq: 7 },
    { title: 'Biostatistical & Metagenomic Analysis', stage: 'Analysis', seq: 8 },
    { title: 'Trial Closeout & Final Clinical Study Report (CSR)', stage: 'Closeout', seq: 9 },
  ];

  for (const trial of createdTrials) {
    for (const [idx, m] of milestoneStages.entries()) {
      let status = 'PENDING';
      let completedDate = null;

      if (trial.status === 'Completed') {
        status = 'COMPLETED';
        completedDate = new Date(trial.startDate.getTime() + idx * 30 * 24 * 60 * 60 * 1000);
      } else if (trial.status === 'Delayed') {
        if (idx <= 3) {
          status = 'COMPLETED';
          completedDate = new Date(trial.startDate.getTime() + idx * 25 * 24 * 60 * 60 * 1000);
        } else if (idx === 4) {
          status = 'DELAYED';
        } else {
          status = 'PENDING';
        }
      } else if (trial.status === 'Recruiting') {
        if (idx <= 3) {
          status = 'COMPLETED';
          completedDate = new Date(trial.startDate.getTime() + idx * 20 * 24 * 60 * 60 * 1000);
        } else if (idx === 4) {
          status = 'ACTIVE';
        } else {
          status = 'PENDING';
        }
      } else {
        // Active
        if (idx <= 4) {
          status = 'COMPLETED';
          completedDate = new Date(trial.startDate.getTime() + idx * 25 * 24 * 60 * 60 * 1000);
        } else if (idx === 5) {
          status = 'ACTIVE';
        } else {
          status = 'PENDING';
        }
      }

      await prisma.trialMilestone.create({
        data: {
          trialId: trial.id,
          title: m.title,
          stage: m.stage,
          sequence: m.seq,
          status: status,
          plannedDate: new Date(trial.startDate.getTime() + idx * 35 * 24 * 60 * 60 * 1000),
          completedDate: completedDate,
          notes: status === 'DELAYED' ? 'Delayed due to site initiation bottleneck and recruitment pace.' : null,
        },
      });
    }
  }
  console.log('✅ Created trial milestones.');

  // 5. Seed Trial Sites mapping
  for (const trial of createdTrials) {
    // Assign 2 to 4 sites per trial
    const numSites = trial.targetParticipants > 200 ? 4 : 2;
    const assignedSites = createdSites.slice(0, numSites);

    for (const site of assignedSites) {
      const targetPerSite = Math.round(trial.targetParticipants / numSites);
      const currentEnrollment = Math.min(
        targetPerSite,
        Math.round((trial.currentEnrolled * (site.recruitmentRate / 100)) / (assignedSites.reduce((a, b) => a + b.recruitmentRate, 0) / 100))
      );

      await prisma.trialSite.create({
        data: {
          trialId: trial.id,
          siteId: site.id,
          targetEnrollment: targetPerSite,
          currentEnrollment: Math.max(10, currentEnrollment),
          sitePi: site.principalInvestigator,
          status: 'Active',
          activationDate: new Date(trial.startDate.getTime() + 15 * 24 * 60 * 60 * 1000),
        },
      });
    }
  }
  console.log('✅ Mapped research sites to trials.');

  // 6. Seed 500+ Synthetic Patient Records
  const doshaList = ['Vata', 'Pitta', 'Kapha', 'Vata-Pitta', 'Pitta-Kapha', 'Vata-Kapha', 'Tridoshic'];
  const patientStatuses = ['Completed', 'On-Treatment', 'Follow-Up', 'Dropped', 'Enrolled'];
  let patientCount = 0;
  let demoPatientRecord = null;

  for (const [tIdx, trial] of createdTrials.slice(0, 10).entries()) {
    const trialSites = await prisma.trialSite.findMany({ where: { trialId: trial.id } });
    const countToGenerate = Math.min(trial.currentEnrolled, 60);

    for (let i = 1; i <= countToGenerate; i++) {
      const site = trialSites[i % trialSites.length];
      const age = tIdx === 0 && i === 1 ? 28 : (22 + Math.floor(Math.random() * 48));
      const gender = tIdx === 0 && i === 1 ? 'Female' : (i % 2 === 0 ? 'Female' : 'Male');
      const dosha = tIdx === 0 && i === 1 ? 'Vata-Pitta' : doshaList[i % doshaList.length];
      const status = tIdx === 0 && i === 1 ? 'Enrolled' : (trial.status === 'Completed' ? 'Completed' : patientStatuses[i % patientStatuses.length]);
      const hasAdverse = i === 7 || i === 23; // synthetic adverse event flag

      const isDemoPatient = tIdx === 0 && i === 1;
      const patientCode = isDemoPatient ? 'SYNTH-DEL-1001' : `SYNTH-${trial.trialId}-${String(i).padStart(4, '0')}`;

      const createdPat = await prisma.patient.create({
        data: {
          syntheticPatientId: patientCode,
          trialId: trial.id,
          siteId: site.siteId,
          userId: isDemoPatient && patientUser ? patientUser.id : null,
          age: age,
          gender: gender,
          doshaPrakriti: dosha,
          phone: isDemoPatient ? '+91-98112-44556' : `+91-98${Math.floor(10000000 + Math.random() * 90000000)}`,
          emergencyContact: isDemoPatient ? '+91-98112-99887 (Rohit Sharma - Spouse)' : '+91-98000-00000',
          address: isDemoPatient ? 'Flat 402, Lotus Greens, Sarita Vihar, New Delhi' : 'New Delhi, India',
          adherenceRate: isDemoPatient ? 88 : Math.floor(75 + Math.random() * 24),
          enrollmentDate: new Date('2026-06-12'),
          status: status,
          hasAdverseEvent: hasAdverse,
          dataCompleteness: status === 'Dropped' ? 70 : 100,
        },
      });

      if (isDemoPatient) {
        demoPatientRecord = createdPat;
      }
      patientCount++;
    }
  }
  console.log(`✅ Seeded ${patientCount} synthetic de-identified patient profiles.`);

  // 6b. Seed Dedicated Patient Portal Records for Demo Patient (SYNTH-DEL-1001)
  if (demoPatientRecord) {
    // 1. Patient Visits Timeline (4 Completed, 1 Upcoming, 2 Scheduled)
    const visitsData = [
      {
        patientId: demoPatientRecord.id,
        visitNumber: 1,
        title: 'Screening & Consent Visit',
        visitType: 'In-Person Clinical Exam',
        scheduledDate: new Date('2026-06-12T09:30:00Z'),
        scheduledTime: '09:30 AM',
        location: 'AIIA Main Campus, New Delhi - OPD Room 204',
        doctorName: 'Dr. Anand Kumar (PI)',
        status: 'COMPLETED',
        completedDate: new Date('2026-06-12T11:00:00Z'),
        summaryNotes: 'Informed consent signed. Preliminary Prakriti assessment (Vata-Pitta) confirmed. Inclusion criteria verified.',
      },
      {
        patientId: demoPatientRecord.id,
        visitNumber: 2,
        title: 'Baseline Biomarker Assessment',
        visitType: 'Laboratory & ECG Evaluation',
        scheduledDate: new Date('2026-06-20T10:00:00Z'),
        scheduledTime: '10:00 AM',
        location: 'AIIA Central Diagnostic Wing - Room 108',
        doctorName: 'Dr. Anand Kumar (PI)',
        status: 'COMPLETED',
        completedDate: new Date('2026-06-20T11:30:00Z'),
        summaryNotes: 'Fasting serum cortisol & lipid profile drawn. Baseline PSS-10 score (24/40) recorded. Study drug WS-35 issued.',
      },
      {
        patientId: demoPatientRecord.id,
        visitNumber: 3,
        title: 'Week 4 Progress Evaluation',
        visitType: 'Clinical Follow-up & Vitals',
        scheduledDate: new Date('2026-07-20T10:30:00Z'),
        scheduledTime: '10:30 AM',
        location: 'AIIA Main Campus, New Delhi - OPD Room 204',
        doctorName: 'Dr. Anand Kumar (PI)',
        status: 'COMPLETED',
        completedDate: new Date('2026-07-20T11:15:00Z'),
        summaryNotes: 'Medication adherence at 92%. Sleep latency improved. No gastrointestinal complaints reported.',
      },
      {
        patientId: demoPatientRecord.id,
        visitNumber: 4,
        title: 'Mid-Study Safety Review',
        visitType: 'Clinical Follow-up & Lab',
        scheduledDate: new Date('2026-08-18T10:30:00Z'),
        scheduledTime: '10:30 AM',
        location: 'AIIA Main Campus, New Delhi - OPD Room 204',
        doctorName: 'Dr. Anand Kumar (PI)',
        status: 'COMPLETED',
        completedDate: new Date('2026-08-18T11:45:00Z'),
        summaryNotes: 'Liver & renal function tests within normal limits. Study medication bottle re-issued (Batch WS-35-B2).',
      },
      {
        patientId: demoPatientRecord.id,
        visitNumber: 5,
        title: 'Week 12 Clinical Assessment',
        visitType: 'Comprehensive Follow-up & Lab',
        scheduledDate: new Date('2026-09-24T10:30:00Z'),
        scheduledTime: '10:30 AM',
        location: 'AIIA Main Campus, New Delhi - OPD Room 204',
        doctorName: 'Dr. Anand Kumar (PI)',
        status: 'UPCOMING',
        instructions: 'Please arrive 15 minutes prior to appointment. Bring your current study medication container for pill reconciliation. 8-hour fasting recommended for serum lipid profiling.',
      },
      {
        patientId: demoPatientRecord.id,
        visitNumber: 6,
        title: 'Week 16 Follow-up Exam',
        visitType: 'Clinical Follow-up',
        scheduledDate: new Date('2026-10-22T11:00:00Z'),
        scheduledTime: '11:00 AM',
        location: 'AIIA Main Campus, New Delhi - OPD Room 204',
        doctorName: 'Dr. Anand Kumar (PI)',
        status: 'SCHEDULED',
        instructions: 'Routine vital check and questionnaire review.',
      },
      {
        patientId: demoPatientRecord.id,
        visitNumber: 7,
        title: 'Study Completion & Closeout',
        visitType: 'Final Closeout & Debrief',
        scheduledDate: new Date('2026-11-20T10:00:00Z'),
        scheduledTime: '10:00 AM',
        location: 'AIIA Main Campus, New Delhi - OPD Room 204',
        doctorName: 'Dr. Anand Kumar (PI)',
        status: 'SCHEDULED',
        instructions: 'Final health assessment, exit survey, and study debriefing.',
      },
    ];

    for (const v of visitsData) {
      await prisma.patientVisit.create({ data: v });
    }
    console.log(`✅ Seeded ${visitsData.length} visits for demo patient.`);

    // 2. Patient Questionnaires
    const questionnairesData = [
      {
        patientId: demoPatientRecord.id,
        title: 'Perceived Stress Scale (PSS-10)',
        category: 'Stress & Mental Health',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        status: 'PENDING',
        questionsJson: JSON.stringify([
          { id: 'q1', text: 'In the last month, how often have you been upset because of something that happened unexpectedly?', type: 'scale_0_4', options: ['Never', 'Almost Never', 'Sometimes', 'Fairly Often', 'Very Often'] },
          { id: 'q2', text: 'In the last month, how often have you felt that you were unable to control the important things in your life?', type: 'scale_0_4', options: ['Never', 'Almost Never', 'Sometimes', 'Fairly Often', 'Very Often'] },
          { id: 'q3', text: 'In the last month, how often have you felt nervous and stressed?', type: 'scale_0_4', options: ['Never', 'Almost Never', 'Sometimes', 'Fairly Often', 'Very Often'] },
          { id: 'q4', text: 'In the last month, how often have you felt confident about your ability to handle your personal problems?', type: 'scale_0_4', options: ['Never', 'Almost Never', 'Sometimes', 'Fairly Often', 'Very Often'] },
          { id: 'q5', text: 'In the last month, how often have you felt that things were going your way?', type: 'scale_0_4', options: ['Never', 'Almost Never', 'Sometimes', 'Fairly Often', 'Very Often'] },
          { id: 'q6', text: 'In the last month, how often have you found that you could not cope with all the things that you had to do?', type: 'scale_0_4', options: ['Never', 'Almost Never', 'Sometimes', 'Fairly Often', 'Very Often'] },
          { id: 'q7', text: 'In the last month, how often have you been able to control irritations in your life?', type: 'scale_0_4', options: ['Never', 'Almost Never', 'Sometimes', 'Fairly Often', 'Very Often'] },
          { id: 'q8', text: 'In the last month, how often have you felt that you were on top of things?', type: 'scale_0_4', options: ['Never', 'Almost Never', 'Sometimes', 'Fairly Often', 'Very Often'] },
          { id: 'q9', text: 'In the last month, how often have you been angered because of things that were outside of your control?', type: 'scale_0_4', options: ['Never', 'Almost Never', 'Sometimes', 'Fairly Often', 'Very Often'] },
          { id: 'q10', text: 'In the last month, how often have you felt difficulties were piling up so high that you could not overcome them?', type: 'scale_0_4', options: ['Never', 'Almost Never', 'Sometimes', 'Fairly Often', 'Very Often'] },
        ]),
      },
      {
        patientId: demoPatientRecord.id,
        title: 'Ayurvedic Agni & Sleep Quality Index',
        category: 'Digestion & Sleep Health',
        dueDate: new Date('2026-08-15'),
        completedAt: new Date('2026-08-14T18:30:00Z'),
        status: 'COMPLETED',
        score: 18,
        questionsJson: JSON.stringify([
          { id: 'q1', text: 'How would you rate your digestive fire (Agni) and appetite over the past 2 weeks?', type: 'scale_1_5', options: ['Very Poor (Manda)', 'Irregular (Vishama)', 'Moderate (Madhyama)', 'Good (Sama)', 'Excessive (Tikshna)'] },
          { id: 'q2', text: 'How many hours of uninterrupted sleep do you typically get per night?', type: 'multiple_choice', options: ['Under 5 hours', '5-6 hours', '6-7 hours', '7-8 hours', 'More than 8 hours'] },
          { id: 'q3', text: 'Do you feel rested and rejuvenated upon waking in the morning (Pratah)?', type: 'yes_no', options: ['Yes', 'No'] },
        ]),
        answersJson: JSON.stringify({ q1: 'Good (Sama)', q2: '7-8 hours', q3: 'Yes' }),
        feedbackNotes: 'Satisfactory digestive rhythm and improved sleep quality reported.',
      },
      {
        patientId: demoPatientRecord.id,
        title: 'Baseline Quality of Life Questionnaire (WHO-QOL)',
        category: 'General Wellbeing',
        dueDate: new Date('2026-06-20'),
        completedAt: new Date('2026-06-20T10:00:00Z'),
        status: 'COMPLETED',
        score: 82,
        questionsJson: JSON.stringify([
          { id: 'q1', text: 'How would you rate your overall quality of life at baseline?', type: 'scale_1_5', options: ['Very Poor', 'Poor', 'Neither Poor nor Good', 'Good', 'Very Good'] },
          { id: 'q2', text: 'How satisfied are you with your daily physical energy levels?', type: 'scale_1_5', options: ['Very Dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Very Satisfied'] },
        ]),
        answersJson: JSON.stringify({ q1: 'Good', q2: 'Satisfied' }),
        feedbackNotes: 'Baseline quality of life record logged for comparison against primary endpoints.',
      },
    ];

    for (const q of questionnairesData) {
      await prisma.patientQuestionnaire.create({ data: q });
    }
    console.log(`✅ Seeded ${questionnairesData.length} questionnaires for demo patient.`);

    // 3. Patient Adherence Logs (Past 14 days)
    for (let day = 14; day >= 1; day--) {
      const date = new Date(Date.now() - day * 24 * 60 * 60 * 1000);
      const isMissed = day === 6;
      await prisma.patientAdherenceLog.create({
        data: {
          patientId: demoPatientRecord.id,
          date: date,
          status: isMissed ? 'MISSED' : 'TAKEN',
          doseTime: 'Morning (Pratah) - 08:30 AM',
          notes: isMissed ? 'Forgot morning dose due to out-of-town travel' : 'Taken with warm water post-breakfast',
        },
      });
    }
    console.log('✅ Seeded 14 daily medication adherence logs.');

    // 4. Patient Documents & Consent
    const docsData = [
      {
        patientId: demoPatientRecord.id,
        title: 'Informed Consent Form (ICF v2.1 - IEC Approved)',
        type: 'CONSENT',
        consentStatus: 'ACTIVE',
        consentDate: new Date('2026-06-12'),
      },
      {
        patientId: demoPatientRecord.id,
        title: 'Participant Information Sheet (PIS)',
        type: 'INFORMATION_SHEET',
        consentStatus: 'ACTIVE',
        consentDate: new Date('2026-06-12'),
      },
      {
        patientId: demoPatientRecord.id,
        title: 'Ayurvedic Pathya-Apathya Dietary Guidance Chart',
        type: 'DIET_CHART',
        consentStatus: 'ACTIVE',
        consentDate: new Date('2026-06-12'),
      },
      {
        patientId: demoPatientRecord.id,
        title: 'Study Visit Schedule & Fasting Guidelines',
        type: 'PROTOCOL_GUIDE',
        consentStatus: 'ACTIVE',
        consentDate: new Date('2026-06-12'),
      },
    ];

    for (const d of docsData) {
      await prisma.patientDocument.create({ data: d });
    }
    console.log(`✅ Seeded ${docsData.length} participant documents.`);

    // 5. Patient Study Team Messages
    const messagesData = [
      {
        patientId: demoPatientRecord.id,
        senderRole: 'STUDY_TEAM',
        senderName: 'Dr. Anand Kumar (Principal Investigator)',
        subject: 'Welcome to AYU-001 Study Protocol',
        message: 'Dear Aditi, welcome to the clinical trial at AIIA New Delhi. Your assigned research coordinator is Dr. Sharma. Please feel free to message us through this secure portal with any questions regarding your scheduled visits or study instructions.',
        isRead: true,
        createdAt: new Date('2026-06-13T10:00:00Z'),
      },
      {
        patientId: demoPatientRecord.id,
        senderRole: 'PATIENT',
        senderName: 'Aditi Sharma',
        subject: 'Re: Welcome to AYU-001 Study Protocol',
        message: 'Thank you Dr. Kumar. I have received the morning dosage container and completed my baseline evaluation.',
        isRead: true,
        createdAt: new Date('2026-06-14T14:20:00Z'),
      },
      {
        patientId: demoPatientRecord.id,
        senderRole: 'STUDY_TEAM',
        senderName: 'Dr. Anand Kumar (Principal Investigator)',
        subject: 'Reminder: Week 12 Visit Preparation',
        message: 'Hello Aditi, just a quick reminder for your upcoming Visit 5 on Sept 24th at 10:30 AM. Remember to fast for 8 hours before your morning blood draw and bring your current medication bottle for the pill reconciliation count.',
        isRead: false,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
    ];

    for (const m of messagesData) {
      await prisma.patientStudyMessage.create({ data: m });
    }
    console.log(`✅ Seeded ${messagesData.length} study team messages.`);

    // 6. Patient Notifications
    if (patientUser) {
      await prisma.notification.createMany({
        data: [
          {
            userId: patientUser.id,
            title: '📅 Upcoming Study Visit',
            message: 'Your Week 12 Clinical Assessment is scheduled for Sept 24th at 10:30 AM.',
            type: 'info',
            isRead: false,
            link: '/patient/visits',
          },
          {
            userId: patientUser.id,
            title: '📋 Pending Questionnaire',
            message: 'Your Perceived Stress Scale (PSS-10) questionnaire is due in 2 days.',
            type: 'warning',
            isRead: false,
            link: '/patient/questionnaires',
          },
          {
            userId: patientUser.id,
            title: '💬 New Message from Study Team',
            message: 'Dr. Anand Kumar sent a message regarding your upcoming visit instructions.',
            type: 'info',
            isRead: false,
            link: '/patient/study-team',
          },
          {
            userId: patientUser.id,
            title: '🛡️ Safety Status Confirmed',
            message: 'Mid-study liver and renal safety profiles verified normal by safety coordinator.',
            type: 'success',
            isRead: true,
            link: '/patient/safety',
          },
        ],
      });
      console.log('✅ Seeded patient-specific notifications.');
    }
  }

  // 7. Seed Recruitment Velocity Records
  const months = ['2024-05', '2024-06', '2024-07', '2024-08', '2024-09', '2024-10', '2024-11', '2024-12', '2025-01'];
  for (const trial of createdTrials.slice(0, 6)) {
    for (const [idx, m] of months.entries()) {
      const planned = 15 + idx * 5;
      const actual = trial.status === 'Delayed' ? Math.max(5, planned - 12) : planned + Math.floor(Math.random() * 6 - 2);

      await prisma.recruitmentRecord.create({
        data: {
          trialId: trial.id,
          siteId: createdSites[idx % createdSites.length].id,
          monthYear: m,
          plannedCount: planned,
          actualCount: actual,
          targetVelocity: Number((actual / planned).toFixed(2)),
          recordedAt: new Date(`2024-${String(idx + 1).padStart(2, '0')}-28`),
        },
      });
    }
  }
  console.log('✅ Seeded recruitment velocity trends.');

  // 8. Seed 30+ Pharmacovigilance Safety Events
  const safetyEventsData = [
    {
      eventCode: 'SAE-2025-001',
      trialId: createdTrials[1].id, // AYU-002
      syntheticPatientId: 'SYNTH-AYU-002-0007',
      eventType: 'Acute Dyspepsia & Epigastric Burning',
      severity: 'Moderate',
      description: 'Participant reported moderate epigastric burning 45 mins post ingestion of BCM-95 capsule on empty stomach.',
      onsetDate: new Date('2024-10-12'),
      reportedDate: new Date('2024-10-13'),
      status: 'Under Review',
      outcome: 'Resolving',
      causalityAssessment: 'Probable',
      reporterName: 'Dr. Anand Kumar (PI)',
      correctiveAction: 'Advised post-prandial administration with lukewarm water.',
    },
    {
      eventCode: 'SAE-2025-002',
      trialId: createdTrials[1].id, // AYU-002
      syntheticPatientId: 'SYNTH-AYU-002-0023',
      eventType: 'Transient Transaminase Elevation (ALT > 2.5x ULN)',
      severity: 'Serious',
      description: 'Routine safety blood draw revealed elevated serum ALT (118 IU/L) and AST (94 IU/L) at Week 8 visit. No clinical jaundice.',
      onsetDate: new Date('2024-11-05'),
      reportedDate: new Date('2024-11-06'),
      status: 'Investigating',
      outcome: 'Ongoing',
      causalityAssessment: 'Possible',
      reporterName: 'Dr. Priyadarshini Rao (Safety Officer)',
      correctiveAction: 'Dose temporarily paused, weekly liver function monitoring initiated, ultrasound abdomen ordered.',
    },
    {
      eventCode: 'SAE-2025-003',
      trialId: createdTrials[3].id, // AYU-004
      syntheticPatientId: 'SYNTH-AYU-004-0012',
      eventType: 'Mild Dizziness and Postural Hypotension',
      severity: 'Mild',
      description: 'Transient lightheadedness reported during morning routine following dose escalation.',
      onsetDate: new Date('2024-11-18'),
      reportedDate: new Date('2024-11-19'),
      status: 'Resolved',
      outcome: 'Recovered',
      causalityAssessment: 'Unlikely',
      reporterName: 'Dr. Anand Kumar',
      correctiveAction: 'Hydration counseling provided.',
      resolutionDate: new Date('2024-11-21'),
    },
    {
      eventCode: 'SAE-2025-004',
      trialId: createdTrials[3].id, // AYU-004
      syntheticPatientId: 'SYNTH-AYU-004-0019',
      eventType: 'Papular Skin Rash with Pruritus',
      severity: 'Moderate',
      description: 'Erythematous papular eruption noted on forearms within 4 days of initiating trial drug.',
      onsetDate: new Date('2024-12-02'),
      reportedDate: new Date('2024-12-03'),
      status: 'Under Review',
      outcome: 'Resolving',
      causalityAssessment: 'Probable',
      reporterName: 'Dr. Priyadarshini Rao',
      correctiveAction: 'Topical Shatadhauta Ghrita applied, oral antihistamine rescue provided.',
    },
    {
      eventCode: 'SAE-2025-005',
      trialId: createdTrials[12].id, // AYU-013 Guggulu
      syntheticPatientId: 'SYNTH-AYU-013-0008',
      eventType: 'Moderate Diarrhea and Abdominal Cramping',
      severity: 'Moderate',
      description: 'Frequent loose stools (4-5 episodes/day) with lower abdominal cramping.',
      onsetDate: new Date('2024-10-20'),
      reportedDate: new Date('2024-10-21'),
      status: 'Resolved',
      outcome: 'Recovered',
      causalityAssessment: 'Probable',
      reporterName: 'Prof. Sanjeev Sharma',
      correctiveAction: 'Kutajarishta administered, dose adjusted.',
      resolutionDate: new Date('2024-10-25'),
    },
    {
      eventCode: 'SAE-2025-006',
      trialId: createdTrials[0].id, // AYU-001
      syntheticPatientId: 'SYNTH-AYU-001-0015',
      eventType: 'Mild Morning Drowsiness',
      severity: 'Mild',
      description: 'Subject noted mild morning grogginess during initial 3 days of Ashwagandha extract regimen.',
      onsetDate: new Date('2024-08-14'),
      reportedDate: new Date('2024-08-15'),
      status: 'Resolved',
      outcome: 'Recovered',
      causalityAssessment: 'Possible',
      reporterName: 'Dr. Anand Kumar',
      correctiveAction: 'Advised taking medication 1 hour earlier in evening.',
      resolutionDate: new Date('2024-08-18'),
    },
    {
      eventCode: 'SAE-2025-007',
      trialId: createdTrials[2].id, // AYU-003
      syntheticPatientId: 'SYNTH-AYU-003-0011',
      eventType: 'Mild Constipation (Vibandha)',
      severity: 'Mild',
      description: 'Hard stools reported after 2 weeks of high-dose Guduchi extract administration.',
      onsetDate: new Date('2024-09-02'),
      reportedDate: new Date('2024-09-03'),
      status: 'Resolved',
      outcome: 'Recovered',
      causalityAssessment: 'Probable',
      reporterName: 'Dr. Priyadarshini Rao',
      correctiveAction: 'Advised warm water intake with soaked Munakka.',
      resolutionDate: new Date('2024-09-07'),
    },
  ];

  // Add more synthetic events to reach 30+
  for (let k = 8; k <= 32; k++) {
    const trial = createdTrials[k % createdTrials.length];
    const severities = ['Mild', 'Mild', 'Moderate', 'Severe'];
    const types = [
      'Transient Nausea',
      'Mild Headache',
      'Bitter Aftertaste in Mouth',
      'Mild Gastric Distension',
      'Mild Diaphoresis',
      'Slight Palpitation',
      'Dryness of Throat',
    ];
    const sev = severities[k % severities.length];
    const isResolved = k % 3 !== 0;

    safetyEventsData.push({
      eventCode: `SAE-2025-${String(k).padStart(3, '0')}`,
      trialId: trial.id,
      syntheticPatientId: `SYNTH-${trial.trialId}-${String(k * 2).padStart(4, '0')}`,
      eventType: types[k % types.length],
      severity: sev,
      description: `Synthetic adverse event report recorded during routine scheduled follow-up visit. Type: ${types[k % types.length]}.`,
      onsetDate: new Date(Date.now() - (35 - k) * 3 * 24 * 60 * 60 * 1000),
      reportedDate: new Date(Date.now() - (35 - k) * 3 * 24 * 60 * 60 * 1000 + 86400000),
      status: isResolved ? 'Resolved' : 'Under Review',
      outcome: isResolved ? 'Recovered' : 'Ongoing',
      causalityAssessment: k % 2 === 0 ? 'Possible' : 'Unlikely',
      reporterName: 'Site Clinical Investigator',
      correctiveAction: isResolved ? 'Symptomatic Ayurvedic relief provided.' : 'Under evaluation by safety coordinator.',
      resolutionDate: isResolved ? new Date() : null,
    });
  }

  for (const s of safetyEventsData) {
    await prisma.safetyEvent.create({ data: s });
  }
  console.log(`✅ Seeded ${safetyEventsData.length} pharmacovigilance safety events.`);

  // 9. Seed Ethics Approvals & CTRI Registrations
  for (const trial of createdTrials) {
    // Ethics Approval
    let ethicsExpiry = new Date(trial.startDate.getTime() + 365 * 24 * 60 * 60 * 1000);
    let ethicsStatus = 'Approved';

    if (trial.trialId === 'AYU-005') {
      // Intentionally expiring in 5 days for the hackathon alert scenario
      ethicsExpiry = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
      ethicsStatus = 'Expiring_Soon';
    }

    await prisma.ethicsApproval.create({
      data: {
        trialId: trial.id,
        committeeName: 'Institutional Ethics Committee - All India Institute of Ayurveda (IEC-AIIA)',
        protocolNumber: `IEC/AIIA/2024/${trial.trialId}`,
        approvalDate: new Date(trial.startDate.getTime() - 30 * 24 * 60 * 60 * 1000),
        expiryDate: ethicsExpiry,
        status: ethicsStatus,
        renewalRequested: trial.trialId === 'AYU-005',
        documentRef: `IEC-CERT-${trial.trialId}-V2`,
      },
    });

    // CTRI Registration
    let ctriNextDue = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000);
    let ctriStatus = 'Compliant';

    if (trial.trialId === 'AYU-003') {
      // Intentionally due soon for alert demo
      ctriNextDue = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000);
      ctriStatus = 'Update_Due';
    }

    await prisma.cTRIRegistration.create({
      data: {
        trialId: trial.id,
        ctriNumber: `CTRI/2024/09/${Math.floor(100000 + Math.random() * 900000)}`,
        registrationDate: new Date(trial.startDate.getTime() - 15 * 24 * 60 * 60 * 1000),
        lastUpdatedDate: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
        nextUpdateDue: ctriNextDue,
        status: ctriStatus,
        url: `https://ctri.nic.in/Clinicaltrials/pmaindet2.php?trialid=${trial.trialId}`,
      },
    });

    // Compliance Checkpoints
    await prisma.complianceRecord.createMany({
      data: [
        {
          trialId: trial.id,
          type: 'GCP',
          itemTitle: 'Good Clinical Practice (GCP) Investigator Binder Audit',
          status: 'Compliant',
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          score: 98,
          notes: 'All source documentation and consent forms verified in order.',
        },
        {
          trialId: trial.id,
          type: 'Safety_Reporting',
          itemTitle: 'Quarterly DSMB Pharmacovigilance Interim Dossier',
          status: trial.trialId === 'AYU-002' ? 'Pending_Action' : 'Compliant',
          dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
          score: trial.trialId === 'AYU-002' ? 75 : 95,
          notes: trial.trialId === 'AYU-002' ? 'Pending evaluation of ALT elevation case SAE-2025-002.' : 'DSMB clearance obtained.',
        },
        {
          trialId: trial.id,
          type: 'Data_Validation',
          itemTitle: 'Electronic Data Capture (EDC) Source Data Verification (SDV)',
          status: trial.trialId === 'AYU-004' ? 'Under_Review' : 'Compliant',
          dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
          score: trial.trialId === 'AYU-004' ? 78 : 96,
          notes: 'eCRF data validation queries generated for missing lab telemetry.',
        },
      ],
    });
  }
  console.log('✅ Seeded Ethics, CTRI, and Compliance audit records.');

  // 10. Seed System Alerts
  const alertsData = [
    {
      trialId: createdTrials[1].id, // AYU-002
      type: 'Recruitment',
      severity: 'High',
      message: 'AYU-002 recruitment is significantly behind schedule (56% vs 85% target velocity).',
      details: 'Patient recruitment at Jaipur (74%) and Mumbai (61%) sites is below statistical power quota. 132 participants remaining with only 3 months remaining.',
      isResolved: false,
    },
    {
      trialId: createdTrials[4].id, // AYU-005
      type: 'Ethics',
      severity: 'Warning',
      message: 'AYU-005 IEC Ethics Approval expires in 5 days.',
      details: 'Institutional Ethics Committee approval expires on ' + new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString() + '. Renewal submission dossier is under review.',
      isResolved: false,
    },
    {
      trialId: createdTrials[2].id, // AYU-003
      type: 'CTRI',
      severity: 'Attention',
      message: 'AYU-003 CTRI 6-month progress update is due in 4 days.',
      details: 'Mandatory clinical trial registry update for participant recruitment numbers must be uploaded to CTRI portal.',
      isResolved: false,
    },
    {
      trialId: createdTrials[1].id, // AYU-002
      type: 'Safety',
      severity: 'High',
      message: 'Serious Adverse Event logged on AYU-002 (SAE-2025-002: ALT Elevation >2.5x ULN).',
      details: 'Safety Officer and DSMB notification required within 24 hours under GCP pharmacovigilance rules.',
      isResolved: false,
    },
    {
      trialId: createdTrials[3].id, // AYU-004
      type: 'Data_Quality',
      severity: 'Warning',
      message: 'AYU-004 data completeness dropped to 75% across remote monitoring nodes.',
      details: 'Discrepancies identified in peripheral mitochondrial biomarker eCRF entries from Lucknow site.',
      isResolved: false,
    },
    {
      trialId: createdTrials[12].id, // AYU-013
      type: 'Milestone',
      severity: 'High',
      message: 'AYU-013 trial is currently Suspended pending protocol amendment review.',
      details: 'Recruitment paused following DSMB recommendation for dose reformulation.',
      isResolved: false,
    },
  ];

  for (const a of alertsData) {
    await prisma.alert.create({ data: a });
  }
  console.log(`✅ Seeded ${alertsData.length} system alerts.`);

  // 11. Seed Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: createdUsers[0].id,
        title: '🔴 Critical Risk Trial Alert',
        message: 'Trial AYU-002 risk score escalated to 82 (Critical) due to recruitment deficit.',
        type: 'danger',
        isRead: false,
        link: '/trials/AYU-002',
      },
      {
        userId: createdUsers[0].id,
        title: '🟠 Ethics Expiry Approaching',
        message: 'AYU-005 IEC approval expiring in 5 days. Action required.',
        type: 'warning',
        isRead: false,
        link: '/compliance',
      },
      {
        userId: createdUsers[0].id,
        title: '🟢 Trial AYU-007 Completed',
        message: 'AYUSH-64 multicenter registry has achieved full closeout and CSR lock.',
        type: 'success',
        isRead: true,
        link: '/trials/AYU-007',
      },
      {
        userId: createdUsers[0].id,
        title: '🤖 AI Copilot Analysis Ready',
        message: 'Automated AI Risk Diagnosis generated for portfolio review.',
        type: 'info',
        isRead: false,
        link: '/ai-copilot',
      },
    ],
  });
  console.log('✅ Seeded notification records.');

  console.log('🌟 AIIA Clinical Trial Hub Synthetic Database Seeding Completed Successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
