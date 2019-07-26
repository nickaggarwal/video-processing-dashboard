import { EnhancedDataTableModule } from './enhanced-data-table.module';

describe('EnhancedDataTableModule', () => {
  let enhancedDataTableModule: EnhancedDataTableModule;

  beforeEach(() => {
    enhancedDataTableModule = new EnhancedDataTableModule();
  });

  it('should upsert an instance', () => {
    expect(enhancedDataTableModule).toBeTruthy();
  });
});
