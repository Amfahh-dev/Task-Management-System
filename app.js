var app = angular.module('taskManagerApp', []);

app.controller('TaskController', ['$scope', function($scope) {

    // Load tasks from localStorage or start empty
    $scope.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    $scope.categories = JSON.parse(localStorage.getItem('categories')) || ['Work', 'Personal', 'Urgent'];

    // New task form model
    $scope.newTask = {
        name: '',
        description: '',
        priority: 'Low',
        status: 'Pending',
        category: 'Work',
        dueDate: ''
    };

    // Editing task variables
    $scope.editing = false;
    $scope.editingTask = null;

    // Filter and sort
    $scope.filterStatus = '';
    $scope.sortField = 'dueDate';
    $scope.reverseSort = false;

    // ------------------------------
    // Task CRUD Operations
    // ------------------------------

    $scope.addTask = function() {
        if (!$scope.newTask.name) return;
        $scope.tasks.push(angular.copy($scope.newTask));
        $scope.newTask.name = '';
        $scope.newTask.description = '';
        $scope.newTask.priority = 'Low';
        $scope.newTask.status = 'Pending';
        $scope.newTask.category = 'Work';
        $scope.newTask.dueDate = '';
        $scope.saveTasks();
    };

    $scope.editTask = function(task) {
        $scope.editing = true;
        $scope.editingTask = angular.copy(task);
        $scope.originalTask = task;
    };

    $scope.updateTask = function() {
        angular.extend($scope.originalTask, $scope.editingTask);
        $scope.editing = false;
        $scope.editingTask = null;
        $scope.saveTasks();
    };

    $scope.cancelEdit = function() {
        $scope.editing = false;
        $scope.editingTask = null;
    };

    $scope.deleteTask = function(task) {
        const index = $scope.tasks.indexOf(task);
        if (index > -1) {
            $scope.tasks.splice(index, 1);
            $scope.saveTasks();
        }
    };

    $scope.toggleStatus = function(task) {
        task.status = (task.status === 'Pending') ? 'Completed' : 'Pending';
        $scope.saveTasks();
    };

    // ------------------------------
    // Categories
    // ------------------------------

    $scope.addCategory = function() {
        if ($scope.newCategory && !$scope.categories.includes($scope.newCategory)) {
            $scope.categories.push($scope.newCategory);
            $scope.newCategory = '';
            localStorage.setItem('categories', JSON.stringify($scope.categories));
        }
    };

    $scope.deleteCategory = function(category) {
        const index = $scope.categories.indexOf(category);
        if (index > -1) {
            $scope.categories.splice(index, 1);
            $scope.tasks = $scope.tasks.filter(t => t.category !== category);
            localStorage.setItem('categories', JSON.stringify($scope.categories));
            $scope.saveTasks();
        }
    };

    // ------------------------------
    // Filtering and Sorting
    // ------------------------------

    $scope.setSort = function(field) {
        if ($scope.sortField === field) {
            $scope.reverseSort = !$scope.reverseSort;
        } else {
            $scope.sortField = field;
            $scope.reverseSort = false;
        }
    };

    $scope.filterByStatus = function(task) {
        if (!$scope.filterStatus) return true;
        return task.status === $scope.filterStatus;
    };

    // ------------------------------
    // Persistence
    // ------------------------------

    $scope.saveTasks = function() {
        localStorage.setItem('tasks', JSON.stringify($scope.tasks));
    };

    // ------------------------------
    // Helper functions
    // ------------------------------
    
    $scope.getTaskClass = function(task) {
        if (task.status === 'Completed') return 'task-completed';
        if (task.priority === 'High') return 'task-high';
        if (task.priority === 'Medium') return 'task-medium';
        return 'task-low';
    };

}]);
