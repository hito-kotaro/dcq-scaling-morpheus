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
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { tokenPayload } from '../auth/dto/auth.dto';
import {
  CreateTeamRequest,
  FindAllTeamResponse,
  FindOneTeamResponse,
  TeamSuccessResponse,
  UpdateTeamRequest,
} from './dto/team.dto';
import { TeamService } from './team.service';

@ApiTags('team')
@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get('/all/')
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ status: HttpStatus.OK, type: FindAllTeamResponse })
  async findAll(@Request() req: any) {
    console.log(req.user);
    return await this.teamService.findAll(req.user.tenant_id);
  }

  @Get(':teamId')
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ status: HttpStatus.OK, type: FindOneTeamResponse })
  async findOne(@Param('teamId') id): Promise<FindOneTeamResponse> {
    console.log(id);
    console.log('getOneteam');
    return await this.teamService.findOne(id);
  }

  @Post()
  @ApiResponse({ status: HttpStatus.OK, type: TeamSuccessResponse })
  create(@Body() createTeam: CreateTeamRequest) {
    return this.teamService.create(createTeam);
  }

  @Put(':teamId')
  @ApiResponse({ status: HttpStatus.OK, type: TeamSuccessResponse })
  update(
    @Param('teamId') id: number,
    @Body(ValidationPipe) updateTeam: UpdateTeamRequest,
  ) {
    return this.teamService.update(id, updateTeam);
  }
}
