import {
	clearByKeys,
	getItem,
	removeItem,
	setItem,
	storageScope,
} from "./storageService";

const ACCESS_TOKEN_KEY = "accessToken";
const USER_KEY = "user";

const parseJson = (value) => {
	if (!value) return null;

	try {
		return JSON.parse(value);
	} catch {
		return null;
	}
};

export const getAccessToken = () =>
	getItem(ACCESS_TOKEN_KEY, storageScope.local) ||
	getItem(ACCESS_TOKEN_KEY, storageScope.session);

export const setAccessToken = (token, remember = false) => {
	if (!token) return;

	if (remember) {
		setItem(ACCESS_TOKEN_KEY, token, storageScope.local);
		removeItem(ACCESS_TOKEN_KEY, storageScope.session);
		return;
	}

	setItem(ACCESS_TOKEN_KEY, token, storageScope.session);
	removeItem(ACCESS_TOKEN_KEY, storageScope.local);
};

export const getStoredUser = () => {
	const localUser = parseJson(getItem(USER_KEY, storageScope.local));
	const sessionUser = parseJson(getItem(USER_KEY, storageScope.session));
	return localUser || sessionUser;
};

export const setStoredUser = (user, remember = false) => {
	if (!user) return;

	const serializedUser = JSON.stringify(user);

	if (remember) {
		setItem(USER_KEY, serializedUser, storageScope.local);
		removeItem(USER_KEY, storageScope.session);
		return;
	}

	setItem(USER_KEY, serializedUser, storageScope.session);
	removeItem(USER_KEY, storageScope.local);
};

export const clearAuthStorage = () => {
	clearByKeys([ACCESS_TOKEN_KEY, USER_KEY], storageScope.local);
	clearByKeys([ACCESS_TOKEN_KEY, USER_KEY], storageScope.session);
};

