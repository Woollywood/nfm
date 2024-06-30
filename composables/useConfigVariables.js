export const useConfigVariables = () => {
	const config = useRuntimeConfig();
	return config.public;
};
