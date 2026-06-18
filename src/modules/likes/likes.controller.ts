import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { CreateLikesDto } from './dto/likes.dto';
import { LikesService } from './likes.service';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(@Req() req, @Body() body: CreateLikesDto) {
    return this.likesService.create(req.user.id, body.postId);
  }

  @Delete()
  @UseGuards(AuthGuard)
  async delete(@Req() req, @Body() body: { postId: string }) {
    return this.likesService.delete(req.user.id, body.postId);
  }

  @Get('post/:postId')
  async findByPost(@Param('postId') postId: string) {
    return this.likesService.findByPost(postId);
  }

  @UseGuards(AuthGuard)
  async check(@Param('postId') postId: string, @Req() req) {
    return this.likesService.checkLike(req.user.id, postId);
  }
}
