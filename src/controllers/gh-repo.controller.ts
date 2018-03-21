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
    const octoRepo = octo.repos(org, repo);
    const content = await octoRepo.stargazers.fetch();
    return this._getStarCount(content.items.length, content.nextPageUrl);
  }
  
  async _getStarCount(count:number, url: string): Promise<number> {
    const content = await octo.fromUrl(url).fetch();
    const newCount = count + content.items.length;
    if (content.nextPageUrl != undefined) {
      return await this._getStarCount(newCount, content.nextPageUrl);
    } else {
      return newCount;
    }
  }
}
