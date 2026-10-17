import { URL } from './env';

// caller signal ───────┐
//                      ├──> internal AbortController ───> fetch()
// 20s timeout ─────────┘
async function readJson(path, params, signal) {
	const query = new URLSearchParams();

	Object.entries(params).forEach(([key, value]) => {
		if (value !== '' && value !== null && value !== undefined) {
			query.set(key, String(value));
		}
	});

	const controller = new AbortController();
	const abort = () => controller.abort();

	if (signal?.aborted) {
		abort();
	}

	signal?.addEventListener('abort', abort);

	let timedOut = false;
	const timer = setTimeout(() => {
		timedOut = true;
		controller.abort();
	}, 20000);

	try {
		const response = await fetch(`${URL}${path}${query.toString() ? `?${query}` : ''}`, {
			method: 'GET',
			headers: { Accept: 'application/json' },
			signal: controller.signal
		});

		if (!response.ok) throw new Error(`The catalogue service returned an error (${response.status}). Please try again.`);

		return await response.json();
	} catch (error) {
		if (timedOut) throw new Error('The catalogue service took too long to respond. Please try again.');
		if (error.name === 'AbortError') throw error;
		if (error instanceof TypeError) throw new Error('The catalogue service is unavailable. Please try again in a moment.');
		if (error instanceof SyntaxError) throw new Error('The catalogue service returned an invalid response.');
		throw error;
	} finally {
		clearTimeout(timer);
		signal?.removeEventListener('abort', abort);
	}
}

export async function getCatalogue(filters, signal) {
	const data = await readJson('items', filters, signal);
	const pagination = data?.pagination;

	if (
		!Array.isArray(data?.itemsData) ||
		!data.itemsData.every(item => item && typeof item === 'object' &&
		typeof item.title === 'string' &&
		typeof item.site === 'string') ||
		!pagination ||
		!['page', 'limit', 'total', 'totalPages'].every(key => Number.isInteger(pagination[key]) && pagination[key] >= 0) ||
		pagination.page < 1 ||
		pagination.limit < 1
	) {
		throw new Error('The catalogue service returned an invalid response.');
	}

	return data;
}

export async function getFilters(filters, signal) {
	const data = await readJson('filters', filters, signal);

	if (!['stores', 'genders', 'categories'].every(key => Array.isArray(data?.[key]))) {
		throw new Error('The catalogue service returned invalid filters.');
	}

	return data;
}
