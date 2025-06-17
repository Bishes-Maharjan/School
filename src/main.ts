import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, //transforms the type, typecasting
      whitelist: true, //only allows values in the dto
      forbidNonWhitelisted: true, // throws an error if sum values are not in the dto
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('School database api')
    .setDescription(
      `The School Database Api.<br> Used a <b>dummy header</b> according to the assignment. <br>
       Due to needing only specified fields in the tables didnt opt for authentication and authorization the normal singin and signup way. <br>
       pass <code>'teacher'</code> in the x-role header to access routes according to the assignment questions. <br>
       In order to create a teacher , one can go to the <code> /api/assignment </code> <br>
       there a teacher will be created along with a subject and a class if not already there. <br>
       same with the create  user api, the class is created if it doesnt exist intead of throwing an error.<br>
        I made it so that it would be easier to test the functionality of asked enpoints to be created in the assignment given to me without deploying other additional endpoints`,
    )
    .setVersion('1.0')
    .addTag('school')

    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, documentFactory);
  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
