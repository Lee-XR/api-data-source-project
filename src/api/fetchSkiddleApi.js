import axios from 'axios';

// Single fetch promise for Skiddle API
async function singleFetchSkiddle(data) {
	const url =
		import.meta.env.MODE === 'production'
			? import.meta.env.VITE_SKIDDLE_SDK_PROD_URL
			: import.meta.env.VITE_SKIDDLE_SDK_DEV_URL;

	return await axios
		.post(url, data)
		.then((response) => {
			const isArray = Array.isArray(response.data.results);
			return {
				totalHits: isArray ? parseInt(response.data.totalcount) : 1,
				records: isArray ? response.data.results : [response.data.results],
			};
		})
		.catch((error) => {
			if (error.response) {
				throw new Error(error.response.data.error);
			} else {
				throw new Error(error.message);
			}
		});
}

// Multiple fetch promise for Skiddle API
async function multiFetchSkiddle(totalCount, firstLimit, recOffset, data) {
	const promises = [];
	const repeats = Math.ceil((totalCount - firstLimit) / 100);

	for (let num = 0; num < repeats; num++) {
		recOffset = firstLimit + num * 100;
		const paramsOffset = {
			...data.params,
			limit: 100,
			offset: recOffset,
		};
		const dataOffset = {
			type: data.type,
			id: data.id,
			params: paramsOffset,
		};

		const promise = new Promise((resolve) => {
			setTimeout(() => {
				resolve(singleFetchSkiddle(dataOffset));
			}, 1500 * num);
		});

		promises.push(promise);
	}

	return Promise.all(promises)
		.then((results) => {
			return results;
		})
		.catch((error) => {
			throw new Error(error.message);
		});
}

// Fetch data from Skiddle PHP SDK API
export async function fetchSkiddle(type, id, params) {
	const firstLimit = params.limit || 20;
	let recOffset = params.offset || 0;
	let totalCount = 0;
	let allRecords = [];

	const firstFetch = singleFetchSkiddle({ type, id, params });
	return await firstFetch.then(
		({ totalHits, records }) => {
			totalCount = totalHits;
			allRecords = records;

			if (allRecords.length < totalCount) {
				const multiFetch = multiFetchSkiddle(totalCount, firstLimit, recOffset, { type, id, params });
				return multiFetch.then(
					(response) => {
						response.forEach((result) => {
							allRecords.push(...result.records);
						});
						return {
							totalHits: totalCount,
							records: allRecords,
						};
					},
					(error) => {
						throw new Error(error.message);
					}
				);
			}

			return {
				totalHits: totalCount,
				records: allRecords,
			};
		},
		(error) => {
			throw new Error(error.message);
		}
	);
}