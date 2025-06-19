import {doctors} from '../data.js'

let selected_doctors = [...doctors];
let edited_doctor_id = null;

const addDoctorsToPage = (array) => {
    const itemsWrapper = document.getElementById('ItemsWrappper');
    const template = document.querySelector('.item-template');

    let child = itemsWrapper.firstChild;
    while (child) {
        const nextSibling = child.nextSibling;
        if (child.nodeType === 1 && child.tagName.toLowerCase() === 'div') {
            itemsWrapper.removeChild(child);
        }
        child = nextSibling;
    }

    array.forEach(doctor => {
        const clone = template.content.cloneNode(true);

        clone.querySelector('.avatar').style.backgroundImage = `url(${doctor.img})`;
        clone.querySelector('.h3').textContent = doctor.name;
        clone.querySelector('.h6').textContent = doctor.description;
        clone.querySelector('.h5').textContent = doctor.last_updated;
        clone.querySelector('h6').textContent = `${doctor.price}$`;

        itemsWrapper.appendChild(clone);
    });

    addRemoveEventListeners();
    addEditEventListeners();
}

function filterDoctors(searchTerm) {
    return selected_doctors.filter(doctor =>
        doctor.name.toLowerCase().trim().includes(searchTerm.toLowerCase().trim()) ||
        doctor.description.toLowerCase().trim().includes(searchTerm.toLowerCase().trim())
    );
}

function calculateTotalPrice() {
    const totalPrice = selected_doctors.reduce((sum, doctor) => sum + doctor.price, 0);
    document.getElementById('total_price').textContent = `${totalPrice.toString()} $`;
}

function sortByCategory(sortBy, doctorsArray) {
    if (sortBy === 'Price') {
        return doctorsArray.slice().sort((a, b) => a.price - b.price);
    } else if (sortBy === 'Name') {
        return doctorsArray.slice().sort((a, b) => a.name.localeCompare(b.name));
    }
    return doctorsArray;
}

function removeDoctor(doctorName) {
    selected_doctors = selected_doctors.filter(doctor => doctor.name !== doctorName);
    updateDoctorsDisplay();
}

function editDoctor(doctorName) {
    document.querySelector('.overlay').classList.toggle('target');

    const doctor = selected_doctors.find(doc => doc.name === doctorName);
    edited_doctor_id = selected_doctors.findIndex(doc => doc.name === doctorName);
    if (doctor) {
        const inputs = document.querySelectorAll('.create-form input');
        const textarea = document.querySelector('.create-form textarea');

        inputs[0].value = doctor.name;
        inputs[1].value = doctor.price;
        textarea.value = doctor.description;
    } else {
        console.error('Doctor not found');
    }
}

function addRemoveEventListeners() {
    document.querySelectorAll('.remove-doctor').forEach(button => {
        button.addEventListener('click', function(event) {
            const doctorName = event.target.closest('.item').querySelector('.h3').textContent;
            removeDoctor(doctorName);
        });
    });
}

function addEditEventListeners() {
    document.querySelectorAll('.edit-doctor').forEach(button => {
        button.addEventListener('click', function(event) {
            const doctorName = event.target.closest('.item').querySelector('.h3').textContent;
            editDoctor(doctorName);
        });
    });
}

function updateDoctorsDisplay() {
    const searchTerm = document.querySelector('.search-menu input').value.trim();
    const selectedValue = document.getElementById('sort').value;

    let filteredDoctors = searchTerm ? filterDoctors(searchTerm) : selected_doctors;
    let doctorsToDisplay = selectedValue !== 'Choose one...' ? sortByCategory(selectedValue, filteredDoctors) : filteredDoctors;

    addDoctorsToPage(doctorsToDisplay);
}

function createDoctor() {
    const inputsData = document.querySelectorAll('.create-form input');
    const textareaData = document.querySelector('.create-form textarea').value;
    const inputValues = Array.from(inputsData).map(input => input.value);
    inputValues[2] = inputsData[2].files[0];

    if (selected_doctors.some(doctor => doctor.name === inputValues[0])) {
        document.querySelector('.error').innerHTML = 'name should be unique';
        return null;
    }

    if (inputValues[2]) {
        inputValues[2] = URL.createObjectURL(inputValues[2]);
        document.querySelector('.error').innerHTML = '';
    }
    else {
        document.querySelector('.error').innerHTML = 'u should add image';
        return null;
    }




     return {
        "name": inputValues[0],
        "description": textareaData,
        "last_updated": "Last updated now",
        "img": inputValues[2],
        "price": Number(inputValues[1])
    }
}

// Event listeners
document.querySelector('.search-menu form').addEventListener('submit', function(event) {
    event.preventDefault();
    updateDoctorsDisplay();
});

document.querySelector('.clear').addEventListener('click', function(event) {
    event.preventDefault();
    document.querySelector('.search-menu input').value = '';
    selected_doctors = doctors;
    updateDoctorsDisplay();
});

document.getElementById('sort').addEventListener('change', function(event) {
    updateDoctorsDisplay();
});

document.querySelector('.item-count-button').addEventListener('click', function(event) {
    event.preventDefault();
    calculateTotalPrice();
});

document.querySelector('.create-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const newDoctor = createDoctor();

    if (newDoctor === null) {
        return;
    }

    if (edited_doctor_id === null) {
        selected_doctors = [newDoctor, ...selected_doctors];
    }
    else {
        newDoctor.img = selected_doctors[edited_doctor_id].img;
        selected_doctors[edited_doctor_id] = newDoctor;
        edited_doctor_id = null;
    }

    addDoctorsToPage(selected_doctors);
    document.querySelector('.overlay').classList.remove('target');
    updateDoctorsDisplay();

    // Reset the form inputs and textarea
    document.querySelector('.create-form').reset();

});

document.querySelector('.create-button').addEventListener('click', function(event) {
    document.querySelector('.overlay').classList.toggle('target');

});

document.querySelector('.close').addEventListener('click', function(event) {
    document.querySelector('.overlay').classList.remove('target');

});
// Initial load
addDoctorsToPage(selected_doctors);