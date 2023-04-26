describe("Blog app", function () {
  beforeEach(function () {
    cy.visit("http://localhost:3000");
  });
  it("front page can be opened", function () {
    cy.contains("Blogs");
  });

  it("login form opened", function () {
    cy.contains("log in").click();
    cy.get("#username").type("test");
    cy.get("#password").type("word");
    cy.get("#login-button").click();

    cy.contains("test has logged in");

    // it("a new note can be created", function () {
    //   cy.contains("new blog").click();
    //   cy.get("input").type("a blog created by cypress");
    //   cy.contains("save").click();
    //   cy.contains("a blog created by cypress");
    // });
  });
});
