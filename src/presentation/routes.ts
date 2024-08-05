import { Router } from 'express';

import { Authroutes } from './auth/routes';
import { BranchRoutes } from './branch/routes';
import { StaffRoutes } from './staff/routes';
import { RoleRoutes } from './role/routes';
import { PermissionRoutes } from './permission/routes';
import { StudentRoutes } from './student/routes';
import { TeacherRoutes } from './teacher/routes';
import { TutorRoutes } from './tutor/routes';
import { InscriptionRoutes } from './inscription/routes';
import { RoomRoutes } from './room/routes';
import { PriceRoutes } from './price/routes';
import { MonthlyFeeRoutes } from './monthlyFee.ts/routes';
import { SpecialtyRoutes } from './specialty/routes';
import { ScheduleRoutes } from './schedule/routes';
export class AppRoutes {


  static get routes(): Router {

    const router = Router();

    // Definir las rutas
    router.use('/api/auth', Authroutes.routes);
    router.use('/api/branch', BranchRoutes.routes);
    router.use('/api/staff', StaffRoutes.routes);
    router.use('/api/role', RoleRoutes.routes);
    router.use('/api/permission', PermissionRoutes.routes);
    router.use('/api/student', StudentRoutes.routes);
    router.use('/api/teacher', TeacherRoutes.routes);
    router.use('/api/tutor', TutorRoutes.routes);
    router.use('/api/specialty', SpecialtyRoutes.routes);
    router.use('/api/inscription', InscriptionRoutes.routes);
    router.use('/api/room', RoomRoutes.routes);
    router.use('/api/schedule', ScheduleRoutes.routes);

    router.use('/api/price', PriceRoutes.routes);
    router.use('/api/monthlyfee', MonthlyFeeRoutes.routes);

    return router;
  }
}
