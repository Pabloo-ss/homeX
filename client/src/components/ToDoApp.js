import React, { Component } from "react"
import { Redirect, Link } from 'react-router-dom'
import NavBar from "./NavBar"
import NavBar2 from "./NavBarResidents"



export default class ToDoApp extends Component {

    constructor(props) {
        super(props)

        this.state = {
            key: localStorage.email,
            exist: false,
            modal: false,
            count: 0,
        }
    }


    clickOn = e => {
        this.showModal()
    }

    showModal() {
        this.setState({ exist: true, count: this.state.count + 1 })
    }

    createToDoInit() {
        let mainContainer = '.content-container';
        let localStorageKey = this.state.key;

        let filter = 'ALL';  // one of ALL, DONE, NOT-DONE
        let sort = 'NONE'; // NONE, ASCENDING or DESCENDING

        let searchPhrase = '';
        let searchInputIsFocused = false;
        let newToDoName = '';
        let newToDoInputIsFocused = false;

        let tasks = [];


        const loadFromLocaleStorage = function () {
            const state = JSON.parse(localStorage.getItem(localStorageKey));

            if (!state) return

            filter = state.filter;
            sort = state.sort;
            searchPhrase = state.searchPhrase;
            searchInputIsFocused = state.searchInputIsFocused;
            newToDoName = state.newToDoName;
            newToDoInputIsFocused = state.newToDoInputIsFocused;
            tasks = state.tasks;
        }

        const saveToLocaleStorage = function () { // local storage
            const state = {
                filter: filter,
                sort: sort,
                searchPhrase: searchPhrase,
                searchInputIsFocused: searchInputIsFocused,
                newToDoName: newToDoName,
                newToDoInputIsFocused: newToDoInputIsFocused,
                tasks: tasks,
            }

            localStorage.setItem(localStorageKey, JSON.stringify(state));
        }

        // ----- Koniec stanu aplikacji

        const sortDescending = function (taskA, taskB) {
            return -(taskA.name.localeCompare(taskB.name));
        }

        const sortAscending = function (taskA, taskB) {
            return taskA.name.localeCompare(taskB.name);
        }

        const sortNone = function (taskA, taskB) { return 0 }

        const focus = function (condition, element) {
            if (condition) {
                setTimeout(function () { element.focus() }, 0);
            }
        }


        const appendArray = function (array, container) {
            array.forEach(function (element) {
                container.appendChild(element);
            });
        }

        const renderInput = function (onChange, value, focusCondition, className) {
            const input = document.createElement('input');
            input.className = className;

            input.value = value;

            input.addEventListener('input', onChange);

            focus(focusCondition, input);

            return input;
        }



        const renderButton = function (label, onClick, className) {
            const button = document.createElement('button');
            button.className = className;

            if (onClick) {
                button.addEventListener('click', onClick);
            }

            button.innerText = label;

            return button;
        }

        const generateTimestampId = function () {
            return Date.now() + '-' + Math.round(Math.random() * 1000000);
        }
        // ----- Koniec generycznych/pomocniczych elementów, które sprawdzą się w wielu miejscach

        const onSearchPhraseChange = function (event) {
            searchInputIsFocused = true;
            newToDoInputIsFocused = false;
            searchPhrase = event.target.value;
            update();
        }

        const filterByCompleted = function (task) {
            if (filter === 'ALL') return true;

            if (filter === 'DONE') return task.isCompleted;

            if (filter === 'NOT-DONE') return !task.isCompleted;

            return true;
        }

        const filterBySearchPhrase = function (task) {
            const name = task.name.toLowerCase();
            const search = searchPhrase.toLowerCase();
            if (name.includes(search)) return true;
            return false;
        }

        const onFilterChange = function (filterValue) {
            filter = filterValue;

            update();
        }

        const onSortChange = function (sortValue) {
            sort = sortValue;

            update();
        }

        const onNewToDoNameChange = function (event) {
            newToDoInputIsFocused = true;
            searchInputIsFocused = false;
            newToDoName = event.target.value;
            update();
        }

        const onNewToDoSubmit = function (event) {
            event.preventDefault();

            tasks = tasks.concat(
                {
                    name: newToDoName,
                    isCompleted: false,
                    id: generateTimestampId(),
                }
            );
            newToDoName = '';
            update();
        }

        const onTaskCompleteToggle = function (idToToggle) {
            tasks = tasks.map(function (task) {
                if (task.id !== idToToggle) return task;
                return {
                    name: task.name,
                    isCompleted: !task.isCompleted,
                    id: task.id,
                };
            });

            update();
        }

        const onTaskDelete = function (idToDelete) {
            tasks = tasks.filter(function (task) {
                return task.id !== idToDelete;
            });

            update();
        }

        // ----- Koniec funkcji, które zmieniają stan aplikacji

        const renderTask = function (task, onTaskToggle, onDelete) {
            const container = document.createElement('li');
            const wrapper = document.createElement('div');
            const textContainer = document.createElement('span');
            container.className = 'todo-list__list-item';
            wrapper.className = 'todo-list__list-item-wrapper';
            textContainer.className = 'todo-list__list-item-text-container';

            if (task.isCompleted) { // ciekawy sposób na dodawanie klas!
                container.className = container.className + ' todo-list__list-item--completed';
            }

            const deleteButton = renderButton('X', onDelete, 'todo-list__button todo-list__button--delete')

            container.addEventListener('click', onTaskToggle)


            const text = document.createTextNode(task.name);

            textContainer.appendChild(text);
            wrapper.appendChild(textContainer);
            wrapper.appendChild(deleteButton);
            container.appendChild(wrapper);
            return container;
        }

        const renderTasksList = function (tasks) {
            const container = document.createElement('ol');
            container.className = 'todo-list__list';

            const tasksElements = tasks.map((task) => {
                return renderTask(
                    task,
                    function () { onTaskCompleteToggle(task.id) },
                    function () { onTaskDelete(task.id) });
            });

            appendArray(tasksElements, container);

            return container;
        }


        const renderNewTaskButton = function (label) {
            return renderButton(label, null, 'todo-list__button')
        }

        const renderNewTaskInput = function () {
            return renderInput(onNewToDoNameChange, newToDoName, newToDoInputIsFocused, 'todo-list__input');
        }

        const renderNewTaskForm = function () {
            const container = document.createElement('form');
            container.className = 'todo-list__form';

            container.addEventListener('submit', onNewToDoSubmit);

            const inputElement = renderNewTaskInput();
            container.appendChild(inputElement);

            const buttonElement = renderNewTaskButton('ADD');
            container.appendChild(buttonElement);

            return container;
        }

        const renderFilterButton = function (filterValue, activeFilter) {
            let className = 'todo-list__button todo-list__button--filter';
            if (filterValue === activeFilter) {
                className = className + ' todo-list__button--filter-active';
            }

            return renderButton(filterValue, function () { onFilterChange(filterValue) }, className);
        }

        const renderSortButton = function (sortValue, activeSort) {
            let className = 'todo-list__button todo-list__button--sort';
            if (sortValue === activeSort) {
                className = className + ' todo-list__button--sort-active';
            }

            return renderButton(sortValue, function () { onSortChange(sortValue) }, className);
        }

        const renderFilters = function (activeFilter) {
            const container = document.createElement('div');
            container.className = 'todo-list__filters';

            const buttonAll = renderFilterButton('ALL', activeFilter);
            const buttonDone = renderFilterButton('DONE', activeFilter);
            const buttonNotDone = renderFilterButton('NOT-DONE', activeFilter);

            container.appendChild(buttonAll);
            container.appendChild(buttonDone);
            container.appendChild(buttonNotDone);

            return container;
        }

        const renderSortButtons = function (activeSort) {
            const container = document.createElement('div');
            container.className = 'todo-list__sort';

            const buttonNone = renderSortButton('NONE', activeSort);
            const buttonAscending = renderSortButton('ASCENDING', activeSort);
            const buttonDescending = renderSortButton('DESCENDING', activeSort);

            container.appendChild(buttonNone);
            container.appendChild(buttonAscending);
            container.appendChild(buttonDescending);

            return container;
        }

        const renderSearch = function (activeFilter) {
            const container = document.createElement('div');
            container.className = 'todo-list__search';

            const input = renderInput(onSearchPhraseChange, searchPhrase, searchInputIsFocused, 'todo-list__input');

            container.appendChild(input);

            return container;
        }

        const render = function () {
            const container = document.createElement('div');
            container.className = 'todo-list';

            const filteredTasks = tasks
                .filter(filterByCompleted)
                .filter(filterBySearchPhrase);

            const sortedTasks = filteredTasks.slice().sort(
                function (taskA, taskB) {
                    if (sort === 'NONE') {
                        return sortNone(taskA, taskB);
                    }
                    if (sort === 'ASCENDING') {
                        return sortAscending(taskA, taskB);
                    }
                    return sortDescending(taskA, taskB);
                });

            const searchElement = renderSearch();
            const filteredElement = renderFilters(filter);
            const sortedElement = renderSortButtons(sort);
            const newTaskFormElement = renderNewTaskForm();
            const taskListElement = renderTasksList(sortedTasks);

            container.appendChild(searchElement);
            container.appendChild(filteredElement);
            container.appendChild(sortedElement);
            container.appendChild(newTaskFormElement);
            container.appendChild(taskListElement);


            return container;
        }

        const update = function () {
            mainContainer.innerHTML = '';
            const app = render();
            saveToLocaleStorage(); // wywołanie zapisu local storage za każdą zmianą!
            mainContainer.appendChild(app);

        }

        const init = function () {
            const container = document.querySelector(mainContainer);

            if (!container) {
                console.log('Container do not exist!');
                return;
            }

            mainContainer = container;
            loadFromLocaleStorage(); // wczytaj z local storage


            const app = render();

            mainContainer.appendChild(app);
        }

        return init
        // ----- Koniec funkcji zależnych tylko dla naszej aplikacji // rendery
    }

    fullApp() {
        const initToDo1 = this.createToDoInit();
        initToDo1();
    }



    render() {
        if (localStorage.accessLevel === '2') {
            console.log(localStorage.accessLevel);
            return (
                <div className="web-container">
                    <NavBar selected="5" />
                    <div className="content-container" onClick={this.clickOn}>
                        <h1>ToDoAppPage --- Click under to invoke/load your ToDoApp!</h1>

                        {(this.state.exist && this.state.count === 1) ? this.fullApp() : null}
                    </div>
                </div>

            )
        } else {
            return (
                <div className="web-container">
                    <NavBar2 selected="5" />
                    <div className="content-container" onClick={this.clickOn}>
                        <h1>ToDoAppPage --- Click under to invoke/load your ToDoApp!</h1>

                        {(this.state.exist && this.state.count === 1) ? this.fullApp() : null}
                    </div>
                </div>

            )
        }

    }
}
