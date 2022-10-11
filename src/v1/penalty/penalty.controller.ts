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
  CreatePenaltyDto,
  FindAllPenaltyResponse,
  FindOnePenaltyResponse,
  PenaltySuccessResponse,
  UpdatePenaltyDto,
} from './dto/penalty.dto';
import { PenaltyService } from './penalty.service';

@ApiTags('penalty')
@Controller('penalty')
export class PenaltyController {
  constructor(private readonly penaltyService: PenaltyService) {}

  @Get(':penaltyId')
  @ApiResponse({ status: HttpStatus.OK, type: FindOnePenaltyResponse })
  async findOne(@Param('penaltyId') id: number) {
    return await this.penaltyService.findOne(id);
  }

  @Get('/all/:tenantId')
  @ApiResponse({ status: HttpStatus.OK, type: FindAllPenaltyResponse })
  async findAll(@Param('tenantId') id: number) {
    return await this.penaltyService.findAll(id);
  }

  @Post()
  @ApiResponse({ status: HttpStatus.OK, type: PenaltySuccessResponse })
  async create(@Body(ValidationPipe) createQuest: CreatePenaltyDto) {
    return this.penaltyService.create(createQuest);
  }

  @Put()
  @ApiResponse({ status: HttpStatus.OK, type: PenaltySuccessResponse })
  async update(@Body(ValidationPipe) updateQuest: UpdatePenaltyDto) {
    return this.penaltyService.update(updateQuest);
  }
}
