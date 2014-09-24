TerminalBufferColl.allow({
  insert: function(doc) {
    return true;
  },
  update: function() {
    return true;
  },
  remove: function() {
    return true;
  }
});

TerminalStateColl.allow({
  insert: function() {
    var totalStates = TerminalStateColl.find().count();
    //let's not allow more than one docs to be present in state coll.
    //we might need more than one states when we have user based config (if ever), but not now.
    if (totalStates > 0)
      return false;
    return true;
  },
  update: function() {
    return true;
  },
  remove: function() {
    return true;
  }
});
