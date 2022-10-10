import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { FindOneRequestResponse } from './dto/request.dto';
import { RequestService } from './request.service';

@ApiTags('request')
@Controller('request')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Get(':requestId')
  @ApiResponse({ status: HttpStatus.OK, type: FindOneRequestResponse })
  async findOne(@Param('requestId') id: number) {
    return await this.requestService.findOne(id);
  }

  @Get('/all/:tenantId')
  @ApiResponse({ status: HttpStatus.OK, type: FindOneRequestResponse })
  async findAll(@Param('tenantId') id: number) {
    return await this.requestService.findAll(id);
  }
}
