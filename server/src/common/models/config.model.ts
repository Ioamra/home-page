export interface ConfigProps {
  port: number;
  devMode: boolean;
  defaultPhoto: string;
  generatePostmanCollection: boolean;
  api: ApiConfigProps;
  salt: string;
  database: DatabaseConfigProps;
  jwt: JwtConfigProps;
  encryption: EncryptionConfigProps;
  cookie: CookieConfigProps;
  cors: CorsConfigProps;
  nodemailer: NodeMailerConfigProps;
}

interface ApiConfigProps {
  frontUrl: string;
  httpTimeout: number;
}

interface DatabaseConfigProps {
  host: string;
  port: number;
  user: string;
  password: string;
  databaseName: string;
}

interface JwtConfigProps {
  private: string;
  public: string;
  expiresIn: number;
  algorithm: 'RS256' | 'HS256';
}

interface EncryptionConfigProps {
  password: string;
  salt: string;
  iv: string;
}

interface CookieConfigProps {
  secret: string;
  secure: boolean;
  httpOnly: boolean;
  domain: string;
  path: string;
}

interface CorsConfigProps {
  origin: string;
}

interface NodeMailerConfigProps {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  mailDev?: string;
}
