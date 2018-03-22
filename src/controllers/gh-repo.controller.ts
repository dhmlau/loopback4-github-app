import {get, post, param} from "@loopback/openapi-v3";
import {creds} from '../../creds';
import {GHStargazerList} from '../types/types';
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
  let octoRepo = octo.repos(org, repo);
  return await octoRepo.stargazers.fetch().then((content:GHStargazerList) => {
    /*
     * the github api paginates the stargazer results,
     * so we're using a recursive function to get the total number count. 
     */
    return this.getStarCount(content.items.length, content.nextPageUrl);
  });
}

/**
   * Get the GitHub star count
   * and persist the value in a database
   */
  @post('/repo/{org}/{repo}/stars') 
  async storeRepoStargazers(
    @param.path.string('org') org: string,
    @param.path.string('repo') repo: string
  ): Promise<void> {
    console.log('org/repo', org, repo);
    let octoRepo = octo.repos(org, repo);
    return await octoRepo.stargazers.fetch().then((content:GHStargazerList) => {
      /*
       * the github api paginates the stargazer results,
       * so we're using a recursive function to get the total number count. 
       */
      this.getStarCount(content.items.length, content.nextPageUrl).then((starNum:number)=> {
        let ghStar = new GHStars();
        ghStar.org = org;
        ghStar.repo = repo;
        ghStar.countdate = new DateType().defaultValue();
        ghStar.stars = starNum;
        this.ghstarRepository.create(ghStar);
      });
    });
  }


/**
 * Recursive function to get the GitHub stars
 * @param count 
 * @param url 
 */
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
