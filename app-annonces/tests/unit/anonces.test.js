 const { multiplicated } = require('../../src/services/annonces');

describe("annonces.js (multiplicated)", () => {
    test("multiplicated(), doit nous retourner pour résultat 8 lorsque mes paramètres sont 2 et 4",  () => {
        expect(multiplicated(2,4)).toBe(8);
    });

    test("multiplicated(), doit rejeter l'opération en cas de test avec des lettres", () => {
        expect(multiplicated("A","B")).toBeFalsy();
    });
});