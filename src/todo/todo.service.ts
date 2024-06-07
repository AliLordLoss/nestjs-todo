import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from 'src/db/entities/Todo';
import { TodoResponseDTO } from './dto/response/todo.dto';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>,
  ) {}

  public async createTodo(
    userId: number,
    title: string,
    description: string,
  ): Promise<TodoResponseDTO> {
    const todo = new Todo(title, description, userId);
    await this.todoRepository.save(todo);
    return {
      id: todo.id,
      title: todo.title,
      description: todo.description,
      done: todo.done,
    };
  }

  public async getUserTodos(userId: number): Promise<TodoResponseDTO[]> {
    const todos = await this.todoRepository.find({
      where: { userId },
    });
    return todos.map((todo) => ({
      id: todo.id,
      title: todo.title,
      description: todo.description,
      done: todo.done,
    }));
  }

  public async getTodoById(
    userId: number,
    todoId: number,
  ): Promise<TodoResponseDTO> {
    const todo = await this.getTodoOr404(userId, todoId);

    return {
      id: todo.id,
      title: todo.title,
      description: todo.description,
      done: todo.done,
    };
  }

  public async updateTodoById(
    userId: number,
    todoId: number,
    title: string,
    description: string,
  ): Promise<TodoResponseDTO> {
    const todo = await this.getTodoOr404(userId, todoId);
    todo.title = title;
    todo.description = description;
    await this.todoRepository.save(todo);

    return {
      id: todo.id,
      title: todo.title,
      description: todo.description,
      done: todo.done,
    };
  }

  public async deleteTodoById(userId: number, todoId: number): Promise<void> {
    const todo = await this.getTodoOr404(userId, todoId);
    await this.todoRepository.delete(todo);
  }

  public async makeTodoDone(
    userId: number,
    todoId: number,
  ): Promise<TodoResponseDTO> {
    const todo = await this.getTodoOr404(userId, todoId);
    if (!todo.done) {
      todo.done = true;
      await this.todoRepository.save(todo);
    }

    return {
      id: todo.id,
      title: todo.title,
      description: todo.description,
      done: todo.done,
    };
  }

  public async makeTodoUndone(
    userId: number,
    todoId: number,
  ): Promise<TodoResponseDTO> {
    const todo = await this.getTodoOr404(userId, todoId);
    if (todo.done) {
      todo.done = false;
      await this.todoRepository.save(todo);
    }

    return {
      id: todo.id,
      title: todo.title,
      description: todo.description,
      done: todo.done,
    };
  }

  private async getTodoOr404(userId: number, todoId: number) {
    const todo = await this.todoRepository.findOne({
      where: { id: todoId, userId },
    });
    if (!todo) {
      throw new NotFoundException(
        'The todo you are looking for does not exist!',
      );
    }
    return todo;
  }
}
