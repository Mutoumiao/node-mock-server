const fs = require('fs');
const path = require('path');

// 获取当前文件夹里的.js文件（忽略index.js），并作为对象进行导出
function getExportsFromJsFiles() {
  const currentDir = __dirname;
  const files = fs.readdirSync(currentDir);
  const jsFiles = files.filter((file) => path.extname(file) === '.js' && file !== 'index.js');
  const exports = {};

  jsFiles.forEach((file) => {
    const fileName = path.basename(file, '.js');
    const fileExports = require(path.join(currentDir, file));

    exports[fileName] = fileExports;
  });

  return exports;
}

module.exports = getExportsFromJsFiles();