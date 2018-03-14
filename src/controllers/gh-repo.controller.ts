// Uncomment these imports to begin using these cool features!
import {get, param} from "@loopback/openapi-v3";
// import {inject} from @loopback/context;


export class GHRepoController {
  constructor() {}

  @get('/repo/{org}/{repo}/stars') 
    getRepoStargazers(
      @param.path.string('org') org: string,
      @param.path.string('repo') repo: string
    ): string {
      console.log('org/repo', org, repo);
      return '100';
    }
}
