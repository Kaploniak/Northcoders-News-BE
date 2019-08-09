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
    it("GET / status: 200 and respond with a JSON representation of all the available endpoints of the api", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          expect(body).to.be.an("object");
        });
    });
    it("Server responds with status 405 for invalid HTTP methods - DELETE", () => {
      return request(app)
        .delete("/api")
        .expect(405);
    });
    it("Server responds with status 405 for invalid HTTP methods - PATCH", () => {
      return request(app)
        .patch("/api")
        .expect(405);
    });
    it("Server responds with status 405 for invalid HTTP methods - POST", () => {
      return request(app)
        .post("/api")
        .expect(405);
    });
    describe("/topics", () => {
      it("Server responds with status 405 for invalid HTTP methods - DELETE", () => {
        return request(app)
          .delete("/api/topics")
          .expect(405);
      });
      it("Server responds with status 405 for invalid HTTP methods - PATCH", () => {
        return request(app)
          .patch("/api/topics")
          .expect(405);
      });
      it("Server responds with status 405 for invalid HTTP methods - POST", () => {
        return request(app)
          .post("/api/topics")
          .expect(405);
      });
      describe("/topics - GET", () => {
        it("1 GET / status: 404 and respond with message: Page not found, when wrong path", () => {
          return request(app)
            .get("/api/not-a-route")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.equal("Page not found");
            });
        });
        it("2 GET / status: 200 and return an array with topic objects", () => {
          return request(app)
            .get("/api/topics")
            .expect(200)
            .then(({ body }) => {
              expect(body.topics).to.be.an("array");
              expect(body.topics[0]).to.be.an("object");
            });
        });
        it("3 GET / status: 200 and return an array with topics objects / checking if topic object got correct keys", () => {
          return request(app)
            .get("/api/topics")
            .expect(200)
            .then(({ body }) => {
              expect(body.topics[0]).to.have.keys("slug", "description");
            });
        });
      });
    });
    describe("/users/:username", () => {
      it("Server responds with status 405 for invalid HTTP methods - DELETE", () => {
        return request(app)
          .delete("/api/users/butter_bridge")
          .expect(405);
      });
      it("Server responds with status 405 for invalid HTTP methods - PATCH", () => {
        return request(app)
          .patch("/api/users/butter_bridge")
          .expect(405);
      });
      it("Server responds with status 405 for invalid HTTP methods - POST", () => {
        return request(app)
          .post("/api/users/butter_bridge")
          .expect(405);
      });
      describe("/users/:username - GET", () => {
        it("1 GET / status: 404 and respond with message: Page not found, when wrong path", () => {
          return request(app)
            .get("/api/not-a-route/butter_bridge")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.equal("Page not found");
            });
        });
        it("2 GET / status: 404 and respond with message: User not found, when non existing username passed", () => {
          return request(app)
            .get("/api/users/user")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.equal("User not found");
            });
        });
        it("3 GET / status: 400 and respond with message: Bad request, when username_id is not a valid input", () => {
          return request(app)
            .get("/api/users/12345")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal("Bad request");
            });
        });
        it("4 GET / status: 400 and respond with message: Bad request, when number is passed instead of username", () => {
          return request(app)
            .get("/api/users/1")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal("Bad request");
            });
        });
        it("5 GET / status: 200 and return an user object - checking for correct keys", () => {
          return request(app)
            .get("/api/users/butter_bridge")
            .expect(200)
            .then(({ body }) => {
              expect(body.user).to.have.keys("username", "avatar_url", "name");
            });
        });
        it("6 GET / status: 200 and return an user object - checking if query match correct keys", () => {
          return request(app)
            .get("/api/users/butter_bridge")
            .expect(200)
            .then(({ body }) => {
              expect(body.user.username).to.equal("butter_bridge");
              expect(body.user.name).to.equal("jonny");
            });
        });
      });
    });
    describe("/articles/:article_id", () => {
      it("Server responds with status 405 for invalid HTTP methods - POST", () => {
        return request(app)
          .post("/api/articles/1")
          .expect(405);
      });
      describe("/articles/:article_id - GET", () => {
        it("1 GET / status: 404 and respond with message: Page not found, when wrong path", () => {
          return request(app)
            .get("/api/not-a-route/4")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.equal("Page not found");
            });
        });
        it("2 GET / status: 404 and respond with message: Article do not exist, when article_id do not match existing aticle in database", () => {
          return request(app)
            .get("/api/articles/13")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.equal("Article do not exist");
            });
        });
        it("3 GET / status: 400 and respond with message: Bad request, when article_id is not an number", () => {
          return request(app)
            .get("/api/articles/not-an-article-id")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal("Invalid id");
            });
        });
        it("4 GET / status: 200 and return an article object - checking for correct keys", () => {
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
        it("5 GET / status: 200 and return an article object - checking for correct comment count value", () => {
          return request(app)
            .get("/api/articles/1")
            .expect(200)
            .then(({ body }) => {
              expect(body.article.comment_count).to.equal("13");
            });
        });
      });
      describe("/articles/:article_id - PATCH", () => {
        it("1 PATCH / status: 404 and respond with message: Page not found, when wrong path", () => {
          return request(app)
            .patch("/api/not-a-route/4")
            .send({ inc_votes: 666 })
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.equal("Page not found");
            });
        });
        it("2 PATCH / status: 404 and respond with message: Article do not exist, when article_id do not match existing aticle in database", () => {
          return request(app)
            .patch("/api/articles/13")
            .send({ inc_votes: 666 })
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.equal("Article do not exist");
            });
        });
        it("3 PATCH / status: 400 and respond with message: Bad request, when sending inc_votes and value is not a number", () => {
          return request(app)
            .patch("/api/articles/1")
            .send({ inc_votes: "abc" })
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal("Invalid id");
            });
        });
        it("4 PATCH / status: 200 and return not changed article object, when sending an empty object", () => {
          return request(app)
            .patch("/api/articles/1")
            .send({})
            .expect(200)
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
        it("5 PATCH / status: 200 and return an updated article object (updated just by vote), when sending an object with some other property", () => {
          return request(app)
            .patch("/api/articles/1")
            .send({ inc_votes: 1, name: "Mitch" })
            .expect(200)
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
        it("6 PATCH / status: 200 and return an updated article object (where by default votes value was 0)", () => {
          return request(app)
            .patch("/api/articles/3")
            .send({ inc_votes: 666 })
            .expect(200)
            .then(({ body }) => {
              expect(body.article.votes).to.equal(666);
            });
        });
        it("7 PATCH / status: 200 and return an updated article object (where votes value was 100", () => {
          return request(app)
            .patch("/api/articles/1")
            .send({ inc_votes: 666 })
            .expect(200)
            .then(({ body }) => {
              expect(body.article.votes).to.equal(766);
            });
        });
        it("8 PATCH / status: 200 and return an updated article object (where inc_votes has negative value)", () => {
          return request(app)
            .patch("/api/articles/3")
            .send({ inc_votes: -666 })
            .expect(200)
            .then(({ body }) => {
              expect(body.article.votes).to.equal(-666);
            });
        });
      });
      describe("/articles/:article_id - DELETE", () => {
        it("1 DELETE / status 404 and respond with an error message: Article with Id 50 not found, if a article_id does not exist", () => {
          return request(app)
            .delete("/api/articles/50")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.equal("Article with Id 50 not found");
            });
        });
        it("2 DELETE / status: 204 and remove the article by article_id", () => {
          return request(app)
            .delete("/api/articles/1")
            .expect(204);
        });
      });
    });
    describe("/articles/:article_id/comments", () => {
      it("Server responds with status 405 for invalid HTTP methods - DELETE", () => {
        return request(app)
          .delete("/api/articles/1/comments")
          .expect(405);
      });
      it("Server responds with status 405 for invalid HTTP methods - PATCH", () => {
        return request(app)
          .patch("/api/articles/1/comments")
          .expect(405);
      });
      describe("/articles/:article_id/comments - POST", () => {
        it("1 POST / status: 404 and respond with message: Page not found, when wrong path", () => {
          return request(app)
            .post("/api/articles/4/not-a-route")
            .send({ username: "lurker", body: "THIS IS TEST COMMENT" })
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.equal("Page not found");
            });
        });
        it("2 POST / status: 404 and respond with message: Article do not exist, when article_id do not match existing aticle in database", () => {
          return request(app)
            .post("/api/articles/13/comments")
            .send({ username: "lurker", body: "THIS IS TEST COMMENT" })
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.equal("Page not found");
            });
        });
        it("3 POST / status: 400 and respond with message: Bad request, when sending an empty object", () => {
          return request(app)
            .post("/api/articles/4/comments")
            .send({})
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal("No data to post!");
            });
        });
        it("4 POST / status: 400 and respond with message: Bad request, when sending an object just with username", () => {
          return request(app)
            .post("/api/articles/4/comments")
            .send({ username: "lurker" })
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal("No data to post!");
            });
        });
        it("5 POST / status: 201 and respond with posted comment - checking if object got all the keys", () => {
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
        it("6 POST / status: 201 and respond with posted comment - checking if comment body match input", () => {
          return request(app)
            .post("/api/articles/4/comments")
            .send({ username: "lurker", body: "THIS IS TEST COMMENT" })
            .expect(201)
            .then(({ body }) => {
              expect(body.comment.body).to.equal("THIS IS TEST COMMENT");
            });
        });
        it("7 POST / status: 201 and respond with posted comment - checking if username match input", () => {
          return request(app)
            .post("/api/articles/4/comments")
            .send({ username: "lurker", body: "THIS IS TEST COMMENT" })
            .expect(201)
            .then(({ body }) => {
              expect(body.comment.author).to.equal("lurker");
            });
        });
      });
      describe("/articles/:article_id/comments - GET", () => {
        it("1 GET / status: 404 and respond with message: Page not found, when wrong path", () => {
          return request(app)
            .get("/api/articles/4/not-a-route")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.equal("Page not found");
            });
        });
        it("2 GET / status: 400 and respond with message: Bad request - Given article id is not an integer, if an invalid article is entered", () => {
          return request(app)
            .get("/api/articles/invalid/comments")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal(
                "Bad request: Given article_id is not an integer."
              );
            });
        });
        it("3 GET / status: 404 and respond with message: Comments not found, if a non-existent article is entered", () => {
          return request(app)
            .get("/api/articles/13/comments")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.equal("Article do not exist");
            });
        });
        it("4 GET / status: 200 and respond with array of all comments for article by article_id, sorted by created_at by default - checking if respond is an array of comments objects with correct keys", () => {
          return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then(({ body }) => {
              expect(body.comments).to.be.an("array");
              expect(body.comments[0]).to.contain.keys(
                "comment_id",
                "body",
                "article_id",
                "author",
                "votes",
                "created_at"
              );
            });
        });
        it("5 GET / status: 200 and respond with array of all comments for article by article_id, sorted by created_at by default - checking if comments length is correct for article_id 1", () => {
          return request(app)
            .get("/api/articles/1/comments?limit=20")
            .expect(200)
            .then(({ body }) => {
              expect(body.comments.length).to.equal(13);
            });
        });
        it("6 GET / status: 200 and respond with array of all comments for article by article_id, sorted by created_at by default - checking if comments are ordered descending by DEFAULT", () => {
          return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then(({ body }) => {
              expect(body.comments).to.be.descendingBy("created_at");
            });
        });
        it("7 GET / status: 200 and respond with array of all comments for article by article_id, sorted by created_at by ascending order", () => {
          return request(app)
            .get("/api/articles/1/comments?order=asc")
            .expect(200)
            .then(({ body }) => {
              expect(body.comments).to.be.ascendingBy("created_at");
            });
        });
        it("8 GET / status: 200 and returns an empty array if an article containing no comments is entered", () => {
          return request(app)
            .get("/api/articles/2/comments")
            .expect(200)
            .then(({ body }) => {
              expect(body.comments).to.eql([]);
            });
        });
        it("9 GET / status: 200 and respond with all comments for given article_id, sorting comments by author when provided with a valid query", () => {
          return request(app)
            .get("/api/articles/1/comments?sort_by=author")
            .expect(200)
            .then(({ body }) => {
              expect(body.comments).to.be.descendingBy("author");
            });
        });
        it("10 GET / status: 200 and respond with array of comments for specified article, sorting comments by the specified column and in the specified order when provided with a valid query", () => {
          return request(app)
            .get("/api/articles/1/comments?sort_by=votes&order=asc")
            .expect(200)
            .then(({ body }) => {
              expect(body.comments).to.be.ascendingBy("votes");
            });
        });
        it("11 GET / status: 200 and respond with array of comments sorted BY DEFAULT when errneous sort_by and order quaries passed", () => {
          return request(app)
            .get(
              "/api/articles/1/comments?sort_by=not-a-collumnt&order=not-an-order"
            )
            .expect(200)
            .then(({ body }) => {
              expect(body.comments).to.be.descendingBy("created_at");
            });
        });
        it("12 GET / status: 200 and respond with array of comments sorted BY DEFAULT with limited article to 10", () => {
          return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then(({ body }) => {
              expect(body.comments).to.be.descendingBy("created_at");
              expect(body.comments).to.have.lengthOf(10);
            });
        });
        it("13 GET / status: 200 and respond with array of comments sorted BY DEFAULT with limited article to 5", () => {
          return request(app)
            .get("/api/articles/1/comments?limit=5")
            .expect(200)
            .then(({ body }) => {
              expect(body.comments).to.be.descendingBy("created_at");
              expect(body.comments).to.have.lengthOf(5);
            });
        });
        it("14 GET / status: 200 and respond with array of comments sorted BY DEFAULT with limited article to 10 and display page 2", () => {
          return request(app)
            .get("/api/articles/1/comments?p=2")
            .expect(200)
            .then(({ body }) => {
              expect(body.comments).to.be.descendingBy("created_at");
              expect(body.comments).to.have.lengthOf(3);
            });
        });
      });
    });
    describe("/api/articles", () => {
      it("Server responds with status 405 for invalid HTTP methods - DELETE", () => {
        return request(app)
          .delete("/api/articles")
          .expect(405);
      });
      it("Server responds with status 405 for invalid HTTP methods - PATCH", () => {
        return request(app)
          .patch("/api/articles")
          .expect(405);
      });
      it("Server responds with status 405 for invalid HTTP methods - POST", () => {
        return request(app)
          .post("/api/articles")
          .expect(405);
      });
      describe("/api/articles - GET", () => {
        it("1 GET / status: 404 and respond with message: Page not found, when wrong path", () => {
          return request(app)
            .get("/api/not-a-route")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.equal("Page not found");
            });
        });
        it("2 GET / status: 200 and return an object with array of article objects", () => {
          return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body }) => {
              expect(body.articles).to.be.an("array");
              expect(body.articles[0]).to.be.an("object");
            });
        });
        it("3 GET / status: 200 and return an object with array of article objects / checking if article object got correct keys", () => {
          return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body }) => {
              expect(body.articles[0]).to.have.keys(
                "article_id",
                "title",
                "votes",
                "author",
                "topic",
                "created_at",
                "comment_count"
              );
            });
        });
        it("4 GET / status: 200 and return an object with array of article objects sorted by DEFAULT descending and ordered by created_at", () => {
          return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body }) => {
              expect(body.articles).to.be.descendingBy("created_at");
            });
        });
        it("5 GET / status: 200 and return an object with array of article objects sorted by DEFAULT descending and ordered by topic", () => {
          return request(app)
            .get("/api/articles?sort_by=topic")
            .expect(200)
            .then(({ body }) => {
              expect(body.articles).to.be.descendingBy("topic");
            });
        });
        it("6 GET / status: 200 and return an object with array of article objects sorted by ascending order  and ordered by DEFAULT column", () => {
          return request(app)
            .get("/api/articles?order=asc")
            .expect(200)
            .then(({ body }) => {
              expect(body.articles).to.be.ascendingBy("created_at");
            });
        });
        it("7 GET / status: 200 and return an object with array of article objects sorted by ascending order and ordered by author", () => {
          return request(app)
            .get("/api/articles?order=asc&sort_by=author")
            .expect(200)
            .then(({ body }) => {
              expect(body.articles).to.be.ascendingBy("author");
            });
        });
        it("8 GET / status: 200 and respond with array of articles sorted BY DEFAULT when errneous sort_by and order quaries passed", () => {
          return request(app)
            .get("/api/articles?sort_by=not-a-collumnt&order=not-an-order")
            .expect(200)
            .then(({ body }) => {
              expect(body.articles).to.be.descendingBy("created_at");
            });
        });
        it("9 GET / status: 200 and respond with array of articles sorted BY DEFAULT, filter the articles by the topic value specified in the query - checking if total_count value is correct", () => {
          return request(app)
            .get("/api/articles?topic=mitch")
            .expect(200)
            .then(({ body }) => {
              expect(body.total_count).to.equal(11);
              expect(body.articles).to.be.descendingBy("created_at");
            });
        });
        it("10 GET / status: 200 and respond with array of articles sorted BY DEFAULT, filter the articles by the author value specified in the query", () => {
          return request(app)
            .get("/api/articles?author=rogersop")
            .expect(200)
            .then(({ body }) => {
              expect(body.articles).to.have.lengthOf(3);
              expect(body.articles).to.be.descendingBy("created_at");
            });
        });
        it("11 GET / status: 200 and respond with array of articles sorted BY DEFAULT, filter the articles by the author value and topic value specified in the query", () => {
          return request(app)
            .get("/api/articles?author=rogersop&topic=cats")
            .expect(200)
            .then(({ body }) => {
              expect(body.articles).to.have.lengthOf(1);
              expect(body.articles).to.be.descendingBy("created_at");
            });
        });
        it("12 GET / status: 200 and respond with empty array, when filter the articles by the valid author value and topic value that do not have any articles", () => {
          return request(app)
            .get("/api/articles?author=icellusedkars&topic=cats")
            .expect(200)
            .then(({ body }) => {
              expect(body.articles).to.have.lengthOf(0);
            });
        });
        it("13 GET / status: 404 and respond with message: Topic not found, if the query do not match any topic", () => {
          return request(app)
            .get("/api/articles?topic=not-a-topic")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.equal("Topic not found");
            });
        });
        it("14 GET / status: 404 and respond with message: Author not found, if the query do not match any author", () => {
          return request(app)
            .get("/api/articles?author=not-an-author")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.equal("Author not found");
            });
        });
        it("15 GET / status: 200 and return an object with array of article objects sorted by descending order, ordered by column created_at and limited to 10 objects by DEFAULT", () => {
          return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body }) => {
              expect(body.articles).to.be.descendingBy("created_at");
              expect(body.articles).to.have.lengthOf(10);
            });
        });
        it("16 GET / status: 200 and return an object with array of article objects sorted by descending order, ordered by column created_at and limited to 10 objects by DEFAULT - second page", () => {
          return request(app)
            .get("/api/articles?p=2")
            .expect(200)
            .then(({ body }) => {
              expect(body.articles).to.be.descendingBy("created_at");
              expect(body.articles).to.have.lengthOf(2);
            });
        });
        it("17 GET / status: 200 and return an object with array of article objects sorted by descending order, ordered by column created_at and limited to 10 objects by DEFAULT - total_count property", () => {
          return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body }) => {
              expect(body.articles).to.be.descendingBy("created_at");
              expect(body.total_count).to.equal(12);
            });
        });
        it("18 GET / status: 200 and return an object with empty array when given page do not have any articles ", () => {
          return request(app)
            .get("/api/articles?limit=5&p=4")
            .expect(200)
            .then(({ body }) => {
              expect(body.articles).to.have.lengthOf(0);
            });
        });
      });
      describe("/api/articles - POST", () => {
        it("POST / status: 400 and message: Bad request, when wrong key passed", () => {
          return request(app)
            .post("/api/articles")
            .send({
              title3: "Test title",
              topic: "mitch",
              author: "icellusedkars",
              body: "Testing....",
              created_at: new Date(1037708514171),
              votes: 5
            })
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.eql("Bad request");
            });
        });
        it("POST / status: 400 and message: Bad request, when non existing topic passed", () => {
          return request(app)
            .post("/api/articles")
            .send({
              title3: "Test title",
              topic: "michal",
              author: "icellusedkars",
              body: "Testing....",
              created_at: new Date(1037708514171),
              votes: 5
            })
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.eql("Bad request");
            });
        });
        it("POST / status: 400 and message: Bad request, when non existing username passed", () => {
          return request(app)
            .post("/api/articles")
            .send({
              title3: "Test title",
              topic: "mitch",
              author: "michal",
              body: "Testing....",
              created_at: new Date(1037708514171),
              votes: 5
            })
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.eql("Bad request");
            });
        });
        it("POST / status: 201 add new article to existing topic with existing username respond with added article", () => {
          return request(app)
            .post("/api/articles")
            .send({
              title: "Test title",
              topic: "mitch",
              author: "icellusedkars",
              body: "Testing....",
              created_at: new Date(1037708514171),
              votes: 5
            })
            .expect(201)
            .then(({ body }) => {
              expect(body.article).to.eql({
                article_id: 13,
                title: "Test title",
                body: "Testing....",
                votes: 5,
                topic: "mitch",
                author: "icellusedkars",
                created_at: "2002-11-19T12:21:54.171Z"
              });
            });
        });
      });
    });
    describe("/api/comments/:comment_id", () => {
      it("Server responds with status 405 for invalid HTTP methods - GET", () => {
        return request(app)
          .get("/api/comments/1")
          .expect(405);
      });
      it("Server responds with status 405 for invalid HTTP methods - POST", () => {
        return request(app)
          .post("/api/comments/1")
          .expect(405);
      });
      describe("/api/comments/:comment_id - PATCH", () => {
        it("1 PATCH / status: 404 and respond with message: Page not found, when wrong path", () => {
          return request(app)
            .patch("/api/not-a-route/4")
            .send({ inc_votes: 333 })
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.equal("Page not found");
            });
        });
        it("2 PATCH / status: 404 and respond with message: Comment do not exist, when comment_id do not match existing comment in database", () => {
          return request(app)
            .patch("/api/comments/100")
            .send({ inc_votes: 333 })
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.equal("Comment do not exist");
            });
        });
        it("3 PATCH / status: 400 and respond with message: Bad request, when sending inc_votes and value is not a number", () => {
          return request(app)
            .patch("/api/comments/1")
            .send({ inc_votes: "abc" })
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal("Invalid id");
            });
        });
        it("4 PATCH / status: 400 and respond with message: Bad request, when sending inc_votes and value is not a number", () => {
          return request(app)
            .patch("/api/comments/1")
            .send({ inc_votes: "abc" })
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal("Invalid id");
            });
        });
        it("5 PATCH / status: 200 and return not changed comment object, when sending an empty object", () => {
          return request(app)
            .patch("/api/comments/1")
            .send({})
            .expect(200)
            .then(({ body }) => {
              expect(body.comment).to.eql({
                comment_id: 1,
                author: "butter_bridge",
                article_id: 9,
                votes: 16,
                created_at: "2017-11-22T12:36:03.389Z",
                body:
                  "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!"
              });
            });
        });
        it("6 PATCH / status: 200 and return an updated comment object (updated just by vote), when sending an object with some other property", () => {
          return request(app)
            .patch("/api/comments/1")
            .send({ inc_votes: 100, author: "Mitch" })
            .expect(200)
            .then(({ body }) => {
              expect(body.comment).to.eql({
                comment_id: 1,
                author: "butter_bridge",
                article_id: 9,
                votes: 116,
                created_at: "2017-11-22T12:36:03.389Z",
                body:
                  "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!"
              });
            });
        });
        it("7 PATCH / status: 200 and return an updated comment object (where votes value was 16", () => {
          return request(app)
            .patch("/api/comments/1")
            .send({ inc_votes: 14 })
            .expect(200)
            .then(({ body }) => {
              expect(body.comment.votes).to.equal(30);
            });
        });
        it("8 PATCH / status: 200 and return an updated article object (where inc_votes has negative value)", () => {
          return request(app)
            .patch("/api/comments/1")
            .send({ inc_votes: -26 })
            .expect(200)
            .then(({ body }) => {
              expect(body.comment.votes).to.equal(-10);
            });
        });
      });
      describe("/api/comments/:comment_id - DELETE", () => {
        it("1 DELETE / status 404 and respond with an error message: Comment with Id 50 not found, if a comment_id does not exist", () => {
          return request(app)
            .delete("/api/comments/50")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.equal("Comment with Id 50 not found");
            });
        });
        it("2 DELETE / status: 204 and remove the comment by comment_id", () => {
          return request(app)
            .delete("/api/comments/1")
            .expect(204);
        });
      });
    });
  });
});
