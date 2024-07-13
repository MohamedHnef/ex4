const fs = require('fs');
const path = require('path');

// Utility function to read and parse JSON file
const loadJSON = (filePath) => {
  const data = fs.readFileSync(path.join(__dirname, '..', filePath), 'utf-8');
  return JSON.parse(data);
};

module.exports = { loadJSON };
