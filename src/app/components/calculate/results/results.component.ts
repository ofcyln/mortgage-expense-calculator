import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

import { ExpenseItem, ExpenseVariations, MinMaxModel } from '../../../shared/expense-data.model';
import { CustomIconService } from '../../../shared/custom-icon.service';
import { ScrollToConfigOptions, ScrollToService } from '@nicky-lenaers/ngx-scroll-to';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
})
export class ResultsComponent implements OnInit, OnChanges {
  @Input() mortgageValue!: string;
  @Input() calculateState!: boolean;

  public expenseItems!: ExpenseItem[];
  public calculatedMortgageExpenses!: ExpenseItem[];
  public totalExpenseAmounts!: ExpenseVariations;

  private readonly FIRST_ELEMENT = 0;
  private readonly SECOND_ELEMENT = 1;
  private readonly MAX_NATIONAL_MORTGAGE_GUARANTEE_AMOUNT = 31e4;
  private readonly TOTAL_NUMBER_OF_REAL_ESTATE_EXPENSE_SCENARIOS = 12;
  private readonly MAX_OFFSET_ON_MOBILE = 5e3;

  constructor(private customIconService: CustomIconService, private scrollToService: ScrollToService) {
    this.customIconService.addIcon('approximately', 'approximately.svg');
  }

  ngOnInit(): void {
    this.triggerScrollToEnd();
  }

  ngOnChanges(changes: SimpleChanges): void {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        switch (propName) {
          case 'mortgageValue': {
            this.setCalculatedExpenses(Number(changes[propName].currentValue));

            this.expenseItems = this.calculatedMortgageExpenses;

            this.setExceededAmountFlag(Number(this.mortgageValue));

            if (this.expenseItems) {
              this.totalExpenseAmounts = this.calculateTotal(this.expenseItems);
            }

            break;
          }
        }
      }
    }
  }

  triggerScrollToEnd() {
    const config: ScrollToConfigOptions = {
      target: 'scrollToPoint',
      offset: this.MAX_OFFSET_ON_MOBILE,
    };

    this.scrollToService.scrollTo(config);
  }

  setExceededAmountFlag(mortgageValue: number) {
    if (mortgageValue > this.MAX_NATIONAL_MORTGAGE_GUARANTEE_AMOUNT) {
      const exceededAmountItem = this.expenseItems?.find((expenseElement) => expenseElement.exceededAmount === false);

      if (exceededAmountItem) {
        exceededAmountItem.exceededAmount = true;
        exceededAmountItem.amount.percentage[this.FIRST_ELEMENT] = 0;
        exceededAmountItem.checked = false;
      }
    }
  }

  updateExpenseItemCheckedState(expenseItem: ExpenseItem) {
    const isRealEstateAgency = expenseItem.name === 'Real Estate Agent';
    const isAgencyHelp = expenseItem.name === 'Contact with Agency';

    const isEstateSelected = isRealEstateAgency && expenseItem.checked;
    const isAgencyHelpSelected = isAgencyHelp && expenseItem.checked;

    const checkEstateAgency = (element: ExpenseItem) => element.name === 'Real Estate Agent';
    const checkContactAgency = (element: ExpenseItem) => element.name === 'Contact with Agency';

    if (isEstateSelected) {
      const contactAgencyElementIndex = this.expenseItems.findIndex(checkContactAgency);

      if (this.expenseItems[contactAgencyElementIndex].checked) {
        this.expenseItems[contactAgencyElementIndex].checked = false;
      }
    }

    if (isAgencyHelpSelected) {
      const realEstateAgencyElementIndex = this.expenseItems.findIndex(checkEstateAgency);
      if (this.expenseItems[realEstateAgencyElementIndex].checked) {
        this.expenseItems[realEstateAgencyElementIndex].checked = false;
      }
    }

    this.totalExpenseAmounts = this.calculateTotal(this.expenseItems);
  }

  calculateTotal(expenseItems: ExpenseItem[]): ExpenseVariations {
    const totalExpenseAmounts: ExpenseVariations = {
      min: 0,
      average: 0,
      max: 0,
    };

    if (expenseItems) {
      expenseItems.forEach((expenseItem: ExpenseItem) => {
        const expenseVariations = this.calculateExpense(
          expenseItem.amount.bothApplicable,
          expenseItem.amount.costRange,
          expenseItem.amount.percentage,
          expenseItem.checked,
        );

        totalExpenseAmounts.min += expenseVariations.min;
        totalExpenseAmounts.average += expenseVariations.average;
        totalExpenseAmounts.max += expenseVariations.max;
      });
    }

    return totalExpenseAmounts;
  }

  calculateExpense(isBothApplicable: boolean, costRange: MinMaxModel, percentage: number[], checked?: boolean): ExpenseVariations {
    const firstPercentageElement = percentage[this.FIRST_ELEMENT];
    const secondPercentageElement = percentage[this.SECOND_ELEMENT];
    const checkNotDefined = checked === undefined || checked === null;

    if (checkNotDefined) {
      if (firstPercentageElement === 0) {
        return {
          min: costRange.min,
          average: Math.ceil((costRange.min + costRange.max) / 2),
          max: costRange.max,
        };
      } else {
        return {
          min: firstPercentageElement,
          average: firstPercentageElement,
          max: firstPercentageElement,
        };
      }
    } else {
      if (checked) {
        if (!isBothApplicable) {
          if (firstPercentageElement === 0) {
            return {
              min: costRange.min,
              average: Math.ceil((costRange.min + costRange.max) / 2),
              max: costRange.max,
            };
          } else {
            return {
              min: firstPercentageElement,
              average: firstPercentageElement,
              max: firstPercentageElement,
            };
          }
        } else {
          return {
            min: costRange.min,
            average: this.calculateRealEstateAgencyAverageExpense(costRange, percentage),
            max: costRange.max + secondPercentageElement,
          };
        }
      } else {
        return {
          min: 0,
          average: 0,
          max: 0,
        };
      }
    }
  }

  calculateRealEstateAgencyAverageExpense(costRange: MinMaxModel, percentage: number[]): number {
    const firstPercentageElement = percentage[this.FIRST_ELEMENT];
    const secondPercentageElement = percentage[this.SECOND_ELEMENT];
    const minCost = costRange.min;
    const maxCost = costRange.max;
    const averageCost = minCost + maxCost / 2;
    const averagePercentageCost = (firstPercentageElement + secondPercentageElement) / 2;

    return Math.ceil(
      (minCost +
        averageCost +
        (minCost + firstPercentageElement) +
        (minCost + secondPercentageElement) +
        (minCost + averagePercentageCost) +
        maxCost +
        (maxCost + firstPercentageElement) +
        (maxCost + secondPercentageElement) +
        (maxCost + averagePercentageCost) +
        (averageCost + firstPercentageElement) +
        (averageCost + secondPercentageElement) +
        (averageCost + averagePercentageCost)) /
        this.TOTAL_NUMBER_OF_REAL_ESTATE_EXPENSE_SCENARIOS,
    );
  }

  setCalculatedExpenses(mortgageAmount: number): ExpenseItem[] {
    this.calculatedMortgageExpenses = this.createRawExpenseItemsList().map((expenseItem: ExpenseItem) => {
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
          ...expenseElement,
          amount: {
            percentage: [
              Math.floor((expenseItem.amount.percentage[this.FIRST_ELEMENT] / 100) * mortgageAmount),
              Math.floor((expenseItem.amount.percentage[this.SECOND_ELEMENT] / 100) * mortgageAmount),
            ],
            ...constRange,
            ...bothApplicable,
          },
        } as ExpenseItem;
      } else if (expenseItem.name === 'Bank Guarantee') {
        return {
          ...expenseElement,
          amount: {
            percentage: [Math.floor((10 / 100) * (expenseItem.amount.percentage[this.FIRST_ELEMENT] / 100) * mortgageAmount)],
            ...constRange,
            ...bothApplicable,
          },
        } as ExpenseItem;
      } else {
        return {
          ...expenseElement,
          amount: {
            percentage: [Math.floor((expenseItem.amount.percentage[this.FIRST_ELEMENT] / 100) * mortgageAmount)],
            ...constRange,
            ...bothApplicable,
          },
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
            max: 4000,
          },
          bothApplicable: false,
        },
        info:
          'Mortgages can either be taken out directly from a bank (or other institution), or via an intermediary such as a financial advisor. Both banks and/or financial advisor charge you between 2,000 euros to more than 4,000 euros.',
        compulsory: true,
        taxDeductible: true,
        approximate: true,
      },
      {
        name: 'Valuation Report',
        amount: {
          percentage: [0],
          costRange: {
            min: 300,
            max: 800,
          },
          bothApplicable: false,
        },
        info:
          'Also known as (Appraisal report). Every bank or lender requires an official valuation report if you’re getting a mortgage. A local, certified appraiser visits the property and creates an valuation report about the property. This report will be required for your mortgage and is accepted by all banks. This will cost you somewhere between 300 euros to 800 euros, depending on the size of the house (the bigger, the more work) and of course the evaluator you choose.',
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
        info:
          'You’ll need a notary to legally transfer the property to your name and register it at the land registry. Civil-Law Notary fees including deed of property conveyance (kosten leveringsakte) and mortgage contract (hypotheekakte). Costs for this will vary from 900 euros to 2,000 euros, depending on the notary.',
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
        info:
          'When you buy a home, you’ll pay 2% of the property value to the government. The only times this charge doesn’t apply are when you’re purchasing a newly built property or when you’re buying a property from a seller who has bought it less than 6 months previously.',
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
        info:
          'This expense is related to organizing your medical report and handling files with the authorities. The financial advisor handles your files and charges you between 125 euros to 150 euros.',
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
        name: 'Structural Survey',
        amount: {
          percentage: [0],
          costRange: {
            min: 250,
            max: 900,
          },
          bothApplicable: false,
        },
        info:
          'Also known as (Building Report). A building inspector who visits and checks the condition of the property and delivers an extensive construction report detailing short, medium and long term maintenance costs. A structural survey to inspect your home will cost between 250 and 900 euros, depending on the size of the building.',
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
        info:
          'NHG is a protection against residual debt if you can’t pay your mortgage due to unemployment, divorce or the inability to work. It will cost you 0.9% of the mortgage amount, but you’ll earn your money back quickly because lenders offer much lower interest rates if you make use of this protection. NHG is only available for mortgages up to maximum 310,000 euros as of 2020.',
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
            min: 500,
            max: 3000,
          },
          bothApplicable: true,
        },
        info:
          'You may wish to hire a real estate agent for help finding a house and negotiating the price. Some agents charge a fixed fee that’s usually between 500 and 3,000 euros. Others charge between 0.5% and 1.5% of the property value. Some charge both.',
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
            min: 250,
            max: 350,
          },
          bothApplicable: false,
        },
        info:
          "Handling documents for a life insurance policy application can be made by the financial advisor or by you. You can also buy another life insurance policy for your partner as well. A life insurance's first-time payment costs to you generally between 250 euros to 350 euros for per person.",
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
            min: 350,
            max: 500,
          },
          bothApplicable: false,
        },
        info:
          'Contacting the selling estate agent when buying without an estate agent (makelaar) and checking the purchase agreement on your behalf by a financial advisor. This cost range differs for each financial advisor. It costs you between 350 euros to 500 euros.',
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
            min: 250,
            max: 500,
          },
          bothApplicable: false,
        },
        info:
          'This expense is for arranging a translator while you are signing documents in the civil-law notary. Translators work hourly and they will probably bill you for a couple of hours work between 250 euros to 500 euros.',
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
            min: 475,
            max: 500,
          },
          bothApplicable: false,
        },
        info: 'Additional fee due before handling your files. It costs you between the amount of 475 euros to 500 euros.',
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
            min: 400,
            max: 600,
          },
          bothApplicable: false,
        },
        info:
          "Arranging a mortgage for existing house owners. It's being handled by financial advisor and it costs you between the amount of 475 euros to 500 euros.",
        compulsory: false,
        taxDeductible: false,
        specialExpense: true,
        approximate: true,
        checked: false,
      },
    ];

    return expenseItems;
  }
}
