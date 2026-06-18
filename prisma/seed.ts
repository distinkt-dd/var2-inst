import { PrismaPg } from '@prisma/adapter-pg';
import { PostStatus, PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { Pool } from 'pg';
dotenv.config();

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('Переменная databaseUrl не найдена');
}

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: false,
  max: 20,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Начинаю заполнение базы данных...');

  const password = await bcrypt.hash('password123', 10);

  console.log('Creating users...');
  const moderator = await prisma.user.upsert({
    where: { email: 'admin@blog.com' },
    update: {},
    create: {
      email: 'admin@blog.com',
      password: password,
      role: Role.MODERATOR,
    },
  });

  const author = await prisma.user.upsert({
    where: { email: 'author@blog.com' },
    update: {},
    create: {
      email: 'author@blog.com',
      password: password,
      role: Role.AUTHOR,
    },
  });

  const reader = await prisma.user.upsert({
    where: { email: 'reader@blog.com' },
    update: {},
    create: {
      email: 'reader@blog.com',
      password: password,
      role: Role.READER,
    },
  });

  // 3. Создаем категории
  console.log('Creating categories...');
  const catTech = await prisma.category.upsert({
    where: { name: 'Technology' },
    update: {},
    create: { name: 'Technology' },
  });

  const catLife = await prisma.category.upsert({
    where: { name: 'Lifestyle' },
    update: {},
    create: { name: 'Lifestyle' },
  });

  const catCooking = await prisma.category.upsert({
    where: { name: 'Cooking' },
    update: {},
    create: { name: 'Cooking' },
  });

  console.log('Creating posts...');
  const posts: any[] = [];
  for (let i = 1; i <= 15; i++) {
    const post = await prisma.post.create({
      data: {
        title: `Статья №${i}: ${i % 2 === 0 ? 'Технологии будущего' : 'Секреты жизни'}`,
        content: `Это очень интересный контент для статьи номер ${i}. Здесь много полезной информации.`,
        status: i % 3 === 0 ? PostStatus.DRAFT : PostStatus.PUBLISHED,
        authorId: author.id,
        categoryId: i % 2 === 0 ? catTech.id : catLife.id,
      },
    });
    posts.push(post);
  }

  // 5. Добавляем комментарии
  console.log('Adding comments...');
  await prisma.comment.create({
    data: {
      text: 'Крутая статья! Спасибо за инфу.',
      postId: posts[0].id,
      userId: reader.id,
    },
  });

  await prisma.comment.create({
    data: {
      text: 'Не совсем согласен с автором, но интересно.',
      postId: posts[0].id,
      userId: moderator.id,
    },
  });


  console.log('Adding likes...');
  for (let i = 0; i < 5; i++) {
    // В реальном посеве нужны разные юзеры, но для теста создадим пару доп. юзеров или пропустим unique
    // Чтобы не нарушить @@unique([userId, postId]), создадим доп. пользователей
  }

  const extraUsers = await Promise.all(
    Array.from({ length: 5 }).map((_, i) =>
      prisma.user.create({
        data: {
          email: `user${i}@test.com`,
          password: password,
          role: Role.READER,
        },
      }),
    ),
  );

  for (const user of extraUsers) {
    await prisma.like.create({
      data: { userId: user.id, postId: posts[0].id },
    });
  }

  console.log('✅ База данных успешно заполнена!');
  console.log('--------------------------------------------------');
  console.log('Данные для входа:');
  console.log(`Moderator: admin@blog.com / password123`);
  console.log(`Author:    author@blog.com / password123`);
  console.log(`Reader:    reader@blog.com / password123`);
  console.log('--------------------------------------------------');
}

main()
  .catch((e) => {
    console.error('❌ Ошибка при посеве:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
