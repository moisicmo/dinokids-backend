import { Router } from 'express';

import { Authroutes } from './auth/routes';
import { PermissionRoutes } from './permission/routes';
import { RoleRoutes } from './role/routes';
import { SubjectRoutes } from './subject/routes';
import { RequirementRoutes } from './requirement/routes';
import { CategoryRoutes } from './category/routes';
import { TypeProjectRoutes } from './typeProject/routes';
import { StageRoutes } from './stage/routes';
import { SeasonRoutes } from './season/routes';
import { StaffRoutes } from './staff/routes';
import { StudentRoutes } from './student/routes';
import { TeacherRoutes } from './teacher/routes';
import { InscriptionRoutes } from './inscription/routes';
import { ParallelRoutes } from './parallel/routes';
import { ProjectRoutes } from './project/routes';

export class AppRoutes {


  static get routes(): Router {

    const router = Router();

    // Definir las rutas
    router.use('/api/auth', Authroutes.routes);
    router.use('/api/permission', PermissionRoutes.routes);
    router.use('/api/role', RoleRoutes.routes);
    router.use('/api/subject', SubjectRoutes.routes);
    router.use('/api/requirement', RequirementRoutes.routes);
    router.use('/api/category', CategoryRoutes.routes);
    router.use('/api/typeProject', TypeProjectRoutes.routes);
    router.use('/api/stage', StageRoutes.routes);
    router.use('/api/season', SeasonRoutes.routes);
    router.use('/api/staff', StaffRoutes.routes);
    router.use('/api/student', StudentRoutes.routes);
    router.use('/api/teacher', TeacherRoutes.routes);
    router.use('/api/inscription', InscriptionRoutes.routes);
    router.use('/api/parallel', ParallelRoutes.routes);
    router.use('/api/project', ProjectRoutes.routes);

    return router;
  }
}
