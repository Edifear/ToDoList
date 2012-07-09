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
            } else {
                fillList();
                changeTaskLeft();
            }


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

            function changeStatusTask(task){
                var id = task.find('.task-title').attr('id').slice(5);
                var status = ToDoList['task-'+id].done;
                status ? status = false : status = true;
                ToDoList['task-'+id].done = status;

                uploadToDo();
            }

            function fillList(){
                var keys = Object.keys(ToDoList);
                for (var j = 0; j < keys.length; j++) {
                    if (keys[j].slice(0, 4) != 'task') continue;
                    var title = ToDoList[keys[j]].value;
                    var id = ToDoList[keys[j]].id;
                    var status = ToDoList[keys[j]].done;

                    addListTask(title, id, status);
                }
            }

            function addListTask(title, id, status){
                var text = $('<span></span>')
                    .attr({ id : 'task-'+id })
                    .addClass('task-title')
                    .text(title);

                var checkbox = $('<input>')
                    .attr({ type : 'checkbox', checked : status})
                    .addClass('toggle');

                var remove = $('<a></a>')
                    .attr({ href : '#'})
                    .addClass('remove')
                    .text('delete');

                var task = list.append($('<li></li>')
                    .hide(0, function(){if (status) $(this).addClass('done')})
                    .append(checkbox, text, remove));
            }

            function countTasks(){
                var keys = Object.keys(ToDoList);
                var a = 0;
                var b = 0;
                for (var j = 0; j < keys.length; j++) {
                    if (keys[j].slice(0, 4) != 'task') continue;
                    a++;
                    var status = ToDoList[keys[j]].done;
                    if (status) b++;
                }
                return {'total':a, 'done':b};
            }

        //-- fill task progress-bar
            function changeTaskLeft(){
                var total = countTasks().total;
                var done = countTasks().done;
                var persent = (done/total)*100;

                $self.find('.tasks-left').text(done);
                $self.find('.tasks-total').text(total);
                $self.find('.progress-status').width(persent+'%');

            }

        //-- create new task
            $self.find('#task-submit').live('click', function(e){
                e.preventDefault();
                var typedTask = $self.find('#task-input').val();
                if (!typedTask) return;

                i = ToDoList.counter;
                ToDoList['task-'+i] = {id: i, value: typedTask, done: false};
                addListTask(typedTask, i, false);
                ToDoList.counter++;

                changeTaskLeft();
                uploadToDo();

                $self.find('#task-input').val('');
            });

        //-- delete task
            list.find('.remove').live('click', function(e){
                e.preventDefault();
                var task = $(this).parent();

                removeTask(task);
                changeTaskLeft();
            });

        //-- done task
            list.find('.toggle').live('click', function(e){
                var task = $(this).parent();
                task.toggleClass('done');

                changeStatusTask(task);
                changeTaskLeft();
            });
        };

        $('.ToDo').ToDoList();

    });
}(jQuery);