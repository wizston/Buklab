/*#######################################################################
  
  Normally like to break AngularJS controllers into separate files.
  Kept them together here since they're small and it's easier to look through them... Plus am using just one for this app

  to keep this very simple, I've used only one controller in this app
  #######################################################################*/


//This controller retrieves data from the bookFactory and associates it with the $scope
//The $scope is ultimately bound to the index view
app.controller('BookController', ['$scope', '$rootScope', 'bookFactory', '$cookies', '$filter', 'orderByFilter', function ($scope, $rootScope, bookFactory, $cookies, $http, $filter, orderByFilter) {

        $scope.title = "ALL BOOKS";
    
    $scope.allBooks = bookFactory.getAllBooks();
    $scope.bookRates = bookFactory.getBookRatings();

    ////Get the total number of category in this parameter
    $rootScope.CategoryCounts = function (category) {
        return bookFactory.getTotalCategory(category);
    }

    ////Get the ip of this current user
    $.getJSON("//jsonip.com?callback=?", function (data) {
        
        $scope.ipp = bookFactory.escapeIpAddress(data.ip);
    });

    ///Get the rating of each books by individual user
    $scope.getRate = function (value) {
        return bookFactory.getRate(value);
    }

    $scope.max = 10;
    $scope.isReadonly = false;
    $scope.currentPage = 0;
    $scope.pageSize = 16;
    
    /////////////////////////////////////////////////Book Rating Beggins/////////////////////////////////////////

    //Get total number of pages
    $scope.numberOfPages = function () {
        return Math.ceil($scope.filtered.length / $scope.pageSize);
    }

    $scope.hoveringOver = function (value) {
        $scope.overStar = value;
        $scope.percent = 100 * (value / $scope.max);
    };

    $scope.ratingStates = [
      { stateOn: 'glyphicon-ok-sign', stateOff: 'glyphicon-ok-circle' },
      { stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty' },
      { stateOn: 'glyphicon-heart', stateOff: 'glyphicon-ban-circle' },
      { stateOn: 'glyphicon-heart' },
      { stateOff: 'glyphicon-off' }
    ];

    $scope.$watch('rate', function(val) {

        function sucess(data) {

            alert("Can't post " + response.data + " Error:" + response.status);
            console.log(data);

        };

        function error(response) {

            console.log(response)

            alert("Can't post " + response.data + " Error:" + response.status);

        }

        ///Check if there is a new rating
        if (val) {
            ////Listen to check for changes in present rating,,,,, I use to to prevent rating from happening on each page load
            $scope.$watch('rate', function (newVal, oldVal) {

                if (newVal) {

                    //Get the former rating by this user for this book
                    $scope.rateOld = bookFactory.getRate($scope.ipp + '_' + $scope.id);

                    /////Here: Check if my new Rating is more than what i already rated... the essence of this is to make sure when am adding to the total rating, i wount be readding a new record 
                    // instead I update it as necessary 
                        if (val > $scope.rateOld) {
                            var diff = val - $scope.rateOld;
                            TotalRate = diff + $scope.Rt;
                        }
                        else if (val < $scope.rateOld) {
                            var diff = $scope.rateOld - val;
                            TotalRate = $scope.Rt - diff;
                        }
                        var dataRate = TotalRate;

                    ///Fetch current user ip address
                        $.getJSON("//jsonip.com?callback=?", function (data) {
                            var userIP = data.ip + '_' + $scope.id;
                            var datax = {
                                rating: val,
                                ip: data.ip,
                                id: $scope.id
                            };
                            ///Perform Main job here

                            //First i add a new record with the new ip,rating and book ID passing the user ip as another param to identify entry
                            bookFactory.addNew(datax, userIP);
                            //This sets the total rating
                            bookFactory.setRating(dataRate, $scope.id);
                        });

                }
            })
        }

    })
    /////////////////////////////////////////////Book Rating Ends/////////////////////////////////////////////

}]);
//custom filter
    app.filter('startFrom', function() {
        return function(input, start) {
            start = +start; //parse to int
            return input.slice(start);
        }
    });
