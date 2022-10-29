import { Roles } from 'src/entity/role.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Roles)
export class RolesRepository extends Repository<Roles> {
  async getRoles(id: number): Promise<Roles> {
    return await this.findOne({ where: { id } });
  }
}
