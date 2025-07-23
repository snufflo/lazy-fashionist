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
					appendParagraph(box, "tags: ", "bold");

					// add tags for display
					for (const tag of outfits[id]["__tags__"]) {
						appendParagraph(box, tag);
					}
					appendParagraph(box, "outfits: ", "bold");
					continue;
				}
				appendParagraph(box, outfits[id][piece]);
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
			// empty array for avoiding clashes, if done multiple modifications
			outfits["deleted_outfits"] = [];
		});
});

function searchOutfit() {
	const boxes = document.querySelectorAll(".box");
	const search_bar = document.getElementById("searcher");
	const search_attribute = document.getElementById("search_attribute");
	const filter = search_bar.value.toUpperCase();

	if (search_attribute.value == "tags") {
		for (id in outfits) {
			if (id == "deleted_outfits")
				continue;

			const target_box = document.getElementById(id);
			for (tags in outfits[id]) {
				if (tags != "__tags__")
					continue;
				
				for (const tag of outfits[id]["__tags__"]) {
					if (tag.toUpperCase().indexOf(filter) > -1) {
						target_box.style.display = "";
						break;
					}
					target_box.style.display = "none";
				}
			}
		}
	}
	else if (search_attribute.value == "pieces") {
		for (id in outfits) {
			if (id == "deleted_outfits")
				continue;
			for (piece in outfits[id]) {
				if (piece == "__tags__")
					continue;

				const target_box = document.getElementById(id);
				if (piece.toUpperCase().indexOf(filter) > -1) {
					target_box.style.display = "";
					break;
				}
				target_box.style.display = "none";
			}
		}
	}
}

function appendParagraph(box, text, fontStyle="") {
	const p = document.createElement("p");
	p.textContent = text;
	p.style.fontWeight = fontStyle;
	box.appendChild(p);
}
