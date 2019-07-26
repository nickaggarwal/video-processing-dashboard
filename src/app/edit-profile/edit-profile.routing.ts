import { Routes } from '@angular/router';
import { EditProfileComponent } from './edit-profile.component';

export const EditProfileRoutes: Routes = [
    {
      path: '',
      children:[{
        path: '',
        component: EditProfileComponent
        }
      ]
    }
];
