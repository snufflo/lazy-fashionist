let outfits = {};

// code for class change if selected
document.querySelectorAll(".box").forEach(box => {
	box.addEventListener("click", () => {
		box.classList.toggle("selected");
	});
});

// get outfit data and list them on table
fetch('/get_outfits', {
	method: 'GET'
})
	.then(response => response.json())
	.then(data => {
		outfits = data;
		if ("error" in outfits) {
			console.warn(outfits["error"]);
			return;
		}

		console.log(outfits);
		const gridBody = document.querySelector(".outfit-grid");

		for (id in outfits) {
			const box = document.createElement("div");
			box.className = "box";
			box.id = id;

			for (piece in outfits[id]) {
				if (piece == "__tags__") {
					continue;  // to avoid displaying it as a piece
				}
				const p = document.createElement("p");
				p.textContent = outfits[id][piece];
				box.appendChild(p);
			}

			box.addEventListener("click", () => {
				box.classList.toggle("selected");
			});

			gridBody.appendChild(box);
		}
		outfits["deleted_outfits"] = [];
	});

// delete all selected boxes with class "box selected"
document.getElementById("delete-btn").addEventListener("click", function() {
	const selected_container = document.querySelectorAll(".box.selected");

	// save all deleted boxes into array
	for (let i=0;i<selected_container.length;i++){
		outfit = selected_container[i];
		outfits["deleted_outfits"].push([outfit.id, outfits[outfit.id]]);
		delete outfits[outfit.id];
		console.log(outfits["deleted_outfits"]);
		outfit.remove();
	}
});

// TODO: need to rework this. might have to implement ID system
document.getElementById("save-outfit").addEventListener("click", function() {
	fetch('/set_outfit', {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(outfits, false, 4)
	})
		.then(res => res.json())
		.then(data => {
			console.log("Server response:", data);
		});
});
