'use strict';
var util = require('util');
var Q = require("q");
var exec = require('child_process').exec;
var temp = require('temp');
var ncp = require('ncp').ncp;
var fs = require('fs');

ncp.limit = 16;

var packageJSON = JSON.parse(fs.readFileSync('./package.json').toString());

if(packageJSON.heroku == undefined || !packageJSON.heroku.length){
  console.log('Please specify Heroku app name in package.json e.g.: "heroku":"foo-app"');
  return;
}

var GIT_REPO = 'git@heroku.com:' + packageJSON.heroku + '.git';
var GIT_BRANCH = 'master';
var ERROR_MSG = 'One or more arguments missing';
var COMMIT_MSG = 'build';



exports.build = function(output_folder,callback){
  console.log('=================================');
  console.log('>>> BUILDING HEROKU >>> ' + output_folder);
  console.log('=================================');

  return createTempDir({output_folder:output_folder})
  .then(cloneRepo)
  .then(copyWWW)
  .then(copyProcfile)
  .then(copyServerJS)
  .then(copyPackageJSON)
  .then(addAll)
  .then(doCommit)
  .then(doPush)
  .then(function(opts){
    util.log('=================================');
    util.log('>>> DONE BUILDING HEROKU >>>');
    util.log('=================================');
  })
  .nodeify(callback);
}

var createTempDir = function(opts) {
  opts = opts?opts:{};
  var deferred = Q.defer();
  temp.mkdir('herokubuild', function(err, dirPath) {
    if (err) deferred.reject(err);
    opts.temp_dir = dirPath;
    if (!err) deferred.resolve(opts); 
  });
  return deferred.promise;
};

var cloneRepo = function(opts) {
  console.log('cloneRepo');
  var deferred = Q.defer();

  if(!opts || !opts.temp_dir){
    deferred.reject(new Error(ERROR_MSG));
  }

  var cmd = "git clone "+GIT_REPO;
  exec(cmd, {cwd: opts.temp_dir}, function(err, stdout, stderr){
    if (err) deferred.reject(err);
    util.log(stdout, stderr);
    if (!err) {
      opts.repo_dir = opts.temp_dir+"/"+packageJSON.heroku;
      deferred.resolve(opts); 
    }
  });

  return deferred.promise;
};

var checkoutBranch = function(opts) {

  var deferred = Q.defer();

  if(!opts || !opts.temp_dir){
    deferred.reject(new Error(ERROR_MSG));
  }

  var cmd = "git checkout "+GIT_BRANCH;
  exec(cmd, {cwd: opts.repo_dir}, function(err, stdout, stderr){
    if (err) deferred.reject(err);
    util.log(stdout, stderr);
    if (!err) {
      deferred.resolve(opts); 
    }
  });

  return deferred.promise;
};

var mergeMaster = function(opts) {

  var deferred = Q.defer();

  if(!opts || !opts.temp_dir){
    deferred.reject(new Error(ERROR_MSG));
  }

  var cmd = "git merge master --no-ff";
  exec(cmd, {cwd: opts.repo_dir}, function(err, stdout, stderr){
    if (err) deferred.reject(err);
    util.log(stdout, stderr);
    if (!err) {
      deferred.resolve(opts); 
    }
  });

  return deferred.promise;
};


var copyWWW = function(opts) {
  console.log('copyWWW ' + opts.repo_dir);
  var deferred = Q.defer();

  if(!opts || !opts.temp_dir){
    deferred.reject(new Error(ERROR_MSG));
  }

  ncp(opts.output_folder, opts.repo_dir+'/www', function (err) {
    if (err) deferred.reject('err: ' + err);
    if (!err) {
      deferred.resolve(opts); 
    }
  });

  return deferred.promise;
};


var copyProcfile = function(opts) {
  console.log('copyProcfile');
  var deferred = Q.defer();

  if(!opts || !opts.temp_dir){
    deferred.reject(new Error(ERROR_MSG));
  }

  ncp('./Procfile', opts.repo_dir+'/Procfile', function (err) {
    if (err) deferred.reject(err);
    if (!err) {
      deferred.resolve(opts); 
    }
  });

  return deferred.promise;
};

var copyServerJS = function(opts) {
  console.log('copyServerJS');
  var deferred = Q.defer();

  if(!opts || !opts.temp_dir){
    deferred.reject(new Error(ERROR_MSG));
  }

  ncp('./server.js', opts.repo_dir+'/server.js', function (err) {
    if (err) deferred.reject(err);
    if (!err) {
      deferred.resolve(opts); 
    }
  });

  return deferred.promise;
};

var copyPackageJSON = function(opts) {
  console.log('copyPackageJSON');
  var deferred = Q.defer();

  if(!opts || !opts.temp_dir){
    deferred.reject(new Error(ERROR_MSG));
  }

  ncp('./package.json', opts.repo_dir+'/package.json', function (err) {
    if (err) deferred.reject(err);
    if (!err) {
      deferred.resolve(opts); 
    }
  });

  return deferred.promise;
};


var addAll = function(opts) {
  console.log('addAll');
  var deferred = Q.defer();

  if(!opts || !opts.repo_dir){
    deferred.reject(new Error(ERROR_MSG));
  }

  var cmd = "git add .";
  exec(cmd, {cwd: opts.repo_dir}, function(err, stdout, stderr){
    if (err) deferred.reject(err);
    util.log(stdout, stderr);
    if (!err) {
      deferred.resolve(opts); 
    }
  });

  return deferred.promise;
};


var doCommit = function(opts) {
  console.log('doCommit');
  var deferred = Q.defer();

  if(!opts || !opts.repo_dir){
    deferred.reject(new Error(ERROR_MSG));
  }

  var cmd = 'git commit -m "'+COMMIT_MSG+'"';
  exec(cmd, {cwd: opts.repo_dir}, function(err, stdout, stderr){
    if (err) deferred.reject(err);
    util.log(stdout, stderr);
    if (!err) {
      deferred.resolve(opts); 
    }
  });

  return deferred.promise;
};


var doPush = function(opts) {
  console.log('doPush');
  var deferred = Q.defer();

  if(!opts || !opts.repo_dir){
    deferred.reject(new Error(ERROR_MSG));
  }

  var cmd = 'git push origin master --force';
  exec(cmd, {cwd: opts.repo_dir}, function(err, stdout, stderr){
    if (err) deferred.reject(err);
    util.log(stdout, stderr);
    if (!err) {
      deferred.resolve(opts); 
    }
  });

  return deferred.promise;
};


var updateGitIgnore = function(opts){
  console.log('updateGitIgnore');
  var deferred = Q.defer();

  if(!opts || !opts.repo_dir){
    deferred.reject(new Error(ERROR_MSG));
  }

  fs.readFile(opts.repo_dir+'/.gitignore', function(err, data) { // read file to memory
    if (err) return deferred.reject(err);
      data = data.toString(); // stringify buffer

      var position = data.toString().indexOf('\nwww\n'); // find position of new line element
      if (position != -1) { // if new line element found
        data = data.substr(position + 4 + 1); // subtract string based on first line length


        fs.writeFile(filePath, data, 
          function(err) { 
          
            if (err){
              deferred.reject(err);
            }
            else{
              deferred.resolve(opts);
            }
          }
        );

      } else {
        util.log('no lines found');
        deferred.resolve(opts);
      }



  });

  return deferred.promise;
};