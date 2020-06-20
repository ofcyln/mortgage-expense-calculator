/// <reference types="cypress" />

context('Calculate', () => {
  beforeEach(() => {
    cy.visit('/');
  })

  it('URL should redirect to /calculate', () => {
    cy.location().should((location) => {
      expect(location.pathname).to.eq('/calculate');
    })
    // // https://on.cypress.io/hash
    // cy.hash().should('be.empty')
  })
  //
  // it('cy.location() - get window.location', () => {
  //   // https://on.cypress.io/location
  //   cy.location().should((location) => {
  //     expect(location.hash).to.be.empty
  //     expect(location.href).to.eq('https://example.cypress.io/commands/location')
  //     expect(location.host).to.eq('example.cypress.io')
  //     expect(location.hostname).to.eq('example.cypress.io')
  //     expect(location.origin).to.eq('https://example.cypress.io')
  //     expect(location.pathname).to.eq('/commands/location')
  //     expect(location.port).to.eq('')
  //     expect(location.protocol).to.eq('https:')
  //     expect(location.search).to.be.empty
  //   })
  // })
  //
  // it('cy.url() - get the current URL', () => {
  //   // https://on.cypress.io/url
  //   cy.url().should('eq', 'https://example.cypress.io/commands/location')
  // })
})
