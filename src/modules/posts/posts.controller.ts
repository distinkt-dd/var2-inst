import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from 'src/generated/prisma/enums';
import { CreatePostDto, UpdatePostDto } from './dto/posts.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  findAll(@Query() dto: PaginationDto) {
    return this.postsService.findAll(dto);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.postsService.findById(id);
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.AUTHOR, Role.MODERATOR)
  create(@Body() data: CreatePostDto, @Request() req) {
    return this.postsService.create(data, req.user.id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.AUTHOR, Role.MODERATOR)
  update(@Param('id') id: string, @Body() data: UpdatePostDto, @Req() req) {
    return this.postsService.update(id, data, req.user.id, req.user.role);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.AUTHOR, Role.MODERATOR)
  remove(@Param('id') id: string, @Req() req) {
    return this.postsService.delete(id, req.user.id, req.user.role);
  }
}
