# loopback4-github-app

[![LoopBack](http://loopback.io/images/overview/powered-by-LB-xs.png)](http://loopback.io/)

## Goal for this project
To show how to: 
- create/expose REST APIs through controllers
- how to call GitHub APIs in a controller using `octokat` node module
- how to persist the data to a Cloudant database

## Steps 
### 1. Scaffolding an LB4 application
Run this command:
`lb4 app`

The app comes with `/ping` REST endpoint.  You can test it out by running `npm start`.  Type `http://127.0.0.1:3000/ping` in your favorite web browser and  you can see something like: 
```
{"greeting":"Hello from LoopBack",...}
```

### 2. Generating the controller for creating REST APIs. 
To do this, run this command: `lb4 controller`.

The output would be: 
```
? Controller class name: GHRepo
? What kind of controller would you like to generate? Empty Controller
   create src/controllers/gh-repo.controller.ts
```
_Note_: the class name will be suffixed with `Controller`.

### 3. Creating APIs in GHRepoController
In the newly created `GHRepoController`, we are going to create a GET endpoint `/repo/{org}/{repo}/stars` to return the number of stargazers in a given GitHub organization and repository.  

In `controllers\gh-repo.controller.ts`

### a. Creating the endpoint
First, just to make sure we can hit the endpoint correctly. 

```ts
@get('/repo/{org}/{repo}/stars') 
getRepoStargazers(
  @param.path.string('org') org: string,
  @param.path.string('repo') repo: string
): string {
  console.log('org/repo', org, repo);
  return '100';
}
```
Run `npm start` to start the application.  
Then go to a browser, type:
```
http://localhost:3000/swagger-ui
```
This will bring you to the API explorer where you can test your API.  
You should see something like below:

![Screen shot](img/screenshot-ghRepoController-apiExplorer.png)

### b. Adding logics in GHRepoController
Now, add the logics in the controller so that it is getting the number of stargazers 
for a given GitHub org and repo. 

What we have done: 
1. Use `octokat` node module as GitHub API client.
  - run `npm i --save octokat`

2. Make `getRepoStargazers` to be async

See `controllers\gh-repo.controller.ts` for code.

Restarting the app again by running `npm start`. 

![Screen shot](img/screenshot-ghRepoController-apiExplorer2.png)

### 4. Persisting data in Cloudant database
The next step is to persist the data in a database.  

### a. Defining the model 
We're defining the model for the data to be persisted in the database.
The model `GHStars` we are creating extends from a base class `Entity` and 
has the following properties:
- org: GitHub organization
- repo: GitHub repository
- stars: number of stars for the given org/repo
- countdate: date of the entry being created

See `gh-stars.model.ts` under `models` folder.


### b. Defining the datasource
We're going to declare the datasource connection through `datasources.json`. 
It is similar to what we do in LoopBack 3 for those who are familiar with the older version of LoopBack.  For details, see http://loopback.io/doc/en/lb3/Defining-data-sources.html.  

To do this, create `datasources.json` under `config` folder.  It should look something like this:
```
{
    "name": "db",
    "connector": "cloudant",
    "url": "https://someuserid:somepassword@someinstance-bluemix.cloudant.com",
    "database": "ghstars",
    "modelIndex": ""
}
```

The next step is to create DataSource `db.datasource.ts` under `datasources` folder,
which reads the `datasources.json` we just created.  
See `datasources\db.datasource.ts` for details.


### c. Creating Repository
A [Repository](http://loopback.io/doc/en/lb4/Repositories.html) is a type of Service that represents a collection of data within a DataSource. 

See code in `repositories\ghstar.repository.ts`.  

### d. Creating Controller

Run the command `lb4 controller` to create a controller.  

```
? Controller class name: GHStar
? What kind of controller would you like to generate? REST Controller with CRUD functions
? What is the name of the model to use with this CRUD repository? Gh-stars
? What is the name of your CRUD repository? GhstarRepository
? What is the type of your ID? number
   create src/controllers/gh-star.controller.ts

Controller GHStar is now created in src/controllers/
```

### e. Adding RepositoryBooter to the application
Go to `application.ts`. 
Make the application extend from `BootMixin(RepositoryMixin(RestApplication))`.
Bind the datasource.  

You can test out the application.  Restart the app. 

