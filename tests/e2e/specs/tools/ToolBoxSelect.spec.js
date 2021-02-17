describe("tools/ToolBoxSelect", () => {
  beforeEach(() => {
    cy.visit("/")
      .get('[data-test="menu-bottom-tool--select-box-move"]')
      .click();
  });

  it("zoom in using the control icons", () => {
    cy.get('[data-test="grapher-field--rect"]').then((field) => {
      const oldWidth = field.get(0).getBoundingClientRect().width;

      // eslint-disable-next-line cypress/require-data-selectors
      cy.get("#svg-pan-zoom-zoom-in").click().click();

      cy.get('[data-test="grapher-field--rect"]')
        .then((field) => {
          cy.wrap(field.get(0).getBoundingClientRect().width);
        })
        .should("greaterThan", oldWidth);
    });
  });

  // #66 - Skipping due to flakey test
  it.skip("shift grapher to the left by panning", () => {
    cy.get('[data-test="grapher-field--rect"]').then((field) => {
      const oldX = field.get(0).getBoundingClientRect().x;
      cy.mousedownGrapher(24, 2, { metaKey: true });
      cy.mousemoveGrapher(8, 2, { metaKey: true });
      cy.mouseupGrapher(8, 2, { metaKey: true });

      cy.get('[data-test="grapher-field--rect"]')
        .then((field) => {
          cy.wrap(field.get(0).getBoundingClientRect().x);
        })
        .should("lessThan", oldX);
    });
  });
  it("Create a selection box", () => {
    cy.get('[data-test="grapher-field--rect"]').then(() => {
      cy.mousedownGrapher(24, 2);
      cy.mousemoveGrapher(8, 6);

      cy.get('[data-test="grapher-tool--selection-lasso"]').then((polyline) => {
        cy.wrap(polyline).should("have.attr", "points");
      });
    });
  });
  it("make sure selection works", () => {
    cy.visit("/").get('[data-test="menu-bottom-tool--add-rm"]').click();
    cy.mousedownGrapher(12, 8).mouseupGrapher(12, 8);
    // should not have selection
    cy.get('[data-test="grapher-dots--dot"]').should("have.length", 1);
    cy.get('[data-test="grapher-dots--dot"][data-test-selected="true"]').should(
      "have.length",
      0
    );
    cy.get('[data-test="menu-bottom-tool--select-box-move"]').click();
    cy.get('[data-test="grapher-field--rect"]').then(() => {
      cy.mousedownGrapher(24, 2);
      cy.mousemoveGrapher(10, 10);
      cy.mouseupGrapher(24, 2);

      cy.get('[data-test="grapher-tool--selection-lasso"]').then((polyline) => {
        cy.wrap(polyline).should("have.attr", "points");
      });
    });
    // should have selection
    cy.get('[data-test="grapher-dots--dot"][data-test-selected="true"]').should(
      "have.length",
      1
    );
  });
});
