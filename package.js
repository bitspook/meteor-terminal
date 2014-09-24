Package.describe({
  summary: "In browser terminal for meteor apps.",
  version: "0.1.0",
  git: "https://github.com/channikhabra/meteor-terminal.git"
});

Package.onUse(function(api) {
  api.versionsFrom('METEOR@0.9.2.2');
  api.use(['templating', 'deps', 'underscore', 'jquery',
          'channikhabra:stupid-models']);

  api.addFiles([
    "lib/jquery-terminal/jquery.terminal-0.8.8.js",
    "lib/jquery-terminal/jquery.terminal.css",
    "lib/jquery-terminal/jquery.mousewheel.js",
  ], ['client']);

  api.addFiles([
    'terminal.js',
    'models.js'
  ], ['client', 'server']);

  api.addFiles([
    "server/methods.js",
    "server/terminal.js",
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
