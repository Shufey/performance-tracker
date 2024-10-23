const form = document.getElementById('form');
const taskName = document.getElementById('taskName');
const todoList = document.getElementById('todoList');
let hoursInput = document.getElementById('hoursInput');
let minutesInput = document.getElementById('minutesInput');
let secondsInput = document.getElementById('secondsInput');

form.addEventListener('submit', function (e) {
    e.preventDefault();
    checkLength(taskName, 3, 30);
});

function checkLength(input, min, max) {
    if (input.value.length < min) {
        showError(`Task name must be atleast ${min} characters`);
    } else if (input.value.length > max) {
        showError(`Task name must be less than ${max} characters`);
    } else {
        showSuccess();
    }
}

function showError(message) {
    const formControl = taskName.parentElement;
    formControl.className = 'form error';
    const small = formControl.querySelector('small');
    small.innerText = message;
    small.style.color = 'red'
}

function showSuccess() {
    const formControl = taskName.parentElement;
    formControl.className = 'form success';
    const small = formControl.querySelector('small');
    small.innerText = '';
    const taskContent = taskName.value.trim();
    addToDoItem(taskContent);
    taskName.value = '';
}

function addToDoItem(taskContent) {
    const li = document.createElement('li');
    li.className = 'todo-item';

    const taskCompleted = document.createElement('input');
    taskCompleted.type = 'checkbox';
    taskCompleted.className = 'taskCompleted';
    let timeUp = false;
    taskCompleted.addEventListener('click', function () {
        if (timeUp) {
            showToast("Can do better !");
            remainingTime.style.color = 'red';
        } else {
            showToast("You did it !");
            remainingTime.style.color = 'green';
        }
        clearInterval(li.stopwatchInterval);
        clearInterval(li.countdownInterval);
        startTask.disabled = true;
        pauseTask.disabled = true;
    });
    li.appendChild(taskCompleted);

    const task = document.createElement('span');
    task.className = 'task';
    task.textContent = taskContent;
    li.appendChild(task);

    const buttons = document.createElement('div');
    buttons.className = 'actionBtns';
    li.appendChild(buttons);

    const deleteTask = document.createElement('button');
    deleteTask.className = 'deleteTask';
    deleteTask.textContent = 'Delete';
    buttons.appendChild(deleteTask);

    deleteTask.addEventListener('click', function () {
        clearInterval(li.stopwatchInterval);
        clearInterval(li.countdownInterval);
        todoList.removeChild(li);
    });

    const startTask = document.createElement('button');
    startTask.className = 'startTask';
    startTask.textContent = 'Start';
    buttons.appendChild(startTask);

    const pauseTask = document.createElement('button');
    pauseTask.className = 'pauseTask';
    pauseTask.textContent = 'Pause';
    buttons.appendChild(pauseTask);

    const workingTime = document.createElement('span');
    workingTime.className = 'workingTime';
    workingTime.innerText = '00:00:00';
    li.appendChild(workingTime);

    const remainingTime = document.createElement('span');
    remainingTime.className = 'remainingTime';
    remainingTime.innerText = '00:00:00';
    li.appendChild(remainingTime);

    let [hours, minutes, seconds] = [0, 0, 0]; // Timer variables for working time
    let countdownTime;  // Hold countdown time in seconds

    // Start stopwatch and countdown for the task
    startTask.addEventListener('click', () => {
        // Clear any existing intervals for the task
        if (li.stopwatchInterval) clearInterval(li.stopwatchInterval);
        if (li.countdownInterval) clearInterval(li.countdownInterval);

        // Start working timer (stopwatch)
        li.stopwatchInterval = setInterval(() => {
            seconds++;
            if (seconds == 60) {
                seconds = 0;
                minutes++;
                if (minutes == 60) {
                    minutes = 0;
                    hours++;
                }
            }
            let h = hours < 10 ? '0' + hours : hours;
            let m = minutes < 10 ? '0' + minutes : minutes;
            let s = seconds < 10 ? '0' + seconds : seconds;
            workingTime.innerText = `${h}:${m}:${s}`;
        }, 1000);

        // Get countdown input values only the first time when the task is started
        if (!li.countdownStarted) {
            let countdownHours = parseInt(hoursInput.value) || 0;
            let countdownMinutes = parseInt(minutesInput.value) || 0;
            let countdownSeconds = parseInt(secondsInput.value) || 0;

            countdownTime = countdownHours * 3600 + countdownMinutes * 60 + countdownSeconds;
            li.countdownStarted = true;

            hoursInput.value = '';
            minutesInput.value = '';
            secondsInput.value = '';
        }

        // Set countdown timer
        function updateCountdown() {
            if (countdownTime <= 0) {
                clearInterval(li.countdownInterval);
                remainingTime.innerText = "00:00:00";
                alert("Time's UP!!!");
                timeUp = true;
                return;
            }
            countdownTime--;
            let h = Math.floor(countdownTime / 3600);
            let m = Math.floor((countdownTime % 3600) / 60);
            let s = Math.floor(countdownTime % 60);
            remainingTime.innerText = `${h < 10 ? '0' + h : h}:${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
        }

        li.countdownInterval = setInterval(updateCountdown, 1000);
    });

    pauseTask.addEventListener('click', () => {
        // Only pause the stopwatch, don't affect the countdown timer
        clearInterval(li.stopwatchInterval);
    });

    todoList.appendChild(li);

    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = `toast bg-purple-950 text-white justify-center w-50 h-10 transition-opacity duration-300 ease-in-out transform p-2 rounded-lg shadow-lg flex items-center space-x-2 opacity-0`;
        
        toast.innerHTML = `
            <div>${message}</div>
        `;
    
        const toastContainer = document.getElementById('toast-container');
        toastContainer.appendChild(toast);
    
        // Show toast by setting opacity to 100%
        setTimeout(() => {
            toast.classList.add('opacity-100');
        }, 100); // Small delay to trigger the transition
    
        // Remove the toast after 3 seconds
        setTimeout(() => {
            toast.classList.remove('opacity-100');
            setTimeout(() => {
                toast.remove();
            }, 300); // Match the fade-out transition duration
        }, 3000);
    }
}
