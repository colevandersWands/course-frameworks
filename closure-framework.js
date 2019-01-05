function build_app(initial_state, _actions) {

  let _state = copy(initial_state);
  const app_log = [{initial_state: copy(initial_state)}];

  return function app_instance(action_name, _args) {      
     
    // built-in log & state management
    if (action_name === 'return_log') {
                                                        app_log.push('return log');
      return copy(app_log);
    };
    if (action_name === 'reset_log') {
      app_log.splice(0,app_log.length);                 app_log.push('reset log');
      return copy(app_log)
    };
    if (action_name === 'return_state') {
      const returned_state = copy(_state);              app_log.push({return_state: returned_state})
      return returned_state;
    };
    if (action_name === 'reset_state') {
      if (Object.prototype.toString.call(_args) !== "[object Object]") {
        const new_error = new Error('new state must be an object');
                                                        app_log.push({[new_error.name]: new_error.message});
        throw new_error;
      };
      _state = copy(_args);
                                                        const new_entry = {state_reset: copy(_state)};    
                                                        app_log.push(new_entry)
      return copy(_state);
    };

    /* begin log entry & clear user input */            const new_entry = {};
                                                        app_log.push(new_entry);
                                                        new_entry.action = action_name;
    if (_args === undefined) {
      _args = [];
    } else if ( !(_args instanceof Array) ) {
      const new_error = new Error('args must be wrapped in an array')
                                                        new_entry['0 args'] = _args;
                                                        new_entry['args error'] = new_error;
      throw new_error;
    } 
                                                        new_entry['0 args'] = _args;

    // call & log user-defined actions
    const old_state = copy(_state);                     new_entry['1 old state'] = copy(old_state);

    const result = _actions[action_name](old_state, ..._args);  
    if (result instanceof Error) {
                                                          new_entry['action error'] = {[result.name]: result.message}; 
      throw result;
    } else {
                                                          new_entry['2 action result'] = copy(result);
    };

    const new_state = update_state(result, old_state);  new_entry['3 new state'] = copy(new_state);

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
  }

}