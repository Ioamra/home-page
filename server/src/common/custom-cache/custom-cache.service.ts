import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CustomCacheService {
  /**
   * Ensemble pour stocker toutes les clés de cache utilisées.
   * Utilise un Set pour garantir l'unicité des clés.
   */
  private readonly cacheKeys: Set<string> = new Set();

  /**
   * Crée une instance du CustomCacheService.
   * @param cacheManager Le gestionnaire de cache injecté par NestJS.
   */
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  /**
   * Stocke une valeur dans le cache sous une clé spécifique.
   * @param key La clé sous laquelle stocker la valeur.
   * @param value La valeur à mettre en cache.
   * @param options Options supplémentaires pour la mise en cache (comme le TTL).
   * @returns Une promesse résolue une fois la valeur stockée.
   */
  public async set(key: string, value: unknown, options?: number): Promise<void> {
    await this.cacheManager.set(key, value, options);
    this.cacheKeys.add(key);
  }

  /**
   * Récupère une valeur du cache en utilisant sa clé.
   * @param key La clé de la valeur à récupérer.
   * @returns Une promesse contenant la valeur récupérée ou null si la clé n'existe pas.
   */
  public async get<T>(key: string): Promise<T | null> {
    return await this.cacheManager.get<T>(key);
  }

  /**
   * Supprime une valeur du cache en utilisant sa clé.
   * @param key La clé de la valeur à supprimer.
   * @returns Une promesse résolue une fois la valeur supprimée.
   */
  public async del(key: string): Promise<void> {
    await this.cacheManager.del(key);
    this.cacheKeys.delete(key);
  }

  /**
   * Supprime toutes les entrées de cache dont les clés correspondent au motif spécifié.
   * @param pattern Le motif à utiliser pour la correspondance des clés (par exemple, 'usersAccount:*').
   * @returns Une promesse résolue une fois toutes les entrées correspondantes supprimées.
   */
  public async delByPattern(pattern: string): Promise<void> {
    // Convertit le motif en expression régulière pour la correspondance
    const regex = new RegExp('^' + pattern.replace('*', '.*') + '$');
    // Crée un tableau des clés actuelles pour éviter les modifications pendant l'itération
    const keys = Array.from(this.cacheKeys);
    for (const key of keys) {
      // Vérifie si la clé correspond au motif
      if (regex.test(key)) {
        // Supprime la valeur du cache et retire la clé de l'ensemble
        await this.cacheManager.del(key);
        this.cacheKeys.delete(key);
      }
    }
  }
}
