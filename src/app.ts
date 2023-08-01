import express, { Application } from 'express';
import cors from 'cors';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import { UserRoutes } from './app/modules/user/user.router';
const app: Application = express();

app.use(cors());

// parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/users/', UserRoutes.router);

// app.get('/', async (req: Request, res: Response, next: NextFunction) => {
//   throw new Error('Errorrrrrrrrrrr.......')
// })

app.use(globalErrorHandler);

export default app;
