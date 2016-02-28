# passport-relayr-example

This example demonstrates how to use [Express](http://expressjs.com/) and
[Passport](http://passportjs.org/) to authenticate users using Relayr.  Use
this example as a starting point for your own web or IoT applications.

## Instructions

To install this example on your computer, clone the repository and install
dependencies.

```bash
$ git clone https://github.com/ianusmagnus/passport-relayr-example.git
$ cd passport-relayr-example
$ npm install
```

The example uses environment variables to configure the client key and
client secret needed to access Relayr's API.  Start the server with those
variables set to the appropriate credentials.

```bash
$ CLIENT_ID=<RELAYR_CLIENT_ID> CLIENT_SECRET=<RELAYR_CLIENT_SECRET> node server.js
```

Open a web browser and navigate to [http://localhost:3000/](http://localhost:3000/)
to see the example in action.

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2016 Jan Kirchner
