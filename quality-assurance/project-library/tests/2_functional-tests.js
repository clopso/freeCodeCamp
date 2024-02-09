/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const BookModel = require("../models/book");

chai.use(chaiHttp);

suite('Functional Tests', function() {
  suite('Routing tests', function() {

    const invalidId = "654fcfb7192811f5075f4dd1";
    let id;
    
    suite('POST /api/books with title => create book object/expect book object', function() {
      test('Test POST /api/books with title', function(done) {
        const book = { title: "Random Title" }

        chai
          .request(server)
          .post("/api/books")
          .send(book)
          .end(function (err, res){
            assert.equal(res.status, 200);
            assert.isObject(res.body, "response should be an object");
            assert.equal(res.body.title, book.title);
            done();
          });
      });
      
      test('Test POST /api/books with no title given', function(done) {
        const book = {}

        chai
          .request(server)
          .post("/api/books")
          .send(book)
          .end(function (err, res){
            assert.equal(res.status, 200);
            assert.equal(res.text, "missing required field title");
            done();
          });
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai
          .request(server)
          .get("/api/books")
          .end(function (err, res){
            assert.equal(res.status, 200);
            assert.containsAllKeys(res.body[0], ["title", "_id", "comments", "commentcount"]);
            id = res.body[0]._id
            done();
          });
      
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai
          .request(server)
          .get(`/api/books/${invalidId}`)
          .end(function (err, res){
            assert.equal(res.status, 200);
            assert.equal(res.text, "no book exists");
            done();
          })
      });
      
      test('Test GET /api/books/[id] with valid id in db', function(done){
        
        chai
          .request(server)
          .get(`/api/books/${id}`)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body._id, id);
            done();
          })
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        
        const comment = "Random Comment";

        chai
          .request(server)
          .post(`/api/books/${id}`)
          .send({ comment })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body._id, id);
            assert.isArray(res.body.comments);
            assert.include(res.body.comments, comment);
            done();
          })
      });

      test('Test POST /api/books/[id] without comment field', function(done){

        const comment = {};

        chai
          .request(server)
          .post(`/api/books/${id}`)
          .send({ comment })
          .end(function (err, res){
            assert.equal(res.status, 200);
            assert.equal(res.text, "missing required field comment");
            done();
          })
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        const comment = "test";
        chai
          .request(server)
          .post(`/api/books/${invalidId}`)
          .send({ comment })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, "no book exists");
            done();
          });
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai
          .request(server)
          .delete(`/api/books/${id}`)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, "delete successful");
            done();
          });
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        chai
          .request(server)
          .delete(`/api/books/${invalidId}`)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, "no book exists");
            done();
          });
      });

    });

  });
});
