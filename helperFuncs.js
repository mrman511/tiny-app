
const generateRandomString = (num) => {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  let randomItems = [];
  for (let i = 0; randomItems.length < num; i++) {
    let num = Math.floor(Math.random() * 2);
    if (num === 0) {
      randomItems.push(String(Math.floor(Math.random() * 10)));
    } else {
      randomItems.push(alphabet[Math.floor(Math.random() * 26)]);
    }
  }
  return (randomItems.join(''));
};

module.exports = {
  generateRandomString,
}