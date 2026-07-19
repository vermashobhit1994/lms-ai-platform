## Day 1 - 2026-07-12

**Target** <br>
Repo setup, monorepo/folder structure, Docker Compose (Postgres, Redis), CI skeleton

**Hours worked:** 7.5 hours<br>

8:30AM - 9:00PM (3hrs)<br>
- understand project requirements document and create and creating project structure

9:00AM - 9:30AM
- break<br>

9:30AM - 12:00PM - (2.5hrs) <br>
- create project structure by understand project requirements

1:00PM - 3:00PM (2hrs) <br>
- create project structure by understand project requirements

3:00PM - 6:00PM <br>
- attend meeting + writing questions to be asked

6:00PM - 7:30PM <br>
- attend meeting

7:30PM - 8:38PM <br>
- break

8:38PM - 10:05PM <br>
- break

**What I did:**

- Repo setup by

    1. create README file by understanding project requirements document
    2. create LICENSE file by understanding  project requirements document
    3. create file for environment variables
    4. create gitignore file
    5. log file
    6. requirements file for functional and non-functional requirements

- Docker compose
    1. create folder structure and empty docker-compose.yml file for Postgres and Reddis

- CI Skeleton
    1. create folder structure and empty files for CI skeleton using Github Actions


**What I learned:**
1. How to structure README file
2. format for commit message
3.  How to edit latest commit message?
4. How to rebase commits messages and then push to github


**Blockers / what I'm stuck on:**
1. Whether to put all folders and files as described in folder structure,
   or put it as I build project feature by feature



**Plan for tomorrow:**
1. Database schema migration scripts for users/roles/courses/modules/lectures
2. delete REQUIREMENTS.md file and put Project requirements file  in
   prd.md
3. create product architecture and put in architecture.md
4. create monorepo for frontend and backend
5. create and understand project folder structure for frontend, backend,
   AI integration, docker compose, CI skeleton



## Day 2 - 2026-07-13
**Target**
- Database schema migration scripts for users/roles/courses/modules/lectures

**Hours worked:** 6


**What I did:**
1. understand database design from scratch.
2. installed necessary software to understand database design

**What I learned:**


**Blockers / what I'm stuck on:**
1. understand database design concepts and why each table is created and why fields
   is taken and why relationship is taken?
2. how to write migration scripts for entities?


**Plan for tomorrow:**
1. Database schema migration scripts for users/roles/courses/modules/lectures
2. delete REQUIREMENTS.md file and put Project requirements file  in
   prd.md
3. create product architecture and put in architecture.md
4. create monorepo for frontend and backend
5. create and understand project folder structure for frontend, backend,
   AI integration, docker compose, CI skeleton


## Day 3 - 2026-07-14
**Target**
1. understand database schema design and how it relate to requirements and scope of product

**Hours worked:** 2 hour 7min


12:28PM - 13:41PM (1 hour 13 min)<br>
- reading and understanding product requirement document
features of product, current LMS problems, business goals for product,
what're metrics that define success of product, architecture used,
architecture patterns used, summary(scope) of product, additional features
for product, user personas for different types of users


13:41PM - 13:46PM (5min)<br>
- writing about what I've learnt


13:46PM - 13:51PM (5min)<br>
- break


13:51PM - 14:11PM (20min)<br>
- reading and understanding product requirements document
understand functional requirements


14:11PM - 14:27PM (16min)<br>
- break

14:27PM - 13:46PM
- break


13:46PM - 16:55PM (8min)<br>
- implement auth feature

16:55PM - 18:00PM
- break



**What I did:**
1. creating Database migrations scripts and seeders file for user auth feature
2. test Database using psql


**What I learned:**
1. understand Database design completely isn't possible so, understand it feature by
   feature when implementing it.
2. how to create branch in github while pushing changes
3. difference between migrations and seeders

**Blockers / what I'm stuck on:**
1. Decision of when to select framework for database scheme migration scripts.
2. how to implement user auth feature using **node.js** by break down into steps for
   1. database entities(including database design)
   2. registration of user
   3. login of user
   4. JWT token issuance
   5. refresh token
   6. RBAC middleware

**Plan for tomorrow:**

#### Priority 0 <br>
- implement user auth feature using **node.js** for
   1. registration of user
   2. login of user
   3. JWT token issuance
   4. refresh token
   5. RBAC middleware

- also link it to Database
- understand why behind database schema design

#### Priority 1 <br>
- Database schema migration scripts for
   1. roles
   2. courses
   3. modules
   4. lectures

- understand why behind database schema design

#### Priority 2 <br>
- Course CRUD APIs + catalog listing/filtering, pagination

#### Priority 3 <br>
- delete REQUIREMENTS.md file and put Project requirements file in prd.md

#### Priority 4 <br>
- create product architecture and put in architecture.md

#### Priority 5 <br>
- create monorepo for frontend and backend

#### Priority 6 <br>
- create and understand project folder structure for frontend, backend,
             AI integration, docker compose, CI skeleton


## Day 4 - 2026-07-15
**Target**


**Hours worked:** 4hr 61 min

4:08AM - 4:30AM (22min)
- writing DEVLOG for yesterday

4:30AM - 5:53AM (23min)
- resolving commit message rewrite issues in remote branch in git

5:53AM - 8:14AM (39min)
- implemtation of auth backend
- refresh token database schema
- testing CRUD operations on database schema using sql commands

9:15AM -11:08AM (1hr 45min + 8min)
- creating script for creating database and testing it

11:08AM - 12:00PM (52min)
- writing scripts for testing Database

12:00PM - 12:28PM (28min)
- implement auth module

12:28PM - 13:34PM (7min)
- break


**What I did:**
1. writing scripts to create database and run all database migration scripts
2. writing test database migration scripts to test users, roles, refresh tokens migration scripts
3. scaffholding backend monorepo to implement auth using pnpm package manager and
   installing below dependencies and corresponding supporting types for typescript
   1. express
   2. pg
   3. argon2
   4. jose
   5. zod
   6. helmet
   7. cors
   8. express-rate-limit
   9. winston
   10. dotenv

   scaffholding backend monorepo with environment variables and its corresponding configuration
   files, logger files, database pool and migrate files, app file, server file


**What I learned:**
1. giving control to cursor for logs will delete some of logs in order to achieve result,
   don't provide any control and only used in ask mode.
2. move to next step only when previous step completed

**Blockers / what I'm stuck on:**
1. control flow from server.ts file to app.ts file to logger.ts file to pool.ts file to
   migrate.ts file
2. what is 2nd feature to be implement

**Plan for tomorrow:**

#### Feature 1 - Auth
1. correct git log history and including database seeder scripts
2. understanding control flow from server.ts file to database files
3. understand JWT access tokens, refresh tokens, RBAC middleware, database refresh tokens
   and how it's linked to when register and login user
4. implement APIs for Auth
5. scaffhold frontend for Auth with routing, layout, auth pages, protected routes

#### implement feature 2 - course

course includes
  - course catalog
  - enroll course
  - create course

1. database migration scripts and seeder scripts for courses -> modules -> lectures
2. user can browse course catalog
   - listing, filtering, pagination
3. user can enroll in course
4. instructor create course
5. APIs
   - courses API
   -  enrollment & Progress


## Day 5 - 2026-07-16

**Target**

1. finish Auth feature from backend to frontend with no UI
2. decide feature 2 and implement its backend and frontend with no UI


**Hours worked:**

6:08AM - 7:30AM <br>
- finding problem in git log due to AI use
- writing task done yesterday and task to be done today

7:30AM - 7:46AM <br>
- duration of working hours for yesterday

7:46AM - 8:00AM <br>
- fixing formatting issues in DEVLOG.md and removing trailing whitespaces

8:00AM - 8:15AM <br>
- implement seeder for user_roles in sql

8:15AM - 8:40AM <br>
- break

8:40AM - 9:22AM<br>
- correct git log issues

9:22AM - 11:30AM
- sleeping

11:30AM - 11:43AM
- health related work
- laptop setup

11:43AM - 11:55AM
- how to view force push in github and view files in some snapshot

11:55AM - 1:30PM - work

1:30PM - 2:00PM - lunch
2:00PM - 9:00PM - work

9:00PM - 11:00PM - half focused work

**What I did:**
1. implement server in express
2. connect postgres database before starting server.

**What I learned:**

**Blockers / what I'm stuck on:**
1. control flow of implementation of auth from frontend to backend to database.


**Plan for tomorrow:**
1. Make a ppt which explain full control flow of implementation of auth from  frontend to backend to database.
2. implement UI for auth (register and login)


## Day 6 - 2026-07-17
**Target**


**Hours worked:** 5hr 35min

7:32AM - 7:41AM (9min) - writing task done yesterday

7:41AM - 7:47AM (6min) - pushing changes

7:47AM - 8:40AM (53min) - reading about JWT from documentation

8:40AM - 9:28AM (50min) - household work

9:28AM - 11:51AM (2hr 23min) - reading about JWT and decision of which library to choose to implement JWT

11:51AM - 13:22PM - break

14:19PM - 16:00PM - break

16:00PM - 18:30PM - meeting

18:30PM - 20:00PM - food + household work

20:00PM - 21:00PM - create frontend and link it to backend for login

21:00PM - 12:30AM - timepass on mobile by watching youtube videos



**What I did:**
1. read about JWT from official documentation and decide
   which modules to use for it.
2. linking frontend and backend for login

**What I learned:**
1. How JWT works?
2. what is use of name attribute in react form element and why it's used?


**Blockers / what I'm stuck on:**
1. linking frontend, backend, database design, api, folder structure,

**Plan for tomorrow:**
1. How below requirement link from frontend to backend(including api) to database design to implementation via folder structure ,
    "user register and login via email/password with JWT session issuance"

2. why, what and how for JWT tokens (refresh token and access token)?

3. implementation of api's on backend and testing them

4. frontend scaffholding with routing, layout, auth pages, protected routes
5. create dashboard UI & course catalog UI linked to backend
6. testing via dashboard UI for overall feature testing and writing test cases.


## Day 7 - 2026-07-18
**Target**


**Hours worked:** 10hr 88min

7:48AM - 8:15AM (27min)
- writing task done yesterday and task to be done today in DEVLOG.md 

8:15AM - 8:40AM (25min) 
- work 

8:40AM - 9:15AM 
- break 

9:15AM - 10:01AM (46min)
- work 

10:01AM - 10:08AM 
- body task 

10:08AM - 11:23AM(1hr 15min) 
- work 

11:23AM - 1:00PM 
- sleeping

1:00PM - 1:10PM 
- body work + food 

1:00PM - 9:00PM (8hr) 
- work 

**What I did:**
1. create registration form at frontend and link to backend via api 
2. hashing password 
3. understanding tables users, roles, user_roles by running SQL commands in psql 
   and how it link to feature to be implemented. 
   understanding database design for above tables.
4. understand how data gets stored in database when user tries to register    

**What I learned:**
1. why for every step done to store data when user tries to register 
2. why for using cors in middleware
3. why for using argon2 

**Blockers / what I'm stuck on:**
1. what are steps done for sanitization and validation of user register data (from frontend) to ensure security when storing it in database. 
2. what are steps done for users session management when using JWT (access and refresh token)

**Plan for tomorrow:**
1. understand why access and refresh tokens are used when login user 
2. complete login and register functionality by understand
   1. how features to be implemnted are linked to database design, api, folder structure 
   2. implement rbac in middleware



## Day 8 - 2026-07-19

**Hours worked:**
7:07AM - 7:25AM 
- writing task done yesterday and what to be done today 

**What I did:**


**What I learned:**

**Blockers / what I'm stuck on:**


**Plan for tomorrow:**
