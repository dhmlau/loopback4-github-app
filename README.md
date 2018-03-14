# loopback4-github-app

[![LoopBack](http://loopback.io/images/overview/powered-by-LB-xs.png)](http://loopback.io/)

## Goal for this project
The goal of this project is to show how to use LoopBack 4 to: 
- create REST APIs
- how to call GitHub REST APIs using `octokat` node module
- how to persist the data to a [Cloudant](https://console.bluemix.net/catalog/services/cloudant-nosql-db) database

The LoopBack 4 application created in this repo is to get the number of stargazers for a given GitHub repo and store it in a database.  

## Steps 
### 1. Scaffolding an LB4 application
We are using the command-line interface to scaffold an LB4 application.  For other commands, refer to the [command-line interfaces documentation](http://loopback.io/doc/en/lb4/Command-line-interface.html).
Run the following command:

```lb4 app```

The app comes with `/ping` REST endpoint.  You can test it out by running `npm start`.  
Type `http://127.0.0.1:3000/ping` in your favorite web browser and the output will look like this:
```
{"greeting":"Hello from LoopBack",...}
```

### 2. Generating the controller for creating REST APIs. 
A [Controller](http://loopback.io/doc/en/lb4/Controllers.html) is where you implement the business logics.  Run the following command to create a controller:

```lb4 controller```

The output would be: 
```
? Controller class name: GHRepo
? What kind of controller would you like to generate? Empty Controller
   create src/controllers/gh-repo.controller.ts
```
_Note_: the class name will be suffixed with `Controller`.

### 3. Creating APIs in GHRepoController
In the newly created `GHRepoController`, we are going to create a GET endpoint `/repo/{org}/{repo}/stars` to return the number of stargazers in a given GitHub organization and repository.  

**a. Creating the endpoint**
In `controllers\gh-repo.controller.ts`, add the following function: 

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
Before adding more logics, let's test the API first.  
Run the command `npm start` to start the application.  
Then go to a browser, type:
```
http://localhost:3000/swagger-ui
```
This will bring you to the API explorer where you can test your API.  
Try out the newly added REST API Under `GHRepoController`.

![Screen shot](img/screenshot-ghRepoController-apiExplorer.png)

### b. Adding logics in GHRepoController
Now, edit the controller to get the number of stargazers for a given GitHub org and repo. 
See `controllers\gh-repo.controller.ts` for details.

What we have done: 
1. Use `octokat` node module as GitHub API client.
Install `octokat` module by running:

    ```npm i --save octokat```

2. Make `getRepoStargazers` to be async.

Restarting the app again by running `npm start`. 

![Screen shot](img/screenshot-ghRepoController-apiExplorer2.png)

### 4. Persisting data in Cloudant database
The next step is to persist the data in a database.  

**a. Defining the model**

The model is created in `models\gh-stars.model.ts`.

We're defining the model for the data to be persisted in the database.
The model `GHStars` we are creating extends from a base class `Entity` and 
has the following properties:
- org: GitHub organization
- repo: GitHub repository
- stars: number of stars for the given org/repo
- countdate: date of the entry being created

**b. Defining the datasource**

We're going to declare the datasource connection through `datasources.json`. 
It is similar to what we do in LoopBack 3 for those who are familiar with the older version of LoopBack.  For details, see http://loopback.io/doc/en/lb3/Defining-data-sources.html.  

To do this, create `config\datasources.json`.  The sample below is using Cloudant:
```
{
    "name": "db",
    "connector": "cloudant",
    "url": "https://someuserid:somepassword@someinstance-bluemix.cloudant.com",
    "database": "ghstars",
    "modelIndex": ""
}
```

The next step is to create a DataSource class `datasources\db.datasource.ts`,
which reads the `datasources.json` we just created.  
See `datasources\db.datasource.ts` for details.


**c. Creating Repository**

A [Repository](http://loopback.io/doc/en/lb4/Repositories.html) is a type of Service that represents a collection of data within a DataSource. 

See code in `repositories\ghstar.repository.ts`.  

**d. Creating Controller**

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

**e. Adding RepositoryBooter to the application**

Go to `application.ts`. 
Make the application extend from `BootMixin(RepositoryMixin(RestApplication))`.
Bind the datasource.  

### 5. Putting things together
So far, we have tried that we can get stargazer information from REST API in GHRepoController,
and also can persist data through GHStarController.  
Now, we are going to create a POST endpoint `/repo/{org}/{repo}/stars` that put the two
actions together. 

See `storeRepoStargazers` function in `controllers\gh-repo.controller.ts`.  

### 5. Runnning end-to-end
After restarting the application, go to the API explorer `localhost:3000/swagger-ui`.  Expand `GHRepoController`, and select `/repo/{org}/{repo}/stars`.  Type in the `org` and `repo` that you'd like to know about the number of stargazers.  

After running it, you should see an entry in the Cloudant database look like:
```
{
  "_id": "3b73f14ba69e384b2f71dbf15d399ae5",
  "_rev": "1-1720cc83dd77d10197c9ce25ae1aa7d5",
  "org": "strongloop",
  "repo": "loopback-next",
  "stars": 523,
  "countdate": "Wed Mar 14 2018 13:38:30 GMT-0400 (EDT)",
  "loopback__model__name": "GHStars"
}
```
