import {
  Body,
  Controller,
  Param,
  Put,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { UpdateTenantRequest } from './dto/tenant.dto';
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

  // @Get(':tenantId')
  // @ApiResponse({ status: HttpStatus.OK, type: TenantResponse })
  // @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BadRequestResponse })
  // async findOneById(
  //   @Param('tenantId') tenantId: number,
  // ): Promise<TenantResponse> {
  //   throw new BadRequestException('already exist');
  //   const tenant = await this.tenantService.findOneById(tenantId);
  //   return this.tenantService.fmtResponse(tenant);
  // }

  @Put(':tenantId')
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Param('tenantId') id: number,
    @Body(ValidationPipe) updateTenant: UpdateTenantRequest,
  ) {
    const tenant = await this.tenantService.update(id, updateTenant);
    return this.tenantService.fmtResponse(tenant);
  }
}
