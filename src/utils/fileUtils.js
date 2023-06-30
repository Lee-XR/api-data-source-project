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

function getFileExtension(file) {
	return file.name.split(".").pop();
}

function checkFileType(file, type) {
	const extension = getFileExtension(file);
	const fileType = file.type;

	switch(type) {
		case 'json':
			return (extension === 'json' && fileType === 'application/json');

		case 'csv':
			return (extension === 'csv' && fileType === 'text/csv');

		default:
			return false;
	}
}

export { downloadFile, getFileExtension, checkFileType };
