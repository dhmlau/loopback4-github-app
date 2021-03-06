import {get, post, param} from "@loopback/openapi-v3";
import {creds} from '../../creds';
import {GHStars} from "../models/gh-stars.model";
import {DateType, repository} from "@loopback/repository";
import {GHStarRepository} from '../repositories/ghstar.repository';
import {inject} from '@loopback/context';
import {db} from '../datasources/db.datasource';

const debug = require('debug')('gh-repo');
const Octokat = require('octokat');

const octo = new Octokat(creds);

export class GHRepoController {
  constructor(
    @repository(GHStars, db)
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
  debug('org/repo: ', org, repo);
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
    console.debug('org/repo', org, repo);
    //gets the number of stargazers for a given GitHub repo
    const repoContent = await octo.repos(org, repo).fetch();
    const stargazerNum = repoContent.stargazersCount;
    //stores the information to database
    const ghStar = new GHStars();
    ghStar.org = org;
    ghStar.repo = repo;
    ghStar.countdate = new DateType().defaultValue();
    ghStar.stars = stargazerNum;
    return await this.ghstarRepository.create(ghStar);
  }
}
