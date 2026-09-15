export interface InvoiceParty {
  name: string
  addressLines: string[]
  phone: string
}

export interface InvoiceLineItem {
  item: string
  description: string
  rate: string
  total: string
}

export interface InvoiceTax {
  label: string
  amount: string
}

export interface InvoiceData {
  invoiceNumber: string
  dateOfIssue: string
  dueDate: string
  seller: InvoiceParty
  billedTo: InvoiceParty
  lineItems: InvoiceLineItem[]
  subtotal: string
  discount: string
  taxes: InvoiceTax[]
  total: string
  paymentMade: string
  balanceDue: string
  termsAndConditions: string
  statement: string
}

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
  lineItems: [
    {
      item: 'Web development',
      description: 'Website development with content and SEO optimization',
      rate: '1',
      total: '$1000.00',
    },
  ],
  subtotal: '630.00',
  discount: '0.00',
  taxes: [
    { label: 'Sample Tax1 (4.70%)', amount: '11.75' },
    { label: 'Sample Tax2 (7.00%)', amount: '21.74' },
  ],
  total: '$662.75',
  paymentMade: '100.00',
  balanceDue: '$562.75',
  termsAndConditions:
    'All services provided are non-refundable. For any disputes, please contact us within 7 days of receiving this invoice.',
  statement:
    'Thank you for your business. We look forward to working with you again!',
}
