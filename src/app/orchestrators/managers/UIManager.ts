// src/app/UIManager.ts
// ALLES UITGEZET MET COMMENTAAR - DEZE FILE STRAKS VERWIJDEREN
// DOEL:
// - Pure integrator: bouwt een volledige ScreenViewModel via de Factory.
// - Haalt visibility booleans op via MasterAPI.
// - Past visibility toe via VisibilityOrchestrator (aanbevolen: annotate).
// - Geen Render/Section/Entry orchestrators meer.
// - Geen directe registry lookups in de UIManager.
//
// VEREISTEN:
// - ScreenViewModelFactory.build(screenId): ScreenViewModel
// - VisibilityOrchestrator.annotate(svm, visibilityMap): ScreenViewModel
//   (of .reduce(...) als je prune verkiest)
// - MasterAPI.getVisibilityMap(screenId): Record<string, boolean>

//import { ScreenViewModelFactory } from '@app/orchestrators/factory/ScreenViewModelFactory';
//import { VisibilityOrchestrator } from '@app/orchestrators/VisibilityOrchestrator';
//import { labelFromToken } from '@domain/constants/labelResolver';

// Types — gebruik jouw bestaande definitions als die elders staan.
//import type { ScreenViewModel } from '@app/orchestrators/interfaces/IUIOrchestrator';

//export interface MasterAPI {
  /** Levert de actuele visibility per entryId (FailClose: ontbrekend = false of expliciet false). */
  //getVisibilityMap(screenId: string): Record<string, boolean>;
  /** (optioneel) subscribe/unsubscribe voor live updates, indien je reactive UI hebt */
  // subscribeVisibility(screenId: string, cb: (map: Record<string, boolean>) => void): () => void;
//}

//type UIManagerDeps = {
  //factory: typeof ScreenViewModelFactory;
  //visibility?: VisibilityOrchestrator; // optioneel als je annotate/prune hier wilt doen
  //masterApi: MasterAPI;                 // UI praat via deze poort met de MO/domeinlaag
  //resolveTitleToken?: (token?: string) => string; // optioneel: titelverrijking
//};

//export class UIManager {
//  private readonly factory: typeof ScreenViewModelFactory;
//  private readonly visibility?: VisibilityOrchestrator;
//  private readonly masterApi: MasterAPI;
//  private readonly resolveTitleToken?: (token?: string) => string;

//  constructor({ factory, visibility, masterApi, resolveTitleToken }: UIManagerDeps) {
//    this.factory = factory;
//    this.visibility = visibility;
//    this.masterApi = masterApi;
//    this.resolveTitleToken = resolveTitleToken ?? ((t) => (t ? labelFromToken(t) : ''));
//  }

  /**
   * Bouwt de volledige ScreenViewModel en past (optioneel) visibility toe.
   * - Factory: bouwt ALTIJD de volledige boom (screen → sections → entries → primitives).
   * - MasterAPI: levert visibility booleans (FailClose).
   * - VisibilityOrchestrator: annotate (aanrader) of reduce (prune).
   */
//  public buildScreen(screenId: string): ScreenViewModel {
//    // 1) Bouw volledige SVM (zonder visibility/hydratie)
//    const svm = this.factory.build(screenId);

    // 2) (optioneel) verrijk de titel buiten de factory (als je met tokens werkt)
//    if (svm.titleToken && !svm.title) {
//      svm.title = this.resolveTitleToken?.(svm.titleToken) ?? '';
//    }

    // 3) Haal visibilityMap op via MasterAPI (UI praat niet direct met domein)
//    const visibilityMap = this.masterApi.getVisibilityMap(screenId);

    // 4) Pas visibility toe — voorkeur: annotate voor minimale re-renders
//    if (this.visibility) {
      // Annotate: zet entry.isVisible flags, behoudt object-referenties
//      const annotated = this.visibility.annotate(svm, visibilityMap);
//      return annotated;
      // Wil je prune i.p.v. annotate?
      // return this.visibility.reduce(svm, visibilityMap);
//    }

    // 5) Als je hier geen visibility wilt toepassen, geef de volledige SVM terug
//    return svm;
//  }
//}