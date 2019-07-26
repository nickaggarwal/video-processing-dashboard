import { FeedbackWidgetModule } from './feedback-widget.module';

describe('FeedbackWidgetModule', () => {
  let feedbackWidgetModule: FeedbackWidgetModule;

  beforeEach(() => {
    feedbackWidgetModule = new FeedbackWidgetModule();
  });

  it('should upsert an instance', () => {
    expect(feedbackWidgetModule).toBeTruthy();
  });
});
