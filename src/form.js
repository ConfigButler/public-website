// Contact form — posts to web3forms, swaps to a success state in place.
const form = document.getElementById('contact-form');
if (form) {
	const result = document.getElementById('form-result');
	const button = form.querySelector('button[type="submit"]');
	const defaultLabel = button ? button.innerHTML : '';

	form.addEventListener('submit', async (e) => {
		e.preventDefault();
		const data = Object.fromEntries(new FormData(form));
		if (button) {
			button.disabled = true;
			button.innerHTML = 'Sending…';
		}
		try {
			const response = await fetch('https://api.web3forms.com/submit', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
				body: JSON.stringify(data),
			});
			const json = await response.json();
			if (response.status === 200) {
				form.style.display = 'none';
				if (result) {
					result.style.display = 'flex';
					result.focus?.();
				}
			} else {
				throw new Error(json.message || 'Something went wrong.');
			}
		} catch (err) {
			if (result) {
				result.style.display = 'flex';
				result.querySelector('.msg').textContent =
					'Something went wrong. Email simon@configbutler.ai directly and we\'ll sort it out.';
			}
			form.style.display = 'none';
			console.error(err);
		} finally {
			if (button) {
				button.disabled = false;
				button.innerHTML = defaultLabel;
			}
		}
	});
}
