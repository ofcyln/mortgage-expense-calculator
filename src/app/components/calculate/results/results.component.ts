import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

import { ExpenseItem, ExpenseVariations, MinMaxModel } from '../../../shared/expense-data.model';
import { CustomIconService } from '../../../shared/custom-icon.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: [ './results.component.scss' ]
})
export class ResultsComponent implements OnInit, OnChanges {
  @Input() mortgageValue;
  @Input() calculateState;

  public expenseItems: ExpenseItem[];
  public calculatedMortgageExpenses: ExpenseItem[];
  public totalExpenseAmounts: ExpenseVariations;

  private readonly FIRST_ELEMENT = 0;
  private readonly SECOND_ELEMENT = 1;
  private readonly MAX_NATIONAL_MORTGAGE_GUARANTEE_AMOUNT = 31e4;
  private readonly TOTAL_NUMBER_OF_REAL_ESTATE_EXPENSE_SCENARIOS = 12;

  constructor(private customIconService: CustomIconService) {
    this.customIconService.addIcon('approximately', 'approximately.svg');
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        switch (propName) {
          case 'mortgageValue': {
            this.setCalculatedExpenses(Number(changes[ propName ].currentValue));

            this.expenseItems = this.calculatedMortgageExpenses;

            this.setExceededAmountFlag(this.mortgageValue);

            this.totalExpenseAmounts = this.calculateTotal(this.expenseItems);
            break;
          }
        }
      }
    }
  }

  setExceededAmountFlag(mortgageValue) {
    if (mortgageValue > this.MAX_NATIONAL_MORTGAGE_GUARANTEE_AMOUNT) {
      const exceededAmountItem = this.expenseItems.find(expenseElement => expenseElement.exceededAmount === false);

      exceededAmountItem.exceededAmount = true;
      exceededAmountItem.amount.percentage[this.FIRST_ELEMENT] = 0;
      exceededAmountItem.checked = false;
    }
  }

  updateExpenseItemCheckedState() {
    this.totalExpenseAmounts = this.calculateTotal(this.expenseItems);
  }

  calculateTotal(expenseItems: ExpenseItem[]): ExpenseVariations {
    const totalExpenseAmounts: ExpenseVariations = {
      min: 0,
      average: 0,
      max: 0,
    };

    expenseItems.forEach((expenseItem: ExpenseItem) => {
      const expenseVariations = this.calculateExpense(
        expenseItem.amount.bothApplicable,
        expenseItem.amount.costRange,
        expenseItem.amount.percentage,
        expenseItem.checked
      );

      totalExpenseAmounts.min += expenseVariations.min;
      totalExpenseAmounts.average += expenseVariations.average;
      totalExpenseAmounts.max += expenseVariations.max;
    });

    return totalExpenseAmounts;
  }

  calculateExpense(isBothApplicable: boolean, costRange: MinMaxModel, percentage: number[], checked: boolean): ExpenseVariations {
    const firstPercentageElement = percentage[this.FIRST_ELEMENT];
    const secondPercentageElement = percentage[this.SECOND_ELEMENT];
    const checkNotDefined = checked === undefined || checked === null;

    if (checkNotDefined) {
      if (firstPercentageElement === 0) {
        return {
          min: costRange.min,
          average: Math.ceil(( costRange.min + costRange.max ) / 2),
          max: costRange.max
        };
      } else {
        return {
          min: firstPercentageElement,
          average: firstPercentageElement,
          max: firstPercentageElement
        };
      }
    } else {
      if (checked) {
        if (!isBothApplicable) {
          if (firstPercentageElement === 0) {
            return {
              min: costRange.min,
              average: Math.ceil(( costRange.min + costRange.max ) / 2),
              max: costRange.max
            };
          } else {
            return {
              min: firstPercentageElement,
              average: firstPercentageElement,
              max: firstPercentageElement
            };
          }
        } else {
          return {
            min: costRange.min,
            average: this.calculateRealEstateAgencyAverageExpense(costRange, percentage),
            max: costRange.max + secondPercentageElement
          };
        }
      } else {
        return {
          min: 0,
          average: 0,
          max: 0
        };
      }
    }
  }

  calculateRealEstateAgencyAverageExpense(costRange: MinMaxModel, percentage: number[]): number {
    const firstPercentageElement = percentage[ this.FIRST_ELEMENT ];
    const secondPercentageElement = percentage[ this.SECOND_ELEMENT ];
    const minCost = costRange.min;
    const maxCost = costRange.max;
    const averageCost = minCost + maxCost / 2;
    const averagePercentageCost = ( firstPercentageElement + secondPercentageElement ) / 2;

    return Math.ceil((
      ( minCost ) +
      ( averageCost ) +
      ( minCost + firstPercentageElement ) +
      ( minCost + secondPercentageElement ) +
      ( minCost + ( averagePercentageCost ) ) +
      ( maxCost ) +
      ( maxCost + firstPercentageElement ) +
      ( maxCost + secondPercentageElement ) +
      ( maxCost + ( averagePercentageCost ) ) +
      ( ( averageCost ) + firstPercentageElement ) +
      ( ( averageCost ) + secondPercentageElement ) +
      ( ( averageCost ) + ( averagePercentageCost ) )
    ) / this.TOTAL_NUMBER_OF_REAL_ESTATE_EXPENSE_SCENARIOS
    );
  }

  setCalculatedExpenses(mortgageAmount: number): ExpenseItem[] {
    this.calculatedMortgageExpenses = this.createRawExpenseItemsList()
      .map((expenseItem: ExpenseItem) => {
        const expenseElement = {
          name: expenseItem.name,
          info: expenseItem.info,
          compulsory: expenseItem.compulsory,
          taxDeductible: expenseItem.taxDeductible,
          specialExpense: expenseItem.specialExpense,
          checked: expenseItem.checked,
          approximate: expenseItem.approximate,
          exceededAmount: expenseItem.exceededAmount,
        };

        const constRange = {
          costRange: {
            min: expenseItem.amount.costRange.min,
            max: expenseItem.amount.costRange.max,
          },
        };

        const bothApplicable = {
          bothApplicable: expenseItem.amount.bothApplicable,
        };

        if (expenseItem.name === 'Real Estate Agent') {
          return {
            ... expenseElement,
            amount: {
              percentage: [
                Math.floor((expenseItem.amount.percentage[this.FIRST_ELEMENT] / 100) * mortgageAmount),
                Math.floor((expenseItem.amount.percentage[this.SECOND_ELEMENT] / 100) * mortgageAmount)
              ],
              ...constRange,
              ...bothApplicable,
            }
          } as ExpenseItem;
        } else if (expenseItem.name === 'Bank Guarantee') {
          return {
            ... expenseElement,
            amount: {
              percentage: [
                Math.floor((10 / 100) * (expenseItem.amount.percentage[this.FIRST_ELEMENT] / 100) * mortgageAmount)
              ],
              ...constRange,
              ...bothApplicable,
            }
          } as ExpenseItem;
        } else {
          return {
            ... expenseElement,
            amount: {
              percentage: [Math.floor((expenseItem.amount.percentage[this.FIRST_ELEMENT] / 100) * mortgageAmount)],
              ...constRange,
              ...bothApplicable,
            }
          } as ExpenseItem;
        }
      });

    return this.calculatedMortgageExpenses;
  }

  createRawExpenseItemsList(): ExpenseItem[] {
    const expenseItems: ExpenseItem[] = [
      {
        name: 'Financial Advisor',
        amount: {
          percentage: [0],
          costRange: {
            min: 2000,
            max: 5000,
          },
          bothApplicable: false,
        },
        info: 'Prices for a financial advisor can vary from approx. 2,000 euros to more than 5,000 euros.',
        compulsory: true,
        taxDeductible: true,
        approximate: true,
      },
      {
        name: 'Valuation',
        amount: {
          percentage: [0],
          costRange: {
            min: 300,
            max: 800,
          },
          bothApplicable: false,
        },
        info: 'Every bank or lender requires an official valuation report if you’re getting a mortgage. This will cost you somewhere between 300 and 800 euros, depending on the size of the house (the bigger, the more work) and of course the evaluator you choose.',
        compulsory: true,
        taxDeductible: true,
        approximate: true,
      },
      {
        name: 'Civil-Law Notary',
        amount: {
          percentage: [0],
          costRange: {
            min: 900,
            max: 2000,
          },
          bothApplicable: false,
        },
        info: 'You’ll need a notary to legally transfer the property to your name and register it at the land registry. Costs for this will vary from 900 euros to as much as 2,000 euros, depending on the notary.',
        compulsory: true,
        taxDeductible: true,
        approximate: true,
      },
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
        info: 'When you buy a home, you’ll pay 2% of the property value to the government. The only times this charge doesn’t apply are when you’re purchasing a newly built property or when you’re buying a property from a seller who has bought it less than 6 months previously.',
        compulsory: true,
        taxDeductible: false,
      },
      {
        name: 'Organizing Medical Report',
        amount: {
          percentage: [0],
          costRange: {
            min: 125,
            max: 150,
          },
          bothApplicable: false,
        },
        info: 'This expense is related to organizing you medical report and handling files with the authorities.',
        compulsory: true,
        taxDeductible: false,
        approximate: true,
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
        info: 'You’ll need to provide the seller with a 10% deposit once you’ve signed the purchase agreement. If you can’t provide a' +
          ' 10% deposit, you’ll need to get a bank guarantee for that amount. Fees for bank guarantees vary from provider to provider.' +
          ' It is often 1% of the deposit, but some providers charge less or even nothing at all. The notary will deduct these fees' +
          ' upon transfer. You can expect the bank guarantee to cost you between from nothing to 1% of the amount of the guarantee.',
        compulsory: true,
        taxDeductible: false,
      },
      {
        name: 'Structural Survey',
        amount: {
          percentage: [0],
          costRange: {
            min: 250,
            max: 900,
          },
          bothApplicable: false,
        },
        info: 'A structural survey to inspect your home will cost between 250 and 900 euros, depending on the size of the building.',
        compulsory: true,
        taxDeductible: false,
        approximate: true,
      },
      {
        name: 'National Mortgage Guarantee(NHG)',
        amount: {
          percentage: [0.9],
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
        exceededAmount: false,
        checked: true
      },
      {
        name: 'Real Estate Agent',
        amount: {
          percentage: [0.5, 1.5],
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
        approximate: true,
        checked: true
      },
      {
        name: 'Life Insurance',
        amount: {
          percentage: [0],
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
        approximate: true,
        checked: true
      },
      {
        name: 'Contact with Agency',
        amount: {
          percentage: [0],
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
        approximate: true,
        checked: true
      },
      {
        name: 'Translator',
        amount: {
          percentage: [0],
          costRange: {
            min: 250,
            max: 500,
          },
          bothApplicable: false,
        },
        info: 'This expense is for arranging translator while you are signing documents in the civil-law notary.',
        compulsory: false,
        taxDeductible: false,
        specialExpense: true,
        approximate: true,
        checked: true
      },
      {
        name: 'Self-employed Customers',
        amount: {
          percentage: [0],
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
        approximate: true,
        checked: true
      }
    ];

    return expenseItems;
  }

}
