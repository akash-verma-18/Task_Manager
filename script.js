'use strict';
let colorBtn = document.querySelectorAll(".filter_color");
let mainContainer = document.querySelector(".main_container");
let bothElemArr = document.querySelectorAll(".icon-container");

let crossBtn = bothElemArr[1];
let plusButton = bothElemArr[0];
let body = document.body;
let deleteState = false; // to check the status of delete option
let taskArr = [];
let displayTask = [];
let lockState = true;

if (localStorage.getItem("allTask")) { // to get the tasks we created before from localstorage.
    taskArr = JSON.parse(localStorage.getItem("allTask")); // if tasks are already present in localstorage then update the taskArr.
    // UI
    for (let i = 0; i < taskArr.length; i++) {
        let { id, color, task } = taskArr[i];
        createTask(color, task, false, id); // false means task is coming from localstorage
    }
}else if(!localStorage.getItem("allTask")){
    alert("Please add new tasks");
}
for(let i=0; i<colorBtn.length; i++){
    colorBtn[i].addEventListener("click", function(e){
    // classList is giving us class array of .filter-color element and classList[1] is giving us the color.
    let cClr = colorBtn[i].classList[1];
    let taskContainer = document.querySelectorAll(".task_container"); 
    for (let j = 0; j < taskContainer.length; j++) {
        let taskFilter = taskContainer[j].children[0]; // get the  task filter of that taskContainer
        let color = taskFilter.classList[1]; // assign the color of task_filter
        if(cClr == color){
            taskContainer[j].style.display = "block";
        }else{
            taskContainer[j].style.display = "none";
        }
    }
    })
}
plusButton.addEventListener("click", createModal);
crossBtn.addEventListener("click", setDeleteState);

function createModal() {
    // create modal
    let modalContainer = document.querySelector(".modal_container");
    if (modalContainer == null) {
        modalContainer = document.createElement("div");
        modalContainer.setAttribute("class", "modal_container");
        modalContainer.innerHTML = `<div class="input_container">
        <textarea class="modal_input" 
        placeholder="Enter Your text"></textarea>
    </div>
    <div class="modal_filter_container">
        <div class="filter pink"></div>
        <div class="filter blue"></div>
        <div class="filter green"></div>
        <div class="filter black"></div>
    </div>`;
        body.appendChild(modalContainer);
        handleModal(modalContainer);
    }
    let textarea = modalContainer.querySelector(".modal_input");
    textarea.value = "";

    //  event listner 
}
function handleModal(modal_container) {
    let cColor = "black"; // current color
    let modalFilters = document.querySelectorAll(".modal_filter_container .filter");
    // /remove previous attr new attrs
    // modalFilters[3].setAttribute("class", "border");
    // border -> black
    modalFilters[3].classList.add("border");
    for (let i = 0; i < modalFilters.length; i++) {  // for adding borders to each color on clicking
        modalFilters[i].addEventListener("click", function () {
            //    remove broder from elements
            modalFilters.forEach((filter) => { // a loop for removing borders on colors which are not clicked on
                filter.classList.remove("border");
            })
            //  add
            modalFilters[i].classList.add("border")
            // modalFilters[i].classList
            //  color 
            cColor = modalFilters[i].classList[1]; // storing the color of the box we clicked on
            console.log("current color of task", cColor);
        })
    }
    let textArea = document.querySelector(".modal_input");
    textArea.addEventListener("keydown", function (e) {
        if (e.key == "Enter" && textArea.value != "") {
            console.log("Task ", textArea.value, "color ", cColor);
            //  remove modal
            modal_container.remove(); // after pressing enter the modal_container will be removed
            // create taskBox
            createTask(cColor, textArea.value, true); // true means new task is coming from UI

        }
    })
}
function createTask(color, task, flag, id) {
    // color area click-> among colors
    let taskContainer = document.createElement("div");

    let uifn = new ShortUniqueId(); // this function is inbuilt in npm for providing universal unique identifiers(UUID).
    let uid = id || uifn(); // for giving unique IDs after creating new task container or giving old IDs for already created tasks from local storage
    taskContainer.setAttribute("class", "task_container");
    taskContainer.innerHTML = `<div class="task_filter ${color}"></div>
    <div class="task_desc_container">
        <h3 class="uid">#${uid}</h3>
        <div class="task_desc"  >${task}</div>
        <div class="lock"><i class="fas fa-lock"></i></div>
    </div>
</div >`;
    mainContainer.appendChild(taskContainer);
    let taskFilter = taskContainer.querySelector(".task_filter");
    if (flag == true) {
        // console.log(uid);
        let obj = { "task": task, "id": `${uid}`, "color": color };
        taskArr.push(obj);
        /*A common use of JSON is to exchange data to/from a web server.
          When sending data to a web server, the data has to be a string.
          Convert a JavaScript object into a string with JSON.stringify().*/
        let finalArr = JSON.stringify(taskArr);
        localStorage.setItem("allTask", finalArr); // storing the new task in localstorage
    }
    taskFilter.addEventListener("click", changeColor);
    taskContainer.addEventListener("click", deleteTask);
    let taskDesc = taskContainer.querySelector(".task_desc");
    let lockBtn = taskContainer.querySelector(".lock");
    lockBtn.addEventListener("click", function(){
        let taskDesc = taskContainer.querySelector(".task_desc");
        lockState = !lockState;
        if(lockState == true){
            lockBtn.innerHTML = '';
            lockBtn.innerHTML = `<i class="fas fa-lock">`;
            taskDesc.setAttribute("contenteditable", "false");
        }else{
            taskDesc.setAttribute("contenteditable", "true");
            lockBtn.innerHTML = '';
            lockBtn.innerHTML = `<i class="fas fa-lock-open"></i>`;
            taskDesc.addEventListener("keydown", editTask);
        }
    });
    
}
function changeColor(e) {
    // e.target; -> on which event is occurred.
    let taskFilter = e.currentTarget; // on which eventListener is added
    let colors = ["pink", "blue", "green", "black"];
    let cColor = taskFilter.classList[1];
    let idx = colors.indexOf(cColor);
    let newColorIdx = (idx + 1) % 4;
    taskFilter.classList.remove(cColor);
    taskFilter.classList.add(colors[newColorIdx]);
}
function setDeleteState(e) {

    let crossBtn = e.currentTarget;
    // console.log(crossBtn.parent)
    if (deleteState == false) {
        crossBtn.classList.add("active");
    } else {
        crossBtn.classList.remove("active");
    }
    deleteState = !deleteState;
}
function deleteTask(e) {
    let taskContainer = e.currentTarget;
    if (deleteState) {
        // local storage search -> remove
        let uidElem = taskContainer.querySelector(".uid");
        let uid = uidElem.innerText.split("#")[1];
        for (let i = 0; i < taskArr.length; i++) {
            let { id } = taskArr[i];
            if (id == uid) { // 
                taskArr.splice(i, 1);
                let finalTaskArr = JSON.stringify(taskArr);
                localStorage.setItem("allTask", finalTaskArr);
                taskContainer.remove();
                break;
            }
        }
    }
}

function editTask(e) { // whatever we edit in the textarea after creating task, it should also reflect in the localstorage.
    let taskDesc = e.currentTarget;
    let uidElem = taskDesc.parentNode.children[0];
    let uid = uidElem.innerText.split("#")[1];
    for (let i = 0; i < taskArr.length; i++) {
        let { id } = taskArr[i];
        console.log(id, uid);
        if (id == uid) {
            taskArr[i].task = taskDesc.innerText;
            let finalTaskArr = JSON.stringify(taskArr);
            localStorage.setItem("allTask", finalTaskArr);
            break;
        }
    }
}
