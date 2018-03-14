import {Filter, Where} from '@loopback/repository';
import {
  post,
  param,
  get,
  put,
  patch,
  del,
  requestBody
} from '@loopback/openapi-v3';
import {inject} from '@loopback/context';
import {GHStars} from '../models';
import {GHStarRepository} from '../repositories';

export class GHStarController {

  constructor(
    @inject('repositories.GHStarRepository')
    public ghstarRepository : GHStarRepository,
  ) {}

  @post('/ghStars')
  async create(@requestBody() obj: GHStars)
    : Promise<GHStars> {
    return await this.ghstarRepository.create(obj);
  }

  @get('/ghStars/count')
  async count(@param.query.string('where') where: Where) : Promise<number> {
    return await this.ghstarRepository.count(where);
  }

  @get('/ghStars')
  async find(@param.query.string('filter') filter: Filter)
    : Promise<GHStars[]> {
      return await this.ghstarRepository.find(filter);
  }

  @patch('/ghStars')
  async updateAll(@param.query.string('where') where: Where,
    @requestBody() obj: GHStars) : Promise<number> {
      return await this.ghstarRepository.updateAll(where, obj);
  }

  @del('/ghStars')
  async deleteAll(@param.query.string('where') where: Where) : Promise<number> {
    return await this.ghstarRepository.deleteAll(where);
  }

  @get('/ghStars/{id}')
  async findById(@param.path.number('id') id: number) : Promise<GHStars> {
    return await this.ghstarRepository.findById(id);
  }

  @patch('/ghStars/{id}')
  async updateById(@param.path.number('id') id: number, @requestBody()
   obj: GHStars) : Promise<boolean> {
    return await this.ghstarRepository.updateById(id, obj);
  }

  @del('/ghStars/{id}')
  async deleteById(@param.path.number('id') id: number) : Promise<boolean> {
    return await this.ghstarRepository.deleteById(id);
  }
}
