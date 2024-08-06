let urlAllRefuse = "http://localhost:8080/api/return-ex/return-ex-receive-refuse"
let urlDetailRefuse = "http://localhost:8080/api/return-ex/return-ex"
let urlAddorUpdateRefuse = "http://localhost:8080/api/return-ex/return-ex-add-or-update"
window.ReturnRefuseChangeControler = function($scope, $http, $location,$routeParams){
    $scope.sortBy = ''
    $scope.IsSortBy = ''
    $scope.sortCode = true
    $scope.sortCreateDate = true
    $scope.list = []
    $scope.detail = {}

    $scope.getAll = function(){
 
        $http.get(urlAllRefuse).then(function (response){ 
            
           response.data.forEach(element => {
            let date = new Date(element.createDate)
            element.createDate = date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "numeric",
                day: "numeric",
              });
              $scope.list.push(element)
           
        });  
    })
    
    }
   
    $scope.filterCode = function(){
        if($scope.sortCode === true){
            $scope.sortCreateDate = true
            $scope.sortCode = false
            $scope.sortBy = 'code'
            $scope.IsSortBy = 'false'
            return
        }
        if($scope.sortCode === false){
            $scope.sortCode = true
            $scope.sortBy = ''
            $scope.IsSortBy = '';
            return
        }
    
        
    }
    $scope.filterCreateDate = function(){
        if($scope.sortCreateDate === true){
            $scope.sortCode = true
            $scope.sortCreateDate = false
            $scope.sortBy = 'createDate'
            $scope.IsSortBy = 'false'
            return
        }
        if($scope.sortCreateDate === false){
            $scope.sortCreateDate = true
            $scope.sortBy = ''
            $scope.IsSortBy = ''
            return
        }
    
        
    }

  
    $scope.detailEX = function(id){
        $scope.detail = {}
        $http.get(urlDetail+"/"+id).then(function (response){   
            $scope.detail = response.data      
            let date = new Date($scope.detail.createDate)
            $scope.urlDetailRefuse.createDate = date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "numeric",
                day: "numeric",
              });
            console.log( $scope.detail);
     }) 


    }
    $scope.getAll()
}