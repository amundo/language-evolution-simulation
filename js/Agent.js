class Agent {
  constructor(island, model, eventLog, counter){
    this.island = island;
    this.home = island.code;
    this.position = null;
    this.model = model;
    this.id = Math.random();
    this.state = Agent.LIVE;
    this.inbox = null;
    this.eventLog = eventLog;
    this.counter = counter;
    this.vocabulary = [
      new Word(
        __INITIAL_WORDS__[island.code],
        island
      )
    ];
    this.vocabulary.forEach(word  => island.addWord(word))
  }

  static get LIVE(){ return 1 }
  static get DEAD(){ return 2 }
  
  static get MUTATION_CHAIN(){
    return [
      [0.9, 'NO_MUTATION'],
      [0.02, 'COMPOUND'],
      [0.04, 'CONSONANT'],
      [0.04, 'VOWEL'],
    ];
  }

  setup (){
    this.position = choiceRandom(this.island.cells);
  }
  
  getNeighborhoods(){
    var x = this.position[0];
    var y = this.position[1];
  
    return [
      [x, y - 1],
      // [x + 1 , y - 1],
      [x + 1 , y],
      // [x + 1 , y + 1],
      [x, y + 1],
      // [x - 1, y + 1],
      [x - 1, y],
      // [x - 1, y - 1],
    ];
  }

  step(){
    if (this.isOnGate()){
      var targetGate = findTargetGate(this.island.code, this.position);
      var island = this.model.islands[targetGate.islandCode];
      this.position = targetGate.position;
      this.island = island;
    }
  
    var neighborhoodCells = this.getNeighborhoods();
    var neighborhoodAgents = this.island.getAgents();
    var movableCells = this.island.cells.filter(cell => {
      return (
        neighborhoodCells.filter(neighborhood => {
          return (
            neighborhood[0] == cell[0] &&
            neighborhood[1] == cell[1]
          )
        }).length > 0
      );
    }).filter(cell => {
      return (
        neighborhoodAgents.filter(agent => {
          return (
            agent.position[0] == cell[0] &&
            agent.position[1] == cell[1]
          )
        }).length === 0
      )
    })
  
    var newPosition = choiceRandom(movableCells);
    if (newPosition){
      this.position = newPosition;
    }
  
    if (this.inbox){
      this.readAndReply();
    } else {
      var neighborhoods = this.island.getNeighborhoodsOf(this);
      if (neighborhoods.length){
        var recipient = neighborhoods[0];
        this.talk(recipient);
      }
    }
    
  }

  talk(recipient){
    this.sendMessage(
      choiceRandom(this.vocabulary),
      recipient
    )
  
  }
  
  readAndReply(){
    var reply = choiceRandom(this.vocabulary);
  
    this.sender.learnWord(reply);
    this.learnWord(this.inbox);
  
    this.counter.count(reply.island.code, reply.word);
    this.counter.count(this.inbox.island.code, this.inbox.word);
    
    this.inbox = null;
    this.sender = null;
  }
  
  sendMessage(message, recipient){
    this.talkingWith = recipient;
    recipient.receiveMessage(message, this);
  }
  
  receiveMessage(message, sender){
    this.sender = sender;
    this.inbox = message;
  }
  
  addToVocabulary(instance){
    this.vocabulary.push(instance);
    this.island.addWord(instance);
  }
  
  learnWord(wordInstance){
    var words = this.vocabulary.map(attributeGetter('word'));
    var exists = words.indexOf(wordInstance.word) > -1;
    var action = weightedRandom(Agent.MUTATION_CHAIN);
    switch (action){
      case 'NO_MUTATION':
        if (!exists){
          this.addToVocabulary(wordInstance);
        }
        break;
  
      case 'COMPOUND':
        var derived = wordInstance.compoundWith(
          choiceRandom(this.vocabulary),
          this.island
        );
  
        this.eventLog.add(EventLog.NEW, derived);
  
        return this.addToVocabulary(derived);
  
      case 'CONSONANT':
        var derived = wordInstance.mutateConst(this.island);
        this.eventLog.add(EventLog.NEW, derived);
        return this.addToVocabulary(derived);
  
      case 'VOWEL':
        var derived = wordInstance.mutateVowel(this.island);
        this.eventLog.add(EventLog.NEW, derived);
        return this.addToVocabulary(derived);
    }
  }
  
  isOnGate(){
    return isGate(this.position[0], this.position[1]);
  }
}




