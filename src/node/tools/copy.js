module.exports = (src, dest) => {
  const srcFileName = src || path.resolve(__dirname, 'data.txt');
  const destFileName = dest || path.resolve(__dirname, 'data-bak.txt');

  let inputStream = fs.createReadStream(srcFileName);
  let outputStream = fs.createWriteStream(destFileName);

  inputStream.pipe(outputStream);

  inputStream.on('end', () => {
    console.log('拷贝完成');
  });
};
