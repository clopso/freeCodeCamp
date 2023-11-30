const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

const IssueModel = require("../models/issue");

chai.use(chaiHttp);

function genRandomString(length) {
  var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
  var charLength = chars.length;
  var result = "";
  for (var i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * charLength));
  }
  return result;
}

const invalidId = "654e3f7450199d00136130ce";

suite('Functional Tests', function() {
  suite("Create Issue", () => {
    test("Create an issue with every field", (done) => {
      let allFieldsIssue = {
        issue_title: "new issue",
        issue_text: "text",
        created_by: "test script",
        assigned_to: "Devs",
        status_text: "Open",
      };
      chai
        .request(server)
        .keepOpen()
        .post("/api/issues/apitest/")
        .send(allFieldsIssue)
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.include(res.body, allFieldsIssue);
          assert.equal(res.body.open, true);
          done();
        });
    });
    test("Create an issue with only required fields", (done) => {
      const requiredFieldsIssue = {
        issue_title: "new issue",
        issue_text: "text",
        created_by: "test script",
      };
      chai
        .request(server)
        .keepOpen()
        .post("/api/issues/apitest/")
        .send(requiredFieldsIssue)
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.include(res.body, requiredFieldsIssue);
          assert.equal(res.body.open, true);
          done();
        });
    });
    test("Create an issue with missing required fields", (done) => {
      const issueWithMissingRequiredFields = {
        assigned_to: "Devs",
        status_text: "Open",
      };
      chai
        .request(server)
        .keepOpen()
        .post("/api/issues/apitest/")
        .send(issueWithMissingRequiredFields)
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "required field(s) missing");
          done();
        });
    });
  });
  suite("View Issues", () => {
    test("View issues on a project", (done) => {
      chai
        .request(server)
        .keepOpen()
        .get("/api/issues/apitest/")
        .end(async function (err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body);

          const firstIssue = res.body[0];
          try {
            const val = await IssueModel.validate(firstIssue);
            assert.isOk(val, `Validation error for issue: ${JSON.stringify(firstIssue)}`);
          } catch (validationError) {
            console.error("Validation error:", validationError.errors);
          }

          done();
        });
    });
    test("#5 View issues on a project with one filter", (done) => {
      chai
        .request(server)
        .keepOpen()
        .get("/api/issues/apitest")
        .query({ open: true }) // filter
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.isNotEmpty(res.body, 'No issues with "open" set to true');
          res.body.forEach((issue) => {
            assert.equal(issue.open, true);
          });
          done();
        });
    });
    test("#6 View issues on a project with multiple filters", (done) => {
      const testQuery = {
        issue_title: "new issue",
        assigned_to: "Devs",
      }
      chai
        .request(server)
        .keepOpen()
        .get("/api/issues/apitest")
        .query(testQuery)
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.isNotEmpty(
            res.body,
            `No issues with "issue_title" set to ${testQuery.issue_title} & assigned_to set to ${testQuery.assigned_to}`
          );
          res.body.forEach((issue) => {
            assert.include(issue, testQuery);
          });
          done();
        });
    });
  });
  suite("Update Issue", () => {
    test("#7 Update one field on an issue: PUT request to /api/issues/{project}", (done) => {
      const string = genRandomString(10);
      chai
        .request(server)
        .keepOpen()
        .get("/api/issues/apitest") // get all
        .end(function (err, res) {
          const id = res.body[0]._id; // select
          chai
            .request(server)
            .keepOpen()
            .put("/api/issues/apitest") // update
            .send({ _id: id, created_by: string })
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.body.result, "successfully updated");
              assert.equal(res.body._id, id);
              chai
                .request(server)
                .keepOpen()
                .get("/api/issues/apitest")
                .end(function (err, res) {
                  assert.equal(res.body[0].created_by, string);
                  done();
                });
            });
        });
    });
    test("#8 Update multiple fields on an issue", (done) => {
      const val1 = genRandomString(10);
      const val2 = genRandomString(10);
      chai
        .request(server)
        .keepOpen()
        .get("/api/issues/apitest") // get all
        .end(function (err, res) {
          const id = res.body[0]._id; // select
          chai
            .request(server)
            .keepOpen()
            .put("/api/issues/apitest") // update
            .send({ _id: id, issue_text: val1, issue_title: val2 })
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.body.result, "successfully updated");
              assert.equal(res.body._id, id);
              chai
                .request(server)
                .keepOpen()
                .get("/api/issues/apitest")
                .end(function (err, res) {
                  assert.equal(res.body[0].issue_text, val1);
                  assert.equal(res.body[0].issue_title, val2);
                  done();
                });
            });
        });
    });
    test("#9 Update an issue with missing _id", (done) => {
      chai
        .request(server)
        .keepOpen()
        .put("/api/issues/test")
        .send({
          issue_title: "no_id",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "missing _id");
          done();
        });
    });
    test("#10 Update an issue with no fields to update", (done) => {
      chai
        .request(server)
        .keepOpen()
        .get("/api/issues/apitest") // get all
        .end(function (err, res) {
          const id = res.body[0]._id; // select
          chai
            .request(server)
            .keepOpen()
            .put("/api/issues/apitest") // update
            .send({ _id: id })
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.body._id, id);
              assert.equal(res.body.error, "no update field(s) sent"); // assert
              done();
            });
        });
    });
    test("#11 Update an issue with an invalid _id", (done) => {
      chai
        .request(server)
        .keepOpen()
        .put("/api/issues/apitest") // update
        .send({ _id: invalidId, issue_text: "value" })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body._id, invalidId);
          assert.equal(res.body.error, "could not update"); // assert
          done();
        });
    });
  });
  suite("Delete Issue", () => {
    test("#12 Delete an issue", (done) => {
      chai
        .request(server)
        .keepOpen()
        .get("/api/issues/apitest") // get all
        .end(function (err, res) {
          const id = res.body[0]._id; // select
          chai
            .request(server)
            .keepOpen()
            .delete("/api/issues/apitest") // delete
            .send({ _id: id })
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.body._id, id);
              assert.equal(res.body.result, "successfully deleted"); // assert
              done();
            });
        });
    });
    test("#13 Delete an issue with an invalid _id", (done) => {
      chai
        .request(server)
        .keepOpen()
        .delete("/api/issues/apitest") // delete
        .send({ _id: invalidId })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body._id, invalidId);
          assert.equal(res.body.error, "could not delete"); // assert
          done();
        });
    });
    test("#14 Delete an issue with missing _id", (done) => {
      chai
        .request(server)
        .keepOpen()
        .delete("/api/issues/apitest") // delete
        .send({})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "missing _id"); // assert
          done();
        });
    });
  });

});
