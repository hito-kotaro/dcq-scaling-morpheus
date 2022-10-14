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
  GetOneTenantResponse,
  TenantSuccessResponse,
  UpdateTenantRequest,
} from './dto/tenant.dto';
import { TenantService } from './tenant.service';

@ApiTags('tenant')
@Controller('tenant')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Get('/name/:tenantName')
  @ApiResponse({ status: HttpStatus.OK, type: GetOneTenantResponse })
  async findOneByName(
    @Param('tenantName') tenantName: string,
  ): Promise<GetOneTenantResponse> {
    return await this.tenantService.findOneByName(tenantName);
  }

  @Get('/id/:tenantId')
  @ApiResponse({ status: HttpStatus.OK, type: GetOneTenantResponse })
  async findOneById(
    @Param('tenantId') tenantId: number,
  ): Promise<GetOneTenantResponse> {
    return await this.tenantService.findOneById(tenantId);
  }

  @Post()
  @ApiResponse({
    status: HttpStatus.OK,
    type: TenantSuccessResponse,
  })
  create(@Body(ValidationPipe) createTenant: CreateTenantRequest) {
    return this.tenantService.create(createTenant);
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
