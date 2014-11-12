/*
Copyright (c) 2014, salesforce.com, inc. All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
Neither the name of salesforce.com, inc. nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
(function(){

  var appController = function($rootScope, $scope, $element, $http, appModel){
    
    console.log('new appController');

    /* $scope.blog = [
    {
        "author": "Luke Skywalker", 
        "pubdatetime": "November 01, 2014 12:30:45AM", 
        "body": "Wookie wookie wookie", 
        "comments": [
            {
                "author": "Princess Leia",
                "body": "May the force be with you"
            },
            {
                "author": "Han Solo",
                "body": "Look out, Luke"
            }
        ]
    },
    {
        "author": "Wedge Antilles", 
        "pubdatetime": "November 01, 2014 12:30:45AM", 
        "body": "Wookie wookie wookie", 
        "comments": [
            {
                "author": "Princess Leia",
                "body": "May the force be with you"
            },
            {
                "author": "Han Solo",
                "body": "Look out, Luke"
            }
        ]
    }]; */



    // load blog data
    console.log('loading blog data');
    $http.get('data/blog.json')
      .success(function(data) {
        console.log('http.get worked AOK');
        $scope.blog = data;
        console.log($scope.blog);
      })
      .error(function(data) {
        console.log("error");
      });


    // make appModel available to all scopes
    $rootScope.appModel = appModel;

    $scope.loggedinuser = {
      'name': 'Wedge',
      'image': 'wedge.jpg'
    };

    $scope.world = "Salesforce UXE";

    // console.log($scope.blog);
    /*var func = () => {
      console.log('func!');
    };

    func();*/
    // console.log(blog);

  };


  appController.$inject = [
    '$rootScope',
    '$scope',
    '$element',
    '$http',
    'appModel'
  ];

  module.exports = appController;

}).call(this);

