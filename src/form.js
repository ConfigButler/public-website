document.getElementById('form').addEventListener('submit', function(e) {
	e.preventDefault();
	const form = e.target;
	const formData = new FormData(form);
	const data = Object.fromEntries(formData);
	const fullForm = document.getElementById('form-full');
    const result = document.getElementById('form-result');
	fullForm.style.display = 'none'
    result.style.display = 'block';
	const okText = result.innerHTML;
    result.innerHTML = 'Please wait...';
	fetch('https://api.web3forms.com/submit', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		},
		body: JSON.stringify(data)
	})
	.then(async (response) => {
		let json = await response.json();
		if (response.status == 200) {
			result.innerHTML = okText;
		} else {
			console.log(response);
			result.innerHTML = json.message;
		}
	})
	.catch(error => {
		console.log(error);
		result.innerHTML = 'Something went wrong!';
	})
});