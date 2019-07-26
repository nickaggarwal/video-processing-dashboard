import { Component, OnInit, AfterViewInit } from '@angular/core';
import { TableData } from '../md/md-table/md-table.component';
import { DashboardService } from './dashboard.service';
import swal from 'sweetalert2';
import { Candidate } from 'app/candidates/candidate.model';
declare const $: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})

export class DashboardComponent implements OnInit, AfterViewInit {
  file: File = null;
  videoLink: any;
  currentSetting: any;
  isAnySegmentSettingSelected = false;
  intervalDuration = 0;
  numSegments = 0;
  segmentSettings: any[] = [{
    id: 'interval-duration-option',
    name: 'Interval duration',
    displayName: 'Interval duration'
  }, {
    id: 'range-duration-option',
    name: 'Range duration',
    displayName:  'Range duration'
  }, {
    id: 'num-segments-option',
    name: 'Number of segments',
    displayName: 'Number of segments'
  }];
  rangeDurations: any[] = new Array();
  intervalVideos: any[];
  combineVideos: any[] = new Array();
  videoHeight: string;
  videoWidth: string;
  isValidCombineVideo = false;
  combinedVideo: string;

  constructor(private dashboardService: DashboardService) {
  }

  public alertFn(error) {
    console.log(error);
    if (error) {
      if (error.reason) {
        alert(error.reason);
      } else {
        alert(error);
      }
    }
  }

  public ngOnInit() {
    this.init()
  }

  segmentSettingChanged() {
    this.isAnySegmentSettingSelected = false;
  }

  intervalDurationChanged() {
    this.isAnySegmentSettingSelected = this.isValidNumber(this.intervalDuration);
  }

  addRangeDuration() {
    this.rangeDurations.push({
      'start': 0,
      'end': 0
    });
    this.rangeDurationChanged();
  }

  deleteRangeDuration(index) {
    this.rangeDurations.splice(index, 1);
    this.rangeDurationChanged();
  }

  rangeDurationChanged() {
    let validRangeDuration = true;
    if (this.rangeDurations && this.rangeDurations.length > 0) {
      for (let index = 0; index < this.rangeDurations.length; index++) {
        const rangeDuration = this.rangeDurations[index];
        const start = Number(rangeDuration.start);
        const end = Number(rangeDuration.end);
        if (!isNaN(start) && !isNaN(end)) {
          if (start >= 0 && end > start) {
            rangeDuration.start = start;
            rangeDuration.end = end;
          } else {
            validRangeDuration = false;
            break;
          }
        } else {
          validRangeDuration = false;
          break;
        }
      }
    } else {
      validRangeDuration = false;
    }
    this.isAnySegmentSettingSelected = validRangeDuration;
  }

  numSegmentsChanged() {
    this.isAnySegmentSettingSelected = this.isValidNumber(this.numSegments);
  }

  processVideo() {
    this.intervalVideos = [];
    if (this.currentSetting === 'Interval duration') {
      this.dashboardService.processIntervalDuration(this.videoLink, this.intervalDuration).subscribe(
        data => {
          this.processResponse(data);
        },
        err => {
          this.alertFn(err)
        }
      );
    }

    if (this.currentSetting === 'Range duration') {
      this.dashboardService.processRangeDuration(this.videoLink, this.rangeDurations).subscribe(
        data => {
          this.processResponse(data);
        },
        err => {
          this.alertFn(err)
        }
      );
    }

    if (this.currentSetting === 'Number of segments') {
      this.dashboardService.processNumberSegments(this.videoLink, this.numSegments).subscribe(
        data => {
          this.processResponse(data);
        },
        err => {
          this.alertFn(err)
        }
      );
    }
  }

  addVideoForCombining() {
    this.combineVideos.push({
      'video_url': '',
      'start': 0,
      'end': 0
    });
    this.validateCombineVideoParameters();
  }

  deleteCombineVideoRangeDuration(index) {
    this.combineVideos.splice(index, 1);
    this.validateCombineVideoParameters();
  }

  validateCombineVideoParameters() {
    let validVideoRangeDuration = true;
    if (this.combineVideos && this.combineVideos.length > 0) {
      for (let index = 0; index < this.combineVideos.length; index++) {
        const video = this.combineVideos[index];
        const start = Number(video.start);
        const end = Number(video.end);
        if (!isNaN(start) && !isNaN(end) && video.video_url) {
          if (start >= 0 && end > start) {
            video.start = start;
            video.end = end;
          } else {
            validVideoRangeDuration = false;
            break;
          }
        } else {
          validVideoRangeDuration = false;
          break;
        }
      }
    } else {
      validVideoRangeDuration = false;
    }

    this.isValidCombineVideo = validVideoRangeDuration && this.isValidNumber(this.videoHeight) && this.isValidNumber(this.videoWidth);
  }

  videoHeightChanged() {
    this.validateCombineVideoParameters();
  }

  videoWidthChanged() {
    this.validateCombineVideoParameters();
  }

  combineVideo() {
    this.combinedVideo = null;
    this.dashboardService.combineVideo(this.combineVideos, this.videoHeight, this.videoWidth).subscribe(
      data => {
        this.combinedVideo = data['video_url'];
      },
      err => {
        this.alertFn(err)
      }
    );
  }

  private processResponse(response) {
    this.intervalVideos = response['interval_videos'];
  }

  private isValidNumber(number) {
    number = Number(number);
    if (!isNaN(number) && number > 0) {
      return true;
    }
    return false;
  }

  public ngAfterViewInit() {
  }

  private init() {
  }
}
