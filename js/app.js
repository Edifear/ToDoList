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
            var i = JSON.parse( localStorage.getItem('counter') );


            if ( !i || localStorage.length == 1 ) {
                localStorage.setItem( 'counter', JSON.stringify(1) );
            } else {
                fillList();
            }


            function fillList(){
                for(var j=0; j<=localStorage.length-1; j++) {
                    var key = localStorage.key(j);
                    var title = JSON.parse( localStorage.getItem(key) ).value;
                    var id = JSON.parse( localStorage.getItem(key) ).id;
                    if (key.slice(0, 4) != 'task') continue;

                    addListTask(title, id);
                }
            }

            function addListTask(title, id) {
                // var checkbox = "<input type='checkbox' class='toggle'>";
                var span = "<span id='task-"+id+"' class='task-title'>"+title+"</span>";
                var remove = "<a href='#' class='remove'>delete</a>";

                list.append("<li>"+span+remove+"</li>");
            }

        //-- create new task
            $self.find('#task-submit').live('click', function(e){
                e.preventDefault();
                var typedTask = $self.find('#task-input').val();
                if (!typedTask) return;

                var i = JSON.parse( localStorage.getItem('counter') )

                localStorage.setItem( 'task-'+i, JSON.stringify({'value':typedTask, 'id':i}) );
                addListTask(typedTask, i);

                i++;
                localStorage.setItem( 'counter', JSON.stringify(i) );

                $self.find('#task-input').val('');
            });

        //-- delete task
            list.find('.remove').live('click', function(e){
                e.preventDefault();
                var taskId = $(this).siblings('.task-title').attr('id').slice(5);

                localStorage.removeItem("task-"+taskId);
                $(this).parent().remove();
            });

        };

        $('.ToDo').ToDoList();

    });
}(jQuery);