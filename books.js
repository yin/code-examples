function BooksCtrl($scope) {
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
}

