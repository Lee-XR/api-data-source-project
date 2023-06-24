import { skiddleInstance } from '../configs/axiosConfig';

// Single fetching
async function singleFetch(data) {
	const path =
		import.meta.env.MODE === 'production'
			? '/api/skiddle'
			: '/api/skiddle-api-php/';

	return await skiddleInstance
		.post(path, data)
		.then((response) => {
			const isArray = Array.isArray(response.data.results);

			return {
				totalHits: isArray ? parseInt(response.data.totalcount) : 1,
				totalRecords: isArray ? response.data.results : [response.data.results],
			};
		});
}

// Multiple fetching
async function multiFetch(data, firstLimit, firstOffset, remainingFetches) {
	const promises = [];

	for (let num = 0; num < remainingFetches; num++) {
		const newOffset = firstLimit + firstOffset + num * 100;
		const newParams = {
			...data.params,
			limit: 100,
			offset: newOffset,
		};

		const promise = new Promise((resolve) => {
			setTimeout(() => {
				resolve(singleFetch({ ...data, params: newParams }));
			}, 2000 * num);
		});

		promises.push(promise);
	}

	return Promise.all(promises).then((response) => {
		return response;
	});
}

// Fetch data from Skiddle API through PHP SDK
export async function fetchSkiddle(type, id, params) {
	const firstLimit = params.limit || (type === 'artists' ? 10 : 20);
	const firstOffset = params.offset || 0;
	const data = { type, id, params };

	return await singleFetch(data)
		.then(({ totalHits, totalRecords }) => {
			if (totalRecords.length < totalHits) {
				const remainingFetches = Math.ceil((totalHits - firstLimit) / 100);

				return multiFetch(data, firstLimit, firstOffset, remainingFetches).then(
					(response) => {
						response.forEach((result) => {
							totalRecords.push(...result.totalRecords);
						});

						return { totalHits, totalRecords };
					}
				);
			}

			return { totalHits, totalRecords };
		})
		.catch((error) => {
			if (error.response.data.error) {
				throw new Error(error.response.data.error);
			} else {
				throw new Error(error.message);
			}
		});
}
