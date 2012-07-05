!function($){
    "use strict"

    $(document).ready(function(){


        $.fn.ToDoList = function(options){
            if (typeof(localStorage) == 'undefined' ) {
                alert('Your browser does not support HTML5 localStorage. Try upgrading.');
                return;
            }

            var self = this;
            var $self = $(this);
            var list = $self.find('.task-list');


            var ToDoList = JSON.parse( localStorage.getItem('ToDo') );


            if ( !ToDoList || Object.keys(ToDoList).length == 1 ) {
                console.log('nema');
                ToDoList = {'counter':1};
                uploadToDo();
            } else fillList();

            var i = ToDoList.counter;

            function uploadToDo(){
                localStorage.setItem( 'ToDo', JSON.stringify(ToDoList) );
            }

            function removeTask(task){
                var id = task.find('.task-title').attr('id').slice(5);
                task.slideUp('slow', function(){task.remove()});
                delete ToDoList['task-'+id];
                uploadToDo();
            }

            function changeStatusTask(task, status){
                var id = task.find('.task-title').attr('id').slice(5);
                ToDoList['task-'+id].status = status;
                uploadToDo();
            }


            function fillList(){
                var keys = Object.keys(ToDoList);
                for (var j = 0; j < keys.length; j++) {
                    if (keys[j].slice(0, 4) != 'task') continue;
                    var title = ToDoList[keys[j]].value;
                    var id = ToDoList[keys[j]].id;
                    var status = ToDoList[keys[j]].status;

                    addListTask(title, id, status);
                }
            }

            function addListTask(title, id, status){
                if (status == 'done') {
                    var checked = 'checked';
                    var done = " class='done'";
                } else {
                    var checked = '';
                    var done = '';
                }

                var checkbox = "<input type='checkbox' class='toggle "+checked+"' "+checked+">";
                var span = "<span id='task-"+id+"' class='task-title'>"+title+"</span>";
                var remove = "<a href='#' class='remove'>delete</a>";
                var task = list.append("<li"+done+">"+checkbox+span+remove+"</li>");

            }

        //-- create new task
            $self.find('#task-submit').live('click', function(e){
                e.preventDefault();
                var typedTask = $self.find('#task-input').val();
                if (!typedTask) return;

                i = ToDoList.counter;
                ToDoList['task-'+i] = {id: i, value: typedTask, status: 'non-completed'};
                addListTask(typedTask, i, 'non-completed');
                ToDoList.counter++;

                uploadToDo();

                $self.find('#task-input').val('');
            });

        //-- delete task
            list.find('.remove').live('click', function(e){
                e.preventDefault();
                var task = $(this).parent();
                removeTask(task);
            });

        //-- done task
            list.find('.toggle').live('click', function(e){
                var task = $(this).parent();
                $(this).toggleClass('checked');
                task.toggleClass('done');

                if ($(this).hasClass('checked')) {
                    var status = 'done';
                } else {
                    var status = 'non-completed'
                }
                changeStatusTask(task, status);
            });
        };

        $('.ToDo').ToDoList();

    });
}(jQuery);