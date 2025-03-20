import { Controller, Get, UseGuards } from '@nestjs/common';
import { JWTAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { AppService } from './app.service';
import Logger from 'src/logger/Logger';
import { IHealthCheck } from 'src/commons/interfaces';
import {
  CurrencySymbol,
  TradeMarket,
  TradeSignal,
  UserRoles,
} from 'src/commons/genericTypes';

/**
 * AppController is responsible for handling incoming requests and returning responses.
 */
@UseGuards(JWTAuthGuard)
@Controller()
export class AppController {
  /**
   * Creates an instance of AppController.
   * @param appService - The service used to handle business logic.
   * @param logger - The logger used to log function calls and results.
   */
  constructor(
    private readonly appService: AppService,
    private logger: Logger,
  ) {}

  /**
   * Handles GET requests and returns a greeting message.
   * @returns A greeting message as a string.
   */
  @Get()
  getHello(): string {
    this.logger.functionCaller({}, 'info');
    const resp: string = this.appService.getHello();
    this.logger.functionResult(resp, 'info');
    return resp;
  }

  @Get('status')
  async getStatus(): Promise<IHealthCheck> {
    this.logger.functionCaller({}, 'info');
    const resp: IHealthCheck = await this.appService.getStatus();
    this.logger.functionResult(resp, 'info');
    return resp;
  }

  @Get('types')
  getTypes(): {
    currencySymbols: CurrencySymbol[];
    tradeSignals: TradeSignal[];
    tradeMarkets: TradeMarket[];
    userRoles: UserRoles[];
  } {
    this.logger.functionCaller({}, 'info');

    const resp = {
      currencySymbols: Object.values(CurrencySymbol),
      tradeSignals: Object.values(TradeSignal),
      tradeMarkets: Object.values(TradeMarket),
      userRoles: Object.values(UserRoles),
    };

    this.logger.functionResult(resp, 'info');
    return resp;
  }
}
