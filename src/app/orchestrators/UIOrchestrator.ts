// src/app/orchestrators/UIOrchestrator.ts

import { ScreenViewModelFactory} from '@app/orchestrators/factory/ScreenViewModelFactory';
import { ScreenStyleFactory, type StyleResolver, type StyledScreenVM } 
  from '@app/orchestrators/factory/StyleFactory';

type Deps = {
  styleResolver: StyleResolver;
};

export class UIOrchestrator {
  constructor(private readonly deps: Deps) {}

  public buildScreen(screenId: string): StyledScreenVM {
    // 1) Pure SVM
    const svm = ScreenViewModelFactory.build(screenId);

    // 2) Style binding, klaar.
    return ScreenStyleFactory.bind(svm, this.deps.styleResolver);
  }
}