function downloadFile(filedata, filename, filetype) {
	let blobData = [];

	switch (filetype) {
		case 'json':
			blobData = new Blob([JSON.stringify(filedata, null, 2)], {
				type: 'application/json',
			});
			break;
		case 'csv':
			blobData = new Blob([filedata], {
				type: 'text/csv',
			});
			break;
		default:
			blobData = [];
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
