import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { TestsService } from '../tests.service';
import { CandidatesService } from '../../candidates/candidates.service';
import { EmailService } from '../../shared/email.service';
import { NotificationsComponent } from '../../notifications/notifications.component';
import swal from 'sweetalert2';
import { FileSaverService } from 'ngx-filesaver';
import { send } from 'q';

@Component({
  selector: 'app-test-detail',
  templateUrl: './test-detail.component.html',
  styleUrls: ['./test-detail.component.scss']
})
export class TestDetailComponent implements OnInit {
  private testId: Number;
  test: any = {};

  constructor(private route: ActivatedRoute, private router: Router, private testService: TestsService, private emailService: EmailService,
              private notificationComponent: NotificationsComponent, private _FileSaverService: FileSaverService) { 
    this.router.events.subscribe((_: NavigationEnd) => {
      if (_.url) {
        this.testService.setIsSampleFlag(_.url);
      }
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.testId = +params['id']; // (+) converts string 'id' to a number
      if (this.testService.getIsSampleFlag()) {
        this.testService.getSampleTest(this.testId).subscribe(
          data => {
            this.transformAndUpdateTest(data);
          }
        );
      } else {
        this.testService.getTest(this.testId).subscribe(
          data => {
            this.transformAndUpdateTest(data);
          }
        );
      }
    });
  }

  private transformAndUpdateTest(data: ArrayBuffer) {
    this.test = this.testService.transformTest(data);
  }

  resentTestLinkWithAlert(sendToAll, candidateId) {
    const title = sendToAll ? 'Do you wish to resend the test invite to all the candidates?' :
                              'Do you wish to resend the test invite to this candidate?' ;
    swal({
        title: title,
        text: "",
        type: 'warning',
        showCancelButton: true,
        confirmButtonClass: 'btn btn-success',
        cancelButtonClass: 'btn btn-danger',
        confirmButtonText: 'Confirm',
        buttonsStyling: false
      }).then((result) => {
        if (result.value) {
          if (candidateId) {
            this.resendTestLink(candidateId);
          } else {
            this.resendTestLinkAll();
          }
        }
      })
  }
  
  getPathForCandidateTestReport(uuid) {
    return '../candidate/' + uuid;
  }

  resendTestLinkAll() {
    this.emailService.resendTestLink(this.testId, null).subscribe(
      data => {
        console.log('Email sent to all successfully!');
      }
    );
  }

  resendTestLink(candidateId: number) {
    this.emailService.resendTestLink(this.testId, candidateId).subscribe(
      data => {
        console.log('Email sent to the candidate successfully!');
      }
    );
  }

  downloadReport(test: any) {
    const testId = test['id'];
    if (this.testService.getIsSampleFlag()) {
      this.testService.downloadSampleTestReport(testId).subscribe(
        data => {
          this.saveReport(data, testId);
        }
      )
    } else {
      this.testService.downloadTestReport(testId).subscribe(
        data => {
          this.saveReport(data, testId);
        }
      )
    }
  }

  downloadCandidateTestReport(test: any, candidateId: number) {
    const testId = test['id'];
    if (this.testService.getIsSampleFlag()) {
      this.testService.downloadSampleCandidateTestReport(testId, candidateId).subscribe(
        data => {
          this.saveCandidateTestReport(data, testId, candidateId);
        }
      )
    } else {
      this.testService.downloadCandidateTestReport(testId, candidateId).subscribe(
        data => {
          this.saveCandidateTestReport(data, testId, candidateId);
        }
      )
    }
  }


  private saveReport(data: Blob, testId: any) {
    this._FileSaverService.save(data, 'test-' + testId + '.pdf');
  }

  private saveCandidateTestReport(data: Blob, testId: any, candidateId: number) {
    this._FileSaverService.save(data, 'test-' + testId + '-candidate-' + candidateId + '.pdf');
  }
}
