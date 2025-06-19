import {doctors} from '../data.js'

let selected_doctors = [...doctors];

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
}

function filterDoctors(searchTerm) {
    return doctors.filter(doctor =>
        doctor.name.toLowerCase().trim().includes(searchTerm.toLowerCase().trim()) ||
        doctor.description.toLowerCase().trim().includes(searchTerm.toLowerCase().trim())
    );
}

function calculateTotalPrice() {
    const totalPrice = selected_doctors.reduce((sum, doctor) => sum + doctor.price, 0);
    document.getElementById('total_price').textContent = `${totalPrice.toString()} $`;
}

function sortByCategory(sortBy) {
    if (sortBy === 'Price') {
        return selected_doctors.slice().sort((a, b) => a.price - b.price);
    } else if (sortBy === 'Name') {
        return selected_doctors.slice().sort((a, b) => a.name.localeCompare(b.name));
    }
}

//Event listeners
document.querySelector('.search-menu form').addEventListener('submit', function(event) {
    event.preventDefault();
    let filteredDoctors;
    const searchTerm = event.target.querySelector('input').value;
    if (searchTerm !== '') {
        filteredDoctors = filterDoctors(searchTerm);
        selected_doctors = filteredDoctors;
    }
    else {
        selected_doctors = doctors;
        filteredDoctors = doctors;
    }

    const selected_value = document.getElementById('sort').value
    if (selected_value !== 'Choose one...') {
        addDoctorsToPage(sortByCategory(selected_value))
    }
    else {
        addDoctorsToPage(filteredDoctors);
    }
});

document.querySelector('.clear').addEventListener('click', function(event) {
    event.preventDefault()
    document.querySelector('.search-menu input').value = '';
    selected_doctors = doctors;


    const selected_value = document.getElementById('sort').value
    if (selected_value !== 'Choose one...') {
        addDoctorsToPage(sortByCategory(selected_value))
    }
    else {
        addDoctorsToPage(doctors);
    }

});

document.getElementById('sort').addEventListener('change', function(event) {
    const sortBy = event.target.value;
    let sortedDoctors;

    addDoctorsToPage(sortByCategory(sortBy));
});

document.querySelector('.item-count-button').addEventListener('click', function(event) {
    event.preventDefault();
    calculateTotalPrice();
});

//initial load
addDoctorsToPage(selected_doctors);