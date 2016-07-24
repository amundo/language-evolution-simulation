class Word {
  constructor(word, island, parent, compoundOf) {
    this.parent = parent;
    this.word = word;
    this.island = island;
    this.compoundOf = compoundOf;

  }

  static get VOWELS(){ 
    return [ 'a', 'e', 'ı', 'i', 'u', 'ü', 'ö', 'o' ]
  }

  static get CONSONANTS(){
    return [
      'b', 'c', 'd', 'f', 'g', 'ğ', 'h', 'j', 'k', 'l', 
      'm', 'n', 'p', 'r', 's', 'ş', 't', 'v', 'y', 'z'
    ];
  }
  static random(length, island) {
    length = length || Math.floor(Math.random() * 10);
  
    var generated = Array.apply(
      null, {
        length: length
      }
    ).reduce(
       (prev, current) => {
        if (Word.VOWELS.indexOf(prev[prev.length - 1]) === -1) {
          return prev + choiceRandom(Word.VOWELS);
        } else {
          return prev + choiceRandom(Word.CONSONANTS);
        }
      },
      island.prefix
    );
  
    return new Word(generated, island, null, null);
  }

  compoundWith(wordInstance, island) {
    var left = this.word.slice(
      Math.floor(this.word.length / 2)
    );
  
    var right = this.word.slice(
      Math.floor(this.word.length / 2)
    );
  
    var infix = (
      Word.VOWELS.indexOf(left[left.length - 1]) === -1
        ? choiceRandom(Word.VOWELS)
        : choiceRandom(Word.CONSONANTS)
    );
  
    return new Word(
      left + infix + right,
      island,
      this,
      wordInstance
    );
  }

  mutateWord(soundSet, island) {
    var word = this.word;
    var mutatedSounds = Math.floor(Math.random() * 5) + 1;
    var mutatable = soundSet.filter(function (sound) {
      return word.indexOf(sound) > -1
    });
  
    for (var i = 0; i < mutatedSounds; i++) {
      word = word.replace(
        choiceRandom(mutatable),
        choiceRandom(soundSet)
      );
    }
  
    return new Word(word, island, this);
  };

  mutateVowel(island) {
    return this.mutateWord(Word.VOWELS, island);
  };
  
  mutateConst(island) {
    return this.mutateWord(Word.CONSONANTS, island);
  };
}





