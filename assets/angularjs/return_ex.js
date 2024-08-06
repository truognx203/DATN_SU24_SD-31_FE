let urlAll = "http://localhost:8080/api/return-ex/return-ex-receive"
let urlDetail = "http://localhost:8080/api/return-ex/return-ex"
let urlAddorUpdate = "http://localhost:8080/api/return-ex/return-ex-add-or-update"
window.ReturnEXControler = function($scope, $http, $location,$routeParams){
    $scope.sortBy = ''
    $scope.IsSortBy = ''
    $scope.sortCode = true
    $scope.sortCreateDate = true
    $scope.list = []
    $scope.detail = {}

    $scope.getAll = function(){
      $scope.list = []
        $http.get(urlAll).then(function (response){ 
            
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

    $scope.tuchoi = function(id){

        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
              confirmButton: 'btn btn-success',
              cancelButton: 'btn btn-danger'
            },
            buttonsStyling: false
          })
          
          swalWithBootstrapButtons.fire({
            title: 'Are you sure?',
            input: 'text',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
            reverseButtons: true
          }).then((result) => {
            if (result.isConfirmed) {
                
               $http.post(urlAddorUpdate,{
                id:id,
                status:0,
                note:result.value

              })
              
              $scope.getAll();

              swalWithBootstrapButtons.fire(
                'Deleted!',
                'Your file has been deleted.',
                'success'
              )
            } else if (
              /* Read more about handling dismissals below */
              result.dismiss === Swal.DismissReason.cancel
            ) {
              swalWithBootstrapButtons.fire(
                'Cancelled',
                ' :)',
                'error'
              )
            }
          })
       
    }
    $scope.detailEX = function(id){
        $scope.detail = {}
        $http.get(urlDetail+"/"+id).then(function (response){   
            $scope.detail = response.data      
            let date = new Date($scope.detail.createDate)
            $scope.detail.createDate = date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "numeric",
                day: "numeric",
              });
            console.log( $scope.detail);
     }) 


    }
    $scope.getAll()
}