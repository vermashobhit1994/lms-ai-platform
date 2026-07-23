// enable cors for frontend to enable origins
export const corsConfigOptions = {
    //TODO: change to domain url i.e. https://app.yourdomain.com
    origin: [process.env.CORS_ORIGIN_DEVELOPMENT, process.env.CORS_ORIGIN_BUILD],
    optionsSuccessStatus: 200
}
