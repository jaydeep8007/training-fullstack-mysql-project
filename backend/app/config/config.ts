var config: any = {
  production: {
    database: {
      DB_NAME: 'fuse2',
      DB_USERNAME: 'admin',
      DB_PASSWORD: 'Admin@123',
      DB_HOST: 'localhost',
      DIALECT: 'mysql',
      LOGGING: false,
    },
    SECURITY_TOKEN: 'ServerSecurityKey',
    SERVER_PORT: '3000',
       TOKEN_EXPIRES_IN: 60 * 60 * 24, // 1 day in seconds
    REFRESH_TOKEN_EXPIRES_IN: 60 * 60 * 24 * 7, // 7 days in seconds
     COOKIE_OPTIONS: {
      secure: true,                      // for localhost testing
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,    // 7 days
    },
  },
  development: {
    database: {
      DB_NAME: 'training-mysql-project',
      DB_USERNAME: 'root',
      DB_PASSWORD: 'Admin@123',
      DB_HOST: 'localhost',
      DIALECT: 'mysql',
      LOGGING: false,
    },
    SECURITY_TOKEN: 'ServerSecurityKey',
    SERVER_PORT: '3000',
    TOKEN_EXPIRES_IN: 60 * 60 * 24, // 1 day in seconds
    REFRESH_TOKEN_EXPIRES_IN: 60 * 60 * 24 * 7, // 7 days in seconds
     COOKIE_OPTIONS: {
      secure: false,                      // for localhost testing
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,    // 7 days
    },
  },
};

export function get(env: any) {
  return config[env] || config.development;
}
