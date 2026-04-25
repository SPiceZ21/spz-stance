const container = document.getElementById('container');
const resourceName = 'spz-stance';

function post(name, data) {
    fetch(`https://${resourceName}/${name}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(data || {})
    }).catch(err => console.error('NUI Error:', err));
}

function playsound(table) {
    const file = table['file'];
    const volume = table['volume'] || 0.3;
    const audio = new Audio("./audio/" + file + ".ogg");
    audio.volume = volume;
    audio.play();
}

window.addEventListener('message', function(event) {
    const data = event.data;
    if (data.type === 'playsound') {
        playsound(data.content);
    }
    if (data.type === 'show') {
        if (data.content.bool) {
            setupSliders(data.content);
            container.style.display = 'block';
        } else {
            container.style.display = 'none';
        }
    }
});

function setupSliders(data) {
    // Height
    const heightInput = document.getElementById('height');
    const heightScore = document.getElementById('ratingOne');
    const hVal = (data.height || 0) * 100;
    heightInput.value = hVal;
    heightScore.innerText = hVal.toFixed(2);
    
    heightInput.oninput = (e) => {
        const val = parseFloat(e.target.value);
        heightScore.innerText = val.toFixed(2);
        post("setvehicleheight", { val: val * 0.01 });
    };

    // Front Offset
    const fOffInput = document.getElementById('wheelof');
    const fOffScore = document.getElementById('ratingTwo');
    const fOffVal = (data.offset[0] || 0) * 100; // Using index 0 for front if applicable
    fOffInput.value = fOffVal;
    fOffScore.innerText = fOffVal.toFixed(2);
    
    fOffInput.oninput = (e) => {
        const val = parseFloat(e.target.value);
        fOffScore.innerText = val.toFixed(2);
        post("setvehiclewheeloffsetfront", { val: val });
    };

    // Rear Offset
    const rOffInput = document.getElementById('wheelor');
    const rOffScore = document.getElementById('ratingThree');
    const rOffVal = (data.offset[2] || 0) * 100; // Using index 2 for rear
    rOffInput.value = rOffVal;
    rOffScore.innerText = rOffVal.toFixed(2);
    
    rOffInput.oninput = (e) => {
        const val = parseFloat(e.target.value);
        rOffScore.innerText = val.toFixed(2);
        post("setvehiclewheeloffsetrear", { val: val });
    };

    // Front Rotation
    const fRotInput = document.getElementById('wheelrf');
    const fRotScore = document.getElementById('ratingFour');
    const fRotVal = (data.rotation[0] || 0) * 100;
    fRotInput.value = fRotVal;
    fRotScore.innerText = fRotVal.toFixed(2);
    
    fRotInput.oninput = (e) => {
        const val = parseFloat(e.target.value);
        fRotScore.innerText = val.toFixed(2);
        post("setvehiclewheelrotationfront", { val: val });
    };

    // Rear Rotation
    const rRotInput = document.getElementById('wheelrr');
    const rRotScore = document.getElementById('ratingFive');
    const rRotVal = (data.rotation[2] || 0) * 100;
    rRotInput.value = rRotVal;
    rRotScore.innerText = rRotVal.toFixed(2);
    
    rRotInput.oninput = (e) => {
        const val = parseFloat(e.target.value);
        rRotScore.innerText = val.toFixed(2);
        post("setvehiclewheelrotationrear", { val: val });
    };
}

document.getElementById('close').addEventListener('click', function(e) {
    e.preventDefault();
    post("wheelsetting", { bool: true });
    post('closecarcontrol', {});
});

// Close on Escape
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        post("wheelsetting", { bool: true });
        post('closecarcontrol', {});
    }
});