import { Router } from 'express';

import { Authroutes } from './auth/routes';
import { StaffRoutes } from './staff/routes';
import { RoleRoutes } from './role/routes';
import { PermissionRoutes } from './permission/routes';
import { StudentRoutes } from './student/routes';
import { TeacherRoutes } from './teacher/routes';
import { SubjectRoutes } from './subject/routes';
import { CategoryRoutes } from './category/routes';
import { InscriptionRoutes } from './inscription/routes';
export class AppRoutes {


  static get routes(): Router {

    const router = Router();

    // Definir las rutas
    router.use('/api/auth', Authroutes.routes);
    router.use('/api/staff', StaffRoutes.routes);
    router.use('/api/role', RoleRoutes.routes);
    router.use('/api/permission', PermissionRoutes.routes);
    router.use('/api/student', StudentRoutes.routes);
    router.use('/api/teacher', TeacherRoutes.routes);
    router.use('/api/subject', SubjectRoutes.routes);
    router.use('/api/category', CategoryRoutes.routes);
    router.use('/api/inscription', InscriptionRoutes.routes);

    return router;
  }
}
