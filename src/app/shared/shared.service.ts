import { Injectable } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import * as moment from 'moment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  location: Location;
  
  constructor(location: Location, private router: Router) { 
    this.location = location;
  }

  getPath() {
    return this.location.prepareExternalUrl(this.location.path());
  }

  navigateTo(path) {
    this.router.navigate([path]);
  }

  convertSecondsToString(seconds) {
    let output = '';
    const days = Math.floor(seconds / (3600 * 24));
    output += this.append(days, 'Day(s) ')
    seconds -= days * 3600 * 24;
    const hrs = Math.floor(seconds / 3600);
    output += this.append(hrs, 'Hour(s) ')
    seconds  -= hrs * 3600;
    const mnts = Math.floor(seconds / 60);
    output += this.append(mnts, 'Minute(s)')
    return output;
  }

  public getLocalTime(time, responseIfInputInvalid?) {
    return time ? moment.utc(time).local().format('DD MMM, YYYY h:mm A') : responseIfInputInvalid;
  }

  private append(time, timeString) {
    if (time) {
      return time + ' ' + timeString;
    }
    return '';
  }
}
