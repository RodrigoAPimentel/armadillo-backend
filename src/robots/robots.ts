import { Schema } from 'mongoose';
import { CurrencySymbol, TradeMarket } from 'src/commons/genericTypes';

/**
 * Interface representing a robot configuration.
 *
 * @property {string} [_id] - Optional unique identifier for the robot.
 * @property {string} name - The name of the robot.
 * @property {number} lifetime - The lifetime of the robot in days. A value of 0 indicates an indefinite lifetime
 * @property {number} operationCycleTime - The operation cycle time of the robot in seconds.
 * @property {TradeMarket} tradeMarket - The trade market where the robot operates.
 * @property {number} initialCapital - The initial capital allocated to the robot.
 * @property {number} stopLoss - The stop loss value for the robot. A value 0 indicates no stop loss.
 * @property {number} stopGain - The stop gain value for the robot. A value 0 indicates no stop gain.
 * @property {string} brokerId - The identifier of the broker used by the robot.
 * @property {string[]} tradeStrategyId - The identifiers of the trade strategies used by the robot.
 * @property {CurrencySymbol} currencySymbol - The currency symbol used by the robot.
 * @property {Array<{name: string, key: string, type: string, description?: string, value: string | number}>} [otherParams] - Optional array of additional parameters for the robot.
 * @property {boolean} simulationMode - Indicates if the robot is in simulation mode.
 * @property {{opened: boolean, lastUpdate: string, orderId: string}} isOpened - The status of the robot's open state.
 * @property {{running: boolean, started: string, ended: string}} isRunning - The status of the robot's running state.
 * @property {boolean} stopRobot - Indicates if the robot should be stopped.
 * @property {boolean} active - Indicates if the robot is active.
 */
export interface Interface {
  _id?: string;
  name: string;
  lifetime: number;
  operationCycleTime: number;
  tradeMarket: TradeMarket;
  initialCapital: number;
  stopLoss: number;
  stopGain: number;
  brokerId: string;
  tradeStrategyId: string[];
  currencySymbol: CurrencySymbol;
  otherParams?: [
    {
      name: string;
      key: string;
      type: string;
      description?: string;
      value: string | number;
    },
  ];
  simulationMode: boolean;
  isOpened: {
    opened: boolean;
    lastUpdate: string;
    orderId: string;
  };
  isRunning: {
    running: boolean;
    started: string;
    ended: string;
  };
  stopRobot: boolean;
  active: boolean;
}

export const EntitySchema = new Schema<Interface>({
  name: {
    type: String,
    required: [true, 'Name is required!'],
  },
  lifetime: {
    type: Number,
    required: [true, 'lifetime is required!'],
  },
  operationCycleTime: {
    type: Number,
    required: [true, 'operationCycleTime is required!'],
  },
  tradeMarket: {
    type: Schema.Types.Mixed,
    required: [true, 'tradeMarket is required!'],
  },
  initialCapital: {
    type: Number,
    required: [true, 'initialCapital is required!'],
  },
  stopLoss: {
    type: Number,
    required: [true, 'stopLoss is required!'],
  },
  stopGain: {
    type: Number,
    required: [true, 'stopGain is required!'],
  },
  brokerId: {
    type: String,
    required: [true, 'brokerId is Broker!'],
  },
  tradeStrategyId: [
    {
      type: String,
    },
  ],
  currencySymbol: {
    type: String,
    required: [true, 'currencySymbol is required!'],
  },
  otherParams: [
    {
      key: {
        type: String,
      },
      name: {
        type: String,
      },
      type: {
        type: String,
      },
      description: {
        type: String,
      },
      value: {
        type: String,
      },
    },
  ],
  simulationMode: {
    type: Boolean,
    required: [true, 'simulationMode is required!'],
  },
  isOpened: {
    opened: {
      type: Boolean,
      required: [true, 'opened is required!'],
    },
    lastUpdate: {
      type: String,
    },
    orderId: {
      type: String,
    },
  },
  isRunning: {
    running: {
      type: Boolean,
      required: [true, 'running is required!'],
    },
    started: {
      type: String,
      required: [true, 'started is required!'],
    },
    ended: {
      type: String,
      required: [true, 'ended is required!'],
    },
  },
  stopRobot: {
    type: Boolean,
    required: [true, 'stopRobot is required!'],
  },
  active: {
    type: Boolean,
    required: [true, 'active is required!'],
  },
});
