Template.terminal.rendered = function() {
  var panel = $("#shell-panel");

  panel.terminal(function(command, term) {
    command = command.trim();
    if (command !== '') {
      Meteor.call("terminalRecieveCommand", command, function(err, res) {
        if (err)
          throw new Error;
        if(res)
          term.echo(res);
      });
    } else {
      term.echo('');
    }
  }, {
    greetings: null,
    name: 'js_demo',
    height: 200,
    prompt: 'nuc> ',
    onInit: function(term) {
      Terminal.term = term;
      term.set_prompt(TerminalState.prompt());
      term.echo('' +
                '/$$   /$$                     /$$                                \n' +
                '| $$$ | $$                    | $$                               \n' +
                '| $$$$| $$ /$$   /$$  /$$$$$$$| $$  /$$$$$$  /$$   /$$  /$$$$$$$ \n' +
                '| $$ $$ $$| $$  | $$ /$$_____/| $$ /$$__  $$| $$  | $$ /$$_____/ \n' +
                '| $$  $$$$| $$  | $$| $$      | $$| $$$$$$$$| $$  | $$|  $$$$$$  \n' +
                '| $$\  $$$| $$  | $$| $$      | $$| $$_____/| $$  | $$ \____  $$ \n' +
                '| $$ \  $$|  $$$$$$/|  $$$$$$$| $$|  $$$$$$$|  $$$$$$/ /$$$$$$$/ \n' +
                '|__/  \__/ \______/  \_______/|__/ \_______/ \______/ |_______/  \n'
               );
    }
  });
};

Template.terminal.helpers({

});

// autorun to push stdin/stderr into the terminal window when activity happens on server
Deps.autorun(function() {
  if(! TerminalBuffer) return;

  var buffer = TerminalBuffer.newEntries();
  buffer.forEach(function(entry) {
    Terminal.term.echo(entry.text);
    entry.markShown();
  });
});


//autorun to update shell prompt
Deps.autorun(function() {
  var termState = TerminalState.state();

  if(!Terminal.term || !termState) return;

  Terminal.term.set_prompt(TerminalState.prompt());
});
