import { Component, OnInit } from '@angular/core';

import { ExpenseItems } from '../../../shared/expense-data.model';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: [ './results.component.scss' ]
})
export class ResultsComponent implements OnInit {
  public expenseItems: ExpenseItems[];

  constructor() {
  }

  ngOnInit(): void {
    this.expenseItems = this.createExpenseItemsList();
  }

  createExpenseItemsList(): ExpenseItems[] {
    const expenseItems: ExpenseItems[] = [
      {
        name: 'Transfer Tax',
        amount: {
          percentage: [ 2 ],
          costRange: {
            min: 0,
            max: 0,
          },
          bothApplicable: false,
        },
        info: 'When you buy a home, you’ll pay 2% of the property value to the government. The only times this charge doesn’t apply are when you’re purchasing a newly built property or when you’re buying a property from a seller who has bought it less than 6 months previously.',
        compulsory: true,
        taxDeductible: false,
      },
      {
        name: 'Civil-Law Notary',
        amount: {
          percentage: [ 0 ],
          costRange: {
            min: 900,
            max: 2000,
          },
          bothApplicable: false,
        },
        info: 'You’ll need a notary to legally transfer the property to your name and register it at the land registry. Costs for this will vary from 900 euros to as much as 2,000 euros, depending on the notary.',
        compulsory: true,
        taxDeductible: true,
      },
      {
        name: 'Valuation',
        amount: {
          percentage: [ 0 ],
          costRange: {
            min: 300,
            max: 800,
          },
          bothApplicable: false,
        },
        info: 'Every bank or lender requires an official valuation report if you’re getting a mortgage. This will cost you somewhere between 300 and 800 euros, depending on the size of the house (the bigger, the more work) and of course the evaluator you choose.',
        compulsory: true,
        taxDeductible: true,
      },
      {
        name: 'Financial Advisor',
        amount: {
          percentage: [ 0 ],
          costRange: {
            min: 2000,
            max: 5000,
          },
          bothApplicable: false,
        },
        info: 'Prices for a financial advisor can vary from approx. 2,000 euros to more than 5,000 euros.',
        compulsory: true,
        taxDeductible: true,
      },
      {
        name: 'Organizing Medical Report',
        amount: {
          percentage: [ 0 ],
          costRange: {
            min: 125,
            max: 150,
          },
          bothApplicable: false,
        },
        info: 'This expense is related to organizing you medical report and handling files with the authorities.',
        compulsory: true,
        taxDeductible: false,
      },
      {
        name: 'Bank Guarantee',
        amount: {
          percentage: [ 1 ],
          costRange: {
            min: 0,
            max: 0,
          },
          bothApplicable: false,
        },
        info: 'You’ll need to provide the seller with a 10% deposit once you’ve signed the purchase agreement. If you can’t provide a 10% deposit, you’ll need to get a bank guarantee for that amount. You can expect the bank guarantee to cost you about 1% of the amount of the guarantee.',
        compulsory: true,
        taxDeductible: false,
      },
      {
        name: 'Structural Survey',
        amount: {
          percentage: [ 0 ],
          costRange: {
            min: 250,
            max: 900,
          },
          bothApplicable: false,
        },
        info: 'A structural survey to inspect your home will cost between 250 and 900 euros, depending on the size of the building.',
        compulsory: true,
        taxDeductible: false,
      },
      {
        name: 'National Mortgage Guarantee(NHG)',
        amount: {
          percentage: [ 0.9 ],
          costRange: {
            min: 0,
            max: 0,
          },
          bothApplicable: false,
        },
        info: 'NHG is a protection against residual debt if you can’t pay your mortgage due to unemployment, divorce or the inability to work. It will cost you 0.9% of the mortgage amount, but you’ll earn your money back quickly because lenders offer much lower interest rates if you make use of this protection. NHG is only available for mortgages up to maximum 310,000 euros as of 2020.',
        compulsory: false,
        taxDeductible: true,
        specialExpense: true,
      },
      {
        name: 'Real Estate Agent',
        amount: {
          percentage: [ 0.5, 1.5 ],
          costRange: {
            min: 500,
            max: 3000,
          },
          bothApplicable: true,
        },
        info: 'You may wish to hire a real estate agent for help finding a house and negotiating the price. Some agents charge a fixed fee that’s usually between 500 and 3,000 euros. Others charge between 0.5% and 1.5% of the property value. Some charge both.',
        compulsory: false,
        taxDeductible: false,
        specialExpense: true,
      },
      {
        name: 'Life Insurance',
        amount: {
          percentage: [ 0 ],
          costRange: {
            min: 250,
            max: 500,
          },
          bothApplicable: false,
        },
        info: 'Handling documents for life insurance application. You can also insure your partner.',
        compulsory: false,
        taxDeductible: false,
        specialExpense: true,
      },
      {
        name: 'Contact with Agency',
        amount: {
          percentage: [ 0 ],
          costRange: {
            min: 350,
            max: 500,
          },
          bothApplicable: false,
        },
        info: 'Contact with the selling estate agent when buying without an estate agent (makelaar) and checking the purchase agreement on your behalf by financial advisor.',
        compulsory: false,
        taxDeductible: false,
        specialExpense: true,
      },
      {
        name: 'Translator',
        amount: {
          percentage: [ 0 ],
          costRange: {
            min: 500,
            max: 750,
          },
          bothApplicable: false,
        },
        info: 'This expense is for arranging translator while you are signing documents in the civil-law notary.',
        compulsory: false,
        taxDeductible: false,
        specialExpense: true,
      },
      {
        name: 'Self-employed Customers',
        amount: {
          percentage: [ 0 ],
          costRange: {
            min: 495,
            max: 500,
          },
          bothApplicable: false,
        },
        info: 'Additional fee due before handling your files.',
        compulsory: false,
        taxDeductible: false,
        specialExpense: true,
      }
    ];

    return expenseItems;
  }

}
