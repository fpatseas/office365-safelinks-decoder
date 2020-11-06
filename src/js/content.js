'use strict';

const SafelinksDecoder = {
	
	firefox: typeof self !== 'undefined' && typeof self.port !== 'undefined',
	
	init() {
		SafelinksDecoder.registerEventHandlers();
	},
	
	registerEventHandlers() {
		if (SafelinksDecoder.firefox) {
			self.port.on('history-state-updated', SafelinksDecoder.processLinks);
		} else if (typeof chrome !== 'undefined') {
			chrome.runtime.onMessage.addListener((request) => {
				if (request.type === 'history-state-updated') {
					SafelinksDecoder.processLinks();
				}
			});
		} else if (typeof safari !== 'undefined') {
			safari.self.addEventListener('message', (message) => {
				if (message.name === 'history-state-updated') {
					SafelinksDecoder.processLinks();
				}
			}, false);
		}

		window.onload = (event) => SafelinksDecoder.processLinks();
	},

	processLinks() {
		let safeLinks = document.querySelectorAll('a[href*="safelinks.protection.outlook.com"]:not([safelink-decoded])');
	
		safeLinks.forEach((link, index) => {
			let url = link.getAttribute("href"),
				matches = url.match(/(?<=\?url\=).*(?=\&amp\;data\=)/);
				
			if( matches ) {
				url = decodeURIComponent(matches[0]);
				
				link.textContent = url;
				link.setAttribute("safelink-decoded", "true");
			}
		});
	}
};

SafelinksDecoder.init();
