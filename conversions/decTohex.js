exports.Dec2Hex = async function(decimal) {
    return new Promise((resolve, reject) => {
        var data = {
            decimal: decimal,
            hexadecimal: 0,
            execution_time: 0,
            steps_count: 0,
            no_number_error: false,
            no_integer_error: false
        }
        if (typeof decimal === 'string') {
            data.no_number_error = true;
            reject("Conversion Error! You have to give an integer number NOT a string!");
        }
        else if (typeof decimal === 'number') {
            if (!Number.isInteger(decimal)) {
                data.no_number_error = true;
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
                var hex_buffer = [];               // buffer to keep values in each iteration

                var begin = process.hrtime();
                while (quotient != 0) {
                    data.steps_count++;
                    remainder = quotient % base;
                    if (remainder < HexLetters) {
                        hex_buffer.splice(0, 0, String.fromCharCode(remainder + zero_ascii));
                    }
                    else {
                        hex_buffer.splice(0, 0, String.fromCharCode(remainder + caps_asscii_minus10));
                    }
                    quotient = parseInt(quotient / base);
                }
                data.execution_time = process.hrtime(begin)[1] / 1000000;

                if (quotient == 0) {
                    data.hexadecimal = hex_buffer.join("");
                    resolve(data);
                }
            }
        }
    });
}