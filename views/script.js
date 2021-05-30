const addBtn = document.getElementById("addbtn");
const trashBtn = document.getElementById("trashBtn");
const checkBtn = document.getElementById("checkBtn");
const inputField = document.getElementById("inputfield");
const tasksWrapper = document.getElementById("tasksWrapper");
var hostName =  "http://localhost:3000"
hostName = "http://todo-jwt.herokuapp.com";
var arrTodo = [];

function addTodo(event) {
  event.preventDefault();
  if (inputField.value == "") {
    alert("Do not put a empty task");
    return;
  }
  let entry = {
    key: Date.now(),
    value: inputField.value,
    completed: false,
    hasSubTodo: false,
    subTodo: [],
  };
  arrTodo.push(entry);
  inputField.value = "";
  paintDom(entry, "parent");
  saveArr();
}

function addSubTodo(event) {
  if (event.target.id === "addSub") {
    let tempKey = event.target.getAttribute("data-entrysub");
    let tempValue = prompt("Add Sub-Task");
    let tempIndex = arrTodo.findIndex((item) => item.key === Number(tempKey));
    if (tempValue != "" && tempValue !== null) {
      let entry = {
        key: Date.now(),
        value: tempValue,
        completed: false,
      };
      if (tempIndex >= 0) {
        arrTodo[tempIndex].subTodo.push(entry);
        arrTodo[tempIndex].hasSubTodo = true;
        arrTodo[tempIndex].completed = false;
        paintDom(arrTodo[tempIndex], "parent");
        paintDom(entry, "child", `${tempKey}`);
        document.getElementById(
          `branchText-${tempKey}`
        ).innerText = `${completedTasks(arrTodo[tempIndex].subTodo)}/${
          arrTodo[tempIndex].subTodo.length
        }`;
      }
    }
    saveArr();
  }
}

function toggleTask(event) {
  if (event.target.id === "checkBtn") {
    let tempKey = event.target.getAttribute("data-entryunchecked");
    let tempH = document.getElementById(`text-${tempKey}`);
    let tempIndex = arrTodo.findIndex((item) => item.key === Number(tempKey));
    if (tempIndex >= 0) {
      arrTodo[tempIndex].completed = !arrTodo[tempIndex].completed;
      if (arrTodo[tempIndex].completed) {
        event.target.setAttribute("src", "checked.svg");
        tempH.classList.toggle("line-through1");
      } else {
        event.target.setAttribute("src", "unchecked.svg");
        tempH.classList.toggle("line-through1");
      }
    }
  }
  saveArr();
}

function toggleSubTask(event) {
  if (event.target.id === "checkBtnSub") {
    let tempKey = event.target.getAttribute("data-entryuncheckedsub");
    let tempH = document.getElementById(`textSub-${tempKey}`);
    let tempParentKey = event.target.getAttribute("data-parentkey");
    let tempIndex = arrTodo.findIndex(
      (item) => item.key === Number(tempParentKey)
    );
    let tempIndexChild = arrTodo[tempIndex].subTodo.findIndex(
      (item) => item.key === Number(tempKey)
    );
    if (tempIndexChild >= 0) {
      arrTodo[tempIndex].subTodo[tempIndexChild].completed =
        !arrTodo[tempIndex].subTodo[tempIndexChild].completed;
      if (arrTodo[tempIndex].subTodo[tempIndexChild].completed) {
        event.target.setAttribute("src", "checked.svg");
        tempH.classList.toggle("line-through1");
        document.getElementById(
          `branchText-${tempParentKey}`
        ).innerText = `${completedTasks(arrTodo[tempIndex].subTodo)}/${
          arrTodo[tempIndex].subTodo.length
        }`;
        if (
          completedTasks(arrTodo[tempIndex].subTodo) ===
          arrTodo[tempIndex].subTodo.length
        ) {
          arrTodo[tempIndex].completed = true;
          paintDom(arrTodo[tempIndex], "parent");
        }
      } else {
        event.target.setAttribute("src", "unchecked.svg");
        tempH.classList.toggle("line-through1");
        document.getElementById(
          `branchText-${tempParentKey}`
        ).innerText = `${completedTasks(arrTodo[tempIndex].subTodo)}/${
          arrTodo[tempIndex].subTodo.length
        }`;
        if (arrTodo[tempIndex].completed) {
          arrTodo[tempIndex].completed = false;
          paintDom(arrTodo[tempIndex], "parent");
        }
      }
    }
  }
  saveArr();
}

function deleteTask(event) {
  if (event.target.id === "trashBtn") {
    let tempKey = event.target.getAttribute("data-entrytrash");
    let tempIndex = arrTodo.findIndex((item) => item.key == tempKey);
    let tempDiv = document.querySelector(`[data-entry="${tempKey}"]`);
    for (let obj of arrTodo[tempIndex].subTodo) {
      deleteSubTask(undefined, obj);
    }
    arrTodo.splice(tempIndex, 1);
    tempDiv.remove();
    saveArr();
  }
  
}

function deleteSubTask(event, obj) {
  if (event !== undefined && event.target.id === "trashBtnSub") {
    let tempKey = event.target.getAttribute("data-entrytrashsub");
    let tempParentKey = event.target.getAttribute("data-parentkey");
    let tempIndex = arrTodo.findIndex(
      (item) => item.key === Number(tempParentKey)
    );
    let tempIndexChild = arrTodo[tempIndex].subTodo.findIndex(
      (item) => item.key === Number(tempKey)
    );
    let tempDiv = event.target.parentElement;
    arrTodo[tempIndex].subTodo.splice(tempIndexChild, 1);
    tempDiv.remove();
    document.getElementById(
      `branchText-${tempParentKey}`
    ).innerText = `${completedTasks(arrTodo[tempIndex].subTodo)}/${
      arrTodo[tempIndex].subTodo.length
    }`;
    if (arrTodo[tempIndex].subTodo.length === 0) {
      arrTodo[tempIndex].hasSubTodo = false;
      paintDom(arrTodo[tempIndex], "parent");
    }
  } else if (obj !== undefined) {
    document.querySelector(`[data-entrySub="${obj.key}"]`).remove();
  }
  saveArr();
}

 fetch(`${hostName}/api/todo/retrieve`)
  .then((response) => response.json())
  .then((json) => {
    document.getElementById("nameUser").innerText= json.name;
    if(json.arrTodo == null) {
    arrTodo = [];
  } else {
    arrTodo = json.arrTodo;
  }
  if (arrTodo !== "") {
    for (let obj of arrTodo) {
      paintDom(obj, "parent");
      if (obj.subTodo !== null) {
        for (let subObj of obj.subTodo) {
          paintDom(subObj, "child", obj.key);
        }
      }
    }
  }
});


var ctx = document.getElementById("myChart").getContext("2d");
var myChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: ["May 03", "May 04", "May 05", "May 06", "May 07"],
    datasets: [
      {
        data: [49169.14, 48877.78, 49569.12, 48881.63, 50093.86],
        borderColor: "#2D74FF",
        backgroundColor: "white",
        fill: true,
        backgroundColor: "rgba(244, 144, 128, 0.8)",
      },
    ],
  },
  options: {
    scales: {
      yAxes: [
        {
          ticks: {
            display: false,
          },
          gridLines: {
            display: false,
          },
        },
      ],
      xAxes: [
        {
          ticks: {
            display: false,
          },
          gridLines: {
            display: false,
          },
        },
      ],
    },
    layout: {
      padding: 0,
    },
    legend: {
      display: false,
    },
    plugins: {
      title: {
        display: true,
        text: "Sensex BSE",
      },
    },
  },
});



function paintDom(obj, role, parentkey) {
  if (role === "parent") {
    //checks if it is a parent entry
    if (obj.hasSubTodo) {
      //checks if it has subTodos
      if (document.querySelector(`[data-entry="${obj.key}"]`)) {
        //checks if a normal entry is getting conv to parent in the current session
        if (obj.completed) {
          // current session completed parent task creation from normal task
          document.querySelector(
            `[data-entry="${obj.key}"]`
          ).innerHTML = `<div class="flex mb-3 items-center">
                        <img src="checked.svg" alt="checked" class="cursor-pointer w-6 h-6 mr-2" data-entryUnchecked="${
                          obj.key
                        }" id="checkBtn">
                        <input id="text-${obj.key}" data-text="${
            obj.key
          }" class="h-7 p-2 text-white line-through1 text-opacity-75 text-xl w-full bg-transparent cursor-pointer focus:outline-none" value="${
            obj.value
          }">
                        <svg xmlns="http://www.w3.org/2000/svg" class="cursor-pointer inline-block h-9 w-9 text-pink-400 hover:text-white" viewBox="0 0 20 20" fill="currentColor" id="addSub" data-entrySub="${
                          obj.key
                        }">
                            <path class="pointer-events-none" fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" />
                        </svg>
                        <img src="trash.svg" alt="trash" class="cursor-pointer w-6 h-6 mr-2 ml-2 text-pink-400 transform hover:-rotate-12" id="trashBtn" data-entryTrash="${
                          obj.key
                        }">
                    </div>
                    <div class="flex">
                        <img src="branch.svg" alt="" class="px-2">
                        <h2 class="text-white text-opacity-50 text-l" id="branchText-${
                          obj.key
                        }">${completedTasks(obj.subTodo)}/${
            obj.subTodo.length
          }</h2>
                    </div>`;
          document
            .querySelector(`[data-entry="${obj.key}"]`)
            .classList.add("flex-col");
          document
            .querySelector(`[data-entry="${obj.key}"]`)
            .classList.remove("items-center");
        } else {
          // current session uncompleted parent task creation from normal task
          document.querySelector(
            `[data-entry="${obj.key}"]`
          ).innerHTML = `<div class="flex mb-3 items-center">
                        <img src="unchecked.svg" alt="unchecked" class="cursor-pointer w-6 h-6 mr-2" data-entryUnchecked="${
                          obj.key
                        }" id="checkBtn">
                        <input id="text-${obj.key}" data-text="${
            obj.key
          }" class="h-7 p-2 text-white text-opacity-75 text-xl w-full bg-transparent cursor-pointer focus:outline-none" value="${
            obj.value
          }">
                        <svg xmlns="http://www.w3.org/2000/svg" class="cursor-pointer inline-block h-9 w-9 text-pink-400 hover:text-white" viewBox="0 0 20 20" fill="currentColor" id="addSub" data-entrySub="${
                          obj.key
                        }">
                            <path class="pointer-events-none" fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" />
                        </svg>
                        <img src="trash.svg" alt="trash" class="cursor-pointer w-6 h-6 mr-2 ml-2 text-pink-400 transform hover:-rotate-12" id="trashBtn" data-entryTrash="${
                          obj.key
                        }">
                    </div>
                    <div class="flex">
                        <img src="branch.svg" alt="" class="px-2">
                        <h2 class="text-white text-opacity-50 text-l" id="branchText-${
                          obj.key
                        }">${completedTasks(obj.subTodo)}/${
            obj.subTodo.length
          }</h2>
                    </div>`;
          document
            .querySelector(`[data-entry="${obj.key}"]`)
            .classList.add("flex-col");
          document
            .querySelector(`[data-entry="${obj.key}"]`)
            .classList.remove("items-center");
        }
      } else {
        // parent element being created from local storage
        if (obj.completed) {
          // new session completed parent task creation from local storage
          document.getElementById("taskWrapper-Body").insertAdjacentHTML(
            "beforeend",
            `<div class="flex flex-col w-full rounded-2xl bg-primary-450 h-auto bg-opacity-50 p-3 mb-4 justify-between" id="entry" data-entry="${
              obj.key
            }">  
                <div class="flex mb-3 items-center">
                        <img src="checked.svg" alt="checked" class="cursor-pointer w-6 h-6 mr-2" data-entryUnchecked="${
                          obj.key
                        }" id="checkBtn">
                        <input id="text-${obj.key}" data-text="${
              obj.key
            }" class="h-7 p-2 text-white line-through1 text-opacity-75 text-xl w-full bg-transparent cursor-pointer focus:outline-none" value="${
              obj.value
            }">
                        <svg xmlns="http://www.w3.org/2000/svg" class="cursor-pointer inline-block h-9 w-9 text-pink-400 hover:text-white" viewBox="0 0 20 20" fill="currentColor" id="addSub" data-entrySub="${
                          obj.key
                        }">
                            <path class="pointer-events-none" fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" />
                        </svg>
                        <img src="trash.svg" alt="trash" class="cursor-pointer w-6 h-6 mr-2 ml-2 text-pink-400 transform hover:-rotate-12" id="trashBtn" data-entryTrash="${
                          obj.key
                        }">
                    </div>
                    <div class="flex">
                        <img src="branch.svg" alt="" class="px-2">
                        <h2 class="text-white text-opacity-50 text-l" id="branchText-${
                          obj.key
                        }">${completedTasks(obj.subTodo)}/${
              obj.subTodo.length
            }</h2>
                    </div>
                    </div>`
          );
        } else {
          // new session uncompleted parent task creation from local storage
          document.getElementById("taskWrapper-Body").insertAdjacentHTML(
            "beforeend",
            `<div class="flex flex-col w-full rounded-2xl bg-primary-450 h-auto bg-opacity-50 p-3 mb-4 justify-between" id="entry" data-entry="${
              obj.key
            }">  
                    <div class="flex mb-3 items-center">
                            <img src="unchecked.svg" alt="unchecked" class="cursor-pointer w-6 h-6 mr-2" data-entryUnchecked="${
                              obj.key
                            }" id="checkBtn">
                            <input id="text-${obj.key}" data-text="${
              obj.key
            }" class="h-7 p-2 text-white text-opacity-75 text-xl w-full bg-transparent cursor-pointer focus:outline-none" value="${
              obj.value
            }">
                            <svg xmlns="http://www.w3.org/2000/svg" class="cursor-pointer inline-block h-9 w-9 text-pink-400 hover:text-white" viewBox="0 0 20 20" fill="currentColor" id="addSub" data-entrySub="${
                              obj.key
                            }">
                                <path class="pointer-events-none" fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" />
                            </svg>
                            <img src="trash.svg" alt="trash" class="cursor-pointer w-6 h-6 mr-2 ml-2 text-pink-400 transform hover:-rotate-12" id="trashBtn" data-entryTrash="${
                              obj.key
                            }">
                        </div>
                        <div class="flex">
                            <img src="branch.svg" alt="" class="px-2">
                            <h2 class="text-white text-opacity-50 text-l" id="branchText-${
                              obj.key
                            }">${completedTasks(obj.subTodo)}/${
              obj.subTodo.length
            }</h2>
                        </div>
                        </div>`
          );
        }
      }
    } else {
      // normal parent element with no subTodo
      if (document.querySelector(`[data-entry="${obj.key}"]`) === null) {
        // checks if a subtodo parent is being converted to normal parent
        if (obj.completed) {
          // normal completed parent being added from localStorage(new session)
          document.getElementById(
            "taskWrapper-Body"
          ).innerHTML += `<div class="flex w-full rounded-2xl bg-primary-450 h-auto bg-opacity-50 p-3 mb-4 justify-between items-center" id="entry" data-entry="${obj.key}">
                                <img src="checked.svg" alt="checked" class="cursor-pointer w-6 h-6 mr-2" data-entryUnchecked=${obj.key} id="checkBtn">
                                <input id="text-${obj.key}" data-text="${obj.key}" class="h-7 p-2 text-white line-through1 text-opacity-75 text-xl w-full bg-transparent cursor-pointer focus:outline-none" value="${obj.value}">
                                <svg xmlns="http://www.w3.org/2000/svg" class="cursor-pointer inline-block h-9 w-9 text-pink-400 hover:text-white" viewBox="0 0 20 20" fill="currentColor" id="addSub" data-entrySub="${obj.key}">
                                    <path class="pointer-events-none" fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" />
                                </svg>
                                <img src="trash.svg" alt="trash" class="cursor-pointer w-6 h-6 mr-2 ml-2 text-pink-400 transform hover:-rotate-12" id="trashBtn" data-entryTrash=${obj.key}>
                            </div>`;
        } else {
          // normal parent being added from localStorage(new session) or added fresh
          document.getElementById(
            "taskWrapper-Body"
          ).innerHTML += `<div class="flex w-full rounded-2xl bg-primary-450 h-auto bg-opacity-50 p-3 mb-4 justify-between items-center" id="entry" data-entry="${obj.key}">
                                    <img src="unchecked.svg" alt="unchecked" class="cursor-pointer w-6 h-6 mr-2" data-entryUnchecked="${obj.key}" id="checkBtn">
                                    <input readonly id="text-${obj.key}" data-text="${obj.key}" class="h-7 p-2 text-white text-opacity-75 text-xl w-full bg-transparent cursor-pointer focus:outline-none" value="${obj.value}">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="cursor-pointer inline-block h-9 w-9 text-pink-400 hover:text-white" viewBox="0 0 20 20" fill="currentColor" id="addSub" data-entrySub="${obj.key}">
                                        <path class="pointer-events-none" fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" />
                                    </svg>
                                    <img src="trash.svg" alt="trash" class="inline-block cursor-pointer w-6 h-6 mr-2 ml-2 text-pink-400 transform hover:-rotate-12" id="trashBtn" data-entryTrash="${obj.key}">
                                </div>`;
        }
      } else {
        // subtodo parent being converted back to normal element
        if (obj.completed) {
          //subtodo parent being converted back to normal completed element
          document.querySelector(
            `[data-entry="${obj.key}"]`
          ).innerHTML = `<img src="checked.svg" alt="checked" class="cursor-pointer w-6 h-6 mr-2" data-entryUnchecked="${obj.key}" id="checkBtn">
                    <input id="text-${obj.key}" data-text="${obj.key}" class="h-7 p-2 text-white line-through1 text-opacity-75 text-xl w-full bg-transparent cursor-pointer focus:outline-none" value="${obj.value}">
                    <svg xmlns="http://www.w3.org/2000/svg" class="cursor-pointer inline-block h-9 w-9 text-pink-400 hover:text-white" viewBox="0 0 20 20" fill="currentColor" id="addSub" data-entrySub="${obj.key}">
                        <path class="pointer-events-none" fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" />
                    </svg>
                    <img src="trash.svg" alt="trash" class="cursor-pointer w-6 h-6 mr-2 ml-2 text-pink-400 transform hover:-rotate-12" id="trashBtn" data-entryTrash="${obj.key}">`;
          document
            .querySelector(`[data-entry="${obj.key}"]`)
            .classList.remove("flex-col");
          document
            .querySelector(`[data-entry="${obj.key}"]`)
            .classList.add("items-center");
        } else {
          //subtodo parent being converted back to normal element
          document.querySelector(
            `[data-entry="${obj.key}"]`
          ).innerHTML = `<img src="unchecked.svg" alt="unchecked" class="cursor-pointer w-6 h-6 mr-2" data-entryUnchecked="${obj.key}" id="checkBtn">
                        <input id="text-${obj.key}" data-text="${obj.key}" class="h-7 p-2 text-white text-opacity-75 text-xl w-full bg-transparent cursor-pointer focus:outline-none" value="${obj.value}">
                        <svg xmlns="http://www.w3.org/2000/svg" class="cursor-pointer inline-block h-9 w-9 text-pink-400 hover:text-white" viewBox="0 0 20 20" fill="currentColor" id="addSub" data-entrySub="${obj.key}">
                            <path class="pointer-events-none" fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" />
                        </svg>
                        <img src="trash.svg" alt="trash" class="cursor-pointer w-6 h-6 mr-2 ml-2 text-pink-400 transform hover:-rotate-12" id="trashBtn" data-entryTrash="${obj.key}">`;
          document
            .querySelector(`[data-entry="${obj.key}"]`)
            .classList.remove("flex-col");
          document
            .querySelector(`[data-entry="${obj.key}"]`)
            .classList.add("items-center");
        }
      }
    }
  } else {
    //making children(new as well as current session)
    if (obj.completed) {
      //making completed children on page( general use in new session)
      document.querySelector(`[data-entry="${parentkey}"]`).insertAdjacentHTML(
        "afterend",
        `<div class="flex w-11/12 rounded-2xl bg-primary-450 h-auto bg-opacity-50 p-3 mb-4 justify-between items-center" data-entrySub="${obj.key}" id="entrySub">
                <img src="checked.svg" alt="checked" class="cursor-pointer w-6 h-6 mr-2" data-entryUncheckedSub="${obj.key}" id="checkBtnSub" data-parentkey="${parentkey}">
                <input id="textSub-${obj.key}" data-textSub="${obj.key}" data-parentkey="${parentkey}" class="h-7 line-through1 p-2 text-white text-opacity-75 text-xl w-full bg-transparent cursor-pointer focus:outline-none" value="${obj.value}">
                <img src="trash.svg" alt="trash" data-parentkey="${parentkey}" class="cursor-pointer w-6 h-6 mr-2 ml-2 text-pink-400 transform hover:-rotate-12" id="trashBtnSub" data-entryTrashSub="${obj.key}">
            </div>`
      );
    } else {
      // making children
      document.querySelector(`[data-entry="${parentkey}"]`).insertAdjacentHTML(
        "afterend",
        `<div class="flex w-11/12 rounded-2xl bg-primary-450 h-auto bg-opacity-50 p-3 mb-4 justify-between items-center" data-entrySub="${obj.key}" id="entrySub">
                <img src="unchecked.svg" alt="unchecked" class="cursor-pointer w-6 h-6 mr-2" data-entryUncheckedSub="${obj.key}" id="checkBtnSub" data-parentkey="${parentkey}">
                <input id="textSub-${obj.key}" data-textSub="${obj.key}" data-parentkey="${parentkey}" class="h-7 p-2 text-white text-opacity-75 text-xl w-full bg-transparent cursor-pointer focus:outline-none" value="${obj.value}">
                <img src="trash.svg" alt="trash" data-parentkey="${parentkey}" class="cursor-pointer w-6 h-6 mr-2 ml-2 text-pink-400 transform hover:-rotate-12" id="trashBtnSub" data-entryTrashSub="${obj.key}">
            </div>`
      );
    }
  }
}

function editTaskStart(event) {
  if (event.target.id.includes("text")) {
    if (event.target.id.includes("textSub")) {
      let tempKey = event.target.getAttribute("data-textsub");
      event.target.removeAttribute("readonly");
      event.target.classList.remove("text-opacity-75");
      event.target.classList.add("text-opacity-50");
      document
        .querySelector(`[data-entrysub="${tempKey}"]`)
        .classList.add("border-pink-100", "border-opacity-10", "border-2");
    } else {
      let tempKey = event.target.getAttribute("data-text");
      event.target.removeAttribute("readonly");
      event.target.classList.remove("text-opacity-75");
      event.target.classList.add("text-opacity-50");
      document
        .querySelector(`[data-entry="${tempKey}"]`)
        .classList.add("border-pink-100", "border-opacity-10", "border-2");
    }
    saveArr();
  }
}

function editTaskEnd(event) {
  if (event.code == "Enter") {
    if (event.target.id.includes("textSub")) {
      let tempKey = event.target.getAttribute("data-textsub");
      let tempParentKey = event.target.getAttribute("data-parentkey");
      let tempIndex = arrTodo.findIndex(
        (item) => item.key === Number(tempParentKey)
      );
      let tempIndexChild = arrTodo[tempIndex].subTodo.findIndex(
        (item) => item.key === Number(tempKey)
      );

      arrTodo[tempIndex].subTodo[tempIndexChild].value = event.target.value;
      localStorage.setItem("Todo", JSON.stringify(arrTodo));
      document
        .querySelector(`[data-entrysub="${tempKey}"]`)
        .classList.remove("border-2", "border-opacity-10", "border-pink-100");
      event.target.classList.remove("text-opacity-50");
      event.target.classList.add("text-opacity-75");
      event.target.setAttribute("readonly", true);
    } else if (event.target.id.includes("text")) {
      let tempKey = event.target.getAttribute("data-text");
      let tempIndex = arrTodo.findIndex((item) => item.key == tempKey);
      arrTodo[tempIndex].value = event.target.value;
      localStorage.setItem("Todo", JSON.stringify(arrTodo));
      document
        .querySelector(`[data-entry="${tempKey}"]`)
        .classList.remove("border-2", "border-opacity-10", "border-pink-100");
      event.target.classList.remove("text-opacity-50");
      event.target.classList.add("text-opacity-75");
      event.target.setAttribute("readonly", true);
    }
    saveArr();
  }
}

function completedTasks(array) {
  let i = 0;
  for (let obj of array) {
    if (obj.completed) {
      i++;
    }
  }
  return i;
}

function saveArr() {
  fetch(`${hostName}/api/todo/save`, {
    method: "POST",
    body: JSON.stringify(arrTodo),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.json())
    .then((json) => console.log(json));
}

addBtn.addEventListener("click", addTodo);
tasksWrapper.addEventListener("click", toggleTask);
tasksWrapper.addEventListener("click", toggleSubTask);
tasksWrapper.addEventListener("click", deleteTask);
tasksWrapper.addEventListener("click", deleteSubTask);
tasksWrapper.addEventListener("click", editTaskStart);
tasksWrapper.addEventListener("click", addSubTodo);
tasksWrapper.addEventListener("keyup", editTaskEnd);
