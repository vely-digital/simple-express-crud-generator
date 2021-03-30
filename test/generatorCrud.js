let mongoose = require("mongoose");
let Cat = require("../server/model");

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../server/index");
let should = chai.should();

chai.use(chaiHttp);
//Our parent block
describe("cats", () => {
  beforeEach((done) => {
    //Before each test we empty the database
    Cat.remove({}, (err) => {
      done();
    });
  });

  describe("/GET cat", () => {
    it("it should GET all the cat", (done) => {
      chai
        .request(server)
        .post("/cat/list")
        .end((err, res) => {
          const expectedObject = {
            count: 0,
            pageSize: 0,
            payload: [],
          };
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.be.deep.equal(expectedObject);
          done();
        });
    });
  });

  describe("/POST cat", () => {
    it("it should POST a cat", (done) => {
      let cat = {
        cat: "Test our dear cat",
      };
      chai
        .request(server)
        .post("/cat")
        .send(cat)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("_id").and.to.be.an("string");
          res.body.should.have
            .property("cat")
            .and.to.be.equal("Test our dear cat");
          done();
        });
    });
  });

  describe("/GET/:id cat", () => {
    it("it should GET a cat by the given id", (done) => {
      let cat = new Cat({
        cat: "Our dear test no.2",
      });
      cat.save((err, cat) => {
        chai
          .request(server)
          .get("/cat/" + cat.id)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("cat");
            res.body.should.have.property("_id").eql(cat.id);
            done();
          });
      });
    });
  });

  describe("/PUT/:id cat", () => {
    it("it should PUT a cat by the given id and change it", (done) => {
      let cat = new Cat({
        cat: "Our dear test no.2",
      });

      let changedCat = {
        cat: "Out dear changed test no.3 :)",
      };
      cat.save((err, cat) => {
        chai
          .request(server)
          .put("/cat/" + cat.id)
          .send(changedCat)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("cat").eql(changedCat.cat);
            res.body.should.have.property("_id").eql(cat.id);
            done();
          });
      });
    });
  });

  describe("/GET cat, test list general", async () => {
    beforeEach(async () => {
      await new Cat({
        cat: "Our dear test no.1",
      }).save();
      await new Cat({
        cat: "Our dear test no.2",
      }).save();
      await new Cat({
        cat: "Our dear test no.3",
      }).save();
      await new Cat({
        cat: "Strange name for autocomplete",
      }).save();
    });
    it("it should GET all the cat with right count", (done) => {
      chai
        .request(server)
        .post("/cat/list")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.payload.should.be.a("array");
          res.body.payload.length.should.be.eql(4);
          res.body.count.should.be.eql(4);
          done();
        });
    });
    it("it should limit to two", (done) => {
      const filters = {
        limit: 2,
      };
      chai
        .request(server)
        .post("/cat/list")
        .send(filters)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.payload.should.be.a("array");
          res.body.payload.length.should.be.eql(2);
          res.body.count.should.be.eql(4);
          done();
        });
    });

    it("it should do pagination to 1 and 1 page", (done) => {
      const filters = {
        limit: 1,
        page: 1,
      };

      const shouldGet = {
        cat: "Our dear test no.1",
      };
      chai
        .request(server)
        .post("/cat/list")
        .send(filters)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.payload.should.be.a("array");
          res.body.payload.length.should.be.eql(1);
          res.body.page.should.eql(1);
          res.body.count.should.be.eql(4);
          res.body.payload[0].cat.should.be.eql(shouldGet.cat);
          done();
        });
    });

    it("it should do pagination to 1 and 2 page", (done) => {
      const filters = {
        limit: 1,
        page: 2,
      };

      const shouldGet = {
        cat: "Our dear test no.2",
      };
      chai
        .request(server)
        .post("/cat/list")
        .send(filters)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.payload.should.be.a("array");
          res.body.payload.length.should.be.eql(1);
          res.body.page.should.eql(2);
          res.body.count.should.be.eql(4);
          res.body.payload[0].cat.should.be.eql(shouldGet.cat);
          done();
        });
    });

    it("it should do autocomplete with name: 'strange'", (done) => {
      const filters = {
        limit: 1,
        page: 1,
        autocomplete: { key: "cat", value: "strange" },
      };

      const shouldGet = {
        cat: "Strange name for autocomplete",
      };
      chai
        .request(server)
        .post("/cat/list")
        .send(filters)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.payload.should.be.a("array");
          res.body.payload.length.should.be.eql(1);
          res.body.page.should.eql(1);
          res.body.count.should.be.eql(1);
          res.body.payload[0].cat.should.be.eql(shouldGet.cat);
          done();
        });
    });

    it("it should do autocomplete with name: 'test'", (done) => {
      const filters = {
        limit: 20,
        page: 1,
        autocomplete: { key: "cat", value: "test" },
      };

      chai
        .request(server)
        .post("/cat/list")
        .send(filters)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.payload.should.be.a("array");
          res.body.payload.length.should.be.eql(3);
          res.body.page.should.eql(1);
          res.body.count.should.be.eql(3);
          done();
        });
    });

    it("it should do order by -cat everything", (done) => {
      const filters = {
        limit: 20,
        page: 1,
        sort: "-cat",
      };

      chai
        .request(server)
        .post("/cat/list")
        .send(filters)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.payload.should.be.a("array");
          res.body.payload.length.should.be.eql(4);
          res.body.page.should.eql(1);
          res.body.count.should.be.eql(4);
          res.body.payload[0].cat.should.be.eql(
            "Strange name for autocomplete"
          );
          res.body.payload[1].cat.should.be.eql("Our dear test no.3");
          res.body.payload[2].cat.should.be.eql("Our dear test no.2");
          res.body.payload[3].cat.should.be.eql("Our dear test no.1");
          done();
        });
    });

    it("it should do order by +cat everything", (done) => {
      const filters = {
        limit: 20,
        page: 1,
        sort: "+cat",
      };

      chai
        .request(server)
        .post("/cat/list")
        .send(filters)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.payload.should.be.a("array");
          res.body.payload.length.should.be.eql(4);
          res.body.page.should.eql(1);
          res.body.count.should.be.eql(4);
          res.body.payload[3].cat.should.be.eql(
            "Strange name for autocomplete"
          );
          res.body.payload[2].cat.should.be.eql("Our dear test no.3");
          res.body.payload[1].cat.should.be.eql("Our dear test no.2");
          res.body.payload[0].cat.should.be.eql("Our dear test no.1");
          done();
        });
    });
  });
});
