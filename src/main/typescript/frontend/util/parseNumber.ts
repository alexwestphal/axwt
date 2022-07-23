/*
 * Copyright (c) 2019-2022, OnPoint Digital, Inc. All rights reserved
 */

export const parseNumber = (str: string, numberType: 'Integer' | 'Decimal'): number => {
    let cleaned = ""
    if(str.length == 0) return 0
    if(numberType == 'Integer') {
        // Integer rules: /^[-+]?[0-9]*$/

        for(let i=0; i<str.length; i++) {
            let c = str.charAt(i)

            // '+' or '-' allowed at beginning
            if((c == '+' || c == '-') && 0 == i ) cleaned += c
            // '0'-'9' allowed anywhere
            else if('0' <= c && c <= '9') cleaned += c
            else { /* Ignore char */ }
        }

        // Strip leading zeros
        while(cleaned.length > 1 && cleaned.charAt(0) == '0') cleaned = cleaned.substr(1)

        return parseInt(cleaned)
    } else {
        // Apply decimal rules: /^[-+]?[0-9]*([,\.][0-9]*)?$/
        let dividerSeen = false
        for(let i=0; i<str.length; i++) {
            let c = str.charAt(i)

            // '+' or '-' allowed at beginning
            if((c == '+' || c == '-') && 0 == i ) cleaned += c
            // ',' or '.' allowed up to once
            else if((c == ',' || c == '.') && !dividerSeen) { cleaned += c; dividerSeen = true}
            // '0'-'9' allowed anywhere
            else if('0' <= c && c <= '9') cleaned += c
            else { /* Ignore char */ }
        }

        // Strip excess leading zeros
        while(cleaned.length > 1 && cleaned.charAt(0) == '0' && !(cleaned.charAt(1) == ',' || cleaned.charAt(1) == '.'))
            cleaned = cleaned.substr(1)

        return parseFloat(cleaned)
    }
}

export default parseNumber