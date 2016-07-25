class Model { 
  constructor(size) {
    this.width = 51;
    this.height = 42;
    this.iteration = -1;
    this.islands = [];
    this.agents = [];
    this.eventLog = new EventLog();
    this.counter = new Counter();

    window.__COUNTER__ = this.counter;
  }

  setup(){
    Object.keys(__ISLANDS__).forEach(islandKey => {
      this.islands[islandKey] = new Island(islandKey, this);
      for (var i = 0; i < __POPULATION__[islandKey]; i++) {
        this.agents.push(
          new Agent(
            this.islands[islandKey],
            this,
            this.eventLog,
            this.counter
          )
        );
      }
    })
  
    this.agents.forEach(agent => {
      agent.setup()
    });
  };

  step() {
    this.iteration++;
  
    this.agents.forEach(function (agent) {
      agent.step();
    });
  
  };

}

