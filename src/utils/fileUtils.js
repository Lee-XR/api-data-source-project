function downloadFile(blobData, filename) {
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