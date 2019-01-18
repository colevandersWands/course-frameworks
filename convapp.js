const state = {
  previous: 0,
  current: 0
};

const actions = {
  advance: function(next) { 
                return function (state) {
                      return {previous: state.current, current: next};
                  };
              },
 
};

const app = framework(state, actions);

const st1 = app.read_all();
const st2 = app.advance({next: 1});
const st3 = app.read_all();

// console.log(st1);
// console.log(st2);
// console.log(st3);









