import supertest from "supertest";
import { app }  from "./serve";

describe("GET /coordinates", () => {
  it("request", async () => {
    const result = await supertest(app).get(`c`);
    expect(result.status).toEqual(200);
    expect(result.text).toContain("http://es.dbpedia.org/resource/Provincia_de_Madrid");
  });
});
