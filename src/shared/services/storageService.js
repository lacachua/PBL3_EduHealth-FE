const STORAGE_SCOPE = {
	local: "local",
	session: "session",
};

const isBrowser = typeof window !== "undefined";

const getStorageByScope = (scope = STORAGE_SCOPE.local) => {
	if (!isBrowser) return null;
	return scope === STORAGE_SCOPE.session ? window.sessionStorage : window.localStorage;
};

export const getItem = (key, scope = STORAGE_SCOPE.local) => {
	try {
		const storage = getStorageByScope(scope);
		return storage?.getItem(key) || null;
	} catch {
		return null;
	}
};

export const setItem = (key, value, scope = STORAGE_SCOPE.local) => {
	try {
		const storage = getStorageByScope(scope);
		if (!storage) return;
		storage.setItem(key, value);
	} catch {
		// Ignore storage write errors to avoid breaking auth flow.
	}
};

export const removeItem = (key, scope = STORAGE_SCOPE.local) => {
	try {
		const storage = getStorageByScope(scope);
		storage?.removeItem(key);
	} catch {
		// Ignore storage remove errors to avoid breaking auth flow.
	}
};

export const clearByKeys = (keys = [], scope = STORAGE_SCOPE.local) => {
	keys.forEach((key) => removeItem(key, scope));
};

export const storageScope = STORAGE_SCOPE;

