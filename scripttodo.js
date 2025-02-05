document.addEventListener("DOMContentLoaded", function () {
    const categoryInput = document.getElementById("categoryInput");
    const addCategoryButton = document.getElementById("addCategory");
    const categoryList = document.getElementById("categoryList");
    const categoryTitle = document.getElementById("categoryTitle");
    const todoInput = document.getElementById("todoInput");
    const addButton = document.getElementById("addButton");
    const todoList = document.getElementById("todoList");
    const backToCategories = document.getElementById("backToCategories");
    const categorySection = document.querySelector(".category-section");
    const taskSection = document.querySelector(".task-section");
    const toggleButton = document.getElementById("toggleMode");
    const completedList = document.getElementById("completedList");

    let currentCategory = "";

    function loadCategories() {
        const categories = JSON.parse(localStorage.getItem("categories")) || [];
        categoryList.innerHTML = "";
        categories.forEach(category => {
            const li = document.createElement("li");
            li.textContent = category;

            const buttonsContainer = document.createElement("div");
            buttonsContainer.style.display = "inline-flex";
            buttonsContainer.style.gap = "5px";

            const editButton = document.createElement("button");
            editButton.textContent = "✏️";
            editButton.addEventListener("click", () => editCategory(category));

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "🗑️";
            deleteButton.addEventListener("click", () => deleteCategory(category));

            buttonsContainer.appendChild(editButton);
            buttonsContainer.appendChild(deleteButton);
            li.appendChild(buttonsContainer);
            li.addEventListener("click", () => openCategory(category));
            categoryList.appendChild(li);
        });
    }


    function addCategory() {
        const categoryName = categoryInput.value.trim();
        if (categoryName === "") return;
        let categories = JSON.parse(localStorage.getItem("categories")) || [];
        if (!categories.includes(categoryName)) {
            categories.push(categoryName);
            localStorage.setItem("categories", JSON.stringify(categories));
            loadCategories();
        }
        categoryInput.value = "";
    }

    function editCategory(oldCategory) {
        const newCategory = prompt("Modifier la catégorie :", oldCategory);
        if (newCategory && newCategory.trim() !== "") {
            let categories = JSON.parse(localStorage.getItem("categories")) || [];
            const index = categories.indexOf(oldCategory);
            if (index !== -1) {
                categories[index] = newCategory;
                localStorage.setItem("categories", JSON.stringify(categories));
                localStorage.setItem(newCategory, localStorage.getItem(oldCategory));
                localStorage.removeItem(oldCategory);
                loadCategories();
            }
        }
    }

    function deleteCategory(category) {
        let categories = JSON.parse(localStorage.getItem("categories")) || [];
        categories = categories.filter(cat => cat !== category);
        localStorage.setItem("categories", JSON.stringify(categories));
        localStorage.removeItem(category);
        loadCategories();
    }

    function openCategory(category) {
        currentCategory = category;
        categoryTitle.textContent = category;
        categorySection.style.display = "none";
        taskSection.style.display = "block";
        loadTodos();
    }

    function toggleTodoCompletion(taskText, isCompleted) {
        let todos = JSON.parse(localStorage.getItem(currentCategory)) || [];
        const taskIndex = todos.findIndex(t => t.text === taskText);
        if (taskIndex !== -1) {
            if (isCompleted) {
                todos[taskIndex].completed = true;
                todos[taskIndex].completedDate = new Date().toLocaleString();
            } else {
                todos[taskIndex].completed = false;
                todos[taskIndex].completedDate = null;
            }
            localStorage.setItem(currentCategory, JSON.stringify(todos));
            loadTodos();
        }
    }

    function loadTodos() {
        const todos = JSON.parse(localStorage.getItem(currentCategory)) || [];
        todoList.innerHTML = "";
        todos.forEach(task => displayTodo(task));
    }

    function displayTodo(taskText, completed = false, completedDate = null) {
        const li = document.createElement("li");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = completed;
        checkbox.addEventListener("change", () => toggleTodoCompletion(taskText, checkbox.checked));

        const taskSpan = document.createElement("span");
        taskSpan.textContent = taskText;

        li.appendChild(checkbox);
        li.appendChild(taskSpan);

        li.textContent = taskText;
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "🗑️";
        deleteButton.addEventListener("click", () => removeTodo(taskText));
        li.appendChild(deleteButton);
        todoList.appendChild(li);

        if (completed) {
            const dateSpan = document.createElement("span");
            dateSpan.textContent = ` (complété le ${completedDate})`;
            li.appendChild(dateSpan);
            completedList.appendChild(li);
        } else {
            todoList.appendChild(li);
        }
    }

    // function displayTodo(taskText, completed = false, completedDate = null) {
    //     const li = document.createElement("li");

    //     const checkbox = document.createElement("input");
    //     checkbox.type = "checkbox";
    //     checkbox.checked = completed;
    //     checkbox.addEventListener("change", () => toggleTodoCompletion(taskText, checkbox.checked));

    //     const taskSpan = document.createElement("span");
    //     taskSpan.textContent = taskText;

    //     li.appendChild(checkbox);
    //     li.appendChild(taskSpan);

    //     if (completed) {
    //         const dateSpan = document.createElement("span");
    //         dateSpan.textContent = ` (complété le ${completedDate})`;
    //         li.appendChild(dateSpan);
    //         completedList.appendChild(li);
    //     } else {
    //         todoList.appendChild(li);
    //     }
    // }

    function addTodo() {
        const taskText = todoInput.value.trim();
        if (taskText === "") return;
        let todos = JSON.parse(localStorage.getItem(currentCategory)) || [];
        todos.push(taskText);
        localStorage.setItem(currentCategory, JSON.stringify(todos));
        displayTodo(taskText);
        todoInput.value = "";
    }

    function removeTodo(taskText) {
        let todos = JSON.parse(localStorage.getItem(currentCategory)) || [];
        todos = todos.filter(todo => todo !== taskText);
        localStorage.setItem(currentCategory, JSON.stringify(todos));
        loadTodos();
    }

    function goBack() {
        categorySection.style.display = "block";
        taskSection.style.display = "none";
    }

    function toggleDarkMode() {
        document.body.classList.toggle("dark-mode");
        if (document.body.classList.contains("dark-mode")) {
            localStorage.setItem("darkMode", "enabled");
            toggleButton.textContent = "☀️";
        } else {
            localStorage.setItem("darkMode", "disabled");
            toggleButton.textContent = "🌙";
        }
    }

    if (localStorage.getItem("darkMode") === "enabled") {
        document.body.classList.add("dark-mode");
        toggleButton.textContent = "☀️";
    }

    toggleButton.addEventListener("click", toggleDarkMode);
    addCategoryButton.addEventListener("click", addCategory);
    addButton.addEventListener("click", addTodo);
    backToCategories.addEventListener("click", goBack);
    loadCategories();
});
