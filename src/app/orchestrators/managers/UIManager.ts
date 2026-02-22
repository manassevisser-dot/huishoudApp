/**
 * @file_intent Definieert de `UIManager`, een class die verantwoordelijk is voor het construeren en stijlen van screen view models.
 * @repo_architecture Application Layer - Orchestrator Manager. Deze manager coördineert de creatie van view models en het toepassen van stijlen.
 * @term_definition
 *   - `ScreenViewModelFactory`: Een factory die verantwoordelijk is voor het bouwen van de basis view models voor schermen.
 *   - `ScreenStyleFactory`: Een factory die verantwoordelijk is voor het toepassen van stijlen op de view models.
 *   - `StyleResolver`: Een functie die stijlen ophaalt op basis van een gegeven key.
 * @contract De `UIManager` heeft een `buildScreen` methode die een `screenId` accepteert. Deze methode haalt een basis view model op van de `ScreenViewModelFactory` en past er vervolgens stijlen op toe met behulp van de `ScreenStyleFactory` en de `styleResolver`.
 * @ai_instruction Als je de manier waarop schermen worden gebouwd of gestyled wilt aanpassen, is dit de juiste plek om te beginnen. Wijzigingen in de `buildScreen` methode zullen van invloed zijn op alle schermen in de applicatie. Als je alleen de stijlen van een specifiek scherm wilt aanpassen, kun je de `StyleResolver` aanpassen.
 */
// src/app/orchestrators/managers/UIManager.ts
import { ScreenViewModelFactory } from '@app/orchestrators/factory/ScreenViewModelFactory';
import { ScreenStyleFactory, type StyleResolver } from '@app/orchestrators/factory/StyleFactory'; 

export class UIManager {
  private readonly styleResolver: StyleResolver;

  constructor() {
    // De "Identity" resolver is nu een intern implementatiedetail van de UIManager.
    // Hij geeft de key ongewijzigd terug, zodat de UI-laag deze kan gebruiken.
    this.styleResolver = {
      getStyle: (styleKey: string) => styleKey,
    };
  }

  buildScreen(screenId: string) {
    const base = ScreenViewModelFactory.build(screenId);
    return ScreenStyleFactory.bind(base, this.styleResolver);
  }
}
