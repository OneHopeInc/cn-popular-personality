const getConnected = document.getElementById('get-connected');
const formWrapper = document.getElementById('form-wrapper');
const queryString = window.location.search;
const iframeList = document.querySelectorAll('#iframe');
const buttonList = document.getElementsByClassName('button');
const currentUrl = window.location.href;

for (let button of buttonList) {
  button.href = button.href + queryString;
}

const lazyIframes = document.querySelectorAll('#lazy-iframe');

for (let iframe of lazyIframes) {
  iframe.setAttribute(
    'data-src',
    iframe.src = 'https://form.' + window.location.hostname + '/submit/?theme='+color+'&site='+currentUrl
  );
}

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const iframe = entry.target;
      iframe.src = iframe.dataset.src;
      observer.unobserve(iframe);
    }
  });
});

lazyIframes.forEach((iframe) => {
  observer.observe(iframe);
});

/* if (getConnected) {
	getConnected.addEventListener('click', (e) => {
		getConnected.classList.add('hidden');
		const iframe = document.createElement('iframe');

		//iframe.src = 'http://localhost:3000/cn?utm_countrycode=CN';
		formWrapper.appendChild(iframe);
	});
}
 */

// Use site url as form submission origin
window.addEventListener('message', (event) => {
  // Check the origin of the message for security purposes
  const regex = new RegExp(`^https?:\\/\\/(form\\.${window.location.hostname.replace(/\./g, '\\.')})`,'i');
  if (!regex.test(event.origin)) {
    return;
  }

  // Process the received message
  if (event.data === 'requestParentURL') {
    console.log('sending origin to Seeker Portal!');
    // Send the parent URL back to the iframe
    event.source.postMessage(
      { type: 'parentURL', url: window.location.href.split('?')[0] },
      event.origin
    );
  } /*else if (event.data.type && event.data.type === 'setHeight') {
    // Assuming event.data comes in the format: {type: 'setHeight', height: '500px'}
    // Find the iframe that sent the message
    lazyIframes.forEach((iframe) => {
      if (iframe.contentWindow === event.source) {
        // Set the height of the iframe based on the message data
        iframe.style.height = event.data.height + 'px';
      }
    });
  }*/
});