function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function ramal(){
  var ramalan = ['halo','hehe','lala'];
  var ramalanKocok = shuffle(ramalan);
  randomIndex = Math.floor(Math.random() * ramalanKocok.length);
  return ramalan[randomIndex];
}

module.export.ramal = ramal;

console.log(ramal());
