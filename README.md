# loopback4-github-app

[![LoopBack](http://loopback.io/images/overview/powered-by-LB-xs.png)](http://loopback.io/)

## Goal for this project
To show how to: 
- create/expose REST APIs through controllers
- how to call GitHub APIs in a controller using `octokat` node module
- how to persist the data to a Cloudant database

## Steps 
### 1. Scaffold an LB4 application
Run this command:
`lb4 app`

The app comes with `/ping` REST endpoint.  You can test it out by running `npm start`.  Type `http://127.0.0.1:3000/ping` in your favorite web browser and  you can see something like: 
```
{"greeting":"Hello from LoopBack",...}
```

### 2. Generate the controller for creating REST APIs. 
To do this, run this command: `lb4 controller`.

The output would be: 
```
? Controller class name: GHRepo
? What kind of controller would you like to generate? Empty Controller
   create src/controllers/gh-repo.controller.ts
```
_Note_: the class name will be suffixed with `Controller`.

### 3. Create APIs in GHRepoController
In the newly created `GHRepoController`, we are going to create a GET endpoint `/repo/{org}/{repo}/stars` to return the number of stargazers in a given GitHub organization and repository.  

In `controllers\gh-repo.controller.ts`
```
```


