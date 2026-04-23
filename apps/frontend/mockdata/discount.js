export const MOCK_DISCOUNTS = [
  {
    id: 1,
    name: 'Flash Sale Summer',
    code: 'SUMMER20',
    type: 'percentage',
    value: 20,
    status: 'active',
    startDate: '2025-06-01',
    endDate: '2025-08-31',
    usageLimit: 500,
    usageCount: 213,
  },
  {
    id: 2,
    name: 'New Member Discount',
    code: 'NEWBIE50K',
    type: 'fixed',
    value: 50000,
    status: 'active',
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    usageLimit: 1000,
    usageCount: 88,
  },
  {
    id: 3,
    name: 'Clearance Deals',
    code: 'CLEAR15',
    type: 'percentage',
    value: 15,
    status: 'draft',
    startDate: '2025-09-01',
    endDate: '2025-09-30',
    usageLimit: 200,
    usageCount: 0,
  },
  {
    id: 4,
    name: 'End of Year Sale',
    code: 'EOY30',
    type: 'percentage',
    value: 30,
    status: 'expired',
    startDate: '2024-12-20',
    endDate: '2024-12-31',
    usageLimit: 300,
    usageCount: 300,
  },
  {
    id: 5,
    name: 'Loyalty Reward',
    code: 'LOYAL100K',
    type: 'fixed',
    value: 100000,
    status: 'active',
    startDate: '2025-03-01',
    endDate: '2025-12-31',
    usageLimit: null,
    usageCount: 55,
  },
  {
    id: 6,
    name: 'Weekend Promo',
    code: 'WKND10',
    type: 'percentage',
    value: 10,
    status: 'draft',
    startDate: '2025-07-05',
    endDate: '2025-07-06',
    usageLimit: 50,
    usageCount: 0,
  },
];

export const STATUS_CONFIG = {
  active: { label: 'Active', bg: '#e6f9f0', color: '#0d8a4e' },
  draft: { label: 'Draft', bg: '#f4f4f4', color: '#6e6e6e' },
  expired: { label: 'Expired', bg: '#fdf0f0', color: '#c0392b' },
};

export const TYPE_LABEL = {
  percentage: 'Phần trăm (%)',
  fixed: 'Cố định (₫)',
};

/**
 * Empty form shape used by DiscountForm
 */
export const EMPTY_FORM = {
  name: '',
  type: 'percentage',
  value: '',
  code: '',
  startDate: '',
  endDate: '',
  usageLimit: '',
  status: 'draft',
};