function getLetter(letters){
  return letters.charAt(Math.floor(Math.random() * letters.length))
}

export default function generateCharSet(){
  const results = [];
  const vowels = 'AEIOU';
  const consonants = 'BCDFGHJKLMNPQRSTVWXYZ';
  const fullAlpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let i = 0; i < 2; i++){
    results.push(getLetter(vowels), getLetter(consonants))
  }
  for (let i = 0; i < 7; i++){
    results.push(getLetter(fullAlpha))
  }
  return results.join('');
}