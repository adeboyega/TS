import { v4 as uuidv4 } from 'uuid';

// Define the Task type
type Task = {
    id: string,
    title: string,
    completed: boolean,
    createdAt: Date
}

// Select DOM elements using TypeScript type assertions
const list = document.querySelector<HTMLUListElement>('#list'); // Use correct selector '#list' for the list element
const form = document.querySelector('form') as HTMLFormElement | null;
const input = document.querySelector<HTMLInputElement>('input');

const tasks: Task[]= loadTasks()
tasks.forEach(addListItem)

// Check if form and input elements are found in the DOM
if (!form || !input || !list) {
    throw new Error('Form, input, or list element not found in the DOM');
}

// Add event listener for form submission
form.addEventListener("submit", e => {
    e.preventDefault(); // Prevent form submission

    if (!input.value.trim()) { // Check if input value is empty or whitespace only
        return;
    }

    // Create a new task object
    const newTask: Task = {
        id: uuidv4(),
        title: input.value,
        completed: false,
        createdAt: new Date()
    };

    // Add the new task to the list
    addListItem(newTask);
    tasks.push(newTask)
    saveTasks()
    // Reset the input field
    input.value = '';
});

// Function to add a new task item to the list
function addListItem(task: Task) {
    const item = document.createElement("li");
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    const date = document.createElement("p")
    date.innerText= task.createdAt.toLocaleString()
    date.addEventListener("click",()=>deleteTask(task.id))
    checkbox.type = "checkbox";
    
    

    checkbox.addEventListener("change",()=>{
        task.completed = checkbox.checked
        // console.log(tasks)
        saveTasks()
    })
    checkbox.checked = task.completed
    label.append(checkbox, task.title,date);
    item.append(label);
    list?.append(item);
    
}

function saveTasks(){
    localStorage.setItem("TASKS",JSON.stringify(tasks))
}

function loadTasks(): Task[]{
    const taskJSON = localStorage.getItem("TASKS")
    if (taskJSON == null ) return []
   return JSON.parse(taskJSON)
}
function deleteTask(key: string): void {
    localStorage.removeItem(key)
}