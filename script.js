// ===============================
// Employee Manager System
// ===============================

// Employee Array
let employees = JSON.parse(localStorage.getItem("employees")) || [];

// Edit Index
let editIndex = -1;

let selectedImage = "";

// Bootstrap Modal
const employeeModal = new bootstrap.Modal(document.getElementById("employeeModal"));

// ===============================
// Initialize Application
// ===============================

window.onload = function() {
	displayEmployees();
	updateDashboard();
};

// ===============================
// Save To Local Storage
// ===============================

function saveToLocalStorage() {
	localStorage.setItem("employees", JSON.stringify(employees));
}


function saveEmployee() {

	// 1. Get values from input fields
	const name = document.getElementById("name").value.trim();
	const email = document.getElementById("email").value.trim();
	const mobile = document.getElementById("mobile").value.trim();
	const department = document.getElementById("department").value;
	const salary = document.getElementById("salary").value;
	const joiningDate = document.getElementById("joiningDate").value;
	const address = document.getElementById("address").value.trim();
	const image = selectedImage;

	// 2. Validate form
	if (!validateEmployeeForm()) {
		return;
	}

	// 3. Create employee object
	const employee = {
		name,
		email,
		mobile,
		department,
		salary,
		joiningDate,
		address,
		image
	};

	// Check Add or Update
	const isNewEmployee = (editIndex === -1);

	if (isNewEmployee) {
		employees.push(employee);
	} else {
		employees[editIndex] = employee;
		editIndex = -1;
	}

	// Save
	saveToLocalStorage();

	// Refresh UI
	displayEmployees();
	updateDashboard();

	// Toast
	if (isNewEmployee) {
		showToast("Employee added successfully!", "success");
	} else {
		showToast("Employee updated successfully!", "primary");
	}

	// Clear form
	clearForm();
	employeeModal.hide();
	selectedImage = "";

	imageInput.value = "";
	imagePreview.src = "";
	imagePreview.style.display = "none";
	imageError.innerText = "";
}



function clearForm() {

	document.getElementById("employeeForm").reset();

	document.getElementById("editIndex").value = "";

	editIndex = -1;

	document.getElementById("modalTitle").innerHTML = "Add Employee";

}


function updateDashboard() {

	document.getElementById("totalEmployee").innerHTML = employees.length;

	let departments = [...new Set(employees.map(emp => emp.department))];

	document.getElementById("totalDepartment").innerHTML = departments.length;

	let totalSalary = 0;

	employees.forEach(emp => {

		totalSalary += Number(emp.salary);

	});

	let average = employees.length ?
		Math.round(totalSalary / employees.length) :
		0;

	document.getElementById("averageSalary").innerHTML = "₹" + average;

}


function displayEmployees(employeeList = employees) {


	let html = "";

	// Empty State
	if (employeeList.length === 0) {
		document.getElementById("employeeTable").innerHTML = `
            <tr>
                <td colspan="9" class="text-center py-5 text-muted">
                    <h5>No employees found 😕</h5>
                    <p class="mb-0">Try changing the search or department filter.</p>
                </td>
            </tr>
        `;
		return;
	}

	employeeList.forEach((emp, index) => {

		const originalIndex = employees.indexOf(emp);

		html += `
    <tr>

        <td>${index + 1}</td>

        <td>
            <img src="${emp.image || 'https://via.placeholder.com/50'}"
            width="50"
            height="50"
            style="border-radius:50%;object-fit:cover;">
        </td>

        <td>${emp.name}</td>
        <td>${emp.email}</td>
        <td>${emp.mobile}</td>
        <td>${emp.department}</td>
        <td>₹${emp.salary}</td>
        <td>${emp.joiningDate}</td>

        <td>

            <button
                class="btn btn-warning btn-sm"
                onclick="editEmployee(${originalIndex})">
                Edit
            </button>

            <button
                class="btn btn-danger btn-sm"
                onclick="deleteEmployee(${originalIndex})">
                Delete
            </button>

        </td>

    </tr>
    `;
	});

	document.getElementById("employeeTable").innerHTML = html;

}

function deleteEmployee(index) {

    if (!confirm("Are you sure you want to delete this employee?")) {
        return;
    }

    employees.splice(index, 1);

    saveToLocalStorage();

    displayEmployees();

    updateDashboard();

    showToast("Employee deleted successfully!", "danger");
}

function editEmployee(index) {

	editIndex = index;

	let emp = employees[index];

	document.getElementById("name").value = emp.name;

	document.getElementById("email").value = emp.email;

	document.getElementById("mobile").value = emp.mobile;

	document.getElementById("department").value = emp.department;

	document.getElementById("salary").value = emp.salary;

	document.getElementById("joiningDate").value = emp.joiningDate;

	document.getElementById("address").value = emp.address;

	selectedImage = emp.image || "";

	imageInput.value = "";

	if (selectedImage) {
		imagePreview.src = selectedImage;
		imagePreview.style.display = "block";
	} else {
		imagePreview.src = "";
		imagePreview.style.display = "none";
	}

	imageError.innerText = "";

	document.getElementById("modalTitle").innerHTML = "Update Employee";

	employeeModal.show();

}

function searchEmployee() {
	const searchValue = document
		.getElementById("searchEmployee")
		.value
		.toLowerCase()
		.trim();

	const filteredEmployees = employees
		.map((employee, index) => ({
			employee,
			index
		}))
		.filter(({
				employee
			}) =>
			employee.name.toLowerCase().includes(searchValue) ||
			employee.email.toLowerCase().includes(searchValue) ||
			employee.mobile.includes(searchValue) ||
			employee.department.toLowerCase().includes(searchValue)
		);

	const table = document.getElementById("employeeTable");

	table.innerHTML = "";

	if (filteredEmployees.length === 0) {
		table.innerHTML = `
            <tr>
                <td colspan="9" class="text-center">
                    No employees found.
                </td>
            </tr>
        `;
		return;
	}

	filteredEmployees.forEach(({
		employee,
		index
	}, rowIndex) => {
		table.innerHTML += `
            <tr>
                <td>${rowIndex + 1}</td>
                <td>
                    <img
                        src="${employee.image || 'https://via.placeholder.com/50'}"
                        width="40"
                        height="40"
                        class="rounded-circle"
                        alt="Employee"
                    >
                </td>
                <td>${employee.name}</td>
                <td>${employee.email}</td>
                <td>${employee.mobile}</td>
                <td>${employee.department}</td>
                <td>₹${Number(employee.salary).toLocaleString("en-IN")}</td>
                <td>${employee.joiningDate}</td>
                <td>
                    <button class="btn btn-sm btn-primary"
                        onclick="editEmployee(${index})">
                        Edit
                    </button>

                    <button class="btn btn-sm btn-danger"
                        onclick="deleteEmployee(${index})">
                        Delete
                    </button>
                </td>
            </tr>
        `;
	});
}


function sortEmployee() {
	employees.sort((a, b) =>
		a.name.localeCompare(b.name)
	);

	saveToLocalStorage();

	displayEmployees();
	updateDashboard();

	document.getElementById("searchEmployee").value = "";
}


function sortEmployeeSalary() {
	employees.sort((a, b) => Number(b.salary) - Number(a.salary));

	displayEmployees();
}

function validateEmployeeForm() {

    let isValid = true;

    // Get Input Fields
    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const mobile = document.getElementById("mobile");
    const department = document.getElementById("department");
    const salary = document.getElementById("salary");
    const joiningDate = document.getElementById("joiningDate");
    const address = document.getElementById("address");

    // Clear Previous Errors
    document.querySelectorAll(".text-danger").forEach(error => {
        error.innerText = "";
    });

    function showError(fieldId, message) {
        const error = document.getElementById(fieldId + "Error");
        if (error) {
            error.innerText = message;
        }
        isValid = false;
    }

    // Name
    if (!name.value.trim()) {
        showError("name", "Name is required.");
    }

    // Email
    if (!email.value.trim()) {
      showError("email", "Email is required.");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
        showError("email", "Enter a valid email.");
    }

    // Mobile
    if (!mobile.value.trim()) {
        showError("mobile", "Mobile number is required.");
    } else if (!/^[6-9]\d{9}$/.test(mobile.value.trim())) {
        showError("mobile", "Enter a valid 10-digit mobile number.");
    }

    // Department
    if (department.value === "") {
        showError("department", "Please select a department.");
    }

    // Salary
    if (salary.value === "" || Number(salary.value) <= 0) {
        showError("salary", "Enter a valid salary.");
    }

    // Joining Date
    if (joiningDate.value === "") {
        showError("joiningDate", "Joining date is required.");
    }

    // Address
    if (!address.value.trim()) {
        showError("address", "Address is required.");
    }

    return isValid;
}


const validationFields = [
	"name",
	"email",
	"mobile",
	"department",
	"salary",
	"joiningDate",
	"address"
];

validationFields.forEach(field => {

	const input = document.getElementById(field);

	if (!input) return;

	input.addEventListener("input", () => {
		validateEmployeeForm();
	});

	input.addEventListener("change", () => {
		validateEmployeeForm();
	});

});

// Employee Image Upload and Preview

const imageInput = document.getElementById("image");
const imagePreview = document.getElementById("imagePreview");
const imageError = document.getElementById("imageError");

imageInput.addEventListener("change", function() {

	const file = imageInput.files[0];

	imageError.innerText = "";

	if (!file) return;

	// Check image type
	const allowedTypes = [
		"image/jpeg",
		"image/png",
		"image/webp"
	];

	if (!allowedTypes.includes(file.type)) {
		imageError.innerText = "Only JPG, PNG and WEBP images are allowed.";
		imageInput.value = "";
		return;
	}

	// Check image size (1 MB)
	if (file.size > 1024 * 1024) {
		imageError.innerText = "Image size must be less than 1 MB.";
		imageInput.value = "";
		return;
	}

	const reader = new FileReader();

	reader.onload = function(event) {
		selectedImage = event.target.result;

		imagePreview.src = selectedImage;
		imagePreview.style.display = "block";
	};

	reader.onerror = function() {
		imageError.innerText = "Unable to read image. Please try again.";
		selectedImage = "";
		imagePreview.style.display = "none";
	};

	reader.readAsDataURL(file);

});

function filterDepartment() {

	const department = document.getElementById("departmentFilter").value;

	if (department === "All") {
		displayEmployees();
		return;
	}

	const filteredEmployees = employees.filter(emp =>
		emp.department === department
	);

	displayEmployees(filteredEmployees);
}



function exportPDF() {

	const {
		jsPDF
	} = window.jspdf;
	const doc = new jsPDF();

	// Title
	doc.setFontSize(18);
	doc.text("Employee Management System", 14, 20);

	// Date
	doc.setFontSize(10);
	doc.text("Generated: " + new Date().toLocaleDateString(), 14, 28);

	// Table Data
	const tableData = employees.map((emp, index) => [
		index + 1,
		emp.name,
		emp.email,
		emp.mobile,
		emp.department,
		"₹" + emp.salary,
		emp.joiningDate
	]);

	doc.autoTable({
		startY: 35,
		head: [
			[
				"#",
				"Name",
				"Email",
				"Mobile",
				"Department",
				"Salary",
				"Joining Date"
			]
		],
		body: tableData,
		theme: "grid",
		headStyles: {
			fillColor: [13, 110, 253]
		},
		styles: {
			fontSize: 10,
			cellPadding: 3
		}
	});

	doc.save("Employee_List.pdf");
}

function exportExcel() {

	const excelData = employees.map((emp, index) => ({
		"S.No": index + 1,
		"Name": emp.name,
		"Email": emp.email,
		"Mobile": emp.mobile,
		"Department": emp.department,
		"Salary": emp.salary,
		"Joining Date": emp.joiningDate
	}));

	const worksheet = XLSX.utils.json_to_sheet(excelData);

	const workbook = XLSX.utils.book_new();

	XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");

	XLSX.writeFile(workbook, "Employee_List.xlsx");
}

function showToast(message, type = "success") {
    const toastElement = document.getElementById("liveToast");
    const toastMessage = document.getElementById("toastMessage");

    toastMessage.textContent = message;

    toastElement.className = "toast align-items-center border-0";
    toastElement.classList.add(`text-bg-${type}`);

    const toast = bootstrap.Toast.getOrCreateInstance(toastElement);
    toast.show();
}

console.log("END OF SCRIPT");