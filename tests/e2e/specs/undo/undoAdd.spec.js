describe("undo/add", () => {
  beforeEach(() => {
    cy.visit("/")
      .get('[data-test="menu-bottom-tools-tool--select-box-move"]')
      .click();
  });
  it("clicking add, undo, should have no dot, then redo has dot", () => {
    cy.get('[data-test="grapher-dots--dot"]').should("not.exist");

    cy.get('[data-test="menu-bottom-undo-tool--undo"]').should("be.disabled");
    cy.get('[data-test="menu-bottom-undo-tool--redo"]').should("be.disabled");

    cy.get('[data-test="menu-bottom-tools-tool--add-rm"]').click();

    cy.mousedownGrapher(12, 8).mouseupGrapher(12, 8);

    cy.get('[data-test="grapher-dots--dot"]').should("have.length", 1);
    cy.get('[data-test="menu-bottom-undo-tool--undo"]').should("be.enabled");
    cy.get('[data-test="menu-bottom-undo-tool--redo"]').should("be.disabled");

    cy.get('[data-test="menu-bottom-undo-tool--undo"]').click();

    cy.get('[data-test="grapher-dots--dot"]').should("not.exist");
    cy.get('[data-test="menu-bottom-undo-tool--undo"]').should("be.disabled");
    cy.get('[data-test="menu-bottom-undo-tool--redo"]').should("be.enabled");

    cy.get('[data-test="menu-bottom-undo-tool--redo"]').click();

    cy.get('[data-test="grapher-dots--dot"]').should("have.length", 1);
    cy.get('[data-test="menu-bottom-undo-tool--undo"]').should("be.enabled");
    cy.get('[data-test="menu-bottom-undo-tool--redo"]').should("be.disabled");
  });

  it("clicking add, change cont, undo, undo, redo, redo should do cont", () => {
    cy.get('[data-test="menu-bottom-tools-tool--add-rm"]').click();

    cy.mousedownGrapher(12, 8).mouseupGrapher(12, 8);

    cy.get('[data-test="grapher-dots--dot"]').should("have.length", 1);

    cy.get('[data-test="cont-in-place--march-type"]')
      .should("have.length", 1)
      .should("have.value", "HS");

    cy.get('[data-test="cont-in-place--march-type"]').select("MM");
    cy.get('[data-test="cont-in-place--march-type"]')
      .should("have.length", 1)
      .should("have.value", "MM");

    cy.get('[data-test="menu-bottom-undo-tool--undo"]').click();
    cy.get('[data-test="menu-bottom-undo-tool--undo"]').click();

    cy.get('[data-test="grapher-dots--dot"]').should("not.exist");

    cy.get('[data-test="menu-bottom-undo-tool--redo"]').click();
    cy.get('[data-test="menu-bottom-undo-tool--redo"]').click();

    cy.get('[data-test="cont-in-place--march-type"]')
      .should("have.length", 1)
      .should("have.value", "MM");
  });
});
