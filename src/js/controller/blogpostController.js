(function(){

  var blogpostController = function($scope){
    
    console.log('new blogpostController');

    $scope.activate = function() {
        console.log("Entered item" + $scope.blogpost.body);
        $scope.isInside = true;
    };

    $scope.deactivate = function() {
        console.log("Left item" + $scope.blogpost.body);
        $scope.isInside = false;
    };

    $scope.submitCommentForm = function() {
        if ($scope.newcomment) {
            console.log("Content form submitted " + $scope.newcomment);
            var currentDate = new Date();
            $scope.blogpost.comments.push({
                "author": $scope.loggedinuser.name,
                "image": $scope.loggedinuser.name+".jpg",
                "pubdatetime": currentDate,
                "body": $scope.newcomment
            });
            $scope.newcomment = "";
            // change class of .blogpost-comments -> display:none
            $scope.collapsed = !$scope.collapsed;
            // alert($scope.blog);
        }
    };

    $scope.isInside = false;
  };


  blogpostController.$inject = [
    '$scope'
  ];

  module.exports = blogpostController;

}).call(this);

