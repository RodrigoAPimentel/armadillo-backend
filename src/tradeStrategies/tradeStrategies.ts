import { Schema } from 'mongoose';
import { TradeMarket } from 'src/commons/genericTypes';

/**
 * Represents the schema for an entity in the trade strategies module.
 * This schema defines the structure and validation rules for the entity.
 *
 * @template Interface - The interface representing the entity structure.
 *
 * @property {string} name - The name of the entity. This field is required.
 * @property {string} acronym - The acronym of the entity. This field is required.
 * @property {string[]} tradeMarket - An array of strings representing the tradeMarket associated with the entity.
 * @property {string} description - A description of the entity. This field is required.
 * @property {Array<{
 *   name: string;
 *   key: string;
 *   type: string;
 *   description: string;
 *   value: any;
 * }>} parameters - An array of parameter objects, each containing:
 *   - `name`: The name of the parameter.
 *   - `key`: The key identifier for the parameter.
 *   - `type`: The type of the parameter.
 *   - `description`: A description of the parameter.
 *   - `value`: The value of the parameter, which can be of any type.
 * @property {boolean} active - A flag indicating whether the entity is active. Defaults to `true`.
 */
export interface Interface {
  _id?: string;
  name: string;
  acronym: string;
  tradeMarket: TradeMarket[];
  description: string;
  parameters?: [
    {
      name: string;
      key: string;
      type: string;
      description?: string;
      value: string | number;
    },
  ];
  active?: boolean;
}

export const EntitySchema = new Schema<Interface>({
  name: {
    type: String,
    required: [true, 'name is required!'],
  },
  acronym: {
    type: String,
    required: [true, 'acronym is required!'],
  },
  tradeMarket: [
    {
      type: Schema.Types.Mixed,
      required: [true, 'tradeMarket is required!'],
    },
  ],
  description: {
    type: String,
    required: [true, 'description is required!'],
  },
  parameters: [
    {
      name: {
        type: String,
      },
      key: {
        type: String,
      },
      type: {
        type: String,
      },
      description: {
        type: String,
      },
      value: {
        type: Schema.Types.Mixed,
      },
    },
  ],
  active: {
    type: Boolean,
    default: true,
  },
});
