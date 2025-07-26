import { CallHandler, ExecutionContext, HttpException, Injectable, InternalServerErrorException, Logger, NestInterceptor } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ExceptionInterceptor implements NestInterceptor {
  public intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      catchError((error: unknown) => {
        const request = context.switchToHttp().getRequest();
        const handler = context.getHandler();
        const functionName = handler.name;

        // Modifier le message d'erreur avec le nom de la fonction
        if (error instanceof HttpException) {
          const message = `Error [${request.method}]${request.originalUrl} in ${functionName}: ${error.message}`;
          Logger.error(message);
          return throwError(() => new HttpException(message, error.getStatus()));
        } else {
          // Pour les autres erreurs
          const message = `Error [${request.method}]${request.originalUrl} in ${functionName}: ${(error as HttpException).message || 'Internal server error'}`;
          Logger.error(message);
          return throwError(() => new InternalServerErrorException(message));
        }
      }),
    );
  }
}
