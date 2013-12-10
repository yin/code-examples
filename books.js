// Thanks to http://blog.brunoscopelliti.com/deal-with-users-authentication-in-an-angularjs-web-app
angular.module('books', ['tabs'])
  .controller('BooksCtrl', function($scope) {
    $scope.books = [
    	{name: "The Grand Design", author: "Stephan Hawking", year: 2011, count: 5, avail: 3},
    	{name: "Agilni Programovani", author: "Vaclav Kadlec", year: 2004, count: 5, avail: 5}
    ];
    
    $scope.add = function() {
      $scope.books.push({name: $scope.bookName,
      	author: $scope.author, year: $scope.year,
      	count: $scope.count, avail: $scope.count});
      $scope.bookName = $scope.author = $scope.year = $scope.count = '';
    };
    
    $scope.borrowBook = function() {
    
    };
    
    $scope.returnBook = function() {
    
    };
  })
  .controller('UsersCtrl', ['$scope', 'UserService', function($scope, $user) {
    $scope.add = function() {
      $scope.books.push({name: $scope.bookName,
      	author: $scope.author, year: $scope.year,
      	count: $scope.count, avail: $scope.count});
      $scope.bookName = $scope.author = $scope.year = $scope.count = '';
    };
    $scope.getVisibleUsers = function() {
      return $user.getVisibleUsers();
    };
  }])
  .controller('LoginCtrl', ['$scope', 'UserService', function($scope, $user) {
    $scope.add = function() {
      $scope.books.push({name: $scope.bookName,
      	author: $scope.author, year: $scope.year,
      	count: $scope.count, avail: $scope.count});
      $scope.bookName = $scope.author = $scope.year = $scope.count = '';
    };
    $scope.getUsers = function() {
      return $user.getUsers();
    };
    $scope.loginAs = function(user) {
      $user.user = user;
    };
  }])
  .factory('UserService', [function() {
    var defaultUser = {name: '', roles: []};
    var users = [
    	{name: "admin", roles: ["admin"]},
    	{name: "gabko", roles: ["booker", "tester"]},
    	{name: "matko", roles: ["reader", "developer"]},
    	{name: "profak", roles: ["tester"]},
    	{name: "gabko-real", roles: ["booker"]},
    	{name: "matko-real", roles: ["reader"]},
    ];
    var hasUserRole = function(user, role) {
      var roles = user.roles || [];
      var ret = roles.indexOf(role) >= 0;
      console.log(user.name + " isa " + role + ' = ' + ret);
      return ret;
    }
    var getVisibleUsers = function() {
      var ret = [];
      if(hasUserRole(sdo.user, 'admin')
          || hasUserRole(sdo.user, 'tester') 
          || hasUserRole(sdo.user, 'developer') ) {
        for (var i = 0, l = users.length; i < l; i++) {
          ret.push(users[i]);
        }
      } else if(hasUserRole(sdo.user, 'booker')) {
        for (var i = 0, l = users.length; i < l; i++) {
          if (hasUserRole(users[i], 'reader')) {
            ret.push(users[i]);
          }
        }
      }
      return ret;
    };
    var sdo = {
      isLogged: false,
      user: defaultUser,
      getVisibleUsers: getVisibleUsers,
      getUsers: function() { return users; }
    };
    return sdo;
  }]);

