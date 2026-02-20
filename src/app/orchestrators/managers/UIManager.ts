// src/app/orchestrators/managers/UIManager.ts
import { ScreenViewModelFactory } from '@app/orchestrators/factory/ScreenViewModelFactory';
import { ScreenStyleFactory, type StyleResolver } from '@app/orchestrators/factory/StyleFactory'; 

export class UIManager {
  constructor(private readonly styleResolver: StyleResolver) {}

  buildScreen(screenId: string) {
    const base = ScreenViewModelFactory.build(screenId);
    return ScreenStyleFactory.bind(base, this.styleResolver);
  }
}