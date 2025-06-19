
let selected_doctors = [];
let selected_order_by = '';
let selected_search_term = '';
let edited_doctor_id = null;


function fetchDoctors() {
    let url = `http://127.0.0.1:8000/doctors?`;
    if (selected_search_term !== '') {
        url += `&search=${selected_search_term}`;
    }
    if (selected_order_by !== '') {
        url += `&order_by=${selected_order_by}`;
    }

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            selected_doctors = data;
            addDoctorsToPage(selected_doctors)
            // updateDoctorsDisplay();
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}

function fetchAddDoctor(doctor) {
    fetch('http://127.0.0.1:8000/doctors', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(doctor)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(() => {
            fetchDoctors();
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}

function fetchDeleteDoctor(doctorId) {
    fetch(`http://127.0.0.1:8000/doctors/${doctorId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(() => {
            console.log('Doctor deleted');
            fetchDoctors(); // Refresh the list of doctors
            updateDoctorsDisplay();
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}

function fetchUpdateDoctor(doctorId, updatedDoctor) {
    fetch(`http://127.0.0.1:8000/doctors/${doctorId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedDoctor)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            fetchDoctors(); // Refresh the list of doctors
            updateDoctorsDisplay();
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}

function fetchCalculateTotalPrice() {
    const doctorIds = selected_doctors.map(doctor => doctor.doctor_id);
    const url = `http://127.0.0.1:8000/doctors/sum_total?doctor_ids=${doctorIds.join('&doctor_ids=')}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            document.getElementById('total_price').textContent = `${data.total_price} $`;
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}

// Initial load

function timeSince(date) {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    const interval = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (interval > 1) {
        return `updated ${interval} hours ${minutes} minutes ago`;
    } else if (interval === 1) {
        return `updated 1 hour ${minutes} minutes ago`;
    } else {
        return `updated ${minutes} minutes ago`;
    }
}

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

        clone.querySelector('.avatar').style.backgroundImage = `url(${doctor.picture})`;
        clone.querySelector('.h3').textContent = doctor.name;
        clone.querySelector('.h6').textContent = doctor.description;
        clone.querySelector('.h5').textContent = timeSince(doctor.updated_at);
        clone.querySelector('h6').textContent = `${doctor.price}$`;

        itemsWrapper.appendChild(clone);
    });

    addRemoveEventListeners();
    addEditEventListeners();
}

function removeDoctor(doctorName) {
    const doctorToDelete = selected_doctors.find(doctor => doctor.name === doctorName);
    fetchDeleteDoctor(doctorToDelete['doctor_id']);
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
        inputs[2].value = doctor.picture;
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
    selected_search_term = document.querySelector('.search-menu input').value.trim();
    selected_order_by = document.getElementById('sort').value;
    if (selected_order_by === 'Choose one...') {
        selected_order_by = "";
    }
}

function createDoctor() {
    const inputsData = document.querySelectorAll('.create-form input');
    const textareaData = document.querySelector('.create-form textarea').value;
    const inputValues = Array.from(inputsData).map(input => input.value);

    if (inputValues.some(value => value.trim() === '') || textareaData.trim() === '') {
        document.querySelector('.error').innerHTML = 'All fields must be filled out';
        return null;
    }

    if (selected_doctors.some(doctor => doctor.name === inputValues[0]) && edited_doctor_id === null) {
        document.querySelector('.error').innerHTML = 'name should be unique';
        return null;
    }

    document.querySelector('.error').innerHTML = ''

    const currentDate = new Date();
    const isoDate = currentDate.toISOString()

     return {
        "name": inputValues[0],
        "description": textareaData,
        "updated_at": isoDate,
        "picture": inputValues[2],
        "price": Number(inputValues[1])
    }
}

// Event listeners
document.querySelector('.search-menu form').addEventListener('submit', function(event) {
    event.preventDefault();
    updateDoctorsDisplay();
    fetchDoctors();
});

document.querySelector('.clear').addEventListener('click', function(event) {
    event.preventDefault();
    document.querySelector('.search-menu input').value = '';
    selected_search_term = '';
    fetchDoctors();
    updateDoctorsDisplay();
});

document.getElementById('sort').addEventListener('change', function(event) {
    event.preventDefault();
    updateDoctorsDisplay();
    fetchDoctors();
});

document.querySelector('.item-count-button').addEventListener('click', function(event) {
    event.preventDefault();
    fetchCalculateTotalPrice();
});

document.querySelector('.create-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const newDoctor = createDoctor();

    if (newDoctor === null) {
        return;
    }
    if (edited_doctor_id !== null) {
        fetchUpdateDoctor(selected_doctors[edited_doctor_id]['doctor_id'], newDoctor);
        edited_doctor_id = null;
    }
    else {
        fetchAddDoctor(newDoctor);
    }

    document.querySelector('.overlay').classList.remove('target');
    document.querySelector('.create-form').reset();

});

document.querySelector('.create-button').addEventListener('click', function(event) {
    event.preventDefault();
    document.querySelector('.overlay').classList.toggle('target');

});

document.querySelector('.close').addEventListener('click', function(event) {
    event.preventDefault();
    document.querySelector('.overlay').classList.remove('target');

});

// Initial load
fetchDoctors();