import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ListResponseDto } from '../common/dto/list-response.dto';
import { CreateOrderDto, OrderTicketDto } from './dto/order.dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  create(
    @Body() order: CreateOrderDto,
  ): Promise<ListResponseDto<OrderTicketDto>> {
    return this.orderService.create(order);
  }
}
