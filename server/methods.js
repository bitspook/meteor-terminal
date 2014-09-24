Meteor.methods({
  terminalRecieveCommand: function(command) {
    return Terminal.handleCommand(command);
  }
});
