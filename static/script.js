const themeToggle = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;

themeToggle.addEventListener('click', () => {
    if (htmlElement.classList.contains('dark')) {
        htmlElement.classList.remove('dark');
        localStorage.setItem('theme', 'light'); // Save user preference
    } else {
        htmlElement.classList.add('dark');
        localStorage.setItem('theme', 'dark'); // Save user preference
    }
});


const options = [
    'Linux', 'Penetration Testing', 'Firewalls', 'Incident Response', 'Unity', 
    'C#', 'Game Design', 'Wireframing', 'Figma', 'Prototyping', 'User Research', 
    'Java', 'Python', 'C++', 'Agile', 'Problem Solving', 'Networking', 'AWS', 
    'Azure', 'Docker', 'Data Modeling', 'SQL', 'HTML', 'React', 'JavaScript', 
    'Node.js', 'CSS', 'Kubernetes', 'CI/CD', 'Deep Learning', 'Machine Learning', 
    'Oracle', 'Cryptography', 'TensorFlow', 'NLP', 'Terraform', 'Cloud Security', 
    '3D Modeling', 'Statistics', 'Adobe XD', 'Backup Strategies', 'NoSQL', 
    'PyTorch', 'R'
];

// Get the UL element
const optionList = document.getElementById('optionList');

// Populate the list dynamically
options.forEach(option => {
    const li = document.createElement('li');

    const label = document.createElement('label');
    label.className = 'flex items-center px-4 py-2 cursor-pointer hover-item';

    // Create checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = option;
    checkbox.className = 'mr-2 checkbox';

    // Add text node
    const text = document.createTextNode(option);

    label.appendChild(checkbox);
    label.appendChild(text);
    li.appendChild(label);

    // Append list item to the UL
    optionList.appendChild(li);
});

const dropdownButton = document.getElementById("dropdownButton");
const dropdown = document.getElementById("dropdown");
const checkboxes = document.querySelectorAll(".checkbox");
const selectedOptionsDiv = document.getElementById("selectedOptions");

// Toggle dropdown
dropdownButton.addEventListener("click", () => {
    dropdown.classList.toggle("hidden");

    const career = document.getElementById("career");
    career.classList.add("hidden");
});

// Close dropdown when clicking outside
document.addEventListener("click", (event) => {
    if (!dropdownButton.contains(event.target) && !dropdown.contains(event.target)) {
    dropdown.classList.add("hidden");
    }
});

// Handle checkbox selection
checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
    const value = checkbox.value;

    // If checked, add the tag
    if (checkbox.checked) {
        const tag = document.createElement("div");
        tag.className = "flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full shadow-sm";
        tag.innerHTML = `${value} <button class="ml-2 text-red-500 hover:text-red-700" onclick="removeTag(this, '${value}')">&times;</button>`;
        tag.dataset.value = value;
        selectedOptionsDiv.appendChild(tag);
    } else {
        // If unchecked, remove the tag
        removeTagByValue(value);
    }
    });
});

// Function to remove tag
function removeTag(button, value) {
    const tag = button.parentNode;
    tag.remove();

    // Uncheck the checkbox
    document.querySelector(`input[value="${value}"]`).checked = false;
}

// Function to remove tag by value
function removeTagByValue(value) {
    const tag = Array.from(selectedOptionsDiv.children).find((child) => child.dataset.value === value);
    if (tag) tag.remove();
}

// Function to get the names of selected options
function getSelectedOptions() {
    const selectedCheckboxes = document.querySelectorAll(".checkbox:checked");
    const selectedValues = Array.from(selectedCheckboxes).map((checkbox) => checkbox.value);
    return selectedValues;
}

function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.remove("hidden");

    setTimeout(() => {
        toast.classList.add("hidden");
    }, 3000); // Toast disappears after 3 seconds
}

function showCareer(career_name){
    const career = document.getElementById("career");
    const careerHeading = document.getElementById("recommendedCareer");

    careerHeading.textContent = career_name;
    career.classList.remove("hidden");
}

function generating(tag){
    const generateButton = document.querySelector("button[type='submit']");
    const loadingIcon = document.getElementById("loadingIcon");

    if (tag === "on"){
        generateButton.querySelector("span").textContent = "Generating";
        loadingIcon.classList.remove("hidden");
    }
    else{
        generateButton.querySelector("span").textContent = "Generate!";
        loadingIcon.classList.add("hidden");
    }
}

document.querySelector("button[type='submit']").addEventListener("click", async (event) => {

    const selectedOptions = getSelectedOptions();
    if (selectedOptions.length < 2) {
        alert("Please select at least 2 skills.");
    } 
    
    else {
        generating("on");

        try {
            const response = await fetch("/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({"options": selectedOptions}),
            });

            // Handle the response
            if (response.ok) {
                const result = await response.json();
                console.log("Success:", result["career"]);
                showCareer(result["career"])
            } else {
                console.error("Error:", response.statusText);
                showToast(response.statusText);
            }
        } catch (error) {
            console.error("Network Error:", error);
            showToast("Network Error");
        }
        
        generating("off");
    }
});