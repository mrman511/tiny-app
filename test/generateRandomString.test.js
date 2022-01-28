const mocha = require('mocha');
const chai = require('chai');

const { generateRandomString} =require('../helperFuncs');
const { assert } = require('chai');

describe('#generateRandomString', function() {
  it('should return a string', function(){
    const variable = generateRandomString(3);
    assert.isString(variable);
  });

  it('should be the specified length', function() {
    const length = 6;
    console.log(generateRandomString(length))
    assert.equal(length, generateRandomString(length).length);
  });
});