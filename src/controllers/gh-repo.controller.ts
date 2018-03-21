// Uncomment these imports to begin using these cool features!
import {get, param} from "@loopback/openapi-v3";
// import {inject} from @loopback/context;
import {creds} from '../../creds';
import {GHStargazerList} from '../types/types';

const Octokat = require('octokat');

const octo = new Octokat({
  username: creds.username,
  password: creds.password
});

export class GHRepoController {
  constructor() {}

  @get('/repo/{org}/{repo}/stars') 
  async getRepoStargazers(
    @param.path.string('org') org: string,
    @param.path.string('repo') repo: string
  ): Promise<number> {
    console.log('org/repo: ', org, repo);
    const repoContent = await octo.repos(org, repo).fetch();
    return repoContent.stargazersCount;
  }
}
