
//#endregion Fech en aplicar en el fornt html  ------------------------------------------------------------------
// fetch example for login
console.log(`Fetch server js  ========================================:`);
console.log('Servidor funcionando en http://localhost:3000');
console.log(`========================================================`);

function Login() {
    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: document.getElementById('username').value,
            password: document.getElementById('password').value
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        // Handle successful login
    }
    )
    .catch(error => console.error('Error:', error));
}

// para el formulario de login al dar  click en el boton login
document.getElementById('loginForm').
addEventListener('submit', function(event) {
    event.preventDefault();
    Login();
});



// get  ventas fetch
function fetchVentas() {
    fetch('http://localhost:3000/ventas')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        // Display ventas in the HTML
    }
    )
    .catch(error => console.error('Error:', error));
}


// crear  ventas o factueras
function createVenta() {
    fetch('http://localhost:3000/ventas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            clienteId: document.getElementById('clienteId').value,
            metodoPago: document.getElementById('metodoPago').value,
            detalles: [
                {
                    productoId: document.getElementById('productoId').value,
                    cantidad: document.getElementById('cantidad').value
                }
            ]
        })
    })
    .then(response => response.json())  
    .then(data => {
        console.log(data);
        // Handle successful venta creation
    }
    )   
    .catch(error => console.error('Error:', error));
}


// boton ver ventas

document.getElementById('fetchVentasBtn').
addEventListener('click', function() {
    fetchVentas();
});






//#endregion Fech en aplicar en el fornt html  ------------------------------------------------------------------