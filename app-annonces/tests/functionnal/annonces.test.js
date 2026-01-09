const request = require('supertest');
const app = require('../../src/app');

describe("POST /annonces/mutiplicate",  () => {
    test("Retourne le résultat 8 pour l'opération 2x4", async () => {
        const result = await request(app)
            .post("/annonces/multiplicate")
            .send({ items: [2,4] })
            .expect(200);
        
        expect(result.body).toEqual({ result: 8 });
    });

    test("Retourne un code erreur 400 si j'envoi des items au mauvais format", async () => {
        await request(app)
            .post("/annonces/multiplicate")
            .send({ items: ["A", "B"] })
            .expect(400);
    })
});