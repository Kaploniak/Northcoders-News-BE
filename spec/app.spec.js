process.env.NODE_ENV = "test";
const { expect } = require("chai");
const chai = require("chai");
const request = require("supertest");
const connection = require("../db/connection");
const app = require("../app");
const chaiSorted = require("chai-sorted");
chai.use(chaiSorted);

describe("app", () => {
  after(() => {
    return connection.destroy();
  });
  describe("/api", () => {
    describe("/topics - GET", () => {
      it("GET / status: 200 and return an array with objects", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body }) => {
            expect(body.topics).to.be.an("array");
            expect(body.topics[0]).to.be.an("object");
          });
      });
      it("GET / status: 200 and return an array with objects / checking for correct keys", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body }) => {
            expect(body.topics[0]).to.have.keys("slug", "description");
          });
      });
    });
  });
});
