describe('components/menu-top/LoadModal', () => {
  beforeEach(() => {
    cy.visit('/');

    cy.get('[data-test="menu-top--file"]')
      .click();

    cy.get('[data-test="menu-top--load-show"]')
      .click();

    cy.get('[data-test="menu-top--load-modal"]')
      .should('be.visible');
  });

  it('renders with the defaults', () => {
    cy.get('[data-test="load-model--title"]')
      .should('have.text', ' Load Show ');
    cy.get('[data-test="load-modal--icon"]')
      .should('have.text', 'Click to load');
    cy.get('[data-test="load-modal--import"]')
      .should('not.be.enabled');
    cy.get('[data-test="load-modal--close"]')
      .should('be.visible');
  });

  // I'm leaving this in as a reference to how we can get this working.
  // see issue [#50 Figure out how to do LoadShow in e2e testing].
  // it('load a file', () => {
  //     cy.fixture('calchart35-simple.shw', 'hex').as('showdata');
  //     cy.get('input[type=file]').then(function(el) {
  //       // convert the logo base64 string to a blob
  //       return Cypress.Blob.base64StringToBlob(this.showdata)
  //         .then((blob) => {
  //           // pass the blob to the fileupload jQuery plugin
  //           // used in your application's code
  //           // which initiates a programmatic upload
  //           // not sure what to do next?
  //           el.files[0] = blob;//('add', { files: blob })
  //         })
  //     })
  // });

  it('closes upon clicking "close"', () => {
    cy.get('[data-test="load-modal--close"]')
      .click();

    cy.get('[data-test="load-modal"]')
      .should('not.be.visible');
  });

});
