import {
  BadRequestException,
  Body,
  Controller,
  Delete,
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
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ status: HttpStatus.OK, type: AllQuestResponse })
  async findAll() {
    const quests = await this.questService.findAll();
    const fmtQuests: QuestResponse[] = quests.map((q: Quests) => {
      return this.questService.fmtResponse(q);
    });

    return { quests: fmtQuests, total: fmtQuests.length };
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ status: HttpStatus.OK, type: QuestResponse })
  async create(
    @Body(ValidationPipe) createQuest: CreateQuestRequest,
    @Request() req: any,
  ) {
    const { user_id } = req.user;

    if (await this.questService.findOneByTitle(createQuest.title)) {
      throw new BadRequestException(`${createQuest.title} is already exist`);
    }

    const quest = await this.questService.create(createQuest, user_id);
    return this.questService.fmtResponse(quest);
  }

  @Put(':questId')
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ status: HttpStatus.OK, type: QuestResponse })
  async update(
    @Param('questId') id,
    @Body(ValidationPipe) updateQuest: UpdateQuestRequest,
  ) {
    const quest = await this.questService.update(id, updateQuest);
    return this.questService.fmtResponse(quest);
  }

  @Delete(':questId')
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ status: HttpStatus.OK })
  async delete(@Param('questId') id) {
    return await this.questService.delete(id);
  }
}
