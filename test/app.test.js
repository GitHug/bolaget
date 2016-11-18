const chai = require('chai'),
  expect = chai.expect,
  should = chai.should(),
  bolaget = require('../app');

describe('bolaget', function(done) {
  const seconds = 1000;
  this.timeout(30 * seconds);

  it('should get Systembolaget XML', function (done) {
    setTimeout(function () {
      try {
        bolaget.asXML((xml) => {
          expect(xml).to.be.defined;
          expect(xml.length).to.be.above(0);
          done();
        });
      } catch(e) {
        done(e);
      }
    }, 100 );
  });

  it('should get Systembolaget as JSON', function (done) {
    setTimeout(function () {
      try {
        bolaget.asJSON((json) => {
          expect(json).to.be.defined;
          isJSON(json).should.be.true;
          done();
        });
      } catch(e) {
        done(e);
      }
    }, 100 );
  });
});

function isJSON(something) {
    if (typeof something != 'string') {
      something = JSON.stringify(something);
    }
    try {
        JSON.parse(something);
        return true;
    } catch (e) {
        return false;
    }
}
