import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CreateIssueRequest,
  FindAllIssueResponse,
  FindOneIssueResonse,
  IssueSuccessResponse,
} from './dto/issue.dto';
import { IssueService } from './issue.service';

@ApiTags('issue')
@Controller('issue')
export class IssueController {
  constructor(private readonly issueService: IssueService) {}

  @Get(':IssueId')
  @ApiResponse({ status: HttpStatus.OK, type: FindOneIssueResonse })
  async findOne(@Param('IssueId') id: number) {
    return await this.issueService.findOne(id);
  }

  @Get('/all/:tenantId')
  @ApiResponse({ status: HttpStatus.OK, type: FindAllIssueResponse })
  async findAll(@Param('tenantId') id: number) {
    return await this.issueService.findAll(id);
  }

  @Post()
  @ApiResponse({ status: HttpStatus.OK, type: IssueSuccessResponse })
  async create(@Body(ValidationPipe) createQuest: CreateIssueRequest) {
    return this.issueService.create(createQuest);
  }

  @Delete(':IssueId')
  @ApiResponse({ status: HttpStatus.OK, type: IssueSuccessResponse })
  async delete(@Param('IssueId') id: number) {
    return await this.issueService.delete(id);
  }
}
