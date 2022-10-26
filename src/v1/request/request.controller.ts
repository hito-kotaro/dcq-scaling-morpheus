import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Requests } from 'src/entity/request.entity';
import {
  CreateRequestRequest,
  FindOneRequestResponse,
  RequestDataResponse,
  UpdateRequestRequest,
} from './dto/request.dto';
import { RequestService } from './request.service';

@ApiTags('request')
@Controller('request')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ status: HttpStatus.OK, type: FindOneRequestResponse })
  async findAll(@Request() req: any) {
    const requests: Requests[] = await this.requestService.findAllByTenantId(
      req.user.tenant_id,
    );

    const fmtRequests: RequestDataResponse[] = requests.map((r: Requests) => {
      return this.requestService.fmtResponse(r);
    });
    return { requests: fmtRequests, total: fmtRequests.length };
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ status: HttpStatus.OK, type: RequestDataResponse })
  async create(
    @Body(ValidationPipe) createRequest: CreateRequestRequest,
    @Request() req: any,
  ) {
    const request: Requests = await this.requestService.create(
      req.user.tenant_id,
      createRequest,
    );
    return this.requestService.fmtResponse(request);
  }

  @Put(':requestId')
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ status: HttpStatus.OK, type: RequestDataResponse })
  async updadte(
    @Param('requestId') id: number,
    @Body(ValidationPipe) updateRequest: UpdateRequestRequest,
    @Request() req: any,
  ) {
    const request: Requests = await this.requestService.update(
      id,
      req.user.user_id,
      updateRequest,
    );
    return this.requestService.fmtResponse(request);
  }
}
