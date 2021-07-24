var assert = require('assert');
const convert = require('../conversions/decTohex');

const iterations = 100;
const min = 100;
const max = 10000;

describe('Conversion', function () {
    describe('#accuracy()', function() {
        it('should return no errors if we have the same conversion results', async function () {

            async function getRandomIntInclusive(min, max) {
              min = Math.ceil(min);
              max = Math.floor(max);
              return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
            } 

            let sum_error = 0;
            let decimal;
            var hex;
            var data;
            var correct=0;
            for (let i=0; i<iterations; i++) {
                decimal = await getRandomIntInclusive(min, max);
                hex = decimal.toString(16).toUpperCase();
                try {
                    data = await convert.Dec2Hex(decimal);
                    if (hex == data.hexadecimal) {
                        correct++;
                    }
                }
                catch(error) {
                    sum_error++;
                }
            }
            assert.strictEqual(correct, iterations);
        })
    })
})