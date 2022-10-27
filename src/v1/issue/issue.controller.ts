import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Issues } from 'src/entity/issue.entity';
import {
  AllIssueResponse,
  CreateIssueRequest,
  IssueResponse,
} from './dto/issue.dto';
import { IssueService } from './issue.service';

@ApiTags('issue')
@Controller('issue')
export class IssueController {
  constructor(private readonly issueService: IssueService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ status: HttpStatus.OK, type: AllIssueResponse })
  async findAll(@Request() req: any): Promise<AllIssueResponse> {
    const issues = await this.issueService.findAll(req.user.tenant_id);
    const fmtIssues: IssueResponse[] = issues.map((i: Issues) => {
      return this.issueService.fmtResponse(i);
    });

    return { issues: fmtIssues, total: fmtIssues.length };
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ status: HttpStatus.OK, type: IssueResponse })
  async create(
    @Body(ValidationPipe) createIssue: CreateIssueRequest,
    @Request() req: any,
  ): Promise<IssueResponse> {
    const issue = await this.issueService.create(
      req.user.tenant_id,
      req.user.user_id,
      createIssue,
    );

    return this.issueService.fmtResponse(issue);
  }
}
