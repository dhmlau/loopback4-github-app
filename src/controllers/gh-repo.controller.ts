import {get, post, param} from "@loopback/openapi-v3";
import {creds} from '../../creds';
import {GHStars} from "../models/gh-stars.model";
import {DateType} from "@loopback/repository";
import {GHStarRepository} from '../repositories/ghstar.repository';
import {inject} from '@loopback/context';

const Octokat = require('octokat');

const octo = new Octokat({
  username: creds.username,
  password: creds.password
});

export class GHRepoController {
  constructor(
    @inject('repositories.GHStarRepository')
    public ghstarRepository : GHStarRepository,) {}


/**
 * Get the number of the stargazers 
 * in a given GitHub repo
 */
@get('/repo/{org}/{repo}/stars') 
async getRepoStargazers(
  @param.path.string('org') org: string,
  @param.path.string('repo') repo: string
): Promise<string> {
  console.log('org/repo: ', org, repo);
  const repoContent = await octo.repos(org, repo).fetch();
  return repoContent.stargazersCount;
}

/**
   * Get the GitHub star count
   * and persist the value in a database
   */
  @post('/repo/{org}/{repo}/stars') 
  async storeRepoStargazers(
    @param.path.string('org') org: string,
    @param.path.string('repo') repo: string
  ): Promise<GHStars> {
    console.log('org/repo', org, repo);
    const repoContent = await octo.repos(org, repo).fetch();
    const stargazerNum = repoContent.stargazersCount;
    const ghStar = new GHStars();
    ghStar.org = org;
    ghStar.repo = repo;
    ghStar.countdate = new DateType().defaultValue();
    ghStar.stars = stargazerNum;
    return await this.ghstarRepository.create(ghStar);
  }
}
