exports.Dec2Hex = async function(decimal) {
    return new Promise((resolve, reject) => {
        if (typeof decimal === 'string') {
            reject("Conversion Error! You have to give an integer number NOT a string!");
        }
        else if (typeof decimal === 'number') {
            if (!Number.isInteger(decimal)) {
                reject("Conversion Error! You gave a number but is NOT an integer!");
            }
            else {
                console.log("Enter a valid number");
                const zero_ascii = 48;
                const caps_asscii_minus10 = 55;
                const base = 16;
                const HexLetters = 10;          // from number 10 we have letters representation

                var remainder;                  // remainder is our hex numbers
                var quotient = decimal;         // quotient will be the new decimal

                var hex_num = [];

                while (quotient != 0) {
                    remainder = quotient % base;
                    if (remainder < HexLetters) {
                        hex_num.splice(0, 0, String.fromCharCode(remainder + zero_ascii));
                    }
                    else {
                        hex_num.splice(0, 0, String.fromCharCode(remainder + caps_asscii_minus10));
                    }
                    quotient = parseInt(quotient / base);
                }

                if (quotient == 0) {
                    resolve(hex_num.join(""));
                }
            }
        }
    });
}