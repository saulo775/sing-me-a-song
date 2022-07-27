import { recommendationRepository } from './../src/repositories/recommendationRepository';
import supertest from "supertest";
import { faker } from "@faker-js/faker";
import app from "../src/app";
import { prisma } from "../src/database";

const NAME = faker.name.jobTitle();
const YOUTUBE_LINK = 'https://www.youtube.com/watch?v=XhUWLTNeNPs&t=37s';
const RECOMMENDATION = { name: NAME, youtubeLink: YOUTUBE_LINK }
const AMOUNT = faker.random.numeric(1);


describe("recommendation test suite", () => {
    beforeEach(async () => {
        await prisma.$executeRaw`DELETE FROM recommendations`
    });

    it("given name and youtube link, create recommendation", async () => {
        const response = await supertest(app).post("/recommendations/").send(RECOMMENDATION);
        expect(response.statusCode).toBe(201);
    });

    it("given name and youtube link, do not create if a recommendation with the same name already exists", async () => {
        await supertest(app).post("/recommendations/").send(RECOMMENDATION);
        const response = await supertest(app).post("/recommendations/").send(RECOMMENDATION);
        expect(response.statusCode).toBe(409);
    });

    it("should be able, get first ten recommendations", async () => {
        await supertest(app).post("/recommendations/").send(RECOMMENDATION);
        const response = await supertest(app).get("/recommendations/");

        const recommendations = response.body.recommendations
        expect(recommendations).not.toBeNull();
    });

    it("should be able, get random recommendations", async () => {
        await supertest(app).post("/recommendations/").send(RECOMMENDATION);
        const response = await supertest(app).get("/recommendations/random");
        const recommendations = response.body.recommendations;

        expect(recommendations).not.toBeNull();
    });

    it("given amount, take this amount recommendations", async () => {
        await supertest(app).post("/recommendations/").send(RECOMMENDATION);
        const response = await supertest(app).get(`/recommendations/top/${AMOUNT}`);
        const recommendations = response.body.recommendations;

        expect(recommendations).not.toBeNull();
    });

    it("given id, take this especific recommendation", async () => {
        await supertest(app).post("/recommendations/").send(RECOMMENDATION);
        const rec = await recommendationRepository.findByName(NAME);

        const response = await supertest(app).get(`/recommendations/${rec.id}`);
        const recommendation = response.body.recommendations;

        expect(rec).not.toBeNull();
    });

    it("should be able to upvote a link by its id", async () => {
        await supertest(app).post("/recommendations/").send(RECOMMENDATION);
        const rec = await recommendationRepository.findByName(NAME);

        const response = await supertest(app).post(`/recommendations/${rec.id}/upvote`);

        expect(response.statusCode).toBe(200);
    });

    it("should be able to upvote a link by its id", async () => {
        await supertest(app).post("/recommendations/").send(RECOMMENDATION);
        const rec = await recommendationRepository.findByName(NAME);

        const response = await supertest(app).post(`/recommendations/${rec.id}/downvote`);

        expect(response.statusCode).toBe(200);
    });


});