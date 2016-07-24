// Set with more methods
class Group extends Set{
  constructor(...args) {
    super(...args)
  }
  
  intersection(other) {
    return new Group([...this].filter(item => other.has(item)))
  }
  
  isDisjunct(other){
   return this.intersection(other).size == 0 
  }
  
  isSubset(other){
    return this.intersection(other).size == this.size
  }

  isSuperset(other){
    return other.intersection(this).size == other.size
  }
  
  union(other){
    var g = new Group();
    other.forEach(item => g.add(item));
    this.forEach(item => g.add(item));
    return g;
  }
  
  difference(other){
    return new Group([...this].filter(item => !other.has(item)))
  }
  
  symmetricDifference(other){
    return this.union(other).difference(this.intersection(other))
  }
}

