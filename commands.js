/*
 * Checks to see if this is a git repository
**/
var isRepo = exports.isRepo = function(){
  return this.exec('status').then(function() {
    return true;

  }).catch(function(childProcess) {
    var err;

    if(! childProcess.stderr) {
      err = childProcess;
      throw err;
    }

    if(childProcess.code === 128) {
      return false;
    }

    throw new Error(childProcess.stderr.toString());
  });
};


/*
 * Clone the repository.
**/
var clone = exports.clone = function(repo, dir){
  var args = [repo, dir];

  return this.spawn('clone', args);
};

/*
 * Pull latest from the repository.
**/
var pull = exports.pull = function(remote, branch){
  if(typeof remote == 'function') {
    callback = remote;
    remote = 'origin';
    branch = 'master';
  } else if(typeof branch == 'function') {
    callback = branch;
    branch = 'master';
  }

  var args = [remote, branch];
  return this.spawn('pull', args);
};

/*
 * Add files for a commit.
**/
var add = exports.add = function(which){
  var cmd = 'add', args = [which];
  return this.spawn(cmd, args);
};

/*
 * Remove files for a commit.
**/
var rm = exports.rm = function(which) {
  which = Array.isArray(which) ? which : [which];
  return this.spawn('rm', which);
};

/*
 * Commit the repo.
**/
var commit = exports.commit = function(msg, args){
  args = (args || []).concat(['-m', msg]);

  return this.spawn('commit', args);
};

/*
 * Push to master
**/
var push = exports.push = function(remote, branch){
  if(typeof remote == 'undefined') {
    remote = 'origin';
    branch = 'master';
  } else if(typeof branch == 'undefined') {
    branch = 'master';
  }

  var args = [remote, branch];
  return this.spawn('push', args);
};

/*
 * Save - Does commit and push at once.
**/
exports.save = function(msg, commitargs){
  var that = this ;
  return that.add('-A').then(function() {
    return that.commit(msg, commitargs);
  }).then(function() {
    return that.push();
  });
};

/*
 * Call `git log`, optionally with arguments.
**/
exports.log = function(args) {
  args = args || [];
  return this.spawn('log', args);
};

/*
 * Calls `git branch`.
 */
exports.branch = function(name, args) {
  args = (args || []).concat([name]);
  return this.spawn('branch', args);
};

/*
 * Calls `git checkout`.
 */
exports.checkout = function(branch, args) {
  args = (args || []).concat([branch]);
  return this.spawn('checkout', args);
};

/*
 * Calls `git show`.
 */
exports.show = function(sha1, file, args) {
  args = (args || []).concat([sha1 + ':' + file]);
  return this.spawn('show', args);
};
