let mongoose = require("mongoose");
let Code = require("../server/model");

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../server/index");
let should = chai.should();

chai.use(chaiHttp);
//Our parent block
describe("Codes", () => {
  beforeEach((done) => {
    //Before each test we empty the database
    Code.remove({}, (err) => {
      done();
    });
  });

  describe("/GET code", () => {
    it("it should GET all the codes", (done) => {
      chai
        .request(server)
        .post("/code/list")
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

  describe("/POST code", () => {
    it("it should POST a code", (done) => {
      let code = {
        code: "Test our dear code",
      };
      chai
        .request(server)
        .post("/code")
        .send(code)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("_id").and.to.be.an("string");
          res.body.should.have
            .property("code")
            .and.to.be.equal("Test our dear code");
          done();
        });
    });
  });

  describe("/GET/:id code", () => {
    it("it should GET a code by the given id", (done) => {
      let code = new Code({
        code: "Our dear test no.2",
      });
      code.save((err, code) => {
        chai
          .request(server)
          .get("/code/" + code.id)
          //   .send(code)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("code");
            res.body.should.have.property("_id").eql(code.id);
            done();
          });
      });
    });
  });

  describe("/PUT/:id code", () => {
    it("it should PUT a code by the given id and change it", (done) => {
      let code = new Code({
        code: "Our dear test no.2",
      });

      let changedCode = {
        code: "Out dear changed test no.3 :)",
      };
      code.save((err, code) => {
        chai
          .request(server)
          .put("/code/" + code.id)
          .send(changedCode)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("code").eql(changedCode.code);
            res.body.should.have.property("_id").eql(code.id);
            done();
          });
      });
    });
  });

  describe("/GET code, test list general", async () => {
    beforeEach(async () => {
      await new Code({
        code: "Our dear test no.1",
      }).save();
      await new Code({
        code: "Our dear test no.2",
      }).save();
      await new Code({
        code: "Our dear test no.3",
      }).save();
      await new Code({
        code: "Strange name for autocomplete",
      }).save();
    });
    it("it should GET all the codes with right count", (done) => {
      chai
        .request(server)
        .post("/code/list")
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
        .post("/code/list")
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
        code: "Our dear test no.1",
      };
      chai
        .request(server)
        .post("/code/list")
        .send(filters)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.payload.should.be.a("array");
          res.body.payload.length.should.be.eql(1);
          res.body.page.should.eql(1);
          res.body.count.should.be.eql(4);
          res.body.payload[0].code.should.be.eql(shouldGet.code);
          done();
        });
    });

    it("it should do pagination to 1 and 2 page", (done) => {
      const filters = {
        limit: 1,
        page: 2,
      };

      const shouldGet = {
        code: "Our dear test no.2",
      };
      chai
        .request(server)
        .post("/code/list")
        .send(filters)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.payload.should.be.a("array");
          res.body.payload.length.should.be.eql(1);
          res.body.page.should.eql(2);
          res.body.count.should.be.eql(4);
          res.body.payload[0].code.should.be.eql(shouldGet.code);
          done();
        });
    });

    it("it should do autocomplete with name: 'strange'", (done) => {
      const filters = {
        limit: 1,
        page: 1,
        autocomplete: { key: "code", value: "strange" },
      };

      const shouldGet = {
        code: "Strange name for autocomplete",
      };
      chai
        .request(server)
        .post("/code/list")
        .send(filters)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.payload.should.be.a("array");
          res.body.payload.length.should.be.eql(1);
          res.body.page.should.eql(1);
          res.body.count.should.be.eql(1);
          res.body.payload[0].code.should.be.eql(shouldGet.code);
          done();
        });
    });

    it("it should do autocomplete with name: 'test'", (done) => {
      const filters = {
        limit: 20,
        page: 1,
        autocomplete: { key: "code", value: "test" },
      };

      chai
        .request(server)
        .post("/code/list")
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

    it("it should do order by -code everything", (done) => {
      const filters = {
        limit: 20,
        page: 1,
        sort: "-code",
      };

      chai
        .request(server)
        .post("/code/list")
        .send(filters)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.payload.should.be.a("array");
          res.body.payload.length.should.be.eql(4);
          res.body.page.should.eql(1);
          res.body.count.should.be.eql(4);
          res.body.payload[0].code.should.be.eql(
            "Strange name for autocomplete"
          );
          res.body.payload[1].code.should.be.eql("Our dear test no.3");
          res.body.payload[2].code.should.be.eql("Our dear test no.2");
          res.body.payload[3].code.should.be.eql("Our dear test no.1");
          done();
        });
    });

    it("it should do order by +code everything", (done) => {
      const filters = {
        limit: 20,
        page: 1,
        sort: "+code",
      };

      chai
        .request(server)
        .post("/code/list")
        .send(filters)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.payload.should.be.a("array");
          res.body.payload.length.should.be.eql(4);
          res.body.page.should.eql(1);
          res.body.count.should.be.eql(4);
          res.body.payload[3].code.should.be.eql(
            "Strange name for autocomplete"
          );
          res.body.payload[2].code.should.be.eql("Our dear test no.3");
          res.body.payload[1].code.should.be.eql("Our dear test no.2");
          res.body.payload[0].code.should.be.eql("Our dear test no.1");
          done();
        });
    });
  });
});
