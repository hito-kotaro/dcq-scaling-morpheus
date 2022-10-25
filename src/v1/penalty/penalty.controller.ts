import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Put,
  Request,
  ValidationPipe,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Penalties } from 'src/entity/penalty.entity';
import {
  AllPenaltyResponse,
  CreatePenaltyRequest,
  PenaltyResponse,
  UpdatePenaltyRequest,
} from './dto/penalty.dto';
import { PenaltyService } from './penalty.service';

@ApiTags('penalty')
@Controller('penalty')
export class PenaltyController {
  constructor(private readonly penaltyService: PenaltyService) {}

  @Get()
  @ApiResponse({ status: HttpStatus.OK, type: AllPenaltyResponse })
  async findAll(@Request() req: any): Promise<AllPenaltyResponse> {
    const penalties = await this.penaltyService.findAll(req.user.tenant_id);
    const fmtPenalties: PenaltyResponse[] = penalties.map((p: Penalties) => {
      return this.penaltyService.fmtResponse(p);
    });

    return { penalties: fmtPenalties, total: fmtPenalties.length };
  }

  @Post()
  @ApiResponse({ status: HttpStatus.OK, type: PenaltyResponse })
  async create(
    @Body(ValidationPipe) createPenalty: CreatePenaltyRequest,
    @Request() req: any,
  ): Promise<PenaltyResponse> {
    const { tenant_id, user_id } = req.user;

    const exist = await this.penaltyService.titleExist(
      tenant_id,
      createPenalty.title,
    );

    if (exist === true) {
      throw new BadRequestException(`${createPenalty.title} is already exist`);
    }

    const penalty = await this.penaltyService.create(
      tenant_id,
      user_id,
      createPenalty,
    );

    return this.penaltyService.fmtResponse(penalty);
  }

  @Put()
  @ApiResponse({ status: HttpStatus.OK, type: PenaltyResponse })
  async update(
    @Body(ValidationPipe) updateQuest: UpdatePenaltyRequest,
  ): Promise<PenaltyResponse> {
    const penalty = await this.penaltyService.update(updateQuest);
    return this.penaltyService.fmtResponse(penalty);
  }
}
