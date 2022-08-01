/// <reference types="cypress" />
import { faker } from "@faker-js/faker";

const URL = "http://localhost:3000";

describe("home tests suite", () => {
    it("should be able insert recommendations", () => {
        const recommendation = {
            name: faker.lorem.words(),
            youtubeLink: "https://www.youtube.com/watch?v=" + faker.random.alphaNumeric(11),
        }

        cy.visit(URL);
        cy.get(".createName").type(recommendation.name);
        cy.get(".createURL").type(recommendation.youtubeLink);
        cy.get(".sendCreate").click()
    });

    it("shoud be able upvote recommendation", () => {
        cy.visit(URL);
        cy.get(".arrow-up").first().click();
    });

    it("shoud be able downvote recommendation", () => {
        cy.visit(URL);
        cy.get(".arrow-down").last().click();
    });

    it("should be able go to ranking page", () => {
        cy.visit(URL);
        cy.contains("Top").click();

        cy.url().should("equal", `${URL}/top`);
    });

    it("should be able go to random page", () => {
        cy.visit(URL);
        cy.contains("Random").click();

        cy.url().should("equal", `${URL}/random`);
    });
})