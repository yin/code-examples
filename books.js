// Thanks to http://blog.brunoscopelliti.com/deal-with-users-authentication-in-an-angularjs-web-app
var _glob_books = [];
var _glob_users = [];


angular.module('books', ['ngRoute', 'controllers'])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/books', {
      templateUrl: 'partials/books.html',
      controller: 'BooksCtrl'
    }).when('/book/:id', {
      templateUrl: 'partials/book.html',
      controller: 'BookCtrl'
    }).when('/authors', {
      templateUrl: 'partials/authors.html',
      controller: 'AuthorsCtrl'
    }).when('/checkouts', {
      templateUrl: 'partials/checkouts.html',
      controller: 'COCtrl'
    }).when('/users', {
      templateUrl: 'partials/users.html',
      controller: 'UsersCtrl'
    }).when('/login', {
      templateUrl: 'partials/login.html',
      controller: 'LoginCtrl'
    });
  }]);
  
angular.module('controllers', [])
  .controller('BooksCtrl', ['$scope', 'BooksService', function($scope, books) {
    $scope.add = function() {
      books.add({name: $scope.bookName,
      	author: $scope.author, year: $scope.year,
      	count: $scope.count, avail: $scope.count});
      $scope.bookName = $scope.author = $scope.year = $scope.count = '';
    };
    $scope.books = function() {
      return books.findAll();
    };
  }])
  
  .controller('BookCtrl', ['$scope', '$routeParams', 'BooksService', 'CheckoutService', 'UserService', function($scope, $params, books, couts, users) {
    $scope.book = function() {
      return books.get($params.id);
    };
    $scope.borrowBook = function(userId, bookId) {
      var book = books.get(bookId);
      var user = users.get(userId);
      if (book != null && user != null) {
        var co = couts.find(userId, bookId);
        if (co != null) {
          // TODO: Message
          alert("Tento citatel uz tuto knihu vypozicanu ma.");
          return;
        } else if (book.avail <= 0) {
          // TODO: Message
          alert("Tato kniha uz nie je na sklade.");
          return;
        } else {
          book.avail--;
          books.update(book);
          couts.add(user, book);
        }
      };
    };
    $scope.returnBook = function(userId, bookID) {
      var co = couts.remove(userId, bookId);
      if (co != null) {
        //TODO: Message
        alert('Vypozicka neexistuje');
        return;
      }
    };
    $scope.users = function() {
      return users.getVisibleUsers();
    };
    $scope.isReader = function() {
      return users.hasUserRole('reader');
    }
    $scope.isBooker = function() {
      return users.hasUserRole('booker');
    };
  }])
  .controller('COCtrl', ['$scope', 'CheckoutService', function($scope, couts) {
    $scope.getCOs = function() {
      return couts.findAll();
    };
  }])
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
  .factory('BooksService', [function() {
    var books = [
    	{id:0, name: "The Grand Design", author: "Stephan Hawking", year: 2011, count: 5, avail: 3},
    	{id:1, name: "Agilni Programovani", author: "Vaclav Kadlec", year: 2004, count: 5, avail: 5}
    ];
    var sdo = {
      add: function(book) {
        books.push(book);
      },
      get: function(id) {
        return books[id];
      },
      findAll: function() {
        return books;
      },
      update: function(book) {
        books[book.id] = book;
      }
    };
    return sdo;
  }])
  .factory('CheckoutService', [function() {
    var _glob_checkouts = [];
    
    var sdo = {
      add: function(user, book) {
        var co = {
          userId: user.id, bookId: book.id,
          user: user, book: book,
          typ: "Vypozicka"
        };
        _glob_checkouts.push(co);
        return co;
      },
      findAll: function() {
        return _glob_checkouts;
      },
      find: function(userId, bookId) {
        for (var i = 0, l=_glob_checkouts.length; i < l; i++) {
          var co = _glob_checkouts[i];
          if (co.userId == userId && co.bookId == bookId) {
            return co;
          }
        }
        return null;
      },
      remove: function(userId, bookId) {
        for (var i = 0, l=_glob_checkouts.length; i < l; i++) {
          var co = _glob_checkouts[i];
          if (co.userId == userId && co.bookId == bookId) {
            _glob_checkouts.remove(i);
            return co;
          }
        }
        return null;
      }
    };
    return sdo;
  }]).factory('UserService', [function() {
    var defaultUser = {name: '', roles: []};
    var users = [
    	{id:0, name: "admin", roles: ["admin"]},
    	{id:1, name: "gabko", roles: ["booker", "tester"]},
    	{id:2, name: "matko", roles: ["reader", "developer"]},
    	{id:3, name: "profak", roles: ["tester"]},
    	{id:4, name: "gabko-real", roles: ["booker"]},
    	{id:5, name: "matko-real", roles: ["reader"]},
    ];
    _glob_users = users;
    var hasUserRole = function(user, role) {
      var roles = user.roles || [];
      var ret = roles.indexOf(role) >= 0;
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
      hasUserRole: function(role) { return hasUserRole(sdo.user, role); },
      getVisibleUsers: getVisibleUsers,
      getUsers: function() { return users; },
      get: function(id) { return users[id]; }
    };
    return sdo;
  }]);

