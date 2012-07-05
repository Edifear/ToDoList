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
            }

            function fillList(){
                var keys = Object.keys(ToDoList);
                for (var j = 0; j < keys.length; j++) {
                    if (keys[j].slice(0, 4) != 'task') continue;
                    var title = ToDoList[keys[j]].value;
                    var id = ToDoList[keys[j]].id;

                    addListTask(title, id);
                }
            }

            function addListTask(title, id){
                var checkbox = "<input type='checkbox' class='toggle'>";
                var span = "<span id='task-"+id+"' class='task-title'>"+title+"</span>";
                var remove = "<a href='#' class='remove'>delete</a>";

                list.append("<li>"+checkbox+span+remove+"</li>");
            }

        //-- create new task
            $self.find('#task-submit').live('click', function(e){
                e.preventDefault();
                var typedTask = $self.find('#task-input').val();
                if (!typedTask) return;

                i = ToDoList.counter;
                ToDoList['task-'+i] = {id: i, value: typedTask};
                addListTask(typedTask, i);
                ToDoList.counter++;

                uploadToDo();

                $self.find('#task-input').val('');
            });

        //-- delete task
            list.find('.remove').live('click', function(e){
                e.preventDefault();
                var task = $(this).parent();
                removeTask(task);
                uploadToDo();
            });

        //-- done task
            list.find('.toggle').live('click', function(e){
                var task = $(this).parent();
                $(this).toggleClass('checked');
                task.toggleClass('done');
                uploadToDo();
            });
        };

        $('.ToDo').ToDoList();

    });
}(jQuery);