import {GitHubApplication} from './application';
import {ApplicationConfig} from '@loopback/core';

export {GitHubApplication};

export async function main(options?: ApplicationConfig) {
  const app = new GitHubApplication(options);

  try {
    await app.boot();
    await app.start();
  } catch (err) {
    console.error(`Unable to start application: ${err}`);
  }
  return app;
}
