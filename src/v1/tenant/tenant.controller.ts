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
  CreateTenantRequest,
  FindOneTenantResponse,
  TenantSuccessResponse,
  UpdateTenantRequest,
} from './dto/tenant.dto';
import { TenantService } from './tenant.service';

@ApiTags('tenant')
@Controller('tenant')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Post()
  @ApiResponse({
    status: HttpStatus.OK,
    type: TenantSuccessResponse,
  })
  create(@Body(ValidationPipe) createTenant: CreateTenantRequest) {
    return this.tenantService.create(createTenant);
  }

  @Get(':tenantId')
  @ApiResponse({ status: HttpStatus.OK, type: FindOneTenantResponse })
  async findOneById(
    @Param('tenantId') tenantId: number,
  ): Promise<FindOneTenantResponse> {
    return await this.tenantService.findOneById(tenantId);
  }

  @Put(':tenantId')
  @ApiResponse({
    status: HttpStatus.OK,
    type: TenantSuccessResponse,
  })
  update(
    @Param('tenantId') id: number,
    @Body(ValidationPipe) updateTenant: UpdateTenantRequest,
  ) {
    return this.tenantService.update(id, updateTenant);
  }
}
