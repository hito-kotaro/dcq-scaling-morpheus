import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Request,
  Post,
  Put,
  UseGuards,
  ValidationPipe,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  TeamResponse,
  AllTeamResponse,
  CreateTeamRequest,
  UpdateTeamRequest,
} from './dto/team.dto';
import { TeamService } from './team.service';

@ApiTags('team')
@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ status: HttpStatus.OK, type: AllTeamResponse })
  async findAll(@Request() req: any): Promise<AllTeamResponse> {
    const teams = await this.teamService.findAllByTenantId(req.user.tenant_id);
    const fmtTeams: TeamResponse[] = [];
    for (const t of teams) {
      fmtTeams.push(await this.teamService.fmtResponse(t));
    }

    return { teams: fmtTeams, total: fmtTeams.length };
  }

  // @Get(':teamId')
  // @UseGuards(AuthGuard('jwt'))
  // @ApiResponse({ status: HttpStatus.OK, type: TeamResponse })
  // async findOne(@Param('teamId') id): Promise<TeamResponse> {
  //   const team = await this.teamService.findOne(id);
  //   return await this.teamService.fmtResponse(team);
  // }

  @Post()
  @ApiResponse({ status: HttpStatus.OK, type: TeamResponse })
  async create(@Body() createTeam: CreateTeamRequest): Promise<TeamResponse> {
    if (await this.teamService.teamExist(createTeam.name)) {
      throw new BadRequestException('already exist');
    }
    const team = await this.teamService.create(createTeam);
    return await this.teamService.fmtResponse(team);
  }

  @Put(':teamId')
  @ApiResponse({ status: HttpStatus.OK, type: TeamResponse })
  async update(
    @Param('teamId') id: number,
    @Body(ValidationPipe) updateTeam: UpdateTeamRequest,
  ): Promise<TeamResponse> {
    const team = await this.teamService.update(id, updateTeam);
    return await this.teamService.fmtResponse(team);
  }
}
