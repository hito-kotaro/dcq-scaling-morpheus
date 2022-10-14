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
  CreateTeamDto,
  FindAllTeamResponse,
  FindOneTeamResponse,
  TeamSuccessResponse,
  UpdateTeamDto,
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

  @Get('/all/:tenantId')
  @ApiResponse({ status: HttpStatus.OK, type: FindAllTeamResponse })
  async findAll(@Param('tenantId') tenantId: number) {
    return await this.teamService.findAll(tenantId);
  }

  @Post()
  @ApiResponse({ status: HttpStatus.OK, type: TeamSuccessResponse })
  create(@Body() createTeam: CreateTeamDto) {
    return this.teamService.create(createTeam);
  }

  @Put(':teamId')
  @ApiResponse({ status: HttpStatus.OK, type: TeamSuccessResponse })
  update(
    @Param('teamId') id: number,
    @Body(ValidationPipe) updateTeam: UpdateTeamDto,
  ) {
    return this.teamService.update(id, updateTeam);
  }
}
