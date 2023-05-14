import { MigrationInterface, QueryRunner, Repository } from 'typeorm';
import { AuthorsEntity } from '../../src/authors/entities/authors.entity';
import { faker } from '@faker-js/faker';
import { RecordsEntity } from '../../src/records/entities/records.entity';

export class Seed1684087096757 implements MigrationInterface {
  name = 'Seed1684087096757';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const authorsRepository: Repository<AuthorsEntity> =
      queryRunner.connection.getRepository(AuthorsEntity);
    const recordsRepository: Repository<RecordsEntity> =
      queryRunner.connection.getRepository(RecordsEntity);

    const author = await authorsRepository.create({
      login: faker.internet.userName(),
      password: faker.internet.password(),
      username: faker.internet.userName(),
    });

    await authorsRepository.save(author);

    for (let i = 0; i < 10; i++) {
      const record = await recordsRepository.create({
        authorId: author.id,
        message: faker.lorem.text(),
      });
      await recordsRepository.save(record);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
