import Show from '@/models/Show';

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

  it('window.app exists for e2e tests and can commit mutations', () => {
    cy.visit('/');

    const mockShow = new Show({ title: 'Frozen 2 Show' });

    cy.getStore()
      .should('not.to.be.undefined')
      .then((store) => {
        store.commit('setShow', mockShow);
      });

    cy.get('[data-test="menu-top--file"]')
      .click();

    cy.get('[data-test="menu-top--selected-show"]')
      .contains('Frozen 2 Show');
  });
});
