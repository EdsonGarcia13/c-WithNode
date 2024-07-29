document.getElementById('loadEmpleados').addEventListener('click', function() {
	fetchData('/data/empleados');
});

document.getElementById('loadCentros').addEventListener('click', function() {
	fetchData('/data/centros');
});

document.getElementById('loadDirectivos').addEventListener('click', function() {
	fetchData('/data/directivos');
});

function fetchData(endpoint) {
	fetch(endpoint)
		.then(response => response.json())
		.then(data => {
			document.getElementById('data').innerHTML = createTableFromJson(data);
		})
		.catch(error => console.error('Error:', error));
}

function createTableFromJson(jsonData) {
	if (jsonData.length === 0) {
		return "No data available";
	}
	let table = "<table border='1'><tr>";
	Object.keys(jsonData[0]).forEach(key => {
		const formattedKey = key.split('_')
								 .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
								 .join(' ');
		table += `<th>${formattedKey}</th>`;
	});
	table += "</tr>";
	jsonData.forEach(obj => {
		table += "<tr>";
		Object.values(obj).forEach(value => {
			table += `<td>${value}</td>`;
		});
		table += "</tr>";
	});
	table += "</table>";
	return table;
}