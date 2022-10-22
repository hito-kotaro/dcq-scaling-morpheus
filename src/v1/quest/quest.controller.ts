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
import { Quests } from 'src/entity/quest.entity';
import {
  AllQuestResponse,
  CreateQuestRequest,
  QuestResponse,
  UpdateQuestRequest,
} from './dto/quest.dto';
import { QuestService } from './quest.service';

@ApiTags('quest')
@Controller('quest')
export class QuestController {
  constructor(private readonly questService: QuestService) {}

  @Get()
  @ApiResponse({ status: HttpStatus.OK, type: AllQuestResponse })
  async findAll(@Request() req: any) {
    const quests = await this.questService.findAll(req.user.tenant_id);
    const fmtQuests: QuestResponse[] = quests.map((q: Quests) => {
      return this.questService.fmtResponse(q);
    });

    return { quests: fmtQuests, total: fmtQuests.length };
  }

  @Post()
  @ApiResponse({ status: HttpStatus.OK, type: QuestResponse })
  async create(@Body(ValidationPipe) createQuest: CreateQuestRequest) {
    const exist = await this.questService.titleExist(
      createQuest.tenant_id,
      createQuest.title,
    );
    if (exist === true) {
      throw new BadRequestException(`${createQuest.title} is already exist`);
    }
    const quest = await this.questService.create(createQuest);
    return this.questService.fmtResponse(quest);
  }

  @Put()
  @ApiResponse({ status: HttpStatus.OK, type: QuestResponse })
  async update(@Body(ValidationPipe) updateQuest: UpdateQuestRequest) {
    const quest = await this.questService.update(updateQuest);
    return this.questService.fmtResponse(quest);
  }
}
