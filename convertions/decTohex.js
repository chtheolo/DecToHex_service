exports.Dec2Hex = function(decimal) {
    const zero_ascii = 48;
    const caps_asscii_minus10 = 55;
    var remainder;                  // remainder is our hex numbers
    var quotient = decimal;         // quotient will be the new decimal

    var hex_num = [];

    while (quotient != 0) {
        remainder = quotient % 16;
        if (remainder < 10) {
            hex_num.splice(0, 0, String.fromCharCode(remainder + zero_ascii));
        }
        else {
            hex_num.splice(0, 0, String.fromCharCode(remainder + caps_asscii_minus10));
        }
        quotient = parseInt(quotient / 16);
    }

    return hex_num.join("");
}