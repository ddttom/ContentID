import { loadCSS } from '../scripts/lib.js';

export async function processContent(filepath) {
  // Read markdown file
  const mdContent = await fs.readFile(filepath, 'utf8');
  
  // Convert markdown to HTML
  let html = convertMarkdown(mdContent);
  
  // Process tables into blocks
  html = processTablesIntoBlocks(html);
  
  // Read template
  const template = await fs.readFile('template.txt', 'utf8');
  
  // Insert content
  return template.replace('{{ INSERT_CONTENT_HERE }}', html);
}

function processTablesIntoBlocks(html) {
  // Find table elements
  const tables = html.matchAll(/<table>(.*?)<\/table>/gs);
  
  for (const table of tables) {
    const firstCell = extractFirstCell(table[1]);
    const [blockType, modifier] = parseBlockType(firstCell);
    const content = convertTableToBlockContent(table[1]);
    
    const blockHtml = `
      <div class="${blockType}${modifier ? ' ' + modifier : ''}">
        <div>${content}</div>
      </div>
    `;
    
    html = html.replace(table[0], blockHtml);
  }
  
  return html;
}

function extractFirstCell(tableContent) {
  const firstRow = tableContent.match(/<tr>(.*?)<\/tr>/s);
  if (!firstRow) return '';
  
  const firstCell = firstRow[1].match(/<td>(.*?)<\/td>/s);
  return firstCell ? firstCell[1] : '';
}

function parseBlockType(cellContent) {
  const match = cellContent.match(/^(.*?)(?:\((.*?)\))?$/);
  return [match[1].trim(), match[2]?.trim()];
}

function convertTableToBlockContent(tableContent) {
  const rows = tableContent.matchAll(/<tr>(.*?)<\/tr>/gs);
  let content = '';
  
  for (const row of rows) {
    const cells = row[1].matchAll(/<td>(.*?)<\/td>/gs);
    let rowContent = '';
    
    for (const cell of cells) {
      rowContent += `<div>${cell[1]}</div>`;
    }
    
    content += `<div>${rowContent}</div>`;
  }
  
  return content;
}
