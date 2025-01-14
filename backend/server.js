//express boilerplate
import express from 'express';
const app = express();
const port = 3000;
import aiRoute from './routes/aiRoute.js';
import googleAiRoute from './routes/googleAiRoute.js';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';


app.use(bodyParser.json());
app.use(cookieParser());
app.get('/', (req, res) => {
    res.send({data:'Hello World!'});
    }
);
// all routes
app.use('/api/ai', aiRoute);
app.use('/api/googleAi', googleAiRoute);
 //no route found
app.use((req, res, next) => {
    res.status(404).send("Sorry can't find that!")
    }
);
//global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
    }
);
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
    }       
);


