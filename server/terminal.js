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

  var resolveEnvVars = function(str) {
    var envVarRegex = /\$[A-Z]\w+/g;
    return str.replace(envVarRegex, function(match) {
      return process.env[match.replace("$", "")];
    });
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

      if (newPath.indexOf("~" === 0)) { //replace ~ with $HOME only if it's the first char of path to cd
        newPath = newPath.replace("~", "$HOME"); //path don't understand ~/ I am habitual of using often
      }

      newPath = this.resolveEnvVars(newPath); // in case users do things like cd $HOME etc. I do stuff like this often in case you're thinking nobody does such shit

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
  this.resolveEnvVars = resolveEnvVars;
  this.handleCommand = handleCommand;
};

var serverHandler = new ServerTermHandler().initialize();
_.extend(Terminal, serverHandler);
