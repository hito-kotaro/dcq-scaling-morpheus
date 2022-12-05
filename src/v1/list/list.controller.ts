import {
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
import { Lists } from 'src/entity/list.entity';
import { AllQuestResponse } from '../quest/dto/quest.dto';
import { CreateListtRequest, UpdateListRequest } from './dto/list.dto';
import { ListService } from './list.service';

@ApiTags('list')
@Controller('list')
export class ListController {
  constructor(private readonly listService: ListService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ status: HttpStatus.OK, type: AllQuestResponse })
  async findAll() {
    return await this.listService.findAll();
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ status: HttpStatus.OK, type: Lists })
  async post(
    @Body(ValidationPipe) createList: CreateListtRequest,
    @Request() req: any,
  ) {
    return await this.listService.create(createList, req.user.name);
  }

  @Put(':listId')
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ status: HttpStatus.OK, type: Lists })
  async updadte(
    @Param('listId') id: number,
    @Body(ValidationPipe) updateRequest: UpdateListRequest,
    @Request() req: any,
  ) {
    return await this.listService.update(id, updateRequest, req.user.user);
  }

  @Delete(':listId')
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ status: HttpStatus.OK, type: Lists })
  async delete(@Param('listId') id: number) {
    return await this.listService.delete(id);
  }
}
