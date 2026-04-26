// Shared mock data for TrustKYC prototype
window.TK_DATA = (() => {
  const today = new Date('2026-04-18');
  const daysAgo = (n) => {
    const d = new Date(today);
    d.setDate(d.getDate() - n);
    return d.toISOString().slice(0, 10);
  };
  const daysFromNow = (n) => {
    const d = new Date(today);
    d.setDate(d.getDate() + n);
    return d.toISOString().slice(0, 10);
  };

  const stages = [
    { id: 'received', name: 'Application Received', short: 'Received' },
    { id: 'docs', name: 'Business Documents Submitted', short: 'Docs Submitted' },
    { id: 'ownership', name: 'Beneficial Ownership Verified', short: 'Ownership' },
    { id: 'kyc', name: 'KYC Verification', short: 'KYC' },
    { id: 'compliance', name: 'Compliance Review', short: 'Compliance' },
    { id: 'approved', name: 'Account Approved', short: 'Approved' },
  ];

  const individualStages = [
    { id: 'received', name: 'Application Received', short: 'Received' },
    { id: 'id', name: 'ID Verification', short: 'ID' },
    { id: 'address', name: 'Proof of Address', short: 'Address' },
    { id: 'approved', name: 'Account Approved', short: 'Approved' },
  ];

  const eddStages = [
    { id: 'received', name: 'Application Received', short: 'Received' },
    { id: 'docs', name: 'Enhanced Documents', short: 'Docs' },
    { id: 'ownership', name: 'Ownership Structure', short: 'Ownership' },
    { id: 'source', name: 'Source of Funds', short: 'Source' },
    { id: 'sanctions', name: 'Sanctions Screening', short: 'Sanctions' },
    { id: 'kyc', name: 'KYC Verification', short: 'KYC' },
    { id: 'compliance', name: 'Senior Compliance Review', short: 'Compliance' },
    { id: 'approved', name: 'Account Approved', short: 'Approved' },
  ];

  const customers = [
    {
      id: 'C-10427', name: 'Abdoulaye Fall', initials: 'AF',
      type: 'Business', risk: 'Medium', stage: 'compliance', daysInStage: 2,
      docs: 4, docsTotal: 5, stuck: false,
      phone: '+221 77 543 12 09', email: 'a.fall@fallimports.sn',
      dob: '1981-06-14', address: 'Zone B, Villa 412, Dakar',
      nationality: 'Senegalese', company: 'Fall Imports SARL',
      created: daysAgo(18),
    },
    {
      id: 'C-10428', name: 'Rokhaya Faye', initials: 'RF',
      type: 'Individual', risk: 'Low', stage: 'id', daysInStage: 1,
      docs: 2, docsTotal: 3, stuck: false,
      phone: '+221 78 211 44 20', email: 'rokhaya.faye@gmail.com',
      dob: '1994-11-02', address: 'Sacré-Cœur 3, Dakar',
      nationality: 'Senegalese', created: daysAgo(3),
    },
    {
      id: 'C-10429', name: 'Mame Diop', initials: 'MD',
      type: 'Business', risk: 'Medium', stage: 'ownership', daysInStage: 4,
      docs: 3, docsTotal: 6, stuck: false,
      phone: '+221 77 889 01 55', email: 'mame@diopfreight.sn',
      dob: '1979-03-21', address: 'Plateau, Rue 15 × 22, Dakar',
      nationality: 'Senegalese', company: 'Diop Freight & Logistics',
      created: daysAgo(12),
    },
    {
      id: 'C-10430', name: 'Ousmane Ndiaye', initials: 'ON',
      type: 'EDD', risk: 'High', stage: 'sanctions', daysInStage: 9,
      docs: 6, docsTotal: 9, stuck: true,
      phone: '+221 76 450 12 88', email: 'o.ndiaye@ndiayecapital.sn',
      dob: '1972-08-30', address: 'Almadies, Route de Ngor, Dakar',
      nationality: 'Senegalese', company: 'Ndiaye Capital Partners',
      created: daysAgo(31),
    },
    {
      id: 'C-10431', name: 'Fatou Sarr', initials: 'FS',
      type: 'Individual', risk: 'Low', stage: 'address', daysInStage: 2,
      docs: 2, docsTotal: 3, stuck: false,
      phone: '+221 77 102 33 01', email: 'fatou.sarr@outlook.com',
      dob: '1990-01-18', address: 'Mermoz, Rue 5, Dakar',
      nationality: 'Senegalese', created: daysAgo(5),
    },
    {
      id: 'C-10432', name: 'Ibrahima Diallo', initials: 'ID',
      type: 'Business', risk: 'Medium', stage: 'docs', daysInStage: 3,
      docs: 2, docsTotal: 5, stuck: false,
      phone: '+221 78 670 22 14', email: 'ibrahima@diallotextiles.sn',
      dob: '1985-05-10', address: 'HLM Grand Yoff, Dakar',
      nationality: 'Senegalese', company: 'Diallo Textiles',
      created: daysAgo(8),
    },
    {
      id: 'C-10433', name: 'Aminata Sow', initials: 'AS',
      type: 'Business', risk: 'Medium', stage: 'kyc', daysInStage: 5,
      docs: 4, docsTotal: 5, stuck: false,
      phone: '+221 77 881 00 42', email: 'a.sow@sowbeauty.sn',
      dob: '1988-12-07', address: 'Point E, Villa 28, Dakar',
      nationality: 'Senegalese', company: 'Sow Beauté Distribution',
      created: daysAgo(15),
    },
    {
      id: 'C-10434', name: 'Moussa Thiam', initials: 'MT',
      type: 'Business', risk: 'Medium', stage: 'received', daysInStage: 1,
      docs: 1, docsTotal: 5, stuck: false,
      phone: '+221 76 223 91 17', email: 'moussa.thiam@thiamagro.sn',
      dob: '1983-07-22', address: 'Thiès, Quartier Randoulène',
      nationality: 'Senegalese', company: 'Thiam Agro-Services',
      created: daysAgo(2),
    },
    {
      id: 'C-10435', name: 'Awa Gueye', initials: 'AG',
      type: 'Business', risk: 'Medium', stage: 'compliance', daysInStage: 8,
      docs: 5, docsTotal: 5, stuck: true,
      phone: '+221 77 330 66 09', email: 'awa@gueyeconsulting.sn',
      dob: '1980-09-11', address: 'Ngor, Villa 7A, Dakar',
      nationality: 'Senegalese', company: 'Gueye Consulting',
      created: daysAgo(25),
    },
    {
      id: 'C-10436', name: 'Cheikh Mbaye', initials: 'CM',
      type: 'EDD', risk: 'High', stage: 'compliance', daysInStage: 3,
      docs: 8, docsTotal: 9, stuck: false,
      phone: '+221 78 001 47 52', email: 'c.mbaye@mbayeholdings.sn',
      dob: '1975-02-28', address: 'Fann Résidence, Dakar',
      nationality: 'Senegalese', company: 'Mbaye Holdings',
      created: daysAgo(22),
    },
    {
      id: 'C-10437', name: 'Khady Seck', initials: 'KS',
      type: 'Individual', risk: 'Low', stage: 'approved', daysInStage: 0,
      docs: 3, docsTotal: 3, stuck: false,
      phone: '+221 77 445 12 90', email: 'khady.seck@gmail.com',
      dob: '1996-04-03', address: 'Ouakam, Cité Aliou Sow, Dakar',
      nationality: 'Senegalese', created: daysAgo(6),
    },
    {
      id: 'C-10438', name: 'Babacar Ba', initials: 'BB',
      type: 'Business', risk: 'Medium', stage: 'ownership', daysInStage: 2,
      docs: 3, docsTotal: 6, stuck: false,
      phone: '+221 76 880 23 01', email: 'babacar@batransport.sn',
      dob: '1978-10-19', address: 'Parcelles Assainies U14, Dakar',
      nationality: 'Senegalese', company: 'Ba Transport & Cie',
      created: daysAgo(9),
    },
  ];

  const docTypes = [
    "Carte Nationale d'Identité",
    'Passeport',
    'Justificatif de Domicile',
    'RCCM (Registre du Commerce)',
    'NINEA',
    'Statuts de la Société',
    'Procès-Verbal d\u2019AG',
    'Attestation Bénéficiaires Effectifs',
    'Relevé Bancaire',
    'Justificatif de Revenus',
  ];

  const documents = [
    { id: 'D-88201', type: "Carte Nationale d'Identité", customer: 'Abdoulaye Fall', customerId: 'C-10427', uploaded: daysAgo(16), expires: daysFromNow(420), status: 'valid', by: 'Khady Ndoye', stage: 'KYC' },
    { id: 'D-88202', type: 'RCCM (Registre du Commerce)', customer: 'Abdoulaye Fall', customerId: 'C-10427', uploaded: daysAgo(15), expires: daysFromNow(180), status: 'valid', by: 'Khady Ndoye', stage: 'Docs' },
    { id: 'D-88203', type: 'NINEA', customer: 'Abdoulaye Fall', customerId: 'C-10427', uploaded: daysAgo(14), expires: daysFromNow(22), status: 'expiring', by: 'Khady Ndoye', stage: 'Docs' },
    { id: 'D-88204', type: 'Statuts de la Société', customer: 'Abdoulaye Fall', customerId: 'C-10427', uploaded: daysAgo(14), expires: null, status: 'valid', by: 'Khady Ndoye', stage: 'Docs' },
    { id: 'D-88210', type: "Carte Nationale d'Identité", customer: 'Rokhaya Faye', customerId: 'C-10428', uploaded: daysAgo(3), expires: daysFromNow(1460), status: 'valid', by: 'Self-upload', stage: 'ID' },
    { id: 'D-88211', type: 'Justificatif de Domicile', customer: 'Rokhaya Faye', customerId: 'C-10428', uploaded: daysAgo(2), expires: daysFromNow(85), status: 'valid', by: 'Self-upload', stage: 'ID' },
    { id: 'D-88220', type: 'Passeport', customer: 'Ousmane Ndiaye', customerId: 'C-10430', uploaded: daysAgo(29), expires: daysAgo(4), status: 'expired', by: 'Moussa Kane', stage: 'KYC' },
    { id: 'D-88221', type: 'Attestation Bénéficiaires Effectifs', customer: 'Ousmane Ndiaye', customerId: 'C-10430', uploaded: daysAgo(27), expires: daysFromNow(12), status: 'expiring', by: 'Moussa Kane', stage: 'Ownership' },
    { id: 'D-88222', type: 'Relevé Bancaire', customer: 'Ousmane Ndiaye', customerId: 'C-10430', uploaded: daysAgo(25), expires: daysFromNow(45), status: 'valid', by: 'Moussa Kane', stage: 'Source' },
    { id: 'D-88230', type: 'NINEA', customer: 'Mame Diop', customerId: 'C-10429', uploaded: daysAgo(10), expires: daysFromNow(300), status: 'valid', by: 'Awa Diagne', stage: 'Docs' },
    { id: 'D-88231', type: 'RCCM (Registre du Commerce)', customer: 'Mame Diop', customerId: 'C-10429', uploaded: daysAgo(10), expires: daysFromNow(210), status: 'valid', by: 'Awa Diagne', stage: 'Docs' },
    { id: 'D-88232', type: 'Statuts de la Société', customer: 'Mame Diop', customerId: 'C-10429', uploaded: daysAgo(9), expires: null, status: 'valid', by: 'Awa Diagne', stage: 'Docs' },
    { id: 'D-88240', type: 'NINEA', customer: 'Awa Gueye', customerId: 'C-10435', uploaded: daysAgo(24), expires: daysAgo(1), status: 'expired', by: 'Ibrahima Cissé', stage: 'Docs' },
    { id: 'D-88241', type: 'Justificatif de Revenus', customer: 'Awa Gueye', customerId: 'C-10435', uploaded: daysAgo(20), expires: daysFromNow(8), status: 'expiring', by: 'Ibrahima Cissé', stage: 'KYC' },
    { id: 'D-88250', type: 'Passeport', customer: 'Cheikh Mbaye', customerId: 'C-10436', uploaded: daysAgo(21), expires: daysFromNow(900), status: 'valid', by: 'Moussa Kane', stage: 'KYC' },
    { id: 'D-88251', type: 'Relevé Bancaire', customer: 'Cheikh Mbaye', customerId: 'C-10436', uploaded: daysAgo(15), expires: daysFromNow(60), status: 'valid', by: 'Moussa Kane', stage: 'Source' },
    { id: 'D-88260', type: "Carte Nationale d'Identité", customer: 'Fatou Sarr', customerId: 'C-10431', uploaded: daysAgo(4), expires: daysFromNow(1100), status: 'valid', by: 'Self-upload', stage: 'ID' },
    { id: 'D-88270', type: 'RCCM (Registre du Commerce)', customer: 'Ibrahima Diallo', customerId: 'C-10432', uploaded: daysAgo(7), expires: daysFromNow(400), status: 'valid', by: 'Awa Diagne', stage: 'Docs' },
    { id: 'D-88280', type: 'NINEA', customer: 'Aminata Sow', customerId: 'C-10433', uploaded: daysAgo(13), expires: daysFromNow(240), status: 'valid', by: 'Awa Diagne', stage: 'Docs' },
    { id: 'D-88281', type: 'Attestation Bénéficiaires Effectifs', customer: 'Aminata Sow', customerId: 'C-10433', uploaded: daysAgo(12), expires: daysFromNow(180), status: 'valid', by: 'Awa Diagne', stage: 'Ownership' },
    { id: 'D-88282', type: 'RCCM (Registre du Commerce)', customer: 'Aminata Sow', customerId: 'C-10433', uploaded: daysAgo(11), expires: daysFromNow(365), status: 'valid', by: 'Awa Diagne', stage: 'Docs' },
  ];

  const activity = [
    { t: '2026-04-18T09:42', user: 'Khady Ndoye', role: 'Compliance Officer', action: 'Stage Transition', customer: 'Abdoulaye Fall', detail: 'KYC Verification → Compliance Review', direction: 'forward', reason: 'All KYC checks passed' },
    { t: '2026-04-18T09:31', user: 'Moussa Kane', role: 'Compliance Officer', action: 'Document Upload', customer: 'Cheikh Mbaye', detail: 'Uploaded Relevé Bancaire (D-88251)' },
    { t: '2026-04-18T08:55', user: 'Awa Diagne', role: 'Onboarding Agent', action: 'Document Upload', customer: 'Mame Diop', detail: 'Uploaded Statuts de la Société' },
    { t: '2026-04-17T17:12', user: 'System', role: 'Automation', action: 'Alert Generated', customer: 'Ousmane Ndiaye', detail: 'Account stuck in Sanctions Screening for 9 days' },
    { t: '2026-04-17T16:40', user: 'Ibrahima Cissé', role: 'Team Lead', action: 'Flagged', customer: 'Awa Gueye', detail: 'Flagged for manual review — NINEA expired' },
    { t: '2026-04-17T14:05', user: 'Khady Ndoye', role: 'Compliance Officer', action: 'Approval', customer: 'Khady Seck', detail: 'Account approved — Basic Individual workflow complete' },
    { t: '2026-04-17T11:22', user: 'Rokhaya Faye', role: 'Self-upload', action: 'Document Upload', customer: 'Rokhaya Faye', detail: 'Uploaded Justificatif de Domicile' },
    { t: '2026-04-17T10:08', user: 'Awa Diagne', role: 'Onboarding Agent', action: 'Stage Transition', customer: 'Ibrahima Diallo', detail: 'Application Received → Business Documents Submitted', direction: 'forward', reason: 'Initial docs received' },
    { t: '2026-04-17T09:30', user: 'Moussa Kane', role: 'Compliance Officer', action: 'Stage Transition', customer: 'Ousmane Ndiaye', detail: 'Source of Funds → Sanctions Screening', direction: 'forward', reason: 'Source of funds verified' },
    { t: '2026-04-16T18:11', user: 'Fatou Ba', role: 'Admin', action: 'Role Change', customer: '—', detail: 'Promoted Awa Diagne: Onboarding Agent → Senior Onboarding Agent' },
    { t: '2026-04-16T15:47', user: 'Khady Ndoye', role: 'Compliance Officer', action: 'Rejection', customer: 'Ousmane Ndiaye', detail: 'Passport document rejected — expired', reason: 'Document expired 4 days ago' },
    { t: '2026-04-16T11:20', user: 'System', role: 'Automation', action: 'Report Generation', customer: '—', detail: 'Weekly compliance summary generated (47 accounts reviewed)' },
  ];

  const team = [
    { name: 'Khady Ndoye', email: 'k.ndoye@cbao.sn', role: 'Compliance Officer', category: 'Compliance & Audit', status: 'Active', lastActive: '2m ago', hasSig: true, initials: 'KN' },
    { name: 'Moussa Kane', email: 'm.kane@cbao.sn', role: 'Compliance Officer', category: 'Compliance & Audit', status: 'Active', lastActive: '14m ago', hasSig: true, initials: 'MK' },
    { name: 'Awa Diagne', email: 'a.diagne@cbao.sn', role: 'Senior Onboarding Agent', category: 'Operational', status: 'Active', lastActive: '1h ago', hasSig: true, initials: 'AD' },
    { name: 'Ibrahima Cissé', email: 'i.cisse@cbao.sn', role: 'Team Lead', category: 'Supervisory', status: 'Active', lastActive: '3h ago', hasSig: true, initials: 'IC' },
    { name: 'Fatou Ba', email: 'f.ba@cbao.sn', role: 'Administrator', category: 'Supervisory', status: 'Active', lastActive: 'Just now', hasSig: false, initials: 'FB' },
    { name: 'Ndeye Thiaw', email: 'n.thiaw@cbao.sn', role: 'Onboarding Agent', category: 'Operational', status: 'Active', lastActive: '22m ago', hasSig: false, initials: 'NT' },
    { name: 'Mamadou Sy', email: 'm.sy@cbao.sn', role: 'Onboarding Agent', category: 'Operational', status: 'Active', lastActive: '5m ago', hasSig: false, initials: 'MS' },
    { name: 'Astou Wade', email: 'a.wade@cbao.sn', role: 'Internal Auditor', category: 'Compliance & Audit', status: 'Inactive', lastActive: '3d ago', hasSig: true, initials: 'AW' },
  ];

  const workflows = [
    { id: 'basic', name: 'Basic Individual', count: 4, stages: individualStages, risk: 'Low' },
    { id: 'business', name: 'Business Account', count: 6, stages: stages, risk: 'Medium' },
    { id: 'edd', name: 'Enhanced Due Diligence', count: 8, stages: eddStages, risk: 'High' },
  ];

  return { today, daysAgo, daysFromNow, stages, individualStages, eddStages, customers, documents, docTypes, activity, team, workflows };
})();
