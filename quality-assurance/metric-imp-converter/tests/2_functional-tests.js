const chaiHttp = require('chai-http');
const chai = require('chai');
let assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  suite('GET request to /api/convert', function() {
    test('valid input such as 10L', function(done) {
      chai
        .request(server)
        .keepOpen()
        .get('/api/convert?input=10L')
        .end(function(err, res) {
         if(err) done(err);
          assert.equal(res.status, 200);
          assert.equal(res.body.returnUnit, 'gal');
          assert.hasAllKeys(res.body, ['initNum', 'initUnit', 'returnNum', 'returnUnit', 'string']);
          done();
      });
    });

    test('invalid input such as 32g', function(done) {
      chai.request(server)
        .keepOpen()
        .get('/api/convert?input=32g')
        .end(function(err, res) {
        if(err) done(err);
        assert.equal(res.body, 'invalid unit');
        done();
      });
    });
    test('invalid number such as 3/7.2/4kg', function(done) {
      chai.request(server)
        .keepOpen()
        .get('/api/convert?input=3/7.2/4kg')
        .end(function(err, res) {
        if(err) done(err);
        assert.equal(res.body, 'invalid number');
        done();
      });
    });
    test('invalid number AND unit such as 3/7.2/4kilomegagram', function(done) {
      chai.request(server)
        .keepOpen()
        .get('/api/convert?input=3/7.2/4kilomegagram')
        .end(function(err, res) {
        if(err) done(err);
        assert.equal(res.body, 'invalid number and unit');
        done();
      });
    });
    test('no number such as kg', function(done) {
      let testJson = { 
        initNum: 1,
        initUnit: 'kg',
        returnNum: 2.20462,
        returnUnit: 'lbs',
        string: '1 kilograms converts to 2.20462 pounds'};
      chai.request(server)
        .keepOpen()
        .get('/api/convert?input=kg')
        .end(function(err, res) {
        if(err) done(err);
        assert.equal(res.status, 200);
        assert.equal(res.body.returnUnit, 'lbs');
        assert.equal(res.body.string, "1 kilograms converts to 2.20462 pounds");
        assert.isObject(res.body);
        assert.deepEqual(res.body, testJson);
        done();
      });
    });
  });
});