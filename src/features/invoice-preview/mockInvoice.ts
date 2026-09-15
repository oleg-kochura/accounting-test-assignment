import type { InvoiceData } from './types'

export const MOCK_INVOICE: InvoiceData = {
  invoiceNumber: '346D3D40-0001',
  dateOfIssue: 'September 3, 2024',
  dueDate: 'September 3, 2024',
  seller: {
    name: 'BIGCAPITAL, INC',
    addressLines: [
      '131 Continental Dr Suite 305 Newark,',
      'Dr Suite 305',
      'Newark, Delaware 19131',
      'United State',
    ],
    phone: '+1 762-339-5634',
  },
  billedTo: {
    name: 'Bigcapital Technology, Inc.',
    addressLines: [
      '131 Continental Dr,',
      'Suite 305,',
      'Newark, Delaware 19713,',
      'United States,',
    ],
    phone: '+1 762-339-5634',
  },
  taxes: [
    { label: 'Sample Tax1 (4.70%)', rate: 0.047 },
    { label: 'Sample Tax2 (7.00%)', rate: 0.07 },
  ],
  paymentMade: 100,
  termsAndConditions:
    'All services provided are non-refundable. For any disputes, please contact us within 7 days of receiving this invoice.',
  statement:
    'Thank you for your business. We look forward to working with you again!',
}
