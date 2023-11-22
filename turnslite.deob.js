const fs = require('fs');
const types = require('@babel/types');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;

const generator = require('@babel/generator').default;


function get_context() {
  const start = performance.now();


  const code = fs.readFileSync(filePath, 'utf-8');
  
  
  function findWordInAnyFunction(inputText, targetWord) {
    const functionRegex = /function\s*\([^)]*\)\s*\{([^}]+)\}/g;
    const functions = inputText.match(functionRegex);
  
    if (!functions) {
      return null;
    }
  
    for (const func of functions) {
      const functionBody = func.match(/\{([^}]+)\}/);
      if (functionBody) {
        const bodyText = functionBody[1];
        if (bodyText.includes(targetWord)) {
          return func;
        }
      }
    }
  
    return null;
  }
  
  
  function extractFunctionAndContext(inputText, searchString) {
    const lines = inputText.split('\n');
    const searchIndex = lines.findIndex(line => line.includes(searchString));
  
    if (searchIndex === -1) {
      return null;
    }
  
    let startIndex = searchIndex - 1;
    let braceCount = 0;
    let endIndex = searchIndex + 9
  
    for (let i = searchIndex; i < lines.length; i++) {
      const line = lines[i];
      for (let j = 0; j < line.length; j++) {
        if (line[j] === '{') {
          braceCount++;
        } else if (line[j] === '}') {
          braceCount--;
          if (braceCount === 0) {
            endIndex = i + 1;
            break;
          }
        }
      }
      if (braceCount === 0) {
        break;
      }
    }
  
    const extractedText = lines.slice(startIndex, endIndex).join('\n');
  
    return extractedText;
  }
  
  
  
  function searchAndReturnLines(filePath, searchString) {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const lines = fileContent.split('\n');
    const index = lines.findIndex(line => line.includes(searchString));
  
    if (index !== -1) {
      const startIndex = Math.max(0, index - 1);
      const endIndex = Math.min(index + 11, lines.length);
  
      const result = lines.slice(startIndex, endIndex).join('\n');
      
      const extractedNumbers = result.match(/\d{5,}/g);
      
      if (extractedNumbers && extractedNumbers.length > 0) {
        const extractedNumbersString = extractedNumbers.join(', ');
        
        return extractedNumbersString
      } else {
        return `Result: ${result}\nNo numbers with 4 or more digits found in the result.`;
      }
    } else {
      return `String '${searchString}' not found in the file.`;
    }
  }
  
  
  
  function scrapeTextBetweenMarkers(inputText, leftMarker, rightMarker) {
    const leftIndex = inputText.indexOf(leftMarker);
    const rightIndex = inputText.indexOf(rightMarker);
  
    if (leftIndex === -1 || rightIndex === -1) {
      return '';
    }
  
    const scrapedText = inputText.substring(leftIndex + leftMarker.length, rightIndex);
  
    return scrapedText;
  }
  
  
  const functionPattern = /function\s*\(\s*([^,]+,\s*){4}[^,]+\s*\)\s*{(?:[^}]*parseInt\([^)]*\)[^}]*)*}/;
  let ast = parser.parse(code, {})
  
  const matches = code.match(functionPattern);
  function findNumbers(text) {
    const regex = /\b\d{6,}\b/g;
    return text.match(regex);
  }
  
  
  
  
  let targetFunction = '';
  
  
  var allFunctions = ''
  
  
  
  traverse(ast, {
    FunctionExpression(path) {
      if (
        path.type === 'FunctionExpression' &&
        path.node.params.length === 5 &&
        path.node.body.type === 'BlockStatement'
      ) {
      const formattedFunction = path.toString()
      const linesContainingText = searchAndReturnLines(filePath, 'parseInt(');
      var mads = formattedFunction + '(a,' + linesContainingText + ')'
      allFunctions += '!' + mads + "\n";
  
        path.stop();
      }
    },
  });
  
  
  
  
  function findFunctionsContainingWord(filePath, targetWord) {
    try {
      const data = fs.readFileSync(filePath, 'utf8');
  
      const functionPattern = new RegExp(`function\\s*\\w*\\s*\\([^)]*\\)\\s*{[^}]*\\b${targetWord}\\b[^}]*}`, 'g');
      const matches = data.match(functionPattern) || [];
  
  
      var data_1 = matches[0] + '\n';
      data_1 += ',       ' + scrapeTextBetweenMarkers(matches[0], 'function', `(`) + '()' + '\n'
      data_1 += '    ' + '}\n'
  
      allFunctions += data_1 + '\n';
  
      var data_2 = scrapeTextBetweenMarkers(matches[0], 'function', `(`)
        data_2 += `(),`
        var data_3 = extractFunctionAndContext(data, data_2)
  
        allFunctions += data_3 + '\n';
      return '';
    } catch (err) {
      throw err;
    }
  }
  
  findFunctionsContainingWord(filePath, 'cloudflare')
  eval(allFunctions)


  

  const regex = /([A-Za-z0-9]+)\((\d+)\)/g;
  let modifiedData = code;
    while ((match = regex.exec(code)) !== null) {
    const stringBefore = match[1];
    const numberInside = parseInt(match[2], 10);
    const replacement = b(numberInside);
    modifiedData = modifiedData.replace(match[0], "'" + replacement + "'");
  }

  fs.writeFile('deobfuscated.js', modifiedData, (err) => {
    if (err) {
      console.error('Error writing to the file:', err);
    } else {
      console.log('Data has been written to the file successfully.');
      }
    }
    )

  
  const end = performance.now();
  const elapsedSeconds = (end - start) / 1000
  console.log(elapsedSeconds)
  return ''
}

const filePath = 'vray_turnslite.js';
var code_2 = get_context()