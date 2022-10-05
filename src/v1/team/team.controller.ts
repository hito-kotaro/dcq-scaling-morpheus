import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CreateTeamDto,
  FindAllTeamResponse,
  FindOneTeamResponse,
  TeamSuccessResponse,
} from './dto/team.dto';
import { TeamService } from './team.service';

@ApiTags('team')
@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get(':teamId')
  @ApiResponse({ status: HttpStatus.OK, type: FindOneTeamResponse })
  async findOne(@Param('tenantId') id): Promise<FindOneTeamResponse> {
    return await this.teamService.findOne(id);
  }

  @Get()
  @ApiResponse({ status: HttpStatus.OK, type: FindAllTeamResponse })
  async findAll() {
    return await this.teamService.findAll();
  }

  @Post()
  @ApiResponse({ status: HttpStatus.OK, type: TeamSuccessResponse })
  create(@Body() createTeam: CreateTeamDto) {
    return this.teamService.create(createTeam);
  }
}
