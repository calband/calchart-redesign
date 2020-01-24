describe('App.vue', () => {
  it('Menus and grapher exists', () => {
    cy.visit('/')
      .get('#app')
      .find('.grapher');
    cy.get('#app')
      .find('.menu-top');
    cy.get('#app')
      .find('.menu-left');
    cy.get('#app')
      .find('.menu-right');
    cy.get('#app')
      .find('.menu-bottom');
  });

  it('window.app exists for e2e tests', () => {
    cy.visit('/');

    cy.window()
      .its('app.$store')
      .should('not.to.be.undefined');
  });
});
