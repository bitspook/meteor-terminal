var Fiber = Npm.require("fibers"),
    exec = Npm.require('child_process').exec,
    spawn = Npm.require('child_process').spawn,
    path = Npm.require("path");

Terminal = Terminal || {};

var ServerTermHandler = function() {
  var initialize = function() {
    var shellUser = process.env.USER;
    var pwd = process.env.HOME;

    TerminalState.pwd(pwd);
    TerminalState.shellUser(shellUser);

    return this;
  };

  var handleCommand = function(command) {
    if (command.indexOf("&&") > 0) {
      //let's prevent composite commands because in that case special cases like 'cd' will fail.
      //we can ofcourse cover this up with very little more work, but I am feeling lazy
      return "Please do not user composite commands. i.e no &&";
    }
    //let's handle cd as a special case
    if (command.indexOf("cd") === 0) {
      var newPath = command.replace("cd ", '');
      var newPwd = path.resolve(TerminalState.pwd(), newPath);
      TerminalState.pwd(newPwd);
    }

    var pwd = TerminalState.pwd();
    command = "cd " + pwd + ";" + command;

    var shellName = process.env.SHELL;
    var shell = spawn(shellName, ["-c", command]);
    shell.stdout.on('data', updateTerminal("stdout"));
    shell.stderr.on('data', updateTerminal("stderr"));
    shell.on('error', function(err) {
      updateTerminal(err.text);
    });
    shell.on('close', function(code) {
      //clear callback
      shell.stdout.removeAllListeners('data');
      shell.stderr.removeAllListeners('data');
      shell.removeAllListeners('error');
      shell.removeAllListeners('close');
    });

    function updateTerminal(stream) {
      return function(data) {
        Fiber(function() {
          TerminalBuffer.addToStream({text: data.toString(), stream: stream});
        }).run();
      };
    };
  };

  this.initialize = initialize;
  this.handleCommand = handleCommand;
};

var serverHandler = new ServerTermHandler().initialize();
_.extend(Terminal, serverHandler);
