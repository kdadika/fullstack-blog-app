describe("Blog", function () {
  beforeEach(function () {
    cy.visit("http://localhost:3000");
  });
  it("front page can be opened", function () {
    cy.contains("Blogs");
    cy.contains("Login").click();
    cy.contains("Log in to application");
  });
  describe("Login", function () {
    it("succeeds with correct credentials", function () {
      cy.contains("Login").click();
      cy.get("#username").type("test");
      cy.get("#password").type("word");
      cy.get("#login-btn").click();

      cy.contains("bob logged in");
    });

    it("fails with login", function () {
      cy.contains("Login").click();
      cy.get("#username").type("test");
      cy.get("#password").type("wrong");
      cy.get("#login-btn").click();
      cy.get(".error")
        .should("contain", "Wrong credentials")
        .and("have.css", "color", "rgb(255, 0, 0)")
        .and("have.css", "border-style", "solid");

      cy.get("html").should("not.contain", "bob logged in");
    });
  });
  describe("When logged in", function () {
    beforeEach(function () {
      cy.contains("Login").click();
      cy.get("#username").type("test");
      cy.get("#password").type("word");
      cy.get("#login-btn").click();
    });

    it("A blog can be created", function () {
      cy.contains("new blog").click();
      cy.get("#title").type("cypress test blog");
      cy.get("#author").type("joe");
      cy.get("#url").type("www.testthis.com");

      cy.contains("create").click();
      cy.contains("cypress test blog");
    });

    it("A blog can be liked", function () {
      cy.contains("cypress test blog").parent().contains("view").click();
      cy.get("#like-btn").click();
    });

    it("A blog can be deleted", function () {
      cy.contains("cypress test blog").parent().find("button").click();
      cy.get("#delete-btn").click();
    });

    it("they are ordered by the number of likes in descending order", function () {
      cy.get(".blog").eq(0).should("contain", "Best Cat Breeds");
      cy.get(".blog").eq(1).should("contain", "Blog");
      cy.get(".blog").eq(2).should("contain", "Bobby");
    });
  });
});
