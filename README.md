git-wrapper2-promise
===========

A wrapper around the git executable with convenience functions for common
commands, promisified via
[child-process-promise](https://github.com/patrick-steele-idem/child-process-promise).

Built on top of [git-wrapper2](https://www.npmjs.com/package/git-wrapper2)
which provided additional convenience functions to the original
[git-wrapper](https://github.com/pvorb/node-git-wrapper), 
git-wrapper2-promise provides the same functionality with a simpler,
promise-based interface.  Far from being a simple Promise.promisifyAll
solution, this library updates the git-wrapper core by
replacing the child-process module with the child-process-promise module
(which uses [q](https://github.com/kriskowal/q) promises), resulting in a
higher-quality promisification implementation.

**NOTE** In addition to implementing promises, this library removes the event
emissions that were present in previous versions.  If you desire event emissions,
you must therefore be implement them yourself.

## Installation

    npm install git-wrapper2-promise

## API

### var git = new Git(options);

Constructor. See [git(1)](http://git-scm.com/docs/git) for available options.

  * `options` Object. Examples: `{ paginate: true }` enables pagination.
    `{ 'git-dir': '../.git' }` specifies a different `.git` directory.

``` Example:
var git = new Git(options);
```

### git.exec(command [[, options], args]);

Executes a git command and returns a promise for a pre-processed child process object. 
See [the Git Reference](http://git-scm.com/docs/) for available commands.

  * `command`   String.         Examples: `'init'`, `'log'`, `'commit'`, etc.
  * `options`   Object.         The options for a git command. E.g.
                                `{ f: true }` to force a command (equivalent
                                to adding `-f` on the command line).
  * `args`      Array[String].  The arguments for a git command. E.g. some
                                files for `git add`.

``` Example:
git.exec(command, args).then(function(childProcess) {
	return childProcess.stdout.toString();

}).catch(function(childProcess) {
	console.error(childProcess.stderr);
});
```

### git.isRepo();

Checks to see if the directory is a git repository. Returns a promise
for a `boolean` indicating whether or not it is a repo.

``` Example:
var git = new Git({'git-dir': '/path/to/gitroot'});
git.isRepo().then(function(isRepo) {
	console.log('isRepo:', isRepo);
}).catch(function(err) {
	console.error(err);
});
```

### git.clone(repo, dir);

Clones a repository to the destination `dir`.

  * `repo`     String.          Remote repository.
  * `dir`      String.          Local directory to clone into.

``` Example:
git.clone(repo, dir).then(function(childProcess) {
	console.log(childProcess.stdout.toString());
}).catch(function(err) {
	console.error(err);
});
```

### git.pull([remote], [branch])

Performs a `git pull` command against the repository. If `remote` or `branch`
are not provided they will default to `origin` and `master` respectively.

  * `remote`   String.          Name of the remote target.
  * `branch`   String.          Branch name to pull.

``` Example:
git.pull(remote, branch).then(function(childProcess) {
	console.log(childProcess.stdout.toString());
}).catch(function(err) {
	console.error(err);
});
```

### git.add(which)

Perform a `git add` command, staging files for a commit.

  * `which`    String.          Which files to stage, seperated by spaces.

``` Example:
git.add('/path/to/repo/file').then(function(childProcess) {
	console.log(childProcess.stdout.toString());
}).catch(function(err) {
	console.error(err);
});
```

### git.commit(msg)

Commits staged changes with the given `msg` as the commit message.

  * `msg`      String.          Body of the commit message.

``` Example:
git.commit(msg).then(function(childProcess) {
	console.log(childProcess.stdout.toString());
}).catch(function(err) {
	console.error(err);
});
```

### git.push([remote], [branch])

Pushes changes in the local repository to a remote. If `remote` or `branch` are
not provided, the defaults will be `origin` and `master` respectively.

  * `remote`   String.          Name of the remote target.
  * `branch`   String.          Branch name to pull.

``` Example:
git.push(remote, branch).then(function(childProcess) {
	console.log(childProcess.stdout.toString());
}).catch(function(err) {
	console.error(err);
});
```

### git.save(msg)

Convenience function for performing `git.add`, `git.commit`, and `git.push` in
one function call. Using this will automatically stage all unstaged changes,
commit, and then push.

  * `msg`      String.          Body of the commit message.

``` Example:
git.pull(remote, branch).then(function(childProcess) {
	console.log(childProcess.stdout.toString());
}).catch(function(err) {
	console.error(err);
});
```

### git.log(options)

Performs a `git log` command, returning a promise for a child process.
`options` are an array of command line options you might want to provide,
such as `['-n', 2]` to limit the results to only the last 2 commits.

  * `options`   Array.          Command line options for the `git log` command.

``` Example:
git.log().then(function(childProcess) {
	console.log(childProcess.stdout.toString());
}).catch(function(err) {
	console.error(err);
});
```
