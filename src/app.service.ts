import { Injectable } from '@nestjs/common';
import axios from 'axios';
import Logger from 'src/logger/Logger';
import { IHealthCheck, IService } from 'src/commons/interfaces';

@Injectable()
export class AppService {
  constructor(private logger: Logger) {}

  getHello(): string {
    this.logger.functionCaller({});
    const response = `Hello World! [${new Date().toString()}]`;
    this.logger.functionResult(response);
    return response;
  }

  async getStatus(): Promise<IHealthCheck> {
    this.logger.functionCaller({});

    const result: IHealthCheck = await this.checkHealth();

    this.logger.functionResult(result);
    return result;
  }

  private async checkHealth(): Promise<IHealthCheck> {
    this.logger.functionCaller({});
    const healthCheckResponse: IHealthCheck = {
      lastCheck: new Date().toString(),
      application: await this.verify([
        {
          name: 'Frontend',
          url: `http://${process.env.PROJECT_FRONTEND_HOST}`,
          nginx_endpoint: `/${process.env.PROJECT_FRONTEND_URL}`,
        },
      ]),
      services: {
        proxy: await this.verify([
          {
            name: 'Nginx',
            url: `http://${process.env.NGINX_HOST}/${process.env.NGINX_STATUS_URL}`,
            nginx_endpoint: `/${process.env.NGINX_STATUS_URL}`,
          },
        ]),
        database: await this.verify([
          {
            name: 'MongoDB',
            url: `http://${process.env.MONGO_HOST}`,
          },
          {
            name: 'MongoDB Express',
            url: `http://${process.env.MONGO_EXPRESS_HOST}/${process.env.MONGO_EXPRESS_URL}`,
            nginx_endpoint: `/${process.env.MONGO_EXPRESS_URL}`,
            username: `${process.env.MONGO_ROOT_USERNAME}`,
            password: `${process.env.MONGO_ROOT_PASSWORD}`,
          },
        ]),
        observability: await this.verify([
          {
            name: 'ElasticSearch',
            url: `http://${process.env.ELK_ELASTICSEARCH_HOST}`,
            nginx_endpoint: `/${process.env.ELK_ELASTICSEARCH_URL}`,
            username: `${process.env.ELK_ELASTICSEARCH_USERNAME}`,
            password: `${process.env.ELK_ELASTICSEARCH_PASSWORD}`,
          },

          {
            name: 'Kibana',
            url: `http://${process.env.ELK_KIBANA_HOST}/api/status`,
            nginx_endpoint: `/${process.env.ELK_KIBANA_URL}`,
            username: `${process.env.ELK_ELASTICSEARCH_USERNAME}`,
            password: `${process.env.ELK_ELASTICSEARCH_PASSWORD}`,
          },

          {
            name: 'Filebeat',
            url: `http://${process.env.ELK_FILEBEAT_HOST}`,
          },

          {
            name: 'Metricbeat',
            url: `http://${process.env.ELK_METRICBEAT_HOST}`,
          },
          {
            name: 'Heartbeat',
            url: `http://${process.env.ELK_HEARTBEAT_HOST}`,
          },
          {
            name: 'APM',
            url: `http://${process.env.ELK_APM_HOST}`,
          },
        ]),
      },
    };
    this.logger.functionResult(healthCheckResponse);
    return healthCheckResponse;
  }

  private async verify(srv: IService[]): Promise<IService[]> {
    this.logger.functionCaller({ srv });
    const results: IService[] = [];
    await Promise.all(
      srv.map(async (service: IService) => {
        try {
          if (service.username && service.password) {
            await axios.get(service.url, {
              auth: {
                username: service.username,
                password: service.password,
              },
            });
          } else {
            await axios.get(service.url);
          }
          results.push({
            name: service.name,
            url: service.url,
            status: 'up',
            nginx_endpoint: service.nginx_endpoint,
          });
        } catch (error: unknown) {
          const errorMessage = (error as Error).message;
          results.push({
            name: service.name,
            url: service.url,
            status: 'down',
            nginx_endpoint: service.nginx_endpoint,
            error: errorMessage,
          });
        }
      }),
    );
    this.logger.functionResult(results);
    return results;
  }
}
