import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { UserService } from './auth/user/user.service';

declare const $: any;

@Component({
    selector: 'app-my-app',
    templateUrl: './app.component.html'
})

export class AppComponent implements OnInit, AfterViewInit {
  private _router: Subscription;
  public user: any;

  constructor( private router: Router, private userService: UserService) {
  }

    ngOnInit() {
      this._router = this.router.events.filter(event => event instanceof NavigationEnd).subscribe((event: NavigationEnd) => {
        const body = document.getElementsByTagName('body')[0];
        const modalBackdrop = document.getElementsByClassName('modal-backdrop')[0];
        if (body.classList.contains('modal-open')) {
          body.classList.remove('modal-open');
          modalBackdrop.remove();
        }
      });
      this.user = {
        username: '',
        password: ''
      };
    }

    ngAfterViewInit() {
      console.log(document.getElementById('freshwidget-button'));
      console.log($('#freshwidget-frame'));
      console.log($('#freshwidget-frame').attr('src'));
      console.log($('#freshwidget-frame').contents());
      console.log($('#feedback-widget'));
      // $('#feedback-widget').html("<script type=\"text/javascript\">                    FreshWidget.init(\"\", {\"queryString\": \"&widgetType=popup&formTitle=Help+%26+Support&submitTitle=Send+Feedback&submitThanks=Thank+you+for+your+feedback.&captcha=yes&searchArea=no\", \"backgroundImage\": \"https://s3.amazonaws.com/assets.freshdesk.com/widget/help-button.png\", \"utf8\": \"✓\", \"widgetType\": \"popup\", \"buttonType\": \"image\", \"buttonText\": \"Support\", \"buttonColor\": \"white\", \"buttonBg\": \"#006063\", \"alignment\": \"2\", \"offset\": \"700px\", \"submitThanks\": \"Thank you for your feedback.\", \"formHeight\": \"500px\", \"captcha\": \"yes\", \"url\": \"https://codejudge.freshdesk.com\", \"loadOnEvent\": \"immediate\"} );                </script>");
      
      // $('#freshwidget-button').on('click', (evt) => {
      //   const target = evt.target
      //   console.log('test');
      //   console.log(this.userService.getUser());
      //   const user = this.userService.getUser();
      //   if (user) {
      //     console.log('damn');
      //     console.log(user.email);
      //     console.log($('#freshwidget-frame'));
      //     let src = $('#freshwidget-frame').attr('src');
      //     src += '&';
      //     console.log($('#freshwidget-frame').attr('src'));
      //     $('#helpdesk_ticket_email').val(user.email);
      //   }
      // });
    }
}
