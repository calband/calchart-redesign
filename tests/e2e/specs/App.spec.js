describe('App.vue', () => {
  it('Menus and grapher exists', () => {
    cy.visit('/');

    cy.get('[data-test="app"]')
      .find('.grapher');

    cy.get('[data-test="app"]')
      .find('.menu-top');

    cy.get('[data-test="app"]')
      .find('.menu-left');

    cy.get('[data-test="app"]')
      .find('.menu-right');
      
    cy.get('[data-test="app"]')
      .find('.menu-bottom');
  });
});
