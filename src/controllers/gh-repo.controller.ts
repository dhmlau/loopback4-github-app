import { get, param } from "@loopback/openapi-v3";

// Uncomment these imports to begin using these cool features!

// import {inject} from @loopback/context;


export class GHRepoController {
  constructor() {}


/**
 * Get the number of the stargazers 
 * in a given GitHub repo
 */
@get('/repo/{org}/{repo}/stars') 
getRepoStargazers(
  @param.path.string('org') org: string,
  @param.path.string('repo') repo: string
): string {
  return '100';
}

}
