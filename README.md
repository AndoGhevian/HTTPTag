# HTTPTag

## Description
The **HTTPTag** is a Template literal tag to easily write HTTP Message texts.
```javascript
const HTTPTag = require('http-tag')

const xHeader = 'Custom-Header'

socket.write(
    HTTPTag`
    GET / HTTP/1.1
    X-Header: ${xHeader}
    
    `
)
```

## Installation
Simple as: `npm install --save http-tag`

## Usage
Well, as you see above, its very simple to use:
```javascript
HTTPTag`
    GET / HTTP/1.1
    X-Header: ${xHeader}
    
`
```
You dont need to manually handle **CR** and **LF** characters before **end of
heade** (start of body) section of a message.

Before **End Of A Message Head**, all global CRLF, CR and LF characters, i.e. that are not provided as
**expressions** to template literal, will be replaced with a CRLF each, including their trailing spaces
(**considered only sequences of ' ' characters**).

Leading [Whitespace Characters][mdn_whitespace] - `\n, \r \t ' ' ...`
of a hall string will be trimed:
```javascript
HTTPTag`
    \r\n    \t // this will be trimed
    HTTP/1.1 200 OK
 
`
```
Note that We do not handle exactly the format of **HTTP Messages**, instead we support
its light-writing, so the comments above considered as valid input.

As Globaly all CR's and LF's before **end of a message head** will be replaced by CRLF's, you need a way
to also pass this characters **Without Any Modification** to the HTTP message head section, and maybe also some trailing spaces,
for this scenario you need to pass them in expressions to template literal:
```javascript
HTTPTag`
    GET / HTTP/1.1
    ${'  ' + 'This CR will not be mearged with followed by \n character: \r'}
 
`
```

And Finally if after processing of a string the **end of a header** section is not
encountered, we will add final CRLF(**s**) for you.


[mdn_whitespace]: https://developer.mozilla.org/en-US/docs/Glossary/Whitespace