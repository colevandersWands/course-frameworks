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

const app = convolution(state, actions);


const st2 = app.advance(1);

// console.log(st1);
// console.log(st2);
// console.log(st3);









