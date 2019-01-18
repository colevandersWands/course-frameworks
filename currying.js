  // can directly modify state by passing in functions that return partial states
  // can't modify top-level object once app has initiated

function curry_framework (state, actions) {

  // build base function for app instance
  function instance (arg) {                     

    // check if arg is a log call object
    if (arg instanceof Function) {
      const result = arg(state);                        
      if (result instanceof Error) {                       
        throw result;                                      
      } else {                                             
        const old_state = copy(state);                     
        const new_state = update_state(result, old_state); 
        state = copy(new_state);                           
        return result;
      };
    } else if (arg === 'state') {                                                        
      return copy(state);
    } else {                                               
      const err = new Error('invalid argument');           
      throw err;
    };
  };

  // attach action curriers
  for (const action in actions) {
    if (actions[action] instanceof Function) {
      const actionow = actions[action];
      // cant be arrow function for 'this' reasons
      instance[action] = function(args) {
        return this(actionow(args));
      };
    };
  };

  // freeze and return object so it can't be modified later
  return Object.freeze(instance);

  // closed utilites for app instance
  function update_state(result, _state) {
    const new_state = copy(_state)
    if (isObject(result)) {
      const state_keys = Object.keys(new_state);
      for (let key of state_keys) {
        if (result.hasOwnProperty(key)) {
            new_state[key] = result[key];
        };
      }
      return new_state;
    } else { 
      return new_state;
    };
  }
  function copy(thing) {
    if (thing === Object(thing)) {
      return JSON.parse(JSON.stringify(thing));
    } else {
      return thing;
    }
  }
  function isObject(val) {
      if (val === null || typeof val !== 'object') { return false;}
      return ( (typeof val === 'function') || (typeof val === 'object') );
  }
};



