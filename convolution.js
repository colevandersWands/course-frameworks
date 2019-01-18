  // can directly modify state by passing in functions that return partial states
  // can't modify top-level object once app has initiated
  // * can extend/modify log access by overwriting buildit.prototype.access_log

function convolution(_state, _actions) {
  function buildit (state, actions) {

    // build base function for app instance
    function _instance (arg, log_info) {                     

      // check if arg is a log call object
      if (arg instanceof Function) {                         const new_entry = {};
                                                             try { // allows manual state updates
                                                               if (log_info.args === undefined && 
                                                                   log_info.name === undefined) {
                                                                  // assume people don't use both in a note
                                                                  new_entry.action = arg;
                                                                  new_entry.notes = log_info;
                                                               } else {
                                                                  new_entry.action = log_info.name; 
                                                                  new_entry.args = log_info.args;
                                                               }; 
                                                             } catch {
                                                               new_entry.action = arg;
                                                               new_entry.notes = log_info;
                                                             }; // comment this beast later

        const result = arg(state);                        
                                  
        if (result instanceof Error) {                       new_entry.state = copy(state);
                                                             new_entry.error = result;  
                                                             this.log.push(new_entry);
          throw result;                                      

        } else {                                             new_entry.result = result;
          const old_state = copy(state);                     new_entry.old_state = copy(old_state);
          const new_state = update_state(result, old_state); new_entry.new_state = copy(new_state); 
          state = copy(new_state);                           this.log.push(new_entry);
          return result;
        };

      } else if (isObject(arg)) {
        return this.access_log(arg);

      } else if (arg === 'state') {                          const new_entry = copy(state);
                                                             new_entry.notes = log_info;
                                                             this.log.push(new_entry);
        return copy(state);

      } else {                                               const err_log = {arg};
        const err = new Error('invalid argument');           err_log.err = err;
                                                             err_log.notes = log_info;
                                                             this.log.push(err_log);
        throw err;
      };
    };

    // add logger
    const log = {log:['hi!']};
    log.__proto__ = this;
    const instance = _instance.bind(log)

    // attach action curriers
    for (const action in actions) {
      if (actions[action] instanceof Function) {
        const actionow = actions[action];
        // cant be arrow function for 'this' reasons
        instance[action] = function(args) {
          return this(actionow(args), {name:action, args});
        };
      };
    };

    // freeze and return object so it can't be modified later
    return Object.freeze(instance);

    // closed utilites for instance
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
  buildit.prototype.access_log = function(args){
                                  if (args.clear) {
                                    this.log = [];
                                  };
                                  if (args.flag !== undefined) {
                                    this.log.push(args.flag);
                                  };
                                  if (args.read) {
                                    return this.log;
                                  };
                                };

  return new buildit(_state, _actions)
}


