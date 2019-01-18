function build_app(initial_state, _actions) {

  let _state = copy(initial_state);

  return function app_instance(action_name, _args) {      
     
    // built-in state management
    if (action_name === 'return_state') {
      return copy(_state);   
    };
    if (action_name === 'reset_state') {
      if (!isObject(_args)) {
        throw new Error('new state must be an object');
      };
      _state = copy(_args);
      return copy(_state);
    };

    // clear user input
    if (_args === undefined) {
      _args = [];
    } else if ( !(_args instanceof Array) ) {
      throw new Error('args must be wrapped in an array')
    } 
                                                       

    // call user-defined actions
    const old_state = copy(_state);                    
    const result = _actions[action_name](old_state, ..._args);  
    if (result instanceof Error) {                                                 
      throw result;
    };
    const new_state = update_state(result, old_state);
    _state = copy(new_state);                                     

    // return result
    return result;


    // utilities
    function update_state(result, _state) {
      const new_state = copy(_state)
      if (result !== Object(result)) {
        return new_state;
      } else {    
        for (key in result) {
          if (new_state[key]) {
            new_state[key] = result[key]
          }
        }
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
  }

}