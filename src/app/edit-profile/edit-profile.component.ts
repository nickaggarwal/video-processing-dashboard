import { Component, OnInit } from '@angular/core';
import { Register } from 'app/auth/register/register.model';
import { UserService } from 'app/auth/user/user.service';
import { EnterpriseService } from 'app/enterprise/common/enterprise.service';
import { User } from 'app/auth/user/user.model';
import { Enterprise } from 'app/enterprise/common/enterprise.model';
import { Subject } from 'rxjs';
import { NotificationsComponent } from 'app/notifications/notifications.component';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {

  public user: User;
  file: File = null;
  file_e: File = null;
  private maxFileSize: Number = 2; // in MB
  public maxFileSizeString = this.maxFileSize + ' MB';

  constructor(private userService: UserService, private enterpriseService: EnterpriseService,
     private notificationComponent: NotificationsComponent) {
    this.init();
    this.userService.subUser.subscribe((value) => {
      this.user = value;
    });
  }

  ngOnInit() {
    this.user =  this.userService.getUser();
  }

  public selectedChange($event) {
    this.user.enterprise.enterpriseType = $event;
  }

  public updateProfile() {
    if (this.validateFileSize(this.file)) {
      this.userService.updateProfile(User.getUserForUpdateProfile(this.user), this.file);
    }
  }

  init(): any {
    this.initializeUser();
  }

  private initializeUser() {
    this.user = new User();
  }


  onImgChange(input, imgEl): void {
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        imgEl.src = e.target['result'];
      };
      this.file = input.files[0];
      reader.readAsDataURL(this.file);
    }
  }

  onImgChange_e(input, imgEl): void {
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        imgEl.src = e.target['result'];
      };
      this.file_e = input.files[0];
      reader.readAsDataURL(this.file_e);
    }
  }

  uploadEnterpriselogo() {
    const fd = new FormData();
    if (this.file_e) {
      if (this.validateFileSize(this.file_e)) {
        fd.append('file', this.file_e);
      } else {
        return;
      }
    }
    const enterprise = this.user.enterprise;
    fd.append('model', JSON.stringify({ id: enterprise.id, name: enterprise.name, enterpriseTypeId: enterprise.enterpriseType.id }))
    this.enterpriseService.uploadEnterpriseLogo(fd).subscribe(
      data => {
        this.file_e = null;
        this.userService.postLogoUpload(data['response']['logo']);
      });
  }

  private validateFileSize(file) {
    if (file) {
      const fileSize = parseFloat((file.size / 1048576).toFixed(2)); // 1048576 = 1MB
      if (fileSize > this.maxFileSize) {
        this.notificationComponent.showNotification('danger', 'Max image size for upload: ' + this.maxFileSizeString);
        return false;
      }
    }
    return true;
  }

}
