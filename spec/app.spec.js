process.env.NODE_ENV = "test";
const { expect } = require("chai");
const chai = require("chai");
const request = require("supertest");
const connection = require("../db/connection");
const app = require("../app");
const chaiSorted = require("chai-sorted");
chai.use(chaiSorted);

describe("app", () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());
  it("GET /* status: 404 and respond with message: page not found", () => {
    return request(app)
      .get("/not-a-route")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).to.equal("Page not found");
      });
  });
  describe("/api", () => {
    describe("/topics - GET", () => {
      it("GET / status: 404 and respond with message: Page not found, when wrong path", () => {
        return request(app)
          .get("/api/not-a-route")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Page not found");
          });
      });
      it("GET / status: 200 and return an array with topic objects", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body }) => {
            expect(body.topics).to.be.an("array");
            expect(body.topics[0]).to.be.an("object");
          });
      });
      it("GET / status: 200 and return an array with topics objects / checking if topic object got correct keys", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body }) => {
            expect(body.topics[0]).to.have.keys("slug", "description");
          });
      });
    });
    describe("/users/:username - GET", () => {
      it("GET / status: 404 and respond with message: Page not found, when wrong path", () => {
        return request(app)
          .get("/api/not-a-route/butter_bridge")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Page not found");
          });
      });
      it("GET / status: 404 and respond with message: User not found, when non existing username passed", () => {
        return request(app)
          .get("/api/users/user")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("User not found");
          });
      });
      it("GET / status: 400 and respond with message: Bad request, when username_id is not a valid input", () => {
        return request(app)
          .get("/api/users/12345")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Bad request");
          });
      });
      it("GET / status: 400 and respond with message: Bad request, when number is passed instead of username", () => {
        return request(app)
          .get("/api/users/1")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Bad request");
          });
      });
      it("GET / status: 200 and return an user object - checking for correct keys", () => {
        return request(app)
          .get("/api/users/butter_bridge")
          .expect(200)
          .then(({ body }) => {
            expect(body.user).to.have.keys("username", "avatar_url", "name");
          });
      });
      it("GET / status: 200 and return an user object - checking if query match correct keys", () => {
        return request(app)
          .get("/api/users/butter_bridge")
          .expect(200)
          .then(({ body }) => {
            expect(body.user.username).to.equal("butter_bridge");
            expect(body.user.name).to.equal("jonny");
          });
      });
    });
    describe("/articles/:article_id - GET/PATCH/POST", () => {
      it("GET / status: 404 and respond with message: Page not found, when wrong path", () => {
        return request(app)
          .get("/api/not-a-route/4")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Page not found");
          });
      });
      it("GET / status: 404 and respond with message: Article do not exist, when article_id do not match existing aticle in database", () => {
        return request(app)
          .get("/api/articles/13")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Article do not exist");
          });
      });
      it("GET / status: 400 and respond with message: Bad request, when article_id is not an number", () => {
        return request(app)
          .get("/api/articles/not-an-article-id")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Bad request");
          });
      });
      it("GET / status: 200 and return an article object - checking for correct keys", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then(({ body }) => {
            expect(body.article).to.have.keys(
              "article_id",
              "title",
              "body",
              "votes",
              "topic",
              "author",
              "created_at",
              "comment_count"
            );
          });
      });
      it("GET / status: 200 and return an article object - checking for correct comment count value", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then(({ body }) => {
            expect(body.article.comment_count).to.equal("13");
          });
      });
      it("PATCH / status: 404 and respond with message: Page not found, when wrong path", () => {
        return request(app)
          .patch("/api/not-a-route/4")
          .send({ inc_votes: 666 })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Page not found");
          });
      });
      it("PATCH / status: 404 and respond with message: Article do not exist, when article_id do not match existing aticle in database", () => {
        return request(app)
          .patch("/api/articles/13")
          .send({ inc_votes: 666 })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Article do not exist");
          });
      });
      it("PATCH / status: 400 and respond with message: Bad request, when sending inc_votes and value is not a number", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: "abc" })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Bad request");
          });
      });
      it("PATCH / status: 201 and return not changed article object, when sending an empty object", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({})
          .expect(201)
          .then(({ body }) => {
            expect(body.article).to.eql({
              article_id: 1,
              title: "Living in the shadow of a great man",
              body: "I find this existence challenging",
              votes: 100,
              topic: "mitch",
              author: "butter_bridge",
              created_at: "2018-11-15T12:21:54.171Z"
            });
          });
      });
      it("PATCH / status: 201 and return an updated article object (updated just by vote), when sending an object with some other property", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: 1, name: "Mitch" })
          .expect(201)
          .then(({ body }) => {
            expect(body.article).to.eql({
              article_id: 1,
              title: "Living in the shadow of a great man",
              body: "I find this existence challenging",
              votes: 101,
              topic: "mitch",
              author: "butter_bridge",
              created_at: "2018-11-15T12:21:54.171Z"
            });
          });
      });
      it("PATCH / status: 201 and return an updated article object (where by default votes value was 0)", () => {
        return request(app)
          .patch("/api/articles/3")
          .send({ inc_votes: 666 })
          .expect(201)
          .then(({ body }) => {
            expect(body.article.votes).to.equal(666);
          });
      });
      it("PATCH / status: 201 and return an updated article object (where votes value was 100", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: 666 })
          .expect(201)
          .then(({ body }) => {
            expect(body.article.votes).to.equal(766);
          });
      });
      it("PATCH / status: 201 and return an updated article object (where inc_votes has negative value)", () => {
        return request(app)
          .patch("/api/articles/3")
          .send({ inc_votes: -666 })
          .expect(201)
          .then(({ body }) => {
            expect(body.article.votes).to.equal(-666);
          });
      });
      it("POST / status: 404 and respond with message: Page not found, when wrong path", () => {
        return request(app)
          .post("/api/articles/4/not-a-route")
          .send({ username: "lurker", body: "THIS IS TEST COMMENT" })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Page not found");
          });
      });
      it("POST / status: 400 and respond with message: Article do not exist, when article_id do not match existing aticle in database", () => {
        return request(app)
          .post("/api/articles/13/comments")
          .send({ username: "lurker", body: "THIS IS TEST COMMENT" })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Bad request");
          });
      });
      it("POST / status: 201 and respond with posted comment - checking if object got all the keys", () => {
        return request(app)
          .post("/api/articles/4/comments")
          .send({ username: "lurker", body: "THIS IS TEST COMMENT" })
          .expect(201)
          .then(({ body }) => {
            expect(body.comment).to.have.keys(
              "comment_id",
              "author",
              "article_id",
              "votes",
              "created_at",
              "body"
            );
          });
      });
      it("POST / status: 201 and respond with posted comment - checking if comment body match input", () => {
        return request(app)
          .post("/api/articles/4/comments")
          .send({ username: "lurker", body: "THIS IS TEST COMMENT" })
          .expect(201)
          .then(({ body }) => {
            expect(body.comment.body).to.equal("THIS IS TEST COMMENT");
          });
      });
    });
  });
});
