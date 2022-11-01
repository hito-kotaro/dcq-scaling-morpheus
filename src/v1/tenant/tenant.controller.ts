import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import {
  BadRequestResponse,
  NotFoundResponse,
  UnAuthorizedResponse,
  UnProcessableEntityResponse,
} from 'src/dto/error.dto';
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
  @ApiOkResponse({
    type: TenantResponse,
  })
  @ApiUnprocessableEntityResponse({
    type: UnProcessableEntityResponse,
    description: 'Un Processable Entity',
  })
  @ApiBadRequestResponse({
    type: BadRequestResponse,
    description: 'Bad Request',
  })
  @ApiUnauthorizedResponse({
    type: UnAuthorizedResponse,
    description: 'UnAuthorized',
  })
  @ApiNotFoundResponse({
    type: NotFoundResponse,
    description: 'Resource Not Found',
  })
  async update(
    @Param('tenantId') id: number,
    @Body(ValidationPipe) updateTenant: UpdateTenantRequest,
  ) {
    const tenant = await this.tenantService.update(id, updateTenant);
    return this.tenantService.fmtResponse(tenant);
  }
}
