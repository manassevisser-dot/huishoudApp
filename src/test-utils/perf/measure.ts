/**
 * Meet hoe snel een async migratie/transform verloopt.
 */
export async function measureMigrationSpeed<T>(migrationFn: () => Promise<T>) {
  // We bepalen de bron van de tijdmeting op een linter-veilige manier
  const isPerformanceAvailable = 
    typeof performance !== 'undefined' && 
    typeof performance.now === 'function';

  const getTimestamp = isPerformanceAvailable 
    ? () => performance.now() 
    : () => Date.now();

  const start = getTimestamp();
  const result = await migrationFn();
  const end = getTimestamp();

  return {
    result,
    duration: `${(end - start).toFixed(2)}ms`,
  };
}