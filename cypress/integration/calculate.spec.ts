/// <reference types="cypress" />

context('Calculate', () => {
  beforeEach(() => {
    cy.visit('/');
  })

  it('URL should redirect to /calculate', () => {
    cy.location().should((location) => {
      expect(location.pathname).to.eq('/calculate');
    })
  })

  it('Input area should not accept rather than numeric values', () => {
    cy.get('[data-mortgage-amount]')
      .type('amount').should('have.value', '');
  });

  it('Input area should only accept numeric values and value needs to be separated with decimal separator', () => {
    cy.get('[data-mortgage-amount]')
      .type('300000', { delay: 100 })
      .should('have.value', '300,000');
  });

  it('\'Calculate\' button should not work when there is no value in input area', () => {
    cy.get('[data-mortgage-amount]')
      .type(' ').should('have.value', '');

    cy.get('[data-calculate-button]')
      .click()
      .should('have.attr', 'data-calculate-button')
  });

  it('\'Calculate\' button should work when there is numeric value in input area', () => {
    cy.get('[data-mortgage-amount]')
      .type('300000', { delay: 100 });

    cy.get('[data-calculate-button]')
      .click()
    cy.get('mat-card')
      .should('have.class', 'mat-card');
  });
})
