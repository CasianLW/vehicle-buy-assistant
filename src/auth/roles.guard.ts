import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { Role } from './role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // console.log('Required roles:', requiredRoles); // This should output to your console

    const req = context.switchToHttp().getRequest();
    // console.log('User object from request:', req.user); // Check what the user object contains

    if (!requiredRoles) {
      return true;
    }
    if (!req.user || !req.user.roles) {
      return false;
    }
    const hasRole = requiredRoles.some((role) =>
      req.user.roles
        .map((role) => role.toLowerCase())
        .includes(role.toLowerCase()),
    );
    // console.log('Role verification result:', hasRole);
    return hasRole;
  }
}
