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
  CreateQuestDto,
  FindOneQuestResponse,
  QuestSuccessResponse,
  UpdateQuestDto,
} from './dto/quest.dto';
import { QuestService } from './quest.service';

@ApiTags('quest')
@Controller('quest')
export class QuestController {
  constructor(private readonly questService: QuestService) {}

  @Get(':questId')
  @ApiResponse({ status: HttpStatus.OK, type: FindOneQuestResponse })
  async findOne(@Param('questId') id: number) {
    return await this.questService.findOne(id);
  }

  @Get('/all/:tenantId')
  @ApiResponse({ status: HttpStatus.OK, type: FindOneQuestResponse })
  async findAll(@Param('tenantId') id: number) {
    return await this.questService.findAll(id);
  }

  @Post()
  @ApiResponse({ status: HttpStatus.OK, type: QuestSuccessResponse })
  async create(@Body(ValidationPipe) createQuest: CreateQuestDto) {
    return this.questService.create(createQuest);
  }

  @Put()
  @ApiResponse({ status: HttpStatus.OK, type: QuestSuccessResponse })
  async update(@Body(ValidationPipe) updateQuest: UpdateQuestDto) {
    return this.questService.update(updateQuest);
  }
}
