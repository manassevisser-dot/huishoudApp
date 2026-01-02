
/**
 * Meet hoe snel een async migratie/transform verloopt.
 * Gebruikt performance.now() indien beschikbaar, anders Date.now().
 */
export async function measureMigrationSpeed<T>(migrationFn: () => Promise<T>) {
    const now = typeof performance !== 'undefined' && performance.now
      ? () => performance.now()
      : () => Date.now();
  
    const start = now();
    const result = await migrationFn();
    const end = now();
  
    return {
      result,
      duration: `${(end - start).toFixed(2)}ms`,
    };
  }
  