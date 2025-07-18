export const MOCK_DATA = {
  company: {
    name: 'RigFlow Services, LLC',
    address: '123 Oilfield Rd, Midland, TX 79701',
    phone: '(432) 555-1234',
    email: 'billing@rigflowservices.com'
  },
  users: [
    { id: 'user_001', name: 'John "JD" Doe', role: 'technician', teamId: 'team_alpha', rate: 75, certifications: [{ name: 'H2S Alive', expiry: '2025-08-15' }, { name: 'Fall Protection', expiry: '2026-06-15' }] },
    { id: 'user_002', name: 'Samantha "Sam" Ray', role: 'technician', teamId: 'team_alpha', rate: 75, certifications: [{ name: 'H2S Alive', expiry: '2026-03-20' }] },
    { id: 'user_003', name: 'Mike Richards', role: 'supervisor', teamId: 'team_alpha', rate: 100, certifications: [] },
    { id: 'user_004', name: 'Brenda Smith', role: 'admin', teamId: null, rate: 90, certifications: [] },
    { id: 'user_005', name: 'Robert "Bob" Vance', role: 'executive', teamId: null, rate: 250, certifications: [] },
    { id: 'user_006', name: 'Carlos Hernandez', role: 'technician', teamId: 'team_bravo', rate: 80, certifications: [{ name: 'H2S Alive', expiry: '2025-08-01' }] },
    { id: 'user_007', name: 'David Wallace', role: 'technician', teamId: 'team_bravo', rate: 80, certifications: [] },
    { id: 'user_008', name: 'Maria Garcia', role: 'supervisor', teamId: 'team_bravo', rate: 105, certifications: [] },
  ],
  customers: [
    { id: 'cust_01', name: 'Maverick Oil Co.', address: '555 Drilling Pkwy, Houston, TX 77002' },
    { id: 'cust_02', name: 'Apex Drilling', address: '987 Gusher Ave, Denver, CO 80202' },
    { id: 'cust_03', name: 'Frontier Resources', address: '456 Exploration Trl, Albuquerque, NM 87102' },
    { id: 'cust_04', name: 'Permian Partners', address: '888 W Wall St, Midland, TX 79701' },
  ],
  jobs: [
    { id: 'job_01', customerId: 'cust_01', name: 'Johnson Lease - Well 7-12', location: 'Midland, TX', poc: 'Bill Paxton', geoFence: { lat: 31.9973, lon: -102.0779, radius: 500 }, requiredPersonnel: 2, status: 'Active', budget: 75000 },
    { id: 'job_02', customerId: 'cust_01', name: 'Williams Battery Site', location: 'Odessa, TX', poc: 'Sarah Connor', geoFence: { lat: 31.8457, lon: -102.3679, radius: 750 }, requiredPersonnel: 1, status: 'Active', budget: 25000 },
    { id: 'job_03', customerId: 'cust_02', name: 'Rig 255 - Exploration', location: 'Greeley, CO', poc: 'John Hammond', geoFence: { lat: 40.4233, lon: -104.7091, radius: 1000 }, requiredPersonnel: 3, status: 'Pending', budget: 250000 },
    { id: 'job_04', customerId: 'cust_03', name: 'Site Prep - Block 4', location: 'Carlsbad, NM', poc: 'Ellen Ripley', geoFence: { lat: 32.4207, lon: -104.2288, radius: 600 }, requiredPersonnel: 2, status: 'Completed', budget: 50000 },
  ],
  purchaseOrders: [
    { id: 'po_01', jobId: 'job_01', number: 'MAV-2025-001', totalValue: 50000, consumedValue: 12500 },
    { id: 'po_02', jobId: 'job_02', number: 'MAV-2025-002', totalValue: 75000, consumedValue: 68000 },
    { id: 'po_03', jobId: 'job_03', number: 'APX-2025-105', totalValue: 120000, consumedValue: 35000 },
    { id: 'po_04', jobId: 'job_01', number: 'MAV-2025-009', totalValue: 25000, consumedValue: 5000 },
  ],
  timesheets: [
    { id: 'ts_01', userId: 'user_001', jobId: 'job_01', poId: 'po_01', date: '2025-07-16', status: 'Approved', dayHours: 12, nightHours: 0, notes: 'Completed rig up, waiting on parts.', billable: true, invoiced: false, rejectionReason: null, auditLog: [] },
    { id: 'ts_02', userId: 'user_002', jobId: 'job_01', poId: 'po_01', date: '2025-07-16', status: 'Approved', dayHours: 12, nightHours: 0, notes: 'Assisted with rig up.', billable: true, invoiced: false, rejectionReason: null, auditLog: [] },
    { id: 'ts_03', userId: 'user_006', jobId: 'job_02', poId: 'po_02', date: '2025-07-15', status: 'Approved', dayHours: 0, nightHours: 12, notes: 'Routine maintenance on separator.', billable: true, invoiced: true, rejectionReason: null, auditLog: [] },
    { id: 'ts_04', userId: 'user_001', jobId: 'job_01', poId: 'po_01', date: '2025-07-15', status: 'Approved', dayHours: 12, nightHours: 0, notes: 'Site prep and safety meeting.', billable: true, invoiced: false, rejectionReason: null, auditLog: [] },
    { id: 'ts_05', userId: 'user_007', jobId: 'job_02', poId: 'po_02', date: '2025-07-17', status: 'Pending', dayHours: 10, nightHours: 0, notes: 'Replaced valve on tank 3.', billable: true, invoiced: false, rejectionReason: null, auditLog: [] },
  ],
  expenses: [
    { id: 'ex_01', userId: 'user_001', jobId: 'job_01', poId: 'po_01', date: '2025-07-15', category: 'Fuel', vendor: 'Chevron', amount: 125.50, status: 'Approved', receiptUrl: 'https://placehold.co/400x600/EEE/31343C?text=Fuel+Receipt', billable: true, notes: 'Fuel for unit 203.', invoiced: false, rejectionReason: null, auditLog: [] },
    { id: 'ex_02', userId: 'user_001', jobId: 'job_01', poId: 'po_01', date: '2025-07-16', category: 'Hotel', vendor: 'Marriott', amount: 189.00, status: 'Pending', receiptUrl: 'https://placehold.co/400x600/EEE/31343C?text=Hotel+Receipt', billable: true, notes: '', invoiced: false, rejectionReason: null, auditLog: [] },
    { id: 'ex_03', userId: 'user_006', jobId: 'job_02', poId: 'po_02', date: '2025-07-14', category: 'Meals', vendor: 'Local Diner', amount: 45.25, status: 'Approved', receiptUrl: null, billable: true, notes: 'Dinner with crew', invoiced: true, rejectionReason: null, auditLog: [] },
    { id: 'ex_04', userId: 'user_001', jobId: 'job_01', poId: 'po_04', date: '2025-07-17', category: 'Parts', vendor: 'NAPA', amount: 350.00, status: 'Rejected', receiptUrl: 'https://placehold.co/400x600/EEE/31343C?text=Parts+Receipt', billable: false, notes: 'Wrong part ordered.', invoiced: false, rejectionReason: 'This part was not approved for purchase on PO-004.', auditLog: [] },
  ],
  jsas: [
    { id: 'jsa_01', jobId: 'job_01', date: '2025-07-17', createdBy: 'user_003', status: 'Active', title: "Mobilization & Rig Up", steps: [{ id: 1, description: 'Mobilize to location', hazard: 'Driving fatigue, vehicle incident', control: 'Pre-trip inspection, regular breaks, defensive driving' }, { id: 2, description: 'Spot equipment', hazard: 'Struck-by/Caught-between', control: 'Use designated spotter, establish clear communication signals' }], requiredSignatures: ['user_003', 'user_001', 'user_002'], signatures: ['user_003', 'user_001', 'user_002'] },
    { id: 'jsa_02', jobId: 'job_02', date: '2025-07-16', createdBy: 'user_003', status: 'Active', title: "Routine Maintenance", steps: [{ id: 1, description: 'Isolate equipment', hazard: 'Stored energy', control: 'LOTO procedure, verify zero energy state' }], requiredSignatures: ['user_003', 'user_006'], signatures: ['user_003', 'user_006'] },
  ],
  dvirs: [
      { id: 'dvir_01', userId: 'user_001', vehicleId: 'Truck 150', date: '2025-07-16', odometer: 123456, defects: [], remarks: 'No defects noted.', signed: true, status: 'Reviewed' },
      { id: 'dvir_02', userId: 'user_002', vehicleId: 'Truck 210', date: '2025-07-17', odometer: 89123, defects: ['Tire pressure low - front right'], remarks: 'Front right tire at 55 PSI, needs inflation.', signed: true, status: 'Pending Review' },
  ],
  schedule: [
    { id: 'sched_01', userId: 'user_001', jobId: 'job_01', startDate: '2025-07-20', endDate: '2025-07-23', shift: 'Day' },
    { id: 'sched_02', userId: 'user_002', jobId: 'job_01', startDate: '2025-07-20', endDate: '2025-07-24', shift: 'Day' },
    { id: 'sched_03', userId: 'user_006', jobId: 'job_02', startDate: '2025-07-21', endDate: '2025-07-25', shift: 'Night' },
    { id: 'sched_04', userId: 'user_007', jobId: 'job_02', startDate: '2025-07-21', endDate: '2025-07-22', shift: 'Night' },
  ],
  jsaTemplates: {
      'Rig Up': { title: "Mobilization & Rig Up", steps: [{ id: 1, description: 'Mobilize to location', hazard: 'Driving fatigue, vehicle incident', control: 'Pre-trip inspection, regular breaks, defensive driving' }, { id: 2, description: 'Spot equipment', hazard: 'Struck-by/Caught-between', control: 'Use designated spotter, establish clear communication signals' }, { id: 3, description: 'Connect hoses & cables', hazard: 'High pressure lines, pinch points', control: 'Verify pressure release, wear proper PPE, inspect connections' }] },
      'Well Testing': { title: "Well Testing Operations", steps: [{ id: 1, description: 'Bleed off pressure from wellhead', hazard: 'High pressure release, H2S exposure', control: 'Verify zero pressure with gauges, wear personal H2S monitor' }, { id: 2, description: 'Connect test equipment', hazard: 'Incorrect connection, dropped objects', control: 'Use correct fittings, secure tools with lanyards' }, { id: 3, description: 'Flow well to separator', hazard: 'Flammable vapors, environmental spill', control: 'Use intrinsically safe equipment, monitor tank levels, have spill kit ready' }] },
      'General Maintenance': { title: "General Site Maintenance", steps: [{ id: 1, description: 'Identify and permit work area', hazard: 'Unauthorized access, scope creep', control: 'Use work permits, conduct pre-job brief with all personnel' }, { id: 2, description: 'Use hand/power tools', hazard: 'Cuts, abrasions, electric shock', control: 'Inspect tools before use, wear appropriate PPE (gloves, safety glasses), use GFCI protection' }] }
  },
  fieldTickets: [
      { id: 'ft_01', jobId: 'job_02', date: '2025-07-15', createdBy: 'user_003', status: 'Signed', timesheetIds: ['ts_03'], expenseIds: ['ex_03'], clientSignee: 'John Smith (Maverick)', invoiced: true },
      { id: 'ft_02', jobId: 'job_01', date: '2025-07-17', createdBy: 'user_003', status: 'Pending Signature', timesheetIds: ['ts_01', 'ts_02', 'ts_04'], expenseIds: ['ex_01'], clientSignee: null, invoiced: false },
  ],
  invoices: [
      { id: 'inv_2025_001', jobId: 'job_02', date: '2025-07-16', createdBy: 'user_004', status: 'Paid', amount: 1260, fieldTicketIds: ['ft_01']}
  ],
  assets: [
      { id: 'asset_v_150', name: 'Truck 150', type: 'Vehicle', manufacturer: 'Ford', model: 'F-350', serialNumber: 'F83JD93845', status: 'Active', assignedTo: 'user_001', serviceHistory: [{ date: '2025-05-20', description: 'Oil Change', workOrder: 'wo_internal_01' }] },
      { id: 'asset_e_bop_01', name: 'BOP Stack #1', type: 'Blowout Preventer', manufacturer: 'Cameron', model: 'U Type 13 5/8', serialNumber: 'CAM-U-12345', status: 'Active', assignedTo: null, serviceHistory: [] },
      { id: 'asset_e_pump_01', name: 'Gaso Pump 550T', type: 'Heavy Equipment', manufacturer: 'Gaso', model: '550T', serialNumber: 'G550T-98234', status: 'In Storage', assignedTo: null, serviceHistory: [] },
      { id: 'asset_e_gen_03', name: 'CAT Generator XQ60', type: 'Heavy Equipment', manufacturer: 'Caterpillar', model: 'XQ60', serialNumber: 'CATXQ60-1124', status: 'Down for Repair', assignedTo: null, serviceHistory: [{ date: '2025-07-10', description: 'Fuel injector failure', workOrder: 'wo_internal_05' }] },
  ],
  inventory: [
      { partNumber: 'FIL-001', description: '10-micron Hydraulic Filter', locationId: 'main_wh', quantity: 200, minLevel: 50 },
      { partNumber: 'FIL-001', description: '10-micron Hydraulic Filter', locationId: 'user_001', quantity: 5, minLevel: 2 },
      { partNumber: 'VLV-004', description: '2-inch Ball Valve, 316SS', locationId: 'main_wh', quantity: 50, minLevel: 10 },
  ],
  incidents: [
      { id: 'inc_1721245200000', reporterId: 'user_001', jobId: 'job_01', incidentType: 'Near Miss', dateTime: '2025-07-17T14:30', location: 'Johnson Lease - Well 7-12', description: 'While hoisting a valve into place, the rigging slipped. The load did not fall but shifted unexpectedly. No one was injured.', actionsTaken: 'Stopped the lift, inspected and replaced the rigging. Held a safety stand-down to review hoisting procedures.', witnesses: 'Samantha Ray', status: 'Submitted' }
  ],
  crews: [
      { id: 'crew_alpha_1', name: 'Alpha Day Crew', leaderId: 'user_003', memberIds: ['user_001', 'user_002'] },
      { id: 'crew_bravo_1', name: 'Bravo Night Crew', leaderId: 'user_008', memberIds: ['user_006', 'user_007'] },
  ],
  dailyDrillingReports: [
    { id: 'ddr_01', jobId: 'job_03', date: '2025-07-17', status: 'Pending', createdBy: 'user_002', drillingDepth: 8500, mudWeight: 9.2, nptHours: 1, nptReason: 'Waiting on cement' }
  ],
  equipmentInspections: [
    { id: 'insp_01', assetId: 'asset_e_bop_01', date: '2025-07-16', status: 'Pending', createdBy: 'user_001' }
  ],
  inspectionChecklists: {
    'Blowout Preventer': [
        { id: 'bop_1', text: 'Ram blocks and packers match drill string size' },
        { id: 'bop_2', text: 'Visible leaks (hydraulic, mud)' },
        { id: 'bop_3', text: 'Accumulator pressure within limits' },
        { id: 'bop_4', text: 'Choke and kill line valves function correctly' },
        { id: 'bop_5', text: 'Emergency drills conducted' }
    ],
    'Vehicle': [
        { id: 'veh_1', text: 'Tires (pressure, tread depth)' },
        { id: 'veh_2', text: 'Brakes (service, parking)' },
        { id: 'veh_3', text: 'Lights (head, tail, turn signals)' },
        { id: 'veh_4', text: 'Fluid levels (oil, coolant, washer)' },
        { id: 'veh_5', text: 'Safety equipment (first aid, fire extinguisher)' }
    ]
  }
};
