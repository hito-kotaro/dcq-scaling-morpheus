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
  CreateQuestRequest,
  FindOneQuestResponse,
  QuestSuccessResponse,
  UpdateQuestRequest,
} from './dto/quest.dto';
import { QuestService } from './quest.service';

@ApiTags('quest')
@Controller('quest')
export class QuestController {
  constructor(private readonly questService: QuestService) {}

  @Get(':questId')
  @ApiResponse({ status: HttpStatus.OK, type: FindOneQuestResponse })
  async findOne(@Param('questId') id: number) {
    return await this.questService.findOneById(id);
  }

  @Get('/all/:tenantId')
  @ApiResponse({ status: HttpStatus.OK, type: FindOneQuestResponse })
  async findAll(@Param('tenantId') id: number) {
    return await this.questService.findAll(id);
  }

  @Post()
  @ApiResponse({ status: HttpStatus.OK, type: QuestSuccessResponse })
  async create(@Body(ValidationPipe) createQuest: CreateQuestRequest) {
    return this.questService.create(createQuest);
  }

  @Put()
  @ApiResponse({ status: HttpStatus.OK, type: QuestSuccessResponse })
  async update(@Body(ValidationPipe) updateQuest: UpdateQuestRequest) {
    return this.questService.update(updateQuest);
  }
}
