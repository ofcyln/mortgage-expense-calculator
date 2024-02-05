import { ExpenseItem } from '../expense-data.model'; // Import the ExpenseItem type from the appropriate module

export const expenseList: ExpenseItem[] = [
  {
    name: 'Transfer Tax',
    amount: {
      percentage: [2],
      costRange: {
        min: 0,
        max: 0,
      },
      bothApplicable: false,
    },
    info:
      'When you buy a home, you’ll pay 2% of the property value to the government. The only times this charge doesn’t apply are when you’re purchasing a newly built property or when you’re buying a property from a seller who has bought it less than 6 months previously. One major change to mortgages in 2024 is regarding the transfer tax. People under the age of 35 do not have to pay transfer tax if they purchase a house for less than 510.000 euros. However, this only counts if you haven’t made use of this advantage in the past.',
    compulsory: true,
    taxDeductible: false,
  },
  {
    name: 'Bank Guarantee',
    amount: {
      percentage: [1],
      costRange: {
        min: 0,
        max: 0,
      },
      bothApplicable: false,
    },
    info:
      'You’ll need to provide the seller with a 10% deposit once you’ve signed the purchase agreement. ' +
      'If you can’t provide a 10% deposit, you’ll need to get a bank guarantee for that amount. ' +
      'Fees for bank guarantees vary from provider to provider. It is often 1% of the deposit, ' +
      'but some providers charge less or even nothing at all. The notary will deduct these fees ' +
      'upon transfer. You can expect the bank guarantee to cost you 1% of the amount of the guarantee.',
    compulsory: true,
    taxDeductible: false,
  },

  {
    name: 'Financial Advisor',
    amount: {
      percentage: [0],
      costRange: {
        min: 3000,
        max: 5000,
      },
      bothApplicable: false,
    },
    info:
      'Mortgages can either be taken out directly from a bank (or other institution), or via an intermediary such as a financial advisor. Both banks and/or financial advisor charge you between 3.000 Euros to more than 5.000 Euros.',
    compulsory: true,
    taxDeductible: true,
    approximate: true,
  },
  {
    name: 'Valuation Report',
    amount: {
      percentage: [0],
      costRange: {
        min: 500,
        max: 12000,
      },
      bothApplicable: false,
    },
    info:
      'Also known as (Appraisal report). Every bank or lender requires an official valuation report if you’re getting a mortgage. A local, certified appraiser visits the property and creates an valuation report about the property. This report will be required for your mortgage and is accepted by all banks. This will cost you somewhere between 400 Euros to 1.000 Euros, depending on the size of the house (the bigger, the more work) and of course the evaluator you choose.',
    compulsory: true,
    taxDeductible: true,
    approximate: true,
  },
  {
    name: 'Civil-Law Notary',
    amount: {
      percentage: [0],
      costRange: {
        min: 1000,
        max: 2500,
      },
      bothApplicable: false,
    },
    info:
      'You’ll need a notary to legally transfer the property to your name and register it at the land registry. Civil-Law Notary fees including deed of property conveyance (kosten leveringsakte) and mortgage contract (hypotheekakte). Costs for this will vary from 1000 Euros to 2.500 Euros, depending on the notary.',
    compulsory: true,
    taxDeductible: true,
    approximate: true,
  },
  {
    name: 'Organizing Medical Report',
    amount: {
      percentage: [0],
      costRange: {
        min: 150,
        max: 200,
      },
      bothApplicable: false,
    },
    info:
      'This expense is related to organizing your medical report and handling files with the authorities. The financial advisor handles your files and charges you between 150 Euros to 200 Euros.',
    compulsory: true,
    taxDeductible: false,
    approximate: true,
  },

  {
    name: 'Structural Survey',
    amount: {
      percentage: [0],
      costRange: {
        min: 350,
        max: 750,
      },
      bothApplicable: false,
    },
    info:
      'Also known as (Building Report). A building inspector who visits and checks the condition of the property and delivers an extensive construction report detailing short, medium and long term maintenance costs. A structural survey to inspect your home will cost between 350 and 750 Euros, depending on the size of the building.',
    compulsory: true,
    taxDeductible: false,
    approximate: true,
  },
  {
    name: 'National Mortgage Guarantee(NHG)',
    amount: {
      percentage: [0.7],
      costRange: {
        min: 0,
        max: 0,
      },
      bothApplicable: false,
    },
    info:
      'NHG is a protection against residual debt if you can’t pay your mortgage due to unemployment, divorce or the inability to work. It will cost you 0,7% of the mortgage amount, but you’ll earn your money back quickly because lenders offer much lower interest rates if you make use of this protection. NHG is only available for mortgages up to maximum 435.000 Euros as of 2024.',
    compulsory: false,
    taxDeductible: true,
    specialExpense: true,
    exceededAmount: false,
    checked: false,
  },
  {
    name: 'Real Estate Agent',
    amount: {
      percentage: [0.5, 1.5],
      costRange: {
        min: 2000,
        max: 6000,
      },
      bothApplicable: true,
    },
    info:
      'You may wish to hire a real estate agent for help finding a house and negotiating the price. Some agents charge a fixed fee that’s usually between 2000 and 6.000 Euros. Others charge between 0,5% and 1,5% of the property value. Some charge both.',
    compulsory: false,
    taxDeductible: false,
    specialExpense: true,
    approximate: true,
    checked: false,
  },
  {
    name: 'Life Insurance',
    amount: {
      percentage: [0],
      costRange: {
        min: 350,
        max: 500,
      },
      bothApplicable: false,
    },
    info:
      "Handling documents for a life insurance policy application can be made by the financial advisor or by you. You can also buy another life insurance policy for your partner as well. A life insurance's first-time payment costs to you generally between 350 Euros to 500 Euros for per person.",
    compulsory: false,
    taxDeductible: false,
    specialExpense: true,
    approximate: true,
    checked: false,
  },
  {
    name: 'Contact with Agency',
    amount: {
      percentage: [0],
      costRange: {
        min: 400,
        max: 600,
      },
      bothApplicable: false,
    },
    info:
      'Contacting the selling estate agent when buying without an estate agent (makelaar) and checking the purchase agreement on your behalf by a financial advisor. This cost range differs for each financial advisor. It costs you between 400 Euros to 600 Euros.',
    compulsory: false,
    taxDeductible: false,
    specialExpense: true,
    approximate: true,
    checked: false,
  },
  {
    name: 'Translator',
    amount: {
      percentage: [0],
      costRange: {
        min: 350,
        max: 600,
      },
      bothApplicable: false,
    },
    info:
      'This expense is for arranging a translator while you are signing documents in the civil-law notary. Translators work hourly and they will probably bill you for a couple of hours work between 350 Euros to 600 Euros.',
    compulsory: false,
    taxDeductible: false,
    specialExpense: true,
    approximate: true,
    checked: false,
  },
  {
    name: 'Self-employed Customers',
    amount: {
      percentage: [0],
      costRange: {
        min: 500,
        max: 700,
      },
      bothApplicable: false,
    },
    info: 'Additional fee due before handling your files. It costs you between the amount of 500 Euros to 700 Euros.',
    compulsory: false,
    taxDeductible: false,
    specialExpense: true,
    approximate: true,
    checked: false,
  },
  {
    name: 'Mortgage for House Owners',
    amount: {
      percentage: [0],
      costRange: {
        min: 500,
        max: 700,
      },
      bothApplicable: false,
    },
    info:
      "Arranging a mortgage for existing house owners. It's being handled by financial advisor and it costs you between the amount of 500 Euros to 700 Euros.",
    compulsory: false,
    taxDeductible: false,
    specialExpense: true,
    approximate: true,
    checked: false,
  },
];
