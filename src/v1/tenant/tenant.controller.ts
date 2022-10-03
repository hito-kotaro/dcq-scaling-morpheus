import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import {
  CreateTenantDto,
  CreateTenantResponse,
  GetOneTenantResponse,
} from './dto/tenant.dto';
import { TenantService } from './tenant.service';

@Controller('tenant')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Get(':id')
  @ApiResponse({ status: HttpStatus.OK, type: GetOneTenantResponse })
  async findOne(@Param('id') id: number): Promise<GetOneTenantResponse> {
    return await this.tenantService.findOne(id);
  }

  @Post()
  @ApiResponse({
    status: HttpStatus.OK,
    type: CreateTenantResponse,
  })
  create(@Body(ValidationPipe) createTenant: CreateTenantDto) {
    return this.tenantService.create(createTenant);
  }
}
