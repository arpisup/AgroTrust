const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/routes/batchRoutes.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Fix double return statements
content = content.replace(/return return /g, 'return ');

fs.writeFileSync(filePath, content);
console.log('Fixed double return statements in batchRoutes.ts'); 