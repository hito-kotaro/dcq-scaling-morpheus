import {
  BadRequestException,
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
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ status: HttpStatus.OK, type: AllPenaltyResponse })
  async findAll(): Promise<AllPenaltyResponse> {
    console.log('fetch penalty');
    const penalties = await this.penaltyService.findAll();
    const fmtPenalties: PenaltyResponse[] = penalties.map((p: Penalties) => {
      return this.penaltyService.fmtResponse(p);
    });
    console.log(fmtPenalties);
    return { penalties: fmtPenalties, total: fmtPenalties.length };
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ status: HttpStatus.OK, type: PenaltyResponse })
  async create(
    @Body(ValidationPipe) createPenalty: CreatePenaltyRequest,
    @Request() req: any,
  ): Promise<PenaltyResponse> {
    const { user_id } = req.user;

    if (await this.penaltyService.findOneByTitle(createPenalty.title)) {
      throw new BadRequestException(`${createPenalty.title} is already exist`);
    }

    const penalty = await this.penaltyService.create(user_id, createPenalty);

    return this.penaltyService.fmtResponse(penalty);
  }

  @Put(':penaltyId')
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ status: HttpStatus.OK, type: PenaltyResponse })
  async update(
    @Param('penaltyId') id: number,
    @Body(ValidationPipe) updateQuest: UpdatePenaltyRequest,
  ): Promise<PenaltyResponse> {
    const penalty = await this.penaltyService.update(id, updateQuest);
    return this.penaltyService.fmtResponse(penalty);
  }
}
