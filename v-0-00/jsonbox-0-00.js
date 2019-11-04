// copyright pushMe-pullYou authors. MIT license.
// https://jsonbox.io/

"use strict";

const JB = {};



JB.getJson = function () {

	JB.urlBase = "https://jsonbox.io/"
	JB.boxId = localStorage.getItem("boxId") || ""; // "box_34acd03fcbcfd2fa1051";
	JB.recordId = localStorage.getItem("recordId") || "/5db548fe8d6b3900173a5721";

	if (!JB.boxId) { return; }

	window.addEventListener("focus", () => JB.getJson());

	inpBoxId.value = JB.boxId;
	console.log('boxId', JB.boxId );

	inpRecordId.value = JB.recordId;
	console.log('recordId', JB.recordId);

	JB.url = JB.urlBase + JB.boxId + JB.recordId;
	console.log('JB.url', JB.url);

	const request = new Request( JB.url );
	fetch(request)
	.then(response => response.json())
	.then(data => {
		JB.json = data;
		JB.contentPrevious = divJsonBox.innerHTML = JB.json.content;
		JB.interval = setInterval(JB.putJson, 2000);
		console.log("JB.json", JB.json);
		window.onunload = JB.putJson("");
	});
};


JB.putJson = function(previous = JB.contentPrevious) {
	const content = divJsonBox.innerHTML;

	if (content === previous) {
		return;
	}

	JB.contentPrevious = content;

	fetch( JB.url, {
		method: "PUT",
		headers: { "content-type": "application/json" },
		body: JSON.stringify({ content: content })
	})
	.then(response => response.json())
	.then(data => {
		//console.log('data', data);
		divJsonBoxResponse.innerHTML = `${new Date().toLocaleTimeString()}: ${data.message}`;
	});
	
};



JB.setLocalStorage = function() {

	JB.boxId = inpBoxId.value || "";

	localStorage.setItem("boxId", JB.boxId );

	JB.RecordId = "/" + ( inpRecordId.value || "5db548fe8d6b3900173a5721" );

	localStorage.setItem("recordId", JB.recordId);

	JB.getJson();

}


JB.getJsonAll = function() {
	const request = new Request(JB.url);
	fetch(request)
		.then(response => response.json())
		.then(data => {
			JB.json = data;
			console.log("JB.json", JB.json);
			//divJsonBoxContent.innerHTML = JB.json;
		});
};

JB.deleteJson = function(index = 1) {
	id = JB.json[index]._id;

	fetch(JB.url + "/" + id, {
		method: "DELETE",
		headers: { "content-type": "application/json" }
	})
		.then(response => response.json())
		.then(data => {
			divJsonBoxResponse.innerText += `${JSON.stringify(data)}\n\n`;
		});
};
