# DecToHex_service
The purpose of this project is to create an API that gets decimal integers and converts them to hexadecimal representation. It was developed in Node, Express, PostgreSQL and Docker containers.

# Contents
* [How to install](#how-to-install)
* [How to run](#how-to-run)
* [Architecture](#arch)
    * [Server](#server)
    * [Router](#router)
    * [Numbers](#numbers)
    * [Conversion](#convert)
    * [DB queries](#db)
    * [Logs](#logs)
* [Example](#example)
* [Future Work](#future)

<a name="how-to-install"></a>
## How to install

Firstly, you have to install [**docker**](https://docs.docker.com/engine/install/ubuntu/) and [**docker-compose**](https://docs.docker.com/compose/install/) in your machine.

Next you have to install all the necessary dependencies from the package.json into the project directory by typing:

```npm
sudo npm install
```

<a name="how-to-run"></a>
## How to run

When installation finished, you can run the project through **docker-compose** inside the project directory:

```
sudo docker-compose up --build
```

*You cain always check your docker containers status by typing:*
```
sudo docker ps -a
```

You will have two running containers now, one with our nodejs application and the second one with the postgreSQL.

<a name="arch"></a>
## Architecture

The project's structure is divided into 6 logical parts.

<a name="server"></a>
### Server

The main service file, **server.js**. As we see in the code below, we implement an **[Express.js](https://expressjs.com/)** 
application and import necessary libraries like **[cors()](http://expressjs.com/en/resources/middleware/cors.html)** and
**[body-parser](http://expressjs.com/en/resources/middleware/body-parser.html)**. Body-parser 
is a middleware that parse incoming request bodies before your handlers.

```javascript
const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const router = require('./router');
const config = require('./config/main');

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


var server = app.listen(config.development.port);
console.log(`Your server is running on port ${config.development.port}`);

router(app);

module.exports = server;
```

The server now runs in localhost:3000. Our file reads the service port from the *config/main.
js* file which has the configuration variables we need for our project.
Notice that, at the end of the file we call the *router(app)* which is the exported function from the **router.js** file and we pass as an argument to that function our Express.js application.

<a name="server"></a>
### Router

This is the file where we implement all different routes for our application. This file is organized in **controllers**, **routes** and our main function that has as parameter the Express.js application.

The **controllers** is a structure that imports every endpoint function.
```javascript
// Route Controllers
const controllers = {
    numbers: require('./numbers')
}
```

The **routes**  has every express.Router() application accordingly to our endpoints.
```javascript
// Route Groups
const routes = {
    numbers: express.Router(),
    api: express.Router()
}
```

The **express.Router()** acts as a mini application. You can call an instance of it (like we do for Express)
and then define routes on that. This is very powerful because we can create multiple express.Router()s and then apply them to our
application. This way we are allowed to make our applications more modular and flexible.

So our complete file is the below code:
```javascript
const express = require('express');

// Route Controllers
const controllers = {
    numbers: require('./numbers')
}


// Route Groups
const routes = {
    numbers: express.Router(),
    api: express.Router()
}

module.exports = function(app) {

    // get decimal numbers from clients & convert them
    routes.api.use('/convert', routes.numbers);
    routes.numbers
        .post('/decTohex', controllers.numbers.post)
        .get('/decTohex', controllers.numbers.fetch)

    // set url for API group routes
    app.use('/', routes.api);
}
```

As we see, we use the router.use() which is a middleware in Express that give us a way to do something before a 
request is processed.
So, we have our main router with the *'/'* endpoint and every other router follows this. In our current application it is
implemented only one extra endpoint, the */convert/decTohex*. 
The logic behind the name of the endpoint is that, a user wants to make a number conversion. So the first endpoint name should be conversion. After that, the endpoint name is depending on the user conversion choice.
For example, in this project is developed only decimal to hexadecimal conversion, so the client will hit the */convert/decTohex* endpoint.
In an other case, we can assume that a client would need a different type of conversion, e.g. a decimal to binary. In that case, */conversion/decTobin* endpoint would be responsible for that kind of requests.


<a name="numbers"></a>
### Numbers

As a result, routing to each endpoint calls functions that will handle those requests. For conversion requests, we have the folder *numbers* in which is located an index.js file that contains the functions for POST and GET.
The post() function gets a client argument which is our decimal number in our case.

```javascript
exports.post = async function(req, res) {
    await convert.Dec2Hex(req.body.decimal)
    .then(result => {
        logs.write(result);
        // call insert query
        db.insert(result)
        .then(db_result => {
            logs.write(db_result);
            console.log(db_result);
        })
        .catch(error => {
            console.log(error);
            logs.write(error);
        })
        return res.status(200).send({
            data: result
        });
    })
    .catch(error => {
        logs.write(error);
        return res.status(402).send(error);
    })
}
```

The decimal number is located in the body of the clients request and we can extraxt it by using the body-parser dependency.
So, each time a user sends a post request to *conversions/decTohex*, is being called the module that implements the conversion algorithm. 
If the result is valid, we store some data, that it will be discussed in the following section, into our PostgreSQL.

That *conversions/decTohex* also serves GET requests which are being handled by the *fetch()* function from our *numbers/index.js* file.

```javascript
/** ------- FETCH -------- */
exports.fetch = async function(req, res) {
    let query = 'SELECT '; 
    if (req.query.value && req.query.order && req.query.dateline) {
        query += req.query.value +  ' FROM conversions WHERE dateline='+ req.query.dateline +' ORDER BY ' + req.query.value + ' ' + req.query.order;
    }
    else if (req.query.value && req.query.order) {
        query += req.query.value +  ' FROM conversions ORDER BY ' + req.query.value + ' ' + req.query.order;
    }
    else if (req.query.aggregation && req.query.value && req.query.dateline) {
        query += req.query.aggregation + '(' + req.query.value + ') FROM conversions WHERE dateline=' +req.query.dateline;
    }
    else if (req.query.aggregation && req.query.value) {
        query += req.query.aggregation + '(' + req.query.value + ') FROM conversions';
    }
    else {
        query += '* FROM conversions';
    }
    db.select(query)
    .then(data => {
        return res.status(200).send(data);
    })
    .catch(error => {
        return res.status(401).send(error);
    })
}
```

The client can built the GET request in one of those 4 simple forms as we see above. These are 
some simple requests but are also useful for extracting results about our API.
The user can make a get request with queries, **value, dateline, order and aggregation**.
* **value** can be equal with *decimal, hexadecimal, steps_count and execution_time*.
* **dateline** can be equal with a specific date, e.g. '2021-07-23', in order to see data only from one specific day.
* **order** is a value that gets either 'asc' or 'desc' for filtering the data with asceding or descending order.
* **aggregation** gets 'AVG' or 'SUM' values in order to return the average or summary of a value.

<a name="convert"></a>
### Conversion 

Conversion is the module that is responsible for the change the decimal number representation
into hexadecimal representation. It is a stand-alone module that has an async function which 
gets an argument and returns a promise with an error or the conversion result.

```javascript
exports.Dec2Hex = async function(decimal) {
    return new Promise((resolve, reject) => {
        var data = {
            decimal: decimal,
            hexadecimal: 0,
            execution_time: 0,
            steps_count: 0,
        }
        if (typeof decimal === 'string') {
            reject("Conversion Error! You have to give an integer number NOT a string!");
        }
        else if (typeof decimal === 'number') {
            if (!Number.isInteger(decimal)) {
                reject("Conversion Error! You gave a number but is NOT an integer!");
            }
            else {
                const zero_ascii = 48;
                const caps_asscii_minus10 = 55;
                const base = 16;
                const HexLetters = 10;          // from number 10 we have letters representation

                var remainder;                  // remainder is our hex numbers
                var quotient = decimal;         // quotient will be the new decimal
                var hex_buffer = [];               // buffer to keep values in each iteration

                var begin = process.hrtime();
                while (quotient != 0) {
                    data.steps_count++;
                    remainder = quotient % base;
                    if (remainder < HexLetters) {
                        hex_buffer.splice(0, 0, String.fromCharCode(remainder + zero_ascii));
                    }
                    else {
                        hex_buffer.splice(0, 0, String.fromCharCode(remainder + caps_asscii_minus10));
                    }
                    quotient = parseInt(quotient / base);
                }
                data.execution_time = process.hrtime(begin)[1] / 1000000;

                if (quotient == 0) {
                    data.hexadecimal = hex_buffer.join("");
                    resolve(data);
                }
            }
        }
    });
}
```

The object data is the information we store into our postgreSQL.

#### Algorithm

1. Store the remainder when the number is divided by 16. If remainder is less than 10, insert 
(48 + remainder) in a character array otherwise if it is greater than or 
equals to 10, insert (55 + temp) in the character array.

2. Divide the number by 16 now

3. Repeat the above two steps until the quotient is not equal to 0.

```cmd
48 = 0 in ASCII table.

55 = 7 in ASSCI table but adding at least 10 we reach the capital letters that 16
representation use for numbers 10-15.
```

![ASCII TABLE](https://qph.fs.quoracdn.net/main-qimg-2021159013a696e9f8f034a12ab98cbc)


<a name="db"></a>
### DB Queries

For database handling I create a separate file that is located in *db* folder. Inside that 
folder we have the *queries.js* that handling the clients post and get requests.

```javascript
const { Pool } = require('pg');
const logs = require('../writeLogs');
const config = require('../config/main');

const pool = new Pool({
    user: config.development.db_user,
    host: 'db',                             // container host from our docker-compose.yml
    database: config.development.db_name,
    password: config.development.db_password,
    post: config.development.db_port
});

```

First of all, we use the **pg** package in order to access the postgresql. I create a pool of requests with the information about our database, like the name, port, user, password and host.
As we running our project in containers, the host of our database is the name of the container 
that host our postgreSQL.

```docker
version: "3.7"
services:
    db:
        container_name: db_postgres
        restart: always
        image: postgres
        ports:
            - ${POSTGRES_PORT}:${POSTGRES_PORT}
        environment:
            POSTGRES_USER: ${POSTGRES_USER}
            # POSTGRES_HOST: ${POSTGRES_HOST}
            POSTGRES_DB: ${POSTGRES_DB}
            POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
        volumes:
            - ./db/init/initdb.sh:/docker-entrypoint-initdb.d/initdb.sh
            - ./pgdata:/var/lib/postgresql/data
    app:
        container_name: decTohex
        restart: always
        volumes:
            - ".:/usr/src/DecToHex_service"
        build: .
        ports:
            - "3000:3000"
        links:
            - db
        depends_on:
            - db
```

Note that when the container starts, an *initdb.sh* script runs into the */
docker-entrypoint-initdb.d/* in order to initialize our database. For the projects 
purposes I set only the creation of the table as we can see in the following code section.

```bash
#!/bin/bash
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" -d "$POSTGRES_DB" <<-EOSQL

        CREATE TABLE IF NOT EXISTS conversions(
            id SERIAL PRIMARY KEY,
            decimal INT,
            hexadecimal VARCHAR,
            steps_count INT,
            execution_time FLOAT,
            dateline DATE NOT NULL DEFAULT CURRENT_DATE,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
EOSQL
```

```
Notice:
We assume that the database schema is managed by another service and maybe by another team, and 
NOT from the conversion service.
```


```javascript
/** This function is responsible to create a thread pool
 *  and save our data to our postgresql DB. */
exports.insert = async function (data) {
    return new Promise((resolve, reject) => {
        pool.connect((error, client, release) => {
            if (error) {
                reject(error);
            }
            else {
                let columns = ''
                let values = '';
                let i=1;
                let val_arr = [];
                let length = Object.keys(data).length;
                for (let key in data) {
                    if (i == length) {
                        columns = columns.concat(key);
                        values = values.concat(`$${i}`);
                    }
                    else {
                        columns  = columns.concat(key + ', ');
                        values = values.concat(`$${i}, `);
                    }
                    val_arr.push(data[key]);
                    i++;
                }

                client.query('INSERT INTO conversions(' + columns + ') VALUES (' + values + ')', val_arr, (error, results) => {
                    release();
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve({
                            message: 'Insertion complete sucessfully!',
                            success: 1
                        });
                    }
                });
            }
        });
    });
}
```

The above function gets the data object and build the insert query.

The GET requests are being served by the following function

```javascript
exports.select = async function(query) {
    return new Promise((resolve, reject) => {
        pool.connect((error, client, release) => {
            if (error) {
                reject(error);
            }
            else {
                client.query(query , (error, results) => {
                    release();
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve(results);
                    }
                });
            }
        });
    });

}
```

<a name="logs"></a>
### Logs

Finally, I developed a createWriteStream function that is responsible to write into an output.
log file informations about the process. Every write has two parts, the dateline in UTC form 
and the data logs.

```javascript
const { createWriteStream } = require('fs');
const util = require('util');

const write_log_stream = createWriteStream('output.log', { flags: 'a' });

/** This function writes our logs into out output log file. */
exports.write = function(logs) {
    write_log_stream.write(util.format('%s\n',new Date().toUTCString()));
    write_log_stream.write(util.format('%s\n', logs));

    write_log_stream.end();
}
write_log_stream.on('error', (error) => {
    console.log(error);
});
```

<a name="example"></a>
## Example

For testing my API I like to use the **[Postman](https://www.postman.com/)** app.
In this section I will give some examples how to make the *Post* and *Get* requests through the 
Postman tool.

POST
localhost:3000/convert/decTohex

Body:
```json
{
    "decimal": 1323116
}
```

RETURNS:
```json
{
    "data": {
        "decimal": 1323116,
        "hexadecimal": "14306C",
        "execution_time": 0.0314,
        "steps_count": 6
    }
}
```

GET
localhost:3000/convert/decTohex?value=decimal&order=desc

```json
    "rows": [
        {
            "decimal": 13213
        },
        {
            "decimal": 13095
        },
        {
            "decimal": 9203
        },
        {
            "decimal": 9045
        },
        {
            "decimal": 1036
        },
        {
            "decimal": 132
        },
        {
            "decimal": 92
        },
        {
            "decimal": 13
        }
    ]
```

GET
localhost:3000/convert/decTohex?value=execution_time&aggregation=AVG

```json
 "rows": [
        {
            "avg": 0.0266764705882353
        }
    ]
```

GET
localhost:3000/convert/decTohex?value=steps_count&dateline='2021-07-23'&order=desc

```json
"rows": [
        {
            "steps_count": 6
        },
        {
            "steps_count": 6
        },
        {
            "steps_count": 5
        },
       {
            "steps_count": 5
        },
        {
            "steps_count": 4
        },
        {
            "steps_count": 4
        }
]
```


<a name="future"></a>
## Future Work

In the conlusion, I would like to mention some extra work that I believe that it would be necessary to do.

### ORM - **[Sequelize](https://sequelize.org/)**
(ORM) is a technique that lets you query and manipulate data from a database using an object-oriented paradigm.
* You write your data model in only one place, and it's easier to update, maintain, and reuse the code.
* It forces you to write MVC code, which, in the end, makes your code a little cleaner.
* Less code compared to embedded SQL and handwritten stored procedures

### C++ Nodejs Addons
Javascript is not the best option for complex comptutations as it is slow because it running above the Node and V8 engine. All javascript code is passing to the V8 engine and it is converted in C++ code. Then the C++ code is compiled and generates the machine code which runs 
into our computers. So it is better if you need to write software for complex computations to 
write C++ directly which is faster and also provides a bin number of libraries for computations 
,and link the code with nodejs through the C++ addon method or through the NODE-API.

### More Unit Testing
For the given time I wrote some simple unit tests. I would like to write more tests in the future in order to have a better perception of how the code behaves in different states and improve its functionality.