const CRLFReplacerRegex = /( *\r\n *)|( *\r *)|( *\n *)/g
const CRLFRegex = /\r\n/g
const CRLF = '\r\n'

const syntaxErrorMsg = `
Invalid Escape Sequence encountered.

For Details About Escape Sequencies in Template Literals See - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#tagged_templates_and_escape_sequences
`

/**
 * Manually create spec complient (or not) http message texts.
 * @returns {string} - String where all global CRLF, CR, LF characters before body section,
 * including trailing spaces, replaced (each group) with CRLF's.
 * 
 * If CRLF already compriesed, then CR and LF will not be considered separately.
 * 
 * NOTE: If invalid escape sequence encountered SyntaxError will be thrown.
 */
function HTTPTag(tokens, ...values) {
    const hasInvalidEscapeSequence = tokens.some(token => token === undefined)
    if (hasInvalidEscapeSequence) throw new SyntaxError(syntaxErrorMsg)

    let expectedNewLineOffset = -1
    let bodyStarted = false
    const formated = values.reduce(
        (str, val, index, values) => {
            val = val + ''

            if (bodyStarted) return str + val + tokens[index + 1]

            if (index !== values.length - 1 && !tokens[index + 1].length) {
                values[index + 1] = val + values[index + 1]
                return str
            }

            if (expectedNewLineOffset !== 0) expectedNewLineOffset = -1

            let matchFound = false
            const expNewLinesIterable = val.matchAll(CRLFRegex)
            for (const match of expNewLinesIterable) {
                matchFound = true

                const offset = match.index
                const input = match.input

                if (expectedNewLineOffset === offset) {
                    bodyStarted = true
                    break
                }

                expectedNewLineOffset = offset + input.length === val.length ? 0 : offset + input.length
            }
            if (bodyStarted) return str + val + tokens[index + 1]

            if (expectedNewLineOffset !== 0 || !matchFound && val.length) expectedNewLineOffset = -1

            const replacedNextStr = tokens[index + 1].replace(CRLFReplacerRegex, (input, p1, p2, p3, offset, string) => {
                if (bodyStarted) return input

                if (expectedNewLineOffset === offset) {
                    bodyStarted = true
                    return CRLF
                }

                expectedNewLineOffset = offset + input.length === string.length ? 0 : offset + input.length
                return CRLF
            })
            return str + val + replacedNextStr
        }, tokens[0].trimLeft().replace(CRLFReplacerRegex,
            (input, p1, p2, p3, offset, string) => {
                if (bodyStarted) return input

                if (expectedNewLineOffset === offset) {
                    bodyStarted = true
                    return CRLF
                }

                expectedNewLineOffset = offset + input.length === string.length ? 0 : offset + input.length
                return CRLF
            }
        )
    )
    if (bodyStarted) return formated

    if (formated.endsWith(CRLF)) {
        return formated + CRLF
    } else {
        return formated + CRLF + CRLF
    }
}

module.exports = HTTPTag