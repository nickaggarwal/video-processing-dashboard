import { EditProfileModule } from './edit-profile.module';

describe('EditProfileModule', () => {
  let editProfileModule: EditProfileModule;

  beforeEach(() => {
    editProfileModule = new EditProfileModule();
  });

  it('should upsert an instance', () => {
    expect(editProfileModule).toBeTruthy();
  });
});
