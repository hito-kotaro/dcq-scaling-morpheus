import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CreateRequestRequest,
  FindOneRequestResponse,
  RequestSuccessResponse,
  UpdateRequestRequest,
} from './dto/request.dto';
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

  @Post()
  @ApiResponse({ status: HttpStatus.OK, type: RequestSuccessResponse })
  async create(@Body(ValidationPipe) createRequest: CreateRequestRequest) {
    return this.requestService.create(createRequest);
  }

  @Put()
  @ApiResponse({ status: HttpStatus.OK, type: RequestSuccessResponse })
  async updadte(@Body(ValidationPipe) updateRequest: UpdateRequestRequest) {
    return await this.requestService.update(updateRequest);
  }
}
