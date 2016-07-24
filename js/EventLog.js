
class EventLog {
  constructor(){
    this.events = [];
    this.callback = function () {};
  }

  onUpdate(callback){
    this.callback = callback;
  }
  
  add(eventType, instance){
    this.events.push(eventType, instance);
    this.callback(eventType, instance);
  }
  
  static get NEW(){
    return 1
  }

}
