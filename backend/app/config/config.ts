var config: any = {
    production: {
        database: {
            DB_NAME: "fuse2",
            DB_USERNAME: "admin",
            DB_PASSWORD: "Admin@123",
            DB_HOST: "localhost",
            DIALECT: "mysql",
            LOGGING: false
        },
        SECURITY_TOKEN: 'Fuse2ServerSecurityKey',
        SERVER_PORT: '3000',
        TOKEN_EXPIRES_IN: 172800, // 2 days in seconds
        REFRESH_TOKEN_EXPIRES_IN: 172800, // 2 days in seconds
    },
    development: {
        database: {
            DB_NAME: "training-mysql-project",
            DB_USERNAME: "root",
            DB_PASSWORD: "Admin@123",
            DB_HOST: "localhost",
            DIALECT: "mysql",
            LOGGING: false
        },
        SECURITY_TOKEN: 'Fuse2ServerSecurityKey',
        SERVER_PORT: '3000',
        TOKEN_EXPIRES_IN: 172800, // 2 days in seconds
        REFRESH_TOKEN_EXPIRES_IN: 172800, // 2 days in seconds
        // TOKEN_EXPIRES_IN: 300 //5 min in seconds
    }
}

export function get(env: any) {
    return config[env] || config.development;
}