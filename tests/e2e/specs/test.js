// https://docs.cypress.io/api/introduction/api.html

describe('Update these tests!', () => {
  it('Grapher exists', () => {
    cy.visit('/')
      .get('#app')
      .find('.grapher');
  });
});
