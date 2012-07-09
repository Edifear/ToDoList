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
                task.slideUp(200, function(){task.remove()});
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

        //-- color progress-bar
            function colorProgress(r1,r2,r3,g1,g2,g3,b1,b2,b3,persent){
                function pal(c1,c2){
                    return (Math.floor((c2-c1)*(persent/100))+c1);
                }

                if (persent >= 0 && persent <= 50) {
                    persent = persent*2;
                    return ({'r':pal(r1,r2),'g': pal(g1,g2),'b': pal(b1,b2)});
                }
                else if (persent > 50 && persent <= 100) {
                     return ({'r': pal(r2,r3),'g': pal(g2,g3),'b': pal(b2,b3)});
                }
            }

        //-- fill task progress-bar
            function changeTaskLeft(){
                var total = countTasks().total;
                var done = countTasks().done;
                var persent = (done/total)*100;
                var color = colorProgress(187,252,15,0,231,211,0,0,0,persent);

                $self.find('.tasks-left').text(done);
                $self.find('.tasks-total').text(total);
                $self.find('.progress-status').css({
                    'width': persent+"%",
                    'background': "rgb("+color.r.toString()+","+color.g.toString()+","+color.b.toString()+")"
                });
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

        //-- delete done tasks
            $self.find('.remove-checked').live('click', function(e){
                e.preventDefault();
                $self.find('.done').each(function(){
                    removeTask($(this));
                });

                changeTaskLeft();
            });
        };

        $('.ToDo').ToDoList();

    });
}(jQuery);