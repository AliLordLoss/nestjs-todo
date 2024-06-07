import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request } from 'express';
import { TodoService } from './todo.service';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import { CreateTodoRequestDTO } from './dto/request/create-todo.dto';
import { TodoResponseDTO } from './dto/response/todo.dto';

@ApiTags('Todo')
@Controller('/todo')
export class TodoController {
  constructor(private readonly service: TodoService) {}

  @ApiOperation({
    summary: 'Endpoint for creating new todo',
  })
  @ApiCreatedResponse({
    description: '201 status code means that the todo is successfully created!',
    type: TodoResponseDTO,
  })
  @ApiUnauthorizedResponse({
    description: '401 status code means you are not logged in!',
  })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post('/')
  async createTodo(
    @Req() req: Request & { user: { sub: number } },
    @Body() body: CreateTodoRequestDTO,
  ): Promise<TodoResponseDTO> {
    return await this.service.createTodo(
      req.user.sub,
      body.title,
      body.description,
    );
  }

  @ApiOperation({
    summary: 'Endpoint for fetching all of users todos',
  })
  @ApiOkResponse({
    description: '200 status code means that the request is successfull!',
    type: Array<TodoResponseDTO>,
  })
  @ApiUnauthorizedResponse({
    description: '401 status code means you are not logged in!',
  })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AccessTokenGuard)
  @Get('/')
  async getUserTodos(
    @Req() req: Request & { user: { sub: number } },
  ): Promise<TodoResponseDTO[]> {
    return await this.service.getUserTodos(req.user.sub);
  }

  @ApiOperation({
    summary: 'Endpoint for fetching a todo by id',
  })
  @ApiOkResponse({
    description: '200 status code means that the request is successfull!',
    type: TodoResponseDTO,
  })
  @ApiUnauthorizedResponse({
    description: '401 status code means you are not logged in!',
  })
  @ApiNotFoundResponse({
    description:
      '404 status code means that either the todo does not exist or it does not belong to the current user!',
  })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AccessTokenGuard)
  @Get('/:id')
  async getTodoById(
    @Req() req: Request & { user: { sub: number } },
    @Param('id') id: number,
  ): Promise<TodoResponseDTO> {
    return await this.service.getTodoById(req.user.sub, id);
  }

  @ApiOperation({
    summary: 'Endpoint for updating a todo by id',
  })
  @ApiOkResponse({
    description: '200 status code means that the request is successfull!',
    type: TodoResponseDTO,
  })
  @ApiUnauthorizedResponse({
    description: '401 status code means you are not logged in!',
  })
  @ApiNotFoundResponse({
    description:
      '404 status code means that either the todo does not exist or it does not belong to the current user!',
  })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AccessTokenGuard)
  @Put('/:id')
  async updateTodoById(
    @Req() req: Request & { user: { sub: number } },
    @Param('id') id: number,
    @Body() body: CreateTodoRequestDTO,
  ): Promise<TodoResponseDTO> {
    return await this.service.updateTodoById(
      req.user.sub,
      id,
      body.title,
      body.description,
    );
  }

  @ApiOperation({
    summary: 'Endpoint for deleting a todo by id',
  })
  @ApiNoContentResponse({
    description: '204 status code means that the request is successfull!',
    type: TodoResponseDTO,
  })
  @ApiUnauthorizedResponse({
    description: '401 status code means you are not logged in!',
  })
  @ApiNotFoundResponse({
    description:
      '404 status code means that either the todo does not exist or it does not belong to the current user!',
  })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/:id')
  async deleteTodoById(
    @Req() req: Request & { user: { sub: number } },
    @Param('id') id: number,
  ): Promise<void> {
    return await this.service.deleteTodoById(req.user.sub, id);
  }

  @ApiOperation({
    summary: 'Endpoint for completing a todo',
  })
  @ApiOkResponse({
    description: '200 status code means that the request is successfull!',
    type: TodoResponseDTO,
  })
  @ApiUnauthorizedResponse({
    description: '401 status code means you are not logged in!',
  })
  @ApiNotFoundResponse({
    description:
      '404 status code means that either the todo does not exist or it does not belong to the current user!',
  })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AccessTokenGuard)
  @Patch('/:id/do')
  async makeTodoDone(
    @Req() req: Request & { user: { sub: number } },
    @Param('id') id: number,
  ): Promise<TodoResponseDTO> {
    return await this.service.makeTodoDone(req.user.sub, id);
  }

  @ApiOperation({
    summary: 'Endpoint for uncompleting a todo',
  })
  @ApiOkResponse({
    description: '200 status code means that the request is successfull!',
    type: TodoResponseDTO,
  })
  @ApiUnauthorizedResponse({
    description: '401 status code means you are not logged in!',
  })
  @ApiNotFoundResponse({
    description:
      '404 status code means that either the todo does not exist or it does not belong to the current user!',
  })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AccessTokenGuard)
  @Patch('/:id/undo')
  async makeTodoUndone(
    @Req() req: Request & { user: { sub: number } },
    @Param('id') id: number,
  ): Promise<TodoResponseDTO> {
    return await this.service.makeTodoUndone(req.user.sub, id);
  }
}
