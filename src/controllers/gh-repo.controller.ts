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
  ): Promise<string> {
    console.log('org/repo: ', org, repo);
    let octoRepo = octo.repos(org, repo);
    return await octoRepo.stargazers.fetch().then((content:GHStargazerList) => {
      /*
       * the github api paginates the stargazer results,
       * so we're using a recursive function to get the total number count. 
       */
      return this.getStarCount(content.items.length, content.nextPageUrl);
    });
  }
  
  async getStarCount(count:number, url: string): Promise<number> {
    return await octo.fromUrl(url).fetch().then((content:GHStargazerList) => {
      let newCount = count + content.items.length;
  
      if (content.nextPageUrl != undefined) {
        return this.getStarCount(newCount, content.nextPageUrl);
      } else {
        return newCount;
      }
    });
  }
}
