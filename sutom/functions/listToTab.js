export default function listToTab (){
    const fs = require('fs');
    const words = fs.readFileSync('./data/liste_francais_utf8.txt', 'utf-8', (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
    });
    //put text into tab
    const tabOfWords = words.split(/\r?\n/);
    
    return tabOfWords
}