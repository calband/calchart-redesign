describe("tools/ToolSingleDot", () => {
  beforeEach(() => {
    cy.visit("/").get('[data-test="menu-bottom-tools-tool--add-rm"]').click();
  });

  it("clicking adds, then removes a dot", () => {
    cy.get('[data-test="grapher-dots--dot"]').should("not.exist");

    cy.mousedownGrapher(12, 8).mouseupGrapher(12, 8);

    cy.get('[data-test="grapher-dots--dot"]')
      .should("have.length", 1)
      .should("have.attr", "transform", "translate(12, 8)");

    cy.get('[data-test="dot--dottext"]')
      .should("have.length", 1)
      .should("have.attr", "y", "-1");
    cy.get('[data-test="dot--dottext"]').contains("0");

    cy.mousedownGrapher(12, 8).mouseupGrapher(12, 8);

    cy.get('[data-test="grapher-dots--dot"]').should("not.exist");
  });

  it("After panning and zooming, adding a dot is still accurate", () => {
    cy.get('[data-test="menu-bottom-tools-tool--select-box-move').click();

    // eslint-disable-next-line cypress/require-data-selectors
    cy.get("#svg-pan-zoom-zoom-out").click().click();

    cy.mousedownGrapher(8, 2);
    cy.mousemoveGrapher(24, 2);
    cy.mouseupGrapher(24, 2);

    cy.get('[data-test="menu-bottom-tools-tool--add-rm"]').click();

    cy.mousedownGrapher(12, 8).mouseupGrapher(12, 8);

    cy.get('[data-test="grapher-dots--dot"]')
      .should("have.length", 1)
      .should("have.attr", "transform", "translate(12, 8)");
    cy.get('[data-test="dot--dottext"]')
      .should("have.length", 1)
      .should("have.attr", "y", "-1");
  });

  it("clicking multiple dots", () => {
    cy.get('[data-test="grapher-dots--dot"]').should("not.exist");

    cy.mousedownGrapher(2, 0).mouseupGrapher(2, 0);
    cy.mousedownGrapher(2, 2).mouseupGrapher(2, 2);
    cy.mousedownGrapher(2, 4).mouseupGrapher(2, 4);
    cy.mousedownGrapher(2, 6).mouseupGrapher(2, 6);
    cy.mousedownGrapher(2, 8).mouseupGrapher(2, 8);

    cy.get('[data-test="grapher-dots--dot"]')
      .should("have.length", 5)
      .each((dot, index) => {
        cy.wrap(dot).should(
          "have.attr",
          "transform",
          `translate(2, ${index * 2})`
        );
      });

    cy.mousedownGrapher(2, 0).mouseupGrapher(2, 0);
    cy.mousedownGrapher(2, 8).mouseupGrapher(2, 8);

    cy.get('[data-test="grapher-dots--dot"]')
      .should("have.length", 3)
      .each((dot, index) => {
        cy.wrap(dot).should(
          "have.attr",
          "transform",
          `translate(2, ${(index + 1) * 2})`
        );
      });
  });

  it("mousemove sets tool dots", () => {
    cy.get('[data-test="grapher-tool--dot"]').should("not.exist");

    cy.mousemoveGrapher(4, 6);

    cy.get('[data-test="grapher-tool--dot"]')
      .should("have.length", 1)
      .should("have.attr", "cx", "4")
      .should("have.attr", "cy", "6");

    cy.mousemoveGrapher(6, 8);

    cy.get('[data-test="grapher-tool--dot"]')
      .should("have.length", 1)
      .should("have.attr", "cx", "6")
      .should("have.attr", "cy", "8");
  });

  it("clicking add should clear out selection", () => {
    cy.get('[data-test="grapher-dots--dot"]').should("not.exist");

    cy.mousedownGrapher(12, 8).mouseupGrapher(12, 8);

    cy.mousedownGrapher(16, 12).mouseupGrapher(16, 12);

    cy.get('[data-test="grapher-dots--dot"]').should("have.length", 2);
    cy.get('[data-test="grapher-dots--dot"][data-test-selected="true"]').should(
      "have.length",
      0
    );

    cy.get('[data-test="menu-bottom-tools-tool--select-box-move').click();

    cy.mousedownGrapher(16, 12).mouseupGrapher(16, 12);

    cy.get('[data-test="grapher-dots--dot"]').should("have.length", 2);
    cy.get('[data-test="grapher-dots--dot"][data-test-selected="true"]').should(
      "have.length",
      1
    );

    cy.get('[data-test="menu-bottom-tools-tool--add-rm').click();

    cy.mousedownGrapher(20, 16).mouseupGrapher(20, 16);

    cy.get('[data-test="grapher-dots--dot"]').should("have.length", 3);
    cy.get('[data-test="grapher-dots--dot"][data-test-selected="true"]').should(
      "have.length",
      0
    );
  });

  it("moving a dot should move it and keep it selected", () => {
    cy.get('[data-test="grapher-dots--dot"]').should("not.exist");
    cy.mousedownGrapher(12, 8).mouseupGrapher(12, 8);

    cy.get('[data-test="grapher-dots--dot"]').should("have.length", 1);
    cy.get('[data-test="grapher-dots--dot"]')
      .should("have.length", 1)
      .should("have.attr", "transform", "translate(12, 8)");
    cy.get('[data-test="grapher-dots--dot"][data-test-selected="true"]').should(
      "have.length",
      0
    );

    cy.get('[data-test="menu-bottom-tools-tool--select-box-move').click();

    cy.mousedownGrapher(12, 8).mouseupGrapher(12, 8);

    cy.get('[data-test="grapher-dots--dot"]').should("have.length", 1);
    cy.get('[data-test="grapher-dots--dot"][data-test-selected="true"]').should(
      "have.length",
      1
    );

    cy.mousedownGrapher(12, 8);
    cy.mousemoveGrapher(10, 10);

    cy.get('[data-test="grapher-dots--dot"]').should("have.length", 1);
    cy.get('[data-test="grapher-dots--dot"]')
      .should("have.length", 1)
      .should("have.attr", "transform", "translate(12, 8)");
    cy.get('[data-test="grapher-dots--dot"][data-test-selected="true"]').should(
      "have.length",
      1
    );
    cy.get('[data-test="grapher-tool--dot"]')
      .should("have.length", 1)
      .should("have.attr", "cx", "10")
      .should("have.attr", "cy", "10");

    cy.mouseupGrapher(10, 10);

    cy.get('[data-test="grapher-tool--dot"]').should("have.length", 0);
    cy.get('[data-test="grapher-dots--dot"]').should("have.length", 1);
    cy.get('[data-test="grapher-dots--dot"]')
      .should("have.length", 1)
      .should("have.attr", "transform", "translate(10, 10)");
    cy.get('[data-test="grapher-dots--dot"][data-test-selected="true"]').should(
      "have.length",
      1
    );
  });
  it("clicking between box and lasso should not clear out selection", () => {
    cy.get('[data-test="grapher-dots--dot"]').should("not.exist");

    cy.mousedownGrapher(12, 8).mouseupGrapher(12, 8);

    cy.mousedownGrapher(16, 12).mouseupGrapher(16, 12);

    cy.get('[data-test="grapher-dots--dot"]').should("have.length", 2);
    cy.get('[data-test="grapher-dots--dot"][data-test-selected="true"]').should(
      "have.length",
      0
    );

    cy.get('[data-test="menu-bottom-tools-tool--select-box-move').click();

    cy.mousedownGrapher(16, 12).mouseupGrapher(16, 12);

    cy.get('[data-test="grapher-dots--dot"]').should("have.length", 2);
    cy.get('[data-test="grapher-dots--dot"][data-test-selected="true"]').should(
      "have.length",
      1
    );

    cy.get('[data-test="menu-bottom-tools-tool--select-lasso-move').click();

    cy.get('[data-test="grapher-dots--dot"]').should("have.length", 2);
    cy.get('[data-test="grapher-dots--dot"][data-test-selected="true"]').should(
      "have.length",
      1
    );

    cy.get('[data-test="menu-bottom-tools-tool--select-box-move').click();

    cy.get('[data-test="grapher-dots--dot"]').should("have.length", 2);
    cy.get('[data-test="grapher-dots--dot"][data-test-selected="true"]').should(
      "have.length",
      1
    );
  });
});
