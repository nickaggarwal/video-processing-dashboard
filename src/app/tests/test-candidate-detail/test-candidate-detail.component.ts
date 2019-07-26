import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { TestsService } from '../tests.service';
import { EmailService } from 'app/shared/email.service';
import { NotificationsComponent } from 'app/notifications/notifications.component';
import { SharedService } from '../../shared/shared.service';
import { FileSaverService } from 'ngx-filesaver';

@Component({
  selector: 'app-test-candidate-detail',
  templateUrl: './test-candidate-detail.component.html',
  styleUrls: ['./test-candidate-detail.component.scss']
})
export class TestCandidateDetailComponent implements OnInit {
  private uuid: Number;
  test: any = {};
  statuses = [
    {
      'id': 1,
      'description': 'In Queue',
      'class': 'badge badge-info'
    },
    {
      'id': 2,
      'description': 'Processing',
      'class': 'badge badge-info'
    },
    {
      'id': 3,
      'description': 'Accepted',
      'class': 'badge badge-success'
    },
    {
      'id': 4,
      'description': 'Wrong Answer',
      'class': 'badge badge-danger'
    },
    {
      'id': 5,
      'description': 'Time Limit Exceeded',
      'class': 'badge badge-warning'
    },
    {
      'id': 6,
      'description': 'Compilation Error',
      'class': 'badge badge-dark'
    },
    {
      'id': 7,
      'description': 'Runtime Error (SIGSEGV)',
      'class': 'badge badge-danger'
    },
    {
      'id': 8,
      'description': 'Runtime Error (SIGXFSZ)',
      'class': 'badge badge-danger'
    },
    {
      'id': 9,
      'description': 'Runtime Error (SIGFPE)',
      'class': 'badge badge-danger'
    },
    {
      'id': 10,
      'description': 'Runtime Error (SIGABRT)',
      'class': 'badge badge-danger'
    },
    {
      'id': 11,
      'description': 'Runtime Error (NZEC)',
      'class': 'badge badge-danger'
    },
    {
      'id': 12,
      'description': 'Runtime Error (Other)'
    },
    {
      'id': 13,
      'description': 'Internal Error'
    }
  ];

  constructor(private route: ActivatedRoute, private router: Router, private testService: TestsService, private sharedService: SharedService,
    private emailService: EmailService, private notificationComponent: NotificationsComponent, 
    private _FileSaverService: FileSaverService) { 
      this.router.events.subscribe((_: NavigationEnd) => {
        if (_.url) {
          this.testService.setIsSampleFlag(_.url);
        }
      });
    }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.uuid = params['id'];
      if (this.testService.getIsSampleFlag()) {
        this.testService.getSampleCandidateTestSubmissionDetails(this.uuid).subscribe(
          data => {
            this.transformTestCandidateDetail(data);
          }
        );
      } else {
        this.testService.getCandidateTestSubmissionDetails(this.uuid).subscribe(
          data => {
            this.transformTestCandidateDetail(data);
          }
        );
      }
    });
  }

  public getTestStatusClass(status) {
    return 'badge badge-large-xs ' + (status === 'Active' ? 'badge-info' : (status === 'Completed' ? 'badge-success' : 'badge-success'));
  }

  public getSubmissionValue(submission) {
    return submission.id + ' | ' + this.sharedService.getLocalTime(submission.created_at)
  }

  public onSubmissionChange($event, question) {
    question['selectedSubmission']['metadata'] = this.getMetadata($event.value, question);
  }

  public downloadReport(question) {
    const selectedSubmissionId = question['selectedSubmission'].id;
    if (this.testService.getIsSampleFlag()) {
      this.testService.downloadSampleReport(selectedSubmissionId, this.uuid).subscribe(
        data => {
            this.saveSubmissionReport(data, selectedSubmissionId);
        }
      )
    } else {
      this.testService.downloadReport(selectedSubmissionId, this.uuid).subscribe(
        data => {
          this.saveSubmissionReport(data, selectedSubmissionId);
        }
      )
    }
  }

  private saveSubmissionReport(data: Blob, selectedSubmissionId: any) {
    this._FileSaverService.save(data, 'submission_' + selectedSubmissionId + '.pdf');
  }

  private getMetadata(submission, question) {
    const questionType = question['type'];
    if (questionType === 'DS_ALGO') {
      if (submission) {
        this.testService.getCandidateProgrammingTestSubmissionMetadata(submission.id).subscribe(
          data => {
              let testCases = data['results'];
              let aggregatedResultMap = new Map<number, object>();
              let aggregatedResult = [];
              if (testCases) {
                testCases.forEach(testCase => {
                  const statusId = testCase['status'];
                  const status = this.statuses.find(x => x.id === statusId);
                  if (aggregatedResultMap[statusId]) {
                    aggregatedResultMap[statusId]['count']++;
                  } else {
                    aggregatedResultMap[statusId] = {
                      'count': 1,
                      'name': status['description'],
                      'class': status['class']
                    }
                  }
                  testCase['status'] = status['description'];
                  testCase['class'] = status['class'];
                });
                aggregatedResultMap.forEach((result, statusId) => {
                  aggregatedResult.push(result);
                });
                submission['programmingMetadata'] = aggregatedResult;
                submission['programmingTestCases'] = testCases;
              }
          }
        );
      } else {
        submission = {};
        submission['programmingMetadata'] = {};
        submission['programmingTestCases'] = [];
      }
    } else {
      if (submission) {
        this.testService.getCandidateTestSubmissionMetadata(submission.id).subscribe(
          data => {
              let testCases = data['run']['result_metadata'];
              testCases = testCases ? JSON.parse(testCases) : [];
              submission['testCases'] = testCases;
              let metrics = data['metrics'] 
              metrics = metrics ? metrics['component']['measures'] : undefined;
              submission['metrics'] = metrics;
          }
        );
      } else {
        submission = {};
        submission['testCases'] = [];
        submission['metrics'] = {};
      }
    }
    
    return submission;
  }

  private transformTestCandidateDetail(data: ArrayBuffer) {
    data = this.testService.transformTest(data);
    for (let idx = 0; idx < data['questions'].length; idx++) {
      const question = data['questions'][idx];
      question['selectedSubmission'] = {
        'metadata': {}
      };
      if (question['submissions'] && question['submissions'].length > 0) {
        const selectedSubmission = question['submissions'][0];
        selectedSubmission['metadata'] = this.getMetadata(selectedSubmission, question);
        question['selectedSubmission'] = selectedSubmission;
      }
    }
    this.test = data;
  }
}
