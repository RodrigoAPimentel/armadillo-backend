export interface IService {
  name: string;
  url: string;
  status?: string;
  nginx_endpoint?: string;
  username?: string;
  password?: string;
  error?: string;
}
export interface IHealthCheck {
  lastCheck: string;
  application: IService[];
  services: {
    proxy: IService[];
    database: IService[];
    observability: IService[];
  };
}
