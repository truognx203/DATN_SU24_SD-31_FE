var app = angular.module("client", ["ngRoute"]);
app.config(function ($routeProvider, $locationProvider, $httpProvider) {
  $locationProvider.hashPrefix("");
  $routeProvider
    .when("/home", {
      templateUrl: "home.html",
      controller: HomeController

    })
    .when("/login", {
      templateUrl: "login.html",
      controller: LoginController

    })
    .when("/register", {
      templateUrl: "register.html",
      controller: RegisterController

    })
    .when("/forget", {
      templateUrl: "forget.html",
      controller: ForgetController

    })
    .when("/profile", {
      templateUrl: "profile.html",
      controller: ProfileController

    })
    .when("/change", {
      templateUrl: "change.html",
      controller: ChangeController

    })
    .when("/404", {
      templateUrl: "404.html",

    })
    .when("/info", {
      templateUrl: "about-us.html",

    })
    .when("/faq", {
      templateUrl: "returnfaq.html",

    })
    .when("/contact", {
      templateUrl: "contact-us.html",

    })
    .when("/q&a", {
      templateUrl: "q&a.html",

    })




    .when("/products", {
      templateUrl: "products.html",
      controller: ProductController

    })
    .when("/detail/:id", {
      templateUrl: "detail.html",
      controller: DetailController

    })
    .when("/cart", {
      templateUrl: "cart.html",
      controller: CartController


    })
    .when("/checkout", {
      templateUrl: "checkout.html",
      controller: CheckOutController


    })
    .when("/myorder", {
      templateUrl: "myorder.html",
      controller: MyOrderController



    })


    .otherwise({
      redirectTo: "/404",
    });

});

app.factory('AuthInterceptor', function ($location, AuthService, $rootScope) {
  return {
    request: function (config) {
      var token = AuthService.getToken();
      $rootScope.editQuantityIndex = false;
      if ((token === null && $location.path() == '/myorder') || (token === null && $location.path() == '/profile') || (token === null && $location.path() == '/change')) {
        $location.path('/login');
      }
      if ((token !== null && $location.path() == '/cart') || (token !== null && $location.path() == '/checkout')) {
        $rootScope.editQuantityIndex = true;
      }

      if ((token !== null && $location.path() == '/login') || (token !== null && $location.path() == '/register') || (token !== null && $location.path() == '/forget')) {

        $location.path('/home');
      }

      return config;
    }
  };
});

app.config(function ($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
});

// Tạo một service để quản lý thông tin đăng nhập
app.factory('AuthService', function () {
  var authService = {};

  authService.saveToken = function (token) {
    localStorage.setItem('token1', token);
  };

  authService.getToken = function () {
    return localStorage.getItem('token1');
  };

  authService.clearToken = function () {
    localStorage.removeItem('token1');
  };
  authService.saveCustomer = function (id) {
    localStorage.setItem('customer', id);
  };

  authService.getCustomer = function () {
    return localStorage.getItem('customer');
  };
  authService.clearCustomer = function () {
    localStorage.removeItem('customer');
  };



  return authService;
});
app.factory('CartService', function () {
  // Kiểm tra xem có dữ liệu giỏ hàng trong localStorage không
  var cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

  function saveToLocalStorage() {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }

  return {
    getCartItems: function () {
      return cartItems;
    },

    addToCart: function (item) {

      cartItems.push(item);
      saveToLocalStorage();
    },

    removeFromCart: function (index) {
      cartItems.splice(index, 1);
      saveToLocalStorage();
    },
    updateCartItem: function (index, updatedItem) {
      if (index >= 0 && index < cartItems.length) {
        cartItems[index] = updatedItem;
        saveToLocalStorage();
      } else {
        console.error('Invalid index:', index);
      }
    },

    clearCart: function () {
      cartItems = [];
      saveToLocalStorage();
    },
    findItemIndexById: function (itemId, idColor, idSize) {

      for (var i = 0; i < cartItems.length; i++) {

        if (cartItems[i].idProductDetail.id == itemId && cartItems[i].idColor == idColor && cartItems[i].idSize == idSize) {

          return i; // Return the index if item is found
        }
      }

      return -1; // Return -1 if item is not found
    },

    getCartItemAtIndex: function (index) {
      if (index >= 0 && index < cartItems.length) {
        return cartItems[index];
      } else {
        console.error('Invalid index:', index);
        return null; // or handle the error in your application logic
      }
    }
  };
});

app.run(function ($rootScope, $http, AuthService, CartService) {
  $rootScope.toggleCart = function () {
    $rootScope.isCartOpen = !$rootScope.isCartOpen;
    if ($rootScope.isCartOpen) {
      angular.element(document.getElementById('header-cart')).addClass('show');
    } else {
      angular.element(document.getElementById('header-cart')).removeClass('show');
    }

  };
  if (AuthService.getToken() != null) {
    var token = AuthService.getToken();

    $http({
      method: "GET",
      url: "http://localhost:8080/api/auth/get",
      params: { token: token },
    }).then(function (username) {

      $http.get('http://localhost:8080/api/customer/getByUsername/' + username.data.username).then(function (user) {
        $rootScope.user = user.data;
        AuthService.saveCustomer(user.data.id)


        //get cart
        let urlcolor = "http://localhost:8080/api/color";
        let urlsize = "http://localhost:8080/api/size";
        // load color
        $rootScope.listColorIndex = [];
        $http.get(urlcolor).then(function (response) {
          $rootScope.listColorIndex = response.data;
        });
        // load size
        $rootScope.listSizeIndex = [];
        $http.get(urlsize).then(function (response) {
          $rootScope.listSizeIndex = response.data;
        });
        //load cart by user
        $rootScope.listCartIndex = [];
        $http.get("http://localhost:8080/api/cart/" + user.data.id).then(function (cart) {
          $rootScope.listCartIndex = cart.data;
          $rootScope.tongTienIndex = 0;
          for (let i = 0; i < $rootScope.listCartIndex.length; i++) {
            $rootScope.tongTienIndex +=
              $rootScope.listCartIndex[i].unitPrice * $rootScope.listCartIndex[i].quantity;
          }
        });
        $http.get("http://localhost:8080/api/cart/getCartByCustomer/" + user.data.id).then(function (idd) {
          let idCart = idd.data.id;


          //delete product from cart
          $rootScope.deleteByCartIndex = function (id) {
            Swal.fire({
              title: "Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng ?",
              showCancelButton: true,
              confirmButtonText: "Xóa",
            }).then((result) => {
              /* Read more about isConfirmed, isDenied below */
              if (result.isConfirmed) {
                $http.delete("http://localhost:8080/api/cart/" + id);

                Swal.fire("Đã xóa khỏi giỏ hàng !", "", "success");
                setTimeout(() => {
                  $http.get("http://localhost:8080/api/cart/" + user.data.id).then(function (cartL) {
                    $rootScope.listCartIndex = cartL.data;
                    $rootScope.tongTienIndex = 0;
                    for (let i = 0; i < $rootScope.listCartIndex.length; i++) {
                      $rootScope.tongTienIndex +=
                        $rootScope.listCartIndex[i].unitPrice * $rootScope.listCartIndex[i].quantity;
                    }
                    //load cart by user
                    $rootScope.listCart = cartL.data;
                    $rootScope.tongTien = 0;
                    for (let i = 0; i < $rootScope.listCart.length; i++) {
                      $rootScope.tongTien +=
                        $rootScope.listCart[i].unitPrice * $rootScope.listCart[i].quantity;
                    }
                  })
                  location.href = "#cart";
                }, 500);
              }
            });
          };

          //giảm số lượng trong cart
          $rootScope.giamIndex = function (idCartDetail, idProductDetail, idColor, idSize) {
            var getQuanity = parseInt(
              document.getElementById("qtyIndex" + idCartDetail).value
            );


            getQuanity = getQuanity - 1;
            //nếu product về số lượng là 0 thì check có thể xóa
            if (getQuanity <= 0) {
              $rootScope.deleteByCartIndex(idCartDetail);
              getQuanity = 1;
              return;
            }
            //get đơn giá ở thời điểm hiện tại
            $http
              .get("http://localhost:8080/api/product/" + idProductDetail)
              .then(function (response) {
                var unitPrice = 0;
                if (response.data.discount > 0) {
                  unitPrice =
                    response.data.price -
                    response.data.price * (response.data.discount * 0.01);
                } else {
                  unitPrice = response.data.price;
                }

                // nếu thỏa mãn thì giảm số lượng trong giỏ hàng
                $http
                  .put("http://localhost:8080/api/cart/updateCart/" + idCartDetail, {
                    idCart: idCart,
                    idProductDetail: idProductDetail,
                    idColor: idColor,
                    idSize: idSize,
                    quantity: getQuanity,
                    unitPrice: unitPrice,
                  })
                  .then(function (cart) {
                    if (cart.status === 200) {
                      $http.get("http://localhost:8080/api/cart/" + user.data.id).then(function (cartL) {
                        $rootScope.listCartIndex = cartL.data;
                        $rootScope.tongTienIndex = 0;
                        for (let i = 0; i < $rootScope.listCartIndex.length; i++) {
                          $rootScope.tongTienIndex +=
                            $rootScope.listCartIndex[i].unitPrice * $rootScope.listCartIndex[i].quantity;
                        }

                      })
                      //load lại sau khi giảm thành công !

                    }
                  });
              });
          };
          // tăng số lượng trong giỏ
          $rootScope.tangIndex = function (idCartDetail, idProductDetail, idColor, idSize) {
            // check số lượng của sản phẩm đang còn

            var params = {
              IdProduct: idProductDetail,
              IdColor: idColor,
              IdSize: idSize,
            };
            $http({
              method: "GET",
              url: "http://localhost:8080/api/productdetail_color_size/getQuantityProductAndColorAndSize",
              params: params,
            }).then(function (resp) {
              $rootScope.quantity = resp.data;

              if (
                document.getElementById("qtyIndex" + idCartDetail).value >= $rootScope.quantity
              ) {
                Swal.fire(
                  "Số lượng đã đến mức tối đa số lượng sản phẩm hiện có !",
                  "",
                  "error"
                );
                return;
              }
              document.getElementById("qtyIndex" + idCartDetail).value =
                parseInt(document.getElementById("qtyIndex" + idCartDetail).value) + 1;

              //get đơn giá ở thời điểm hiện tại
              $http
                .get("http://localhost:8080/api/product/" + idProductDetail)
                .then(function (response) {
                  var unitPrice = 0;
                  if (response.data.discount > 0) {
                    unitPrice =
                      response.data.price -
                      response.data.price * (response.data.discount * 0.01);
                  } else {
                    unitPrice = response.data.price;
                  }

                  // nếu thỏa mãn thì tăng số lượng trong giỏ hàng
                  $http
                    .put(
                      "http://localhost:8080/api/cart/updateCart/" + idCartDetail,
                      {
                        idCart: idCart,
                        idProductDetail: idProductDetail,
                        idColor: idColor,
                        idSize: idSize,
                        quantity: parseInt(
                          document.getElementById("qtyIndex" + idCartDetail).value
                        ),
                        unitPrice: unitPrice,
                      }
                    )
                    .then(function (cart) {
                      if (cart.status === 200) {
                        $http.get("http://localhost:8080/api/cart/" + user.data.id).then(function (cartL) {
                          $rootScope.listCartIndex = cartL.data;
                          $rootScope.tongTienIndex = 0;
                          for (let i = 0; i < $rootScope.listCartIndex.length; i++) {
                            $rootScope.tongTienIndex +=
                              $rootScope.listCartIndex[i].unitPrice * $rootScope.listCartIndex[i].quantity;
                          }


                        })

                      }
                    });
                });
            });
          };

          $rootScope.EnterQuantityIndex = function (
            idCartDetail,
            idProductDetail,
            idColor,
            idSize
          ) {
            var numberRegex = /^[0-9]+$/;
            if (
              !numberRegex.test(document.getElementById("qtyIndex" + idCartDetail).value)
            ) {
              Swal.fire("Số lượng phải là số nguyên dương !!", "", "error");
              $http
                .get(
                  "http://localhost:8080/api/cart/getQuantityByCartDetail/" +
                  idCartDetail
                )
                .then(function (resp) {
                  document.getElementById("qtyIndex" + idCartDetail).value = resp.data;
                });
              return;
            }
            var params = {
              IdProduct: idProductDetail,
              IdColor: idColor,
              IdSize: idSize,
            };
            $http({
              method: "GET",
              url: "http://localhost:8080/api/productdetail_color_size/getQuantityProductAndColorAndSize",
              params: params,
            }).then(function (resp) {
              $rootScope.quantity = resp.data;

              if (
                document.getElementById("qtyIndex" + idCartDetail).value > $rootScope.quantity
              ) {
                Swal.fire(
                  "Số lượng đã đến mức tối đa số lượng sản phẩm hiện có !",
                  "",
                  "error"
                );
                $http
                  .get(
                    "http://localhost:8080/api/cart/getQuantityByCartDetail/" +
                    idCartDetail
                  )
                  .then(function (resp) {
                    document.getElementById("qtyIndex" + idCartDetail).value = resp.data;
                  });
              } else {
                //get đơn giá ở thời điểm hiện tại
                $http
                  .get("http://localhost:8080/api/product/" + idProductDetail)
                  .then(function (response) {
                    var unitPrice = 0;
                    if (response.data.discount > 0) {
                      unitPrice =
                        response.data.price -
                        response.data.price * (response.data.discount * 0.01);
                    } else {
                      unitPrice = response.data.price;
                    }

                    // nếu thỏa mãn thì tăng số lượng trong giỏ hàng
                    $http
                      .put(
                        "http://localhost:8080/api/cart/updateCart/" + idCartDetail,
                        {
                          idCart: idCart,
                          idProductDetail: idProductDetail,
                          idColor: idColor,
                          idSize: idSize,
                          quantity: parseInt(
                            document.getElementById("qtyIndex" + idCartDetail).value
                          ),
                          unitPrice: unitPrice,
                        }
                      )
                      .then(function (cart) {
                        if (cart.status === 200) {

                          $http.get("http://localhost:8080/api/cart/" + user.data.id).then(function (cartL) {
                            $rootScope.listCartIndex = cartL.data;
                            $rootScope.tongTienIndex = 0;
                            for (let i = 0; i < $rootScope.listCartIndex.length; i++) {
                              $rootScope.tongTienIndex +=
                                $rootScope.listCartIndex[i].unitPrice * $rootScope.listCartIndex[i].quantity;
                            }

                          })
                          //load lại sau khi tăng thành công !

                        }
                      });
                  });
              }
            });
          };
        })

      })


    })
      .catch(function (error) {
        console.log("Error fetching username:", error);
        // Xử lý lỗi ở đây nếu cần
      });
  }
  else {
    // CartService.clearCart();
    $rootScope.listCartIndex1 = CartService.getCartItems();

    //get cart
    let url = "http://localhost:8080/api/product";
    let urlcolor = "http://localhost:8080/api/color";
    let urlsize = "http://localhost:8080/api/size";
    // load color
    $rootScope.listIndex1 = [];
    $http.get(url).then(function (response) {
      $rootScope.listIndex1 = response.data;

    });


    $rootScope.listColorIndex1 = [];
    $http.get(urlcolor).then(function (response) {
      $rootScope.listColorIndex1 = response.data;
    });
    // load size
    $rootScope.listSizeIndex1 = [];
    $http.get(urlsize).then(function (response) {
      $rootScope.listSizeIndex1 = response.data;
    });


    $rootScope.tongTienIndex1 = 0;
    for (let i = 0; i < $rootScope.listCartIndex1.length; i++) {
      $rootScope.tongTienIndex1 +=
        $rootScope.listCartIndex1[i].unitPrice * $rootScope.listCartIndex1[i].quantity;
    }

    $rootScope.deleteByCartIndex1 = function (id, idColor, idSize) {
      Swal.fire({
        title: "Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng ?",
        showCancelButton: true,
        confirmButtonText: "Xóa",
      }).then((result) => {
        if (result.isConfirmed) {
          var index = CartService.findItemIndexById(id, idColor, idSize);
          CartService.removeFromCart(index);

          // Reload data from the server
          $http.get(url).then(function (response) {
            $rootScope.listIndex1 = response.data;
          });

          $http.get(urlcolor).then(function (response) {
            $rootScope.listColorIndex1 = response.data;
          });

          $http.get(urlsize).then(function (response) {
            $rootScope.listSizeIndex1 = response.data;
          });

          // Recalculate total price
          $rootScope.tongTienIndex1 = 0;
          for (let i = 0; i < $rootScope.listCartIndex1.length; i++) {
            $rootScope.tongTienIndex1 +=
              $rootScope.listCartIndex1[i].unitPrice * $rootScope.listCartIndex1[i].quantity;
          }

          Swal.fire("Đã xóa khỏi giỏ hàng !", "", "success");
        }
      });
    };

    //giảm số lượng trong cart
    $rootScope.giamIndex1 = function (idProductDetail, idColor, idSize) {
      var getQuanity = parseInt(
        document.getElementById("qtyIndex1" + idProductDetail + "color" + idColor + "size" + idSize).value
      );


      getQuanity = getQuanity - 1;
      //nếu product về số lượng là 0 thì check có thể xóa
      if (getQuanity <= 0) {
        $rootScope.deleteByCartIndex1(idProductDetail, idColor, idSize);
        getQuanity = 1;
        return;
      }
      //get đơn giá ở thời điểm hiện tại
      $http
        .get("http://localhost:8080/api/product/" + idProductDetail)
        .then(function (response) {
          var unitPrice = 0;
          if (response.data.discount > 0) {
            unitPrice =
              response.data.price -
              response.data.price * (response.data.discount * 0.01);
          } else {
            unitPrice = response.data.price;
          }

          var index = CartService.findItemIndexById(idProductDetail, idColor, idSize);
          var cartUpdate = {
            idProductDetail: response.data,
            idColor: idColor,
            idSize: idSize,
            quantity: parseInt(CartService.getCartItemAtIndex(index).quantity) - 1,
            unitPrice: unitPrice
          }
          CartService.updateCartItem(index, cartUpdate);
          // Recalculate total price
          $rootScope.tongTienIndex1 = 0;
          for (let i = 0; i < $rootScope.listCartIndex1.length; i++) {
            $rootScope.tongTienIndex1 +=
              $rootScope.listCartIndex1[i].unitPrice * $rootScope.listCartIndex1[i].quantity;
          }

        });
    };

    // tăng số lượng trong giỏ
    $rootScope.tangIndex1 = function (idProductDetail, idColor, idSize) {
      // check số lượng của sản phẩm đang còn

      var params = {
        IdProduct: idProductDetail,
        IdColor: idColor,
        IdSize: idSize,
      };
      $http({
        method: "GET",
        url: "http://localhost:8080/api/productdetail_color_size/getQuantityProductAndColorAndSize",
        params: params,
      }).then(function (resp) {
        $rootScope.quantity = resp.data;

        if (
          document.getElementById("qtyIndex1" + idProductDetail + "color" + idColor + "size" + idSize).value >= $rootScope.quantity
        ) {
          Swal.fire(
            "Số lượng đã đến mức tối đa số lượng sản phẩm hiện có !",
            "",
            "error"
          );
          return;
        }
        document.getElementById("qtyIndex1" + idProductDetail + "color" + idColor + "size" + idSize).value =
          parseInt(document.getElementById("qtyIndex1" + idProductDetail + "color" + idColor + "size" + idSize).value) + 1;

        //get đơn giá ở thời điểm hiện tại
        $http
          .get("http://localhost:8080/api/product/" + idProductDetail)
          .then(function (response) {
            var unitPrice = 0;
            if (response.data.discount > 0) {
              unitPrice =
                response.data.price -
                response.data.price * (response.data.discount * 0.01);
            } else {
              unitPrice = response.data.price;
            }

            var index = CartService.findItemIndexById(idProductDetail, idColor, idSize);
            var cartUpdate = {
              idProductDetail: response.data,
              idColor: idColor,
              idSize: idSize,
              quantity: parseInt(CartService.getCartItemAtIndex(index).quantity) + 1,
              unitPrice: unitPrice
            }
            CartService.updateCartItem(index, cartUpdate);
            // Recalculate total price
            $rootScope.tongTienIndex1 = 0;
            for (let i = 0; i < $rootScope.listCartIndex1.length; i++) {
              $rootScope.tongTienIndex1 +=
                $rootScope.listCartIndex1[i].unitPrice * $rootScope.listCartIndex1[i].quantity;
            }

          });
      });
    };
    $rootScope.EnterQuantityIndex1 = function (
      idProductDetail,
      idColor,
      idSize
    ) {
      var numberRegex = /^[0-9]+$/;
      if (
        !numberRegex.test(document.getElementById("qtyIndex1" + idProductDetail + "color" + idColor + "size" + idSize).value)
      ) {
        Swal.fire("Số lượng phải là số nguyên dương !!", "", "error");
        document.getElementById("qtyIndex1" + idProductDetail + "color" + idColor + "size" + idSize).value = 1;
        return;
      }
      var params = {
        IdProduct: idProductDetail,
        IdColor: idColor,
        IdSize: idSize,
      };
      $http({
        method: "GET",
        url: "http://localhost:8080/api/productdetail_color_size/getQuantityProductAndColorAndSize",
        params: params,
      }).then(function (resp) {
        $rootScope.quantity = resp.data;

        if (
          document.getElementById("qtyIndex1" + idProductDetail + "color" + idColor + "size" + idSize).value > $rootScope.quantity
        ) {
          Swal.fire(
            "Số lượng đã đến mức tối đa số lượng sản phẩm hiện có !",
            "",
            "error"
          );
        } else {
          //get đơn giá ở thời điểm hiện tại
          $http
            .get("http://localhost:8080/api/product/" + idProductDetail)
            .then(function (response) {
              var unitPrice = 0;
              if (response.data.discount > 0) {
                unitPrice =
                  response.data.price -
                  response.data.price * (response.data.discount * 0.01);
              } else {
                unitPrice = response.data.price;
              }

              var index = CartService.findItemIndexById(idProductDetail, idColor, idSize);
              var cartUpdate = {
                idProductDetail: response.data,
                idColor: idColor,
                idSize: idSize,
                quantity: parseInt(document.getElementById("qtyIndex1" + idProductDetail + "color" + idColor + "size" + idSize).value),
                unitPrice: unitPrice
              }
              CartService.updateCartItem(index, cartUpdate);
              // Recalculate total price
              $rootScope.tongTienIndex1 = 0;
              for (let i = 0; i < $rootScope.listCartIndex1.length; i++) {
                $rootScope.tongTienIndex1 +=
                  $rootScope.listCartIndex1[i].unitPrice * $rootScope.listCartIndex1[i].quantity;
              }


            });
        }
      });
    };
  }

  $rootScope.logout = function () {
    Swal.fire({
      title: 'Bạn có chắc muốn đăng xuất ?',
      showCancelButton: true,
      confirmButtonText: 'Đăng xuất',
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        AuthService.clearCustomer();
        AuthService.clearToken();

        $rootScope.user = null;
        $rootScope.listCartIndex = [];
        Swal.fire('Đăng xuất thành công !', '', "success");
        location.href = "#/login"

      }
    })

  }
});