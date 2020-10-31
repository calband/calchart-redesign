describe("components/menu-top/MenuTop", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("all dropdowns exist but are hidden", () => {
    cy.get('[data-test="menu-top--file"]')
      .find('[data-test="menu-top--load-show"]')
      .should("not.be.visible");
    cy.get('[data-test="menu-top--file"]')
      .find('[data-test="menu-top--file-edit"]')
      .should("not.be.visible");
    cy.get('[data-test="menu-top--view"]')
      .find('[data-test="menu-top--view-grid"]')
      .should("not.be.visible");
  });

  describe("file dropdown", () => {
    beforeEach(() => {
      cy.get('[data-test="menu-top--file"]').click();
    });

    it("dropdown is visible upon clicking", () => {
      cy.get('[data-test="menu-top--load-show"]').should("be.visible");
      cy.get('[data-test="menu-top--file-edit"]').should("be.visible");
    });

    it("shows selected show title", () => {
      cy.get('[data-test="menu-top--selected-show"]').contains("Example Show");
    });

    it('clicking "Edit Show Details" opens show modal', () => {
      cy.get('[data-test="menu-top--file-modal"]').should("not.be.visible");

      cy.get('[data-test="menu-top--file-edit"]').click();

      cy.get('[data-test="menu-top--file-modal"]').should("be.visible");
    });

    it('clicking "Load Show Details" opens load modal', () => {
      cy.get('[data-test="menu-top--file-modal"]').should("not.be.visible");

      cy.get('[data-test="menu-top--load-show"]').click();

      cy.get('[data-test="menu-top--load-modal"]').should("be.visible");
    });
  });

  describe("view dropdown", () => {
    beforeEach(() => {
      cy.get('[data-test="menu-top--view"]').click();
    });

    it("dropdown is visible upon clicking", () => {
      cy.get('[data-test="menu-top--view-grid"]').should("be.visible");
    });

    it("can toggl 1e four step grid", () => {
      cy.get('[data-test="grapher-field--grid-vertical"]').should("be.visible");

      cy.get('[data-test="grapher-field--grid-horizontal"]').should(
        "be.visible"
      );

      cy.get('[data-test="menu-top--view-grid"]').click();

      cy.get('[data-test="grapher-field--grid-vertical"]').should("not.exist");

      cy.get('[data-test="grapher-field--grid-horizontal"]').should(
        "not.exist"
      );
    });

    it("can toggle yardlines", () => {
      cy.get('[data-test="grapher-field--yard-line"]').should("be.visible");

      cy.get('[data-test="menu-top--view-yardlines"]').click();

      cy.get('[data-test="grapher-field--yard-line"]').should("not.exist");

      cy.get('[data-test="grapher-field--grid-vertical"]').should(
        "have.length",
        47
      );
    });

    it("can toggle yardline numbers", () => {
      cy.get('[data-test="grapher-field--yard-number"]').should("be.visible");

      cy.get('[data-test="menu-top--view-yardline-numbers"]').click();

      cy.get('[data-test="grapher-field--yard-number"]').should("not.exist");
    });
  });
});
