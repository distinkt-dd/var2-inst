import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CategoryEntity } from 'src/entities/category.entity';
import { Role } from 'src/generated/prisma/enums';
import { CategoriesService } from './categories.service';
import { CategoriesDto } from './dto/categories.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiOperation({
    summary: 'Получить категории',
    description: 'Создан для получения всех категорий из БД!',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [CategoryEntity],
  })
  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @ApiOperation({
    summary: 'Получить категорию по id',
    description: 'Создан для получения каегории по её ID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CategoryEntity,
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'id категории',
  })
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.categoriesService.findById(id);
  }

  @ApiOperation({
    summary: 'Создать категорию',
    description: 'Создан для того, чтобы создавать новую категорию!',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CategoryEntity,
    description: 'Возвращает объект категории!',
  })
  @ApiBearerAuth()
  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.MODERATOR)
  create(@Body() dto: CategoriesDto) {
    return this.categoriesService.create(dto);
  }

  @ApiOperation({
    summary: 'Обновить категорию!',
    description: 'Создан для того, чтобы обновлять категории',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CategoryEntity,
    description: 'Возвращает объект категории!',
  })
  @ApiBearerAuth()
  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.MODERATOR)
  update(@Param('id') id: string, @Body() dto: CategoriesDto) {
    return this.categoriesService.update(id, dto);
  }

  @ApiOperation({
    summary: 'Удалить категорию!',
    description: 'Создан для того, чтобы удалить категорию',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CategoryEntity,
    description: 'Возвращает объект категории!',
  })
  @ApiBearerAuth()
  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.MODERATOR)
  remove(@Param('id') id: string) {
    return this.categoriesService.delete(id);
  }
}
