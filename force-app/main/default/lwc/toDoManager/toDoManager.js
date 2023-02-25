
import { LightningElement, track, api } from "lwc";
import getCurrentTodos from "@salesforce/apex/ToDoController.getCurrentTodos";
import addTodo from "@salesforce/apex/ToDoController.addTodo";

export default class toDoManager extends LightningElement {
    @api flexipageRegionWidth;

    @track time = "8:22 AM";
    @track greeting = "Good Morning";

    @track todos = [];

    connectedCallback() {
    this.getTime();

    this.fetchTodos();
    // eslint-disable-next-line @lwc/lwc/no-async-operation
        setInterval(() => {
            this.getTime();
        }, 1000 * 60);
    }

    getTime() {
        const date = new Date();
        const hour = date.getHours();
        const min = date.getMinutes();

        this.time = `${this.getHour(hour)}:${this.getDoubleDigit(
        min
        )} ${this.getMidDay(hour)}`;
        this.setGreeting(hour);
    }

    getHour(hour) {
        return hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    }

    getDoubleDigit(digit) {
        return digit < 10 ? "0" + digit : digit;
    }

    getMidDay(hour) {
        return hour >= 12 ? "PM" : "AM";
    }

    setGreeting(hour) {
        if (hour < 12) {
        this.greeting = "Good Morning";
        } else if (hour >= 12 && hour < 17) {
        this.greeting = "Good Afternoon";
        } else {
        this.greeting = "Good Evening";
        }
    }

    addTodoHandler() {
        const inputBox = this.template.querySelector("lightning-input");
        const todo = { todoName: inputBox.value, done: false };
        addTodo({ payload: JSON.stringify(todo) })
        .then(result => {
            if (result) {
            this.fetchTodos();
            }
        })
        .catch(error => {
            console.error("Error in adding todo" + error);
        });

        inputBox.value = "";
    }

    fetchTodos() {
        getCurrentTodos()
        .then(result => {
            if (result) {
            this.todos = result;
            }
        })
        .catch(error => {
            console.error("Error in fetching todo" + error);
        });
    }
    updateTodoHandler(event) {
        if (event) {
        this.fetchTodos();
        }
    }

    deleteTodoHandler(event) {
        if (event) {
        this.fetchTodos();
        }
    }

    get upcomingTodos() {
        return this.todos && this.todos.length
        ? this.todos.filter(todo => !todo.done)
        : [];
    }

    get completedTodos() {
        return this.todos && this.todos.length
        ? this.todos.filter(todo => todo.done)
        : [];
    }

    get largePageSize() {
        return this.flexipageRegionWidth === "SMALL"
        ? "12"
        : this.flexipageRegionWidth === "MEDIUM"
        ? "8"
        : "6";
    }
}