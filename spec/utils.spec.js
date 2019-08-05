const { expect } = require("chai");
const {
  formatDates,
  makeRefObj,
  formatComments
} = require("../db/utils/utils");

describe("formatDates", () => {
  it("when input is an empty array, returns an empty array", () => {
    expect(formatDates([])).to.eql([]);
  });
  it("when input is an array with single object, returns a new array with object - NOT MUTATING THE DATA", () => {
    const input = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      }
    ];
    formatDates(input);
    expect(input).to.eql([
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      }
    ]);
  });
  it("when input is an array with one article object, returns a single object array with changed dateFormat", () => {
    expect(
      formatDates([
        {
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: 1542284514171,
          votes: 100
        }
      ])
    ).to.eql([
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: new Date(1542284514171),
        votes: 100
      }
    ]);
  });
  it("when input is an array with multiple article objects, returns a multiple obcjects array with changed dateFormat", () => {
    expect(
      formatDates([
        {
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: 1542284514171,
          votes: 100
        },
        {
          title: "Eight pug gifs that remind me of mitch",
          topic: "mitch",
          author: "icellusedkars",
          body: "some gifs",
          created_at: 1289996514171
        },
        {
          title: "Student SUES Mitch!",
          topic: "mitch",
          author: "rogersop",
          body:
            "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
          created_at: 1163852514171
        }
      ])
    ).to.eql([
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: new Date(1542284514171),
        votes: 100
      },
      {
        title: "Eight pug gifs that remind me of mitch",
        topic: "mitch",
        author: "icellusedkars",
        body: "some gifs",
        created_at: new Date(1289996514171)
      },
      {
        title: "Student SUES Mitch!",
        topic: "mitch",
        author: "rogersop",
        body:
          "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
        created_at: new Date(1163852514171)
      }
    ]);
  });
});

describe("makeRefObj", () => {
  it("when input is an empty array, returns and empty object", () => {
    expect(makeRefObj([])).to.eql({});
  });
  it("when input is an array with single topic object, returns an reference object with key as title and value as article_id", () => {
    expect(
      makeRefObj([
        {
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: 1542284514171,
          votes: 100
        }
      ])
    ).to.eql({
      "Living in the shadow of a great man": 1
    });
  });
  it("when input is an array with multiple topic objects, returns an reference object with keys as title and values as article_id", () => {
    expect(
      makeRefObj([
        {
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: 1542284514171,
          votes: 100
        },
        {
          article_id: 2,
          title: "UNCOVERED: catspiracy to bring down democracy",
          topic: "cats",
          author: "rogersop",
          body: "Bastet walks amongst us, and the cats are taking arms!",
          created_at: 1037708514171
        }
      ])
    ).to.eql({
      "Living in the shadow of a great man": 1,
      "UNCOVERED: catspiracy to bring down democracy": 2
    });
  });
});

describe("formatComments", () => {
  it("when input is an empty array and empty reference object, returns empty array", () => {
    const commentData = [];
    const articleRef = {};
    const actual = formatComments(commentData, articleRef);
    const expected = [];
    expect(actual).to.eql(expected);
  });
  it("when input is an array with single comment object and reference object with single key-value pair that match comment object, returns array with formated comment", () => {
    const commentData = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      }
    ];
    const articleRef = { "They're not exactly dogs, are they?": 5 };
    const actual = formatComments(commentData, articleRef);
    const expected = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        article_id: 5,
        author: "butter_bridge",
        votes: 16,
        created_at: new Date(1511354163389)
      }
    ];
    expect(actual).to.eql(expected);
  });
  it("when input is an array with single comment object and reference object with single key-value pair that match comment object, returns array with formated comment - NOT MUTATING DATA", () => {
    const commentData = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      }
    ];
    const articleRef = { "They're not exactly dogs, are they?": 5 };
    formatComments(commentData, articleRef);
    expect(commentData).to.eql([
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      }
    ]);
  });
  it("when input is an array with multiple comment object and reference object with multiple key-value pair that match comment object, returns array with formated comment", () => {
    const commentData = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      },
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 14,
        created_at: 1479818163389
      }
    ];
    const articleRef = {
      "They're not exactly dogs, are they?": 5,
      "Living in the shadow of a great man": 1
    };
    const actual = formatComments(commentData, articleRef);
    const expected = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        article_id: 5,
        author: "butter_bridge",
        votes: 16,
        created_at: new Date(1511354163389)
      },
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        article_id: 1,
        author: "butter_bridge",
        votes: 14,
        created_at: new Date(1479818163389)
      }
    ];
    expect(actual).to.eql(expected);
  });
});
