const isProd = process.env.ENV_CODE === 'prod'

const isDev = !isProd

export { isDev, isProd }
