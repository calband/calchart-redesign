describe("components/menu-left/StuntSheetModal", () => {
  beforeEach(() => {
    cy.visit("/");

    cy.get('[data-test="menu-left--ss"]').find(".stuntsheet-edit").click();

    cy.get('[data-test="menu-left--ss-modal"]').should("be.visible");
  });

  it("Setting the title", () => {
    cy.get('[data-test="ss-modal--title"]')
      .should("have.value", "")
      .type("Sunrise");

    cy.get('[data-test="ss-modal--close"]').click();

    cy.get('[data-test="menu-left--ss"]').should("include.text", "Sunrise");
  });

  it("Setting the beats", () => {
    cy.get('[data-test="ss-modal--beats"]')
      .should("have.value", "16")
      .clear()
      .type("2");

    cy.get('[data-test="ss-modal--close"]').click();

    cy.get('[data-test="menu-left--beat"]').should("include.text", "1 / 2");
  });

  it("Can delete a stuntsheet if there is more than one", () => {
    cy.get('[data-test="ss-modal--delete"]').should("not.exist");

    cy.get('[data-test="ss-modal--title"]')
      .should("have.value", "")
      .type("Sunrise");

    cy.get('[data-test="ss-modal--close"]').click();

    cy.get('[data-test="menu-left--add-ss"]').click();

    cy.get('[data-test="menu-left--ss"]')
      .should("have.length", 2)
      .first()
      .should("include.text", "Sunrise")
      .find(".stuntsheet-edit")
      .click({ force: true }); // The icon is hidden so we must force

    cy.get('[data-test="ss-modal--delete"]').click();

    cy.get('[data-test="menu-left--ss"]')
      .should("have.length", 1)
      .should("not.include.text", "Sunrise");
  });
});
