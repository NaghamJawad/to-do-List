const form = document.getElementById("form"),
    ul = document.getElementById("listofitem"),
    textValue = document.getElementById("textbox"),
    deleteAll = document.getElementById("delallbutton"),
    saveButton = document.getElementById("save"),
    searchInput = document.getElementById("texttosearch"),
    filter = document.getElementById("filter");

let tasks, editId, flag = 0;

refresh();

form.addEventListener("submit", (e) => {

    if ((textValue != "") && (flag == 0)) {
        e.preventDefault();
        let task = {
            id: Date.now(),
            taskValue: textValue.value,
            completed: false,
        };
        tasks.push(task);
        addTasksToPage(task);
        textValue.value = "";

    } else if ((textValue != "") && (flag == 1)) {
        e.preventDefault();
        newValue = textValue.value;
        editTask(newValue);
        textValue.value = "";
        flag = 0;
    }
});

saveButton.addEventListener("click", () => {
    save();
});

searchInput.addEventListener("input", () => {
    search()
});

deleteAll.addEventListener('click', () => {
    let crossedOut = document.querySelectorAll(".Crossedoutspan");
    crossedOut.forEach((task) => {
        let parent = task.parentElement;
        ul.removeChild(parent);
        console.log(task)
    });

    tasks = tasks.filter(e => e.completed !== true);

});

filter.addEventListener('change', (e) => {
    let todos = structuredClone(tasks);
    let listTasks = document.querySelectorAll(".li");
    todos.forEach(todo => {
        switch (e.target.value) {
            case "all":
                listTasks.forEach(el => el.remove())
                addTasksToPage(todo);
                break;
            case "completed":
                listTasks.forEach(el => el.remove())
                if (todo.completed) {
                    addTasksToPage(todo);
                }
                break;
            case "incompleted":
                listTasks.forEach(el => el.remove())
                if (!todo.completed) {
                    addTasksToPage(todo);
                }
                break;
        }
    });
});

function addTasksToPage(t) {
    const li = document.createElement("li");
    li.className = "li";
    const span = document.createElement("span");
    span.className = "span";
    span.innerText = t.taskValue;
    li.appendChild(span);
    ul.appendChild(li);
    if (t.completed) {
        completeTask(span, t.id);
    } else {
        addButtons(li, span, t.id);
    }

}

function addButtons(li, span, id) {
    const done = document.createElement('input'),
        edit = document.createElement('input'),
        deleteItem = document.createElement('input');

    done.type = "button";
    done.value = "Done";
    li.appendChild(done)

    edit.type = "button";
    edit.value = "Edit";
    li.appendChild(edit);

    deleteItem.type = "button";
    deleteItem.value = "Delete";
    li.appendChild(deleteItem)

    done.addEventListener('click', () => {
        li.removeChild(done);
        li.removeChild(edit);
        li.removeChild(deleteItem);
        completeTask(span, id)
    });

    edit.addEventListener('click', () => {
        editId = id;
        textValue.value = span.innerText;
        ul.removeChild(li);
        flag = 1;
    });

    deleteItem.addEventListener('click', () => {
        ul.removeChild(li);
        let a = tasks.find(e => e.id == id);
        tasks = tasks.filter(e => e.id !== a.id);
    });
}

function search() {
    let textSearch = document.getElementById("texttosearch").value;
    let span = document.querySelectorAll(".span");
    span.forEach((x) => {
        let re = new RegExp(textSearch, 'i');
        if (re.test(x.innerText)) {
            x.innerHTML = x.innerText.replace(re, '<mark>$&</mark>')
        }
    })
}

function completeTask(text, id) {
    text.className = "Crossedoutspan";
    text.style.textDecoration = "line-through";
    let a = tasks.find(c => c.id == id);
    a.completed = true;
}

function editTask(value) {
    let a = tasks.find(e => e.id == editId);
    a.taskValue = value;
    addTasksToPage(a);
}

function refresh() {
    tasks = (JSON.parse(localStorage.getItem("tasks"))) || []
    if (tasks.length) {
        tasks.forEach(e => {
            addTasksToPage(e);
        })
    }

}

function save() {
    window.localStorage.setItem("tasks", JSON.stringify(tasks))
}


