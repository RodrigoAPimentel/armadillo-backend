import { Schema } from 'mongoose';
import { TradeMarket } from 'src/commons/genericTypes';

/**
 * Interface representing the structure of a broker entity.
 */
/**
 * Represents a broker entity with details about its platform, API, and configuration.
 *
 * @interface Interface
 *
 * @property _id - Unique identifier for the broker entity. Optional field.
 * @property name - Name of the broker.
 * @property tradeMarket - List of trade markets associated with the broker.
 * @property brokerName - Name of the broker's platform or service.
 * @property brokerageFee - Brokerage fee charged by the broker.
 * @property apiBaseUrl - Base URLs for the broker's API.
 * @property apiBaseUrl.main - Main API base URL.
 * @property apiBaseUrl.simulation - Simulation API base URL.
 * @property apiEndpoints - List of API endpoints provided by the broker. Optional field.
 * @property apiEndpoints[].name - Name of the API endpoint.
 * @property apiEndpoints[].httpMethod - HTTP method used by the API endpoint (e.g., GET, POST).
 * @property apiEndpoints[].endpoint - URL path of the API endpoint.
 * @property apiEndpoints[].function - Functionality provided by the API endpoint.
 * @property apiEndpoints[].description - Description of the API endpoint. Optional field.
 * @property apiEndpoints[].observation - Additional observations about the API endpoint. Optional field.
 * @property apiEndpoints[].params - List of parameters required by the API endpoint. Optional field.
 * @property apiEndpoints[].params[].name - Name of the parameter.
 * @property apiEndpoints[].params[].key - Key used to identify the parameter.
 * @property apiEndpoints[].params[].description - Description of the parameter. Optional field.
 * @property apiEndpoints[].params[].value - Value of the parameter, which can be a string or number.
 * @property apiKey - API key for authenticating with the broker's API.
 * @property secretKey - Secret key for authenticating with the broker's API.
 * @property others - Additional configuration or metadata for the broker. Optional field.
 * @property others[].name - Name of the additional configuration.
 * @property others[].key - Key used to identify the additional configuration.
 * @property others[].description - Description of the additional configuration. Optional field.
 * @property others[].value - Value of the additional configuration, which can be a string or number.
 * @property active - Indicates whether the broker is active. Defaults to `true`. Optional field.
 */
export interface Interface {
  _id?: string;
  name: string;
  tradeMarket: TradeMarket;
  brokerName: string;
  brokerageFee: number;
  apiBaseUrl: {
    main: string;
    simulation?: string;
  };
  apiEndpoints?: Array<{
    name: string;
    httpMethod: string;
    endpoint: string;
    function: string;
    description?: string;
    observation?: string;
    params?: Array<{
      name: string;
      key: string;
      description?: string;
      value: string | number;
    }>;
  }>;
  apiKey: string;
  secretKey: string;
  others?: [
    {
      name: string;
      key: string;
      description?: string;
      value: string | number;
    },
  ];
  active?: boolean;
}

export const EntitySchema = new Schema<Interface>({
  name: { type: String, required: true },
  tradeMarket: { type: Schema.Types.Mixed, required: true },
  brokerName: { type: String, required: true },
  brokerageFee: { type: Number, required: true },
  apiBaseUrl: {
    main: { type: String, required: true },
    simulation: { type: String },
  },
  apiEndpoints: [
    {
      name: { type: String, required: true },
      httpMethod: { type: String, required: true },
      endpoint: { type: String, required: true },
      function: { type: String, required: true },
      description: { type: String },
      observation: { type: String },
      params: [
        {
          name: { type: String, required: true },
          key: { type: String, required: true },
          description: { type: String },
          value: { type: Schema.Types.Mixed, required: true },
        },
      ],
    },
  ],
  apiKey: { type: String, required: true },
  secretKey: { type: String, required: true },
  others: [
    {
      name: { type: String, required: true },
      key: { type: String, required: true },
      description: { type: String },
      value: { type: Schema.Types.Mixed, required: true },
    },
  ],
  active: { type: Boolean, default: true },
});
