// get time 

var now = new Date();
var getDay = now.getDate();
var getMonth = now.getMonth();
var getYear = now.getFullYear();
var year = document.getElementById('year');
var month = document.getElementById('month');
var date = document.getElementById('date');
let selectedMonth = getMonth + 1;
let select = document.querySelector('[name="month"]');


select.onchange = event => { 
    selectedMonth = month.value;
    setDay();
}


function setYear(){
    for( let i = 0; i < 10; i++){
        var thisYear = getYear++;
        var newElement = document.createElement('option');
        var newContent = document.createTextNode(thisYear);
        newElement.appendChild(newContent);
        newElement.setAttribute('value', thisYear);
        year.append(newElement);
    }
    
}

function setMonth(){
    for( let i = 1; i < 13; i++){
        var newElement = document.createElement('option');
        var newContent = document.createTextNode(i);
        newElement.appendChild(newContent);
        newElement.setAttribute('value', i);
        if(i === getMonth){
            newElement.selected = true;
        }
        month.append(newElement);
    }
}



function setDay(){
    var isLeapYear = getyear => (getyear % 4 === 0) && (getyear % 100 !== 0) || (getyear % 400 === 0);
    var datesOfFebruary = isLeapYear ? 29:28;
    var datesOfYear = [31, datesOfFebruary, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var getIndex = selectedMonth - 1;
    for( let i = 1; i <= datesOfYear[getIndex]; i++){
        var newElement = document.createElement('option');
        var newContent = document.createTextNode(i);
        newElement.appendChild(newContent);
        newElement.setAttribute('value', i);
        date.append(newElement);
    }
}


setYear();
setMonth();
setDay();


// register
class TaskList{
    constructor(isTask,isMemo,isLimite){
        this.task = isTask;
        this.memo = isMemo;
        this.limite = isLimite;
    }
}

class UI {
    addTaskList(taskItem) {
        var wrap = document.querySelector('.task-body');
        var row = document.createElement('tr');
        var ui = new UI();
        row.innerHTML=`
            <td class="task-body_task">${taskItem.task}</td>
            <td class="task-body_memo">${taskItem.memo}</td>
            <td class="task-body_limite">${taskItem.limite}</td>
            <td class="task-body_delete">X</td>
        `;
        wrap.append(row);
        ui.successAdd();
    }
    successAdd(){
        var add = document.createElement('p');
        add.classList.add('add');
        var addContent = document.createTextNode('task is added!')
        add.appendChild(addContent);
        var parent = document.getElementById('body');
        var nextElem = document.querySelector('.input-area');
        parent.insertBefore(add,nextElem);
        setTimeout(()=>{
            add.remove();
        },1000)
    }
    clear(){
        document.getElementById('task').value = '';
        document.getElementById('memo').value = '';
        document.getElementById('year').value = '';
        document.getElementById('month').value = '';
        document.getElementById('date').value = '';
    }
    delete(target){
        target.parentElement.remove();
        var rem = document.createElement('p');
        rem.classList.add('rem');
        var addContent = document.createTextNode('task is removed!')
        rem.appendChild(addContent);
        var parent = document.getElementById('body');
        var nextElem = document.querySelector('.input-area');
        parent.insertBefore(rem,nextElem);
        setTimeout(()=>{
            rem.remove();
        },1000)
    }
    error(){
        var error = document.createElement('p');
        error.classList.add('error');
        var addContent = document.createTextNode('please fill out all the information!!')
        error.appendChild(addContent);
        var parent = document.getElementById('body');
        var nextElem = document.querySelector('.input-area');
        parent.insertBefore(error,nextElem);
        setTimeout(()=>{
            error.remove();
        },1000)
    }
}

// localstrage

class store {
    static getStore(){
        var getLocalTask;
        if(localStorage.getItem('tasks') === null){
            getLocalTask  = [];
        } else {
            getLocalTask = JSON.parse(localStorage.getItem('tasks'));
        }
        console.log(getLocalTask)
        return getLocalTask;
    }
    static addStore(taskItem){
        var stackStore = store.getStore();
        stackStore.push(taskItem);
        localStorage.setItem('tasks',JSON.stringify(stackStore));
    }
    static display(){
        var stackStore = store.getStore();
        stackStore.forEach( taskItem => {
            var wrap = document.querySelector('.task-body');
            var row = document.createElement('tr');
            row.innerHTML=`
                <td class="task-body_task">${taskItem.task}</td>
                <td class="task-body_memo">${taskItem.memo}</td>
                <td class="task-body_limite">${taskItem.limite}</td>
                <td class="task-body_delete">X</td>
            `;
            wrap.append(row);
        });
    }
    static remove(e){
        var target = e.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
        var stackStore = store.getStore();
        stackStore.forEach((e,index) =>{
            if (e.task === target){
                stackStore.splice(index,1);
            }
        });
        localStorage.setItem('tasks', JSON.stringify(stackStore));
    }
}


// submit
document.addEventListener('submit', (e)=>{
    var isTask = document.getElementById('task').value;
    var isMemo = document.getElementById('memo').value;
    var isYear = document.getElementById('year').value;
    var isMonth = document.getElementById('month').value;
    var isDate = document.getElementById('date').value;
    var isLimited = `${isYear}/${isMonth}/${isDate}`;
    var taskItem = new TaskList(isTask,isMemo,isLimited);
    var ui = new UI();
    if(taskItem.task === '' || taskItem.memo === '' || isYear === '' || isMonth === '' || isDate === ''){
        ui.error();
    } else {
        ui.addTaskList(taskItem);
        store.addStore(taskItem);
        ui.clear();
    }
    e.preventDefault();
});


// delete
document.addEventListener('click',(e)=>{
    var target = e.target.classList[0];
    var ui = new UI();
    if(target === 'task-body_delete'){
        ui.delete(e.target);
        store.remove(e.target);
    } 
});


document.addEventListener('DOMContentLoaded',()=>{
    store.display();
});

