function crearTabla(transaccion){
    //transaccion.executeSql('Drop TABLE todo');
	transaccion.executeSql('CREATE TABLE IF NOT EXISTS todo (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, Opcion, Cantidad)');    
    
};

function errorCB(err) {
    alert("Error processing SQL: "+err.code);
};

function successCB() {
};
var app = angular.module('App', []);

app.controller('Controller', function($scope) {
    $scope.updated = false;
    $scope.Opcion = "";
    $scope.todo = [];
	
	$scope.updated = false;
    $scope.Cantidad = "";
    $scope.todo = [];

	$scope.BorrarRecord = function(tx){
		var sql = 'DELETE FROM todo WHERE id='+$scope.RecordToDelete;
	    tx.executeSql(sql);
	    
	   
	    for(i=0;i<$scope.todo.length;i++){
	    	$scope.LastId = i;
	    	if($scope.todo[i].Id == $scope.RecordToDelete){
		    	$scope.$apply(function(){
					//$scope.todo[$scope.LastId].shift();
					$scope.todo.splice($scope.LastId, 1);
		        });
		    }

		}

    
	}
	
	$scope.InsertarRecord = function(tx) {
		//var sql = 'INSERT INTO todo (id, task) VALUES ('+$scope.todo.length+', "'+$scope.Opcion+'","'+$scope.Cantidad+'")';
		var sql = 'INSERT INTO todo (Opcion, Cantidad) VALUES ("'+$scope.Opcion+'","'+$scope.Cantidad+'")';
	    tx.executeSql(sql);
	}

	$scope.leerTabla = function(tx) {
	    tx.executeSql('SELECT * FROM todo', [], $scope.querySuccess, errorCB);
	}

	$scope.querySuccess = function(tx, results) {
	    var len = results.rows.length;
	    for (var i=0; i<len; i++){
	    	$scope.newTodo = {
				"Id":results.rows.item(i).id,
	            "Label":results.rows.item(i).Opcion,
	            "Cantidad":results.rows.item(i).Cantidad
	        };
	        
	        $scope.$apply(function(){
				$scope.todo.push($scope.newTodo);
	        });
	        
	     }
	}

	$scope.NuevaTarea = function(){
		$scope.Opcion = "";
		$('#myModal').modal('show');
	}
	

	$scope.NuevaTarea = function(){
		$scope.Cantidad = "";
		$('#myModal').modal('show');
	}

	$scope.GrabarTask = function(){
        var newTodo = {
            "Id":$scope.todo.length + 1,
			"Label":$scope.Opcion,
            "Cantidad":$scope.Cantidad
        };
        $scope.todo.push(newTodo);
        db.transaction($scope.InsertarRecord, errorCB, successCB);
        //$scope.Opcion = "";
		//$scope.Cantidad = "";
    }
    
    $scope.borrar = function(id){
    	$scope.RecordToDelete = id;
    	db.transaction($scope.BorrarRecord, errorCB, successCB);
    }

    var db = window.openDatabase("4glTodo", "1.0", "4gl Todo", 1000000);
    db.transaction(crearTabla, errorCB, successCB);
    db.transaction($scope.leerTabla, errorCB);

    
});