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
import { TenantResponse, UpdateTenantRequest } from './dto/tenant.dto';
import { TenantService } from './tenant.service';

@ApiTags('tenant')
@Controller('tenant')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  // @Post()
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   type: TenantSuccessResponse,
  // })
  // create(@Body(ValidationPipe) createTenant: CreateTenantRequest) {
  //   return this.tenantService.create(createTenant);
  // }

  @Get(':tenantId')
  @ApiResponse({ status: HttpStatus.OK, type: TenantResponse })
  async findOneById(
    @Param('tenantId') tenantId: number,
  ): Promise<TenantResponse> {
    const tenant = await this.tenantService.findOneById(tenantId);
    return this.tenantService.fmtResponse(tenant);
  }

  @Put(':tenantId')
  @ApiResponse({
    status: HttpStatus.OK,
    type: TenantResponse,
  })
  async update(
    @Param('tenantId') id: number,
    @Body(ValidationPipe) updateTenant: UpdateTenantRequest,
  ) {
    const tenant = await this.tenantService.update(id, updateTenant);
    return this.tenantService.fmtResponse(tenant);
  }
}
