import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CategoriesDto } from './dto/categories.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll() {
    return this.prismaService.category.findMany();
  }

  async findById(id: string) {
    const category = await this.prismaService.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Категория не найдена!');
    }
    return category;
  }

  async create(dto: CategoriesDto) {
    return this.prismaService.category.create({ data: dto });
  }

  async update(id: string, dto: CategoriesDto) {
    await this.findById(id);
    return this.prismaService.category.update({ where: { id }, data: dto });
  }

  async delete(id: string) {
    await this.findById(id);
    return this.prismaService.category.delete({ where: { id } });
  }
}
