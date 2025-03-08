/**
 * Represents a trade signal in the trading strategy.
 *
 * - 'BUY': Indicates a signal to buy an asset.
 * - 'SELL': Indicates a signal to sell an asset.
 * - 'HOLD': Indicates a signal to hold the current position without buying or selling.
 */
export type TradeSignal = 'BUY' | 'SELL' | 'HOLD';

export type CurrencySymbol = 'US$' | 'R$';

export type TradeMarket = 'cryptocurrencies' | 'financial' | 'sports';
