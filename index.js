(async function () {
const data = await fetch('./data.json')
const response = await data.json();

let employees = response;
let selectedEmployeeId = employees[0].id;
let selectedEmployee = employees[0];

const employeeList = document.querySelector(".employees__names--list");
const employeeInfo = document.querySelector(".employees__single--info");

// Add Employee Logic
const createEmployee = document.querySelector(".createEmployee");
// const addEmployee = document.querySelector(".addEmployee")
const addEmployeeForm = document.querySelector(".addEmployee_create")
const addEmployeeModal = document.querySelector(".addEmployee");


createEmployee.addEventListener("click", () => {
    addEmployeeModal.style.display="flex";
});

addEmployeeModal.addEventListener("click", (e) => {
    if(e.target.className === "addEmployee"){
    addEmployeeModal.style.display="none";
    }
});

const dobInput = document.querySelector('.dobInput');
dobInput.max = `${new Date().getFullYear() - 18}-${new Date().toISOString().slice(5, 10)}`;

addEmployeeForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(addEmployeeForm);
  const values = [...formData.entries()];
  let empData = {};

  values.forEach(([key, value]) => {
    empData[key] = value;
  });

  empData.id = employees.length ? employees[employees.length - 1].id + 1 : 1;

  // Calculate age
  const dob = new Date(empData.dob);
  const ageDiff = Date.now() - dob.getTime();
  empData.age = Math.floor(ageDiff / (1000 * 60 * 60 * 24 * 365.25));

  // Add default image if none
  if (!empData.imageUrl) {
    empData.imageUrl = "https://cdn-icons-png.flaticon.com/512/0/93.png";
  }

  const editId = addEmployeeForm.getAttribute("data-edit-id");

  if (editId) {
    // Edit logic
    empData.id = parseInt(editId);
    employees = employees.map(emp => emp.id === empData.id ? empData : emp);
    selectedEmployeeId = empData.id;
    selectedEmployee = empData;
    addEmployeeForm.removeAttribute("data-edit-id");
  } else {
    // Add logic
    empData.id = employees.length ? employees[employees.length - 1].id + 1 : 1;
    employees.push(empData);
    selectedEmployeeId = empData.id;
    selectedEmployee = empData;
  }

  renderEmployees();
  renderSingleEmployee();
  addEmployeeModal.style.display = "none";
  addEmployeeForm.reset();
});

// Select Employee Logic
employeeList.addEventListener("click",(e)=>{
if (e.target.tagName === "SPAN" && selectedEmployeeId !== e.target.id){
    selectedEmployeeId=e.target.id;
    renderEmployees();

    // render single employees
    renderSingleEmployee();
  }  

  // deleting employee
    if(e.target.tagName === "I"){
        employees=employees.filter(emp=>String(emp.id) !== e.target.parentNode.id);
    
        if(String(selectedEmployeeId) ===e.target.parentNode.id){
                selectedEmployeeId = employees[0]?.id || -1;
                selectedEmployee =employees[0] || {};
                renderSingleEmployee();
    }
    renderEmployees();
}

});


const renderEmployees = () => {
    employeeList.innerHTML= ""
    employees.forEach(emp => {
     const employee = document.createElement("span");
     employee.classList.add("employees__names--item");
     
     if(parseInt(selectedEmployeeId, 10) === emp.id){
        employee.classList.add("selected");
        selectedEmployee=emp;
     }

     employee.setAttribute("id", emp.id);
     employee.innerHTML = `${emp.firstName} ${emp.lastName} <i class="employeeDelete">❌</i>`;

     employeeList.append(employee);

    });
}; // This function will actually render all of the list of all of the employees in this employee list column

// render single employee logic
const renderSingleEmployee = () =>{

    employeeInfo.addEventListener("click", (e) => {
  if (e.target.id === "editEmployeeBtn") {
    addEmployeeModal.style.display = "flex";

    // Populate form with selected employee data
    for (let key in selectedEmployee) {
      const input = addEmployeeForm.elements.namedItem(key);
      if (input) input.value = selectedEmployee[key];
    }

    // Add temporary attribute to form for edit tracking
    addEmployeeForm.setAttribute("data-edit-id", selectedEmployee.id);
  }
});


    if(selectedEmployeeId === -1){
        employeeInfo.innerHTML="";
        return;
    }

employeeInfo.innerHTML = `
  <img src="${selectedEmployee.imageUrl}" />
  <span class="employees__single--heading">
    ${selectedEmployee.firstName} ${selectedEmployee.lastName} (${selectedEmployee.age})
  </span>
  <span>${selectedEmployee.address}</span>
  <span>${selectedEmployee.email}</span>
  <span>Mobile- ${selectedEmployee.contactNumber}</span>
  <span>DOB- ${selectedEmployee.dob}</span>
  <button id="editEmployeeBtn">Edit</button>

`;

};

if (selectedEmployee) renderSingleEmployee();
renderEmployees();      // calling render employees function

})();