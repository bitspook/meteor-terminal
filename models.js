/**
 * text                             String
 * stream                           String [stdout, stderr]
 * shown                            Boolean
 */

TerminalBufferColl = new Mongo.Collection('terminal_buffer');
TerminalBuffer = Model(TerminalBufferColl);

TerminalBuffer.extend({
  markShown: function() {
    this.update({shown: true});
  }
});

TerminalBuffer.addToStream = function(options /* {text: 'output', stream: 'stdout/stderr'} */) {
  if (typeof options === 'string') {
    options = {
      text: options,
      stream: 'stdout'
    };
  }

  var buffer = new TerminalBuffer();
  buffer.text = options.text;
  buffer.stream = options.stream;
  buffer.shown = false;
  buffer.save();
};
TerminalBuffer.newEntries = function() {
  return TerminalBufferColl.find({shown: false});
};


/**
 * Used to maintain state of the terminal. Like pwd. We are spawning individual commands instead of an interactive shell.
 * So we have to maintain the state of shell ourselves and update the state before spawning every command.
 */
TerminalStateColl = new Mongo.Collection('terminal_state');
var TerminalStateModel = Model(TerminalStateColl);
TerminalState = {
  state: function() {
    var state = TerminalStateColl.find().fetch();
    if(state.length === 0) {
      console.warn("CREATING NEW STATE: If you see an 'insert denied' error below this line, it's perfectly fine.");
      state = new TerminalStateModel();
      state.pwd = '';
      state.save();
    }
    return state[0];
  },
  pwd: function(newPwd) {
    if (typeof newPwd !== 'string')
      return this.state().pwd;

    var termState = this.state();
    if (! termState)
      return false;

    termState.update({pwd: newPwd});

    return this.state.pwd;
  },
  shellUser: function(username) {
    if (typeof username !== 'string')
      return this.state().shell_user;

    var termState = this.state();

    termState.update({shell_user: username});

    return termState.shell_user;
  },
  prompt: function() {
    var termState = this.state(),
        pwd = this.pwd(),
        shellUser = this.shellUser(),
        prompt = shellUser + "@" + pwd + "» ";

    return prompt;
  }
};
