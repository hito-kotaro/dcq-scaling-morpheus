import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponse {
  @ApiProperty({ type: String })
  message: string;

  @ApiProperty({ type: String })
  error: string;

  @ApiProperty({ type: Number })
  statusCode: number;
}

export class BadRequestResponse {
  @ApiProperty({ type: String, example: 'already exist' })
  message: string;

  @ApiProperty({ type: String, example: 'Bad Request' })
  error: string;

  @ApiProperty({ type: Number, example: 400 })
  statusCode: number;
}

export class NotFoundResponse {
  @ApiProperty({ type: String, example: 'resource could not found' })
  message: string;

  @ApiProperty({ type: String, example: 'Not Found' })
  error: string;

  @ApiProperty({ type: Number, example: 404 })
  statusCode: number;
}

export class UnAuthorizedResponse {
  @ApiProperty({ type: String, example: 'UnAuthorized' })
  message: string;

  @ApiProperty({ type: String, example: 'Un Authorized' })
  error: string;

  @ApiProperty({ type: Number, example: 401 })
  statusCode: number;
}

export class UnProcessableEntityResponse {
  @ApiProperty({ type: String, example: 'UnProcessableEntityResponse ' })
  message: string;

  @ApiProperty({ type: String, example: 'UnPropcessableentityResponse' })
  error: string;

  @ApiProperty({ type: Number, example: 422 })
  statusCode: number;
}
