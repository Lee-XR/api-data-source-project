function downloadFile(filedata, filename, filetype) {
	let blobData = [];
	let type = '';

	switch(filetype) {
		case 'json':
			type = "application/json";
			blobData = new Blob([JSON.stringify(filedata, null, 2)], {
				type: type
			});
			break;
		case 'csv':
			type = "text/csv";
			blobData = new Blob([filedata], {
				type: type
			})
			break;
		default:
			blobData = [];
			type = "";
	}

	const url = window.URL.createObjectURL(blobData);
	const link = document.createElement('a');
	link.style.display = 'none';
	link.href = url;
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	window.URL.revokeObjectURL(url);
}

export { downloadFile };