const db = require("../server/sequalizeDatabase");
const Cat = db.tutorials;
let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../server/sequalizeIndex");
let should = chai.should();

chai.use(chaiHttp);
describe("cats", () => {
  beforeEach(async () => {
    //Before each test we empty the database
    await Cat.destroy({
      where: {},
      truncate: true,
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
            page: 1,
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
          res.body.should.have.property("id").and.to.be.an("number");
          res.body.should.have
            .property("cat")
            .and.to.be.equal("Test our dear cat");
          done();
        });
    });
  });

  describe("/GET/:id cat", async () => {
    it("it should GET a cat by the given id", async () => {
      let cat = await Cat.create({
        cat: "Our dear test no.2",
      });

      chai
        .request(server)
        .get("/cat/" + cat.id)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("cat");
          res.body.should.have.property("id").eql(cat.id);
        });
    });
  });

  describe("/PUT/:id cat", () => {
    it("it should PUT a cat by the given id and change it", async () => {
      let cat = await Cat.create({
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
            res.body.should.have.property("id").eql(cat.id);
          });
      });
    });
  });

  describe("/DELETE/:id cat", () => {
    it("it should DELETE a cat", async () => {
      let cat = await Cat.create({
        cat: "Our dear test no.2",
      });

      cat.save((err, cat) => {
        chai
          .request(server)
          .delete("/cat/" + cat.id)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("array");
            res.body[0].eql(1);
          });
      });
    });
    it("should get zero", async () => {
      const filters = {
        when: {
          deleted: false,
        },
      };
      chai
        .request(server)
        .post("/cat/list")
        .send(filters)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.payload.should.be.a("array");
          res.body.payload.length.should.be.eql(0);
          res.body.count.should.be.eql(0);
        });
    });
  });

  describe("/DELETE/multiple cats", async () => {
    it("it should DELETE a cat", async () => {
      let cat1 = await Cat.create({
        cat: "Our dear test no.1",
      });

      let cat2 = await Cat.create({
        cat: "Our dear test no.2",
      });

      const filter = [cat1.id, cat2.id];
      console.log("FILTER", filter);
      chai
        .request(server)
        .delete("/cat")
        .send(filter)
        .end((err, res) => {
          console.log("RES", res.body);
          res.should.have.status(200);
          res.body.should.be.a("array");
          //   res.body[0].eql(2);
        });
    });
    it("should get zero", async () => {
      const filters = {
        when: {
          deleted: false,
        },
      };
      chai
        .request(server)
        .post("/cat/list")
        .send(filters)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.payload.should.be.a("array");
          res.body.payload.length.should.be.eql(0);
          res.body.count.should.be.eql(0);
        });
    });
  });

  describe("/GET cat, test list general", () => {
    beforeEach(async () => {
      await Cat.create({
        cat: "Our dear test no.1",
      });

      await Cat.create({
        cat: "Our dear test no.2",
      });
      await Cat.create({
        cat: "Our dear test no.3",
      });
      await Cat.create({
        cat: "Strange name for autocomplete",
      });
    });

    it("it should GET all the cat with right count", (done) => {
      chai
        .request(server)
        .post("/cat/list")
        .end((err, res) => {
          console.log("catlistres", res.body);

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
          console.log("catlistres", res.body);
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
        autocomplete: { key: "cat", value: "our" },
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
    it("it should do filter by name", (done) => {
      const filters = {
        limit: 20,
        page: 1,
        when: { cat: "Strange name for autocomplete" },
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
          res.body.payload[0].cat.should.be.eql(
            "Strange name for autocomplete"
          );
          done();
        });
    });
  });
});
