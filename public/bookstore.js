angular.module('bookstore', ['ui.router', 'cart', 'books', 'admin'])
.config(function($urlRouterProvider, $stateProvider) {
  $urlRouterProvider
  .otherwise('/signin');

  $stateProvider
  .state('signin', {
    url: '/signin',
    templateUrl: '/views/signin.html',
  })
  .state('store', {
    url: '/mainstore',
    templateUrl: '/views/mainstore.html',
  })
  .state('admin', {
    url: '/admin',
    templateUrl: '/views/admin.html',
  })
  .state('popular', {
    url: '/popular',
    templateUrl: '/views/popularBooks.html',
  });

})

.controller('BookStoreController', function($scope, $http, $location) {

  $http.get('/data').then(function(books) {
    console.log(books);
    $scope.books = books.data;
  });

  $http.get('/popularBooks').then(function(popularBooks) {
    console.log('top20', (popularBooks));
    popularBooks.data.map(function(book) {
      console.log(book.price);
      var strArr = book.price.split('');
      strArr.shift();
      book.price = parseInt(strArr.join(''));

      // fix author
      book.author = book.author.split(' ');
      book.author.shift();
      // book.author.pop();
      book.author = book.author.join(' ');
      console.log(book);
      return book
    })
    $scope.popularBooks = popularBooks.data;
  });

  $scope.home = function() {
    console.log('go home');
    $location.path('/');
  };

  $scope.signup = function(user) {
    console.log('signUPUPUP user: ', user);

    // post book to the db
    return $http.post('/user', user).success(function(data, status) {
      console.log('user post success', data, status);
    });
  };

  $scope.signin = function(user) {
    console.log('signINININ user: ', user);

    // post book to the db
    return $http.post('/auth', user).then(function(data, status) {
      console.log('user get success', data, status);

      if (data.data.length) {
        if (data.data[0].username === 'admin') {
          $location.path('/admin');
        } else {
          console.log('logged in');
          user.auth = true;
          $location.path('/mainstore');
        }

      } else {
        console.log('not logged in');
      }
    });
  };

  $scope.addBook = function(book) {
    console.log(this.cart.findBook(book.title));
    if (!this.cart.findBook(book.title).length && book.quantity > 0) {
      this.cart.books.push(book);
      book.count = 1;
      book.quantity--;
    } else if (book.quantity) {
      book.count++;
      book.quantity--;

    }

    if (book.quantity) {
      this.cart.total += book.price;

    }
  };

  $scope.toggleCart = function() {
    if (!this.showCart) {
      console.log('on', this.showCart);
      this.showCart = true;
    } else {
      console.log('off', this.showCart);
      this.showCart = false;
    }
  };

  $scope.cart = {
    total: 0,
    books:[],
    empty: function(x) {
      this.total = 0;
      this.books = [];
      if (x) {
        alert('your books are on the way');
      }
    },

    removeBook: function(index) {
      var book = this.books[index];
      this.total -= book.price;
      book.count--;
      book.quantity++;
      if (book.count === 0) {
        this.books.splice(index, 1);
      }
    },

    findBook: function(search) {
      return this.books.filter(function(book) {
        return (book.title === search);
      });
    },
  };
});
