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
  CreateTenantDto,
  GetOneTenantResponse,
  TenantSuccessResponse,
  UpdateTenantDto,
} from './dto/tenant.dto';
import { TenantService } from './tenant.service';

@ApiTags('tenant')
@Controller('tenant')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Get(':tenantId')
  @ApiResponse({ status: HttpStatus.OK, type: GetOneTenantResponse })
  async findOne(
    @Param('tenantId') tenantId: number,
  ): Promise<GetOneTenantResponse> {
    return await this.tenantService.findOne(tenantId);
  }

  @Post()
  @ApiResponse({
    status: HttpStatus.OK,
    type: TenantSuccessResponse,
  })
  create(@Body(ValidationPipe) createTenant: CreateTenantDto) {
    return this.tenantService.create(createTenant);
  }

  @Put(':tenantId')
  @ApiResponse({
    status: HttpStatus.OK,
    type: TenantSuccessResponse,
  })
  update(
    @Param('tenantId') id: number,
    @Body(ValidationPipe) updateTenant: UpdateTenantDto,
  ) {
    return this.tenantService.update(id, updateTenant);
  }
}
