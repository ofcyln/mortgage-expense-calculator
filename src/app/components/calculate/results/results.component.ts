import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

import { ScrollToConfigOptions, ScrollToService } from '@nicky-lenaers/ngx-scroll-to';

import { CustomIconService } from '../../../shared/custom-icon.service';
import { ExpenseItemService } from '../../../shared/expense-item.service';

import { ExpenseItem, ExpenseVariations, MinMaxModel } from '../../../shared/expense-data.model';

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

  constructor(
    private customIconService: CustomIconService,
    private scrollToService: ScrollToService,
    private expenseItemService: ExpenseItemService,
  ) {
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

            this.expenseItemService.setSharedExpenseItems(this.expenseItems);

            if (this.expenseItems) {
              this.totalExpenseAmounts = this.calculateTotal(this.expenseItems);
            }

            break;
          }
        }
      }
    }
  }

  triggerScrollToEnd(): void {
    const config: ScrollToConfigOptions = {
      target: 'scrollToPoint',
      offset: this.MAX_OFFSET_ON_MOBILE,
    };

    this.scrollToService.scrollTo(config);
  }

  setExceededAmountFlag(mortgageValue: number): void {
    if (mortgageValue > this.MAX_NATIONAL_MORTGAGE_GUARANTEE_AMOUNT) {
      const exceededAmountItem = this.expenseItems?.find((expenseElement) => expenseElement.exceededAmount === false);

      if (exceededAmountItem) {
        exceededAmountItem.exceededAmount = true;
        exceededAmountItem.amount.percentage[this.FIRST_ELEMENT] = 0;
        exceededAmountItem.checked = false;
      }
    }
  }

  updateExpenseItemCheckedState(expenseItem: ExpenseItem): void {
    const isRealEstateAgency = expenseItem.name === 'Real Estate Agent';
    const isAgencyHelp = expenseItem.name === 'Contact with Agency';

    const isEstateSelected = isRealEstateAgency && expenseItem.checked;
    const isAgencyHelpSelected = isAgencyHelp && expenseItem.checked;

    const checkEstateAgency: (element: ExpenseItem) => boolean = (element: ExpenseItem) => element.name === 'Real Estate Agent';
    const checkContactAgency: (element: ExpenseItem) => boolean = (element: ExpenseItem) => element.name === 'Contact with Agency';

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
    this.calculatedMortgageExpenses = this.expenseItemService.createRawExpenseItemsList().map((expenseItem: ExpenseItem) => {
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
}
