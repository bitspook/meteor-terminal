Meteor.publish("all_terminal", function() {
  return [
    TerminalBufferColl.find({}),
    TerminalStateColl.find({})
  ];
});
