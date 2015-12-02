// imports
var fs = require('fs');
var path = require('path');
var exec = require('child-process-promise').exec;
var spawn = require('child-process-promise').spawn;
var commands = require('./commands');
var inherits = require('util').inherits;

// Class Git
var Git = module.exports = function (options) {
  this.binary = 'git';
  options = options || {};

  // If a gitDir is provided, make sure it is to the .git
  // directory and a working tree is provided (or set to
  // base directory)
  var gitDir = options['git-dir'];
  if(gitDir) {
    var sep = path.sep === '/' ? '\\/' : path.sep;
    var isGitRegex = new RegExp(sep + '\\.git$', 'g');
    if(! gitDir.match(isGitRegex)) {
      options['git-dir'] = path.join(gitDir, '.git');
    }

    if(! options['work-tree']) {
      options['work-tree'] = path.join(options['git-dir'], '..');
    }
  }

  this.args = Git.optionsToArray(options);
};

Git.prototype.exec = function(command, args) {
  args = args || [];

  return this.spawn(command, args, {
    capture: ['stdout', 'stderr']
  });
};

// git.spawn(command [, args])
Git.prototype.spawn = function(command, args){
  args = args || [];

  command = Array.isArray(command) ? command : [command];
  var rawargs = this.args.concat(command).concat(args);
  args = [];

  // Get rid of nulls and undefineds.
  for(var i = 0, len = rawargs.length; i < len; i++) {
    if(rawargs[i] != null) args.push(rawargs[i]+"");
  }

  return spawn(this.binary, args, {
    capture: ['stdout', 'stderr']
  });
};

Git.optionsToArray = function(options){
  var args = [];

  Object.keys(options).forEach(function(k){
    var val = options[k];

    if(k.length == 1) {
      if(val === true) {
        args.push('-' + k);
      } else if(val !== false) {
        args.push('-' + k, val);
      }
    } else {
      if(val === true) {
        args.push('--' + k);
      } else if(val !== false) {
        args.push('--' + k + '=' + val);
      }
    }
  });

  return args;
};

Object.keys(commands).forEach(function(key) {
  Git.prototype[key] = commands[key];
});
