# School Api

## Swagger open docs is available in /api/docs for convenience

api/assignment to create teacher, the subject he/she will teach and the class he /she will teach it in.
This endpoint will create them even if they dont exist.
same with api/student to create students, u will also be able to create a new class along with it.
The class details are optional so, whether u wish to or not is your decision.

## Use your local postgresdb url or cloud postgresdb as DATABASE_URL in .env

A dummy header is used, specific endpoints as per request are projected by a dummy header ,x-role.

#### Input 'TEACHER' as the header be it lowercase or uppercase doesnt matter to access the endpoint asking for it
