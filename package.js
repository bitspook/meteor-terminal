Package.describe({
  summary: "In browser terminal for meteor apps.",
  version: "0.1.1",
  git: "https://github.com/channikhabra/meteor-terminal.git"
});

Package.onUse(function(api) {
  api.versionsFrom('METEOR@0.9.1.1');
  api.use(['templating', 'deps', 'underscore', 'jquery', 'mongo',
           'channikhabra:stupid-models@0.0.3',
          ]);

  api.addFiles([
    "lib/jquery-terminal/jquery.terminal-0.8.8.js",
    "lib/jquery-terminal/jquery.terminal.css",
    "lib/jquery-terminal/jquery.mousewheel.js",
  ], ['client']);

  api.addFiles([
    'terminal.js',
    'models.js'
  ], ['server', 'client']);

  api.addFiles([
    "server/terminal.js",
    "server/methods.js",
    "server/permissions.js",
    "server/pubs.js",
  ], ['server']);

  api.addFiles([
    'client/template.html',
    'client/template.css',
    'client/template.js',
    'client/subscriptions.js',
  ], ['client']);

  api.export(["Terminal", 'TerminalBuffer']);
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('channikhabra:terminal');
  // api.addFiles('terminal-tests.js');
});
