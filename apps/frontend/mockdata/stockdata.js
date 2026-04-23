// ── Products ──────────────────────────────────────────────────────────────────
export const PRODUCTS = [
  { id: 'p1', name: 'Air Force 1 Low Supreme', sku: 'AF1-SUP-001', stock: 142, brand: 'Nike', category: 'Footwear' },
  { id: 'p2', name: 'Wireless Earbuds Pro X', sku: 'WEP-SNY-002', stock: 8, brand: 'Sony', category: 'Electronics' },
  { id: 'p3', name: 'Leather Crossbody Bag', sku: 'LCB-COA-003', stock: 0, brand: 'Coach', category: 'Accessories' },
  { id: 'p4', name: 'Slim Fit Chino Pants', sku: 'SFC-LEV-004', stock: 55, brand: 'Levi', category: 'Clothing' },
  { id: 'p5', name: 'Bamboo Desk Organizer', sku: 'BDO-MUJ-005', stock: 3, brand: 'Muji', category: 'Office' },
  { id: 'p6', name: 'Stainless Steel Bottle', sku: 'SSB-HYD-006', stock: 210, brand: 'Hydro Flask', category: 'Lifestyle' },
  { id: 'p7', name: 'Ceramic Pour-Over Set', sku: 'CPO-FEL-007', stock: 0, brand: 'Fellow', category: 'Kitchen' },
  { id: 'p8', name: 'Yoga Mat Premium', sku: 'YMP-MAN-008', stock: 27, brand: 'Manduka', category: 'Sports' }
]

// ── Chart data ─────────────────────────────────────────────────────────────────
export const CHART_DATA = {
  today: [
    { label: '08:00', in: 12, out: 4 },
    { label: '10:00', in: 30, out: 18 },
    { label: '12:00', in: 5, out: 22 },
    { label: '14:00', in: 48, out: 10 },
    { label: '16:00', in: 20, out: 35 },
    { label: '18:00', in: 0, out: 14 }
  ],
  week: [
    { label: 'Mon', in: 120, out: 85 },
    { label: 'Tue', in: 95, out: 110 },
    { label: 'Wed', in: 210, out: 60 },
    { label: 'Thu', in: 55, out: 90 },
    { label: 'Fri', in: 180, out: 145 },
    { label: 'Sat', in: 40, out: 25 },
    { label: 'Sun', in: 10, out: 8 }
  ],
  month: [
    { label: 'Wk 1', in: 520, out: 410 },
    { label: 'Wk 2', in: 740, out: 580 },
    { label: 'Wk 3', in: 380, out: 640 },
    { label: 'Wk 4', in: 860, out: 490 }
  ]
}

// ── Reserved stock ─────────────────────────────────────────────────────────────
export const RESERVED_STOCK = [
  { id: 'r1', productId: 'p1', productName: 'Air Force 1 Low Supreme', qty: 5, orderId: 'ORD-8821', reservedAt: '2025-04-23T08:14:00', expiresAt: '2025-04-24T08:14:00' },
  { id: 'r2', productId: 'p2', productName: 'Wireless Earbuds Pro X', qty: 2, orderId: 'ORD-8834', reservedAt: '2025-04-23T09:30:00', expiresAt: '2025-04-24T09:30:00' },
  { id: 'r3', productId: 'p4', productName: 'Slim Fit Chino Pants', qty: 10, orderId: 'ORD-8840', reservedAt: '2025-04-22T15:00:00', expiresAt: '2025-04-23T15:00:00' },
  { id: 'r4', productId: 'p6', productName: 'Stainless Steel Bottle', qty: 8, orderId: 'ORD-8855', reservedAt: '2025-04-23T11:45:00', expiresAt: '2025-04-25T11:45:00' }
]

// ── Stock history ──────────────────────────────────────────────────────────────
export const STOCK_HISTORY = [
  { id: 'h1', type: 'IN', productName: 'Air Force 1 Low Supreme', sku: 'AF1-SUP-001', qty: 50, time: '2025-04-23T08:00:00', user: 'admin@shopall.io', note: 'Restock from supplier' },
  { id: 'h2', type: 'OUT', productName: 'Wireless Earbuds Pro X', sku: 'WEP-SNY-002', qty: 3, time: '2025-04-23T09:15:00', user: 'staff@shopall.io', note: 'Order #8821' },
  { id: 'h3', type: 'OUT', productName: 'Leather Crossbody Bag', sku: 'LCB-COA-003', qty: 1, time: '2025-04-23T10:02:00', user: 'staff@shopall.io', note: 'Damaged — write off' },
  { id: 'h4', type: 'IN', productName: 'Stainless Steel Bottle', sku: 'SSB-HYD-006', qty: 100, time: '2025-04-22T14:30:00', user: 'admin@shopall.io', note: 'Monthly bulk restock' },
  { id: 'h5', type: 'OUT', productName: 'Slim Fit Chino Pants', sku: 'SFC-LEV-004', qty: 15, time: '2025-04-22T16:00:00', user: 'manager@shopall.io', note: 'Transfer to warehouse B' },
  { id: 'h6', type: 'IN', productName: 'Yoga Mat Premium', sku: 'YMP-MAN-008', qty: 30, time: '2025-04-21T11:20:00', user: 'admin@shopall.io', note: 'New batch' },
  { id: 'h7', type: 'OUT', productName: 'Bamboo Desk Organizer', sku: 'BDO-MUJ-005', qty: 7, time: '2025-04-21T13:45:00', user: 'staff@shopall.io', note: 'Order #8799' },
  { id: 'h8', type: 'IN', productName: 'Ceramic Pour-Over Set', sku: 'CPO-FEL-007', qty: 20, time: '2025-04-20T09:00:00', user: 'admin@shopall.io', note: 'Restock' }
]

export const WAREHOUSES = ['Warehouse A – HCMC', 'Warehouse B – Hanoi', 'Warehouse C – Da Nang', 'Warehouse D – Can Tho']
export const OUT_REASONS = ['order', 'damaged', 'transfer', 'adjustment']