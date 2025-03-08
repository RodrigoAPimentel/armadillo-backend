import { Schema } from 'mongoose';
import { CurrencySymbol, TradeMarket } from 'src/commons/genericTypes';

export interface Interface {
  _id?: string;
  name: string;
  lifetime: number;
  operationCycleTime: number;
  tradeMarket: TradeMarket;
  initialCapital: number;
  stopLoss: number;
  stopGain: number;

  // broker: Broker;
  // tradeStrategy: Strategy[];
  broker: string;
  tradeStrategy: string[];

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
  active?: boolean;
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
    type: String,
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
  broker: {
    type: String,
    required: [true, 'broker is Broker!'],
  },
  tradeStrategy: [
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
    required: [true, 'operatingProductionMode is required!'],
  },
  active: {
    type: Boolean,
  },
});
