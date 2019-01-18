// the convoluted framework

function ion(g){return g(7)}

// in app builder, wrap is made by higher order function
// anonymous wrappers, actions are named for callstackreading and yheres no good way to dynamically name functions
ion.grog = () => {return this(grog(...arguments))}
// or instead of argents, use self-defined args object?  more like kyperappp and more fp-y?
const grog = (d)=>(e)=>e+d;
ion.grog(3)
// encourage not using => for named debugging

// load in actions as an array and use function. name for building app methods

// app instances inherit log metgods from builder prototype
// log is bound, not closed. this refers to log inside of app function.  or does binding and inheritance not play well together?


// covers all the bases

// have framework delete partial states from returns after updating state?

function s(){return this.a}
const v = s.bind({a:3})
v.__proto__ = {log:function(){this()}}
v.log()
// nope. log inherits from builder, app us bound to log. log is accessed through a lig method that is bound to the same log. the string args passed in are used as method names.  these metgod names are the builder prototype, and are injected between the log array and Array   returning a copy of it shortcuts tgis inheritance

// build the whole darn yhing in an auto-calling function that attaches the log method, freezes the app function and sets the lig inheritamce chain

// crazyness to wedge in inheritance
app.log = (function (action, flag) { // attached inside builder
  this.log.call(this, action, flag)
}).bind(log)
// ono, not so necessary because it's log that inherits?
//  this needs some help

// yo. set log in prototype of build function. then bind it to itself at buildup