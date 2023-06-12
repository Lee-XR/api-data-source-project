// Return current date (yyyy-mm-dd)
function getCurrentDate() {
	let todayDate = new Date();
	const timezoneOffset = todayDate.getTimezoneOffset();
	todayDate = new Date(todayDate.getTime() - timezoneOffset * 60 * 1000);
	return todayDate.toISOString().split('T')[0];
}

export { getCurrentDate };