function framework(_state, _actions) {
  function buildit (state, actions) {

    // build base function for app instance
    function _instance (arg, log_info) {                     

      // check if arg is a log call object
      if (arg instanceof Function) {                         const new_entry = {
                                                               action: log_info.name,
                                                               args: log_info.args,
                                                             };    
        const result = arg(state);                        
                                  
        if (result instanceof Error) {                       new_entry.state = copy(state);
                                                             new_entry.error = result;  
          throw result;                                      this.log.push(new_entry);

        } else {                                             new_entry.result = result;
          const old_state = copy(state);                     new_entry.old_state = copy(old_state);
          const new_state = update_state(result, old_state); new_entry.new_state = copy(new_state); 
          state = copy(new_state);                           this.log.push(new_entry);
          return result;
        };

      } else if (isObject(arg)) {
        return this.access_log(arg);

      } else if (arg === 'state') {                          this.log.push(copy(state));
        return copy(state);

      } else {                                               const err_log = {arg};
        const err = new Error('invalid argument');           err_log.err = err;
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




  // #majorvulnerability: can clear state by passing in a function that returns state with empty props
  // can't add properties to state.  not so bad 
  // * can extend log by overwriting buildit.prototype.access_log

/* binding does preserve closure
  function outer() {
    let a = 4;
      function inner() {
      return [this.a, a]
    }
    return inner.bind({a:3})
  };
  const mdd = outer()
  mdd();
*/

/* closure, binding, inheritance
  function outer() {
    let a = 4;
    this.a = 5;
    let self = this
    function inner() {
      return [this.a, a, self.a]
    }
    return inner.bind({a:3})
  };
  outer.prototype.a = 5;
  const y = new outer()
  y()
*/
